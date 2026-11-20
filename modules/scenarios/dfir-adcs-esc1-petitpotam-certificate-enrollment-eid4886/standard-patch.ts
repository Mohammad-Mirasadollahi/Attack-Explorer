import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate ID-card print shop that offers one carelessly designed visitor badge template allowing any requester to handwrite whoever they please on the official nameplate line with zero manager approval. A junior clerk spots that sloppy template, types the Chief Executive name onto the application slip, picks up a genuinely embossed executive photo ID straight from the print shop, and exchanges that real badge at the front gate for master keys to the entire company.',
      storyMappings: [
        {
          storyTerm: 'Carelessly designed badge template allowing handwritten names',
          technicalTerm: 'ESC1 vulnerable AD CS template with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT and no approval',
          tone: 'amber',
        },
        {
          storyTerm: 'Junior clerk writing the Chief Executive name on the application slip',
          technicalTerm: 'PKCS#10 CSR with spoofed SAN UPN (/altname:Administrator@corp.local) logged in EventID 4886',
          tone: 'sky',
        },
        {
          storyTerm: 'Exchanging the genuinely embossed badge at the front gate',
          technicalTerm: 'Kerberos PKINIT authentication via Rubeus.exe asktgt returning an Administrator TGT',
          tone: 'rose',
        },
        {
          storyTerm: 'Extracting the executive raw vault key from the badge response',
          technicalTerm: 'Unpac-the-Hash recovering the Administrator NT hash from the PKINIT PAC structure',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Browsing the print shop public catalog of available ID templates, a low-ranking clerk hunts for one dangerous combination: any ordinary worker can apply, no supervisor signature is required, the badge grants building entry, and the applicant is allowed to type any name they want onto the nameplate.',
        storyMappings: [
          {
            storyTerm: 'Public catalog of available ID templates',
            technicalTerm: 'LDAP query against CN=Certificate Templates,CN=Public Key Services in AD',
            tone: 'amber',
          },
          {
            storyTerm: 'Applicant allowed to type any name onto the nameplate',
            technicalTerm: 'msPKI-Certificate-Name-Flag bit CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT enabled',
            tone: 'sky',
          },
          {
            storyTerm: 'Badge granting building entry with no supervisor signature',
            technicalTerm: 'Client Authentication EKU paired with no Manager Approval and Domain Users enroll rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Clerk inspecting the catalog',
            technicalTerm: 'Certify.exe find /vulnerable or Certipy enumerating ESC1 misconfigurations',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Filling out an official badge order under their own lowly employee name, the junior clerk neatly writes the Chief Administrator address inside the alternate-identity box. Without pausing for human review, the automated print shop embosses and hands over a cryptographically genuine executive badge while stamping a permanent print-shop log.',
        storyMappings: [
          {
            storyTerm: 'Junior employee submitting the badge order',
            technicalTerm: 'Low-privileged user CORP\\jdoe submitting a PKCS#10 CSR to CORP-CA01',
            tone: 'amber',
          },
          {
            storyTerm: 'Chief Administrator written in the alternate-identity box',
            technicalTerm: 'Spoofed Subject Alternative Name (SAN) UPN /altname:Administrator@corp.local',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated print shop embossing the genuine badge',
            technicalTerm: 'Enterprise CA issuing a valid X.509 authentication certificate for Administrator',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanent print-shop receipt exposing the mismatch',
            technicalTerm: 'CA Security EventID 4886 and 4887 showing requester jdoe requesting Administrator SAN',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Walking up to the central gatehouse with the newly minted executive badge, the clerk trades the photo ID for an official executive master pass and peels the Administrator permanent vault key straight out of the returned pass packet.',
        storyMappings: [
          {
            storyTerm: 'Trading the executive photo ID at the gatehouse',
            technicalTerm: 'Kerberos PKINIT authentication via Rubeus.exe asktgt /user:Administrator /certificate:...',
            tone: 'amber',
          },
          {
            storyTerm: 'Official executive master pass issued by the gatehouse',
            technicalTerm: 'Domain Administrator Kerberos TGT logged in KDC EventID 4768 with certificate thumbprint',
            tone: 'sky',
          },
          {
            storyTerm: 'Peeling the permanent vault key out of the returned packet',
            technicalTerm: 'Unpac-the-Hash extracting the Administrator NTLM hash from the Kerberos PAC',
            tone: 'rose',
          },
          {
            storyTerm: 'Full kingdom takeover from one sloppy template',
            technicalTerm: 'Instant low-privileged user to Enterprise Domain Admin escalation',
            tone: 'emerald',
          },
        ],
      },
    },
  };
