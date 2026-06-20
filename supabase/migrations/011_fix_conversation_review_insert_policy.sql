-- Bug: leaving a review from a completed conversation always failed (RLS
-- silently rejected the insert, and the UI had nowhere to show the error
-- since the input/error area is hidden once a conversation is completed).
--
-- "Requesters can create reviews" (002_rls_policies.sql) only ever checked
-- the legacy support_requests path. 004_platform_overhaul.sql added
-- reviews.conversation_id and made request_id nullable for the new
-- technician-conversation flow, but never extended this policy to allow
-- conversation_id-based reviews — so every review submitted via
-- submitConversationReview() (lib/conversations/actions.ts) violated the
-- WITH CHECK clause (request_id was NULL, which never matches a support
-- request) and got rejected.
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
            ))
        )
    );
