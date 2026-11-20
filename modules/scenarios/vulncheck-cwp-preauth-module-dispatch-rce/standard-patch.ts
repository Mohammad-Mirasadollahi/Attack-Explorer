import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a multi-tenant apartment building with a distracted lobby receptionist and an unlocked basement dumbwaiter leading straight to the superintendent boiler room. First, an intruder tests mailbox names and notices that even after the receptionist writes a move-along slip, she still fetches and opens whatever tenant folder was named on the form. Next, the intruder uses that unlocked folder to trigger a self-starting workshop drawer inside a tenant unit, rides the unguarded basement dumbwaiter up to the superintendent office, and slips a forged pass formula into the superintendent guestbook to seize full control of the whole building.',
      storyMappings: [
        {
          storyTerm: 'Lobby receptionist opening folders after a move-along slip',
          technicalTerm: 'Execution-after-redirect (CVE-2026-73696) and module LFI (CVE-2026-73695) on port 2083',
          tone: 'amber',
        },
        {
          storyTerm: 'Self-starting workshop drawer inside a tenant unit',
          technicalTerm: 'File-scope pre-auth PHP execution in phpini_editor.php (CVE-2026-73697)',
          tone: 'sky',
        },
        {
          storyTerm: 'Unguarded basement dumbwaiter to the boiler room',
          technicalTerm: 'Loopback root API on 127.0.0.1:2302 lacking authentication (CVE-2026-77877..104080)',
          tone: 'rose',
        },
        {
          storyTerm: 'Forged pass formula in the superintendent guestbook',
          technicalTerm: 'OAuth SQL injection bypass (CVE-2026-77879) and /v1/newpass/ root RCE (CVE-2026-77880)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the apartment lobby counter, the intruder reads the timing of buzzer responses to discover a real tenant name, then asks for an internal room folder without showing a key. The clerk stamps a redirect notice telling the intruder to leave, yet forgets to stop working and still pulls the requested folder off the shelf.',
        storyMappings: [
          {
            storyTerm: 'Buzzer responses revealing a real tenant name',
            technicalTerm: 'Per-user PHP-FPM socket routing oracle on https://host:2083/<username>/',
            tone: 'amber',
          },
          {
            storyTerm: 'Redirect notice that fails to stop work',
            technicalTerm: 'Missing exit after Location redirect header (CVE-2026-73696)',
            tone: 'sky',
          },
          {
            storyTerm: 'Pulling the requested folder off the shelf',
            technicalTerm: 'Unauthenticated module parameter local file inclusion (CVE-2026-73695)',
            tone: 'rose',
          },
          {
            storyTerm: 'Apartment lobby counter',
            technicalTerm: 'Internet-facing cwpsrv nginx proxy forwarding to user PHP-FPM pools',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Because one of the tenant workshop drawers starts running its tools the instant anyone slides it open, the intruder simply names that drawer on the lobby request and immediately gains command execution inside that tenant apartment with zero login.',
        storyMappings: [
          {
            storyTerm: 'Self-running tenant workshop drawer',
            technicalTerm: 'modules/phpini_editor.php and protected_directory.php executing at file scope',
            tone: 'amber',
          },
          {
            storyTerm: 'Naming the drawer on the lobby request',
            technicalTerm: 'Unauthenticated ?module=phpini_editor dispatch chaining CVE-2026-73697',
            tone: 'sky',
          },
          {
            storyTerm: 'Command execution inside the tenant apartment',
            technicalTerm: 'Pre-auth remote code execution running under the hosting user UID',
            tone: 'rose',
          },
          {
            storyTerm: 'Secondary unlocked tool tray',
            technicalTerm: 'protected_directory.php command injection fallback (CVE-2026-77876)',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'From inside the tenant apartment, the intruder opens the building internal basement dumbwaiter shaft that connects straight to the superintendent boiler room. Because the boiler-room intercom assumes only trusted staff can reach the basement shaft, it blindly runs the intruder maintenance command with master building privileges.',
        storyMappings: [
          {
            storyTerm: 'Basement dumbwaiter shaft',
            technicalTerm: 'Localhost-only Slim v2 User API listening on https://127.0.0.1:2302',
            tone: 'amber',
          },
          {
            storyTerm: 'Boiler-room intercom skipping badge checks',
            technicalTerm: 'Missing authentication middleware on /v1/restoredatabase/ and /valid_token/ (CVE-2026-77877)',
            tone: 'sky',
          },
          {
            storyTerm: 'Maintenance command with hidden separators',
            technicalTerm: 'Root shell injection via unsanitized parameters (CVE-2026-77878 & CVE-2026-104080)',
            tone: 'rose',
          },
          {
            storyTerm: 'Master building privileges',
            technicalTerm: 'Root PHP-FPM worker pool executing /bin/sh -c as UID 0',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Linux auditd execve (syscall 59, which logs every program launch with its exact user ID and arguments) where uid=0 and euid=0 spawn /bin/sh -c running mysql or grep with shell separators (; or |), and inspect loopback PHP-FPM logs for hits to 127.0.0.1:2302/v1/restoredatabase/ and /valid_token/ (catching local user-to-root escalation).',
      },
      4: {
        storyAnalogy:
          'Even on the locked doors inside the superintendent office that do check a visitor passbook, the intruder writes a clever trick question into the pass lookup line that makes the ledger reply yes automatically, unlocking the master password reset desk to claim permanent control of the entire apartment complex.',
        storyMappings: [
          {
            storyTerm: 'Locked doors checking a visitor passbook',
            technicalTerm: 'access_token() middleware in services/user_api/v1/index.php',
            tone: 'amber',
          },
          {
            storyTerm: 'Trick question making the ledger reply yes',
            technicalTerm: 'SQL injection bypass in OAuth token lookup as root@localhost (CVE-2026-77879)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master password reset desk',
            technicalTerm: '/v1/newpass/ endpoint root command injection (CVE-2026-77880)',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden yes-or-no ledger peephole',
            technicalTerm: 'Blind SQL injection information disclosure vector (CVE-2026-77881)',
            tone: 'emerald',
          },
        ],
      },
    },
  };
