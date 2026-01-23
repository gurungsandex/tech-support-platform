-- Tech Support Platform - Seed Data
-- This migration creates sample data for development and testing
-- Note: In production, you should remove this migration or create users through the auth system

-- Note: This seed data assumes you'll create actual auth users first
-- For development, you can manually create test users in Supabase Auth dashboard
-- and update the UUIDs below to match those users

-- Sample data structure (commented out - requires actual auth.users)
-- You'll need to:
-- 1. Create users in Supabase Auth dashboard or via sign up
-- 2. Get their UUIDs
-- 3. The profiles will be auto-created by the trigger
-- 4. Then you can create sample requests, messages, etc.

/*
-- Example: Insert sample support requests (after creating auth users)
-- Replace the UUIDs with actual user IDs from your auth.users table

INSERT INTO support_requests (requester_id, title, description, category, urgency, status, contact_email, contact_phone)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Laptop not connecting to WiFi', 'My laptop suddenly stopped connecting to the office WiFi. I tried restarting but it still doesn''t work. Urgent as I need it for a presentation tomorrow.', 'Network', 'high', 'open', 'user1@example.com', '+1234567890'),
    ('00000000-0000-0000-0000-000000000001', 'Software installation help needed', 'Need help installing and configuring development tools on my new machine.', 'Software', 'medium', 'open', 'user1@example.com', '+1234567890'),
    ('00000000-0000-0000-0000-000000000002', 'Computer running very slow', 'My computer has been running extremely slow for the past week. Programs take forever to open.', 'Hardware', 'medium', 'accepted', 'user2@example.com', '+1234567891'),
    ('00000000-0000-0000-0000-000000000002', 'Email account locked', 'I can''t access my work email. It says my account has been locked.', 'Security', 'critical', 'completed', 'user2@example.com', '+1234567891'),
    ('00000000-0000-0000-0000-000000000001', 'Printer setup assistance', 'Need help setting up a new network printer in the office.', 'Hardware', 'low', 'open', 'user1@example.com', '+1234567890');

-- Example: Sample messages for completed request
-- INSERT INTO messages (request_id, sender_id, content, is_read)
-- VALUES
--     ((SELECT id FROM support_requests WHERE title = 'Email account locked'), '00000000-0000-0000-0000-000000000002', 'Hi, I really need help with this urgently!', true),
--     ((SELECT id FROM support_requests WHERE title = 'Email account locked'), '00000000-0000-0000-0000-000000000003', 'Hello! I can help you with this. Let me check your account.', true);

-- Example: Sample review
-- INSERT INTO reviews (request_id, professional_id, reviewer_id, rating, comment)
-- VALUES
--     ((SELECT id FROM support_requests WHERE title = 'Email account locked'), '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 5, 'Excellent service! Resolved my issue quickly and professionally.');
*/

-- Insert sample categories for reference
COMMENT ON TABLE support_requests IS 'Support request categories: Hardware, Software, Network, Security, Other';
