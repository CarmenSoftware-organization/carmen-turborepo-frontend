import { NextRequest } from 'next/server';
import { TenantMiddleware } from './tenantmiddleware';
import { cookies } from 'next/headers';
import { middleware as i18nMiddleware } from '@/lib/i18n';

const publicRoutes = ['/', '/login', '/signup'];
const adminRoutes = ['/admin'];
const mainRoutes = [
	'/dashboard',
	'/procurement',
	'/store-operations',
	'/inventory-management',
	'/operational-planning',
	'/production',
	'/reporting-analytics',
	'/finance',
	'/system-administration',
	'/help-support',
];

export async function middleware(request: NextRequest) {
	console.log('request.url', request);

	const lang = i18nMiddleware.detectLanguage(request);
	const response = i18nMiddleware.getResponse(request, lang);

	// const url = new URL(request.url);
	// const cookieStore = cookies();
	// const isLoggedIn = cookieStore.get('isLoggedIn')?.value === 'true';

	// if (!publicRoutes.includes(url.pathname) && !mainRoutes.some(route => url.pathname.startsWith(route))) {
	//   if (!isLoggedIn) {
	//     return NextResponse.redirect(new URL('/login', request.url));
	//   }
	// }

	// return NextResponse.next();

	const tenantResponse = TenantMiddleware(request);
	const tenantId = tenantResponse.headers.get('X-Tenant-ID') || 'main';
	response.headers.append('X-Tenant-ID', tenantId);

	return response;
}

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
