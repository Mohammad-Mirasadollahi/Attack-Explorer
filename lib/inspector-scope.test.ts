import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  buildScopedCorrelatedLogs,
  buildScopedStepGuideModel,
  formatExpandedNodeScopeLabel,
  formatInternalSubNodeScopeLabel,
  resolveInspectorScopeContext,
  resolveScopedTelemetrySelection,
} from './inspector-scope';
import { buildWhiteboardSchematic } from './sketch-zones-and-drilldown';

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
});
