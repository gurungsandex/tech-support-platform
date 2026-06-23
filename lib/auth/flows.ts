'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/lib/types/database'
import { verifyTurnstileToken } from '@/lib/auth/turnstile'

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  turnstileToken?: string,
  metadata?: {
    specialization?: string[]
    years_of_experience?: number
  }
) {
  if (!(await verifyTurnstileToken(turnstileToken))) {
    return { error: 'Verification failed. Please try again.' }
  }

  // Self-service signup may only create end_user or it_professional
  // accounts. Admin is never settable through this public action.
  const safeRole: UserRole = role === 'it_professional' ? 'it_professional' : 'end_user'

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: safeRole,
        ...metadata,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(email: string, password: string, turnstileToken?: string) {
  if (!(await verifyTurnstileToken(turnstileToken))) {
    return { error: 'Verification failed. Please try again.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Look up the authoritative role from profiles rather than trusting
  // user_metadata, which is set once at signup and goes stale the moment
  // an admin is promoted directly in the database.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  return { data, role: profile?.role }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Permanently delete the current user's account.
 *
 * Deletes the auth.users row via the admin API, which cascades (ON DELETE
 * CASCADE, see 001_initial_schema.sql) through profiles and every table that
 * references it — conversations, support_requests, reviews, etc. This is
 * the only legitimate use of the service-role key in this codebase: it's
 * never exposed to the client, and it only ever acts on the caller's own
 * id, confirmed via their own session before the admin client is touched.
 */
export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'You must be signed in to delete your account.' }
  }

  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user.id)

  if (error) {
    return { error: error.message }
  }

  await supabase.auth.signOut()
  redirect('/')
}
