import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  readFloatingHoverInspectorSource,
  readInspectorSources,
} from './read-inspector-sources';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  buildInspectorMiniMapModel,
  buildScopedCorrelatedLogs,
  buildScopedSequenceModel,
  buildScopedStepGuideModel,
  formatExpandedNodeScopeLabel,
  formatInternalSubNodeScopeLabel,
  isSeparatedStepsAndSequenceScenario,
  resolveInspectorScopeContext,
  resolveScopedMemoryForensics,
  resolveScopedTelemetrySelection,
} from './inspector-scope';
import {
  clearDiagramMemoryForTesting,
  parseWorkbenchUrlState,
  readLastVisitedDiagramSnapshot,
  saveLastVisitedDiagramSnapshot,
  serializeWorkbenchUrlState,
} from './diagram-memory-store';
import { buildWhiteboardSchematic } from './sketch-zones-and-drilldown';
import {
  buildCascadingProcessWaterfall,
  buildDocumentationArchitectureBlueprint,
  buildStepStructuralBreakdown,
} from './documentation-structural-diagrams';

describe('Inspector Scope Context & Scoped Models (MAIN_SCENARIO, EXPANDED_NODE, INTERNAL_SUBNODE)', () => {
  it('resolves MAIN_SCENARIO scope on the main topology and preserves single-click node selection without expanding', () => {
    const scenario = ATTACK_SCENARIOS.find(
      (s) => s.id === 'process-hollowing'
    )!;
    const schematic = buildWhiteboardSchematic(scenario, 0, 'WORKSTATION');
    const hostNode = schematic.nodes.find(
      (n) => n.id === 'victim_laptop_node'
    )!;

    const mainScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: hostNode.id,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });

    assert.equal(mainScope.diagramScope, 'MAIN_SCENARIO');
    assert.equal(mainScope.effectiveScope, 'MAIN_SCENARIO');
    assert.equal(mainScope.scopeBadgeText, 'Scenario');
    assert.equal(mainScope.scopeBadgeMeta.mode, 'MAIN_SCENARIO');
    assert.equal(mainScope.scopeBadgeMeta.themeColor, 'emerald');
    assert.equal(mainScope.subBoardStoryAnalogy, null);
    assert.equal(mainScope.internalSubBoard, null);
    assert.equal(mainScope.expandedNode, null);
    assert.equal(mainScope.selectedSubNode, null);
    assert.ok(mainScope.selectedMainNode);
    assert.equal(mainScope.selectedMainNode?.id, hostNode.id);
    assert.equal(mainScope.selectedMainNode?.label, hostNode.label);
    assert.equal(
      mainScope.scopedTelemetryEvents.length,
      scenario.telemetry.length
    );

    const stepGuide = buildScopedStepGuideModel(mainScope, 'OVERVIEW');
    assert.equal(stepGuide.effectiveScope, 'MAIN_SCENARIO');
    assert.equal(
      stepGuide.scenarioGuide.steps.length,
      scenario.stages.length
    );

    const logs = buildScopedCorrelatedLogs(mainScope);
    assert.equal(logs.length, scenario.telemetry.length);
  });

  it('switches to EXPANDED_NODE scope when a node is double-clicked/expanded, using only documented sub-board and node fields', () => {
    const scenario = ATTACK_SCENARIOS.find(
      (s) => s.id === 'process-hollowing'
    )!;
    const schematic = buildWhiteboardSchematic(scenario, 1, 'WORKSTATION');
    const dnsResolverNode = schematic.nodes.find((n) => n.isNetworkDevice)!;

    const expandedScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 1,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: dnsResolverNode.id,
      expandedNodeId: dnsResolverNode.id,
      selectedInternalSubNodeId: null,
    });

    assert.equal(expandedScope.diagramScope, 'EXPANDED_NODE');
    assert.equal(expandedScope.effectiveScope, 'EXPANDED_NODE');
    assert.equal(expandedScope.scopeBadgeMeta.mode, 'EXPANDED_NODE');
    assert.equal(expandedScope.scopeBadgeMeta.themeColor, 'amber');
    assert.ok(
      expandedScope.subBoardStoryAnalogy &&
        expandedScope.subBoardStoryAnalogy.length > 60
    );
    assert.equal(
      expandedScope.scopeBadgeText,
      formatExpandedNodeScopeLabel(dnsResolverNode)
    );
    assert.ok(
      expandedScope.scopeBadgeText.includes(dnsResolverNode.label),
      'Scope badge must include expanded node label'
    );
    assert.ok(expandedScope.internalSubBoard);
    assert.equal(
      expandedScope.whereAmISummary,
      expandedScope.internalSubBoard?.environmentBreadcrumb
    );
    assert.equal(expandedScope.internalSubBoard?.subNodes.length, 5);
    assert.equal(expandedScope.internalSubBoard?.subFlows.length, 4);
    assert.equal(expandedScope.internalSteps.length, 4);
    assert.ok(
      expandedScope.internalSteps.every((st) => st.storyAnalogy.length > 40)
    );

    // Step guide in EXPANDED_NODE uses the 4 internal sub-flows with hierarchical sequence codes (e.g., 2.1..2.4)
    const stepGuide = buildScopedStepGuideModel(expandedScope, 'STAGE_ACTIVE');
    assert.equal(stepGuide.effectiveScope, 'EXPANDED_NODE');
    assert.equal(stepGuide.internalSteps.length, 4);
    assert.equal(stepGuide.internalSteps[0].sequenceCode, '2.1');
    assert.equal(stepGuide.internalSteps[0].forwardSeq, '2.1');
    assert.equal(stepGuide.internalSteps[0].returnSeq, '2.1');

    // SIEM Logs in EXPANDED_NODE reflect the 4 internal sub-board flows
    const scopedLogs = buildScopedCorrelatedLogs(expandedScope);
    assert.equal(scopedLogs.length, 4);
    assert.ok(scopedLogs[0].stageTitle.includes('#2.1'));
  });

  it('switches to INTERNAL_SUBNODE scope when an internal sub-node is selected inside an expanded board', () => {
    const scenario = ATTACK_SCENARIOS[0]; // process-hollowing
    const schematic = buildWhiteboardSchematic(scenario, 2, 'WORKSTATION');
    const malwareNode = schematic.nodes.find(
      (n) => n.id === 'malware_sandbox_node'
    )!;

    const expandedScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: malwareNode.id,
      expandedNodeId: malwareNode.id,
      selectedInternalSubNodeId: null,
    });

    const targetSubNode = expandedScope.internalSubBoard!.subNodes[2]; // #4.3 RWX Allocator & PE Injector

    const subNodeScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: malwareNode.id,
      expandedNodeId: malwareNode.id,
      selectedInternalSubNodeId: targetSubNode.id,
    });

    assert.equal(subNodeScope.diagramScope, 'INTERNAL_SUBNODE');
    assert.equal(subNodeScope.effectiveScope, 'INTERNAL_SUBNODE');
    assert.equal(subNodeScope.scopeBadgeMeta.mode, 'INTERNAL_SUBNODE');
    assert.equal(subNodeScope.scopeBadgeMeta.themeColor, 'rose');
    assert.equal(
      subNodeScope.scopeBadgeText,
      formatInternalSubNodeScopeLabel(targetSubNode, malwareNode)
    );
    assert.ok(subNodeScope.scopeBadgeText.includes('#4.3'));
    assert.ok(subNodeScope.scopeBadgeText.includes(targetSubNode.label));
    assert.equal(subNodeScope.selectedSubNode?.id, targetSubNode.id);
    assert.ok(subNodeScope.selectedSubNodeZone);
    assert.equal(
      subNodeScope.selectedSubNodeZone?.id,
      targetSubNode.zoneId
    );

    // Related sub-flows only include flows connected to #4.3 (4.2 and 4.3)
    assert.ok(subNodeScope.relatedSubFlows.length >= 1);
    assert.ok(
      subNodeScope.relatedSubFlows.every(
        (fl) =>
          fl.fromNodeId === targetSubNode.id || fl.toNodeId === targetSubNode.id
      )
    );

    const stepGuide = buildScopedStepGuideModel(subNodeScope, 'STAGE_ACTIVE');
    assert.equal(stepGuide.effectiveScope, 'INTERNAL_SUBNODE');
    assert.equal(
      stepGuide.internalSteps.length,
      subNodeScope.relatedSubFlows.length
    );

    const scopedLogs = buildScopedCorrelatedLogs(subNodeScope);
    assert.equal(scopedLogs.length, subNodeScope.relatedSubFlows.length);
  });

  it('supports jumping to MAIN_SCENARIO override in the Inspector without losing the expanded diagram state, and restores scopes on back', () => {
    const scenario = ATTACK_SCENARIOS[0];
    const schematic = buildWhiteboardSchematic(scenario, 1, 'WORKSTATION');
    const hostNode = schematic.nodes.find(
      (n) => n.id === 'victim_laptop_node'
    )!;

    const overriddenScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 1,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: hostNode.id,
      expandedNodeId: hostNode.id,
      selectedInternalSubNodeId: null,
      scopeOverride: 'MAIN_SCENARIO',
    });

    assert.equal(overriddenScope.diagramScope, 'EXPANDED_NODE');
    assert.equal(overriddenScope.effectiveScope, 'MAIN_SCENARIO');
    assert.equal(overriddenScope.isScenarioOverrideActive, true);
    assert.equal(overriddenScope.scopeBadgeText, 'Scenario');
    assert.ok(overriddenScope.diagramScopeBadgeText.includes(hostNode.label));

    // Resolve telemetry across both internal sub-board flows and main scenario telemetry
    const internalFlowId =
      overriddenScope.internalSubBoard!.subFlows[0].telemetryEvent.id;
    const resolvedInternalEv = resolveScopedTelemetrySelection({
      scenario,
      selectedTelemetryId: internalFlowId,
      internalSubBoard: overriddenScope.internalSubBoard,
      activeEnvironment: 'SERVER',
    });
    assert.ok(resolvedInternalEv);
    assert.equal(resolvedInternalEv?.id, internalFlowId);
    assert.equal(resolvedInternalEv?.activeEnvironmentId, 'SERVER');

    const mainFlowId = scenario.telemetry[0].id;
    const resolvedMainEv = resolveScopedTelemetrySelection({
      scenario,
      selectedTelemetryId: mainFlowId,
      internalSubBoard: null,
      activeEnvironment: 'CLOUD',
    });
    assert.ok(resolvedMainEv);
    assert.equal(resolvedMainEv?.id, mainFlowId);
    assert.equal(resolvedMainEv?.activeEnvironmentId, 'CLOUD');
  });

  it('builds the Top-Left Miniature Topological Context Map model (focused node & zone in full detail, connected arms & neighbors, and minimal background topology)', () => {
    const scenario = ATTACK_SCENARIOS[0]; // process-hollowing
    const schematic = buildWhiteboardSchematic(scenario, 2, 'WORKSTATION');
    const hostNode = schematic.nodes.find(
      (n) => n.id === 'victim_laptop_node'
    )!;

    // 1. Clicked Main Node mode (SELECTED_MAIN_NODE)
    const clickedNodeScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: hostNode.id,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });

    const miniMapMainNode = buildInspectorMiniMapModel(
      clickedNodeScope,
      null,
      2,
      scenario.stages.length
    );

    assert.equal(miniMapMainNode.mode, 'SELECTED_MAIN_NODE');
    assert.equal(miniMapMainNode.primaryNode?.id, hostNode.id);
    assert.equal(miniMapMainNode.focusedNodes.length, 1);
    assert.equal(miniMapMainNode.focusedNodes[0].id, hostNode.id);
    assert.ok(miniMapMainNode.activeZone);
    assert.equal(miniMapMainNode.activeZone?.id, hostNode.zoneId);
    assert.ok(
      miniMapMainNode.connectionArms.length >= 1,
      'Focused node must have connected inbound/outbound arms'
    );
    assert.ok(
      miniMapMainNode.connectedNeighborNodes.length >= 1,
      'Focused node must identify connected neighbor nodes'
    );
    assert.ok(
      miniMapMainNode.minimalBackgroundZones.length >= 1,
      'Non-active zones must be classified as minimal background zones'
    );

    // 2. Internal Sub-Node mode (INTERNAL_SUBNODE)
    const expandedScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: hostNode.id,
      expandedNodeId: hostNode.id,
      selectedInternalSubNodeId: null,
    });
    const subNode = expandedScope.internalSubBoard!.subNodes[1];
    const subNodeScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: hostNode.id,
      expandedNodeId: hostNode.id,
      selectedInternalSubNodeId: subNode.id,
    });

    const miniMapSubNode = buildInspectorMiniMapModel(
      subNodeScope,
      null,
      2,
      scenario.stages.length
    );
    assert.equal(miniMapSubNode.mode, 'INTERNAL_SUBNODE');
    assert.equal(miniMapSubNode.primaryNode?.id, subNode.id);
    assert.ok(miniMapSubNode.connectionArms.length >= 1);
    assert.ok(miniMapSubNode.minimalBackgroundNodes.length >= 1);
  });

  it('persists and restores the complete workbench snapshot (stage, node, expanded node, subnode, telemetry, viewMode, inspectorOpen, inspectorTab, scopeOverride, theme, speed)', () => {
    clearDiagramMemoryForTesting();

    const fallback = readLastVisitedDiagramSnapshot('process-hollowing');
    assert.equal(fallback.scenarioId, 'process-hollowing');
    assert.equal(fallback.activeStageIndex, 0);
    assert.equal(fallback.expandedNodeId, null);
    assert.equal(fallback.viewMode, 'TOPOLOGY');
    assert.equal(fallback.inspectorOpen, false);
    assert.equal(fallback.inspectorTab, 'OVERVIEW');

    saveLastVisitedDiagramSnapshot({
      scenarioId: 'dns-tunneling-exfil',
      activeStageIndex: 3,
      activeEnvironment: 'SERVER',
      expandedNodeId: 'victim_laptop_node',
      selectedNodeId: 'victim_laptop_node',
      selectedInternalSubNodeId: 'sub_node_2',
      selectedTelemetryId: 'dns-ev-2',
      tacticalMode: true,
      viewMode: 'RAW_TABLES',
      inspectorOpen: true,
      inspectorTab: 'SEQUENCE',
      inspectorScopeOverride: 'EXPANDED_NODE',
      isDark: true,
      playbackSpeed: 2,
    });

    const restored = readLastVisitedDiagramSnapshot('process-hollowing');
    assert.equal(restored.scenarioId, 'dns-tunneling-exfil');
    assert.equal(restored.activeStageIndex, 3);
    assert.equal(restored.activeEnvironment, 'SERVER');
    assert.equal(restored.expandedNodeId, 'victim_laptop_node');
    assert.equal(restored.selectedNodeId, 'victim_laptop_node');
    assert.equal(restored.selectedInternalSubNodeId, 'sub_node_2');
    assert.equal(restored.selectedTelemetryId, 'dns-ev-2');
    assert.equal(restored.tacticalMode, true);
    assert.equal(restored.viewMode, 'RAW_TABLES');
    assert.equal(restored.inspectorOpen, true);
    assert.equal(restored.inspectorTab, 'SEQUENCE');
    assert.equal(restored.inspectorScopeOverride, 'EXPANDED_NODE');
    assert.equal(restored.isDark, true);
    assert.equal(restored.playbackSpeed, 2);

    // Verify URL state serialization & parsing for sharing steps, sections, sub-nodes, tabs, and clauses
    const stepInspectorUrl = serializeWorkbenchUrlState({
      scenarioId: 'process-hollowing',
      activeStageIndex: 2,
      inspectorOpen: true,
      inspectorTab: 'STEP_GUIDE',
    });
    assert.equal(
      stepInspectorUrl,
      '?scenario=process-hollowing&step=2&inspector=1&tab=STEP_GUIDE#step-guide-step-2'
    );

    const parsedStepInspector = parseWorkbenchUrlState(
      '?scenario=process-hollowing&step=2&inspector=1&tab=STEP_GUIDE',
      '#step-guide-step-2',
      fallback
    );
    assert.equal(parsedStepInspector.hasUrlOverrides, true);
    assert.equal(parsedStepInspector.state.scenarioId, 'process-hollowing');
    assert.equal(parsedStepInspector.state.activeStageIndex, 2);
    assert.equal(parsedStepInspector.state.inspectorOpen, true);
    assert.equal(parsedStepInspector.state.inspectorTab, 'STEP_GUIDE');

    // Verify sub-node & expanded section URL serialization & parsing
    const subNodeUrl = serializeWorkbenchUrlState({
      scenarioId: 'dns-tunneling-exfil',
      activeStageIndex: 1,
      expandedNodeId: 'victim_laptop_node',
      selectedInternalSubNodeId: 'sub_node_2',
      inspectorOpen: true,
      inspectorTab: 'STEP_GUIDE',
    });
    assert.equal(
      subNodeUrl,
      '?scenario=dns-tunneling-exfil&step=1&expanded=victim_laptop_node&subnode=sub_node_2&inspector=1&tab=STEP_GUIDE#substep-sub_node_2'
    );

    // Verify clause hash deep-linking (#clause-2.1 automatically resolves step 2 and focusedPartHash)
    const parsedClause = parseWorkbenchUrlState(
      '?scenario=log4shell-dfir&inspector=1&tab=STEP_GUIDE',
      '#clause-2.1',
      fallback
    );
    assert.equal(parsedClause.hasUrlOverrides, true);
    assert.equal(parsedClause.state.scenarioId, 'log4shell-dfir');
    assert.equal(parsedClause.state.activeStageIndex, 2);
    assert.equal(parsedClause.state.inspectorOpen, true);
    assert.equal(parsedClause.state.inspectorTab, 'STEP_GUIDE');
    assert.equal(parsedClause.focusedPartHash, 'clause-2.1');

    clearDiagramMemoryForTesting();
  });

  it('strictly grounds Memory forensics visibility: shows Memory ONLY when documented memoryBlocks exist AND the current Inspector section involves memory; never fabricates memory', () => {
    // 1. Scenario WITH documented memoryBlocks (process-hollowing)
    const hollowing = ATTACK_SCENARIOS.find(
      (s) => s.id === 'process-hollowing'
    )!;
    const hollowingSchematic = buildWhiteboardSchematic(
      hollowing,
      0,
      'WORKSTATION'
    );

    // Overview (Stage 0) -> hasDocumentedMemory === true
    const overviewScope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    const overviewMem = resolveScopedMemoryForensics(overviewScope, null);
    assert.equal(overviewMem.hasDocumentedMemory, true);
    assert.equal(overviewMem.memoryBlocks.length, 3);
    assert.match(overviewMem.scopeExplanation, /\(why\b/i);
    for (const mb of overviewMem.memoryBlocks) {
      assert.match(mb.addressWhyNote, /\(why\b/i);
      assert.match(mb.permissionsWhyNote, /\(why\b/i);
      assert.match(mb.hexWhyNote, /\(why\b/i);
      assert.match(mb.description, /\(why\b/i);
    }
    for (const proc of overviewMem.relatedProcessTree) {
      assert.match(proc.statusWhyNote, /\(why\b/i);
      assert.match(proc.commandLineWhyNote, /\(why\b/i);
      for (const api of proc.apiCallsWithWhy) {
        assert.match(api, /\(why:/i);
      }
    }

    // Stage 2 (NtUnmapViewOfSection memory unmapping) -> hasDocumentedMemory === true
    const stage2Scope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(stage2Scope, null).hasDocumentedMemory,
      true
    );

    // Stage 5 (Outbound HTTPS C2 Beacon - pure network stage) -> hasDocumentedMemory === false
    const stage5Scope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 5,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(stage5Scope, null).hasDocumentedMemory,
      false
    );

    // Selecting Network Firewall or C2 Server node in process-hollowing -> hasDocumentedMemory === false
    const fwNode = hollowingSchematic.nodes.find((n) => n.isNetworkDevice)!;
    const fwScope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: fwNode.id,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(fwScope, null).hasDocumentedMemory,
      false
    );

    // Selecting/Expanding the Malware Process node in process-hollowing -> hasDocumentedMemory === true
    const malwareNode = hollowingSchematic.nodes.find(
      (n) => n.id === 'malware_sandbox_node'
    )!;
    const expandedMalwareScope = resolveInspectorScopeContext({
      scenario: hollowing,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: malwareNode.id,
      expandedNodeId: malwareNode.id,
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(expandedMalwareScope, null)
        .hasDocumentedMemory,
      true
    );

    // 2. Scenario WITHOUT documented memoryBlocks (synthetic non-memory fixture verifies strict non-fabrication rule)
    const nonMemoryScenario = {
      ...hollowing,
      id: 'synthetic-no-memory-fixture',
      category: 'EXFILTRATION' as const,
      processTree: hollowing.processTree.map((p) => ({
        ...p,
        memoryBlocks: [],
      })),
    };
    const nonMemOverviewScope = resolveInspectorScopeContext({
      scenario: nonMemoryScenario,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    const nonMem = resolveScopedMemoryForensics(nonMemOverviewScope, null);
    assert.equal(nonMem.hasDocumentedMemory, false);
    assert.equal(nonMem.memoryBlocks.length, 0);

    // Expanding a host node in a non-memory scenario must NOT fabricate memory blocks or VAD/RAM subnodes
    const nonMemExpandedHostScope = resolveInspectorScopeContext({
      scenario: nonMemoryScenario,
      activeStageIndex: 1,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: 'victim_laptop_node',
      expandedNodeId: 'victim_laptop_node',
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(nonMemExpandedHostScope, null)
        .hasDocumentedMemory,
      false
    );
    assert.ok(
      nonMemExpandedHostScope.internalSubBoard!.subNodes.every(
        (sn) => !sn.label.includes('VAD') && !sn.sublabel.includes('0x00400000')
      ),
      'Non-memory scenarios must never fabricate VAD or 0x00400000 sub-nodes'
    );
  });

  it('builds a structured Story-to-Spec Sequence model (buildScopedSequenceModel) across Main Scenario, Selected Node, and Expanded Sub-Board scopes', () => {
    const scenario = ATTACK_SCENARIOS.find(
      (s) => s.id === 'process-hollowing'
    )!;

    // 1. Full Scenario Sequence Model
    const mainScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    const mainSeq = buildScopedSequenceModel(mainScope, null);
    assert.equal(mainSeq.hasDocumentedSequence, true);
    assert.equal(mainSeq.exchanges.length, scenario.telemetry.length);
    assert.ok(mainSeq.participants.length >= 3);
    for (const ex of mainSeq.exchanges) {
      assert.ok(ex.initiatorLabel.length > 0);
      assert.ok(ex.receiverLabel.length > 0);
      assert.equal(ex.forwardSeq, ex.sequenceCode);
      assert.equal(ex.returnSeq, ex.sequenceCode);
      assert.ok(ex.storyAnalogy.length > 40);
      assert.ok(ex.technicalBridge.length > 40);
      assert.ok(ex.underTheHood.length > 40);
      assert.ok(ex.detectionAndEvidence.length > 30);
    }

    // 2. Expanded Node Sequence Model
    const expandedScope = resolveInspectorScopeContext({
      scenario,
      activeStageIndex: 2,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: 'malware_sandbox_node',
      expandedNodeId: 'malware_sandbox_node',
      selectedInternalSubNodeId: null,
    });
    const expandedSeq = buildScopedSequenceModel(expandedScope, null);
    assert.equal(expandedSeq.hasDocumentedSequence, true);
    assert.equal(expandedSeq.effectiveScope, 'EXPANDED_NODE');
    assert.equal(expandedSeq.exchanges.length, 4);
    assert.equal(expandedSeq.exchanges[0].sequenceCode, '4.1');
    assert.equal(expandedSeq.exchanges[0].forwardSeq, '4.1');
    assert.equal(expandedSeq.exchanges[0].returnSeq, '4.1');

    // 3. Verify that across all 85 scenarios, Step-by-Step Guide is streamlined (Seq removed from Steps UI and woven directly into Step prose)
    for (const sc of ATTACK_SCENARIOS) {
      assert.equal(
        isSeparatedStepsAndSequenceScenario(sc.id),
        true,
        `All scenarios must have separated/streamlined Steps with Seq woven into Step prose (got false for ${sc.id})`
      );
    }

    const mainStepGuide = buildScopedStepGuideModel(mainScope, 'OVERVIEW');
    assert.equal(
      mainSeq.exchanges.length,
      mainStepGuide.scenarioGuide.steps.length
    );
    mainSeq.exchanges.forEach((seqEx, idx) => {
      const stepCard = mainStepGuide.scenarioGuide.steps[idx];
      assert.notEqual(
        seqEx.plainTitle,
        `Seq #${seqEx.sequenceCode} · ${stepCard.plainTitle}`,
        `Stage ${seqEx.stepNumber} Sequence plainTitle must be distinct from Step Guide plainTitle`
      );
      assert.notEqual(
        seqEx.storyAnalogy,
        stepCard.storyAnalogy,
        `Stage ${seqEx.stepNumber} Sequence storyAnalogy must be distinct from Step Guide storyAnalogy`
      );
      assert.notEqual(
        seqEx.technicalBridge,
        stepCard.simpleExplanation,
        `Stage ${seqEx.stepNumber} Sequence technicalBridge must be distinct from Step Guide simpleExplanation`
      );
      assert.notEqual(
        seqEx.underTheHood,
        stepCard.howItWorksInPractice,
        `Stage ${seqEx.stepNumber} Sequence underTheHood must be distinct from Step Guide howItWorksInPractice`
      );
      assert.notEqual(
        seqEx.detectionAndEvidence,
        stepCard.detectionAndEvidence,
        `Stage ${seqEx.stepNumber} Sequence detectionAndEvidence must be distinct from Step Guide detectionAndEvidence`
      );
      // Verify inline parenthetical explanations exist inside the text without separate WHY / SPEC or why: prefixes
      for (const field of [
        seqEx.forwardPayloadSummary,
        seqEx.returnDescription,
        seqEx.technicalBridge,
        seqEx.underTheHood,
        seqEx.detectionAndEvidence,
        stepCard.simpleExplanation,
        stepCard.howItWorksInPractice,
      ]) {
        assert.ok(
          /\([^)]{12,}\)/.test(field),
          `Stage ${seqEx.stepNumber} field must contain a descriptive inline parenthetical (...) explanation inside the text: ${field}`
        );
        assert.equal(
          /WHY\s*\/\s*(SPEC|PROTOCOL\s*EFFECT)|\(\s*why\s*:/i.test(field),
          false,
          `Stage ${seqEx.stepNumber} field must not contain literal WHY / SPEC or (why: prefix: ${field}`
        );
      }
    });

    // Verify essential Sequence request/response & handle details are woven directly into process-hollowing Step-by-Step Guide prose
    const stepsByNum = mainStepGuide.scenarioGuide.steps;
    assert.ok(
      stepsByNum[0].simpleExplanation.includes('hProcess = 0x01C4') &&
        stepsByNum[0].simpleExplanation.includes('hThread = 0x01C8') &&
        stepsByNum[0].howItWorksInPractice.includes('SuspendCount = 1'),
      'Step 1 must weave in returned PROCESS_INFORMATION handles (hProcess = 0x01C4, hThread = 0x01C8) and SuspendCount = 1'
    );
    assert.ok(
      stepsByNum[1].simpleExplanation.includes('STATUS_SUCCESS') &&
        stepsByNum[1].howItWorksInPractice.includes('MiUnmapViewOfSection'),
      'Step 2 must weave in STATUS_SUCCESS (0x00000000) and kernel MiUnmapViewOfSection'
    );
    assert.ok(
      stepsByNum[2].simpleExplanation.includes('lpNumberOfBytesWritten = 270,336') &&
        stepsByNum[2].howItWorksInPractice.includes('MEM_PRIVATE'),
      'Step 3 must weave in lpNumberOfBytesWritten = 270,336 and MEM_PRIVATE VAD details'
    );
    assert.ok(
      stepsByNum[3].simpleExplanation.includes('PreviousSuspendCount = 1') &&
        stepsByNum[3].howItWorksInPractice.includes('KTRAP_FRAME.Rcx = 0x004014A0'),
      'Step 4 must weave in PreviousSuspendCount = 1 and KTRAP_FRAME.Rcx = 0x004014A0'
    );
    assert.ok(
      stepsByNum[4].simpleExplanation.includes('HTTP 200 OK') &&
        stepsByNum[4].simpleExplanation.includes('20% random jitter'),
      'Step 5 must weave in C2 HTTP 200 OK response and 60s / 20% random jitter schedule'
    );
  });

  it('builds structure-specific Documentation Architecture Blueprints, multi-depth Parent->Child cascading process waterfalls, and step-level diagrams across all 85 scenarios', () => {
    const archetypesSeen = new Set<string>();

    for (const scenario of ATTACK_SCENARIOS) {
      const scope = resolveInspectorScopeContext({
        scenario,
        activeStageIndex: 0,
        activeEnvironment: 'WORKSTATION',
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });

      const blueprint = buildDocumentationArchitectureBlueprint(scope, null);
      archetypesSeen.add(blueprint.archetype);

      assert.equal(
        blueprint.layers.length,
        4,
        `Scenario ${scenario.id} should have 4 structural blueprint layers`
      );
      assert.ok(
        blueprint.cascadingProcesses.length >= 3,
        `Scenario ${scenario.id} should have at least 3 cascading process nodes (got ${blueprint.cascadingProcesses.length})`
      );

      const maxDepth = Math.max(
        ...blueprint.cascadingProcesses.map((n) => n.depth)
      );
      assert.ok(
        maxDepth >= 2,
        `Scenario ${scenario.id} process waterfall must cascade to at least depth 2 (Parent -> Child -> Grandchild), got maxDepth=${maxDepth}`
      );

      for (const procNode of blueprint.cascadingProcesses) {
        assert.ok(
          !/^(POST|GET|Body:?|Payload:?|Crafted|Vulnerable|Drop|Hook)$/i.test(
            procNode.process.name
          ),
          `Scenario ${scenario.id} has invalid prose-token process name: ${procNode.process.name}`
        );
      }

      const waterfall = buildCascadingProcessWaterfall(scenario, scope, 1);
      assert.equal(waterfall.length, blueprint.cascadingProcesses.length);

      for (const stage of scenario.stages) {
        const stepBreakdown = buildStepStructuralBreakdown(
          scenario,
          stage,
          scope
        );
        assert.ok(stepBreakdown.conduit.initiatorLabel.length > 0);
        assert.ok(stepBreakdown.conduit.targetLabel.length > 0);
        assert.ok(stepBreakdown.conduit.forwardActionLabel.length > 0);
        assert.ok(stepBreakdown.stepProcessCascade.length >= 1);
      }
    }

    assert.ok(
      archetypesSeen.size >= 1,
      `At least 1 structural diagram archetype should be represented across live scenarios, got: ${Array.from(archetypesSeen).join(', ')}`
    );
  });

  it('FloatingHoverInspectorTrigger removes the redundant Main Page button, uses diagramScope, and bounds summary height with vertical scroll so Open Main Scenario Page / Open Dedicated Section Page is always visible', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const triggerSection = readFloatingHoverInspectorSource();

    assert.equal(
      triggerSection.includes('hover-card-open-main-page-btn'),
      false,
      'FloatingHoverInspectorTrigger must not render a Main Page button next to Open Dedicated Section Page'
    );
    assert.equal(
      triggerSection.includes('MAIN PAGE SCENARIO INSPECTOR'),
      false,
      'FloatingHoverInspectorTrigger must not label the header MAIN PAGE SCENARIO INSPECTOR'
    );
    assert.equal(
      triggerSection.includes("scopeContext.diagramScope === 'INTERNAL_SUBNODE'"),
      true,
      'FloatingHoverInspectorTrigger must resolve activeTargetNode from diagramScope'
    );
    assert.equal(
      triggerSection.includes('hover-card-scrollable-summary'),
      true,
      'FloatingHoverInspectorTrigger must wrap the summary in a scrollable container'
    );
    assert.equal(
      triggerSection.includes('overflow-y-auto'),
      true,
      'FloatingHoverInspectorTrigger summary container must enable vertical scrolling'
    );
    assert.equal(
      triggerSection.includes('Open Main Scenario Page'),
      true,
      'FloatingHoverInspectorTrigger must keep the Open Main Scenario Page button beneath the scrollable text'
    );
  });

  it('AttackSidebar, AttackLibrary, and InspectorPanel enforce default-collapsed categories, remove redundant category filter bars and Back logo, and provide a collapsible Left Navigation Panel + Overview Title Card', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const sidebarSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/AttackSidebar.tsx'),
      'utf8'
    );
    const librarySrc = fs.readFileSync(
      path.join(process.cwd(), 'components/AttackLibrary.tsx'),
      'utf8'
    );
    const inspectorSrc = readInspectorSources();

    // 1. AttackSidebar removes redundant [ All | Malware | DFIR | AD/Net ] bar & defaults categories to collapsed
    assert.equal(
      sidebarSrc.includes('aria-label="Attack categories"'),
      false,
      'AttackSidebar must remove the redundant Attack categories filter bar'
    );
    assert.equal(
      sidebarSrc.includes('aria-label="Vector categories"'),
      false,
      'AttackSidebar must remove the redundant Vector categories filter bar'
    );
    assert.equal(
      /setExpandedGroups\]\s*=\s*useState<\s*Record<string,\s*boolean>\s*>\(\s*\{\}\s*\)/.test(
        sidebarSrc
      ),
      true,
      'AttackSidebar must initialize expandedGroups to empty {} (collapsed by default)'
    );
    assert.equal(
      /setExpandedVectorGroups\]\s*=\s*useState<\s*Record<string,\s*boolean>\s*>\(\s*\{\}\s*\)/.test(
        sidebarSrc
      ),
      true,
      'AttackSidebar must initialize expandedVectorGroups to empty {} (collapsed by default)'
    );

    // 2. AttackLibrary removes redundant domainTabs filter bar & defaults categories to collapsed
    assert.equal(
      librarySrc.includes('domainTabs'),
      false,
      'AttackLibrary must remove the redundant domainTabs filter bar'
    );
    assert.equal(
      librarySrc.includes('LIBRARY_CATEGORY_GROUPS'),
      true,
      'AttackLibrary must group scenario cards into collapsible categories'
    );

    // 3. InspectorPanel removes logo next to Back button, uses unified sidebarOpen for Left Navigation Panel (no duplicate collapse button), removes Main Scenario Page buttons, and moves Scope Badge + Title into Overview Card
    assert.equal(
      inspectorSrc.includes('inspector-logo-return-btn'),
      false,
      'InspectorPanel must not render the brand logo next to Back to Diagram'
    );
    assert.equal(
      inspectorSrc.includes('AnimeBrandLogo'),
      false,
      'InspectorPanel must not import or render AnimeBrandLogo'
    );
    assert.equal(
      inspectorSrc.includes('inspector-scope-breadcrumb-bar'),
      false,
      'InspectorPanel must remove the top breadcrumb bar'
    );
    assert.equal(
      inspectorSrc.includes('data-testid="inspector-left-nav-sidebar"'),
      true,
      'InspectorPanel must render the left navigation sidebar'
    );
    assert.equal(
      inspectorSrc.includes('data-testid="inspector-left-nav-collapse-btn"'),
      false,
      'InspectorPanel must not render a second duplicate collapse button; it uses the unified top header toggle via sidebarOpen'
    );
    assert.equal(
      inspectorSrc.includes('inspector-scope-main-btn'),
      false,
      'InspectorPanel must remove the Main Scenario Page scope button in the left panel'
    );
    assert.equal(
      inspectorSrc.includes('inspector-switch-to-main-page-btn'),
      false,
      'InspectorPanel must remove the Main Scenario Page button in the stage filter card'
    );
    assert.equal(
      inspectorSrc.includes('data-testid="inspector-overview-title-card"'),
      true,
      'InspectorPanel must render the scope badge and title inside a card on the Overview page'
    );

    // 4. AttackVisualizer removes bottom sub-node details dock; AttackHeader removes Right Inspector toggle; RawTablesView removes Captured Packets & SIEM while keeping 3 tables; LogInspector & SelectedTelemetryDetail have no internal scrollbars
    const visualizerSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/AttackVisualizer.tsx'),
      'utf8'
    );
    const headerSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/AttackHeader.tsx'),
      'utf8'
    );
    const rawTablesSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/canvas/RawTablesView.tsx'),
      'utf8'
    );
    const logInspectorSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/LogInspector.tsx'),
      'utf8'
    );
    const telemetryDetailSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/SelectedTelemetryDetail.tsx'),
      'utf8'
    );

    assert.equal(
      visualizerSrc.includes('internal-subnode-inspector-bar'),
      false,
      'AttackVisualizer must remove the bottom sub-node details bar'
    );
    assert.equal(
      headerSrc.includes('toggle-right-inspector-btn'),
      false,
      'AttackHeader must remove the Toggle Right Forensic Inspector & Telemetry Panel button next to About'
    );
    assert.equal(
      rawTablesSrc.includes('Captured Packets & SIEM'),
      false,
      'RawTablesView must remove Captured Packets & SIEM tab'
    );
    assert.equal(
      rawTablesSrc.includes('raw-table-packets-section'),
      false,
      'RawTablesView must remove the packets table section'
    );
    assert.equal(
      rawTablesSrc.includes('Malware & Memory Table') &&
        rawTablesSrc.includes('Host Artifacts & Process Tree') &&
        rawTablesSrc.includes('Lateral Movement Hops'),
      true,
      'RawTablesView must preserve the remaining 3 forensic tables'
    );
    assert.equal(
      logInspectorSrc.includes('max-h-44'),
      false,
      'LogInspector Raw Logs and Sigma rules must not have max-h-44 internal scrollbars'
    );
    assert.equal(
      telemetryDetailSrc.includes('overflow-x-auto'),
      false,
      'SelectedTelemetryDetail Raw Logs and Sigma rules must not have internal scrollbars'
    );

    // 5. Full-width layout with balanced edge spacing and wide Technical Explanation / Description / Summary columns
    assert.equal(
      rawTablesSrc.includes('max-w-6xl'),
      false,
      'RawTablesView must span the full available width without max-w-6xl restriction'
    );
    assert.equal(
      rawTablesSrc.includes('data-testid="raw-tables-full-width-container"'),
      true,
      'RawTablesView must render the full-width container with balanced horizontal padding'
    );
    assert.equal(
      rawTablesSrc.includes('lg:table-fixed'),
      true,
      'RawTablesView tables must use lg:table-fixed to enforce compact metadata columns and wide explanation columns'
    );
    assert.equal(
      rawTablesSrc.includes('data-testid="raw-table-technical-explanation-col"') &&
        rawTablesSrc.includes('lg:w-[53%]'),
      true,
      'RawTablesView must allocate 53% width to the Technical Explanation and Summary columns'
    );

    // 6. Focused Section Identity Card only on OVERVIEW tab, and Right-Click Context Menu with Expand on Diagram Nodes
    assert.equal(
      inspectorSrc.includes(
        "resolvedActiveTab === 'OVERVIEW' && activeInspectNode"
      ),
      true,
      'InspectorPanel must render inspector-section-identity-card ONLY when resolvedActiveTab === OVERVIEW'
    );
    assert.equal(
      visualizerSrc.includes('data-testid="diagram-node-context-menu"') &&
        visualizerSrc.includes('data-testid="context-menu-expand-node-btn"'),
      true,
      'AttackVisualizer must render a right-click context menu with Expand Inside Node button on diagram nodes'
    );

    // 7. Visual expand indicator icons (ZoomIn magnifying glass + Maximize2 expansion arrows) on main network topology nodes
    const nodeCompSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/DraggableDiagramNode.tsx'),
      'utf8'
    );
    assert.equal(
      nodeCompSrc.includes('node-expand-indicator-') &&
        nodeCompSrc.includes('<ZoomIn') &&
        nodeCompSrc.includes('<Maximize2'),
      true,
      'DraggableDiagramNode must render visual expand indicator icons (ZoomIn + Maximize2) on main network topology nodes'
    );

    // 8. Consistent parenthetical (why ...) annotations and Visual Memory Analysis Flowchart across every memory step in resolveScopedMemoryForensics and ProcessMemoryView
    const memoryViewSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/canvas/ProcessMemoryView.tsx'),
      'utf8'
    );
    const memoryFlowchartSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/canvas/MemoryForensicsFlowchart.tsx'),
      'utf8'
    );
    assert.equal(
      memoryViewSrc.includes('data-testid="memory-step-by-step-waterfall"') &&
        memoryViewSrc.includes('memory-step-why-') &&
        memoryViewSrc.includes('WHY / RAM MUTATION:') &&
        memoryViewSrc.includes('<MemoryForensicsFlowchart'),
      true,
      'ProcessMemoryView must render MemoryForensicsFlowchart, Step-by-Step Memory Mutation Waterfall, and parenthetical why callout boxes'
    );
    assert.equal(
      memoryFlowchartSrc.includes('data-testid="memory-flowchart-macro-pipeline"') &&
        memoryFlowchartSrc.includes('data-testid="memory-flowchart-steps-grid"') &&
        memoryFlowchartSrc.includes('<HardDriveDownload') &&
        memoryFlowchartSrc.includes('<ScanSearch') &&
        memoryFlowchartSrc.includes('<Microscope') &&
        !memoryFlowchartSrc.includes('truncate'),
      true,
      'MemoryForensicsFlowchart must render macro and step-by-step flowcharts with HardDriveDownload, ScanSearch, and Microscope icons and zero CSS truncate classes'
    );

    for (const sc of ATTACK_SCENARIOS) {
      const hasMem = (sc.processTree || []).some(
        (p) => (p.memoryBlocks || []).length > 0
      );
      if (!hasMem) continue;
      const scope = resolveInspectorScopeContext({
        scenario: sc,
        activeStageIndex: 0,
        activeEnvironment: 'WORKSTATION',
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
      const memModel = resolveScopedMemoryForensics(scope, null);
      assert.equal(memModel.hasDocumentedMemory, true);
      assert.equal(
        memModel.memoryStepTimeline.length,
        memModel.memoryBlocks.length,
        `${sc.id} memoryStepTimeline must cover every documented memory region`
      );
      assert.equal(
        memModel.flowchart.summaryPhases.length,
        3,
        `${sc.id} flowchart must have 3 summary phases (MEMORY_DUMP, STRING_ANALYSIS, FORENSIC_EXTRACTION)`
      );
      assert.deepEqual(
        memModel.flowchart.summaryPhases.map((p) => p.phaseId),
        ['MEMORY_DUMP', 'STRING_ANALYSIS', 'FORENSIC_EXTRACTION']
      );
      assert.equal(
        memModel.flowchart.stepRows.length,
        memModel.memoryBlocks.length,
        `${sc.id} flowchart.stepRows must mirror every documented memory step`
      );
      for (const row of memModel.flowchart.stepRows) {
        assert.equal(row.phases.length, 3);
        assert.equal(row.phases[0].phaseId, 'MEMORY_DUMP');
        assert.equal(row.phases[1].phaseId, 'STRING_ANALYSIS');
        assert.equal(row.phases[2].phaseId, 'FORENSIC_EXTRACTION');
        for (const phaseNode of row.phases) {
          assert.ok(
            /\(why/i.test(phaseNode.whyAnnotation),
            `${sc.id} flowchart phase ${phaseNode.phaseCode} must include a parenthetical (why ...) annotation`
          );
        }
      }
      for (const step of memModel.memoryStepTimeline) {
        assert.ok(
          step.stepCode.startsWith('M.'),
          `${sc.id} memory step must be numbered M.1..M.N`
        );
        assert.ok(
          /\(why/i.test(step.whyExplanation),
          `${sc.id} memory step ${step.stepCode} must have a parenthetical (why ...) explanation`
        );
        assert.ok(
          /\(why:/i.test(step.operationWhyNote),
          `${sc.id} memory step ${step.stepCode} must have an API parenthetical (why: ...) explanation`
        );
      }
      for (const block of memModel.memoryBlocks) {
        assert.ok(
          block.structuredClauses.length >= 1 &&
            block.structuredClauses.some(
              (c) => c.parentheticalReasons.length >= 1
            ),
          `${sc.id} memory block ${block.address} must have structured clauses with parenthetical why reasons`
        );
      }
    }

    // 9. Main Diagram always shows Main Scenario Page & Stages (never SECTION · NODE # or CLICKED SECTION on unexpanded main nodes)
    const triggerSection = inspectorSrc.slice(
      inspectorSrc.indexOf('export function FloatingHoverInspectorTrigger'),
      inspectorSrc.indexOf('export function InspectorPanel')
    );
    assert.equal(
      triggerSection.includes('SECTION · NODE #'),
      false,
      'FloatingHoverInspectorTrigger must never display SECTION · NODE # on the Main Topology Diagram'
    );
    assert.equal(
      triggerSection.includes('CLICKED SECTION'),
      false,
      'FloatingHoverInspectorTrigger must never display CLICKED SECTION on the Main Topology Diagram'
    );
    assert.equal(
      triggerSection.includes('data-testid="hover-card-main-stages-list"'),
      true,
      'FloatingHoverInspectorTrigger must display the Main Scenario Attack Stages list in the hover card when in MAIN_SCENARIO'
    );
    assert.equal(
      inspectorSrc.includes(
        "base.effectiveScope === 'MAIN_SCENARIO' && base.selectedMainNode"
      ),
      true,
      'InspectorPanel must normalize effectiveScopeContext to the full Main Scenario when in MAIN_SCENARIO'
    );
  });

  it('keeps Main Page Story-to-Spec Analogy strictly distinct from Technical Overview (no duplicate text)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { getRawScenarioStepGuide } = await import('./scenario-step-guides');

    for (const sc of ATTACK_SCENARIOS) {
      const mainScope = resolveInspectorScopeContext({
        scenario: sc,
        activeStageIndex: 0,
        activeEnvironment: 'WORKSTATION',
        selectedNodeId: null,
        expandedNodeId: null,
        selectedInternalSubNodeId: null,
      });
      const rawGuide = getRawScenarioStepGuide(sc.id);
      assert.ok(
        rawGuide?.briefing.storyAnalogy,
        `Scenario ${sc.id} must have a dedicated briefing.storyAnalogy`
      );
      assert.ok(
        rawGuide?.briefing.plainSummary,
        `Scenario ${sc.id} must have a dedicated briefing.plainSummary`
      );
      assert.equal(
        mainScope.scopedStoryAnalogy,
        rawGuide!.briefing.storyAnalogy,
        `Scenario ${sc.id} MAIN_SCENARIO scopedStoryAnalogy must be pure briefing.storyAnalogy, not concatenated scenario.overview`
      );
      assert.notEqual(
        mainScope.scopedStoryAnalogy.trim(),
        rawGuide!.briefing.plainSummary.trim(),
        `Scenario ${sc.id} Story Analogy must never equal Technical Overview`
      );
    }

    const inspectorSrc = readInspectorSources();
    assert.equal(
      inspectorSrc.includes('rawBriefingGuide?.briefing.storyAnalogy') &&
        inspectorSrc.includes('rawBriefingGuide?.briefing.plainSummary'),
      true,
      'InspectorPanel Main Page must pass rawBriefingGuide.briefing.storyAnalogy and rawBriefingGuide.briefing.plainSummary separately'
    );
  });

  it('keeps Cascading Process on Process Hierarchy tab and VAD State Mutation on Memory — never on Overview', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const inspectorSrc = readInspectorSources();
    const shellSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/inspector/InspectorPanel.tsx'),
      'utf8'
    );
    const overviewSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/inspector/tabs/OverviewTab.tsx'),
      'utf8'
    );
    const hierarchySrc = fs.readFileSync(
      path.join(
        process.cwd(),
        'components/inspector/tabs/ProcessHierarchyTab.tsx'
      ),
      'utf8'
    );
    const memorySrc = fs.readFileSync(
      path.join(process.cwd(), 'components/inspector/tabs/MemoryTab.tsx'),
      'utf8'
    );
    const stepsTabSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/inspector/tabs/StepsTab.tsx'),
      'utf8'
    );

    assert.equal(
      overviewSrc.includes('<InspectorContextMiniMap') ||
        overviewSrc.includes('InspectorContextMiniMap'),
      false,
      'OVERVIEW tab must not render InspectorContextMiniMap (Cascading Process / VAD belong elsewhere)'
    );

    assert.equal(
      inspectorSrc.includes("id: 'PROCESS_HIERARCHY'") &&
        inspectorSrc.includes('inspector-tab-process-hierarchy') &&
        shellSrc.includes("resolvedActiveTab === 'PROCESS_HIERARCHY'"),
      true,
      'Inspector sidebar must expose a dedicated PROCESS_HIERARCHY tab'
    );

    assert.equal(
      hierarchySrc.includes('cascadingProcess: true') &&
        hierarchySrc.includes('cascadingProcessEmbedded: true') &&
        hierarchySrc.includes('stateTransformation: false'),
      true,
      'PROCESS_HIERARCHY tab must render Cascading Process embedded in one card (not VAD)'
    );

    assert.equal(
      stepsTabSrc.includes('<InspectorContextMiniMap') ||
        stepsTabSrc.includes('InspectorContextMiniMap'),
      false,
      'STEP_GUIDE must not mount InspectorContextMiniMap (Cascading Process belongs on Process Hierarchy)'
    );
    assert.ok(
      stepsTabSrc.includes('onOpenProcessHierarchy'),
      'STEP_GUIDE must offer a Process Hierarchy handoff when cascade data exists'
    );

    const { readStepGuideSources } = await import('./read-step-guide-sources');
    const stepGuideSrc = readStepGuideSources();
    assert.equal(
      stepGuideSrc.includes('Active Parent ──▶ Child Process Waterfall'),
      false,
      'Steps must not embed the Cascading Process waterfall — Process Hierarchy owns it'
    );
    assert.ok(
      stepGuideSrc.includes('Open Process Hierarchy'),
      'Steps must point readers to Process Hierarchy when cascade data exists'
    );
    assert.ok(
      /omitStory[\s\S]{0,400}technicalHeading="1\. Scenario Briefing/.test(
        stepGuideSrc
      ) ||
        /Scenario Briefing · Technical Deep-Dive[\s\S]{0,200}omitStory/.test(
          stepGuideSrc
        ),
      'Steps #0 Scenario Briefing must omit Overview Story Analogy and expand technical detail'
    );
    assert.equal(
      /storyHeading="1\. Real-World Story Analogy:"[\s\S]{0,120}storyAnalogy=\{briefing\.storyAnalogy\}/.test(
        stepGuideSrc
      ),
      false,
      'Steps #0 must not re-render Overview Real-World Story Analogy'
    );

    assert.equal(
      memorySrc.includes('cascadingProcess: false') &&
        memorySrc.includes('stateTransformation: true'),
      true,
      'MEMORY tab must enable VAD State Transformation and disable Cascading Process'
    );
    assert.equal(
      inspectorSrc.includes('inspector-overview-memory-callout'),
      false,
      'OVERVIEW must not render a Memory forensics callout card'
    );
    assert.ok(
      /resolvedActiveTab !== 'OVERVIEW'[\s\S]{0,120}resolvedActiveTab !== 'STEP_GUIDE'[\s\S]{0,120}resolvedActiveTab !== 'PROCESS_HIERARCHY'[\s\S]{0,200}InspectorStageFilter/.test(
        shellSrc
      ),
      'Stage Filter standalone strip must not render on OVERVIEW, STEP_GUIDE, or PROCESS_HIERARCHY'
    );
    const stepsTabSrcMerged = fs.readFileSync(
      path.join(process.cwd(), 'components/inspector/tabs/StepsTab.tsx'),
      'utf8'
    );
    assert.ok(
      stepsTabSrcMerged.includes('inspector-steps-merged-shell'),
      'Steps tab must use a single merged shell card'
    );

    const modelSrc = fs.readFileSync(
      path.join(
        process.cwd(),
        'components/inspector/useInspectorPanelModel.tsx'
      ),
      'utf8'
    );
    assert.equal(
      /label:\s*[`'"][^`'"]*\(\$\{/.test(modelSrc) ||
        /label:\s*`[^`]*\$\{[^}]+\}[^`]*`/.test(modelSrc),
      false,
      'MOD-12: sidebar tab labels must not interpolate (N) count suffixes'
    );
    assert.ok(
      modelSrc.includes("label: 'Memory'") &&
        modelSrc.includes("label: 'SIEM Logs'"),
      'MOD-12: Memory and SIEM Logs sidebar labels must be bare names'
    );
  });
});

