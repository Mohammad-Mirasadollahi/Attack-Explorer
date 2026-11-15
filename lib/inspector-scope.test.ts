import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  buildInspectorMiniMapModel,
  buildScopedCorrelatedLogs,
  buildScopedSequenceModel,
  buildScopedStepGuideModel,
  formatExpandedNodeScopeLabel,
  formatInternalSubNodeScopeLabel,
  resolveInspectorScopeContext,
  resolveScopedMemoryForensics,
  resolveScopedTelemetrySelection,
} from './inspector-scope';
import {
  clearDiagramMemoryForTesting,
  readLastVisitedDiagramSnapshot,
  saveLastVisitedDiagramSnapshot,
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
      (s) => s.id === 'dns-tunneling-exfil'
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
      (s) => s.id === 'dns-tunneling-exfil'
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
    assert.equal(stepGuide.internalSteps[0].forwardSeq, '2.1.1');
    assert.equal(stepGuide.internalSteps[0].returnSeq, '2.1.2');

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

    // 2. Scenarios WITHOUT documented memoryBlocks (e.g., dns-tunneling-exfil, ad-kerberoasting)
    const dnsScenario = ATTACK_SCENARIOS.find(
      (s) => s.id === 'dns-tunneling-exfil'
    )!;
    const dnsOverviewScope = resolveInspectorScopeContext({
      scenario: dnsScenario,
      activeStageIndex: 0,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: null,
      expandedNodeId: null,
      selectedInternalSubNodeId: null,
    });
    const dnsMem = resolveScopedMemoryForensics(dnsOverviewScope, null);
    assert.equal(dnsMem.hasDocumentedMemory, false);
    assert.equal(dnsMem.memoryBlocks.length, 0);

    // Expanding a host node in dns-tunneling-exfil must NOT fabricate memory blocks or VAD/RAM subnodes
    const dnsExpandedHostScope = resolveInspectorScopeContext({
      scenario: dnsScenario,
      activeStageIndex: 1,
      activeEnvironment: 'WORKSTATION',
      selectedNodeId: 'victim_laptop_node',
      expandedNodeId: 'victim_laptop_node',
      selectedInternalSubNodeId: null,
    });
    assert.equal(
      resolveScopedMemoryForensics(dnsExpandedHostScope, null)
        .hasDocumentedMemory,
      false
    );
    assert.ok(
      dnsExpandedHostScope.internalSubBoard!.subNodes.every(
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
      assert.ok(ex.forwardSeq.endsWith('.1'));
      assert.ok(ex.returnSeq.endsWith('.2'));
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
    assert.equal(expandedSeq.exchanges[0].forwardSeq, '4.1.1');
    assert.equal(expandedSeq.exchanges[0].returnSeq, '4.1.2');
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

    assert.equal(
      archetypesSeen.size,
      6,
      `All 6 structural diagram archetypes should be represented across the 85 scenarios, got: ${Array.from(archetypesSeen).join(', ')}`
    );
  });

  it('FloatingHoverInspectorTrigger removes the redundant Main Page button, uses diagramScope, and bounds summary height with vertical scroll so Open Main Scenario Page / Open Dedicated Section Page is always visible', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const inspectorSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/InspectorPanel.tsx'),
      'utf8'
    );

    const triggerSection = inspectorSrc.slice(
      inspectorSrc.indexOf('export function FloatingHoverInspectorTrigger'),
      inspectorSrc.indexOf('export function InspectorPanel')
    );

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
    const inspectorSrc = fs.readFileSync(
      path.join(process.cwd(), 'components/InspectorPanel.tsx'),
      'utf8'
    );

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
  });
});





