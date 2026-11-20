import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a master espionage team that sneaks into an office building wearing the uniform of the built-in crash-report clerk. First, a nimble launcher slips a hidden operative straight into the crash-report desk; next, the operative peels off every security tripwire taped onto the office rulebook and fakes its own hallway footsteps so guards see only normal paperwork; finally, it unpacks sixteen modular espionage gadgets purely inside memory and phones home over a custom double-locked radio.',
      storyMappings: [
        {
          storyTerm: 'Sneaking an operative into the crash-report clerk desk',
          technicalTerm: 'DUSTPAN / DodgeBox injecting into Windows Error Reporting (wermgr.exe)',
          tone: 'amber',
        },
        {
          storyTerm: 'Peeling off security tripwires and faking hallway footsteps',
          technicalTerm: 'STEALTHVECTOR unhooking ntdll.dll and performing synthetic call-stack spoofing',
          tone: 'sky',
        },
        {
          storyTerm: 'Unpacking sixteen modular espionage gadgets inside memory',
          technicalTerm: 'In-memory loading of DUSTTRAP modular plugin framework (16 capabilities)',
          tone: 'rose',
        },
        {
          storyTerm: 'Phoning home over a custom double-locked radio',
          technicalTerm: 'Custom mutual TLS (mTLS) C2 communications from inside wermgr.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Rather than walking the halls under its own name, the initial launcher starts the building\'s built-in crash-reporting clerk and quietly slips a sleeper helper directly into that trusted clerk\'s workspace.',
        storyMappings: [
          {
            storyTerm: 'Initial covert launcher',
            technicalTerm: 'DUSTPAN / DodgeBox loader deployed by APT41 (Brass Typhoon / Earth Freybug)',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-in crash-reporting clerk workspace',
            technicalTerm: 'Legitimate C:\\Windows\\System32\\wermgr.exe target host process',
            tone: 'sky',
          },
          {
            storyTerm: 'Slipping a sleeper thread inside',
            technicalTerm: 'Remote thread or Asynchronous Procedure Call (APC) injection into wermgr.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Hallway sensor noticing cross-desk intrusion',
            technicalTerm: 'Sysmon EventID 8 (CreateRemoteThread) and EventID 10 (ProcessAccess) targeting wermgr.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 8 (CreateRemoteThread) and EventID 10 (ProcessAccess recording cross-process handle requests) when a non-system parent process performs remote thread or APC injection into C:\\Windows\\System32\\wermgr.exe (exposing APT41 DUSTPAN staging).',
      },
      2: {
        storyAnalogy:
          'Inside the crash-report clerk desk, the next-stage stealth module temporarily unlocks the core system rulebook to replace tampered security tripwires with a clean fresh copy, then arranges fake return addresses on its desk so any inspector checking who called a sensitive action sees only harmless routine clerk steps.',
        storyMappings: [
          {
            storyTerm: 'Temporarily unlocking the core rulebook to wipe tripwires',
            technicalTerm: 'VirtualProtect toggling ntdll.dll .text (RX -> RWX -> RX) to overwrite EDR inline hooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Arranging fake return addresses on the desk',
            technicalTerm: 'Call-stack spoofing fabricating legitimate Windows frame pointers before syscalls',
            tone: 'sky',
          },
          {
            storyTerm: 'Unpacking the sealed main espionage kit',
            technicalTerm: 'STEALTHVECTOR decrypting DUSTTRAP purely inside unbacked RAM regions',
            tone: 'rose',
          },
          {
            storyTerm: 'Memory telemetry catching the brief rulebook unlock',
            technicalTerm: 'ETW / EDR alerts on VirtualProtect modifying ntdll.dll inside wermgr.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor EDR memory protection telemetry for VirtualProtect transitions on the ntdll.dll .text section (RX to RWX and back to RX, the unmistakable signature of userland EDR hook wiping) inside wermgr.exe followed by execution from unbacked private memory.',
      },
      3: {
        storyAnalogy:
          'With every hallway monitor blinded and its footsteps disguised, the implant unfolds sixteen specialized espionage modules purely inside live memory and establishes a mutually authenticated encrypted radio link straight back to its remote handlers.',
        storyMappings: [
          {
            storyTerm: 'Sixteen specialized espionage modules in memory',
            technicalTerm: 'DUSTTRAP plugin suite supporting file theft, shell execution, and network pivoting',
            tone: 'amber',
          },
          {
            storyTerm: 'Mutually authenticated encrypted radio link',
            technicalTerm: 'Custom mutual TLS (mTLS) C2 protocol verifying both client and server certificates',
            tone: 'sky',
          },
          {
            storyTerm: 'Zero modular tools touching the hard drive',
            technicalTerm: 'Pure RAM-resident plugin loading frustrating disk-based forensic triage',
            tone: 'rose',
          },
          {
            storyTerm: 'Telltale behavioral giveaway',
            technicalTerm: 'Windows Error Reporting (wermgr.exe) maintaining persistent external mTLS connections',
            tone: 'emerald',
          },
        ],
      },
    },
  };
