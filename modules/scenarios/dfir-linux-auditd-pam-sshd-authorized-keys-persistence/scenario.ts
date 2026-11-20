import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-linux-auditd-pam-sshd-authorized-keys-persistence',
    title: 'Red Hat, CISA & MITRE DFIR — Linux auditd SSH authorized_keys & PAM Module Persistence Forensics',
    category: 'MALWARE',
    mitreId: 'T1098.004',
    description:
      'Grounded in the Red Hat Enterprise Linux Security & Auditd Guide, CISA Linux Incident Response Guidance, and MITRE ATT&CK T1098.004 / T1556.003: an incident responder investigates unauthorized SSH key persistence and Pluggable Authentication Modules (PAM) tampering on a production Linux server by correlating Linux kernel auditd SYSCALL/PATH records (openat, write, chmod on ~/.ssh/authorized_keys and /lib64/security/pam_unix.so) with /var/log/secure and /var/log/auth.log Accepted publickey Fingerprints.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External SSH Client (:22)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'sshd Daemon (PAM Stack)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '~/.ssh/authorized_keys File', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Linux auditd & /var/log/secure', type: 'siem', status: 'normal' },
      { id: 'ad', label: '/lib64/security/pam_unix.so', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Linux Auditd File-Watch Trigger on ~/.ssh/authorized_keys Modification (SYSCALL openat)',
        narration:
          'When a compromised service process modifies /root/.ssh/authorized_keys with the O_WRONLY|O_CREAT|O_APPEND flags, the Linux kernel audit subsystem (configured with -w /root/.ssh -p wa -k ssh_persistence) emits correlated SYSCALL, CWD, and PATH records in /var/log/audit/audit.log capturing the exact process (exe), login UID (auid), effective UID (euid), and inode number.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Persistence (T1098.004 - Account Manipulation: SSH Authorized Keys)',
        technicalCommands: [
          'auditctl -w /root/.ssh -p wa -k ssh_persistence',
          'auditd SYSCALL Record: syscall=257 (openat) success=yes auid=1001 uid=0 euid=0 exe="/usr/bin/python3.11" key="ssh_persistence"',
          'auditd PATH Record: item=0 name="/root/.ssh/authorized_keys" inode=1310942 mode=0100600 nametype=NORMAL',
        ],
        defenseMitigation:
          'Configure immutable auditd watch rules (-w /root/.ssh -p wa -k ssh_keys and -w /etc/ssh/sshd_config -p wa -k sshd_config) and ship /var/log/audit/audit.log to a remote SIEM.',
        logs: [
          {
            id: 'dfir-linux-ssh-1',
            timestamp: '01:14:22.104',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 257,
            ProcessName: 'python3',
            CommandLine: 'python3.11 modifying /root/.ssh/authorized_keys (key=ssh_persistence)',
            raw: 'type=SYSCALL msg=audit(1762132462.104:4102): arch=c000003e syscall=257 success=yes exit=3 auid=1001 uid=0 euid=0 comm="python3" exe="/usr/bin/python3.11" key="ssh_persistence" | type=PATH msg=audit(1762132462.104:4102): item=0 name="/root/.ssh/authorized_keys" inode=1310942 mode=0100600 nametype=NORMAL',
            parsedFields: {
              AuditKey: 'ssh_persistence',
              Syscall: '257 (sys_openat with O_WRONLY|O_APPEND)',
              AuditLoginUid: 'auid=1001 (Pivoted User) -> euid=0 (root)',
              ModifiedPath: '/root/.ssh/authorized_keys (inode 1310942)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: PAM Shared Library Modification Detection in /lib64/security/ (rpm -Va & auditd)',
        narration:
          'To retain access even if SSH keys are rotated, the actor modifies /lib64/security/pam_unix.so inside the Pluggable Authentication Modules directory. During DFIR triage, running rpm -Va pam (or dpkg --verify libpam-modules) flags an S.5....T. (Size, MD5/SHA256 digest, and mtime mismatch) on /lib64/security/pam_unix.so alongside an auditd watch event on /lib64/security.',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1556.003 - Modify Authentication Process: Pluggable Authentication Modules)',
        technicalCommands: [
          'rpm -Va pam  # Output: S.5....T.    /usr/lib64/security/pam_unix.so',
          'auditctl -w /usr/lib64/security -p wa -k pam_tampering',
          'stat /usr/lib64/security/pam_unix.so  # Compares ctime (inode change time) against package install date',
        ],
        defenseMitigation:
          'Monitor /lib/security and /usr/lib64/security with File Integrity Monitoring (AIDE / auditd) and run periodic rpm -Va / dpkg --verify integrity checks against signed package databases.',
        logs: [
          {
            id: 'dfir-linux-ssh-2',
            timestamp: '01:15:04.880',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 82,
            ProcessName: 'cp',
            CommandLine: 'rpm -Va pam verification alert: S.5....T. /usr/lib64/security/pam_unix.so',
            raw: 'type=SYSCALL msg=audit(1762132504.880:4119): arch=c000003e syscall=82 (rename) success=yes auid=1001 uid=0 comm="mv" exe="/usr/bin/mv" key="pam_tampering" | type=PATH item=1 name="/usr/lib64/security/pam_unix.so" | rpm_verify="S.5....T. /usr/lib64/security/pam_unix.so"',
            parsedFields: {
              AuditKey: 'pam_tampering',
              RpmVerifyFlags: 'S.5....T. (File Size, Digest, and Timestamp Altered)',
              TamperedLibrary: '/usr/lib64/security/pam_unix.so',
              MitreTechnique: 'T1556.003 (PAM Authentication Modification)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Correlating /var/log/secure Accepted publickey SHA256 Fingerprint & USER_AUTH Auditd Events',
        narration:
          'When the external actor reconnects over TCP 22, sshd logs "Accepted publickey for root from 198.51.100.77 port 51922 ssh2: ED25519 SHA256:k9L2m..." in /var/log/secure (or /var/log/auth.log) and emits a Linux auditd type=USER_AUTH / type=USER_LOGIN record, allowing the responder to match the logged SHA256 fingerprint directly to the key line added in Stage 1.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.004 - Remote Services: SSH Public Key Correlation)',
        technicalCommands: [
          'ssh-keygen -lf /root/.ssh/authorized_keys  # Computes SHA256 fingerprint for every authorized key entry',
          'grep "Accepted publickey" /var/log/secure',
          'ausearch -m USER_AUTH,USER_LOGIN -sv yes',
        ],
        defenseMitigation:
          'Disable PermitRootLogin in /etc/ssh/sshd_config, enforce short-lived SSH certificates via a central CA instead of static authorized_keys files, and correlate ssh-keygen -lf fingerprints with /var/log/secure.',
        logs: [
          {
            id: 'dfir-linux-ssh-3',
            timestamp: '01:18:10.312',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 1100,
            ProcessName: 'sshd',
            CommandLine: 'sshd: root@pts/0 (Accepted publickey ED25519 SHA256:k9L2m8xPqR4vT1nZ...)',
            raw: 'Nov 03 01:18:10 prod-db01 sshd[18422]: Accepted publickey for root from 198.51.100.77 port 51922 ssh2: ED25519 SHA256:k9L2m8xPqR4vT1nZ0wXyB7cV5gH3jK | type=USER_LOGIN msg=audit(1762132690.312:4155): pid=18422 uid=0 auid=0 ses=94 acct="root" exe="/usr/sbin/sshd" addr=198.51.100.77 terminal=/dev/pts/0 res=success',
            parsedFields: {
              AuthLogEvent: 'Accepted publickey for root from 198.51.100.77',
              KeyFingerprint: 'ED25519 SHA256:k9L2m8xPqR4vT1nZ0wXyB7cV5gH3jK',
              AuditRecordType: 'USER_LOGIN (ses=94 res=success)',
              DaemonExecutable: '/usr/sbin/sshd',
            },
          },
        ],
      },
    ],
  };
