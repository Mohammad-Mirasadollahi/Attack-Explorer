import fs from 'node:fs';
import path from 'node:path';

/**
 * Concatenate the Inspector public entry + all modular sources under
 * `components/inspector/` so source-structure tests survive modularization.
 */
export function readInspectorSources(cwd: string = process.cwd()): string {
  const componentsDir = path.join(cwd, 'components');
  const chunks: string[] = [];

  const entry = path.join(componentsDir, 'InspectorPanel.tsx');
  if (fs.existsSync(entry)) {
    chunks.push(fs.readFileSync(entry, 'utf8'));
  }

  const inspectorDir = path.join(componentsDir, 'inspector');
  if (!fs.existsSync(inspectorDir)) {
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

  walk(inspectorDir);
  return chunks.join('\n');
}

export function readFloatingHoverInspectorSource(
  cwd: string = process.cwd()
): string {
  return fs.readFileSync(
    path.join(
      cwd,
      'components/inspector/FloatingHoverInspectorTrigger.tsx'
    ),
    'utf8'
  );
}
