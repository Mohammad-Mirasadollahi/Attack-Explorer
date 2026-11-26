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
    title: 'Restore-My-Files.txt written across every encrypted share',
    story:
      'A mechanical placard press bolts bright crimson extortion notices right onto the glass entrance door of every locked wing.',
    technical:
      'lb3_black.exe drops Restore-My-Files.txt inside every affected directory, generating mass Sysmon EID 11 FileCreate telemetry.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Registry override flips desktop wallpaper to LockBit ransom wall',
    story:
      'The welcome monitor above the doorway switches instantly from calm blue operations to a stark crimson lock screen.',
    technical:
      'RegSetValueExW overwrites HKCU\\Control Panel\\Desktop\\Wallpaper with lb3_wall.bmp (captured in Sysmon EID 13).',
  },
  {
    id: 2,
    tag: '03',
    title: 'wevtutil cl Security attempts to erase local forensic logs',
    story:
      'Before leaving, the saboteur fires a wiper pulse straight at the room audit console to destroy all evidence.',
    technical:
      'lb3_black.exe runs wevtutil.exe cl Security and schedules self-deletion to hamper post-incident triage.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Windows automatically writes un-erasable Security EID 1102',
    story:
      'Smashing the local console triggers an un-erasable violet beacon upstairs that proves tampering immediately.',
    technical:
      'Clearing the Security channel forces Windows to emit Event ID 1102 ("The audit log was cleared") directly into the remote SIEM.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SYSMON 11', transform: 'scale(1.25) translate(80px, -25px)' },
  { id: 'WALLPAPER', transform: 'scale(1.26) translate(-110px, -25px)' },
  { id: 'EID 1102', transform: 'scale(1.28) translate(-30px, -110px)' },
];

export function LockbitStep4RansomNoteClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.note-card, .reg-card, .wipe-card, .eid1102-flare'), { autoAlpha: 0, y: 12 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.note-card'), { autoAlpha: 1, y: 0, duration: clipPace.travel, ease: 'power2.out' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.reg-card'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.wipe-card'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.eid1102-flare'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'back.out(1.4)' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lockbit-step4"
      stageLabel="STEP #4"
      mitreId="T1070.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="LockBit drops Restore-My-Files.txt, hijacks desktop wallpaper via registry, and triggers unerasable Security Event ID 1102 via wevtutil cl Security"
      >
        <FilmBackdrop prefix="lb4" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          EXTORTION ARTIFACTS & ANTI-FORENSIC BOOMERANG · EID 11 / 13 / 1102
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          FS-CORP-01 → REMOTE APPEND-ONLY SIEM
        </text>

        {/* Card 1: Sysmon EID 11 Note Drop */}
        <g className="note-card">
          <rect x="52" y="132" width="340" height="250" rx="14" fill="#450a0a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="222" y="170" textAnchor="middle" fill="#fecaca" fontSize="15" fontWeight="700" fontFamily={FONT}>
            1. Restore-My-Files.txt
          </text>
          <text x="222" y="198" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Sysmon Event ID 11 (FileCreate)
          </text>
          <rect x="76" y="220" width="292" height="136" rx="10" fill="#0f172a" stroke="#ef4444" />
          <text x="222" y="252" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily={FONT}>
            D:\Finance_Shares\Restore-My-Files.txt
          </text>
          <text x="222" y="280" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily={FONT}>
            D:\HR_Records\Restore-My-Files.txt
          </text>
          <text x="222" y="308" textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily={FONT}>
            D:\CAD_Archives\Restore-My-Files.txt
          </text>
          <text x="222" y="338" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Personal Victim ID + Tor Portal
          </text>
        </g>

        {/* Card 2: Sysmon EID 13 Wallpaper */}
        <g className="reg-card">
          <rect x="430" y="132" width="340" height="250" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="600" y="170" textAnchor="middle" fill="#fde68a" fontSize="15" fontWeight="700" fontFamily={FONT}>
            2. Wallpaper Override
          </text>
          <text x="600" y="198" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily={FONT}>
            Sysmon Event ID 13 (RegistrySet)
          </text>
          <rect x="454" y="220" width="292" height="136" rx="10" fill="#0f172a" stroke="#f59e0b" />
          <text x="600" y="258" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            HKCU\Control Panel\Desktop
          </text>
          <text x="600" y="288" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700" fontFamily={FONT}>
            Wallpaper = C:\ProgramData\lb3_wall.bmp
          </text>
          <text x="600" y="324" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            Immediate visual extortion lock screen
          </text>
        </g>

        {/* Card 3: wevtutil cl Security */}
        <g className="wipe-card">
          <rect x="808" y="132" width="340" height="250" rx="14" fill="#1e293b" stroke="#a855f7" strokeWidth="2.4" />
          <text x="978" y="170" textAnchor="middle" fill="#f5d0fe" fontSize="15" fontWeight="700" fontFamily={FONT}>
            3. Audit Wipe Attempt
          </text>
          <text x="978" y="198" textAnchor="middle" fill="#c084fc" fontSize="12" fontFamily={FONT}>
            T1070.001 · Clear Event Logs
          </text>
          <rect x="832" y="220" width="292" height="136" rx="10" fill="#0f172a" stroke="#a855f7" />
          <text x="978" y="262" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>
            wevtutil.exe cl Security
          </text>
          <text x="978" y="294" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Attempts to purge local evidence
          </text>
          <text x="978" y="324" textAnchor="middle" fill="#f472b6" fontSize="11" fontFamily={FONT}>
            Triggers mandatory OS Audit Clear Event
          </text>
        </g>

        {/* Un-erasable EID 1102 Banner */}
        <g className="eid1102-flare">
          <rect x="170" y="458" width="860" height="114" rx="14" fill="#3b0764" stroke="#d946ef" strokeWidth="3" />
          <text x="600" y="500" textAnchor="middle" fill="#fae8ff" fontSize="16" fontWeight="700" fontFamily={FONT}>
            UN-ERASABLE SIEM WITNESS: WINDOWS SECURITY EVENT ID 1102
          </text>
          <text x="600" y="532" textAnchor="middle" fill="#fde68a" fontSize="13" fontFamily={FONT}>
            &quot;The audit log was cleared&quot; · Forwarded to Remote SIEM (10.10.99.10) Before Deletion
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
