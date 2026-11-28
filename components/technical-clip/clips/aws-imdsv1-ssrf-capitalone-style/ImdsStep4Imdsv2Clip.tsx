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
    title: 'AWS EC2 enforces IMDSv2 by setting HttpTokens=required across all instances',
    story: 'Hotel management installs a gleaming brass turnstile at the rooftop counter that refuses bare paper slips.',
    technical: 'aws ec2 modify-instance-metadata-options --http-tokens required --http-put-response-hop-limit 1.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Clients must first execute an HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds',
    story: 'Only real staff standing inside the rooftop room can press the secret brass lever to mint a short-lived badge.',
    technical: 'IMDSv2 rejects PUT requests containing X-Forwarded-For headers typical of reverse proxies.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Plain GET SSRF probes immediately receive HTTP 401 Unauthorized without leaking data',
    story: 'The lobby visitor slip bounces straight off the glass barrier and returns completely empty-handed.',
    technical: 'GET /latest/meta-data/iam/security-credentials/ without X-aws-ec2-metadata-token fails with HTTP 401.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Hop limit 1 plus AWS Organizations SCP guarantees IMDSv2 across every new workload',
    story: 'The turnstile rule is welded into every floor blueprint so no future lobby desk can bypass it.',
    technical: 'SCP ec2:MetadataHttpTokens=required blocks launching any EC2 instance with IMDSv1 enabled.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'PUT TOKEN', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: '401 BLOCK', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'ORG SCP', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function ImdsStep4Imdsv2Clip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.imds4-w1, .imds4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.imds4-mid, .imds4-right, .imds4-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.imds4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.imds4-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.imds4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.imds4-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.imds4-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-imds-step4"
      stageLabel="STEP #4"
      mitreId="T1552.005"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="AWS IMDSv2 session token enforcement blocking plain GET SSRF attacks">
        <FilmBackdrop prefix="imds4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          IMDSV2 REMEDIATION · SESSION-ORIENTED PUT TOKEN + HOP LIMIT 1
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          HTTPTOKENS=REQUIRED · 401 DENY
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>SSRF GET PROBE</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Legacy Unauthenticated GET</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>GET /latest/meta-data/iam/</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Missing Token Header</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>X-Forwarded-For Present</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Proxy Limitation</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Cannot forge PUT + TTL</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>nor survive IP TTL=1 drop</text>

        <line className="imds4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="imds4-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#22c55e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>IMDSV2 SESSION GATE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>HttpTokens=required · HopLimit=1</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>1. PUT /latest/api/token</text>
          <text x="590" y="274" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>X-aws-ec2-metadata-token-ttl</text>
          <text x="590" y="298" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>2. GET with Token Header</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Defense In Depth</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Rejects X-Forwarded-For PUTs</text>
        </g>

        <line className="imds4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="imds4-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>HTTP 401 UNAUTHORIZED</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Zero Credentials Leaked</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SSRF Chain Severed</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>IAM Role Never Disclosed</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>S3 Vault Stays Sealed</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>ORG-WIDE GUARDRAIL</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>SCP enforces IMDSv2 globally</text>
        </g>

        <g className="imds4-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENING STANDARD: Enforce IMDSv2 (HttpTokens=required) and HopLimit=1 across every EC2 account
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Monitor CloudWatch MetadataNoToken metric to find and migrate legacy workloads before locking down
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
