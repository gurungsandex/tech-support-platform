// Database type definitions for type-safe Supabase queries

export type UserRole = 'end_user' | 'it_professional' | 'admin'
export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type RequestUrgency = 'low' | 'medium' | 'high' | 'critical'
export type RequestStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
export type AvailabilityStatus = 'online' | 'offline'
export type SupportType = 'remote' | 'onsite' | 'both'
export type ContactVisibility = 'public' | 'registered' | 'hidden'
export type ConversationStatus = 'active' | 'completed' | 'archived'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone_number: string | null
  avatar_url: string | null
  is_verified_phone: boolean
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface ITProfessionalProfile {
  id: string
  user_id: string
  specialization: string[]
  years_of_experience: number
  certifications: string[]
  verification_status: VerificationStatus
  verification_documents_url: string | null
  bio: string | null
  tagline: string | null
  profile_photo_url: string | null
  website_url: string | null
  linkedin_url: string | null
  phone_number: string | null
  // Location
  city: string | null
  state: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  service_radius_miles: number
  // Services
  support_type: SupportType
  // Availability
  availability_status: AvailabilityStatus
  is_paused: boolean
  // Privacy
  phone_visibility: ContactVisibility
  email_visibility: ContactVisibility
  // Pricing
  hourly_rate_min: number | null
  hourly_rate_max: number | null
  // Stats
  average_rating: number
  total_reviews: number
  completed_requests: number
  // Admin
  approved_at: string | null
  approved_by: string | null
  created_at: string
  updated_at: string
}

export interface TechnicianService {
  id: string
  technician_id: string
  service_name: string
  category: ServiceCategory
  is_custom: boolean
  price_min: number | null
  price_max: number | null
  created_at: string
}

export interface TechnicianCertification {
  id: string
  technician_id: string
  name: string
  issuer: string | null
  issued_date: string | null
  expiry_date: string | null
  verification_url: string | null
  created_at: string
}

export interface TechnicianPortfolioItem {
  id: string
  technician_id: string
  title: string
  description: string | null
  image_url: string | null
  project_url: string | null
  created_at: string
}

export interface Conversation {
  id: string
  user_id: string
  technician_id: string
  status: ConversationStatus
  job_completed_at: string | null
  job_completed_by: string | null
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface ConversationMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface ConversationMessageWithSender extends ConversationMessage {
  sender: {
    full_name: string
    role: UserRole
    avatar_url: string | null
  } | null
}

export interface SupportRequest {
  id: string
  requester_id: string
  professional_id: string | null
  title: string
  description: string
  category: string
  urgency: RequestUrgency
  status: RequestStatus
  contact_email: string | null
  contact_phone: string | null
  accepted_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface MessageWithSender extends Message {
  sender: {
    full_name: string
    role: string
  } | null
}

export interface Review {
  id: string
  request_id: string | null
  conversation_id: string | null
  professional_id: string
  reviewer_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_user_id: string
  request_id: string | null
  reason: string
  description: string
  status: ReportStatus
  reviewed_by: string | null
  reviewed_at: string | null
  admin_notes: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

// ---- Extended / joined types ----

export interface TechnicianSearchResult {
  user_id: string
  full_name: string
  email: string | null
  avatar_url: string | null
  tagline: string | null
  bio: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  service_radius_miles: number
  support_type: string
  availability_status: string
  phone_visibility: string
  email_visibility: string
  phone_number: string | null
  average_rating: number
  total_reviews: number
  completed_requests: number
  years_of_experience: number
  verification_status: string
  profile_photo_url: string | null
  distance_miles: number | null
}

export interface TechnicianPublicProfile extends TechnicianSearchResult {
  services: TechnicianService[]
  certifications: TechnicianCertification[]
  portfolio: TechnicianPortfolioItem[]
  reviews: ReviewWithReviewer[]
}

export interface ReviewWithReviewer extends Review {
  reviewer?: {
    full_name: string
    avatar_url: string | null
  }
}

export interface ConversationWithDetails extends Conversation {
  user?: Profile
  technician?: Profile & { professional_profile?: ITProfessionalProfile }
  last_message?: ConversationMessage
  unread_count?: number
}

export interface SupportRequestWithRelations extends SupportRequest {
  requester?: Profile
  professional?: Profile
  messages?: Message[]
  review?: Review
}

export interface ITProfessionalWithProfile extends ITProfessionalProfile {
  profile?: Profile
  reviews?: Review[]
}

// Broad service categories used for search filtering (must match the
// `service_category` Postgres enum in supabase/migrations/006_service_categories.sql)
export const SERVICE_CATEGORIES = [
  'Networking', 'Hardware', 'Software', 'Security',
  'Cybersecurity', 'Cloud', 'Data Recovery', 'Printers',
] as const

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]

// Predefined services list, each tagged with its category
export const PREDEFINED_SERVICES: { name: string; category: ServiceCategory }[] = [
  { name: 'Internet connectivity troubleshooting', category: 'Networking' },
  { name: 'Ethernet wiring', category: 'Networking' },
  { name: 'Network troubleshooting', category: 'Networking' },
  { name: 'Computer setup', category: 'Hardware' },
  { name: 'Laptop troubleshooting', category: 'Hardware' },
  { name: 'Scanner setup', category: 'Hardware' },
  { name: 'Smart TV setup', category: 'Hardware' },
  { name: 'Projector setup', category: 'Hardware' },
  { name: 'Home office setup', category: 'Hardware' },
  { name: 'Smart home device setup', category: 'Hardware' },
  { name: 'Software installation and configuration', category: 'Software' },
  { name: 'Remote desktop support', category: 'Software' },
  { name: 'Email setup and troubleshooting', category: 'Software' },
  { name: 'General IT support', category: 'Software' },
  { name: 'Small business IT support', category: 'Software' },
  { name: 'Security camera setup', category: 'Security' },
  { name: 'Virus and malware removal', category: 'Cybersecurity' },
  { name: 'Cloud storage setup', category: 'Cloud' },
  { name: 'Data backup and recovery', category: 'Data Recovery' },
  { name: 'Printer setup and troubleshooting', category: 'Printers' },
]

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
] as const

export const SERVICE_RADIUS_OPTIONS = [5, 10, 15, 25, 50, 100] as const
