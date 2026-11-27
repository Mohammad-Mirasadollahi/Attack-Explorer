# Master Scenario Redesign Backlog — Exact Sidebar Order (`MOD-17` Queue)

> **Document ID**: `BACKLOG-SIDEBAR-MASTER`  
> **Scope**: Authoritative 188-scenario clean-slate redesign queue ordered strictly by the Attack Explorer Sidebar (`Category 1` through `Category 13`, `#001` through `#188`), with Priority Tier ratings (`Tier 1`, `Tier 2`, `Tier 3`), status tracking, and overlap/consolidation notes.  
> **Governed By**: [`/docs/standards/17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md`](../standards/17-bespoke-studio-redesign-pipeline-and-clean-slate-standard.md) (`MOD-17`) · **Preserved Primary Sources Archive**: [`PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md)

---

## 1. Executive Progress Dashboard & Queue Rules

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    ATTACK EXPLORER CLEAN-SLATE STUDIO REDESIGN QUEUE                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  • Total Catalog Scenarios Tracked : 188  (13 Sidebar Categories)                        │
│  • Golden Benchmark Live (Untouched): 1    (#001 process-hollowing)                      │
│  • Bespoke Studio Rebuilds Completed: 10   (#002, #003, #004, #016, #020, #031, #037, #039, #047, #048) │
│  • Pending Clean-Slate Rebuild      : 177  (remaining queue in strict Sidebar order)     │
│  • Priority Tier Breakdown          : Tier 1: 55  | Tier 2: 107 | Tier 3: 26           │
│  • Preserved Primary Source URLs    : 564  authoritative links archived safely           │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mandatory Execution Rules

1. **Default Order = Exact Sidebar Order**: Rebuild scenarios sequentially from `#002` (`amsi-reflective-dll`) through `#188`, moving top-to-bottom through Sidebar Categories 1..13, unless the user explicitly selects a Tier 1 episode out of sequence.
2. **One Episode Per Turn**: Never batch multiple scenarios in one pass (`MOD-17 §3 Principle 1`).
3. **Blueprint Approval Before Code**: Every `PENDING_REBUILD` scenario must pass the **Mute Test**, **Swap Test**, and **Director's Blueprint User Approval Gate** before any TypeScript/Three.js code is written.
4. **Full Clean-Slate Rebuild**: Re-author the scenario's technical kill-chain, SIEM/Sysmon/CloudTrail/Auditd telemetry, memory blocks (if applicable), CLI breakdowns, Story Analogy, bespoke 3D scene & choreography, bespoke 2D silent lecture clips, and bespoke Excalidraw chalk whiteboards directly from [`PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md).
5. **Status Vocabulary**: `BENCHMARK_LIVE` → `PENDING_REBUILD` → `BLUEPRINT_DRAFT` → `BLUEPRINT_APPROVED` → `IN_PRODUCTION` → `DIRECTOR_REVIEW` → `COMPLETED` (or `MERGED_CONSOLIDATED` if intentionally folded into a canonical sibling episode).

---

## 2. Sidebar Category Summary (Exact Order 1..13)

| Sidebar # | Category Key | Sidebar Display Label | Range | Count | Tier 1 | Tier 2 | Tier 3 |
| ---: | :--- | :--- | :--- | ---: | ---: | ---: | ---: |
| **1** | `MALWARE` | Malware & Process Execution | `#001..#030` | 30 | 7 | 11 | 12 |
| **2** | `ACTIVE_DIRECTORY` | Active Directory & Identity | `#031..#046` | 16 | 8 | 8 | 0 |
| **3** | `NETWORK_WEB` | Network & C2 Exfiltration | `#047..#076` | 30 | 8 | 17 | 5 |
| **4** | `CLOUD_SAAS` | Cloud & SaaS | `#077..#101` | 25 | 6 | 14 | 5 |
| **5** | `SUPPLY_CHAIN_CICD` | Supply Chain & CI/CD | `#102..#114` | 13 | 4 | 9 | 0 |
| **6** | `ZERO_DAY_APPLIANCES` | Zero-Day Appliances | `#115..#123` | 9 | 2 | 7 | 0 |
| **7** | `KERNEL_FIRMWARE_BYOVD` | Kernel, Firmware & BYOVD | `#124..#134` | 11 | 3 | 6 | 2 |
| **8** | `RANSOMWARE_EXTORTION` | Ransomware & Extortion | `#135..#154` | 20 | 4 | 16 | 0 |
| **9** | `CONTAINERS_KUBERNETES` | Containers, Kubernetes & Mesh | `#155..#167` | 13 | 3 | 10 | 0 |
| **10** | `ICS_OT_SCADA` | ICS, OT & Industrial SCADA | `#168..#172` | 5 | 3 | 2 | 0 |
| **11** | `MOBILE_TELECOM_SPYWARE` | Mobile Spyware & Telecom (5G/SS7) | `#173..#177` | 5 | 2 | 2 | 1 |
| **12** | `DATABASE_DATA_PLATFORMS` | Database Engines & Data Platforms | `#178..#182` | 5 | 2 | 2 | 1 |
| **13** | `AI_LLM_MLOPS_SECURITY` | AI, LLM Agents & MLOps Security | `#183..#188` | 6 | 3 | 3 | 0 |

---

## 3. Priority Tier Definitions & Tier 1 Flagship Quick Index

| Tier | Meaning & Selection Criteria |
| :--- | :--- |
| **`Tier 1 (Flagship)`** | Iconic, globally recognized cyber attacks, defining enterprise vulnerabilities, and showcase techniques representing the headline portfolio of Attack Explorer across all 13 categories. |
| **`Tier 2 (High-Impact)`** | Major real-world CVEs, named APT/ransomware operations, critical cloud/K8s/appliance exploits, and high-value DFIR hunting workflows. |
| **`Tier 3 (Specialized)`** | Deep-dive forensic artifact scenarios, secondary DFIR companions, or overlap candidates slated for scope differentiation or consolidation during rebuild. |

### Tier 1 Flagship Scenarios (In Sidebar Order)

| Sidebar # | Category | Scenario ID | Scenario Title | Status |
| ---: | :--- | :--- | :--- | :--- |
| **#001** | `MALWARE` | `process-hollowing` | Process Hollowing & Cobalt Strike Beacon Loader | `BENCHMARK_LIVE` |
| **#002** | `MALWARE` | `amsi-reflective-dll` | Fileless AMSI Memory Bypass & Reflective DLL Injection | `COMPLETED` |
| **#003** | `RANSOMWARE_EXTORTION` | `ransomware-shadow-wipe` | LockBit 3.0 Ransomware Behavioral Analysis: VSS Wipe & Fast IOCP Encryption | `COMPLETED` |
| **#004** | `SUPPLY_CHAIN_CICD` | `3cx-desktopapp-supply-chain-lazarus` | CrowdStrike, Kaspersky & Mandiant — Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram | `COMPLETED` |
| **#016** | `MALWARE` | `xz-utils-cve-2024-3094-backdoor` | Andres Freund, Red Hat & Kaspersky — XZ Utils (liblzma) IFUNC sshd Supply Chain Backdoor | `COMPLETED` |
| **#020** | `MALWARE` | `dfir-lsass-minidump-comsvcs-sysmon-eid10` | Microsoft Sysinternals & Splunk SURGe DFIR — LSASS MiniDump via comsvcs.dll & Sysmon EventID 10 | `COMPLETED` |
| **#030** | `MALWARE` | `pikered-clr-profiler-trusted-binary-loader-chain` | PikeRed Research & MITRE T1574.012 — Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll) | `PENDING_REBUILD` |
| **#031** | `ACTIVE_DIRECTORY` | `ad-kerberoasting` | Active Directory Kerberoasting & Pass-the-Hash Lateral Movement | `COMPLETED` |
| **#032** | `ACTIVE_DIRECTORY` | `ms-midnight-blizzard-oauth` | Microsoft Threat Intel — Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration | `PENDING_REBUILD` |
| **#033** | `ACTIVE_DIRECTORY` | `ms-volt-typhoon-lotl` | Microsoft & CISA — Volt Typhoon: Living-off-the-Land ntdsutil IFM & netsh Portproxy | `PENDING_REBUILD` |
| **#035** | `ACTIVE_DIRECTORY` | `printnightmare-spooler-cve-2021-34527` | Microsoft, Rapid7 & Elastic — Windows "PrintNightmare": RpcAddPrinterDriverEx Remote SYSTEM RCE | `PENDING_REBUILD` |
| **#037** | `ACTIVE_DIRECTORY` | `zerologon-netlogon-cve-2020-1472` | Secura, CISA & CrowdStrike — Active Directory "Zerologon": Netlogon AES-CFB8 All-Zero IV Takeover | `COMPLETED` |
| **#038** | `ACTIVE_DIRECTORY` | `dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886` | SpecterOps, Microsoft ADV210003 & CISA DFIR — AD CS ESC1 SubjectAltName Spoofing & PKINIT Forensics (EID 4886 / 4768) | `PENDING_REBUILD` |
| **#039** | `ACTIVE_DIRECTORY` | `dfir-dcsync-drsuapi-replication-eid4662` | Microsoft Security Auditing & CISA DFIR — Active Directory DCSync DRSUAPI Replication (EventID 4662) | `COMPLETED` |
| **#041** | `ACTIVE_DIRECTORY` | `dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly` | Microsoft Defender for Identity, CERT-FR & MITRE DFIR — Kerberos Golden Ticket Forgery Forensics (EID 4768 / 4769) | `PENDING_REBUILD` |
| **#047** | `NETWORK_WEB` | `log4shell-dfir` | Log4Shell JNDI Injection to Reverse Shell (DFIR Log Trace) | `COMPLETED` |
| **#048** | `NETWORK_WEB` | `dns-tunneling-exfil` | DNS Tunneling C2 & High-Entropy Subdomain Data Exfiltration | `COMPLETED` |
| **#053** | `NETWORK_WEB` | `cl0p-moveit-transfer-cve-2023-34362` | Mandiant, Huntress & CISA — CL0P (FIN11): MOVEit Transfer SQLi, ISAPI Deserialization & LEMURLOOT | `PENDING_REBUILD` |
| **#058** | `NETWORK_WEB` | `openssh-regreSSHion-cve-2024-6387` | Qualys TRU & CISA — OpenSSH "regreSSHion": SIGALRM Async-Signal-Unsafe syslog() Heap RCE | `PENDING_REBUILD` |
| **#060** | `NETWORK_WEB` | `proxyshell-exchange-cve-2021-34473` | DEVCORE, Mandiant & CISA — Microsoft Exchange "ProxyShell": Autodiscover SSRF to MailboxExport Webshell | `PENDING_REBUILD` |
| **#062** | `NETWORK_WEB` | `splunk-citrix-bleed-session-hijack` | Splunk STRT, Mandiant & CISA — Citrix Bleed: NetScaler OOB Memory Leak & NSC_AAAC Hijack | `PENDING_REBUILD` |
| **#066** | `NETWORK_WEB` | `unit42-panos-midnight-eclipse` | Unit 42 — Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor | `PENDING_REBUILD` |
| **#067** | `NETWORK_WEB` | `unit42-star-blizzard-evilginx-aitm` | Microsoft, Unit 42 & CISA — Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft | `PENDING_REBUILD` |
| **#077** | `CLOUD_SAAS` | `aws-cognito-iam-passrole-privesc` | Rhino Security Labs, Datadog & AWS — IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail StopLogging | `PENDING_REBUILD` |
| **#078** | `CLOUD_SAAS` | `aws-imdsv1-ssrf-capitalone-style` | AWS Security, Unit 42 & MITRE — EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3 Exfiltration | `PENDING_REBUILD` |
| **#082** | `CLOUD_SAAS` | `microsoft-storm-0558-msa-signing-key` | Microsoft Threat Intel, Wiz & CISA — Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange Online Tokens | `PENDING_REBUILD` |
| **#083** | `CLOUD_SAAS` | `okta-har-file-session-token-hijack` | Okta Security, Cloudflare & BeyondTrust — Support Case .har File sid Session Token Theft & Admin API Token Minting | `PENDING_REBUILD` |
| **#084** | `CLOUD_SAAS` | `snowflake-unc5537-saas-extortion` | Mandiant & Snowflake — UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake) Exfiltration | `PENDING_REBUILD` |
| **#085** | `CLOUD_SAAS` | `sysdig-scarleteel-aws-eks-terraform` | Sysdig TRT, Permiso & Unit 42 — SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft & Pacu Pivot | `PENDING_REBUILD` |
| **#104** | `SUPPLY_CHAIN_CICD` | `github-actions-tj-actions-changed-files-cve-2025-30066` | GitHub Actions tj-actions/changed-files Runner Memory Dump (CVE-2025-30066) | `PENDING_REBUILD` |
| **#106** | `SUPPLY_CHAIN_CICD` | `kaseya-vsa-revil-cve-2021-30116` | Kaseya VSA MSP Zero-Day & REvil MsMpEng.exe Side-Loading (CVE-2021-30116) | `PENDING_REBUILD` |
| **#110** | `SUPPLY_CHAIN_CICD` | `polyfill-io-cdn-domain-supply-chain` | cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection (CVE-2024-38526) | `PENDING_REBUILD` |
| **#114** | `SUPPLY_CHAIN_CICD` | `solarwinds-sunburst-orion-supply-chain` | SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29) | `PENDING_REBUILD` |
| **#116** | `ZERO_DAY_APPLIANCES` | `check-point-vpn-cve-2024-24919-info-leak` | Check Point Security Gateway /clients/MyCRL Path Traversal & AD Compromise (CVE-2024-24919) | `PENDING_REBUILD` |
| **#117** | `ZERO_DAY_APPLIANCES` | `fortimanager-fgd-jump-cve-2024-47575` | FortiManager fgfmsd Unauthenticated API RCE ("FortiJump" CVE-2024-47575 / UNC5820) | `PENDING_REBUILD` |
| **#124** | `KERNEL_FIRMWARE_BYOVD` | `aukill-edr-killer-procxp152-byovd` | AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD) | `PENDING_REBUILD` |
| **#125** | `KERNEL_FIRMWARE_BYOVD` | `blacklotus-uefi-bootkit-cve-2022-21894` | BlackLotus UEFI Bootkit Baton Drop Secure Boot Bypass (CVE-2022-21894) | `PENDING_REBUILD` |
| **#133** | `KERNEL_FIRMWARE_BYOVD` | `linux-bpfdoor-ebpf-socket-filter-apt` | BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red Menshen) | `PENDING_REBUILD` |
| **#136** | `RANSOMWARE_EXTORTION` | `akira-ransomware-cisco-anyconnect-esxi` | Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption (AA24-109A) | `PENDING_REBUILD` |
| **#137** | `RANSOMWARE_EXTORTION` | `alphv-blackcat-sphynx-rust-impacket-exmatter` | CISA AA23-353A, Mandiant & Microsoft — ALPHV / BlackCat (Sphynx) Rust Ransomware, ExMatter Exfiltration & ESXi/Windows Encryption | `PENDING_REBUILD` |
| **#146** | `RANSOMWARE_EXTORTION` | `hermeticwiper-ukraine-easeus-mbr-wipe` | Sandworm HermeticWiper Signed EaseUS Driver (empntdrv.sys) MBR & NTFS $MFT Destruction | `PENDING_REBUILD` |
| **#152** | `RANSOMWARE_EXTORTION` | `ransomhub-edrkiller-tdsskiller-golocks` | CISA AA24-242A, Symantec & Mandiant — RansomHub Ransomware: Kaspersky TDSSKiller / EDRKillShifter BYOVD, Safe-Mode Boot & Curve25519 Encryption | `PENDING_REBUILD` |
| **#160** | `CONTAINERS_KUBERNETES` | `docker-var-run-docker-sock-mounted-socket-breakout-audit` | Docker Security, CNCF Falco & MITRE — Container Mounted /var/run/docker.sock Unix Socket Escalation Audit | `PENDING_REBUILD` |
| **#164** | `CONTAINERS_KUBERNETES` | `k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974` | Kubernetes Official Advisory, Wiz & CISA KEV — Ingress-NGINX Admission Controller Configuration Validation Audit (CVE-2025-1974) | `PENDING_REBUILD` |
| **#167** | `CONTAINERS_KUBERNETES` | `runc-leaky-vessels-cwd-fd-escape-cve-2024-21626` | OpenContainers Security Advisory, Snyk & CISA KEV — runc File Descriptor Leak & Host Filesystem Breakout Analysis (CVE-2024-21626) | `PENDING_REBUILD` |
| **#169** | `ICS_OT_SCADA` | `ics-industroyer2-iec-60870-5-104-substation-telemetry` | CERT-UA #4435, ESET & CISA ICS — Industroyer2 IEC 60870-5-104 Substation Telecontrol & Protection Relay Forensics | `PENDING_REBUILD` |
| **#171** | `ICS_OT_SCADA` | `ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit` | CISA ICS-ALERT-10-196-01, Symantec Dossier & MITRE ICS — SIMATIC STEP 7 s7otbxdx.dll Interception & S7comm PLC Logic Audit | `PENDING_REBUILD` |
| **#172** | `ICS_OT_SCADA` | `ics-trisis-triton-schneider-triconex-sis-telemetry` | CISA ICS-ALERT-17-356-01, Mandiant & Dragos — TRISIS / TRITON Safety Instrumented System (SIS) TriStation Protocol Forensics | `PENDING_REBUILD` |
| **#175** | `MOBILE_TELECOM_SPYWARE` | `mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics` | Citizen Lab FORCEDENTRY, Google Project Zero & Apple CVE-2021-30860 — iOS JBIG2 Stream & MVT Shutdown/DataUsage Forensics | `PENDING_REBUILD` |
| **#177** | `MOBILE_TELECOM_SPYWARE` | `telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit` | CISA/NSA/FBI Telecom Guidance, GSMA FS.31 & ENISA 5G — 5G Core Service-Based Interface (SBI) NRF/UDM & Diameter Roaming Audit | `PENDING_REBUILD` |
| **#180** | `DATABASE_DATA_PLATFORMS` | `db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094` | PostgreSQL Security Team, Rapid7 & CISA KEV — PostgreSQL UTF-8 Quote Escaping & COPY FROM PROGRAM Forensics (CVE-2025-1094) | `PENDING_REBUILD` |
| **#181** | `DATABASE_DATA_PLATFORMS` | `db-redis-lua-sandbox-debian-liblua-cve-2022-0543` | Debian DSA-5081, NIST NVD & CISA KEV — Redis Lua Sandbox package.loadlib Escape & ReplicaOf Forensics (CVE-2022-0543) | `PENDING_REBUILD` |
| **#186** | `AI_LLM_MLOPS_SECURITY` | `ai-rag-indirect-prompt-injection-mcp-tool-audit` | OWASP LLM01:2025, NIST AI 100-2 & MITRE ATLAS AML.T0051 — Indirect Prompt Injection via RAG Vector Retrieval & Agent/MCP Tool Audit | `PENDING_REBUILD` |
| **#187** | `AI_LLM_MLOPS_SECURITY` | `ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022` | Oligo ShadowRay Research, NIST NVD & MITRE ATLAS AML.T0018 — Ray AI Framework Unauthenticated Jobs API & GPU Cluster Forensics (CVE-2023-48022) | `PENDING_REBUILD` |
| **#188** | `AI_LLM_MLOPS_SECURITY` | `jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr` | Jeffrey Appel & Microsoft Threat Intel — ARTEX Multi-Agent LLM Framework: Machine-Speed Kill-Chain Compression, Storm-0940 Spray & Defender XDR Disruption | `PENDING_REBUILD` |

---

## 4. Complete 188-Scenario Redesign Queue (Strict Sidebar Order)

### Category 1 — Malware & Process Execution (`MALWARE` · 30 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#001** | `process-hollowing` | `T1055.012` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s001) | T1106, T1055.012, T1071.001 · CVE-2023-36884, CVE-2024-21412 | — | `BENCHMARK_LIVE` |
| **#002** | `amsi-reflective-dll` | `T1562.001` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s002) | T1562.001, T1620 · CVE-2023-23397, CVE-2024-21351 | — | `COMPLETED` |
| **#003** | `ransomware-shadow-wipe` | `T1486 / T1490` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s003) | T1490, T1486 · CVE-2023-4966 & CISA AA23-165A | Rebuilt & moved to Category 8 (`RANSOMWARE_EXTORTION`) with independent Archive Vault engine | `COMPLETED` |
| **#004** | `3cx-desktopapp-supply-chain-lazarus` | `CVE-2023-29059` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s004) | T1195.002, T1102.001, T1555.003 · CVE-2023-29059 | Rebuilt & moved to Category 5 (`SUPPLY_CHAIN_CICD`) with independent Cleanroom Telecom engine | `COMPLETED` |
| **#005** | `elastic-apt41-dustpan-stealthvector` | `T1620` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s005) | T1574.002, T1620, T1071.001 · MITRE-T1620 | — | `PENDING_REBUILD` |
| **#006** | `elastic-grimresource-msc` | `T1218.014` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s006) | T1218.014, T1059.005, T1055.002 · CVE-2024-43572 | — | `PENDING_REBUILD` |
| **#007** | `elastic-lotus-blossom-chrysalis` | `T1574.002` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s007) | T1574.002, T1027.007, T1071.001 · MITRE-T1574.002 | — | `PENDING_REBUILD` |
| **#008** | `kaspersky-lazarus-byovd-fudmodule` | `CVE-2024-21338` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s008) | T1068, T1562.001, T1003.001 · CVE-2024-21338 | — | `PENDING_REBUILD` |
| **#009** | `kaspersky-operation-triangulation` | `CVE-2023-41990` | Tier 3 (Specialized) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s009) | T1203, T1068, T1620 · CVE-2023-38606, CVE-2023-41990 | Overlap with #174 mobile-operation-triangulation — verify distinct angle or merge | `PENDING_REBUILD` |
| **#010** | `kaspersky-toddycat-eset-dll` | `CVE-2024-11859` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s010) | T1574.001, T1620, T1539 · CVE-2024-11859 | — | `PENDING_REBUILD` |
| **#011** | `macos-gatekeeper-achilles-cve-2022-42821` | `CVE-2022-42821` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s011) | T1222.002, T1553.001, T1204.002 · CVE-2022-42821 | — | `PENDING_REBUILD` |
| **#012** | `ms-forest-blizzard-gooseegg` | `CVE-2022-38028` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s012) | T1068, T1547.012, T1546.015 · CVE-2022-38028 | — | `PENDING_REBUILD` |
| **#013** | `ms-salt-typhoon-telecom` | `T1014` | Tier 3 (Specialized) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s013) | T1068, T1014, T1040 · CVE-2023-20198 / CVE-2023-20273 | Overlap with #177 telecom-salt-typhoon — verify distinct angle or merge | `PENDING_REBUILD` |
| **#014** | `talos-fortinet-coathanger-apt` | `CVE-2024-21762` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s014) | T1190, T1574.006, T1014 · CVE-2024-21762, CVE-2022-42475 | — | `PENDING_REBUILD` |
| **#015** | `windows-clfs-ransomware-cve-2023-28252-nokoyawa` | `CVE-2023-28252` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s015) | T1068, T1134.001, T1486 · CVE-2023-28252 | — | `PENDING_REBUILD` |
| **#016** | `xz-utils-cve-2024-3094-backdoor` | `CVE-2024-3094` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s016) | T1195.002, T1574.006, T1556 · CVE-2024-3094 | Rebuilt with independent Swiss Watchmaking Bridge, IFUNC Clutch Gearbox & Customs Vault 3D engine | `COMPLETED` |
| **#017** | `dfir-bitsadmin-qmgr-persistence-bits-client` | `T1197` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s017) | T1197 · MITRE-T1197 / BITS-EID-59-60 | — | `PENDING_REBUILD` |
| **#018** | `dfir-linux-auditd-pam-sshd-authorized-keys-persistence` | `T1098.004` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s018) | T1098.004, T1556.003, T1021.004 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#019** | `dfir-linux-systemd-generator-cron-udev-persistence` | `T1543.002` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s019) | T1543.002 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#020** | `dfir-lsass-minidump-comsvcs-sysmon-eid10` | `T1134` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s020) | T1134, T1218.011, T1003.001 · RunAsPPL & Sysmon EID 10 | [`020-dfir-lsass-minidump-comsvcs-sysmon-eid10.md`](../screenplays/bespoke/020-dfir-lsass-minidump-comsvcs-sysmon-eid10.md) | `COMPLETED` |
| **#021** | `dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2` | `T1070.006` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s021) | T1070.006 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#022** | `dfir-powershell-eid4104-4103-clm-downgrade-forensics` | `T1562.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s022) | T1562.001, T1059.001 · MITRE-T1059.001 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#023** | `dfir-printspooler-spl-shd-spool-file-persistence` | `T1547.012` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s023) | T1547.012 · MITRE-T1547.012 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#024** | `dfir-schtasks-xml-registry-taskcache-forensics` | `T1053.005` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s024) | T1053.005, T1564 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#025** | `dfir-shimcache-amcache-execution-artifact-triage` | `T1059.003` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s025) | T1059.003, T1070.004, T1083 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#026** | `dfir-vhd-iso-motw-bypass-zone-identifier-forensics` | `T1566.002` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s026) | T1566.002, T1553.005, T1204.002 · MITRE-T1553.005 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#027** | `dfir-wer-silentprocessexit-localdumps-registry-hijack` | `T1546.012` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s027) | T1546.012, T1003.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#028** | `dfir-windows-prefetch-srum-network-execution-trace` | `T1036.005` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s028) | T1036.005, T1005, T1041 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#029** | `dfir-wmi-event-subscription-persistence-sysmon` | `T1546.003` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s029) | T1546.003, T1047 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#030** | `pikered-clr-profiler-trusted-binary-loader-chain` | `T1553.005` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s030) | T1553.005, T1574.012 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |

### Category 2 — Active Directory & Identity (`ACTIVE_DIRECTORY` · 16 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#031** | `ad-kerberoasting` | `T1558.003` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s031) | T1558.003, T1550.002, T1543.003 · CVE-2022-33679, CVE-2021-42287 / CVE-2021-42278 | — | `COMPLETED` |
| **#032** | `ms-midnight-blizzard-oauth` | `T1098.003` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s032) | T1110.003, T1098.003, T1528 · MITRE-T1098.003 | — | `PENDING_REBUILD` |
| **#033** | `ms-volt-typhoon-lotl` | `T1003.003` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s033) | T1047, T1003.003, T1090.001 · CVE-2022-42475 / SOHO-0DAY | — | `PENDING_REBUILD` |
| **#034** | `nopac-samaccountname-cve-2021-42278-42287` | `CVE-2021-42287` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s034) | T1068, T1558.001, T1003.006 · CVE-2021-42287, CVE-2021-42278 | — | `PENDING_REBUILD` |
| **#035** | `printnightmare-spooler-cve-2021-34527` | `CVE-2021-34527` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s035) | T1210, T1547.012, T1068 · CVE-2021-34527 | — | `PENDING_REBUILD` |
| **#036** | `unit42-scattered-spider-cloud` | `T1078.004` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s036) | T1621, T1219, T1078.004 · MITRE-T1078.004 | — | `PENDING_REBUILD` |
| **#037** | `zerologon-netlogon-cve-2020-1472` | `CVE-2020-1472` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s037) | T1210, T1098, T1003.006 · CVE-2020-1472 | — | `COMPLETED` |
| **#038** | `dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886` | `T1649` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s038) | T1649 · MITRE-T1649 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#039** | `dfir-dcsync-drsuapi-replication-eid4662` | `T1003.006` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s039) | T1003.006 · MITRE-T1003.006 / MS-DRSR-4662 | — | `COMPLETED` |
| **#040** | `dfir-dpapi-masterkey-lsass-browser-vault-forensics` | `T1555.004` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s040) | T1555.004, T1555.003 · MITRE-T1555.004 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#041** | `dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly` | `T1558.001` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s041) | T1558.001, T1550.003 · MITRE-T1558.001 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#042** | `dfir-ntds-dit-vssadmin-esentutl-extraction` | `T1003.003` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s042) | T1003.003, T1003.002 · MITRE-T1003.003 / CISA-AA23-075A | — | `PENDING_REBUILD` |
| **#043** | `dfir-rdp-lateral-movement-tsclient-bitmap-cache` | `T1021.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s043) | T1021.001 · MITRE-T1021.001 / ANSSI-BMC | — | `PENDING_REBUILD` |
| **#044** | `dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion` | `T1187` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s044) | T1187, T1557.001 · MITRE-T1187 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#045** | `dfir-smb-psexec-named-pipe-eid5145-7045` | `T1021.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s045) | T1021.002, T1569.002 · MITRE-T1569.002 / EID-5145-7045 | — | `PENDING_REBUILD` |
| **#046** | `dfir-winrm-wsman-remote-powershell-eid91-4624` | `T1021.006` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s046) | T1021.006, T1059.001 · MITRE-T1021.006 / NIST-SP-800-86 | — | `PENDING_REBUILD` |

### Category 3 — Network & C2 Exfiltration (`NETWORK_WEB` · 30 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#047** | `log4shell-dfir` | `CVE-2021-44228` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s047) | T1190, T1203, T1105 · CVE-2021-44228, CVE-2021-45046 | — | `COMPLETED` |
| **#048** | `dns-tunneling-exfil` | `T1071.004` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s048) | T1048.003, T1071.004 · CVE-2024-21887, CVE-2023-4966 | — | `COMPLETED` |
| **#049** | `apache-activemq-cve-2023-46604-openwire` | `CVE-2023-46604` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s049) | T1190, T1203, T1059.004 · CVE-2023-46604 | — | `PENDING_REBUILD` |
| **#050** | `atlassian-confluence-cve-2023-22515-storm0062` | `CVE-2023-22515` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s050) | T1190, T1136.001, T1505.003 · CVE-2023-22515 | — | `PENDING_REBUILD` |
| **#051** | `barracuda-esg-cve-2023-2868-unc4841` | `CVE-2023-2868` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s051) | T1190, T1505.003, T1114.002 · CVE-2023-2868 | — | `PENDING_REBUILD` |
| **#052** | `cisco-ios-xe-cve-2023-20198-badimplant` | `CVE-2023-20198` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s052) | T1190, T1068, T1505.003 · CVE-2023-20198, CVE-2023-20273 | — | `PENDING_REBUILD` |
| **#053** | `cl0p-moveit-transfer-cve-2023-34362` | `CVE-2023-34362` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s053) | T1190, T1505.003, T1530 · CVE-2023-34362 | — | `PENDING_REBUILD` |
| **#054** | `f5-bigip-request-smuggling` | `CVE-2023-46747` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s054) | T1190, T1136.001, T1059.004 · CVE-2023-46747 | — | `PENDING_REBUILD` |
| **#055** | `fortra-goanywhere-mft-cve-2023-0669-cl0p` | `CVE-2023-0669` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s055) | T1190, T1059.003, T1219 · CVE-2023-0669 | — | `PENDING_REBUILD` |
| **#056** | `juniper-junos-jweb-cve-2023-36845-chain` | `CVE-2023-36845` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s056) | T1190, T1574.007, T1059.004 · CVE-2023-36845, CVE-2023-36846 | — | `PENDING_REBUILD` |
| **#057** | `mandiant-apt29-teamcity-jetstream` | `CVE-2023-42793` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s057) | T1190, T1059.003, T1102.002 · CVE-2023-42793 | — | `PENDING_REBUILD` |
| **#058** | `openssh-regreSSHion-cve-2024-6387` | `CVE-2024-6387` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s058) | T1190, T1068, T1059.004 · CVE-2024-6387 | — | `PENDING_REBUILD` |
| **#059** | `papercut-ng-cve-2023-27350-bl00dy` | `CVE-2023-27350` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s059) | T1190, T1059.007, T1059.001 · CVE-2023-27350 | — | `PENDING_REBUILD` |
| **#060** | `proxyshell-exchange-cve-2021-34473` | `CVE-2021-34473` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s060) | T1190, T1059.001, T1505.003 · CVE-2021-34473, CVE-2021-34523 | — | `PENDING_REBUILD` |
| **#061** | `sharepoint-cve-2023-29357-24955-chain` | `CVE-2023-29357` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s061) | T1190, T1550.001, T1505.003 · CVE-2023-29357, CVE-2023-24955 | — | `PENDING_REBUILD` |
| **#062** | `splunk-citrix-bleed-session-hijack` | `CVE-2023-4966` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s062) | T1190, T1539, T1550.004 · CVE-2023-4966 | — | `PENDING_REBUILD` |
| **#063** | `splunk-ivanti-connect-secure` | `CVE-2024-21887` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s063) | T1190, T1574.006, T1556 · CVE-2024-21887, CVE-2023-46805 | — | `PENDING_REBUILD` |
| **#064** | `splunk-screenconnect-slashandgrab` | `CVE-2024-1709` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s064) | T1190, T1505.003, T1219 · CVE-2024-1709, CVE-2024-1708 | — | `PENDING_REBUILD` |
| **#065** | `talos-arcanedoor-asa` | `CVE-2024-20353` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s065) | T1542, T1059, T1562.001 · CVE-2024-20353, CVE-2024-20359 | — | `PENDING_REBUILD` |
| **#066** | `unit42-panos-midnight-eclipse` | `CVE-2024-3400` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s066) | T1190, T1059.004, T1546.016 · CVE-2024-3400 | — | `PENDING_REBUILD` |
| **#067** | `unit42-star-blizzard-evilginx-aitm` | `T1539` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s067) | T1539, T1550.004, T1564.008 · MITRE-T1539 / T1557 | — | `PENDING_REBUILD` |
| **#068** | `vmware-vcenter-cve-2023-34048-unc3886` | `CVE-2023-34048` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s068) | T1190, T1552.001, T1547 · CVE-2023-34048 | — | `PENDING_REBUILD` |
| **#069** | `zyxel-firewall-cve-2023-28771-ike-rce` | `CVE-2023-28771` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s069) | T1190, T1059.004, T1583.005 · CVE-2023-28771 | — | `PENDING_REBUILD` |
| **#070** | `dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment` | `T1190` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s070) | T1190, T1505.003 · MITRE-T1190 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#071** | `dfir-exchange-ews-autodiscover-proxylogon-iis-forensics` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s071) | T1190, T1505.003 · MITRE-T1190 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#072** | `dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell` | `T1505.004` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s072) | T1505.004 · MITRE-T1505.004 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#073** | `dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace` | `T1059.003` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s073) | T1059.003, T1505.001 · MITRE-T1505.001 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#074** | `dfir-postgresql-copy-from-program-pg-log-auditd-trace` | `T1078` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s074) | T1078, T1059.004, T1505.001 · MITRE-T1190 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#075** | `dfir-sharepoint-iis-viewstate-losformatter-deserialization` | `T1190` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s075) | T1190, T1059 · MITRE-T1190 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#076** | `dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing` | `T1071.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s076) | T1071.001, T1573.002, T1029 · MITRE-T1071.001 / NIST-SP-800-86 | — | `PENDING_REBUILD` |

### Category 4 — Cloud & SaaS (`CLOUD_SAAS` · 25 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#077** | `aws-cognito-iam-passrole-privesc` | `T1098.001` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s077) | T1098.001, T1098.003, T1562.008 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#078** | `aws-imdsv1-ssrf-capitalone-style` | `T1552.005` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s078) | T1190, T1552.005, T1530 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#079** | `azure-ad-connect-pass-the-certificate` | `T1556.007` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s079) | T1003, T1552.001, T1556.007 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#080** | `gcp-service-account-hmac-key-pivot` | `T1098.001` | Tier 2 (High-Impact) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s080) | T1087.004, T1098.001, T1530 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#081** | `k8s-runc-cve-2024-21626-leaky-vessels` | `CVE-2024-21626` | Tier 3 (Specialized) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s081) | T1611, T1068 · CVE-2023-36884, CVE-2024-21412 | Overlap with #167 runc-leaky-vessels — consolidate into one flagship K8s/runc episode | `PENDING_REBUILD` |
| **#082** | `microsoft-storm-0558-msa-signing-key` | `T1606.002` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s082) | T1552.004, T1606.002, T1114.002 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#083** | `okta-har-file-session-token-hijack` | `T1539` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s083) | T1539, T1550.004, T1098.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#084** | `snowflake-unc5537-saas-extortion` | `T1078.004` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s084) | T1078.004, T1087.004, T1530 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#085** | `sysdig-scarleteel-aws-eks-terraform` | `T1610` | Tier 1 (Flagship) | Yes | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s085) | T1190, T1552.001, T1078.004 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#086** | `cloud-aws-eks-aws-auth-configmap-system-masters-audit` | `T1078.004` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s086) | T1078.004, T1098, T1552.007 · MITRE-T1098 / EKS-AWS-AUTH-SYSTEM-MASTERS | — | `PENDING_REBUILD` |
| **#087** | `cloud-aws-s3-kms-external-account-encryption-extortion-audit` | `T1619` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s087) | T1619, T1486, T1490 · MITRE-T1486 / AWS-S3-KMS-EXTORTION | — | `PENDING_REBUILD` |
| **#088** | `cloud-aws-sts-federation-token-console-signin-audit` | `T1550.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s088) | T1550.001, T1078.004, T1069.003 · MITRE-T1550.001 / AWS-STS-FEDERATION | — | `PENDING_REBUILD` |
| **#089** | `cloud-azure-vm-custom-script-extension-managed-identity-audit` | `T1059` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s089) | T1059, T1078.004, T1552.005 · MITRE-T1552.005 / AZURE-ARM-CSE | — | `PENDING_REBUILD` |
| **#090** | `cloud-entra-id-conditional-access-device-code-phishing-audit` | `T1528` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s090) | T1528, T1550.001, T1530 · RFC-8628 / MITRE-T1528 | — | `PENDING_REBUILD` |
| **#091** | `cloud-gcp-cloud-build-default-service-account-artifact-audit` | `T1648` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s091) | T1648, T1552.005, T1530 · MITRE-T1078.004 / GCP-CLOUDBUILD-DEFAULT-SA | — | `PENDING_REBUILD` |
| **#092** | `cloud-github-actions-pull-request-target-oidc-token-audit` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s092) | T1195.002, T1552.001, T1550.001 · MITRE-T1195.002 / GHSL-PWN-REQUEST | — | `PENDING_REBUILD` |
| **#093** | `cloud-m365-sharepoint-ediscovery-compliance-search-export-audit` | `T1098.003` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s093) | T1098.003, T1213.002, T1114.002 · MITRE-T1114.002 / PURVIEW-EDISCOVERY-EXPORT | — | `PENDING_REBUILD` |
| **#094** | `cloud-midnight-blizzard-oauth-legacy-test-app-audit` | `T1110.003` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s094) | T1110.003, T1098.003, T1114.002 · CISA-ED-24-02 / MITRE-T1098.003 | Overlap with #032 ms-midnight-blizzard-oauth — verify distinct cloud audit angle or merge | `PENDING_REBUILD` |
| **#095** | `cloud-salesforce-connected-app-oauth-bulk-api-export-audit` | `T1528` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s095) | T1528, T1530, T1567 · MITRE-T1530 / SALESFORCE-BULK-API-V2 | — | `PENDING_REBUILD` |
| **#096** | `dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda` | `T1098.001` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s096) | T1098.001, T1562.008 · MITRE-T1098.001 / NIST-SP-800-86 | DFIR companion to #077 aws-cognito-iam-passrole-privesc | `PENDING_REBUILD` |
| **#097** | `dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics` | `T1552.005` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s097) | T1552.005, T1550.001, T1530 · MITRE-T1552.005 / NIST-SP-800-86 | DFIR companion to #078 aws-imdsv1-ssrf-capitalone-style | `PENDING_REBUILD` |
| **#098** | `dfir-entra-id-prt-roadtools-device-registration-forensics` | `T1528` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s098) | T1528, T1098.005, T1550.001 · MITRE-T1528 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#099** | `dfir-gcp-cloud-audit-service-account-key-impersonation` | `T1078.004` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s099) | T1078.004, T1098.001, T1530 · MITRE-T1098.001 / NIST-SP-800-86 | DFIR companion to #080 gcp-service-account-hmac-key-pivot | `PENDING_REBUILD` |
| **#100** | `dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape` | `T1613` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s100) | T1613, T1611 · MITRE-T1611 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#101** | `dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule` | `T1564.008` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s101) | T1564.008, T1114.002, T1098.003 · MITRE-T1114.003 / NIST-SP-800-86 | — | `PENDING_REBUILD` |

### Category 5 — Supply Chain & CI/CD (`SUPPLY_CHAIN_CICD` · 13 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#102** | `circleci-oauth-github-token-rotation-breach` | `T1539` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s102) | T1539, T1550.004, T1552.001 · CIRCLECI-2023-01 / MITRE-T1539 | — | `PENDING_REBUILD` |
| **#103** | `codecov-bash-uploader-ci-env-exfil` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s103) | T1195.002, T1005, T1078.004 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#104** | `github-actions-tj-actions-changed-files-cve-2025-30066` | `T1195.002` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s104) | T1195.002, T1003.007, T1567 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#105** | `jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s105) | T1190, T1195.002 · CVE-2024-27198 / CVE-2024-27199 | — | `PENDING_REBUILD` |
| **#106** | `kaseya-vsa-revil-cve-2021-30116` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s106) | T1190, T1562.001, T1574.002 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#107** | `ledger-connect-kit-npmjs-drainer` | `T1195.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s107) | T1195.001, T1059.007, T1657 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#108** | `lottie-player-npm-ace-supply-chain-2024` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s108) | T1195.002, T1059.007, T1185 · GHSA-r9p9-mrjm-926w (@lottiefiles/lottie-player) | — | `PENDING_REBUILD` |
| **#109** | `npm-ua-parser-js-coa-rc-supply-chain` | `T1195.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s109) | T1195.001, T1059.007, T1218.010 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#110** | `polyfill-io-cdn-domain-supply-chain` | `T1195.002` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s110) | T1195.002, T1027, T1185 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#111** | `pypi-pytorch-torchtriton-dependency-confusion-supply-chain` | `T1195.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s111) | T1195.001, T1059.006, T1048.003 · PYSEC-2022-43015 (PyTorch torchtriton) | — | `PENDING_REBUILD` |
| **#112** | `pypi-ultralytics-github-pwnrequest` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s112) | T1195.002, T1195.001, T1496 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#113** | `rspack-solana-web3js-npm-supply-chain-2024` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s113) | T1195.002, T1552.004, T1041 · GHSA-9394-396v-8p6r (@solana/web3.js & @rspack/core) | — | `PENDING_REBUILD` |
| **#114** | `solarwinds-sunburst-orion-supply-chain` | `T1195.002` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s114) | T1195.002, T1568.002, T1552.004 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |

### Category 6 — Zero-Day Appliances (`ZERO_DAY_APPLIANCES` · 9 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#115** | `array-networks-ag-vxag-cve-2023-28461` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s115) | T1190, T1505.003, T1127.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#116** | `check-point-vpn-cve-2024-24919-info-leak` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s116) | T1190, T1552.001, T1003.003 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#117** | `fortimanager-fgd-jump-cve-2024-47575` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s117) | T1190, T1059.004, T1005 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#118** | `ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s118) | T1190, T1136.001, T1059.004 · CVE-2024-7593 | — | `PENDING_REBUILD` |
| **#119** | `paloalto-expedition-cve-2024-5910-chain` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s119) | T1190, T1059.004, T1552.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#120** | `sonicwall-sslvpn-cve-2024-40766-akira` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s120) | T1190, T1021.002, T1490 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#121** | `sophos-firewall-cve-2022-3236-asnarok` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s121) | T1190, T1059.004, T1556 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#122** | `versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s122) | T1190, T1505.003, T1070.004 · CVE-2024-39717 | — | `PENDING_REBUILD` |
| **#123** | `vulncheck-cwp-preauth-module-dispatch-rce` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s123) | T1190, T1059.004, T1068 · CVE-2026-73696 & CVE-2026-73695, CVE-2026-73697 & CVE-2026-77876 | — | `PENDING_REBUILD` |

### Category 7 — Kernel, Firmware & BYOVD (`KERNEL_FIRMWARE_BYOVD` · 11 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#124** | `aukill-edr-killer-procxp152-byovd` | `T1543.003` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s124) | T1543.003, T1562.001, T1486 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#125** | `blacklotus-uefi-bootkit-cve-2022-21894` | `T1542.003` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s125) | T1542.003, T1562.001, T1068 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#126** | `crowdstrike-poortry-burntcigar-byovd` | `T1553.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s126) | T1553.002, T1562.001, T1003.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#127** | `dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics` | `T1036.004` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s127) | T1036.004, T1205.002 · MITRE-T1205.002 / NIST-SP-800-86 | DFIR companion to #133 linux-bpfdoor-ebpf-socket-filter-apt | `PENDING_REBUILD` |
| **#128** | `dfir-linux-ld-so-preload-userland-rootkit-proc-maps` | `T1574.006` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s128) | T1574.006, T1014 · MITRE-T1574.006 / NIST-SP-800-86 | DFIR companion to #131 intezer-blackberry-symbiote-linux-ldpreload | `PENDING_REBUILD` |
| **#129** | `dfir-volatility3-malfind-vad-hollowing-kernel-callbacks` | `T1055` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s129) | T1055, T1014, T1562.001 · MITRE-T1055 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#130** | `genshin-mhyprot2-ransomware-byovd` | `T1068` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s130) | T1068, T1027, T1562.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#131** | `intezer-blackberry-symbiote-linux-ldpreload` | `T1574.006` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s131) | T1574.006, T1556.003, T1014 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#132** | `kaspersky-cosmicstrand-uefi-spi-rootkit` | `T1542.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s132) | T1542.001, T1542.003, T1014 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#133** | `linux-bpfdoor-ebpf-socket-filter-apt` | `T1036.004` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s133) | T1036.004, T1205.002, T1205.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#134** | `sentinelone-terminator-zemana-byovd` | `T1068` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s134) | T1068, T1562.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |

### Category 8 — Ransomware & Extortion (`RANSOMWARE_EXTORTION` · 20 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#135** | `acidrain-viasat-ka-sat-modem-wiper` | `T1199` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s135) | T1199, T1561.002, T1495 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#136** | `akira-ransomware-cisco-anyconnect-esxi` | `T1133` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s136) | T1133, T1555, T1489 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#137** | `alphv-blackcat-sphynx-rust-impacket-exmatter` | `T1048.002` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s137) | T1048.002, T1490, T1486 · CISA-AA23-353A / MITRE-S1068 | — | `PENDING_REBUILD` |
| **#138** | `bianlian-extortion-go-backdoor-rdp` | `T1573.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s138) | T1573.002, T1090.001, T1567.002 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#139** | `blackbasta-qakbot-backstab-ransomware` | `T1566.004` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s139) | T1566.004, T1562.001, T1486 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#140** | `cactus-ransomware-qlik-sense-ssh-batch-unpacker` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s140) | T1190, T1140, T1486 · CVE-2023-41265 / CVE-2023-48365 (Cactus) | — | `PENDING_REBUILD` |
| **#141** | `caddywiper-arguepatch-gpo-destruction` | `T1053.005` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s141) | T1053.005, T1082, T1561.001 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#142** | `cl0p-truebot-flawedgrace-sdbbot-ransomware` | `T1218.011` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s142) | T1218.011, T1489, T1486 · CISA-AA23-158A / MITRE-S0611 | — | `PENDING_REBUILD` |
| **#143** | `dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace` | `T1078` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s143) | T1078, T1529, T1486 · MITRE-T1486 / NIST-SP-800-86 | — | `PENDING_REBUILD` |
| **#144** | `dfir-evtx-log-clearing-wevtutil-eid1102-104` | `T1070.001` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s144) | T1070.001 · MITRE-T1070.001 / EID-1102-104 | — | `PENDING_REBUILD` |
| **#145** | `eightbase-phobos-smoke-loader-process-hacker` | `T1055` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s145) | T1055, T1562.004, T1486 · CISA-AA24-045A (8Base / Phobos) | — | `PENDING_REBUILD` |
| **#146** | `hermeticwiper-ukraine-easeus-mbr-wipe` | `T1068` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s146) | T1068, T1490, T1561.002 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#147** | `hunters-international-hive-rust-wsus-sharpwmi` | `T1047` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s147) | T1047, T1490, T1486 · CISA-AA22-321A / MITRE-S1069 | — | `PENDING_REBUILD` |
| **#148** | `inc-ransom-lynx-citrix-netscaler-wmic-mega` | `T1046` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s148) | T1046, T1047, T1486 · CVE-2023-3519 / CVE-2023-4966 (INC & Lynx) | — | `PENDING_REBUILD` |
| **#149** | `medusa-ransomware-gaze-abyss-pdqdeploy` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s149) | T1190, T1562.001, T1072 · CISA-AA25-071A (Medusa Ransomware) | — | `PENDING_REBUILD` |
| **#150** | `play-ransomware-grixba-vss-copy` | `T1046` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s150) | T1046, T1006, T1486 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#151** | `qilin-agenda-rust-chrome-cred-harvester-esxi` | `T1555.003` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s151) | T1555.003, T1021.002, T1486 · SOPHOS-QILIN-2024 / MITRE-T1486 | — | `PENDING_REBUILD` |
| **#152** | `ransomhub-edrkiller-tdsskiller-golocks` | `T1562.001` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s152) | T1562.001, T1562.009, T1486 · CISA-AA24-242A (RansomHub / EDRKillShifter) | — | `PENDING_REBUILD` |
| **#153** | `rhysida-ransomware-zerologon-ps-silentskill` | `T1562.004` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s153) | T1562.004, T1562.001, T1486 · CVE-2023-36884, CVE-2024-21412 | — | `PENDING_REBUILD` |
| **#154** | `royal-blacksuit-ransomware-chacha20-restartmanager` | `T1219` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s154) | T1219, T1489, T1486 · CISA-AA24-219A / MITRE-S1073 | — | `PENDING_REBUILD` |

### Category 9 — Containers, Kubernetes & Mesh (`CONTAINERS_KUBERNETES` · 13 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#155** | `container-cap-sys-admin-cgroup-release-agent-notify-audit` | `T1611` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s155) | T1611 · MITRE-T1611 / LINUX-CAP-SYS-ADMIN-CGROUP | — | `PENDING_REBUILD` |
| **#156** | `container-cap-sys-module-kernel-ko-insmod-load-audit` | `T1082` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s156) | T1082, T1547.006, T1014 · MITRE-T1547.006 / CAP-SYS-MODULE-ESCAPE | — | `PENDING_REBUILD` |
| **#157** | `docker-buildkit-runc-cache-mount-race-cve-2024-23651` | `T1610` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s157) | T1610, T1611 · CVE-2024-23651 & CVE-2024-21626 | — | `PENDING_REBUILD` |
| **#158** | `docker-engine-unauthenticated-tcp-2375-api-socket-audit` | `T1613` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s158) | T1613, T1610, T1611 · MITRE-T1610 / DOCKER-TCP-2375-EXPOSURE | — | `PENDING_REBUILD` |
| **#159** | `docker-oci-registry-manifest-layer-poisoning-cosign-audit` | `T1525` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s159) | T1525 · MITRE-T1525 / NIST-SP-800-190 | — | `PENDING_REBUILD` |
| **#160** | `docker-var-run-docker-sock-mounted-socket-breakout-audit` | `T1613` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s160) | T1613, T1611 · MITRE-T1611 / DOCKER-UNIX-SOCKET-MOUNT | — | `PENDING_REBUILD` |
| **#161** | `k8s-coredns-dns-poisoning-service-account-token-audit` | `T1557` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s161) | T1557, T1528 · MITRE-T1557 / K8S-COREDNS-REWRITE | — | `PENDING_REBUILD` |
| **#162** | `k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit` | `T1610` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s162) | T1610, T1611 · MITRE-T1610 / K8S-DAEMONSET-FLEET-DEPLOY | — | `PENDING_REBUILD` |
| **#163** | `k8s-ephemeral-debug-container-process-namespace-share-audit` | `T1609` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s163) | T1609, T1552.001 · MITRE-T1609 / K8S-EPHEMERAL-CONTAINERS | — | `PENDING_REBUILD` |
| **#164** | `k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s164) | T1190, T1609, T1552.007 · CVE-2025-1974 (IngressNightmare) | — | `PENDING_REBUILD` |
| **#165** | `k8s-kubelet-anonymous-api-etcd-snapshot-forensics` | `T1613` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s165) | T1613, T1609, T1552.007 · MITRE-T1609 / K8S-10250-ETCD | — | `PENDING_REBUILD` |
| **#166** | `k8s-mutating-admission-webhook-sidecar-injection-audit` | `T1546` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s166) | T1546, T1552.007, T1610 · MITRE-T1546 / K8S-MUTATING-WEBHOOK | — | `PENDING_REBUILD` |
| **#167** | `runc-leaky-vessels-cwd-fd-escape-cve-2024-21626` | `T1611` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s167) | T1611, T1552.001 · CVE-2024-21626 (Leaky Vessels) | Overlap with #081 k8s-runc-cve-2024-21626-leaky-vessels — keep canonical here | `PENDING_REBUILD` |

### Category 10 — ICS, OT & Industrial SCADA (`ICS_OT_SCADA` · 5 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#168** | `ics-frostygoop-modbus-tcp-district-heating-controller-audit` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s168) | T1190, T1005, T1565.002 · DRAGOS-FROSTYGOOP / MITRE-ICS-T0855 | — | `PENDING_REBUILD` |
| **#169** | `ics-industroyer2-iec-60870-5-104-substation-telemetry` | `T1489` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s169) | T1489, T1071, T1565.002 · CERT-UA#4435 (Industroyer2 / IEC-104) | — | `PENDING_REBUILD` |
| **#170** | `ics-pipedream-incontroller-codesys-modbus-opcua` | `T1046` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s170) | T1046, T1021, T1565.002 · CISA-AA22-103A (PIPEDREAM / INCONTROLLER) | — | `PENDING_REBUILD` |
| **#171** | `ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit` | `T1574.001` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s171) | T1574.001, T1059, T1564 · ICSA-10-272-01 / MITRE-S0603 | — | `PENDING_REBUILD` |
| **#172** | `ics-trisis-triton-schneider-triconex-sis-telemetry` | `T1036.005` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s172) | T1036.005, T1082, T1542 · CISA-MAR-17-352-01 (TRITON / TRISIS) | — | `PENDING_REBUILD` |

### Category 11 — Mobile Spyware & Telecom (5G/SS7) (`MOBILE_TELECOM_SPYWARE` · 5 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#173** | `mobile-android-binder-gpu-selinux-audit-forensics` | `T1404` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s173) | T1404, T1562.001, T1623 · CVE-2023-4211 / CVE-2023-2136 | — | `PENDING_REBUILD` |
| **#174** | `mobile-operation-triangulation-ios-shutdown-log-mvt-forensics` | `T1456` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s174) | T1456, T1070.004, T1041 · CVE-2023-41990 / CVE-2023-38606 | Overlap with #009 kaspersky-operation-triangulation — verify distinct iOS MVT angle or merge | `PENDING_REBUILD` |
| **#175** | `mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics` | `T1203` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s175) | T1203, T1071.001 · CVE-2021-30860 / CITIZENLAB-FORCEDENTRY | — | `PENDING_REBUILD` |
| **#176** | `telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics` | `T1133` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s176) | T1133, T1572, T1556.003 · MITRE-G0141 (LightBasin / UNC1945 GTP Tunneling) | — | `PENDING_REBUILD` |
| **#177** | `telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit` | `T1528` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s177) | T1528, T1557, T1046 · 3GPP-TS-33.501 / GSMA-FS.19-FS.37 | Overlap with #013 ms-salt-typhoon-telecom — distinct 5G SBI/Diameter focus | `PENDING_REBUILD` |

### Category 12 — Database Engines & Data Platforms (`DATABASE_DATA_PLATFORMS` · 5 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#178** | `db-mongodb-mongobleed-unauthenticated-replication-oplog-audit` | `T1046` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s178) | T1046, T1552, T1485 · MITRE-T1213 / MONGODB-PORT-27017 | — | `PENDING_REBUILD` |
| **#179** | `db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics` | `T1021` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s179) | T1021, T1562, T1505.001 · MITRE-T1505.001 / MSSQL-EID-15457 | — | `PENDING_REBUILD` |
| **#180** | `db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s180) | T1190, T1059.004, T1203 · CVE-2025-1094 | — | `PENDING_REBUILD` |
| **#181** | `db-redis-lua-sandbox-debian-liblua-cve-2022-0543` | `T1046` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s181) | T1046, T1059, T1203 · CVE-2022-0543 | — | `PENDING_REBUILD` |
| **#182** | `db-snowflake-unc5537-single-factor-auth-data-egress-audit` | `T1078.004` | Tier 3 (Specialized) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s182) | T1078.004, T1087.004, T1530 · UNC5537 / MITRE-T1078.004-T1530 | Overlap with #084 snowflake-unc5537-saas-extortion — verify distinct DB angle or merge | `PENDING_REBUILD` |

### Category 13 — AI, LLM Agents & MLOps Security (`AI_LLM_MLOPS_SECURITY` · 6 Scenarios)

| Sidebar # | Scenario ID | Code | Priority Tier | Memory | Sources | MITRE / Primary CVE | Redesign Notes | Status |
| ---: | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **#183** | `ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928` | `T1190` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s183) | T1190, T1005, T1552.001 · CVE-2024-2928 | — | `PENDING_REBUILD` |
| **#184** | `ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit` | `T1518` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s184) | T1518, T1608.001, T1565.001 · OWASP-LLM04-2025 / MITRE-ATLAS-AML.T0020 | — | `PENDING_REBUILD` |
| **#185** | `ai-pytorch-pickle-torch-load-supply-chain-forensics` | `T1195.002` | Tier 2 (High-Impact) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s185) | T1195.002, T1203, T1027 · MITRE-ATLAS-AML.T0010 (PyTorch Pickle RCE) | — | `PENDING_REBUILD` |
| **#186** | `ai-rag-indirect-prompt-injection-mcp-tool-audit` | `T1190` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s186) | T1190, T1059, T1041 · OWASP-LLM01 / MITRE-ATLAS-AML.T0051 | — | `PENDING_REBUILD` |
| **#187** | `ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022` | `T1046` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s187) | T1046, T1059.004, T1552.001 · CVE-2023-48022 (ShadowRay) | — | `PENDING_REBUILD` |
| **#188** | `jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr` | `T1595.002` | Tier 1 (Flagship) | No | [3 refs](./PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md#s188) | T1595.002, T1505.003, T1552.004 · ARTEX-LLM-AGENT / STORM-0940 | — | `PENDING_REBUILD` |

---

## 5. Verification Checklist

- [ ] All 188 scenarios appear in exact Sidebar category and item order (`#001`..`#188`).
- [ ] `#001 process-hollowing` is permanently locked as `BENCHMARK_LIVE`.
- [ ] Every scenario links directly to its preserved authoritative source URLs in `PRESERVED-SOURCES-BY-SIDEBAR-ORDER.md`.
- [ ] Every scenario carries an explicit Priority Tier (`Tier 1`, `Tier 2`, or `Tier 3`) and overlap/re-categorization audit notes.
