import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'caddywiper-arguepatch-gpo-destruction',
    briefing: {
      headline:
        'Sandworm deploys CaddyWiper via Active Directory GPO and the ArguePatch loader (patched IDA win32_remote.exe), calling DsRoleGetPrimaryDomainInformation to intentionally spare Domain Controllers while zeroing out C:\\Users and \\\\.\\PhysicalDrive* partition layouts via IOCTL 0x0007C054.',
      storyAnalogy:
        'Imagine an army of demolition robots dispatched from a central radio tower (Primary Domain Controller) to tear down every building in a compound. If the first robot to wake up accidentally demolishes the central radio tower itself, none of the remaining buildings will ever receive the demolition signal! So the robot’s first instruction (DsRoleGetPrimaryDomainInformation) is: "Check if I am standing inside the central radio tower. If yes, go to sleep immediately; if no, erase every room and smash the foundation."',
      plainSummary:
        'Analyzed by ESET, Cisco Talos, and CERT-UA in March–April 2022 during Sandworm attacks against Ukrainian financial and energy organizations (including alongside Industroyer2), CaddyWiper is a compact 9KB C++ destructive wiper often loaded in memory by ArguePatch (a patched version of Hex-Rays IDA Pro’s signed/legitimate win32_remote.exe debugger server). Pushed via Active Directory GPO Scheduled Tasks, CaddyWiper first calls DsRoleGetPrimaryDomainInformation and exits immediately if running on a Primary Domain Controller (DsRole_RolePrimaryDomainController), then recursively zeroes out C:\\Users and drives D:..Z: before wiping disk partition tables on \\\\.\\PhysicalDrive9..0 via IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054).',
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
          'Sysmon EventID 1 for win32_remote.exe or caddy.exe spawned by the Task Scheduler (svchost.exe -k netsvcs -p -s Schedule) from C:\\Users\\Public or SYSVOL.',
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
