import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function TenantMiddleware(request: NextRequest) {
  const tenantId = request.headers.get('X-Tenant-ID') || 'main';
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('X-Tenant-ID', tenantId);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return res;
}