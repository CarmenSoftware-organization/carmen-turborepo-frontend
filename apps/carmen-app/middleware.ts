import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import * as Sentry from '@sentry/nextjs';
import { sentryDsn } from './lib/backend-api';

const locales = ['en', 'th'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    // Get Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language') ?? '';
    // Split languages by comma and trim whitespace
    const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim());

    // Add default language if no Accept-Language header
    if (languages.length === 0) {
        languages.push(defaultLocale);
    }

    // Find best matching locale
    const locale = matchLocale(languages, locales, defaultLocale);
    return locale;
}

export function middleware(request: NextRequest) {
    // Initialize Sentry for edge runtime
    console.log('🔧 Initializing Sentry in Middleware...');
    console.log('📡 Sentry DSN:', sentryDsn ? '✅ Configured' : '❌ Missing');

    Sentry.init({
        dsn: sentryDsn,
        tracesSampleRate: 1,
        debug: false,
    });

    console.log('✅ Sentry Middleware initialized successfully');

    const pathname = request.nextUrl.pathname;

    const now = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const logData = {
        // user_id: user_id,
        timestamp: now,
        method: request.method,
        path: pathname,
        // language: lang,
        // tenantId: tenantId,
        // headers: headers,
        // body: body || undefined,
    };

    console.log('Logging request:', logData);


    // Check if the request is for a locale route
    const pathnameIsMissingLocale = locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale   
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        );
    }

    // Skip auth check in middleware since we can't access sessionStorage
    // Auth will be handled by client-side components using AuthContext
    try {
        return NextResponse.next();
    } catch (error) {
        Sentry.captureException(error);
        throw error;
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next|api|.*\\..*).*)',
    ],
};