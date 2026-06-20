-- Bug: a technician's "completed jobs" stat (it_professional_profiles.
-- completed_requests, shown on their dashboard and on the public profile's
-- "TOP RATED" badge threshold) never increased. markJobComplete()
-- (lib/conversations/actions.ts) only flips conversations.status to
-- 'completed' — nothing increments completed_requests. The legacy
-- support_requests code path even has a comment assuming "a database
-- trigger" handles this, but no such trigger was ever created.
--
-- SECURITY DEFINER: this update targets a profile other than the caller's
-- own row in the conversations case (job_completed_by is usually the
-- technician, but the increment must apply to technician_id specifically
-- and survive RLS the same way the rating trigger does).
CREATE OR REPLACE FUNCTION increment_completed_requests()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
        UPDATE it_professional_profiles
        SET completed_requests = completed_requests + 1
        WHERE user_id = NEW.technician_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_conversation_job_completed
    AFTER UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION increment_completed_requests();
