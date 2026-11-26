import type { TechnicalBoardDescriptor } from '@/lib/section-excalidraw-registry';
import { VAULT_CHALK } from '../chalk';
import { ARROW_GAP, box, hArrow, note, sticky, title, vArrow } from '../helpers';

export function lockbitStep3Board(): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;

  const iocp = { id: 'lb3-iocp', x: 40, w: 245 };
  const stripe = { id: 'lb3-stripe', x: iocp.x + iocp.w + ARROW_GAP, w: 255 };
  const rsa = { id: 'lb3-rsa', x: stripe.x + stripe.w + ARROW_GAP, w: 245 };

  const shares = { id: 'lb3-shares', x: stripe.x, w: 255 };
  const canary = { id: 'lb3-canary', x: rsa.x, w: 245 };

  return {
    scenarioId: 'ransomware-shadow-wipe',
    sectionKey: 'step-3',
    boardBadge: 'STEP #3 · T1486',
    title: 'High-Speed IOCP Intermittent Encryption (ChaCha20 + RSA-2048)',
    subtitle: '8 asynchronous I/O completion workers encrypt only the first 4 KB-64 KB per file and rename 4,820 files to .lockbit.',
    chalkHint: 'Hover any box to inspect I/O completion mechanics, hybrid key wrapping, and canary traps.',
    tooltips: {
      'lb3-iocp': {
        kind: 'api',
        title: 'CreateIoCompletionPort (8 Worker Threads)',
        module: 'Multi-Core Asynchronous File I/O',
        signature: 'CreateIoCompletionPort(INVALID_HANDLE_VALUE, 0, 0, 8)',
        fields: [
          { key: 'threads', type: 'Pool', value: '8 asynchronous IOCP worker threads' },
          { key: 'flags', type: 'Win32', value: 'FILE_FLAG_OVERLAPPED' },
          { key: 'speed', type: 'Metric', value: '4,820 files locked in 11.4 seconds' },
        ],
        explain:
          'Windows I/O Completion Ports let LockBit saturate NVMe/SAN throughput across all CPU cores without waiting for blocking disk writes, compressing response time to seconds.',
      },
      'lb3-stripe': {
        kind: 'api',
        title: 'First 4 KB-64 KB ChaCha20 Header Stripe',
        module: 'Partial-Header Encryption Strategy',
        signature: 'ChaCha20_XOR(fileBuf[0..0xFFFF], perFileKey256)',
        fields: [
          { key: 'encrypted', type: 'Offset', value: 'First 4 KB-64 KB header per file' },
          { key: 'skipped', type: 'Offset', value: 'Lower ~85% file body untouched' },
          { key: 'result', type: 'Format', value: 'ZIP/PDF/DB/CAD headers destroyed instantly' },
        ],
        explain:
          'Encrypting just the opening 4 KB to 64 KB destroys file headers, ZIP tables, and database B-trees in a fraction of the time required for full-file encryption.',
      },
      'lb3-rsa': {
        kind: 'api',
        title: 'Per-File Key Wrapped by RSA-2048',
        module: 'Hybrid Asymmetric Footer Seal',
        signature: 'RSA2048_Encrypt(attackerPubKey, perFileKey256) -> EOF',
        fields: [
          { key: 'pubKey', type: 'Embedded', value: '2048-bit RSA public key' },
          { key: 'privKey', type: 'Offline', value: 'Held exclusively by operator' },
          { key: 'footer', type: 'NTFS', value: 'Appended to encrypted file tail' },
        ],
        explain:
          'Each file gets a unique symmetric key wrapped with the attacker public RSA key so capturing memory after completion cannot decrypt files.',
      },
      'lb3-shares': {
        kind: 'memory',
        title: 'Finance_Shares, HR_Records & CAD_Archives',
        module: 'Extension .lockbit · Skip OS Core',
        signature: 'MoveFileExW(oldPath, oldPath + ".lockbit")',
        fields: [
          { key: 'targets', type: 'Shares', value: 'D:\\Finance_Shares\\, D:\\HR_Records\\, D:\\CAD_Archives\\' },
          { key: 'ext', type: 'Suffix', value: '.lockbit (4,820 files in 11.4s)' },
          { key: 'excluded', type: 'OS', value: 'C:\\Windows left bootable for note' },
        ],
        explain:
          'LockBit intentionally spares C:\\Windows and system DLLs so FS-CORP-01 stays online to display Restore-My-Files.txt and the ransom wall.',
      },
      'lb3-canary': {
        kind: 'detect',
        title: 'File-Server Canary & Entropy Tripwire',
        module: 'WinSec EID 4663 / EDR Mass-Rename Detection',
        fields: [
          { key: 'signal1', type: 'EDR', value: 'Rapid high-entropy 4 KB-64 KB header writes' },
          { key: 'signal2', type: 'FSRM', value: 'Canary file renamed to *.lockbit' },
          { key: 'action', type: 'Auto', value: 'Kill PID 6412 & cut SMB sessions' },
        ],
        explain:
          'Placing hidden canary files in top-level shares triggers instant host containment the second an automated locker renames them.',
      },
      'lb3-sticky': {
        kind: 'note',
        title: 'Why Intermittent Beats Full-Disk Speed',
        module: 'LockBit 3.0 Throughput Engineering',
        fields: [
          { key: '100MBFile', type: 'Write', value: 'Only 4 KB-64 KB written instead of 100 MB' },
          { key: 'speedup', type: 'Ratio', value: '4,820 files locked in 11.4 seconds' },
        ],
        explain:
          'Intermittent striping makes huge financial databases and CAD archives unusable in milliseconds while generating minimal raw disk write volume.',
      },
    },
    skeletons: [
      title(40, 12, 'Step 3 · High-Speed IOCP Intermittent Encryption'),
      box({
        id: iocp.id,
        x: iocp.x,
        y: y1,
        w: iocp.w,
        h: h1,
        label: 'IOCP Worker Pool\nCreateIoCompletionPort\nOverlapped Async I/O',
        stroke: VAULT_CHALK.crypto,
        fill: VAULT_CHALK.cryptoFill,
      }),
      ...hArrow({
        id: 'lb3-a1',
        fromId: iocp.id,
        toId: stripe.id,
        fromRight: iocp.x + iocp.w,
        toLeft: stripe.x,
        midY: y1 + h1 / 2,
        caption: '4 KB-64 KB',
        stroke: VAULT_CHALK.crypto,
      }),
      box({
        id: stripe.id,
        x: stripe.x,
        y: y1,
        w: stripe.w,
        h: h1,
        label: 'ChaCha20 Stream\nFirst 4 KB-64 KB Sealed\nTail Bytes Skipped',
        stroke: VAULT_CHALK.attacker,
        fill: VAULT_CHALK.attackerFill,
      }),
      ...hArrow({
        id: 'lb3-a2',
        fromId: stripe.id,
        toId: rsa.id,
        fromRight: stripe.x + stripe.w,
        toLeft: rsa.x,
        midY: y1 + h1 / 2,
        caption: 'Wrap Key',
        stroke: VAULT_CHALK.warn,
      }),
      box({
        id: rsa.id,
        x: rsa.x,
        y: y1,
        w: rsa.w,
        h: h1,
        label: 'RSA-2048 Footer\nPer-File Key Wrapped\nOffline Private Key',
        stroke: VAULT_CHALK.warn,
        fill: VAULT_CHALK.warnFill,
      }),
      ...vArrow({
        id: 'lb3-a3',
        fromId: stripe.id,
        toId: shares.id,
        midX: shares.x + shares.w / 2,
        fromBottom: y1 + h1,
        toTop: y2,
        caption: 'MoveFileExW',
        stroke: VAULT_CHALK.attacker,
        captionOffsetX: 16,
      }),
      sticky({
        id: 'lb3-sticky',
        x: 40,
        y: y2,
        w: 350,
        h: h2,
        label:
          'INTERMITTENT ENCRYPTION MATH\n4 KB-64 KB header lock ruins 100 GB DBs\n4,820 files locked in 11.4 seconds',
      }),
      box({
        id: shares.id,
        x: shares.x,
        y: y2,
        w: shares.w,
        h: h2,
        label: 'Finance / HR / CAD\nRenamed *.lockbit\nOS Files Excluded',
        stroke: VAULT_CHALK.vault,
        fill: VAULT_CHALK.vaultFill,
      }),
      ...hArrow({
        id: 'lb3-a4',
        fromId: shares.id,
        toId: canary.id,
        fromRight: shares.x + shares.w,
        toLeft: canary.x,
        midY: y2 + h2 / 2,
        caption: 'Tripwire',
        stroke: VAULT_CHALK.siem,
      }),
      box({
        id: canary.id,
        x: canary.x,
        y: y2,
        w: canary.w,
        h: h2,
        label: 'Canary / FSRM Alert\nMass Rename + Entropy\nAuto-Kill PID 6412',
        stroke: VAULT_CHALK.siem,
        fill: VAULT_CHALK.siemFill,
      }),
      note(40, 464, 'Hover each box to inspect ChaCha20 striping, RSA key wrapping, and canary triggers.', VAULT_CHALK.muted),
    ],
  };
}
