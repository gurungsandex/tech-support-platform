-- Bug: submitting a review never updated the technician's average_rating /
-- total_reviews. calculate_professional_rating() (001_initial_schema.sql)
-- runs as a plain (SECURITY INVOKER) trigger function, so its
-- UPDATE it_professional_profiles ... runs as the reviewer's role and is
-- itself subject to it_professional_profiles' RLS policies. The reviewer is
-- neither the technician (user_id = auth.uid()) nor an admin, so every
-- policy's USING clause evaluates false, the UPDATE silently matches zero
-- rows, and the aggregate fields never change.
--
-- Mark the function SECURITY DEFINER so the aggregate update runs with the
-- privileges of its owner and isn't subject to the caller's RLS.
CREATE OR REPLACE FUNCTION calculate_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE it_professional_profiles
    SET
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM reviews
            WHERE professional_id = NEW.professional_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE professional_id = NEW.professional_id
        )
    WHERE user_id = NEW.professional_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
