'use client';

import React, { useCallback, useState } from 'react';
import type { BoardTooltip } from '@/lib/section-excalidraw-registry';

const KIND_META: Record<
  BoardTooltip['kind'],
  { label: string; stroke: string; fill: string }
> = {
  api: { label: 'function', stroke: '#4338ca', fill: '#e0e7ff' },
  process: { label: 'process', stroke: '#be123c', fill: '#ffe4e6' },
  handle: { label: 'handle', stroke: '#b45309', fill: '#fef3c7' },
  memory: { label: 'struct', stroke: '#c2410c', fill: '#ffedd5' },
  network: { label: 'endpoint', stroke: '#047857', fill: '#d1fae5' },
  detect: { label: 'signal', stroke: '#0369a1', fill: '#e0f2fe' },
  kernel: { label: 'kernel', stroke: '#4338ca', fill: '#e0e7ff' },
  note: { label: 'note', stroke: '#b45309', fill: '#fef3c7' },
};

export interface BoardTooltipCardProps {
  tooltip: BoardTooltip;
  x: number;
  y: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function formatTooltipPlain(tooltip: BoardTooltip): string {
  const lines = [
    `[${KIND_META[tooltip.kind].label}] ${tooltip.title}`,
    tooltip.module ? `module: ${tooltip.module}` : null,
    tooltip.signature ? tooltip.signature : null,
    ...tooltip.fields.map(
      (f) => `${f.key}${f.type ? ` (${f.type})` : ''}: ${f.value}`
    ),
    '',
    `What this means: ${tooltip.explain}`,
    tooltip.note ? `Tip: ${tooltip.note}` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Interactive Excalidraw chalk island: selectable / copyable text,
 * scrollable body, stays open while the pointer is over it.
 */
export function BoardTooltipCard({
  tooltip,
  x,
  y,
  onMouseEnter,
  onMouseLeave,
}: BoardTooltipCardProps) {
  const meta = KIND_META[tooltip.kind];
  const [copied, setCopied] = useState(false);

  const copyAll = useCallback(async () => {
    const text = formatTooltipPlain(tooltip);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Fallback: leave text selectable for manual copy.
    }
  }, [tooltip]);

  return (
    <div
      role="tooltip"
      data-testid="technical-board-tooltip"
      className="board-excalidraw-tooltip absolute z-30 flex w-[min(340px,calc(100%-16px))] flex-col"
      style={{
        left: x + 14,
        top: y + 14,
        maxWidth: 340,
        maxHeight: 'min(420px, calc(100% - 24px))',
        background: '#FDFBF7',
        border: '1.5px solid #1e293b',
        borderRadius: 8,
        boxShadow: '3px 3px 0 #1e293b',
        fontFamily: 'Virgil, Cascadia, Segoe UI Emoji, system-ui, sans-serif',
        color: '#1e293b',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        cursor: 'text',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="flex shrink-0 items-start gap-2 px-3 py-2.5"
        style={{
          borderBottom: '1.5px solid #cbd5e1',
          background: meta.fill,
        }}
      >
        <span
          className="mt-0.5 shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{
            border: `1.5px solid ${meta.stroke}`,
            borderRadius: 4,
            color: meta.stroke,
            background: '#FDFBF7',
            userSelect: 'none',
          }}
        >
          {meta.label}
        </span>
        <div className="min-w-0 flex-1">
          <div
            className="text-[14px] font-bold leading-snug"
            style={{ color: meta.stroke }}
          >
            {tooltip.title}
          </div>
          {tooltip.module ? (
            <div className="mt-0.5 text-[11px]" style={{ color: '#64748b' }}>
              {tooltip.module}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          data-testid="technical-board-tooltip-copy"
          onClick={copyAll}
          className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{
            border: '1.5px solid #1e293b',
            borderRadius: 4,
            background: '#FDFBF7',
            color: '#1e293b',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-label="Copy tooltip text"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div
        className="board-excalidraw-tooltip-body min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-2.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tooltip.signature ? (
          <pre
            className="whitespace-pre-wrap break-words px-2.5 py-2 text-[11.5px] leading-snug"
            style={{
              background: '#f8fafc',
              border: '1.5px dashed #94a3b8',
              borderRadius: 6,
              color: '#334155',
            }}
          >
            {tooltip.signature}
          </pre>
        ) : null}

        {tooltip.fields.length > 0 ? (
          <div
            style={{
              border: '1.5px solid #cbd5e1',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <div
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{
                borderBottom: '1.5px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#64748b',
                userSelect: 'none',
              }}
            >
              members
            </div>
            <dl>
              {tooltip.fields.map((field, index) => (
                <div
                  key={field.key}
                  className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-2 px-2.5 py-1.5 text-[12px]"
                  style={{
                    borderTop: index === 0 ? undefined : '1px solid #e2e8f0',
                  }}
                >
                  <dt className="min-w-0">
                    <span style={{ color: '#4338ca', fontWeight: 600 }}>
                      {field.key}
                    </span>
                    {field.type ? (
                      <span
                        className="ml-1.5 text-[10px]"
                        style={{ color: '#94a3b8' }}
                      >
                        {field.type}
                      </span>
                    ) : null}
                  </dt>
                  <dd
                    className="min-w-0 break-all text-right"
                    style={{ color: '#047857', fontWeight: 600 }}
                  >
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div
          className="px-2.5 py-2"
          style={{
            background: '#fef3c7',
            border: '1.5px solid #b45309',
            borderRadius: 6,
          }}
        >
          <div
            className="mb-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ color: '#b45309', userSelect: 'none' }}
          >
            What this means
          </div>
          <p
            className="text-[12.5px] leading-relaxed"
            style={{ color: '#1e293b' }}
          >
            {tooltip.explain}
          </p>
          {tooltip.note ? (
            <p
              className="mt-1.5 pt-1.5 text-[11px] leading-snug"
              style={{
                borderTop: '1px dashed #d97706',
                color: '#78716c',
              }}
            >
              Tip: {tooltip.note}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
