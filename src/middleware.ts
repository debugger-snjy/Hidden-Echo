import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This will allow to add security/authentication to the whole site, but adding config it will apply on that sites only
export { default } from "next-auth/middleware"

// This will Provide us the Token
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // getToken() will take the request as parameter
    // ! NOTE : Getting token value as NULL as by default the raw is false
    // ? Solution : We have to set raw as true to get the JWT Token else we will get null
    const token = await getToken({ req: request, raw: true })
    const url = request.nextUrl;

    console.log("[src/middleware.ts] url.pathname : ", url.pathname);
    console.log("[src/middleware.ts] token : ", token);

    // Condition for Logged In User, and URL that are not accessible when user is logged In
    if (token &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-verify') ||
            // TODO : We have blocked the home page '/' as it will be just a presentational page, Remove that if needed
            // Also removed the condition, `url.pathname.startsWith('/')` as it will always be true
            url.pathname === '/' // For only Home Page
        )
    ) {
        console.log("[src/middleware.ts] User is Logged In !!");
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Condition, if user is not logged in but navigating to the dashboard
    if (!token &&
        (
            url.pathname.startsWith('/dashboard')
        )
    ) {
        console.log("[src/middleware.ts] User is NOT Logged In !!");
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        // All Paths that are connected or related to dashboard
        '/dashboard/:path*',
        // All Paths that are connected or related to verify
        '/verify/:path*',

    ]
}