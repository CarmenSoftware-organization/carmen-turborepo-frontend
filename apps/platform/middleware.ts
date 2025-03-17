import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Get the pathname from the request URL
    const pathname = request.nextUrl.pathname;

    // Check if the request is for a protected route that requires authentication
    if (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/platform') ||
        pathname.startsWith('/cluster') ||
        pathname.startsWith('/business-unit')
    ) {
        // Get the token from the request cookie
        const token = request.cookies.get('auth_token')?.value;

        // If there's no token, redirect to the login page
        if (!token) {
            const url = new URL('/auth', request.url);
            // Save the original URL as a callback URL after successful login
            url.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(url);
        }

        // If there's a token, the ProtectedRoute component will handle the role-based access control
        // We handle authentication only at the middleware level to avoid unnecessary client-side redirects
    }

    return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
    matcher: [
        // Match all protected routes
        '/dashboard/:path*',
        '/platform/:path*',
        '/cluster/:path*',
        '/business-unit/:path*',
    ],
}; 