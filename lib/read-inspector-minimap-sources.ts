import fs from 'node:fs';
import path from 'node:path';

/**
 * Concatenate the MiniMap public entry + all modular sources under
 * `components/inspector-minimap/` so source-structure tests survive modularization.
 */
export function readInspectorMiniMapSources(
  cwd: string = process.cwd()
): string {
  const componentsDir = path.join(cwd, 'components');
  const chunks: string[] = [];

  const entry = path.join(componentsDir, 'InspectorContextMiniMap.tsx');
  if (fs.existsSync(entry)) {
    chunks.push(fs.readFileSync(entry, 'utf8'));
  }

  const miniMapDir = path.join(componentsDir, 'inspector-minimap');
  if (!fs.existsSync(miniMapDir)) {
    return chunks.join('\n');
  }

  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir).sort()) {
      if (name.startsWith('_') || name === 'node_modules') continue;
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(name)) continue;
      chunks.push(fs.readFileSync(full, 'utf8'));
    }
  };

  walk(miniMapDir);
  return chunks.join('\n');
}
