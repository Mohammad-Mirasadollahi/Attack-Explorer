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
    title: 'Breached jump-host pushes lb3_black.exe over SMB ADMIN$',
    story:
      'An armored brass capsule shoots down the left wall conduit from a compromised hallway directly into the archive room wall socket.',
    technical:
      'JUMP-OPS-02 (10.10.15.8) copies lb3_black.exe to \\\\FS-CORP-01\\ADMIN$ over SMB TCP 445 (WinSec EID 5145).',
  },
  {
    id: 1,
    tag: '02',
    title: 'Service Control Manager installs PSEXESVC as NT AUTHORITY\\SYSTEM',
    story:
      'The docked capsule throws the building master power breaker all the way down, granting full unchecked authority over the vault.',
    technical:
      'services.exe (PID 684) registers and starts PSEXESVC (PID 5892) under LocalSystem via remote SVCCTL pipe.',
  },
  {
    id: 2,
    tag: '03',
    title: 'PSEXESVC launches LockBit with operator -pass decryption key',
    story:
      'With master power engaged, the saboteur mechanism wakes inside the records room using its secret key code.',
    technical:
      'PSEXESVC.exe spawns C:\\Windows\\lb3_black.exe -pass 8f91c2a0 (PID 6412) so automated sandboxes cannot detonate it alone.',
  },
  {
    id: 3,
    tag: '04',
    title: 'System Event ID 7045 + WinSec 5145 record the remote service entry',
    story:
      'Up above the room, the archive audit ticker immediately stamps a bright amber witness card recording the unauthorized breaker throw.',
    technical:
      'Correlating System EID 7045 (PSEXESVC) with WinSec EID 5145 (ADMIN$) flags lateral PsExec staging in real time.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'SMB ADMIN$', transform: 'scale(1.24) translate(85px, -20px)' },
  { id: 'PSEXESVC', transform: 'scale(1.28) translate(-110px, -25px)' },
  { id: 'EID 7045', transform: 'scale(1.25) translate(-40px, -110px)' },
];

export function LockbitStep1PsexecClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.smb-wire, .scm-wire'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.psexec-card, .lb3-card, .eid7045-card'), { autoAlpha: 0, y: 12 });
    tl.set(q('.smb-packet'), { autoAlpha: 0, x: -180 });

    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.smb-wire'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to(q('.smb-packet'), { autoAlpha: 1, x: 0, duration: clipPace.travel, ease: 'power2.inOut' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.psexec-card'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.scm-wire'), { strokeDashoffset: 0, duration: clipPace.teach, ease: 'none' }, 'beat2');
    tl.to(q('.lb3-card'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, 'beat2+=0.45');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.eid7045-card'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-lockbit-step1"
      stageLabel="STEP #1"
      mitreId="T1569.002"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="JUMP-OPS-02 stages lb3_black.exe over SMB ADMIN$ and installs PSEXESVC as SYSTEM on FS-CORP-01 logged by Event ID 7045"
      >
        <FilmBackdrop prefix="lb1" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          SMB TCP/445 · REMOTE SERVICE STAGING · PSEXESVC (SYSTEM)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          10.10.15.8 → FS-CORP-01 (10.10.50.14)
        </text>

        {/* Source Jump Host */}
        <rect x="44" y="196" width="250" height="196" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="169" y="232" textAnchor="middle" fill="#fde68a" fontSize="15" fontWeight="700" fontFamily={FONT}>
          JUMP-OPS-02
        </text>
        <text x="169" y="258" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily={FONT}>
          10.10.15.8 · Stolen DA Token
        </text>
        <rect x="64" y="284" width="210" height="82" rx="8" fill="#0f172a" stroke="#475569" />
        <text x="169" y="314" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily={FONT}>
          PsExec.exe \\FS-CORP-01
        </text>
        <text x="169" y="340" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily={FONT}>
          -s -d lb3_black.exe -pass
        </text>

        {/* SMB Wire + Packet */}
        <line className="smb-wire" x1="296" y1="294" x2="508" y2="294" stroke="#f59e0b" strokeWidth="4" />
        <g transform="translate(340, 240)">
          <g className="smb-packet">
            <rect x="0" y="0" width="132" height="36" rx="8" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
            <text x="66" y="22" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="700" fontFamily={FONT}>
              ADMIN$ · TCP 445
            </text>
          </g>
        </g>

        {/* Target File Server Box */}
        <rect x="514" y="156" width="640" height="320" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" strokeDasharray="8 6" />
        <text x="536" y="186" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>
          FS-CORP-01 (10.10.50.14) · WINDOWS FILE SERVER
        </text>

        {/* PSEXESVC Card */}
        <g className="psexec-card">
          <rect x="540" y="218" width="255" height="150" rx="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.2" />
          <text x="667" y="250" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="700" fontFamily={FONT}>
            services.exe → PSEXESVC
          </text>
          <text x="667" y="276" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily={FONT}>
            PID 684 → PID 5892
          </text>
          <text x="667" y="308" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700" fontFamily={FONT}>
            NT AUTHORITY\SYSTEM
          </text>
          <text x="667" y="338" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
            CreateServiceW + StartServiceW
          </text>
        </g>

        <line className="scm-wire" x1="798" y1="294" x2="876" y2="294" stroke="#ef4444" strokeWidth="3.5" />

        {/* lb3_black.exe Card */}
        <g className="lb3-card">
          <rect x="880" y="218" width="250" height="150" rx="12" fill="#450a0a" stroke="#ef4444" strokeWidth="2.4" />
          <text x="1005" y="250" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            lb3_black.exe
          </text>
          <text x="1005" y="276" textAnchor="middle" fill="#fca5a5" fontSize="12" fontFamily={FONT}>
            PID 6412 · SYSTEM
          </text>
          <text x="1005" y="308" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            -pass 8f91c2a0 (Key Guard)
          </text>
          <text x="1005" y="338" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Config & RSA-2048 Unlocked
          </text>
        </g>

        {/* SIEM Witness Bar */}
        <g className="eid7045-card">
          <rect x="290" y="510" width="640" height="86" rx="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2.4" />
          <text x="610" y="544" textAnchor="middle" fill="#f5d0fe" fontSize="14" fontWeight="700" fontFamily={FONT}>
            SIEM WITNESS: System EID 7045 (PSEXESVC) + WinSec EID 5145 (ADMIN$)
          </text>
          <text x="610" y="572" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Lateral SMB executable copy immediately followed by LocalSystem service creation
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
