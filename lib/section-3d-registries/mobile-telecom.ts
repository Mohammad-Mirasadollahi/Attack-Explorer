import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for MOBILE_TELECOM_SPYWARE (5 scenarios).
 */
export const MOBILE_TELECOM_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "mobile-android-binder-gpu-selinux-audit-forensics": {
    "briefing": {
      "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
      "sectionKey": "briefing",
      "sceneKind": "mob-android-gpu-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1404",
      "title": "Android Kernel Binder/GPU & SELinux Audit Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a strictly walled glass playroom inside a modern smartphone where untrusted web pages are allowed to draw pictures but cannot touch the building’s master wiring. An intruder slips a rigged drawing request through the graphics pass-through slot to break the lock on the central control room, turns off the building’s master safety guardrails, and starts a silent full-privilege worker directly from memory without ever registering an app nameplate on the front lobby directory.",
      "technicalCue": "DEFENSE EVASION: Sandboxed isolated_app Renderer ioctl() Calls to /dev/mali0 or /dev/binder -> DEFENSE EVASION: SELinux Enforcing State & Kernel task_struct Credential Overwrite Telemetry -> EXECUTION: Privileged Dalvik/ART Runtime Spawn via /system/bin/app_process64",
      "storyMappings": [
        {
          "storyTerm": "Walled Glass Playroom",
          "technicalTerm": "Sandboxed Chrome Renderer Context (u:r:isolated_app:s0)",
          "tone": "sky"
        },
        {
          "storyTerm": "Graphics Pass-Through Slot",
          "technicalTerm": "ioctl() Calls to /dev/mali0 GPU Driver or /dev/binder (CVE-2023-4211)",
          "tone": "amber"
        },
        {
          "storyTerm": "Turning Off Safety Guardrails",
          "technicalTerm": "Zeroing cred->uid/gid & Patching selinux_state.enforcing in Kernel",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlisted Full-Privilege Worker",
          "technicalTerm": "/system/bin/app_process64 Loading Hidden DEX Without PackageManager APK",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "mob-android-gpu-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Walled Glass Playroom",
          "subtitle": "Sandboxed Chrome Renderer Context (u:r:isolated_app:s0)",
          "tone": "sky"
        },
        {
          "id": "mob-android-gpu-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Graphics Pass-Through Slot",
          "subtitle": "ioctl() Calls to /dev/mali0 GPU Driver or /dev/binder…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Pass-through",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Sandboxed isolated_app Renderer ioctl() Calls to /dev/mali0 or /dev/binder",
          "storyExcerpt": "Trapped inside the walled glass playroom, the compromised web viewer repeatedly shoves malformed control tokens through the graphics and intercom pass-through slots until the central control room…",
          "technicalParallel": "Under the hood, the observed step executes adb bugreport ./android-bugreport.zip (which executes the technical command / telemetry directive , adb bugreport ./android-bugreport.zip via System / Runtime…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Zero",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "SELinux Enforcing State & Kernel task_struct Credential Overwrite Telemetry",
          "storyExcerpt": "Using that stolen control-room reach, the intruder erases their visitor wristband down to master superintendent zero and flips the building’s mandatory enforcement breaker from strict lock to silent…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"avc:|selinux_state|enforcing\" bugreport-dumpstate_board.txt (which executes the technical command / telemetry directive , grep -E…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Now Any",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Privileged Dalvik/ART Runtime Spawn via /system/bin/app_process64",
          "storyExcerpt": "Now holding master superintendent authority, the intruder avoids posting any visible shop sign in the phone’s main app directory and instead launches the building’s own built-in runtime engine pointing…",
          "technicalParallel": "Under the hood, the observed step executes ps -A -o USER,PID,PPID,LABEL,NAME,ARGS | grep app_process64 (which executes the technical command / telemetry directive , ps -A -o USER,PID,PPID,LABEL,NAME,ARGS…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Playroom",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Wiring",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Guardrail Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
      "sectionKey": "step-1",
      "sceneKind": "mob-android-gpu-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Sandboxed isolated_app Renderer ioctl() Calls to /dev/mali0 or /dev/binder",
      "storyCue": "Trapped inside the walled glass playroom, the compromised web viewer repeatedly shoves malformed control tokens through the graphics and intercom pass-through slots until the central control room accidentally hands back a freed memory locker it is still using.",
      "technicalCue": "T1404 · DEFENSE EVASION — A compromised Chrome renderer process running under the restricted u:r:isolated_app:s0 SELinux context invokes ioctl() system calls against /dev/mali0 (GPU driver) or /dev/binder to trigger a…",
      "storyMappings": [
        {
          "storyTerm": "Walled Glass Playroom",
          "technicalTerm": "Restricted SELinux Context u:r:isolated_app:s0",
          "tone": "sky"
        },
        {
          "storyTerm": "Graphics & Intercom Slots",
          "technicalTerm": "Kernel Device Nodes /dev/mali0 (GPU) and /dev/binder",
          "tone": "amber"
        },
        {
          "storyTerm": "Malformed Control Tokens",
          "technicalTerm": "Crafted ioctl() Syscalls Triggering Kernel Use-After-Free",
          "tone": "rose"
        },
        {
          "storyTerm": "Playroom Boundary Alarms",
          "technicalTerm": "Android logcat & SELinux avc: denied Audit Messages",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-android-gpu-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Walled Glass Playroom",
          "subtitle": "Restricted SELinux Context u:r:isolated_app:s0",
          "tone": "sky"
        },
        {
          "id": "mob-android-gpu-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Graphics & Intercom Slots",
          "subtitle": "Kernel Device Nodes /dev/mali0 (GPU) and /dev/binder",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Pass-through",
          "stageTag": "STEP 01 · SETUP",
          "title": "Walled Glass Playroom",
          "storyExcerpt": "Trapped inside the walled glass playroom, the compromised web viewer repeatedly shoves malformed control tokens through the graphics and intercom pass-through slots until the central control…",
          "technicalParallel": "Under the hood, the observed step executes adb bugreport ./android-bugreport.zip (which executes the technical command / telemetry directive , adb bugreport ./android-bugreport.zip via System / Runtime…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Graphics & Intercom Slots",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses graphics & intercom slots to advance toward malformed control tokens.",
          "technicalParallel": "A compromised Chrome renderer process running under the restricted u:r:isolated_app:s0 SELinux context invokes ioctl() system calls against /dev/mali0 (GPU driver) or /dev/binder to trigger a kernel…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Web Pass-through",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Playroom Boundary Alarms",
          "storyExcerpt": "Behind the scenes, playroom boundary alarms captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 16 (recording SourceSelinuxContext=u:r:isolated_app:s0 , Browser Renderer Sandbox, TargetDeviceNode=/dev/mali0 , GPU Kernel Driver, AndroidBulletinRef=CVE-2023-4211 under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Playroom",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Wiring",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Guardrail Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1404"
    },
    "step-2": {
      "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
      "sectionKey": "step-2",
      "sceneKind": "mob-android-gpu-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "SELinux Enforcing State & Kernel task_struct Credential Overwrite Telemetry",
      "storyCue": "Using that stolen control-room reach, the intruder erases their visitor wristband down to master superintendent zero and flips the building’s mandatory enforcement breaker from strict lock to silent permissive mode, leaving a telltale breaker-flip stamp in the engineering ring log.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Using arbitrary kernel read/write primitives, the exploit zeroes out the process cred->uid/gid fields and patches selinux_state.enforcing in kernel memory, leaving diagnostic anomalies in dmesg…",
      "storyMappings": [
        {
          "storyTerm": "Erasing Visitor Wristband to Zero",
          "technicalTerm": "Overwriting Kernel task_struct cred->uid and cred->gid to 0 (root)",
          "tone": "rose"
        },
        {
          "storyTerm": "Flipping Enforcement Breaker",
          "technicalTerm": "Patching selinux_state.enforcing from 1 (Enforcing) to 0 (Permissive)",
          "tone": "amber"
        },
        {
          "storyTerm": "Engineering Ring Log",
          "technicalTerm": "Android dmesg, last_kmsg & Audit Event MAC_STATUS (1404)",
          "tone": "sky"
        },
        {
          "storyTerm": "Security State Verification",
          "technicalTerm": "Bugreport Archive Inspection for Unexpected SELinux Transitions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-android-gpu-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Erasing Visitor Wristband to Zero",
          "subtitle": "Overwriting Kernel task_struct cred->uid and cred->gid to 0…",
          "tone": "rose"
        },
        {
          "id": "mob-android-gpu-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flipping Enforcement Breaker",
          "subtitle": "Patching selinux_state.enforcing from 1 (Enforcing) to 0…",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Zero",
          "stageTag": "STEP 02 · SETUP",
          "title": "Erasing Visitor Wristband to Zero",
          "storyExcerpt": "Using that stolen control-room reach, the intruder erases their visitor wristband down to master superintendent zero and flips the building’s mandatory enforcement breaker from strict lock to…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"avc:|selinux_state|enforcing\" bugreport-dumpstate_board.txt (which executes the technical command / telemetry directive , grep -E…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Ring",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flipping Enforcement Breaker",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flipping enforcement breaker to advance toward engineering ring log.",
          "technicalParallel": "Using arbitrary kernel read/write primitives, the exploit zeroes out the process cred->uid/gid fields and patches selinux_state.enforcing in kernel memory, leaving diagnostic anomalies in dmesg /…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Ring Log",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Security State Verification",
          "storyExcerpt": "Behind the scenes, security state verification captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 1404 (recording AuditEventType=MAC_STATUS , 1404, SelinuxTransition=old_enforcing=1 -> enforcing=0 , Runtime Kernel Patch, ForensicSource=Android bugreport kernel ring…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Playroom",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Wiring",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Guardrail Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    },
    "step-3": {
      "scenarioId": "mobile-android-binder-gpu-selinux-audit-forensics",
      "sectionKey": "step-3",
      "sceneKind": "mob-android-gpu-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Privileged Dalvik/ART Runtime Spawn via /system/bin/app_process64",
      "storyCue": "Now holding master superintendent authority, the intruder avoids posting any visible shop sign in the phone’s main app directory and instead launches the building’s own built-in runtime engine pointing directly at a hidden blueprint stashed in a temporary closet.",
      "technicalCue": "T1623 · EXECUTION — To execute a resident Java/DEX spyware module with root/system privileges without installing a visible APK in PackageManager, the loader spawns /system/bin/app_process64 loading a hidden DEX…",
      "storyMappings": [
        {
          "storyTerm": "Skipping Front App Directory",
          "technicalTerm": "Evading Android PackageManager Visible APK Installation",
          "tone": "amber"
        },
        {
          "storyTerm": "Built-In Runtime Engine",
          "technicalTerm": "Privileged Execution of /system/bin/app_process64",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden Temporary Blueprint",
          "technicalTerm": "CLASSPATH Pointing to Hidden DEX Archive in /data/local/tmp/ or memfd",
          "tone": "rose"
        },
        {
          "storyTerm": "Mobile DFIR Inspection",
          "technicalTerm": "Amnesty Tech Bugreport & Process Lineage Audit of app_process64",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-android-gpu-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Skipping Front App Directory",
          "subtitle": "Evading Android PackageManager Visible APK Installation",
          "tone": "amber"
        },
        {
          "id": "mob-android-gpu-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Built-In Runtime Engine",
          "subtitle": "Privileged Execution of /system/bin/app_process64",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Any",
          "stageTag": "STEP 03 · SETUP",
          "title": "Skipping Front App Directory",
          "storyExcerpt": "Now holding master superintendent authority, the intruder avoids posting any visible shop sign in the phone’s main app directory and instead launches the building’s own built-in runtime engine…",
          "technicalParallel": "Under the hood, the observed step executes ps -A -o USER,PID,PPID,LABEL,NAME,ARGS | grep app_process64 (which executes the technical command / telemetry directive , ps -A -o USER,PID,PPID,LABEL,NAME,ARGS…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Built-In Runtime Engine",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses built-in runtime engine to advance toward hidden temporary blueprint.",
          "technicalParallel": "To execute a resident Java/DEX spyware module with root/system privileges without installing a visible APK in PackageManager, the loader spawns /system/bin/app_process64 loading a hidden DEX archive from…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Dfir",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Mobile DFIR Inspection",
          "storyExcerpt": "Behind the scenes, mobile dfir inspection captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording HostBinary=/system/bin/app_process64, LoadedDexPath=CLASSPATH=/data/local/tmp/.cache.jar, ParentPidAnomaly=PPID=1 , init instead of zygote64 under T1623)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Playroom",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Wiring",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Guardrail Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1623"
    }
  },
  "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics": {
    "briefing": {
      "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
      "sectionKey": "briefing",
      "sceneKind": "mob-triangulation-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1456",
      "title": "iOS Operation Triangulation Zero-Click iMessage & Shutdown.log Forensics… — Story-to-Technical Overview",
      "storyCue": "Imagine a ghost burglar slipping into a locked smartphone apartment through an unread postcard slid under the front door without the homeowner ever tapping the screen. The burglar works strictly in the dark, burns every paper note in the hallway before leaving, and vanishes whenever the building power cycles; yet the elevator’s nightly closing log still records an unfamiliar worker lingering in the storage corridor and the utility meter permanently shows megabytes of unexplained water flowing out of an unused closet.",
      "technicalCue": "INITIAL ACCESS: Hidden iMessage Attachment Processing in IMTranscoderAgent & Font Parser Crash Trace -> DEFENSE EVASION: Ephemeral Implant Execution in /private/var/tmp/ Recorded in iOS Shutdown.log -> EXFIL & IMPACT: Anomalous System Process Cellular/Wi-Fi Exfiltration in DataUsage.sqlite & netusage.sqlite",
      "storyMappings": [
        {
          "storyTerm": "Unread Postcard Under Door",
          "technicalTerm": "Zero-Click iMessage Crafted Font/Image Attachment (CVE-2023-41990)",
          "tone": "rose"
        },
        {
          "storyTerm": "Ghost Burglar Burning Notes",
          "technicalTerm": "Ephemeral In-Memory Implant Deleting /private/var/tmp/ Artifacts",
          "tone": "amber"
        },
        {
          "storyTerm": "Elevator Nightly Closing Log",
          "technicalTerm": "iOS /private/var/db/diagnostics/Shutdown.log (Unclosed PID Record)",
          "tone": "sky"
        },
        {
          "storyTerm": "Utility Meter Closet Flow",
          "technicalTerm": "DataUsage.sqlite & netusage.sqlite ZPROCESS Cellular/Wi-Fi Counters",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "mob-triangulation-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unread Postcard Under Door",
          "subtitle": "Zero-Click iMessage Crafted Font/Image Attachment…",
          "tone": "rose"
        },
        {
          "id": "mob-triangulation-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Ghost Burglar Burning Notes",
          "subtitle": "Ephemeral In-Memory Implant Deleting /private/var/tmp/ Artifacts",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Hidden iMessage Attachment Processing in IMTranscoderAgent & Font Parser Crash Trace",
          "storyExcerpt": "Before the homeowner even wakes the phone screen, the building’s automated mail sorter opens the rigged postcard in the basement mailroom, triggering an invisible print-shop jam that leaves behind a…",
          "technicalParallel": "Under the hood, the observed step executes mvt-ios check-backup --output ./mvt-results ./ios-encrypted-backup/ (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android forensic parsers or inspects…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Runs Out",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Ephemeral Implant Execution in /private/var/tmp/ Recorded in iOS Shutdown.log",
          "storyExcerpt": "The ghost burglar runs quietly out of a temporary hallway locker and shreds their working files immediately afterward, forgetting that every time the building powers down, the master elevator log writes…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"/private/var/tmp/|/private/var/db/\" sysdiagnose_extracted/logs/Shutdown/shutdown.log (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Even Days",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Anomalous System Process Cellular/Wi-Fi Exfiltration in DataUsage.sqlite & netusage.sqlite",
          "storyExcerpt": "Even days after a reboot wipes the ghost burglar out of memory, the building’s permanent water-and-power billing books still display heavy outbound usage billed to a broom-closet service that should…",
          "technicalParallel": "Under the hood, the observed step executes sqlite3 DataUsage.sqlite \"SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT FROM ZLIVEUSAGE JOIN ZPROCESS ON…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Phone Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Closing Log",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Meter Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
      "sectionKey": "step-1",
      "sceneKind": "mob-triangulation-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Hidden iMessage Attachment Processing in IMTranscoderAgent & Font Parser Crash Trace",
      "storyCue": "Before the homeowner even wakes the phone screen, the building’s automated mail sorter opens the rigged postcard in the basement mailroom, triggering an invisible print-shop jam that leaves behind a faint diagnostic receipt on the maintenance clipboard.",
      "technicalCue": "T1456 · INITIAL ACCESS — When a zero-click iMessage containing a crafted font/image attachment arrives via Apple Push Notification service (apsd), imagent and IMTranscoderAgent process the attachment automatically.",
      "storyMappings": [
        {
          "storyTerm": "Automated Mail Sorter",
          "technicalTerm": "Apple Push (apsd), imagent & IMTranscoderAgent Background Parsers",
          "tone": "sky"
        },
        {
          "storyTerm": "Rigged Postcard",
          "technicalTerm": "Zero-Click Malicious Font/Image Attachment (CVE-2023-41990)",
          "tone": "rose"
        },
        {
          "storyTerm": "Invisible Print-Shop Jam",
          "technicalTerm": "Memory Fault Inside FontParser / CoreGraphics Rendering Engine",
          "tone": "amber"
        },
        {
          "storyTerm": "Maintenance Clipboard Receipt",
          "technicalTerm": "iOS CrashReporter .ips Plis & Unified Diagnostic Logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-triangulation-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Automated Mail Sorter",
          "subtitle": "Apple Push (apsd), imagent & IMTranscoderAgent Background…",
          "tone": "sky"
        },
        {
          "id": "mob-triangulation-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Rigged Postcard",
          "subtitle": "Zero-Click Malicious Font/Image Attachment (CVE-2023-41990)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail",
          "stageTag": "STEP 01 · SETUP",
          "title": "Automated Mail Sorter",
          "storyExcerpt": "Before the homeowner even wakes the phone screen, the building’s automated mail sorter opens the rigged postcard in the basement mailroom, triggering an invisible print-shop jam that leaves…",
          "technicalParallel": "Under the hood, the observed step executes mvt-ios check-backup --output ./mvt-results ./ios-encrypted-backup/ (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android forensic parsers or inspects…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Jam",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Stage 1: Hidden iMessage Attachment Processing in…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rigged postcard to advance toward invisible print-shop jam.",
          "technicalParallel": "When a zero-click iMessage containing a crafted font/image attachment arrives via Apple Push Notification service (apsd), imagent and IMTranscoderAgent process the attachment automatically.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even Mail",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Maintenance Clipboard Receipt",
          "storyExcerpt": "Behind the scenes, maintenance clipboard receipt captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 41990 (recording TargetDaemon=IMTranscoderAgent , iMessage Attachment Transcoder, LibraryModule=libFontParser.dylib , TrueType ADJUST Instruction…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Phone Door",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Closing Log",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Meter Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1456"
    },
    "step-2": {
      "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
      "sectionKey": "step-2",
      "sceneKind": "mob-triangulation-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Ephemeral Implant Execution in /private/var/tmp/ Recorded in iOS Shutdown.log",
      "storyCue": "The ghost burglar runs quietly out of a temporary hallway locker and shreds their working files immediately afterward, forgetting that every time the building powers down, the master elevator log writes down the exact badge number and locker path of every worker still lingering at closing time.",
      "technicalCue": "T1070.004 · DEFENSE EVASION — Even though the in-memory implant removes its temporary files from /private/var/tmp/ after execution and does not survive a reboot, the iOS kernel writes every unclosed process PID and path…",
      "storyMappings": [
        {
          "storyTerm": "Temporary Hallway Locker",
          "technicalTerm": "Ephemeral Implant Staged Under /private/var/tmp/",
          "tone": "amber"
        },
        {
          "storyTerm": "Shredding Working Files",
          "technicalTerm": "Self-Deleting In-Memory Payload Leaving Zero Disk Persistence",
          "tone": "rose"
        },
        {
          "storyTerm": "Master Elevator Closing Log",
          "technicalTerm": "/private/var/db/diagnostics/Shutdown.log in sysdiagnose Archive",
          "tone": "sky"
        },
        {
          "storyTerm": "Lingering Worker Badge Record",
          "technicalTerm": "MVT Extracting Unclosed /private/var/tmp/ Process Path & PID",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-triangulation-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Temporary Hallway Locker",
          "subtitle": "Ephemeral Implant Staged Under /private/var/tmp/",
          "tone": "amber"
        },
        {
          "id": "mob-triangulation-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Shredding Working Files",
          "subtitle": "Self-Deleting In-Memory Payload Leaving Zero Disk Persistence",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Runs Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Temporary Hallway Locker",
          "storyExcerpt": "The ghost burglar runs quietly out of a temporary hallway locker and shreds their working files immediately afterward, forgetting that every time the building powers down, the master elevator…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"/private/var/tmp/|/private/var/db/\" sysdiagnose_extracted/logs/Shutdown/shutdown.log (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Log",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Shredding Working Files",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shredding working files to advance toward master elevator closing log.",
          "technicalParallel": "Even though the in-memory implant removes its temporary files from /private/var/tmp/ after execution and does not survive a reboot, the iOS kernel writes every unclosed process PID and path active during…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Runs Out",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Lingering Worker Badge Record",
          "storyExcerpt": "Behind the scenes, lingering worker badge record captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 38606 (recording ForensicArtifactFile=/private/var/db/diagnostics/Shutdown.log , sysdiagnose, RecordedProcessPath=/private/var/tmp/main, ForensicSignificance=Proves…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Phone Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Closing Log",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Meter Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1070.004"
    },
    "step-3": {
      "scenarioId": "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics",
      "sectionKey": "step-3",
      "sceneKind": "mob-triangulation-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Anomalous System Process Cellular/Wi-Fi Exfiltration in DataUsage.sqlite & netusage.sqlite",
      "storyCue": "Even days after a reboot wipes the ghost burglar out of memory, the building’s permanent water-and-power billing books still display heavy outbound usage billed to a broom-closet service that should never transmit anything to the street.",
      "technicalCue": "T1041 · EXFIL & IMPACT — iOS persistently tracks per-process network byte counters in /private/var/wireless/Library/Databases/DataUsage.sqlite and netusage.sqlite.",
      "storyMappings": [
        {
          "storyTerm": "Permanent Utility Billing Books",
          "technicalTerm": "/private/var/wireless/Library/Databases/DataUsage.sqlite & netusage.sqlite",
          "tone": "sky"
        },
        {
          "storyTerm": "Broom-Closet Service Name",
          "technicalTerm": "ZPROCESS Table Entry for Non-Networked Daemon or Deleted PID",
          "tone": "amber"
        },
        {
          "storyTerm": "Heavy Outbound Flow",
          "technicalTerm": "Megabytes of Anomalous Wi-Fi & Cellular HTTPS Exfiltration Bytes",
          "tone": "rose"
        },
        {
          "storyTerm": "Forensic Billing Audit",
          "technicalTerm": "Amnesty MVT Correlation of ZPROCESS Counters Against Shutdown.log",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-triangulation-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Permanent Utility Billing Books",
          "subtitle": "/private/var/wireless/Library/Databases/DataUsage.sqlite &…",
          "tone": "sky"
        },
        {
          "id": "mob-triangulation-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Broom-Closet Service Name",
          "subtitle": "ZPROCESS Table Entry for Non-Networked Daemon or Deleted PID",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Days",
          "stageTag": "STEP 03 · SETUP",
          "title": "Permanent Utility Billing Books",
          "storyExcerpt": "Even days after a reboot wipes the ghost burglar out of memory, the building’s permanent water-and-power billing books still display heavy outbound usage billed to a broom-closet service that…",
          "technicalParallel": "Under the hood, the observed step executes sqlite3 DataUsage.sqlite \"SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT FROM ZLIVEUSAGE JOIN ZPROCESS ON…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Name",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Broom-Closet Service Name",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses broom-closet service name to advance toward heavy outbound flow.",
          "technicalParallel": "iOS persistently tracks per-process network byte counters in /private/var/wireless/Library/Databases/DataUsage.sqlite and netusage.sqlite.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Flow",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic Billing Audit",
          "storyExcerpt": "Behind the scenes, forensic billing audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 443 (recording SqliteDatabase=DataUsage.sqlite / netusage.sqlite, AnomalousProcessName=BackupAgent , ZPROCNAME with NULL Bundle ID, OutboundBytesRecorded=14.8 MB Wi-Fi / 3.1…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Phone Door",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Closing Log",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Meter Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1041"
    }
  },
  "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics": {
    "briefing": {
      "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
      "sectionKey": "briefing",
      "sceneKind": "mob-pegasus-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1203",
      "title": "iOS JBIG2 Stream & MVT Shutdown/DataUsage Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a courier dropping off a fake animated greeting card that secretly conceals a dense architectural blueprint folded inside a paper disguise. Because the greeting-card label tricks the building’s automated preview booth into routing it around the armored inspection chamber, a tiny built-in typesetting machine executes seventy thousand logic steps to hijack the phone, leaving no permanent tools behind after a reboot, only crash slips and permanent cellular billing entries under a made-up maintenance worker’s name.",
      "technicalCue": "INITIAL ACCESS: Zero-Click iMessage Attachment Retrieval via IMTransferAgent & attachment-dir Audit -> EXECUTION: CoreGraphics Xpdf JBIG2Decode Segment Integer Overflow (CVE-2021-30860) CrashReporter Trace -> LATERAL & C2: DataUsage.sqlite & netusage.sqlite Masqueraded Process Network Attribution",
      "storyMappings": [
        {
          "storyTerm": "Fake Greeting Card Concealing Blueprint",
          "technicalTerm": ".gif Attachment Carrying %PDF-1.3 Header & /JBIG2Decode Stream",
          "tone": "rose"
        },
        {
          "storyTerm": "Armored Inspection Chamber Bypass",
          "technicalTerm": "CoreGraphics Rendering Outside iOS BlastDoor Image Sandbox",
          "tone": "amber"
        },
        {
          "storyTerm": "Seventy Thousand Typesetting Steps",
          "technicalTerm": "CVE-2021-30860 (FORCEDENTRY) JBIG2Stream Integer Overflow",
          "tone": "sky"
        },
        {
          "storyTerm": "Made-Up Worker Cellular Billing",
          "technicalTerm": "DataUsage.sqlite ZPROCESS Anomaly (RoleAccountd / NULL Bundle ID)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "mob-pegasus-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Fake Greeting Card Concealing Blueprint",
          "subtitle": ".gif Attachment Carrying %PDF-1.3 Header & /JBIG2Decode Stream",
          "tone": "rose"
        },
        {
          "id": "mob-pegasus-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Armored Inspection Chamber Bypass",
          "subtitle": "CoreGraphics Rendering Outside iOS BlastDoor Image Sandbox",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake Card",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Zero-Click iMessage Attachment Retrieval via IMTransferAgent & attachment-dir Audit",
          "storyExcerpt": "A silent incoming delivery lands in the phone’s attachment tray stamped as a harmless animated picture, but peeling back the outer wrapper reveals a compressed document stream engineered to slip straight…",
          "technicalParallel": "Under the hood, the observed step executes mvt-ios check-backup --iocs pegasus_forcedentry.stix2 /cases/ios_backup_decrypted/ (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android forensic…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Lay Out",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "CoreGraphics Xpdf JBIG2Decode Segment Integer Overflow (CVE-2021-30860) CrashReporter Trace",
          "storyExcerpt": "When the building’s graphics press tries to lay out the disguised document outside the armored inspection chamber, the seventy-thousand-step typesetting script overflows the press’s internal counter and…",
          "technicalParallel": "Under the hood, the observed step executes grep -rnE \"CoreGraphics|JBIG2Stream|IMTranscoderAgent\" /cases/sysdiagnose/logs/CrashReporter/ (which executes the technical command / telemetry directive , grep…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Away Keep",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "DataUsage.sqlite & netusage.sqlite Masqueraded Process Network Attribution",
          "storyExcerpt": "Although the spyware sweeps its temporary hallway tools away cleanly and vanishes on reboot, the phone’s permanent network billing ledgers forever keep a timestamped row showing a mystery worker with no…",
          "technicalParallel": "Under the hood, the observed step executes sqlite3 DataUsage.sqlite \"SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "BlastDoor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Hidden Blueprint",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Billing Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
      "sectionKey": "step-1",
      "sceneKind": "mob-pegasus-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Zero-Click iMessage Attachment Retrieval via IMTransferAgent & attachment-dir Audit",
      "storyCue": "A silent incoming delivery lands in the phone’s attachment tray stamped as a harmless animated picture, but peeling back the outer wrapper reveals a compressed document stream engineered to slip straight into the core rendering office.",
      "technicalCue": "T1203 · INITIAL ACCESS — When a zero-click iMessage attachment (.gif wrapping a PDF/JBIG2 stream) arrives from Apple Push Notification service (APNs), IMTransferAgent automatically downloads the attachment from iCloud…",
      "storyMappings": [
        {
          "storyTerm": "Attachment Delivery Clerk",
          "technicalTerm": "iOS IMTransferAgent Saving IMG_0041.gif in ~/Library/SMS/Attachments/",
          "tone": "sky"
        },
        {
          "storyTerm": "Harmless Picture Label",
          "technicalTerm": "Masqueraded .gif Extension Masking %PDF-1.3 File Signature",
          "tone": "amber"
        },
        {
          "storyTerm": "Compressed Document Stream",
          "technicalTerm": "Embedded /Filter /JBIG2Decode Stream Inside Disguised PDF",
          "tone": "rose"
        },
        {
          "storyTerm": "High-Risk Mailroom Lock",
          "technicalTerm": "Apple iOS Lockdown Mode Blocking Complex Attachment Parsing",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-pegasus-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Attachment Delivery Clerk",
          "subtitle": "iOS IMTransferAgent Saving IMG_0041.gif in…",
          "tone": "sky"
        },
        {
          "id": "mob-pegasus-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Harmless Picture Label",
          "subtitle": "Masqueraded .gif Extension Masking %PDF-1.3 File Signature",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tray But",
          "stageTag": "STEP 01 · SETUP",
          "title": "Attachment Delivery Clerk",
          "storyExcerpt": "A silent incoming delivery lands in the phone’s attachment tray stamped as a harmless animated picture, but peeling back the outer wrapper reveals a compressed document stream engineered to…",
          "technicalParallel": "Under the hood, the observed step executes mvt-ios check-backup --iocs pegasus_forcedentry.stix2 /cases/ios_backup_decrypted/ (which Runs Mobile Verification Toolkit , mvt-ios / mvt-android forensic…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Harmless Picture Label",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses harmless picture label to advance toward compressed document stream.",
          "technicalParallel": "When a zero-click iMessage attachment (.gif wrapping a PDF/JBIG2 stream) arrives from Apple Push Notification service (APNs), IMTransferAgent automatically downloads the attachment from iCloud MMCS…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-risk Lock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "High-Risk Mailroom Lock",
          "storyExcerpt": "Behind the scenes, high-risk mailroom lock captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 101 (recording ProcessName=IMTransferAgent, AttachmentPath=~/Library/SMS/Attachments/9f/15/FA812B/IMG_0041.gif, HeaderMismatch=File extension .gif contains %PDF-1.3 header…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "BlastDoor",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Hidden Blueprint",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Billing Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1203"
    },
    "step-2": {
      "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
      "sectionKey": "step-2",
      "sceneKind": "mob-pegasus-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "CoreGraphics Xpdf JBIG2Decode Segment Integer Overflow (CVE-2021-30860) CrashReporter Trace",
      "storyCue": "When the building’s graphics press tries to lay out the disguised document outside the armored inspection chamber, the seventy-thousand-step typesetting script overflows the press’s internal counter and constructs a miniature virtual machine out of ink logic gates, leaving a crash slip in the maintenance tray.",
      "technicalCue": "T1203 · EXECUTION — As CoreGraphics renders the masqueraded attachment outside the BlastDoor sandboxed image path, the JBIG2Stream::readTextRegionSeg parser processes over 70,000 segment commands using bitwise…",
      "storyMappings": [
        {
          "storyTerm": "Graphics Press Outside Chamber",
          "technicalTerm": "CoreGraphics Xpdf JBIG2Stream::readTextRegionSeg Outside BlastDoor",
          "tone": "sky"
        },
        {
          "storyTerm": "Seventy-Thousand-Step Logic Gates",
          "technicalTerm": "CVE-2021-30860 Bitwise AND/OR/XOR/XNOR Refinement Overflow",
          "tone": "rose"
        },
        {
          "storyTerm": "Targeted Rendering Workers",
          "technicalTerm": "IMTranscoderAgent and SpringBoard System Processes",
          "tone": "amber"
        },
        {
          "storyTerm": "Maintenance Tray Crash Slip",
          "technicalTerm": "/private/var/mobile/Library/Logs/CrashReporter/IMTranscoderAgent-*.ips",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-pegasus-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Graphics Press Outside Chamber",
          "subtitle": "CoreGraphics Xpdf JBIG2Stream::readTextRegionSeg Outside…",
          "tone": "sky"
        },
        {
          "id": "mob-pegasus-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Seventy-Thousand-Step Logic Gates",
          "subtitle": "CVE-2021-30860 Bitwise AND/OR/XOR/XNOR Refinement Overflow",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lay Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Graphics Press Outside Chamber",
          "storyExcerpt": "When the building’s graphics press tries to lay out the disguised document outside the armored inspection chamber, the seventy-thousand-step typesetting script overflows the press’s internal…",
          "technicalParallel": "Under the hood, the observed step executes grep -rnE \"CoreGraphics|JBIG2Stream|IMTranscoderAgent\" /cases/sysdiagnose/logs/CrashReporter/ (which executes the technical command / telemetry directive , grep…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Seventy-Thousand-Step Logic Gates",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses seventy-thousand-step logic gates to advance toward targeted rendering workers.",
          "technicalParallel": "As CoreGraphics renders the masqueraded attachment outside the BlastDoor sandboxed image path, the JBIG2Stream::readTextRegionSeg parser processes over 70,000 segment commands using bitwise…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tray Slip",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Maintenance Tray Crash Slip",
          "storyExcerpt": "Behind the scenes, maintenance tray crash slip captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 30860 (recording VulnerabilityId=CVE-2021-30860 , FORCEDENTRY CoreGraphics JBIG2 Integer Overflow, TargetProcess=IMTranscoderAgent / SpringBoard…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "BlastDoor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Hidden Blueprint",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Billing Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1203"
    },
    "step-3": {
      "scenarioId": "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics",
      "sectionKey": "step-3",
      "sceneKind": "mob-pegasus-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "DataUsage.sqlite & netusage.sqlite Masqueraded Process Network Attribution",
      "storyCue": "Although the spyware sweeps its temporary hallway tools away cleanly and vanishes on reboot, the phone’s permanent network billing ledgers forever keep a timestamped row showing a mystery worker with no official company badge sending megabytes of data seven seconds after the rigged card arrived.",
      "technicalCue": "T1071.001 · LATERAL & C2 — Even after the staged files under /private/var/tmp/ are deleted (since Pegasus runs purely in memory and does not persist across reboots), iOS SQLite databases DataUsage.sqlite and…",
      "storyMappings": [
        {
          "storyTerm": "Permanent Network Billing Ledgers",
          "technicalTerm": "DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE) & netusage.sqlite",
          "tone": "sky"
        },
        {
          "storyTerm": "Mystery Worker Without Badge",
          "technicalTerm": "Anomalous ZPROCNAME (RoleAccountd / Stagingd) with NULL ZBUNDLENAME",
          "tone": "rose"
        },
        {
          "storyTerm": "Seven-Second Arrival Correlation",
          "technicalTerm": "Temporal Match Right After IMTransferAgent Attachment Download",
          "tone": "amber"
        },
        {
          "storyTerm": "Forensic Ledger Verification",
          "technicalTerm": "Amnesty MVT Inspection of Pre-Reboot sysdiagnose & SQLite Tables",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "mob-pegasus-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Permanent Network Billing Ledgers",
          "subtitle": "DataUsage.sqlite (ZPROCESS / ZLIVEUSAGE) & netusage.sqlite",
          "tone": "sky"
        },
        {
          "id": "mob-pegasus-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Mystery Worker Without Badge",
          "subtitle": "Anomalous ZPROCNAME (RoleAccountd / Stagingd) with NULL…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Away Keep",
          "stageTag": "STEP 03 · SETUP",
          "title": "Permanent Network Billing Ledgers",
          "storyExcerpt": "Although the spyware sweeps its temporary hallway tools away cleanly and vanishes on reboot, the phone’s permanent network billing ledgers forever keep a timestamped row showing a mystery…",
          "technicalParallel": "Under the hood, the observed step executes sqlite3 DataUsage.sqlite \"SELECT ZPROCESS.ZPROCNAME, ZPROCESS.ZBUNDLENAME, ZLIVEUSAGE.ZWIFIIN, ZLIVEUSAGE.ZWIFIOUT…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Mystery Worker Without Badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mystery worker without badge to advance toward seven-second arrival correlation.",
          "technicalParallel": "Even after the staged files under /private/var/tmp/ are deleted (since Pegasus runs purely in memory and does not persist across reboots), iOS SQLite databases DataUsage.sqlite and netusage.sqlite…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Away Keep",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic Ledger Verification",
          "storyExcerpt": "Behind the scenes, forensic ledger verification captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording DatabaseArtifact=/private/var/wireless/Library/Databases/DataUsage.sqlite , ZPROCESS / ZLIVEUSAGE, AnomalousProcessName=RoleAccountd , ZPROCNAME with NULL…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "BlastDoor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Hidden Blueprint",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Billing Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1071.001"
    }
  },
  "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics": {
    "briefing": {
      "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
      "sectionKey": "briefing",
      "sceneKind": "tel-lightbasin-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1133",
      "title": "Telecom GPRS Tunneling Protocol (GTP) & Roaming Interconnect Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine an international postal bridge connecting rival national carriers so travelers can receive mail abroad. An intruder posing as a friendly foreign post office requests a private sealed mailbag lane across the bridge, stuffs unauthorized internal maintenance parcels inside those sealed bags to sail straight past the outer security checkpoints, and installs a rigged front-door lock and secret hallway chute inside the telecom headquarters.",
      "technicalCue": "INITIAL ACCESS: Rogue PDP Context Creation Request over GTP-C (UDP Port 2123) on GRX Interface -> LATERAL & C2: Encapsulated GTP-U (UDP Port 2152) Inner Packet Routing to Telecom Core Infrastructure -> PERSISTENCE: Custom PAM Module (/lib64/security/pam_unix_auth.so) & iptables Covert Port Rule Audit",
      "storyMappings": [
        {
          "storyTerm": "International Postal Bridge",
          "technicalTerm": "Inter-Carrier GPRS Roaming Exchange (GRX / IPX Interconnect)",
          "tone": "sky"
        },
        {
          "storyTerm": "Requesting Sealed Mailbag Lane",
          "technicalTerm": "Rogue GTP-C Create PDP Context / Create Session (UDP/2123)",
          "tone": "amber"
        },
        {
          "storyTerm": "Stuffing Maintenance Parcels Inside",
          "technicalTerm": "Encapsulated GTP-U Inner IP Packets (UDP/2152) Reaching Core OAM",
          "tone": "rose"
        },
        {
          "storyTerm": "Rigged Lock & Secret Chute",
          "technicalTerm": "Backdoored PAM (/lib64/security/pam_unix_auth.so) & iptables PREROUTING",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "tel-lightbasin-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "International Postal Bridge",
          "subtitle": "Inter-Carrier GPRS Roaming Exchange (GRX / IPX Interconnect)",
          "tone": "sky"
        },
        {
          "id": "tel-lightbasin-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Requesting Sealed Mailbag Lane",
          "subtitle": "Rogue GTP-C Create PDP Context / Create Session (UDP/2123)",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. End Slip",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Rogue PDP Context Creation Request over GTP-C (UDP Port 2123) on GRX Interface",
          "storyExcerpt": "Standing on the foreign end of the postal bridge, the intruder sends a counterfeit carrier dispatch slip asking the domestic sorting hub to open a brand-new sealed mailbag channel for a visiting…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r grx-interconnect.pcap gtpv1 (which executes the technical command / telemetry directive , zeek -C -r grx-interconnect.pcap gtpv1 via zeek, passing…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Lane",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Encapsulated GTP-U (UDP Port 2152) Inner Packet Routing to Telecom Core Infrastructure",
          "storyExcerpt": "Once the sorting hub stamps a tracking tag onto the new sealed mailbag lane, the intruder packs private administrative commands inside the sealed pouches so outer gate guards only see harmless roaming…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r grx-interconnect.pcap -Y \"gtp.message == 0xff && ip.dst == 10.90.0.0/16\" -T fields -e gtp.teid -e ip.src -e ip.dst -e tcp.dstport (which executes the…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Core Room",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "Custom PAM Module (/lib64/security/pam_unix_auth.so) & iptables Covert Port Rule Audit",
          "storyExcerpt": "Inside the telecom core server room, the intruder swaps out the building’s staff badge reader for a rigged lock that accepts their secret skeleton password and cuts a hidden redirection chute in the…",
          "technicalParallel": "Under the hood, the observed step executes rpm -Va pam || dpkg --verify libpam-modules (which executes the technical command / telemetry directive , rpm -Va pam || dpkg --verify libpam-modules via System…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Postal Bridge",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Chute",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mailbag Lane",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
      "sectionKey": "step-1",
      "sceneKind": "tel-lightbasin-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Rogue PDP Context Creation Request over GTP-C (UDP Port 2123) on GRX Interface",
      "storyCue": "Standing on the foreign end of the postal bridge, the intruder sends a counterfeit carrier dispatch slip asking the domestic sorting hub to open a brand-new sealed mailbag channel for a visiting subscriber.",
      "technicalCue": "T1133 · INITIAL ACCESS — Across the inter-carrier GPRS Roaming Exchange (GRX), an unauthorized peer sends a crafted GTPv1-C Create PDP Context Request (Message Type 16) or GTPv2-C Create Session Request (Message Type…",
      "storyMappings": [
        {
          "storyTerm": "Foreign End of Postal Bridge",
          "technicalTerm": "Unauthorized External GRX Roaming Peer Interface",
          "tone": "amber"
        },
        {
          "storyTerm": "Counterfeit Carrier Dispatch Slip",
          "technicalTerm": "GTPv1-C Create PDP Context (Type 16) / GTPv2-C Create Session (Type 32)",
          "tone": "rose"
        },
        {
          "storyTerm": "Domestic Sorting Hub",
          "technicalTerm": "Mobile Operator GGSN / PGW Listening on UDP Port 2123",
          "tone": "sky"
        },
        {
          "storyTerm": "Bridge Border Checkpoint",
          "technicalTerm": "GSMA FS.11 / FS.19 GTP Signaling Firewall Peer Validation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-lightbasin-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Foreign End of Postal Bridge",
          "subtitle": "Unauthorized External GRX Roaming Peer Interface",
          "tone": "amber"
        },
        {
          "id": "tel-lightbasin-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Counterfeit Carrier Dispatch Slip",
          "subtitle": "GTPv1-C Create PDP Context (Type 16) / GTPv2-C Create Session…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. End Slip",
          "stageTag": "STEP 01 · SETUP",
          "title": "Foreign End of Postal Bridge",
          "storyExcerpt": "Standing on the foreign end of the postal bridge, the intruder sends a counterfeit carrier dispatch slip asking the domestic sorting hub to open a brand-new sealed mailbag channel for a…",
          "technicalParallel": "Under the hood, the observed step executes zeek -C -r grx-interconnect.pcap gtpv1 (which executes the technical command / telemetry directive , zeek -C -r grx-interconnect.pcap gtpv1 via zeek, passing…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Counterfeit Carrier Dispatch Slip",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses counterfeit carrier dispatch slip to advance toward domestic sorting hub.",
          "technicalParallel": "Across the inter-carrier GPRS Roaming Exchange (GRX), an unauthorized peer sends a crafted GTPv1-C Create PDP Context Request (Message Type 16) or GTPv2-C Create Session Request (Message Type 32) on UDP…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. End Slip",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Bridge Border Checkpoint",
          "storyExcerpt": "Behind the scenes, bridge border checkpoint captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 2123 (recording SignalingProtocol=GTPv1-C Control Plane , UDP 2123, GtpMessageType=Create PDP Context Request , 0x10, RequestedApn=admin.core.gprs , Internal Management APN…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Postal Bridge",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Chute",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mailbag Lane",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1133"
    },
    "step-2": {
      "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
      "sectionKey": "step-2",
      "sceneKind": "tel-lightbasin-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Encapsulated GTP-U (UDP Port 2152) Inner Packet Routing to Telecom Core Infrastructure",
      "storyCue": "Once the sorting hub stamps a tracking tag onto the new sealed mailbag lane, the intruder packs private administrative commands inside the sealed pouches so outer gate guards only see harmless roaming luggage while the pouches drop straight onto the core management floor.",
      "technicalCue": "T1572 · LATERAL & C2 — Once a Tunnel Endpoint Identifier (TEID) is established, inner IP packets encapsulated inside GTP-U (UDP port 2152) bypass outer perimeter ACLs and route directly to internal OAM (Operations…",
      "storyMappings": [
        {
          "storyTerm": "Stamped Mailbag Tracking Tag",
          "technicalTerm": "Established Tunnel Endpoint Identifier (TEID)",
          "tone": "amber"
        },
        {
          "storyTerm": "Sealed Roaming Pouches",
          "technicalTerm": "GTP-U User Plane Encapsulated Traffic on UDP Port 2152",
          "tone": "sky"
        },
        {
          "storyTerm": "Bypassing Outer Gate Guards",
          "technicalTerm": "Inner IP Packets Routing Past Perimeter ACLs to Internal OAM",
          "tone": "rose"
        },
        {
          "storyTerm": "Inner Parcel X-Ray Scanner",
          "technicalTerm": "Deep GTP-U Inner-Packet Inspection Blocking RFC 1918 OAM Targets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-lightbasin-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Stamped Mailbag Tracking Tag",
          "subtitle": "Established Tunnel Endpoint Identifier (TEID)",
          "tone": "amber"
        },
        {
          "id": "tel-lightbasin-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sealed Roaming Pouches",
          "subtitle": "GTP-U User Plane Encapsulated Traffic on UDP Port 2152",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hub Tag",
          "stageTag": "STEP 02 · SETUP",
          "title": "Stamped Mailbag Tracking Tag",
          "storyExcerpt": "Once the sorting hub stamps a tracking tag onto the new sealed mailbag lane, the intruder packs private administrative commands inside the sealed pouches so outer gate guards only see harmless…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r grx-interconnect.pcap -Y \"gtp.message == 0xff && ip.dst == 10.90.0.0/16\" -T fields -e gtp.teid -e ip.src -e ip.dst -e tcp.dstport (which executes the…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gate",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sealed Roaming Pouches",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses sealed roaming pouches to advance toward bypassing outer gate guards.",
          "technicalParallel": "Once a Tunnel Endpoint Identifier (TEID) is established, inner IP packets encapsulated inside GTP-U (UDP port 2152) bypass outer perimeter ACLs and route directly to internal OAM (Operations…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Inner Parcel X-Ray Scanner",
          "storyExcerpt": "Behind the scenes, inner parcel x-ray scanner captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 2152 (recording TunnelProtocol=GTP-U User Plane , UDP 2152, TunnelEndpointId=TEID 0x410082a1, InnerDestination=10.90.20.5:22 , Internal Core OAM Node under T1572): Inspect…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Postal Bridge",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Chute",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mailbag Lane",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1572"
    },
    "step-3": {
      "scenarioId": "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics",
      "sectionKey": "step-3",
      "sceneKind": "tel-lightbasin-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Custom PAM Module (/lib64/security/pam_unix_auth.so) & iptables Covert Port Rule Audit",
      "storyCue": "Inside the telecom core server room, the intruder swaps out the building’s staff badge reader for a rigged lock that accepts their secret skeleton password and cuts a hidden redirection chute in the reception desk so any call from their chosen source window slides quietly to a covert backroom listener.",
      "technicalCue": "T1556.003 · PERSISTENCE — On the Linux/Solaris mobile core server, forensic inspection of /etc/pam.d/sshd and iptables -t nat -L PREROUTING reveals a modified PAM shared library and a covert PREROUTING port-redirection…",
      "storyMappings": [
        {
          "storyTerm": "Rigged Staff Badge Reader",
          "technicalTerm": "Modified /lib64/security/pam_unix_auth.so Referenced in /etc/pam.d/sshd",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden Reception Redirection Chute",
          "technicalTerm": "Covert iptables nat PREROUTING Source-Port Redirection Rule",
          "tone": "amber"
        },
        {
          "storyTerm": "Telecom Core Server Room",
          "technicalTerm": "Linux / Solaris Mobile Core SGSN / GGSN Infrastructure Host",
          "tone": "sky"
        },
        {
          "storyTerm": "Forensic Lock & Chute Audit",
          "technicalTerm": "Package Hash Verification of PAM Modules & iptables -t nat -L Audit",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-lightbasin-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Rigged Staff Badge Reader",
          "subtitle": "Modified /lib64/security/pam_unix_auth.so Referenced in…",
          "tone": "rose"
        },
        {
          "id": "tel-lightbasin-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hidden Reception Redirection Chute",
          "subtitle": "Covert iptables nat PREROUTING Source-Port Redirection Rule",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Core Room",
          "stageTag": "STEP 03 · SETUP",
          "title": "Rigged Staff Badge Reader",
          "storyExcerpt": "Inside the telecom core server room, the intruder swaps out the building’s staff badge reader for a rigged lock that accepts their secret skeleton password and cuts a hidden redirection chute…",
          "technicalParallel": "Under the hood, the observed step executes rpm -Va pam || dpkg --verify libpam-modules (which executes the technical command / telemetry directive , rpm -Va pam || dpkg --verify libpam-modules via System…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Core",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hidden Reception Redirection Chute",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hidden reception redirection chute to advance toward telecom core server room.",
          "technicalParallel": "On the Linux/Solaris mobile core server, forensic inspection of /etc/pam.d/sshd and iptables -t nat -L PREROUTING reveals a modified PAM shared library and a covert PREROUTING port-redirection rule…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Core Room",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic Lock & Chute Audit",
          "storyExcerpt": "Behind the scenes, forensic lock & chute audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording NetfilterTable=nat PREROUTING, CovertRuleTrigger=TCP Source Port 33891 -> Local Port 55221, ThreatGroupAttribution=LightBasin , UNC1945 under T1556.003): Run…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Postal Bridge",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Core Chute",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mailbag Lane",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1556.003"
    }
  },
  "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit": {
    "briefing": {
      "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
      "sectionKey": "briefing",
      "sceneKind": "tel-salt-typhoon-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1528",
      "title": "5G Core Service-Based Interface (SBI) NRF/UDM & Diameter Roaming Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a modern city transit control center where every department exchanges digital work orders across a high-speed glass hallway using short-lived badge passes issued by a central registry booth. An intruder on an unauthorized maintenance terminal walks up to the registry booth to mint a high-clearance pass, walks straight to the passenger-tracking desk to pull real-time cell tower locations, and simultaneously sends spoofed cross-border roaming inquiries at the outer border gate where signaling guards flag the impossible travel speed.",
      "technicalCue": "CREDENTIAL ACCESS: 5G NRF (Network Repository Function) NFRegister & OAuth2 Token Request Audit (3GPP TS 29.510) -> EXFIL & IMPACT: UDM Subscriber Data & Serving AMF/gNodeB Location Query (/nudm-sdm/v2/) -> CREDENTIAL ACCESS: Diameter S6a Insert-Subscriber-Data (IDR) & SEPP Interconnect Anomaly Correlation",
      "storyMappings": [
        {
          "storyTerm": "High-Speed Glass Hallway",
          "technicalTerm": "5G Core Service-Based Interface (SBI) Over HTTP/2 (3GPP TS 29.510)",
          "tone": "sky"
        },
        {
          "storyTerm": "Central Registry Booth Pass",
          "technicalTerm": "5G NRF (Network Repository Function) OAuth 2.0 Token Grant",
          "tone": "amber"
        },
        {
          "storyTerm": "Passenger-Tracking Desk Query",
          "technicalTerm": "UDM /nudm-sdm/v2/ & /nudm-uecm/v1/ SUPI & Cell Tower TAI Lookup",
          "tone": "rose"
        },
        {
          "storyTerm": "Outer Border Signaling Guards",
          "technicalTerm": "Diameter S6a (Code 318 AIR / 319 IDR) & GSMA FS.19 Velocity Firewall",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "tel-salt-typhoon-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "High-Speed Glass Hallway",
          "subtitle": "5G Core Service-Based Interface (SBI) Over HTTP/2 (3GPP TS…",
          "tone": "sky"
        },
        {
          "id": "tel-salt-typhoon-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Central Registry Booth Pass",
          "subtitle": "5G NRF (Network Repository Function) OAuth 2.0 Token Grant",
          "tone": "amber"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-speed",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "5G NRF (Network Repository Function) NFRegister & OAuth2 Token Request Audit (3GPP TS 29.510)",
          "storyExcerpt": "Working from an unregistered maintenance terminal inside the transit building, the intruder introduces a bogus department card at the central registry booth and asks for a temporary hallway pass stamped…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.http2.path | test, \"/nnrf-nfm/v1/nf-instances|/oauth2/token\")' /var/log/5gc/nrf_sbi_access.json (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "UDM Subscriber Data & Serving AMF/gNodeB Location Query (/nudm-sdm/v2/)",
          "storyExcerpt": "Flashing that freshly stamped hallway pass at the passenger-tracking desk, the intruder queries permanent subscriber identities and reads back the exact neighborhood station and tower currently serving…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.path | contains, \"/nudm-sdm/v2/\" or contains, \"/nudm-uecm/v1/\")' /var/log/5gc/udm_audit.json (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Diameter S6a Insert-Subscriber-Data (IDR) & SEPP Interconnect Anomaly Correlation",
          "storyExcerpt": "Meanwhile, at the international roaming checkpoint linking older and newer transit lines, signaling guards inspect cross-border authentication slips whose sender seal does not match the physical…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r diameter_s6a_interconnect.pcap -Y \"diameter.cmd.code == 318 || diameter.cmd.code == 319\" -T fields -e sctp.srcport -e diameter.Origin-Host -e…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Hallway",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Registry Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Border Guard",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
      "sectionKey": "step-1",
      "sceneKind": "tel-salt-typhoon-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "5G NRF (Network Repository Function) NFRegister & OAuth2 Token Request Audit (3GPP TS 29.510)",
      "storyCue": "Working from an unregistered maintenance terminal inside the transit building, the intruder introduces a bogus department card at the central registry booth and asks for a temporary hallway pass stamped with permission to read passenger profiles and live locations.",
      "technicalCue": "T1528 · CREDENTIAL ACCESS — On the 5G Core Service-Based Architecture (SBA), a compromised management host or rogue Network Function (NF) queries the Network Repository Function (NRF) via HTTP/2 PUT…",
      "storyMappings": [
        {
          "storyTerm": "Unregistered Maintenance Terminal",
          "technicalTerm": "Unauthorized OAM Subnet Host (10.180.14.99)",
          "tone": "amber"
        },
        {
          "storyTerm": "Bogus Department Card",
          "technicalTerm": "HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ Rogue NF Registration",
          "tone": "rose"
        },
        {
          "storyTerm": "Central Registry Booth Pass",
          "technicalTerm": "NRF POST /oauth2/token Requesting nudm-sdm & nudm-uecm Scopes",
          "tone": "sky"
        },
        {
          "storyTerm": "Strict Badge-to-Certificate Check",
          "technicalTerm": "3GPP TS 33.501 mTLS Client X.509 SAN vs Requested OAuth2 Scope",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-salt-typhoon-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unregistered Maintenance Terminal",
          "subtitle": "Unauthorized OAM Subnet Host (10.180.14.99)",
          "tone": "amber"
        },
        {
          "id": "tel-salt-typhoon-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Bogus Department Card",
          "subtitle": "HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ Rogue NF Registration",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Asks",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unregistered Maintenance Terminal",
          "storyExcerpt": "Working from an unregistered maintenance terminal inside the transit building, the intruder introduces a bogus department card at the central registry booth and asks for a temporary hallway…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.http2.path | test, \"/nnrf-nfm/v1/nf-instances|/oauth2/token\")' /var/log/5gc/nrf_sbi_access.json (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Bogus Department Card",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses bogus department card to advance toward central registry booth pass.",
          "technicalParallel": "On the 5G Core Service-Based Architecture (SBA), a compromised management host or rogue Network Function (NF) queries the Network Repository Function (NRF) via HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Strict Badge-to-Certificate Check",
          "storyExcerpt": "Behind the scenes, strict badge-to-certificate check captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording Specification=3GPP TS 29.510 , 5G NRF Access Token Service, RequestedScope=nudm-sdm , Subscriber Data Management & nudm-uecm, SourceAddress=10.180.14.99…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Hallway",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Registry Booth",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Border Guard",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1528"
    },
    "step-2": {
      "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
      "sectionKey": "step-2",
      "sceneKind": "tel-salt-typhoon-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "UDM Subscriber Data & Serving AMF/gNodeB Location Query (/nudm-sdm/v2/)",
      "storyCue": "Flashing that freshly stamped hallway pass at the passenger-tracking desk, the intruder queries permanent subscriber identities and reads back the exact neighborhood station and tower currently serving each targeted commuter.",
      "technicalCue": "T1557 · EXFIL & IMPACT — Using the NRF-minted Bearer JWT, the caller invokes GET /nudm-sdm/v2/{supi}/am-data and /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access on the Unified Data Management (UDM) function to…",
      "storyMappings": [
        {
          "storyTerm": "Freshly Stamped Hallway Pass",
          "technicalTerm": "NRF-Minted Bearer JWT Used on 5G Service-Based Interface",
          "tone": "amber"
        },
        {
          "storyTerm": "Passenger-Tracking Desk",
          "technicalTerm": "Unified Data Management (UDM, 3GPP TS 29.503 / 29.504)",
          "tone": "sky"
        },
        {
          "storyTerm": "Neighborhood Station & Tower",
          "technicalTerm": "Exposed SUPI/IMSI, Serving AMF GUAMI & gNodeB Tracking Area (TAI)",
          "tone": "rose"
        },
        {
          "storyTerm": "Desk Allowlist Enforcement",
          "technicalTerm": "GSMA FS.37 Policy Limiting UDM Queries to Allowlisted AMF/SMF Nodes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-salt-typhoon-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Freshly Stamped Hallway Pass",
          "subtitle": "NRF-Minted Bearer JWT Used on 5G Service-Based Interface",
          "tone": "amber"
        },
        {
          "id": "tel-salt-typhoon-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Passenger-Tracking Desk",
          "subtitle": "Unified Data Management (UDM, 3GPP TS 29.503 / 29.504)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 02 · SETUP",
          "title": "Freshly Stamped Hallway Pass",
          "storyExcerpt": "Flashing that freshly stamped hallway pass at the passenger-tracking desk, the intruder queries permanent subscriber identities and reads back the exact neighborhood station and tower currently…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.path | contains, \"/nudm-sdm/v2/\" or contains, \"/nudm-uecm/v1/\")' /var/log/5gc/udm_audit.json (which executes the technical command / telemetry…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Passenger-Tracking Desk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses passenger-tracking desk to advance toward neighborhood station & tower.",
          "technicalParallel": "Using the NRF-minted Bearer JWT, the caller invokes GET /nudm-sdm/v2/{supi}/am-data and /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access on the Unified Data Management (UDM) function to retrieve…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Desk Allowlist Enforcement",
          "storyExcerpt": "Behind the scenes, desk allowlist enforcement captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording TargetService=3GPP TS 29.503 / 29.504 Unified Data Management , UDM, QueriedResource=/nudm-uecm/v1/{supi}/registrations/amf-3gpp-access…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Hallway",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Registry Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Border Guard",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1557"
    },
    "step-3": {
      "scenarioId": "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit",
      "sectionKey": "step-3",
      "sceneKind": "tel-salt-typhoon-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Diameter S6a Insert-Subscriber-Data (IDR) & SEPP Interconnect Anomaly Correlation",
      "storyCue": "Meanwhile, at the international roaming checkpoint linking older and newer transit lines, signaling guards inspect cross-border authentication slips whose sender seal does not match the physical transport lane and drop the forged frames while linking them back to the internal tracking query.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — In parallel across the 4G/5G interworking boundary, signaling firewalls inspect Diameter S6a Authentication-Information-Request (AIR, Command Code 318) and Insert-Subscriber-Data-Request (IDR…",
      "storyMappings": [
        {
          "storyTerm": "International Roaming Checkpoint",
          "technicalTerm": "4G/5G Interworking Boundary (DEA / SEPP Signaling Firewall)",
          "tone": "sky"
        },
        {
          "storyTerm": "Cross-Border Authentication Slips",
          "technicalTerm": "Diameter S6a AIR (Command Code 318) & IDR (Command Code 319)",
          "tone": "rose"
        },
        {
          "storyTerm": "Mismatched Sender Seal & Lane",
          "technicalTerm": "Origin-Host / Origin-Realm Mismatch Against Peer SCTP/IP Binding",
          "tone": "amber"
        },
        {
          "storyTerm": "Impossible Travel Speed Guard",
          "technicalTerm": "GSMA FS.19 Category 2 Velocity & Home-Network Location Drop Alert",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "tel-salt-typhoon-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "International Roaming Checkpoint",
          "subtitle": "4G/5G Interworking Boundary (DEA / SEPP Signaling Firewall)",
          "tone": "sky"
        },
        {
          "id": "tel-salt-typhoon-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Cross-Border Authentication Slips",
          "subtitle": "Diameter S6a AIR (Command Code 318) & IDR (Command Code 319)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Seal Does",
          "stageTag": "STEP 03 · SETUP",
          "title": "International Roaming Checkpoint",
          "storyExcerpt": "Meanwhile, at the international roaming checkpoint linking older and newer transit lines, signaling guards inspect cross-border authentication slips whose sender seal does not match the…",
          "technicalParallel": "Under the hood, the observed step executes tshark -r diameter_s6a_interconnect.pcap -Y \"diameter.cmd.code == 318 || diameter.cmd.code == 319\" -T fields -e sctp.srcport -e diameter.Origin-Host -e…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Seal",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Cross-Border Authentication Slips",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses cross-border authentication slips to advance toward mismatched sender seal & lane.",
          "technicalParallel": "In parallel across the 4G/5G interworking boundary, signaling firewalls inspect Diameter S6a Authentication-Information-Request (AIR, Command Code 318) and Insert-Subscriber-Data-Request (IDR, Command…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Seal Lane",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Impossible Travel Speed Guard",
          "storyExcerpt": "Behind the scenes, impossible travel speed guard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Suricata IDS Event 318 (recording SignalingProtocol=Diameter S6a , 3GPP TS 29.272 Command Code 318 AIR, FirewallRuleTriggered=GSMA FS.19 Category 2 Velocity & Home-Network Location…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Glass Hallway",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Registry Booth",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Border Guard",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1046"
    }
  }
};
