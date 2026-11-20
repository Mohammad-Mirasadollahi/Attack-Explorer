import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a heist crew that skips stealing an old inspector badge and instead hijacks the government badge-printing office to stamp their own custom saboteur card. Once inside the building control room, the saboteur requires a secret spoken handshake before cutting every alarm wire on the central watchboard and erasing the armored insignia from both the security guards and the vault master ledger.',
      storyMappings: [
        {
          storyTerm: 'Custom saboteur card stamped by a hijacked badge office',
          technicalTerm: 'POORTRY / BURNTCIGAR custom kernel rootkit signed via abused WHQL account',
          tone: 'amber',
        },
        {
          storyTerm: 'Secret spoken handshake at the control room door',
          technicalTerm: 'Cryptographic challenge-response DeviceIoControl handshake from STONESTOP',
          tone: 'sky',
        },
        {
          storyTerm: 'Cutting every alarm wire on the central watchboard',
          technicalTerm: 'Zeroing PspCreateProcessNotifyRoutine and ObRegisterCallbacks arrays',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing armored insignia from guards and the vault ledger',
          technicalTerm: 'DKOM stripping of _PS_PROTECTION bits on EDR processes and lsass.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked signing office, so the checkpoint doors swing wide open without raising an alarm.',
        storyMappings: [
          {
            storyTerm: 'Intruder street runner',
            technicalTerm: 'STONESTOP user-mode loader invoking NtLoadDriver',
            tone: 'amber',
          },
          {
            storyTerm: 'Purpose-built saboteur pass',
            technicalTerm: 'Malicious kernel driver poortry.sys (BURNTCIGAR)',
            tone: 'sky',
          },
          {
            storyTerm: 'Authentic government wax seal from a hijacked office',
            technicalTerm: 'Fraudulently obtained Microsoft WHQL / Windows Hardware Dev Center attestation signature',
            tone: 'rose',
          },
          {
            storyTerm: 'Building core checkpoint',
            technicalTerm: 'Windows Driver Signature Enforcement (DSE) kernel load check',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange. Once verified, the saboteur snips every central notification bell wire so the security office stops receiving alerts whenever new workers enter or inspect the building.',
        storyMappings: [
          {
            storyTerm: 'Secret coded knock-and-reply exchange',
            technicalTerm: 'Cryptographic challenge-response authentication over DeviceIoControl',
            tone: 'amber',
          },
          {
            storyTerm: 'Central notification bell wires',
            technicalTerm: 'Kernel callback arrays PspCreateProcessNotifyRoutine and ObRegisterCallbacks',
            tone: 'sky',
          },
          {
            storyTerm: 'Snipping the bell wires',
            technicalTerm: 'POORTRY overwriting EDR kernel callback pointers in Ring-0 memory',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded security office',
            technicalTerm: 'EDR sensors stripped of process creation and handle-access visibility',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy EDR kernel callback integrity watchdogs (periodic kernel-level self-checks that verify sensor function pointers remain intact inside PspCreateProcessNotifyRoutine and ObRegisterCallbacks) and alert immediately when any callback entry is zeroed or replaced.',
      },
      3: {
        storyAnalogy:
          'Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so the street runner can dismiss every guard and empty the vault unopposed.',
        storyMappings: [
          {
            storyTerm: 'Central staff ledger',
            technicalTerm: 'Kernel opaque _EPROCESS structures tracking active Windows processes',
            tone: 'amber',
          },
          {
            storyTerm: 'Rubbing out the armored-protection stamp',
            technicalTerm: 'Direct Kernel Object Manipulation (DKOM) zeroing _PS_PROTECTION bits',
            tone: 'sky',
          },
          {
            storyTerm: 'Dismissed security guards',
            technicalTerm: 'Terminated EDR agent processes after PPL immunity removal',
            tone: 'rose',
          },
          {
            storyTerm: 'Emptied master credential vault',
            technicalTerm: 'Unprotected lsass.exe memory dumped for enterprise credentials',
            tone: 'emerald',
          },
        ],
      },
    },
  };
