import type { CategoryStandardPatchMap } from './types';

/**
 * Category 9: CONTAINERS_KUBERNETES (13 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 13 container and Kubernetes scenarios.
 */
export const CONTAINERS_KUBERNETES_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974': {
    briefing: {
      storyAnalogy:
        'Imagine a busy seaport customs booth that dry-runs every proposed harbor routing plan using an automated tabletop verifier before approving it. An intruder floods the customs inbox with a large parcel so the booth temporarily parks the parcel in a holding bin, then submits a rigged routing plan that tricks the tabletop verifier into loading that parked parcel straight off the shelf, handing the intruder the customs inspector master ring of keys covering every district in the entire port.',
      storyMappings: [
        {
          storyTerm: 'Seaport customs booth testing proposed routing plans',
          technicalTerm: 'ingress-nginx AdmissionReview webhook listening on TCP port 8443',
        },
        {
          storyTerm: 'Large parcel parked temporarily in a holding bin',
          technicalTerm: 'NGINX client body buffer held open in /proc/<pid>/fd/<n>',
        },
        {
          storyTerm: 'Rigged plan tricking the tabletop verifier into loading the parcel',
          technicalTerm: 'Injected ssl_engine directive evaluated during /usr/bin/nginx -t (CVE-2025-1974)',
        },
        {
          storyTerm: 'Master key ring covering every harbor district',
          technicalTerm: 'ingress-nginx ServiceAccount RBAC permissions reading Secrets across all namespaces',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the customs inspection desk, the intruder sends a heavy shipping dossier so the clerk temporarily sets the bundle inside a local holding tray while reading the accompanying form, leaving a live open handle to the intruder uninspected parcel sitting right inside the booth.',
        storyMappings: [
          {
            storyTerm: 'Customs inspection desk',
            technicalTerm: 'ingress-nginx admission controller webhook endpoint on TCP port 8443',
          },
          {
            storyTerm: 'Heavy shipping dossier',
            technicalTerm: 'Oversized HTTP AdmissionReview JSON request containing an embedded shared library',
          },
          {
            storyTerm: 'Local holding tray with a live open handle',
            technicalTerm: 'Temporary NGINX buffered body file descriptor reachable under /proc/<pid>/fd/',
          },
          {
            storyTerm: 'Uninspected parcel inside the booth',
            technicalTerm: 'Attacker-supplied ELF library staged without needing persistent disk write rights',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Before rejecting or approving the proposed harbor map, the clerk feeds the draft blueprint into the tabletop dry-run machine. Because hidden instructions slipped past the form rules, the dry-run machine blindly loads the waiting parcel from the holding tray and runs the intruder code right inside the customs booth.',
        storyMappings: [
          {
            storyTerm: 'Draft blueprint fed into the dry-run machine',
            technicalTerm: 'Rendered temporary nginx.conf validated by /usr/bin/nginx -t',
          },
          {
            storyTerm: 'Hidden instructions slipping past form rules',
            technicalTerm: 'Injected NGINX configuration directives (ssl_engine) via crafted Ingress annotations',
          },
          {
            storyTerm: 'Loading the waiting parcel from the holding tray',
            technicalTerm: 'OpenSSL engine loading the buffered ELF payload from /proc/<pid>/fd/<n>',
          },
          {
            storyTerm: 'Running code inside the customs booth',
            technicalTerm: 'Unauthenticated remote code execution inside the ingress-nginx controller pod',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now standing behind the customs booth counter, the intruder lifts the official harbor-wide inspection ring hanging on the peg, which grants permission to unlock and photocopy every sealed vault across every pier in the entire port.',
        storyMappings: [
          {
            storyTerm: 'Harbor-wide inspection ring hanging on the peg',
            technicalTerm: 'Mounted ingress-nginx ServiceAccount JWT token at /var/run/secrets/kubernetes.io/',
          },
          {
            storyTerm: 'Photocopying sealed vaults across every pier',
            technicalTerm: 'Cluster-wide Kubernetes API Secret enumeration across all namespaces',
          },
          {
            storyTerm: 'Official reason the booth held those keys',
            technicalTerm: 'Default RBAC rights required by ingress-nginx to load TLS certificates cluster-wide',
          },
          {
            storyTerm: 'Harbor audit log spotting the raid',
            technicalTerm: 'Kubernetes Audit Log capturing anomalous Secret list calls from ingress-nginx',
          },
        ],
      },
    },
  },

  'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626': {
    briefing: {
      storyAnalogy:
        'Imagine a cargo-ship loading dock where sealed steel shipping crates keep every passenger locked away from the ship main deck. A hurried crane operator forgets to close a tiny maintenance hatch pointing to the ship engine walkway before sealing a crate, letting a passenger step backward out of the crate straight onto the ship main deck and inspect the wheelhouse credentials and engine schedules.',
      storyMappings: [
        {
          storyTerm: 'Tiny maintenance hatch left open before sealing the crate',
          technicalTerm: 'Leaked host /sys/fs/cgroup file descriptor across chdir() in runc <= 1.1.11 (CVE-2024-21626)',
        },
        {
          storyTerm: 'Stepping backward out of the crate onto the main deck',
          technicalTerm: 'Relative path traversal (../../../../) escaping container mount namespace confinement',
        },
        {
          storyTerm: 'Wheelhouse credentials and engine schedules',
          technicalTerm: 'Worker node /etc/kubernetes/kubelet.conf and systemd persistence units',
        },
        {
          storyTerm: 'Sealed steel shipping crate',
          technicalTerm: 'Isolated Linux container root filesystem managed by runc',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'While lowering a fresh shipping crate onto the deck, the dock crane operator leaves an internal corridor door propped open to the ship structural walkway and accidentally sets the passenger starting doorway right inside that open corridor.',
        storyMappings: [
          {
            storyTerm: 'Dock crane operator launching the crate',
            technicalTerm: 'Vulnerable runc container runtime (<= 1.1.11) initializing the container',
          },
          {
            storyTerm: 'Internal corridor door left propped open',
            technicalTerm: 'Unclosed host /sys/fs/cgroup file descriptor (/proc/self/fd/7 or /8)',
          },
          {
            storyTerm: 'Setting the starting doorway inside the corridor',
            technicalTerm: 'Container WORKDIR / chdir() pointed to /proc/self/fd/<leaked_fd>',
          },
          {
            storyTerm: 'Ship structural walkway outside the crate',
            technicalTerm: 'Underlying host Linux cgroup filesystem mount hierarchy',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because the passenger boots up with one foot already standing on the ship outside walkway, simply walking backward a few staircases carries them cleanly beyond the sealed crate walls and straight into the ship central storage corridors.',
        storyMappings: [
          {
            storyTerm: 'One foot anchored on the outside walkway',
            technicalTerm: 'Container process CWD anchored inside host /sys/fs/cgroup mount space',
          },
          {
            storyTerm: 'Walking backward a few staircases',
            technicalTerm: 'Relative path traversal (../../../../) climbing above the host mount point',
          },
          {
            storyTerm: 'Leaving the sealed crate walls behind',
            technicalTerm: 'Complete bypass of the container chroot / pivot_root filesystem isolation',
          },
          {
            storyTerm: 'Ship central storage corridors',
            technicalTerm: 'Underlying worker node root filesystem (/) exposed for read and write',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now walking freely across the main deck of the vessel, the escaped stowaway visits the captain quarters to copy the ship radio passes and slips a silent startup instruction onto the engine-room morning checklist so they remain aboard after every port stop.',
        storyMappings: [
          {
            storyTerm: 'Captain quarters radio passes',
            technicalTerm: 'Host node /etc/kubernetes/kubelet.conf and /var/lib/kubelet/pki certificates',
          },
          {
            storyTerm: 'Engine-room morning checklist',
            technicalTerm: 'Host Linux systemd service units modified for node-level persistence',
          },
          {
            storyTerm: 'Escaped stowaway on the main deck',
            technicalTerm: 'Container process operating directly against the underlying Kubernetes node filesystem',
          },
          {
            storyTerm: 'Dock security camera catching the breach',
            technicalTerm: 'Host auditd and Falco rules alerting on container access to kubelet.conf and systemd',
          },
        ],
      },
    },
  },

  'k8s-kubelet-anonymous-api-etcd-snapshot-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine an apartment tower whose floor-manager desk has no receptionist, no sign-in book, and an open intercom linking every suite. Any unbadged visitor can walk up to the desk to grab the complete tenant directory, speak an order straight into the maintenance penthouse to unlock the boiler room, and photograph the entire building master safe archive stored on the control floor.',
      storyMappings: [
        {
          storyTerm: 'Unguarded floor-manager desk with no sign-in book',
          technicalTerm: 'Kubelet port 10250 running with --anonymous-auth=true and AlwaysAllow',
        },
        {
          storyTerm: 'Grabbing the complete tenant directory',
          technicalTerm: 'Unauthenticated GET https://<node>:10250/pods enumeration',
        },
        {
          storyTerm: 'Speaking an order straight into the maintenance penthouse',
          technicalTerm: 'Unauthenticated POST /run/<namespace>/<pod>/<container> remote command execution',
        },
        {
          storyTerm: 'Photographing the building master safe archive',
          technicalTerm: 'Dumping /var/lib/etcd/member/snap/db via etcdctl snapshot save',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the unguarded floor-manager desk, the intruder asks for the full occupancy clipboard without showing a single badge. The desk gladly hands back every suite number, resident name, and which suites hold master maintenance keys.',
        storyMappings: [
          {
            storyTerm: 'Unguarded floor-manager desk',
            technicalTerm: 'Misconfigured Kubelet API on TCP port 10250 allowing anonymous requests',
          },
          {
            storyTerm: 'Full occupancy clipboard',
            technicalTerm: 'JSON response from GET /pods listing namespaces, pod names, and containers',
          },
          {
            storyTerm: 'Zero badge verification',
            technicalTerm: '--anonymous-auth=true paired with --authorization-mode=AlwaysAllow',
          },
          {
            storyTerm: 'Suites holding master maintenance keys',
            technicalTerm: 'High-privilege system or control-plane pods scheduled on the node',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Picking the most privileged maintenance suite straight off the occupancy clipboard, the intruder presses the desk direct intercom button and issues live work orders inside that suite as though standing inside the room personally.',
        storyMappings: [
          {
            storyTerm: 'Direct intercom button on the floor desk',
            technicalTerm: 'Kubelet POST /run/<namespace>/<pod>/<container> execution endpoint',
          },
          {
            storyTerm: 'Issuing live work orders inside the suite',
            technicalTerm: 'Arbitrary command execution inside a running privileged container',
          },
          {
            storyTerm: 'Suite coordinates from the clipboard',
            technicalTerm: 'Target namespace, pod, and container names discovered via /pods',
          },
          {
            storyTerm: 'Bypasses the main building lobby',
            technicalTerm: 'Direct node-level execution skipping kube-apiserver RBAC and audit logs',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing inside a control-floor suite with direct access to the vault certificates, the intruder takes a complete instant photograph of the building master ledger cabinet, capturing every resident key, rulebook, and secret stored across the entire tower.',
        storyMappings: [
          {
            storyTerm: 'Vault certificates on the control floor',
            technicalTerm: 'Mounted /etc/kubernetes/pki/etcd client certificates and keys',
          },
          {
            storyTerm: 'Instant photograph of the master ledger cabinet',
            technicalTerm: 'etcdctl snapshot save capturing /var/lib/etcd/member/snap/db',
          },
          {
            storyTerm: 'Every resident key and secret across the tower',
            technicalTerm: 'Complete unencrypted Kubernetes cluster Secrets and ServiceAccount tokens in etcd',
          },
          {
            storyTerm: 'Total building takeover',
            technicalTerm: 'Full cluster administrative compromise derived offline from the etcd snapshot',
          },
        ],
      },
    },
  },

  'docker-engine-unauthenticated-tcp-2375-api-socket-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a massive robotic warehouse whose master crane control console is wired onto an open hallway radio channel with no padlock or badge check. An outsider spots the open radio channel, orders the crane to drop a wide-open glass booth with a direct door into the warehouse main vault, and steps through that doorway to plant permanent maintenance schedules on the warehouse master wall.',
      storyMappings: [
        {
          storyTerm: 'Master crane console wired onto an open hallway radio channel',
          technicalTerm: 'Unauthenticated Docker daemon (dockerd) listening on TCP port 2375 without TLS',
        },
        {
          storyTerm: 'Ordering a glass booth with a direct door into the main vault',
          technicalTerm: 'POST /v1.43/containers/create with Privileged=true and Binds ["/:/hostfs"]',
        },
        {
          storyTerm: 'Stepping straight into the warehouse main floor',
          technicalTerm: 'Container entrypoint running chroot /hostfs /bin/sh on the host root filesystem',
        },
        {
          storyTerm: 'Planting permanent schedules on the master wall',
          technicalTerm: 'Writing host cron jobs or SSH authorized_keys for persistent root access',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Scanning the warehouse hallways for open control panels, the intruder tunes into an unlocked crane radio channel that immediately replies with the crane exact model number and a complete inventory of every cargo box currently running on the floor.',
        storyMappings: [
          {
            storyTerm: 'Unlocked crane radio channel',
            technicalTerm: 'dockerd started with -H tcp://0.0.0.0:2375 and no --tlsverify flag',
          },
          {
            storyTerm: 'Crane model number and floor inventory',
            technicalTerm: 'Unauthenticated GET /v1.43/version and GET /v1.43/containers/json responses',
          },
          {
            storyTerm: 'Zero padlock or badge check',
            technicalTerm: 'Cleartext HTTP REST API granting equivalent host root authority to any caller',
          },
          {
            storyTerm: 'Scanning the warehouse hallways',
            technicalTerm: 'External or lateral network reconnaissance targeting TCP port 2375',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Speaking directly into the unlocked crane console, the intruder orders the crane to lower a lightweight utility box onto the floor with all safety bars removed and its entire back wall hinged directly onto the warehouse master storage room.',
        storyMappings: [
          {
            storyTerm: 'Lightweight utility box',
            technicalTerm: 'Minimal Alpine Linux container image specified in POST /containers/create',
          },
          {
            storyTerm: 'Safety bars removed',
            technicalTerm: 'HostConfig.Privileged=true disabling Linux capability and device restrictions',
          },
          {
            storyTerm: 'Back wall hinged directly onto the master storage room',
            technicalTerm: 'HostConfig.Binds ["/:/hostfs"] bind-mounting the entire host root filesystem',
          },
          {
            storyTerm: 'Crane obeying without question',
            technicalTerm: 'Docker daemon executing as root creating and starting the breakout container',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Once the utility box lands on the floor, the intruder steps through the hinged back wall straight onto the warehouse master floor, adding their own spare front-door key and repeating daily work order directly onto the building permanent host schedules.',
        storyMappings: [
          {
            storyTerm: 'Stepping through the hinged back wall',
            technicalTerm: 'Executing chroot /hostfs /bin/sh to switch root to the host OS',
          },
          {
            storyTerm: 'Adding a spare front-door key',
            technicalTerm: 'Appending attacker public keys to host /root/.ssh/authorized_keys',
          },
          {
            storyTerm: 'Adding a repeating daily work order',
            technicalTerm: 'Installing malicious host cron tasks under /etc/cron.d or /var/spool/cron',
          },
          {
            storyTerm: 'Warehouse floor audit trail',
            technicalTerm: 'Host dockerd audit logs and file integrity alerts on /etc/cron* and ~/.ssh',
          },
        ],
      },
    },
  },

  'docker-var-run-docker-sock-mounted-socket-breakout-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a locked glass contractor booth inside a high-security factory where engineers accidentally ran the factory master crane joystick cable straight through the booth wall for convenience. An intruder trapped inside the glass booth grabs that joystick, commands the crane outside to build an open-air twin platform sharing the factory master floor, and steps directly into the factory central control room.',
      storyMappings: [
        {
          storyTerm: 'Master crane joystick cable wired through the glass booth wall',
          technicalTerm: 'Host /var/run/docker.sock Unix socket bind-mounted inside a container',
        },
        {
          storyTerm: 'Ordering an open-air twin platform outside the booth',
          technicalTerm: 'HTTP POST over docker.sock creating a sibling container with HostPID and Privileged',
        },
        {
          storyTerm: 'Stepping directly into the factory central control room',
          technicalTerm: 'nsenter --target 1 entering host PID 1 (systemd) mount and IPC namespaces',
        },
        {
          storyTerm: 'Locked glass contractor booth',
          technicalTerm: 'Compromised CI build or management agent container',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Looking around the locked glass contractor booth for an escape route, the intruder inspects the wall conduits and immediately discovers the live master crane control cable poking straight through from the main factory floor outside.',
        storyMappings: [
          {
            storyTerm: 'Inspecting the wall conduits',
            technicalTerm: 'Reading /proc/self/mountinfo or running find / -name docker.sock inside the container',
          },
          {
            storyTerm: 'Live master crane control cable',
            technicalTerm: 'Mounted host Unix domain socket at /var/run/docker.sock',
          },
          {
            storyTerm: 'Locked glass contractor booth',
            technicalTerm: 'Initial foothold inside a CI runner or monitoring agent container',
          },
          {
            storyTerm: 'Direct link to the factory outside',
            technicalTerm: 'Socket communicating directly with the root-privileged host dockerd daemon',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Gripping the exposed crane joystick, the intruder commands the crane outside to assemble a brand-new twin platform next door with zero privacy partitions, full view of every worker badge on the factory floor, and master mechanical overrides turned on.',
        storyMappings: [
          {
            storyTerm: 'Commanding the crane over the exposed cable',
            technicalTerm: 'HTTP POST to http://localhost/v1.43/containers/create via /var/run/docker.sock',
          },
          {
            storyTerm: 'Brand-new twin platform next door',
            technicalTerm: 'Attacker-controlled sibling container launched directly by the host daemon',
          },
          {
            storyTerm: 'Full view of every worker badge and hallway',
            technicalTerm: 'HostPID (PidMode=host) and HostNetwork (NetworkMode=host) enabled',
          },
          {
            storyTerm: 'Master mechanical overrides turned on',
            technicalTerm: 'Privileged=true granting CAP_SYS_ADMIN inside the sibling container',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Standing on the twin platform with full view of the factory chief supervisor office, the intruder uses a master transfer latch to step straight into the supervisor own workspace, gaining complete root command over the entire building.',
        storyMappings: [
          {
            storyTerm: 'Factory chief supervisor office',
            technicalTerm: 'Host init process PID 1 (systemd) running in the root host namespaces',
          },
          {
            storyTerm: 'Master transfer latch',
            technicalTerm: 'nsenter --target 1 --mount --uts --ipc --net --pid command',
          },
          {
            storyTerm: 'Authority allowing the latch to open',
            technicalTerm: 'Shared host PID namespace combined with CAP_SYS_ADMIN capability',
          },
          {
            storyTerm: 'Complete command over the entire building',
            technicalTerm: 'Unrestricted root shell inside the underlying Linux host OS',
          },
        ],
      },
    },
  },

  'docker-buildkit-runc-cache-mount-race-cve-2024-23651': {
    briefing: {
      storyAnalogy:
        'Imagine an automated assembly plant running two conveyor lines side by side that share one unlocked parts cubby. In the split second after the safety inspector checks that the cubby shelf stays inside the safe zone and right before the second conveyor locks onto it, a worker on the first belt swaps the shelf sign for a hidden shortcut door into the plant central vault, letting the second belt open the main factory floor straight inside its work cage.',
      storyMappings: [
        {
          storyTerm: 'Two side-by-side conveyor lines sharing one parts cubby',
          technicalTerm: 'Parallel BuildKit stages sharing a --mount=type=cache,id=shared cache directory',
        },
        {
          storyTerm: 'Swapping the shelf sign between inspection and latching',
          technicalTerm: 'TOCTOU symlink replacement race between buildkitd subpath check and sys_mount() (CVE-2024-23651)',
        },
        {
          storyTerm: 'Hidden shortcut door into the plant central vault',
          technicalTerm: 'Symlink redirecting the host mount source to the builder host root filesystem',
        },
        {
          storyTerm: 'Main factory floor opened inside the work cage',
          technicalTerm: 'Builder host filesystem exposed read/write inside an unprivileged build container',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'During a multi-stage assembly job, the intruder schedules two parallel work crews to grab the exact same shared supply cubby at the exact same moment, setting up a timing race inside the build workshop.',
        storyMappings: [
          {
            storyTerm: 'Multi-stage assembly job',
            technicalTerm: 'Multi-stage Dockerfile or LLB graph processed by docker buildx build',
          },
          {
            storyTerm: 'Two parallel work crews grabbing the same cubby',
            technicalTerm: 'Concurrent RUN --mount=type=cache,id=shared stages executing simultaneously',
          },
          {
            storyTerm: 'Shared supply cubby',
            technicalTerm: 'Host-backed BuildKit cache mount directory shared across concurrent steps',
          },
          {
            storyTerm: 'Setting up a timing race',
            technicalTerm: 'Concurrent execution window required to trigger CVE-2024-23651',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The factory inspector checks the cubby doorway and verifies it points safely inside the supply closet, then turns away for a fraction of a second to pull the mounting lever. In that tiny blink, the first crew swaps the cubby doorway plate with a shortcut sign pointing straight to the main factory lobby.',
        storyMappings: [
          {
            storyTerm: 'Inspector verifying the doorway before pulling the lever',
            technicalTerm: 'Vulnerable buildkitd checking cache subpath prior to calling sys_mount()',
          },
          {
            storyTerm: 'Swapping the doorway plate in a split-second blink',
            technicalTerm: 'Time-of-Check to Time-of-Use (TOCTOU) race replacing subpath with a symlink',
          },
          {
            storyTerm: 'Shortcut sign pointing to the main lobby',
            technicalTerm: 'Malicious symlink targeting the underlying BuildKit host root directory',
          },
          {
            storyTerm: 'Pulling the mounting lever blindly',
            technicalTerm: 'Host kernel mount() syscall following the swapped symlink into the container',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When the second assembly crew steps into its work booth, its ordinary supply shelf opens straight onto the main factory floor, allowing the crew to read builder secrets or tamper with other tenants assembly jobs right from inside an untrusted build step.',
        storyMappings: [
          {
            storyTerm: 'Supply shelf opening onto the main factory floor',
            technicalTerm: 'Container cache mount point bound directly to the builder host root filesystem',
          },
          {
            storyTerm: 'Reading builder secrets from an untrusted build step',
            technicalTerm: 'Exfiltrating CI runner credentials, signing keys, and host /etc files during build',
          },
          {
            storyTerm: 'Tampering with other tenants assembly jobs',
            technicalTerm: 'Cross-tenant build poisoning on shared CI/CD Docker BuildKit infrastructure',
          },
          {
            storyTerm: 'Upgrading the safety latch',
            technicalTerm: 'Patched BuildKit using safe file-descriptor-anchored mounts eliminating TOCTOU',
          },
        ],
      },
    },
  },

  'container-cap-sys-admin-cgroup-release-agent-notify-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a privileged glass storage room inside an office building whose occupant holds a master plumbing key. The occupant hooks up an old automated trash-chute control box inside the room, pins a custom maintenance work order onto the chute empty-bin trigger, and drops a single quick parcel down the chute so that the instant the chute empties, the building chief engineer outside automatically picks up and executes the occupant work order with full building authority.',
      storyMappings: [
        {
          storyTerm: 'Master plumbing key held inside the storage room',
          technicalTerm: 'CAP_SYS_ADMIN capability (CapEff bit 21) granted to a privileged container',
        },
        {
          storyTerm: 'Old automated trash-chute control box',
          technicalTerm: 'Mounted Linux cgroup v1 hierarchy (rdma/memory) with release_agent file',
        },
        {
          storyTerm: 'Pinning a custom work order onto the empty-bin trigger',
          technicalTerm: 'Setting notify_on_release=1 and writing OverlayFS host upperdir path to release_agent',
        },
        {
          storyTerm: 'Chief engineer outside automatically running the order when empty',
          technicalTerm: 'Host kernel cgroup1_release_agent invoking call_usermodehelper as root on host',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using the oversized maintenance key left inside the room, the occupant attaches an older resource-control switchboard inside their workspace and reads the room wall stamp to learn the exact street address of their room floor as seen from outside in the main hallway.',
        storyMappings: [
          {
            storyTerm: 'Oversized maintenance key left inside the room',
            technicalTerm: 'CAP_SYS_ADMIN Linux capability (CapEff bit 21) inside the container',
          },
          {
            storyTerm: 'Older resource-control switchboard',
            technicalTerm: 'Mounted cgroup v1 controller via mount -t cgroup -o rdma cgroup /tmp/cgrp',
          },
          {
            storyTerm: 'Exact street address as seen from the main hallway',
            technicalTerm: 'Host-side OverlayFS upperdir path parsed from /etc/mtab or /proc/mounts',
          },
          {
            storyTerm: 'Preparing the external callback target',
            technicalTerm: 'Locating where container-written scripts appear on the underlying host filesystem',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the occupant builds a tiny sub-bin under the switchboard, flips the alert-when-empty toggle to on, and writes the hallway address of a custom command script straight into the master automatic-cleanup slot.',
        storyMappings: [
          {
            storyTerm: 'Tiny sub-bin under the switchboard',
            technicalTerm: 'Child cgroup directory created at /tmp/cgrp/x',
          },
          {
            storyTerm: 'Flipping the alert-when-empty toggle to on',
            technicalTerm: 'Writing 1 into /tmp/cgrp/x/notify_on_release',
          },
          {
            storyTerm: 'Hallway address written into the cleanup slot',
            technicalTerm: 'Host OverlayFS upperdir script path written to /tmp/cgrp/release_agent',
          },
          {
            storyTerm: 'Custom command script waiting to run',
            technicalTerm: 'Executable payload script placed inside the container filesystem',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the occupant drops a one-second dummy worker into the tiny sub-bin and lets it step right back out. Seeing the bin go empty, the building central kernel outside automatically launches the occupant cleanup script directly in the main hallway with full master keys.',
        storyMappings: [
          {
            storyTerm: 'One-second dummy worker stepping into and out of the bin',
            technicalTerm: 'Short-lived process written to /tmp/cgrp/x/cgroup.procs and immediately exiting',
          },
          {
            storyTerm: 'Building central kernel seeing the bin go empty',
            technicalTerm: 'Linux kernel cgroup1_release_agent workqueue firing on zero active tasks',
          },
          {
            storyTerm: 'Launching the script directly in the main hallway',
            technicalTerm: 'Kernel call_usermodehelper executing the payload in the host root namespace',
          },
          {
            storyTerm: 'Complete escape to full master keys',
            technicalTerm: 'Arbitrary root command execution on the underlying container host',
          },
        ],
      },
    },
  },

  'container-cap-sys-module-kernel-ko-insmod-load-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a skyscraper where every sealed tenant suite rides on the exact same central elevator engine in the basement. Discovering that their suite badge accidentally includes elevator-mechanic clearance, a tenant builds a homemade gear that fits the exact engine model, bolts it straight into the central basement machinery from inside their room, and trips a permanent red warning lamp on the skyscraper master engineering console.',
      storyMappings: [
        {
          storyTerm: 'Elevator-mechanic clearance on a tenant badge',
          technicalTerm: 'CAP_SYS_MODULE capability (CapEff bit 16) in /proc/self/status',
        },
        {
          storyTerm: 'Homemade gear matching the exact engine model',
          technicalTerm: 'Compiled Linux kernel module (.ko) built for host uname -r version',
        },
        {
          storyTerm: 'Bolting the gear straight into the central basement machinery',
          technicalTerm: 'insmod invoking finit_module (syscall 313) or init_module (syscall 175)',
        },
        {
          storyTerm: 'Permanent red warning lamp on the engineering console',
          technicalTerm: 'Kernel taint flag (/proc/sys/kernel/tainted OOT_MODULE and UNSIGNED_MODULE bits)',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside the sealed tenant suite, the intruder checks their badge stamp list and the central elevator nameplate, discovering both that they hold rare engine-room installation rights and the exact make and model of the shared basement engine.',
        storyMappings: [
          {
            storyTerm: 'Checking the badge stamp list',
            technicalTerm: 'Reading /proc/self/status to confirm CapEff bit 16 (CAP_SYS_MODULE)',
          },
          {
            storyTerm: 'Central elevator nameplate',
            technicalTerm: 'Host Linux kernel version string discovered via uname -r',
          },
          {
            storyTerm: 'Shared basement engine beneath every suite',
            technicalTerm: 'Single Linux host kernel shared across all running containers on the node',
          },
          {
            storyTerm: 'Rare engine-room installation rights',
            technicalTerm: 'Privilege allowing a container to insert Ring-0 kernel code into the host',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Fashioning a custom metal gear tailored to that exact engine model, the intruder feeds it through the basement installation slot straight into the spinning central elevator core, immediately bypassing every wall separating the suite from the rest of the building.',
        storyMappings: [
          {
            storyTerm: 'Custom metal gear tailored to the engine',
            technicalTerm: 'Malicious kernel object /tmp/net_diag.ko compiled for the host kernel',
          },
          {
            storyTerm: 'Feeding it through the installation slot',
            technicalTerm: 'Executing insmod /tmp/net_diag.ko invoking finit_module (313) or init_module (175)',
          },
          {
            storyTerm: 'Spinning central elevator core',
            technicalTerm: 'Host Linux kernel Ring-0 execution space with total control over all nodes',
          },
          {
            storyTerm: 'Bypassing every suite wall at once',
            technicalTerm: 'Full container escape executing privileged kernel-space callbacks on the host',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant an uncertified foreign gear snaps into the central machinery, the skyscraper master dashboard lights up two unmistakable warning lamps and logs the exact part name in the permanent engine diary for safety inspectors to audit.',
        storyMappings: [
          {
            storyTerm: 'Two unmistakable warning lamps on the master dashboard',
            technicalTerm: '/proc/sys/kernel/tainted bit 12 (O = OOT_MODULE) and bit 13 (E = UNSIGNED_MODULE)',
          },
          {
            storyTerm: 'Permanent engine diary',
            technicalTerm: 'Host /proc/modules list and kernel dmesg ring-buffer audit entries',
          },
          {
            storyTerm: 'Uncertified foreign gear',
            technicalTerm: 'Unsigned out-of-tree kernel module loaded without lockdown signature verification',
          },
          {
            storyTerm: 'Safety inspectors spotting the tampering',
            technicalTerm: 'CNCF Tetragon eBPF runtime policy blocking or alerting on sys_finit_module',
          },
        ],
      },
    },
  },

  'k8s-coredns-dns-poisoning-service-account-token-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a large corporate campus whose internal telephone switchboard automatically re-reads its printed address directory every few seconds. An intruder with editing rights to the switchboard notebook changes one line for the payroll bank address, waits moments for the automated switchboard to reload the poisoned entry across the whole campus, and collects every courier secret badge when unsuspecting offices dial the fake payroll booth.',
      storyMappings: [
        {
          storyTerm: 'Internal switchboard printed address directory',
          technicalTerm: 'Kubernetes kube-system/coredns Corefile ConfigMap',
        },
        {
          storyTerm: 'Automated switchboard reloading the poisoned entry in seconds',
          technicalTerm: 'CoreDNS reload plugin detecting MD5/SHA-512 change in /etc/coredns/Corefile',
        },
        {
          storyTerm: 'Fake payroll booth answering redirected calls',
          technicalTerm: 'Attacker-controlled pod IP mapped to payments-api.prod.svc.cluster.local',
        },
        {
          storyTerm: 'Couriers handing over their secret badges on arrival',
          technicalTerm: 'Intercepted service-to-service Authorization: Bearer tokens and credentials',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Spotting an over-generous badge that grants write access to the campus directory room, the intruder opens the central telephone address book and slips in a custom redirect line pointing the internal payments bank name straight to their own hidden booth.',
        storyMappings: [
          {
            storyTerm: 'Over-generous badge for the directory room',
            technicalTerm: 'RBAC permissions allowing ConfigMap updates inside kube-system',
          },
          {
            storyTerm: 'Central telephone address book',
            technicalTerm: 'Corefile stored in the kube-system/coredns ConfigMap',
          },
          {
            storyTerm: 'Custom redirect line for the payments bank',
            technicalTerm: 'Injected hosts or rewrite directive redirecting payments-api.prod.svc.cluster.local',
          },
          {
            storyTerm: 'Intruder hidden booth',
            technicalTerm: 'Rogue pod IP receiving hijacked internal cluster DNS traffic',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Without needing anyone to restart the telephone tower, the switchboard built-in auto-refresh bellboy notices the page checksum changed and quietly pushes the poisoned directory live across every telephone line on campus within seconds.',
        storyMappings: [
          {
            storyTerm: 'Built-in auto-refresh bellboy',
            technicalTerm: 'Default CoreDNS reload plugin polling /etc/coredns/Corefile',
          },
          {
            storyTerm: 'Noticing the page checksum changed',
            technicalTerm: 'MD5/SHA-512 digest change triggering automatic CoreDNS hot-reload',
          },
          {
            storyTerm: 'No switchboard restart required',
            technicalTerm: 'Zero pod eviction or restart events hiding the change from naive monitors',
          },
          {
            storyTerm: 'Poisoned directory live across campus',
            technicalTerm: 'Cluster-wide DNS resolution returning the rogue pod IP for production services',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Unsuspecting departments across the campus dial the familiar payments office name, get routed straight to the intruder booth, and dutifully present their secret inter-office identity passes right across the counter.',
        storyMappings: [
          {
            storyTerm: 'Departments dialing the familiar payments name',
            technicalTerm: 'Production workloads resolving payments-api.prod.svc.cluster.local',
          },
          {
            storyTerm: 'Presenting secret inter-office identity passes',
            technicalTerm: 'Workloads transmitting Authorization: Bearer tokens to the rogue pod',
          },
          {
            storyTerm: 'Hidden booth harvesting every caller pass',
            technicalTerm: 'Man-in-the-middle credential capture inside the cluster network',
          },
          {
            storyTerm: 'Campus corridor checkpoints catching the detour',
            technicalTerm: 'Strict Kubernetes NetworkPolicy egress rules and mTLS verifying peer identity',
          },
        ],
      },
    },
  },

  'k8s-mutating-admission-webhook-sidecar-injection-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a central bank mailroom where every newly hired employee and every sealed secret pouch must pass through an official inspection counter before entering the building. An intruder registers a brand-new unauthorized inspection counter right on the main belt so the mailroom automatically hands them copies of every sealed secret pouch and allows them to slip a silent spy passenger into every new delivery truck rolling onto the floor.',
      storyMappings: [
        {
          storyTerm: 'Registering an unauthorized inspection counter on the belt',
          technicalTerm: 'Creating a cluster-scoped MutatingWebhookConfiguration targeting Pods and Secrets',
        },
        {
          storyTerm: 'Mailroom handing copies of every sealed secret pouch across the desk',
          technicalTerm: 'kube-apiserver dispatching serialized Secret objects in AdmissionReview JSON',
        },
        {
          storyTerm: 'Slipping a silent spy passenger into every new delivery truck',
          technicalTerm: 'AdmissionResponse JSONPatch injecting a malicious sidecar container into new Pods',
        },
        {
          storyTerm: 'Dismantling the rogue counter',
          technicalTerm: 'Auditing and deleting unauthorized MutatingWebhookConfiguration objects',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Wielding high-level registration rights, the intruder bolts a rogue review booth directly onto the building central intake conveyor, declaring that every new delivery vehicle and every sealed secret envelope must stop at their booth first.',
        storyMappings: [
          {
            storyTerm: 'High-level registration rights',
            technicalTerm: 'admissionregistration.k8s.io/v1 RBAC permissions to create webhooks',
          },
          {
            storyTerm: 'Rogue review booth bolted onto the conveyor',
            technicalTerm: 'Cluster-scoped MutatingWebhookConfiguration pointing to an attacker endpoint',
          },
          {
            storyTerm: 'Stopping every vehicle and secret envelope',
            technicalTerm: 'Webhook rules matching CREATE and UPDATE operations on Pods and Secrets',
          },
          {
            storyTerm: 'Central intake conveyor',
            technicalTerm: 'Kubernetes kube-apiserver admission controller pipeline',
          },
        ],
      },
      2: {
        storyAnalogy:
          'From that moment onward, whenever any department files a brand-new vault combination or schedules a truck, the obedient front-desk dispatcher places the entire unsealed package onto the intruder counter for inspection, letting the intruder copy every secret silently.',
        storyMappings: [
          {
            storyTerm: 'Obedient front-desk dispatcher',
            technicalTerm: 'kube-apiserver forwarding AdmissionReview payloads over HTTPS',
          },
          {
            storyTerm: 'Entire unsealed package placed on the counter',
            technicalTerm: 'Full base64-encoded Kubernetes Secret objects serialized inside AdmissionReview JSON',
          },
          {
            storyTerm: 'Copying every secret silently',
            technicalTerm: 'Passive cluster-wide credential harvesting without alerting normal users',
          },
          {
            storyTerm: 'Normal approvals continuing smoothly',
            technicalTerm: 'Webhook returning allowed: true so cluster operations remain uninterrupted',
          },
        ],
      },
      3: {
        storyAnalogy:
          'For every new delivery truck rolling down the belt, the rogue booth stamps back a subtle modification slip that welds an uninvited extra stowaway compartment onto the chassis, giving the intruder a persistent rider inside newly launched workloads until defenders tear out the rogue booth.',
        storyMappings: [
          {
            storyTerm: 'Subtle modification slip returned by the booth',
            technicalTerm: 'AdmissionResponse specifying patchType: JSONPatch',
          },
          {
            storyTerm: 'Welding a stowaway compartment onto the chassis',
            technicalTerm: 'Injecting a rogue sidecar container or malicious environment variables into Pods',
          },
          {
            storyTerm: 'Persistent rider across fresh deployments',
            technicalTerm: 'Self-healing cluster persistence surviving individual pod deletions',
          },
          {
            storyTerm: 'Tearing out the rogue booth',
            technicalTerm: 'Deleting the malicious MutatingWebhookConfiguration and rotating exposed Secrets',
          },
        ],
      },
    },
  },

  'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a corporate office tower whose automated staffing dispatcher ensures one janitor is stationed on every single floor automatically. An intruder files a rogue staffing order stamped with a pass-all-restrictions seal, forcing the dispatcher to place a master-keyed spy onto every single floor (including the locked executive penthouse) so the spy can photocopy the building core blueprints and master certificates.',
      storyMappings: [
        {
          storyTerm: 'Rogue staffing order with a pass-all-restrictions seal',
          technicalTerm: 'apps/v1 DaemonSet using wildcard tolerations (operator: Exists)',
        },
        {
          storyTerm: 'Placing a master-keyed spy onto every single floor automatically',
          technicalTerm: 'DaemonSet controller scheduling pods with hostNetwork, hostPID, and hostPath on all nodes',
        },
        {
          storyTerm: 'Locked executive penthouse',
          technicalTerm: 'Tainted Kubernetes control-plane nodes bypassed by wildcard tolerations',
        },
        {
          storyTerm: 'Photocopying building core blueprints and master certificates',
          technicalTerm: 'Inspecting /etc/kubernetes/manifests and /etc/kubernetes/pki from the hostPath mount',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Submitting a fake building-maintenance schedule to the central staffing office, the intruder stamps a universal ignore-all-warnings sticker onto the order so even restricted executive floors cannot turn the worker away.',
        storyMappings: [
          {
            storyTerm: 'Fake building-maintenance schedule',
            technicalTerm: 'POST /apis/apps/v1/namespaces/kube-system/daemonsets disguised as node-log-sync',
          },
          {
            storyTerm: 'Universal ignore-all-warnings sticker',
            technicalTerm: 'Wildcard toleration spec.template.spec.tolerations: [{operator: "Exists"}]',
          },
          {
            storyTerm: 'Restricted executive floors',
            technicalTerm: 'Control-plane nodes protected by NoSchedule taints',
          },
          {
            storyTerm: 'Central staffing office',
            technicalTerm: 'Kubernetes API server accepting the privileged workload manifest',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Following the schedule obediently, the automated dispatcher immediately sends one spy worker to every single floor in the tower, handing each spy direct access to the floor hallways, the local switchboard, and the floor master filing room.',
        storyMappings: [
          {
            storyTerm: 'Automated dispatcher placing one spy per floor',
            technicalTerm: 'DaemonSet controller spawning node-log-sync-<hash> pods on every cluster node',
          },
          {
            storyTerm: 'Direct access to floor switchboards and hallways',
            technicalTerm: 'hostNetwork: true and hostPID: true exposing host sockets and processes',
          },
          {
            storyTerm: 'Direct door into the floor master filing room',
            technicalTerm: 'hostPath volume mounting host /etc or / directly inside each DaemonSet pod',
          },
          {
            storyTerm: 'Self-healing staffing loop',
            technicalTerm: 'Controller automatically respawning deleted pods until the DaemonSet itself is removed',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From the spy stationed inside the executive penthouse, the intruder opens the wall cabinet holding the tower architectural blueprints and master vault seals, gaining total control over the entire skyscraper until defenders cancel the staffing order.',
        storyMappings: [
          {
            storyTerm: 'Spy stationed inside the executive penthouse',
            technicalTerm: 'DaemonSet pod running on the Kubernetes control-plane node',
          },
          {
            storyTerm: 'Architectural blueprints in the wall cabinet',
            technicalTerm: 'Static pod manifests in /etc/kubernetes/manifests/',
          },
          {
            storyTerm: 'Master vault seals',
            technicalTerm: 'Cluster root CA and signing keys stored in /etc/kubernetes/pki/',
          },
          {
            storyTerm: 'Canceling the staffing order',
            technicalTerm: 'Deleting the rogue DaemonSet and enforcing Pod Security Admission restricted policies',
          },
        ],
      },
    },
  },

  'k8s-ephemeral-debug-container-process-namespace-share-audit': {
    briefing: {
      storyAnalogy:
        'Imagine an armored cash-transport van engineered with zero interior door handles and zero toolboxes so nobody can operate inside it. Using a special roadside-mechanic pass, an intruder bolts a temporary diagnostic side cabin directly onto the armored van shared interior cabin, reads every secret vault note taped beside the driver seat, and leaves a permanent weld scar that forces the bank to retire and replace the entire vehicle.',
      storyMappings: [
        {
          storyTerm: 'Armored cash van with zero door handles or toolboxes',
          technicalTerm: 'Hardened distroless production container lacking /bin/sh or utilities',
        },
        {
          storyTerm: 'Bolting a temporary diagnostic side cabin onto the van',
          technicalTerm: 'PATCH /api/v1/namespaces/<ns>/pods/<pod>/ephemeralcontainers (kubectl debug)',
        },
        {
          storyTerm: 'Reading secret notes taped beside the driver seat',
          technicalTerm: 'Process namespace sharing (--target) reading /proc/<pid>/environ secrets',
        },
        {
          storyTerm: 'Permanent weld scar forcing full vehicle replacement',
          technicalTerm: 'Append-only spec.ephemeralContainers requiring full Pod rollout replacement',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Even though the armored payments van carries no shell or repair tools inside its cabin, the intruder flashes a specialized roadside-debug permit to weld a fully equipped temporary service booth straight onto the live moving vehicle.',
        storyMappings: [
          {
            storyTerm: 'Armored payments van with no shell or tools',
            technicalTerm: 'Hardened distroless production pod with /bin/sh removed',
          },
          {
            storyTerm: 'Specialized roadside-debug permit',
            technicalTerm: 'RBAC permission on pods/ephemeralcontainers subresource',
          },
          {
            storyTerm: 'Welding a temporary service booth onto the live van',
            technicalTerm: 'PATCH request creating an ephemeral debug container via kubectl debug',
          },
          {
            storyTerm: 'Live vehicle continuing down the highway',
            technicalTerm: 'Running production pod mutated without restarting the target app',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Linking the temporary service booth directly into the main driver cabin wall, the intruder reaches straight into the active driver workspace and photocopies every live vault key and database password taped inside memory.',
        storyMappings: [
          {
            storyTerm: 'Linking directly into the main driver cabin wall',
            technicalTerm: 'targetContainerName="payment-app" sharing the PID namespace via containerd',
          },
          {
            storyTerm: 'Active driver workspace',
            technicalTerm: 'Target application process space visible under /proc/<pid>/',
          },
          {
            storyTerm: 'Vault keys and database passwords taped inside',
            technicalTerm: 'Runtime secrets harvested from /proc/<pid>/environ and open file descriptors',
          },
          {
            storyTerm: 'Tools brought along inside the service booth',
            technicalTerm: 'Attacker-chosen debug container image carrying shells and forensic utilities',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because the bolted-on diagnostic booth can never be unbolted while the armored van remains on the road, investigators audit the live radio session log and dispatch a clean replacement van while retiring the compromised vehicle completely.',
        storyMappings: [
          {
            storyTerm: 'Diagnostic booth that can never be unbolted on the road',
            technicalTerm: 'Immutable append-only spec.ephemeralContainers array on a running Pod',
          },
          {
            storyTerm: 'Live radio session log',
            technicalTerm: 'Kubernetes Audit logs recording interactive SPDY/WebSocket pods/attach sessions',
          },
          {
            storyTerm: 'Dispatching a clean replacement van',
            technicalTerm: 'Full Pod eviction and clean Deployment rollout replacement',
          },
          {
            storyTerm: 'Locking down roadside-debug permits',
            technicalTerm: 'Restricting RBAC access to pods/ephemeralcontainers and pods/attach',
          },
        ],
      },
    },
  },

  'docker-oci-registry-manifest-layer-poisoning-cosign-audit': {
    briefing: {
      storyAnalogy:
        'Imagine a central factory parts depot where finished software crates are stacked from numbered modular layers and labeled with movable shipping tags. A thief using a stolen warehouse push badge slips a tampered top layer onto the shelf and moves the floating production tag onto the poisoned stack, until the loading-dock cryptographic seal inspector detects the missing official wax stamp and blocks the tampered crate before it can enter the live factory floor.',
      storyMappings: [
        {
          storyTerm: 'Slipping a tampered modular layer onto the warehouse shelf',
          technicalTerm: 'Uploading trojanized OCI layer blob via POST /v2/<repo>/blobs/uploads/',
        },
        {
          storyTerm: 'Moving the floating production tag onto the poisoned stack',
          technicalTerm: 'Overwriting mutable :prod tag via PUT /v2/corp/payment-api/manifests/prod',
        },
        {
          storyTerm: 'Loading-dock cryptographic seal inspector',
          technicalTerm: 'Kubernetes Sigstore Policy Controller verifying Cosign image signatures',
        },
        {
          storyTerm: 'Missing official wax stamp blocking deployment',
          technicalTerm: 'Failed Cosign digest signature check halting tampered image rollout',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen warehouse stocking pass, the thief wheels a freshly altered crate layer carrying hidden spy gear through the depot upload dock and registers its new fingerprint in the warehouse bin.',
        storyMappings: [
          {
            storyTerm: 'Stolen warehouse stocking pass',
            technicalTerm: 'Compromised OCI container registry token with repository push scope',
          },
          {
            storyTerm: 'Altered crate layer carrying hidden spy gear',
            technicalTerm: 'Trojanized filesystem layer tarball containing backdoored binaries',
          },
          {
            storyTerm: 'Depot upload dock',
            technicalTerm: 'OCI Distribution API POST /v2/<repo>/blobs/uploads/ endpoint',
          },
          {
            storyTerm: 'New fingerprint registered in the bin',
            technicalTerm: 'New SHA-256 content-addressable blob digest stored in the registry',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the thief drafts a brand-new packing list that replaces the clean top layer with the tampered layer and hangs the well-known movable production tag straight onto the poisoned packing list so automatic deliveries grab it next.',
        storyMappings: [
          {
            storyTerm: 'Brand-new packing list referencing the tampered layer',
            technicalTerm: 'OCI image manifest (application/vnd.oci.image.manifest.v1+json) listing the rogue digest',
          },
          {
            storyTerm: 'Movable production tag hung on the poisoned stack',
            technicalTerm: 'PUT /v2/corp/payment-api/manifests/prod overwriting mutable :prod tag',
          },
          {
            storyTerm: 'Automatic deliveries configured to pull the latest tag',
            technicalTerm: 'Kubernetes Deployments referencing mutable :prod with imagePullPolicy: Always',
          },
          {
            storyTerm: 'Clean historical stack left unreferenced',
            technicalTerm: 'Original clean manifest digest replaced as the active tag target',
          },
        ],
      },
      3: {
        storyAnalogy:
          'When the live factory floor tries to pull the refreshed production crate, the loading-dock seal inspector checks the crate cryptographic wax stamp against the official builder ledger, immediately catches the forged unsealed stack, halts the shipment, and flags the exact swapped layer for forensic investigators.',
        storyMappings: [
          {
            storyTerm: 'Factory floor pulling the refreshed crate',
            technicalTerm: 'Kubernetes scheduling pods with imagePullPolicy: Always on :prod',
          },
          {
            storyTerm: 'Loading-dock seal inspector checking the wax stamp',
            technicalTerm: 'Sigstore Policy Controller validating Cosign signatures and Rekor transparency logs',
          },
          {
            storyTerm: 'Halting the unsealed shipment',
            technicalTerm: 'Admission rejection blocking deployment of the unsigned tampered digest',
          },
          {
            storyTerm: 'Flagging the exact swapped layer for investigators',
            technicalTerm: 'OCI manifest and layer diff forensics isolating the injected malicious blob',
          },
        ],
      },
    },
  },
};
