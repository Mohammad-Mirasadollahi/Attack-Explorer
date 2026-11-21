import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'azure-ad-connect-pass-the-certificate',
    briefing: {
      headline: 'Scenario Briefing: Microsoft Entra Connect (Azure AD Connect), MSOL_ DKM Decryption, DCSync & Seamless SSO Silver Ticket',
      storyAnalogy:
        'Imagine a translator’s desk (Entra Connect / Azure AD Connect Server) that sits between a company’s local castle (On-Premises Active Directory) and its cloud fortress (Microsoft Entra ID). To keep both sides synchronized, the translator keeps a locked desk drawer (ADSync.mdf -> mms_management_agent LocalDB table) containing the master skeleton key to the local castle (MSOL_<hex> account with DCSync rights), and hangs the key to that drawer (DPAPI cryptKeySet) right under the desk! If an intruder compromises the translator’s server, they reach under the desk, unlock the drawer with the translator’s own magnifying glass (mcrypt.dll), grab the MSOL_ skeleton key to copy every secret in the local castle, including the AZUREADSSOACC$ bridge key, and forge golden passes straight into the cloud fortress.',
      plainSummary:
        'In this scenario (T1556.007, SpecterOps, Mandiant & Microsoft - Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: querying the ADSync SQL LocalDB as NT, then loading mcrypt.dll in PowerShell, then executing MSOL_ DCSync. Steps #1–#3 walk that chain end-to-end by covering Querying the ADSync SQL LocalDB as NT, then Loading mcrypt.dll in PowerShell, then Executing MSOL_ DCSync, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (On-Prem Foothold Operator), query ADSync.mdf (mms_management_agent) on Node ②/③ (Entra Connect Server CORP-AADC01), decrypt the MSOL_ password via mcrypt.dll inside Node ④, and execute DCSync + AZUREADSSOACC$ Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) monitored by Node ⑥ (Defender for Identity & Sentinel SIEM).',
      documentedAdvisory: 'SpecterOps & Dirk-jan Mollema AADInternals Research · Mandiant Hybrid Identity Guidance · MITRE T1556.007 / T1003.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1003',
        plainTitle: 'Querying the ADSync SQL LocalDB (mms_management_agent) as NT SERVICE\\ADSync (T1003)',
        storyAnalogy:
          'First, the attacker steps into the shoes of the NT SERVICE\\ADSync service account on the sync server and opens its private SQL LocalDB ledger (ADSync.mdf) to copy out the encrypted credential rows.',
        simpleExplanation:
          'After obtaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker elevates to NT SERVICE\\ADSync (the service account that owns the local SQL Server Express LocalDB instance and the Windows DPAPI user keyset), connects to the named pipe np:\\\\.\\pipe\\LOCALDB#...\\tsql\\query, and queries SELECT private_configuration_xml, encrypted_configuration FROM mms_management_agent alongside keyset_id, instance_id, and entropy from mms_server_configuration.',
        howItWorksInPractice:
          'Many organizations mistakenly place their Entra Connect server in a standard Tier-1 server OU managed by general server administrators, unaware that local admin on Entra Connect equates to Domain Admin + Cloud Global Admin. In the documented Sysmon EID 1 exchange from On-Prem Foothold Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK PID 5812 (confirming that the SQLLOCALDB_PIPE_ENUM request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Foothold Operator) to Node ②/③ (Entra Connect Server CORP-AADC01), and return arrow ⇠#1 returning the encrypted XML blobs from ADSync.mdf.',
        detectionAndEvidence:
          'Documented by Microsoft & SigmaHQ: Sysmon EventID 1 showing SqlLocalDB.exe info ADSync or non-standard processes opening C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Loading mcrypt.dll in PowerShell to DPAPI-Decrypt the MSOL_<hex> Password (T1552.001)',
        storyAnalogy:
          'Instead of cracking the encryption by brute force, the attacker loads Entra Connect’s own decryption library (mcrypt.dll) in PowerShell and asks it to unlock the MSOL_ password using the server’s local DPAPI key.',
        simpleExplanation:
          'Running as NT SERVICE\\ADSync, the attacker uses PowerShell reflection (or AADInternals / adconnectdump) to load C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll, calls KeyManager.LoadKeySet() (which reads the DPAPI-protected AES key from HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared and unprotects it via CryptUnprotectData), and invokes DecryptBase64ToString() on encrypted_configuration to reveal the plaintext password of the on-premises connector account CORP\\MSOL_9a8b7c6d5e4f.',
        howItWorksInPractice:
          'Because miiserver.exe must decrypt the MSOL_ password unattended whenever the service restarts, the entire decryption chain resides locally on the Entra Connect host. In the documented Sysmon EID 7 (ImageLoad) exchange from Perimeter Firewall & NDR Tap to Entra Connect Server (ADSYNC), Entra Connect Server (ADSYNC) responds with ACK Signed: Microsoft (confirming that the MCRYPT_DLL_LOADED_BY_PS request succeeded on Entra Connect Server (ADSYNC) and establishing the runtime state required for Step #3 MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT).',
        diagramAlignment:
          'On the diagram, arrow #2→ loads mcrypt.dll and unprotects the DPAPI keyset inside Node ④ (DPAPI & mcrypt.dll Decryptor), and ⇠#2 outputs the plaintext MSOL_9a8b7c6d5e4f password.',
        detectionAndEvidence:
          'Documented by SpecterOps & Mandiant: Sysmon EventID 7 (ImageLoad) where mcrypt.dll is loaded by any process other than miiserver.exe (such as powershell.exe). Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1556.007',
        plainTitle: 'Executing MSOL_ DCSync & Forging AZUREADSSOACC$ Seamless SSO Cloud Tickets (T1556.007)',
        storyAnalogy:
          'Because Password Hash Sync is enabled, MSOL_ has permission to copy every password hash in Active Directory (DCSync). The attacker uses MSOL_ to steal the AZUREADSSOACC$ bridge key and mints Kerberos Silver Tickets straight into Microsoft Entra ID!',
        simpleExplanation:
          'Because Password Hash Synchronization (PHS) requires the CORP\\MSOL_9a8b7c6d5e4f account to hold Replicating Directory Changes and Replicating Directory Changes All on the domain root, the attacker uses the decrypted MSOL_ credentials to perform a DCSync attack (MS-DRSR DRSGetNCChanges) against CORP-DC01, dumping the NTLM/AES256 hash of the AZUREADSSOACC$ computer account (the shared Kerberos trust bridge created when Entra Seamless Single Sign-On is enabled, allowing the attacker to forge Kerberos Silver Tickets holding any synchronized user’s immutableId and sid to log directly into Entra ID without knowing their password).',
        howItWorksInPractice:
          'Microsoft recommends treating Entra Connect as a Tier-0 asset, disabling Seamless SSO in favor of Primary Refresh Tokens (PRT), and rotating the AZUREADSSOACC$ Kerberos decryption key every 30 days. In the documented WinSec EID 4662 (DCSync) exchange from Entra Connect Server (ADSYNC) to DPAPI & mcrypt.dll Keyset Engine, DPAPI & mcrypt.dll Keyset Engine responds with ACK AccessMask 0x100 (confirming that the MSOL_DCSYNC_AZUREADSSOACC request succeeded on DPAPI & mcrypt.dll Keyset Engine and completing the final execution objective of SpecterOps, Mandiant & Microsoft, Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO Silver Ticket).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes DCSync and Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) while Node ⑥ (Defender for Identity & Sentinel) alerts on EventID 4662.',
        detectionAndEvidence:
          'Documented by Microsoft Defender for Identity: Windows Security EventID 4662 (DS-Replication-Get-Changes-All GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2) initiated by MSOL_* from a non-Entra-Connect IP.',
      },
    ],
  };
