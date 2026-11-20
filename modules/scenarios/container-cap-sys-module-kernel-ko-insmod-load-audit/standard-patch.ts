import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a skyscraper where every sealed tenant suite rides on the exact same central elevator engine in the basement. Discovering that their suite badge accidentally includes elevator-mechanic clearance, a tenant builds a homemade gear that fits the exact engine model, bolts it straight into the central basement machinery from inside their room, and trips a permanent red warning lamp on the skyscraper master engineering console.',
      storyMappings: [
        {
          storyTerm: 'Elevator-mechanic clearance on a tenant badge',
          technicalTerm: 'CAP_SYS_MODULE capability (CapEff bit 16) in /proc/self/status',
          tone: 'amber',
        },
        {
          storyTerm: 'Homemade gear matching the exact engine model',
          technicalTerm: 'Compiled Linux kernel module (.ko) built for host uname -r version',
          tone: 'sky',
        },
        {
          storyTerm: 'Bolting the gear straight into the central basement machinery',
          technicalTerm: 'insmod invoking finit_module (syscall 313) or init_module (syscall 175)',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent red warning lamp on the engineering console',
          technicalTerm: 'Kernel taint flag (/proc/sys/kernel/tainted OOT_MODULE and UNSIGNED_MODULE bits)',
          tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Central elevator nameplate',
            technicalTerm: 'Host Linux kernel version string discovered via uname -r',
            tone: 'sky',
          },
          {
            storyTerm: 'Shared basement engine beneath every suite',
            technicalTerm: 'Single Linux host kernel shared across all running containers on the node',
            tone: 'rose',
          },
          {
            storyTerm: 'Rare engine-room installation rights',
            technicalTerm: 'Privilege allowing a container to insert Ring-0 kernel code into the host',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Feeding it through the installation slot',
            technicalTerm: 'Executing insmod /tmp/net_diag.ko invoking finit_module (313) or init_module (175)',
            tone: 'sky',
          },
          {
            storyTerm: 'Spinning central elevator core',
            technicalTerm: 'Host Linux kernel Ring-0 execution space with total control over all nodes',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing every suite wall at once',
            technicalTerm: 'Full container escape executing privileged kernel-space callbacks on the host',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Permanent engine diary',
            technicalTerm: 'Host /proc/modules list and kernel dmesg ring-buffer audit entries',
            tone: 'sky',
          },
          {
            storyTerm: 'Uncertified foreign gear',
            technicalTerm: 'Unsigned out-of-tree kernel module loaded without lockdown signature verification',
            tone: 'rose',
          },
          {
            storyTerm: 'Safety inspectors spotting the tampering',
            technicalTerm: 'CNCF Tetragon eBPF runtime policy blocking or alerting on sys_finit_module',
            tone: 'emerald',
          },
        ],
      },
    },
  };
