import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
