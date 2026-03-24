-- ============================================================
-- Tech Support Platform - Platform Overhaul Migration
-- Transforms platform from ticketing system to technician directory
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================
CREATE TYPE availability_status AS ENUM ('online', 'offline');
CREATE TYPE support_type AS ENUM ('remote', 'onsite', 'both');
CREATE TYPE contact_visibility AS ENUM ('public', 'registered', 'hidden');
CREATE TYPE conversation_status AS ENUM ('active', 'completed', 'archived');

-- ============================================================
-- 2. EXTEND it_professional_profiles
-- ============================================================
ALTER TABLE it_professional_profiles
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS tagline TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS zip_code TEXT,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS service_radius_miles INTEGER DEFAULT 25,
  ADD COLUMN IF NOT EXISTS support_type support_type DEFAULT 'both',
  ADD COLUMN IF NOT EXISTS availability_status availability_status DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS phone_visibility contact_visibility DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS email_visibility contact_visibility DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS hourly_rate_min INTEGER,
  ADD COLUMN IF NOT EXISTS hourly_rate_max INTEGER;

-- ============================================================
-- 3. TECHNICIAN SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS technician_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    price_min INTEGER,
    price_max INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_price CHECK (price_min IS NULL OR price_max IS NULL OR price_min <= price_max)
);

CREATE INDEX idx_technician_services_technician_id ON technician_services(technician_id);

-- ============================================================
-- 4. TECHNICIAN CERTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS technician_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT,
    issued_date DATE,
    expiry_date DATE,
    verification_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_technician_certifications_technician_id ON technician_certifications(technician_id);

-- ============================================================
-- 5. TECHNICIAN PORTFOLIO
-- ============================================================
CREATE TABLE IF NOT EXISTS technician_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_technician_portfolio_technician_id ON technician_portfolio(technician_id);

-- ============================================================
-- 6. CONVERSATIONS (direct user <-> technician messaging)
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status conversation_status DEFAULT 'active',
    job_completed_at TIMESTAMPTZ,
    job_completed_by UUID REFERENCES profiles(id),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_technician_id ON conversations(technician_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- ============================================================
-- 7. CONVERSATION MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (length(content) <= 2000),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversation_messages_conversation_id ON conversation_messages(conversation_id, created_at);
CREATE INDEX idx_conversation_messages_sender_id ON conversation_messages(sender_id);

-- ============================================================
-- 8. UPDATE REVIEWS TABLE - support conversation-based reviews
-- ============================================================
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE;

-- Make request_id optional (for conversation-based reviews)
ALTER TABLE reviews ALTER COLUMN request_id DROP NOT NULL;

-- ============================================================
-- 9. UPDATE PROFILES - add phone_number and avatar
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS is_verified_phone BOOLEAN DEFAULT FALSE;

-- ============================================================
-- 10. TRIGGERS
-- ============================================================

-- Update conversations.updated_at
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update conversations.last_message_at when message inserted
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NOW(), updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_conversation_message_insert
    AFTER INSERT ON conversation_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- 11. HAVERSINE DISTANCE FUNCTION (for location-based search)
-- ============================================================
CREATE OR REPLACE FUNCTION haversine_distance(
    lat1 DECIMAL, lng1 DECIMAL,
    lat2 DECIMAL, lng2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    r DECIMAL := 3959; -- Earth radius in miles
    dlat DECIMAL;
    dlng DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := radians(lat2 - lat1);
    dlng := radians(lng2 - lng1);
    a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng/2)^2;
    c := 2 * asin(sqrt(a));
    RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 12. SEARCH TECHNICIANS FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION search_technicians(
    search_lat DECIMAL DEFAULT NULL,
    search_lng DECIMAL DEFAULT NULL,
    radius_miles INTEGER DEFAULT 25,
    service_filter TEXT DEFAULT NULL,
    support_type_filter TEXT DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL
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
            -- Location filter: if lat/lng provided, filter by distance
            search_lat IS NULL OR search_lng IS NULL OR tp.latitude IS NULL OR tp.longitude IS NULL
            OR haversine_distance(search_lat, search_lng, tp.latitude, tp.longitude) <= radius_miles
        )
        AND (
            -- Support type filter
            support_type_filter IS NULL
            OR tp.support_type::TEXT = support_type_filter
            OR tp.support_type = 'both'
        )
        AND (
            -- Minimum rating filter
            min_rating IS NULL OR tp.average_rating >= min_rating
        )
        AND (
            -- Service filter: check if technician offers this service
            service_filter IS NULL
            OR EXISTS (
                SELECT 1 FROM technician_services ts
                WHERE ts.technician_id = p.id
                AND lower(ts.service_name) LIKE lower('%' || service_filter || '%')
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

-- ============================================================
-- 13. INDEXES for geo-search performance
-- ============================================================
CREATE INDEX idx_it_professional_profiles_location ON it_professional_profiles(latitude, longitude);
CREATE INDEX idx_it_professional_profiles_availability ON it_professional_profiles(availability_status, is_paused);
CREATE INDEX idx_it_professional_profiles_support_type ON it_professional_profiles(support_type);
CREATE INDEX idx_it_professional_profiles_rating ON it_professional_profiles(average_rating DESC);
