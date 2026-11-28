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
    title: 'The attacker exports stolen STS credentials into a remote AWS CLI environment',
    story: 'Standing in a parked van outside the hotel, the intruder loads the spare key card into a hand scanner.',
    technical: 'aws s3 ls runs from an external VPN/Tor exit IP using the exfiltrated ISRM-WAF-Role session.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Over-privileged IAM permissions allow listing and bulk syncing sensitive S3 buckets',
    story: 'Because the front-desk card was mistakenly cut as a master key, hundreds of private basement safes swing open.',
    technical: 'aws s3 sync s3://corp-credit-apps-prod/ ./loot pulls thousands of sensitive objects via GetObject.',
  },
  {
    id: 2,
    tag: '03',
    title: 'CloudTrail S3 Data Events log the burst of ListBuckets and GetObject calls',
    story: 'An automated vault ledger records every safe door opened along with the outside street address of the caller.',
    technical: 'CloudTrail captures userIdentity.arn=assumed-role/ISRM-WAF-Role paired with anomalous sourceIPAddress.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Least-privilege IAM scoping and S3 VPC endpoint policies stop lateral cloud exfiltration',
    story: 'Restricting each key card to one closet and requiring indoor card readers halts bulk vault theft.',
    technical: 'Enforce s3:GetObject restrictions and aws:SourceVpce bucket policies so external IPs receive HTTP 403.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'S3 SYNC', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'CLOUDTRAIL', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'VPCE DENY', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function ImdsStep3S3SyncClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.imds3-w1, .imds3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.imds3-mid, .imds3-right, .imds3-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.imds3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.imds3-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.imds3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.imds3-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.imds3-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-imds-step3"
      stageLabel="STEP #3"
      mitreId="T1530"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Bulk AWS S3 bucket enumeration and exfiltration using stolen EC2 IAM role credentials">
        <FilmBackdrop prefix="imds3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          DATA FROM CLOUD STORAGE · BULK S3 SYNC &amp; CLOUDTRAIL DATA EVENT AUDIT
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          S3://CORP-CREDIT-APPS · T1530
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>EXTERNAL AWS CLI</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Stolen Role Imported</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>aws s3 ls &amp; s3 sync</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Source IP: 185.220.101.47</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>SigV4 Signed with ASIA Key</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Blast Radius Cause</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Wildcard s3:GetObject on *</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>attached to public WAF host</text>

        <line className="imds3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="imds3-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>SENSITIVE S3 BUCKET</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>corp-credit-apps-prod</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>700+ Buckets Enumerated</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Bulk GetObject Stream</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>No aws:SourceVpce Check</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Data Exfiltration Impact</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>High-volume off-VPC reads</text>
        </g>

        <line className="imds3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="imds3-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>CLOUDTRAIL S3 DATA LOGS</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Exact Object Attribution</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>eventName: GetObject</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>userAgent: aws-cli/2.x</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Role: ISRM-WAF-Role</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>HARDENING CONTROL</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Enforce VPCE + Least Privilege</text>
        </g>

        <g className="imds3-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DFIR AUDIT: Enable CloudTrail S3 Data Events to enumerate every object accessed by a compromised role
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Pair least-privilege IAM policies with bucket-level aws:SourceVpce restrictions to prevent off-VPC downloads
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
