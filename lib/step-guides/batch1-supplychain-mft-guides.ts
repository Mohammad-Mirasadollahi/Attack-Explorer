import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH1_SUPPLYCHAIN_MFT_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'xz-utils-cve-2024-3094-backdoor': {
    scenarioId: 'xz-utils-cve-2024-3094-backdoor',
    briefing: {
      headline: 'Scenario Briefing: XZ Utils Supply Chain Backdoor (CVE-2024-3094) — Hijacking OpenSSH via liblzma IFUNC',
      storyAnalogy:
        'Imagine a master locksmith ("Jia Tan") who spends two years volunteering at a company that makes a tiny brass spring (`liblzma.so`) used inside millions of Linux tools. Right before shipping version 5.6.1, the locksmith hides a microscopic radio receiver inside a box of "broken test springs" (`bad-3-corrupt_lzma2.xz`) and rigs the factory assembly script (`build-to-host.m4`) to weld that receiver into the finished spring. Because Linux’s main front-door guard (`sshd`) wears a status badge (`libsystemd.so`) that uses that exact brass spring, the radio receiver wakes up inside the front-door guard’s uniform, intercepts the signature-checking pen (`RSA_public_decrypt`), and opens the master vault whenever anyone shows a secret Ed448 signet ring!',
      plainSummary:
        'Synthesizing Andres Freund’s initial discovery on oss-security, Kaspersky GReAT’s binary reverse engineering, and Red Hat / CISA advisories (March 2024), CVE-2024-3094 (CVSS 10.0) is one of the most sophisticated supply chain backdoors in history. During compilation of XZ Utils 5.6.0/5.6.1, obfuscated m4 scripts extracted a prebuilt object (`liblzma_la-crc64-fast.o`) from corrupt test files (`bad-3-corrupt_lzma2.xz`). On Linux distributions that link OpenSSH (`sshd`) with `libsystemd.so.0` (which in turn loads `liblzma.so.5`), a glibc Indirect Function (`IFUNC`) resolver hijacks OpenSSL’s `RSA_public_decrypt` function pointer—allowing an attacker holding a secret Ed448 private key to execute arbitrary `root` commands via `system()` before SSH authentication even finishes.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Jia Tan / Ed448 SSH Client), follow the transitive `libsystemd.so.0 -> liblzma.so.5.6.1` load on Node ②/③ (Linux `sshd` Server), trace the `crc64_resolve` IFUNC hook of `RSA_public_decrypt` inside Node ④, and watch pre-auth `system()` root execution on Node ⑤ monitored by Node ⑥ (Linux Auditd / eBPF SIEM).',
      documentedAdvisory: 'Andres Freund oss-security Disclosure · Kaspersky GReAT & Red Hat Analysis · CVE-2024-3094 · MITRE T1195.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Splicing the Backdoor Object During Build & Loading `liblzma.so.5.6.1` into `sshd`',
        storyAnalogy:
          'The malicious code is not visible in the normal C source files on GitHub; instead, a rigged build script (`build-to-host.m4`) unpacks a hidden binary object from a "corrupt test file" (`bad-3-corrupt_lzma2.xz`) only when building release packages, and `libsystemd` carries that poisoned library straight into `sshd`.',
        simpleExplanation:
          'During package compilation of XZ Utils 5.6.0 and 5.6.1, a tampered macro file named build-to-host.m4 decodes hidden shell commands from two test archives—tests/files/bad-3-corrupt_lzma2.xz and tests/files/good-large_compressed.lzma (hidden inside binary test files so code reviewers inspecting C source files on GitHub would see nothing suspicious)—and splices a precompiled backdoor object into liblzma_la-crc64-fast.o. On Debian, Fedora, Ubuntu, and RHEL systems, the OpenSSH server (/usr/sbin/sshd) is compiled with libsystemd.so.0 support (so sshd can notify systemd when the service is ready, which transitively loads /lib/x86_64-linux-gnu/liblzma.so.5.6.1 directly into every sshd process).',
        howItWorksInPractice:
          'Why did Andres Freund catch this? Because parsing the symbol tables inside the backdoored liblzma.so.5.6.1 added ~500 milliseconds (~2.3 billion CPU cycles) to every failed SSH login, which Freund spotted while profiling Debian sid with perf.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① to Node ②/③ (Linux `sshd` loading `libsystemd.so.0 -> liblzma.so.5.6.1`), and return arrow ⇠#1.2 confirming the poisoned library load.',
        detectionAndEvidence:
          'Documented by Andres Freund, Red Hat & CISA: `ldd /usr/sbin/sshd` showing `liblzma.so.5.6.0` or `5.6.1` and ~500ms `sshd` CPU spike.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1574.006',
        plainTitle: 'Using a glibc `IFUNC` Resolver (`crc64_resolve`) to Hijack `RSA_public_decrypt` Before `main()`',
        storyAnalogy:
          'Before `sshd` even runs its first line of code in `main()`, the Linux library loader asks `liblzma` which CRC64 math function fits the CPU best (`IFUNC`). The rigged resolver uses that early wakeup call to swap out OpenSSL’s `RSA_public_decrypt` phone number in memory.',
        simpleExplanation:
          'When a program starts on Linux, the GNU dynamic linker (ld-linux-x86-64.so.2) resolves Indirect Functions (IFUNC — a legitimate glibc feature designed to let libraries pick the fastest CPU-specific math routine before main() even begins). When the linker calls crc64_resolve() inside liblzma.so.5.6.1, the injected _get_cpuid() function checks that argv[0] is "/usr/sbin/sshd" and that debugging variables like LD_DEBUG are not set, then hooks _dl_audit_preinit to overwrite the Global Offset Table (GOT) pointer for OpenSSL’s RSA_public_decrypt (redirecting every future RSA signature check inside sshd to the backdoor’s own function).',
        howItWorksInPractice:
          'By executing inside an IFUNC resolver during dynamic linking, the backdoor modifies the in-memory GOT pointer for RSA_public_decrypt before OpenSSH’s main() function or privilege-separation sandbox even initializes.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `crc64_resolve() -> _get_cpuid()` inside Node ④ (`liblzma` IFUNC Hook), and ⇠#2.2 redirects `RSA_public_decrypt@GOT`.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: In-memory GOT redirection of `RSA_public_decrypt` inside `liblzma_la-crc64-fast.o`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1556',
        plainTitle: 'Verifying the Ed448 Signature in the SSH RSA Modulus & Running `system()` as Root',
        storyAnalogy:
          'When the attacker connects over SSH, they hide an encrypted command inside the RSA public-key modulus (`N`) signed with their private Ed448 key. The hooked `RSA_public_decrypt` verifies the Ed448 signature and runs the command as `root`—while normal users’ SSH logins continue working normally!',
        simpleExplanation:
          'When the attacker connects to TCP port 22 and sends an SSH public-key authentication request (SSH_MSG_USERAUTH_REQUEST), sshd calls the hooked RSA_public_decrypt() to verify the client’s key. The backdoor inspects the RSA modulus N for a magic arithmetic header (a*b + c <= 3), decrypts the embedded payload using ChaCha20, and verifies it against a hardcoded 32-byte Ed448 public key (ensuring that *only* the threat actor holding the matching Ed448 private key can trigger the backdoor, while all normal SSH connections pass straight through to the real RSA_public_decrypt). Once verified, the backdoor passes the decrypted command string to system() as root (UID 0).',
        howItWorksInPractice:
          'Because the hooked RSA_public_decrypt executes inside the privileged sshd monitor process before authentication completes, the command runs with full root privileges and leaves zero failed-login entries in /var/log/auth.log.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `system()` on Node ⑤ (Pre-Auth Root Shell) while Node ⑥ (Linux Auditd / eBPF SIEM) flags `sshd` spawning `/bin/sh` prior to authentication.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT & CISA: Auditd `SYSCALL execve` showing `sshd [priv]` spawning `/bin/sh` before `USER_AUTH` completion.',
      },
    ],
  },

  'cl0p-moveit-transfer-cve-2023-34362': {
    scenarioId: 'cl0p-moveit-transfer-cve-2023-34362',
    briefing: {
      headline: 'Scenario Briefing: CL0P MOVEit Transfer Zero-Day (CVE-2023-34362) — SQL Injection to Deserialization & LEMURLOOT Webshell',
      storyAnalogy:
        'Imagine a secure courier lobby (`MOVEit Transfer`) where visitors can ask the front desk (`/guestaccess.aspx`) for a temporary visitor pass stored in a SQL ledger. The attacker discovers that the high-speed mail chute (`/moveitisapi/moveitisapi.dll`) blindly copies whatever is written on the envelope’s `X-siLock-SessVar` label straight into the SQL ledger without checking for punctuation (`SQL Injection`). Using that SQL flaw, the attacker slips a spring-loaded mechanical package (`.NET BinaryFormatter Deserialization Gadget`) into their visitor-pass row; the moment the server reads the pass back out of the ledger, the package springs open in memory and installs a hidden back-office clerk (`human2.aspx` / **LEMURLOOT**) who hands over the master keys to the company’s Azure cloud vaults.',
      plainSummary:
        'Synthesizing Mandiant (FIN11 / LEMURLOOT), Huntress Labs, Rapid7, and Joint CISA/FBI Advisory AA23-158A (May–June 2023), CVE-2023-34362 is the critical zero-day chain used by the CL0P ransomware group against Progress MOVEit Transfer servers worldwide. The attacker chains `/guestaccess.aspx` with `/moveitisapi/moveitisapi.dll?action=m2` to trigger an unauthenticated SQL injection flaw, injects a Base64-encoded .NET `BinaryFormatter` deserialization payload into the active session database table, drops the `human2.aspx` (`LEMURLOOT`) C# webshell into `C:\\MOVEitTransfer\\wwwroot\\`, and steals Azure Blob Storage keys and enterprise files.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (CL0P / FIN11 Operator), send the `/guestaccess.aspx` + `/moveitisapi/moveitisapi.dll` exploit chain to Node ②/③ (MOVEit Transfer IIS Server `w3wp.exe`), trace the `csc.exe` compilation of `human2.aspx` (`LEMURLOOT`) on Node ④, and follow the SQL/Azure Blob exfiltration on Node ⑤ detected by Node ⑥ (SIEM).',
      documentedAdvisory: 'CISA/FBI Joint Advisory AA23-158A · Mandiant LEMURLOOT & Huntress Analysis · CVE-2023-34362 · MITRE T1190 / T1505.003',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Chaining `/guestaccess.aspx` & `/moveitisapi/moveitisapi.dll` for Unauthenticated SQL Injection (CVE-2023-34362)',
        storyAnalogy:
          'First the attacker grabs a blank guest session at `/guestaccess.aspx`, then sends custom `X-siLock-SessVar` headers to `/moveitisapi/moveitisapi.dll` that break out of the SQL query string and rewrite the database.',
        simpleExplanation:
          'As reconstructed by Huntress and Rapid7, the attacker first sends HTTP requests to /api/v1/token and /guestaccess.aspx (creating a valid unauthenticated guest session record in MOVEit’s database), and then sends an HTTPS POST request to /moveitisapi/moveitisapi.dll?action=m2 (a native C++ ISAPI extension that strips and forwards custom X-siLock-SessVar headers to the internal ASP.NET handler SILMachine2.aspx — which concatenates those values directly into SQL queries without parameterization, triggering CVE-2023-34362).',
        howItWorksInPractice:
          'Why go through moveitisapi.dll instead of calling SILMachine2.aspx directly? Because MOVEit blocks external clients from passing sensitive session variables directly to SILMachine2.aspx, whereas the trusted moveitisapi.dll proxy passes X-siLock-SessVar headers right through.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the `/guestaccess.aspx` + `/moveitisapi/moveitisapi.dll` requests from Node ① to Node ②/③ (MOVEit IIS Server), and ⇠#1.2 executes the injected SQL statement.',
        detectionAndEvidence:
          'Documented by Huntress & Mandiant: IIS W3SVC logs showing `POST /guestaccess.aspx` immediately followed by `POST /moveitisapi/moveitisapi.dll action=m2`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1505.003',
        plainTitle: 'Injecting a .NET `BinaryFormatter` Gadget into the Session Table to Drop `human2.aspx` (LEMURLOOT)',
        storyAnalogy:
          'Using their SQL injection pen, the attacker writes a booby-trapped serialized .NET object into the database’s `activesessions` table. When MOVEit reads that session row back into memory, the .NET `BinaryFormatter` runs the attacker’s code and writes `human2.aspx` into the web root.',
        simpleExplanation:
          'Because the MOVEit database server often runs without xp_cmdshell or direct OS shell privileges, the attacker uses their SQL injection primitive to UPDATE the activesessions table with a Base64-encoded .NET BinaryFormatter gadget chain (an insecure deserialization payload that automatically executes arbitrary C# code the moment MOVEit’s w3wp.exe process reads and deserializes the session row from the database). That in-memory payload writes the LEMURLOOT webshell to C:\\MOVEitTransfer\\wwwroot\\human2.aspx (named human2.aspx to blend in with MOVEit’s legitimate human.aspx login page).',
        howItWorksInPractice:
          'The moment the attacker sends their first HTTP request to /human2.aspx, IIS’s worker process (w3wp.exe) automatically invokes the .NET C# compiler (csc.exe) to compile human2.aspx into a DLL inside Temporary ASP.NET Files—leaving a high-confidence Sysmon EventID 1 artifact.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ deserializes the session gadget and spawns `csc.exe` to compile `human2.aspx`, with ⇠#2.2 confirming webshell readiness.',
        detectionAndEvidence:
          'Documented in CISA AA23-158A & Huntress: Sysmon EventID 1 (`w3wp.exe` spawning `csc.exe` for `human2.cmdline`) and EventID 11 (`C:\\MOVEitTransfer\\wwwroot\\human2.aspx`).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Authenticating to `human2.aspx` via `X-siLock-Comment` to Exfiltrate Azure Blob Keys & Files',
        storyAnalogy:
          'To keep other hackers or security scanners from using their `human2.aspx` webshell, CL0P programmed it to return a harmless blank page unless the request includes a secret UUID password inside the `X-siLock-Comment` header.',
        simpleExplanation:
          'As Mandiant documented in their analysis of LEMURLOOT, the attacker sends HTTPS requests to /human2.aspx carrying a 36-character secret password inside the HTTP header X-siLock-Comment (so anyone browsing to /human2.aspx without that exact header receives an empty response) along with command selector headers X-siLock-Step1, X-siLock-Step2, and X-siLock-Step3 (where Step1: -1 queries the MySQL/MSSQL database for all stored files and institutions, reads HKLM\\SOFTWARE\\Standard Networks\\siLock to steal AzureAccountName and AzureAccountKey cloud credentials, and streams GZip-compressed enterprise files back to the attacker).',
        howItWorksInPractice:
          'Sending X-siLock-Step1: -2 instructs LEMURLOOT to create or delete a rogue administrator account named "HealthCheck Service" so the attacker can erase their session traces after exfiltration.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ queries Node ⑤ (MOVEit SQL DB & Azure Blob Storage) from Node ④ (`human2.aspx`), while Node ⑥ (SIEM) alerts on `human2.aspx` traffic.',
        detectionAndEvidence:
          'Documented by Mandiant & CISA AA23-158A: HTTP requests to `/human2.aspx` with `X-siLock-Comment` and `X-siLock-Step1` headers.',
      },
    ],
  },

  'openssh-regreSSHion-cve-2024-6387': {
    scenarioId: 'openssh-regreSSHion-cve-2024-6387',
    briefing: {
      headline: 'Scenario Briefing: OpenSSH "regreSSHion" (CVE-2024-6387) — Unauthenticated SIGALRM Race Condition to Root RCE',
      storyAnalogy:
        'Imagine a bank accountant (`sshd` main thread) who is in the middle of erasing and rearranging pages inside the master ledger (`glibc free()`). Suddenly, a 120-second kitchen timer (`LoginGraceTime SIGALRM`) rings! The accountant freezes mid-sentence with the ledger pages half-torn, and an emergency clerk (`grace_alarm_handler -> sigdie`) rushes in to write a "Visitor Timed Out!" note in the logbook (`syslog()`). However, writing that note requires grabbing a brand-new 320-byte sheet of paper (`fopen("/etc/localtime") -> malloc(320)`) from the exact same half-torn ledger! By timing their packets to the microsecond, the attacker tricks the emergency clerk into grabbing a rigged page that redirects the bank’s instructions (`_IO_wfile_jumps`) to run the attacker’s code as `root`.',
      plainSummary:
        'Discovered by the Qualys Threat Research Unit (July 2024), "regreSSHion" (CVE-2024-6387) is an unauthenticated remote code execution flaw in OpenSSH’s server (`sshd` versions 8.5p1–9.7p1) on glibc-based Linux systems. An accidental October 2020 refactoring removed `#ifdef DO_LOG_SAFE_IN_SIGHAND` from `sigdie()`, reintroducing a 2006 bug (CVE-2006-5051). When a client fails to log in within `LoginGraceTime` (120 seconds), `sshd`’s `SIGALRM` signal handler asynchronously calls `syslog()`, which invokes async-signal-unsafe glibc `malloc()`/`free()` routines—allowing an attacker who interrupts an in-progress `free()` call to corrupt glibc `_IO_FILE` vtable structures and gain `root` RCE.',
      diagramTopologySummary:
        'On the diagram: Node ① (Parallel SSH Race Client) sends heap-grooming packets to Node ②/③ (Linux OpenSSH Server `:22`). When `LoginGraceTime` expires, Node ④ (`SIGALRM -> syslog()` Race Handler) corrupts the glibc heap arena and overwrites `_IO_FILE` vtables on Node ⑤ (Pre-Auth Root RCE), detected via timeout floods on Node ⑥ (SIEM).',
      documentedAdvisory: 'Qualys TRU regreSSHion Advisory · OpenSSH 9.8p1 Security Advisory · CVE-2024-6387 · MITRE T1190 / T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Grooming the glibc Heap via SSH Public-Key Packets Before `LoginGraceTime` (120s) Expires',
        storyAnalogy:
          'Before the 120-second `LoginGraceTime` stopwatch hits zero, the attacker sends a carefully choreographed sequence of SSH public-key packets so the server’s memory ledger (`glibc main_arena`) is lined up with alternating 4 KB and 320-byte slots.',
        simpleExplanation:
          'To prepare the memory layout inside the privileged pre-authentication sshd child process, the attacker opens concurrent TCP/22 connections and sends a series of SSH2_MSG_USERAUTH_REQUEST packets containing crafted RSA/certificate public keys (allocating and freeing specific chunk sizes so glibc’s heap allocator arranges alternating 4 KB and 320-byte holes right before the 120-second LoginGraceTime timer expires).',
        howItWorksInPractice:
          'Why is this vulnerability called "regreSSHion"? Because OpenSSH originally fixed this exact signal-handler race in 2006 (CVE-2006-5051) by adding #ifdef DO_LOG_SAFE_IN_SIGHAND to sigdie(), but an unrelated code cleanup in October 2020 (OpenSSH 8.5p1) accidentally deleted that #ifdef guard.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the heap-grooming SSH auth packets from Node ① to Node ②/③ (Linux `sshd` Server), and ⇠#1.2 arms the 120s `LoginGraceTime` alarm.',
        detectionAndEvidence:
          'Documented by Qualys TRU & CISA: High-rate bursts of `Timeout before authentication for <IP>` in `/var/log/auth.log` across thousands of connections.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Interrupting `free()` with `SIGALRM` & Calling Async-Signal-Unsafe `syslog()` (CVE-2024-6387)',
        storyAnalogy:
          'The attacker sends one final packet timed so that the 120-second `SIGALRM` bell rings while `sshd` is halfway through `free()`. The alarm handler calls `syslog()`, which calls `fopen("/etc/localtime")` -> `malloc(320)` on the half-updated heap pointers.',
        simpleExplanation:
          'The attacker times their final packet so that when the kernel delivers SIGALRM (signal 14 — triggered when LoginGraceTime reaches 120 seconds), the main sshd thread is halfway through glibc’s _int_free() function (after modifying a heap chunk’s size metadata, but before updating the bin’s forward/backward pointers). The asynchronous signal handler grace_alarm_handler() calls sigdie("Timeout before authentication..."), which calls syslog() (an async-signal-unsafe C library function that internally calls __tzfile_read() -> fopen("/etc/localtime") -> malloc(320), causing glibc to allocate a 320-byte FILE structure overlapping the attacker’s packet buffer in memory).',
        howItWorksInPractice:
          'Why wasn’t OpenBSD vulnerable to CVE-2024-6387? Because OpenBSD’s syslog_r() implementation is explicitly designed to be async-signal-safe and never calls malloc() or fopen(), whereas Linux’s glibc syslog() dynamically allocates heap memory.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers `grace_alarm_handler -> sigdie -> syslog()` inside Node ④, and ⇠#2.2 allocates the overlapping 320-byte `_IO_FILE` chunk.',
        detectionAndEvidence:
          'Documented by Qualys TRU: `sshd` child processes crashing with `SIGABRT` / `SIGSEGV` in `libc.so.6` during unsuccessful race attempts.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Hijacking glibc `_IO_FILE` Vtables (`_IO_wfile_jumps`) for Un-Sandboxed Root RCE',
        storyAnalogy:
          'Because `fopen("/etc/localtime")` placed its 320-byte `FILE` control sheet right on top of the attacker’s buffer, the attacker overwrites the sheet’s function table (`_IO_wfile_jumps`) so that reading the timezone file executes `/bin/sh` as `root`.',
        simpleExplanation:
          'Because the 320-byte _IO_FILE structure allocated by fopen("/etc/localtime") sits inside memory controlled by the attacker’s SSH packet, the attacker crafts fake _wide_data and _vtable_offset fields pointing to glibc’s internal _IO_wfile_jumps vtable (redirecting the stream’s underflow function _IO_wfile_underflow to an arbitrary code pointer). The moment __tzfile_read() tries to read the timezone file via __uflow(), execution jumps into the attacker’s payload running inside the privileged pre-authentication sshd process (with full root UID 0 privileges, completely outside OpenSSH’s unprivileged network sandbox).',
        howItWorksInPractice:
          'Although winning the ASLR + timing race takes ~10,000 connections (roughly 3 to 6 hours against default MaxStartups), every failed attempt simply closes a child process while the master sshd daemon automatically forks fresh children.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ dispatches `_IO_wfile_jumps` on Node ⑤ (Pre-Auth Root Execution) while Node ⑥ (SIEM) alerts on the timeout flood and `sshd` child shell.',
        detectionAndEvidence:
          'Documented by Qualys TRU & CISA: Auditd `SYSCALL execve` from `sshd` with `uid=0` following repeated `Timeout before authentication` events.',
      },
    ],
  },

  'fortra-goanywhere-mft-cve-2023-0669-cl0p': {
    scenarioId: 'fortra-goanywhere-mft-cve-2023-0669-cl0p',
    briefing: {
      headline: 'Scenario Briefing: Fortra GoAnywhere MFT Zero-Day (CVE-2023-0669) — Pre-Auth LicenseServlet Deserialization RCE',
      storyAnalogy:
        'Imagine a software vault (`GoAnywhere MFT`) that has a special mail slot (`/goanywhere/lic/accept`) reserved for receiving encrypted license renewals from the manufacturer. To make sure only "official" license files are opened, the mail slot requires the package (`bundle`) to be locked with an AES cipher (`$2`). However, the developer hardcoded the exact AES password (`"go@nywhereLicenseP@$$w0rd"`) right inside the public software binary that every customer downloads! Anyone who reads the binary can extract that password, lock a booby-trapped Java package (`CommonsBeanutils1` gadget chain) with the official AES key, drop it into `/goanywhere/lic/accept` without logging in, and watch the server unlock and detonate it as `SYSTEM`.',
      plainSummary:
        'Synthesizing Horizon3.ai’s cryptographic root-cause analysis, Huntress Labs’ incident response forensics, and Mandiant / CISA advisories (February 2023), CVE-2023-0669 is the pre-authentication Java deserialization zero-day exploited by the CL0P ransomware group (TA505 / FIN11) against 130+ Fortra GoAnywhere MFT servers. Because `LicenseResponseServlet` (`/goanywhere/lic/accept`) decrypted incoming `bundle` parameters using a hardcoded static AES-128-CBC key and passed the plaintext directly to `ObjectInputStream.readObject()`, attackers sent a `ysoserial` `CommonsBeanutils1` gadget chain to execute `SYSTEM` commands and deploy `TrueBot` and `Cobalt Strike`.',
      diagramTopologySummary:
        'On the diagram: Node ① (CL0P / TA505 Operator) sends the AES-encrypted `bundle=...$2` POST request to Node ②/③ (GoAnywhere MFT Server `/goanywhere/lic/accept`). Node ④ (`CommonsBeanutils1` Deserializer inside `tomcat9.exe`) spawns `cmd.exe`/`powershell.exe` to deploy Node ⑤ (`TrueBot` & `Cobalt Strike`), detected via `goanywhere.log` stack traces on Node ⑥ (SIEM).',
      documentedAdvisory: 'CISA KEV CVE-2023-0669 · Huntress, Mandiant (FIN11) & Horizon3.ai Analysis · MITRE ATT&CK T1190 / T1059',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Encrypting a Malicious Java Bundle with GoAnywhere’s Hardcoded "$2" AES Key (CVE-2023-0669)',
        storyAnalogy:
          'Because the AES key `"go@nywhereLicenseP@$$w0rd"` is hardcoded inside `LicenseResponseServlet`, the attacker uses that exact key to encrypt their malicious Java object, adds `$2` to the end, and POSTs it to `/goanywhere/lic/accept` without logging in.',
        simpleExplanation:
          'As reverse-engineered by Horizon3.ai, GoAnywhere MFT’s LicenseResponseServlet (mapped to /goanywhere/lic/accept and reachable without authentication) accepts a POST parameter named bundle. When the bundle string ends with "$2", the server decrypts it using AES/CBC/PKCS5Padding with a static 16-byte IV ("AES/CBC/PKCS5Pad") and a key derived from the hardcoded password "go@nywhereLicenseP@$$w0rd" (meaning any attacker on the internet can encrypt an arbitrary payload with that exact hardcoded key so the server treats it as a trusted license bundle — CVE-2023-0669).',
        howItWorksInPractice:
          'Encrypting a serialized Java object does not provide authentication if the encryption key is hardcoded inside the client/server software binary itself.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `POST /goanywhere/lic/accept (bundle=...$2)` from Node ① to Node ②/③ (GoAnywhere Tomcat Server), and ⇠#1.2 decrypts the bundle in memory.',
        detectionAndEvidence:
          'Documented by Huntress & Suricata SID 2043881: Unauthenticated `POST /goanywhere/lic/accept` requests on TCP port 8000/8001.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.003',
        plainTitle: 'Triggering the `CommonsBeanutils1` Gadget Chain in `ObjectInputStream.readObject()`',
        storyAnalogy:
          'Once decrypted, the server hands the bundle to Java’s `ObjectInputStream.readObject()`. Inside sits a `PriorityQueue` that automatically sorts its items on arrival—tricking `BeanComparator` into loading and running the attacker’s `TemplatesImpl` Java bytecode.',
        simpleExplanation:
          'After decrypting and Base64-decoding the bundle, LicenseTools.unserialize() passes the raw bytes into Java’s ObjectInputStream.readObject(). The attacker supplies a ysoserial CommonsBeanutils1 gadget chain (a chain of standard Java classes—java.util.PriorityQueue and org.apache.commons.beanutils.BeanComparator—already present in GoAnywhere’s classpath that automatically invokes TemplatesImpl.newTransformer() during deserialization, loading attacker-supplied Java bytecode in memory and spawning cmd.exe / powershell.exe as NT AUTHORITY\\SYSTEM).',
        howItWorksInPractice:
          'As Huntress discovered, when the gadget chain finishes executing its payload inside readObject(), it throws a java.lang.reflect.InvocationTargetException that GoAnywhere writes directly into userdata/logs/goanywhere.log—giving defenders a forensic timestamp of every exploit attempt.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ (`CommonsBeanutils1` Deserializer) executes the `TemplatesImpl` translet and spawns `cmd.exe`, with ⇠#2.2 logging `InvocationTargetException`.',
        detectionAndEvidence:
          'Documented by Huntress: `BeanComparator.compare` & `PriorityQueue.readObject` stack trace in `userdata/logs/goanywhere.log` paired with `tomcat9.exe` spawning `cmd.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1219',
        plainTitle: 'Deploying TrueBot (`acl.dll`), Cobalt Strike & Exfiltrating MFT Customer Repositories',
        storyAnalogy:
          'Now running as `SYSTEM` inside the file-transfer server, the CL0P operators drop their **TrueBot** loader (`rundll32.exe acl.dll,Menu`) and **Cobalt Strike** to siphon off every sensitive file stored by the company’s customers.',
        simpleExplanation:
          'As documented by Mandiant (FIN11 / TA505) and Huntress, the initial PowerShell stager downloads and executes TrueBot (also tracked as Silence.Downloader, launched via rundll32.exe C:\\ProgramData\\acl.dll,Menu), installs NetSupport Manager RAT and Cobalt Strike beacons for redundant access, and exfiltrates sensitive customer files stored inside GoAnywhere MFT’s transfer directories.',
        howItWorksInPractice:
          'By targeting Managed File Transfer (MFT) appliances like GoAnywhere and MOVEit, CL0P bypassed endpoint EDR on user laptops and went straight to the central server where organizations store unencrypted financial, healthcare, and HR batch files.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ deploys Node ⑤ (`TrueBot` & `Cobalt Strike`) and exfiltrates MFT data while Node ⑥ (SIEM) correlates the child processes.',
        detectionAndEvidence:
          'Documented by Mandiant & CISA: `tomcat9.exe` -> `cmd.exe` -> `powershell.exe` -> `rundll32.exe` loading unsigned DLLs from `C:\\ProgramData\\`.',
      },
    ],
  },

  '3cx-desktopapp-supply-chain-lazarus': {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    briefing: {
      headline: 'Scenario Briefing: 3CXDesktopApp Supply Chain Attack (CVE-2023-29059) — Trojanized ffmpeg.dll, GitHub .ico Dead-Drop & Gopuram',
      storyAnalogy:
        'Imagine a thief (Lazarus Group) who wants to break into a corporate phone system company (`3CX`). First, they poison an older trading program (`X_TRADER`) that a 3CX software engineer happens to install on their computer; that gives the thief access to 3CX’s official software factory! Inside the factory, the thief swaps out one helper library (`ffmpeg.dll`) inside the official `3CXDesktopApp` installer before the factory stamps its genuine digital signature on the package. When thousands of companies install the update, `3CXDesktopApp.exe` loads the rigged `ffmpeg.dll`, which reads secret encrypted instructions hidden after a `0xFEEDFACE` bookmark inside a neighbor file (`d3dcompiler_47.dll`), checks innocent-looking icon files (`icon1.ico`) on GitHub to find the active command server, and steals browser passwords (`ICONICSTEALER`) or plants the **Gopuram** spyware!',
      plainSummary:
        'Synthesizing CrowdStrike (Labyrinth Chollima), Kaspersky GReAT (Gopuram), and Mandiant (UNC4736) analyses (March–April 2023), CVE-2023-29059 ("SmoothOperator") is a cascading supply chain compromise where North Korean threat actors trojanized the official Windows and macOS builds of `3CXDesktopApp` (versions 18.12.407 and 18.12.416). When the validly signed `3CXDesktopApp.exe` starts, it sideloads a trojanized `ffmpeg.dll`, which reads an RC4-encrypted shellcode blob embedded after marker `0xFEEDFACE` inside `d3dcompiler_47.dll`, fetches AES-encrypted C2 URLs appended to `.ico` files on GitHub (`IconStorages`), and deploys `ICONICSTEALER` or the `Gopuram` backdoor in memory.',
      diagramTopologySummary:
        'On the diagram: Node ① (3CX Update Server & GitHub `IconStorages` Dead-Drop) delivers the signed installer to Node ②/③ (Enterprise Workstation running `3CXDesktopApp.exe`). Node ④ (`ffmpeg.dll` & `d3dcompiler_47.dll` `0xFEEDFACE` Loader) decrypts the stage-2 shellcode, resolves C2 from GitHub `.ico` files, and loads Node ⑤ (`ICONICSTEALER` & `Gopuram` in memory), alerted by Node ⑥ (EDR / SIEM).',
      documentedAdvisory: 'CrowdStrike Labyrinth Chollima · Kaspersky GReAT Gopuram & Mandiant UNC4736 · CVE-2023-29059 · MITRE T1195.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Sideloading Trojanized `ffmpeg.dll` & Decrypting the `0xFEEDFACE` Blob in `d3dcompiler_47.dll`',
        storyAnalogy:
          'When the user opens the validly signed `3CXDesktopApp.exe`, it automatically loads `ffmpeg.dll` from its own folder. The rigged `ffmpeg.dll` opens `d3dcompiler_47.dll`, flips to page bookmark `FE ED FA CE`, and decrypts the hidden shellcode using RC4 key `"3jB(2bsG#@c7"`.',
        simpleExplanation:
          'When an employee launches the legitimately signed 3CXDesktopApp.exe softphone client, Windows loads the co-located library ffmpeg.dll (which was trojanized inside 3CX’s build pipeline — CVE-2023-29059). Inside ffmpeg.dll, a malicious initialization thread creates the event AVMonitorEvent, opens the neighboring file d3dcompiler_47.dll (a legitimate-looking Direct3D shader library whose valid digital signature was stripped so an encrypted payload could be appended after the 4-byte magic marker 0xFEEDFACE), and decrypts that payload directly into RWX memory using the RC4 stream cipher with hardcoded key "3jB(2bsG#@c7".',
        howItWorksInPractice:
          'Why split the malware across three files (3CXDesktopApp.exe + ffmpeg.dll + d3dcompiler_47.dll)? Because 3CXDesktopApp.exe keeps its valid 3CX digital signature, ffmpeg.dll contains only a tiny RC4 reader with no C2 URLs, and the encrypted shellcode sits inert inside d3dcompiler_47.dll.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (`3CXDesktopApp.exe`) sideloading Node ④ (`ffmpeg.dll` & `d3dcompiler_47.dll`), and ⇠#1.2 decrypts the `0xFEEDFACE` RC4 shellcode into memory.',
        detectionAndEvidence:
          'Documented by CrowdStrike, Mandiant & Kaspersky: Sysmon EventID 7 loading unsigned `ffmpeg.dll` (`SHA256: 7986bbae...`) and `0xFEEDFACE` marker in `d3dcompiler_47.dll`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1102.001',
        plainTitle: 'Fetching `icon1.ico`..`icon14.ico` from GitHub to Decrypt the Active C2 Domain',
        storyAnalogy:
          'Instead of hardcoding a C2 server address that defenders could block on Day 1, the malware downloads normal-looking `.ico` icon files from a public GitHub repository (`IconStorages`) and reads an AES-encrypted web address glued to the very end of the icon file.',
        simpleExplanation:
          'Once decrypted in memory, the stage-2 shellcode uses a Dead Drop Resolver (MITRE T1102.001 — connecting to a trusted public service like GitHub so corporate firewalls allow the traffic) by sending an HTTPS GET request to raw.githubusercontent.com/IconStorages/images/main/icon1.ico (through icon14.ico). At the very end of the valid icon image sits an appended Base64 string prefixed with "$" (which the malware extracts and decrypts using AES-GCM to reveal the real command-and-control URL, such as https://akamaicontainer.com/gl or https://msstorageboxes.com/eb).',
        howItWorksInPractice:
          'Even after GitHub took down the IconStorages repository, the shellcode also contained a fallback list of hardcoded C2 domains disguised to look like Akamai, Azure, and Microsoft storage services.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ fetches `icon*.ico` from Node ① (GitHub `IconStorages` Dead-Drop) to Node ④, and ⇠#2.2 returns the AES-GCM encrypted C2 string.',
        detectionAndEvidence:
          'Documented by SentinelOne, Huntress & Mandiant: `3CXDesktopApp.exe` querying `raw.githubusercontent.com/IconStorages/*` or `akamaicontainer.com`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1555.003',
        plainTitle: 'Executing In-Memory `ICONICSTEALER` & Deploying Kaspersky’s `Gopuram` Backdoor',
        storyAnalogy:
          'The C2 server sends back a memory-only thief (**ICONICSTEALER**) that raids Chrome, Edge, and Brave browser databases—and if the victim works at a cryptocurrency exchange, the operator sends in the heavy-duty **Gopuram** espionage backdoor.',
        simpleExplanation:
          'Connecting to the decrypted C2 URL with an encrypted "tutma=" cookie, the loader downloads and reflectively loads a third-stage DLL strictly in memory: ICONICSTEALER (an information stealer documented by Mandiant and CrowdStrike that enumerates the workstation and reads SQLite History and Login Data files from Google Chrome, Microsoft Edge, Brave, and Mozilla Firefox). Furthermore, as Kaspersky GReAT uncovered, on high-value cryptocurrency and financial victims the threat actor deployed Gopuram (a sophisticated modular C2 backdoor used exclusively by the Lazarus group).',
        howItWorksInPractice:
          'Mandiant subsequently traced how the 3CX supply chain attack itself began: Lazarus had earlier trojanized the website installer for Trading Technologies’ X_TRADER software, which an employee at 3CX downloaded—creating a supply-chain-to-supply-chain cascade.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes Node ⑤ (`ICONICSTEALER` & `Gopuram`) inside `3CXDesktopApp.exe` while Node ⑥ (EDR / SIEM) flags the browser database reads and C2 beacon.',
        detectionAndEvidence:
          'Documented by CrowdStrike, Mandiant & Kaspersky GReAT: `3CXDesktopApp.exe` reading Chrome/Edge `User Data\\Default\\History` and loading `Gopuram` in memory.',
      },
    ],
  },
};
