// Database type definitions for type-safe Supabase queries
export type UserRole = 'end_user' | 'it_professional' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type RequestUrgency = 'low' | 'medium' | 'high' | 'critical';
export type RequestStatus = 'open' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ITProfessionalProfile {
  id: string;
  user_id: string;
  specialization: string[];
  years_of_experience: number;
  certifications: string[];
  verification_status: VerificationStatus;
  verification_documents_url: string | null;
  bio: string | null;
  average_rating: number;
  total_reviews: number;
  completed_requests: number;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportRequest {
  id: string;
  requester_id: string;
  professional_id: string | null;
  title: string;
  description: string;
  category: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  contact_email: string | null;
  contact_phone: string | null;
  accepted_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  request_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageWithSender extends Message {
  sender: {
    full_name: string
    role: string
  } | null
}

export interface Review {
  id: string;
  request_id: string;
  professional_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  request_id: string | null;
  reason: string;
  description: string;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

// Extended types with relations
export interface SupportRequestWithRelations extends SupportRequest {
  requester?: Profile;
  professional?: Profile;
  messages?: Message[];
  review?: Review;
}

export interface ITProfessionalWithProfile extends ITProfessionalProfile {
  profile?: Profile;
  reviews?: Review[];
}
