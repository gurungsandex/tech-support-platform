-- Fix: remaining "infinite recursion detected in policy for relation profiles"
--
-- 008_fix_profiles_rls_recursion.sql fixed profiles' own self-referencing
-- admin policy, but profiles also has a SELECT policy
-- ("Anyone can read approved technician profiles") that queries
-- it_professional_profiles. it_professional_profiles, in turn, has admin
-- policies that query profiles directly (EXISTS (SELECT 1 FROM profiles
-- WHERE ... role = 'admin')). That makes the two tables' RLS mutually
-- recursive: reading profiles -> checks it_professional_profiles ->
-- checks profiles -> checks it_professional_profiles -> ... until Postgres
-- aborts with 42P17.
--
-- Route every remaining "is this user an admin" policy through the
-- SECURITY DEFINER is_admin() helper (added in 008), which is not subject
-- to RLS and therefore can't re-enter this cycle.

DROP POLICY IF EXISTS "Admins can read all IT professional profiles" ON it_professional_profiles;
CREATE POLICY "Admins can read all IT professional profiles"
    ON it_professional_profiles FOR SELECT
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update IT professional profiles" ON it_professional_profiles;
CREATE POLICY "Admins can update IT professional profiles"
    ON it_professional_profiles FOR UPDATE
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can read all activity logs" ON activity_logs;
CREATE POLICY "Admins can read all activity logs"
    ON activity_logs FOR SELECT
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all conversations" ON conversations;
CREATE POLICY "Admins can view all conversations"
    ON conversations FOR SELECT
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update reports" ON reports;
CREATE POLICY "Admins can update reports"
    ON reports FOR UPDATE
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can read all reports" ON reports;
CREATE POLICY "Admins can read all reports"
    ON reports FOR SELECT
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can read all requests" ON support_requests;
CREATE POLICY "Admins can read all requests"
    ON support_requests FOR SELECT
    USING (is_admin(auth.uid()));
