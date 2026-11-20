import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-azure-vm-custom-script-extension-managed-identity-audit',
    title: 'Microsoft Defender for Cloud, Mandiant & MITRE — Azure VM CustomScriptExtension & IMDS Managed Identity Token Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1059',
    description:
      'Grounded in Microsoft Defender for Cloud threat research, Mandiant Azure post-exploitation playbooks, and MITRE ATT&CK T1059 / T1552.005: DFIR analysts investigate how a compromised Azure Contributor role invokes Microsoft.Compute/virtualMachines/extensions/write (CustomScriptExtension or RunCommand) to execute commands as SYSTEM/root inside a VM and harvest the Azure Instance Metadata Service (IMDS 169.254.169.254) Managed Identity token.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised Azure Contributor Principal', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Azure Resource Manager (ARM API)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Azure VM WaAppAgent / CustomScriptExtension', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Azure Activity Log & Defender for Endpoint', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Azure IMDS (169.254.169.254) & Key Vault', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ARM Control-Plane Microsoft.Compute/virtualMachines/extensions/write Invocation',
        narration:
          'Holding RBAC permissions on the subscription or resource group, the actor dispatches an ARM PUT request to Microsoft.Compute/virtualMachines/extensions/write (or runCommand/action), recorded in AzureActivity logs.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Execution (T1059 - Command and Scripting Interpreter)',
        technicalCommands: [
          'AzureActivity | where OperationNameValue =~ "MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE"',
          'az vm extension list --resource-group prod-rg --vm-name prod-app-vm01',
        ],
        defenseMitigation:
          'Restrict Microsoft.Compute/virtualMachines/extensions/write and runCommand/action using Azure Policy and custom RBAC roles, and require JIT/PIM activation for VM Contributor roles.',
        logs: [
          {
            id: 'az-cse-1',
            timestamp: '13:05:19.220',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'AzureResourceManager',
            CommandLine: 'PUT /subscriptions/.../virtualMachines/prod-app-vm01/extensions/CustomScriptExtension',
            raw: 'AzureActivity: {"OperationNameValue":"MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE","ActivityStatusValue":"Succeeded","Caller":"svc-infra-deploy@corp.local","ResourceId":"/subscriptions/sub-01/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/prod-app-vm01/extensions/CustomScriptExtension"}',
            parsedFields: {
              ArmOperation: 'MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE',
              ExtensionType: 'Microsoft.Compute.CustomScriptExtension',
              TargetVirtualMachine: 'prod-app-vm01',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Guest Agent (WaAppAgent.exe / walinuxagent) SYSTEM Child Process Execution',
        narration:
          'Inside the guest OS, the Azure VM Agent (WindowsAzureGuestAgent.exe or walinuxagent) downloads the extension payload into C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\ (or /var/lib/waagent/custom-script/download/) and executes it as SYSTEM/root.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1078.004 - Cloud Accounts)',
        technicalCommands: [
          'DeviceProcessEvents | where InitiatingProcessFileName has_any ("WindowsAzureGuestAgent.exe", "enable.cmd")',
          'ls -la /var/lib/waagent/custom-script/download/0/',
        ],
        defenseMitigation:
          'Correlate AzureActivity extensions/write events with host EDR process creation events beneath C:\\Packages\\Plugins\\ or /var/lib/waagent/custom-script/.',
        logs: [
          {
            id: 'az-cse-2',
            timestamp: '13:05:24.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'powershell.exe',
            CommandLine: 'powershell.exe -ExecutionPolicy Unrestricted -File C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\diag_collect.ps1',
            raw: 'EventID: 1 | ParentImage: C:\\WindowsAzure\\Packages\\WaAppAgent.exe | Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe | User: NT AUTHORITY\\SYSTEM | CommandLine: powershell.exe -File C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\diag_collect.ps1',
            parsedFields: {
              ParentAgent: 'C:\\WindowsAzure\\Packages\\WaAppAgent.exe',
              PluginDirectory: 'C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\',
              ExecutionIntegrity: 'NT AUTHORITY\\SYSTEM',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Local IMDS (169.254.169.254) Managed Identity OAuth Token Acquisition & Key Vault Read',
        narration:
          'Running inside the VM, the script queries http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net with header Metadata: true to obtain the VM System-Assigned Managed Identity token and read Azure Key Vault secrets.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Credential Access (T1552.005 - Cloud Instance Metadata API)',
        technicalCommands: [
          'AADManagedIdentitySignInLogs | where ServicePrincipalName == "prod-app-vm01"',
          'AzureDiagnostics | where ResourceProvider == "MICROSOFT.KEYVAULT" and OperationName == "SecretGet"',
        ],
        defenseMitigation:
          'Scope VM Managed Identities to least-privilege Key Vault RBAC roles, restrict Key Vault network access with Private Endpoints, and monitor AADManagedIdentitySignInLogs for anomalous resource token requests.',
        logs: [
          {
            id: 'az-cse-3',
            timestamp: '13:05:31.104',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'KeyVaultAudit',
            CommandLine: 'GET https://prod-fin-kv.vault.azure.net/secrets/sql-conn-string?api-version=7.4',
            raw: 'AzureDiagnostics: {"ResourceProvider":"MICROSOFT.KEYVAULT","OperationName":"SecretGet","ResultType":"Success","identity_claim_appid_g":"91b2c3d4-5566-7788-9900-aabbccddeeff (ManagedIdentity: prod-app-vm01)","requestUri_s":"https://prod-fin-kv.vault.azure.net/secrets/sql-conn-string"}',
            parsedFields: {
              MetadataEndpoint: 'http://169.254.169.254/metadata/identity/oauth2/token',
              KeyVaultOperation: 'SecretGet (sql-conn-string)',
              CallerIdentity: 'System-Assigned Managed Identity (prod-app-vm01)',
            },
          },
        ],
      },
    ],
  };
