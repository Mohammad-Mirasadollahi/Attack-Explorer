'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { AnimeClipStage, type ClipTimelineApi } from '../../AnimeClipStage';
import { FilmBackdrop } from '../../FilmBackdrop';
import { clipPace } from '../../clipPace';

const FONT = 'ui-monospace, monospace';

const BEATS = [
  {
    id: 0,
    tag: '01',
    title: 'LockBit spawns vssadmin.exe delete shadows /all /quiet',
    story:
      'Before locking a single document, the saboteur fires up the steel shredder aimed straight at all four spinning silver backup reels.',
    technical:
      'lb3_black.exe (PID 6412) launches vssadmin.exe (PID 6504) invoking IVssBackupComponents::DeleteSnapshots.',
  },
  {
    id: 1,
    tag: '02',
    title: 'All Volume Shadow Copy snapshots drop to zero & VSS halts',
    story:
      'Every silver backup reel drops into the shredder blades until the snapshot count reads zero and the safety lamp turns crimson.',
    technical:
      'volsnap.sys discards all copy-on-write diff areas; Windows System EID 7036 logs Volume Shadow Copy -> Stopped.',
  },
  {
    id: 2,
    tag: '03',
    title: 'bcdedit disables Windows Recovery Environment (WinRE)',
    story:
      'A striker slams across the green emergency recovery lever, snapping the handle off so the building cannot self-repair.',
    technical:
      'bcdedit.exe /set {default} recoveryenabled No & bootstatuspolicy ignoreallfailures lock out startup repair.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sysmon EID 1 captures both destructive command lines in plaintext',
    story:
      'Even though every backup reel is shredded, the overhead audit ticker records both sabotage commands verbatim.',
    technical:
      'High-confidence detection: Sysmon EID 1 (vssadmin delete shadows + bcdedit recoveryenabled No) paired with System EID 7036.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'VSS WIPE', transform: 'scale(1.26) translate(-80px, -20px)' },
  { id: 'BCDEDIT', transform: 'scale(1.26) translate(-180px, -110px)' },
  { id: 'SYSMON 1', transform: 'scale(1.24) translate(40px, -110px)' },
];

export function LockbitStep2VssWipeClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.vss-beam, .bcd-beam'), { strokeDasharray: 260, strokeDashoffset: 260 });
    tl.set(q('.snap-wiped, .winre-broken, .sysmon1-banner'), { autoAlpha: 0, y: 10 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.vss-beam'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.snap-intact'), { autoAlpha: 0.18, y: 24, stagger: 0.14, duration: 0.45, ease: 'power2.in' }, 'beat1');
    tl.to(q('.snap-wiped'), { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 'beat1+=0.55');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.bcd-beam'), { strokeDashoffset: 0, duration: clipPace.teach, ease: 'none' }, 'beat2');
    tl.to(q('.winre-intact'), { autoAlpha: 0.18, duration: 0.35 }, 'beat2+=0.45');
    tl.to(q('.winre-broken'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' }, 'beat2+=0.55');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.sysmon1-banner'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lockbit-step2"
      stageLabel="STEP #2"
      mitreId="T1490"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="lb3_black.exe deletes all Volume Shadow Copies via vssadmin and disables WinRE via bcdedit while Sysmon EID 1 logs both commands"
      >
        <FilmBackdrop prefix="lb2" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          INHIBIT SYSTEM RECOVERY · VSS SHADOW WIPE & BCDEDIT SABOTAGE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          FS-CORP-01 · PID 6412 → 6504 / 6540
        </text>

        {/* Parent LockBit Box */}
        <rect x="48" y="210" width="265" height="176" rx="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2.4" />
        <text x="180" y="246" textAnchor="middle" fill="#fecaca" fontSize="15" fontWeight="700" fontFamily={FONT}>
          lb3_black.exe (6412)
        </text>
        <text x="180" y="274" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
          NT AUTHORITY\SYSTEM
        </text>
        <text x="180" y="314" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          1) vssadmin delete shadows /all
        </text>
        <text x="180" y="340" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
          2) bcdedit recoveryenabled No
        </text>

        {/* Beams */}
        <line className="vss-beam" x1="316" y1="250" x2="515" y2="188" stroke="#f97316" strokeWidth="4" />
        <line className="bcd-beam" x1="316" y1="342" x2="515" y2="394" stroke="#ef4444" strokeWidth="4" />

        {/* Upper Target: 4 VSS Snapshots */}
        <rect x="520" y="96" width="628" height="202" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" />
        <text x="546" y="128" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          VOLUME SHADOW COPY STORE (volsnap.sys · 4 SNAPSHOTS)
        </text>

        {[0, 1, 2, 3].map((idx) => (
          <g key={idx} className="snap-intact">
            <rect x={548 + idx * 145} y="150" width="124" height="82" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x={610 + idx * 145} y="185" textAnchor="middle" fill="#e0f2fe" fontSize="13" fontWeight="700" fontFamily={FONT}>
              VSS #{idx + 1}
            </text>
            <text x={610 + idx * 145} y="210" textAnchor="middle" fill="#34d399" fontSize="11" fontFamily={FONT}>
              INTACT
            </text>
          </g>
        ))}

        <g className="snap-wiped">
          <rect x="550" y="246" width="566" height="38" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
          <text x="833" y="270" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
            0 SNAPSHOTS REMAINING · VSS SERVICE STOPPED (SYSTEM EID 7036)
          </text>
        </g>

        {/* Lower Target: Boot Recovery WinRE */}
        <rect x="520" y="324" width="628" height="148" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="2.2" />
        <text x="546" y="356" fill="#6ee7b7" fontSize="13" fontWeight="700" fontFamily={FONT}>
          BOOT CONFIGURATION DATA (BCD · WINDOWS RECOVERY)
        </text>
        <g className="winre-intact">
          <rect x="548" y="376" width="260" height="74" rx="10" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
          <text x="678" y="408" textAnchor="middle" fill="#d1fae5" fontSize="13" fontWeight="700" fontFamily={FONT}>
            recoveryenabled = Yes
          </text>
          <text x="678" y="432" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily={FONT}>
            Startup Repair Available
          </text>
        </g>
        <g className="winre-broken">
          <rect x="842" y="376" width="280" height="74" rx="10" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2.4" />
          <text x="982" y="408" textAnchor="middle" fill="#fecaca" fontSize="13" fontWeight="700" fontFamily={FONT}>
            recoveryenabled = No
          </text>
          <text x="982" y="432" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            bootstatuspolicy ignoreallfailures
          </text>
        </g>

        {/* Sysmon EID 1 Banner */}
        <g className="sysmon1-banner">
          <rect x="190" y="512" width="840" height="86" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="610" y="546" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SYSMON EID 1: Parent lb3_black.exe → vssadmin.exe delete shadows /all /quiet
          </text>
          <text x="610" y="574" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Zero-false-positive ransomware trigger · Correlated with System EID 7036 (VSS Stopped)
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
