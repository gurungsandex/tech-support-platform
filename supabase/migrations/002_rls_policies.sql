-- Tech Support Platform - Row Level Security Policies
-- This migration sets up comprehensive RLS policies for all tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE it_professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES POLICIES
-- =====================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================
-- IT PROFESSIONAL PROFILES POLICIES
-- =====================

-- Anyone can read approved professional profiles
CREATE POLICY "Anyone can read approved professional profiles"
    ON it_professional_profiles FOR SELECT
    USING (verification_status = 'approved');

-- IT professionals can read their own profile regardless of status
CREATE POLICY "IT professionals can read own profile"
    ON it_professional_profiles FOR SELECT
    USING (user_id = auth.uid());

-- IT professionals can update their own profile
CREATE POLICY "IT professionals can update own profile"
    ON it_professional_profiles FOR UPDATE
    USING (user_id = auth.uid());

-- Admins can read all IT professional profiles
CREATE POLICY "Admins can read all IT professional profiles"
    ON it_professional_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update verification status
CREATE POLICY "Admins can update IT professional profiles"
    ON it_professional_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================
-- SUPPORT REQUESTS POLICIES
-- =====================

-- Requesters can create their own requests
CREATE POLICY "Requesters can create requests"
    ON support_requests FOR INSERT
    WITH CHECK (requester_id = auth.uid());

-- Requesters can read their own requests with full details
CREATE POLICY "Requesters can read own requests"
    ON support_requests FOR SELECT
    USING (requester_id = auth.uid());

-- Requesters can update their own requests (e.g., cancel)
CREATE POLICY "Requesters can update own requests"
    ON support_requests FOR UPDATE
    USING (requester_id = auth.uid());

-- Requesters can delete their own open requests
CREATE POLICY "Requesters can delete own open requests"
    ON support_requests FOR DELETE
    USING (requester_id = auth.uid() AND status = 'open');

-- IT professionals can read open requests (anonymized)
CREATE POLICY "IT professionals can read open requests"
    ON support_requests FOR SELECT
    USING (
        status = 'open' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'it_professional'
        )
    );

-- IT professionals can read requests they've accepted (full details)
CREATE POLICY "IT professionals can read accepted requests"
    ON support_requests FOR SELECT
    USING (professional_id = auth.uid());

-- IT professionals can update requests they've accepted
CREATE POLICY "IT professionals can update accepted requests"
    ON support_requests FOR UPDATE
    USING (professional_id = auth.uid());

-- Admins can read all requests
CREATE POLICY "Admins can read all requests"
    ON support_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================
-- MESSAGES POLICIES
-- =====================

-- Users can read messages from their requests (as requester or professional)
CREATE POLICY "Users can read messages from their requests"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM support_requests sr
            WHERE sr.id = messages.request_id
            AND (sr.requester_id = auth.uid() OR sr.professional_id = auth.uid())
        )
    );

-- Users can insert messages to their requests
CREATE POLICY "Users can insert messages to their requests"
    ON messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM support_requests sr
            WHERE sr.id = request_id
            AND (sr.requester_id = auth.uid() OR sr.professional_id = auth.uid())
        )
    );

-- Users can update read status of messages sent to them
CREATE POLICY "Users can update message read status"
    ON messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM support_requests sr
            WHERE sr.id = messages.request_id
            AND (sr.requester_id = auth.uid() OR sr.professional_id = auth.uid())
        )
    );

-- =====================
-- REVIEWS POLICIES
-- =====================

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
    ON reviews FOR SELECT
    USING (true);

-- Requesters can create one review per completed request
CREATE POLICY "Requesters can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (
        reviewer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM support_requests sr
            WHERE sr.id = request_id
            AND sr.requester_id = auth.uid()
            AND sr.status = 'completed'
        )
    );

-- Reviews cannot be updated
-- Reviews cannot be deleted by users

-- =====================
-- REPORTS POLICIES
-- =====================

-- Users can create reports
CREATE POLICY "Users can create reports"
    ON reports FOR INSERT
    WITH CHECK (reporter_id = auth.uid());

-- Users can read their own reports
CREATE POLICY "Users can read own reports"
    ON reports FOR SELECT
    USING (reporter_id = auth.uid());

-- Admins can read all reports
CREATE POLICY "Admins can read all reports"
    ON reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update reports
CREATE POLICY "Admins can update reports"
    ON reports FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================
-- ACTIVITY LOGS POLICIES
-- =====================

-- Users can read their own activity logs
CREATE POLICY "Users can read own activity logs"
    ON activity_logs FOR SELECT
    USING (user_id = auth.uid());

-- Admins can read all activity logs
CREATE POLICY "Admins can read all activity logs"
    ON activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
    ON activity_logs FOR INSERT
    WITH CHECK (true);

-- No public updates allowed on activity logs
