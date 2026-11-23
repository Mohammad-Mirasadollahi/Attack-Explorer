export function FilmBackdrop({ prefix }: { prefix: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${prefix}-bg`} cx="50%" cy="35%" r="78%">
          <stop offset="0%" stopColor="#172033" />
          <stop offset="62%" stopColor="#0e1525" />
          <stop offset="100%" stopColor="#080c14" />
        </radialGradient>
        <pattern
          id={`${prefix}-grid`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#334155"
            strokeWidth="0.6"
            opacity="0.22"
          />
        </pattern>
        <pattern
          id={`${prefix}-grain`}
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="12" r="0.65" fill="#94a3b8" opacity="0.1" />
          <circle cx="42" cy="30" r="0.55" fill="#94a3b8" opacity="0.07" />
          <circle cx="70" cy="62" r="0.7" fill="#94a3b8" opacity="0.08" />
        </pattern>
        <filter
          id={`${prefix}-glow`}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id={`${prefix}-soft-glow`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id={`${prefix}-arrow-cyan`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
        </marker>
        <marker
          id={`${prefix}-arrow-amber`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#fbbf24" />
        </marker>
        <marker
          id={`${prefix}-arrow-rose`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
        </marker>
        <marker
          id={`${prefix}-arrow-emerald`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#4ade80" />
        </marker>
      </defs>
      <rect width="1200" height="640" fill={`url(#${prefix}-bg)`} />
      <rect width="1200" height="640" fill={`url(#${prefix}-grid)`} />
      <rect width="1200" height="640" fill={`url(#${prefix}-grain)`} />
    </>
  );
}
