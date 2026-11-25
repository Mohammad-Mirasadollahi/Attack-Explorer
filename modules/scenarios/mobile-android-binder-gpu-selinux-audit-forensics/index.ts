import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'mobile-android-binder-gpu-selinux-audit-forensics',
    title: 'Google Threat Analysis Group (TAG), Amnesty Tech & Android Security Bulletin — Android Kernel Binder/GPU & SELinux Audit Forensics',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1404',
    description:
      'Grounded in Google Threat Analysis Group (TAG) Predator/0-day reports, Android Security Bulletins (CVE-2023-4211 / CVE-2023-2136), and Amnesty Tech Android forensic methodology: mobile DFIR analysts inspect Android bugreport archives, logcat kernel ring buffers, SELinux avc: denied audit messages, and /proc/kallsyms / app_process64 execution artifacts.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Sandboxed Browser Renderer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Binder IPC / Mali GPU Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Android Linux Kernel & SELinux', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'adb bugreport & MVT Android', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/system/bin/app_process64', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Sandboxed isolated_app Renderer ioctl() Calls to /dev/mali0 or /dev/binder',
        narration:
          'A compromised Chrome renderer process running under the restricted u:r:isolated_app:s0 SELinux context invokes ioctl() system calls against /dev/mali0 (GPU driver) or /dev/binder to trigger a kernel use-after-free condition.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Privilege Escalation (T1404 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'adb bugreport ./android-bugreport.zip',
          'mvt-android check-bugreport --output ./mvt-android-out ./android-bugreport.zip',
        ],
        defenseMitigation:
          'Apply monthly Android Security Bulletin patches promptly and restrict untrusted isolated_app SELinux domains from opening direct GPU device nodes via seccomp-bpf filters.',
        logs: [
          {
            id: 'mob-and-1',
            timestamp: '08:40:12.019',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 16,
            ProcessName: 'privileged_proc',
            CommandLine: 'ioctl(/dev/mali0, KBASE_IOCTL_MEM_JIT_INIT) from u:r:isolated_app:s0',
            raw: 'auditd_selinux: type=1400 audit(1763282412.019:219): avc: denied { ioctl } for pid=18492 comm="CrRendererMain" path="/dev/mali0" dev="tmpfs" scontext=u:r:isolated_app:s0 tcontext=u:object_r:gpu_device:s0',
            parsedFields: {
              SourceSelinuxContext: 'u:r:isolated_app:s0 (Browser Renderer Sandbox)',
              TargetDeviceNode: '/dev/mali0 (GPU Kernel Driver)',
              AndroidBulletinRef: 'CVE-2023-4211',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: SELinux Enforcing State & Kernel task_struct Credential Overwrite Telemetry',
        narration:
          'Using arbitrary kernel read/write primitives, the exploit zeroes out the process cred->uid/gid fields and patches selinux_state.enforcing in kernel memory, leaving diagnostic anomalies in dmesg / last_kmsg and auditd state transition logs.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Impair Defenses: Disable or Modify Tools / SELinux)',
        technicalCommands: [
          'grep -E "avc:|selinux_state|enforcing" bugreport-dumpstate_board.txt',
        ],
        defenseMitigation:
          'Leverage hardware-backed Hypervisor Kernel Data Protection (KDP / RKP) to make cred structures and selinux_state read-only in physical RAM.',
        logs: [
          {
            id: 'mob-and-2',
            timestamp: '08:40:13.450',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1404,
            ProcessName: 'kworker',
            CommandLine: 'dmesg | grep -E "selinux|avc: permissive"',
            raw: 'kernel_log: [ 4120.450112] audit: type=1404 audit(1763282413.450:220): enforcing=0 old_enforcing=1 auid=4294967295 ses=4294967295',
            parsedFields: {
              AuditEventType: 'MAC_STATUS (1404)',
              SelinuxTransition: 'old_enforcing=1 -> enforcing=0 (Runtime Kernel Patch)',
              ForensicSource: 'Android bugreport kernel ring buffer',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Privileged Dalvik/ART Runtime Spawn via /system/bin/app_process64',
        narration:
          'To execute a resident Java/DEX spyware module with root/system privileges without installing a visible APK in PackageManager, the loader spawns /system/bin/app_process64 loading a hidden DEX archive from /data/local/tmp/ or memfd.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1623 - Command and Scripting Interpreter: Unix Shell / app_process64)',
        technicalCommands: [
          'ps -A -o USER,PID,PPID,LABEL,NAME,ARGS | grep app_process64',
        ],
        defenseMitigation:
          'Inspect running processes in Android bugreport dumps for /system/bin/app_process64 instances whose parent PID is not zygote64 or that set CLASSPATH to /data/local/tmp/.',
        logs: [
          {
            id: 'mob-and-3',
            timestamp: '08:40:16.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'app_process64',
            CommandLine: 'CLASSPATH=/data/local/tmp/.cache.jar /system/bin/app_process64 /system/bin com.core.service.Main',
            raw: 'bugreport_ps: USER=root PID=18904 PPID=1 LABEL=u:r:su:s0 ARGS="/system/bin/app_process64 /system/bin com.core.service.Main"',
            parsedFields: {
              HostBinary: '/system/bin/app_process64',
              LoadedDexPath: 'CLASSPATH=/data/local/tmp/.cache.jar',
              ParentPidAnomaly: 'PPID=1 (init) instead of zygote64',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a strictly walled glass playroom inside a modern smartphone where untrusted web pages are allowed to draw pictures but cannot touch the building’s master wiring. An intruder slips a rigged drawing request through the graphics pass-through slot to break the lock on the central control room, turns off the building’s master safety guardrails, and starts a silent full-privilege worker directly from memory without ever registering an app nameplate on the front lobby directory.',
      storyMappings: [
        {
          storyTerm: 'Walled Glass Playroom',
          technicalTerm: 'Sandboxed Chrome Renderer Context (u:r:isolated_app:s0)',
          tone: 'sky',
        },
        {
          storyTerm: 'Graphics Pass-Through Slot',
          technicalTerm: 'ioctl() Calls to /dev/mali0 GPU Driver or /dev/binder (CVE-2023-4211)',
          tone: 'amber',
        },
        {
          storyTerm: 'Turning Off Safety Guardrails',
          technicalTerm: 'Zeroing cred->uid/gid & Patching selinux_state.enforcing in Kernel',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlisted Full-Privilege Worker',
          technicalTerm: '/system/bin/app_process64 Loading Hidden DEX Without PackageManager APK',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Trapped inside the walled glass playroom, the compromised web viewer repeatedly shoves malformed control tokens through the graphics and intercom pass-through slots until the central control room accidentally hands back a freed memory locker it is still using.',
        storyMappings: [
          {
            storyTerm: 'Walled Glass Playroom',
            technicalTerm: 'Restricted SELinux Context u:r:isolated_app:s0',
            tone: 'sky',
          },
          {
            storyTerm: 'Graphics & Intercom Slots',
            technicalTerm: 'Kernel Device Nodes /dev/mali0 (GPU) and /dev/binder',
            tone: 'amber',
          },
          {
            storyTerm: 'Malformed Control Tokens',
            technicalTerm: 'Crafted ioctl() Syscalls Triggering Kernel Use-After-Free',
            tone: 'rose',
          },
          {
            storyTerm: 'Playroom Boundary Alarms',
            technicalTerm: 'Android logcat & SELinux avc: denied Audit Messages',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using that stolen control-room reach, the intruder erases their visitor wristband down to master superintendent zero and flips the building’s mandatory enforcement breaker from strict lock to silent permissive mode, leaving a telltale breaker-flip stamp in the engineering ring log.',
        storyMappings: [
          {
            storyTerm: 'Erasing Visitor Wristband to Zero',
            technicalTerm: 'Overwriting Kernel task_struct cred->uid and cred->gid to 0 (root)',
            tone: 'rose',
          },
          {
            storyTerm: 'Flipping Enforcement Breaker',
            technicalTerm: 'Patching selinux_state.enforcing from 1 (Enforcing) to 0 (Permissive)',
            tone: 'amber',
          },
          {
            storyTerm: 'Engineering Ring Log',
            technicalTerm: 'Android dmesg, last_kmsg & Audit Event MAC_STATUS (1404)',
            tone: 'sky',
          },
          {
            storyTerm: 'Security State Verification',
            technicalTerm: 'Bugreport Archive Inspection for Unexpected SELinux Transitions',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now holding master superintendent authority, the intruder avoids posting any visible shop sign in the phone’s main app directory and instead launches the building’s own built-in runtime engine pointing directly at a hidden blueprint stashed in a temporary closet.',
        storyMappings: [
          {
            storyTerm: 'Skipping Front App Directory',
            technicalTerm: 'Evading Android PackageManager Visible APK Installation',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-In Runtime Engine',
            technicalTerm: 'Privileged Execution of /system/bin/app_process64',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden Temporary Blueprint',
            technicalTerm: 'CLASSPATH Pointing to Hidden DEX Archive in /data/local/tmp/ or memfd',
            tone: 'rose',
          },
          {
            storyTerm: 'Mobile DFIR Inspection',
            technicalTerm: 'Amnesty Tech Bugreport & Process Lineage Audit of app_process64',
            tone: 'emerald',
          },
        ],
      },
    },
  };
