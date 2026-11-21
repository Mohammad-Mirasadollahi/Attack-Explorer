'use client';

import React from 'react';
import {
  DEFAULT_ACTIVE_ENVIRONMENT,
  getActiveEnvironmentProfile,
} from '@/lib/simulation-engine';
import { SelectedTelemetryDetail } from '../SelectedTelemetryDetail';
import { InspectorSidebar } from './InspectorSidebar';
import { InspectorStageFilter } from './InspectorStageFilter';
import { InspectorSectionIdentityCard } from './InspectorSectionIdentityCard';
import { OverviewTab } from './tabs/OverviewTab';
import { StepsTab } from './tabs/StepsTab';
import { ProcessHierarchyTab } from './tabs/ProcessHierarchyTab';
import { MemoryTab } from './tabs/MemoryTab';
import { SiemLogsTab } from './tabs/SiemLogsTab';
import { SourcesTab } from './tabs/SourcesTab';
import { useInspectorPanelModel } from './useInspectorPanelModel';
import type { InspectorPanelProps } from './types';

export type { InspectorTab, InspectorPanelProps } from './types';

export function InspectorPanel({
  scenario,
  currentStage,
  cinematicPhase = 'OVERVIEW',
  activeEnvironment = DEFAULT_ACTIVE_ENVIRONMENT,
  selectedTelemetry,
  onSelectTelemetry,
  onSelectStage,
  onStartWalkthrough,
  onResetWalkthrough,
  onClearTelemetrySelection,
  onOpenSourcesModal,
  scopeContext,
  onSelectNode,
  onExpandedNodeChange,
  onSelectInternalSubNode,
  activeTab: controlledActiveTab,
  onTabChange,
  onCloseInspectorPage,
  sidebarOpen = true,
}: InspectorPanelProps) {
  const envProfile = getActiveEnvironmentProfile(activeEnvironment);

  const {
    activeStageIndex,
    handleSelectTab,
    effectiveScope,
    effectiveScopeContext,
    scopedMemory,
    resolvedActiveTab,
    isInspectingSpecificMainNode,
    miniMapModel,
    activeInspectNode,
    activeInspectZone,
    pageTitle,
    visibleTabs,
  } = useInspectorPanelModel({
    scenario,
    currentStage,
    activeEnvironment,
    selectedTelemetry,
    scopeContext,
    controlledActiveTab,
    onTabChange,
    onSelectStage,
  });

  return (
    <aside
      dir="ltr"
      aria-label="Full-Screen Forensic Inspector Page"
      data-testid="inspector-full-page"
      data-inspector-scope={effectiveScope}
      className="flex-1 w-full h-full min-h-0 bg-[#F4F4F5]/90 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-row overflow-hidden"
    >
      <InspectorSidebar
        sidebarOpen={sidebarOpen}
        visibleTabs={visibleTabs}
        resolvedActiveTab={resolvedActiveTab}
        onSelectTab={handleSelectTab}
        onCloseInspectorPage={onCloseInspectorPage}
      />

      {/* Main Full-Screen Scrollable Unified Single-Column Documentation Body */}
      <div className="flex-1 min-w-0 min-h-0 overflow-y-auto workbench-scrollbar transition-all duration-200">
        <div
          data-testid="inspector-unified-single-column-layout"
          className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-5"
        >
          {/* 1. Stage Filter — hidden on Overview / Steps / Process Hierarchy
              (those tabs own merged stage chrome inside their single card) */}
          {resolvedActiveTab !== 'OVERVIEW' &&
            resolvedActiveTab !== 'STEP_GUIDE' &&
            resolvedActiveTab !== 'PROCESS_HIERARCHY' && (
              <InspectorStageFilter
                scenario={scenario}
                activeStageIndex={activeStageIndex}
                onSelectStage={onSelectStage}
                activeInspectNode={activeInspectNode}
                scopeContext={scopeContext}
                onExpandedNodeChange={onExpandedNodeChange}
                onCloseInspectorPage={onCloseInspectorPage}
              />
            )}

          {/* 2. Selected Packet / Telemetry Deep-Dive Banner (when a flow packet is clicked) */}
          {selectedTelemetry && (
            <div className="rounded-2xl overflow-hidden border border-rose-300 dark:border-rose-800/80 shadow-sm">
              <SelectedTelemetryDetail
                selectedTelemetry={selectedTelemetry}
                currentStage={currentStage}
                onClearTelemetrySelection={onClearTelemetrySelection}
                activeEnvironment={activeEnvironment}
                scopeBadgeText={scopeContext?.scopeBadgeText}
                effectiveScope={effectiveScope}
              />
            </div>
          )}

          {/* 3. Merged Focused Section Technical Identity & Forensic Specs Banner (Shown ONLY on Overview page when inspecting a specific node) */}
          {resolvedActiveTab === 'OVERVIEW' && activeInspectNode && (
            <InspectorSectionIdentityCard
              activeInspectNode={activeInspectNode}
              activeInspectZone={activeInspectZone}
              envBadgeLabel={envProfile.badgeLabel}
            />
          )}

          {/* =====================================================================
              TAB 1: OVERVIEW (Story + Technical roadmap + navigation aids only)
              Deep-dives live in Steps; Memory forensics live in the Memory tab.
              ===================================================================== */}
          {resolvedActiveTab === 'OVERVIEW' && (
            <OverviewTab
              scenario={scenario}
              pageTitle={pageTitle}
              activeStageIndex={activeStageIndex}
              effectiveScope={effectiveScope}
              effectiveScopeContext={effectiveScopeContext}
              scopeContext={scopeContext}
              isInspectingSpecificMainNode={isInspectingSpecificMainNode}
              selectedTelemetry={selectedTelemetry}
              onSelectTelemetry={onSelectTelemetry}
              onSelectStage={onSelectStage}
              onSelectNode={onSelectNode}
              onExpandedNodeChange={onExpandedNodeChange}
              onSelectInternalSubNode={onSelectInternalSubNode}
              onStartWalkthrough={onStartWalkthrough}
              onCloseInspectorPage={onCloseInspectorPage}
              onSelectTab={handleSelectTab}
            />
          )}

          {/* TAB 2: STEP-BY-STEP GUIDE */}
          {resolvedActiveTab === 'STEP_GUIDE' && (
            <StepsTab
              scenario={scenario}
              activeStageIndex={activeStageIndex}
              cinematicPhase={cinematicPhase}
              activeEnvironment={activeEnvironment}
              effectiveScopeContext={effectiveScopeContext}
              selectedTelemetry={selectedTelemetry}
              onSelectStage={onSelectStage}
              onSelectTelemetry={onSelectTelemetry}
              onSelectInternalSubNode={onSelectInternalSubNode}
              onStartWalkthrough={onStartWalkthrough}
              onResetWalkthrough={onResetWalkthrough}
              onOpenProcessHierarchy={() =>
                handleSelectTab('PROCESS_HIERARCHY')
              }
            />
          )}

          {/* TAB 2B: PROCESS EXECUTION HIERARCHY (Parent → Child Waterfall) */}
          {resolvedActiveTab === 'PROCESS_HIERARCHY' && (
            <ProcessHierarchyTab
              miniMapModel={miniMapModel}
              effectiveScopeContext={effectiveScopeContext}
              selectedTelemetry={selectedTelemetry}
              activeStageIndex={activeStageIndex}
              onSelectStage={onSelectStage}
              onSelectTelemetry={onSelectTelemetry}
              onClearTelemetrySelection={onClearTelemetrySelection}
              onSelectNode={onSelectNode}
              onExpandedNodeChange={onExpandedNodeChange}
              onSelectInternalSubNode={onSelectInternalSubNode}
              onCloseInspectorPage={onCloseInspectorPage}
            />
          )}

          {/* TAB 3: DOCUMENTED VIRTUAL MEMORY FORENSICS (VAD / PE-SIEVE) */}
          {resolvedActiveTab === 'MEMORY' && (
            <MemoryTab
              scenario={scenario}
              activeEnvironment={activeEnvironment}
              miniMapModel={miniMapModel}
              effectiveScopeContext={effectiveScopeContext}
              selectedTelemetry={selectedTelemetry}
              activeStageIndex={activeStageIndex}
              scopedMemory={scopedMemory}
              onSelectTelemetry={onSelectTelemetry}
              onClearTelemetrySelection={onClearTelemetrySelection}
              onSelectNode={onSelectNode}
              onExpandedNodeChange={onExpandedNodeChange}
              onSelectInternalSubNode={onSelectInternalSubNode}
              onCloseInspectorPage={onCloseInspectorPage}
            />
          )}

          {/* TAB 5: SIEM / EDR LOGS */}
          {resolvedActiveTab === 'SIEM_LOGS' && (
            <SiemLogsTab
              scenario={scenario}
              activeStageIndex={activeStageIndex}
              selectedTelemetry={selectedTelemetry}
              onSelectTelemetry={onSelectTelemetry}
              onSelectStage={onSelectStage}
              activeEnvironment={activeEnvironment}
              effectiveScopeContext={effectiveScopeContext}
            />
          )}

          {/* TAB 6: THREAT INTEL & SOURCES */}
          {resolvedActiveTab === 'SOURCES' && (
            <SourcesTab
              scenario={scenario}
              onOpenSourcesModal={onOpenSourcesModal}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
