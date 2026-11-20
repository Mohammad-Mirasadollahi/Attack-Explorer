import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud office tower where building managers can slide a remote work-order envelope through the central dispatch wall straight into any locked virtual room without knowing the room own password. Using hijacked cloud manager rights, an intruder slips a custom script envelope through the wall, makes the room built-in guest butler execute it with full master keys, and reaches into the room internal badge box to lift the room cloud identity pass and widen their reach across the estate.',
      storyMappings: [
        {
          storyTerm: 'Sliding a remote work-order envelope through the central dispatch wall',
          technicalTerm: 'Azure ARM Microsoft.Compute/virtualMachines/extensions/write CustomScriptExtension',
          tone: 'amber',
        },
        {
          storyTerm: 'Room built-in guest butler executing the order with master keys',
          technicalTerm: 'WaAppAgent.exe or walinuxagent spawning child commands as SYSTEM or root',
          tone: 'sky',
        },
        {
          storyTerm: 'Reaching into the internal badge box for the cloud identity pass',
          technicalTerm: 'Querying local Azure IMDS (169.254.169.254) for Managed Identity OAuth tokens',
          tone: 'rose',
        },
        {
          storyTerm: 'Widening reach from one server back into the cloud control plane',
          technicalTerm: 'Using stolen Managed Identity tokens to access Azure Key Vault and Storage',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Without needing any SSH key or Windows password for the target server, the intruder uses compromised Azure management permissions to push a Custom Script Extension order straight down from the cloud control plane.',
        storyMappings: [
          {
            storyTerm: 'Pushing a script order from the cloud control plane',
            technicalTerm: 'ARM API call Microsoft.Compute/virtualMachines/extensions/write (CustomScriptExtension)',
            tone: 'amber',
          },
          {
            storyTerm: 'Skipping SSH keys and Windows passwords entirely',
            technicalTerm: 'Control-plane-to-data-plane bridge executing code inside the VM OS directly',
            tone: 'sky',
          },
          {
            storyTerm: 'Cloud management diary recording the push',
            technicalTerm: 'Azure Activity Log capturing exact caller identity, extension name, and target VM',
            tone: 'rose',
          },
          {
            storyTerm: 'Over-privileged cloud contributor role',
            technicalTerm: 'Compromised Virtual Machine Contributor or Owner RBAC assignment',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the virtual server, the always-running official Azure guest butler dutifully opens the incoming work order and launches the attacker script under supreme operating-system authority, leaving an unmistakable parent-child tree on disk.',
        storyMappings: [
          {
            storyTerm: 'Official Azure guest butler inside the server',
            technicalTerm: 'WaAppAgent.exe (Windows) or walinuxagent (Linux) receiving extension payloads',
            tone: 'amber',
          },
          {
            storyTerm: 'Launching the script under supreme OS authority',
            technicalTerm: 'Guest agent spawning powershell.exe or /bin/sh as NT AUTHORITY\\SYSTEM or root',
            tone: 'sky',
          },
          {
            storyTerm: 'Unmistakable parent-child tree on the host',
            technicalTerm: 'EDR / Sysmon EventID 1 flagging WaAppAgent.exe spawning encoded PowerShell or curl',
            tone: 'rose',
          },
          {
            storyTerm: 'Bridging cloud rights into live OS memory',
            technicalTerm: 'Host-level execution enabling credential dumping and local metadata queries',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing inside the server with supreme local rights, the script taps the room local identity window (supplying the required Metadata header) to withdraw the server own Managed Identity cloud pass and immediately unlocks connected Key Vaults and storage accounts.',
        storyMappings: [
          {
            storyTerm: 'Tapping the room local identity window',
            technicalTerm: 'HTTP GET http://169.254.169.254/metadata/identity/oauth2/token with Metadata: true header',
            tone: 'amber',
          },
          {
            storyTerm: 'Withdrawing the server Managed Identity pass',
            technicalTerm: 'Short-lived Azure AD OAuth JWT issued for the VM System-Assigned or User-Assigned Identity',
            tone: 'sky',
          },
          {
            storyTerm: 'Unlocking connected vaults and storage accounts',
            technicalTerm: 'Using the stolen Managed Identity token against Azure Key Vault and Storage APIs',
            tone: 'rose',
          },
          {
            storyTerm: 'Detecting off-box token replay',
            technicalTerm: 'Microsoft Defender for Cloud alerting on Managed Identity tokens used from external IPs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
