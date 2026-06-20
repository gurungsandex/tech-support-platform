-- Fix: "infinite recursion detected in policy for relation profiles"
--
-- The admin-check policies added in 002_rls_policies.sql evaluate
--   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
-- directly inside a policy ON profiles. Selecting from profiles re-triggers
-- profiles' own RLS policies (including this one), causing Postgres to
-- recurse until it errors out. This broke every read of profiles for
-- every user (not just admins), which in turn broke the post-registration
-- redirect into /professional/dashboard (and /user/dashboard, /admin/dashboard):
-- the profile lookup failed, the page redirected back to /login, and
-- middleware immediately redirected the authenticated user back to the
-- dashboard, producing an infinite redirect loop / blank page.
--
-- Fix: move the admin check into a SECURITY DEFINER function. Functions
-- marked SECURITY DEFINER run with the privileges of their owner and are
-- not subject to the RLS policies of the calling role, so the lookup
-- inside the function does not re-enter profiles' own policies.

CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = uid AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION current_profile_role(uid UUID)
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (is_admin(auth.uid()));

-- 006_fix_role_escalation.sql's WITH CHECK also queried profiles directly
-- from within a profiles policy (same recursion bug). Route it through the
-- SECURITY DEFINER helper instead.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = current_profile_role(auth.uid())
    );
