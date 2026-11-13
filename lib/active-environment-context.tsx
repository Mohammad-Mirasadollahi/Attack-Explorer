'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  ACTIVE_ENVIRONMENT_LIST,
  ActiveEnvironmentId,
  ActiveEnvironmentProfile,
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile } from './simulation-engine';

export interface ActiveEnvironmentContextValue {
  activeEnvironment: ActiveEnvironmentId;
  environmentProfile: ActiveEnvironmentProfile;
  availableEnvironments: ActiveEnvironmentProfile[];
  setActiveEnvironment: (env: ActiveEnvironmentId) => void;
}

const ActiveEnvironmentContext = createContext<ActiveEnvironmentContextValue>({
  activeEnvironment: DEFAULT_ACTIVE_ENVIRONMENT,
  environmentProfile: getActiveEnvironmentProfile(DEFAULT_ACTIVE_ENVIRONMENT),
  availableEnvironments: ACTIVE_ENVIRONMENT_LIST,
  setActiveEnvironment: () => {} });

export function ActiveEnvironmentProvider({
  value,
  onChange,
  children }: {
  value?: ActiveEnvironmentId;
  onChange?: (env: ActiveEnvironmentId) => void;
  children: React.ReactNode;
}) {
  const [internalEnv, setInternalEnv] = useState<ActiveEnvironmentId>(
    DEFAULT_ACTIVE_ENVIRONMENT
  );

  const activeEnvironment = value ?? internalEnv;
  const setActiveEnvironment = (next: ActiveEnvironmentId) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalEnv(next);
    }
  };

  const contextValue = useMemo<ActiveEnvironmentContextValue>(
    () => ({
      activeEnvironment,
      environmentProfile: getActiveEnvironmentProfile(activeEnvironment),
      availableEnvironments: ACTIVE_ENVIRONMENT_LIST,
      setActiveEnvironment }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeEnvironment]
  );

  return (
    <ActiveEnvironmentContext.Provider value={contextValue}>
      {children}
    </ActiveEnvironmentContext.Provider>
  );
}

export function useActiveEnvironment(): ActiveEnvironmentContextValue {
  return useContext(ActiveEnvironmentContext);
}
