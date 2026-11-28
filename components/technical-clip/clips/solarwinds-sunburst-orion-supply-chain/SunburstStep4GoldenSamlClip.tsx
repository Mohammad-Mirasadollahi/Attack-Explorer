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
    title: 'Post-compromise operators pivot from Orion to steal the on-prem AD FS token-signing certificate',
    story: 'Using keys found in the counting room, the intruder steals the master gold passport stamp from the basement vault.',
    technical: 'Adversary extracts the AD FS DKM decryption key from Active Directory and decrypts the PFX signing cert.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Golden SAML forges offline assertions for any cloud user bypassing MFA and on-prem logs',
    story: 'With the stolen stamp, the intruder prints valid passports at home for any diplomat without visiting the embassy.',
    technical: 'Forged SAML XML tokens signed with the real AD FS private key grant direct Microsoft 365 Graph access.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Cloud sign-ins appear with no corresponding on-prem AD FS authentication event',
    story: 'Airport gates record a diplomat landing in the cloud tower, yet the home embassy gatebook shows zero departures.',
    technical: 'Correlating Entra ID sign-in logs against AD FS Event ID 1200/1202 exposes impossible cloud-only SAML logins.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Double-rotating signing certificates and migrating to cloud-native auth evicts Golden SAML',
    story: 'Destroying the old passport stamp twice and adopting live digital handshakes permanently locks out forgeries.',
    technical: 'Perform dual AD FS token-signing cert rollover, revoke refresh tokens, and enforce FIDO2/cloud-native auth.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'AD FS KEY', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'FORGED XML', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'DOUBLE ROT', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function SunburstStep4GoldenSamlClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.sunb4-w1, .sunb4-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.sunb4-mid, .sunb4-right, .sunb4-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.sunb4-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.sunb4-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.sunb4-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.sunb4-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.sunb4-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-sunburst-step4"
      stageLabel="STEP #4"
      mitreId="T1552.004"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Golden SAML AD FS token-signing certificate theft and double rollover remediation">
        <FilmBackdrop prefix="sunb4" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          GOLDEN SAML PIVOT · AD FS TOKEN-SIGNING CERT THEFT &amp; DUAL ROLLOVER
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          ADFS-01 -&gt; ENTRA ID · T1552.004
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>AD FS SIGNING KEY THEFT</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>DKM + Encrypted PFX</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Read AD DKM Container</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Export AD FS Config DB</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Decrypt Private Key</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Telemetry Signal</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Windows EID 4662 on DKM</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>by non-ADFS service account</text>

        <line className="sunb4-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="sunb4-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>OFFLINE GOLDEN SAML</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Forged Cloud Assertions</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Bypasses MFA &amp; Passwords</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Impersonates Any Exec/Admin</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Zero On-Prem AD FS Log</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Cross-Log Mismatch</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Cloud SignIn != ADFS EID 1200</text>
        </g>

        <line className="sunb4-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="sunb4-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>EVICTION &amp; HARDENING</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Dual Signing Cert Rollover</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Rotate AD FS Cert Twice</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Revoke Cloud Refresh Tokens</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Audit OAuth App Grants</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>LONG-TERM FIX</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Cloud-Native Auth + FIDO2</text>
        </g>

        <g className="sunb4-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            IDENTITY EVICTION: Rotate AD FS token-signing certificates twice and reconcile cloud sign-ins against AD FS
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Monitor EID 4662 reads on the AD DKM container to detect Golden SAML key harvesting before cloud takeover
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
