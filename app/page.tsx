import { AttackExplorerWorkbench } from '@/components/AttackExplorerWorkbench';
import { SeoSemanticDocumentation } from '@/components/SeoSemanticDocumentation';

// Prerender for Workers Static Assets (Free plan: avoid Worker CPU on page hits).
export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <>
      <AttackExplorerWorkbench />
      <SeoSemanticDocumentation />
    </>
  );
}
