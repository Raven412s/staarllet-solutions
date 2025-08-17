import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',        // Protect admin routes
])

export default clerkMiddleware(async (auth, req) => {
  // Exclude admin-sign-in page
  if (req.nextUrl.pathname.startsWith('/admin-sign-in')) return

  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',   // Match all routes except static files
  ],
}
