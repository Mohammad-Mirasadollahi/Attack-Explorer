import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  resolveSiteUrl,
  buildRootJsonLd,
  buildAboutJsonLd,
  buildSourcesJsonLd,
  buildScenarioBreadcrumbs,
  buildScenarioBreadcrumbJsonLd,
  buildScenarioJsonLd,
  buildAgentMarkdownResponse,
  formatCategoryAnchorId,
  getRelatedClusterScenarios,
  AUTHOR_PROFILE,
} from './seo-metadata';
import { formatAttackCategoryLabel } from './attack-category-labels';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import { readInspectorSources } from './read-inspector-sources';
import robots from '../app/robots';
import sitemap from '../app/sitemap';
import manifest from '../app/manifest';

describe('SEO Audit Compliance Suite (Modules 01–09)', () => {
  it('resolves canonical site URL without trailing slashes', () => {
    assert.equal(resolveSiteUrl('https://www.attackexplorer.com/'), 'https://www.attackexplorer.com');
    assert.equal(resolveSiteUrl('https://www.attackexplorer.com///'), 'https://www.attackexplorer.com');
    assert.equal(resolveSiteUrl(''), 'https://www.attackexplorer.com');
    assert.equal(resolveSiteUrl('MY_APP_URL'), 'https://www.attackexplorer.com');
    assert.equal(resolveSiteUrl('not-a-url'), 'https://www.attackexplorer.com');
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

  it('builds per-scenario Schema.org JSON-LD with TechArticle (including image, dateModified, keywords, mentions), HowTo, and dynamic 4-level BreadcrumbList (Module 04)', () => {
    const scenario = ATTACK_SCENARIOS[0];
    const jsonLd = buildScenarioJsonLd(scenario, 'https://attackexplorer.org');
    assert.equal(jsonLd['@context'], 'https://schema.org');
    assert.equal(jsonLd['@graph'].length, 3);

    const [article, howTo, breadcrumb] = jsonLd['@graph'];
    assert.equal(article['@type'], 'TechArticle');
    assert.ok(article.headline.includes(scenario.name));
    assert.equal(article.image, 'https://attackexplorer.org/og-image.png');
    assert.ok(article.datePublished);
    assert.ok(article.dateModified);
    assert.equal(article.articleSection, formatAttackCategoryLabel(scenario.category));
    assert.equal(article.breadcrumb['@id'], breadcrumb['@id']);
    assert.ok(Array.isArray(article.keywords) && article.keywords.includes(scenario.code));
    assert.ok(Array.isArray(article.mentions) && article.mentions.length >= 1);
    assert.equal(howTo['@type'], 'HowTo');
    assert.equal(howTo.step.length, scenario.stages.length);
    assert.equal(breadcrumb['@type'], 'BreadcrumbList');
    assert.equal(breadcrumb.numberOfItems, 4);
    assert.equal(breadcrumb.itemListElement.length, 4);
    assert.deepEqual(
      breadcrumb.itemListElement.map((el) => el.position),
      [1, 2, 3, 4]
    );
    assert.equal(breadcrumb.itemListElement[0].name, 'Attack Explorer');
    assert.equal(breadcrumb.itemListElement[0].item, 'https://attackexplorer.org');
    assert.equal(breadcrumb.itemListElement[1].name, 'Scenarios');
    assert.equal(
      breadcrumb.itemListElement[1].item,
      'https://attackexplorer.org/sources#scenario-directory'
    );
    assert.equal(
      breadcrumb.itemListElement[2].name,
      formatAttackCategoryLabel(scenario.category)
    );
    assert.equal(
      breadcrumb.itemListElement[2].item,
      `https://attackexplorer.org/sources#${formatCategoryAnchorId(scenario.category)}`
    );
    assert.equal(
      breadcrumb.itemListElement[3].name,
      `${scenario.code}: ${scenario.name}`
    );
    assert.equal(
      breadcrumb.itemListElement[3].item,
      `https://attackexplorer.org/scenarios/${scenario.id}`
    );
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
    assert.ok(scenarioMd.includes('## Answer-First Forensic Fact Sheet'));
    assert.ok(scenarioMd.includes('## MITRE ATT&CK® Techniques Mapped'));
    assert.ok(scenarioMd.includes('## Kill-Chain Execution Stages'));
    assert.ok(scenarioMd.includes('## Related Scenarios in This Topic Cluster'));
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
    const inspectorSource = readInspectorSources(rootDir);

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

    const newCloudSaasIds = [
      'cloud-midnight-blizzard-oauth-legacy-test-app-audit',
      'cloud-aws-sts-federation-token-console-signin-audit',
      'cloud-entra-id-conditional-access-device-code-phishing-audit',
      'cloud-aws-s3-kms-external-account-encryption-extortion-audit',
      'cloud-azure-vm-custom-script-extension-managed-identity-audit',
      'cloud-github-actions-pull-request-target-oidc-token-audit',
      'cloud-salesforce-connected-app-oauth-bulk-api-export-audit',
      'cloud-aws-eks-aws-auth-configmap-system-masters-audit',
      'cloud-gcp-cloud-build-default-service-account-artifact-audit',
      'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit',
    ];
    const newContainerDockerIds = [
      'docker-engine-unauthenticated-tcp-2375-api-socket-audit',
      'docker-var-run-docker-sock-mounted-socket-breakout-audit',
      'docker-buildkit-runc-cache-mount-race-cve-2024-23651',
      'container-cap-sys-admin-cgroup-release-agent-notify-audit',
      'container-cap-sys-module-kernel-ko-insmod-load-audit',
      'k8s-coredns-dns-poisoning-service-account-token-audit',
      'k8s-mutating-admission-webhook-sidecar-injection-audit',
      'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit',
      'k8s-ephemeral-debug-container-process-namespace-share-audit',
      'docker-oci-registry-manifest-layer-poisoning-cosign-audit',
    ];

    for (const id of newCloudSaasIds) {
      const scenario = ATTACK_SCENARIOS.find((s) => s.id === id);
      assert.ok(scenario, `Expected Cloud & SaaS scenario ${id} in ATTACK_SCENARIOS`);
      assert.equal(scenario.category, 'CLOUD_SAAS');
      assert.ok(
        sitemapUrls.some((u) => u.endsWith(`/scenarios/${id}`)),
        `Expected /scenarios/${id} in XML sitemap`
      );
    }

    for (const id of newContainerDockerIds) {
      const scenario = ATTACK_SCENARIOS.find((s) => s.id === id);
      assert.ok(scenario, `Expected Docker/Container scenario ${id} in ATTACK_SCENARIOS`);
      assert.equal(scenario.category, 'CONTAINERS_KUBERNETES');
      assert.ok(
        sitemapUrls.some((u) => u.endsWith(`/scenarios/${id}`)),
        `Expected /scenarios/${id} in XML sitemap`
      );
    }

    const batch8SpecializedExpected: Array<{ id: string; category: string }> = [
      { id: 'ics-frostygoop-modbus-tcp-district-heating-controller-audit', category: 'ICS_OT_SCADA' },
      { id: 'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit', category: 'ICS_OT_SCADA' },
      { id: 'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics', category: 'MOBILE_TELECOM_SPYWARE' },
      { id: 'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit', category: 'MOBILE_TELECOM_SPYWARE' },
      { id: 'db-snowflake-unc5537-single-factor-auth-data-egress-audit', category: 'DATABASE_DATA_PLATFORMS' },
      { id: 'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit', category: 'DATABASE_DATA_PLATFORMS' },
      { id: 'ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928', category: 'AI_LLM_MLOPS_SECURITY' },
      { id: 'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit', category: 'AI_LLM_MLOPS_SECURITY' },
      { id: 'ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit', category: 'ZERO_DAY_APPLIANCES' },
      { id: 'versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit', category: 'ZERO_DAY_APPLIANCES' },
    ];

    for (const item of batch8SpecializedExpected) {
      const scenario = ATTACK_SCENARIOS.find((s) => s.id === item.id);
      assert.ok(scenario, `Expected specialized scenario ${item.id} in ATTACK_SCENARIOS`);
      assert.equal(scenario.category, item.category);
      assert.ok(
        sitemapUrls.some((u) => u.endsWith(`/scenarios/${item.id}`)),
        `Expected /scenarios/${item.id} in XML sitemap`
      );
    }
  });

  it('enforces the Mandatory New Scenario & Article Ingestion + SEO/GEO Synchronization Standard across every scenario in ATTACK_SCENARIOS', () => {
    const rootDir = process.cwd();
    const ingestionDocPath = path.join(
      rootDir,
      'docs/scenario-ingestion-and-seo-standard.md'
    );
    const auditChecklistPath = path.join(
      rootDir,
      'seo-audit/09-new-scenario-seo-checklist.md'
    );
    assert.ok(
      fs.existsSync(ingestionDocPath),
      'Expected docs/scenario-ingestion-and-seo-standard.md to exist'
    );
    assert.ok(
      fs.existsSync(auditChecklistPath),
      'Expected seo-audit/09-new-scenario-seo-checklist.md to exist'
    );

    const llmsFullTxt = fs.readFileSync(
      path.join(rootDir, 'public/llms-full.txt'),
      'utf8'
    );
    const sitemapUrls = new Set(sitemap().map((e) => e.url));

    for (const scenario of ATTACK_SCENARIOS) {
      // 1. Valid URL-safe hyphenated slug
      assert.ok(
        /^[a-zA-Z0-9-]+$/.test(scenario.id),
        `Scenario ID "${scenario.id}" must be URL-safe kebab-case for SEO URL /scenarios/${scenario.id}`
      );

      // 2. Present in XML Sitemap
      assert.ok(
        sitemapUrls.has(`https://attackexplorer.org/scenarios/${scenario.id}`) ||
          Array.from(sitemapUrls).some((u) =>
            u.endsWith(`/scenarios/${scenario.id}`)
          ),
        `Scenario "${scenario.id}" is missing from app/sitemap.ts output`
      );

      // 3. Valid Schema.org TechArticle + HowTo + BreadcrumbList JSON-LD with >= 3 citations, mentions, keywords, dateModified, and image
      const jsonLd = buildScenarioJsonLd(scenario, 'https://attackexplorer.org');
      const [article, howTo, breadcrumb] = jsonLd['@graph'];
      assert.equal(article['@type'], 'TechArticle');
      assert.ok(
        Array.isArray(article.citation) && article.citation.length >= 3,
        `Scenario "${scenario.id}" must have >= 3 citations in Schema.org TechArticle JSON-LD`
      );
      assert.ok(
        Array.isArray(article.mentions) && article.mentions.length >= 1,
        `Scenario "${scenario.id}" must include Threat Actor / CVE mentions in Schema.org TechArticle JSON-LD`
      );
      assert.ok(
        Array.isArray(article.keywords) && article.keywords.length > 0,
        `Scenario "${scenario.id}" must include keywords in Schema.org TechArticle JSON-LD`
      );
      assert.equal(howTo['@type'], 'HowTo');
      assert.equal(howTo.step.length, scenario.stages.length);
      assert.equal(breadcrumb['@type'], 'BreadcrumbList');
      assert.equal(breadcrumb.itemListElement.length, 4);

      const uiCrumbs = buildScenarioBreadcrumbs(scenario, 'https://attackexplorer.org');
      const standaloneBreadcrumbLd = buildScenarioBreadcrumbJsonLd(
        scenario,
        'https://attackexplorer.org'
      );
      assert.deepEqual(breadcrumb, standaloneBreadcrumbLd);
      assert.equal(uiCrumbs.length, 4);
      assert.equal(
        uiCrumbs[2].name,
        formatAttackCategoryLabel(scenario.category)
      );
      assert.ok(
        !uiCrumbs[2].name.includes('_'),
        `Breadcrumb category label "${uiCrumbs[2].name}" must be human-readable without raw underscores`
      );
      assert.equal(uiCrumbs[3].isCurrent, true);

      // 4. Topic Cluster Lateral Links (getRelatedClusterScenarios returns related scenarios)
      const related = getRelatedClusterScenarios(scenario, 6);
      assert.ok(
        related.length >= 3 && !related.some((r) => r.id === scenario.id),
        `Scenario "${scenario.id}" must resolve related Topic Cluster lateral scenarios`
      );

      // 5. Present in /public/llms-full.txt for AI crawlers (fails if llms-full.txt is not regenerated after adding a scenario)
      assert.ok(
        llmsFullTxt.includes(`/scenarios/${scenario.id}`),
        `Scenario "${scenario.id}" is missing from /public/llms-full.txt — regenerate public/llms-full.txt per docs/scenario-ingestion-and-seo-standard.md`
      );
    }
  });
});
