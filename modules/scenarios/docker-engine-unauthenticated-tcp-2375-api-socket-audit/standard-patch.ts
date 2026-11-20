import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a massive robotic warehouse whose master crane control console is wired onto an open hallway radio channel with no padlock or badge check. An outsider spots the open radio channel, orders the crane to drop a wide-open glass booth with a direct door into the warehouse main vault, and steps through that doorway to plant permanent maintenance schedules on the warehouse master wall.',
      storyMappings: [
        {
          storyTerm: 'Master crane console wired onto an open hallway radio channel',
          technicalTerm: 'Unauthenticated Docker daemon (dockerd) listening on TCP port 2375 without TLS',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering a glass booth with a direct door into the main vault',
          technicalTerm: 'POST /v1.43/containers/create with Privileged=true and Binds ["/:/hostfs"]',
          tone: 'sky',
        },
        {
          storyTerm: 'Stepping straight into the warehouse main floor',
          technicalTerm: 'Container entrypoint running chroot /hostfs /bin/sh on the host root filesystem',
          tone: 'rose',
        },
        {
          storyTerm: 'Planting permanent schedules on the master wall',
          technicalTerm: 'Writing host cron jobs or SSH authorized_keys for persistent root access',
          tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Crane model number and floor inventory',
            technicalTerm: 'Unauthenticated GET /v1.43/version and GET /v1.43/containers/json responses',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero padlock or badge check',
            technicalTerm: 'Cleartext HTTP REST API granting equivalent host root authority to any caller',
            tone: 'rose',
          },
          {
            storyTerm: 'Scanning the warehouse hallways',
            technicalTerm: 'External or lateral network reconnaissance targeting TCP port 2375',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Safety bars removed',
            technicalTerm: 'HostConfig.Privileged=true disabling Linux capability and device restrictions',
            tone: 'sky',
          },
          {
            storyTerm: 'Back wall hinged directly onto the master storage room',
            technicalTerm: 'HostConfig.Binds ["/:/hostfs"] bind-mounting the entire host root filesystem',
            tone: 'rose',
          },
          {
            storyTerm: 'Crane obeying without question',
            technicalTerm: 'Docker daemon executing as root creating and starting the breakout container',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Adding a spare front-door key',
            technicalTerm: 'Appending attacker public keys to host /root/.ssh/authorized_keys',
            tone: 'sky',
          },
          {
            storyTerm: 'Adding a repeating daily work order',
            technicalTerm: 'Installing malicious host cron tasks under /etc/cron.d or /var/spool/cron',
            tone: 'rose',
          },
          {
            storyTerm: 'Warehouse floor audit trail',
            technicalTerm: 'Host dockerd audit logs and file integrity alerts on /etc/cron* and ~/.ssh',
            tone: 'emerald',
          },
        ],
      },
    },
  };
