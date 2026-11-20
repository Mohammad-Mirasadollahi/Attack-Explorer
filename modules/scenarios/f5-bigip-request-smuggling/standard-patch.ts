import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A front lobby receptionist counts sealed parcels differently from the back-office clerk receiving them on a conveyor belt. An outsider packs a second hidden work order inside one parcel so it bypasses the lobby badge desk, creates a new master clerk account, and runs unrestricted commands in the engine room.',
        storyMappings: [
          {
            storyTerm: 'Front lobby receptionist',
            technicalTerm: 'Front-end Apache reverse-proxy web server',
            tone: 'amber',
          },
          {
            storyTerm: 'Back-office conveyor clerk',
            technicalTerm: 'Internal Tomcat AJP servlet container',
            tone: 'sky',
          },
          {
            storyTerm: 'Second hidden work order',
            technicalTerm: 'Smuggled AJP administrative request (CVE-2023-46747)',
            tone: 'rose',
          },
          {
            storyTerm: 'Engine room terminal',
            technicalTerm: 'Root shell execution through management utility',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The outsider hands over a single oversized parcel at the lobby desk. The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats the inner slip as a pre-approved manager order.',
          storyMappings: [
            {
              storyTerm: 'Outer parcel wrapper',
              technicalTerm: 'Benign front-end HTTP request headers',
              tone: 'amber',
            },
            {
              storyTerm: 'Hidden parcel crease',
              technicalTerm: 'AJP request framing desynchronization flaw',
              tone: 'sky',
            },
            {
              storyTerm: 'Pre-approved manager order',
              technicalTerm: 'Smuggled request targeting /tmui/Control/jspmap/',
              tone: 'rose',
            },
            {
              storyTerm: 'Back-office clerk',
              technicalTerm: 'Backend Tomcat AJP connector listener',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to /tmui/Control/jspmap/ (indicating a smuggled request reached the internal management servlet).',
        },
        2: {
          storyAnalogy:
            'Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though nobody ever signed in at the front desk.',
          storyMappings: [
            {
              storyTerm: 'Staff roster book',
              technicalTerm: 'Appliance configuration user database',
              tone: 'amber',
            },
            {
              storyTerm: 'Senior supervisor badge',
              technicalTerm: 'Rogue administrator account with role=admin',
              tone: 'sky',
            },
            {
              storyTerm: 'Workshop master key',
              technicalTerm: 'Assigned advanced interactive shell access',
              tone: 'rose',
            },
            {
              storyTerm: 'Missing front-desk sign-in',
              technicalTerm: 'Account creation with no prior web login event',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a high-confidence indicator of administrative authentication bypass).',
        },
        3: {
          storyAnalogy:
            'Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing building.',
          storyMappings: [
            {
              storyTerm: 'Engine-room command console',
              technicalTerm: 'Management tmshCmd.jsp execution endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Unrestricted maintenance directive',
              technicalTerm: 'Arbitrary root command via util bash -c',
              tone: 'sky',
            },
            {
              storyTerm: 'Building traffic hub',
              technicalTerm: 'Compromised enterprise load-balancer appliance',
              tone: 'rose',
            },
            {
              storyTerm: 'Shift audit ledger',
              technicalTerm: 'Control-plane audit log recording shell runs',
              tone: 'emerald',
            },
          ],
          detectionAndEvidence:
            'Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface spawned underlying root shell commands).',
        },
      },
    };
