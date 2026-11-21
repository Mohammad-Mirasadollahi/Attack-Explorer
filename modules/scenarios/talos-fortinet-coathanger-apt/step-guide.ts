import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'talos-fortinet-coathanger-apt',
    briefing: {
      headline: 'Scenario Briefing: COATHANGER RAT (CVE-2022-42475 / CVE-2023-27997), FortiGate SSL-VPN Rootkit & ld.so.preload Hijack',
      storyAnalogy:
        'Imagine a fortress gate (a FortiGate firewall) where a burglar uses an oversized battering ram (Heap Overflow in sslvpnd) to slip inside. Once inside, the burglar hooks a tiny invisible coat hanger (ld.so.preload rootkit) onto the fortress’s coat rack so that every time an administrator runs the inspection command (ps or ls) to check if anyone is hiding in the room, the coat hanger intercepts the administrator’s glasses and erases the burglar from their field of view, and even hides a spare copy inside the emergency recovery partition (flatkc) to survive firmware updates.',
      plainSummary:
        'In this scenario (CVE-2024-21762, NCSC-NL, Talos & Mandiant - China-Nexus APT: FortiOS SSL-VPN & COATHANGER Persistent RAT) at 172.16.5.1, the attacker follows one continuous arc: heap Buffer Overflow in FortiOS sslvpnd, then hooking System Calls via /etc/ld.so.preload to Hide, then patching the flatkc Reboot Binary to Survive FortiOS. Steps #1–#3 examine #1 Heap Buffer Overflow in FortiOS sslvpnd; #2 Hooking System Calls via /etc/ld.so.preload to Hide; #3 Patching the flatkc Reboot Binary to Survive FortiOS. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for CVE-2024-21762 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (APT Operator), send the heap-overflow payload to Node ②/③ (FortiGate SSL-VPN /remote/logincheck sslvpnd), trace the /data2 filesystem implant and ld.so.preload system-call hooking inside Node ④ (COATHANGER Rootkit), and follow the hidden C2 channel to Node ⑤ while Node ⑥ (SIEM / Out-of-Band Forensics) detects the sslvpnd crash and preload hook.',
      documentedAdvisory: 'Dutch MIVD / NCTV Technical Report on COATHANGER (Feb 2024) · CVE-2022-42475 & CVE-2023-27997 · MITRE T1574.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Heap Buffer Overflow in FortiOS sslvpnd (CVE-2022-42475 / CVE-2023-27997)',
        storyAnalogy:
          'The attacker sends an HTTPS request to the FortiGate VPN login gate with a falsified Content-Length label, causing the sslvpnd gatekeeper to pour extra bytes past the end of its memory bucket (Heap Overflow) and overwrite its own instruction pointer.',
        simpleExplanation:
          'Against internet-facing FortiGate WAN self-IP 172.16.5.1, the attacker sends a specially crafted HTTPS request with a manipulated Content-Length header or encrypted parameter (enc) to the FortiGate SSL-VPN web endpoint (/remote/logincheck or /remote/hostcheck_validate, public VPN login pages reachable from the internet without prior authentication). This triggers a heap-based buffer overflow inside the sslvpnd daemon (writing attacker-controlled bytes past the end of the allocated heap buffer to overwrite adjacent function pointers in RAM and hijack the CPU into running the attacker’s code).',
        howItWorksInPractice:
          'In FortiOS, sslvpnd and almost all system utilities are compiled into a single monolithic multi-call binary (/bin/init). By chaining Return-Oriented Programming (ROP) gadgets inside that binary, exploiting sslvpnd gives the attacker immediate code execution inside the underlying Linux OS of the firewall. In the documented FortiOS Crashlog exchange from China-Nexus APT C2 to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK CVE-2024-21762 (confirming that the SSLVPND SIGSEGV request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 COATHANGER PRELOAD.SO ROOTKIT & SMARTCTL HOOK).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (APT Operator) to Node ②/③ (FortiGate /remote/logincheck sslvpnd), and return arrow ⇠#1 triggering the ROP chain and shell execution.',
        detectionAndEvidence:
          'Documented in Fortinet FG-IR-22-398 & MIVD Report: Application sslvpnd crashed entries in FortiOS crash logs (diagnose debug crashlog read) and anomalous requests to /remote/logincheck. Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'Hooking System Calls via /etc/ld.so.preload (smartctl / preload.so) to Hide From Admins',
        storyAnalogy:
          'Once inside, COATHANGER places a filter lens (preload.so) in /etc/ld.so.preload. Whenever any program on the firewall asks Linux "What files are in /data2?" or "What processes are running?", the filter lens intercepts the answer and deletes COATHANGER’s name before showing the list.',
        simpleExplanation:
          'COATHANGER stores its backdoor files inside the persistent /data2/ partition and writes the path of its malicious shared library (preload.so) into /etc/ld.so.preload (a special Linux dynamic-linker configuration file that forces every single program launched on the system to load preload.so before the standard C library libc.so). Because preload.so is loaded first, it intercepts file-listing and process-listing calls (removing COATHANGER’s files and PIDs from the results so an admin inspecting the firewall sees nothing unusual).',
        howItWorksInPractice:
          'By hooking user-space libc functions like readdir(), open(), and stat() via /etc/ld.so.preload, whenever an administrator runs a diagnostic CLI command on the FortiGate, the hooked library filters out any path containing the implant’s directory before returning the output to the terminal. In the documented NCSC-NL YARA Match exchange from Perimeter Firewall & NDR Tap to FortiGate NGFW (sslvpnd), FortiGate NGFW (sslvpnd) responds with ALERT 36 KB ELF (confirming that the COATHANGER ROOTKIT request succeeded on FortiGate NGFW (sslvpnd) and establishing the runtime state required for Step #3 MASQUERADED HTTPSD BEACON & VPN CREDENTIAL THEFT).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ writes the implant to /data2 and hooks /etc/ld.so.preload, with ⇠#2 intercepting userland libc calls.',
        detectionAndEvidence:
          'Perform offline disk and memory forensic triage on suspected FortiGate appliances (bypassing live userland rootkit hooks that conceal active implants) to uncover /etc/ld.so.preload entries and unauthorized binaries inside /data2/ or modified /bin/smartctl. Correlate Sysmon or Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1542',
        plainTitle: 'Patching the flatkc Reboot Binary to Survive FortiOS Firmware Upgrades',
        storyAnalogy:
          'Even if the IT team installs a brand-new FortiOS firmware update, COATHANGER has already tucked a backup copy of itself inside the emergency kernel unpacker (flatkc) so that as soon as the newly updated firewall reboots, it re-infects itself on startup.',
        simpleExplanation:
          'Normally, rebooting a FortiGate or installing a FortiOS firmware update wipes the temporary root filesystem in RAM and loads a clean image. To survive both reboots and firmware updates, COATHANGER replaces /bin/smartctl and hooks the flatkc boot binary (the low-level FortiOS unpacker that initializes the filesystem whenever the appliance boots up, causing the firewall to automatically copy the hidden backdoor from the persistent /data2 flash partition back into the freshly updated system on startup).',
        howItWorksInPractice:
          'Because standard firmware upgrades replace the main rootfs image but preserve persistent flash partitions like /data2 alongside hooked boot components, simply installing a FortiOS patch without wiping and reformatting the appliance leaves COATHANGER active. In the documented Suricata TLS Alert exchange from FortiGate NGFW (sslvpnd) to COATHANGER (preload.so & smartctl), COATHANGER (preload.so & smartctl) responds with ALERT TLS 1.3 (confirming that the FORTIGATE EGRESS C2 request succeeded on COATHANGER (preload.so & smartctl) and completing the final execution objective of NCSC-NL, Talos & Mandiant, China-Nexus APT: FortiOS SSL-VPN & COATHANGER Persistent RAT).',
        diagramAlignment:
          'On the diagram, arrow #3→ persists across boot inside Node ④ and opens the TLS C2 channel to Node ⑤, while Node ⑥ (SIEM / Out-of-Band NetFlow) detects the undocumented outbound TLS sessions from the firewall’s external interface.',
        detectionAndEvidence:
          'Monitor perimeter firewalls and upstream taps for unexplained outbound TLS connections initiated directly by the FortiGate appliance itself to unknown external IPs (unusual for perimeter gateways) and verify cryptographic hashes on /bin/smartctl and flash partitions. Correlate Sysmon or Windows Security Event telemetry for T1014 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
