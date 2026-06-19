-- Security fix: prevent users from escalating their own role
--
-- Problem 1: "Users can update own profile" (002_rls_policies.sql) has no
-- WITH CHECK, so any authenticated user can run
--   UPDATE profiles SET role = 'admin' WHERE id = auth.uid()
-- and grant themselves admin access.
--
-- Problem 2: create_profile_on_signup() (001_initial_schema.sql) trusts the
-- client-supplied `role` field in auth user metadata, so a caller of
-- supabase.auth.signUp() can pass role: 'admin' directly and become an
-- admin on signup with no verification at all.

-- Fix 1: lock down self-service profile updates to never change `role`.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM profiles WHERE id = auth.uid())
    );

-- Fix 2: never honor a client-supplied 'admin' role at signup. Self-service
-- signup may only create 'end_user' or 'it_professional' accounts; any other
-- value (including 'admin') falls back to 'end_user'. Promotion to 'admin'
-- must happen through a privileged, non-self-service path (e.g. direct DB
-- update by an existing admin or operator).
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    requested_role user_role;
BEGIN
    requested_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'end_user');

    IF requested_role NOT IN ('end_user', 'it_professional') THEN
        requested_role := 'end_user';
    END IF;

    INSERT INTO profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        requested_role
    );

    IF requested_role = 'it_professional' THEN
        INSERT INTO it_professional_profiles (user_id, specialization, years_of_experience)
        VALUES (
            NEW.id,
            COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'specialization')), '{}'),
            COALESCE((NEW.raw_user_meta_data->>'years_of_experience')::INTEGER, 0)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
