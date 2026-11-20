import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a privileged glass storage room inside an office building whose occupant holds a master plumbing key. The occupant hooks up an old automated trash-chute control box inside the room, pins a custom maintenance work order onto the chute empty-bin trigger, and drops a single quick parcel down the chute so that the instant the chute empties, the building chief engineer outside automatically picks up and executes the occupant work order with full building authority.',
      storyMappings: [
        {
          storyTerm: 'Master plumbing key held inside the storage room',
          technicalTerm: 'CAP_SYS_ADMIN capability (CapEff bit 21) granted to a privileged container',
          tone: 'amber',
        },
        {
          storyTerm: 'Old automated trash-chute control box',
          technicalTerm: 'Mounted Linux cgroup v1 hierarchy (rdma/memory) with release_agent file',
          tone: 'sky',
        },
        {
          storyTerm: 'Pinning a custom work order onto the empty-bin trigger',
          technicalTerm: 'Setting notify_on_release=1 and writing OverlayFS host upperdir path to release_agent',
          tone: 'rose',
        },
        {
          storyTerm: 'Chief engineer outside automatically running the order when empty',
          technicalTerm: 'Host kernel cgroup1_release_agent invoking call_usermodehelper as root on host',
          tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Older resource-control switchboard',
            technicalTerm: 'Mounted cgroup v1 controller via mount -t cgroup -o rdma cgroup /tmp/cgrp',
            tone: 'sky',
          },
          {
            storyTerm: 'Exact street address as seen from the main hallway',
            technicalTerm: 'Host-side OverlayFS upperdir path parsed from /etc/mtab or /proc/mounts',
            tone: 'rose',
          },
          {
            storyTerm: 'Preparing the external callback target',
            technicalTerm: 'Locating where container-written scripts appear on the underlying host filesystem',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping the alert-when-empty toggle to on',
            technicalTerm: 'Writing 1 into /tmp/cgrp/x/notify_on_release',
            tone: 'sky',
          },
          {
            storyTerm: 'Hallway address written into the cleanup slot',
            technicalTerm: 'Host OverlayFS upperdir script path written to /tmp/cgrp/release_agent',
            tone: 'rose',
          },
          {
            storyTerm: 'Custom command script waiting to run',
            technicalTerm: 'Executable payload script placed inside the container filesystem',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Building central kernel seeing the bin go empty',
            technicalTerm: 'Linux kernel cgroup1_release_agent workqueue firing on zero active tasks',
            tone: 'sky',
          },
          {
            storyTerm: 'Launching the script directly in the main hallway',
            technicalTerm: 'Kernel call_usermodehelper executing the payload in the host root namespace',
            tone: 'rose',
          },
          {
            storyTerm: 'Complete escape to full master keys',
            technicalTerm: 'Arbitrary root command execution on the underlying container host',
            tone: 'emerald',
          },
        ],
      },
    },
  };
