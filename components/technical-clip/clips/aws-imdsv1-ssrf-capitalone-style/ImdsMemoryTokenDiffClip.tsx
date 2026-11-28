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
    title: '0x00007F9A20100000 holds the reverse proxy upstream buffer containing link-local GET headers',
    story: 'Inside the lobby desk ledger, a crimson slip shows the clerk forwarded a guest note straight to the roof.',
    technical: 'Apache/ModSecurity worker buffer retains the unvalidated 169.254.169.254 upstream target URI.',
  },
  {
    id: 1,
    tag: '02',
    title: '0x00007F9A20180000 captures the plaintext STS JSON credential payload returned by IMDSv1',
    story: 'A bright amber envelope sits open on the counter displaying the spare brass room card in plain sight.',
    technical: 'AccessKeyId, SecretAccessKey, and Token transit proxy heap memory unencrypted over HTTP/80.',
  },
  {
    id: 2,
    tag: '03',
    title: '0x00007F9A20240000 shows IMDSv2 rejecting tokenless GETs with HTTP 401 Unauthorized',
    story: 'Once the emerald turnstile locks into place, bare slips receive a stamped refusal with zero keys inside.',
    technical: 'HttpTokens=required eliminates credential exposure in proxy response memory during SSRF attempts.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Combining proxy memory artifacts with CloudTrail proves exact credential theft lineage',
    story: 'Inspectors match the lobby slip against the rooftop ledger to trace every safe touched with the stolen card.',
    technical: 'Correlating AccessKeyId from proxy logs with CloudTrail GetObject events bounds total breach scope.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PROXY BUF', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'STS HEAP', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'IMDSV2 401', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function ImdsMemoryTokenDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.imdsm-w1, .imdsm-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.imdsm-mid, .imdsm-right, .imdsm-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.imdsm-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.imdsm-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.imdsm-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.imdsm-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.imdsm-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-imds-memory"
      stageLabel="MEMORY"
      mitreId="T1552.005"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Memory buffer comparison between IMDSv1 credential leak and IMDSv2 401 denial">
        <FilmBackdrop prefix="imdsm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          MEMORY &amp; BUFFER FORENSICS · IMDSV1 CREDENTIAL LEAK VS. IMDSV2 401 DENIAL
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WAF-EDGE-01 · HTTP BUFFER DIFF
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007F9A20100000</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Proxy Upstream Request</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>GET /latest/meta-data/</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Host: 169.254.169.254</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>No IMDSv2 Token Header</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Worker Heap Evidence</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Shows SSRF pivot before</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>external CloudTrail alerts</text>

        <line className="imdsm-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="imdsm-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007F9A20180000</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>IMDSv1 Response Buffer (RW-)</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>&quot;AccessKeyId&quot;: &quot;ASIA...&quot;</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>&quot;SecretAccessKey&quot;: &quot;wJalr...&quot;</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>&quot;Token&quot;: &quot;IQoJb3JpZ2lu...&quot;</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Plaintext Exposure</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Relayed directly to attacker</text>
        </g>

        <line className="imdsm-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="imdsm-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>0x00007F9A20240000</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>IMDSv2 Enforced (401)</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>HTTP/1.1 401 Unauthorized</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Zero STS Secrets Emitted</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>HopLimit=1 + PUT Required</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VERIFIED SAFE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>SSRF cannot mint PUT token</text>
        </g>

        <g className="imdsm-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            MEMORY TAKEAWAY: IMDSv2 eliminates STS secret material from reverse proxy response buffers
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Always correlate AccessKeyId strings in proxy buffers with CloudTrail GetObject trails during triage
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
