import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'crowdstrike-poortry-burntcigar-byovd',
    briefing: {
      headline:
        'Threat actors (UNC3944 / RansomHub) use the STONESTOP loader to install POORTRY (BURNTCIGAR), a custom malicious kernel rootkit signed via abused Microsoft WHQL attestation accounts, to wipe kernel notify callbacks and strip PPL protections.',
      storyAnalogy:
        'Instead of tricking an old maintenance robot, a syndicate sets up a fake hardware company, submits their own custom-built assassin robot to the official city licensing office (WHQL Attestation Signing), gets an official holographic seal stamped onto it, and walks it right into the central nervous system of the building where it erases the phone numbers of every security guard on the emergency call list (PspCreateProcessNotifyRoutine).',
      plainSummary:
        'In this scenario (T1553.002, STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: loading Custom Malicious Driver POORTRY, then authenticated IOCTL Handshake, then ePROCESS Protection Bit Stripping, EDR. Steps #1–#3 walk that chain end-to-end by covering Loading Custom Malicious Driver POORTRY, then Authenticated IOCTL Handshake, then EPROCESS Protection Bit Stripping, EDR, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
      diagramTopologySummary:
        'STONESTOP User-Mode Loader -> WHQL-Signed POORTRY.sys Driver -> ntoskrnl PspCreateProcessNotifyRoutine -> Blinded Kernel Telemetry & LSASS Dump -> Mandiant / CrowdStrike Falcon Sensor.',
      documentedAdvisory:
        'Mandiant Prolific Driver Signing Abuse (STONESTOP / POORTRY) / Microsoft Security Advisory ADV220005 / CrowdStrike BURNTCIGAR Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1553.002',
        plainTitle: 'Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account',
        storyAnalogy:
          'The attacker presents a brand-new, custom-written rootkit that carries a genuine Microsoft hardware certification stamp obtained through a fraudulent developer account.',
        simpleExplanation:
          'The user-mode loader STONESTOP dropped poortry.sys (BURNTCIGAR) to disk and invoked NtLoadDriver. Because the threat actor had submitted poortry.sys through compromised or fraudulent accounts in the Microsoft Windows Hardware Compatibility Program (WHQL Attestation Signing) portal, the malicious driver bore a valid Microsoft Windows Hardware Compatibility Publisher signature and loaded cleanly into Ring 0 on modern Windows systems.',
        howItWorksInPractice:
          'Because poortry.sys was a brand-new custom binary rather than a known historical vulnerable driver, hash-based vulnerable driver blocklists did not block it until Microsoft revoked the underlying WHQL certificates in ADV220005. In the documented EventID 6 exchange from STONESTOP User-Mode Loader to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 6 (confirming that the Stage 1: Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the STONESTOP User-Mode Loader to the WHQL-Signed POORTRY.sys Driver as it loads into Ring 0.',
        detectionAndEvidence:
          'Sysmon EventID 6 driver loads from temp/user directories (C:\\Windows\\Temp\\, C:\\ProgramData\\) and enforcement of Microsoft ADV220005 / KB5020779 certificate revocations.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping',
        storyAnalogy:
          'To stop researchers from analyzing the robot, it refuses to act until its controller whispers a secret cryptographic password, and then it erases the kernel’s notification phonebook so security tools never hear about new programs starting.',
        simpleExplanation:
          'Before executing commands, POORTRY required STONESTOP to complete a cryptographic challenge-response handshake over DeviceIoControl (preventing security analysts or competing malware from invoking its IOCTLs without the matching STONESTOP loader). Once authenticated, POORTRY scanned ntoskrnl.exe memory to locate the PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and PspLoadImageNotifyRoutine kernel callback arrays and overwrote the registered EDR driver callback pointers with NULL (blinding EDR kernel drivers so the Windows kernel no longer notified them when new processes, threads, or DLLs were created).',
        howItWorksInPractice:
          'POORTRY also unlinked registry (CmUnRegisterCallback) and object (ObUnRegisterCallbacks) filter callbacks and removed minifilter filesystem callbacks registered by endpoint security sensors. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the WHQL-Signed POORTRY.sys Driver to ntoskrnl PspCreateProcessNotifyRoutine and triggers the Mandiant / CrowdStrike Falcon Sensor.',
        detectionAndEvidence:
          'EDR kernel callback integrity watchdogs that periodically verify their own function pointers remain present in PspCreateProcessNotifyRoutine and ObRegisterCallbacks.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1003.001',
        plainTitle: 'EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump',
        storyAnalogy:
          'Finally, the rootkit reaches into the kernel’s ID badge table, erases the "Protected" stamp next to the password vault (lsass.exe) and the security guards, kills the guards, and empties the vault.',
        simpleExplanation:
          'POORTRY performed Direct Kernel Object Manipulation (DKOM) against the opaque EPROCESS kernel structures of both EDR processes and lsass.exe, zeroing out their _PS_PROTECTION (Protection, SignatureLevel, and SectionSignatureLevel bytes in kernel memory) before calling ZwTerminateProcess on the EDR agents and allowing STONESTOP to dump lsass.exe memory without triggering PPL access-denied errors.',
        howItWorksInPractice:
          'UNC3944 (Scattered Spider) and multiple ransomware affiliates used STONESTOP/POORTRY on high-value telecom, BPO, and financial servers to silence EDR telemetry prior to credential dumping and VMware ESXi takeover. In the documented EDR exchange from WHQL-Signed POORTRY.sys Driver to ntoskrnl PspCreateProcessNotifyRoutine, ntoskrnl PspCreateProcessNotifyRoutine responds with ALERT T1003.001 (confirming that the Stage 3: EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump request succeeded on ntoskrnl PspCreateProcessNotifyRoutine and completing the final execution objective of STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the ntoskrnl tampering node to the Blinded Kernel Telemetry & LSASS Dump stage.',
        detectionAndEvidence:
          'Enabling Windows Credential Guard (Virtualization-Based Security LsaIso.exe) so LSASS secrets reside in VTL1 hypervisor memory unreachable even from Ring-0 VTL0 kernel drivers. Correlate Sysmon or Windows Security Event telemetry for T1003.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a heist crew that skips stealing an old inspector badge and instead hijacks the government badge-printing office to stamp their own custom saboteur card. Once inside the building control room, the saboteur requires a secret spoken handshake before cutting every alarm wire on the central watchboard and erasing the armored insignia from both the security guards and the vault master ledger.',
      storyMappings: [
        {
          storyTerm: 'Custom saboteur card stamped by a hijacked badge office',
          technicalTerm: 'POORTRY / BURNTCIGAR custom kernel rootkit signed via abused WHQL account',
          tone: 'amber',
        },
        {
          storyTerm: 'Secret spoken handshake at the control room door',
          technicalTerm: 'Cryptographic challenge-response DeviceIoControl handshake from STONESTOP',
          tone: 'sky',
        },
        {
          storyTerm: 'Cutting every alarm wire on the central watchboard',
          technicalTerm: 'Zeroing PspCreateProcessNotifyRoutine and ObRegisterCallbacks arrays',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing armored insignia from guards and the vault ledger',
          technicalTerm: 'DKOM stripping of _PS_PROTECTION bits on EDR processes and lsass.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked signing office, so the checkpoint doors swing wide open without raising an alarm.',
        storyMappings: [
          {
            storyTerm: 'Intruder street runner',
            technicalTerm: 'STONESTOP user-mode loader invoking NtLoadDriver',
            tone: 'amber',
          },
          {
            storyTerm: 'Purpose-built saboteur pass',
            technicalTerm: 'Malicious kernel driver poortry.sys (BURNTCIGAR)',
            tone: 'sky',
          },
          {
            storyTerm: 'Authentic government wax seal from a hijacked office',
            technicalTerm: 'Fraudulently obtained Microsoft WHQL / Windows Hardware Dev Center attestation signature',
            tone: 'rose',
          },
          {
            storyTerm: 'Building core checkpoint',
            technicalTerm: 'Windows Driver Signature Enforcement (DSE) kernel load check',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange. Once verified, the saboteur snips every central notification bell wire so the security office stops receiving alerts whenever new workers enter or inspect the building.',
        storyMappings: [
          {
            storyTerm: 'Secret coded knock-and-reply exchange',
            technicalTerm: 'Cryptographic challenge-response authentication over DeviceIoControl',
            tone: 'amber',
          },
          {
            storyTerm: 'Central notification bell wires',
            technicalTerm: 'Kernel callback arrays PspCreateProcessNotifyRoutine and ObRegisterCallbacks',
            tone: 'sky',
          },
          {
            storyTerm: 'Snipping the bell wires',
            technicalTerm: 'POORTRY overwriting EDR kernel callback pointers in Ring-0 memory',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded security office',
            technicalTerm: 'EDR sensors stripped of process creation and handle-access visibility',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy EDR kernel callback integrity watchdogs (periodic kernel-level self-checks that verify sensor function pointers remain intact inside PspCreateProcessNotifyRoutine and ObRegisterCallbacks) and alert immediately when any callback entry is zeroed or replaced.',
      },
      3: {
        storyAnalogy:
          'Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so the street runner can dismiss every guard and empty the vault unopposed.',
        storyMappings: [
          {
            storyTerm: 'Central staff ledger',
            technicalTerm: 'Kernel opaque _EPROCESS structures tracking active Windows processes',
            tone: 'amber',
          },
          {
            storyTerm: 'Rubbing out the armored-protection stamp',
            technicalTerm: 'Direct Kernel Object Manipulation (DKOM) zeroing _PS_PROTECTION bits',
            tone: 'sky',
          },
          {
            storyTerm: 'Dismissed security guards',
            technicalTerm: 'Terminated EDR agent processes after PPL immunity removal',
            tone: 'rose',
          },
          {
            storyTerm: 'Emptied master credential vault',
            technicalTerm: 'Unprotected lsass.exe memory dumped for enterprise credentials',
            tone: 'emerald',
          },
        ],
      },
    },
  };
