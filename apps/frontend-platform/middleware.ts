import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = ['/auth', '/auth/forgot-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is public
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    // Get the authentication token from cookies or request headers
    // Note: In client-side auth, the token is stored in localStorage/sessionStorage
    // but Next.js middleware only has access to cookies
    const authToken = request.cookies.get('auth_token')?.value ||
        request.headers.get('Authorization')?.replace('Bearer ', '');

    // Skip processing for static assets and API routes
    if (pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // If the path is not public and there's no auth token, redirect to login
    if (!isPublicPath && !authToken) {
        const url = new URL('/auth', request.url);

        // Add the original URL as a callback parameter - but don't use encodeURI
        if (pathname !== '/') {
            url.searchParams.set('callbackUrl', pathname);
        }

        return NextResponse.redirect(url);
    }

    // If the path is login and there's an auth token, redirect to dashboard
    if ((pathname === '/auth' || pathname === '/') && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // For authenticated requests to protected routes, add the auth token to the request headers
    if (!isPublicPath && authToken) {
        const response = NextResponse.next();
        response.headers.set('Authorization', `Bearer ${authToken}`);
        return response;
    }

    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}; 