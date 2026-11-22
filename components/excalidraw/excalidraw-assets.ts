/**
 * Self-host Excalidraw fonts and keep CSP clean.
 *
 * @excalidraw/excalidraw@0.18 always appends an esm.sh FontFace fallback even
 * when EXCALIDRAW_ASSET_PATH is set. Chromium reports a font-src violation for
 * that second src at FontFace construction (fonts never need to fetch it).
 * Strip the CDN entries so only same-origin /fonts/** remain.
 *
 * Import this module before `@excalidraw/excalidraw`.
 *
 * @see https://plus.excalidraw.com/docs/sdk/excalidraw/installation
 * @see https://github.com/excalidraw/excalidraw/issues/12609
 */

declare global {
  interface Window {
    EXCALIDRAW_ASSET_PATH?: string | string[];
  }
}

const ESM_SH_HOST = 'esm.sh';

if (typeof window !== 'undefined') {
  window.EXCALIDRAW_ASSET_PATH = '/';

  const NativeFontFace = window.FontFace;

  window.FontFace = class extends NativeFontFace {
    constructor(
      family: string,
      source: ConstructorParameters<typeof FontFace>[1],
      descriptors?: FontFaceDescriptors
    ) {
      if (typeof source === 'string' && source.includes(ESM_SH_HOST)) {
        const cleaned = source
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part.length > 0 && !part.includes(ESM_SH_HOST))
          .join(', ');
        super(family, cleaned || source, descriptors);
        return;
      }
      super(family, source, descriptors);
    }
  } as typeof FontFace;
}

export {};
