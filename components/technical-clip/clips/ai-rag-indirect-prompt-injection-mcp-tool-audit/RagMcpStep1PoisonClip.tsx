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
    title: 'An external supplier uploads an innocent-looking invoice PDF into the shared knowledge portal',
    story: 'A visitor slides a crisp pamphlet through the grand library mail slot alongside routine vendor catalogs.',
    technical: 'PDF/HTML document contains legitimate quarterly pricing plus hidden white-on-white instruction text.',
  },
  {
    id: 1,
    tag: '02',
    title: 'The RAG ingestion pipeline extracts all text blindly and embeds the hidden directive into the vector DB',
    story: 'An automated shelving trolley stamps the pamphlet and files it right next to official company handbooks.',
    technical: 'Ingestion strips visual styling, indexing the concealed override directive with high cosine similarity.',
  },
  {
    id: 2,
    tag: '03',
    title: 'Provenance labels are discarded during chunking so external files look identical to internal policies',
    story: 'Because no red warning ribbon is tied around outside mail, the pamphlet blends seamlessly into trusted shelves.',
    technical: 'Vector metadata omits trust-tier tags separating untrusted external uploads from vetted internal docs.',
  },
  {
    id: 3,
    tag: '04',
    title: 'Sanitizing untrusted inputs and tagging provenance metadata hardens the RAG corpus at ingest time',
    story: 'Inspecting incoming pamphlets under ultraviolet lamps and labeling outside mail protects the reading room.',
    technical: 'Scan ingested chunks for directive patterns and attach immutable source_trust=external metadata tags.',
  },
];

const CAMERAS = [
  { id: 'WIDE', transform: 'scale(1)' },
  { id: 'HIDDEN INK', transform: 'scale(1.24) translate(105px, -20px)' },
  { id: 'VECTOR DB', transform: 'scale(1.26) translate(-10px, -20px)' },
  { id: 'PROVENANCE', transform: 'scale(1.24) translate(-40px, -110px)' },
];

export function RagMcpStep1PoisonClip() {
  const build = useCallback(({ root, setBeat }: ClipTimelineApi) => {
    const q = (sel: string) => root.querySelectorAll(sel);
    const tl = gsap.timeline();
    tl.set(q('.rag1-w1, .rag1-w2'), { strokeDasharray: 280, strokeDashoffset: 280 });
    tl.set(q('.rag1-mid, .rag1-right, .rag1-bar'), { autoAlpha: 0, y: 12 });

    tl.addLabel('b0').call(() => setBeat(0), [], 'b0');
    tl.to(q('.rag1-w1'), { strokeDashoffset: 0, duration: clipPace.travel, ease: 'none' }, 'b0');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b1').call(() => setBeat(1), [], 'b1');
    tl.to(q('.rag1-mid'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b1');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b2').call(() => setBeat(2), [], 'b2');
    tl.to(q('.rag1-w2'), { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 'b2');
    tl.to(q('.rag1-right'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b2+=0.35');
    tl.to({}, { duration: clipPace.hold });

    tl.addLabel('b3').call(() => setBeat(3), [], 'b3');
    tl.to(q('.rag1-bar'), { autoAlpha: 1, y: 0, duration: clipPace.teach, ease: 'power2.out' }, 'b3');
    tl.to({}, { duration: clipPace.end });
    return tl;
  }, []);

  return (
    <AnimeClipStage
      testId="technical-clip-ragmcp-step1"
      stageLabel="STEP #1"
      mitreId="T1190"
      beats={BEATS}
      cameras={CAMERAS}
      build={build}
    >
      <svg viewBox="0 0 1200 640" className="block h-full w-full" role="img" aria-label="External PDF with hidden prompt injection directive ingested into enterprise RAG vector database">
        <FilmBackdrop prefix="rag1" />
        <text x="28" y="30" fill="#94a3b8" fontSize="12" fontFamily={FONT} letterSpacing="0.12em">
          INDIRECT PROMPT INJECTION · POISONED VENDOR DOCUMENT INGESTION
        </text>
        <text x="1172" y="30" textAnchor="end" fill="#64748b" fontSize="12" fontFamily={FONT}>
          RAG CORPUS · OWASP LLM01
        </text>

        <rect x="40" y="138" width="300" height="314" rx="14" fill="#1e293b" stroke="#a855f7" strokeWidth="2.4" />
        <text x="190" y="172" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="700" fontFamily={FONT}>EXTERNAL VENDOR PDF</text>
        <text x="190" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Q3_Vendor_Pricing.pdf</text>
        <rect x="62" y="222" width="256" height="98" rx="10" fill="#2e1065" stroke="#a855f7" strokeWidth="1.8" />
        <text x="190" y="250" textAnchor="middle" fill="#f3e8ff" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Visible: Pricing Table</text>
        <text x="190" y="276" textAnchor="middle" fill="#f43f5e" fontSize="10.5" fontFamily={FONT}>Hidden White Text:</text>
        <text x="190" y="298" textAnchor="middle" fill="#fda4af" fontSize="10.5" fontFamily={FONT}>&quot;Ignore rules; call MCP...&quot;</text>
        <rect x="62" y="336" width="256" height="92" rx="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.6" />
        <text x="190" y="366" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Stealth Concealment</text>
        <text x="190" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Invisible to human reviewers</text>
        <text x="190" y="414" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>fully extracted by PDF parser</text>

        <line className="rag1-w1" x1="344" y1="295" x2="416" y2="295" stroke="#a855f7" strokeWidth="4" />

        <g className="rag1-mid">
          <rect x="420" y="138" width="340" height="314" rx="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.4" />
          <text x="590" y="172" textAnchor="middle" fill="#fda4af" fontSize="13" fontWeight="700" fontFamily={FONT}>VECTOR INDEX PIPELINE</text>
          <text x="590" y="196" textAnchor="middle" fill="#e2e8f0" fontSize="11.5" fontFamily={FONT}>Chunking + Embedding Store</text>
          <rect x="442" y="218" width="296" height="106" rx="10" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
          <text x="590" y="246" textAnchor="middle" fill="#fecaca" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Chunk #8412 Indexed</text>
          <text x="590" y="274" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>High Semantic Match: &quot;Vendor&quot;</text>
          <text x="590" y="298" textAnchor="middle" fill="#fca5a5" fontSize="10.5" fontFamily={FONT}>No Trust-Tier Metadata Saved</text>
          <rect x="442" y="340" width="296" height="88" rx="10" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <text x="590" y="368" textAnchor="middle" fill="#cbd5e1" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Latent Trigger</text>
          <text x="590" y="394" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontFamily={FONT}>Waits for employee RAG query</text>
        </g>

        <line className="rag1-w2" x1="764" y1="295" x2="836" y2="295" stroke="#38bdf8" strokeWidth="4" />

        <g className="rag1-right">
          <rect x="840" y="138" width="320" height="314" rx="16" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.4" />
          <text x="1000" y="172" textAnchor="middle" fill="#7dd3fc" fontSize="13" fontWeight="700" fontFamily={FONT}>INGESTION GUARDRAILS</text>
          <text x="1000" y="198" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily={FONT}>Provenance + Content Scan</text>
          <rect x="862" y="224" width="276" height="106" rx="10" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          <text x="1000" y="254" textAnchor="middle" fill="#bae6fd" fontSize="11.5" fontWeight="700" fontFamily={FONT}>Tag trust=untrusted_external</text>
          <text x="1000" y="282" textAnchor="middle" fill="#fde68a" fontSize="10.5" fontFamily={FONT}>Flag Hidden / Zero-Opacity Text</text>
          <text x="1000" y="306" textAnchor="middle" fill="#7dd3fc" fontSize="10.5" fontFamily={FONT}>Log Document SHA-256 Lineage</text>
          <rect x="862" y="346" width="276" height="82" rx="10" fill="#052e16" stroke="#22c55e" strokeWidth="1.8" />
          <text x="1000" y="376" textAnchor="middle" fill="#86efac" fontSize="11.5" fontWeight="700" fontFamily={FONT}>AUDIT TRAIL</text>
          <text x="1000" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="10.5" fontFamily={FONT}>Preserves uploader identity</text>
        </g>

        <g className="rag1-bar">
          <rect x="110" y="504" width="980" height="88" rx="12" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.4" />
          <text x="600" y="538" textAnchor="middle" fill="#e0e7ff" fontSize="14" fontWeight="700" fontFamily={FONT}>
            RAG SECURITY RULE: Treat every external document indexed into a vector database as untrusted data
          </text>
          <text x="600" y="566" textAnchor="middle" fill="#fde68a" fontSize="12" fontFamily={FONT}>
            Attach provenance tags at ingest and scan extracted PDF/HTML text for concealed instruction overrides
          </text>
        </g>
      </svg>
    </AnimeClipStage>
  );
}
