import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a clever heist crew that compromises a corporate headquarters and quietly pins a tiny extra morning-checkin chore onto the official employee welcome board so every worker who sits down at their desk unknowingly hands over every password saved inside their web browser. Armed with that giant ring of stolen keys, the crew unlocks every shared office vault and basement virtual server simultaneously and seals both estates in one synchronized sweep.',
      storyMappings: [
        {
          storyTerm: 'Pinning a tiny morning-checkin chore onto the welcome board',
          technicalTerm: 'Active Directory GPO PowerShell logon script harvesting Chrome and Edge DPAPI credentials',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking shared vaults with the stolen key ring before shredding backups',
          technicalTerm: 'Rust Qilin binary invoked with -d credentials mounting shares, killing services, and wiping VSS',
          tone: 'sky',
        },
        {
          storyTerm: 'Sealing both office desktops and basement virtual servers at once',
          technicalTerm: 'Simultaneous Windows and ESXi ChaCha20 or AES-256-GCM encryption',
          tone: 'rose',
        },
        {
          storyTerm: 'Tailored affiliate locking profile',
          technicalTerm: 'Configurable per-affiliate cipher mode wrapped with RSA public key',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After seizing the headquarters policy board, the crew attaches a covert morning login script that waits patiently for employees to sign in across the company, silently scooping up every saved web password and cookie out of their browser vaults.',
        storyMappings: [
          {
            storyTerm: 'Headquarters policy board',
            technicalTerm: 'Compromised Active Directory Domain Controller Group Policy Object (GPO)',
            tone: 'amber',
          },
          {
            storyTerm: 'Covert morning login script waiting for employees',
            technicalTerm: 'GPO PowerShell logon script running inside each authenticated user context',
            tone: 'sky',
          },
          {
            storyTerm: 'Scooping up saved web passwords from browser vaults',
            technicalTerm: 'DPAPI decryption of Chrome and Edge Login Data across hundreds of user sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Staged credential harvest for lateral expansion',
            technicalTerm: 'Centralized collection of VPN, SaaS, vCenter, and administrative passwords',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Feeding the freshly harvested master keys directly into their Rust-forged utility, the crew automatically unlocks remote shared cabinets, shuts down noisy database clerks holding files open, and shreds every local backup copy.',
        storyMappings: [
          {
            storyTerm: 'Feeding freshly harvested master keys into the utility',
            technicalTerm: 'Rust Qilin encryptor invoked with -d domain and credential arguments',
            tone: 'amber',
          },
          {
            storyTerm: 'Automatically unlocking remote shared cabinets',
            technicalTerm: 'Authenticated SMB share mounting across discovered network servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Shutting down database clerks holding files open',
            technicalTerm: 'Automated termination of SQL, mail, and backup Windows services',
            tone: 'rose',
          },
          {
            storyTerm: 'Shredding every local backup copy',
            technicalTerm: 'Volume Shadow Copy wipe eliminating local restore points',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Switching seamlessly between high-speed locking gears tailored for each affiliate job, the crew seals both Windows office files and basement ESXi virtual servers at the exact same time, leaving the enterprise paralyzed across physical and virtual floors.',
        storyMappings: [
          {
            storyTerm: 'Tailored locking gears chosen per job',
            technicalTerm: 'Per-affiliate Qilin profile selecting ChaCha20 or AES-256-GCM with RSA wrapping',
            tone: 'amber',
          },
          {
            storyTerm: 'Basement virtual servers halted and sealed',
            technicalTerm: 'ESXi Linux ELF encryptor stopping VMs and encrypting datastore VMDK images',
            tone: 'sky',
          },
          {
            storyTerm: 'Office files locked simultaneously',
            technicalTerm: 'Multi-threaded Windows file encryption appending affiliate-specific extensions',
            tone: 'rose',
          },
          {
            storyTerm: 'Maximized cross-platform extortion pressure',
            technicalTerm: 'Synchronized Windows desktop, file server, and virtualization outage',
            tone: 'emerald',
          },
        ],
      },
    },
  };
