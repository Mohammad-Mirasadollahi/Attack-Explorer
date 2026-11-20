import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion',
    title: 'Microsoft KB5005413, CERT-FR & CISA DFIR — MS-EFSRPC PetitPotam Coercion (Zeek dce_rpc) & NTLM Relay Forensics (EID 4624)',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1187',
    description:
      'Grounded in Microsoft Security Advisory KB5005413, CERT-FR PetitPotam analysis, and CISA NTLM Relay guidance: an attacker connects to the Encrypting File System Remote Protocol (MS-EFSRPC over \\pipe\\lsarpc or \\pipe\\efsrpc) on a Domain Controller and invokes EfsRpcOpenFileRaw(FileName="\\\\10.10.4.99\\test\\Settings.ini"), coercing the DC machine account (CORP-DC01$) to authenticate via NTLMv2 to the attacker relay listener—detectable via Zeek dce_rpc.log, Security EventID 5145 (\\pipe\\lsarpc), and relayed Security EventID 4624 (LogonType 3, AuthenticationPackageName=NTLM).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Coercion & NTLM Relay Host', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Zeek dce_rpc & SMB (:445)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'CORP-DC01 (\\pipe\\lsarpc)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Zeek dce_rpc & EID 5145/4624', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Relayed Target (LDAP / HTTP)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: MS-EFSRPC Bind Over \\pipe\\lsarpc & EfsRpcOpenFileRaw Coercion (Zeek dce_rpc.log & EventID 5145)',
        narration:
          'The attacker binds to the MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e exposed on \\pipe\\lsarpc (or UUID df1941c5-fe89-4e79-bf10-463657acf44d on \\pipe\\efsrpc) on CORP-DC01 and invokes Opnum 0 (EfsRpcOpenFileRaw) passing a UNC path pointing back to the attacker IP (\\\\10.10.4.99\\share\\file). Zeek dce_rpc.log records endpoint="efsrpc" and operation="EfsRpcOpenFileRaw", while CORP-DC01 logs Security EventID 5145 on \\\\*\\IPC$ RelativeTargetName=lsarpc.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1187 - Forced Authentication: MS-EFSRPC PetitPotam)',
        technicalCommands: [
          'Zeek dce_rpc.log: named_pipe="lsarpc" uuid="c681d488-d850-11d0-8c52-00c04fd90f7e" operation="EfsRpcOpenFileRaw"',
          'Security EventID 5145: ShareName="\\\\*\\IPC$" RelativeTargetName="lsarpc"',
        ],
        defenseMitigation:
          'Apply Microsoft KB5005413 recommendations: block unauthenticated RPC binds via Group Policy (RestrictUnauthenticatedRpcClients), apply RPC packet-privacy filters (netsh rpc filter) blocking UUID c681d488-d850-11d0-8c52-00c04fd90f7e, and monitor Zeek dce_rpc.log for EfsRpc* operations.',
        logs: [
          {
            id: 'dfir-petit-1',
            timestamp: '15:40:02.110',
            source: 'Network',
            severity: 'critical',
            EventCode: 5145,
            ProcessName: 'lsass.exe',
            CommandLine: 'Zeek dce_rpc: EfsRpcOpenFileRaw over \\pipe\\lsarpc (UUID c681d488-d850-11d0-8c52-00c04fd90f7e)',
            raw: 'zeek_dce_rpc: ts=1762184402.110 uid=Ck91m2 id.orig_h=10.10.4.99 id.resp_h=10.10.0.10 id.resp_p=445 named_pipe="lsarpc" endpoint="efsrpc" uuid="c681d488-d850-11d0-8c52-00c04fd90f7e" operation="EfsRpcOpenFileRaw"',
            parsedFields: {
              ZeekLogStream: 'dce_rpc.log + Security EventID 5145',
              NamedPipe: '\\pipe\\lsarpc (or \\pipe\\efsrpc)',
              RpcInterfaceUuid: 'c681d488-d850-11d0-8c52-00c04fd90f7e',
              CoercionOperation: 'EfsRpcOpenFileRaw (Opnum 0)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Coerced Machine Account (CORP-DC01$) Outbound SMB NTLMv2 Callback to Attacker Listener',
        narration:
          'In response to EfsRpcOpenFileRaw, the NT kernel on CORP-DC01 (System PID 4) immediately initiates an outbound SMB TCP 445 connection from 10.10.0.10 to the attacker IP 10.10.4.99 authenticating as CORP\\CORP-DC01$ via NTLMSSP. On CORP-DC01, Microsoft-Windows-NTLM/Operational logs EventID 8001 (Outgoing NTLM authentication traffic to remote server 10.10.4.99).',
        activeNodes: ['target', 'firewall', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1187 - Coerced Machine Account Outbound NTLMv2)',
        technicalCommands: [
          'Microsoft-Windows-NTLM/Operational EventID 8001: Outgoing NTLM authentication to target "\\\\10.10.4.99"',
          'Sysmon EventID 3: Image=System (PID 4) SourceIp=10.10.0.10 DestinationIp=10.10.4.99 DestinationPort=445',
        ],
        defenseMitigation:
          'Enable the policy "Network security: Restrict NTLM: Outgoing NTLM traffic to remote servers" (Audit All or Deny All on Domain Controllers) to log EventID 8001 in Microsoft-Windows-NTLM/Operational and block outbound NTLM coercion.',
        logs: [
          {
            id: 'dfir-petit-2',
            timestamp: '15:40:02.180',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 8001,
            ProcessName: 'System',
            CommandLine: 'NTLM/Operational EID 8001: Outgoing NTLM from CORP-DC01$ to \\\\10.10.4.99:445',
            raw: 'LogName: Microsoft-Windows-NTLM/Operational | EventID: 8001 | Computer: CORP-DC01.corp.local | TargetName: cifs/10.10.4.99 | UserName: CORP-DC01$ | DomainName: CORP | ProcessName: System',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-NTLM/Operational',
              EventID: '8001 (Outgoing NTLM Authentication Audit)',
              CoercedAccount: 'CORP\\CORP-DC01$ (Domain Controller Machine Account)',
              DestinationTarget: 'cifs/10.10.4.99 (TCP 445)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Cross-Protocol NTLM Relay to HTTP/LDAP & Anomalous EventID 4624 IpAddress Mismatch',
        narration:
          'The attacker relays the NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages from CORP-DC01$ to a secondary server (such as AD CS HTTP /certsrv/ or LDAP lacking channel binding/signing). On the relayed destination server, Security EventID 4624 logs a successful LogonType 3 (AuthenticationPackageName=NTLM, PackageName=NTLM V2) where TargetUserName="CORP-DC01$" (10.10.0.10) does not match IpAddress="10.10.4.99" (the attacker relay host).',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Lateral Movement (T1557.001 - Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning and SMB Relay)',
        technicalCommands: [
          'Security EventID 4624: LogonType=3 AuthenticationPackageName=NTLM TargetUserName=CORP-DC01$ WorkstationName=CORP-DC01 IpAddress=10.10.4.99',
          'SIEM Relay Signature: TargetUserName ends with "$" (Machine Account), AuthPackage="NTLM", and IpAddress != resolved DNS IP of TargetUserName',
        ],
        defenseMitigation:
          'Enforce SMB Signing, LDAP Signing (Domain controller: LDAP server signing requirements = Require signing), LDAP Channel Binding (LdapEnforceChannelBinding=2), and Extended Protection for Authentication (EPA) on all IIS/ADCS endpoints.',
        logs: [
          {
            id: 'dfir-petit-3',
            timestamp: '15:40:02.310',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 4624,
            ProcessName: 'lsass.exe',
            CommandLine: 'Security EID 4624 NTLM Relay: TargetUserName=CORP-DC01$ from IpAddress=10.10.4.99',
            raw: 'EventID: 4624 | LogonType: 3 | TargetUserName: CORP-DC01$ | TargetDomainName: CORP | AuthenticationPackageName: NTLM | LmPackageName: NTLM V2 | WorkstationName: CORP-DC01 | IpAddress: 10.10.4.99 | Anomaly: Machine account CORP-DC01$ (10.10.0.10) authenticated from 10.10.4.99',
            parsedFields: {
              EventID: '4624 (Relayed Network LogonType 3)',
              RelayedIdentity: 'CORP\\CORP-DC01$ (Expected IP 10.10.0.10)',
              ActualSourceIp: '10.10.4.99 (Attacker NTLM Relay Host)',
              AuthenticationPackage: 'NTLM V2 (Missing EPA / Channel Binding)',
            },
          },
        ],
      },
    ],
  };
