import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function threeCxStep3Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const sleep = { id: 'cx3-sleep', x: 40, w: 235 };
  const gh = { id: 'cx3-gh', x: sleep.x + sleep.w + ARROW_GAP, w: 255 };
  const eof = { id: 'cx3-eof', x: gh.x + gh.w + ARROW_GAP, w: 250 };

  const net = { id: 'cx3-net', x: gh.x, w: 255 };
  const c2 = { id: 'cx3-c2', x: eof.x, w: 250 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'step-3',
    boardBadge: 'STEP #3 · T1102.001',
    title: 'GitHub IconStorages .ico Dead-Drop Resolver & C2 Handoff',
    subtitle: 'After a 7-day dormancy window, PID 7120 parses trailing Base64 past icon12.ico EOF to locate active C2.',
    chalkHint: 'Hover any box to inspect GitHub dead-drop URLs, steganographic EOF layout, and DNS/TLS logs.',
    tooltips: {
      'cx3-sleep': {
        kind: 'process',
        title: '7-Day Dormancy Delay (PID 7120)',
        module: 'Time-Based Sandbox Evasion',
        signature: 'CheckTimestamp(installTime + 7d) -> EnableDeadDrop()',
        fields: [
          { key: 'delay', type: 'Timer', value: '~7 days before first beacon' },
          { key: 'effect', type: 'Evasion', value: 'Evades short detonation sandboxes' },
          { key: 'host', type: 'Process', value: '3CXDesktopApp.exe (Signed)' },
        ],
        explain:
          'Delaying network beacons by roughly a week ensures automated CI checks and initial enterprise pilot tests see zero malicious network traffic.',
      },
      'cx3-gh': {
        kind: 'network',
        title: 'raw.githubusercontent.com/IconStorages',
        module: 'MITRE T1102.001 Dead Drop Resolver',
        signature: 'GET /IconStorages/images/main/icon12.ico HTTPS/1.1',
        fields: [
          { key: 'repo', type: 'GitHub', value: 'IconStorages/images/main/' },
          { key: 'files', type: 'Icons', value: 'icon1.ico through icon16.ico' },
          { key: 'eid22', type: 'Sysmon', value: 'DNS Query raw.githubusercontent.com' },
        ],
        explain:
          'Hosting rotating C2 pointers on GitHub blends initial outbound lookups with normal developer traffic and lets operators swap servers on demand.',
      },
      'cx3-eof': {
        kind: 'memory',
        title: 'Past-EOF Base64 String Extraction',
        module: 'Steganographic Trailer Parsing',
        signature: 'ParseAfterMarker(icon12.ico, "$") -> Base64Decode -> AES/RC4',
        fields: [
          { key: 'front', type: 'ICO', value: 'Valid 00 00 01 00 bitmap image' },
          { key: 'trailer', type: 'EOF', value: 'Trailing $ + Base64 ciphertext' },
          { key: 'result', type: 'URL', value: 'Dynamic Stage-2 C2 endpoint' },
        ],
        explain:
          'Standard image viewers render the valid icon cleanly and ignore extra bytes after EOF, while the implant extracts the hidden Base64 C2 string.',
      },
      'cx3-c2': {
        kind: 'network',
        title: 'akamaitechcloudservices[.]com (TLS 443)',
        module: 'Lazarus Lookalike CDN C2 Infrastructure',
        signature: 'POST https://akamaitechcloudservices[.]com/api/v2/sync',
        fields: [
          { key: 'domain', type: 'C2', value: 'akamaitechcloudservices[.]com' },
          { key: 'masquerade', type: 'Brand', value: 'Imitates Akamai CDN naming' },
          { key: 'eid3', type: 'Sysmon', value: 'TLS 443 from 3CXDesktopApp.exe' },
        ],
        explain:
          'Once decoded, the implant beacons to a typosquatted CDN lookalike domain to transmit host metadata and fetch targeted Stage-2 payloads.',
      },
      'cx3-net': {
        kind: 'detect',
        title: 'Sysmon EID 22 + EID 3 Egress Anomaly',
        module: 'Process-to-Domain Allowlist Violation',
        fields: [
          { key: 'expected', type: 'VoIP', value: 'PBX SIP / 3CX update servers only' },
          { key: 'observed', type: 'Anomaly', value: 'raw.githubusercontent.com -> lookalike C2' },
          { key: 'action', type: 'SOC', value: 'Sinkhole C2 + block IconStorages URLs' },
        ],
        explain:
          'A corporate softphone has zero operational reason to download raw GitHub icon files; process-aware DNS telemetry catches the dead-drop cleanly.',
      },
      'cx3-sticky': {
        kind: 'note',
        title: 'Why Dead-Drop Resolvers Beat Static IOC Lists',
        module: 'Dynamic Infrastructure Rotation',
        fields: [
          { key: 'benefit', type: 'Attacker', value: 'Zero C2 IPs hardcoded in installer' },
          { key: 'counter', type: 'Defender', value: 'Monitor unexpected egress per app' },
        ],
        explain:
          'Because the C2 domain never appeared inside the signed MSI binary, network behavioral baselining by process name is essential.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 3 · GitHub IconStorages .ico Dead-Drop & C2 Handoff'),
      box({
        id: sleep.id,
        x: sleep.x,
        y: y1,
        w: sleep.w,
        h: h1,
        label: '3CXDesktopApp.exe\n7-Day Dormancy Done\nWakes In-Memory Loader',
        stroke: CLEANROOM_CHALK.cleanroom,
        fill: CLEANROOM_CHALK.cleanroomFill,
      }),
      ...hArrow({
        id: 'cx3-a1',
        fromId: sleep.id,
        toId: gh.id,
        fromRight: sleep.x + sleep.w,
        toLeft: gh.x,
        midY: y1 + h1 / 2,
        caption: 'HTTPS GET',
        stroke: CLEANROOM_CHALK.cleanroom,
      }),
      box({
        id: gh.id,
        x: gh.x,
        y: y1,
        w: gh.w,
        h: h1,
        label: 'GitHub IconStorages\nicon12.ico (Valid ICO)\nSysmon EID 22',
        stroke: CLEANROOM_CHALK.goldSeal,
        fill: CLEANROOM_CHALK.goldSealFill,
      }),
      ...hArrow({
        id: 'cx3-a2',
        fromId: gh.id,
        toId: eof.id,
        fromRight: gh.x + gh.w,
        toLeft: eof.x,
        midY: y1 + h1 / 2,
        caption: 'Slice EOF',
        stroke: CLEANROOM_CHALK.cipher,
      }),
      box({
        id: eof.id,
        x: eof.x,
        y: y1,
        w: eof.w,
        h: h1,
        label: 'Past-EOF Base64\nHidden "$" Trailer\nDecodes C2 URL',
        stroke: CLEANROOM_CHALK.cipher,
        fill: CLEANROOM_CHALK.cipherFill,
      }),
      ...vArrow({
        id: 'cx3-a3',
        fromId: eof.id,
        toId: c2.id,
        midX: c2.x + c2.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'TLS 443',
        stroke: CLEANROOM_CHALK.implant,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cx3-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'VOIP PROCESS EGRESS ANOMALY\nWhy is 3CXDesktopApp.exe fetching\nraw.githubusercontent.com/*.ico?',
      }),
      box({
        id: net.id,
        x: net.x,
        y: y2,
        w: net.w,
        h: h2,
        label: 'Sysmon EID 22 + 3\nProcess-Domain Alert\nSinkhole & Isolate',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      ...hArrowLeft({
        id: 'cx3-a4',
        fromId: c2.id,
        toId: net.id,
        fromLeft: c2.x,
        toRight: net.x + net.w,
        midY: y2 + h2 / 2,
        caption: 'DNS + Net',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: c2.id,
        x: c2.x,
        y: y2,
        w: c2.w,
        h: h2,
        label: 'Lazarus C2 Server\nakamaitechcloudservices\nLookalike CDN Relay',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      note(40, 464, 'Hover each box to inspect GitHub IconStorages paths, EOF stego, and C2 telemetry.', CLEANROOM_CHALK.muted),
    ],
  };
}
