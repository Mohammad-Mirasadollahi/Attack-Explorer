import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function threeCxBriefingBoard(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 306;
  const h2 = 132;

  const cicd = { id: 'cx0-cicd', x: 40, w: 235 };
  const sideload = { id: 'cx0-sideload', x: cicd.x + cicd.w + ARROW_GAP, w: 255 };
  const github = { id: 'cx0-github', x: sideload.x + sideload.w + ARROW_GAP, w: 250 };

  const stealer = { id: 'cx0-stealer', x: 425, w: 255 };
  const edr = { id: 'cx0-edr', x: stealer.x + stealer.w + ARROW_GAP, w: 255 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'briefing',
    boardBadge: 'TECH BOARD · FULL CHAIN',
    title: '3CXDesktopApp Supply-Chain Attack · Full Chain',
    subtitle: 'Cascading software supply-chain compromise from X_TRADER and EV signing to GitHub .ico C2 and Gopuram.',
    chalkHint: 'Hover any box to inspect signatures, RC4 keys, memory regions, and EDR telemetry.',
    tooltips: {
      'cx0-cicd': {
        kind: 'detect',
        title: 'X_TRADER -> 3CX CI/CD Build Tamper',
        module: 'MITRE T1195.002 · v18.12.407',
        signature: '3CXDesktopApp-18.12.407.msi (Signed=True, Valid 3CX EV Cert)',
        fields: [
          { key: 'pivot', type: 'Origin', value: 'Trading Technologies X_TRADER' },
          { key: 'swapped', type: 'DLLs', value: 'ffmpeg.dll + d3dcompiler_47.dll' },
          { key: 'signed', type: 'Auth', value: 'Genuine 3CX Ltd EV Authenticode' },
        ],
        explain:
          'Lazarus compromised the 3CX build pipeline via an earlier X_TRADER supply-chain breach, injecting trojanized DLLs before genuine code signing.',
      },
      'cx0-sideload': {
        kind: 'memory',
        title: 'ffmpeg.dll -> 0xFEEDFACE -> RC4 RWX',
        module: '3CXDesktopApp.exe (PID 7120) · WKS-TRD-14',
        signature: 'RC4(key="3jB(2bsG#@c7", offset=0xFEEDFACE) -> 0x000001C948200000',
        fields: [
          { key: 'marker', type: 'Hex', value: 'FE ED FA CE (0xFEEDFACE)' },
          { key: 'rc4Key', type: 'String', value: '3jB(2bsG#@c7' },
          { key: 'alloc', type: 'RWX', value: '0x000001C948200000 (MEM_PRIVATE)' },
        ],
        explain:
          'At launch, unsigned ffmpeg.dll reads trailing encrypted shellcode behind 0xFEEDFACE in d3dcompiler_47.dll and executes it in unbacked RWX memory.',
      },
      'cx0-github': {
        kind: 'network',
        title: 'GitHub IconStorages .ico Dead Drop',
        module: 'MITRE T1102.001 · Sysmon EID 22 & 3',
        signature: 'GET raw.githubusercontent.com/IconStorages/images/main/icon12.ico',
        fields: [
          { key: 'delay', type: 'Evasion', value: '7-day dormancy sleep' },
          { key: 'payload', type: 'Stego', value: 'Base64 appended after .ico EOF' },
          { key: 'c2', type: 'TLS 443', value: 'akamaitechcloudservices[.]com' },
        ],
        explain:
          'Rather than hardcoding C2 domains inside the installer, the loader fetches benign-looking GitHub icon files whose EOF bytes decode into live C2 URLs.',
      },
      'cx0-stealer': {
        kind: 'process',
        title: 'ICONICSTEALER & Selective Gopuram',
        module: '0x000001C948280000 · MITRE T1555.003',
        signature: 'ReadFile("Chrome\\User Data\\Default\\Login Data")',
        fields: [
          { key: 'stage1', type: 'Implant', value: 'ICONICSTEALER (Browser creds/history)' },
          { key: 'stage2', type: 'Targeted', value: 'Gopuram backdoor (Crypto/Finance)' },
          { key: 'actor', type: 'Intel', value: 'Lazarus / UNC4736 / Labyrinth Chollima' },
        ],
        explain:
          'ICONICSTEALER harvests browser credentials broadly, allowing operators to push the hands-on-keyboard Gopuram backdoor exclusively to high-value crypto and finance targets.',
      },
      'cx0-edr': {
        kind: 'detect',
        title: 'Multi-Layer Behavioral EDR Detection',
        module: 'Sysmon 7 + 22 + 3 + CrowdStrike Falcon',
        fields: [
          { key: 'eid7', type: 'Image', value: 'Signed host loads unsigned ffmpeg.dll' },
          { key: 'mem', type: 'RAM', value: 'MEM_PRIVATE RWX inside PID 7120' },
          { key: 'edr', type: 'Behavior', value: 'VoIP app reading Chrome Login Data' },
        ],
        explain:
          'Even with a valid EV vendor signature, behavioral detection stops the intrusion via DLL signature mismatch, GitHub dead-drop beacons, and browser vault access.',
      },
      'cx0-sticky': {
        kind: 'note',
        title: 'First Public Cascading Supply-Chain Breach',
        module: 'X_TRADER -> 3CXDesktopApp (March 2023)',
        fields: [
          { key: 'lesson1', type: 'Trust', value: 'Valid EV cert does not prove clean runtime' },
          { key: 'lesson2', type: 'Defense', value: 'Audit child DLLs, RWX pages & egress' },
        ],
        explain:
          'Trusting signed vendor auto-updates blindly fails against CI/CD compromises; defenders must validate runtime behavior regardless of Authenticode status.',
      },
    },
    skeletons: [
      title(40, 12, 'T1195.002 / T1574.002 / T1102.001  3CXDesktopApp Supply-Chain Chain'),
      box({
        id: cicd.id,
        x: cicd.x,
        y: y1,
        w: cicd.w,
        h: h1,
        label: 'X_TRADER -> 3CX CI/CD\nSwap 2 DLLs Pre-Sign\nValid EV MSI 18.12.407',
        stroke: CLEANROOM_CHALK.goldSeal,
        fill: CLEANROOM_CHALK.goldSealFill,
      }),
      ...hArrow({
        id: 'cx0-a1',
        fromId: cicd.id,
        toId: sideload.id,
        fromRight: cicd.x + cicd.w,
        toLeft: sideload.x,
        midY: y1 + h1 / 2,
        caption: 'Auto-Update',
        stroke: CLEANROOM_CHALK.goldSeal,
      }),
      box({
        id: sideload.id,
        x: sideload.x,
        y: y1,
        w: sideload.w,
        h: h1,
        label: 'ffmpeg.dll Sideload\n0xFEEDFACE + RC4 Key\nRWX 0x000001C948200000',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      ...hArrow({
        id: 'cx0-a2',
        fromId: sideload.id,
        toId: github.id,
        fromRight: sideload.x + sideload.w,
        toLeft: github.x,
        midY: y1 + h1 / 2,
        caption: '7-Day Sleep',
        stroke: CLEANROOM_CHALK.cleanroom,
      }),
      box({
        id: github.id,
        x: github.x,
        y: y1,
        w: github.w,
        h: h1,
        label: 'GitHub IconStorages\nicon12.ico EOF Base64\nakamaitechcloudservices',
        stroke: CLEANROOM_CHALK.cleanroom,
        fill: CLEANROOM_CHALK.cleanroomFill,
      }),
      ...vArrow({
        id: 'cx0-a3',
        fromId: sideload.id,
        toId: stealer.id,
        midX: stealer.x + stealer.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Stage-2 Load',
        stroke: CLEANROOM_CHALK.cipher,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cx0-sticky',
        x: 40,
        y: y2,
        w: 345,
        h: h2,
        label:
          'ZERO-TRUST RUNTIME RULE\n1) Sysmon EID 7: unsigned ffmpeg.dll\n2) Unbacked RWX + 0xFEEDFACE\n3) VoIP app reading Chrome Login Data',
      }),
      box({
        id: stealer.id,
        x: stealer.x,
        y: y2,
        w: stealer.w,
        h: h2,
        label: 'ICONICSTEALER\nChrome/Edge Login Data\nSelective Gopuram',
        stroke: CLEANROOM_CHALK.cipher,
        fill: CLEANROOM_CHALK.cipherFill,
      }),
      ...hArrow({
        id: 'cx0-a4',
        fromId: stealer.id,
        toId: edr.id,
        fromRight: stealer.x + stealer.w,
        toLeft: edr.x,
        midY: y2 + h2 / 2,
        caption: 'Behavioral Trip',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: edr.id,
        x: edr.x,
        y: y2,
        w: edr.w,
        h: h2,
        label: 'CrowdStrike EDR Alert\nSigned VoIP Anomaly\nQuarantine PID 7120',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      note(40, 466, 'Hover any box to inspect signatures, RC4 keys, memory regions, and EDR witnesses.', CLEANROOM_CHALK.muted),
    ],
  };
}
