export type CalloutTone = 'sky' | 'rose' | 'amber' | 'emerald';

export const CALLOUT_CARD_STYLES: Record<
  CalloutTone,
  { card: string; icon: string; sub: string }
> = {
  sky: {
    card: 'bg-slate-950/72 border-sky-400/85 text-sky-400',
    icon: 'text-sky-300',
    sub: 'text-sky-200/95',
  },
  rose: {
    card: 'bg-slate-950/74 border-rose-500/85 text-rose-400',
    icon: 'text-rose-400',
    sub: 'text-rose-200/95',
  },
  amber: {
    card: 'bg-slate-950/86 border-amber-400/90 text-amber-400',
    icon: 'text-amber-300',
    sub: 'text-amber-200/95',
  },
  emerald: {
    card: 'bg-slate-950/86 border-emerald-400/90 text-emerald-400',
    icon: 'text-emerald-300',
    sub: 'text-emerald-200/95',
  },
};
