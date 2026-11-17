import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  resolveSiteUrl,
  buildRootJsonLd,
  buildAboutJsonLd,
  buildSourcesJsonLd,
  buildScenarioJsonLd,
  buildAgentMarkdownResponse,
  AUTHOR_PROFILE,
} from './seo-metadata';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import robots from '../app/robots';
import sitemap from '../app/sitemap';
import manifest from '../app/manifest';

describe('SEO Audit Compliance Suite (Modules 01–08)', () => {
  it('resolves canonical site URL without trailing slashes', () => {
    assert.equal(resolveSiteUrl('https://attackexplorer.org/'), 'https://attackexplorer.org');
    assert.equal(resolveSiteUrl('https://attackexplorer.org///'), 'https://attackexplorer.org');
    assert.equal(resolveSiteUrl(''), 'https://attackexplorer.org');
  });

  it('generates valid robots.txt rules with AI crawler policies and sitemap pointer (Module 02)', () => {
    const config = robots();
    assert.ok(config.sitemap?.toString().endsWith('/sitemap.xml'));
    const rules = Array.isArray(config.rules) ? config.rules : [config.rules];
    assert.ok(rules.length >= 2);
    const wildcardRule = rules.find((r) => r.userAgent === '*');
    assert.ok(wildcardRule, 'Expected wildcard userAgent rule');
    assert.equal(wildcardRule.allow, '/');
    assert.deepEqual(wildcardRule.disallow, ['/api/']);
  });

  it('generates comprehensive XML sitemap covering /, /about, /sources, and all 85+ scenarios (Module 02)', () => {
    const entries = sitemap();
    const baseUrl = resolveSiteUrl();
    assert.ok(
      entries.length >= ATTACK_SCENARIOS.length + 3,
      `Expected at least ${ATTACK_SCENARIOS.length + 3} sitemap entries, got ${entries.length}`
    );
    const urls = entries.map((e) => e.url);
    assert.ok(urls.includes(baseUrl));
    assert.ok(urls.some((u) => u.endsWith('/about')));
    assert.ok(urls.some((u) => u.endsWith('/sources')));
    assert.ok(urls.some((u) => u.endsWith('/scenarios/process-hollowing')));
    assert.ok(urls.some((u) => u.endsWith('/scenarios/log4shell-dfir')));
  });

  it('generates valid Web App Manifest (Module 05)', () => {
    const webManifest = manifest();
    assert.equal(webManifest.name, 'Attack Explorer');
    assert.equal(webManifest.short_name, 'AttackExplorer');
    assert.equal(webManifest.display, 'standalone');
    assert.ok(Array.isArray(webManifest.icons) && webManifest.icons.length >= 3);
  });

  it('builds root Schema.org JSON-LD @graph with WebApplication, TechArticle, Person, and FAQPage (Module 04)', () => {
    const graphObj = buildRootJsonLd('https://attackexplorer.org');
    assert.equal(graphObj['@context'], 'https://schema.org');
    assert.equal(graphObj['@graph'].length, 4);

    const [webApp, techArticle, person, faqPage] = graphObj['@graph'];
    assert.equal(webApp['@type'], 'WebApplication');
    assert.equal(webApp.applicationCategory, 'SecurityApplication');
    assert.equal(techArticle['@type'], 'TechArticle');
    assert.equal(person['@type'], 'Person');
    assert.equal(person.name, AUTHOR_PROFILE.name);
    assert.ok(Array.isArray(person.sameAs) && person.sameAs.length >= 3);
    assert.equal(faqPage['@type'], 'FAQPage');
    assert.ok(Array.isArray(faqPage.mainEntity) && faqPage.mainEntity.length >= 3);

    const aboutGraph = buildAboutJsonLd('https://attackexplorer.org');
    assert.equal(aboutGraph['@graph'][0]['@type'], 'ProfilePage');

    const sourcesGraph = buildSourcesJsonLd('https://attackexplorer.org');
    assert.equal(sourcesGraph['@graph'][0]['@type'], 'CollectionPage');
  });

  it('builds per-scenario Schema.org JSON-LD with TechArticle, HowTo, and BreadcrumbList (Module 04)', () => {
    const scenario = ATTACK_SCENARIOS[0];
    const jsonLd = buildScenarioJsonLd(scenario, 'https://attackexplorer.org');
    assert.equal(jsonLd['@context'], 'https://schema.org');
    assert.equal(jsonLd['@graph'].length, 3);

    const [article, howTo, breadcrumb] = jsonLd['@graph'];
    assert.equal(article['@type'], 'TechArticle');
    assert.ok(article.headline.includes(scenario.name));
    assert.equal(howTo['@type'], 'HowTo');
    assert.equal(howTo.step.length, scenario.stages.length);
    assert.equal(breadcrumb['@type'], 'BreadcrumbList');
    assert.equal(breadcrumb.itemListElement.length, 2);
  });

  it('builds clean Markdown responses for AI agents negotiating Accept: text/markdown across /, /about, /sources, and /scenarios/[id] (Module 06)', () => {
    const rootMd = buildAgentMarkdownResponse('/', undefined, 'https://attackexplorer.org');
    assert.ok(rootMd.startsWith('# Attack Explorer'));
    assert.ok(rootMd.includes('## Core Capabilities'));
    assert.ok(rootMd.includes('/llms-full.txt'));

    const aboutMd = buildAgentMarkdownResponse('/about', undefined, 'https://attackexplorer.org');
    assert.ok(aboutMd.includes('Mohammad Mirasadollahi'));

    const sourcesMd = buildAgentMarkdownResponse('/sources', undefined, 'https://attackexplorer.org');
    assert.ok(sourcesMd.includes('Global Analytical Frameworks'));

    const scenarioMd = buildAgentMarkdownResponse(
      '/scenarios/process-hollowing',
      undefined,
      'https://attackexplorer.org'
    );
    assert.ok(scenarioMd.includes('Process Hollowing'));
    assert.ok(scenarioMd.includes('## MITRE ATT&CK® Techniques Mapped'));
    assert.ok(scenarioMd.includes('## Kill-Chain Execution Stages'));
  });

  it('verifies static SEO, GEO, and security files exist in /public (Modules 05, 06, 07)', () => {
    const rootDir = process.cwd();
    const requiredPublicFiles = [
      'public/og-image.png',
      'public/favicon.ico',
      'public/favicon.svg',
      'public/apple-touch-icon.png',
      'public/llms.txt',
      'public/llms-full.txt',
      'public/.well-known/security.txt',
    ];

    for (const relPath of requiredPublicFiles) {
      const fullPath = path.join(rootDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Expected static file to exist: ${relPath}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 0, `Expected non-empty file: ${relPath}`);
    }

    const securityTxt = fs.readFileSync(
      path.join(rootDir, 'public/.well-known/security.txt'),
      'utf8'
    );
    assert.ok(securityTxt.includes('Contact:'));
    assert.ok(securityTxt.includes('Expires:'));
    assert.ok(securityTxt.includes('Canonical:'));
  });

  it('enforces single H1 hierarchy across workbench header and inspector panel (Module 03)', () => {
    const rootDir = process.cwd();
    const headerSource = fs.readFileSync(
      path.join(rootDir, 'components/AttackHeader.tsx'),
      'utf8'
    );
    const inspectorSource = fs.readFileSync(
      path.join(rootDir, 'components/InspectorPanel.tsx'),
      'utf8'
    );

    assert.ok(
      headerSource.includes('<h1 className="sr-only">'),
      'Expected server-rendered <h1 className="sr-only"> in AttackHeader.tsx'
    );
    assert.ok(
      !inspectorSource.includes('<h1'),
      'Expected secondary <h1> in InspectorPanel.tsx to be demoted to <h2>'
    );
    assert.ok(
      inspectorSource.includes('<h2') &&
        inspectorSource.includes('data-testid="inspector-scope-title"'),
      'Expected InspectorPanel.tsx scope title to use <h2> while preserving data-testid'
    );
  });

  it('indexes all 10 new official Ransomware scenarios, the PikeRed CLR Profiler scenario + URL, and 5 famous recent Supply Chain scenarios across sitemap, JSON-LD, and agent Markdown', () => {
    const newRansomwareIds = [
      'alphv-blackcat-sphynx-rust-impacket-exmatter',
      'royal-blacksuit-ransomware-chacha20-restartmanager',
      'ransomhub-edrkiller-tdsskiller-golocks',
      'medusa-ransomware-gaze-abyss-pdqdeploy',
      'qilin-agenda-rust-chrome-cred-harvester-esxi',
      'hunters-international-hive-rust-wsus-sharpwmi',
      'inc-ransom-lynx-citrix-netscaler-wmic-mega',
      'cactus-ransomware-qlik-sense-ssh-batch-unpacker',
      'eightbase-phobos-smoke-loader-process-hacker',
      'cl0p-truebot-flawedgrace-sdbbot-ransomware',
    ];
    const newSupplyChainIds = [
      'rspack-solana-web3js-npm-supply-chain-2024',
      'lottie-player-npm-ace-supply-chain-2024',
      'circleci-oauth-github-token-rotation-breach',
      'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning',
      'pypi-pytorch-torchtriton-dependency-confusion-supply-chain',
    ];
    const pikeredId = 'pikered-clr-profiler-trusted-binary-loader-chain';
    const pikeredUrl =
      'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/';

    const sitemapUrls = sitemap().map((e) => e.url);

    for (const id of [...newRansomwareIds, ...newSupplyChainIds, pikeredId]) {
      const scenario = ATTACK_SCENARIOS.find((s) => s.id === id);
      assert.ok(scenario, `Expected scenario ${id} in ATTACK_SCENARIOS`);
      assert.ok(
        sitemapUrls.some((u) => u.endsWith(`/scenarios/${id}`)),
        `Expected /scenarios/${id} in XML sitemap`
      );
      const jsonLd = buildScenarioJsonLd(scenario, 'https://attackexplorer.org');
      assert.equal(jsonLd['@graph'][0]['@type'], 'TechArticle');
      assert.equal(jsonLd['@graph'][1]['@type'], 'HowTo');
      assert.equal(jsonLd['@graph'][1].step.length, 3);
    }

    const pikeredScenario = ATTACK_SCENARIOS.find((s) => s.id === pikeredId)!;
    const pikeredJsonLd = buildScenarioJsonLd(
      pikeredScenario,
      'https://attackexplorer.org'
    );
    const citations = pikeredJsonLd['@graph'][0].citation;
    assert.ok(
      citations.some((c: { url: string }) => c.url === pikeredUrl),
      'Expected PikeRed CLR Profiler URL in Schema.org TechArticle citation'
    );

    const pikeredMd = buildAgentMarkdownResponse(
      `/scenarios/${pikeredId}`,
      undefined,
      'https://attackexplorer.org'
    );
    assert.ok(pikeredMd.includes(pikeredUrl));
    assert.ok(pikeredMd.includes('COR_ENABLE_PROFILING'));
  });
});
