import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isAdminLoginRoute = createRouteMatcher(['/admin/login(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && !isAdminLoginRoute(req)) {
    const { userId } = await auth()
    
    // Not logged in -> redirect to admin login
    if (!userId) {
      const url = new URL('/admin/login', req.url)
      return NextResponse.redirect(url)
    }

    // Fetch user details from Clerk to check their metadata role
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const role = user.publicMetadata?.role as string | undefined

    // If not an admin or branch manager, redirect to homepage (unauthorized)
    if (role !== 'admin' && role !== 'branch_manager') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
