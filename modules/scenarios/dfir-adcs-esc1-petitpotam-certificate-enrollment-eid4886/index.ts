import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886',
    title: 'SpecterOps, Microsoft ADV210003 & CISA DFIR — AD CS ESC1 SubjectAltName Spoofing & PKINIT Forensics (EID 4886 / 4768)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1649',
    description:
      'Grounded in SpecterOps "Certified Pre-Owned" research, Microsoft Security Advisory ADV210003, and MITRE ATT&CK T1649: an attacker abuses an Active Directory Certificate Services (AD CS) template with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT (ESC1) to request a client authentication certificate specifying a Domain Admin User Principal Name (UPN) in the Subject Alternative Name (SAN) extension (CertificationAuthority EventID 4886 / 4887) and exchanges it for a Domain Admin TGT via PKINIT (KDC EventID 4768 with CertificateThumbprint).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Certify.exe / Certipy Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'DCOM ICertRequestD2 RPC', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-CA01 (certsrv.exe)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CA EID 4886/4887 & KDC 4768', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'CORP-DC01 PKINIT KDC (:88)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: ESC1 Vulnerable Certificate Template Enumeration over LDAP (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)',
        narration:
          'Using Certify.exe find /vulnerable or Certipy, the attacker queries CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local and identifies a template ("CorpVPNUser") where Domain Users have Enroll rights, EKU includes Client Authentication (1.3.6.1.5.5.7.3.2), and msPKI-Certificate-Name-Flag has bit 0x00000001 (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT) enabled.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1649 - Steal or Forge Authentication Certificates: ESC1 Discovery)',
        technicalCommands: [
          'Certify.exe find /vulnerable',
          'LDAP Filter: (&(objectclass=pkicertificatetemplate)(msPKI-Certificate-Name-Flag:1.2.840.113556.1.4.804:=1))',
          'Vulnerable Template: CorpVPNUser (EnrolleeSuppliesSubject=True, ClientAuth EKU=1.3.6.1.5.5.7.3.2)',
        ],
        defenseMitigation:
          'Audit all AD CS certificate templates regularly with Locksmith or PSPKI and disable CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT on any template granting enrollment rights to low-privileged groups.',
        logs: [
          {
            id: 'dfir-adcs-1',
            timestamp: '12:10:04.115',
            source: 'Network',
            severity: 'high',
            EventCode: 389,
            ProcessName: 'Certify.exe',
            CommandLine: 'Certify.exe find /vulnerable (Querying CN=Certificate Templates)',
            raw: 'LDAP_SEARCH: BaseDN="CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local" Attrs="msPKI-Certificate-Name-Flag,pKIExtendedKeyUsage" MatchedTemplate="CorpVPNUser (0x1 CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)"',
            parsedFields: {
              VulnerableTemplate: 'CorpVPNUser',
              NameFlagBit: '0x00000001 (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)',
              ExtendedKeyUsage: '1.3.6.1.5.5.7.3.2 (Client Authentication)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: CSR Submission with Spoofed Domain Admin SAN UPN (CA Security EventID 4886 & 4887)',
        narration:
          'The low-privileged user (CORP\\jdoe) submits a PKCS#10 CSR to CORP-CA01 specifying /altname:Administrator@corp.local. On CORP-CA01, certsrv.exe logs Security EventID 4886 (Certificate Services received a certificate request) and EventID 4887 (Approved and issued a certificate) where Requester="CORP\\jdoe" mismatches the issued SubjectAltName="upn=Administrator@corp.local" (and post-KB5014754 logs Microsoft-Windows-CertificationAuthority EID 53/54 if strong mapping is missing).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Credential Access (T1649 - AD CS ESC1 SAN Spoofing & EventID 4886/4887)',
        technicalCommands: [
          'Certify.exe request /ca:CORP-CA01.corp.local\\corp-CA /template:CorpVPNUser /altname:Administrator@corp.local',
          'CA Security EventID 4886 & 4887: Requester=CORP\\jdoe | SubjectAltName="otherName:Principal Name=Administrator@corp.local"',
        ],
        defenseMitigation:
          'Enable Audit Certification Services on all Enterprise CAs (configuring auditfilter 127 via certutil -setreg CA\\AuditFilter 127) so EventID 4886 and 4887 log the SubjectAltName field, and alert whenever Requester UPN != SAN UPN.',
        logs: [
          {
            id: 'dfir-adcs-2',
            timestamp: '12:10:09.612',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4887,
            ProcessName: 'certsrv.exe',
            CommandLine: 'ICertRequestD2::Request Template=CorpVPNUser SAN=Administrator@corp.local',
            raw: 'EventID: 4887 | Computer: CORP-CA01.corp.local | Requester: CORP\\jdoe | RequestId: 1482 | CertificateTemplate: CorpVPNUser | SubjectName: CN=jdoe | SubjectAltName: upn=Administrator@corp.local | Disposition: Issued',
            parsedFields: {
              EventID: '4886 (CSR Received) / 4887 (Certificate Issued)',
              RequesterAccount: 'CORP\\jdoe (Low-Privileged User)',
              SpoofedSubjectAltName: 'upn=Administrator@corp.local (Domain Admin)',
              CertificateSerialNumber: '61000005C9A18204B19283740000000005C9',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Kerberos PKINIT Authentication & NT Hash Extraction via Unpac-the-Hash (KDC EventID 4768)',
        narration:
          'The attacker converts the issued certificate to a PFX and runs Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials. CORP-DC01 validates the certificate via PKINIT (PA-PK-AS-REQ) and logs Security EventID 4768 (A Kerberos authentication ticket (TGT) was requested) where TargetUserName=Administrator and CertIssuerName="corp-CA" / CertThumbprint is populated instead of password pre-authentication, while Rubeus decrypts the PAC_CREDENTIAL_INFO structure to recover Administrator’s permanent NTLM hash.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Privilege Escalation (T1649 - PKINIT EventID 4768 & Unpac-the-Hash)',
        technicalCommands: [
          'Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials /ptt',
          'KDC Security EventID 4768: TargetUserName=Administrator PreAuthType=16 (PA-PK-AS-REQ) CertThumbprint=9F8E7D6C5B4A...',
          'Unpac-the-Hash: Decrypts PAC_CREDENTIAL_INFO (NTLMCredentialData) using AS-REP session key',
        ],
        defenseMitigation:
          'Enforce KB5014754 Full Enforcement mode (StrongCertificateBindingEnforcement=2) so certificates lacking the OID 1.3.6.1.4.1.311.25.2 Sid-Extension matching the target user objectSid are rejected by the KDC (KDC_ERR_INCONSISTENT_KEY_PURPOSE / EventID 39/41).',
        logs: [
          {
            id: 'dfir-adcs-3',
            timestamp: '12:10:15.208',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4768,
            ProcessName: 'lsass.exe',
            CommandLine: 'PKINIT AS-REQ (PreAuthType=16) for Administrator using CertSerial 61000005C9...',
            raw: 'EventID: 4768 | Computer: CORP-DC01.corp.local | TargetUserName: Administrator | PreAuthType: 16 | CertIssuerName: corp-CA | CertSerialNumber: 61000005C9A18204B19283740000000005C9 | CertThumbprint: 9F8E7D6C5B4A392817263544556677889900AABB',
            parsedFields: {
              EventID: '4768 (Kerberos TGT Requested via PKINIT)',
              PreAuthType: '16 (PA-PK-AS-REQ SmartCard/Certificate)',
              TargetUserName: 'Administrator',
              CertThumbprint: '9F8E7D6C5B4A392817263544556677889900AABB',
            },
          },
        ],
      },
    ],
  };
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
