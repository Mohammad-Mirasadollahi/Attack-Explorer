import { NextRequest, NextResponse } from 'next/server';
import { buildAgentMarkdownResponse } from '@/lib/seo-metadata';

/**
 * Serves Module 06 AI-agent Markdown for a given site path.
 * Kept out of Edge middleware so the middleware isolate stays tiny and does not
 * load the full scenario corpus on every HTML page request (Cloudflare Error 1102).
 */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/';
  const markdown = buildAgentMarkdownResponse(path, req.nextUrl.searchParams);

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      Vary: 'Accept',
    },
  });
}
