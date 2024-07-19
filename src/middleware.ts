import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This will allow to add security/authentication to the whole site, but adding config it will apply on that sites only
export { default } from "next-auth/middleware"

// This will Provide us the Token
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    // getToken() will take the request as parameter
    const token = await getToken({ req: request })
    const url = request.nextUrl;

    if (token &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-verify') ||
            // TODO : We have blocked the home page '/' as it will be just a presentational page, Remove that if needed
            url.pathname.startsWith('/')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
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