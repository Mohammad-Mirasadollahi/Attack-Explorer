import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'crowdstrike-poortry-burntcigar-byovd',
    briefing: {
      headline:
        'Threat actors (UNC3944 / RansomHub) use the STONESTOP loader to install POORTRY (BURNTCIGAR), a custom malicious kernel rootkit signed via abused Microsoft WHQL attestation accounts, to wipe kernel notify callbacks and strip PPL protections.',
      storyAnalogy:
        'Instead of tricking an old maintenance robot, a syndicate sets up a fake hardware company, submits their own custom-built assassin robot to the official city licensing office (WHQL Attestation Signing), gets an official holographic seal stamped onto it, and walks it right into the central nervous system of the building where it erases the phone numbers of every security guard on the emergency call list (PspCreateProcessNotifyRoutine).',
      plainSummary:
        'In this scenario (T1553.002, STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper), the attacker follows one continuous arc: loading Custom Malicious Driver POORTRY Signed, then authenticated IOCTL Handshake, then ePROCESS Protection Bit Stripping, EDR Termination. Steps #1–#3 examine #1 Loading Custom Malicious Driver POORTRY Signed; #2 Authenticated IOCTL Handshake; #3 EPROCESS Protection Bit Stripping, EDR Termination. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
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
