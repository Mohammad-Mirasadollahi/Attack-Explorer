import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A factory assembly hub locks its supervisor offices behind a strict badge reader, yet an old side-door bell lets anyone mint a fresh master badge without showing identification. With that freshly minted badge, an intruder unlocks the factory repair console, steals product blueprints, and opens a covert courier drop to an outside locker.',
        storyMappings: [
          {
            storyTerm: 'Factory assembly hub',
            technicalTerm: 'JetBrains TeamCity build automation server',
            tone: 'amber',
          },
          {
            storyTerm: 'Old side-door bell',
            technicalTerm: 'Unauthenticated /RPC2 route bypass (CVE-2023-42793)',
            tone: 'sky',
          },
          {
            storyTerm: 'Factory repair console',
            technicalTerm: 'Internal debug process execution API',
            tone: 'rose',
          },
          {
            storyTerm: 'Outside courier locker',
            technicalTerm: 'Cloud-hosted command-and-control channel',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'An outsider rings a legacy service bell tagged onto the badge-printer route. Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor keycard.',
          storyMappings: [
            {
              storyTerm: 'Legacy service bell',
              technicalTerm: 'Appended /RPC2 URL suffix bypassing auth filter',
              tone: 'amber',
            },
            {
              storyTerm: 'Badge-printer route',
              technicalTerm: 'REST endpoint /app/rest/users/id:1/tokens/',
              tone: 'sky',
            },
            {
              storyTerm: 'Master supervisor keycard',
              technicalTerm: 'Minted administrator Bearer authentication token',
              tone: 'rose',
            },
            {
              storyTerm: 'Guard desk exemption',
              technicalTerm: 'Path-matching authentication flaw (CVE-2023-42793)',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in TeamCity teamcity-javaLogging and access logs (web server audit records of token minting): POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE /app/rest/users/id:1/tokens/RPC2 (showing unauthenticated creation and cleanup of an administrator bearer token).',
        },
        2: {
          storyAnalogy:
            'Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.',
          storyMappings: [
            {
              storyTerm: 'Maintenance switch',
              technicalTerm: 'Internal debug property enabling process execution',
              tone: 'amber',
            },
            {
              storyTerm: 'Factory supervisor terminal',
              technicalTerm: 'POST /app/rest/debug/processes endpoint',
              tone: 'sky',
            },
            {
              storyTerm: 'Discovery checklist',
              technicalTerm: 'Executed reconnaissance commands (whoami, nltest, curl)',
              tone: 'rose',
            },
            {
              storyTerm: 'Assembly controller process',
              technicalTerm: 'Server java.exe runtime spawning child utilities',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by Mandiant (post-exploitation telemetry from build server compromises): POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl (confirming remote command execution from the build management service).',
        },
        3: {
          storyAnalogy:
            'Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced to a public storage shelf.',
          storyMappings: [
            {
              storyTerm: 'Build locker combinations',
              technicalTerm: 'Harvested CI/CD credentials and repository tokens',
              tone: 'amber',
            },
            {
              storyTerm: 'Backup supervisor account',
              technicalTerm: 'Newly created rogue TeamCity administrator',
              tone: 'sky',
            },
            {
              storyTerm: 'Quiet messenger beacon',
              technicalTerm: 'GraphicalProton backdoor implant',
              tone: 'rose',
            },
            {
              storyTerm: 'Public storage shelf',
              technicalTerm: 'Abused OneDrive cloud C2 communication channel',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in Joint CISA Advisory and Mandiant (long-term persistence and C2 indicators): Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons (revealing persistent administrative access and covert cloud exfiltration).',
        },
      },
    };
