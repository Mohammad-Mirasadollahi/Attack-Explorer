import { CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title } from '../helpers';
import type { TechnicalBoardDescriptor } from '../types';

export function step5Board(): TechnicalBoardDescriptor {
  const y1 = 90;
  const h1 = 150;
  const y2 = 320;
  const h2 = 140;

  const host = { id: 's5-host', x: 40, w: 290 };
  const c2 = { id: 's5-c2', x: host.x + host.w + ARROW_GAP, w: 340 };
  const fw = { id: 's5-fw', x: c2.x + c2.w + ARROW_GAP, w: 280 };

  return {
    scenarioId: 'process-hollowing',
    sectionKey: 'step-5',
    boardBadge: 'TECH BOARD · STEP #5',
    title: 'HTTPS C2 from hollowed svchost',
    subtitle: 'Trusted path egress with Malleable C2 disguise and SIEM correlation.',
    chalkHint:
      'Hover for network/process structure and a plain explanation of each stage.',
    tooltips: {
      's5-host': {
        kind: 'process',
        title: 'Hollowed svchost.exe',
        module: 'PID 4892 · winhttp.dll',
        signature: 'Process { pathTrusted: true, payloadRunning: true }',
        fields: [
          { key: 'pid', type: 'DWORD', value: '4892' },
          { key: 'path', type: 'string', value: 'System32\\svchost.exe' },
          { key: 'code', type: 'PE', value: 'Beacon in RWX @ 0x00400000' },
          { key: 'stack', type: 'DLL', value: 'loads winhttp.dll' },
        ],
        explain:
          'From the outside this still looks like a Microsoft service host. Inside, Beacon is running and about to open HTTPS using normal Windows HTTP libraries.',
        note: 'Path trust ≠ code trust.',
      },
      's5-c2': {
        kind: 'network',
        title: 'HTTPS C2',
        module: 'Malleable C2 profile',
        signature: 'GET /jquery-3.3.1.min.js  TLS1.3 :443',
        fields: [
          { key: 'dst', type: 'endpoint', value: '185.220.101.42:443' },
          { key: 'uri', type: 'path', value: '/jquery-3.3.1.min.js' },
          { key: 'cookie', type: 'blob', value: 'RSA metadata' },
          { key: 'jitter', type: 'duration', value: '60s ±20%' },
          { key: 'ja3', type: 'hash', value: '72a589da586844d7f0818ce684948eea' },
        ],
        explain:
          'Beacon calls home over TLS and disguises the request as a jQuery download. Alone, the traffic can blend in; joined with the odd host process, it becomes a strong detection.',
        note: 'URI + JA3 + bare svchost = correlate in SIEM.',
      },
      's5-fw': {
        kind: 'note',
        title: 'Host firewall',
        module: 'Allow-list blind spot',
        fields: [
          { key: 'policy', type: 'rule', value: 'allows System32 path' },
          { key: 'blind_spot', type: 'string', value: 'trusts the paint job' },
        ],
        explain:
          'Many host firewalls allow outbound traffic from signed System32 binaries by path. They do not check whether the memory image still matches that file — so hollowed svchost sails through.',
      },
      's5-legit': {
        kind: 'process',
        title: 'Real svchost pattern',
        module: 'Baseline for comparison',
        signature: 'Process { parent, cmdline }',
        fields: [
          { key: 'parent', type: 'string', value: 'services.exe' },
          { key: 'cmdline', type: 'string', value: '-k <ServiceGroup>' },
          { key: 'this_one', type: 'string', value: 'has neither' },
        ],
        explain:
          'Healthy svchost almost always has services.exe as parent and a -k group on the command line. This hollowed copy has neither — a cheap filter before deep memory work.',
      },
      's5-det': {
        kind: 'detect',
        title: 'Host + network join',
        module: 'Sysmon EID 3 + Suricata',
        fields: [
          { key: 'sysmon', type: 'EID', value: '3 NetworkConnect' },
          { key: 'dst', type: 'endpoint', value: '185.220.101.42:443' },
          { key: 'ja3', type: 'hash', value: '72a589da…' },
          { key: 'uri', type: 'path', value: '/jquery-3.3.1.min.js' },
        ],
        explain:
          'Join the host row (weird svchost) with the network row (this IP / JA3 / URI). Separately they are weak; together they tell the full hollowing egress story.',
      },
      's5-sticky': {
        kind: 'note',
        title: 'Correlation tip',
        module: 'Teaching note',
        fields: [
          { key: 'host', type: 'string', value: 'bare svchost (no -k)' },
          { key: 'net', type: 'string', value: 'odd JA3 + URI' },
        ],
        explain:
          'Do not alert on “svchost used HTTPS” alone. Alert when an abnormal svchost lineage talks to an abnormal C2 fingerprint.',
      },
    },
    skeletons: [
      title(40, 12, 'Step #5  ·  Outbound Beacon (C2)'),
      box({
        id: host.id,
        x: host.x,
        y: y1,
        w: host.w,
        h: h1,
        label:
          'Hollowed svchost.exe\nPID 4892\npath-trusted binary\nloads winhttp.dll',
        stroke: CHALK.attacker,
        fill: CHALK.attackerFill,
      }),
      ...hArrow({
        id: 's5-a1',
        fromId: host.id,
        toId: c2.id,
        fromRight: host.x + host.w,
        toLeft: c2.x,
        midY: y1 + h1 / 2,
        caption: 'TLS 1.3  :443',
        stroke: CHALK.ok,
      }),
      box({
        id: c2.id,
        x: c2.x,
        y: y1,
        w: c2.w,
        h: h1,
        label:
          'C2 185.220.101.42:443\nGET /jquery-3.3.1.min.js\nCookie = RSA metadata\n60s ±20% jitter',
        stroke: CHALK.ink,
        fill: '#f8fafc',
      }),
      box({
        id: fw.id,
        x: fw.x,
        y: y1,
        w: fw.w,
        h: h1,
        label:
          'Host firewall\nallows System32 path\n(trusts the paint job)',
        stroke: CHALK.ghost,
        fill: '#f1f5f9',
      }),
      box({
        id: 's5-legit',
        x: 40,
        y: y2,
        w: 360,
        h: h2,
        label:
          'Real svchost pattern\nParent: services.exe\nCmd: -k <ServiceGroup>\n(this one has neither)',
        stroke: CHALK.trusted,
        fill: CHALK.trustedFill,
      }),
      box({
        id: 's5-det',
        x: 440,
        y: y2,
        w: 480,
        h: h2,
        label:
          'Detect: Sysmon EID 3 + Suricata\nbare svchost → 185.220.101.42:443\nJA3 72a589da586844d7f0818ce684948eea\nURI /jquery-3.3.1.min.js',
        stroke: CHALK.ok,
        fill: CHALK.okFill,
      }),
      sticky({
        id: 's5-sticky',
        x: 960,
        y: y2,
        w: 280,
        h: h2,
        label:
          'NOTE\nSame license plate.\nWrong route.\nSIEM joins host\n+ network rows.',
      }),
      note(
        40,
        490,
        'Hover a node → software card + plain “What this means”.',
        CHALK.muted
      ),
    ],
  };
}
