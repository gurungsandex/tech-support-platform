-- ============================================================
-- Service Categories
-- Replaces free-text category matching (LIKE on service_name)
-- with a real enum column so search filters are reliable.
-- ============================================================

CREATE TYPE service_category AS ENUM (
  'Networking', 'Hardware', 'Software', 'Security',
  'Cybersecurity', 'Cloud', 'Data Recovery', 'Printers'
);

ALTER TABLE technician_services
  ADD COLUMN IF NOT EXISTS category service_category;

-- Backfill existing rows from their service_name
UPDATE technician_services SET category = CASE
  WHEN service_name IN ('Internet connectivity troubleshooting', 'Ethernet wiring', 'Network troubleshooting')
    THEN 'Networking'::service_category
  WHEN service_name IN ('Computer setup', 'Laptop troubleshooting', 'Scanner setup', 'Smart TV setup',
    'Projector setup', 'Home office setup', 'Smart home device setup')
    THEN 'Hardware'::service_category
  WHEN service_name IN ('Software installation and configuration', 'Remote desktop support',
    'Email setup and troubleshooting', 'General IT support', 'Small business IT support')
    THEN 'Software'::service_category
  WHEN service_name = 'Security camera setup'
    THEN 'Security'::service_category
  WHEN service_name = 'Virus and malware removal'
    THEN 'Cybersecurity'::service_category
  WHEN service_name = 'Cloud storage setup'
    THEN 'Cloud'::service_category
  WHEN service_name = 'Data backup and recovery'
    THEN 'Data Recovery'::service_category
  WHEN service_name = 'Printer setup and troubleshooting'
    THEN 'Printers'::service_category
  ELSE 'Software'::service_category -- best-effort default for old custom entries
END
WHERE category IS NULL;

ALTER TABLE technician_services
  ALTER COLUMN category SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_technician_services_category ON technician_services(category);

-- Replace search_technicians to filter by category (exact match) in addition
-- to the existing free-text service_filter (used by the search box).
DROP FUNCTION IF EXISTS search_technicians(DECIMAL, DECIMAL, INTEGER, TEXT, TEXT, DECIMAL);

CREATE OR REPLACE FUNCTION search_technicians(
    search_lat DECIMAL DEFAULT NULL,
    search_lng DECIMAL DEFAULT NULL,
    radius_miles INTEGER DEFAULT 25,
    service_filter TEXT DEFAULT NULL,
    support_type_filter TEXT DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL,
    category_filter service_category[] DEFAULT NULL
)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    tagline TEXT,
    bio TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    service_radius_miles INTEGER,
    support_type TEXT,
    availability_status TEXT,
    phone_visibility TEXT,
    email_visibility TEXT,
    phone_number TEXT,
    average_rating DECIMAL,
    total_reviews INTEGER,
    completed_requests INTEGER,
    years_of_experience INTEGER,
    verification_status TEXT,
    profile_photo_url TEXT,
    distance_miles DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS user_id,
        p.full_name,
        p.email,
        p.avatar_url,
        tp.tagline,
        tp.bio,
        tp.city,
        tp.state,
        tp.zip_code,
        tp.latitude,
        tp.longitude,
        tp.service_radius_miles,
        tp.support_type::TEXT,
        tp.availability_status::TEXT,
        tp.phone_visibility::TEXT,
        tp.email_visibility::TEXT,
        tp.phone_number,
        tp.average_rating,
        tp.total_reviews,
        tp.completed_requests,
        tp.years_of_experience,
        tp.verification_status::TEXT,
        tp.profile_photo_url,
        CASE
            WHEN search_lat IS NOT NULL AND search_lng IS NOT NULL AND tp.latitude IS NOT NULL AND tp.longitude IS NOT NULL
            THEN haversine_distance(search_lat, search_lng, tp.latitude, tp.longitude)
            ELSE NULL
        END AS distance_miles
    FROM it_professional_profiles tp
    JOIN profiles p ON p.id = tp.user_id
    WHERE
        tp.verification_status = 'approved'
        AND tp.is_paused = FALSE
        AND p.is_banned = FALSE
        AND (
            search_lat IS NULL OR search_lng IS NULL OR tp.latitude IS NULL OR tp.longitude IS NULL
            OR haversine_distance(search_lat, search_lng, tp.latitude, tp.longitude) <= radius_miles
        )
        AND (
            support_type_filter IS NULL
            OR tp.support_type::TEXT = support_type_filter
            OR tp.support_type = 'both'
        )
        AND (
            min_rating IS NULL OR tp.average_rating >= min_rating
        )
        AND (
            service_filter IS NULL
            OR EXISTS (
                SELECT 1 FROM technician_services ts
                WHERE ts.technician_id = p.id
                AND lower(ts.service_name) LIKE lower('%' || service_filter || '%')
            )
        )
        AND (
            category_filter IS NULL
            OR EXISTS (
                SELECT 1 FROM technician_services ts
                WHERE ts.technician_id = p.id
                AND ts.category = ANY(category_filter)
            )
        )
    ORDER BY
        CASE
            WHEN search_lat IS NOT NULL AND search_lng IS NOT NULL AND tp.latitude IS NOT NULL AND tp.longitude IS NOT NULL
            THEN haversine_distance(search_lat, search_lng, tp.latitude, tp.longitude)
            ELSE tp.average_rating * -1
        END ASC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
