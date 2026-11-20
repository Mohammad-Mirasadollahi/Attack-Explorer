import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a locked glass contractor booth inside a high-security factory where engineers accidentally ran the factory master crane joystick cable straight through the booth wall for convenience. An intruder trapped inside the glass booth grabs that joystick, commands the crane outside to build an open-air twin platform sharing the factory master floor, and steps directly into the factory central control room.',
      storyMappings: [
        {
          storyTerm: 'Master crane joystick cable wired through the glass booth wall',
          technicalTerm: 'Host /var/run/docker.sock Unix socket bind-mounted inside a container',
          tone: 'amber',
        },
        {
          storyTerm: 'Ordering an open-air twin platform outside the booth',
          technicalTerm: 'HTTP POST over docker.sock creating a sibling container with HostPID and Privileged',
          tone: 'sky',
        },
        {
          storyTerm: 'Stepping directly into the factory central control room',
          technicalTerm: 'nsenter --target 1 entering host PID 1 (systemd) mount and IPC namespaces',
          tone: 'rose',
        },
        {
          storyTerm: 'Locked glass contractor booth',
          technicalTerm: 'Compromised CI build or management agent container',
          tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Live master crane control cable',
            technicalTerm: 'Mounted host Unix domain socket at /var/run/docker.sock',
            tone: 'sky',
          },
          {
            storyTerm: 'Locked glass contractor booth',
            technicalTerm: 'Initial foothold inside a CI runner or monitoring agent container',
            tone: 'rose',
          },
          {
            storyTerm: 'Direct link to the factory outside',
            technicalTerm: 'Socket communicating directly with the root-privileged host dockerd daemon',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Brand-new twin platform next door',
            technicalTerm: 'Attacker-controlled sibling container launched directly by the host daemon',
            tone: 'sky',
          },
          {
            storyTerm: 'Full view of every worker badge and hallway',
            technicalTerm: 'HostPID (PidMode=host) and HostNetwork (NetworkMode=host) enabled',
            tone: 'rose',
          },
          {
            storyTerm: 'Master mechanical overrides turned on',
            technicalTerm: 'Privileged=true granting CAP_SYS_ADMIN inside the sibling container',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Master transfer latch',
            technicalTerm: 'nsenter --target 1 --mount --uts --ipc --net --pid command',
            tone: 'sky',
          },
          {
            storyTerm: 'Authority allowing the latch to open',
            technicalTerm: 'Shared host PID namespace combined with CAP_SYS_ADMIN capability',
            tone: 'rose',
          },
          {
            storyTerm: 'Complete command over the entire building',
            technicalTerm: 'Unrestricted root shell inside the underlying Linux host OS',
            tone: 'emerald',
          },
        ],
      },
    },
  };
