-- Bug: technicians could not see the name/avatar of the end user who
-- messaged them (and vice versa). getMyConversations() embeds the other
-- participant's profile via a PostgREST join, but profiles' RLS only
-- allows reading your own profile, an admin reading anyone's, or anyone
-- reading an *approved technician's* profile. An end_user's profile isn't
-- covered by any of those, so the embedded "user" came back null and the
-- UI fell back to showing "Customer" / "?".
--
-- Grant visibility between two profiles only when they are the user_id and
-- technician_id of an existing conversation between them.
CREATE POLICY "Conversation participants can read each other's profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM conversations c
            WHERE (c.user_id = auth.uid() AND c.technician_id = profiles.id)
               OR (c.technician_id = auth.uid() AND c.user_id = profiles.id)
        )
    );
