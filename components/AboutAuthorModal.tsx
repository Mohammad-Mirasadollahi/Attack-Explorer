'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Github, Linkedin, UserRound, X } from 'lucide-react';

const AUTHOR = {
  name: 'Mohammad Mirasadollahi',
  handle: '@M_Mirasadollahi',
  role: 'Creator of Attack Explorer',
  links: [
    {
      id: 'github',
      label: 'GitHub',
      handle: 'Mohammad-Mirasadollahi',
      href: 'https://github.com/Mohammad-Mirasadollahi',
      icon: Github,
      accent: 'border-zinc-300/90 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-500',
    },
    {
      id: 'x',
      label: 'X',
      handle: '@M_Mirasadollahi',
      href: 'https://x.com/M_Mirasadollahi',
      icon: null,
      accent:
        'border-sky-300/80 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/40 hover:border-sky-500',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'mohammad-mirasadollahi',
      href: 'https://www.linkedin.com/in/mohammad-mirasadollahi/',
      icon: Linkedin,
      accent:
        'border-teal-300/80 dark:border-teal-800 bg-teal-50/80 dark:bg-teal-950/40 hover:border-teal-500',
    },
  ],
} as const;

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.894L1.914 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

interface AboutAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutAuthorModal({ isOpen, onClose }: AboutAuthorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="About the creator"
          data-testid="about-author-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
          dir="ltr"
        >
          <motion.button
            type="button"
            aria-label="Close About overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px] cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-teal-300/50 dark:border-teal-700/60 bg-white dark:bg-zinc-950 shadow-2xl"
          >
            <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-teal-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-teal-200/60 dark:border-teal-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <motion.div
                  animate={{ rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="shrink-0 p-2.5 rounded-xl bg-teal-500 text-white shadow-[0_0_0_4px_rgba(20,184,166,0.18)]"
                >
                  <UserRound className="w-5 h-5" />
                </motion.div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                    About
                  </p>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    {AUTHOR.name}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {AUTHOR.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-testid="close-about-author-modal-btn"
                aria-label="Close About"
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative p-5 space-y-3">
              <p className="text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                Built and maintained by {AUTHOR.name}. Reach out on GitHub, X, or
                LinkedIn.
              </p>

              <ul className="space-y-2" data-testid="about-author-links">
                {AUTHOR.links.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.06 }}
                    >
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`about-link-${link.id}`}
                        className={`group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 transition-colors cursor-pointer ${link.accent}`}
                      >
                        <span className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 w-9 h-9 rounded-lg bg-white/80 dark:bg-zinc-950/70 border border-black/5 dark:border-white/10 flex items-center justify-center text-zinc-800 dark:text-zinc-100">
                            {Icon ? (
                              <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                            ) : (
                              <XLogo className="w-[16px] h-[16px]" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-zinc-900 dark:text-white">
                              {link.label}
                            </span>
                            <span className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 break-all">
                              {link.handle}
                            </span>
                          </span>
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors" />
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
