import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
