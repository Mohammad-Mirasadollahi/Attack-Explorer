'use client';

import React from 'react';
import { ScenarioSection3DEmbed } from '@/components/three/ScenarioSection3DEmbed';

export function ProcessHollowingAnalogy3DEmbed({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      data-testid="process-hollowing-analogy-3d-embed"
      onClick={(e) => e.stopPropagation()}
      className={`w-full ${className}`}
    >
      <ScenarioSection3DEmbed
        scenarioId="process-hollowing"
        sectionKey="briefing"
      />
    </div>
  );
}
