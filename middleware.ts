import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not add logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const protectedPaths = ['/user', '/professional', '/admin']
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  const isAuthPath = path === '/login' || path === '/register'

  // Unauthenticated user trying to access a protected route
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // Authenticated user visiting login/register — redirect to their dashboard.
  // Read the role from the profiles table rather than the JWT's
  // user_metadata: metadata is set once at signup and never refreshed, so it
  // goes stale the moment an admin promotes/demotes a user directly in the
  // database (the only sanctioned way to grant admin, per 006_fix_role_escalation.sql).
  if (isAuthPath && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    const role = profile?.role
    let redirectPath = '/user/requests'
    if (role === 'admin') redirectPath = '/admin/dashboard'
    else if (role === 'it_professional') redirectPath = '/professional/dashboard'

    const url = request.nextUrl.clone()
    url.pathname = redirectPath
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
