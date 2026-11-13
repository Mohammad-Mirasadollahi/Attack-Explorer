export type WorkbenchLayoutMode = 'DESKTOP' | 'RESPONSIVE';

export const LAYOUT_MODE_STORAGE_KEY = 'attack-explorer-layout-mode';
export const DEFAULT_LAYOUT_MODE: WorkbenchLayoutMode = 'RESPONSIVE';
export const DESKTOP_LAYOUT_WIDTH = 1400;

/** Physical CSS width captured before desktop viewport override */
let cachedPhysicalWidth: number | null = null;

export function isWorkbenchLayoutMode(value: unknown): value is WorkbenchLayoutMode {
  return value === 'DESKTOP' || value === 'RESPONSIVE';
}

export function readStoredLayoutMode(): WorkbenchLayoutMode {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT_MODE;
  try {
    const raw = window.localStorage.getItem(LAYOUT_MODE_STORAGE_KEY);
    return isWorkbenchLayoutMode(raw) ? raw : DEFAULT_LAYOUT_MODE;
  } catch {
    return DEFAULT_LAYOUT_MODE;
  }
}

export function persistLayoutMode(mode: WorkbenchLayoutMode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore quota / private-mode failures
  }
}

function ensureViewportMeta(): HTMLMetaElement {
  let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  return meta;
}

function measurePhysicalCssWidth(forceRefresh = false): number {
  if (!forceRefresh && cachedPhysicalWidth != null) {
    return cachedPhysicalWidth;
  }

  const screenW = window.screen?.width || 0;
  const screenH = window.screen?.height || 0;
  const outer = window.outerWidth || 0;
  const visual = window.visualViewport?.width || 0;
  const inner = window.innerWidth || 0;

  // Prefer a phone-sized reading. After desktop viewport is applied, innerWidth
  // becomes ~1400 — ignore that and fall back to screen metrics.
  const candidates = [visual, inner, outer, screenW, screenH].filter(
    (n) => n > 0 && n < DESKTOP_LAYOUT_WIDTH * 0.92
  );

  const measured =
    candidates.length > 0
      ? Math.max(...candidates)
      : Math.min(screenW || DESKTOP_LAYOUT_WIDTH, screenH || DESKTOP_LAYOUT_WIDTH) ||
        390;

  cachedPhysicalWidth = Math.max(320, measured);
  return cachedPhysicalWidth;
}

/**
 * Force a desktop CSS layout viewport on phones/tablets so Tailwind breakpoints
 * and the full workbench chrome render as on desktop. Keeps pinch-zoom + page
 * pan enabled so users can still move around the denser UI.
 */
export function applyWorkbenchLayoutMode(
  mode: WorkbenchLayoutMode,
  options?: { refreshPhysicalWidth?: boolean }
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const meta = ensureViewportMeta();
  const root = document.documentElement;
  root.dataset.layoutMode = mode;

  if (mode === 'DESKTOP') {
    const physicalWidth = measurePhysicalCssWidth(
      Boolean(options?.refreshPhysicalWidth)
    );
    const initialScale = Math.min(1, physicalWidth / DESKTOP_LAYOUT_WIDTH);
    meta.setAttribute(
      'content',
      [
        `width=${DESKTOP_LAYOUT_WIDTH}`,
        `initial-scale=${initialScale.toFixed(3)}`,
        'minimum-scale=0.2',
        'maximum-scale=3',
        'user-scalable=yes',
        'viewport-fit=cover',
      ].join(', ')
    );
    root.classList.add('layout-force-desktop');
    root.classList.remove('layout-responsive');
  } else {
    cachedPhysicalWidth = null;
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
    );
    root.classList.add('layout-responsive');
    root.classList.remove('layout-force-desktop');
  }
}
