import test from 'node:test';
import assert from 'node:assert/strict';
import { ATTACK_SCENARIOS } from './attack-scenarios';
import {
  buildStageCommandBreakdowns,
  explainCommandLine,
  explainProcessNodeCommandLine,
} from './command-line-explanations';
import {
  buildDiagramStepGuideModel,
  parseStructuredExplanationClauses,
} from './scenario-step-guides';

test('all 126 scenarios and all stages produce comprehensive CommandLine breakdowns', () => {
  assert.ok(
    ATTACK_SCENARIOS.length >= 126,
    `Expected at least 126 scenarios, got ${ATTACK_SCENARIOS.length}`
  );

  let totalStages = 0;
  let totalCommandsExplained = 0;
  let totalParametersExplained = 0;

  for (const scenario of ATTACK_SCENARIOS) {
    const guideModel = buildDiagramStepGuideModel(scenario);
    assert.equal(
      guideModel.steps.length,
      scenario.stages.length,
      `Step count mismatch for ${scenario.id}`
    );

    for (const step of guideModel.steps) {
      totalStages++;
      assert.ok(
        step.commandBreakdowns.length >= 1,
        `Expected at least 1 command breakdown in ${scenario.id} stage ${step.stageIndex}`
      );

      for (const cmd of step.commandBreakdowns) {
        totalCommandsExplained++;
        assert.ok(
          cmd.rawCommand.trim().length > 0,
          `Empty rawCommand in ${scenario.id} S${step.stageIndex}`
        );
        assert.ok(
          cmd.whatItMeans.trim().length >= 40,
          `whatItMeans too short in ${scenario.id} S${step.stageIndex}: ${cmd.whatItMeans}`
        );
        assert.ok(
          cmd.exactPurpose.trim().length >= 40,
          `exactPurpose too short in ${scenario.id} S${step.stageIndex}: ${cmd.exactPurpose}`
        );
        assert.ok(
          cmd.parameters.length >= 1,
          `Expected at least 1 parameter breakdown for ${cmd.rawCommand} in ${scenario.id} S${step.stageIndex}`
        );
        for (const param of cmd.parameters) {
          totalParametersExplained++;
          assert.ok(param.token.trim().length > 0);
          assert.ok(param.meaning.trim().length >= 15);
        }
      }

      // Verify zero orphan parenthetical clauses in Story <-> Spec bridge or Under the Hood
      const bridgeClauses = parseStructuredExplanationClauses(
        step.simpleExplanation,
        `#${step.stepNumber}`
      );
      for (const clause of bridgeClauses) {
        assert.ok(
          !clause.coreStatement.trim().startsWith('('),
          `Orphan parenthetical clause found in ${scenario.id} S${step.stageIndex}: ${clause.fullText}`
        );
      }

      const hoodClauses = parseStructuredExplanationClauses(
        step.howItWorksInPractice,
        `#${step.stepNumber}.M`
      );
      for (const clause of hoodClauses) {
        assert.ok(
          !clause.coreStatement.trim().startsWith('('),
          `Orphan parenthetical hood clause found in ${scenario.id} S${step.stageIndex}: ${clause.fullText}`
        );
      }
    }
  }

  assert.ok(totalStages >= 380, `Expected >= 380 stages, got ${totalStages}`);
  assert.ok(
    totalCommandsExplained >= 800,
    `Expected >= 800 commands explained across all stages, got ${totalCommandsExplained}`
  );
  assert.ok(
    totalParametersExplained >= 1500,
    `Expected >= 1500 parameters explained, got ${totalParametersExplained}`
  );
});

test('all 531 processTree nodes across all scenarios have complete CommandLine explanations', () => {
  let processCount = 0;

  for (const scenario of ATTACK_SCENARIOS) {
    const tree = scenario.processTree || [];
    for (const proc of tree) {
      processCount++;
      const stage =
        scenario.stages.find((s) => s.index === proc.stageIndex) ||
        scenario.stages[0];
      const explanation = explainProcessNodeCommandLine(proc, scenario, stage);
      assert.ok(
        explanation.whatItMeans.length >= 40,
        `Process whatItMeans too short for ${proc.name} in ${scenario.id}`
      );
      assert.ok(
        explanation.exactPurpose.length >= 40,
        `Process exactPurpose too short for ${proc.name} in ${scenario.id}`
      );
      assert.ok(
        explanation.parameters.length >= 1,
        `Expected parameters for process ${proc.name} (${proc.commandLine}) in ${scenario.id}`
      );
    }
  }

  assert.ok(
    processCount >= 500,
    `Expected >= 500 processTree nodes, got ${processCount}`
  );
});

test('BITSAdmin qmgr.db scenario Stage 1 explains every command and switch in detail', () => {
  const bitsScenario = ATTACK_SCENARIOS.find(
    (s) => s.id === 'dfir-bitsadmin-qmgr-persistence-bits-client'
  );
  assert.ok(bitsScenario, 'Expected BITSAdmin scenario to exist');

  const stage1 = bitsScenario.stages[0];
  const breakdowns = buildStageCommandBreakdowns(bitsScenario, stage1);

  assert.ok(
    breakdowns.length >= 3,
    `Expected at least 3 command breakdowns for BITS Stage 1, got ${breakdowns.length}`
  );

  const cmd1 = breakdowns.find((b) => b.rawCommand.includes('/create'));
  assert.ok(cmd1, 'Expected COMMAND 1 (/create) breakdown');
  assert.match(cmd1.whatItMeans, /Background Intelligent Transfer Service|BITS/i);
  assert.match(cmd1.exactPurpose, /svchost\.exe|Windows Update|T1197/i);
  assert.ok(
    cmd1.parameters.some((p) => p.token.toLowerCase().includes('/create')),
    'Expected /create flag explanation'
  );
  assert.ok(
    cmd1.parameters.some((p) => p.token.toLowerCase().includes('/download')),
    'Expected /download flag explanation'
  );

  const cmd2 = breakdowns.find((b) => b.rawCommand.includes('/addfile'));
  assert.ok(cmd2, 'Expected COMMAND 2 (/addfile) breakdown');
  assert.match(cmd2.whatItMeans, /remote|destination|AddFile/i);
  assert.ok(
    cmd2.parameters.some((p) => p.token.toLowerCase().includes('/addfile')),
    'Expected /addfile flag explanation'
  );

  // Also check direct explainCommandLine on CWP RCE curl command
  const cwpCmd = explainCommandLine(
    'curl -i -s -k -X $"POST" "https://target:2031/ user_loader .php" --data-binary $"mod_security=1&module=phpini_editor"'
  );
  assert.match(cwpCmd.whatItMeans, /Control Web Panel|CWP|basename|user_loader/i);
  assert.match(cwpCmd.exactPurpose, /CVE-2026-24061|authentication|phpini_editor|unauthenticated/i);
});
