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
    title: 'Original 6 bytes prepare the stack frame and forward to Defender',
    story:
      'All six copper inspection fuses sit cleanly in their sockets, routing every incoming script test straight up to the security watchtower.',
    technical:
      'Clean AmsiScanBuffer prologue: 4C 8B DC 49 89 5B (mov r11, rsp; mov [r11+0x8], rbx) -> MpOav.dll.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Marshal.Copy overwrites all 6 bytes with mov eax, 0x80070057; ret',
    story:
      'The six copper fuses lift out and a solid six-pin brass U-jumper locks into their sockets, short-circuiting the scanner path locally.',
    technical:
      'Marshal.Copy writes B8 57 00 07 80 C3 (mov eax, E_INVALIDARG; ret) into 0x7FF9C2142840.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Incoming scan calls bounce straight back as E_INVALIDARG',
    story:
      'When a test pulse hits the rigged jumper, it bounces straight back as an instant skip while the overhead watchtower wire stays dead dark.',
    technical:
      'AmsiScanBuffer returns HRESULT 0x80070057 on cycle 1; Windows Defender (MpOav.dll) receives zero buffers.',
  },
  {
    id: 3,
    tag: '04',
    title: 'VirtualProtect restores RX (0x20), yet live RAM stays CoW dirty',
    story:
      'The technician swings the blue glass hatch shut again so the cabinet looks sealed, even though comparing against the clean blueprint catches the swap.',
    technical:
      'VirtualProtect restores PAGE_EXECUTE_READ (0x20), but EDR disk-vs-RAM integrity scans detect the 6-byte mismatch.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: '6-BYTE STRIP', transform: 'scale(1.26) translate(-60px, -20px)' },
  { id: 'E_INVALIDARG LOOP', transform: 'scale(1.26) translate(-180px, -70px)' },
  { id: 'RX RE-LOCK', transform: 'scale(1.22) translate(-40px, -110px)' },
];

const ORIG_BYTES = ['4C', '8B', 'DC', '49', '89', '5B'];
const PATCH_BYTES = ['B8', '57', '00', '07', '80', 'C3'];

export function AmsiStep3PatchPrologueClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.patch-cell'), { autoAlpha: 0, y: -38 });
    tl.set(q('.bounce-arrow'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.skip-badge, .relock-bar'), { autoAlpha: 0, y: 12 });
    tl.set(q('.defender-dead'), { autoAlpha: 0 });

    // Beat 0: Original 6 bytes intact
    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: Original 6 bytes lift out, patched 6 bytes drop in
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(
      q('.orig-cell'),
      { autoAlpha: 0.14, y: -44, duration: 0.5, stagger: 0.08, ease: 'power2.in' },
      'beat1'
    );
    tl.to(
      q('.patch-cell'),
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(1.4)' },
      'beat1+=0.35'
    );
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Incoming scan deflects immediately; Defender dark
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.bounce-arrow'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat2');
    tl.to(q('.skip-badge'), { autoAlpha: 1, y: 0, duration: 0.5 }, 'beat2+=0.45');
    tl.to(q('.defender-live'), { autoAlpha: 0.2, duration: 0.45 }, 'beat2+=0.3');
    tl.to(q('.defender-dead'), { autoAlpha: 1, duration: 0.45 }, 'beat2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Re-lock to 0x20 RX
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.relock-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-amsi-step3"
      stageLabel="STEP #3"
      mitreId="T1562.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Marshal.Copy replaces 4C 8B DC 49 89 5B with B8 57 00 07 80 C3 returning E_INVALIDARG so Defender MpOav.dll never runs, then VirtualProtect restores PAGE_EXECUTE_READ"
      >
        <FilmBackdrop prefix="amsi3" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          6-BYTE PROLOGUE PATCH · amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          mov eax, 0x80070057 ; ret
        </text>

        {/* Zoomed 6-Byte Instruction Strip */}
        <g transform="translate(56, 86)">
          <rect width="700" height="260" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.5" />
          <text x="24" y="34" fill="#fbbf24" fontSize="12.5" fontFamily={FONT} fontWeight="800">
            OPENING 6 BYTES OF AmsiScanBuffer (OFFSET +0x00 .. +0x05)
          </text>

          {/* 6 Byte Slots */}
          {ORIG_BYTES.map((b, idx) => (
            <g key={b + idx} transform={`translate(${28 + idx * 108}, 74)`}>
              {/* Original blue fuse byte */}
              <g className="orig-cell">
                <rect width="92" height="104" rx="10" fill="#0c263f" stroke="#38bdf8" strokeWidth="2" />
                <text x="46" y="28" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontFamily={FONT}>
                  +{idx}
                </text>
                <text x="46" y="68" textAnchor="middle" fill="#f8fafc" fontSize="28" fontFamily={FONT} fontWeight="900">
                  {b}
                </text>
                <text x="46" y="92" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily={FONT}>
                  CLEAN
                </text>
              </g>

              {/* Patched amber/red jumper byte */}
              <g className="patch-cell">
                <rect width="92" height="104" rx="10" fill="#450a0a" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="46" y="28" textAnchor="middle" fill="#fde047" fontSize="11" fontFamily={FONT}>
                  PATCH
                </text>
                <text x="46" y="68" textAnchor="middle" fill="#fef08a" fontSize="28" fontFamily={FONT} fontWeight="900">
                  {PATCH_BYTES[idx]}
                </text>
                <text x="46" y="92" textAnchor="middle" fill="#fb7185" fontSize="10" fontFamily={FONT}>
                  {idx === 5 ? 'RET' : 'MOV EAX'}
                </text>
              </g>
            </g>
          ))}

          <text x="24" y="220" fill="#fde047" fontSize="13.5" fontFamily={FONT} fontWeight="700">
            DISASSEMBLY: B8 57 00 07 80 = mov eax, 0x80070057 (E_INVALIDARG)  |  C3 = ret
          </text>
        </g>

        {/* Right: Defender Watchtower Box (Disconnected) */}
        <g transform="translate(812, 86)">
          <rect width="334" height="260" rx="16" fill="#131c2e" stroke="#475569" strokeWidth="2.5" />
          <text x="22" y="34" fill="#94a3b8" fontSize="12" fontFamily={FONT} fontWeight="700">
            ANTIMALWARE PROVIDER
          </text>
          <text x="22" y="70" fill="#f8fafc" fontSize="22" fontFamily={FONT} fontWeight="800">
            MpOav.dll
          </text>
          <text x="22" y="98" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            Windows Defender Engine
          </text>

          <g transform="translate(22, 134)">
            <g className="defender-live">
              <rect width="290" height="84" rx="10" fill="#052e16" stroke="#10b981" strokeWidth="2" />
              <text x="145" y="48" textAnchor="middle" fill="#6ee7b7" fontSize="15" fontFamily={FONT} fontWeight="800">
                WAITING FOR SCAN BUFFER
              </text>
            </g>
          </g>

          <g transform="translate(22, 134)">
            <g className="defender-dead">
              <rect width="290" height="84" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4" />
              <text x="145" y="36" textAnchor="middle" fill="#94a3b8" fontSize="15" fontFamily={FONT} fontWeight="800">
                NEVER INVOKED (BLIND)
              </text>
              <text x="145" y="64" textAnchor="middle" fill="#64748b" fontSize="12" fontFamily={FONT}>
                0 Buffers Reached Watchtower
              </text>
            </g>
          </g>
        </g>

        {/* Short-Circuit Return Loop */}
        <path
          className="bounce-arrow"
          d="M 220 356 C 220 420, 560 420, 560 356"
          fill="none"
          stroke="#facc15"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <g transform="translate(245, 396)">
          <g className="skip-badge">
            <rect width="315" height="44" rx="10" fill="#422006" stroke="#facc15" strokeWidth="2" />
            <text x="157" y="27" textAnchor="middle" fill="#fef08a" fontSize="13.5" fontFamily={FONT} fontWeight="800">
              INSTANT RETURN: E_INVALIDARG
            </text>
          </g>
        </g>

        {/* Bottom Re-Lock & Forensic Proof Bar */}
        <g transform="translate(56, 480)">
          <g className="relock-bar">
            <rect width="1090" height="106" rx="14" fill="#0f2321" stroke="#10b981" strokeWidth="2.5" />
            <text x="24" y="36" fill="#34d399" fontSize="13" fontFamily={FONT} fontWeight="800">
              STEALTH RE-LOCK · VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READ [0x20])
            </text>
            <text x="24" y="72" fill="#e2e8f0" fontSize="14" fontFamily={FONT}>
              Hatch looks sealed (R-X) again, but live private page (B8 57 00 07 80 C3) diverges from signed System32\amsi.dll (4C 8B DC 49 89 5B).
            </text>
          </g>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
