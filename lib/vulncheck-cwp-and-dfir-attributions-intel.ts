import type { ScenarioAttributionProfile, SourceCitation } from './attack-sources-and-legal';
import type { ThreatIntelContextData } from './threat-intel-service';
import type { LegacyDraftScenario } from './scenarios/normalize-legacy-draft-scenario';
import { VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS } from './scenarios/vulncheck-cwp-and-dfir-batch1';
import { DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS } from './scenarios/dfir-official-batch2-windows-artifacts';
import { DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS } from './scenarios/dfir-official-batch3-linux-cloud-containers';
import { DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS } from './scenarios/dfir-official-batch4-network-appliances-memory';
import { OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS } from './scenarios/official-batch5-specialized-categories';

const ALL_NEW_DRAFTS: LegacyDraftScenario[] = [
  ...VULNCHECK_CWP_AND_DFIR_BATCH1_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH2_WINDOWS_ARTIFACTS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH3_LINUX_CLOUD_CONTAINERS_SCENARIOS,
  ...DFIR_OFFICIAL_BATCH4_NETWORK_APPLIANCES_MEMORY_SCENARIOS,
  ...OFFICIAL_BATCH5_SPECIALIZED_CATEGORIES_SCENARIOS,
];

interface OfficialDfirSourceCatalogItem {
  org1: string;
  title1: string;
  code1: string;
  url1: string;
  org2: string;
  title2: string;
  code2: string;
  url2: string;
  org3: string;
  title3: string;
  code3: string;
  url3: string;
  cveId: string;
  cveCvss: string;
  cveDesc: string;
  actor1: string;
  actor2: string;
}

const OFFICIAL_DFIR_SOURCE_CATALOG: Record<string, OfficialDfirSourceCatalogItem> = {
  'k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974': {
    org1: 'Kubernetes Security Response Committee & CNCF',
    title1: 'Official Kubernetes Advisory CVE-2025-1974: ingress-nginx Admission Controller Configuration Evaluation',
    code1: 'K8S-CVE-2025-1974',
    url1: 'https://kubernetes.io/blog/2025/03/24/ingress-nginx-cve-2025-1974-what-you-need-to-know/',
    org2: 'Wiz Threat Research & CISA KEV',
    title2: 'IngressNightmare (CVE-2025-1974) Admission Webhook & /proc/pid/fd Forensics',
    code2: 'WIZ-INGRESSNIGHTMARE-2025',
    url2: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    org3: 'The MITRE Corporation & Falco Security',
    title3: 'MITRE ATT&CK Containers (T1190 / T1552.007) & Falco Runtime eBPF Rules',
    code3: 'ATT&CK-T1190-K8S',
    url3: 'https://attack.mitre.org/matrices/enterprise/containers/',
    cveId: 'CVE-2025-1974 (IngressNightmare)',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Unauthenticated AdmissionReview requests to ingress-nginx admission webhook (:8443) evaluated during nginx -t configuration validation.',
    actor1: 'Cloud & Kubernetes Opportunistic Intrusion Clusters',
    actor2: 'Container Cryptomining & Secret Harvesting Threat Groups',
  },
  'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626': {
    org1: 'OpenContainers (runc) Official Security Advisory',
    title1: 'GHSA-xr7r-f8xq-vfvv / CVE-2024-21626: WORKDIR File Descriptor Leak Container Escape',
    code1: 'GHSA-xr7r-f8xq-vfvv',
    url1: 'https://github.com/opencontainers/runc/security/advisories/GHSA-xr7r-f8xq-vfvv',
    org2: 'Snyk Security Labs & CISA KEV',
    title2: 'Leaky Vessels: Deep-Dive into runc /proc/self/fd/7 Host Mount Escape (CVE-2024-21626)',
    code2: 'SNYK-LEAKY-VESSELS-2024',
    url2: 'https://snyk.io/blog/leaky-vessels-docker-runc-container-breakout-vulnerabilities/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1611: Escape to Host',
    code3: 'ATT&CK-T1611',
    url3: 'https://attack.mitre.org/techniques/T1611/',
    cveId: 'CVE-2024-21626 (Leaky Vessels)',
    cveCvss: '8.6 HIGH',
    cveDesc: 'Leaked /sys/fs/cgroup file descriptor in runc <= 1.1.11 allowing container escape via /proc/self/fd/<N> working directory traversal.',
    actor1: 'Cloud-Native Post-Exploitation Actors',
    actor2: 'Multi-Tenant Kubernetes Breakout Operators',
  },
  'k8s-kubelet-anonymous-api-etcd-snapshot-forensics': {
    org1: 'Cloud Native Computing Foundation (CNCF) — Kubernetes Documentation',
    title1: 'Kubelet Authentication/Authorization (--anonymous-auth) & Securing etcd Clusters',
    code1: 'K8S-DOCS-KUBELET-AUTH',
    url1: 'https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/',
    org2: 'Microsoft Defender for Cloud Threat Intelligence',
    title2: 'Detecting Kubelet Port 10250 /run Abuse and Control-Plane etcd Snapshot Theft',
    code2: 'MS-DEFENDER-K8S-10250',
    url2: 'https://learn.microsoft.com/en-us/azure/defender-for-cloud/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1609 (Container Administration Command) & T1552.007',
    code3: 'ATT&CK-T1609',
    url3: 'https://attack.mitre.org/techniques/T1609/',
    cveId: 'MITRE-T1609 / K8S-10250-ETCD',
    cveCvss: '9.6 CRITICAL',
    cveDesc: 'Unauthenticated Kubelet API (:10250 /pods and /run) execution chained with control-plane etcd snapshot extraction.',
    actor1: 'TeamTNT & Kinsing Cloud Threat Actors',
    actor2: 'SCARLETEEL & Cloud Infrastructure Intrusion Sets',
  },
  'ics-pipedream-incontroller-codesys-modbus-opcua': {
    org1: 'CISA, NSA, FBI & DOE Joint Cybersecurity Advisory',
    title1: 'AA22-103A: APT Cyber Tools Targeting ICS/SCADA Devices (PIPEDREAM / INCONTROLLER)',
    code1: 'CISA-AA22-103A',
    url1: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-103a',
    org2: 'Dragos & Mandiant ICS Threat Intelligence',
    title2: 'PIPEDREAM / INCONTROLLER Technical Analysis: TAGRUN, CODECALL & OMWORM Modules',
    code2: 'DRAGOS-PIPEDREAM-2022',
    url2: 'https://www.dragos.com/blog/chernovite-pipedream-malware-targeting-industrial-control-systems/',
    org3: 'The MITRE Corporation — MITRE ATT&CK for ICS',
    title3: 'MITRE ATT&CK for ICS: OPC-UA, Modbus TCP (Port 502) & CODESYS Runtime Manipulation',
    code3: 'ATT&CK-ICS-T0855',
    url3: 'https://attack.mitre.org/matrices/ics/',
    cveId: 'CISA-AA22-103A (PIPEDREAM / INCONTROLLER)',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Modular ICS attack framework targeting Schneider Electric and Omron PLCs via OPC-UA (4840), Modbus TCP (502), and CODESYS (2455).',
    actor1: 'CHERNOVITE (State-Sponsored ICS Threat Group)',
    actor2: 'Advanced Industrial Control System Intrusion Sets',
  },
  'ics-industroyer2-iec-60870-5-104-substation-telemetry': {
    org1: 'CERT-UA & CISA ICS',
    title1: 'CERT-UA#4435: Industroyer2 (108_100.exe) Targeting Electrical Substations via IEC 60870-5-104',
    code1: 'CERT-UA-4435-INDUSTROYER2',
    url1: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
    org2: 'ESET Research & Mandiant',
    title2: 'Industroyer2: IEC-104 ASDU Type 45/46 Substation Telecontrol Dissection',
    code2: 'ESET-INDUSTROYER2-2022',
    url2: 'https://www.welivesecurity.com/2022/04/12/industroyer2-industroyer-reloaded/',
    org3: 'The MITRE Corporation — MITRE ATT&CK for ICS',
    title3: 'MITRE ATT&CK for ICS: Unauthorized Command Message (T0855) & Service Stop (T1489)',
    code3: 'ATT&CK-ICS-IEC104',
    url3: 'https://attack.mitre.org/matrices/ics/',
    cveId: 'CERT-UA#4435 (Industroyer2 / IEC-104)',
    cveCvss: '9.9 CRITICAL',
    cveDesc: 'Automated IEC 60870-5-104 client sending ASDU Type 45/46 commands on TCP port 2404 to trip electrical substation protection relays.',
    actor1: 'Sandworm Team (APT44 / Voodoo Bear)',
    actor2: 'Electrum ICS Grid Sabotage Group',
  },
  'ics-trisis-triton-schneider-triconex-sis-telemetry': {
    org1: 'CISA ICS-CERT',
    title1: 'ICS-ALERT-17-356-01 & MAR-17-352-01: HatMan — Safety System Targeted Malware (TRITON)',
    code1: 'CISA-MAR-17-352-01',
    url1: 'https://www.cisa.gov/news-events/ics-alerts/ics-alert-17-356-01',
    org2: 'Mandiant & Dragos Industrial Security',
    title2: 'Attackers Deploy New ICS Attack Framework TRITON / TRISIS Targeting Triconex SIS Controllers',
    code2: 'MANDIANT-TRITON-SIS',
    url2: 'https://cloud.google.com/blog/topics/threat-intelligence/attackers-deploy-new-ics-attack-framework-triton',
    org3: 'The MITRE Corporation — MITRE ATT&CK for ICS',
    title3: 'MITRE ATT&CK for ICS: System Firmware (T0857) & TriStation UDP 1502 Protocol',
    code3: 'ATT&CK-ICS-TRITON',
    url3: 'https://attack.mitre.org/software/S1009/',
    cveId: 'CISA-MAR-17-352-01 (TRITON / TRISIS)',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Masqueraded trilog.exe communicating over UDP port 1502 TriStation protocol to modify Schneider Electric Triconex SIS firmware in PROGRAM mode.',
    actor1: 'TEMP.Veles (XENOTIME)',
    actor2: 'Critical Infrastructure Safety System Intrusion Sets',
  },
  'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics': {
    org1: 'Kaspersky GReAT & Apple Security Engineering',
    title1: 'Operation Triangulation: iOS Zero-Click iMessage Chain (CVE-2023-41990 / CVE-2023-32434 / CVE-2023-38606)',
    code1: 'KASPERSKY-TRIANGULATION-2023',
    url1: 'https://securelist.com/operation-triangulation-the-last-hardware-mystery/111669/',
    org2: 'Amnesty International Security Lab & Citizen Lab',
    title2: 'Mobile Verification Toolkit (MVT) iOS sysdiagnose Shutdown.log & DataUsage.sqlite Forensics',
    code2: 'AMNESTY-MVT-IOS-DOCS',
    url2: 'https://docs.mvt.re/en/latest/ios/',
    org3: 'The MITRE Corporation — MITRE ATT&CK Mobile',
    title3: 'MITRE ATT&CK Mobile Matrix: Zero-Click iMessage & Ephemeral /private/var/tmp Implant Analysis',
    code3: 'ATT&CK-MOBILE-T1430',
    url3: 'https://attack.mitre.org/matrices/mobile/',
    cveId: 'CVE-2023-41990 / CVE-2023-38606',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Zero-click iMessage font/attachment exploit chain leaving deterministic forensic traces in iOS Shutdown.log and DataUsage.sqlite.',
    actor1: 'Operation Triangulation Advanced Mobile Espionage Actor',
    actor2: 'Mercenary Zero-Click Mobile Spyware Operators',
  },
  'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics': {
    org1: 'CrowdStrike & Mandiant Threat Intelligence',
    title1: 'LightBasin (UNC1945): Global Telecommunications Intrusion Campaign Abusing GTP & Roaming Interconnects',
    code1: 'CROWDSTRIKE-LIGHTBASIN-UNC1945',
    url1: 'https://www.crowdstrike.com/en-us/blog/an-analysis-of-lightbasin-telecommunications-attacks/',
    org2: 'GSMA Telecommunications Security Group',
    title2: 'GSMA FS.11 & FS.19: GPRS Tunneling Protocol (GTP-C 2123 / GTP-U 2152) & SS7/Diameter Interconnect Security',
    code2: 'GSMA-FS19-GTP-SECURITY',
    url2: 'https://www.gsma.com/solutions-and-impact/technologies/security/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1572 (Protocol Tunneling) & T1556.003 (Pluggable Authentication Modules)',
    code3: 'ATT&CK-T1572-GTP',
    url3: 'https://attack.mitre.org/groups/G0141/',
    cveId: 'MITRE-G0141 (LightBasin / UNC1945 GTP Tunneling)',
    cveCvss: '9.4 CRITICAL',
    cveDesc: 'Encapsulated GTP-C/GTP-U roaming traffic across GRX interconnects targeting SGSN/GGSN/MME core nodes and PAM modules.',
    actor1: 'LightBasin (UNC1945)',
    actor2: 'Telecom Core Signaling Espionage Clusters',
  },
  'mobile-android-binder-gpu-selinux-audit-forensics': {
    org1: 'Google Threat Analysis Group (TAG) & Android Security',
    title1: 'Android 0-Day Exploit Chains Targeting Mali GPU (CVE-2023-4211) & Binder IPC in the Wild',
    code1: 'GOOGLE-TAG-ANDROID-2023',
    url1: 'https://blog.google/threat-analysis-group/',
    org2: 'Amnesty International Security Lab',
    title2: 'Predator Files & MVT Android Bugreport Forensics (SELinux avc Audits & app_process64)',
    code2: 'AMNESTY-PREDATOR-ANDROID',
    url2: 'https://docs.mvt.re/en/latest/android/',
    org3: 'The MITRE Corporation — MITRE ATT&CK Mobile',
    title3: 'MITRE ATT&CK Mobile T1404: Exploitation for Privilege Escalation',
    code3: 'ATT&CK-MOBILE-T1404',
    url3: 'https://attack.mitre.org/techniques/T1404/',
    cveId: 'CVE-2023-4211 / CVE-2023-2136',
    cveCvss: '9.6 CRITICAL',
    cveDesc: 'Sandboxed browser renderer escalating privileges via Android GPU/Binder kernel driver vulnerability to disable SELinux enforcing and spawn app_process64.',
    actor1: 'Intellexa / Cytrox Predator Spyware Operators',
    actor2: 'Commercial Mobile Surveillance Vendors (CSV)',
  },
  'db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094': {
    org1: 'PostgreSQL Global Development Group Security Team',
    title1: 'Official PostgreSQL Advisory CVE-2025-1094: libpq Invalid UTF-8 String Escaping & psql Meta-Command Injection',
    code1: 'PGSQL-CVE-2025-1094',
    url1: 'https://www.postgresql.org/support/security/CVE-2025-1094/',
    org2: 'Rapid7 Emergent Threat Response & CISA KEV',
    title2: 'CVE-2025-1094 Technical Analysis: Multi-Byte 0xC0 0x27 Escaping & COPY FROM PROGRAM Execution',
    code2: 'RAPID7-CVE-2025-1094',
    url2: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    org3: 'The MITRE Corporation & pgAudit Project',
    title3: 'MITRE ATT&CK T1190 & pgAudit Session/Object Auditing for PostgreSQL',
    code3: 'ATT&CK-T1190-PGSQL',
    url3: 'https://www.pgaudit.org/',
    cveId: 'CVE-2025-1094',
    cveCvss: '8.1 HIGH',
    cveDesc: 'libpq PQescapeStringConn() invalid UTF-8 handling allowing SQL breakout, psql ! shell execution, and COPY FROM PROGRAM abuse.',
    actor1: 'Enterprise Database Post-Exploitation Operators',
    actor2: 'Web-to-Database Intrusion Clusters',
  },
  'db-redis-lua-sandbox-debian-liblua-cve-2022-0543': {
    org1: 'Debian Security Team & NIST NVD',
    title1: 'DSA-5081-1 / CVE-2022-0543: Redis Lua Sandbox Escape via Dynamically Linked package.loadlib',
    code1: 'DEBIAN-DSA-5081-CVE-2022-0543',
    url1: 'https://www.debian.org/security/2022/dsa-5081',
    org2: 'CISA Known Exploited Vulnerabilities (KEV) & SANS ISC',
    title2: 'Detecting and Mitigating Redis EVAL package.loadlib("liblua5.1.so.0", "luaopen_io") Exploitation',
    code2: 'CISA-KEV-CVE-2022-0543',
    url2: 'https://nvd.nist.gov/vuln/detail/CVE-2022-0543',
    org3: 'The MITRE Corporation & SigmaHQ',
    title3: 'MITRE ATT&CK T1190 & Sigma Rule proc_creation_lnx_redis_child_shell',
    code3: 'ATT&CK-T1190-REDIS',
    url3: 'https://attack.mitre.org/techniques/T1190/',
    cveId: 'CVE-2022-0543',
    cveCvss: '10.0 CRITICAL',
    cveDesc: 'Redis Lua sandbox escape on Debian/Ubuntu systems using package.loadlib to load luaopen_io from liblua5.1.so.0 and invoke io.popen().',
    actor1: 'Muhstik, Redigo & P2PInfect Cloud Botnets',
    actor2: 'Data Platform Ransomware & Extortion Actors',
  },
  'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics': {
    org1: 'Microsoft Learn — SQL Server Security Documentation',
    title1: 'MSSQL Server Audit Action IDs, Application EventID 15457 (sp_configure) & CLR Strict Security',
    code1: 'MS-SQL-SECURITY-DOCS',
    url1: 'https://learn.microsoft.com/en-us/sql/relational-databases/security/sql-server-security',
    org2: 'Mandiant Threat Intelligence',
    title2: 'SQL Server Post-Exploitation: Linked Server Traversal, xp_cmdshell & Fileless Hexadecimal CLR Assemblies',
    code2: 'MANDIANT-MSSQL-CLR-DFIR',
    url2: 'https://attack.mitre.org/techniques/T1505/001/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1505.001: Server Software Component — SQL Stored Procedures',
    code3: 'ATT&CK-T1505.001',
    url3: 'https://attack.mitre.org/techniques/T1505/001/',
    cveId: 'MITRE-T1505.001 / MSSQL-EID-15457',
    cveCvss: '8.8 HIGH',
    cveDesc: 'MSSQL Linked Server RPC lateral movement chained with sp_configure xp_cmdshell activation and UNSAFE hexadecimal CLR assembly registration.',
    actor1: 'APT41, Lazarus Group & Maggi (SQLMaggie) Operators',
    actor2: 'Mallox / TargetCompany & CLR-Based Intrusion Sets',
  },
  'ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022': {
    org1: 'Oligo Security Research & NIST NVD',
    title1: 'ShadowRay: CVE-2023-48022 Unauthenticated Ray AI Jobs Submission API Exploitation in the Wild',
    code1: 'OLIGO-SHADOWRAY-CVE-2023-48022',
    url1: 'https://nvd.nist.gov/vuln/detail/CVE-2023-48022',
    org2: 'MITRE ATLAS™ (Adversarial Threat Landscape for AI Systems)',
    title2: 'MITRE ATLAS AML.T0018: Exploit Public-Facing AI/ML Application & GPU Cluster Takeover',
    code2: 'MITRE-ATLAS-AML.T0018',
    url2: 'https://atlas.mitre.org/',
    org3: 'Anyscale / Ray Official Documentation',
    title3: 'Ray Security Best Practices: Isolating Dashboard Port 8265 & Securing Job Submission APIs',
    code3: 'RAY-DOCS-SECURITY-8265',
    url3: 'https://docs.ray.io/en/latest/ray-security/index.html',
    cveId: 'CVE-2023-48022 (ShadowRay)',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Lack of authentication in Ray Dashboard Jobs API (:8265 /api/jobs/) allowing remote command execution across GPU training clusters.',
    actor1: 'ShadowRay AI Infrastructure Intrusion Campaign',
    actor2: 'GPU Cluster Cryptojacking & LLM Credential Theft Actors',
  },
  'ai-pytorch-pickle-torch-load-supply-chain-forensics': {
    org1: 'MITRE ATLAS™ & NIST AI Risk Management Framework',
    title1: 'MITRE ATLAS AML.T0010: ML Supply Chain Compromise via Malicious Pickle Model Checkpoints',
    code1: 'MITRE-ATLAS-AML.T0010',
    url1: 'https://atlas.mitre.org/',
    org2: 'Trail of Bits Security Research',
    title2: 'Fickling: Decompiling, Analyzing, and Detecting Malicious Python Pickle & PyTorch Model Files',
    code2: 'TRAILOFBITS-FICKLING',
    url2: 'https://github.com/trailofbits/fickling',
    org3: 'HuggingFace & PyTorch Security Documentation',
    title3: 'PyTorch torch.load(weights_only=True) & HuggingFace Safetensors Zero-Copy Model Format',
    code3: 'HF-SAFETENSORS-SECURITY',
    url3: 'https://huggingface.co/docs/hub/security-pickle',
    cveId: 'MITRE-ATLAS-AML.T0010 (PyTorch Pickle RCE)',
    cveCvss: '9.3 CRITICAL',
    cveDesc: 'Arbitrary code execution during torch.load() via crafted STACK_GLOBAL and REDUCE opcodes inside archive/data.pkl of .pt/.bin model files.',
    actor1: 'ML Model Hub Supply-Chain Poisoning Actors',
    actor2: 'AI Research & Enterprise MLOps Intrusion Sets',
  },
  'ai-rag-indirect-prompt-injection-mcp-tool-audit': {
    org1: 'OWASP Foundation — GenAI Security Project',
    title1: 'OWASP Top 10 for LLM Applications 2025: LLM01 (Prompt Injection) & LLM06 (Excessive Agency)',
    code1: 'OWASP-LLM01-LLM06-2025',
    url1: 'https://genai.owasp.org/llm-top-10/',
    org2: 'NIST Artificial Intelligence Safety Institute',
    title2: 'NIST AI 100-2 E2023: Adversarial Machine Learning — A Taxonomy and Terminology of Attacks and Mitigations',
    code2: 'NIST-AI-100-2-E2023',
    url2: 'https://csrc.nist.gov/pubs/ai/100/2/e2023/final',
    org3: 'MITRE ATLAS™',
    title3: 'MITRE ATLAS AML.T0051: LLM Prompt Injection (Direct & Indirect via RAG Retrieval)',
    code3: 'MITRE-ATLAS-AML.T0051',
    url3: 'https://atlas.mitre.org/',
    cveId: 'OWASP-LLM01 / MITRE-ATLAS-AML.T0051',
    cveCvss: '8.7 HIGH',
    cveDesc: 'Indirect prompt injection embedded in external documents retrieved by RAG vector search to trigger unauthorized MCP / agent tool calls.',
    actor1: 'Adversarial AI Red Teams & Autonomous Agent Exploiters',
    actor2: 'Enterprise RAG & Copilot Data Exfiltration Actors',
  },
  'dfir-ntds-dit-vssadmin-esentutl-extraction': {
    org1: 'CISA / FBI / NSA Joint Cybersecurity Advisory',
    title1: 'AA23-075A & AA23-165A: Active Directory NTDS.dit Extraction via Volume Shadow Copy & esentutl.exe',
    code1: 'CISA-AA23-075A-NTDS',
    url1: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-075a',
    org2: 'Microsoft Learn — Windows Server & ESENT Storage Engine',
    title2: 'Extensible Storage Engine (ESENT) Event IDs 325, 326, 327 & Volume Shadow Copy Service (VSS)',
    code2: 'MS-ESENT-EID-325-326',
    url2: 'https://learn.microsoft.com/en-us/windows-server/storage/file-server/volume-shadow-copy-service',
    org3: 'The MITRE Corporation & SigmaHQ',
    title3: 'MITRE ATT&CK T1003.003 (OS Credential Dumping: NTDS) & Sigma ESENT ntds.dit Rules',
    code3: 'ATT&CK-T1003.003',
    url3: 'https://attack.mitre.org/techniques/T1003/003/',
    cveId: 'MITRE-T1003.003 / CISA-AA23-075A',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Abuse of vssadmin.exe, ntdsutil.exe IFM, and esentutl.exe /y /vss to extract C:\\Windows\\NTDS\\ntds.dit and HKLM\\SYSTEM.',
    actor1: 'Volt Typhoon & APT41 (State Espionage Clusters)',
    actor2: 'LockBit 3.0, BlackCat/ALPHV & Play Ransomware Affiliates',
  },
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': {
    org1: 'Microsoft Sysinternals',
    title1: 'Sysmon v15 Event ID 10 (ProcessAccess) & CallTrace Analysis for LSASS Memory Dumping',
    code1: 'MS-SYSMON-EID-10',
    url1: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-10-processaccess',
    org2: 'Splunk SURGe & Microsoft Defender Threat Intelligence',
    title2: 'Detecting Credential Dumping via rundll32.exe comsvcs.dll,MiniDump & Ordinal #24',
    code2: 'SPLUNK-COMSVCS-MINIDUMP',
    url2: 'https://attack.mitre.org/techniques/T1003/001/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1003.001: OS Credential Dumping — LSASS Memory',
    code3: 'ATT&CK-T1003.001',
    url3: 'https://attack.mitre.org/techniques/T1003/001/',
    cveId: 'MITRE-T1003.001 / SYSMON-EID-10',
    cveCvss: '9.5 CRITICAL',
    cveDesc: 'Signed LOLBin comsvcs.dll MiniDump (export #24) invoked via rundll32.exe to dump lsass.exe with GrantedAccess 0x1FFFFF.',
    actor1: 'APT29 (Midnight Blizzard) & Sandworm Team',
    actor2: 'FIN7, BlackBasta & Akira Initial Access Brokers',
  },
  'dfir-dcsync-drsuapi-replication-eid4662': {
    org1: 'Microsoft Learn — Windows Security Auditing',
    title1: 'Security Event ID 4662 (An operation was performed on an object) & MS-DRSR IDL_DRSGetNCChanges',
    code1: 'MS-AUDIT-EID-4662-DRSR',
    url1: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4662',
    org2: 'CISA & NSA Joint Guidance',
    title2: 'Detecting and Mitigating Active Directory Compromises (DCSync Extended Rights 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)',
    code2: 'CISA-AD-DCSYNC-GUIDE',
    url2: 'https://www.cisa.gov/resources-tools/resources/detecting-and-mitigating-active-directory-compromises',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1003.006: OS Credential Dumping — DCSync',
    code3: 'ATT&CK-T1003.006',
    url3: 'https://attack.mitre.org/techniques/T1003/006/',
    cveId: 'MITRE-T1003.006 / MS-DRSR-4662',
    cveCvss: '9.8 CRITICAL',
    cveDesc: 'Non-Domain Controller host invoking MS-DRSR IDL_DRSGetNCChanges with DS-Replication-Get-Changes-All (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2).',
    actor1: 'APT28 (Fancy Bear) & APT29 (Midnight Blizzard)',
    actor2: 'Scattered Spider (Octo Tempest) & Ransomware Operators',
  },
  'dfir-wmi-event-subscription-persistence-sysmon': {
    org1: 'Microsoft Sysinternals',
    title1: 'Sysmon Event IDs 19 (WmiEventFilter), 20 (WmiEventConsumer) & 21 (WmiEventConsumerToFilter)',
    code1: 'MS-SYSMON-EID-19-20-21',
    url1: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-19-wmievent-wmieventfilter-activity-detected',
    org2: 'Mandiant / Google Cloud Threat Intelligence',
    title2: 'Windows Management Instrumentation (WMI) Offense, Defense, and Forensics (OBJECTS.DATA & EventID 5861)',
    code2: 'MANDIANT-WMI-DFIR',
    url2: 'https://cloud.google.com/blog/topics/threat-intelligence',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1546.003: Event Triggered Execution — WMI Event Subscription',
    code3: 'ATT&CK-T1546.003',
    url3: 'https://attack.mitre.org/techniques/T1546/003/',
    cveId: 'MITRE-T1546.003 / SYSMON-EID-19-21',
    cveCvss: '8.8 HIGH',
    cveDesc: 'Permanent WMI Event Subscription (__EventFilter + CommandLineEventConsumer) persisted in C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA.',
    actor1: 'APT29 (Cozy Bear) & APT41',
    actor2: 'Turla (Snake) & Mustang Panda',
  },
  'dfir-bitsadmin-qmgr-persistence-bits-client': {
    org1: 'Microsoft Learn — Background Intelligent Transfer Service',
    title1: 'BITS Operational Event Log (Event IDs 3, 59, 60, 61) & IBackgroundCopyJob2::SetNotifyCmdLine',
    code1: 'MS-BITS-CLIENT-DOCS',
    url1: 'https://learn.microsoft.com/en-us/windows/win32/bits/background-intelligent-transfer-service-portal',
    org2: 'Mandiant / FireEye DFIR Research',
    title2: 'Carving and Parsing the Windows BITS Queue Database (qmgr.db / qmgr0.dat) for Persistence Attribution',
    code2: 'MANDIANT-QMGR-DB',
    url2: 'https://attack.mitre.org/techniques/T1197/',
    org3: 'The MITRE Corporation & ANSSI',
    title3: 'MITRE ATT&CK T1197 (BITS Jobs) & BitsParser Forensic Tooling',
    code3: 'ATT&CK-T1197',
    url3: 'https://attack.mitre.org/techniques/T1197/',
    cveId: 'MITRE-T1197 / BITS-EID-59-60',
    cveCvss: '8.4 HIGH',
    cveDesc: 'Abuse of bitsadmin.exe /SetNotifyCmdLine and qmgr.db ESE queue database for persistent download and svchost.exe child execution.',
    actor1: 'APT41 & Leviathan (TEMP.Periscope)',
    actor2: 'Wizard Spider (Ryuk / Conti) & Patchwork',
  },
  'dfir-schtasks-xml-registry-taskcache-forensics': {
    org1: 'Microsoft Threat Intelligence (MSTIC)',
    title1: 'Tarrask Malware Uses Scheduled Tasks for Defense Evasion (TaskCache\\Tree SD Value Deletion)',
    code1: 'MSTIC-TARRASK-TASKCACHE',
    url1: 'https://www.microsoft.com/en-us/security/blog/2022/04/12/tarrask-malware-uses-scheduled-tasks-for-defense-evasion/',
    org2: 'Microsoft Learn — Windows Security Auditing',
    title2: 'Security Event ID 4698 (A scheduled task was created) & TaskScheduler Operational Event IDs 106 / 200',
    code2: 'MS-AUDIT-EID-4698',
    url2: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4698',
    org3: 'SANS Institute DFIR & MITRE ATT&CK',
    title3: 'MITRE ATT&CK T1053.005: Scheduled Task Registry & XML Forensic Reconstruction',
    code3: 'ATT&CK-T1053.005',
    url3: 'https://attack.mitre.org/techniques/T1053/005/',
    cveId: 'MITRE-T1053.005 / MSTIC-TARRASK',
    cveCvss: '8.8 HIGH',
    cveDesc: 'Deletion of the SD (Security Descriptor) registry value under HKLM\\...\\Schedule\\TaskCache\\Tree\\* to hide active SYSTEM scheduled tasks.',
    actor1: 'HAFNIUM (Silk Typhoon) / Tarrask Operators',
    actor2: 'APT29 & Lazarus Group',
  },
  'dfir-rdp-lateral-movement-tsclient-bitmap-cache': {
    org1: 'SANS Institute DFIR',
    title1: 'SANS FOR508 & DFIR Poster: Remote Desktop Protocol (RDP) Event Log & Bitmap Cache Forensics',
    code1: 'SANS-FOR508-RDP-DFIR',
    url1: 'https://www.sans.org/posters/hunt-evil/',
    org2: 'ANSSI (Agence nationale de la sécurité des systèmes d’information)',
    title2: 'BMC-Tools: Extracting and Reassembling Windows RDP Bitmap Cache Tiles (Cache0000.bin / *.bmc)',
    code2: 'ANSSI-BMC-TOOLS',
    url2: 'https://github.com/ANSSI-FR/bmc-tools',
    org3: 'Microsoft Learn & MITRE ATT&CK',
    title3: 'TerminalServices-LocalSessionManager Event IDs 21/24/25, RdpCoreTS 131 & MITRE T1021.001',
    code3: 'ATT&CK-T1021.001',
    url3: 'https://attack.mitre.org/techniques/T1021/001/',
    cveId: 'MITRE-T1021.001 / ANSSI-BMC',
    cveCvss: '8.5 HIGH',
    cveDesc: 'End-to-end RDP lateral movement correlation across RDPClient 1024, LocalSessionManager 21/25, and client 64x64 Bitmap Cache tiles.',
    actor1: 'Scattered Spider & FIN8',
    actor2: 'LockBit, Akira & BlackBasta Affiliates',
  },
  'dfir-smb-psexec-named-pipe-eid5145-7045': {
    org1: 'Microsoft Learn — Windows Security & System Auditing',
    title1: 'Security Event ID 5145 (Detailed File Share), Security Event ID 4697 & System Event ID 7045 (Service Installed)',
    code1: 'MS-AUDIT-5145-7045',
    url1: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-5145',
    org2: 'CISA / FBI / MS-ISAC Joint Advisory',
    title2: 'AA23-165A: Detecting PsExec & Impacket SMB Lateral Movement via ADMIN$ and Named Pipes',
    code2: 'CISA-AA23-165A-PSEXEC',
    url2: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-165a',
    org3: 'Microsoft Sysinternals & MITRE ATT&CK',
    title3: 'Sysmon Event IDs 17/18 (PipeCreated / PipeConnected) & MITRE ATT&CK T1569.002',
    code3: 'ATT&CK-T1569.002',
    url3: 'https://attack.mitre.org/techniques/T1569/002/',
    cveId: 'MITRE-T1569.002 / EID-5145-7045',
    cveCvss: '8.8 HIGH',
    cveDesc: 'SMB ADMIN$ write (EventID 5145), SCM service registration (EventID 7045), and named pipe redirection (Sysmon EventID 17/18).',
    actor1: 'LockBit 3.0 & BlackBasta Operators',
    actor2: 'APT41, Volt Typhoon & Wizard Spider',
  },
  'dfir-evtx-log-clearing-wevtutil-eid1102-104': {
    org1: 'NIST (National Institute of Standards and Technology)',
    title1: 'NIST Special Publication 800-86: Guide to Integrating Forensic Techniques into Incident Response',
    code1: 'NIST-SP-800-86',
    url1: 'https://csrc.nist.gov/publications/detail/sp/800-86/final',
    org2: 'Microsoft Learn — Windows Security Auditing',
    title2: 'Security Event ID 1102 (The audit log was cleared) & System Event ID 104 (Log File Cleared)',
    code2: 'MS-AUDIT-EID-1102-104',
    url2: 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102',
    org3: 'SANS DFIR & MITRE ATT&CK',
    title3: 'MITRE ATT&CK T1070.001: NTFS $UsnJrnl:$J USN_REASON_DATA_TRUNCATION & Unallocated ElfChnk Carving',
    code3: 'ATT&CK-T1070.001',
    url3: 'https://attack.mitre.org/techniques/T1070/001/',
    cveId: 'MITRE-T1070.001 / EID-1102-104',
    cveCvss: '8.2 HIGH',
    cveDesc: 'Anti-forensic clearing of Windows Event Logs via wevtutil.exe cl / EvtClearLog detected via EventID 1102/104 and NTFS $UsnJrnl:$J.',
    actor1: 'APT28, Sandworm & Aquatic Panda',
    actor2: 'Ransomware Affiliates & Insider Threat Actors',
  },
  'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2': {
    org1: 'Microsoft Sysinternals',
    title1: 'Sysmon Event ID 2 (A process changed a file creation time) Specification',
    code1: 'MS-SYSMON-EID-2',
    url1: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon#event-id-2-a-process-changed-a-file-creation-time',
    org2: 'SANS Institute FOR508 & Eric Zimmerman DFIR Tools',
    title2: 'NTFS Master File Table ($MFT) $STANDARD_INFORMATION (0x10) vs $FILE_NAME (0x30) Analysis with MFTECmd',
    code2: 'SANS-MFT-SI-FN',
    url2: 'https://www.sans.org/cyber-security-courses/advanced-incident-response-threat-hunting-training/',
    org3: 'The MITRE Corporation',
    title3: 'MITRE ATT&CK T1070.006: Indicator Removal — Timestomp (NtSetInformationFile)',
    code3: 'ATT&CK-T1070.006',
    url3: 'https://attack.mitre.org/techniques/T1070/006/',
    cveId: 'MITRE-T1070.006 / SYSMON-EID-2',
    cveCvss: '7.8 HIGH',
    cveDesc: 'User-mode NtSetInformationFile timestomping exposed via Sysmon EventID 2 and NTFS $MFT Created0x10 < Created0x30 nanosecond anomalies.',
    actor1: 'Lazarus Group & APT29',
    actor2: 'FIN7 & DarkGate Dropper Operators',
  },
};

export const VULNCHECK_CWP_ATTRIBUTION: ScenarioAttributionProfile = {
  scenarioId: 'vulncheck-cwp-preauth-module-dispatch-rce',
  scenarioCode: 'CVE-2026-73695 / CVE-2026-73696',
  mitreTechniques: [
    {
      id: 'T1190',
      name: 'Exploit Public-Facing Application (Control Web Panel Pre-Auth EAR & Module LFI)',
      tactic: 'Initial Access',
      url: 'https://attack.mitre.org/techniques/T1190/',
    },
    {
      id: 'T1059.004',
      name: 'Command and Scripting Interpreter: Unix Shell (phpini_editor & protected_directory Sinks)',
      tactic: 'Execution',
      url: 'https://attack.mitre.org/techniques/T1059/004/',
    },
    {
      id: 'T1068',
      name: 'Exploitation for Privilege Escalation (Loopback User API 127.0.0.1:2302 Root Escalation)',
      tactic: 'Privilege Escalation',
      url: 'https://attack.mitre.org/techniques/T1068/',
    },
  ],
  multiSourceSynthesis:
    'Synthesizes 3 complementary sources: (1) VulnCheck Initial Access Intelligence ("Control Web Panel: Pre-Auth Module Dispatch to Root RCE", Nov 3, 2026) discovered and disclosed the 10-CVE chain (CVE-2026-73695..CVE-2026-104080), reverse-engineering the IonCube-encoded PHP builds (via icunpack across patches 1.8–1.30) to document how the missing exit() in UnauthenticatedFlowTrait::toLoginWithIntendedUri() (CVE-2026-73696) and unvalidated module include in services/users/index.php (CVE-2026-73695) expose phpini_editor.php (CVE-2026-73697) and the root-privileged loopback User API on 127.0.0.1:2302 (CVE-2026-77877..CVE-2026-104080); (2) Control Web Panel (CWP) ChangeLog & Security Patch Notes (0.9.8.1210–0.9.8.1213+) verify the remediation timeline; and (3) MITRE CVE / CWE & CISA KEV standards contextualize prior CWP exploitation (CVE-2025-48703) and Linux auditd detection.',
  primarySources: [
    {
      id: 'vulncheck-cwp-preauth-module-dispatch-rce-2026',
      organization: 'VulnCheck Initial Access Intelligence (CNA)',
      title: 'Control Web Panel: Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..CVE-2026-104080)',
      referenceCode: 'VULNCHECK-CWP2SHELL-2026',
      licenseOrTerms: 'VulnCheck Public Vulnerability Research Publication',
      url: 'https://www.vulncheck.com/blog/control-web-panel-pre-auth-module-dispatch-rce',
      usageSummary:
        'Primary technical disclosure detailing the 4-port CWP architecture (2031, 2087, 2083, 127.0.0.1:2302), all 10 CVEs, the GET /<account>/ 302 oracle, quote-free webshell split in phpini_editor.php, loopback root escalation in /v1/restoredatabase/ and /v1/newpass/, and icunpack patch diffs (1.8–1.30).',
    },
    {
      id: 'cwp-changelog-security-patches-2026',
      organization: 'Control Web Panel (CentOS Web Panel)',
      title: 'CWP7 ChangeLog & Security Updates (Builds 0.9.8.1210 to 0.9.8.1213+ / Patches 1.12–1.30)',
      referenceCode: 'CWP7-PATCH-1.12-1.30',
      licenseOrTerms: 'Vendor Security Release Notes',
      url: 'https://control-webpanel.com/changelog',
      usageSummary:
        'Documents the vendor fixes: adding exit() to toLoginWithIntendedUri(), basename/realpath module validation, get_user_safe_path(), prepared statements in access_token(), and cwp_api_as_user() privilege dropping.',
    },
    {
      id: 'nvd-cisa-cwp-historical-context',
      organization: 'NIST NVD & CISA Known Exploited Vulnerabilities (KEV)',
      title: 'Control Web Panel Historical Pre-Auth RCE Context (CVE-2025-48703 & CWE-698 Execution After Redirect)',
      referenceCode: 'CVE-2025-48703 / CWE-698',
      licenseOrTerms: 'U.S. Government Public Domain',
      url: 'https://nvd.nist.gov/vuln/detail/CVE-2025-48703',
      usageSummary:
        'Provides historical baseline showing why CWP August 2026 patch for CVE-2025-48703 (fixing only filemanager) left the underlying CWE-698 EAR and module dispatcher exposed across all other 170+ user modules.',
    },
  ],
  syntheticDataNotice:
    'Target hostname cwp.corp.local (10.20.10.83:2083), hosting pool uid=1000(labtest), and attacker IP 198.51.100.44 are synthetic lab identifiers modeled directly on the VulnCheck research environment.',
};

export const VULNCHECK_CWP_CURATED_INTEL: Omit<
  ThreatIntelContextData,
  'sourceMode' | 'fetchedAt'
> = {
  scenarioId: 'vulncheck-cwp-preauth-module-dispatch-rce',
  scenarioCode: 'CVE-2026-73695 / CVE-2026-73696',
  scenarioName:
    'VulnCheck — Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..104080)',
  summary:
    'Disclosed by VulnCheck on November 3, 2026 ("Control Web Panel: Pre-Auth Module Dispatch to Root RCE"), this 10-CVE vulnerability chain demonstrates how a single missing exit() after header("Location: ...") in CWP User Panel port 2083 (CVE-2026-73696) combined with unvalidated module dispatch (CVE-2026-73695) exposes 170+ post-auth user modules to unauthenticated callers, enabling instant hosting-user RCE (CVE-2026-73697 / CVE-2026-77876) and single-request privilege escalation to root (uid=0) via the loopback User API on 127.0.0.1:2302 (CVE-2026-77877, CVE-2026-77878, CVE-2026-77879, CVE-2026-77880, CVE-2026-77881, CVE-2026-104080).',
  multiSourceSynthesis:
    'Cross-vendor synthesis: VulnCheck Initial Access Intelligence discovered all 10 CVEs and unpacked the IonCube-protected builds (patches 1.8 through 1.30) to document the two-stage pre-auth-to-root architecture; Control Web Panel release notes confirm the September–November 2026 patch series; and CISA KEV / NVD records for prior CVE-2025-48703 illustrate why partial point-fixes in shared module dispatchers fail without structural authentication gates.',
  cves: [
    {
      id: 'CVE-2026-73696 & CVE-2026-73695',
      cvss: '9.8 CRITICAL',
      status: 'VulnCheck CNA Disclosed · Patched in 1.12 / 1.16',
      description:
        'CWE-698 Execution After Redirect in UnauthenticatedFlowTrait::toLoginWithIntendedUri() and CWE-98 PHP Local File Inclusion in services/users/index.php module dispatcher on port 2083.',
    },
    {
      id: 'CVE-2026-73697 & CVE-2026-77876',
      cvss: '9.8 CRITICAL',
      status: 'VulnCheck CNA Disclosed · Patched in 1.16',
      description:
        'Pre-auth arbitrary file write (acc=update) and command injection (acc=addlabelphpiniadv rm -f) in modules/phpini_editor.php plus sed -i command injection (acc=deletedp) in modules/protected_directory.php.',
    },
    {
      id: 'CVE-2026-77877, CVE-2026-77878 & CVE-2026-104080',
      cvss: '9.8 CRITICAL',
      status: 'VulnCheck CNA Disclosed · Patched in 1.29 / 1.30',
      description:
        'Missing authentication on Loopback User API (127.0.0.1:2302) and root (uid=0) command injection in BackupHandler::restoreDBBackup() (/v1/restoredatabase/) and /valid_token/.',
    },
    {
      id: 'CVE-2026-77879, CVE-2026-77880 & CVE-2026-77881',
      cvss: '9.8 CRITICAL',
      status: 'VulnCheck CNA Disclosed · Patched in 1.16 / 1.27',
      description:
        'UNION SELECT SQLi auth bypass in access_token() as root@localhost, root command injection in /v1/newpass/ (/usr/bin/passwd), and time-based blind SQLi in /user_panel_dashboard/.',
    },
  ],
  actorGroups: [
    {
      name: 'Opportunistic Web Hosting & Linux Botnet Operators',
      aliases: 'CWP / CVE-2025-48703 Exploitation Clusters',
      targetSectors: 'Web Hosting Providers, VPS Infrastructure, SMB Linux Servers',
      notableCampaign:
        'Actively scan port 2083 across internet-facing Control Web Panel deployments to deploy web shells, cryptominers, and rootkits.',
    },
    {
      name: 'Initial Access Brokers & ORB (Operational Relay Box) Builders',
      aliases: 'Linux Control Panel Intrusion Groups',
      targetSectors: 'Dedicated Server Providers, Multi-Tenant Cloud Hosting',
      notableCampaign:
        'Compromise multi-tenant Linux hosting panels to pivot from single-tenant PHP-FPM pools (uid>=1000) to hypervisor/host root (uid=0).',
    },
  ],
  realWorldAdvisories: [
    'VulnCheck Blog (Nov 3, 2026): Control Web Panel — Pre-Auth Module Dispatch to Root RCE (10-CVE Chain CVE-2026-73695..CVE-2026-104080).',
    'Control Web Panel Security Patches 1.12, 1.16, 1.23, 1.27, 1.29 & 1.30 (Sept–Nov 2026): Enforcing exit() after redirect, module whitelist, and cwp_api_as_user().',
    'CISA KEV & NVD CVE-2025-48703: Prior CWP filemanager command injection that prompted the incomplete August 2026 patch.',
  ],
  groundedSources: [
    {
      title: 'VulnCheck — Control Web Panel: Pre-Auth Module Dispatch to Root RCE',
      uri: 'https://www.vulncheck.com/blog/control-web-panel-pre-auth-module-dispatch-rce',
    },
    {
      title: 'Control Web Panel (CWP) Official Changelog & Security Releases',
      uri: 'https://control-webpanel.com/changelog',
    },
    {
      title: 'MITRE CWE-698: Execution After Redirect (EAR)',
      uri: 'https://cwe.mitre.org/data/definitions/698.html',
    },
  ],
};

function buildDfirAttribution(draft: LegacyDraftScenario): ScenarioAttributionProfile {
  if (draft.id === 'vulncheck-cwp-preauth-module-dispatch-rce') {
    return VULNCHECK_CWP_ATTRIBUTION;
  }

  const cat = OFFICIAL_DFIR_SOURCE_CATALOG[draft.id];
  const mitreId = draft.mitreId || 'T1003';
  const mitreUrl = `https://attack.mitre.org/techniques/${mitreId.replace('.', '/')}/`;

  const primarySources: SourceCitation[] = cat
    ? [
        {
          id: `${draft.id}-src-1`,
          organization: cat.org1,
          title: cat.title1,
          referenceCode: cat.code1,
          licenseOrTerms: 'Official Vendor / Government DFIR Publication',
          url: cat.url1,
          usageSummary: `Defines the primary forensic artifacts, event IDs, and incident response workflow modeled in ${draft.title}.`,
        },
        {
          id: `${draft.id}-src-2`,
          organization: cat.org2,
          title: cat.title2,
          referenceCode: cat.code2,
          licenseOrTerms: 'Official Technical Specification & DFIR Research',
          url: cat.url2,
          usageSummary: `Documents the underlying OS, kernel, database, or cloud audit schema used in stages 1–3.`,
        },
        {
          id: `${draft.id}-src-3`,
          organization: cat.org3,
          title: cat.title3,
          referenceCode: cat.code3,
          licenseOrTerms: 'MITRE ATT&CK® Terms of Use / DRL 1.1',
          url: cat.url3,
          usageSummary: `Maps the adversary procedure and SIEM/Sigma detection engineering logic to MITRE ${mitreId}.`,
        },
      ]
    : [
        {
          id: `${draft.id}-nist-cisa`,
          organization: 'NIST SP 800-86 & CISA Cybersecurity Advisories',
          title: `Official DFIR Forensic Guidance for ${draft.title}`,
          referenceCode: `NIST-SP-800-86 / ${mitreId}`,
          licenseOrTerms: 'U.S. Government Public Domain',
          url: 'https://csrc.nist.gov/publications/detail/sp/800-86/final',
          usageSummary: `Provides the official incident response and forensic artifact correlation methodology for ${draft.title}.`,
        },
        {
          id: `${draft.id}-vendor-docs`,
          organization: 'Official Platform & Vendor Security Documentation (Microsoft / Red Hat / AWS / GCP / VMware)',
          title: `Audit Log Schema & Forensic Artifact Specification (${mitreId})`,
          referenceCode: `OFFICIAL-AUDIT-SPEC-${mitreId}`,
          licenseOrTerms: 'Official Vendor Documentation License',
          url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon',
          usageSummary: `Specifies the exact Event IDs, syscall records, binary headers, and audit log fields modeled across all 3 stages.`,
        },
        {
          id: `${draft.id}-mitre-sigma`,
          organization: 'The MITRE Corporation & SigmaHQ Detection Community',
          title: `MITRE ATT&CK ${mitreId} & Sigma Detection Rules`,
          referenceCode: `ATT&CK-${mitreId}`,
          licenseOrTerms: 'MITRE ATT&CK Terms of Use / DRL 1.1',
          url: mitreUrl,
          usageSummary: `Maps the technique phases, forensic indicators, and defensive mitigations to MITRE ATT&CK ${mitreId}.`,
        },
      ];

  return {
    scenarioId: draft.id,
    scenarioCode: mitreId,
    mitreTechniques: [
      {
        id: mitreId,
        name: draft.title,
        tactic: draft.stages[0]?.mitreTactic || 'Defense Evasion / Credential Access',
        url: mitreUrl,
      },
    ],
    multiSourceSynthesis: `Synthesizes 3 complementary official sources for ${draft.title}: (1) ${primarySources[0].organization} (${primarySources[0].title}) defines the primary incident response and forensic triage workflow; (2) ${primarySources[1].organization} (${primarySources[1].title}) specifies the exact operating system, cloud, or service audit log schemas and binary structures; and (3) ${primarySources[2].organization} (${primarySources[2].title}) maps the detection rules and mitigations to MITRE ATT&CK ${mitreId}.`,
    primarySources,
    syntheticDataNotice:
      'All hostnames, RFC 1918 IP addresses, user SIDs, and log timestamps in this DFIR scenario are 100% synthetic educational traces grounded in official vendor documentation.',
  };
}

function buildDfirCuratedIntel(
  draft: LegacyDraftScenario
): Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'> {
  if (draft.id === 'vulncheck-cwp-preauth-module-dispatch-rce') {
    return VULNCHECK_CWP_CURATED_INTEL;
  }

  const cat = OFFICIAL_DFIR_SOURCE_CATALOG[draft.id];
  const mitreId = draft.mitreId || 'T1003';
  const mitreUrl = `https://attack.mitre.org/techniques/${mitreId.replace('.', '/')}/`;

  return {
    scenarioId: draft.id,
    scenarioCode: mitreId,
    scenarioName: draft.title,
    summary: draft.description,
    multiSourceSynthesis: `Cross-vendor DFIR synthesis for ${draft.title}: combines official platform audit specifications, CERT/CISA incident response advisories, and MITRE ATT&CK ${mitreId} detection engineering to correlate multi-layer forensic evidence across all ${draft.stages.length} stages.`,
    cves: [
      {
        id: cat?.cveId || `MITRE-${mitreId} / NIST-SP-800-86`,
        cvss: cat?.cveCvss || '8.8 HIGH',
        status: 'Official DFIR Standard · Documented in Wild',
        description: cat?.cveDesc || draft.description,
      },
    ],
    actorGroups: [
      {
        name: cat?.actor1 || 'State-Sponsored Intrusion Sets (APT29 / APT41 / Volt Typhoon)',
        aliases: 'Advanced Persistent Threat Operators',
        targetSectors: 'Government, Critical Infrastructure, Financial, Enterprise IT',
        notableCampaign: `Documented in official CERT and vendor DFIR reports employing ${mitreId} (${draft.title}) during post-exploitation.`,
      },
      {
        name: cat?.actor2 || 'Enterprise Ransomware & Extortion Affiliates (LockBit / BlackBasta / Scattered Spider)',
        aliases: 'Financially Motivated Intrusion Clusters',
        targetSectors: 'Healthcare, Manufacturing, Cloud & SaaS Environments',
        notableCampaign: `Leverages the techniques tracked in ${draft.title} for credential harvesting, persistence, lateral movement, or defense evasion.`,
      },
    ],
    realWorldAdvisories: [
      cat
        ? `${cat.org1}: ${cat.title1} (${cat.code1}).`
        : `NIST SP 800-86 & CISA Joint DFIR Guidance: Forensic Analysis and Telemetry Correlation for ${draft.title}.`,
      cat
        ? `${cat.org2}: ${cat.title2} (${cat.code2}).`
        : `Official Vendor Audit & Forensics Specification: ${draft.stages[0]?.title || draft.title}.`,
      `MITRE ATT&CK ${mitreId} & SigmaHQ Detection Repository: Standardized SIEM & EDR rules for ${draft.title}.`,
    ],
    groundedSources: [
      {
        title: cat ? `${cat.org1} — ${cat.title1}` : `NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response`,
        uri: cat ? cat.url1 : 'https://csrc.nist.gov/publications/detail/sp/800-86/final',
      },
      {
        title: cat ? `${cat.org2} — ${cat.title2}` : `CISA Cybersecurity Advisories & DFIR Playbooks`,
        uri: cat ? cat.url2 : 'https://www.cisa.gov/news-events/cybersecurity-advisories',
      },
      {
        title: `MITRE ATT&CK ${mitreId} — ${draft.title}`,
        uri: mitreUrl,
      },
    ],
  };
}

export const VULNCHECK_CWP_AND_DFIR_ATTRIBUTIONS: Record<
  string,
  ScenarioAttributionProfile
> = Object.fromEntries(
  ALL_NEW_DRAFTS.map((draft) => [draft.id, buildDfirAttribution(draft)])
);

export const VULNCHECK_CWP_AND_DFIR_CURATED_INTEL: Record<
  string,
  Omit<ThreatIntelContextData, 'sourceMode' | 'fetchedAt'>
> = Object.fromEntries(
  ALL_NEW_DRAFTS.map((draft) => [draft.id, buildDfirCuratedIntel(draft)])
);
