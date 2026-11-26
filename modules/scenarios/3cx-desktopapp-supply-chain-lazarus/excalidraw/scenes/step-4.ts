import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function threeCxStep4Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const stealer = { id: 'cx4-stealer', x: 40, w: 240 };
  const browser = { id: 'cx4-browser', x: stealer.x + stealer.w + ARROW_GAP, w: 255 };
  const triage = { id: 'cx4-triage', x: browser.x + browser.w + ARROW_GAP, w: 250 };

  const falcon = { id: 'cx4-falcon', x: browser.x, w: 255 };
  const gopuram = { id: 'cx4-gopuram', x: triage.x, w: 250 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'step-4',
    boardBadge: 'STEP #4 · T1555.003',
    title: 'ICONICSTEALER, Selective Gopuram & Behavioral EDR Alert',
    subtitle: 'Signed VoIP process reads Chrome/Edge Login Data, triggering CrowdStrike Falcon despite valid EV cert.',
    chalkHint: 'Hover any box to inspect credential theft paths, Gopuram targeting, and containment actions.',
    tooltips: {
      'cx4-stealer': {
        kind: 'memory',
        title: 'ICONICSTEALER (0x000001C948280000)',
        module: 'In-Memory Stage-2 Credential Harvester',
        signature: 'MEM_PRIVATE RWX inside 3CXDesktopApp.exe (PID 7120)',
        fields: [
          { key: 'region', type: 'PVOID', value: '0x000001C948280000' },
          { key: 'scope', type: 'Targets', value: 'Chrome, Edge, Brave, Firefox stores' },
          { key: 'stealth', type: 'Design', value: 'Runs in-process with zero child EXE' },
        ],
        explain:
          'ICONICSTEALER executes reflectively inside PID 7120 to collect system UUIDs, domain membership, browsing history, and saved browser passwords.',
      },
      'cx4-browser': {
        kind: 'detect',
        title: 'Chrome & Edge Login Data SQLite Access',
        module: 'MITRE T1555.003 Credentials from Web Browsers',
        signature: 'CreateFileW("%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data")',
        fields: [
          { key: 'db1', type: 'SQLite', value: 'Login Data (DPAPI-protected creds)' },
          { key: 'db2', type: 'SQLite', value: 'History (Reveals crypto/finance role)' },
          { key: 'risk', type: 'Impact', value: 'Session hijack & wallet access' },
        ],
        explain:
          'Reading Login Data and History from a VoIP client provides operators both reusable enterprise credentials and clear victim sector identification.',
      },
      'cx4-triage': {
        kind: 'network',
        title: 'Operator Victim Triage (Crypto & Finance)',
        module: 'Selective High-Value Hands-On Escalation',
        fields: [
          { key: 'broad', type: 'Victims', value: 'Hundreds of thousands got MSI' },
          { key: 'selected', type: 'Subset', value: 'Handful of crypto/finance orgs' },
          { key: 'actor', type: 'APT', value: 'Lazarus / UNC4736 / AppleJeus' },
        ],
        explain:
          'Kaspersky and Mandiant observed that Lazarus filtered mass 3CX beacons and only delivered interactive backdoors to high-value financial targets.',
      },
      'cx4-gopuram': {
        kind: 'process',
        title: 'Gopuram Stage-2 Backdoor',
        module: 'Kaspersky-Attributed Lazarus Implant',
        signature: 'Selective Deployment -> Interactive C2 & Lateral Recon',
        fields: [
          { key: 'name', type: 'Malware', value: 'Gopuram backdoor' },
          { key: 'target', type: 'Host', value: 'WKS-TRD-14 (Trading Desk)' },
          { key: 'goal', type: 'Mission', value: 'Cryptocurrency & treasury theft' },
        ],
        explain:
          'On prioritized finance endpoints like WKS-TRD-14, Gopuram establishes durable interactive access for deeper Active Directory and wallet intrusion.',
      },
      'cx4-falcon': {
        kind: 'detect',
        title: 'CrowdStrike Falcon Behavioral Detection',
        module: 'Cross-Application Credential Access Alert',
        fields: [
          { key: 'signal', type: 'EDR', value: 'Signed VoIP reading Chrome Login Data' },
          { key: 'correlate', type: 'Chain', value: 'Unsigned ffmpeg.dll + RWX + C2' },
          { key: 'response', type: 'IR', value: 'Kill PID 7120, rotate creds, purge MSI' },
        ],
        explain:
          'Behavioral telemetry catches the attack instantly because legitimate softphones never read browser credential vaults or run unbacked RWX shells.',
      },
      'cx4-sticky': {
        kind: 'note',
        title: 'Incident Response Containment Priorities',
        module: 'Supply-Chain Breach Playbook',
        fields: [
          { key: 'step1', type: 'Fleet', value: 'Uninstall 3CXDesktopApp v18.12.407/416' },
          { key: 'step2', type: 'IAM', value: 'Revoke browser sessions & MFA tokens' },
        ],
        explain:
          'Because ICONICSTEALER targets browser stores, responders must purge affected MSI versions fleet-wide and rotate all exposed web sessions.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 4 · ICONICSTEALER, Gopuram & Behavioral EDR Alert'),
      box({
        id: stealer.id,
        x: stealer.x,
        y: y1,
        w: stealer.w,
        h: h1,
        label: 'ICONICSTEALER\n0x000001C948280000\nInside PID 7120',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      ...hArrow({
        id: 'cx4-a1',
        fromId: stealer.id,
        toId: browser.id,
        fromRight: stealer.x + stealer.w,
        toLeft: browser.x,
        midY: y1 + h1 / 2,
        caption: 'ReadFile',
        stroke: CLEANROOM_CHALK.warn,
      }),
      box({
        id: browser.id,
        x: browser.x,
        y: y1,
        w: browser.w,
        h: h1,
        label: 'Chrome / Edge Vault\nLogin Data + History\nMITRE T1555.003',
        stroke: CLEANROOM_CHALK.warn,
        fill: CLEANROOM_CHALK.warnFill,
      }),
      ...hArrow({
        id: 'cx4-a2',
        fromId: browser.id,
        toId: triage.id,
        fromRight: browser.x + browser.w,
        toLeft: triage.x,
        midY: y1 + h1 / 2,
        caption: 'Exfil TLS',
        stroke: CLEANROOM_CHALK.cipher,
      }),
      box({
        id: triage.id,
        x: triage.x,
        y: y1,
        w: triage.w,
        h: h1,
        label: 'Lazarus Triage\nFilter Finance / Crypto\nSelect High-Value',
        stroke: CLEANROOM_CHALK.cipher,
        fill: CLEANROOM_CHALK.cipherFill,
      }),
      ...vArrow({
        id: 'cx4-a3',
        fromId: triage.id,
        toId: gopuram.id,
        midX: gopuram.x + gopuram.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Targeted Push',
        stroke: CLEANROOM_CHALK.implant,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cx4-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'BEHAVIOR BEATS SIGNATURES\nValid EV cert could not hide a VoIP app\nreading Chrome Login Data + RWX RAM.',
      }),
      box({
        id: falcon.id,
        x: falcon.x,
        y: y2,
        w: falcon.w,
        h: h2,
        label: 'CrowdStrike Alert\nVoIP -> Browser Vault\nIsolate & Rotate Creds',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      ...hArrowLeft({
        id: 'cx4-a4',
        fromId: gopuram.id,
        toId: falcon.id,
        fromLeft: gopuram.x,
        toRight: falcon.x + falcon.w,
        midY: y2 + h2 / 2,
        caption: 'EDR Tripwire',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: gopuram.id,
        x: gopuram.x,
        y: y2,
        w: gopuram.w,
        h: h2,
        label: 'Gopuram Backdoor\nWKS-TRD-14 Targeted\nInteractive Stage-2',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      note(40, 464, 'Hover each box to inspect ICONICSTEALER targets, Gopuram escalation, and EDR containment.', CLEANROOM_CHALK.muted),
    ],
  };
}
