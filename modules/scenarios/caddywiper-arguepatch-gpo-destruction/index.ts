import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'caddywiper-arguepatch-gpo-destruction',
    title: 'Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper (T1561.001)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.001',
    description:
      'Sandworm pushes CaddyWiper across enterprise networks via Active Directory Group Policy Objects (GPO) and the ArguePatch loader (a patched legitimate IDA Pro remote debugger server binary). CaddyWiper calls DsRoleGetPrimaryDomainInformation to intentionally skip Domain Controllers (preserving Sandworm’s foothold) while zeroing out C:\\Users, D:\\..Z:\\, and \\\\.\\PhysicalDrive* on all member hosts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandworm GPO Scheduled Task Push', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ArguePatch Loader (Patched win32_remote.exe)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CaddyWiper (DsRole Domain Controller Check)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'ESET / Cisco Talos / CERT-UA Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        narration:
          'From a compromised Domain Controller, Sandworm creates a Group Policy Scheduled Task that copies and executes ArguePatch (a patched copy of Hex-Rays IDA Pro’s legitimate win32_remote.exe debugger server) or caddy.exe across all domain-joined machines, decrypting the CaddyWiper shellcode in memory.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Execution & Defense Evasion (T1053.005 - Scheduled Task / T1574)',
        technicalCommands: [
          'GPO Scheduled Task: Copy \\\\DC01\\SYSVOL\\corp.local\\scripts\\caddy.exe -> C:\\Users\\Public\\',
          'ArguePatch Loader: Patched IDA win32_remote.exe decrypts and jumps to CaddyWiper shellcode in RAM',
        ],
        defenseMitigation:
          'Audit Active Directory Group Policy Object modifications (EventID 5136) for newly added Immediate Scheduled Tasks referencing `SYSVOL` or `NETLOGON` binaries.',
        logs: [
          {
            id: 'caddy-1',
            timestamp: '10:00:02.115',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'win32_remote.exe',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\svchost.exe (Schedule) | Image: C:\\Users\\Public\\win32_remote.exe (ArguePatch Loader) | Payload: CaddyWiper In-Memory Shellcode | Deployment: Active Directory GPO',
            parsedFields: {
              DeliveryVector: 'Active Directory GPO Scheduled Task',
              LoaderName: 'ArguePatch (Patched Hex-Rays IDA win32_remote.exe)',
              WiperPayload: 'CaddyWiper (T1561.001)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        narration:
          'Upon starting, CaddyWiper resolves APIs dynamically on the stack and calls DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &info). If MachineRole equals DsRole_RolePrimaryDomainController (5), CaddyWiper immediately exits—ensuring the Domain Controller stays alive to keep pushing the wiper GPO to newly booted machines.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Discovery & Execution Guardrails (T1082 / T1480 - Execution Guardrails)',
        technicalCommands: [
          'DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &pInfo)',
          'if (pInfo->MachineRole == DsRole_RolePrimaryDomainController) { ExitProcess(0); }',
        ],
        defenseMitigation:
          'Immediately unlink malicious GPOs and isolate the Primary Domain Controller (`PDC`) during a wiper outbreak, as the PDC is intentionally left intact by the malware to act as the distribution engine.',
        logs: [
          {
            id: 'caddy-2',
            timestamp: '10:00:02.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'CaddyWiper Execution Guardrail Alert | API: netapi32!DsRoleGetPrimaryDomainInformation | CheckedValue: DsRole_RolePrimaryDomainController (0x5) | HostRole: Member Workstation (Proceeding with Wipe)',
            parsedFields: {
              GuardrailApi: 'netapi32.dll!DsRoleGetPrimaryDomainInformation',
              SparedRole: 'DsRole_RolePrimaryDomainController (5)',
              OperationalReason: 'Preserve AD GPO distribution & attacker foothold on DC',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        narration:
          'On all non-DC machines, CaddyWiper enables SeTakeOwnershipPrivilege, recursively takes ownership (`SetNamedSecurityInfoA` + `SetEntriesInAclA`) and zeroes out every file in `C:\\Users` and drives `D:\\` through `Z:\\`, and finally calls `DeviceIoControl` with `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) on `\\\\.\\PhysicalDrive9` down to `\\\\.\\PhysicalDrive0` to zero out the GPT/MBR partition layout.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1561.001 - Disk Content Wipe / T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'Recursive ACL Takeover + Zero-Fill: C:\\Users\\* and D:\\ .. Z:\\',
          'DeviceIoControl("\\\\.\\PhysicalDrive0", IOCTL_DISK_SET_DRIVE_LAYOUT_EX [0x7C054], &zeroBuffer, 0x780, ...)',
        ],
        defenseMitigation:
          'Block `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) calls from non-disk-management processes and monitor high-velocity `SetNamedSecurityInfoA` ACL modifications across `C:\\Users`.',
        logs: [
          {
            id: 'caddy-3',
            timestamp: '10:00:08.912',
            source: 'EDR',
            severity: 'critical',
            raw: 'Partition Layout Destruction Alert (CaddyWiper) | Process: win32_remote.exe | Target: \\\\.\\PhysicalDrive9 .. \\\\.\\PhysicalDrive0 | IOCTL: 0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX with 1,920 zero bytes) | Result: All disk partitions erased',
            parsedFields: {
              FileWipeScope: 'C:\\Users and Drives D:\\ through Z:\\ (Zero-filled)',
              PartitionWipeIoctl: '0x0007C054 (IOCTL_DISK_SET_DRIVE_LAYOUT_EX)',
              PhysicalDrivesTargeted: '\\\\.\\PhysicalDrive9 down to \\\\.\\PhysicalDrive0',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'caddywiper-arguepatch-gpo-destruction',
    briefing: {
      headline:
        'Sandworm deploys CaddyWiper via Active Directory GPO and the ArguePatch loader (patched IDA win32_remote.exe), calling DsRoleGetPrimaryDomainInformation to intentionally spare Domain Controllers while zeroing out C:\\Users and \\\\.\\PhysicalDrive* partition layouts via IOCTL 0x0007C054.',
      storyAnalogy:
        'Imagine an army of demolition robots dispatched from a central radio tower (Primary Domain Controller) to tear down every building in a compound. If the first robot to wake up accidentally demolishes the central radio tower itself, none of the remaining buildings will ever receive the demolition signal! So the robot’s first instruction (DsRoleGetPrimaryDomainInformation) is: "Check if I am standing inside the central radio tower. If yes, go to sleep immediately; if no, erase every room and smash the foundation."',
      plainSummary:
        'In this scenario (T1053.005, Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper (T1561.001)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: gPO Mass Deployment, then dsRoleGetPrimaryDomainInformation Check, then takeOwnership Recursive File Zeroing. Steps #1–#3 walk that chain end-to-end by covering GPO Mass Deployment, then DsRoleGetPrimaryDomainInformation Check, then TakeOwnership Recursive File Zeroing, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Sandworm GPO Scheduled Task Push -> ArguePatch Loader (Patched win32_remote.exe) -> CaddyWiper (DsRole Domain Controller Check) -> IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing -> ESET / Cisco Talos / CERT-UA Sensor.',
      documentedAdvisory:
        'ESET CaddyWiper & ArguePatch Technical Analysis / Cisco Talos CaddyWiper Report / CERT-UA#4195 & MITRE S0693',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1053.005',
        plainTitle: 'GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        storyAnalogy:
          'Using the company’s own Group Policy loudspeaker, the attacker pushes out a legitimate-looking programmer’s debugging tool (win32_remote.exe) whose startup code has been secretly rewired to unpack a wiper in RAM.',
        simpleExplanation:
          'From a compromised Domain Controller, Sandworm staged payloads in SYSVOL and pushed an Active Directory Group Policy Scheduled Task to execute CaddyWiper either directly (caddy.exe) or wrapped inside ArguePatch (a modified copy of Hex-Rays IDA Pro’s legitimate win32_remote.exe binary where Sandworm patched a single internal function to read, XOR-decrypt, and execute encrypted CaddyWiper shellcode directly in memory).',
        howItWorksInPractice:
          'Sandworm reused the exact same ArguePatch loader weeks later during the April 2022 electrical substation attack (Industroyer2) to schedule timed destruction of Windows servers. In the documented EventID 1 exchange from Sandworm GPO Scheduled Task Push to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 1 (confirming that the win32_remote.exe request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Sandworm GPO Scheduled Task Push to the ArguePatch Loader (Patched win32_remote.exe).',
        detectionAndEvidence:
          'Sysmon EventID 1 for win32_remote.exe or caddy.exe spawned by the Task Scheduler (svchost.exe -k netsvcs -p -s Schedule) from C:\\Users\\Public or SYSVOL. Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1082',
        plainTitle: 'DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        storyAnalogy:
          'Before lighting the fuse, the wiper checks the machine’s job title, and if the machine is the Primary Domain Controller, the wiper walks away so the Domain Controller stays alive to infect everyone else.',
        simpleExplanation:
          'Resolving API names dynamically on the stack to hide its Import Address Table (IAT), CaddyWiper’s very first action was calling DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &pInfo) from netapi32.dll (checking whether pInfo->MachineRole == DsRole_RolePrimaryDomainController [value 5], and immediately terminating itself without wiping anything if running on a Primary Domain Controller so Sandworm retained its Active Directory foothold and GPO distribution server).',
        howItWorksInPractice:
          'This execution guardrail explains why responders during a CaddyWiper incident often found member workstations and application servers completely bricked while the Primary Domain Controller remained up and actively pushing the malicious GPO. In the documented EDR exchange from Perimeter Firewall & NDR Tap to ArguePatch Loader (Patched win32_remote.exe), ArguePatch Loader (Patched win32_remote.exe) responds with ALERT T1082 (confirming that the Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers request succeeded on ArguePatch Loader (Patched win32_remote.exe) and establishing the runtime state required for Step #3 Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the ArguePatch Loader to the CaddyWiper (DsRole Domain Controller Check) node and triggers the ESET / Cisco Talos / CERT-UA Sensor.',
        detectionAndEvidence:
          'Behavioral sandboxes and EDR sensors detecting stack-constructed strings for DsRoleGetPrimaryDomainInformation, SeTakeOwnershipPrivilege, and PhysicalDrive inside win32_remote.exe.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1561.001',
        plainTitle: 'TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        storyAnalogy:
          'On every non-DC computer, the wiper legally transfers ownership of every file to itself, overwrites them with zeros, and then sends a single disk-layout command that erases the drive’s partition map.',
        simpleExplanation:
          'On member workstations and servers, CaddyWiper enabled SeTakeOwnershipPrivilege, recursively walked C:\\Users and all drives from D:\\ to Z:\\ calling SetNamedSecurityInfoA (transferring file ownership and DACLs to the current user before overwriting every file’s contents with 0x00 null bytes), and finally looped from \\\\.\\PhysicalDrive9 down to \\\\.\\PhysicalDrive0 issuing DeviceIoControl with IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054 passing a 1,920-byte zero-filled DRIVE_LAYOUT_INFORMATION_EX structure that instructs the Windows disk driver itself to erase the MBR/GPT partition tables).',
        howItWorksInPractice:
          'By abusing the legitimate Windows kernel disk IOCTL IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) rather than bringing a third-party kernel driver, CaddyWiper destroyed the disk partition table without needing a BYOVD driver. In the documented EDR exchange from ArguePatch Loader (Patched win32_remote.exe) to CaddyWiper (DsRole Domain Controller Check), CaddyWiper (DsRole Domain Controller Check) responds with ALERT T1561.001 (confirming that the Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe request succeeded on CaddyWiper (DsRole Domain Controller Check) and completing the final execution objective of Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper (T1561.001)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the CaddyWiper check proceeding into IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing on member hosts.',
        detectionAndEvidence:
          'EDR kernel filter blocking IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) with zeroed partition entries and alerting on rapid SetNamedSecurityInfoA ownership takeovers across C:\\Users.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cunning saboteur operating inside a company headquarters who deliberately spares the central dispatch tower itself so the tower stays alive long enough to broadcast destruction orders to every branch office. Using a disguised repair-tool wrapper pushed from the central policy board, the wiper checks whether each machine is the dispatch tower first; on every regular office computer, it seizes ownership of every user drawer, scrubs every document to blank zeros, and erases the floor plan of every hard drive.',
      storyMappings: [
        {
          storyTerm: 'Disguised repair-tool wrapper pushed from the central policy board',
          technicalTerm: 'Active Directory GPO pushing ArguePatch patched IDA debugger loader from SYSVOL',
          tone: 'amber',
        },
        {
          storyTerm: 'Checking whether each machine is the dispatch tower so it stays alive',
          technicalTerm: 'DsRoleGetPrimaryDomainInformation check sparing Primary Domain Controllers',
          tone: 'sky',
        },
        {
          storyTerm: 'Seizing ownership of every drawer and scrubbing documents to blank zeros',
          technicalTerm: 'SeTakeOwnershipPrivilege recursive C:\\Users file zeroing via SetNamedSecurityInfoA',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing the floor plan of every hard drive',
          technicalTerm: 'Raw partition table wipe via IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the entire company through the official morning policy board.',
        storyMappings: [
          {
            storyTerm: 'Central dispatch tower policy board',
            technicalTerm: 'Compromised Domain Controller SYSVOL share and Group Policy Object (GPO) push',
            tone: 'amber',
          },
          {
            storyTerm: 'Surgically altered known software debugger',
            technicalTerm: 'ArguePatch trojanized legitimate IDA Pro debugger binary (win32_remote.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden trigger spliced into the opening routine',
            technicalTerm: 'Patched entry point decrypting and launching the CaddyWiper shellcode payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Company-wide synchronized deployment',
            technicalTerm: 'Scheduled task created across all domain-joined workstations and member servers',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is standing inside the central dispatch tower, it immediately steps back so the tower stays online to keep wrecking every other room.',
        storyMappings: [
          {
            storyTerm: 'Assembling command labels piece by piece in private',
            technicalTerm: 'Stack-constructed API strings hiding imports from the PE Import Address Table (IAT)',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking the room nameplate first',
            technicalTerm: 'Calling DsRoleGetPrimaryDomainInformation to inspect machine domain role',
            tone: 'sky',
          },
          {
            storyTerm: 'Stepping back when standing inside the central dispatch tower',
            technicalTerm: 'Exiting immediately if role equals DsRole_RolePrimaryDomainController',
            tone: 'rose',
          },
          {
            storyTerm: 'Keeping the dispatch tower alive to spread destruction',
            technicalTerm: 'Preserving Active Directory GPO replication while wiping all member endpoints',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert via behavioral sandboxes and EDR memory scanners detecting stack-constructed API strings for DsRoleGetPrimaryDomainInformation, SeTakeOwnershipPrivilege, and PhysicalDrive inside trojanized binaries such as win32_remote.exe (catching CaddyWiper pre-wipe staging).',
      },
      3: {
        storyAnalogy:
          'On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a single raw control blast that erases the master partition blueprint of every attached hard drive.',
        storyMappings: [
          {
            storyTerm: 'Claiming legal ownership of every locked desk drawer',
            technicalTerm: 'Enabling SeTakeOwnershipPrivilege and calling SetNamedSecurityInfoA across C:\\Users',
            tone: 'amber',
          },
          {
            storyTerm: 'Overwriting every file with blank zeros',
            technicalTerm: 'Recursive zero-byte file destruction across local folders and mapped network drives',
            tone: 'sky',
          },
          {
            storyTerm: 'Single raw control blast erasing the drive blueprint',
            technicalTerm: 'DeviceIoControl IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) wiping partition tables',
            tone: 'rose',
          },
          {
            storyTerm: 'Kernel shield blocking drive layout wipes',
            technicalTerm: 'EDR kernel disk filter blocking zeroed IOCTL_DISK_SET_DRIVE_LAYOUT_EX calls',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR kernel disk filters to block IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054, the raw disk control code that overwrites partition tables) when passed zeroed partition entries, paired with behavioral alerts on rapid SetNamedSecurityInfoA ownership sweeps across C:\\Users.',
      },
    },
  };
