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
    title: 'The attacker appends the discovered role name to fetch temporary STS credentials',
    story: 'With the master room name in hand, the visitor sends a second slip asking for the spare brass key card.',
    technical: 'GET /latest/meta-data/iam/security-credentials/ISRM-WAF-Role succeeds over IMDSv1.',
  },
  {
    id: 1,
    tag: '02',
    title: 'IMDS returns AccessKeyId, SecretAccessKey, and SessionToken in plaintext JSON',
    story: 'The rooftop clerk hands over a live golden key card bundled with a matching security code.',
    technical: 'Response contains ASIA... temporary key material valid for up to six hours anywhere on the internet.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Those STS credentials work identically from external attacker hosts outside the VPC',
    story: 'The stolen card opens vault doors even when carried by a stranger standing blocks away from the hotel.',
    technical: 'AWS IAM evaluates the signed SigV4 request without binding the EC2 role token to the instance IP by default.',
  },
  {
    id: 3,
    tag: '04',
    title: 'GuardDuty flags UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS',
    story: 'A night guard notices the hotel staff key card being swiped from a street corner outside the property.',
    technical: 'Correlate CloudTrail sourceIPAddress against EC2 instance VPC CIDR to spot off-instance role reuse.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'STS JSON', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'OFF-HOST', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'GUARDDUTY', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function ImdsStep2CredsClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.imds2-w1, .imds2-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.imds2-mid, .imds2-right, .imds2-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.imds2-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.imds2-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.imds2-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.imds2-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.imds2-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-imds-step2"
      stageLabel="STEP #2"
      mitreId="T1552.005"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Temporary AWS STS credentials returned by IMDSv1 and reused outside AWS">
        <FilmBackdrop prefix="imds2" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          IMDSV1 CREDENTIAL HARVEST · TEMPORARY STS TOKEN EXFILTRATION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ISRM-WAF-ROLE · ASIA...
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>ROLE METADATA QUERY</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Second SSRF GET Call</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>GET .../ISRM-WAF-Role</text>
        <text x="190" y="276" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Link-Local 169.254.169.254</text>
        <text x="190" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>No PUT Token Check</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Over-Privileged Role</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>WAF role holds broad s3:*</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>read permissions across buckets</text>

        <line className="imds2-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="imds2-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>STS JSON CREDENTIAL BLOB</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Returned Through Proxy Body</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>AccessKeyId: ASIAIOSFODNN7</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>SecretAccessKey: wJalrXUtn...</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Token: IQoJb3JpZ2luX2Vj...</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>6-Hour Portable Lease</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Works from any external host</text>
        </g>

        <line className="imds2-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="imds2-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>GUARDDUTY DETECTION</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Off-Instance Role Abuse</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>InstanceCredentialExfiltration</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>OutsideAWS Finding Fired</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>IP != EC2 VPC Endpoint</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>IMMEDIATE RESPONSE</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Attach RevokeOldSessions policy</text>
        </g>

        <g className="imds2-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            CLOUD TELEMETRY: GuardDuty spots EC2 role credentials invoked from external non-AWS IP addresses
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Bind IAM roles with aws:SourceVpce conditions so stolen tokens fail outside private VPC endpoints
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
