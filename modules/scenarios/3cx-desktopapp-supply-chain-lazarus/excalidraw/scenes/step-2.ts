import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { CLEANROOM_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, hArrowLeft, note, sticky, title, vArrow } from '../helpers';

export function threeCxStep2Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const host = { id: 'cx2-host', x: 40, w: 235 };
  const d3d = { id: 'cx2-d3d', x: host.x + host.w + ARROW_GAP, w: 255 };
  const rc4 = { id: 'cx2-rc4', x: d3d.x + d3d.w + ARROW_GAP, w: 250 };

  const memscan = { id: 'cx2-scan', x: d3d.x, w: 255 };
  const rwx = { id: 'cx2-rwx', x: rc4.x, w: 250 };

  return {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    sectionKey: 'step-2',
    boardBadge: 'STEP #2 · T1574.002',
    title: 'DLL Sideloading, 0xFEEDFACE Marker & RC4 Unbacked RWX',
    subtitle: 'ffmpeg.dll parses d3dcompiler_47.dll past 0xFEEDFACE and decrypts 312 KB shellcode directly into RWX RAM.',
    chalkHint: 'Hover any box to inspect hex offsets, RC4 key material, and unbacked memory flags.',
    tooltips: {
      'cx2-host': {
        kind: 'process',
        title: '3CXDesktopApp.exe -> ffmpeg.dll',
        module: 'PID 7120 · Electron DLL Sideloading',
        signature: 'LoadLibraryW("%LOCALAPPDATA%\\Programs\\3CXDesktopApp\\app-18.12.407\\ffmpeg.dll")',
        fields: [
          { key: 'pid', type: 'DWORD', value: '7120' },
          { key: 'loader', type: 'DLL', value: 'ffmpeg.dll (Unsigned proxy)' },
          { key: 'mitre', type: 'ID', value: 'T1574.002 DLL Side-Loading' },
        ],
        explain:
          'Electron loads ffmpeg.dll from its local application directory at startup, executing the attacker proxy inside a signed VoIP process.',
      },
      'cx2-d3d': {
        kind: 'memory',
        title: 'd3dcompiler_47.dll · 0xFEEDFACE Sentinel',
        module: 'Mapped at 0x7FF8A1000000 · Appended Overlay',
        signature: 'Seek(d3dcompiler_47.dll, 0xFEEDFACE) -> 312 KB ciphertext',
        fields: [
          { key: 'base', type: 'PVOID', value: '0x7FF8A1000000' },
          { key: 'magic', type: 'Hex', value: 'FE ED FA CE (0xFEEDFACE)' },
          { key: 'blob', type: 'Size', value: '312 KB RC4-encrypted payload' },
        ],
        explain:
          'Keeping real Direct3D compiler code intact up front while hiding encrypted shellcode after 0xFEEDFACE evades simple static signature scans.',
      },
      'cx2-rc4': {
        kind: 'api',
        title: 'RC4 Stream Decryption Engine',
        module: 'Hardcoded 12-Byte Key Inside ffmpeg.dll',
        signature: 'RC4_Crypt(ciphertext, 319488, "3jB(2bsG#@c7")',
        fields: [
          { key: 'cipher', type: 'Algo', value: 'RC4 stream cipher' },
          { key: 'key', type: 'ASCII', value: '3jB(2bsG#@c7' },
          { key: 'disk', type: 'NTFS', value: '0 decrypted bytes written to disk' },
        ],
        explain:
          'Decrypting the payload exclusively in RAM prevents static antivirus file scanners from ever inspecting the cleartext Stage-1 loader on disk.',
      },
      'cx2-rwx': {
        kind: 'memory',
        title: 'Unbacked MEM_PRIVATE RWX Allocation',
        module: 'VirtualAlloc(0x40) @ 0x000001C948200000',
        signature: 'VirtualAlloc(NULL, 0x4E000, MEM_COMMIT|MEM_RESERVE, PAGE_EXECUTE_READWRITE)',
        fields: [
          { key: 'address', type: 'PVOID', value: '0x000001C948200000' },
          { key: 'protect', type: 'DWORD', value: '0x40 PAGE_EXECUTE_READWRITE' },
          { key: 'backing', type: 'Type', value: 'MEM_PRIVATE (No mapped PE file)' },
        ],
        explain:
          'Transferring execution into an unbacked MEM_PRIVATE RWX region launches the Stage-1 implant without spawning any suspicious child process.',
      },
      'cx2-scan': {
        kind: 'detect',
        title: 'Memory Forensics & ETW-Ti Detection',
        module: 'PE-sieve / Moneta / EDR Memory Scan',
        fields: [
          { key: 'ioc1', type: 'YARA', value: '0xFEEDFACE in d3dcompiler_47.dll' },
          { key: 'ioc2', type: 'RAM', value: 'Unbacked RWX executable threads' },
          { key: 'ioc3', type: 'ETW-Ti', value: 'VirtualAlloc RWX by unsigned DLL' },
        ],
        explain:
          'Memory scanners immediately flag executable private memory pages executing code outside any signed image file in PID 7120.',
      },
      'cx2-sticky': {
        kind: 'note',
        title: 'Split-Payload Supply-Chain Evasion',
        module: 'Two-DLL Cooperative Architecture',
        fields: [
          { key: 'dll1', type: 'Code', value: 'ffmpeg.dll holds only tiny RC4 stub' },
          { key: 'dll2', type: 'Data', value: 'd3dcompiler_47.dll holds encrypted blob' },
        ],
        explain:
          'Splitting the stub and encrypted blob across two DLLs defeats single-file sandboxing unless both files are analyzed together.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 2 · DLL Sideloading, 0xFEEDFACE & RC4 RWX Load'),
      box({
        id: host.id,
        x: host.x,
        y: y1,
        w: host.w,
        h: h1,
        label: '3CXDesktopApp.exe\nPID 7120 Sideloads\nffmpeg.dll (Unsigned)',
        stroke: CLEANROOM_CHALK.cleanroom,
        fill: CLEANROOM_CHALK.cleanroomFill,
      }),
      ...hArrow({
        id: 'cx2-a1',
        fromId: host.id,
        toId: d3d.id,
        fromRight: host.x + host.w,
        toLeft: d3d.x,
        midY: y1 + h1 / 2,
        caption: 'Seek Magic',
        stroke: CLEANROOM_CHALK.goldSeal,
      }),
      box({
        id: d3d.id,
        x: d3d.x,
        y: y1,
        w: d3d.w,
        h: h1,
        label: 'd3dcompiler_47.dll\n0x7FF8A1000000\nFE ED FA CE + 312 KB',
        stroke: CLEANROOM_CHALK.goldSeal,
        fill: CLEANROOM_CHALK.goldSealFill,
      }),
      ...hArrow({
        id: 'cx2-a2',
        fromId: d3d.id,
        toId: rc4.id,
        fromRight: d3d.x + d3d.w,
        toLeft: rc4.x,
        midY: y1 + h1 / 2,
        caption: 'RC4 Decrypt',
        stroke: CLEANROOM_CHALK.cipher,
      }),
      box({
        id: rc4.id,
        x: rc4.x,
        y: y1,
        w: rc4.w,
        h: h1,
        label: 'RC4 Stream Cipher\nKey: 3jB(2bsG#@c7\nIn-Memory Only',
        stroke: CLEANROOM_CHALK.cipher,
        fill: CLEANROOM_CHALK.cipherFill,
      }),
      ...vArrow({
        id: 'cx2-a3',
        fromId: rc4.id,
        toId: rwx.id,
        midX: rwx.x + rwx.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'VirtualAlloc',
        stroke: CLEANROOM_CHALK.implant,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'cx2-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'TWO-DLL SPLIT EVASION\nffmpeg.dll = tiny RC4 loader\nd3dcompiler_47.dll = encrypted blob',
      }),
      box({
        id: memscan.id,
        x: memscan.x,
        y: y2,
        w: memscan.w,
        h: h2,
        label: 'EDR / Moneta Alert\nUnbacked RWX Thread\n+ 0xFEEDFACE YARA',
        stroke: CLEANROOM_CHALK.edr,
        fill: CLEANROOM_CHALK.edrFill,
      }),
      ...hArrowLeft({
        id: 'cx2-a4',
        fromId: rwx.id,
        toId: memscan.id,
        fromLeft: rwx.x,
        toRight: memscan.x + memscan.w,
        midY: y2 + h2 / 2,
        caption: 'Memory Hunt',
        stroke: CLEANROOM_CHALK.edr,
      }),
      box({
        id: rwx.id,
        x: rwx.x,
        y: y2,
        w: rwx.w,
        h: h2,
        label: '0x000001C948200000\nMEM_PRIVATE RWX\nStage-1 Shellcode',
        stroke: CLEANROOM_CHALK.implant,
        fill: CLEANROOM_CHALK.implantFill,
      }),
      note(40, 464, 'Hover each box to inspect 0xFEEDFACE layout, RC4 key, and MEM_PRIVATE RWX flags.', CLEANROOM_CHALK.muted),
    ],
  };
}
