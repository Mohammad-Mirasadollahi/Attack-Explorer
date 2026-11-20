import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a fortified courthouse whose encrypted-file clerk is required to inspect any document path mentioned by an outside caller. A trickster phones the clerk naming a fake folder sitting at the trickster own street booth; obediently, the courthouse chief courier marches straight out to the street booth flashing the courthouse master identity badge, while the trickster holds up a live mirror reflecting that exact badge straight into a neighboring notary office to mint a permanent master credential.',
      storyMappings: [
        {
          storyTerm: 'Trickster phoning the encrypted-file clerk with a fake street-booth path',
          technicalTerm: 'PetitPotam MS-EFSRPC EfsRpcOpenFileRaw coercion over \\pipe\\lsarpc',
          tone: 'amber',
        },
        {
          storyTerm: 'Courthouse chief courier marching out flashing the master badge',
          technicalTerm: 'Coerced CORP-DC01$ (System PID 4) outbound SMB NTLMv2 authentication to attacker IP',
          tone: 'sky',
        },
        {
          storyTerm: 'Live mirror reflecting the badge into a neighboring notary office',
          technicalTerm: 'Cross-protocol NTLM relay (SMB to HTTP/LDAP) forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH',
          tone: 'rose',
        },
        {
          storyTerm: 'Audit discrepancy exposing the mirror trick',
          technicalTerm: 'Target Security EventID 4624 where CORP-DC01$ authenticates from an attacker workstation IP',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Ringing the courthouse built-in encrypted-file service counter over an open office pipe, the trickster asks the clerk to open a raw file located at a street address owned by the trickster, forcing the courthouse to initiate an outgoing house call.',
        storyMappings: [
          {
            storyTerm: 'Built-in encrypted-file service counter',
            technicalTerm: 'MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e on \\pipe\\lsarpc',
            tone: 'amber',
          },
          {
            storyTerm: 'Asking the clerk to open a file at the trickster street address',
            technicalTerm: 'PetitPotam calling EfsRpcOpenFileRaw() pointing to \\\\attacker-ip\\share\\file',
            tone: 'sky',
          },
          {
            storyTerm: 'Wiretap catching the unusual clerk call',
            technicalTerm: 'Zeek dce_rpc.log capturing EfsRpcOpenFileRaw invocation targeting a Domain Controller',
            tone: 'rose',
          },
          {
            storyTerm: 'Forcing an outgoing house call',
            technicalTerm: 'Authentication coercion triggering an involuntary outbound server connection',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Obeying the file-opening request immediately, the courthouse core engine dispatches its own official machine courier straight out to the trickster street booth and dutifully flashes its cryptographically signed courthouse badge to open the door.',
        storyMappings: [
          {
            storyTerm: 'Courthouse core engine dispatching its own courier',
            technicalTerm: 'Windows NT kernel (System PID 4) on CORP-DC01 opening outbound TCP/445 SMB',
            tone: 'amber',
          },
          {
            storyTerm: 'Flashing the cryptographically signed courthouse badge',
            technicalTerm: 'Outbound NTLMv2 challenge-response authentication as machine account CORP-DC01$',
            tone: 'sky',
          },
          {
            storyTerm: 'Trickster street booth receiving the courier',
            technicalTerm: 'Attacker-controlled ntlmrelayx listener capturing the incoming SMB handshake',
            tone: 'rose',
          },
          {
            storyTerm: 'Unusual outbound visit from a master vault',
            technicalTerm: 'Domain Controller initiating outbound SMB traffic to an untrusted workstation IP',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Instead of answering the courier themselves, the trickster holds up a real-time mirror that bounces every handshake phrase straight into a neighboring certificate notary office lacking tamper-proof channel seals, minting a Domain Controller badge while leaving an impossible address mismatch in the notary guestbook.',
        storyMappings: [
          {
            storyTerm: 'Real-time mirror bouncing every handshake phrase',
            technicalTerm: 'Cross-protocol NTLM relay forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages',
            tone: 'amber',
          },
          {
            storyTerm: 'Neighboring notary office lacking tamper-proof channel seals',
            technicalTerm: 'AD CS HTTP enrollment (/certsrv) or LDAP server without EPA / signing enabled',
            tone: 'sky',
          },
          {
            storyTerm: 'Impossible address mismatch in the notary guestbook',
            technicalTerm: 'Security EventID 4624 showing TargetUserName=CORP-DC01$ arriving from attacker IP',
            tone: 'rose',
          },
          {
            storyTerm: 'Minting a permanent Domain Controller badge',
            technicalTerm: 'Issued CORP-DC01$ certificate or RBCD delegation granting full domain compromise',
            tone: 'emerald',
          },
        ],
      },
    },
  };
