'use client';

import { useCallback } from 'react';
import gsap from 'gsap';
import { AnimeClipStage, type ClipTimelineApi } from '../AnimeClipStage';
import { FilmBackdrop } from '../FilmBackdrop';
import { clipPace } from '../clipPace';

const FONT = 'ui-monospace, monospace';

const BEATS = [
  {
    id: 0,
    tag: '01',
    title: 'The hollowed host loads the native networking library under its signed path',
    story:
      'Running inside the trusted system process, the hidden implant loads the operating system’s own web client library so its network calls look routine.',
    technical:
      'Hollowed C:\\Windows\\System32\\svchost.exe (PID 4892) loads winhttp.dll (WinHttpOpen / WinHttpConnect) to initiate TLS 1.3 egress.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The path-based host firewall checks only the filename and lifts the gate',
    story:
      'A path scanner inspects the process’s official file path without checking its memory contents. Because the path matches a trusted system host, the barrier rises.',
    technical:
      'Host application firewall permits signed System32\\svchost.exe outbound to TCP/443 through perimeter NAT — blind to hollowed RAM.',
  },
  {
    id: 2,
    tag: '03',
    title: 'A disguised web request crosses the wire and brings back encrypted tasking',
    story:
      'An encrypted web request disguised as a routine script download slides open mid-wire to reveal stolen host metadata inside its cookie, then receives encrypted orders on a jittered timer.',
    technical:
      'TLS 1.3 GET /jquery-3.3.1.min.js → 185.220.101.42:443 (RSA metadata in Cookie); C2 returns HTTP 200 OK (application/javascript, AES tasking, 60s ±20% jitter).',
  },
  {
    id: 3,
    tag: '04',
    title: 'Process lineage correlation exposes the bare command line and wrong parent',
    story:
      'Side-by-side comparison plates show what a real system host looks like versus this connection: the starter program does not match and the service group option is missing.',
    technical:
      'Expected: services.exe → svchost.exe -k <ServiceGroup>. Observed: Invoice_Q4.exe (PID 3104) → bare svchost.exe (PID 4892).',
  },
  {
    id: 4,
    tag: '05',
    title: 'Network telemetry and IDS fingerprint the TLS handshake',
    story:
      'A monitoring sensor sweeps the encrypted handshake and pairs the outbound connection record with the exact Cobalt Strike handshake fingerprint.',
    technical:
      'Sysmon EID 3 (NetworkConnect: svchost.exe → 185.220.101.42:443) + Suricata IDS JA3 72a589da586844d7f0818ce684948eea.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'GATE', transform: 'scale(1.42) translate(16%, 8%)' },
  { id: 'WIRE', transform: 'scale(1.38) translate(-4%, 8%)' },
  { id: 'SIEM', transform: 'scale(1.36) translate(-12%, -12%)' },
];

export default function Step5BeaconClip() {
  const build = useCallback(({ q, setBeat }: ClipTimelineApi) => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    gsap.set(q('.winhttp-mod'), { y: 18, autoAlpha: 0 });
    gsap.set(q('.path-laser'), { scaleY: 0, transformOrigin: '50% 0%', autoAlpha: 0 });
    gsap.set(q('.gate-arm'), { rotate: 0, svgOrigin: '374 176' });
    gsap.set(q('.allow-pill'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
    gsap.set(q('.blind-note'), { autoAlpha: 0, y: 6 });
    gsap.set(q('.wire-out'), { strokeDashoffset: 500 });
    gsap.set(q('.wire-in'), { strokeDashoffset: 500 });
    gsap.set(q('.req-packet'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.req-sleeve'), { scaleY: 1, transformOrigin: '50% 0%', autoAlpha: 1 });
    gsap.set(q('.req-secret'), { autoAlpha: 0 });
    gsap.set(q('.resp-packet'), { x: 0, autoAlpha: 0 });
    gsap.set(q('.jitter-clock'), { autoAlpha: 0, scale: 0.85, transformOrigin: '50% 50%' });
    gsap.set(q('.clock-hand'), { rotate: 0, svgOrigin: '600 84' });
    gsap.set(q('.bad-lineage'), { autoAlpha: 0, x: 14 });
    gsap.set(q('.mismatch-x'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
    gsap.set(q('.radar-arc'), { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' });
    gsap.set(q('.ids-card'), { autoAlpha: 0, y: 10 });
    gsap.set(q('.log-line'), { autoAlpha: 0, x: -8 });

    const log = (sel: string, at: string | number) =>
      tl.to(q(sel), { autoAlpha: 1, x: 0, duration: 0.35 }, at);

    // Beat 0: svchost.exe loads winhttp.dll
    tl.addLabel('beat0', 0);
    tl.call(() => setBeat(0), [], 'beat0');
    tl.set(q('.winhttp-mod'), { autoAlpha: 1 }, 'beat0');
    tl.to(q('.winhttp-mod'), { y: 0, duration: clipPace.travel, ease: 'back.out(1.4)' }, 'beat0');
    log('.log-0', 'beat0+=0.85');
    tl.to({}, { duration: clipPace.hold });

    // Beat 1: Firewall path laser scans path only -> barrier arm rises -> ALLOW TCP/443
    tl.addLabel('beat1');
    tl.call(() => setBeat(1), [], 'beat1');
    tl.set(q('.path-laser'), { autoAlpha: 1 }, 'beat1');
    tl.to(q('.path-laser'), { scaleY: 1, duration: 0.65, ease: 'none' }, 'beat1');
    tl.to(q('.path-laser'), { autoAlpha: 0, duration: 0.25 }, 'beat1+=0.8');
    tl.to(q('.gate-arm'), { rotate: -68, duration: clipPace.teach, ease: 'power2.inOut' }, 'beat1+=0.45');
    tl.to(q('.allow-pill'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 'beat1+=1.55');
    tl.to(q('.blind-note'), { autoAlpha: 1, y: 0, duration: 0.55 }, 'beat1+=1.75');
    log('.log-1', 'beat1+=1.85');
    tl.to({}, { duration: clipPace.hold });

    // Beat 2: Outbound Malleable C2 request crosses wire, sleeve peels off, 200 OK AES tasking returns + jitter clock ticks
    tl.addLabel('beat2');
    tl.call(() => setBeat(2), [], 'beat2');
    tl.to(q('.wire-out'), { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 'beat2');
    tl.set(q('.req-packet'), { autoAlpha: 1, x: 0 }, 'beat2');
    tl.to(q('.req-packet'), { x: 120, duration: 0.95, ease: 'power2.out' }, 'beat2');
    tl.to(q('.req-sleeve'), { scaleY: 0, autoAlpha: 0, duration: clipPace.teach, ease: 'power2.inOut' }, 'beat2+=1.0');
    tl.to(q('.req-secret'), { autoAlpha: 1, duration: 0.55 }, 'beat2+=1.55');
    tl.to(q('.req-packet'), { x: 256, duration: 0.9, ease: 'power2.in' }, 'beat2+=2.9');
    tl.to(q('.wire-in'), { strokeDashoffset: 0, duration: 0.9, ease: 'none' }, 'beat2+=3.65');
    tl.set(q('.resp-packet'), { autoAlpha: 1, x: 0 }, 'beat2+=3.7');
    tl.to(q('.resp-packet'), { x: -245, duration: clipPace.travel, ease: 'power2.inOut' }, 'beat2+=3.7');
    tl.to(q('.jitter-clock'), { autoAlpha: 1, scale: 1, duration: 0.5 }, 'beat2+=3.8');
    tl.to(q('.clock-hand'), { rotate: 240, duration: 1.4, ease: 'power1.inOut' }, 'beat2+=4.0');
    log('.log-2', 'beat2+=2.1');
    tl.to({}, { duration: clipPace.hold });

    // Beat 3: Parent lineage comparison flags bare svchost.exe
    tl.addLabel('beat3');
    tl.call(() => setBeat(3), [], 'beat3');
    tl.set(q('.bad-lineage'), { autoAlpha: 1 }, 'beat3');
    tl.to(q('.bad-lineage'), { x: 0, duration: 0.75, ease: 'power2.out' }, 'beat3');
    tl.to(q('.mismatch-x'), { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'back.out(1.8)' }, 'beat3+=0.55');
    log('.log-3', 'beat3+=0.8');
    tl.to({}, { duration: clipPace.hold });

    // Beat 4: Suricata IDS + Sysmon EID 3 radar sweeps TLS handshake -> full JA3 fingerprint
    tl.addLabel('beat4');
    tl.call(() => setBeat(4), [], 'beat4');
    tl.set(q('.ids-card'), { autoAlpha: 1 }, 'beat4');
    tl.to(q('.ids-card'), { y: 0, duration: 0.65, ease: 'power2.out' }, 'beat4');
    tl.to(
      q('.radar-arc'),
      { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.35, ease: 'power2.out' },
      'beat4+=0.2'
    );
    log('.log-4', 'beat4+=0.8');
    tl.to({}, { duration: clipPace.end });

    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-step5"
      stageLabel="STEP #5"
      mitreId="T1071.001"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg
        viewBox="0 0 1200 640"
        className="block h-full w-full"
        role="img"
        aria-label="Hollowed svchost.exe loads winhttp.dll, passes path-based host firewall to TCP/443, sends Malleable C2 GET /jquery-3.3.1.min.js to 185.220.101.42:443, receives HTTP 200 OK AES tasking, and is caught by Sysmon EID 3 and Suricata JA3"
      >
        <FilmBackdrop prefix="s5" />

        {/* Header */}
        <text className="clip-label" x="28" y="28" fill="#94a3b8" fontSize="11.5" fontFamily={FONT} letterSpacing="0.14em">
          HOST FIREWALL BYPASS → MALLEABLE HTTPS C2 → EID 3 + JA3
        </text>
        <text x="1172" y="28" textAnchor="end" fill="#64748b" fontSize="11.5" fontFamily={FONT}>
          TLS 1.3 · TCP/443 · 60s ±20% Jitter
        </text>

        {/* Left: Hollowed svchost.exe Host */}
        <rect x="28" y="48" width="238" height="240" rx="12" fill="#0d1526" stroke="#e2e8f0" strokeWidth="1.75" />
        <rect x="28" y="48" width="238" height="30" rx="12" fill="#1e293b" />
        <text x="147" y="68" textAnchor="middle" fill="#f8fafc" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          HOLLOWED PROCESS
        </text>
        <text x="147" y="102" textAnchor="middle" fill="#f8fafc" fontSize="15" fontFamily={FONT} fontWeight="700">
          svchost.exe
        </text>
        <text x="147" y="122" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily={FONT}>
          PID 4892 · TID 4896
        </text>

        <rect x="44" y="136" width="206" height="40" rx="6" fill="#052e16" stroke="#4ade80" />
        <text x="147" y="152" textAnchor="middle" fill="#86efac" fontSize="9.5" fontFamily={FONT} fontWeight="700">
          SIGNED FILE PATH
        </text>
        <text x="147" y="168" textAnchor="middle" fill="#dcfce7" fontSize="10.5" fontFamily={FONT}>
          System32\svchost.exe
        </text>

        <rect x="44" y="186" width="206" height="32" rx="6" fill="#4c0519" stroke="#fb7185" />
        <text x="147" y="206" textAnchor="middle" fill="#fecdd3" fontSize="10.5" fontFamily={FONT} fontWeight="700">
          LIVE RAM: Beacon @ 0x4014A0
        </text>

        <g className="winhttp-mod">
          <rect x="44" y="228" width="206" height="44" rx="7" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
          <text x="147" y="247" textAnchor="middle" fill="#e0e7ff" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            + winhttp.dll LOADED
          </text>
          <text x="147" y="263" textAnchor="middle" fill="#a5b4fc" fontSize="9.5" fontFamily={FONT}>
            WinHttpOpen · WinHttpConnect
          </text>
        </g>

        {/* Station 2: Host Application Firewall Gate */}
        <rect x="288" y="48" width="146" height="240" rx="12" fill="#0b1322" stroke="#fbbf24" strokeWidth="1.75" />
        <text x="361" y="70" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT} fontWeight="700">
          HOST FIREWALL
        </text>
        <text x="361" y="86" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily={FONT}>
          Path Allowlist
        </text>

        {/* Optical Path-Only Scan Laser */}
        <rect className="path-laser" x="302" y="96" width="118" height="46" rx="5" fill="#fbbf24" opacity="0.28" />

        {/* Barrier Post & Rotating Gate Arm */}
        <rect x="368" y="168" width="12" height="58" rx="3" fill="#475569" />
        <g className="gate-arm">
          <rect x="300" y="170" width="80" height="12" rx="4" fill="#fbbf24" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="316" y1="170" x2="324" y2="182" stroke="#0f172a" strokeWidth="3" />
          <line x1="336" y1="170" x2="344" y2="182" stroke="#0f172a" strokeWidth="3" />
          <line x1="356" y1="170" x2="364" y2="182" stroke="#0f172a" strokeWidth="3" />
        </g>
        <circle cx="374" cy="176" r="5" fill="#e2e8f0" />

        <g className="allow-pill">
          <rect x="302" y="226" width="118" height="24" rx="5" fill="#052e16" stroke="#4ade80" />
          <text x="361" y="242" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT} fontWeight="700">
            ALLOW TCP/443
          </text>
        </g>
        <g className="blind-note">
          <text x="361" y="272" textAnchor="middle" fill="#fcd34d" fontSize="9.5" fontFamily={FONT}>
            checks path only
          </text>
        </g>

        {/* Encrypted TLS 1.3 Highway (Outbound + Inbound) */}
        <g className="jitter-clock">
          <rect x="572" y="64" width="214" height="40" rx="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="600" cy="84" r="13" fill="#020617" stroke="#fde68a" strokeWidth="1.75" />
          <line className="clock-hand" x1="600" y1="84" x2="600" y2="74" stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
          <text x="622" y="81" fill="#fef3c7" fontSize="11" fontFamily={FONT} fontWeight="700">
            BEACON SLEEP TIMER
          </text>
          <text x="622" y="96" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>
            60s ± 20% random jitter
          </text>
        </g>

        {/* Outbound Wire */}
        <path d="M 434 156 H 910" fill="none" stroke="#1e293b" strokeWidth="4" />
        <path
          className="wire-out"
          d="M 434 156 H 910"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="500"
          markerEnd="url(#s5-arrow-cyan)"
        />
        <text x="674" y="132" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily={FONT}>
          OUTBOUND · TLS 1.3 HTTPS via Perimeter NAT
        </text>

        {/* Outbound Malleable C2 Packet with Peelable jQuery Sleeve */}
        <g transform="translate(442, 138)">
          <g className="req-packet cutaway-guts">
            <rect width="214" height="44" rx="7" fill="#3b0718" stroke="#fb7185" strokeWidth="1.75" />
            <g className="req-secret">
              <text x="107" y="18" textAnchor="middle" fill="#fecdd3" fontSize="10.5" fontFamily={FONT} fontWeight="700">
                COVERT BEACON CHECK-IN
              </text>
              <text x="107" y="34" textAnchor="middle" fill="#fde68a" fontSize="10" fontFamily={FONT}>
                Cookie: RSA Host Metadata
              </text>
            </g>
            <g className="req-sleeve">
              <rect width="214" height="44" rx="7" fill="#e2e8f0" stroke="#38bdf8" strokeWidth="1.75" />
              <text x="107" y="18" textAnchor="middle" fill="#0f172a" fontSize="10.5" fontFamily={FONT} fontWeight="700">
                GET /jquery-3.3.1.min.js
              </text>
              <text x="107" y="34" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily={FONT}>
                Malleable C2 Script Disguise
              </text>
            </g>
          </g>
        </g>

        {/* Inbound Tasking Wire */}
        <path d="M 914 238 H 438" fill="none" stroke="#1e293b" strokeWidth="4" />
        <path
          className="wire-in"
          d="M 914 238 H 438"
          fill="none"
          stroke="#fb7185"
          strokeWidth="2.5"
          strokeDasharray="500"
          markerEnd="url(#s5-arrow-rose)"
        />
        <text x="674" y="274" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily={FONT}>
          INBOUND RESPONSE · HTTP 200 OK (application/javascript)
        </text>

        {/* Return Tasking Packet */}
        <g transform="translate(690, 218)">
          <g className="resp-packet cutaway-guts">
            <rect width="210" height="40" rx="7" fill="#4c0519" stroke="#fbbf24" strokeWidth="1.75" />
            <text x="105" y="17" textAnchor="middle" fill="#fef3c7" fontSize="10.5" fontFamily={FONT} fontWeight="700">
              HTTP 200 OK · app/js
            </text>
            <text x="105" y="32" textAnchor="middle" fill="#fda4af" fontSize="10" fontFamily={FONT}>
              AES-Encrypted Tasking
            </text>
          </g>
        </g>

        {/* Right: External C2 Server */}
        <rect x="916" y="48" width="256" height="240" rx="12" fill="#350816" stroke="#fb7185" strokeWidth="2" />
        <rect x="916" y="48" width="256" height="30" rx="12" fill="#881337" />
        <text x="1044" y="68" textAnchor="middle" fill="#ffe4e6" fontSize="11.5" fontFamily={FONT} fontWeight="700">
          ATTACKER C2 TEAMSERVER
        </text>
        <text x="1044" y="110" textAnchor="middle" fill="#fff1f2" fontSize="17" fontFamily={FONT} fontWeight="700">
          185.220.101.42
        </text>
        <text x="1044" y="132" textAnchor="middle" fill="#fda4af" fontSize="12.5" fontFamily={FONT} fontWeight="700">
          TCP / 443 · TLS 1.3
        </text>
        <rect x="934" y="152" width="220" height="52" rx="7" fill="#1f0710" stroke="#be123c" />
        <text x="1044" y="172" textAnchor="middle" fill="#fecdd3" fontSize="10.5" fontFamily={FONT} fontWeight="700">
          Malleable C2 Profile
        </text>
        <text x="1044" y="191" textAnchor="middle" fill="#fda4af" fontSize="10.5" fontFamily={FONT}>
          /jquery-3.3.1.min.js
        </text>
        <rect x="934" y="216" width="220" height="54" rx="7" fill="#1f0710" stroke="#fbbf24" />
        <text x="1044" y="237" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT} fontWeight="700">
          Non-Microsoft External ASN
        </text>
        <text x="1044" y="256" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily={FONT}>
          Replies 200 OK · AES Tasking
        </text>

        {/* Bottom Correlation Row: Lineage Comparator + Suricata / Sysmon EID 3 */}
        <rect x="28" y="310" width="276" height="114" rx="10" fill="#052e16" stroke="#4ade80" strokeWidth="1.5" />
        <text x="44" y="334" fill="#86efac" fontSize="10.5" fontFamily={FONT} fontWeight="700">
          EXPECTED NORMAL SVCHOST
        </text>
        <text x="44" y="362" fill="#dcfce7" fontSize="12.5" fontFamily={FONT} fontWeight="700">
          Parent: services.exe
        </text>
        <text x="44" y="386" fill="#bbf7d0" fontSize="12" fontFamily={FONT}>
          Cmd: svchost.exe -k netsvcs
        </text>
        <text x="44" y="408" fill="#4ade80" fontSize="10.5" fontFamily={FONT}>
          Valid service group flag
        </text>

        <g className="mismatch-x">
          <circle cx="332" cy="367" r="20" fill="#7f1d1d" stroke="#fecdd3" strokeWidth="2" filter="url(#s5-soft-glow)" />
          <path d="M 322 357 L 342 377 M 342 357 L 322 377" stroke="#fecdd3" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g className="bad-lineage">
          <rect x="360" y="310" width="280" height="114" rx="10" fill="#4c0519" stroke="#fb7185" strokeWidth="2" />
          <text x="376" y="334" fill="#fda4af" fontSize="10.5" fontFamily={FONT} fontWeight="700">
            OBSERVED HOLLOWED HOST
          </text>
          <text x="376" y="362" fill="#ffe4e6" fontSize="12.5" fontFamily={FONT} fontWeight="700">
            Parent: Invoice_Q4.exe
          </text>
          <text x="376" y="386" fill="#fecdd3" fontSize="12" fontFamily={FONT}>
            Cmd: bare svchost.exe (NO -k)
          </text>
          <text x="376" y="408" fill="#fb7185" fontSize="10.5" fontFamily={FONT}>
            High-confidence SIEM anomaly
          </text>
        </g>

        {/* Suricata IDS + Sysmon EID 3 Card with Full Untruncated JA3 */}
        <g className="ids-card">
          <rect x="662" y="310" width="510" height="114" rx="10" fill="#2e1705" stroke="#fbbf24" strokeWidth="2" filter="url(#s5-soft-glow)" />
          {/* Radar Arcs */}
          <circle cx="702" cy="367" r="8" fill="#fbbf24" />
          <circle className="radar-arc" cx="702" cy="367" r="18" fill="none" stroke="#fde68a" strokeWidth="1.75" opacity="0.7" />
          <circle className="radar-arc" cx="702" cy="367" r="28" fill="none" stroke="#fbbf24" strokeWidth="1.25" opacity="0.45" />

          <text x="744" y="336" fill="#fde68a" fontSize="12" fontFamily={FONT} fontWeight="700">
            SYSMON EID 3 + SURICATA IDS CORRELATION
          </text>
          <text x="744" y="362" fill="#fef3c7" fontSize="11.5" fontFamily={FONT}>
            NetworkConnect: svchost.exe (4892) → 185.220.101.42:443
          </text>
          <rect x="744" y="376" width="412" height="32" rx="6" fill="#0f172a" stroke="#fbbf24" />
          <text x="950" y="397" textAnchor="middle" fill="#fde68a" fontSize="11.5" fontFamily={FONT} fontWeight="700">
            JA3: 72a589da586844d7f0818ce684948eea
          </text>
        </g>

        {/* Event Log */}
        <text className="clip-label" x="28" y="454" fill="#475569" fontSize="10" fontFamily={FONT} letterSpacing="0.14em">
          NETWORK &amp; SIEM CORRELATION TRACE
        </text>
        {[
          ['log-0', 'Hollowed svchost.exe (PID 4892) loads winhttp.dll under signed System32 path'],
          ['log-1', 'Path-based host firewall checks filename only → lifts barrier (ALLOW TCP/443)'],
          ['log-2', 'GET /jquery-3.3.1.min.js carries RSA cookie → 200 OK returns AES tasking (60s ±20%)'],
          ['log-3', 'SIEM flags bare svchost.exe spawned by Invoice_Q4.exe instead of services.exe -k'],
          ['log-4', 'Sysmon EID 3 + Suricata IDS match Cobalt Strike JA3 72a589da586844d7f0818ce684948eea'],
        ].map(([cls, text], i) => (
          <text
            key={cls}
            className={`log-line ${cls}`}
            x="28"
            y={478 + i * 26}
            fill="#cbd5e1"
            fontSize="12.5"
            fontFamily={FONT}
          >
            {`› ${text}`}
          </text>
        ))}
      </svg>
    </AnimeClipStage>
  );
}
