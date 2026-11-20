import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a Linux vault protected by two distinct door-check systems: a personal spare-key ring hanging inside each employee locker and a central badge-verification office handling every login attempt. An intruder quietly slips their own public key onto an employee spare-key ring and attempts to swap a rigged verification module into the central badge office, while kernel file watches, package integrity seals, and login fingerprint logs stitch together an airtight attribution trail.',
      storyMappings: [
        {
          storyTerm: 'Slipping a spare key onto an employee personal key ring',
          technicalTerm: 'Appending attacker key to ~/.ssh/authorized_keys caught by Linux auditd file-watch rules',
          tone: 'amber',
        },
        {
          storyTerm: 'Swapping a rigged module into the central badge-verification office',
          technicalTerm: 'Trojanized PAM shared object in /lib64/security/ exposed by rpm -Va / debsums verification',
          tone: 'sky',
        },
        {
          storyTerm: 'Door log stamping the exact key fingerprint on every entry',
          technicalTerm: '/var/log/secure Accepted publickey SHA256 fingerprint correlation',
          tone: 'rose',
        },
        {
          storyTerm: 'Kernel watchman monitoring both spare rings and central locks',
          technicalTerm: 'auditd -w rules watching ~/.ssh/authorized_keys and /lib64/security/',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'To guarantee silent passwordless entry even if user passwords change, the intruder appends their own public key straight onto the target user authorized-keys sheet, instantly tripping the kernel file-watch sensor bolted onto that sheet.',
        storyMappings: [
          {
            storyTerm: 'User authorized-keys sheet',
            technicalTerm: '~/.ssh/authorized_keys allowing passwordless public-key SSH authentication',
            tone: 'amber',
          },
          {
            storyTerm: 'Kernel file-watch sensor bolted onto the sheet',
            technicalTerm: 'Linux auditd watch rule logging SYSCALL openat/write events with exact auid and exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Exact originating login badge preserved',
            technicalTerm: 'Immutable auditd auid (Audit User ID) tracing actions even after sudo/su elevation',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero password needed on future visits',
            technicalTerm: 'MITRE T1098.004 SSH Authorized Keys persistence',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Seeking deeper backdoor access that works for any account on the server, the intruder tampers with a shared authentication plugin inside the central badge office, immediately breaking the operating system official vendor package checksum seal.',
        storyMappings: [
          {
            storyTerm: 'Shared authentication plugin inside the central badge office',
            technicalTerm: 'Pluggable Authentication Module (PAM) library such as /lib64/security/pam_unix.so',
            tone: 'amber',
          },
          {
            storyTerm: 'Official vendor package checksum seal broken',
            technicalTerm: 'rpm -Va or debsums -c flagging modified MD5/SHA-256 digests (5 flag) on /lib64/security/*',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden universal master passphrase',
            technicalTerm: 'Backdoored PAM module accepting a hardcoded magic password or logging cleartext logins',
            tone: 'rose',
          },
          {
            storyTerm: 'Package-manager ground truth',
            technicalTerm: 'Comparing on-disk security libraries directly against cryptographically signed OS package DBs',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When the intruder returns later using their newly planted spare key, the front-door authentication diary stamps the exact cryptographic SHA-256 fingerprint of the key presented, allowing defenders to trace every compromised server across the fleet.',
        storyMappings: [
          {
            storyTerm: 'Front-door authentication diary',
            technicalTerm: '/var/log/secure or /var/log/auth.log recording sshd authentication records',
            tone: 'amber',
          },
          {
            storyTerm: 'Exact cryptographic fingerprint of the presented key',
            technicalTerm: 'Accepted publickey log entry printing exact SHA256:<fingerprint> and source IP',
            tone: 'sky',
          },
          {
            storyTerm: 'Tracing the exact same key across the fleet',
            technicalTerm: 'Hunting the attacker SSH key SHA256 fingerprint across all Linux servers in SIEM',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean containment across hosts',
            technicalTerm: 'Scrubbing unauthorized keys, reinstalling verified PAM packages, and auditing SSHD logs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
