import type { CascadingProcessWaterfallNode } from '@/lib/documentation-structural-diagrams';

export const TONE_STYLES: Record<
  'rose' | 'amber' | 'indigo' | 'emerald' | 'violet' | 'cyan',
  {
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    accentText: string;
  }
> = {
  rose: {
    border: 'border-rose-300 dark:border-rose-500/40',
    bg: 'bg-rose-50/50 dark:bg-rose-950/20',
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-rose-700 dark:text-rose-300',
    accentText: 'text-rose-600 dark:text-rose-400',
  },
  amber: {
    border: 'border-amber-300 dark:border-amber-500/40',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    badgeBg: 'bg-amber-600 text-white',
    badgeText: 'text-amber-700 dark:text-amber-300',
    accentText: 'text-amber-600 dark:text-amber-400',
  },
  indigo: {
    border: 'border-indigo-300 dark:border-indigo-500/40',
    bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    accentText: 'text-indigo-600 dark:text-indigo-400',
  },
  emerald: {
    border: 'border-emerald-300 dark:border-emerald-500/40',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    accentText: 'text-emerald-600 dark:text-emerald-400',
  },
  violet: {
    border: 'border-violet-300 dark:border-violet-500/40',
    bg: 'bg-violet-50/50 dark:bg-violet-950/20',
    badgeBg: 'bg-violet-600 text-white',
    badgeText: 'text-violet-700 dark:text-violet-300',
    accentText: 'text-violet-600 dark:text-violet-400',
  },
  cyan: {
    border: 'border-cyan-300 dark:border-cyan-500/40',
    bg: 'bg-cyan-50/50 dark:bg-cyan-950/20',
    badgeBg: 'bg-cyan-600 text-white',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    accentText: 'text-cyan-600 dark:text-cyan-400',
  },
};

export function getProcessStatusStyle(
  status: CascadingProcessWaterfallNode['process']['status']
) {
  switch (status) {
    case 'hollowed':
      return {
        badge:
          'bg-purple-600 text-white border-purple-700 dark:bg-purple-500 dark:border-purple-400',
        card: 'border-purple-300 dark:border-purple-500/45 bg-purple-50/40 dark:bg-purple-950/20',
        label: 'HOLLOWED IMAGE',
      };
    case 'injected':
      return {
        badge:
          'bg-violet-600 text-white border-violet-700 dark:bg-violet-500 dark:border-violet-400',
        card: 'border-violet-300 dark:border-violet-500/45 bg-violet-50/40 dark:bg-violet-950/20',
        label: 'INJECTED MEMORY',
      };
    case 'malicious':
      return {
        badge:
          'bg-rose-600 text-white border-rose-700 dark:bg-rose-500 dark:border-rose-400',
        card: 'border-rose-300 dark:border-rose-500/45 bg-rose-50/40 dark:bg-rose-950/20',
        label: 'MALICIOUS EXEC',
      };
    case 'suspicious':
      return {
        badge:
          'bg-amber-600 text-white border-amber-700 dark:bg-amber-500 dark:border-amber-400',
        card: 'border-amber-300 dark:border-amber-500/45 bg-amber-50/40 dark:bg-amber-950/20',
        label: 'SUSPICIOUS STAGE',
      };
    default:
      return {
        badge:
          'bg-slate-700 text-white border-slate-800 dark:bg-slate-700 dark:border-slate-600',
        card: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90',
        label: 'HOST PARENT',
      };
  }
}
