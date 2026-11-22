import fs from 'node:fs';
import path from 'node:path';

const sourceDir = path.join(
  process.cwd(),
  'node_modules',
  '@excalidraw',
  'excalidraw',
  'dist',
  'prod',
  'fonts'
);
const targetDir = path.join(process.cwd(), 'public', 'fonts');

if (!fs.existsSync(sourceDir)) {
  console.warn(
    '[copy-excalidraw-fonts] Source directory not found, skipping:',
    sourceDir
  );
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
console.log('[copy-excalidraw-fonts] Copied Excalidraw fonts to public/fonts');
