import { NextRequest, NextResponse } from 'next/server';
import { buildAgentMarkdownResponse } from '@/lib/seo-metadata';

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';

  // Module 06 (ax/markdown-response): When AI agents request `Accept: text/markdown`,
  // serve a clean, token-efficient Markdown representation instead of the heavy HTML bundle.
  if (
    acceptHeader.includes('text/markdown') ||
    request.nextUrl.searchParams.get('format') === 'markdown'
  ) {
    const markdown = buildAgentMarkdownResponse(
      request.nextUrl.pathname,
      request.nextUrl.searchParams
    );
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        Vary: 'Accept',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/scenarios/:path*'],
};
