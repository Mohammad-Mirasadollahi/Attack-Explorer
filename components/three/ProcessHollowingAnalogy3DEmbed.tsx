'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ProcessHollowingBankScene = dynamic(
  () =>
    import('./ProcessHollowingBankScene').then(
      (mod) => mod.ProcessHollowingBankScene
    ),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="process-hollowing-3d-loading"
        className="anime-3d-stage-frame w-full h-[calc(100vh-110px)] min-h-[600px] max-h-[860px]"
      >
        <div className="anime-3d-canvas-bezel w-full h-full bg-[#0B0F17] flex flex-col items-center justify-center gap-3 text-slate-200 p-6">
          <div className="px-3 py-1 rounded-md bg-sky-400 text-slate-950 font-mono text-xs font-extrabold">
            THREE.JS · ANIME 3D VISUALIZATION
          </div>
          <div className="text-sm font-bold text-white text-center">
            Loading Armored Bank Truck — Process Hollowing 3D Scene...
          </div>
          <div className="text-xs font-mono text-slate-400 text-center">
            Hire Truck · Freeze in Garage · Empty Legal Cargo · Load Covert Crew ·
            Pass Bank Gate
          </div>
        </div>
      </div>
    ),
  }
);

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
      <ProcessHollowingBankScene />
    </div>
  );
}
