-- Security fix 1: the conversation-based branch of the reviews INSERT
-- policy (011_fix_conversation_review_insert_policy.sql) checks that the
-- caller owns a completed conversation, but never checks that the review's
-- professional_id actually matches that conversation's technician_id.
-- An attacker with one completed conversation against technician A could
-- insert a review naming an unrelated technician B as professional_id,
-- and the SECURITY DEFINER calculate_professional_rating() trigger would
-- blindly apply it to B's public average_rating/total_reviews.
DROP POLICY IF EXISTS "Requesters can create reviews" ON reviews;

CREATE POLICY "Requesters can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (
        reviewer_id = auth.uid()
        AND (
            (request_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM support_requests sr
                WHERE sr.id = reviews.request_id
                AND sr.requester_id = auth.uid()
                AND sr.status = 'completed'
            ))
            OR
            (conversation_id IS NOT NULL AND EXISTS (
                SELECT 1 FROM conversations c
                WHERE c.id = reviews.conversation_id
                AND c.user_id = auth.uid()
                AND c.status = 'completed'
                AND c.technician_id = reviews.professional_id
            ))
        )
    );

-- Security fix 2: conversations.technician_id was never required to
-- reference an approved IT professional — the INSERT policy only checked
-- user_id = auth.uid(). Combined with the new "conversation participants
-- can read each other's profiles" policy (010), this let any authenticated
-- user create a conversation naming an arbitrary profile id (another
-- end_user, a pending/rejected technician, or an admin) as technician_id,
-- which would then grant the attacker RLS read access to that victim's
-- full profile row (email, phone_number) via the 010 policy — profiles
-- that were never meant to be readable by arbitrary users.
--
-- Enforce the approved-technician requirement at the database level so it
-- can't be bypassed by calling the insert directly instead of through
-- getOrCreateConversation()'s application-level check.
DROP POLICY IF EXISTS "Users can start conversations" ON conversations;

CREATE POLICY "Users can start conversations"
    ON conversations FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND user_id <> technician_id
        AND EXISTS (
            SELECT 1 FROM it_professional_profiles tp
            WHERE tp.user_id = conversations.technician_id
            AND tp.verification_status = 'approved'
        )
    );
