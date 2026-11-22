/**
 * Copy Excalidraw prod fonts into public/fonts so the board can self-host
 * under CSP font-src 'self' (no esm.sh CDN).
 *
 * Package layout: node_modules/@excalidraw/excalidraw/dist/prod/fonts/**
 * Served as:      /fonts/**  with window.EXCALIDRAW_ASSET_PATH = "/"
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(
  root,
  'node_modules',
  '@excalidraw',
  'excalidraw',
  'dist',
  'prod',
  'fonts'
);
const dest = join(root, 'public', 'fonts');

if (!existsSync(src)) {
  console.warn(
    '[copy-excalidraw-fonts] Skip: package fonts missing at',
    src
  );
  process.exit(0);
}

mkdirSync(join(root, 'public'), { recursive: true });
rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log('[copy-excalidraw-fonts] Synced Excalidraw fonts → public/fonts');
