import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ms-volt-typhoon-lotl',
    briefing: {
      headline: 'Scenario Briefing: Volt Typhoon (CISA AA24-038A): "Living off the Land" & Extracting ntds.dit Without Malware',
      storyAnalogy:
        'Imagine an infiltrator who enters a high-security facility carrying zero weapons or burglar tools in their pockets. Instead, they pick up the facility’s own maintenance clipboard (wmic.exe), use the building’s built-in port-forwarding intercom (netsh interface portproxy) to relay messages through retired home routers (KV-Botnet), and ask the facility’s official backup machine (ntdsutil.exe) to print a full copy of the master key vault (ntds.dit). Because every single action is performed by an official, factory-installed Windows utility, file-based antivirus scanners see zero foreign malware.',
      plainSummary:
        'In this scenario (T1003.003, Microsoft & CISA - Volt Typhoon: Living-off-the-Land ntdsutil IFM & netsh Portproxy) on SRV-MGMT-01 (10.10.15), the attacker follows one continuous arc: routing Through KV-Botnet SOHO Routers, then using Built-in ntdsutil.exe to Dump Every Domain, then multi-Hop Internal Relay via netsh interface. Steps #1–#3 examine #1 Routing Through KV-Botnet SOHO Routers; #2 Using Built-in ntdsutil.exe to Dump Every Domain; #3 Multi-Hop Internal Relay via netsh interface. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (KV-Botnet SOHO Edge Node 198.51.100.14), pivot into Node ③ (IT Jump Server SRV-MGMT-01 10.10.15.22 via wmic / netsh portproxy), extract ntds.dit and SYSTEM hive on Node ④/⑤ (Domain Controller CORP-DC01 10.10.0.5 via ntdsutil.exe PID 6412), while Node ⑥ (SIEM / Defender for Identity) correlates the anomalous native-binary command lines.',
      documentedAdvisory: 'CISA/NSA/FBI/Microsoft Joint Advisory AA24-038A · Microsoft Threat Intelligence Volt Typhoon · MITRE T1003.003 / T1090.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1047',
        plainTitle: 'Routing Through KV-Botnet SOHO Routers & Lateral WMI Execution to CORP-DC01',
        storyAnalogy:
          'Rather than calling the target’s server from an overseas phone number that would raise an instant red flag, the operator routes the call through a neighborhood home router down the street (KV-Botnet 198.51.100.14) and uses the jump server’s built-in maintenance intercom (wmic process call create) to issue commands on the Domain Controller.',
        simpleExplanation:
          'Instead of connecting from a rented cloud VPS that threat-intelligence feeds would block, the attacker connects through a compromised small-office/home-office (SOHO) router in the same geographic region (KV-Botnet node 198.51.100.14, so geo-IP filters see normal local ISP traffic) into the IT Jump Server SRV-MGMT-01 (10.10.15.22). From SRV-MGMT-01, the operator executes wmic /node:10.10.0.5 process call create "cmd.exe /Q /c ntdsutil \"ac i ntds\" \"ifm\"..." toward Domain Controller CORP-DC01 (10.10.0.5), causing WmiPrvSE.exe on CORP-DC01 to spawn the command under PID 6412 and return ReturnValue = 0 (confirming remote process creation over DCOM/RPC without dropping any third-party remote-execution binary).',
        howItWorksInPractice:
          'When wmic.exe connects over TCP/135 (RPC Endpoint Mapper) and dynamic DCOM ports to CORP-DC01 (10.10.0.5), the remote WMI provider host (WmiPrvSE.exe) spawns cmd.exe / ntdsutil.exe (PID 6412) under the authenticated administrator context (recording Sysmon Event ID 1 on CORP-DC01 with ParentImage = WmiPrvSE.exe). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (SRV-MGMT-01 10.10.15.22) to Node ⑤ (CORP-DC01 10.10.0.5), where WmiPrvSE.exe spawns PID 6412.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A & Sysmon EventID 1 on CORP-DC01 (10.10.0.5): ParentImage = WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil "ac i ntds" "ifm" (PID 6412).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1003.003',
        plainTitle: 'Using Built-in ntdsutil.exe ("ifm") to Dump Every Domain Password Hash (ESENT Event ID 325)',
        storyAnalogy:
          'The Domain Controller keeps its master password book (ntds.dit) locked inside a glass case while Windows is running so nobody can copy the file directly. Instead of smashing the glass, the infiltrator asks the official Active Directory maintenance robot (ntdsutil "ac i ntds" "ifm") to take a temporary backup snapshot and place an unlocked copy right into C:\\Windows\\Temp\\tmp_ad\\.',
        simpleExplanation:
          'Active Directory exclusively locks C:\\Windows\\NTDS\\ntds.dit (the master database file containing the password hashes of every employee, service, and Domain Admin in the company) while the Domain Controller is running, so normal copy commands fail. Running under PID 6412 on CORP-DC01 (10.10.0.5), ntdsutil "ac i ntds" "ifm" "create full C:\\Windows\\Temp\\tmp_ad" (where "ac i ntds" selects the Active Directory database instance, and "ifm" / "create full" instructs Microsoft’s signed backup tool to take a Volume Shadow Copy snapshot) writes an unlocked copy of C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit plus the registry\\SYSTEM decryption hive (emitting ESENT Application Event ID 325 confirming the new database file was created).',
        howItWorksInPractice:
          'The ifm (Install From Media, originally designed so administrators could promote a new Domain Controller from a backup folder) command in ntdsutil.exe (PID 6412) automatically invokes vssvc.exe to snapshot the volume, extracts both Active Directory\\ntds.dit and registry\\SYSTEM (which holds the BootKey required to decrypt the NTLM and Kerberos keys inside ntds.dit offline), and removes the temporary shadow copy upon completion.',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs inside CORP-DC01 (10.10.0.5) as ntdsutil.exe (PID 6412) creates C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit and logs ESENT Event ID 325.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A: Application Log ESENT EventID 325 ("Database engine created a new database C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit") correlated with Sysmon EventID 1 for ntdsutil.exe (PID 6412).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1090.001',
        plainTitle: 'Multi-Hop Internal Relay via netsh interface portproxy (Sysmon Event ID 13)',
        storyAnalogy:
          'Finally, to keep a persistent hidden hallway open into the Domain Controller without installing any third-party proxy software, the infiltrator programs the Windows jump server’s built-in port forwarder (netsh interface portproxy) to quietly relay port 8443 straight to the Domain Controller’s RDP port (10.10.0.5:3389).',
        simpleExplanation:
          'To maintain stealthy multi-hop access and relay staged archives out through the jump server SRV-MGMT-01 (10.10.15.22), the attacker runs C:\\Windows\\System32\\netsh.exe (PID 6890): netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=8443 connectaddress=10.10.0.5 connectport=3389 (instructing Windows’ built-in IP Helper service to forward inbound TCP port 8443 traffic directly to CORP-DC01 at 10.10.0.5:3389 without dropping any custom proxy binary to disk).',
        howItWorksInPractice:
          'When netsh.exe (PID 6890) executes the portproxy add v4tov4 command, the Windows kernel/service configuration writes the forwarding rule into HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 with value 10.10.0.5/3389 (persisting the tunnel across reboots inside the native IpHlpSvc service while triggering Sysmon Event ID 13 RegistryEvent). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) configures netsh.exe (PID 6890) on SRV-MGMT-01 (10.10.15.22) to relay traffic to 10.10.0.5:3389, while Node ⑥ (SIEM) alerts on Sysmon Event ID 13.',
        detectionAndEvidence:
          'Documented in CISA AA24-038A & Sysmon EventID 13 (RegistryValueSet): ProcessId = 6890 (netsh.exe) setting TargetObject = HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 to Details = 10.10.0.5/3389.',
      },
    ],
  };
