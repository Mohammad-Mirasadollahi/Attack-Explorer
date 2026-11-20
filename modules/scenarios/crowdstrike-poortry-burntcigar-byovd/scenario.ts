import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'crowdstrike-poortry-burntcigar-byovd',
    title: 'STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1562.001',
    description:
      'Threat actors (UNC3944 / Scattered Spider and RansomHub/ Cuba affiliates) use the STONESTOP loader to install POORTRY (BURNTCIGAR)—a custom malicious kernel driver signed via abused Microsoft WHQL attestation accounts—to zero out kernel process/thread/image notify callback arrays and terminate EDR processes.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'STONESTOP User-Mode Loader', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'WHQL-Signed POORTRY.sys Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ntoskrnl PspCreateProcessNotifyRoutine', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Mandiant / CrowdStrike Falcon Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Blinded Kernel Telemetry & LSASS Dump', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account',
        narration:
          'Unlike traditional BYOVD that abuses a bug in a legitimate third-party driver, STONESTOP loads POORTRY (BURNTCIGAR)—a purpose-built malicious kernel rootkit that attackers submitted through compromised Windows Hardware Developer Program (WHQL attestation signing) accounts to obtain a genuine Microsoft signature.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Defense Evasion (T1553.002 - Code Signing / Attestation Abuse)',
        technicalCommands: [
          'STONESTOP Loader: Drops C:\\Windows\\Temp\\poortry.sys (Signed by Microsoft Windows Hardware Compatibility Publisher)',
          'NtLoadDriver("\\Registry\\Machine\\System\\CurrentControlSet\\Services\\poortry")',
        ],
        defenseMitigation:
          'Apply Microsoft Security Advisory ADV220005 / KB5020779 certificate revocations and monitor kernel driver loads from non-standard directories (`C:\\Windows\\Temp\\`, `C:\\Users\\Public\\`).',
        logs: [
          {
            id: 'poor-1',
            timestamp: '15:20:11.402',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\Temp\\poortry.sys | Signed: true | Signature: Microsoft Windows Hardware Compatibility Publisher (Attestation Signed - ADV220005 Revoked) | Loader: STONESTOP',
            parsedFields: {
              MaliciousDriver: 'POORTRY / BURNTCIGAR (poortry.sys)',
              UserModeLoader: 'STONESTOP',
              SigningMethod: 'Abused Microsoft WHQL Attestation Signing (ADV220005)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping',
        narration:
          'STONESTOP completes a cryptographic challenge-response handshake over DeviceIoControl with POORTRY, then instructs the driver to scan ntoskrnl.exe memory for PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and PspLoadImageNotifyRoutine and overwrite the registered EDR callback pointers with NULL.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Blind Kernel Telemetry Callbacks)',
        technicalCommands: [
          'POORTRY Handshake: Custom rolling XOR/ECDSA challenge before unlocking driver IOCTL dispatch table',
          'Wipe Kernel Callbacks: PspCreateProcessNotifyRoutine[i] = NULL; ObUnRegisterCallbacks(...)',
        ],
        defenseMitigation:
          'Utilize hypervisor-enforced kernel integrity monitoring and EDR sensor self-defense that detects unauthorized removal or zeroing of `PspCreateProcessNotifyRoutine` entries.',
        logs: [
          {
            id: 'poor-2',
            timestamp: '15:20:12.118',
            source: 'EDR',
            severity: 'critical',
            raw: 'CrowdStrike / Mandiant Kernel Tampering Alert | Driver: poortry.sys | Action: Zeroed PspCreateProcessNotifyRoutine, PspLoadImageNotifyRoutine, and CmCallbackListHead (Registry Callbacks) in ntoskrnl.exe',
            parsedFields: {
              TamperedKernelArrays: 'PspCreateProcessNotifyRoutine, PspLoadImageNotifyRoutine, CmCallbackListHead',
              EvasionGoal: 'Blind EDR to all subsequent process, thread, DLL, and registry events',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump',
        narration:
          'POORTRY locates the EPROCESS kernel structures of security agents and lsass.exe, zeroes out their _PS_PROTECTION (PPL) and SignatureLevel bytes in kernel memory, terminates the EDR user-mode services, and allows STONESTOP to dump LSASS credentials unhindered.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - LSASS Memory)',
        technicalCommands: [
          'Direct Kernel Object Manipulation (DKOM): *(BYTE*)(pEprocess + ProtectionOffset) = 0x00',
          'ZwTerminateProcess(hEdrProcess, 0) -> Dump lsass.exe memory',
        ],
        defenseMitigation:
          'Enable Windows Credential Guard (VBS/Isolated User Mode `LsaIso.exe`) so even Ring-0 DKOM against `EPROCESS` cannot read plaintext secrets stored inside VTL1.',
        logs: [
          {
            id: 'poor-3',
            timestamp: '15:20:14.905',
            source: 'EDR',
            severity: 'critical',
            raw: 'Kernel DKOM Alert | TargetObject: EPROCESS (lsass.exe & CSFalconService.exe) | ModifiedField: _PS_PROTECTION / SignatureLevel set to 0x00 | FollowUp: Unprotected LSASS memory read',
            parsedFields: {
              DkomTarget: 'EPROCESS._PS_PROTECTION (SignatureLevel / SectionSignatureLevel)',
              Impact: 'PPL Stripped & LSASS Memory Dumped',
            },
          },
        ],
        packets: [],
      },
    ],
  };
