-- ============================================================
-- Tech Support Platform - RLS Policies for new tables
-- ============================================================

-- Enable RLS
ALTER TABLE technician_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TECHNICIAN SERVICES
-- ============================================================

-- Anyone can view services for approved technicians
CREATE POLICY "Anyone can view technician services"
    ON technician_services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM it_professional_profiles tp
            WHERE tp.user_id = technician_services.technician_id
            AND tp.verification_status = 'approved'
        )
        OR technician_id = auth.uid()
    );

-- Technicians can manage their own services
CREATE POLICY "Technicians can insert own services"
    ON technician_services FOR INSERT
    WITH CHECK (technician_id = auth.uid());

CREATE POLICY "Technicians can update own services"
    ON technician_services FOR UPDATE
    USING (technician_id = auth.uid());

CREATE POLICY "Technicians can delete own services"
    ON technician_services FOR DELETE
    USING (technician_id = auth.uid());

-- ============================================================
-- TECHNICIAN CERTIFICATIONS
-- ============================================================

CREATE POLICY "Anyone can view certifications for approved technicians"
    ON technician_certifications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM it_professional_profiles tp
            WHERE tp.user_id = technician_certifications.technician_id
            AND tp.verification_status = 'approved'
        )
        OR technician_id = auth.uid()
    );

CREATE POLICY "Technicians can insert own certifications"
    ON technician_certifications FOR INSERT
    WITH CHECK (technician_id = auth.uid());

CREATE POLICY "Technicians can update own certifications"
    ON technician_certifications FOR UPDATE
    USING (technician_id = auth.uid());

CREATE POLICY "Technicians can delete own certifications"
    ON technician_certifications FOR DELETE
    USING (technician_id = auth.uid());

-- ============================================================
-- TECHNICIAN PORTFOLIO
-- ============================================================

CREATE POLICY "Anyone can view portfolio for approved technicians"
    ON technician_portfolio FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM it_professional_profiles tp
            WHERE tp.user_id = technician_portfolio.technician_id
            AND tp.verification_status = 'approved'
        )
        OR technician_id = auth.uid()
    );

CREATE POLICY "Technicians can insert own portfolio"
    ON technician_portfolio FOR INSERT
    WITH CHECK (technician_id = auth.uid());

CREATE POLICY "Technicians can update own portfolio"
    ON technician_portfolio FOR UPDATE
    USING (technician_id = auth.uid());

CREATE POLICY "Technicians can delete own portfolio"
    ON technician_portfolio FOR DELETE
    USING (technician_id = auth.uid());

-- ============================================================
-- CONVERSATIONS
-- ============================================================

-- Users and technicians can see their own conversations
CREATE POLICY "Participants can view their conversations"
    ON conversations FOR SELECT
    USING (user_id = auth.uid() OR technician_id = auth.uid());

-- Authenticated users can start conversations
CREATE POLICY "Users can start conversations"
    ON conversations FOR INSERT
    WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

-- Participants can update conversation status (e.g., mark as completed)
CREATE POLICY "Participants can update conversations"
    ON conversations FOR UPDATE
    USING (user_id = auth.uid() OR technician_id = auth.uid());

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================
-- CONVERSATION MESSAGES
-- ============================================================

-- Participants can view messages in their conversations
CREATE POLICY "Participants can view conversation messages"
    ON conversation_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_messages.conversation_id
            AND (c.user_id = auth.uid() OR c.technician_id = auth.uid())
        )
    );

-- Participants can send messages
CREATE POLICY "Participants can send messages"
    ON conversation_messages FOR INSERT
    WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_id
            AND (c.user_id = auth.uid() OR c.technician_id = auth.uid())
            AND c.status = 'active'
        )
    );

-- Participants can mark messages as read
CREATE POLICY "Participants can mark messages as read"
    ON conversation_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE c.id = conversation_messages.conversation_id
            AND (c.user_id = auth.uid() OR c.technician_id = auth.uid())
        )
    );

-- ============================================================
-- UPDATE PROFILES POLICY - allow public read for technician profiles
-- ============================================================

-- Allow anyone to read profiles of approved technicians (for public directory)
CREATE POLICY "Anyone can read approved technician profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM it_professional_profiles tp
            WHERE tp.user_id = profiles.id
            AND tp.verification_status = 'approved'
        )
    );
