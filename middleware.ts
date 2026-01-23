import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Update session
  const response = await updateSession(request)

  // Get pathname
  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedPaths = ['/user', '/professional', '/admin']
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))

  if (isProtectedPath) {
    // Check if user is authenticated
    const supabaseResponse = await updateSession(request)
    
    // If not authenticated, redirect to login
    if (path !== '/login' && path !== '/register') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
