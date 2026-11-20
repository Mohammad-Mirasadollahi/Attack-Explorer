import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a giant theme park where every visitor must first visit the front admission booth to receive an official stamped day wristband before any ride operator will issue a ride pass. Having stolen the park master ink stamp earlier, an intruder prints an impossible ten-year VIP wristband at home and walks straight up to an inner ride gate without ever passing through the front booth, immediately tripping forensic auditors who spot a VIP ride pass with zero front-gate admission record.',
      storyMappings: [
        {
          storyTerm: 'Printing an impossible ten-year VIP wristband at home',
          technicalTerm: 'Offline Golden Ticket TGT forgery using stolen krbtgt AES-256 key and Pass-the-Ticket injection',
          tone: 'amber',
        },
        {
          storyTerm: 'Walking straight up to a ride gate with zero front-gate check-in',
          technicalTerm: 'Orphaned KRB_TGS_REQ (EventID 4769) with no preceding AS-REQ (EventID 4768)',
          tone: 'sky',
        },
        {
          storyTerm: 'Synthetic VIP committee seals stamped onto the wristband',
          technicalTerm: 'Forged Privilege Attribute Certificate (PAC) injecting Domain Admin SIDs',
          tone: 'rose',
        },
        {
          storyTerm: 'Walking straight into the vault room with the forged ride pass',
          technicalTerm: 'Target host Security EventID 4624 (LogonType 3) accessing \\\\CORP-DC01\\C$ with forged groups',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and slips it straight into their local memory pocket.',
        storyMappings: [
          {
            storyTerm: 'Stolen master ink stamp',
            technicalTerm: 'Previously compromised Active Directory krbtgt AES-256 or RC4 key',
            tone: 'amber',
          },
          {
            storyTerm: 'Homemade VIP wristband claiming executive authority',
            technicalTerm: 'Forged Kerberos TGT crafted offline with kerberos::golden and domain SID',
            tone: 'sky',
          },
          {
            storyTerm: 'Slipping the wristband into the local memory pocket',
            technicalTerm: 'Pass-the-Ticket injection via LsaCallAuthenticationPackage into the current logon session',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero visit to the front admission booth',
            technicalTerm: 'Complete absence of any legitimate KDC AS-REQ / EventID 4768 ticket grant',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass. Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the audit ledger immediately exposes two glaring anomalies: no front-gate entry ever existed, and the wristband expiration date stretches far beyond normal park hours.',
        storyMappings: [
          {
            storyTerm: 'Flashing the homemade wristband for a vault door pass',
            technicalTerm: 'Workstation sending KRB_TGS_REQ for \\\\CORP-DC01\\C$ using the forged TGT',
            tone: 'amber',
          },
          {
            storyTerm: 'Audit ledger showing zero front-gate entry',
            technicalTerm: 'Orphaned Security EventID 4769 with no matching prior EventID 4768 for that session',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible wristband expiration date',
            technicalTerm: 'Anomalous TGT lifetime (e.g., 10 years instead of default 10 hours) and PAC discrepancies',
            tone: 'rose',
          },
          {
            storyTerm: 'Vault desk verifying the ink stamp mathematically',
            technicalTerm: 'KDC validating the krbtgt signature on the TGT without noticing offline forgery',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Holding the freshly minted vault door pass, the intruder steps straight into the Domain Controller storage room carrying fabricated executive group badges that do not even match the real employee directory.',
        storyMappings: [
          {
            storyTerm: 'Stepping into the Domain Controller storage room',
            technicalTerm: 'Mounting \\\\CORP-DC01\\C$ using the forged Kerberos service ticket',
            tone: 'amber',
          },
          {
            storyTerm: 'Fabricated executive group badges inside the pass',
            technicalTerm: 'Synthetic Domain Admin and Enterprise Admin RIDs embedded in the forged PAC',
            tone: 'sky',
          },
          {
            storyTerm: 'Door ledger logging the network arrival',
            technicalTerm: 'Security EventID 4624 (LogonType 3, Kerberos) recording forged privileged logon',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent cure invalidating every counterfeit stamp',
            technicalTerm: 'Double rotation of the krbtgt password spaced by the maximum ticket lifetime',
            tone: 'emerald',
          },
        ],
      },
    },
  };
