import { NextRequest, NextResponse } from 'next/server';
import { AttackCategory } from '@/lib/attack-scenarios';
import { queryAttackLibrary } from '@/lib/attack-library-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const categoryParam = (searchParams.get('category') ||
    'ALL') as AttackCategory;
  const phaseParam = searchParams.get('mitrePhase');
  const severityParam = (searchParams.get('severity') || 'ALL') as
    | 'ALL'
    | 'CRITICAL'
    | 'HIGH';
  const search = searchParams.get('search') || '';

  const mitrePhase =
    phaseParam && phaseParam !== 'ALL' && !Number.isNaN(Number(phaseParam))
      ? Number(phaseParam)
      : 'ALL';

  const result = queryAttackLibrary({
    category: categoryParam,
    mitrePhase,
    severity: severityParam,
    search });

  // Short CDN/browser cache — reduces repeat Worker invocations on Free (100k/day).
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
