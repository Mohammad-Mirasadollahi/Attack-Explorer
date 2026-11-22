export function FilmBackdrop({ prefix }: { prefix: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${prefix}-bg`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0B0F17" />
        </radialGradient>
        <pattern id={`${prefix}-grain`} width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="10" r="0.6" fill="#fff" opacity="0.08" />
          <circle cx="40" cy="28" r="0.5" fill="#fff" opacity="0.05" />
          <circle cx="70" cy="60" r="0.7" fill="#fff" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="1200" height="640" fill={`url(#${prefix}-bg)`} />
      <rect width="1200" height="640" fill={`url(#${prefix}-grain)`} />
    </>
  );
}
