'use client';

import React, { type ReactNode, type Ref } from 'react';
import { CALLOUT_CARD_STYLES, type CalloutTone } from './calloutCardStyles';

export interface FloatingStoryCalloutProps {
  labelRef: Ref<HTMLDivElement>;
  testId: string;
  title: string;
  subtitle: string;
  tone: CalloutTone;
  icon: ReactNode;
  visible: boolean;
}

/** Shared floating story/technical callout overlay for anime 3D stages. */
export function FloatingStoryCallout({
  labelRef,
  testId,
  title,
  subtitle,
  tone,
  icon,
  visible,
}: FloatingStoryCalloutProps) {
  const style = CALLOUT_CARD_STYLES[tone];
  return (
    <div
      ref={labelRef}
      data-testid={testId}
      aria-hidden={!visible}
      className="anime-floating-callout transition-opacity duration-200"
      style={{ opacity: 0 }}
    >
      <div className={`anime-floating-callout-card ${style.card}`}>
        <div className="flex items-center gap-1.5">
          <span className={`shrink-0 ${style.icon}`}>{icon}</span>
          <span className="text-[11.5px] font-extrabold tracking-normal text-white">
            {title}
          </span>
        </div>
        <div
          className={`text-[9.5px] font-mono font-semibold leading-tight mt-0.5 ${style.sub}`}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
