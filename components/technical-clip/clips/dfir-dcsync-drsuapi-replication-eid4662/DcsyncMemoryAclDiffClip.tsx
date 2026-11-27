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
    title: 'Left memory view: ntdsai.dll caches exposed svc_dir_sync replication ACE',
    story: 'On the left, the sovereign mint tower displays the forgotten crimson gatehouse ribbon.',
    technical: '0x00007FF9D1100000: DomainRootDACL grants 1131f6ad-... to non-DC user svc_dir_sync.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Active DRSUAPI Opnum 3 buffer serves krbtgt secrets directly from RAM',
    story: 'Golden crown-seal copies flow straight out of memory without touching the vault floor.',
    technical: '0x00007FF9D11C0000: IDL_DRSGetNCChanges serves CN=krbtgt hashes without NTDS.dit file reads.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Right memory view: Hardened Enterprise-DC-only DACL blocks non-DC callers',
    story: 'On the right, the emerald peer-only shield locks the express bridge strictly to verified mint towers.',
    technical: '0x00007FF9D1280000: Only Enterprise Domain Controllers hold replication rights; EID 4662 stays clean.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Combine automated Tier-0 ACL audits with double krbtgt hygiene',
    story: 'Auditors sweep both towers to verify rogue ribbons never return to the gatehouse.',
    technical: 'Run continuous AD DACL checks, enforce Protected Users, and alert on EID 4662/5136 + Zeek DRSUAPI.',
  },
];

const CAMERAS = [
  { id: 'COMPARE', transform: 'scale(1)' },
  { id: 'EXPOSED ACE', transform: 'scale(1.24) translate(110px, -20px)' },
  { id: 'HARDENED DACL', transform: 'scale(1.24) translate(-110px, -20px)' },
  { id: 'VERDICT', transform: 'scale(1.22) translate(0px, -110px)' },
];

export function DcsyncMemoryAclDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.dm-vuln, .dm-safe, .dm-verdict'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.dm-vuln'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.dm-rpc'), { stroke: '#f43f5e', duration: 0.6 }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.dm-safe'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.dm-verdict'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-dcsync-memory"
      stageLabel="MEMORY DIFF"
      mitreId="T1003.006"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="lsass.exe ntdsai.dll exposed DACL vs hardened Enterprise DC only policy">
        <FilmBackdrop prefix="dm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          LSASS NTDSAI.DLL MEMORY DIFF · EXPOSED REPLICATION ACE VS. PEER-DC-ONLY DACL
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          PID 628 · CORP-DC01
        </text>

        <g className="dm-vuln">
          <rect x="52" y="108" width="510" height="352" rx="16" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.6" />
          <text x="307" y="146" textAnchor="middle" fill="#fecaca" fontSize="14" fontWeight="700" fontFamily={FONT}>
            EXPOSED · OVER-PRIVILEGED NON-DC ACE
          </text>
          <rect x="78" y="170" width="458" height="122" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="307" y="200" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007FF9D1100000 · DomainRootDACL Cache
          </text>
          <text x="307" y="230" textAnchor="middle" fill="#fecaca" fontSize="11" fontFamily={FONT}>
            GUID: 11 31 F6 AD 9C 07 11 D1 F7 9F 00 C0 4F C2 DC D2
          </text>
          <text x="307" y="260" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            Principal: CORP\svc_dir_sync (Not a Domain Controller)
          </text>

          <rect className="dm-rpc" x="78" y="312" width="458" height="122" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="307" y="342" textAnchor="middle" fill="#fde68a" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007FF9D11C0000 · DRSUAPI Opnum 3 Buffer
          </text>
          <text x="307" y="372" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily={FONT}>
            IDL_DRSGetNCChanges -&gt; CN=krbtgt Served From RAM
          </text>
          <text x="307" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Security EID 4662 + EID 4624 -&gt; 10.20.14.88
          </text>
        </g>

        <g className="dm-safe">
          <rect x="638" y="108" width="510" height="352" rx="16" fill="#052e16" stroke="#22c55e" strokeWidth="2.6" />
          <text x="893" y="146" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="700" fontFamily={FONT}>
            HARDENED · PEER-DC-ONLY REPLICATION DACL
          </text>
          <rect x="664" y="170" width="458" height="122" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
          <text x="893" y="200" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="700" fontFamily={FONT}>
            0x00007FF9D1280000 · Clean Tier-0 DACL
          </text>
          <text x="893" y="230" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily={FONT}>
            1131f6aa / 1131f6ad -&gt; Enterprise Domain Controllers Only
          </text>
          <text x="893" y="260" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Non-DC Workstations Receive STATUS_ACCESS_DENIED
          </text>

          <rect x="664" y="312" width="458" height="122" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
          <text x="893" y="342" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontWeight="700" fontFamily={FONT}>
            RESILIENT TIER-0 POSTURE
          </text>
          <text x="893" y="372" textAnchor="middle" fill="#86efac" fontSize="11" fontFamily={FONT}>
            Double krbtgt Reset Completed (&gt;= 10h Gap)
          </text>
          <text x="893" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily={FONT}>
            Protected Users + DC-Only Firewall Rules Enforced
          </text>
        </g>

        <g className="dm-verdict">
          <rect x="110" y="502" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="536" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            DFIR VERDICT: DCSync leaves zero disk IOCs on the DC — EID 4662 + 4624 + Zeek DRSUAPI &amp; ACL hygiene stop it cold
          </text>
          <text x="600" y="564" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Audit DC=corp,DC=local replication GUIDs continuously and treat any non-$ EID 4662 hit as a P1 domain compromise
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
