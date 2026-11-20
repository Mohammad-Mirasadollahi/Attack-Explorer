import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cunning saboteur operating inside a company headquarters who deliberately spares the central dispatch tower itself so the tower stays alive long enough to broadcast destruction orders to every branch office. Using a disguised repair-tool wrapper pushed from the central policy board, the wiper checks whether each machine is the dispatch tower first; on every regular office computer, it seizes ownership of every user drawer, scrubs every document to blank zeros, and erases the floor plan of every hard drive.',
      storyMappings: [
        {
          storyTerm: 'Disguised repair-tool wrapper pushed from the central policy board',
          technicalTerm: 'Active Directory GPO pushing ArguePatch patched IDA debugger loader from SYSVOL',
          tone: 'amber',
        },
        {
          storyTerm: 'Checking whether each machine is the dispatch tower so it stays alive',
          technicalTerm: 'DsRoleGetPrimaryDomainInformation check sparing Primary Domain Controllers',
          tone: 'sky',
        },
        {
          storyTerm: 'Seizing ownership of every drawer and scrubbing documents to blank zeros',
          technicalTerm: 'SeTakeOwnershipPrivilege recursive C:\\Users file zeroing via SetNamedSecurityInfoA',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing the floor plan of every hard drive',
          technicalTerm: 'Raw partition table wipe via IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the entire company through the official morning policy board.',
        storyMappings: [
          {
            storyTerm: 'Central dispatch tower policy board',
            technicalTerm: 'Compromised Domain Controller SYSVOL share and Group Policy Object (GPO) push',
            tone: 'amber',
          },
          {
            storyTerm: 'Surgically altered known software debugger',
            technicalTerm: 'ArguePatch trojanized legitimate IDA Pro debugger binary (win32_remote.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden trigger spliced into the opening routine',
            technicalTerm: 'Patched entry point decrypting and launching the CaddyWiper shellcode payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Company-wide synchronized deployment',
            technicalTerm: 'Scheduled task created across all domain-joined workstations and member servers',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is standing inside the central dispatch tower, it immediately steps back so the tower stays online to keep wrecking every other room.',
        storyMappings: [
          {
            storyTerm: 'Assembling command labels piece by piece in private',
            technicalTerm: 'Stack-constructed API strings hiding imports from the PE Import Address Table (IAT)',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking the room nameplate first',
            technicalTerm: 'Calling DsRoleGetPrimaryDomainInformation to inspect machine domain role',
            tone: 'sky',
          },
          {
            storyTerm: 'Stepping back when standing inside the central dispatch tower',
            technicalTerm: 'Exiting immediately if role equals DsRole_RolePrimaryDomainController',
            tone: 'rose',
          },
          {
            storyTerm: 'Keeping the dispatch tower alive to spread destruction',
            technicalTerm: 'Preserving Active Directory GPO replication while wiping all member endpoints',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert via behavioral sandboxes and EDR memory scanners detecting stack-constructed API strings for DsRoleGetPrimaryDomainInformation, SeTakeOwnershipPrivilege, and PhysicalDrive inside trojanized binaries such as win32_remote.exe (catching CaddyWiper pre-wipe staging).',
      },
      3: {
        storyAnalogy:
          'On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a single raw control blast that erases the master partition blueprint of every attached hard drive.',
        storyMappings: [
          {
            storyTerm: 'Claiming legal ownership of every locked desk drawer',
            technicalTerm: 'Enabling SeTakeOwnershipPrivilege and calling SetNamedSecurityInfoA across C:\\Users',
            tone: 'amber',
          },
          {
            storyTerm: 'Overwriting every file with blank zeros',
            technicalTerm: 'Recursive zero-byte file destruction across local folders and mapped network drives',
            tone: 'sky',
          },
          {
            storyTerm: 'Single raw control blast erasing the drive blueprint',
            technicalTerm: 'DeviceIoControl IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) wiping partition tables',
            tone: 'rose',
          },
          {
            storyTerm: 'Kernel shield blocking drive layout wipes',
            technicalTerm: 'EDR kernel disk filter blocking zeroed IOCTL_DISK_SET_DRIVE_LAYOUT_EX calls',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR kernel disk filters to block IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054, the raw disk control code that overwrites partition tables) when passed zeroed partition entries, paired with behavioral alerts on rapid SetNamedSecurityInfoA ownership sweeps across C:\\Users.',
      },
    },
  };
