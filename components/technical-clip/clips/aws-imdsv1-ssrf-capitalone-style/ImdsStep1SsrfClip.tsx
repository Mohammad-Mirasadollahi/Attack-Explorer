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
    title: 'An external client sends a crafted URL to the misconfigured reverse proxy',
    story: 'A sly visitor at the hotel lobby slides a handwritten request slip across the front desk.',
    technical: 'ModSecurity WAF reverse proxy forwards unvalidated destination URLs without egress allowlisting.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The proxy resolves the internal link-local address 169.254.169.254 on the attacker behalf',
    story: 'The polite lobby clerk walks straight up the private staff staircase to the rooftop concierge counter.',
    technical: 'SSRF pivots inbound internet traffic to http://169.254.169.254/latest/meta-data/iam/security-credentials/.',
  },
  {
    id: 2,
    tag: '03',
    title: 'IMDSv1 honors plain GET requests with zero session token or custom header validation',
    story: 'The rooftop clerk never asks for a stamped brass pass and immediately reads the master room number aloud.',
    technical: 'IMDSv1 answers single-step HTTP GET requests and returns the attached EC2 IAM role name.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Proxy access logs capture the link-local destination IP as the primary SSRF indicator',
    story: 'The lobby guestbook records that an outdoor visitor somehow triggered a private rooftop errand.',
    technical: 'Alert on any reverse proxy or web application emitting outbound requests toward 169.254.169.254.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PROXY', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'IMDSV1', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'SIEM RULE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function ImdsStep1SsrfClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.imds1-w1, .imds1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.imds1-mid, .imds1-right, .imds1-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.imds1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.imds1-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.imds1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.imds1-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.imds1-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-imds-step1"
      stageLabel="STEP #1"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Reverse proxy SSRF reaching AWS IMDSv1 link-local metadata endpoint">
        <FilmBackdrop prefix="imds1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          AWS EC2 REVERSE PROXY SSRF · LINK-LOCAL 169.254.169.254 PIVOT
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          WAF-EDGE-01 · IMDSv1
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>EXTERNAL CLIENT</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Crafted Proxy Request</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>GET /proxy?url=...</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Host: 169.254.169.254</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>No Custom Header Required</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Boundary Failure</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Untrusted Host header routed</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>straight to internal metadata</text>

        <line className="imds1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="imds1-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>WAF REVERSE PROXY (EC2)</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>i-0a9f8c21e7 · ModSecurity</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Forwards Internal GET</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>/latest/meta-data/iam/</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>security-credentials/</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Source IP Rewritten</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Appears as local EC2 host</text>
        </g>

        <line className="imds1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="imds1-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>IMDSv1 METADATA SERVICE</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>169.254.169.254:80</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>HTTP 200 OK (No Token)</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Role: ISRM-WAF-Role</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Returned verbatim to caller</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>DFIR SIGNAL</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Proxy log hits 169.254.169.254</text>
        </g>

        <g className="imds1-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DETECTION RULE: Alert on any reverse proxy request resolving link-local 169.254.169.254
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Single-step HTTP GET access to IMDSv1 turns a web proxy bug directly into IAM role discovery
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
