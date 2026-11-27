import type { TelemetryEvent } from '../types';

export const DCSYNC_TELEMETRY: TelemetryEvent[] = [
  {
    id: 'dcsync-evt-1',
    no: 1,
    stageIndex: 1,
    timestamp: '00:00.410',
    sourceNodeId: 'rogue_host',
    targetNodeId: 'ad_root_acl',
    sourceLabel: 'WKS-ADMIN-07 (svc_dir_sync)',
    targetLabel: 'DC=corp,DC=local ACL',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Security EID 5136 (ACL Audit)',
    shortAction: 'REPLICATION ACL CHECK',
    info: 'Directory Service ACL audit reveals non-DC account CORP\\svc_dir_sync holds DS-Replication-Get-Changes-All (1131f6ad-...) on domain root',
    sizeOrCode: '1131f6ad',
    severity: 'HIGH',
    mitreId: 'T1003.006',
    explanation:
      'DCSync does not exploit a software bug—it abuses Active Directory extended rights on the domain root object. Holding both DS-Replication-Get-Changes (1131f6aa) and DS-Replication-Get-Changes-All (1131f6ad) allows any non-DC principal to impersonate a peer Domain Controller.',
    rawLog: `LogName=Security | EventCode=5136 (Directory Service Object Modified / ACL Audit)
Computer=CORP-DC01.corp.local
ObjectDN=DC=corp,DC=local | AttributeLDAPDisplayName=nTSecurityDescriptor
GrantedPrincipal=CORP\\svc_dir_sync (Not a Member of Domain Controllers)
ExtendedRightsGUID=1131f6aa-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes)
ExtendedRightsGUID=1131f6ad-9c07-11d1-f79f-00c04fc2dcd2 (DS-Replication-Get-Changes-All)`,
    detectionRule: {
      type: 'KQL',
      title: 'Non-DC Principal Granted Active Directory DCSync Extended Rights',
      ruleCode: `SecurityEvent
| where EventID in (5136, 4662)
| where Properties has_any ("1131f6ad-9c07-11d1-f79f-00c04fc2dcd2", "1131f6aa-9c07-11d1-f79f-00c04fc2dcd2")
| where SubjectUserName !endswith "$" and SubjectUserName !in ("SYSTEM", "MSOL_")`,
      mitigation:
        'Audit DC=domain root ACLs regularly via BloodHound/PingCastle and revoke DS-Replication-Get-Changes-All from every non-Domain Controller principal.',
    },
  },
  {
    id: 'dcsync-evt-2',
    no: 2,
    stageIndex: 2,
    timestamp: '00:02.185',
    sourceNodeId: 'rogue_host',
    targetNodeId: 'dc_drsuapi',
    sourceLabel: 'WKS-ADMIN-07 (10.20.14.88)',
    targetLabel: 'CORP-DC01 (TCP/49668 MS-DRSR)',
    sourceType: 'NETWORK',
    protocolOrEventId: 'MS-DRSR DRSUAPI (Opnum 3)',
    shortAction: 'IDL_DRSGetNCChanges',
    info: 'Non-DC workstation 10.20.14.88 invokes DRSUAPI IDL_DRSGetNCChanges (UUID e3514235-...) against CORP-DC01 to pull secret attributes remotely',
    sizeOrCode: 'Opnum 3',
    severity: 'CRITICAL',
    mitreId: 'T1003.006',
    explanation:
      'Legitimate MS-DRSR replication occurs strictly between peer Domain Controllers. When Zeek or Suricata observes DRSUAPI IDL_DRSGetNCChanges (Opnum 3) originating from a workstation VLAN IP (10.20.14.88), active remote credential theft is underway with zero execution on CORP-DC01.',
    rawLog: `Zeek dce_rpc.log | Src=10.20.14.88:54912 -> Dst=10.20.10.10:49668 (CORP-DC01)
Endpoint=drsuapi (UUID: e3514235-4b06-11d1-ab04-00c04fc2dcd2)
Operation=IDL_DRSGetNCChanges (Opnum 3)
TargetObject=CN=krbtgt,CN=Users,DC=corp,DC=local
SourceClassification=NON_DC_WORKSTATION_VLAN (ALERT)`,
    detectionRule: {
      type: 'SURICATA',
      title: 'MS-DRSR DRSGetNCChanges Replication Request From Non-DC IP',
      ruleCode: `alert tcp !$DOMAIN_CONTROLLERS any -> $DOMAIN_CONTROLLERS any (msg:"DFIR DCSync DRSUAPI DRSGetNCChanges From Non-DC Host"; flow:established,to_server; dce_iface:e3514235-4b06-11d1-ab04-00c04fc2dcd2; dce_opnum:3; sid:2043901; rev:2;)`,
      mitigation:
        'Restrict MS-DRSR RPC replication traffic via IPsec/Windows Firewall so only peer Domain Controller IP addresses can invoke DRSUAPI interfaces.',
    },
  },
  {
    id: 'dcsync-evt-3',
    no: 3,
    stageIndex: 3,
    timestamp: '00:02.412',
    sourceNodeId: 'dc_drsuapi',
    targetNodeId: 'siem_4662_tower',
    sourceLabel: 'CORP-DC01 (lsass.exe)',
    targetLabel: 'SIEM EID 4662 + EID 4624',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'Security EID 4662 / EID 4624',
    shortAction: 'EID 4662 + 4624 JOIN',
    info: 'CORP-DC01 logs Security Event ID 4662 (AccessMask 0x100, GUID 1131f6ad) for non-$ user svc_dir_sync, correlated via SubjectLogonId 0x7A41E9 to 10.20.14.88',
    sizeOrCode: '0x100',
    severity: 'CRITICAL',
    mitreId: 'T1003.006',
    explanation:
      'Windows Security Event ID 4662 captures the exact account performing replication, while Event ID 4624 records the network source IP. Joining both logs on SubjectLogonId (0x7A41E9) delivers immediate proof linking svc_dir_sync to WKS-ADMIN-07.',
    rawLog: `LogName=Security | EventCode=4662 (Operation Performed on an Object)
SubjectUserName=svc_dir_sync | SubjectLogonId=0x7A41E9
ObjectType=domainDNS | AccessMask=0x100 (Control Access)
Properties=%%7688 {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2}
--- Correlated EventCode=4624 ---
TargetLogonId=0x7A41E9 | LogonType=3 | IpAddress=10.20.14.88 (WKS-ADMIN-07)`,
    detectionRule: {
      type: 'SIGMA',
      title: 'Active Directory DCSync Detected via Security Event ID 4662',
      ruleCode: `title: Active Directory DCSync Replication From Non-Machine Account
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4662
    AccessMask: '0x100'
    Properties|contains:
      - '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2'
      - '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2'
  filter_dc:
    SubjectUserName|endswith: '$'
  condition: selection and not filter_dc
level: critical`,
      mitigation:
        'Enable "Audit Directory Service Access" on all Domain Controllers and correlate EID 4662 with EID 4624 automatically in the SIEM.',
    },
  },
  {
    id: 'dcsync-evt-4',
    no: 4,
    stageIndex: 4,
    timestamp: '00:08.900',
    sourceNodeId: 'siem_4662_tower',
    targetNodeId: 'krbtgt_ledger',
    sourceLabel: 'IR Team & Tier-0 Audit',
    targetLabel: 'NTDS Secret Store (krbtgt)',
    sourceType: 'WIN_EVENT',
    protocolOrEventId: 'ACL Revoke + 2x krbtgt Reset',
    shortAction: 'TIER-0 ERADICATION',
    info: 'Defenders strip replication ACL from svc_dir_sync, isolate WKS-ADMIN-07, and execute two krbtgt resets >= 10 hours apart to invalidate Golden Tickets',
    sizeOrCode: '2x Reset',
    severity: 'INFO',
    mitreId: 'T1003.006',
    explanation:
      'Active Directory keeps both the current and previous krbtgt password hashes so in-flight Kerberos tickets remain valid. Resetting krbtgt once leaves the stolen hash active as the previous key; resetting it twice at least 10 hours apart permanently purges the compromised key without breaking domain authentication.',
    rawLog: `Action=TIER0_DCSYNC_REMEDIATION | Domain=CORP.LOCAL
Step1=Revoked DS-Replication-Get-Changes(-All) ACE for CORP\\svc_dir_sync on DC=corp,DC=local
Step2=Isolated WKS-ADMIN-07 (10.20.14.88) & disabled svc_dir_sync
Step3=Executed krbtgt Reset #1 (T+0h) -> Verified DC Replication -> Scheduled Reset #2 (T+12h)`,
    detectionRule: {
      type: 'KQL',
      title: 'Verify Double krbtgt Password Reset Completion (Event ID 4724)',
      ruleCode: `SecurityEvent
| where EventID == 4724
| where TargetUserName == "krbtgt"
| project TimeGenerated, Computer, SubjectUserName, TargetUserName
| order by TimeGenerated desc`,
      mitigation:
        'Use Microsoft’s official Reset-KrbTgt-Password-For-RWDCs-And-RODCs script twice (>= 10 hours apart) and verify zero rogue replication ACEs remain.',
    },
  },
];
