import { NextRequest, NextResponse } from 'next/server';
import type { AttackCategory } from '@/modules/scenarios/types';
import { queryAttackLibraryItems } from '@/lib/attack-library-service';
import { SCENARIO_CATALOG } from '@/lib/scenario-catalog';

/**
 * Library query endpoint for Free-plan Workers.
 * Uses the slim generated catalog — never the full ATTACK_SCENARIOS corpus —
 * so a GET stays inside the Free 10ms CPU budget.
 */
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

  const result = queryAttackLibraryItems(
    {
      category: categoryParam,
      mitrePhase,
      severity: severityParam,
      search,
    },
    SCENARIO_CATALOG.map((entry) => entry.library)
  );

  // Short CDN/browser cache — reduces repeat Worker invocations on Free (100k/day).
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
