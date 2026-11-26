import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function threeCxStep1Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const xtrader = { id: 'cx1-xtrader', x: 40, w: 235 };
  const staging = { id: 'cx1-staging', x: xtrader.x + xtrader.w + ARROW_GAP, w: 255 };
  const press = { id: 'cx1-press', x: staging.x + staging.w + ARROW_GAP, w: 250 };

  const eid7 = { id: 'cx1-eid7', x: staging.x, w: 255 };
  const wks = { id: 'cx1-wks', x: press.x, w: 250 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'step-1',
    boardBadge: 'STEP #1 · T1195.002',
    title: 'Cascading Build Tamper & Genuine EV Authenticode Signing',
    subtitle: 'X_TRADER pivot swaps ffmpeg.dll and d3dcompiler_47.dll prior to 3CX official MSI signing.',
    chalkHint: 'Hover any box to inspect build-pipeline tampering and Sysmon Event ID 7 verification.',
    tooltips: {
      'cx1-xtrader': {
        kind: 'detect',
        title: 'Upstream Breach: X_TRADER Binary',
        module: 'Cascading Supply-Chain Entry (Mandiant)',
        signature: 'Trojanized Trading Technologies X_TRADER -> 3CX Employee Host',
        fields: [
          { key: 'origin', type: 'Vendor', value: 'Trading Technologies X_TRADER' },
          { key: 'implant', type: 'Pivot', value: 'VEILEDSIGNAL -> 3CX Build Network' },
          { key: 'mitre', type: 'ID', value: 'T1195.002 Supply Chain Compromise' },
        ],
        explain:
          'Mandiant documented that attackers first compromised a 3CX employee via a trojanized X_TRADER binary, then pivoted directly into 3CX build servers.',
      },
      'cx1-staging': {
        kind: 'memory',
        title: 'Pre-Signing Build Staging Swap',
        module: 'Two Trojanized Electron Dependencies',
        signature: 'Replace(ffmpeg.dll, d3dcompiler_47.dll) -> BuildDir\\app-18.12.407',
        fields: [
          { key: 'dll1', type: 'Proxy', value: 'ffmpeg.dll (Unsigned sideload loader)' },
          { key: 'dll2', type: 'Carrier', value: 'd3dcompiler_47.dll (+0xFEEDFACE RC4)' },
          { key: 'host', type: 'Clean', value: '3CXDesktopApp.exe untouched' },
        ],
        explain:
          'Leaving 3CXDesktopApp.exe itself unmodified while swapping two bundled DLLs lets the trojan hide inside normal Electron startup loading.',
      },
      'cx1-press': {
        kind: 'detect',
        title: 'Genuine 3CX Ltd EV Code-Signing Certificate',
        module: 'DigiCert Valid Authenticode Chain',
        signature: 'signtool.exe sign /tr EV_CERT 3CXDesktopApp-18.12.407.msi',
        fields: [
          { key: 'package', type: 'MSI', value: '3CXDesktopApp-18.12.407.msi' },
          { key: 'cert', type: 'EV', value: 'Valid 3CX Ltd Authenticode seal' },
          { key: 'delivery', type: 'CDN', value: 'Official 3CX auto-update channel' },
        ],
        explain:
          'Because tampering occurred before signing, the official build pipeline stamped the poisoned installer with a cryptographically valid vendor certificate.',
      },
      'cx1-wks': {
        kind: 'process',
        title: 'WKS-TRD-14 Auto-Update Installation',
        module: '10.10.8.41 · Trading Desk Endpoint',
        signature: 'msiexec.exe -> %LOCALAPPDATA%\\Programs\\3CXDesktopApp\\app-18.12.407\\',
        fields: [
          { key: 'host', type: 'Workstation', value: 'WKS-TRD-14 (10.10.8.41)' },
          { key: 'binary', type: 'Signed', value: '3CXDesktopApp.exe (PID 7120)' },
          { key: 'trust', type: 'Bypass', value: 'SmartScreen & allowlists pass MSI' },
        ],
        explain:
          'Corporate workstations automatically pulled and trusted the signed update, silently landing both tampered DLLs inside the user AppData directory.',
      },
      'cx1-eid7': {
        kind: 'detect',
        title: 'Sysmon Event ID 7 Signature Mismatch',
        module: 'ImageLoaded Verification Control',
        fields: [
          { key: 'hostImg', type: 'Signed', value: '3CXDesktopApp.exe (Signed=true)' },
          { key: 'loaded', type: 'Unsigned', value: 'ffmpeg.dll (Signed=false)' },
          { key: 'rule', type: 'Hunt', value: 'Flag unsigned DLLs in signed apps' },
        ],
        explain:
          'Auditing Sysmon Event ID 7 reveals that while the outer MSI and host EXE carry valid signatures, the sideloaded ffmpeg.dll lacks valid signing.',
      },
      'cx1-sticky': {
        kind: 'note',
        title: 'Supply-Chain Defense Hardening',
        module: 'SBOM, Ephemeral Runners & DLL Signing Checks',
        fields: [
          { key: 'build', type: 'CI/CD', value: 'Isolated ephemeral builders + provenance' },
          { key: 'endpoint', type: 'EDR', value: 'Verify signatures on loaded child DLLs' },
        ],
        explain:
          'Never treat an installer Authenticode stamp as proof that every bundled library is clean; validate module integrity at runtime.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 1 · Cascading Build Compromise & EV Authenticode Signing'),
      box({
        id: xtrader.id,
        x: xtrader.x,
        y: y1,
        w: xtrader.w,
        h: h1,
        label: 'X_TRADER Breach\nUpstream Vendor Pivot\n3CX Build Network',
        stroke: CLEANROOM_CHALK.warn,
        fill: CLEANROOM_CHALK.warnFill,
      }),
      ...hArrow({
        id: 'cx1-a1',
        fromId: xtrader.id,
        toId: staging.id,
        fromRight: xtrader.x + xtrader.w,
        toLeft: staging.x,
        midY: y1 + h1 / 2,
        caption: 'Tamper Build',
        stroke: CLEANROOM_CHALK.implant,
      }),
      box({
        id: staging.id,
        x: staging.x,
        y: y1,
        w: staging.w,
        h: h1,
        label: 'Pre-Sign Staging Swap\nffmpeg.dll (Unsigned)\nd3dcompiler_47.dll',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      ...hArrow({
        id: 'cx1-a2',
        fromId: staging.id,
        toId: press.id,
        fromRight: staging.x + staging.w,
        toLeft: press.x,
        midY: y1 + h1 / 2,
        caption: 'Sign MSI',
        stroke: CLEANROOM_CHALK.goldSeal,
      }),
      box({
        id: press.id,
        x: press.x,
        y: y1,
        w: press.w,
        h: h1,
        label: '3CX EV Signing Press\nv18.12.407.msi\nValid Authenticode',
        stroke: CLEANROOM_CHALK.goldSeal,
        fill: CLEANROOM_CHALK.goldSealFill,
      }),
      ...vArrow({
        id: 'cx1-a3',
        fromId: press.id,
        toId: wks.id,
        midX: wks.x + wks.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'Official CDN',
        stroke: CLEANROOM_CHALK.cleanroom,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cx1-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'WHY SIGNATURES ALONE FAILED\nOuter MSI passed SmartScreen & EV.\nOnly child-DLL audit caught ffmpeg.dll.',
      }),
      box({
        id: eid7.id,
        x: eid7.x,
        y: y2,
        w: eid7.w,
        h: h2,
        label: 'Sysmon Event ID 7\nSigned Host Loads\nUnsigned ffmpeg.dll',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      ...hArrowLeft({
        id: 'cx1-a4',
        fromId: wks.id,
        toId: eid7.id,
        fromLeft: wks.x,
        toRight: eid7.x + eid7.w,
        midY: y2 + h2 / 2,
        caption: 'ImageLoad',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: wks.id,
        x: wks.x,
        y: y2,
        w: wks.w,
        h: h2,
        label: 'WKS-TRD-14 (10.10.8.41)\n3CXDesktopApp.exe\nPID 7120 Launched',
        stroke: CLEANROOM_CHALK.cleanroom,
        fill: CLEANROOM_CHALK.cleanroomFill,
      }),
      note(40, 464, 'Hover each box to inspect X_TRADER origin, EV signing trust, and Sysmon EID 7.', CLEANROOM_CHALK.muted),
    ],
  };
}
