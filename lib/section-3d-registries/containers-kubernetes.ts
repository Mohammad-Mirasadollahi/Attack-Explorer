import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for CONTAINERS_KUBERNETES (13 scenarios).
 */
export const CONTAINERS_KUBERNETES_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "container-cap-sys-admin-cgroup-release-agent-notify-audit": {
    "briefing": {
      "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-cgroup-escape-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1611",
      "title": "Privileged Container CAP_SYS_ADMIN Cgroup v1 release_agent Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a privileged glass storage room inside an office building whose occupant holds a master plumbing key. The occupant hooks up an old automated trash-chute control box inside the room, pins a custom maintenance work order onto the chute empty-bin trigger, and drops a single quick parcel down the chute so that the instant the chute empties, the building chief engineer outside automatically picks up and executes the occupant work order with full building authority.",
      "technicalCue": "CREDENTIAL ACCESS: Mounting RDMA/Memory Cgroup v1 Controller & Resolving OverlayFS Host upperdir Path -> INITIAL ACCESS: Enabling notify_on_release=1 & Writing OverlayFS Host Path to release_agent -> DEFENSE EVASION: Child Cgroup Process Exit Triggering Kernel call_usermodehelper Execution on Host",
      "storyMappings": [
        {
          "storyTerm": "Master plumbing key held inside the storage room",
          "technicalTerm": "CAP_SYS_ADMIN capability (CapEff bit 21) granted to a privileged container",
          "tone": "amber"
        },
        {
          "storyTerm": "Old automated trash-chute control box",
          "technicalTerm": "Mounted Linux cgroup v1 hierarchy (rdma/memory) with release_agent file",
          "tone": "sky"
        },
        {
          "storyTerm": "Pinning a custom work order onto the empty-bin trigger",
          "technicalTerm": "Setting notify_on_release=1 and writing OverlayFS host upperdir path to release_agent",
          "tone": "rose"
        },
        {
          "storyTerm": "Chief engineer outside automatically running the order when empty",
          "technicalTerm": "Host kernel cgroup1_release_agent invoking call_usermodehelper as root on host",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-cgroup-escape-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master plumbing key held inside the…",
          "subtitle": "CAP_SYS_ADMIN capability (CapEff bit 21) granted to a…",
          "tone": "amber"
        },
        {
          "id": "cnt-cgroup-escape-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Old automated trash-chute control box",
          "subtitle": "Mounted Linux cgroup v1 hierarchy (rdma/memory) with…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Left",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Mounting RDMA/Memory Cgroup v1 Controller & Resolving OverlayFS Host upperdir Path",
          "storyExcerpt": "Using the oversized maintenance key left inside the room, the occupant attaches an older resource-control switchboard inside their workspace and reads the room wall stamp to learn the exact street…",
          "technicalParallel": "Under the hood, the observed step executes grep CapEff /proc/self/status (which executes the technical command / telemetry directive , grep CapEff /proc/self/status via System / Runtime Execution…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Tiny Sub-bin",
          "stageTag": "STAGE 02 · INITIAL ACCESS",
          "title": "Enabling notify_on_release=1 & Writing OverlayFS Host Path to release_agent",
          "storyExcerpt": "Next, the occupant builds a tiny sub-bin under the switchboard, flips the alert-when-empty toggle to on, and writes the hallway address of a custom command script straight into the master…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f release_agent -i (which executes the technical command / telemetry directive , ausearch -f release_agent -i via System / Runtime Execution…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. One-second Out",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Child Cgroup Process Exit Triggering Kernel call_usermodehelper Execution on Host",
          "storyExcerpt": "Finally, the occupant drops a one-second dummy worker into the tiny sub-bin and lets it step right back out. Seeing the bin go empty, the building central kernel outside automatically launches the…",
          "technicalParallel": "Under the hood, the observed step executes ps -ef --forest | grep kthreadd (which executes the technical command / telemetry directive , ps -ef --forest | grep kthreadd via System / Runtime Execution…",
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
          "label": "Storage Crate",
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
          "label": "Chute Trigger",
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
          "label": "Plumbing Key",
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
      "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-cgroup-escape-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Mounting RDMA/Memory Cgroup v1 Controller & Resolving OverlayFS Host upperdir Path",
      "storyCue": "Using the oversized maintenance key left inside the room, the occupant attaches an older resource-control switchboard inside their workspace and reads the room wall stamp to learn the exact street address of their room floor as seen from outside in the main hallway.",
      "technicalCue": "T1611 · CREDENTIAL ACCESS — Inside a container holding CAP_SYS_ADMIN (CapEff bit 21), the process mounts a cgroup v1 hierarchy (mount -t cgroup -o rdma cgroup /tmp/cgrp) and inspects /etc/mtab or /proc/mounts to locate…",
      "storyMappings": [
        {
          "storyTerm": "Oversized maintenance key left inside the room",
          "technicalTerm": "CAP_SYS_ADMIN Linux capability (CapEff bit 21) inside the container",
          "tone": "amber"
        },
        {
          "storyTerm": "Older resource-control switchboard",
          "technicalTerm": "Mounted cgroup v1 controller via mount -t cgroup -o rdma cgroup /tmp/cgrp",
          "tone": "sky"
        },
        {
          "storyTerm": "Exact street address as seen from the main hallway",
          "technicalTerm": "Host-side OverlayFS upperdir path parsed from /etc/mtab or /proc/mounts",
          "tone": "rose"
        },
        {
          "storyTerm": "Preparing the external callback target",
          "technicalTerm": "Locating where container-written scripts appear on the underlying host filesystem",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cgroup-escape-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Oversized maintenance key left inside…",
          "subtitle": "CAP_SYS_ADMIN Linux capability (CapEff bit 21) inside the…",
          "tone": "amber"
        },
        {
          "id": "cnt-cgroup-escape-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Older resource-control switchboard",
          "subtitle": "Mounted cgroup v1 controller via mount -t cgroup -o rdma…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Left",
          "stageTag": "STEP 01 · SETUP",
          "title": "Oversized maintenance key left inside the room",
          "storyExcerpt": "Using the oversized maintenance key left inside the room, the occupant attaches an older resource-control switchboard inside their workspace and reads the room wall stamp to learn the exact…",
          "technicalParallel": "Under the hood, the observed step executes grep CapEff /proc/self/status (which executes the technical command / telemetry directive , grep CapEff /proc/self/status via System / Runtime Execution…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Seen",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Older resource-control switchboard",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses older resource-control switchboard to advance toward exact street address as seen from the main hallway.",
          "technicalParallel": "Inside a container holding CAP_SYS_ADMIN (CapEff bit 21), the process mounts a cgroup v1 hierarchy (mount -t cgroup -o rdma cgroup /tmp/cgrp) and inspects /etc/mtab or /proc/mounts to locate the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Seen Main",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Preparing the external callback target",
          "storyExcerpt": "Behind the scenes, preparing the external callback target captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 165 (recording Syscall=sys_mount , 165, CgroupController=cgroup v1 , rdma / memory, RequiredCapability=CAP_SYS_ADMIN , CapEff 0x0000003fffffffff under T1611): Migrate…",
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
          "label": "Storage Crate",
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
          "label": "Chute Trigger",
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
          "label": "Plumbing Key",
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
      "mitreId": "T1611"
    },
    "step-2": {
      "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-cgroup-escape-step-2",
      "stageBadge": "STEP #2 · INITIAL ACCESS",
      "title": "Enabling notify_on_release=1 & Writing OverlayFS Host Path to release_agent",
      "storyCue": "Next, the occupant builds a tiny sub-bin under the switchboard, flips the alert-when-empty toggle to on, and writes the hallway address of a custom command script straight into the master automatic-cleanup slot.",
      "technicalCue": "T1611 · INITIAL ACCESS — The container creates a child cgroup (/tmp/cgrp/x), writes 1 into /tmp/cgrp/x/notify_on_release, and writes the resolved host OverlayFS path (/var/lib/docker/overlay2/<id>/diff/cmd) into the…",
      "storyMappings": [
        {
          "storyTerm": "Tiny sub-bin under the switchboard",
          "technicalTerm": "Child cgroup directory created at /tmp/cgrp/x",
          "tone": "amber"
        },
        {
          "storyTerm": "Flipping the alert-when-empty toggle to on",
          "technicalTerm": "Writing 1 into /tmp/cgrp/x/notify_on_release",
          "tone": "sky"
        },
        {
          "storyTerm": "Hallway address written into the cleanup slot",
          "technicalTerm": "Host OverlayFS upperdir script path written to /tmp/cgrp/release_agent",
          "tone": "rose"
        },
        {
          "storyTerm": "Custom command script waiting to run",
          "technicalTerm": "Executable payload script placed inside the container filesystem",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cgroup-escape-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Tiny sub-bin under the switchboard",
          "subtitle": "Child cgroup directory created at /tmp/cgrp/x",
          "tone": "amber"
        },
        {
          "id": "cnt-cgroup-escape-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flipping the alert-when-empty toggle to on",
          "subtitle": "Writing 1 into /tmp/cgrp/x/notify_on_release",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tiny Sub-bin",
          "stageTag": "STEP 02 · SETUP",
          "title": "Tiny sub-bin under the switchboard",
          "storyExcerpt": "Next, the occupant builds a tiny sub-bin under the switchboard, flips the alert-when-empty toggle to on, and writes the hallway address of a custom command script straight into the master…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f release_agent -i (which executes the technical command / telemetry directive , ausearch -f release_agent -i via System / Runtime Execution…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Slot",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flipping the alert-when-empty toggle to on",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flipping the alert-when-empty toggle to on to advance toward hallway address written into the cleanup slot.",
          "technicalParallel": "The container creates a child cgroup (/tmp/cgrp/x), writes 1 into /tmp/cgrp/x/notify_on_release, and writes the resolved host OverlayFS path (/var/lib/docker/overlay2/<id>/diff/cmd) into the root cgroup…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slot",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Custom command script waiting to run",
          "storyExcerpt": "Behind the scenes, custom command script waiting to run captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 1 (recording FalcoRule=Modify Cgroup Release Agent , CRITICAL, ModifiedCgroupFile=/tmp/cgrp/release_agent, RegisteredHostPath=/var/lib/docker/overlay2/9a8b/diff/diag.sh…",
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
          "label": "Storage Crate",
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
          "label": "Chute Trigger",
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
          "label": "Plumbing Key",
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
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "container-cap-sys-admin-cgroup-release-agent-notify-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-cgroup-escape-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Child Cgroup Process Exit Triggering Kernel call_usermodehelper Execution on Host",
      "storyCue": "Finally, the occupant drops a one-second dummy worker into the tiny sub-bin and lets it step right back out. Seeing the bin go empty, the building central kernel outside automatically launches the occupant cleanup script directly in the main hallway with full master keys.",
      "technicalCue": "T1611 · DEFENSE EVASION — When a short-lived process is placed into /tmp/cgrp/x/cgroup.procs and immediately exits, the Linux kernel cgroup1_release_agent workqueue invokes call_usermodehelper() in the root host…",
      "storyMappings": [
        {
          "storyTerm": "One-second dummy worker stepping into and out of the bin",
          "technicalTerm": "Short-lived process written to /tmp/cgrp/x/cgroup.procs and immediately exiting",
          "tone": "amber"
        },
        {
          "storyTerm": "Building central kernel seeing the bin go empty",
          "technicalTerm": "Linux kernel cgroup1_release_agent workqueue firing on zero active tasks",
          "tone": "sky"
        },
        {
          "storyTerm": "Launching the script directly in the main hallway",
          "technicalTerm": "Kernel call_usermodehelper executing the payload in the host root namespace",
          "tone": "rose"
        },
        {
          "storyTerm": "Complete escape to full master keys",
          "technicalTerm": "Arbitrary root command execution on the underlying container host",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cgroup-escape-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "One-second dummy worker stepping into…",
          "subtitle": "Short-lived process written to /tmp/cgrp/x/cgroup.procs and…",
          "tone": "amber"
        },
        {
          "id": "cnt-cgroup-escape-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Building central kernel seeing the bin…",
          "subtitle": "Linux kernel cgroup1_release_agent workqueue firing on zero…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One-second Out",
          "stageTag": "STEP 03 · SETUP",
          "title": "One-second dummy worker stepping into and out of the…",
          "storyExcerpt": "Finally, the occupant drops a one-second dummy worker into the tiny sub-bin and lets it step right back out.",
          "technicalParallel": "Under the hood, the observed step executes ps -ef --forest | grep kthreadd (which executes the technical command / telemetry directive , ps -ef --forest | grep kthreadd via System / Runtime Execution…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bin Go",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Building central kernel seeing the bin go empty",
          "storyExcerpt": "Seeing the bin go empty, the building central kernel outside automatically launches the occupant cleanup script directly in the main hallway with full master keys.",
          "technicalParallel": "When a short-lived process is placed into /tmp/cgrp/x/cgroup.procs and immediately exits, the Linux kernel cgroup1_release_agent workqueue invokes call_usermodehelper() in the root host namespace (PPID 2…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Complete escape to full master keys",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across complete escape to full master keys while locking down launching the script directly in the main hallway.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentKernelThread=PPID 2 , kthreadd -> call_usermodehelper, ExecutedOverlayPath=/var/lib/docker/overlay2/9a8b/diff/diag.sh, HostNamespaceUid=uid=0 , root…",
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
          "label": "Storage Crate",
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
          "label": "Chute Trigger",
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
          "label": "Plumbing Key",
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
      "mitreId": "T1611"
    }
  },
  "container-cap-sys-module-kernel-ko-insmod-load-audit": {
    "briefing": {
      "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-cap-sysmod-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1082",
      "title": "Container CAP_SYS_MODULE Host Kernel Module (finit_module) Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a skyscraper where every sealed tenant suite rides on the exact same central elevator engine in the basement. Discovering that their suite badge accidentally includes elevator-mechanic clearance, a tenant builds a homemade gear that fits the exact engine model, bolts it straight into the central basement machinery from inside their room, and trips a permanent red warning lamp on the skyscraper master engineering console.",
      "technicalCue": "CREDENTIAL ACCESS: Inspecting /proc/self/status CapEff Bit 16 (CAP_SYS_MODULE) & Host uname -r -> PERSISTENCE: Invoking finit_module (Syscall 313) / init_module (Syscall 175) via insmod -> DEFENSE EVASION: Host Kernel /proc/modules Taint Flag & dmesg Audit Correlation",
      "storyMappings": [
        {
          "storyTerm": "Elevator-mechanic clearance on a tenant badge",
          "technicalTerm": "CAP_SYS_MODULE capability (CapEff bit 16) in /proc/self/status",
          "tone": "amber"
        },
        {
          "storyTerm": "Homemade gear matching the exact engine model",
          "technicalTerm": "Compiled Linux kernel module (.ko) built for host uname -r version",
          "tone": "sky"
        },
        {
          "storyTerm": "Bolting the gear straight into the central basement machinery",
          "technicalTerm": "insmod invoking finit_module (syscall 313) or init_module (syscall 175)",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent red warning lamp on the engineering console",
          "technicalTerm": "Kernel taint flag (/proc/sys/kernel/tainted OOT_MODULE and UNSIGNED_MODULE bits)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-cap-sysmod-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Elevator-mechanic clearance on a tenant…",
          "subtitle": "CAP_SYS_MODULE capability (CapEff bit 16) in /proc/self/status",
          "tone": "amber"
        },
        {
          "id": "cnt-cap-sysmod-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Homemade gear matching the exact engine…",
          "subtitle": "Compiled Linux kernel module (.ko) built for host uname -r…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. List",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Inspecting /proc/self/status CapEff Bit 16 (CAP_SYS_MODULE) & Host uname -r",
          "storyExcerpt": "Inside the sealed tenant suite, the intruder checks their badge stamp list and the central elevator nameplate, discovering both that they hold rare engine-room installation rights and the exact make and…",
          "technicalParallel": "Under the hood, the observed step executes capsh --decode=00000000a80525fb (which executes a Kubernetes API request or container runtime command , capsh --decode=00000000a80525fb configuring pod security…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Gear",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Invoking finit_module (Syscall 313) / init_module (Syscall 175) via insmod",
          "storyExcerpt": "Fashioning a custom metal gear tailored to that exact engine model, the intruder feeds it through the basement installation slot straight into the spinning central elevator core, immediately bypassing…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc init_module,finit_module,delete_module -i (which executes the technical command / telemetry directive , ausearch -sc…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Gear",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Host Kernel /proc/modules Taint Flag & dmesg Audit Correlation",
          "storyExcerpt": "The instant an uncertified foreign gear snaps into the central machinery, the skyscraper master dashboard lights up two unmistakable warning lamps and logs the exact part name in the permanent engine…",
          "technicalParallel": "Under the hood, the observed step executes cat /proc/sys/kernel/tainted && lsmod | head -n 10 (which executes the technical command / telemetry directive , cat /proc/sys/kernel/tainted && lsmod | head -n…",
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
          "label": "Tenant Crate",
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
          "label": "Engine Core",
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
          "label": "Module Load",
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
      "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-cap-sysmod-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Inspecting /proc/self/status CapEff Bit 16 (CAP_SYS_MODULE) & Host uname -r",
      "storyCue": "Inside the sealed tenant suite, the intruder checks their badge stamp list and the central elevator nameplate, discovering both that they hold rare engine-room installation rights and the exact make and model of the shared basement engine.",
      "technicalCue": "T1082 · CREDENTIAL ACCESS — Because all containers on a Linux node share the same host kernel, a container process checks /proc/self/status for CapEff bit 16 (0x0000000000010000 = CAP_SYS_MODULE) and runs uname -r to…",
      "storyMappings": [
        {
          "storyTerm": "Checking the badge stamp list",
          "technicalTerm": "Reading /proc/self/status to confirm CapEff bit 16 (CAP_SYS_MODULE)",
          "tone": "amber"
        },
        {
          "storyTerm": "Central elevator nameplate",
          "technicalTerm": "Host Linux kernel version string discovered via uname -r",
          "tone": "sky"
        },
        {
          "storyTerm": "Shared basement engine beneath every suite",
          "technicalTerm": "Single Linux host kernel shared across all running containers on the node",
          "tone": "rose"
        },
        {
          "storyTerm": "Rare engine-room installation rights",
          "technicalTerm": "Privilege allowing a container to insert Ring-0 kernel code into the host",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cap-sysmod-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Checking the badge stamp list",
          "subtitle": "Reading /proc/self/status to confirm CapEff bit 16…",
          "tone": "amber"
        },
        {
          "id": "cnt-cap-sysmod-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Central elevator nameplate",
          "subtitle": "Host Linux kernel version string discovered via uname -r",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. List",
          "stageTag": "STEP 01 · SETUP",
          "title": "Checking the badge stamp list",
          "storyExcerpt": "Inside the sealed tenant suite, the intruder checks their badge stamp list and the central elevator nameplate, discovering both that they hold rare engine-room installation rights and the exact…",
          "technicalParallel": "Under the hood, the observed step executes capsh --decode=00000000a80525fb (which executes a Kubernetes API request or container runtime command , capsh --decode=00000000a80525fb configuring pod security…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Central elevator nameplate",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses central elevator nameplate to advance toward shared basement engine beneath every suite.",
          "technicalParallel": "Because all containers on a Linux node share the same host kernel, a container process checks /proc/self/status for CapEff bit 16 (0x0000000000010000 = CAP_SYS_MODULE) and runs uname -r to match the host…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rare",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Rare engine-room installation rights",
          "storyExcerpt": "Behind the scenes, rare engine-room installation rights captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 63 (recording DetectedCapability=CAP_SYS_MODULE , Bit 16, PodIdentity=default/legacy-net-agent, SensorSource=Cilium Tetragon eBPF under T1082): Enforce Kubernetes Pod…",
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
          "label": "Tenant Crate",
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
          "label": "Engine Core",
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
          "label": "Module Load",
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
      "mitreId": "T1082"
    },
    "step-2": {
      "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-cap-sysmod-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Invoking finit_module (Syscall 313) / init_module (Syscall 175) via insmod",
      "storyCue": "Fashioning a custom metal gear tailored to that exact engine model, the intruder feeds it through the basement installation slot straight into the spinning central elevator core, immediately bypassing every wall separating the suite from the rest of the building.",
      "technicalCue": "T1547.006 · PERSISTENCE — The container process executes insmod /tmp/net_diag.ko, which invokes sys_finit_module (syscall 313) or sys_init_module (syscall 175) to load the ELF relocatable kernel object directly into…",
      "storyMappings": [
        {
          "storyTerm": "Custom metal gear tailored to the engine",
          "technicalTerm": "Malicious kernel object /tmp/net_diag.ko compiled for the host kernel",
          "tone": "amber"
        },
        {
          "storyTerm": "Feeding it through the installation slot",
          "technicalTerm": "Executing insmod /tmp/net_diag.ko invoking finit_module (313) or init_module (175)",
          "tone": "sky"
        },
        {
          "storyTerm": "Spinning central elevator core",
          "technicalTerm": "Host Linux kernel Ring-0 execution space with total control over all nodes",
          "tone": "rose"
        },
        {
          "storyTerm": "Bypassing every suite wall at once",
          "technicalTerm": "Full container escape executing privileged kernel-space callbacks on the host",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cap-sysmod-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Custom metal gear tailored to the engine",
          "subtitle": "Malicious kernel object /tmp/net_diag.ko compiled for the host…",
          "tone": "amber"
        },
        {
          "id": "cnt-cap-sysmod-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Feeding it through the installation slot",
          "subtitle": "Executing insmod /tmp/net_diag.ko invoking finit_module (313)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gear",
          "stageTag": "STEP 02 · SETUP",
          "title": "Custom metal gear tailored to the engine",
          "storyExcerpt": "Fashioning a custom metal gear tailored to that exact engine model, the intruder feeds it through the basement installation slot straight into the spinning central elevator core, immediately…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc init_module,finit_module,delete_module -i (which executes the technical command / telemetry directive , ausearch -sc…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. It Slot",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Feeding it through the installation slot",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses feeding it through the installation slot to advance toward spinning central elevator core.",
          "technicalParallel": "The container process executes insmod /tmp/net_diag.ko, which invokes sys_finit_module (syscall 313) or sys_init_module (syscall 175) to load the ELF relocatable kernel object directly into host Ring-0…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Core",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Bypassing every suite wall at once",
          "storyExcerpt": "Behind the scenes, bypassing every suite wall at once captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 313 (recording Syscall=sys_finit_module , 313, LoadedModulePath=/tmp/net_diag.ko , Container OverlayFS, AuditRuleKey=kernel_module_load under T1547.006): Enable…",
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
          "label": "Tenant Crate",
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
          "label": "Engine Core",
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
          "label": "Module Load",
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
      "mitreId": "T1547.006"
    },
    "step-3": {
      "scenarioId": "container-cap-sys-module-kernel-ko-insmod-load-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-cap-sysmod-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Host Kernel /proc/modules Taint Flag & dmesg Audit Correlation",
      "storyCue": "The instant an uncertified foreign gear snaps into the central machinery, the skyscraper master dashboard lights up two unmistakable warning lamps and logs the exact part name in the permanent engine diary for safety inspectors to audit.",
      "technicalCue": "T1014 · DEFENSE EVASION — Loading an unsigned out-of-tree module sets the kernel taint flag (/proc/sys/kernel/tainted bit 12 O = OOT_MODULE and bit 13 E = UNSIGNED_MODULE) and logs a kernel ring-buffer message in…",
      "storyMappings": [
        {
          "storyTerm": "Two unmistakable warning lamps on the master dashboard",
          "technicalTerm": "/proc/sys/kernel/tainted bit 12 (O = OOT_MODULE) and bit 13 (E = UNSIGNED_MODULE)",
          "tone": "amber"
        },
        {
          "storyTerm": "Permanent engine diary",
          "technicalTerm": "Host /proc/modules list and kernel dmesg ring-buffer audit entries",
          "tone": "sky"
        },
        {
          "storyTerm": "Uncertified foreign gear",
          "technicalTerm": "Unsigned out-of-tree kernel module loaded without lockdown signature verification",
          "tone": "rose"
        },
        {
          "storyTerm": "Safety inspectors spotting the tampering",
          "technicalTerm": "CNCF Tetragon eBPF runtime policy blocking or alerting on sys_finit_module",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-cap-sysmod-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Two unmistakable warning lamps on the…",
          "subtitle": "/proc/sys/kernel/tainted bit 12 (O = OOT_MODULE) and bit 13 (E…",
          "tone": "amber"
        },
        {
          "id": "cnt-cap-sysmod-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Permanent engine diary",
          "subtitle": "Host /proc/modules list and kernel dmesg ring-buffer audit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gear Up",
          "stageTag": "STEP 03 · SETUP",
          "title": "Two unmistakable warning lamps on the master dashboard",
          "storyExcerpt": "The instant an uncertified foreign gear snaps into the central machinery, the skyscraper master dashboard lights up two unmistakable warning lamps and logs the exact part name in the permanent…",
          "technicalParallel": "Under the hood, the observed step executes cat /proc/sys/kernel/tainted && lsmod | head -n 10 (which executes the technical command / telemetry directive , cat /proc/sys/kernel/tainted && lsmod | head -n…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gear",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Permanent engine diary",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses permanent engine diary to advance toward uncertified foreign gear.",
          "technicalParallel": "Loading an unsigned out-of-tree module sets the kernel taint flag (/proc/sys/kernel/tainted bit 12 O = OOT_MODULE and bit 13 E = UNSIGNED_MODULE) and logs a kernel ring-buffer message in dmesg/journald…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gear",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Safety inspectors spotting the tampering",
          "storyExcerpt": "Behind the scenes, safety inspectors spotting the tampering captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 0 (recording KernelTaintMask=/proc/sys/kernel/tainted = 12288 , OOT + UNSIGNED, ModuleEntry=/proc/modules -> net_diag, ContainmentAction=Isolate & cordon Kubernetes worker…",
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
          "label": "Tenant Crate",
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
          "label": "Engine Core",
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
          "label": "Module Load",
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
      "mitreId": "T1014"
    }
  },
  "docker-buildkit-runc-cache-mount-race-cve-2024-23651": {
    "briefing": {
      "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
      "sectionKey": "briefing",
      "sceneKind": "cnt-buildkit-race-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1610",
      "title": "BuildKit RUN --mount=type=cache Race Condition Audit (CVE-2024-23651) — Story-to-Technical Overview",
      "storyCue": "Imagine an automated assembly plant running two conveyor lines side by side that share one unlocked parts cubby. In the split second after the safety inspector checks that the cubby shelf stays inside the safe zone and right before the second conveyor locks onto it, a worker on the first belt swaps the shelf sign for a hidden shortcut door into the plant central vault, letting the second belt open the main factory floor straight inside its work cage.",
      "technicalCue": "INITIAL ACCESS: Parallel BuildKit Stages Sharing a Cache Mount ID (--mount=type=cache,id=shared) -> INITIAL ACCESS: TOCTOU Symlink Replacement Between Subpath Verification & Host sys_mount() -> DEFENSE EVASION: Builder Host Filesystem Access Inside Build Container Mount Point",
      "storyMappings": [
        {
          "storyTerm": "Two side-by-side conveyor lines sharing one parts cubby",
          "technicalTerm": "Parallel BuildKit stages sharing a --mount=type=cache,id=shared cache directory",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapping the shelf sign between inspection and latching",
          "technicalTerm": "TOCTOU symlink replacement race between buildkitd subpath check and sys_mount() (CVE-2024-23651)",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden shortcut door into the plant central vault",
          "technicalTerm": "Symlink redirecting the host mount source to the builder host root filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Main factory floor opened inside the work cage",
          "technicalTerm": "Builder host filesystem exposed read/write inside an unprivileged build container",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-buildkit-race-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Two side-by-side conveyor lines sharing…",
          "subtitle": "Parallel BuildKit stages sharing a…",
          "tone": "amber"
        },
        {
          "id": "cnt-buildkit-race-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Swapping the shelf sign between…",
          "subtitle": "TOCTOU symlink replacement race between buildkitd subpath…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Two Side-by-side",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Parallel BuildKit Stages Sharing a Cache Mount ID (--mount=type=cache,id=shared)",
          "storyExcerpt": "During a multi-stage assembly job, the intruder schedules two parallel work crews to grab the exact same shared supply cubby at the exact same moment, setting up a timing race inside the build workshop.",
          "technicalParallel": "Under the hood, the observed step executes buildctl --version (which executes the technical command / telemetry directive , buildctl --version via System / Runtime Execution Interface, passing the exact…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Sign",
          "stageTag": "STAGE 02 · INITIAL ACCESS",
          "title": "TOCTOU Symlink Replacement Between Subpath Verification & Host sys_mount()",
          "storyExcerpt": "The factory inspector checks the cubby doorway and verifies it points safely inside the supply closet, then turns away for a fraction of a second to pull the mounting lever. In that tiny blink, the first…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc symlink,symlinkat,mount -ts recent -i (which executes the technical command / telemetry directive , ausearch -sc symlink,symlinkat,mount -ts recent…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Main",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Builder Host Filesystem Access Inside Build Container Mount Point",
          "storyExcerpt": "When the second assembly crew steps into its work booth, its ordinary supply shelf opens straight onto the main factory floor, allowing the crew to read builder secrets or tamper with other tenants…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/shadow -f /var/lib/buildkit -i (which executes the technical command / telemetry directive , ausearch -f /etc/shadow -f /var/lib/buildkit -i…",
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
          "label": "Twin Belts",
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
          "label": "Host Cubby",
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
          "label": "Sign Swap",
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
      "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
      "sectionKey": "step-1",
      "sceneKind": "cnt-buildkit-race-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Parallel BuildKit Stages Sharing a Cache Mount ID (--mount=type=cache,id=shared)",
      "storyCue": "During a multi-stage assembly job, the intruder schedules two parallel work crews to grab the exact same shared supply cubby at the exact same moment, setting up a timing race inside the build workshop.",
      "technicalCue": "T1610 · INITIAL ACCESS — When docker buildx build processes a multi-stage Dockerfile or Low-Level Builder (LLB) graph, two concurrent stages mount the same BuildKit cache ID (--mount=type=cache,id=shared,subpath=sub)…",
      "storyMappings": [
        {
          "storyTerm": "Multi-stage assembly job",
          "technicalTerm": "Multi-stage Dockerfile or LLB graph processed by docker buildx build",
          "tone": "amber"
        },
        {
          "storyTerm": "Two parallel work crews grabbing the same cubby",
          "technicalTerm": "Concurrent RUN --mount=type=cache,id=shared stages executing simultaneously",
          "tone": "sky"
        },
        {
          "storyTerm": "Shared supply cubby",
          "technicalTerm": "Host-backed BuildKit cache mount directory shared across concurrent steps",
          "tone": "rose"
        },
        {
          "storyTerm": "Setting up a timing race",
          "technicalTerm": "Concurrent execution window required to trigger CVE-2024-23651",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-buildkit-race-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Multi-stage assembly job",
          "subtitle": "Multi-stage Dockerfile or LLB graph processed by docker buildx…",
          "tone": "amber"
        },
        {
          "id": "cnt-buildkit-race-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Two parallel work crews grabbing the…",
          "subtitle": "Concurrent RUN --mount=type=cache,id=shared stages executing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Job Two",
          "stageTag": "STEP 01 · SETUP",
          "title": "Multi-stage assembly job",
          "storyExcerpt": "During a multi-stage assembly job, the intruder schedules two parallel work crews to grab the exact same shared supply cubby at the exact same moment, setting up a timing race inside the build…",
          "technicalParallel": "Under the hood, the observed step executes buildctl --version (which executes the technical command / telemetry directive , buildctl --version via System / Runtime Execution Interface, passing the exact…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Two Work",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Two parallel work crews grabbing the same cubby",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses two parallel work crews grabbing the same cubby to advance toward shared supply cubby.",
          "technicalParallel": "When docker buildx build processes a multi-stage Dockerfile or Low-Level Builder (LLB) graph, two concurrent stages mount the same BuildKit cache ID (--mount=type=cache,id=shared,subpath=sub) (logged in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Race",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Setting up a timing race",
          "storyExcerpt": "Behind the scenes, setting up a timing race captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording DaemonProcess=buildkitd , <= v0.12.4, MountDirective=RUN --mount=type=cache,id=shared,subpath=target, VulnerabilityId=CVE-2024-23651 , Leaky Vessels under…",
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
          "label": "Twin Belts",
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
          "label": "Host Cubby",
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
          "label": "Sign Swap",
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
      "mitreId": "T1610"
    },
    "step-2": {
      "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
      "sectionKey": "step-2",
      "sceneKind": "cnt-buildkit-race-step-2",
      "stageBadge": "STEP #2 · INITIAL ACCESS",
      "title": "TOCTOU Symlink Replacement Between Subpath Verification & Host sys_mount()",
      "storyCue": "The factory inspector checks the cubby doorway and verifies it points safely inside the supply closet, then turns away for a fraction of a second to pull the mounting lever. In that tiny blink, the first crew swaps the cubby doorway plate with a shortcut sign pointing straight to the main factory lobby.",
      "technicalCue": "T1611 · INITIAL ACCESS — In vulnerable BuildKit versions, buildkitd checked the cache subpath on the host before invoking the mount() syscall.",
      "storyMappings": [
        {
          "storyTerm": "Inspector verifying the doorway before pulling the lever",
          "technicalTerm": "Vulnerable buildkitd checking cache subpath prior to calling sys_mount()",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapping the doorway plate in a split-second blink",
          "technicalTerm": "Time-of-Check to Time-of-Use (TOCTOU) race replacing subpath with a symlink",
          "tone": "sky"
        },
        {
          "storyTerm": "Shortcut sign pointing to the main lobby",
          "technicalTerm": "Malicious symlink targeting the underlying BuildKit host root directory",
          "tone": "rose"
        },
        {
          "storyTerm": "Pulling the mounting lever blindly",
          "technicalTerm": "Host kernel mount() syscall following the swapped symlink into the container",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-buildkit-race-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Inspector verifying the doorway before…",
          "subtitle": "Vulnerable buildkitd checking cache subpath prior to calling…",
          "tone": "amber"
        },
        {
          "id": "cnt-buildkit-race-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Swapping the doorway plate in a…",
          "subtitle": "Time-of-Check to Time-of-Use (TOCTOU) race replacing subpath…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Then",
          "stageTag": "STEP 02 · SETUP",
          "title": "Inspector verifying the doorway before pulling the…",
          "storyExcerpt": "The factory inspector checks the cubby doorway and verifies it points safely inside the supply closet, then turns away for a fraction of a second to pull the mounting lever.",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc symlink,symlinkat,mount -ts recent -i (which executes the technical command / telemetry directive , ausearch -sc symlink,symlinkat,mount -ts recent…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tiny Crew",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Swapping the doorway plate in a split-second blink",
          "storyExcerpt": "In that tiny blink, the first crew swaps the cubby doorway plate with a shortcut sign pointing straight to the main factory lobby.",
          "technicalParallel": "In vulnerable BuildKit versions, buildkitd checked the cache subpath on the host before invoking the mount() syscall.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Sign Main",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Pulling the mounting lever blindly",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across pulling the mounting lever blindly while locking down shortcut sign pointing to the main lobby.",
          "technicalParallel": "Documented in Linux Audit Event 266 (recording RaceConditionType=TOCTOU Symlink Swap on Cache Mount Subpath, Syscall=sys_symlinkat , 266 + sys_mount , 165, AdvisoryReference=GHSA-m3r6-h7wv-7xxv /…",
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
          "label": "Twin Belts",
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
          "label": "Host Cubby",
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
          "label": "Sign Swap",
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
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "docker-buildkit-runc-cache-mount-race-cve-2024-23651",
      "sectionKey": "step-3",
      "sceneKind": "cnt-buildkit-race-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Builder Host Filesystem Access Inside Build Container Mount Point",
      "storyCue": "When the second assembly crew steps into its work booth, its ordinary supply shelf opens straight onto the main factory floor, allowing the crew to read builder secrets or tamper with other tenants assembly jobs right from inside an untrusted build step.",
      "technicalCue": "T1611 · DEFENSE EVASION — When the second build step starts, its cache mount point inside the container is bound to the builder host root filesystem, which defenders detect via eBPF mount-namespace mismatch sensors and…",
      "storyMappings": [
        {
          "storyTerm": "Supply shelf opening onto the main factory floor",
          "technicalTerm": "Container cache mount point bound directly to the builder host root filesystem",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading builder secrets from an untrusted build step",
          "technicalTerm": "Exfiltrating CI runner credentials, signing keys, and host /etc files during build",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampering with other tenants assembly jobs",
          "technicalTerm": "Cross-tenant build poisoning on shared CI/CD Docker BuildKit infrastructure",
          "tone": "rose"
        },
        {
          "storyTerm": "Upgrading the safety latch",
          "technicalTerm": "Patched BuildKit using safe file-descriptor-anchored mounts eliminating TOCTOU",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-buildkit-race-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Supply shelf opening onto the main…",
          "subtitle": "Container cache mount point bound directly to the builder host…",
          "tone": "amber"
        },
        {
          "id": "cnt-buildkit-race-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Reading builder secrets from an…",
          "subtitle": "Exfiltrating CI runner credentials, signing keys, and host…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Main",
          "stageTag": "STEP 03 · SETUP",
          "title": "Supply shelf opening onto the main factory floor",
          "storyExcerpt": "When the second assembly crew steps into its work booth, its ordinary supply shelf opens straight onto the main factory floor, allowing the crew to read builder secrets or tamper with other…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/shadow -f /var/lib/buildkit -i (which executes the technical command / telemetry directive , ausearch -f /etc/shadow -f /var/lib/buildkit -i…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Jobs",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Reading builder secrets from an untrusted build step",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses reading builder secrets from an untrusted build step to advance toward tampering with other tenants assembly jobs.",
          "technicalParallel": "When the second build step starts, its cache mount point inside the container is bound to the builder host root filesystem, which defenders detect via eBPF mount-namespace mismatch sensors and host file…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Jobs",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Upgrading the safety latch",
          "storyExcerpt": "Behind the scenes, upgrading the safety latch captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording EscapedMountTarget=/mnt/cache -> Host Root , dev=08:01, DetectionSensor=Linux auditd & eBPF Mount Namespace Audit, RemediationVersion=BuildKit >= v0.12.5 /…",
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
          "label": "Twin Belts",
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
          "label": "Host Cubby",
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
          "label": "Sign Swap",
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
      "mitreId": "T1611"
    }
  },
  "docker-engine-unauthenticated-tcp-2375-api-socket-audit": {
    "briefing": {
      "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-docker-2375-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1613",
      "title": "Exposed Docker Daemon TCP Port 2375 API & Host Bind-Mount Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a massive robotic warehouse whose master crane control console is wired onto an open hallway radio channel with no padlock or badge check. An outsider spots the open radio channel, orders the crane to drop a wide-open glass booth with a direct door into the warehouse main vault, and steps through that doorway to plant permanent maintenance schedules on the warehouse master wall.",
      "technicalCue": "CREDENTIAL ACCESS: Unauthenticated Docker Engine REST API Discovery (GET /v1.43/version & /containers/json) -> EXECUTION: POST /containers/create with HostConfig.Binds [\"/:/hostfs\"] & Privileged=true -> INITIAL ACCESS: Host Root Filesystem chroot (/hostfs) & Cron/SSH Persistence Audit",
      "storyMappings": [
        {
          "storyTerm": "Master crane console wired onto an open hallway radio channel",
          "technicalTerm": "Unauthenticated Docker daemon (dockerd) listening on TCP port 2375 without TLS",
          "tone": "amber"
        },
        {
          "storyTerm": "Ordering a glass booth with a direct door into the main vault",
          "technicalTerm": "POST /v1.43/containers/create with Privileged=true and Binds [\"/:/hostfs\"]",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping straight into the warehouse main floor",
          "technicalTerm": "Container entrypoint running chroot /hostfs /bin/sh on the host root filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Planting permanent schedules on the master wall",
          "technicalTerm": "Writing host cron jobs or SSH authorized_keys for persistent root access",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-docker-2375-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master crane console wired onto an open…",
          "subtitle": "Unauthenticated Docker daemon (dockerd) listening on TCP port…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-2375-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Ordering a glass booth with a direct…",
          "subtitle": "POST /v1.43/containers/create with Privileged=true and Binds…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Open",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Unauthenticated Docker Engine REST API Discovery (GET /v1.43/version & /containers/json)",
          "storyExcerpt": "Scanning the warehouse hallways for open control panels, the intruder tunes into an unlocked crane radio channel that immediately replies with the crane exact model number and a complete inventory of…",
          "technicalParallel": "Under the hood, the observed step executes ss -tulpn | grep 2375 (which executes the technical command / telemetry directive , ss -tulpn | grep 2375 via System / Runtime Execution Interface, passing the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Door Main",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "POST /containers/create with HostConfig.Binds [\"/:/hostfs\"] & Privileged=true",
          "storyExcerpt": "Speaking directly into the unlocked crane console, the intruder orders the crane to lower a lightweight utility box onto the floor with all safety bars removed and its entire back wall hinged directly…",
          "technicalParallel": "Under the hood, the observed step executes docker inspect <container_id> --format \"{{json .HostConfig.Binds}} Privileged={{.HostConfig.Privileged}}\" (which executes a Kubernetes API request or container…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Back Wall",
          "stageTag": "STAGE 03 · INITIAL ACCESS",
          "title": "Host Root Filesystem chroot (/hostfs) & Cron/SSH Persistence Audit",
          "storyExcerpt": "Once the utility box lands on the floor, the intruder steps through the hinged back wall straight onto the warehouse master floor, adding their own spare front-door key and repeating daily work order…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/crontab -i (which executes the technical command / telemetry directive , ausearch -f /etc/crontab -i via crontab, passing the exact arguments…",
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
          "label": "Crane Radio",
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
          "label": "Glass Booth",
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
          "label": "Remote Order",
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
      "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-docker-2375-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Unauthenticated Docker Engine REST API Discovery (GET /v1.43/version & /containers/json)",
      "storyCue": "Scanning the warehouse hallways for open control panels, the intruder tunes into an unlocked crane radio channel that immediately replies with the crane exact model number and a complete inventory of every cargo box currently running on the floor.",
      "technicalCue": "T1613 · CREDENTIAL ACCESS — When dockerd is started with -H tcp://0.0.0.0:2375 without TLS (--tlsverify), any network client can reach the REST API over cleartext HTTP.",
      "storyMappings": [
        {
          "storyTerm": "Unlocked crane radio channel",
          "technicalTerm": "dockerd started with -H tcp://0.0.0.0:2375 and no --tlsverify flag",
          "tone": "amber"
        },
        {
          "storyTerm": "Crane model number and floor inventory",
          "technicalTerm": "Unauthenticated GET /v1.43/version and GET /v1.43/containers/json responses",
          "tone": "sky"
        },
        {
          "storyTerm": "Zero padlock or badge check",
          "technicalTerm": "Cleartext HTTP REST API granting equivalent host root authority to any caller",
          "tone": "rose"
        },
        {
          "storyTerm": "Scanning the warehouse hallways",
          "technicalTerm": "External or lateral network reconnaissance targeting TCP port 2375",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-2375-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unlocked crane radio channel",
          "subtitle": "dockerd started with -H tcp://0.0.0.0:2375 and no --tlsverify…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-2375-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Crane model number and floor inventory",
          "subtitle": "Unauthenticated GET /v1.43/version and GET…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unlocked crane radio channel",
          "storyExcerpt": "Scanning the warehouse hallways for open control panels, the intruder tunes into an unlocked crane radio channel that immediately replies with the crane exact model number and a complete…",
          "technicalParallel": "Under the hood, the observed step executes ss -tulpn | grep 2375 (which executes the technical command / telemetry directive , ss -tulpn | grep 2375 via System / Runtime Execution Interface, passing the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Zero",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Crane model number and floor inventory",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses crane model number and floor inventory to advance toward zero padlock or badge check.",
          "technicalParallel": "When dockerd is started with -H tcp://0.0.0.0:2375 without TLS (--tlsverify), any network client can reach the REST API over cleartext HTTP.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zero",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Scanning the warehouse hallways",
          "storyExcerpt": "Behind the scenes, scanning the warehouse hallways captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording DaemonSocket=tcp://0.0.0.0:2375 , Unencrypted HTTP, RestEndpoint=GET /v1.43/version, RemoteClient=198.51.100.55:49210 under T1613): Never bind dockerd to…",
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
          "label": "Crane Radio",
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
          "label": "Glass Booth",
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
          "label": "Remote Order",
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
      "mitreId": "T1613"
    },
    "step-2": {
      "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-docker-2375-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "POST /containers/create with HostConfig.Binds [\"/:/hostfs\"] & Privileged=true",
      "storyCue": "Speaking directly into the unlocked crane console, the intruder orders the crane to lower a lightweight utility box onto the floor with all safety bars removed and its entire back wall hinged directly onto the warehouse master storage room.",
      "technicalCue": "T1610 · EXECUTION — The remote client sends POST /v1.43/containers/create specifying an Alpine image, HostConfig.Privileged=true, and HostConfig.Binds=[\"/:/hostfs:rw\"], followed by POST /containers/<id>/start…",
      "storyMappings": [
        {
          "storyTerm": "Lightweight utility box",
          "technicalTerm": "Minimal Alpine Linux container image specified in POST /containers/create",
          "tone": "amber"
        },
        {
          "storyTerm": "Safety bars removed",
          "technicalTerm": "HostConfig.Privileged=true disabling Linux capability and device restrictions",
          "tone": "sky"
        },
        {
          "storyTerm": "Back wall hinged directly onto the master storage room",
          "technicalTerm": "HostConfig.Binds [\"/:/hostfs\"] bind-mounting the entire host root filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Crane obeying without question",
          "technicalTerm": "Docker daemon executing as root creating and starting the breakout container",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-2375-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Lightweight utility box",
          "subtitle": "Minimal Alpine Linux container image specified in POST…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-2375-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Safety bars removed",
          "subtitle": "HostConfig.Privileged=true disabling Linux capability and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Box Onto",
          "stageTag": "STEP 02 · SETUP",
          "title": "Lightweight utility box",
          "storyExcerpt": "Speaking directly into the unlocked crane console, the intruder orders the crane to lower a lightweight utility box onto the floor with all safety bars removed and its entire back wall hinged…",
          "technicalParallel": "Under the hood, the observed step executes docker inspect <container_id> --format \"{{json .HostConfig.Binds}} Privileged={{.HostConfig.Privileged}}\" (which executes a Kubernetes API request or container…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bars",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Safety bars removed",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses safety bars removed to advance toward back wall hinged directly onto the master storage room.",
          "technicalParallel": "The remote client sends POST /v1.43/containers/create specifying an Alpine image, HostConfig.Privileged=true, and HostConfig.Binds=[\"/:/hostfs:rw\"], followed by POST /containers/<id>/start (logged in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back Wall",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Crane obeying without question",
          "storyExcerpt": "Behind the scenes, crane obeying without question captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording ApiAction=POST /v1.43/containers/create, HostBindMount=/:/hostfs:rw, PrivilegedFlag=true under T1610): Deploy OPA Gatekeeper / Docker Authorization Plugins…",
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
          "label": "Crane Radio",
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
          "label": "Glass Booth",
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
          "label": "Remote Order",
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
      "mitreId": "T1610"
    },
    "step-3": {
      "scenarioId": "docker-engine-unauthenticated-tcp-2375-api-socket-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-docker-2375-step-3",
      "stageBadge": "STEP #3 · INITIAL ACCESS",
      "title": "Host Root Filesystem chroot (/hostfs) & Cron/SSH Persistence Audit",
      "storyCue": "Once the utility box lands on the floor, the intruder steps through the hinged back wall straight onto the warehouse master floor, adding their own spare front-door key and repeating daily work order directly onto the building permanent host schedules.",
      "technicalCue": "T1611 · INITIAL ACCESS — Inside the started container, the entrypoint executes chroot /hostfs /bin/sh to operate directly inside the host root filesystem as UID 0, modifying /etc/crontab or /root/.ssh/authorized_keys…",
      "storyMappings": [
        {
          "storyTerm": "Stepping through the hinged back wall",
          "technicalTerm": "Executing chroot /hostfs /bin/sh to switch root to the host OS",
          "tone": "amber"
        },
        {
          "storyTerm": "Adding a spare front-door key",
          "technicalTerm": "Appending attacker public keys to host /root/.ssh/authorized_keys",
          "tone": "sky"
        },
        {
          "storyTerm": "Adding a repeating daily work order",
          "technicalTerm": "Installing malicious host cron tasks under /etc/cron.d or /var/spool/cron",
          "tone": "rose"
        },
        {
          "storyTerm": "Warehouse floor audit trail",
          "technicalTerm": "Host dockerd audit logs and file integrity alerts on /etc/cron* and ~/.ssh",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-2375-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Stepping through the hinged back wall",
          "subtitle": "Executing chroot /hostfs /bin/sh to switch root to the host OS",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-2375-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Adding a spare front-door key",
          "subtitle": "Appending attacker public keys to host…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back Wall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Stepping through the hinged back wall",
          "storyExcerpt": "Once the utility box lands on the floor, the intruder steps through the hinged back wall straight onto the warehouse master floor, adding their own spare front-door key and repeating daily work…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/crontab -i (which executes the technical command / telemetry directive , ausearch -f /etc/crontab -i via crontab, passing the exact arguments…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Adding a spare front-door key",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses adding a spare front-door key to advance toward adding a repeating daily work order.",
          "technicalParallel": "Inside the started container, the entrypoint executes chroot /hostfs /bin/sh to operate directly inside the host root filesystem as UID 0, modifying /etc/crontab or /root/.ssh/authorized_keys, which…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Work",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Warehouse floor audit trail",
          "storyExcerpt": "Behind the scenes, warehouse floor audit trail captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 161 (recording Syscall=sys_chroot , 161, TargetRootPath=/hostfs , Host Root /, FalcoAlert=Launch Privileged Container & Host Root Mount under T1611): Enable user…",
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
          "label": "Crane Radio",
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
          "label": "Glass Booth",
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
          "label": "Remote Order",
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
      "mitreId": "T1611"
    }
  },
  "docker-oci-registry-manifest-layer-poisoning-cosign-audit": {
    "briefing": {
      "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-oci-cosign-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1525",
      "title": "OCI Container Registry Layer Tampering & Image Digest Verification Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a central factory parts depot where finished software crates are stacked from numbered modular layers and labeled with movable shipping tags. A thief using a stolen warehouse push badge slips a tampered top layer onto the shelf and moves the floating production tag onto the poisoned stack, until the loading-dock cryptographic seal inspector detects the missing official wax stamp and blocks the tampered crate before it can enter the live factory floor.",
      "technicalCue": "PERSISTENCE: Uploading Modified OCI Layer Blob via POST /v2/<repo>/blobs/uploads/ -> DEFENSE EVASION: Overwriting Mutable Image Tag via PUT /v2/<repo>/manifests/prod -> INITIAL ACCESS: Admission Controller Sigstore Cosign Signature Verification & Layer Diff Forensics",
      "storyMappings": [
        {
          "storyTerm": "Slipping a tampered modular layer onto the warehouse shelf",
          "technicalTerm": "Uploading trojanized OCI layer blob via POST /v2/<repo>/blobs/uploads/",
          "tone": "amber"
        },
        {
          "storyTerm": "Moving the floating production tag onto the poisoned stack",
          "technicalTerm": "Overwriting mutable :prod tag via PUT /v2/corp/payment-api/manifests/prod",
          "tone": "sky"
        },
        {
          "storyTerm": "Loading-dock cryptographic seal inspector",
          "technicalTerm": "Kubernetes Sigstore Policy Controller verifying Cosign image signatures",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing official wax stamp blocking deployment",
          "technicalTerm": "Failed Cosign digest signature check halting tampered image rollout",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-oci-cosign-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Slipping a tampered modular layer onto…",
          "subtitle": "Uploading trojanized OCI layer blob via POST…",
          "tone": "amber"
        },
        {
          "id": "cnt-oci-cosign-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Moving the floating production tag onto…",
          "subtitle": "Overwriting mutable :prod tag via PUT…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Uploading Modified OCI Layer Blob via POST /v2/<repo>/blobs/uploads/",
          "storyExcerpt": "Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse bin.",
          "technicalParallel": "Under the hood, the observed step executes crane manifest registry.corp.local/corp/payment-api:prod | jq . (which executes the technical command / telemetry directive , crane manifest…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. List",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Overwriting Mutable Image Tag via PUT /v2/<repo>/manifests/prod",
          "storyExcerpt": "Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list so…",
          "technicalParallel": "Under the hood, the observed step executes crane digest registry.corp.local/corp/payment-api:prod (which executes the technical command / telemetry directive , crane digest…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Seal",
          "stageTag": "STAGE 03 · INITIAL ACCESS",
          "title": "Admission Controller Sigstore Cosign Signature Verification & Layer Diff Forensics",
          "storyExcerpt": "When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger, immediately catches…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get events -n prod --field-selector reason=PolicyViolation (which executes a Kubernetes API request or container runtime command , kubectl get events -n…",
          "accentHex": "#10B981",
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
          "label": "Layer Stack",
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
          "label": "Cosign Press",
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
          "label": "Digest Audit",
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
      "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-oci-cosign-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Uploading Modified OCI Layer Blob via POST /v2/<repo>/blobs/uploads/",
      "storyCue": "Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse bin.",
      "technicalCue": "T1525 · PERSISTENCE — Using a compromised registry token with push scope, the actor uploads a modified filesystem layer tarball containing a trojanized entrypoint script to the OCI Distribution Spec API (POST…",
      "storyMappings": [
        {
          "storyTerm": "Stolen warehouse stocking pass",
          "technicalTerm": "Compromised OCI container registry token with repository push scope",
          "tone": "amber"
        },
        {
          "storyTerm": "Altered crate layer carrying hidden spy gear",
          "technicalTerm": "Trojanized filesystem layer tarball containing backdoored binaries",
          "tone": "sky"
        },
        {
          "storyTerm": "Depot upload dock",
          "technicalTerm": "OCI Distribution API POST /v2/<repo>/blobs/uploads/ endpoint",
          "tone": "rose"
        },
        {
          "storyTerm": "New fingerprint registered in the bin",
          "technicalTerm": "New SHA-256 content-addressable blob digest stored in the registry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-oci-cosign-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Stolen warehouse stocking pass",
          "subtitle": "Compromised OCI container registry token with repository push…",
          "tone": "amber"
        },
        {
          "id": "cnt-oci-cosign-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Altered crate layer carrying hidden spy…",
          "subtitle": "Trojanized filesystem layer tarball containing backdoored…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Stolen warehouse stocking pass",
          "storyExcerpt": "Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse…",
          "technicalParallel": "Under the hood, the observed step executes crane manifest registry.corp.local/corp/payment-api:prod | jq . (which executes the technical command / telemetry directive , crane manifest…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Spy Gear",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Altered crate layer carrying hidden spy gear",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses altered crate layer carrying hidden spy gear to advance toward depot upload dock.",
          "technicalParallel": "Using a compromised registry token with push scope, the actor uploads a modified filesystem layer tarball containing a trojanized entrypoint script to the OCI Distribution Spec API (POST…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Dock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "New fingerprint registered in the bin",
          "storyExcerpt": "Behind the scenes, new fingerprint registered in the bin captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording OciEndpoint=PUT /v2/corp/payment-api/blobs/uploads/, UploadedLayerDigest=sha256:9f86d081884c7d659a2feaa0c55ad015, RegistryActor=ci-registry-bot under…",
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
          "label": "Layer Stack",
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
          "label": "Cosign Press",
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
          "label": "Digest Audit",
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
      "mitreId": "T1525"
    },
    "step-2": {
      "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-oci-cosign-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Overwriting Mutable Image Tag via PUT /v2/<repo>/manifests/prod",
      "storyCue": "Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list so automatic deliveries grab it next.",
      "technicalCue": "T1525 · DEFENSE EVASION — The actor submits PUT /v2/corp/payment-api/manifests/prod with Content-Type: application/vnd.oci.image.manifest.v1+json referencing the new layer digest, silently shifting the mutable :prod tag…",
      "storyMappings": [
        {
          "storyTerm": "Brand-new packing list referencing the tampered layer",
          "technicalTerm": "OCI image manifest (application/vnd.oci.image.manifest.v1+json) listing the rogue digest",
          "tone": "amber"
        },
        {
          "storyTerm": "Movable production tag hung on the poisoned stack",
          "technicalTerm": "PUT /v2/corp/payment-api/manifests/prod overwriting mutable :prod tag",
          "tone": "sky"
        },
        {
          "storyTerm": "Automatic deliveries configured to pull the latest tag",
          "technicalTerm": "Kubernetes Deployments referencing mutable :prod with imagePullPolicy: Always",
          "tone": "rose"
        },
        {
          "storyTerm": "Clean historical stack left unreferenced",
          "technicalTerm": "Original clean manifest digest replaced as the active tag target",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-oci-cosign-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Brand-new packing list referencing the…",
          "subtitle": "OCI image manifest (application/vnd.oci.image.manifest.v1+json)…",
          "tone": "amber"
        },
        {
          "id": "cnt-oci-cosign-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Movable production tag hung on the…",
          "subtitle": "PUT /v2/corp/payment-api/manifests/prod overwriting mutable…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. List",
          "stageTag": "STEP 02 · SETUP",
          "title": "Brand-new packing list referencing the tampered layer",
          "storyExcerpt": "Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list…",
          "technicalParallel": "Under the hood, the observed step executes crane digest registry.corp.local/corp/payment-api:prod (which executes the technical command / telemetry directive , crane digest…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tag Hung",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Movable production tag hung on the poisoned stack",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses movable production tag hung on the poisoned stack to advance toward automatic deliveries configured to pull the latest tag.",
          "technicalParallel": "The actor submits PUT /v2/corp/payment-api/manifests/prod with Content-Type: application/vnd.oci.image.manifest.v1+json referencing the new layer digest, silently shifting the mutable :prod tag to a new…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pull Tag",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Clean historical stack left unreferenced",
          "storyExcerpt": "Behind the scenes, clean historical stack left unreferenced captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording MutatedTag=corp/payment-api:prod, PreviousManifestDigest=sha256:112233445566, NewManifestDigest=sha256:deadbeef8899 , Unsigned under T1525): Reference…",
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
          "label": "Layer Stack",
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
          "label": "Cosign Press",
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
          "label": "Digest Audit",
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
      "mitreId": "T1525"
    },
    "step-3": {
      "scenarioId": "docker-oci-registry-manifest-layer-poisoning-cosign-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-oci-cosign-step-3",
      "stageBadge": "STEP #3 · INITIAL ACCESS",
      "title": "Admission Controller Sigstore Cosign Signature Verification & Layer Diff Forensics",
      "storyCue": "When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger, immediately catches the forged unsealed stack, halts the shipment, and flags the exact swapped layer for forensic investigators.",
      "technicalCue": "T1525 · INITIAL ACCESS — When a Kubernetes Deployment with imagePullPolicy: Always attempts to schedule the updated :prod tag, the Sigstore Policy Controller / Kyverno VerifyImages admission webhook checks the Rekor…",
      "storyMappings": [
        {
          "storyTerm": "Factory floor pulling the refreshed crate",
          "technicalTerm": "Kubernetes scheduling pods with imagePullPolicy: Always on :prod",
          "tone": "amber"
        },
        {
          "storyTerm": "Loading-dock seal inspector checking the wax stamp",
          "technicalTerm": "Sigstore Policy Controller validating Cosign signatures and Rekor transparency logs",
          "tone": "sky"
        },
        {
          "storyTerm": "Halting the unsealed shipment",
          "technicalTerm": "Admission rejection blocking deployment of the unsigned tampered digest",
          "tone": "rose"
        },
        {
          "storyTerm": "Flagging the exact swapped layer for investigators",
          "technicalTerm": "OCI manifest and layer diff forensics isolating the injected malicious blob",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-oci-cosign-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Factory floor pulling the refreshed crate",
          "subtitle": "Kubernetes scheduling pods with imagePullPolicy: Always on :prod",
          "tone": "amber"
        },
        {
          "id": "cnt-oci-cosign-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Loading-dock seal inspector checking the…",
          "subtitle": "Sigstore Policy Controller validating Cosign signatures and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Pull",
          "stageTag": "STEP 03 · SETUP",
          "title": "Factory floor pulling the refreshed crate",
          "storyExcerpt": "When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get events -n prod --field-selector reason=PolicyViolation (which executes a Kubernetes API request or container runtime command , kubectl get events -n…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Seal Wax",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Loading-dock seal inspector checking the wax stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses loading-dock seal inspector checking the wax stamp to advance toward halting the unsealed shipment.",
          "technicalParallel": "When a Kubernetes Deployment with imagePullPolicy: Always attempts to schedule the updated :prod tag, the Sigstore Policy Controller / Kyverno VerifyImages admission webhook checks the Rekor transparency…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Pull",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Flagging the exact swapped layer for investigators",
          "storyExcerpt": "Behind the scenes, flagging the exact swapped layer for investigators captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 403 (recording AdmissionWebhook=policy.sigstore.dev , Sigstore Cosign / Kyverno, RejectedDigest=sha256:deadbeef8899, EnforcementOutcome=HTTP 403 Forbidden , Unsigned Image…",
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
          "label": "Layer Stack",
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
          "label": "Cosign Press",
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
          "label": "Digest Audit",
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
      "mitreId": "T1525"
    }
  },
  "docker-var-run-docker-sock-mounted-socket-breakout-audit": {
    "briefing": {
      "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-docker-sock-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1613",
      "title": "Container Mounted /var/run/docker.sock Unix Socket Escalation Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a locked glass contractor booth inside a high-security factory where engineers accidentally ran the factory master crane joystick cable straight through the booth wall for convenience. An intruder trapped inside the glass booth grabs that joystick, commands the crane outside to build an open-air twin platform sharing the factory master floor, and steps directly into the factory central control room.",
      "technicalCue": "CREDENTIAL ACCESS: Discovering Mounted /var/run/docker.sock Inside Container Mount Table -> DEFENSE EVASION: Spawning Sibling Container with HostPID, HostNetwork & Privileged Mode via Unix Socket -> INITIAL ACCESS: Entering Host PID 1 (systemd) Mount & IPC Namespaces via nsenter",
      "storyMappings": [
        {
          "storyTerm": "Master crane joystick cable wired through the glass booth wall",
          "technicalTerm": "Host /var/run/docker.sock Unix socket bind-mounted inside a container",
          "tone": "amber"
        },
        {
          "storyTerm": "Ordering an open-air twin platform outside the booth",
          "technicalTerm": "HTTP POST over docker.sock creating a sibling container with HostPID and Privileged",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping directly into the factory central control room",
          "technicalTerm": "nsenter --target 1 entering host PID 1 (systemd) mount and IPC namespaces",
          "tone": "rose"
        },
        {
          "storyTerm": "Locked glass contractor booth",
          "technicalTerm": "Compromised CI build or management agent container",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-docker-sock-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master crane joystick cable wired…",
          "subtitle": "Host /var/run/docker.sock Unix socket bind-mounted inside a…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-sock-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Ordering an open-air twin platform…",
          "subtitle": "HTTP POST over docker.sock creating a sibling container with…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Discovering Mounted /var/run/docker.sock Inside Container Mount Table",
          "storyExcerpt": "Looking around the locked glass contractor booth for an escape route, the intruder inspects the wall conduits and immediately discovers the live master crane control cable poking straight through from…",
          "technicalParallel": "Under the hood, the observed step executes grep docker.sock /proc/self/mountinfo (which executes a Kubernetes API request or container runtime command , grep docker.sock /proc/self/mountinfo configuring…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Over",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Spawning Sibling Container with HostPID, HostNetwork & Privileged Mode via Unix Socket",
          "storyExcerpt": "Gripping the exposed crane joystick, the intruder commands the crane outside to assemble a brand-new twin platform next door with zero privacy partitions, full view of every worker badge on the factory…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k docker_socket_access -i (which executes the technical command / telemetry directive , ausearch -k docker_socket_access -i via System / Runtime…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STAGE 03 · INITIAL ACCESS",
          "title": "Entering Host PID 1 (systemd) Mount & IPC Namespaces via nsenter",
          "storyExcerpt": "Standing on the twin platform with full view of the factory chief supervisor office, the intruder uses a master transfer latch to step straight into the supervisor own workspace, gaining complete root…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc setns -i (which executes the technical command / telemetry directive , ausearch -sc setns -i via System / Runtime Execution Interface, passing the…",
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
          "label": "Glass Booth",
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
          "label": "Crane Cable",
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
          "label": "Socket Escape",
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
      "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-docker-sock-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Discovering Mounted /var/run/docker.sock Inside Container Mount Table",
      "storyCue": "Looking around the locked glass contractor booth for an escape route, the intruder inspects the wall conduits and immediately discovers the live master crane control cable poking straight through from the main factory floor outside.",
      "technicalCue": "T1613 · CREDENTIAL ACCESS — After gaining code execution inside a build or agent container, the actor inspects /proc/self/mountinfo (or runs find / -name docker.sock) and discovers the writable host Unix domain socket…",
      "storyMappings": [
        {
          "storyTerm": "Inspecting the wall conduits",
          "technicalTerm": "Reading /proc/self/mountinfo or running find / -name docker.sock inside the container",
          "tone": "amber"
        },
        {
          "storyTerm": "Live master crane control cable",
          "technicalTerm": "Mounted host Unix domain socket at /var/run/docker.sock",
          "tone": "sky"
        },
        {
          "storyTerm": "Locked glass contractor booth",
          "technicalTerm": "Initial foothold inside a CI runner or monitoring agent container",
          "tone": "rose"
        },
        {
          "storyTerm": "Direct link to the factory outside",
          "technicalTerm": "Socket communicating directly with the root-privileged host dockerd daemon",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-sock-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Inspecting the wall conduits",
          "subtitle": "Reading /proc/self/mountinfo or running find / -name…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-sock-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Live master crane control cable",
          "subtitle": "Mounted host Unix domain socket at /var/run/docker.sock",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STEP 01 · SETUP",
          "title": "Inspecting the wall conduits",
          "storyExcerpt": "Looking around the locked glass contractor booth for an escape route, the intruder inspects the wall conduits and immediately discovers the live master crane control cable poking straight…",
          "technicalParallel": "Under the hood, the observed step executes grep docker.sock /proc/self/mountinfo (which executes a Kubernetes API request or container runtime command , grep docker.sock /proc/self/mountinfo configuring…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Live master crane control cable",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses live master crane control cable to advance toward locked glass contractor booth.",
          "technicalParallel": "After gaining code execution inside a build or agent container, the actor inspects /proc/self/mountinfo (or runs find / -name docker.sock) and discovers the writable host Unix domain socket…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Link",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Direct link to the factory outside",
          "storyExcerpt": "Behind the scenes, direct link to the factory outside captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 42 (recording SocketFamily=AF_UNIX , /var/run/docker.sock, AuditRuleKey=docker_socket_access, CallerProcess=/usr/bin/curl , Container Cgroup under T1613): Replace…",
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
          "label": "Glass Booth",
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
          "label": "Crane Cable",
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
          "label": "Socket Escape",
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
      "mitreId": "T1613"
    },
    "step-2": {
      "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-docker-sock-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Spawning Sibling Container with HostPID, HostNetwork & Privileged Mode via Unix Socket",
      "storyCue": "Gripping the exposed crane joystick, the intruder commands the crane outside to assemble a brand-new twin platform next door with zero privacy partitions, full view of every worker badge on the factory floor, and master mechanical overrides turned on.",
      "technicalCue": "T1611 · DEFENSE EVASION — Sending an HTTP POST request over /var/run/docker.sock to http://localhost/v1.43/containers/create, the actor instructs the host dockerd daemon to launch a sibling container configured with…",
      "storyMappings": [
        {
          "storyTerm": "Commanding the crane over the exposed cable",
          "technicalTerm": "HTTP POST to http://localhost/v1.43/containers/create via /var/run/docker.sock",
          "tone": "amber"
        },
        {
          "storyTerm": "Brand-new twin platform next door",
          "technicalTerm": "Attacker-controlled sibling container launched directly by the host daemon",
          "tone": "sky"
        },
        {
          "storyTerm": "Full view of every worker badge and hallway",
          "technicalTerm": "HostPID (PidMode=host) and HostNetwork (NetworkMode=host) enabled",
          "tone": "rose"
        },
        {
          "storyTerm": "Master mechanical overrides turned on",
          "technicalTerm": "Privileged=true granting CAP_SYS_ADMIN inside the sibling container",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-sock-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Commanding the crane over the exposed…",
          "subtitle": "HTTP POST to http://localhost/v1.43/containers/create via…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-sock-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Brand-new twin platform next door",
          "subtitle": "Attacker-controlled sibling container launched directly by the…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over",
          "stageTag": "STEP 02 · SETUP",
          "title": "Commanding the crane over the exposed cable",
          "storyExcerpt": "Gripping the exposed crane joystick, the intruder commands the crane outside to assemble a brand-new twin platform next door with zero privacy partitions, full view of every worker badge on the…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k docker_socket_access -i (which executes the technical command / telemetry directive , ausearch -k docker_socket_access -i via System / Runtime…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Twin Next",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Brand-new twin platform next door",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses brand-new twin platform next door to advance toward full view of every worker badge and hallway.",
          "technicalParallel": "Sending an HTTP POST request over /var/run/docker.sock to http://localhost/v1.43/containers/create, the actor instructs the host dockerd daemon to launch a sibling container configured with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full View",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Master mechanical overrides turned on",
          "storyExcerpt": "Behind the scenes, master mechanical overrides turned on captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording NamespaceSharing=PidMode=host, NetworkMode=host, PrivilegedMode=true, SocketTransport=unix:///var/run/docker.sock under T1611): If a monitoring container…",
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
          "label": "Glass Booth",
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
          "label": "Crane Cable",
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
          "label": "Socket Escape",
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
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "docker-var-run-docker-sock-mounted-socket-breakout-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-docker-sock-step-3",
      "stageBadge": "STEP #3 · INITIAL ACCESS",
      "title": "Entering Host PID 1 (systemd) Mount & IPC Namespaces via nsenter",
      "storyCue": "Standing on the twin platform with full view of the factory chief supervisor office, the intruder uses a master transfer latch to step straight into the supervisor own workspace, gaining complete root command over the entire building.",
      "technicalCue": "T1611 · INITIAL ACCESS — Because the sibling container shares the host PID namespace (--pid=host) and runs with CAP_SYS_ADMIN, it invokes nsenter --target 1 --mount --uts --ipc --net --pid to attach directly to all…",
      "storyMappings": [
        {
          "storyTerm": "Factory chief supervisor office",
          "technicalTerm": "Host init process PID 1 (systemd) running in the root host namespaces",
          "tone": "amber"
        },
        {
          "storyTerm": "Master transfer latch",
          "technicalTerm": "nsenter --target 1 --mount --uts --ipc --net --pid command",
          "tone": "sky"
        },
        {
          "storyTerm": "Authority allowing the latch to open",
          "technicalTerm": "Shared host PID namespace combined with CAP_SYS_ADMIN capability",
          "tone": "rose"
        },
        {
          "storyTerm": "Complete command over the entire building",
          "technicalTerm": "Unrestricted root shell inside the underlying Linux host OS",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-docker-sock-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Factory chief supervisor office",
          "subtitle": "Host init process PID 1 (systemd) running in the root host…",
          "tone": "amber"
        },
        {
          "id": "cnt-docker-sock-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master transfer latch",
          "subtitle": "nsenter --target 1 --mount --uts --ipc --net --pid command",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Twin Full",
          "stageTag": "STEP 03 · SETUP",
          "title": "Factory chief supervisor office",
          "storyExcerpt": "Standing on the twin platform with full view of the factory chief supervisor office, the intruder uses a master transfer latch to step straight into the supervisor own workspace, gaining…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -sc setns -i (which executes the technical command / telemetry directive , ausearch -sc setns -i via System / Runtime Execution Interface, passing the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Open",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master transfer latch",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master transfer latch to advance toward authority allowing the latch to open.",
          "technicalParallel": "Because the sibling container shares the host PID namespace (--pid=host) and runs with CAP_SYS_ADMIN, it invokes nsenter --target 1 --mount --uts --ipc --net --pid to attach directly to all Linux…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Complete command over the entire building",
          "storyExcerpt": "Behind the scenes, complete command over the entire building captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 308 (recording Syscall=sys_setns , 308, TargetNamespace=/proc/1/ns/mnt , Host systemd PID 1, ProcessBinary=/usr/bin/nsenter under T1611): Monitor Linux syscall 308 (setns)…",
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
          "label": "Glass Booth",
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
          "label": "Crane Cable",
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
          "label": "Socket Escape",
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
      "mitreId": "T1611"
    }
  },
  "k8s-coredns-dns-poisoning-service-account-token-audit": {
    "briefing": {
      "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-k8s-coredns-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1557",
      "title": "Kubernetes CoreDNS ConfigMap Modification & Service Mesh DNS Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a large corporate campus whose internal telephone switchboard automatically re-reads its printed address directory every few seconds. An intruder with editing rights to the switchboard notebook changes one line for the payroll bank address, waits moments for the automated switchboard to reload the poisoned entry across the whole campus, and collects every courier secret badge when unsuspecting offices dial the fake payroll booth.",
      "technicalCue": "PERSISTENCE: RBAC Enumeration & Patching the kube-system/coredns Corefile ConfigMap -> EXFIL & IMPACT: CoreDNS reload Plugin Hot-Reloading the Modified Corefile Across Cluster DNS -> CREDENTIAL ACCESS: Service-to-Service Bearer Token Interception & NetworkPolicy Egress Audit",
      "storyMappings": [
        {
          "storyTerm": "Internal switchboard printed address directory",
          "technicalTerm": "Kubernetes kube-system/coredns Corefile ConfigMap",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated switchboard reloading the poisoned entry in seconds",
          "technicalTerm": "CoreDNS reload plugin detecting MD5/SHA-512 change in /etc/coredns/Corefile",
          "tone": "sky"
        },
        {
          "storyTerm": "Fake payroll booth answering redirected calls",
          "technicalTerm": "Attacker-controlled pod IP mapped to payments-api.prod.svc.cluster.local",
          "tone": "rose"
        },
        {
          "storyTerm": "Couriers handing over their secret badges on arrival",
          "technicalTerm": "Intercepted service-to-service Authorization: Bearer tokens and credentials",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-k8s-coredns-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Internal switchboard printed address…",
          "subtitle": "Kubernetes kube-system/coredns Corefile ConfigMap",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-coredns-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Automated switchboard reloading the…",
          "subtitle": "CoreDNS reload plugin detecting MD5/SHA-512 change in…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over-generous",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "RBAC Enumeration & Patching the kube-system/coredns Corefile ConfigMap",
          "storyExcerpt": "Spotting an over-generous badge that grants write access to the campus directory room, the intruder opens the central telephone address book and slips in a custom redirect line pointing the internal…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get configmap coredns -n kube-system -o yaml (which executes a Kubernetes API request or container runtime command , kubectl get configmap coredns -n…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Auto-refresh",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "CoreDNS reload Plugin Hot-Reloading the Modified Corefile Across Cluster DNS",
          "storyExcerpt": "Without needing anyone to restart the telephone tower, the switchboard built-in auto-refresh bellboy notices the page checksum changed and quietly pushes the poisoned directory live across every…",
          "technicalParallel": "Under the hood, the observed step executes kubectl logs -n kube-system -l k8s-app=kube-dns | grep \"Reloading Complete\" (which executes a Kubernetes API request or container runtime command , kubectl logs…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Name",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Service-to-Service Bearer Token Interception & NetworkPolicy Egress Audit",
          "storyExcerpt": "Unsuspecting departments across the campus dial the familiar payments office name, get routed straight to the intruder booth, and dutifully present their secret inter-office identity passes right across…",
          "technicalParallel": "Under the hood, the observed step executes kubectl rollout restart deployment/coredns -n kube-system (which executes a Kubernetes API request or container runtime command , kubectl rollout restart…",
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
          "label": "Cluster Tower",
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
          "label": "Switchboard",
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
          "label": "Route Spoof",
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
      "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-k8s-coredns-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "RBAC Enumeration & Patching the kube-system/coredns Corefile ConfigMap",
      "storyCue": "Spotting an over-generous badge that grants write access to the campus directory room, the intruder opens the central telephone address book and slips in a custom redirect line pointing the internal payments bank name straight to their own hidden booth.",
      "technicalCue": "T1557 · PERSISTENCE — Holding RBAC permissions to update ConfigMaps in kube-system, the actor modifies the Corefile inside kube-system/coredns to add a rewrite name rule (or hosts block) mapping…",
      "storyMappings": [
        {
          "storyTerm": "Over-generous badge for the directory room",
          "technicalTerm": "RBAC permissions allowing ConfigMap updates inside kube-system",
          "tone": "amber"
        },
        {
          "storyTerm": "Central telephone address book",
          "technicalTerm": "Corefile stored in the kube-system/coredns ConfigMap",
          "tone": "sky"
        },
        {
          "storyTerm": "Custom redirect line for the payments bank",
          "technicalTerm": "Injected hosts or rewrite directive redirecting payments-api.prod.svc.cluster.local",
          "tone": "rose"
        },
        {
          "storyTerm": "Intruder hidden booth",
          "technicalTerm": "Rogue pod IP receiving hijacked internal cluster DNS traffic",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-coredns-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Over-generous badge for the directory room",
          "subtitle": "RBAC permissions allowing ConfigMap updates inside kube-system",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-coredns-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Central telephone address book",
          "subtitle": "Corefile stored in the kube-system/coredns ConfigMap",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over-generous",
          "stageTag": "STEP 01 · SETUP",
          "title": "Over-generous badge for the directory room",
          "storyExcerpt": "Spotting an over-generous badge that grants write access to the campus directory room, the intruder opens the central telephone address book and slips in a custom redirect line pointing the…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get configmap coredns -n kube-system -o yaml (which executes a Kubernetes API request or container runtime command , kubectl get configmap coredns -n…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Central telephone address book",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses central telephone address book to advance toward custom redirect line for the payments bank.",
          "technicalParallel": "Holding RBAC permissions to update ConfigMaps in kube-system, the actor modifies the Corefile inside kube-system/coredns to add a rewrite name rule (or hosts block) mapping…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line Bank",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Intruder hidden booth",
          "storyExcerpt": "Behind the scenes, intruder hidden booth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording TargetConfigMap=kube-system/coredns, InjectedCorefileDirective=rewrite name payments-api.prod.svc.cluster.local rogue-proxy.default.svc.cluster.local…",
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
          "label": "Cluster Tower",
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
          "label": "Switchboard",
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
          "label": "Route Spoof",
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
    "step-2": {
      "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-k8s-coredns-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "CoreDNS reload Plugin Hot-Reloading the Modified Corefile Across Cluster DNS",
      "storyCue": "Without needing anyone to restart the telephone tower, the switchboard built-in auto-refresh bellboy notices the page checksum changed and quietly pushes the poisoned directory live across every telephone line on campus within seconds.",
      "technicalCue": "T1557 · EXFIL & IMPACT — Because the default CoreDNS Corefile includes the reload plugin, CoreDNS detects the MD5/SHA-512 change in the mounted /etc/coredns/Corefile volume within 30 seconds and hot-reloads the DNS…",
      "storyMappings": [
        {
          "storyTerm": "Built-in auto-refresh bellboy",
          "technicalTerm": "Default CoreDNS reload plugin polling /etc/coredns/Corefile",
          "tone": "amber"
        },
        {
          "storyTerm": "Noticing the page checksum changed",
          "technicalTerm": "MD5/SHA-512 digest change triggering automatic CoreDNS hot-reload",
          "tone": "sky"
        },
        {
          "storyTerm": "No switchboard restart required",
          "technicalTerm": "Zero pod eviction or restart events hiding the change from naive monitors",
          "tone": "rose"
        },
        {
          "storyTerm": "Poisoned directory live across campus",
          "technicalTerm": "Cluster-wide DNS resolution returning the rogue pod IP for production services",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-coredns-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Built-in auto-refresh bellboy",
          "subtitle": "Default CoreDNS reload plugin polling /etc/coredns/Corefile",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-coredns-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Noticing the page checksum changed",
          "subtitle": "MD5/SHA-512 digest change triggering automatic CoreDNS…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Auto-refresh",
          "stageTag": "STEP 02 · SETUP",
          "title": "Built-in auto-refresh bellboy",
          "storyExcerpt": "Without needing anyone to restart the telephone tower, the switchboard built-in auto-refresh bellboy notices the page checksum changed and quietly pushes the poisoned directory live across…",
          "technicalParallel": "Under the hood, the observed step executes kubectl logs -n kube-system -l k8s-app=kube-dns | grep \"Reloading Complete\" (which executes a Kubernetes API request or container runtime command , kubectl logs…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Page",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Noticing the page checksum changed",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses noticing the page checksum changed to advance toward no switchboard restart required.",
          "technicalParallel": "Because the default CoreDNS Corefile includes the reload plugin, CoreDNS detects the MD5/SHA-512 change in the mounted /etc/coredns/Corefile volume within 30 seconds and hot-reloads the DNS routing table…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Poisoned directory live across campus",
          "storyExcerpt": "Behind the scenes, poisoned directory live across campus captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording CoreDnsPlugin=plugin/reload + plugin/rewrite, PoisonedDomain=payments-api.prod.svc.cluster.local, ReloadStatus=Hot-reloaded across kube-dns pods under…",
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
          "label": "Cluster Tower",
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
          "label": "Switchboard",
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
          "label": "Route Spoof",
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
      "scenarioId": "k8s-coredns-dns-poisoning-service-account-token-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-k8s-coredns-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Service-to-Service Bearer Token Interception & NetworkPolicy Egress Audit",
      "storyCue": "Unsuspecting departments across the campus dial the familiar payments office name, get routed straight to the intruder booth, and dutifully present their secret inter-office identity passes right across the counter.",
      "technicalCue": "T1528 · CREDENTIAL ACCESS — Workloads resolving payments-api.prod.svc.cluster.local connect to the rogue pod IP and transmit their Authorization: Bearer headers or projected Kubernetes ServiceAccount tokens, which…",
      "storyMappings": [
        {
          "storyTerm": "Departments dialing the familiar payments name",
          "technicalTerm": "Production workloads resolving payments-api.prod.svc.cluster.local",
          "tone": "amber"
        },
        {
          "storyTerm": "Presenting secret inter-office identity passes",
          "technicalTerm": "Workloads transmitting Authorization: Bearer tokens to the rogue pod",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden booth harvesting every caller pass",
          "technicalTerm": "Man-in-the-middle credential capture inside the cluster network",
          "tone": "rose"
        },
        {
          "storyTerm": "Campus corridor checkpoints catching the detour",
          "technicalTerm": "Strict Kubernetes NetworkPolicy egress rules and mTLS verifying peer identity",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-coredns-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Departments dialing the familiar…",
          "subtitle": "Production workloads resolving…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-coredns-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Presenting secret inter-office identity…",
          "subtitle": "Workloads transmitting Authorization: Bearer tokens to the…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Name",
          "stageTag": "STEP 03 · SETUP",
          "title": "Departments dialing the familiar payments name",
          "storyExcerpt": "Unsuspecting departments across the campus dial the familiar payments office name, get routed straight to the intruder booth, and dutifully present their secret inter-office identity passes…",
          "technicalParallel": "Under the hood, the observed step executes kubectl rollout restart deployment/coredns -n kube-system (which executes a Kubernetes API request or container runtime command , kubectl rollout restart…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Pass",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Presenting secret inter-office identity passes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses presenting secret inter-office identity passes to advance toward hidden booth harvesting every caller pass.",
          "technicalParallel": "Workloads resolving payments-api.prod.svc.cluster.local connect to the rogue pod IP and transmit their Authorization: Bearer headers or projected Kubernetes ServiceAccount tokens, which defenders block…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Campus corridor checkpoints catching the detour",
          "storyExcerpt": "Behind the scenes, campus corridor checkpoints catching the detour captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording SourceWorkload=prod/checkout-svc-7b9, RedirectedDestination=default/rogue-proxy-4f2:8080, TelemetrySource=Cilium Hubble eBPF Network Flow under T1528)…",
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
          "label": "Cluster Tower",
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
          "label": "Switchboard",
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
          "label": "Route Spoof",
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
    }
  },
  "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit": {
    "briefing": {
      "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-k8s-daemonset-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1610",
      "title": "Cluster-Wide Malicious DaemonSet Scheduling & Node RootFS Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate office tower whose automated staffing dispatcher ensures one janitor is stationed on every single floor automatically. An intruder files a rogue staffing order stamped with a pass-all-restrictions seal, forcing the dispatcher to place a master-keyed spy onto every single floor (including the locked executive penthouse) so the spy can photocopy the building core blueprints and master certificates.",
      "technicalCue": "EXECUTION: Creating an apps/v1 DaemonSet with Wildcard Tolerations (operator: Exists) -> LATERAL & C2: DaemonSet Controller Scheduling Pods with hostNetwork, hostPID & hostPath Across All Nodes -> DEFENSE EVASION: Control-Plane Static Pod Manifest (/etc/kubernetes/manifests) Inspection & DaemonSet Purge",
      "storyMappings": [
        {
          "storyTerm": "Rogue staffing order with a pass-all-restrictions seal",
          "technicalTerm": "apps/v1 DaemonSet using wildcard tolerations (operator: Exists)",
          "tone": "amber"
        },
        {
          "storyTerm": "Placing a master-keyed spy onto every single floor automatically",
          "technicalTerm": "DaemonSet controller scheduling pods with hostNetwork, hostPID, and hostPath on all nodes",
          "tone": "sky"
        },
        {
          "storyTerm": "Locked executive penthouse",
          "technicalTerm": "Tainted Kubernetes control-plane nodes bypassed by wildcard tolerations",
          "tone": "rose"
        },
        {
          "storyTerm": "Photocopying building core blueprints and master certificates",
          "technicalTerm": "Inspecting /etc/kubernetes/manifests and /etc/kubernetes/pki from the hostPath mount",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-k8s-daemonset-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Rogue staffing order with a…",
          "subtitle": "apps/v1 DaemonSet using wildcard tolerations (operator: Exists)",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-daemonset-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Placing a master-keyed spy onto every…",
          "subtitle": "DaemonSet controller scheduling pods with hostNetwork…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "Creating an apps/v1 DaemonSet with Wildcard Tolerations (operator: Exists)",
          "storyExcerpt": "Submitting a fake building-maintenance schedule to the central staffing office, the intruder stamps a universal ignore-all-warnings sticker onto the order so even restricted executive floors cannot turn…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get daemonsets --all-namespaces -o wide (which executes a Kubernetes API request or container runtime command , kubectl get daemonsets --all-namespaces…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. One Spy",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "DaemonSet Controller Scheduling Pods with hostNetwork, hostPID & hostPath Across All Nodes",
          "storyExcerpt": "Following the schedule obediently, the automated dispatcher immediately sends one spy worker to every single floor in the tower, handing each spy direct access to the floor hallways, the local…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get pods -n kube-system -l app=node-log-sync -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,HOSTNET:.spec.hostNetwork (which executes a…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Spy Wall",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Control-Plane Static Pod Manifest (/etc/kubernetes/manifests) Inspection & DaemonSet Purge",
          "storyExcerpt": "From the spy stationed inside the executive penthouse, the intruder opens the wall cabinet holding the tower architectural blueprints and master vault seals, gaining total control over the entire…",
          "technicalParallel": "Under the hood, the observed step executes kubectl delete daemonset node-log-sync -n kube-system (which executes a Kubernetes API request or container runtime command , kubectl delete daemonset…",
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
          "label": "Control Tower",
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
          "label": "Node Fleet",
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
          "label": "All-Floor Push",
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
      "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-k8s-daemonset-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "Creating an apps/v1 DaemonSet with Wildcard Tolerations (operator: Exists)",
      "storyCue": "Submitting a fake building-maintenance schedule to the central staffing office, the intruder stamps a universal ignore-all-warnings sticker onto the order so even restricted executive floors cannot turn the worker away.",
      "technicalCue": "T1610 · EXECUTION — The actor submits POST /apis/apps/v1/namespaces/kube-system/daemonsets containing spec.template.spec.tolerations: [{operator: \"Exists\"}] so the DaemonSet bypasses…",
      "storyMappings": [
        {
          "storyTerm": "Fake building-maintenance schedule",
          "technicalTerm": "POST /apis/apps/v1/namespaces/kube-system/daemonsets disguised as node-log-sync",
          "tone": "amber"
        },
        {
          "storyTerm": "Universal ignore-all-warnings sticker",
          "technicalTerm": "Wildcard toleration spec.template.spec.tolerations: [{operator: \"Exists\"}]",
          "tone": "sky"
        },
        {
          "storyTerm": "Restricted executive floors",
          "technicalTerm": "Control-plane nodes protected by NoSchedule taints",
          "tone": "rose"
        },
        {
          "storyTerm": "Central staffing office",
          "technicalTerm": "Kubernetes API server accepting the privileged workload manifest",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-daemonset-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Fake building-maintenance schedule",
          "subtitle": "POST /apis/apps/v1/namespaces/kube-system/daemonsets disguised…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-daemonset-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Universal ignore-all-warnings sticker",
          "subtitle": "Wildcard toleration spec.template.spec.tolerations…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake",
          "stageTag": "STEP 01 · SETUP",
          "title": "Fake building-maintenance schedule",
          "storyExcerpt": "Submitting a fake building-maintenance schedule to the central staffing office, the intruder stamps a universal ignore-all-warnings sticker onto the order so even restricted executive floors…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get daemonsets --all-namespaces -o wide (which executes a Kubernetes API request or container runtime command , kubectl get daemonsets --all-namespaces…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Universal ignore-all-warnings sticker",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses universal ignore-all-warnings sticker to advance toward restricted executive floors.",
          "technicalParallel": "The actor submits POST /apis/apps/v1/namespaces/kube-system/daemonsets containing spec.template.spec.tolerations: [{operator: \"Exists\"}] so the DaemonSet bypasses…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Fake Onto",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Central staffing office",
          "storyExcerpt": "Behind the scenes, central staffing office captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording ResourceType=apps/v1 DaemonSet , kube-system/node-log-sync, TaintToleration=tolerations: [{operator: \"Exists\"}] , Includes Control-Plane Nodes…",
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
          "label": "Control Tower",
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
          "label": "Node Fleet",
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
          "label": "All-Floor Push",
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
      "mitreId": "T1610"
    },
    "step-2": {
      "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-k8s-daemonset-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "DaemonSet Controller Scheduling Pods with hostNetwork, hostPID & hostPath Across All Nodes",
      "storyCue": "Following the schedule obediently, the automated dispatcher immediately sends one spy worker to every single floor in the tower, handing each spy direct access to the floor hallways, the local switchboard, and the floor master filing room.",
      "technicalCue": "T1610 · LATERAL & C2 — The DaemonSet controller reconciles the new specification and spawns node-log-sync-<hash> pods on every node in the cluster with hostNetwork: true, hostPID: true, and a hostPath volume mounting…",
      "storyMappings": [
        {
          "storyTerm": "Automated dispatcher placing one spy per floor",
          "technicalTerm": "DaemonSet controller spawning node-log-sync-<hash> pods on every cluster node",
          "tone": "amber"
        },
        {
          "storyTerm": "Direct access to floor switchboards and hallways",
          "technicalTerm": "hostNetwork: true and hostPID: true exposing host sockets and processes",
          "tone": "sky"
        },
        {
          "storyTerm": "Direct door into the floor master filing room",
          "technicalTerm": "hostPath volume mounting host /etc or / directly inside each DaemonSet pod",
          "tone": "rose"
        },
        {
          "storyTerm": "Self-healing staffing loop",
          "technicalTerm": "Controller automatically respawning deleted pods until the DaemonSet itself is removed",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-daemonset-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Automated dispatcher placing one spy per…",
          "subtitle": "DaemonSet controller spawning node-log-sync-<hash> pods on…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-daemonset-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Direct access to floor switchboards and…",
          "subtitle": "hostNetwork: true and hostPID: true exposing host sockets and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Spy",
          "stageTag": "STEP 02 · SETUP",
          "title": "Automated dispatcher placing one spy per floor",
          "storyExcerpt": "Following the schedule obediently, the automated dispatcher immediately sends one spy worker to every single floor in the tower, handing each spy direct access to the floor hallways, the local…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get pods -n kube-system -l app=node-log-sync -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,HOSTNET:.spec.hostNetwork (which executes a…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Door",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Direct access to floor switchboards and hallways",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses direct access to floor switchboards and hallways to advance toward direct door into the floor master filing room.",
          "technicalParallel": "The DaemonSet controller reconciles the new specification and spawns node-log-sync-<hash> pods on every node in the cluster with hostNetwork: true, hostPID: true, and a hostPath volume mounting /var/log…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Door Room",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Self-healing staffing loop",
          "storyExcerpt": "Behind the scenes, self-healing staffing loop captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording ControllerActor=system:serviceaccount:kube-system:daemon-set-controller, ScheduledNode=control-plane-01, PodSecuritySpec=hostPID=true, hostNetwork=true…",
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
          "label": "Control Tower",
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
          "label": "Node Fleet",
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
          "label": "All-Floor Push",
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
      "mitreId": "T1610"
    },
    "step-3": {
      "scenarioId": "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-k8s-daemonset-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Control-Plane Static Pod Manifest (/etc/kubernetes/manifests) Inspection & DaemonSet Purge",
      "storyCue": "From the spy stationed inside the executive penthouse, the intruder opens the wall cabinet holding the tower architectural blueprints and master vault seals, gaining total control over the entire skyscraper until defenders cancel the staffing order.",
      "technicalCue": "T1611 · DEFENSE EVASION — Running on the control-plane node with /etc mounted, the DaemonSet pod inspects /etc/kubernetes/manifests/ and /etc/kubernetes/pki/.",
      "storyMappings": [
        {
          "storyTerm": "Spy stationed inside the executive penthouse",
          "technicalTerm": "DaemonSet pod running on the Kubernetes control-plane node",
          "tone": "amber"
        },
        {
          "storyTerm": "Architectural blueprints in the wall cabinet",
          "technicalTerm": "Static pod manifests in /etc/kubernetes/manifests/",
          "tone": "sky"
        },
        {
          "storyTerm": "Master vault seals",
          "technicalTerm": "Cluster root CA and signing keys stored in /etc/kubernetes/pki/",
          "tone": "rose"
        },
        {
          "storyTerm": "Canceling the staffing order",
          "technicalTerm": "Deleting the rogue DaemonSet and enforcing Pod Security Admission restricted policies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-daemonset-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Spy stationed inside the executive…",
          "subtitle": "DaemonSet pod running on the Kubernetes control-plane node",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-daemonset-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Architectural blueprints in the wall…",
          "subtitle": "Static pod manifests in /etc/kubernetes/manifests/",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spy Wall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Spy stationed inside the executive penthouse",
          "storyExcerpt": "From the spy stationed inside the executive penthouse, the intruder opens the wall cabinet holding the tower architectural blueprints and master vault seals, gaining total control over the…",
          "technicalParallel": "Under the hood, the observed step executes kubectl delete daemonset node-log-sync -n kube-system (which executes a Kubernetes API request or container runtime command , kubectl delete daemonset…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wall",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Architectural blueprints in the wall cabinet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses architectural blueprints in the wall cabinet to advance toward master vault seals.",
          "technicalParallel": "Running on the control-plane node with /etc mounted, the DaemonSet pod inspects /etc/kubernetes/manifests/ and /etc/kubernetes/pki/.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Spy Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Canceling the staffing order",
          "storyExcerpt": "Behind the scenes, canceling the staffing order captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording AccessedControlPlanePath=/etc/kubernetes/manifests/kube-apiserver.yaml, SourcePod=kube-system/node-log-sync-x9k2p, FalcoRule=Read Sensitive File Untrusted…",
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
          "label": "Control Tower",
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
          "label": "Node Fleet",
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
          "label": "All-Floor Push",
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
      "mitreId": "T1611"
    }
  },
  "k8s-ephemeral-debug-container-process-namespace-share-audit": {
    "briefing": {
      "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-k8s-ephemeral-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1609",
      "title": "Ephemeral Debug Container (kubectl debug) Shared Process Namespace Audit — Story-to-Technical Overview",
      "storyCue": "Imagine an armored cash-transport van engineered with zero interior door handles and zero toolboxes so nobody can operate inside it. Using a special roadside-mechanic pass, an intruder bolts a temporary diagnostic side cabin directly onto the armored van shared interior cabin, reads every secret vault note taped beside the driver seat, and leaves a permanent weld scar that forces the bank to retire and replace the entire vehicle.",
      "technicalCue": "EXECUTION: Subresource PATCH Against /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers -> CREDENTIAL ACCESS: Process Namespace Targeting (--target) & Reading /proc/<pid>/environ Secrets -> EXFIL & IMPACT: Interactive SPDY/WebSocket pods/attach Session Audit & Pod Rollout Replacement",
      "storyMappings": [
        {
          "storyTerm": "Armored cash van with zero door handles or toolboxes",
          "technicalTerm": "Hardened distroless production container lacking /bin/sh or utilities",
          "tone": "amber"
        },
        {
          "storyTerm": "Bolting a temporary diagnostic side cabin onto the van",
          "technicalTerm": "PATCH /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers (kubectl debug)",
          "tone": "sky"
        },
        {
          "storyTerm": "Reading secret notes taped beside the driver seat",
          "technicalTerm": "Process namespace sharing (--target) reading /proc/<pid>/environ secrets",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent weld scar forcing full vehicle replacement",
          "technicalTerm": "Append-only spec.ephemeralContainers requiring full Pod rollout replacement",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-k8s-ephemeral-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Armored cash van with zero door handles…",
          "subtitle": "Hardened distroless production container lacking /bin/sh or…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-ephemeral-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Bolting a temporary diagnostic side…",
          "subtitle": "PATCH /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Van No",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "Subresource PATCH Against /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers",
          "storyExcerpt": "Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth straight…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.objectRef.subresource==\"ephemeralcontainers\")' /var/log/kubernetes/audit.log (which executes the technical command / telemetry directive , jq '.…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Main Wall",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Process Namespace Targeting (--target) & Reading /proc/<pid>/environ Secrets",
          "storyExcerpt": "Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database password…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /proc/1/environ -i (which executes the technical command / telemetry directive , ausearch -f /proc/1/environ -i via System / Runtime Execution…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Can Road",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Interactive SPDY/WebSocket pods/attach Session Audit & Pod Rollout Replacement",
          "storyExcerpt": "Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while retiring…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.objectRef.subresource==\"attach\" and .objectRef.name==\"payment-service-5c8\")' /var/log/kubernetes/audit.log (which executes the technical command…",
          "accentHex": "#38BDF8",
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
          "label": "Side Cabin",
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
          "label": "Cluster Tower",
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
          "label": "PID Peek",
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
      "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-k8s-ephemeral-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "Subresource PATCH Against /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers",
      "storyCue": "Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth straight onto the live moving vehicle.",
      "technicalCue": "T1609 · EXECUTION — Even when a production pod uses a hardened distroless image with no shell (/bin/sh removed), an identity with pods/ephemeralcontainers permissions can run kubectl debug -it <pod>…",
      "storyMappings": [
        {
          "storyTerm": "Armored payments van with no shell or tools",
          "technicalTerm": "Hardened distroless production pod with /bin/sh removed",
          "tone": "amber"
        },
        {
          "storyTerm": "Specialized roadside-debug permit",
          "technicalTerm": "RBAC permission on pods/ephemeralcontainers subresource",
          "tone": "sky"
        },
        {
          "storyTerm": "Welding a temporary service booth onto the live van",
          "technicalTerm": "PATCH request creating an ephemeral debug container via kubectl debug",
          "tone": "rose"
        },
        {
          "storyTerm": "Live vehicle continuing down the highway",
          "technicalTerm": "Running production pod mutated without restarting the target app",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-ephemeral-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Armored payments van with no shell or…",
          "subtitle": "Hardened distroless production pod with /bin/sh removed",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-ephemeral-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Specialized roadside-debug permit",
          "subtitle": "RBAC permission on pods/ephemeralcontainers subresource",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Van No",
          "stageTag": "STEP 01 · SETUP",
          "title": "Armored payments van with no shell or tools",
          "storyExcerpt": "Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.objectRef.subresource==\"ephemeralcontainers\")' /var/log/kubernetes/audit.log (which executes the technical command / telemetry directive , jq '.…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Onto",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Specialized roadside-debug permit",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses specialized roadside-debug permit to advance toward welding a temporary service booth onto the live van.",
          "technicalParallel": "Even when a production pod uses a hardened distroless image with no shell (/bin/sh removed), an identity with pods/ephemeralcontainers permissions can run kubectl debug -it <pod> --image=busybox…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Live",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Live vehicle continuing down the highway",
          "storyExcerpt": "Behind the scenes, live vehicle continuing down the highway captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording TargetSubresource=pods/ephemeralcontainers, InjectedEphemeralContainer=debugger-8x2lq , image: nicolaka/netshoot, TargetContainerName=payment-app under…",
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
          "label": "Side Cabin",
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
          "label": "Cluster Tower",
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
          "label": "PID Peek",
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
      "mitreId": "T1609"
    },
    "step-2": {
      "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-k8s-ephemeral-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Process Namespace Targeting (--target) & Reading /proc/<pid>/environ Secrets",
      "storyCue": "Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database password taped inside memory.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Because targetContainerName=\"payment-app\" instructs the container runtime (containerd) to join the ephemeral container to the target container PID namespace, the ephemeral shell can directly…",
      "storyMappings": [
        {
          "storyTerm": "Linking directly into the main driver cabin wall",
          "technicalTerm": "targetContainerName=\"payment-app\" sharing the PID namespace via containerd",
          "tone": "amber"
        },
        {
          "storyTerm": "Active driver workspace",
          "technicalTerm": "Target application process space visible under /proc/<pid>/",
          "tone": "sky"
        },
        {
          "storyTerm": "Vault keys and database passwords taped inside",
          "technicalTerm": "Runtime secrets harvested from /proc/<pid>/environ and open file descriptors",
          "tone": "rose"
        },
        {
          "storyTerm": "Tools brought along inside the service booth",
          "technicalTerm": "Attacker-chosen debug container image carrying shells and forensic utilities",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-ephemeral-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Linking directly into the main driver…",
          "subtitle": "targetContainerName=\"payment-app\" sharing the PID namespace…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-ephemeral-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Active driver workspace",
          "subtitle": "Target application process space visible under /proc/<pid>/",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Main Wall",
          "stageTag": "STEP 02 · SETUP",
          "title": "Linking directly into the main driver cabin wall",
          "storyExcerpt": "Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /proc/1/environ -i (which executes the technical command / telemetry directive , ausearch -f /proc/1/environ -i via System / Runtime Execution…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Keys",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Active driver workspace",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses active driver workspace to advance toward vault keys and database passwords taped inside.",
          "technicalParallel": "Because targetContainerName=\"payment-app\" instructs the container runtime (containerd) to join the ephemeral container to the target container PID namespace, the ephemeral shell can directly read…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Tools brought along inside the service booth",
          "storyExcerpt": "Behind the scenes, tools brought along inside the service booth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording EphemeralContainer=debugger-8x2lq, AccessedProcFsPath=/proc/1/environ & /proc/1/root/, SharedNamespace=Target Container PID Namespace , payment-app under…",
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
          "label": "Side Cabin",
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
          "label": "Cluster Tower",
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
          "label": "PID Peek",
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
      "mitreId": "T1552.001"
    },
    "step-3": {
      "scenarioId": "k8s-ephemeral-debug-container-process-namespace-share-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-k8s-ephemeral-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Interactive SPDY/WebSocket pods/attach Session Audit & Pod Rollout Replacement",
      "storyCue": "Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while retiring the compromised vehicle completely.",
      "technicalCue": "T1609 · EXFIL & IMPACT — Because Kubernetes ephemeral containers cannot be removed from a running Pod once added (spec.ephemeralContainers is append-only), defenders terminate the pods/attach stream and replace the Pod…",
      "storyMappings": [
        {
          "storyTerm": "Diagnostic booth that can never be unbolted on the road",
          "technicalTerm": "Immutable append-only spec.ephemeralContainers array on a running Pod",
          "tone": "amber"
        },
        {
          "storyTerm": "Live radio session log",
          "technicalTerm": "Kubernetes Audit logs recording interactive SPDY/WebSocket pods/attach sessions",
          "tone": "sky"
        },
        {
          "storyTerm": "Dispatching a clean replacement van",
          "technicalTerm": "Full Pod eviction and clean Deployment rollout replacement",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking down roadside-debug permits",
          "technicalTerm": "Restricting RBAC access to pods/ephemeralcontainers and pods/attach",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-ephemeral-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Diagnostic booth that can never be…",
          "subtitle": "Immutable append-only spec.ephemeralContainers array on a…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-ephemeral-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Live radio session log",
          "subtitle": "Kubernetes Audit logs recording interactive SPDY/WebSocket…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Can Road",
          "stageTag": "STEP 03 · SETUP",
          "title": "Diagnostic booth that can never be unbolted on the…",
          "storyExcerpt": "Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.objectRef.subresource==\"attach\" and .objectRef.name==\"payment-service-5c8\")' /var/log/kubernetes/audit.log (which executes the technical command…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live Log",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Live radio session log",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses live radio session log to advance toward dispatching a clean replacement van.",
          "technicalParallel": "Because Kubernetes ephemeral containers cannot be removed from a running Pod once added (spec.ephemeralContainers is append-only), defenders terminate the pods/attach stream and replace the Pod via…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Locking down roadside-debug permits",
          "storyExcerpt": "Behind the scenes, locking down roadside-debug permits captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 101 (recording AttachSubresource=pods/attach , container=debugger-8x2lq, HttpResponseCode=101 Switching Protocols , SPDY/WebSocket, RemediationAction=Delete & recreate Pod…",
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
          "label": "Side Cabin",
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
          "label": "Cluster Tower",
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
          "label": "PID Peek",
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
      "mitreId": "T1609"
    }
  },
  "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974": {
    "briefing": {
      "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
      "sectionKey": "briefing",
      "sceneKind": "cnt-ingress-1974-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Ingress-NGINX Admission Controller Configuration Validation Audit… — Story-to-Technical Overview",
      "storyCue": "Imagine a busy seaport customs booth that dry-runs every proposed harbor routing plan using an automated tabletop verifier before approving it. An intruder floods the customs inbox with a large parcel so the booth temporarily parks the parcel in a holding bin, then submits a rigged routing plan that tricks the tabletop verifier into loading that parked parcel straight off the shelf, handing the intruder the customs inspector master ring of keys covering every district in the entire port.",
      "technicalCue": "INITIAL ACCESS: AdmissionReview Webhook Request & Temporary Buffered Body Allocation -> EXECUTION: NGINX Configuration Test (nginx -t) Engine Directive Evaluation -> CREDENTIAL ACCESS: ServiceAccount Token Usage & Cluster-Wide Secret Enumeration Audit",
      "storyMappings": [
        {
          "storyTerm": "Seaport customs booth testing proposed routing plans",
          "technicalTerm": "ingress-nginx AdmissionReview webhook listening on TCP port 8443",
          "tone": "amber"
        },
        {
          "storyTerm": "Large parcel parked temporarily in a holding bin",
          "technicalTerm": "NGINX client body buffer held open in /proc/<pid>/fd/<n>",
          "tone": "sky"
        },
        {
          "storyTerm": "Rigged plan tricking the tabletop verifier into loading the parcel",
          "technicalTerm": "Injected ssl_engine directive evaluated during /usr/bin/nginx -t (CVE-2025-1974)",
          "tone": "rose"
        },
        {
          "storyTerm": "Master key ring covering every harbor district",
          "technicalTerm": "ingress-nginx ServiceAccount RBAC permissions reading Secrets across all namespaces",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-ingress-1974-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Seaport customs booth testing proposed…",
          "subtitle": "ingress-nginx AdmissionReview webhook listening on TCP port 8443",
          "tone": "amber"
        },
        {
          "id": "cnt-ingress-1974-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Large parcel parked temporarily in a…",
          "subtitle": "NGINX client body buffer held open in /proc/<pid>/fd/<n>",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "AdmissionReview Webhook Request & Temporary Buffered Body Allocation",
          "storyExcerpt": "At the customs inspection desk, the intruder sends a heavy shipping dossier so the clerk temporarily sets the bundle inside a local holding tray while reading the accompanying form, leaving a live open…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get validatingwebhookconfigurations ingress-nginx-admission -o yaml (which executes a Kubernetes API request or container runtime command , kubectl get…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Fed Dry-run",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "NGINX Configuration Test (nginx -t) Engine Directive Evaluation",
          "storyExcerpt": "Before rejecting or approving the proposed harbor map, the clerk feeds the draft blueprint into the tabletop dry-run machine. Because hidden instructions slipped past the form rules, the dry-run machine…",
          "technicalParallel": "Under the hood, the observed step executes /usr/bin/nginx -c /tmp/nginx-cfg384912041 -t (which invokes or targets the host daemon/process , /usr/bin/nginx -c /tmp/nginx-cfg384912041 -t with its runtime…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Ring Peg",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "ServiceAccount Token Usage & Cluster-Wide Secret Enumeration Audit",
          "storyExcerpt": "Now standing behind the customs booth counter, the intruder lifts the official harbor-wide inspection ring hanging on the peg, which grants permission to unlock and photocopy every sealed vault across…",
          "technicalParallel": "Under the hood, the observed step executes kubectl auth can-i --list --as=system:serviceaccount:ingress-nginx:ingress-nginx (which executes a Kubernetes API request or container runtime command , kubectl…",
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
          "label": "Customs Booth",
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
          "label": "Harbor Keys",
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
          "label": "Parcel Load",
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
      "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
      "sectionKey": "step-1",
      "sceneKind": "cnt-ingress-1974-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "AdmissionReview Webhook Request & Temporary Buffered Body Allocation",
      "storyCue": "At the customs inspection desk, the intruder sends a heavy shipping dossier so the clerk temporarily sets the bundle inside a local holding tray while reading the accompanying form, leaving a live open handle to the intruder uninspected parcel sitting right inside the booth.",
      "technicalCue": "T1190 · INITIAL ACCESS — The ingress-nginx admission controller listens on TCP port 8443 for Kubernetes AdmissionReview JSON requests.",
      "storyMappings": [
        {
          "storyTerm": "Customs inspection desk",
          "technicalTerm": "ingress-nginx admission controller webhook endpoint on TCP port 8443",
          "tone": "amber"
        },
        {
          "storyTerm": "Heavy shipping dossier",
          "technicalTerm": "Oversized HTTP AdmissionReview JSON request containing an embedded shared library",
          "tone": "sky"
        },
        {
          "storyTerm": "Local holding tray with a live open handle",
          "technicalTerm": "Temporary NGINX buffered body file descriptor reachable under /proc/<pid>/fd/",
          "tone": "rose"
        },
        {
          "storyTerm": "Uninspected parcel inside the booth",
          "technicalTerm": "Attacker-supplied ELF library staged without needing persistent disk write rights",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-ingress-1974-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Customs inspection desk",
          "subtitle": "ingress-nginx admission controller webhook endpoint on TCP…",
          "tone": "amber"
        },
        {
          "id": "cnt-ingress-1974-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Heavy shipping dossier",
          "subtitle": "Oversized HTTP AdmissionReview JSON request containing an…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Customs inspection desk",
          "storyExcerpt": "At the customs inspection desk, the intruder sends a heavy shipping dossier so the clerk temporarily sets the bundle inside a local holding tray while reading the accompanying form, leaving a…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get validatingwebhookconfigurations ingress-nginx-admission -o yaml (which executes a Kubernetes API request or container runtime command , kubectl get…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tray",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Heavy shipping dossier",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses heavy shipping dossier to advance toward local holding tray with a live open handle.",
          "technicalParallel": "The ingress-nginx admission controller listens on TCP port 8443 for Kubernetes AdmissionReview JSON requests.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tray Live",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Uninspected parcel inside the booth",
          "storyExcerpt": "Behind the scenes, uninspected parcel inside the booth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording WebhookEndpoint=https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses, BufferedFileDescriptor=/proc/29/fd/18 ->…",
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
          "label": "Customs Booth",
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
          "label": "Harbor Keys",
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
          "label": "Parcel Load",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
      "sectionKey": "step-2",
      "sceneKind": "cnt-ingress-1974-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "NGINX Configuration Test (nginx -t) Engine Directive Evaluation",
      "storyCue": "Before rejecting or approving the proposed harbor map, the clerk feeds the draft blueprint into the tabletop dry-run machine. Because hidden instructions slipped past the form rules, the dry-run machine blindly loads the waiting parcel from the holding tray and runs the intruder code right inside the customs booth.",
      "technicalCue": "T1609 · EXECUTION — To validate the proposed Ingress object, the controller renders a temporary nginx.conf template and invokes /usr/bin/nginx -t.",
      "storyMappings": [
        {
          "storyTerm": "Draft blueprint fed into the dry-run machine",
          "technicalTerm": "Rendered temporary nginx.conf validated by /usr/bin/nginx -t",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden instructions slipping past form rules",
          "technicalTerm": "Injected NGINX configuration directives (ssl_engine) via crafted Ingress annotations",
          "tone": "sky"
        },
        {
          "storyTerm": "Loading the waiting parcel from the holding tray",
          "technicalTerm": "OpenSSL engine loading the buffered ELF payload from /proc/<pid>/fd/<n>",
          "tone": "rose"
        },
        {
          "storyTerm": "Running code inside the customs booth",
          "technicalTerm": "Unauthenticated remote code execution inside the ingress-nginx controller pod",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-ingress-1974-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Draft blueprint fed into the dry-run…",
          "subtitle": "Rendered temporary nginx.conf validated by /usr/bin/nginx -t",
          "tone": "amber"
        },
        {
          "id": "cnt-ingress-1974-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Hidden instructions slipping past form…",
          "subtitle": "Injected NGINX configuration directives (ssl_engine) via…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fed Dry-run",
          "stageTag": "STEP 02 · SETUP",
          "title": "Draft blueprint fed into the dry-run machine",
          "storyExcerpt": "Before rejecting or approving the proposed harbor map, the clerk feeds the draft blueprint into the tabletop dry-run machine.",
          "technicalParallel": "Under the hood, the observed step executes /usr/bin/nginx -c /tmp/nginx-cfg384912041 -t (which invokes or targets the host daemon/process , /usr/bin/nginx -c /tmp/nginx-cfg384912041 -t with its runtime…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Past Form",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Hidden instructions slipping past form rules",
          "storyExcerpt": "Because hidden instructions slipped past the form rules, the dry-run machine blindly loads the waiting parcel from the holding tray and runs the intruder code right inside the customs booth.",
          "technicalParallel": "To validate the proposed Ingress object, the controller renders a temporary nginx.conf template and invokes /usr/bin/nginx -t.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tray",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Running code inside the customs booth",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across running code inside the customs booth while locking down loading the waiting parcel from the holding tray.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentProcess=nginx-ingress-controller, ChildCommand=/usr/bin/nginx -c /tmp/nginx-cfg384912041 -t, FalcoRuleTriggered=Unexpected Shared Object Loaded from…",
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
          "label": "Customs Booth",
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
          "label": "Harbor Keys",
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
          "label": "Parcel Load",
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
      "mitreId": "T1609"
    },
    "step-3": {
      "scenarioId": "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974",
      "sectionKey": "step-3",
      "sceneKind": "cnt-ingress-1974-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "ServiceAccount Token Usage & Cluster-Wide Secret Enumeration Audit",
      "storyCue": "Now standing behind the customs booth counter, the intruder lifts the official harbor-wide inspection ring hanging on the peg, which grants permission to unlock and photocopy every sealed vault across every pier in the entire port.",
      "technicalCue": "T1552.007 · CREDENTIAL ACCESS — Because the default ingress-nginx ServiceAccount holds RBAC permissions to list and read Secrets across all namespaces (used for TLS termination certificates), Kubernetes audit logs record…",
      "storyMappings": [
        {
          "storyTerm": "Harbor-wide inspection ring hanging on the peg",
          "technicalTerm": "Mounted ingress-nginx ServiceAccount JWT token at /var/run/secrets/kubernetes.io/",
          "tone": "amber"
        },
        {
          "storyTerm": "Photocopying sealed vaults across every pier",
          "technicalTerm": "Cluster-wide Kubernetes API Secret enumeration across all namespaces",
          "tone": "sky"
        },
        {
          "storyTerm": "Official reason the booth held those keys",
          "technicalTerm": "Default RBAC rights required by ingress-nginx to load TLS certificates cluster-wide",
          "tone": "rose"
        },
        {
          "storyTerm": "Harbor audit log spotting the raid",
          "technicalTerm": "Kubernetes Audit Log capturing anomalous Secret list calls from ingress-nginx",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-ingress-1974-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Harbor-wide inspection ring hanging on…",
          "subtitle": "Mounted ingress-nginx ServiceAccount JWT token at…",
          "tone": "amber"
        },
        {
          "id": "cnt-ingress-1974-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Photocopying sealed vaults across every…",
          "subtitle": "Cluster-wide Kubernetes API Secret enumeration across all…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Ring Peg",
          "stageTag": "STEP 03 · SETUP",
          "title": "Harbor-wide inspection ring hanging on the peg",
          "storyExcerpt": "Now standing behind the customs booth counter, the intruder lifts the official harbor-wide inspection ring hanging on the peg, which grants permission to unlock and photocopy every sealed vault…",
          "technicalParallel": "Under the hood, the observed step executes kubectl auth can-i --list --as=system:serviceaccount:ingress-nginx:ingress-nginx (which executes a Kubernetes API request or container runtime command , kubectl…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pier",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Photocopying sealed vaults across every pier",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses photocopying sealed vaults across every pier to advance toward official reason the booth held those keys.",
          "technicalParallel": "Because the default ingress-nginx ServiceAccount holds RBAC permissions to list and read Secrets across all namespaces (used for TLS termination certificates), Kubernetes audit logs record get/list…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Held Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Harbor audit log spotting the raid",
          "storyExcerpt": "Behind the scenes, harbor audit log spotting the raid captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording K8sAuditVerb=list, PrincipalIdentity=system:serviceaccount:ingress-nginx:ingress-nginx, TargetResource=/api/v1/secrets , All Namespaces under T1552.007)…",
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
          "label": "Customs Booth",
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
          "label": "Harbor Keys",
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
          "label": "Parcel Load",
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
      "mitreId": "T1552.007"
    }
  },
  "k8s-kubelet-anonymous-api-etcd-snapshot-forensics": {
    "briefing": {
      "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
      "sectionKey": "briefing",
      "sceneKind": "cnt-kubelet-etcd-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1613",
      "title": "Kubelet Read/Write Port 10250 & etcd Snapshot Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine an apartment tower whose floor-manager desk has no receptionist, no sign-in book, and an open intercom linking every suite. Any unbadged visitor can walk up to the desk to grab the complete tenant directory, speak an order straight into the maintenance penthouse to unlock the boiler room, and photograph the entire building master safe archive stored on the control floor.",
      "technicalCue": "CREDENTIAL ACCESS: Unauthenticated Pod Enumeration via Kubelet /pods Endpoint (:10250) -> EXECUTION: Remote Command Execution Inside Privileged Pod via Kubelet /run Endpoint -> CREDENTIAL ACCESS: Control-Plane etcd Snapshot Extraction (/var/lib/etcd/member/snap/db)",
      "storyMappings": [
        {
          "storyTerm": "Unguarded floor-manager desk with no sign-in book",
          "technicalTerm": "Kubelet port 10250 running with --anonymous-auth=true and AlwaysAllow",
          "tone": "amber"
        },
        {
          "storyTerm": "Grabbing the complete tenant directory",
          "technicalTerm": "Unauthenticated GET https://<node>:10250/pods enumeration",
          "tone": "sky"
        },
        {
          "storyTerm": "Speaking an order straight into the maintenance penthouse",
          "technicalTerm": "Unauthenticated POST /run/<namespace>/<pod>/<container> remote command execution",
          "tone": "rose"
        },
        {
          "storyTerm": "Photographing the building master safe archive",
          "technicalTerm": "Dumping /var/lib/etcd/member/snap/db via etcdctl snapshot save",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-kubelet-etcd-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unguarded floor-manager desk with no…",
          "subtitle": "Kubelet port 10250 running with --anonymous-auth=true and…",
          "tone": "amber"
        },
        {
          "id": "cnt-kubelet-etcd-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Grabbing the complete tenant directory",
          "subtitle": "Unauthenticated GET https://<node>:10250/pods enumeration",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Unauthenticated Pod Enumeration via Kubelet /pods Endpoint (:10250)",
          "storyExcerpt": "Walking up to the unguarded floor-manager desk, the intruder asks for the full occupancy clipboard without showing a single badge. The desk gladly hands back every suite number, resident name, and which…",
          "technicalParallel": "Under the hood, the observed step executes curl -sk https://10.10.20.11:10250/pods | jq \".items[].metadata.name\" (which executes the HTTP/HTTPS transfer client , curl -sk https://10.10.20.11:10250/pods |…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Remote Command Execution Inside Privileged Pod via Kubelet /run Endpoint",
          "storyExcerpt": "Picking the most privileged maintenance suite straight off the occupancy clipboard, the intruder presses the desk direct intercom button and issues live work orders inside that suite as though standing…",
          "technicalParallel": "Under the hood, the observed step executes curl -sk -X POST \"https://10.10.20.11:10250/run/kube-system/kube-proxy-x892a/kube-proxy\" -d \"cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/token\" (which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Control-Plane etcd Snapshot Extraction (/var/lib/etcd/member/snap/db)",
          "storyExcerpt": "Standing inside a control-floor suite with direct access to the vault certificates, the intruder takes a complete instant photograph of the building master ledger cabinet, capturing every resident key…",
          "technicalParallel": "Under the hood, the observed step executes ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt…",
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
          "label": "Floor Desk",
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
          "label": "Master Archive",
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
          "label": "Snapshot Audit",
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
      "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
      "sectionKey": "step-1",
      "sceneKind": "cnt-kubelet-etcd-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Unauthenticated Pod Enumeration via Kubelet /pods Endpoint (:10250)",
      "storyCue": "Walking up to the unguarded floor-manager desk, the intruder asks for the full occupancy clipboard without showing a single badge. The desk gladly hands back every suite number, resident name, and which suites hold master maintenance keys.",
      "technicalCue": "T1613 · CREDENTIAL ACCESS — When Kubelet runs with --anonymous-auth=true and --authorization-mode=AlwaysAllow, any pod or host on the node network can query https://<node_ip>:10250/pods to retrieve full PodSpecs…",
      "storyMappings": [
        {
          "storyTerm": "Unguarded floor-manager desk",
          "technicalTerm": "Misconfigured Kubelet API on TCP port 10250 allowing anonymous requests",
          "tone": "amber"
        },
        {
          "storyTerm": "Full occupancy clipboard",
          "technicalTerm": "JSON response from GET /pods listing namespaces, pod names, and containers",
          "tone": "sky"
        },
        {
          "storyTerm": "Zero badge verification",
          "technicalTerm": "--anonymous-auth=true paired with --authorization-mode=AlwaysAllow",
          "tone": "rose"
        },
        {
          "storyTerm": "Suites holding master maintenance keys",
          "technicalTerm": "High-privilege system or control-plane pods scheduled on the node",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-kubelet-etcd-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unguarded floor-manager desk",
          "subtitle": "Misconfigured Kubelet API on TCP port 10250 allowing anonymous…",
          "tone": "amber"
        },
        {
          "id": "cnt-kubelet-etcd-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Full occupancy clipboard",
          "subtitle": "JSON response from GET /pods listing namespaces, pod names…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unguarded floor-manager desk",
          "storyExcerpt": "Walking up to the unguarded floor-manager desk, the intruder asks for the full occupancy clipboard without showing a single badge.",
          "technicalParallel": "Under the hood, the observed step executes curl -sk https://10.10.20.11:10250/pods | jq \".items[].metadata.name\" (which executes the HTTP/HTTPS transfer client , curl -sk https://10.10.20.11:10250/pods |…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Full occupancy clipboard",
          "storyExcerpt": "The desk gladly hands back every suite number, resident name, and which suites hold master maintenance keys.",
          "technicalParallel": "When Kubelet runs with --anonymous-auth=true and --authorization-mode=AlwaysAllow, any pod or host on the node network can query https://<node_ip>:10250/pods to retrieve full PodSpecs, environment…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zero",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Suites holding master maintenance keys",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across suites holding master maintenance keys while locking down zero badge verification.",
          "technicalParallel": "Documented in Linux Audit Event 10250 (recording KubeletEndpoint=GET /pods , :10250, AuthenticatedUser=system:anonymous, AuthorizationMode=AlwaysAllow , Misconfigured under T1613): Set…",
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
          "label": "Floor Desk",
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
          "label": "Master Archive",
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
          "label": "Snapshot Audit",
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
      "mitreId": "T1613"
    },
    "step-2": {
      "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
      "sectionKey": "step-2",
      "sceneKind": "cnt-kubelet-etcd-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Remote Command Execution Inside Privileged Pod via Kubelet /run Endpoint",
      "storyCue": "Picking the most privileged maintenance suite straight off the occupancy clipboard, the intruder presses the desk direct intercom button and issues live work orders inside that suite as though standing inside the room personally.",
      "technicalCue": "T1609 · EXECUTION — Using the pod namespace, pod name, and container name discovered from /pods, a POST request to /run/<namespace>/<pod>/<container> instructs Kubelet to invoke the CRI ExecSync RPC on containerd…",
      "storyMappings": [
        {
          "storyTerm": "Direct intercom button on the floor desk",
          "technicalTerm": "Kubelet POST /run/<namespace>/<pod>/<container> execution endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Issuing live work orders inside the suite",
          "technicalTerm": "Arbitrary command execution inside a running privileged container",
          "tone": "sky"
        },
        {
          "storyTerm": "Suite coordinates from the clipboard",
          "technicalTerm": "Target namespace, pod, and container names discovered via /pods",
          "tone": "rose"
        },
        {
          "storyTerm": "Bypasses the main building lobby",
          "technicalTerm": "Direct node-level execution skipping kube-apiserver RBAC and audit logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-kubelet-etcd-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Direct intercom button on the floor desk",
          "subtitle": "Kubelet POST /run/<namespace>/<pod>/<container> execution…",
          "tone": "amber"
        },
        {
          "id": "cnt-kubelet-etcd-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Issuing live work orders inside the suite",
          "subtitle": "Arbitrary command execution inside a running privileged…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 02 · SETUP",
          "title": "Direct intercom button on the floor desk",
          "storyExcerpt": "Picking the most privileged maintenance suite straight off the occupancy clipboard, the intruder presses the desk direct intercom button and issues live work orders inside that suite as though…",
          "technicalParallel": "Under the hood, the observed step executes curl -sk -X POST \"https://10.10.20.11:10250/run/kube-system/kube-proxy-x892a/kube-proxy\" -d \"cmd=cat /var/run/secrets/kubernetes.io/serviceaccount/token\" (which…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live Work",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Issuing live work orders inside the suite",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses issuing live work orders inside the suite to advance toward suite coordinates from the clipboard.",
          "technicalParallel": "Using the pod namespace, pod name, and container name discovered from /pods, a POST request to /run/<namespace>/<pod>/<container> instructs Kubelet to invoke the CRI ExecSync RPC on containerd, executing…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Bypasses the main building lobby",
          "storyExcerpt": "Behind the scenes, bypasses the main building lobby captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording KubeletApiAction=POST /run/kube-system/kube-proxy-x892a/kube-proxy, TargetNamespace=kube-system, CriOperation=ExecSync via containerd-shim-runc-v2 under…",
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
          "label": "Floor Desk",
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
          "label": "Master Archive",
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
          "label": "Snapshot Audit",
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
      "mitreId": "T1609"
    },
    "step-3": {
      "scenarioId": "k8s-kubelet-anonymous-api-etcd-snapshot-forensics",
      "sectionKey": "step-3",
      "sceneKind": "cnt-kubelet-etcd-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Control-Plane etcd Snapshot Extraction (/var/lib/etcd/member/snap/db)",
      "storyCue": "Standing inside a control-floor suite with direct access to the vault certificates, the intruder takes a complete instant photograph of the building master ledger cabinet, capturing every resident key, rulebook, and secret stored across the entire tower.",
      "technicalCue": "T1552.007 · CREDENTIAL ACCESS — If the compromised node hosts control-plane static pods or mounts /etc/kubernetes/pki/etcd, etcdctl snapshot save dumps the entire cluster state database (/registry/secrets/*), which DFIR…",
      "storyMappings": [
        {
          "storyTerm": "Vault certificates on the control floor",
          "technicalTerm": "Mounted /etc/kubernetes/pki/etcd client certificates and keys",
          "tone": "amber"
        },
        {
          "storyTerm": "Instant photograph of the master ledger cabinet",
          "technicalTerm": "etcdctl snapshot save capturing /var/lib/etcd/member/snap/db",
          "tone": "sky"
        },
        {
          "storyTerm": "Every resident key and secret across the tower",
          "technicalTerm": "Complete unencrypted Kubernetes cluster Secrets and ServiceAccount tokens in etcd",
          "tone": "rose"
        },
        {
          "storyTerm": "Total building takeover",
          "technicalTerm": "Full cluster administrative compromise derived offline from the etcd snapshot",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-kubelet-etcd-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Vault certificates on the control floor",
          "subtitle": "Mounted /etc/kubernetes/pki/etcd client certificates and keys",
          "tone": "amber"
        },
        {
          "id": "cnt-kubelet-etcd-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Instant photograph of the master ledger…",
          "subtitle": "etcdctl snapshot save capturing /var/lib/etcd/member/snap/db",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 03 · SETUP",
          "title": "Vault certificates on the control floor",
          "storyExcerpt": "Standing inside a control-floor suite with direct access to the vault certificates, the intruder takes a complete instant photograph of the building master ledger cabinet, capturing every…",
          "technicalParallel": "Under the hood, the observed step executes ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Instant photograph of the master ledger cabinet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses instant photograph of the master ledger cabinet to advance toward every resident key and secret across the tower.",
          "technicalParallel": "If the compromised node hosts control-plane static pods or mounts /etc/kubernetes/pki/etcd, etcdctl snapshot save dumps the entire cluster state database (/registry/secrets/*), which DFIR analysts verify…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Total building takeover",
          "storyExcerpt": "Behind the scenes, total building takeover captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 2379 (recording DatabaseTarget=etcd , :2379 /var/lib/etcd/member/snap/db, OutputArtifact=/tmp/etcd-snapshot.db, KeyPrefixTargeted=/registry/secrets/kube-system/ under…",
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
          "label": "Floor Desk",
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
          "label": "Master Archive",
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
          "label": "Snapshot Audit",
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
      "mitreId": "T1552.007"
    }
  },
  "k8s-mutating-admission-webhook-sidecar-injection-audit": {
    "briefing": {
      "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
      "sectionKey": "briefing",
      "sceneKind": "cnt-k8s-webhook-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1546",
      "title": "Rogue MutatingWebhookConfiguration Pod Sidecar & Secret Capture Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a central bank mailroom where every newly hired employee and every sealed secret pouch must pass through an official inspection counter before entering the building. An intruder registers a brand-new unauthorized inspection counter right on the main belt so the mailroom automatically hands them copies of every sealed secret pouch and allows them to slip a silent spy passenger into every new delivery truck rolling onto the floor.",
      "technicalCue": "PERSISTENCE: Creating a Cluster-Scoped MutatingWebhookConfiguration Targeting Pods & Secrets -> CREDENTIAL ACCESS: kube-apiserver Dispatching AdmissionReview Payloads Containing Secret Objects -> EXECUTION: JSONPatch Pod Mutation (Sidecar Injection) & Webhook Deletion Remediation",
      "storyMappings": [
        {
          "storyTerm": "Registering an unauthorized inspection counter on the belt",
          "technicalTerm": "Creating a cluster-scoped MutatingWebhookConfiguration targeting Pods and Secrets",
          "tone": "amber"
        },
        {
          "storyTerm": "Mailroom handing copies of every sealed secret pouch across the desk",
          "technicalTerm": "kube-apiserver dispatching serialized Secret objects in AdmissionReview JSON",
          "tone": "sky"
        },
        {
          "storyTerm": "Slipping a silent spy passenger into every new delivery truck",
          "technicalTerm": "AdmissionResponse JSONPatch injecting a malicious sidecar container into new Pods",
          "tone": "rose"
        },
        {
          "storyTerm": "Dismantling the rogue counter",
          "technicalTerm": "Auditing and deleting unauthorized MutatingWebhookConfiguration objects",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-k8s-webhook-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Registering an unauthorized inspection…",
          "subtitle": "Creating a cluster-scoped MutatingWebhookConfiguration…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-webhook-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Mailroom handing copies of every sealed…",
          "subtitle": "kube-apiserver dispatching serialized Secret objects in…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-level",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Creating a Cluster-Scoped MutatingWebhookConfiguration Targeting Pods & Secrets",
          "storyExcerpt": "Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed secret…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations (which executes a Kubernetes API request or container runtime command , kubectl get…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "kube-apiserver Dispatching AdmissionReview Payloads Containing Secret Objects",
          "storyExcerpt": "From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the intruder counter…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get mutatingwebhookconfigurations telemetry-sidecar-injector -o jsonpath=\"{.webhooks[*].clientConfig}\" (which executes a Kubernetes API request or…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Slip",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "JSONPatch Pod Mutation (Sidecar Injection) & Webhook Deletion Remediation",
          "storyExcerpt": "For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the intruder a…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.annotations.\"mutation.webhook.admission.k8s.io/round_0_index_0\" | contains, \"mutated=true\")' /var/log/kubernetes/audit.log (which executes the…",
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
          "label": "Rogue Counter",
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
          "label": "Cluster Belt",
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
          "label": "Sidecar Hook",
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
      "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
      "sectionKey": "step-1",
      "sceneKind": "cnt-k8s-webhook-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Creating a Cluster-Scoped MutatingWebhookConfiguration Targeting Pods & Secrets",
      "storyCue": "Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed secret envelope must stop at their booth first.",
      "technicalCue": "T1546 · PERSISTENCE — Using admissionregistration.k8s.io/v1 permissions, the actor creates a MutatingWebhookConfiguration with rules matching operations: [\"CREATE\", \"UPDATE\"] on resources: [\"pods\", \"secrets\"] and…",
      "storyMappings": [
        {
          "storyTerm": "High-level registration rights",
          "technicalTerm": "admissionregistration.k8s.io/v1 RBAC permissions to create webhooks",
          "tone": "amber"
        },
        {
          "storyTerm": "Rogue review booth bolted onto the conveyor",
          "technicalTerm": "Cluster-scoped MutatingWebhookConfiguration pointing to an attacker endpoint",
          "tone": "sky"
        },
        {
          "storyTerm": "Stopping every vehicle and secret envelope",
          "technicalTerm": "Webhook rules matching CREATE and UPDATE operations on Pods and Secrets",
          "tone": "rose"
        },
        {
          "storyTerm": "Central intake conveyor",
          "technicalTerm": "Kubernetes kube-apiserver admission controller pipeline",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-webhook-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "High-level registration rights",
          "subtitle": "admissionregistration.k8s.io/v1 RBAC permissions to create…",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-webhook-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Rogue review booth bolted onto the…",
          "subtitle": "Cluster-scoped MutatingWebhookConfiguration pointing to an…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-level",
          "stageTag": "STEP 01 · SETUP",
          "title": "High-level registration rights",
          "storyExcerpt": "Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get mutatingwebhookconfigurations,validatingwebhookconfigurations (which executes a Kubernetes API request or container runtime command , kubectl get…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Rogue review booth bolted onto the conveyor",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rogue review booth bolted onto the conveyor to advance toward stopping every vehicle and secret envelope.",
          "technicalParallel": "Using admissionregistration.k8s.io/v1 permissions, the actor creates a MutatingWebhookConfiguration with rules matching operations: [\"CREATE\", \"UPDATE\"] on resources: [\"pods\", \"secrets\"] and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-level Onto",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Central intake conveyor",
          "storyExcerpt": "Behind the scenes, central intake conveyor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording ApiGroup=admissionregistration.k8s.io/v1, ResourceCreated=MutatingWebhookConfiguration/telemetry-sidecar-injector…",
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
          "label": "Rogue Counter",
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
          "label": "Cluster Belt",
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
          "label": "Sidecar Hook",
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
      "mitreId": "T1546"
    },
    "step-2": {
      "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
      "sectionKey": "step-2",
      "sceneKind": "cnt-k8s-webhook-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "kube-apiserver Dispatching AdmissionReview Payloads Containing Secret Objects",
      "storyCue": "From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the intruder counter for inspection, letting the intruder copy every secret silently.",
      "technicalCue": "T1552.007 · CREDENTIAL ACCESS — Whenever any user or controller creates or updates a Secret or Pod, kube-apiserver serializes the full Kubernetes object inside an AdmissionReview JSON payload and POSTs it directly to the…",
      "storyMappings": [
        {
          "storyTerm": "Obedient front-desk dispatcher",
          "technicalTerm": "kube-apiserver forwarding AdmissionReview payloads over HTTPS",
          "tone": "amber"
        },
        {
          "storyTerm": "Entire unsealed package placed on the counter",
          "technicalTerm": "Full base64-encoded Kubernetes Secret objects serialized inside AdmissionReview JSON",
          "tone": "sky"
        },
        {
          "storyTerm": "Copying every secret silently",
          "technicalTerm": "Passive cluster-wide credential harvesting without alerting normal users",
          "tone": "rose"
        },
        {
          "storyTerm": "Normal approvals continuing smoothly",
          "technicalTerm": "Webhook returning allowed: true so cluster operations remain uninterrupted",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-webhook-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Obedient front-desk dispatcher",
          "subtitle": "kube-apiserver forwarding AdmissionReview payloads over HTTPS",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-webhook-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Entire unsealed package placed on the…",
          "subtitle": "Full base64-encoded Kubernetes Secret objects serialized…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Any Onto",
          "stageTag": "STEP 02 · SETUP",
          "title": "Obedient front-desk dispatcher",
          "storyExcerpt": "From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the…",
          "technicalParallel": "Under the hood, the observed step executes kubectl get mutatingwebhookconfigurations telemetry-sidecar-injector -o jsonpath=\"{.webhooks[*].clientConfig}\" (which executes a Kubernetes API request or…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Entire unsealed package placed on the counter",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses entire unsealed package placed on the counter to advance toward copying every secret silently.",
          "technicalParallel": "Whenever any user or controller creates or updates a Secret or Pod, kube-apiserver serializes the full Kubernetes object inside an AdmissionReview JSON payload and POSTs it directly to the webhook…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Any Onto",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Normal approvals continuing smoothly",
          "storyExcerpt": "Behind the scenes, normal approvals continuing smoothly captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditAnnotation=mutation.webhook.admission.k8s.io/round_0_index_0, InterceptedResource=Secret prod/db-credentials, WebhookName=telemetry-sidecar-injector…",
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
          "label": "Rogue Counter",
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
          "label": "Cluster Belt",
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
          "label": "Sidecar Hook",
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
      "mitreId": "T1552.007"
    },
    "step-3": {
      "scenarioId": "k8s-mutating-admission-webhook-sidecar-injection-audit",
      "sectionKey": "step-3",
      "sceneKind": "cnt-k8s-webhook-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "JSONPatch Pod Mutation (Sidecar Injection) & Webhook Deletion Remediation",
      "storyCue": "For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the intruder a persistent rider inside newly launched workloads until defenders tear out the rogue booth.",
      "technicalCue": "T1610 · EXECUTION — For Pod creation requests, the webhook returns an AdmissionResponse with patchType: JSONPatch that appends a sidecar container or environment variable into spec.containers, recorded in the pod…",
      "storyMappings": [
        {
          "storyTerm": "Subtle modification slip returned by the booth",
          "technicalTerm": "AdmissionResponse specifying patchType: JSONPatch",
          "tone": "amber"
        },
        {
          "storyTerm": "Welding a stowaway compartment onto the chassis",
          "technicalTerm": "Injecting a rogue sidecar container or malicious environment variables into Pods",
          "tone": "sky"
        },
        {
          "storyTerm": "Persistent rider across fresh deployments",
          "technicalTerm": "Self-healing cluster persistence surviving individual pod deletions",
          "tone": "rose"
        },
        {
          "storyTerm": "Tearing out the rogue booth",
          "technicalTerm": "Deleting the malicious MutatingWebhookConfiguration and rotating exposed Secrets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-k8s-webhook-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Subtle modification slip returned by the…",
          "subtitle": "AdmissionResponse specifying patchType: JSONPatch",
          "tone": "amber"
        },
        {
          "id": "cnt-k8s-webhook-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Welding a stowaway compartment onto the…",
          "subtitle": "Injecting a rogue sidecar container or malicious environment…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip",
          "stageTag": "STEP 03 · SETUP",
          "title": "Subtle modification slip returned by the booth",
          "storyExcerpt": "For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the…",
          "technicalParallel": "Under the hood, the observed step executes jq '. | select(.annotations.\"mutation.webhook.admission.k8s.io/round_0_index_0\" | contains, \"mutated=true\")' /var/log/kubernetes/audit.log (which executes the…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Welding a stowaway compartment onto the chassis",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses welding a stowaway compartment onto the chassis to advance toward persistent rider across fresh deployments.",
          "technicalParallel": "For Pod creation requests, the webhook returns an AdmissionResponse with patchType: JSONPatch that appends a sidecar container or environment variable into spec.containers, recorded in the pod audit…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. New Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Tearing out the rogue booth",
          "storyExcerpt": "Behind the scenes, tearing out the rogue booth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording MutatedPod=prod/api-server-6d4, PatchMechanism=AdmissionResponse JSONPatch , spec.containers, RemediationCommand=kubectl delete mutatingwebhookconfiguration…",
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
          "label": "Rogue Counter",
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
          "label": "Cluster Belt",
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
          "label": "Sidecar Hook",
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
      "mitreId": "T1610"
    }
  },
  "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626": {
    "briefing": {
      "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
      "sectionKey": "briefing",
      "sceneKind": "cnt-runc-escape-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1611",
      "title": "runc File Descriptor Leak & Host Filesystem Breakout Analysis… — Story-to-Technical Overview",
      "storyCue": "Imagine a cargo-ship loading dock where sealed steel shipping crates keep every passenger locked away from the ship main deck. A hurried crane operator forgets to close a tiny maintenance hatch pointing to the ship engine walkway before sealing a crate, letting a passenger step backward out of the crate straight onto the ship main deck and inspect the wheelhouse credentials and engine schedules.",
      "technicalCue": "INITIAL ACCESS: Open /sys/fs/cgroup File Descriptor Persistence Across chdir() in runc Init -> DEFENSE EVASION: Relative Path Traversal Across Host Mount Namespace (../../../../) -> CREDENTIAL ACCESS: Host Node Kubelet Credential & Systemd Unit Persistence Audit",
      "storyMappings": [
        {
          "storyTerm": "Tiny maintenance hatch left open before sealing the crate",
          "technicalTerm": "Leaked host /sys/fs/cgroup file descriptor across chdir() in runc <= 1.1.11 (CVE-2024-21626)",
          "tone": "amber"
        },
        {
          "storyTerm": "Stepping backward out of the crate onto the main deck",
          "technicalTerm": "Relative path traversal (../../../../) escaping container mount namespace confinement",
          "tone": "sky"
        },
        {
          "storyTerm": "Wheelhouse credentials and engine schedules",
          "technicalTerm": "Worker node /etc/kubernetes/kubelet.conf and systemd persistence units",
          "tone": "rose"
        },
        {
          "storyTerm": "Sealed steel shipping crate",
          "technicalTerm": "Isolated Linux container root filesystem managed by runc",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cnt-runc-escape-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Tiny maintenance hatch left open before…",
          "subtitle": "Leaked host /sys/fs/cgroup file descriptor across chdir() in…",
          "tone": "amber"
        },
        {
          "id": "cnt-runc-escape-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Stepping backward out of the crate onto…",
          "subtitle": "Relative path traversal (../../../../) escaping container…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dock",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Open /sys/fs/cgroup File Descriptor Persistence Across chdir() in runc Init",
          "storyExcerpt": "While lowering a fresh shipping crate onto the deck, the dock crane operator leaves an internal corridor door propped open to the ship structural walkway and accidentally sets the passenger starting…",
          "technicalParallel": "Under the hood, the observed step executes runc --version (which executes a Kubernetes API request or container runtime command , runc --version configuring pod security contexts, volume mounts…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. One Foot",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Relative Path Traversal Across Host Mount Namespace (../../../../)",
          "storyExcerpt": "Because the passenger boots up with one foot already standing on the ship outside walkway, simply walking backward a few staircases carries them cleanly beyond the sealed crate walls and straight into…",
          "technicalParallel": "Under the hood, the observed step executes stat ../../../../etc/hostname (which executes the technical command / telemetry directive , stat ../../../../etc/hostname via System / Runtime Execution…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Now Main",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Host Node Kubelet Credential & Systemd Unit Persistence Audit",
          "storyExcerpt": "Now walking freely across the main deck of the vessel, the escaped stowaway visits the captain quarters to copy the ship radio passes and slips a silent startup instruction onto the engine-room morning…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/kubernetes/kubelet.conf -i (which executes or inspects a container runtime or Kubernetes control-plane operation , ausearch -f…",
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
          "label": "Steel Crate",
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
          "label": "Main Deck",
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
          "label": "Hatch Escape",
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
      "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
      "sectionKey": "step-1",
      "sceneKind": "cnt-runc-escape-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Open /sys/fs/cgroup File Descriptor Persistence Across chdir() in runc Init",
      "storyCue": "While lowering a fresh shipping crate onto the deck, the dock crane operator leaves an internal corridor door propped open to the ship structural walkway and accidentally sets the passenger starting doorway right inside that open corridor.",
      "technicalCue": "T1611 · INITIAL ACCESS — In vulnerable versions of runc (<= 1.1.11), an internal file descriptor opened on the host /sys/fs/cgroup hierarchy was not closed with O_CLOEXEC before chdir(cwd) was called inside the…",
      "storyMappings": [
        {
          "storyTerm": "Dock crane operator launching the crate",
          "technicalTerm": "Vulnerable runc container runtime (<= 1.1.11) initializing the container",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal corridor door left propped open",
          "technicalTerm": "Unclosed host /sys/fs/cgroup file descriptor (/proc/self/fd/7 or /8)",
          "tone": "sky"
        },
        {
          "storyTerm": "Setting the starting doorway inside the corridor",
          "technicalTerm": "Container WORKDIR / chdir() pointed to /proc/self/fd/<leaked_fd>",
          "tone": "rose"
        },
        {
          "storyTerm": "Ship structural walkway outside the crate",
          "technicalTerm": "Underlying host Linux cgroup filesystem mount hierarchy",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-runc-escape-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Dock crane operator launching the crate",
          "subtitle": "Vulnerable runc container runtime (<= 1.1.11) initializing the…",
          "tone": "amber"
        },
        {
          "id": "cnt-runc-escape-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Internal corridor door left propped open",
          "subtitle": "Unclosed host /sys/fs/cgroup file descriptor (/proc/self/fd/7…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dock",
          "stageTag": "STEP 01 · SETUP",
          "title": "Dock crane operator launching the crate",
          "storyExcerpt": "While lowering a fresh shipping crate onto the deck, the dock crane operator leaves an internal corridor door propped open to the ship structural walkway and accidentally sets the passenger…",
          "technicalParallel": "Under the hood, the observed step executes runc --version (which executes a Kubernetes API request or container runtime command , runc --version configuring pod security contexts, volume mounts…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Door Left",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Internal corridor door left propped open",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal corridor door left propped open to advance toward setting the starting doorway inside the corridor.",
          "technicalParallel": "In vulnerable versions of runc (<= 1.1.11), an internal file descriptor opened on the host /sys/fs/cgroup hierarchy was not closed with O_CLOEXEC before chdir(cwd) was called inside the container…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Ship",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Ship structural walkway outside the crate",
          "storyExcerpt": "Behind the scenes, ship structural walkway outside the crate captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 80 (recording SyscallName=sys_chdir , 80, WorkingDirectory=/proc/self/fd/7 , Host /sys/fs/cgroup reference, VulnerabilityId=CVE-2024-21626 under T1611): Upgrade runc to…",
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
          "label": "Steel Crate",
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
          "label": "Main Deck",
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
          "label": "Hatch Escape",
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
      "mitreId": "T1611"
    },
    "step-2": {
      "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
      "sectionKey": "step-2",
      "sceneKind": "cnt-runc-escape-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Relative Path Traversal Across Host Mount Namespace (../../../../)",
      "storyCue": "Because the passenger boots up with one foot already standing on the ship outside walkway, simply walking backward a few staircases carries them cleanly beyond the sealed crate walls and straight into the ship central storage corridors.",
      "technicalCue": "T1611 · DEFENSE EVASION — Once the container process starts with its current working directory anchored to the host cgroup directory, relative path traversal (../../../../etc/shadow or /proc/<host_pid>/root) reaches the…",
      "storyMappings": [
        {
          "storyTerm": "One foot anchored on the outside walkway",
          "technicalTerm": "Container process CWD anchored inside host /sys/fs/cgroup mount space",
          "tone": "amber"
        },
        {
          "storyTerm": "Walking backward a few staircases",
          "technicalTerm": "Relative path traversal (../../../../) climbing above the host mount point",
          "tone": "sky"
        },
        {
          "storyTerm": "Leaving the sealed crate walls behind",
          "technicalTerm": "Complete bypass of the container chroot / pivot_root filesystem isolation",
          "tone": "rose"
        },
        {
          "storyTerm": "Ship central storage corridors",
          "technicalTerm": "Underlying worker node root filesystem (/) exposed for read and write",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-runc-escape-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "One foot anchored on the outside walkway",
          "subtitle": "Container process CWD anchored inside host /sys/fs/cgroup…",
          "tone": "amber"
        },
        {
          "id": "cnt-runc-escape-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Walking backward a few staircases",
          "subtitle": "Relative path traversal (../../../../) climbing above the host…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Foot",
          "stageTag": "STEP 02 · SETUP",
          "title": "One foot anchored on the outside walkway",
          "storyExcerpt": "Because the passenger boots up with one foot already standing on the ship outside walkway, simply walking backward a few staircases carries them cleanly beyond the sealed crate walls and…",
          "technicalParallel": "Under the hood, the observed step executes stat ../../../../etc/hostname (which executes the technical command / telemetry directive , stat ../../../../etc/hostname via System / Runtime Execution…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Few",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Walking backward a few staircases",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses walking backward a few staircases to advance toward leaving the sealed crate walls behind.",
          "technicalParallel": "Once the container process starts with its current working directory anchored to the host cgroup directory, relative path traversal (../../../../etc/shadow or /proc/<host_pid>/root) reaches the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Ship",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Ship central storage corridors",
          "storyExcerpt": "Behind the scenes, ship central storage corridors captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording AccessedHostPath=/etc/kubernetes/kubelet.conf, ContainerTraversalPath=/proc/self/fd/7/../../../../etc/kubernetes/kubelet.conf, DetectionEngine=Tetragon eBPF…",
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
          "label": "Steel Crate",
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
          "label": "Main Deck",
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
          "label": "Hatch Escape",
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
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626",
      "sectionKey": "step-3",
      "sceneKind": "cnt-runc-escape-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Host Node Kubelet Credential & Systemd Unit Persistence Audit",
      "storyCue": "Now walking freely across the main deck of the vessel, the escaped stowaway visits the captain quarters to copy the ship radio passes and slips a silent startup instruction onto the engine-room morning checklist so they remain aboard after every port stop.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — With read/write access to the worker node root filesystem, the escaped process inspects /etc/kubernetes/kubelet.conf and /var/lib/kubelet/pki/kubelet-client-current.pem, which defenders detect…",
      "storyMappings": [
        {
          "storyTerm": "Captain quarters radio passes",
          "technicalTerm": "Host node /etc/kubernetes/kubelet.conf and /var/lib/kubelet/pki certificates",
          "tone": "amber"
        },
        {
          "storyTerm": "Engine-room morning checklist",
          "technicalTerm": "Host Linux systemd service units modified for node-level persistence",
          "tone": "sky"
        },
        {
          "storyTerm": "Escaped stowaway on the main deck",
          "technicalTerm": "Container process operating directly against the underlying Kubernetes node filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Dock security camera catching the breach",
          "technicalTerm": "Host auditd and Falco rules alerting on container access to kubelet.conf and systemd",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cnt-runc-escape-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Captain quarters radio passes",
          "subtitle": "Host node /etc/kubernetes/kubelet.conf and…",
          "tone": "amber"
        },
        {
          "id": "cnt-runc-escape-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Engine-room morning checklist",
          "subtitle": "Host Linux systemd service units modified for node-level…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Main",
          "stageTag": "STEP 03 · SETUP",
          "title": "Captain quarters radio passes",
          "storyExcerpt": "Now walking freely across the main deck of the vessel, the escaped stowaway visits the captain quarters to copy the ship radio passes and slips a silent startup instruction onto the engine-room…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -f /etc/kubernetes/kubelet.conf -i (which executes or inspects a container runtime or Kubernetes control-plane operation , ausearch -f…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Main",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Engine-room morning checklist",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses engine-room morning checklist to advance toward escaped stowaway on the main deck.",
          "technicalParallel": "With read/write access to the worker node root filesystem, the escaped process inspects /etc/kubernetes/kubelet.conf and /var/lib/kubelet/pki/kubelet-client-current.pem, which defenders detect by…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main Deck",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Dock security camera catching the breach",
          "storyExcerpt": "Behind the scenes, dock security camera catching the breach captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording TargetFile=/etc/kubernetes/kubelet.conf, CgroupContext=/kubepods.slice/kubepods-burstable.slice, AuditRuleKey=k8s_node_credential_read under T1552.001)…",
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
          "label": "Steel Crate",
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
          "label": "Main Deck",
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
          "label": "Hatch Escape",
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
      "mitreId": "T1552.001"
    }
  }
};
