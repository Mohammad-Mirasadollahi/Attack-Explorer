import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';

  // Module 06 (ax/markdown-response): When AI agents request `Accept: text/markdown`,
  // rewrite to a Node route handler instead of importing the scenario corpus here.
  // Bundling seo-metadata into Edge middleware previously produced a ~4MB isolate
  // that exceeded Cloudflare Worker CPU/memory limits (Error 1102) on page loads.
  if (
    acceptHeader.includes('text/markdown') ||
    request.nextUrl.searchParams.get('format') === 'markdown'
  ) {
    const rewriteUrl = request.nextUrl.clone();
    const originalPath = request.nextUrl.pathname;
    rewriteUrl.pathname = '/api/agent-markdown';
    rewriteUrl.searchParams.set('path', originalPath);
    rewriteUrl.searchParams.delete('format');
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/about', '/sources', '/scenarios/:path*'],
};
