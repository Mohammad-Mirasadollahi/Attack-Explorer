import type { RawScenarioStepGuideData } from '../scenario-step-guides';
import type { LegacyDraftScenario } from '@/modules/scenarios/legacy/normalize-legacy-draft-scenario';
import { explainCommandLine } from '../command-line-explanations';
import { LEGACY_DRAFT_SCENARIOS } from '@/modules/scenarios/all-scenarios';
import { STATIC_SCENARIO_STEP_GUIDES } from '@/modules/scenarios/all-step-guides';

/** Draft scenarios without a static stepGuide export in index.ts (DFIR / CWP / official expansion batches). */
const ALL_NEW_DFIR_AND_CWP_DRAFTS: LegacyDraftScenario[] =
  LEGACY_DRAFT_SCENARIOS.filter((draft) => !STATIC_SCENARIO_STEP_GUIDES[draft.id]);

interface CustomScenarioNarrativeMeta {
  advisory: string;
  briefingAnalogy: string;
  /** MOD-11 Formula A2 Overview roadmap (replaces auto-generated stage dump). */
  plainSummary?: string;
  stepAnalogies: [string, string, string];
}

const CUSTOM_DFIR_NARRATIVE_META: Record<string, CustomScenarioNarrativeMeta> = {
  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr': {
    advisory:
      'Jeffrey Appel Security Research ("ARTEX: Old Attacks at Machine Speed, and how Microsoft Defender keeps up"), Microsoft Threat Intelligence (Storm-0940 & Defender XDR Automatic Attack Disruption) & MITRE ATT&CK T1110.003 / T1558.003 / T1552.004',
    briefingAnalogy:
      'Imagine a bank heist crew that replaces slow human lockpickers with a coordinated swarm of high-speed robotic arms (the ARTEX Go + Next.js LLM Planner-Worker framework): instead of inventing a brand-new laser cutter, the master robot (LLM Planner) dispatches 8 worker robots that test every door handle (nmap/curl + Storm-0940 password spray), prop open a side window (web shell + RC4 Kerberoasting), and empty the upstairs safe (Azure Key Vault SecretGet) in under 15 minutes, forcing the building security system (Microsoft Defender XDR) to slam down steel blast doors automatically (Automatic Attack Disruption) because waiting for a human guard to read the alarm log would be too late.',
    stepAnalogies: [
      'Think of a central AI dispatcher (artex-server Go Planner) handing out parallel checklists to robotic scouts (Worker agents running nmap -sV, curl, and Storm-0940 low-and-slow OAuth2 password sprays) so the moment one password clicks open, the next robot is already in motion.',
      'Think of the second robot immediately wedging open a service door (dropping an ASPX web shell under w3wp.exe) and requesting a downgraded RC4 ticket voucher (EventID 4769 etype 0x17) within 8 minutes, compressing what used to take human hackers days of manual typing into seconds.',
      'Think of the cloud robot sprinting straight to the master key vault (Azure Key Vault SecretGet) within 5 minutes, only for the building automated defense grid (Microsoft Defender XDR KQL multi-alert burst correlation + Automatic Attack Disruption) to spot 3+ alarms on the same badge in a 15-minute window, isolate the machine (sense.exe), and shred the badge (Entra ID session revocation).',
    ],
  },
  'pikered-clr-profiler-trusted-binary-loader-chain': {
    advisory:
      'PikeRed Security Research ("Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access"), Microsoft .NET Unmanaged Profiling API Specification & MITRE ATT&CK T1574.012',
    briefingAnalogy:
      'Imagine shipping a locked virtual cargo container (.vhdx) so individual items inside bypass the customs stamp (Mark-of-the-Web Zone.Identifier), hiding the real engine parts behind a false wall (attrib +h +s), and setting an official diagnostic inspection flag (COR_ENABLE_PROFILING=1 and COR_PROFILER_PATH) before starting a trusted, digitally signed vehicle (KeePass.exe) so the vehicle own runtime engine (clr.dll) automatically bolts on and executes the attacker custom module (PerformanceTrace.dll).',
    stepAnalogies: [
      'Think of mounting a sealed virtual shipping crate (.vhdx) where only the outer crate has a customs tag, so the shortcut inside runs without SmartScreen warnings while real binaries stay invisible behind super-hidden OS flags (+h +s).',
      'Think of writing diagnostic override instructions onto the workshop clipboard (process environment block COR_ENABLE_PROFILING=1, COR_PROFILER, COR_PROFILER_PATH) right before launching a trusted, signed .NET application (KeePass.exe).',
      'Think of the .NET engine (mscoree.dll and clr.dll) obediently reading that clipboard at startup, loading the attacker unmanaged DLL without touching the Windows Registry, and running its Initialize() callback inside the signed process.',
    ],
  },
  'dfir-ntds-dit-vssadmin-esentutl-extraction': {
    advisory:
      'CISA Joint Advisory AA23-075A, Microsoft ESENT Event Logging Specification (EventID 325/326) & MITRE ATT&CK T1003.003',
    briefingAnalogy:
      'Imagine a high-security bank vault where the master ledger book (ntds.dit) is bolted to the teller desk while the bank is open, so an insider uses the building photocopy system (Volume Shadow Copy vssvc.exe) to photograph the entire room and uses the official ledger binding machine (esentutl.exe) to print a duplicate copy alongside the safe combination key (SYSTEM registry hive).',
    stepAnalogies: [
      'Think of asking the facility camera system to freeze-frame the locked vault room (creating a read-only Volume Shadow Copy of C: so the exclusively locked ntds.dit file can be read without stopping the Active Directory service).',
      'Think of using the bank own certified archive copier to duplicate the ledger from the freeze-frame (invoking Microsoft signed esentutl.exe /y /vss, which silently logs ESENT EventID 325 and 326 in the Windows Application log).',
      'Think of copying the four-part cipher wheel needed to read the encrypted ledger entries (exporting HKLM\\SYSTEM via reg.exe save to extract the scrambled JD, Skew1, GBG, and Data BootKey classes).',
    ],
  },
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': {
    advisory:
      'Microsoft Sysinternals Sysmon EventID 10 Specification, Splunk SURGe Credential Dumping Research & MITRE ATT&CK T1003.001',
    briefingAnalogy:
      'Imagine a guard station (lsass.exe) holding every employee active badge in memory: instead of bringing in a suspicious burglary tool, an intruder calls the building own maintenance utility (rundll32.exe loading comsvcs.dll MiniDump) to take a complete crash-diagnostic photograph of the guard station desk.',
    stepAnalogies: [
      'Think of activating a master maintenance pass before approaching the security office (enabling SeDebugPrivilege in the process token via AdjustTokenPrivileges, recorded by Windows Security EventID 4703).',
      'Think of instructing a trusted maintenance worker to photocopy the entire badge cabinet (calling comsvcs.dll MiniDump or ordinal #24 via rundll32.exe, which opens lsass.exe with 0x1FFFFF access and logs Sysmon EventID 10).',
      'Think of sealing the photographed badge sheets into a labeled diagnostic binder on disk (writing the MDMP 4D 44 4D 50 minidump file to C:\\Windows\\Temp\\debug.bin, captured by Sysmon EventID 11).',
    ],
  },
  'dfir-dcsync-drsuapi-replication-eid4662': {
    advisory:
      'Microsoft Security Auditing EventID 4662 Specification, CISA Active Directory Hardening Guide & MITRE ATT&CK T1003.006',
    briefingAnalogy:
      'Imagine a regular desktop cubicle pretending to be a regional branch headquarters and calling the central bank vault over the internal synchronization phone line (MS-DRSR DRSUAPI) to request a full copy of every customer PIN and master signing key.',
    stepAnalogies: [
      'Think of a regular office phone dialing the dedicated inter-branch synchronization line (binding from a non-DC workstation IP to the drsuapi RPC UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 on CORP-DC01).',
      'Think of the central vault checking whether the caller has the inter-branch sync stamp (CORP-DC01 logging Security EventID 4662 with AccessMask 0x100 for Extended Right GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2).',
      'Think of the vault faxing the master key book directly to the cubicle without ever opening the physical safe door (streaming krbtgt NTLM and AES-256 keys in DRS_MSG_GETNCCHANGESREPLY over RPC).',
    ],
  },
  'dfir-wmi-event-subscription-persistence-sysmon': {
    advisory:
      'Microsoft Sysinternals Sysmon v15 (EventID 19/20/21), Mandiant WMI Forensics Whitepaper & MITRE ATT&CK T1546.003',
    briefingAnalogy:
      'Imagine wiring a hidden motion sensor (__EventFilter) inside the building automation database (OBJECTS.DATA) and connecting it with a splice cable (__FilterToConsumerBinding) to an automated loudspeaker (CommandLineEventConsumer) that fires every 60 seconds.',
    stepAnalogies: [
      'Think of installing a timer switch inside the building central control room (creating a permanent WMI __EventFilter in root\\subscription with a WQL polling query, logged by Sysmon EventID 19).',
      'Think of wiring that timer switch to an automated command dispatcher stored inside the master blueprint repository (registering CommandLineEventConsumer and __FilterToConsumerBinding in OBJECTS.DATA, logged by Sysmon EventID 20, 21, and WMI-Activity 5861).',
      'Think of the building automation daemon flipping the switch on schedule as the chief engineer (wmiprvse.exe or scrcons.exe spawning the payload as NT AUTHORITY\\SYSTEM, logged by Sysmon EventID 1).',
    ],
  },
  'dfir-bitsadmin-qmgr-persistence-bits-client': {
    advisory:
      'Microsoft BITS Operational Logging Documentation, Mandiant qmgr.db Forensics & MITRE ATT&CK T1197',
    briefingAnalogy:
      'Imagine scheduling a recurring courier pickup with the corporate mailroom (Windows Background Intelligent Transfer Service) and attaching a standing instruction (/SetNotifyCmdLine) that forces the mailroom clerk (svchost.exe) to open and run whatever package arrives.',
    plainSummary:
      'In this scenario (MITRE ATT&CK T1197, BITS Job Persistence & qmgr.db SetNotifyCmdLine Forensics), the attacker schedules a recurring download so the mailroom clerk later opens the package automatically. The attack unfolds in one continuous arc: create a BITS download job (so the transfer is logged as legitimate background work), persist a SetNotifyCmdLine callback inside qmgr.db (so completion launches attacker code), then let the BITS service host spawn regsvr32.exe after transfer completion (handing execution to the payload). Steps #1–#3 walk that chain end-to-end by covering job creation, qmgr.db persistence, and the svchost child process spawn. Primary detection correlates Bits-Client Operational EventID 3/59/60 with suspicious notify command lines and regsvr32 children parented by the BITS svchost instance.',
    stepAnalogies: [
      'Think of opening a persistent shipping ticket in the corporate mailroom ledger (creating a BITS download job via bitsadmin.exe, recorded in Microsoft-Windows-Bits-Client/Operational EventID 3 and 59).',
      'Think of writing a permanent callback instruction into the mailroom database so a program runs whenever the parcel lands (configuring SetNotifyCmdLine serialized into C:\\ProgramData\\Microsoft\\Network\\Downloader\\qmgr.db).',
      'Think of the mailroom clerk completing the delivery and immediately launching the attached program under system authority (Bits-Client EventID 60 followed by svchost.exe -k netsvcs -s BITS spawning regsvr32.exe).',
    ],
  },
  'dfir-schtasks-xml-registry-taskcache-forensics': {
    advisory:
      'Microsoft MSTIC Tarrask Research, Microsoft Security Auditing EventID 4698 & SANS DFIR Windows Forensics',
    briefingAnalogy:
      'Imagine adding a recurring job to the factory master wall calendar (Scheduled Tasks) and then erasing its entry from the public index board (deleting the TaskCache\\Tree SD Security Descriptor value) while leaving the internal clockwork gear (TaskCache\\Tasks\\{GUID}) spinning.',
    stepAnalogies: [
      'Think of registering a new recurring shift on the factory master schedule (creating a SYSTEM scheduled task that logs Security EventID 4698 with the full XML payload and writes the task file under C:\\Windows\\System32\\Tasks\\).',
      'Think of using master janitor keys to peel the label off the public schedule board so inspectors cannot list it (elevating to SYSTEM and deleting the SD registry value under Schedule\\TaskCache\\Tree\\, captured by Sysmon EventID 12).',
      'Think of forensic auditors opening the internal gearbox to find the hidden cog still firing every 15 minutes (correlating TaskScheduler EventID 200 with the intact binary Actions blob inside Schedule\\TaskCache\\Tasks\\{GUID}).',
    ],
  },
  'dfir-rdp-lateral-movement-tsclient-bitmap-cache': {
    advisory:
      'SANS DFIR Windows RDP Forensics Poster, ANSSI BMC-Tools Research & Microsoft TerminalServices Event Log Docs',
    briefingAnalogy:
      'Imagine an intruder remote-controlling a server from a hallway kiosk (mstsc.exe): not only do both doors log the badge swipe (RDPClient 1024 and LocalSessionManager 21/25), but the hallway kiosk silently saves 64x64 puzzle pieces of every screen frame (Cache0000.bin) on its own hard drive.',
    stepAnalogies: [
      'Think of the hallway kiosk recording which remote room number it dialed in its speed-dial list (mstsc.exe logging TerminalServices-RDPClient EventID 1024/1102 and writing the target IP and UsernameHint into NTUSER.DAT).',
      'Think of the destination room logging the remote visitor arrival and any subsequent session reconnections (RdpCoreTS EventID 131, Security EventID 4624 Type 10/7, and LocalSessionManager EventID 21, 24, and 25).',
      'Think of reassembling thousands of cached 64x64 screen puzzle tiles saved on the kiosk to see what the intruder typed (carving %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin with ANSSI bmc-tools).',
    ],
  },
  'dfir-smb-psexec-named-pipe-eid5145-7045': {
    advisory:
      'CISA Joint Advisory AA23-165A, Microsoft Security Auditing EventID 5145 / System EventID 7045 & SigmaHQ',
    briefingAnalogy:
      'Imagine dropping a temporary robot worker (PSEXESVC.exe) through a server delivery chute (ADMIN$ share), registering it with the building supervisor (Service Control Manager EventID 7045), and speaking to it through dedicated intercom tubes (named pipes -stdin/-stdout/-stderr).',
    stepAnalogies: [
      'Think of sliding the service binary through the administrative loading dock and dialing the supervisor extension (writing PSEXESVC.exe to \\\\*\\ADMIN$ and accessing \\\\*\\IPC$\\svcctl, logged by Security EventID 5145).',
      'Think of the building supervisor logging the installation of a brand-new LocalSystem service (services.exe recording System EventID 7045 and Security EventID 4697 for %SystemRoot%\\PSEXESVC.exe).',
      'Think of the robot worker opening three labeled intercom pipes that give away its true identity even if its uniform was renamed (Sysmon EventID 17 and 18 capturing \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr).',
    ],
  },
  'dfir-evtx-log-clearing-wevtutil-eid1102-104': {
    advisory:
      'NIST SP 800-86 DFIR Guide, Microsoft Security EventID 1102 / System EventID 104 Specification & SANS Windows Forensics',
    briefingAnalogy:
      'Imagine an intruder shredding the security desk visitor logbook (wevtutil cl Security), only for the shredder to automatically stamp a bright red receipt ("Logbook shredded by badge #1104 at 03:55", EventID 1102) onto page 1 of the new book while shredded pages remain recoverable in the bin (NTFS $UsnJrnl:$J and unallocated ElfChnk clusters).',
    stepAnalogies: [
      'Think of the intruder feeding every log channel into the shredder command loop (running wevtutil.exe cl across channels, which real-time SIEM forwarding captures via Sysmon EventID 1 prior to truncation).',
      'Think of the Windows EventLog service immediately stamping an indelible audit-cleared notice into the fresh file (writing Security EventID 1102 and System EventID 104 with the SubjectUserSid of the account that cleared the log).',
      'Think of forensic investigators inspecting the building master ledger of file size changes and pulling intact pages out of the wastebasket (correlating USN_REASON_DATA_TRUNCATION in $UsnJrnl:$J and carving 64KB ElfChnk chunks from unallocated disk space).',
    ],
  },
  'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2': {
    advisory:
      'SANS FOR508 NTFS Master File Table ($MFT) Analysis, Microsoft Sysinternals Sysmon EventID 2 & MITRE ATT&CK T1070.006',
    briefingAnalogy:
      'Imagine a counterfeiter backdating the ink date printed on the front of a newly forged passport ($STANDARD_INFORMATION attribute 0x10) to 2022, while the government immigration vault ($FILE_NAME attribute 0x30) and the security camera (Sysmon EventID 2) still record the exact nanosecond it was printed today.',
    stepAnalogies: [
      'Think of the passport office minting a new document and stamping the true nanosecond creation time in two separate registry books (Ntfs.sys populating both $STANDARD_INFORMATION 0x10 and $FILE_NAME 0x30 in the $MFT record).',
      'Think of the counterfeiter calling a user-mode API to roll back the public date stamp while a tripwire photographs both the old and new dates (NtSetInformationFile triggering Sysmon EventID 2 with Forged CreationUtcTime vs True PreviousCreationUtcTime).',
      'Think of a forensic examiner comparing the two ledger books side-by-side and spotting that the public date is four years earlier than the kernel-locked date with all nanoseconds zeroed out (MFTECmd revealing Created0x10 < Created0x30 and uSecZeros=True).',
    ],
  },
};

/** MOD-11 Formula A2 Overview roadmaps for DFIR scenarios without full custom narrative meta. */
const DFIR_FORMULA_A2_PLAIN_SUMMARIES: Record<string, string> = {
  'ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928':
    'In this scenario (T1190, NIST NVD CVE-2024-2928, Protect AI & MITRE ATLAS AML.T0018 - MLflow Tracking Server URI Fragment Path Traversal & Artifact Store Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Experiment Creation with URI, then run Registration, then arbitrary Host File Read via GET. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Experiment Creation with URI, then Run Registration, then Arbitrary Host File Read via GET, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1190 across the documented kill chain.',
  'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit':
    'In this scenario (T1518, Oligo Security, Wiz AI Research & OWASP LLM04/LLM06 - Exposed Ollama Inference API (:11434) Rogue Registry Pull & Modelfile Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Model Enumeration via GET, then arbitrary Registry Model Pull, then production Model Alias Overwrite via POST. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Model Enumeration via GET, then Arbitrary Registry Model Pull, then Production Model Alias Overwrite via POST, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 200 correlated across the documented kill chain.',
  'ai-pytorch-pickle-torch-load-supply-chain-forensics':
    'In this scenario (T1195.002, MITRE ATLAS AML.T0010, Trail of Bits fickling & HuggingFace Security - PyTorch Pickle Model Checkpoint Deserialization Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: pyTorch ZIP Archive Inspection, then legacy torch.load Invocation Without, then runtime eBPF / Sysmon Detection of Python. Steps #1–#3 walk that chain end-to-end by covering PyTorch ZIP Archive Inspection, then Legacy torch.load Invocation Without, then Runtime eBPF / Sysmon Detection of Python, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1195.002 across the documented kill chain.',
  'ai-rag-indirect-prompt-injection-mcp-tool-audit':
    'In this scenario (T1190, OWASP LLM01:2025, NIST AI 100-2 & MITRE ATLAS AML.T0051 - Indirect Prompt Injection via RAG Vector Retrieval & Agent/MCP Tool Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: untrusted Document Embedding, then unauthorized Agent Tool Call Generation, then deterministic Policy Gate Interception. Steps #1–#3 walk that chain end-to-end by covering Untrusted Document Embedding, then Unauthorized Agent Tool Call Generation, then Deterministic Policy Gate Interception, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1190 across the documented kill chain.',
  'ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022':
    'In this scenario (T1046, Oligo ShadowRay Research, NIST NVD & MITRE ATLAS AML.T0018 - Ray AI Framework Unauthenticated Jobs API & GPU Cluster Forensics (CVE-2023-48022)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: exposed Ray Dashboard Discovery, then unauthenticated Job Submission via POST, then aI Model Weights. Steps #1–#3 walk that chain end-to-end by covering Exposed Ray Dashboard Discovery, then Unauthenticated Job Submission via POST, then AI Model Weights, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1046 across the documented kill chain.',
  'alphv-blackcat-sphynx-rust-impacket-exmatter':
    'In this scenario (T1048.002, CISA AA23-353A, Mandiant & Microsoft - ALPHV / BlackCat (Sphynx) Rust Ransomware, ExMatter Exfiltration & ESXi/Windows Encryption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: exMatter .NET Data Exfiltration, then access-Token Unpacking , fsutil R2R Symlink, then embedded Impacket PsExec Propagation, ESXi. Steps #1–#3 walk that chain end-to-end by covering ExMatter .NET Data Exfiltration, then Access-Token Unpacking , fsutil R2R Symlink, then Embedded Impacket PsExec Propagation, ESXi, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'cactus-ransomware-qlik-sense-ssh-batch-unpacker':
    'In this scenario (T1190, Kroll, Arctic Wolf & CISA KEV - Cactus Ransomware: Qlik Sense Exploitation (CVE-2023-41265), Chisel SSH Tunneling & AES Batch-Driven Self-Decryption (.cts1)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: qlik Sense Tunneling RCE, then psExec Batch Staging, 7z.exe Extraction, then multi-Stream Micro-Read Encryption. Steps #1–#3 walk that chain end-to-end by covering Qlik Sense Tunneling RCE, then PsExec Batch Staging, 7z.exe Extraction, then Multi-Stream Micro-Read Encryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'circleci-oauth-github-token-rotation-breach':
    'In this scenario (T1539, CircleCI Official Security Alert, GitHub Security & CISA - CircleCI CI/CD Supply Chain Breach: Engineer macOS Infostealer, 2FA Session Theft & Customer Vault Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: engineer macOS Infostealer Infection, then session Replay from Foreign IP, Production, then offline Decryption of Customer CI/CD Secrets. Steps #1–#3 walk that chain end-to-end by covering Engineer macOS Infostealer Infection, then Session Replay from Foreign IP, Production, then Offline Decryption of Customer CI/CD Secrets. Primary detection pivots on EDR Event 1 correlated across the documented kill chain.',
  'cl0p-truebot-flawedgrace-sdbbot-ransomware':
    'In this scenario (T1218.011, CISA AA23-158A, Microsoft & Mandiant - CL0P (TA505 / FIN11) Ransomware: TrueBot Loader, FlawedGrace RAT, SDBbot & Signed Binary Mass Share Encryption (.CIop)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: trueBot Execution, then mass Termination of 600+ Processes, then rC4 / AES + RSA-1024 Encryption. Steps #1–#3 walk that chain end-to-end by covering TrueBot Execution, then Mass Termination of 600+ Processes, then RC4 / AES + RSA-1024 Encryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'cloud-aws-eks-aws-auth-configmap-system-masters-audit':
    'In this scenario (T1078.004, AWS EKS Security, Unit 42 & MITRE - Amazon EKS aws-auth ConfigMap system:masters RBAC Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: eKS STS Presigned Bearer Token, then patching kube-system/aws-auth mapUsers /, then cluster-Admin Secret Enumeration. Steps #1–#3 walk that chain end-to-end by covering EKS STS Presigned Bearer Token, then Patching kube-system/aws-auth mapUsers /, then Cluster-Admin Secret Enumeration, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 200 correlated across the documented kill chain.',
  'cloud-aws-s3-kms-external-account-encryption-extortion-audit':
    'In this scenario (T1619, Halcyon, AWS Security & MITRE - AWS S3 Server-Side KMS External Key (SSE-KMS) Re-Encryption Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: cross-Account KMS Key Policy Grant, then in-Place S3 CopyObject Re-Encryption, then putBucketLifecycleConfiguration 1-Day. Steps #1–#3 walk that chain end-to-end by covering Cross-Account KMS Key Policy Grant, then In-Place S3 CopyObject Re-Encryption, then PutBucketLifecycleConfiguration 1-Day, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 200 correlated across the documented kill chain.',
  'cloud-aws-sts-federation-token-console-signin-audit':
    'In this scenario (T1550.001, AWS CIRT, Datadog & MITRE - AWS STS GetFederationToken Console Sign-In Bypass & IAM Policy Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: programmatic AKIA Access Key Invocation, then federation SigninToken Exchange, then console Reconnaissance. Steps #1–#3 walk that chain end-to-end by covering Programmatic AKIA Access Key Invocation, then Federation SigninToken Exchange, then Console Reconnaissance, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 200 correlated across the documented kill chain.',
  'cloud-azure-vm-custom-script-extension-managed-identity-audit':
    'In this scenario (T1059, Microsoft Defender for Cloud, Mandiant & MITRE - Azure VM CustomScriptExtension & IMDS Managed Identity Token Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: aRM Control-Plane, then guest Agent SYSTEM Child Process Execution, then local IMDS Managed Identity OAuth Token. Steps #1–#3 walk that chain end-to-end by covering ARM Control-Plane, then Guest Agent SYSTEM Child Process Execution, then Local IMDS Managed Identity OAuth Token, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'cloud-entra-id-conditional-access-device-code-phishing-audit':
    'In this scenario (T1528, Microsoft Defender TI, CISA & MITRE - Entra ID OAuth 2.0 Device Code Flow (/devicecode) Token Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: oAuth 2.0 /devicecode Request, then family of Client IDs Refresh Token Exchange, then microsoft Graph API Mail, OneDrive. Steps #1–#3 walk that chain end-to-end by covering OAuth 2.0 /devicecode Request, then Family of Client IDs Refresh Token Exchange, then Microsoft Graph API Mail, OneDrive, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Azure AD Event 0 correlated across the documented kill chain.',
  'cloud-gcp-cloud-build-default-service-account-artifact-audit':
    'In this scenario (T1648, Google Cloud Security, Wiz & MITRE - GCP Cloud Build Default Service Account & Artifact Registry Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: submitting Ad-Hoc Cloud Build Job, then worker Container Metadata Query, then artifact Registry. Steps #1–#3 walk that chain end-to-end by covering Submitting Ad-Hoc Cloud Build Job, then Worker Container Metadata Query, then Artifact Registry, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1648 across the documented kill chain.',
  'cloud-github-actions-pull-request-target-oidc-token-audit':
    'In this scenario (T1195.002, GitHub Security Lab, CISA & MITRE - GitHub Actions pull_request_target Workflow & Cloud OIDC Token Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: privileged pull_request_target Trigger, then runner Environment Variable Inspection, then aWS STS AssumeRoleWithWebIdentity. Steps #1–#3 walk that chain end-to-end by covering Privileged pull_request_target Trigger, then Runner Environment Variable Inspection, then AWS STS AssumeRoleWithWebIdentity, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1195.002 across the documented kill chain.',
  'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit':
    'In this scenario (T1098.003, Microsoft Purview DFIR, CISA & MITRE - M365 Purview New-ComplianceSearch & eDiscovery Export Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: roleGroupMember Added to eDiscovery Manager, then tenant-Wide Keyword Query, then pST/Zip Package Export. Steps #1–#3 walk that chain end-to-end by covering RoleGroupMember Added to eDiscovery Manager, then Tenant-Wide Keyword Query, then PST/Zip Package Export, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1098.003 across the documented kill chain.',
  'cloud-midnight-blizzard-oauth-legacy-test-app-audit':
    'In this scenario (T1110.003, Microsoft Threat Intel & CISA ED 24-02 - Midnight Blizzard Legacy OAuth Test Application & Exchange Online EWS Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: low-Volume Residential Proxy Password Spray, then service Principal Credential Addition, then oAuth Bearer Token EWS Mailbox Sync. Steps #1–#3 walk that chain end-to-end by covering Low-Volume Residential Proxy Password Spray, then Service Principal Credential Addition, then OAuth Bearer Token EWS Mailbox Sync, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1110.003 across the documented kill chain.',
  'cloud-salesforce-connected-app-oauth-bulk-api-export-audit':
    'In this scenario (T1528, Salesforce Security, Mandiant & MITRE - SaaS Connected App OAuth Scope Escalation & Bulk API 2.0 Export Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unverified OAuth Connected App Consent, then asynchronous Bulk API 2.0 Query Job Creation, then bulk CSV Result Batch Download. Steps #1–#3 walk that chain end-to-end by covering Unverified OAuth Connected App Consent, then Asynchronous Bulk API 2.0 Query Job Creation, then Bulk CSV Result Batch Download, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 200 correlated across the documented kill chain.',
  'container-cap-sys-admin-cgroup-release-agent-notify-audit':
    'In this scenario (T1611, Linux Kernel Cgroups Docs, Trail of Bits & Falco - Privileged Container CAP_SYS_ADMIN Cgroup v1 release_agent Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mounting RDMA/Memory Cgroup v1 Controller, then enabling notify_on_release=1, then child Cgroup Process Exit Triggering Kernel. Steps #1–#3 walk that chain end-to-end by covering Mounting RDMA/Memory Cgroup v1 Controller, then Enabling notify_on_release=1, then Child Cgroup Process Exit Triggering Kernel, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1611 across the documented kill chain.',
  'container-cap-sys-module-kernel-ko-insmod-load-audit':
    'In this scenario (T1082, Red Hat Security, CNCF Tetragon & MITRE - Container CAP_SYS_MODULE Host Kernel Module (finit_module) Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: inspecting /proc/self/status CapEff Bit 16, then invoking finit_module / init_module, then host Kernel /proc/modules Taint Flag. Steps #1–#3 walk that chain end-to-end by covering Inspecting /proc/self/status CapEff Bit 16, then Invoking finit_module / init_module, then Host Kernel /proc/modules Taint Flag, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1082 across the documented kill chain.',
  'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit':
    'In this scenario (T1046, MongoDB Official Security Guide, CISA & MITRE T1530 - Exposed MongoDB Wire Protocol Port 27017 & local.oplog.rs Audit Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated OP_MSG Handshake, then replication Oplog Inspection for Historical, then bulk Collection Cursor Exhaustion. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated OP_MSG Handshake, then Replication Oplog Inspection for Historical, then Bulk Collection Cursor Exhaustion, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1046 across the documented kill chain.',
  'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics':
    'In this scenario (T1021, Microsoft SQL Server Security, Mandiant & MITRE T1505.001 - MSSQL Linked Server RPC, xp_cmdshell & Unsafe CLR Assembly Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mSSQL Linked Server Enumeration, then configuration Change Enabling xp_cmdshell, then in-Memory Hexadecimal CLR Assembly. Steps #1–#3 walk that chain end-to-end by covering MSSQL Linked Server Enumeration, then Configuration Change Enabling xp_cmdshell, then In-Memory Hexadecimal CLR Assembly, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 33205 correlated across the documented kill chain.',
  'db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094':
    'In this scenario (T1190, PostgreSQL Security Team, Rapid7 & CISA KEV - PostgreSQL UTF-8 Quote Escaping & COPY FROM PROGRAM Forensics (CVE-2025-1094)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: invalid UTF-8 Multi-Byte Sequence, then interactive psql Meta-Command or Stacked SQL, then database Engine COPY FROM PROGRAM OS Command. Steps #1–#3 walk that chain end-to-end by covering Invalid UTF-8 Multi-Byte Sequence, then Interactive psql Meta-Command or Stacked SQL, then Database Engine COPY FROM PROGRAM OS Command. Primary detection correlates process, authentication, and network telemetry for T1190 across the documented kill chain.',
  'db-redis-lua-sandbox-debian-liblua-cve-2022-0543':
    'In this scenario (T1046, Debian DSA-5081, NIST NVD & CISA KEV - Redis Lua Sandbox package.loadlib Escape & ReplicaOf Forensics (CVE-2022-0543)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Redis Port 6379 Connection, then redis EVAL Lua Script Invoking, then child Shell Spawn Under redis-server PID. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Redis Port 6379 Connection, then Redis EVAL Lua Script Invoking, then Child Shell Spawn Under redis-server PID, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1046 across the documented kill chain.',
  'db-snowflake-unc5537-single-factor-auth-data-egress-audit':
    'In this scenario (T1078.004, Mandiant & Snowflake Joint Report (UNC5537), CISA & MITRE T1530 - Snowflake Single-Factor Session & QUERY_HISTORY Egress Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: single-Factor Password Authentication, then schema Discovery, then bulk Table Staging via COPY INTO @~. Steps #1–#3 walk that chain end-to-end by covering Single-Factor Password Authentication, then Schema Discovery, then Bulk Table Staging via COPY INTO @~, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 1001 correlated across the documented kill chain.',
  'dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886':
    'In this scenario (T1649, SpecterOps, Microsoft ADV210003 & CISA DFIR - AD CS ESC1 SubjectAltName Spoofing & PKINIT Forensics (EID 4886 / 4768)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: eSC1 Vulnerable Certificate Template, then cSR Submission with Spoofed Domain Admin SAN, then kerberos PKINIT Authentication. Steps #1–#3 walk that chain end-to-end by covering ESC1 Vulnerable Certificate Template, then CSR Submission with Spoofed Domain Admin SAN, then Kerberos PKINIT Authentication, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1649 across the documented kill chain.',
  'dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment':
    'In this scenario (T1190, Apache Tomcat Security & CISA DFIR - Tomcat AJP Ghostcat (CVE-2020-1938) & /manager/text/deploy WAR Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: aJP/1.3 Port 8009, then authenticated WAR Upload via PUT, then jasper JSP Compilation. Steps #1–#3 walk that chain end-to-end by covering AJP/1.3 Port 8009, then Authenticated WAR Upload via PUT, then Jasper JSP Compilation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1190 across the documented kill chain.',
  'dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda':
    'In this scenario (T1098.001, AWS CIRT & CISA Cloud DFIR - AWS IAM PassRole + Lambda Privilege Escalation & StopLogging Tampering), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: iAM Privilege Escalation via iam:PassRole +, then lambda Invocation, then cloudTrail Anti-Forensics Attempt Blocked. Steps #1–#3 walk that chain end-to-end by covering IAM Privilege Escalation via iam:PassRole +, then Lambda Invocation, then CloudTrail Anti-Forensics Attempt Blocked, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 201 correlated across the documented kill chain.',
  'dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics':
    'In this scenario (T1552.005, AWS CIRT & Unit 42 DFIR - AWS CloudTrail IMDSv1 Role Theft, Off-Instance Replay & S3 Data Events Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: eC2 Instance Metadata Service SSRF Query, then off-Instance STS GetCallerIdentity Replay, then s3 Data Event GetObject Burst. Steps #1–#3 walk that chain end-to-end by covering EC2 Instance Metadata Service SSRF Query, then Off-Instance STS GetCallerIdentity Replay, then S3 Data Event GetObject Burst, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 200 correlated across the documented kill chain.',
  'dfir-bitsadmin-qmgr-persistence-bits-client':
    'In this scenario (T1197, Microsoft & Mandiant DFIR - BITS Job Persistence & qmgr.db SetNotifyCmdLine Forensics (EventID 59 / 60 / 3)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: bITS Transfer Job Creation, then setNotifyCmdLine Persistence, then bITS Transfer Completion. Steps #1–#3 walk that chain end-to-end by covering BITS Transfer Job Creation, then SetNotifyCmdLine Persistence, then BITS Transfer Completion, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-dcsync-drsuapi-replication-eid4662':
    'In this scenario (T1003.006, Microsoft Security Auditing & CISA DFIR - Active Directory DCSync DRSUAPI Replication (EventID 4662)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mS-DRSR RPC Bind to UUID, then directory Replication Extended Rights Check, then replication of SupplementalCredentials. Steps #1–#3 walk that chain end-to-end by covering MS-DRSR RPC Bind to UUID, then Directory Replication Extended Rights Check, then Replication of SupplementalCredentials, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 4624 correlated across the documented kill chain.',
  'dfir-dpapi-masterkey-lsass-browser-vault-forensics':
    'In this scenario (T1555.004, Microsoft DPAPI, SpecterOps & Elastic DFIR - DPAPI MasterKey Backup RPC & Browser/Vault Credential Theft (EID 4692 / 4693)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: dPAPI Blob, then domain Controller MS-BKRP BackupKey RPC, then offline Decryption of Windows Vault. Steps #1–#3 walk that chain end-to-end by covering DPAPI Blob, then Domain Controller MS-BKRP BackupKey RPC, then Offline Decryption of Windows Vault, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Sysmon Event 4663 correlated across the documented kill chain.',
  'dfir-entra-id-prt-roadtools-device-registration-forensics':
    'In this scenario (T1528, Microsoft MSRC & Dirk-jan Mollema DFIR - Entra ID Primary Refresh Token (PRT) & Rogue Device Registration Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: token Acquisition for Device Registration, then rogue Device Registration in Entra ID, then primary Refresh Token Sign-In. Steps #1–#3 walk that chain end-to-end by covering Token Acquisition for Device Registration, then Rogue Device Registration in Entra ID, then Primary Refresh Token Sign-In, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Azure AD Event 100 correlated across the documented kill chain.',
  'dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace':
    'In this scenario (T1078, VMware/Broadcom, CISA AA23-039A & Mandiant DFIR - ESXi /var/log/shell.log, hostd.log & VMDK Hypervisor Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: eSXi SSH Authentication, then mass Virtual Machine Termination via esxcli, then intermittent VMDK Encryption. Steps #1–#3 walk that chain end-to-end by covering ESXi SSH Authentication, then Mass Virtual Machine Termination via esxcli, then Intermittent VMDK Encryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1078 across the documented kill chain.',
  'dfir-evtx-log-clearing-wevtutil-eid1102-104':
    'In this scenario (T1070.001, NIST SP 800-86 & Microsoft DFIR - Event Log Clearing via wevtutil.exe & USN Journal Recovery (EID 1102 / 104)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mass Channel Enumeration, then immutable Audit Log Cleared Events, then nTFS $UsnJrnl:$J Transaction Correlation. Steps #1–#3 walk that chain end-to-end by covering Mass Channel Enumeration, then Immutable Audit Log Cleared Events, then NTFS $UsnJrnl:$J Transaction Correlation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-exchange-ews-autodiscover-proxylogon-iis-forensics':
    'In this scenario (T1190, Microsoft MSTIC, Volexity & CISA ED 21-02 DFIR - Exchange HttpProxy, MSExchange Management & OAB Webshell Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: exchange Frontend HttpProxy Log Analysis, then exchange Management Log, then aSP.NET Dynamic Compilation. Steps #1–#3 walk that chain end-to-end by covering Exchange Frontend HttpProxy Log Analysis, then Exchange Management Log, then ASP.NET Dynamic Compilation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-gcp-cloud-audit-service-account-key-impersonation':
    'In this scenario (T1078.004, Google Cloud Mandiant IR & MITRE DFIR - GCP Cloud Audit ServiceAccountKey Creation & Impersonation Chain Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: service Account Impersonation, then persistent User-Managed JSON Key Creation, then bigQuery Table Export. Steps #1–#3 walk that chain end-to-end by covering Service Account Impersonation, then Persistent User-Managed JSON Key Creation, then BigQuery Table Export, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1078.004 across the documented kill chain.',
  'dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly':
    'In this scenario (T1558.001, Microsoft Defender for Identity, CERT-FR & MITRE DFIR - Kerberos Golden Ticket Forgery Forensics (EID 4768 / 4769)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: offline TGT Forgery with Stolen krbtgt Key, then orphaned TGS-REQ, then target Host LogonType 3 with Synthetic. Steps #1–#3 walk that chain end-to-end by covering Offline TGT Forgery with Stolen krbtgt Key, then Orphaned TGS-REQ, then Target Host LogonType 3 with Synthetic, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 10 with the documented host and network chain.',
  'dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell':
    'In this scenario (T1505.004, Microsoft Exchange/IIS IR, ESET & Unit 42 DFIR - IIS HTTP.sys Kernel URI Registration & In-Memory Module Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: native/Managed IIS Module Registration, then kernel-Mode HTTP.sys URI UrlGroup, then live Triage via netsh http show servicestate. Steps #1–#3 walk that chain end-to-end by covering Native/Managed IIS Module Registration, then Kernel-Mode HTTP.sys URI UrlGroup, then Live Triage via netsh http show servicestate, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
  'dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape':
    'In this scenario (T1613, NSA/CISA Kubernetes Guide & CNCF Falco DFIR - Kubernetes Audit Log Privileged Pod & hostPath Container Escape), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: serviceAccount RBAC SelfSubjectRulesReview, then privileged Pod Creation with hostPID: true, then host Namespace Escape via nsenter -t 1 -m -u. Steps #1–#3 walk that chain end-to-end by covering ServiceAccount RBAC SelfSubjectRulesReview, then Privileged Pod Creation with hostPID: true, then Host Namespace Escape via nsenter -t 1 -m -u, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Auditd Event 201 correlated across the documented kill chain.',
  'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics':
    'In this scenario (T1036.004, PwC, CrowdStrike & Elastic DFIR - Linux BPFDoor Raw Socket Filter, /dev/shm Masquerading & /proc/net/packet Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: memory-Backed /dev/shm Execution, then raw Packet Socket Creation, then forensic Discovery via /proc/net/packet, ss. Steps #1–#3 walk that chain end-to-end by covering Memory-Backed /dev/shm Execution, then Raw Packet Socket Creation, then Forensic Discovery via /proc/net/packet, ss, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 59 correlated across the documented kill chain.',
  'dfir-linux-ld-so-preload-userland-rootkit-proc-maps':
    'In this scenario (T1574.006, NCSC-NL, Red Hat & MITRE DFIR - Linux /etc/ld.so.preload Userland Rootkit & /proc/1/maps Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: shared Library Compilation, then global Dynamic Linker Injection, then forensic Detection via /proc/1/maps. Steps #1–#3 walk that chain end-to-end by covering Shared Library Compilation, then Global Dynamic Linker Injection, then Forensic Detection via /proc/1/maps, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 257 correlated across the documented kill chain.',
  'dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule':
    'In this scenario (T1564.008, Microsoft IR & CISA AA23-320A DFIR - M365 Purview Unified Audit Log MailItemsAccessed & New-InboxRule Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: stealthy Exchange Online Inbox Rule Creation, then mailbox Search, then oAuth App Consent Persistence. Steps #1–#3 walk that chain end-to-end by covering Stealthy Exchange Online Inbox Rule Creation, then Mailbox Search, then OAuth App Consent Persistence, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1564.008 across the documented kill chain.',
  'dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace':
    'In this scenario (T1059.003, Microsoft SQL Server Security & Mandiant DFIR - MSSQL xp_cmdshell / Ole Automation Reconfiguration (EventID 15457) & sqlservr.exe Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sp_configure Reconfiguration of show, then xplog70.dll / odsole70.dll Module Load, then cLR Stored Procedure Persistence. Steps #1–#3 walk that chain end-to-end by covering sp_configure Reconfiguration of show, then xplog70.dll / odsole70.dll Module Load, then CLR Stored Procedure Persistence, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-ntds-dit-vssadmin-esentutl-extraction':
    'In this scenario (T1003.003, CISA & Microsoft DFIR - Volume Shadow Copy & esentutl.exe NTDS.dit Extraction Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: volume Shadow Copy Creation via vssadmin.exe, then eSENT Database Streaming via esentutl.exe /y, then sYSTEM Registry Hive BootKey Extraction. Steps #1–#3 walk that chain end-to-end by covering Volume Shadow Copy Creation via vssadmin.exe, then ESENT Database Streaming via esentutl.exe /y, then SYSTEM Registry Hive BootKey Extraction, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-postgresql-copy-from-program-pg-log-auditd-trace':
    'In this scenario (T1078, PostgreSQL Security & SigmaHQ DFIR - PostgreSQL COPY FROM PROGRAM & Large Object (pg_largeobject) Execution Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: privileged Role Authentication, then cOPY FROM PROGRAM OS Command Execution, then large Object Shared Library Drop. Steps #1–#3 walk that chain end-to-end by covering Privileged Role Authentication, then COPY FROM PROGRAM OS Command Execution, then Large Object Shared Library Drop, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 5432 correlated across the documented kill chain.',
  'dfir-powershell-eid4104-4103-clm-downgrade-forensics':
    'In this scenario (T1562.001, Microsoft PowerShell Team, CISA & Mandiant DFIR - PowerShell EventID 4104 / 4103, Engine v2.0 Downgrade & PSReadLine History) at 10.10.4, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: powerShell v2.0 Engine Downgrade Detection, then dynamic De-Obfuscation in Script Block, then persistent Interactive Command Recovery. Steps #1–#3 walk that chain end-to-end by covering PowerShell v2.0 Engine Downgrade Detection, then Dynamic De-Obfuscation in Script Block, then Persistent Interactive Command Recovery, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
  'dfir-printspooler-spl-shd-spool-file-persistence':
    'In this scenario (T1547.012, Microsoft Print Spooler, Kaspersky & MITRE DFIR - Print Spooler Port Monitor & .SPL/.SHD Spool Forensics (EID 307 / 808)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mS-RPRN / MS-PAR RPC Bind to \\\\pipe\\\\spoolss, then port Monitor Registration via AddMonitor, then sYSTEM DLL Load in spoolsv.exe. Steps #1–#3 walk that chain end-to-end by covering MS-RPRN / MS-PAR RPC Bind to \\\\pipe\\\\spoolss, then Port Monitor Registration via AddMonitor, then SYSTEM DLL Load in spoolsv.exe, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
  'dfir-rdp-lateral-movement-tsclient-bitmap-cache':
    'In this scenario (T1021.001, SANS DFIR & Microsoft Event Log - RDP Lateral Movement, Session Reconnection & BMC Bitmap Cache Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: outbound mstsc.exe Connection, MRU Registry, then destination Server NLA Logon , RdpCoreTS 131, then client-Side RDP Bitmap Cache Visual Screen. Steps #1–#3 walk that chain end-to-end by covering Outbound mstsc.exe Connection, MRU Registry, then Destination Server NLA Logon , RdpCoreTS 131, then Client-Side RDP Bitmap Cache Visual Screen, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 11 with the documented host and network chain.',
  'dfir-sharepoint-iis-viewstate-losformatter-deserialization':
    'In this scenario (T1190, Microsoft MSRC & CISA KEV DFIR - ASP.NET / SharePoint __VIEWSTATE MachineKey LosFormatter Deserialization Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: web.config <machineKey> validationKey, then signed __VIEWSTATE LosFormatter /, then w3wp.exe Child Process Creation. Steps #1–#3 walk that chain end-to-end by covering web.config <machineKey> validationKey, then Signed __VIEWSTATE LosFormatter /, then w3wp.exe Child Process Creation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion':
    'In this scenario (T1187, Microsoft KB5005413, CERT-FR & CISA DFIR - MS-EFSRPC PetitPotam Coercion (Zeek dce_rpc) & NTLM Relay Forensics (EID 4624)) at 10.10.4, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: mS-EFSRPC Bind Over \\\\pipe\\\\lsarpc, then coerced Machine Account Outbound SMB NTLMv2, then cross-Protocol NTLM Relay to HTTP/LDAP. Steps #1–#3 walk that chain end-to-end by covering MS-EFSRPC Bind Over \\\\pipe\\\\lsarpc, then Coerced Machine Account Outbound SMB NTLMv2, then Cross-Protocol NTLM Relay to HTTP/LDAP, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Zeek Event 5145 correlated across the documented kill chain.',
  'dfir-smb-psexec-named-pipe-eid5145-7045':
    'In this scenario (T1021.002, Microsoft & CISA DFIR - SMB ADMIN$ Share, PSEXESVC Named Pipe & Service Install Forensics (EID 5145 / 7045)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sMB ADMIN$ Share Write, then remote Service Installation via SCM, then named Pipe Stdin/Stdout/Stderr Redirection. Steps #1–#3 walk that chain end-to-end by covering SMB ADMIN$ Share Write, then Remote Service Installation via SCM, then Named Pipe Stdin/Stdout/Stderr Redirection, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 17 with the documented host and network chain.',
  'dfir-vhd-iso-motw-bypass-zone-identifier-forensics':
    'In this scenario (T1566.002, Microsoft Threat Intel & Elastic DFIR - ISO / VHD Virtual Disk Mount, Zone.Identifier ADS & LNK Shellbags Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: container Download, then virtual Disk Mount via vhdmp.sys, then uSRCLASS.DAT Shellbags E:\\\\ Navigation. Steps #1–#3 walk that chain end-to-end by covering Container Download, then Virtual Disk Mount via vhdmp.sys, then USRCLASS.DAT Shellbags E:\\\\ Navigation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 15 with the documented host and network chain.',
  'dfir-volatility3-malfind-vad-hollowing-kernel-callbacks':
    'In this scenario (T1055, Volatility Foundation, SANS FOR526 & Elastic DFIR - Volatility 3 windows.malfind, psscan vs pslist & Kernel Callbacks Memory Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: volatility 3 windows.malfind, then direct Kernel Object Manipulation Detection, then kernel Notification Callback. Steps #1–#3 walk that chain end-to-end by covering Volatility 3 windows.malfind, then Direct Kernel Object Manipulation Detection, then Kernel Notification Callback, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1055 across the documented kill chain.',
  'dfir-winrm-wsman-remote-powershell-eid91-4624':
    'In this scenario (T1021.006, Microsoft WinRM, CrowdStrike & SigmaHQ DFIR - WinRM / WS-Management Lateral Movement & wsmprovhost.exe Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: outbound WSMan Session Initialization, then destination Server WSMan Shell Creation, then wsmprovhost.exe Child Process Spawning. Steps #1–#3 walk that chain end-to-end by covering Outbound WSMan Session Initialization, then Destination Server WSMan Shell Creation, then wsmprovhost.exe Child Process Spawning, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing':
    'In this scenario (T1071.001, Salesforce JA3, FoxIO JA4+ & CISA DFIR - Zeek ssl.log JA3/JA4 Fingerprint & Malleable C2 Jitter Beaconing Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: tLS ClientHello Fingerprinting in Zeek, then serverHello JA3S Correlation, then periodic Sleep/Jitter Statistical Histogram. Steps #1–#3 walk that chain end-to-end by covering TLS ClientHello Fingerprinting in Zeek, then ServerHello JA3S Correlation, then Periodic Sleep/Jitter Statistical Histogram, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 3 with the documented host and network chain.',
  'docker-buildkit-runc-cache-mount-race-cve-2024-23651':
    'In this scenario (T1610, Docker Security Advisory, Snyk & NVD - BuildKit RUN --mount=type=cache Race Condition Audit (CVE-2024-23651)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: parallel BuildKit Stages Sharing a Cache, then tOCTOU Symlink Replacement Between Subpath, then builder Host Filesystem Access Inside Build. Steps #1–#3 walk that chain end-to-end by covering Parallel BuildKit Stages Sharing a Cache, then TOCTOU Symlink Replacement Between Subpath, then Builder Host Filesystem Access Inside Build, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 200 correlated across the documented kill chain.',
  'docker-engine-unauthenticated-tcp-2375-api-socket-audit':
    'In this scenario (T1613, Docker Official Security, CISA & MITRE - Exposed Docker Daemon TCP Port 2375 API & Host Bind-Mount Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Docker Engine REST API, then pOST /containers/create, then host Root Filesystem chroot. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Docker Engine REST API, then POST /containers/create, then Host Root Filesystem chroot, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1613 across the documented kill chain.',
  'docker-oci-registry-manifest-layer-poisoning-cosign-audit':
    'In this scenario (T1525, Sigstore Cosign, NIST SP 800-190 & MITRE - OCI Container Registry Layer Tampering & Image Digest Verification Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: uploading Modified OCI Layer Blob via POST, then overwriting Mutable Image Tag via PUT, then admission Controller Sigstore Cosign. Steps #1–#3 walk that chain end-to-end by covering Uploading Modified OCI Layer Blob via POST, then Overwriting Mutable Image Tag via PUT, then Admission Controller Sigstore Cosign, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1525 across the documented kill chain.',
  'docker-var-run-docker-sock-mounted-socket-breakout-audit':
    'In this scenario (T1613, Docker Security, CNCF Falco & MITRE - Container Mounted /var/run/docker.sock Unix Socket Escalation Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: discovering Mounted /var/run/docker.sock, then spawning Sibling Container with HostPID, then entering Host PID 1 Mount. Steps #1–#3 walk that chain end-to-end by covering Discovering Mounted /var/run/docker.sock, then Spawning Sibling Container with HostPID, then Entering Host PID 1 Mount, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 42 correlated across the documented kill chain.',
  'eightbase-phobos-smoke-loader-process-hacker':
    'In this scenario (T1055, CISA AA24-045A & Cisco Talos - 8Base / Phobos Ransomware: SmokeLoader Delivery, Process Hacker (kprocesshacker.sys) Service Kill & AES-256 Encryption (.8base)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: smokeLoader / SystemBC SOCKS5 Proxy, then uAC Bypass, Windows Firewall Disablement, then phobos AES-256-CBC Encryption.8base. Steps #1–#3 walk that chain end-to-end by covering SmokeLoader / SystemBC SOCKS5 Proxy, then UAC Bypass, Windows Firewall Disablement, then Phobos AES-256-CBC Encryption.8base, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
  'hunters-international-hive-rust-wsus-sharpwmi':
    'In this scenario (T1047, CISA AA22-321A, Unit 42 & Sophos - Hunters International Ransomware: Hive Rust Lineage, SharpWMI Lateral Movement & COM IVssBackupComponents Shadow Deletion), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sharpWMI Remote Execution, then direct COM, then multi-Threaded Rust Encryption. Steps #1–#3 walk that chain end-to-end by covering SharpWMI Remote Execution, then Direct COM, then Multi-Threaded Rust Encryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'ics-frostygoop-modbus-tcp-district-heating-controller-audit':
    'In this scenario (T1190, Dragos FrostyGoop Report, CERT-UA & CISA ICS - Industrial ENCO Controller Modbus TCP Port 502 Register Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: external Modbus TCP Port 502 Session, then bulk Holding Register Enumeration, then holding Register Overwrite via Function. Steps #1–#3 walk that chain end-to-end by covering External Modbus TCP Port 502 Session, then Bulk Holding Register Enumeration, then Holding Register Overwrite via Function, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Zeek Event 502 correlated across the documented kill chain.',
  'ics-industroyer2-iec-60870-5-104-substation-telemetry':
    'In this scenario (T1489, CERT-UA #4435, ESET & CISA ICS - Industroyer2 IEC 60870-5-104 Substation Telecontrol & Protection Relay Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: legitimate SCADA Service Termination Prior, then iEC 60870-5-104 STARTDT_ACT Handshake, then aSDU Type 46 IOA Telecontrol Frame Audit. Steps #1–#3 walk that chain end-to-end by covering Legitimate SCADA Service Termination Prior, then IEC 60870-5-104 STARTDT_ACT Handshake, then ASDU Type 46 IOA Telecontrol Frame Audit, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'ics-pipedream-incontroller-codesys-modbus-opcua':
    'In this scenario (T1046, CISA AA22-103A, Dragos PIPEDREAM & Mandiant INCONTROLLER - Industrial PLC CODESYS & Modbus/OPC-UA Protocol Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: industrial Asset Discovery via OPC-UA, then cODESYS v2/v3 Runtime Authentication Bypass, then direct Modbus TCP Register Write. Steps #1–#3 walk that chain end-to-end by covering Industrial Asset Discovery via OPC-UA, then CODESYS v2/v3 Runtime Authentication Bypass, then Direct Modbus TCP Register Write, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1046 across the documented kill chain.',
  'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit':
    'In this scenario (T1574.001, CISA ICS-ALERT-10-196-01, Symantec Dossier & MITRE ICS - SIMATIC STEP 7 s7otbxdx.dll Interception & S7comm PLC Logic Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: engineering Workstation STEP 7 s7otbxdx.dll, then s7comm Port 102 PLC Block Download, then s7comm Upload Block Readback Spoofing. Steps #1–#3 walk that chain end-to-end by covering Engineering Workstation STEP 7 s7otbxdx.dll, then S7comm Port 102 PLC Block Download, then S7comm Upload Block Readback Spoofing, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
  'ics-trisis-triton-schneider-triconex-sis-telemetry':
    'In this scenario (T1036.005, CISA ICS-ALERT-17-356-01, Mandiant & Dragos - TRISIS / TRITON Safety Instrumented System (SIS) TriStation Protocol Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: masqueraded Py2EXE Binary, then triStation Protocol UDP 1502 Ping, then triStation Program Allocation. Steps #1–#3 walk that chain end-to-end by covering Masqueraded Py2EXE Binary, then TriStation Protocol UDP 1502 Ping, then TriStation Program Allocation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'inc-ransom-lynx-citrix-netscaler-wmic-mega':
    'In this scenario (T1046, Palo Alto Unit 42, Huntress & SentinelOne - INC Ransom & Lynx: Citrix NetScaler Exploitation, wmic.exe Distributed DLL Execution & MEGASync Double Extortion), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: edge Appliance Compromise, NetScan Discovery, then mass WMIC /node:@"hosts.txt" DLL, then aES-128-CTR + Curve25519 Encryption. Steps #1–#3 walk that chain end-to-end by covering Edge Appliance Compromise, NetScan Discovery, then Mass WMIC /node:@"hosts.txt" DLL, then AES-128-CTR + Curve25519 Encryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 22 with the documented host and network chain.',
  'ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit':
    'In this scenario (T1190, CISA KEV, Ivanti Security Advisory & CERT-EU - Ivanti Virtual Traffic Manager (vTM) Admin UI Auth Bypass Audit (CVE-2024-7593)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Access to wizard.fcgi, then unauthorized Local Administrator Account, then authenticated Admin Session. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Access to wizard.fcgi, then Unauthorized Local Administrator Account, then Authenticated Admin Session, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 200 correlated across the documented kill chain.',
  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr':
    'In this scenario (T1595.002, Jeffrey Appel & Microsoft Threat Intel - ARTEX Multi-Agent LLM Framework: Machine-Speed Kill-Chain Compression, Storm-0940 Spray & Defender XDR Disruption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: aRTEX Planner-Worker LLM Initialization, then machine-Speed Web Shell Persistence, then 5-Minute Cloud Secret Exfiltration. Steps #1–#3 walk that chain end-to-end by covering ARTEX Planner-Worker LLM Initialization, then Machine-Speed Web Shell Persistence, then 5-Minute Cloud Secret Exfiltration, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on SIEM Event 50126 correlated across the documented kill chain.',
  'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning':
    'In this scenario (T1190, Rapid7, JetBrains & CISA AA24-249A - JetBrains TeamCity Auth Bypass (CVE-2024-27198) to CI/CD Build Pipeline Poisoning & Signed Release Tampering), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated ;.jsp Matrix Parameter Auth, then cI/CD Build Step Injection, then trojanized Build Compilation, Official Code. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated ;.jsp Matrix Parameter Auth, then CI/CD Build Step Injection, then Trojanized Build Compilation, Official Code, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'k8s-coredns-dns-poisoning-service-account-token-audit':
    'In this scenario (T1557, CNCF CoreDNS Security, NSA/CISA K8s Guide & MITRE - Kubernetes CoreDNS ConfigMap Modification & Service Mesh DNS Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: rBAC Enumeration, then coreDNS reload Plugin Hot-Reloading, then service-to-Service Bearer Token Interception. Steps #1–#3 walk that chain end-to-end by covering RBAC Enumeration, then CoreDNS reload Plugin Hot-Reloading, then Service-to-Service Bearer Token Interception, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Kubernetes Audit Event 200 correlated across the documented kill chain.',
  'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit':
    'In this scenario (T1610, NSA/CISA Kubernetes Hardening Guide, Microsoft & MITRE - Cluster-Wide Malicious DaemonSet Scheduling & Node RootFS Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: creating an apps/v1 DaemonSet with Wildcard, then daemonSet Controller Scheduling Pods, then control-Plane Static Pod Manifest Inspection. Steps #1–#3 walk that chain end-to-end by covering Creating an apps/v1 DaemonSet with Wildcard, then DaemonSet Controller Scheduling Pods, then Control-Plane Static Pod Manifest Inspection, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 201 correlated across the documented kill chain.',
  'k8s-ephemeral-debug-container-process-namespace-share-audit':
    'In this scenario (T1609, Kubernetes Official Docs, Falco Security & MITRE - Ephemeral Debug Container (kubectl debug) Shared Process Namespace Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: subresource PATCH Against, then process Namespace Targeting, then interactive SPDY/WebSocket pods/attach. Steps #1–#3 walk that chain end-to-end by covering Subresource PATCH Against, then Process Namespace Targeting, then Interactive SPDY/WebSocket pods/attach, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Kubernetes Audit Event 200 correlated across the documented kill chain.',
  'k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974':
    'In this scenario (T1190, Kubernetes Official Advisory, Wiz & CISA KEV - Ingress-NGINX Admission Controller Configuration Validation Audit (CVE-2025-1974)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: admissionReview Webhook Request, then nGINX Configuration Test Engine Directive, then serviceAccount Token Usage. Steps #1–#3 walk that chain end-to-end by covering AdmissionReview Webhook Request, then NGINX Configuration Test Engine Directive, then ServiceAccount Token Usage, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Kubernetes Audit Event 257 correlated across the documented kill chain.',
  'k8s-kubelet-anonymous-api-etcd-snapshot-forensics':
    'In this scenario (T1613, CNCF Kubernetes Security, Microsoft Defender for Cloud & MITRE T1609 - Kubelet Read/Write Port 10250 & etcd Snapshot Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: unauthenticated Pod Enumeration via Kubelet, then remote Command Execution Inside Privileged, then control-Plane etcd Snapshot Extraction. Steps #1–#3 walk that chain end-to-end by covering Unauthenticated Pod Enumeration via Kubelet, then Remote Command Execution Inside Privileged, then Control-Plane etcd Snapshot Extraction. Primary detection correlates process, authentication, and network telemetry for T1613 across the documented kill chain.',
  'k8s-mutating-admission-webhook-sidecar-injection-audit':
    'In this scenario (T1546, Kubernetes Security Docs, Datadog & MITRE - Rogue MutatingWebhookConfiguration Pod Sidecar & Secret Capture Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: creating a Cluster-Scoped, then kube-apiserver Dispatching AdmissionReview, then jSONPatch Pod Mutation. Steps #1–#3 walk that chain end-to-end by covering Creating a Cluster-Scoped, then kube-apiserver Dispatching AdmissionReview, then JSONPatch Pod Mutation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Kubernetes Audit Event 201 correlated across the documented kill chain.',
  'lottie-player-npm-ace-supply-chain-2024':
    'In this scenario (T1195.002, LottieFiles Incident Report, Snyk & Wiz - @lottiefiles/lottie-player NPM Supply Chain Compromise, Unpinned CDN Propagation & Web3 Drainer Injection), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: compromised NPM Token Pushes, then obfuscated Bundle Execution, then dynamic DOM Overlay Injection. Steps #1–#3 walk that chain end-to-end by covering Compromised NPM Token Pushes, then Obfuscated Bundle Execution, then Dynamic DOM Overlay Injection, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on CloudTrail Event 200 correlated across the documented kill chain.',
  'medusa-ransomware-gaze-abyss-pdqdeploy':
    'In this scenario (T1190, CISA AA25-071A & Palo Alto Unit 42 - Medusa Ransomware: ScreenConnect RMM, gaze.exe (ThrottleStop.sys) Kernel Callback Killer & PDQ Deploy Encryption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: screenConnect RMM Foothold, Advanced IP, then gaze.exe Loading Signed ThrottleStop.sys, then pDQ Deploy Mass Distribution, VSS Deletion. Steps #1–#3 walk that chain end-to-end by covering ScreenConnect RMM Foothold, Advanced IP, then gaze.exe Loading Signed ThrottleStop.sys, then PDQ Deploy Mass Distribution, VSS Deletion. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'mobile-android-binder-gpu-selinux-audit-forensics':
    'In this scenario (T1404, Google Threat Analysis Group (TAG), Amnesty Tech & Android Security Bulletin - Android Kernel Binder/GPU & SELinux Audit Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sandboxed isolated_app Renderer ioctl Calls, then sELinux Enforcing State, then privileged Dalvik/ART Runtime Spawn. Steps #1–#3 walk that chain end-to-end by covering Sandboxed isolated_app Renderer ioctl Calls, then SELinux Enforcing State, then Privileged Dalvik/ART Runtime Spawn, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1404 across the documented kill chain.',
  'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics':
    'In this scenario (T1456, Kaspersky GReAT, Citizen Lab & Amnesty MVT - iOS Operation Triangulation Zero-Click iMessage & Shutdown.log Forensics (CVE-2023-41990)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: hidden iMessage Attachment Processing, then ephemeral Implant Execution, then anomalous System Process Cellular/Wi-Fi. Steps #1–#3 walk that chain end-to-end by covering Hidden iMessage Attachment Processing, then Ephemeral Implant Execution, then Anomalous System Process Cellular/Wi-Fi, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1456 across the documented kill chain.',
  'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics':
    'In this scenario (T1203, Citizen Lab FORCEDENTRY, Google Project Zero & Apple CVE-2021-30860 - iOS JBIG2 Stream & MVT Shutdown/DataUsage Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: zero-Click iMessage Attachment Retrieval, then coreGraphics Xpdf JBIG2Decode Segment, then dataUsage.sqlite. Steps #1–#3 walk that chain end-to-end by covering Zero-Click iMessage Attachment Retrieval, then CoreGraphics Xpdf JBIG2Decode Segment, then DataUsage.sqlite, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1203 across the documented kill chain.',
  'pypi-pytorch-torchtriton-dependency-confusion-supply-chain':
    'In this scenario (T1195.001, PyTorch Official Security Advisory, Sonatype & MITRE T1195.001 - PyTorch torchtriton Nightly Dependency Confusion Supply Chain Attack & h4ck.cfd DNS Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: public PyPI Namespace Squatting, then __init__.py Execution of Compiled ELF, then aES-Encrypted DNS Tunneling Exfiltration. Steps #1–#3 walk that chain end-to-end by covering Public PyPI Namespace Squatting, then __init__.py Execution of Compiled ELF, then AES-Encrypted DNS Tunneling Exfiltration, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Auditd Event 59 correlated across the documented kill chain.',
  'qilin-agenda-rust-chrome-cred-harvester-esxi':
    'In this scenario (T1555.003, Sophos X-Ops, Trend Micro & Group-IB - Qilin (Agenda) Ransomware: GPO PowerShell Chrome Credential Harvester, SafeBoot & Rust/Go Multi-Platform Encryption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: active Directory GPO Logon Script Harvesting, then credential-Authenticated Share Mounting, then simultaneous Windows. Steps #1–#3 walk that chain end-to-end by covering Active Directory GPO Logon Script Harvesting, then Credential-Authenticated Share Mounting, then Simultaneous Windows, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'ransomhub-edrkiller-tdsskiller-golocks':
    'In this scenario (T1562.001, CISA AA24-242A, Symantec & Mandiant - RansomHub Ransomware: Kaspersky TDSSKiller / EDRKillShifter BYOVD, Safe-Mode Boot & Curve25519 Encryption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: signed TDSSKiller.exe, then safe-Mode RunOnce Persistence, then sHA-256 -pass Config Decryption. Steps #1–#3 walk that chain end-to-end by covering Signed TDSSKiller.exe, then Safe-Mode RunOnce Persistence, then SHA-256 -pass Config Decryption, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
  'royal-blacksuit-ransomware-chacha20-restartmanager':
    'In this scenario (T1219, CISA AA23-061A / AA24-219A & Unit 42 - Royal & BlackSuit Ransomware: Callback Phishing, Windows Restart Manager File Unlock & OpenSSL Partial Encryption), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: callback Phishing / BatLoader RMM Delivery, then vssadmin Shadow Wipe, then openSSL AES-256-CBC Percentage-Based Partial. Steps #1–#3 walk that chain end-to-end by covering Callback Phishing / BatLoader RMM Delivery, then vssadmin Shadow Wipe, then OpenSSL AES-256-CBC Percentage-Based Partial, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
  'rspack-solana-web3js-npm-supply-chain-2024':
    'In this scenario (T1195.002, Solana Labs, Rspack Advisory & Socket.dev - @solana/web3.js & @rspack/core NPM Maintainer Compromise & Private Key / CI Token Exfiltration), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: nPM Maintainer Spearphishing, Token Hijack, then addToQueue Hook Injection Inside, then disguised CloudFlare Header Private Key. Steps #1–#3 walk that chain end-to-end by covering NPM Maintainer Spearphishing, Token Hijack, then addToQueue Hook Injection Inside, then Disguised CloudFlare Header Private Key, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 22 with the documented host and network chain.',
  'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626':
    'In this scenario (T1611, OpenContainers Security Advisory, Snyk & CISA KEV - runc File Descriptor Leak & Host Filesystem Breakout Analysis (CVE-2024-21626)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: open /sys/fs/cgroup File Descriptor, then relative Path Traversal Across Host Mount, then host Node Kubelet Credential. Steps #1–#3 walk that chain end-to-end by covering Open /sys/fs/cgroup File Descriptor, then Relative Path Traversal Across Host Mount, then Host Node Kubelet Credential, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 80 correlated across the documented kill chain.',
  'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics':
    'In this scenario (T1133, Mandiant UNC1945, CrowdStrike LightBasin & GSMA - Telecom GPRS Tunneling Protocol (GTP) & Roaming Interconnect Forensics), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: rogue PDP Context Creation Request, then encapsulated GTP-U Inner Packet Routing, then custom PAM Module. Steps #1–#3 walk that chain end-to-end by covering Rogue PDP Context Creation Request, then Encapsulated GTP-U Inner Packet Routing, then Custom PAM Module, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on auditd Event 2123 correlated across the documented kill chain.',
  'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit':
    'In this scenario (T1528, CISA/NSA/FBI Telecom Guidance, GSMA FS.31 & ENISA 5G - 5G Core Service-Based Interface (SBI) NRF/UDM & Diameter Roaming Audit), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: 5G NRF NFRegister, then uDM Subscriber Data, then diameter S6a Insert-Subscriber-Data. Steps #1–#3 walk that chain end-to-end by covering 5G NRF NFRegister, then UDM Subscriber Data, then Diameter S6a Insert-Subscriber-Data, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Suricata Event 200 correlated across the documented kill chain.',
  'versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit':
    'In this scenario (T1190, Black Lotus Labs (Volt Typhoon), CISA KEV & Versa Advisory - Versa Director SD-WAN Port 4566 Favicon Upload & Java Agent Audit (CVE-2024-39717)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: port 4566 /portalapi change_Dynamic_Favicon, then jVM VirtualMachine.attach, then on-Disk JAR Deletion. Steps #1–#3 walk that chain end-to-end by covering Port 4566 /portalapi change_Dynamic_Favicon, then JVM VirtualMachine.attach, then On-Disk JAR Deletion, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for T1190 across the documented kill chain.',
  'vulncheck-cwp-preauth-module-dispatch-rce':
    'In this scenario (T1190, VulnCheck - Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..104080)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: account Enumeration Oracle, Execution After, then pre-Auth Hosting User RCE, then loopback User API 127.0.0.1:2302 Missing, then oAuth Gate SQLi Bypass as root@localhost. Steps #1–#4 walk that chain end-to-end by covering Account Enumeration Oracle, Execution After, then Pre-Auth Hosting User RCE, then Loopback User API 127.0.0.1:2302 Missing, then OAuth Gate SQLi Bypass as root@localhost. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
};

const VULNCHECK_CWP_STEP_GUIDE: RawScenarioStepGuideData = {
  scenarioId: 'vulncheck-cwp-preauth-module-dispatch-rce',
  briefing: {
    headline:
      'Scenario Briefing: How the 10-CVE Control Web Panel (CWP2Shell) Chain Pivots from Pre-Auth Execution After Redirect to Root RCE',
    storyAnalogy:
      'Imagine a multi-tenant apartment building where the front-desk guard tells unauthenticated visitors to go to the lobby login desk but forgets to lock the inner hallway door. The visitor walks straight past the desk into any tenant suite, uses the suite maintenance panel to run commands as that tenant, and then picks up the building\'s internal house phone which executes every request as the building master superintendent.',
    plainSummary:
      'In this scenario (T1190, VulnCheck - Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE (CVE-2026-73695..104080)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: account Enumeration Oracle, Execution After, then pre-Auth Hosting User RCE, then loopback User API 127.0.0.1:2302 Missing, then oAuth Gate SQLi Bypass as root@localhost. Steps #1–#4 walk that chain end-to-end by covering Account Enumeration Oracle, Execution After, then Pre-Auth Hosting User RCE, then Loopback User API 127.0.0.1:2302 Missing, then OAuth Gate SQLi Bypass as root@localhost. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
    diagramTopologySummary:
      'The topology traces 4 sequential stages across Node ① (External Attacker on port 2083), Node ② (cwpsrv Nginx reverse proxy), Node ③ (per-user cwp-phpfpm pool running as uid=1000 labtest), Node ④ (pre-auth module sink in phpini_editor.php), Node ⑤ (Loopback User API on 127.0.0.1:2302 running as uid=0 root and MySQL root@localhost), and Node ⑥ (Linux Auditd and cwpsrv SIEM sensor).',
    documentedAdvisory:
      'VulnCheck Research Advisory (Nov 3, 2026): CVE-2026-73695, CVE-2026-73696, CVE-2026-73697, CVE-2026-77876, CVE-2026-77877, CVE-2026-77878, CVE-2026-77879, CVE-2026-77880, CVE-2026-77881 & CVE-2026-104080',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1190',
      plainTitle:
        'Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695)',
      storyAnalogy:
        'The intruder rings apartment buzzers until one clicks open, then walks right past a receptionist who hands out a redirect slip to the lobby without ever locking the inner hallway door behind the desk.',
      simpleExplanation:
        'On port 2083, cwpsrv routes requests matching https://host:2083/<username>/ to a dedicated per-user PHP-FPM Unix socket (returning HTTP 302 Found when the hosting account exists and HTTP 404 Not Found when the socket is absent, giving attackers a pre-auth username oracle). When an unauthenticated caller requests /labtest/index.php?module=..., CWPUserIndex::__construct invokes unauthenticatedFlow and UnauthenticatedFlowTrait::toLoginWithIntendedUri (which emits header Location: /login/?intended=... without calling exit under CVE-2026-73696, letting PHP execution fall straight through to the file-scope module dispatcher). At file scope, services/users/index.php reads CWPHttpRequest::get(module) through an anti-XSS filter that leaves ../, /, and . intact and executes include_once on /usr/local/cwpsrv/var/services/user_files/modules/$module_name.php (bypassing setModuleVars and checkIfModuleExists under CVE-2026-73695 so any user module or relative PHP file on disk is included without authentication).',
      howItWorksInPractice:
        'In the admin panel on port 2031, CWP calls header Location: /login followed immediately by exit (halting execution before any protected code loads), whereas the refactored user panel on port 2083 omitted exit inside UnauthenticatedFlowTrait::toLoginWithIntendedUri and omitted checkIfModuleExists before include_once (meaning every HTTP request to /<valid_user>/index.php?module=<target> executes the target module inside the hosting account\'s PHP-FPM pool before PHP flushes the cosmetic 302 redirect response).',
      diagramAlignment:
        'On the diagram, follow Step #1 / Link #1 from Node ① (External Attacker) through Node ② (cwpsrv Nginx :2083) to Node ③ (cwp-phpfpm Pool uid=1000).',
      detectionAndEvidence:
        'Inspect /usr/local/cwpsrv/logs/access_log (the CWP Nginx web access log recording every port 2083 request and response size) for HTTP 302 responses on POST or GET requests to /<user>/index.php?module=... that contain non-zero response bodies or module query parameters, indicating pre-auth Execution After Redirect exploitation of CVE-2026-73696 and CVE-2026-73695.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1059.004',
      plainTitle:
        'Pre-Auth Hosting User RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)',
      storyAnalogy:
        'Once inside the tenant suite without a key, the intruder uses two unguarded maintenance tools on the wall: first, a configuration notepad that saves custom text to any file path in the building, and second, a file-cleanup button that passes raw labels straight into the building\'s workshop command line.',
      simpleExplanation:
        'Because modules/phpini_editor.php executes at file scope as soon as Stage 1 includes it, an unauthenticated attacker reaches two pre-auth sinks running as hosting user uid=1000 under CVE-2026-73697: first, acc=update reads $_POST[file] without path validation and writes title=value lines via file_put_contents (allowing a quote-free PHP payload to be split across title and value parameters into /tmp/evilmod.php and executed in-band via module path traversal), and second, acc=addlabelphpiniadv reads $_POST[hfilename] via trim and passes it unquoted into shell_exec rm -f (allowing semicolon command injection as the hosting user). In addition, modules/protected_directory.php exposes a third pre-auth command injection sink under CVE-2026-77876 (where acc=deletedp interpolates unescaped $_POST[file] directly into a shell_exec sed command targeting .htaccess).',
      howItWorksInPractice:
        'Even though CWPHttpRequest strips single and double quotes from POST parameters (attempting to neutralize basic string breakouts), splitting PHP open and close tags across the title and value arrays in phpini_editor.php acc=update requires zero quotes, and the shell_exec rm -f sink in acc=addlabelphpiniadv leaves $hfilename completely unquoted (letting semicolon chaining such as hfilename=x ; id ; echo run arbitrary commands as uid=1000 in a single POST request).',
      diagramAlignment:
        'On the diagram, follow Step #2 / Link #2 from Node ② (cwpsrv Nginx :2083) and Node ③ (cwp-phpfpm Pool) into Node ④ (phpini_editor.php Sink).',
      detectionAndEvidence:
        'Correlate cwpsrv access logs showing POST /<user>/index.php?module=phpini_editor&acc=update or acc=addlabelphpiniadv with Linux auditd SYSCALL execve records (syscall 59 capturing every newly spawned process and its parent) where php-fpm under a hosting UID >= 1000 spawns /bin/sh running rm -f or writes .php files into /tmp/.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1068',
      plainTitle:
        'Loopback User API 127.0.0.1:2302 Missing Auth (CVE-2026-77877) to Root Command Injection (CVE-2026-77878 & CVE-2026-104080)',
      storyAnalogy:
        'From the tenant apartment, the intruder picks up the building\'s internal intercom wired to the superintendent\'s office: because the superintendent assumed only trusted staff could dial that internal line, several buttons require no passcode at all and carry out every order with full master authority.',
      simpleExplanation:
        'Control Web Panel runs an internal Slim v2 User API bound to https://127.0.0.1:2302 whose PHP-FPM pool executes as root uid=0 (granting unrestricted OS control to any request that reaches its handlers). In services/user_api/v1/app/routes/api.php, multiple sensitive routes omit the access_token middleware entirely under CVE-2026-77877 (leaving critical root endpoints callable from localhost without credentials). From the Stage 2 command injection, the attacker sends a single loopback curl request to /v1/restoredatabase/ passing a semicolon-injected file parameter (which BackupHandler::restoreDBBackup concatenates directly into a root shell_exec mysql command under CVE-2026-77878), while the tokenless /valid_token/ route passes raw POST user into a root shell_exec grep command against /etc/passwd (providing a second independent root command injection under CVE-2026-104080).',
      howItWorksInPractice:
        'Because Stage 2 under CVE-2026-73697 can invoke curl directly inside its hfilename command injection payload (bridging the external port 2083 web session to the internal 127.0.0.1:2302 listener), the entire unauthenticated remote-to-root chain completes in one external HTTP POST request (spawning /bin/sh as uid=1000, relaying POST /v1/restoredatabase/ to localhost, and executing the injected pipeline as uid=0 root).',
      diagramAlignment:
        'On the diagram, follow Step #3 / Link #3 from Node ③ (cwp-phpfpm Pool uid=1000) to Node ⑤ (Loopback User API 127.0.0.1:2302 running as root).',
      detectionAndEvidence:
        'Monitor Linux auditd execve syscall 59 events (recording every root process launch and full argument vector) where uid=0 spawns /bin/sh running mysql --defaults-extra-file=/root/.my.cnf or grep against /etc/passwd with shell metacharacters, and inspect PHP-FPM logs for loopback hits to 127.0.0.1:2302/v1/restoredatabase/ and /valid_token/.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1552.001',
      plainTitle:
        'OAuth Gate SQLi Bypass as root@localhost (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)',
      storyAnalogy:
        'Even on the internal intercom buttons that ask for a security pass, the intercom checks the pass by pasting the caller\'s raw words straight into the master ledger, letting the caller forge a fake future-dated pass and trigger the superintendent\'s password-reset machine.',
      simpleExplanation:
        'For routes on 127.0.0.1:2302 that do invoke the access_token middleware in services/user_api/v1/index.php, the function connects to MySQL using /root/.my.cnf as root@localhost and concatenates raw POST fields into SELECT * FROM oauth_authorization_codes (enabling a UNION SELECT SQL injection under CVE-2026-77879 that fabricates a 6-column row with a 2099 expiration timestamp, bypassing authentication on every token-gated route). With the gate bypassed, the attacker invokes /v1/newpass/, which validates password complexity on $pass but interpolates raw $user directly into shell_exec calling /usr/bin/passwd as root (achieving root RCE via semicolon injection in $user under CVE-2026-77880). Furthermore, /user_panel_dashboard/ and /valid_token/ concatenate $user into SELECT * FROM oauth_clients as root@localhost (exposing time-based blind SQLi over root_cwp and mysql.user under CVE-2026-77881).',
      howItWorksInPractice:
        'VulnCheck\'s IonCube bytecode analysis across CWP patches 1.8 through 1.30 (using icunpack to inspect obfuscated PHP handlers) showed that August 2026 updates patched only filemanager for CVE-2025-48703 while leaving the EAR flaw, module dispatcher, and loopback root API exposed until incremental September to November 2026 patches 1.12 through 1.30 added exit calls, basename/realpath module confinement, prepared SQL statements, cwp_clean_username, and cwp_api_as_user privilege dropping.',
      diagramAlignment:
        'On the diagram, follow Step #4 / Link #4 between Node ⑤ (Loopback User API 127.0.0.1:2302 & MySQL root@localhost) and Node ⑥ (Linux Auditd & SIEM Sensor).',
      detectionAndEvidence:
        'Audit MySQL general and slow query logs (recording every SQL statement executed by root@localhost against oauth_authorization_codes and oauth_clients) for UNION SELECT or SLEEP subqueries, and verify CWP is updated to build 0.9.8.1213+ / patch 1.30 confirming cwp_api_as_user and prepared statements are active. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1552.001 (pairing parent/child process and destination fields) and contain the offending session.',
    },
  ],
};

function cleanForStepGuide(raw: string): string {
  return (raw || '')
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*—\s*/g, ', ')
    .replace(/WHY\s*\/\s*(?:SPEC|PROTOCOL\s*EFFECT)\s*:?\s*/gi, '')
    .replace(/\(\s*why\s*:/gi, '(because ')
    .trim();
}

/**
 * Removes parentheses from a text fragment that will be embedded inside an outer
 * inline parenthetical `(...)`, preventing nested parentheses so clause parsing
 * and readability stay crisp across all scenarios.
 */
function stripParensForInnerText(text: string): string {
  return cleanForStepGuide(text)
    .replace(/\(\s*/g, ', ')
    .replace(/\s*\)/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*/, '')
    .replace(/,\s*$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Flattens any accidental nested parentheses in top-level prose while keeping
 * top-level inline purpose parentheticals completely intact.
 */
function flattenNestedParensInProse(text: string): string {
  let out = '';
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') {
      if (depth === 0) {
        out += '(';
      } else {
        out += ', ';
      }
      depth++;
    } else if (ch === ')') {
      if (depth > 0) depth--;
      if (depth === 0) {
        out += ')';
      }
    } else {
      out += ch;
    }
  }
  return out
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function buildOfficialDfirStepGuide(
  draft: LegacyDraftScenario
): RawScenarioStepGuideData {
  if (draft.id === 'vulncheck-cwp-preauth-module-dispatch-rce') {
    return VULNCHECK_CWP_STEP_GUIDE;
  }

  const customMeta = CUSTOM_DFIR_NARRATIVE_META[draft.id];
  const mitreCode = draft.mitreId || 'T1003';
  const cleanTitle = cleanForStepGuide(draft.title);
  const cleanDesc = flattenNestedParensInProse(
    cleanForStepGuide(draft.description)
  );
  const nodes = draft.NodesGenerator ? draft.NodesGenerator() : [];
  const n1 = cleanForStepGuide(nodes[0]?.label || 'Origin Host');
  const n2 = cleanForStepGuide(nodes[1]?.label || 'Telemetry Gateway');
  const n3 = cleanForStepGuide(nodes[2]?.label || 'Target System');
  const n4 = cleanForStepGuide(nodes[3]?.label || 'SIEM & DFIR Sensor');
  const n5 = cleanForStepGuide(nodes[4]?.label || 'Forensic Artifact Store');

  const briefingAnalogy =
    customMeta?.briefingAnalogy ||
    `Imagine a high-security facility where an intruder attempts to operate covertly across ${n1}, ${n2}, and ${n3}, unaware that every system call, protocol handshake, and on-disk structural table automatically records an immutable forensic ledger entry correlated by ${n4}.`;

  const advisoryText =
    customMeta?.advisory ||
    `Official Vendor & CERT DFIR Documentation (${mitreCode}) · ${cleanTitle}`;

  const stageLogSources = Array.from(
    new Set(
      draft.stages
        .map((st) => st.logs?.[0]?.source)
        .filter((s): s is string => Boolean(s))
    )
  );
  const stageEventCodes = Array.from(
    new Set(
      draft.stages
        .map((st) => st.logs?.[0]?.EventCode)
        .filter((c) => c !== undefined && c !== null && String(c).length > 0)
        .map((c) => String(c))
    )
  );
  const sourceList =
    stageLogSources.length > 0 ? stageLogSources.join(' and ') : 'host SIEM';
  const codeClause =
    stageEventCodes.length > 0
      ? `Event IDs ${stageEventCodes.join(', ')}`
      : `${mitreCode} indicators`;
  const hasBriefingParen = /\([^()]{20,}\)/.test(cleanDesc);
  const plainSummary =
    customMeta?.plainSummary ??
    DFIR_FORMULA_A2_PLAIN_SUMMARIES[draft.id] ??
    (hasBriefingParen
      ? cleanDesc
      : `${cleanDesc.replace(/\.+\s*$/, '')}. Across all ${draft.stages.length} documented stages, defenders correlate ${sourceList} logs (linking ${codeClause} across ${stripParensForInnerText(n3)} and ${stripParensForInnerText(n5)} to verify root cause and scope impact).`);

  return {
    scenarioId: draft.id,
    briefing: {
      headline: `Scenario Briefing: Official DFIR & Log Forensics Guide for ${cleanTitle}`,
      storyAnalogy: briefingAnalogy,
      plainSummary: flattenNestedParensInProse(plainSummary),
      diagramTopologySummary: `The forensic topology spans Node ① (${stripParensForInnerText(n1)}), Node ② (${stripParensForInnerText(n2)}), Node ③ (${stripParensForInnerText(n3)}), Node ④ (Runtime Process & Artifact Context), Node ⑤ (${stripParensForInnerText(n5)}), and Node ⑥ (${stripParensForInnerText(n4)}) across ${draft.stages.length} chronological steps (#1 to #${draft.stages.length}).`,
      documentedAdvisory: advisoryText,
    },
    steps: draft.stages.map((stage, idx) => {
      const stepNo = stage.id || idx + 1;
      const stageMitre =
        (stage.mitreTactic || '').match(/T\d{4}(?:\.\d{3})?/)?.[0] || mitreCode;
      const cleanStageTitle = cleanForStepGuide(
        stage.title.replace(/^Stage\s+\d+:\s*/i, '')
      );
      const cleanNarration = flattenNestedParensInProse(
        cleanForStepGuide(stage.narration).replace(/\.+\s*$/, '')
      );
      const log = stage.logs?.[0];
      const logSource = cleanForStepGuide(log?.source || 'SIEM');
      const eventCode =
        log?.EventCode !== undefined && log?.EventCode !== null
          ? String(log.EventCode)
          : stageMitre;
      const cmd0 = cleanForStepGuide(
        stage.technicalCommands?.[0] || log?.CommandLine || cleanStageTitle
      );
      const rawStageCommands = (
        stage.technicalCommands && stage.technicalCommands.length > 0
          ? stage.technicalCommands
          : [log?.CommandLine || cmd0]
      ).slice(0, 2);

      const parsedEntries = Object.entries(log?.parsedFields || {}).map(
        ([k, v]) => `${k}=${stripParensForInnerText(v)}`
      );
      const parsedSummary = parsedEntries.join(', ');

      // Build clean, non-boilerplate, flat-parenthetical deep-dive explanation from stage commands & telemetry
      const commandSentences = rawStageCommands.map((rawCmd, cIdx) => {
        const cleanCmd = cleanForStepGuide(rawCmd);
        const explained = explainCommandLine(cleanCmd, {
          termLabel: `COMMAND ${cIdx + 1}`,
          stageTitle: cleanStageTitle,
          stageDescription: cleanNarration,
          mitreId: stageMitre,
          scenarioName: cleanTitle,
        });
        const meaningClean = stripParensForInnerText(explained.whatItMeans)
          .replace(/\.+\s*$/, '')
          .replace(/^(?:Executes|Invokes|Inspects or executes)\s+/i, (m) =>
            m.toLowerCase()
          );
        const purposeClean = stripParensForInnerText(explained.exactPurpose)
          .replace(/\.\.\./g, '')
          .replace(/\.+\s*$/, '')
          .replace(/^([A-Z])/, (m) => m.toLowerCase());
        const compactMeaning =
          meaningClean.length > 150
            ? `${meaningClean.slice(0, 147).replace(/[\s,;:-]+$/, '')}`
            : meaningClean;
        const leadVerb =
          cIdx === 0
            ? `Under the hood, the observed step executes ${cleanCmd}`
            : `Next, the follow-up artifact ${cleanCmd} runs`;
        return `${leadVerb} (which ${compactMeaning} so that ${purposeClean || `defenders can trace ${stageMitre} on ${stripParensForInnerText(n3)}`}).`;
      });

      const howItWorksInPractice = flattenNestedParensInProse(
        commandSentences.join(' ')
      );

      const mitigation = flattenNestedParensInProse(
        cleanForStepGuide(
          stage.defenseMitigation ||
            'Enforce centralized telemetry forwarding and correlate multi-source forensic artifacts.'
        ).replace(/\.+\s*$/, '')
      );

      const telemetryEvidenceParen = parsedSummary
        ? `logged in ${logSource} Event ${eventCode} with ${parsedSummary} so analysts can verify the exact actor and target artifact`
        : `logged in ${logSource} Event ${eventCode} capturing ${stripParensForInnerText(cmd0)} for deterministic triage`;

      const simpleExplanation = flattenNestedParensInProse(
        `${cleanNarration} (${telemetryEvidenceParen}).`
      );

      const detectionAndEvidence = flattenNestedParensInProse(
        `Documented in ${logSource} Event ${eventCode} (recording ${parsedSummary || stripParensForInnerText(cmd0)} under ${stageMitre}): ${mitigation}.`
      );

      const stepAnalogy =
        customMeta?.stepAnalogies?.[idx] ||
        `At this stage of the intrusion, the intruder carries out the next covert action while every checkpoint ledger silently stamps an unforgeable receipt of the maneuver.`;

      return {
        stepNumber: stepNo,
        mitreId: stageMitre,
        plainTitle: cleanStageTitle,
        storyAnalogy: stepAnalogy,
        simpleExplanation,
        howItWorksInPractice,
        diagramAlignment: `On the diagram, follow Step #${stepNo} / Link #${stepNo} across the topology from ${stripParensForInnerText(n1)} and ${stripParensForInnerText(n2)} toward ${stripParensForInnerText(n3)} and ${stripParensForInnerText(n4)}.`,
        detectionAndEvidence,
      };
    }),
  };
}

export const VULNCHECK_CWP_AND_DFIR_STEP_GUIDES: Record<
  string,
  RawScenarioStepGuideData
> = Object.fromEntries(
  ALL_NEW_DFIR_AND_CWP_DRAFTS.map((draft) => [
    draft.id,
    buildOfficialDfirStepGuide(draft),
  ])
);
