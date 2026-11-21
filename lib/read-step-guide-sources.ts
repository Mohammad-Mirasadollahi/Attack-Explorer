import fs from 'node:fs';
import path from 'node:path';

/**
 * Concatenate the Step Guide public entry + all modular sources under
 * `components/step-guide/` so source-structure tests survive modularization.
 */
export function readStepGuideSources(cwd: string = process.cwd()): string {
  const componentsDir = path.join(cwd, 'components');
  const chunks: string[] = [];

  const entry = path.join(componentsDir, 'StepByStepGuidePanel.tsx');
  if (fs.existsSync(entry)) {
    chunks.push(fs.readFileSync(entry, 'utf8'));
  }

  const stepGuideDir = path.join(componentsDir, 'step-guide');
  if (!fs.existsSync(stepGuideDir)) {
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

  walk(stepGuideDir);
  return chunks.join('\n');
}
