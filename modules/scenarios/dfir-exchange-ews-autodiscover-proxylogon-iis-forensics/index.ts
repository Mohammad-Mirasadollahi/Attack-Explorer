import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-exchange-ews-autodiscover-proxylogon-iis-forensics',
    title: 'Microsoft MSTIC, Volexity & CISA ED 21-02 DFIR — Exchange HttpProxy, MSExchange Management & OAB Webshell Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1190',
    description:
      'Grounded in Microsoft Threat Intelligence (MSTIC) Hafnium / ProxyLogon forensic guidance, Volexity Exchange exploitation research, and CISA Emergency Directive 21-02: an investigator correlates three Exchange-specific log sources: (1) V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG showing SSRF backend cookie routing (ServerInfo~a]@), (2) the MSExchange Management event log (EventID 1) showing Set-OabVirtualDirectory or New-MailboxExportRequest with an embedded ASPX webshell in ExternalUrl/FilePath, and (3) Sysmon EventID 1 showing w3wp.exe (MSExchangeOWAAppPool) spawning cmd.exe.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Client (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Exchange Frontend HttpProxy', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Exchange Backend EWS / ECP', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'HttpProxy & MSExchange Mgmt', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'OAB ExternalUrl & w3wp.exe', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Exchange Frontend HttpProxy Log Analysis (V15\\Logging\\HttpProxy\\*\\*.LOG)',
        narration:
          'When an external request manipulates the X-BEResource or X-AnonResource-Backend cookie to proxy an unauthenticated Frontend request directly to the Exchange Backend (:444) /ecp/ or /ews/exchange.asmx endpoint, Exchange records the exact AnchorMailbox, TargetServer, and RoutingHint inside C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Ecp\\ and Autodiscover\\ CSV logs.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: Exchange HttpProxy SSRF)',
        technicalCommands: [
          'Log Path: C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG',
          'CSV Columns: DateTime,RequestId,ClientIpAddress,UrlHost,UrlStem,RoutingHint,AnchorMailbox,HttpStatus',
          'Indicator: RoutingHint="X-BEResource-Cookie" AnchorMailbox="ServerInfo~a]@EXCH01.corp.local:444/ecp/DDI/DDIService.svc/..."',
        ],
        defenseMitigation:
          'Ingest Exchange V15\\Logging\\HttpProxy\\*\\*.LOG and V15\\Logging\\CmdletInfra\\*\\*_Cmdlet_*.log into the SIEM alongside standard IIS W3C logs.',
        logs: [
          {
            id: 'dfir-exch-1',
            timestamp: '01:04:12.115',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'w3wp.exe',
            CommandLine: 'Exchange HttpProxy Log: AnchorMailbox=ServerInfo~a]@EXCH01.corp.local:444/ecp/DDI/DDIService.svc',
            raw: 'exch_httpproxy_log: DateTime=2026-11-03T01:04:12.115Z ClientIp=198.51.100.112 UrlStem=/ecp/y.js RoutingHint=X-BEResource-Cookie AnchorMailbox="ServerInfo~EXCH01.corp.local/owa/auth.owa?~1942062522" BackEndStatus=200',
            parsedFields: {
              ForensicLogDir: 'V15\\Logging\\HttpProxy\\Ecp\\*.LOG',
              ClientIpAddress: '198.51.100.112',
              AnchorMailboxAnomaly: 'ServerInfo~EXCH01.corp.local:444/ecp/DDI/DDIService.svc',
              BackEndHttpStatus: '200 OK',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Exchange Management Log (MSExchange Management EventID 1) Set-OabVirtualDirectory & New-MailboxExportRequest',
        narration:
          'Using the proxied backend session, the actor invokes the Exchange Management cmdlet Set-OabVirtualDirectory (injecting JScript webshell code into the ExternalUrl property) followed by ResetOABVirtualDirectory (or New-MailboxExportRequest -FilePath "\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx") to write the configuration to disk. The Windows Event Log channel "MSExchange Management" records EventID 1 with every cmdlet parameter.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.003 - Server Software Component: Web Shell via Exchange Cmdlet)',
        technicalCommands: [
          'Event Log Channel: "MSExchange Management" EventID 1 (Cmdlet Execution)',
          'Cmdlet 1: Set-OabVirtualDirectory -Identity "EXCH01\\OAB (Default Web Site)" -ExternalUrl "http://f/#..."',
          'Cmdlet 2: New-MailboxExportRequest -Mailbox admin@corp.local -FilePath "\\\\localhost\\c$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx"',
        ],
        defenseMitigation:
          'Monitor the "MSExchange Management" event log (EventID 1) and V15\\Logging\\ECP\\Server\\*.LOG for Set-OabVirtualDirectory containing script tags or New-MailboxExportRequest writing to .aspx/.ashx extensions.',
        logs: [
          {
            id: 'dfir-exch-2',
            timestamp: '01:04:18.640',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'MSExchange Management EID 1: New-MailboxExportRequest -FilePath \\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx',
            raw: 'LogName: MSExchange Management | Source: MSExchange CmdletLogs | EventID: 1 | Cmdlet: New-MailboxExportRequest | Parameters: {-Mailbox "admin@corp.local", -FilePath "\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx"} | Caller: corp.local/Users/Administrator',
            parsedFields: {
              LogChannel: 'MSExchange Management (EventID 1)',
              ExecutedCmdlet: 'New-MailboxExportRequest / Set-OabVirtualDirectory',
              TargetFilePath: '\\\\127.0.0.1\\C$\\inetpub\\wwwroot\\aspnet_client\\supp.aspx',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: ASP.NET Dynamic Compilation (Temporary ASP.NET Files) & w3wp.exe Child Shell (Sysmon EventID 1 & 11)',
        narration:
          'When the external actor requests POST /aspnet_client/supp.aspx, IIS w3wp.exe compiles the page via csc.exe into C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\*\\App_Web_*.dll (persisting even if supp.aspx is later deleted from inetpub) and spawns cmd.exe under w3wp.exe (-ap "MSExchangeOWAAppPool") as NT AUTHORITY\\SYSTEM.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1505.003 - Temporary ASP.NET Files Artifact & w3wp.exe Child Shell)',
        technicalCommands: [
          'Sysmon EventID 11: C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\...\\App_Web_supp.aspx.cdcab7d2.dll',
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe (-ap "MSExchangeOWAAppPool") -> Image=C:\\Windows\\System32\\cmd.exe',
        ],
        defenseMitigation:
          'Always inspect C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\ during IIS/Exchange DFIR triage to recover compiled webshell assemblies (App_Web_*.dll) even after the attacker deletes the source .aspx file.',
        logs: [
          {
            id: 'dfir-exch-3',
            timestamp: '01:04:25.910',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "MSExchangeOWAAppPool" spawning cmd.exe /c whoami',
            raw: 'EventID: 1 | User: NT AUTHORITY\\SYSTEM | ParentImage: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ParentCommandLine: c:\\windows\\system32\\inetsrv\\w3wp.exe -ap "MSExchangeOWAAppPool" | Image: C:\\Windows\\System32\\cmd.exe | CompiledArtifact: App_Web_supp.aspx.cdcab7d2.dll',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate) + 11 (Temporary ASP.NET DLL)',
              ParentAppPool: 'w3wp.exe -ap "MSExchangeOWAAppPool" (SYSTEM)',
              CompiledAssemblyArtifact: 'Temporary ASP.NET Files\\...\\App_Web_supp.aspx.cdcab7d2.dll',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Forensic auditors reconstruct a break-in at a corporate mail building by tracing three linked clues: first the front-desk forwarding slips that misrouted a stranger into the rear office, next the management ledger recording a tampered address-book path, and finally the fresh workshop printouts proving a hidden control page ran commands.',
      storyMappings: [
        {
          storyTerm: 'Front-desk forwarding slips',
          technicalTerm: 'Exchange Frontend HttpProxy routing logs',
          tone: 'amber',
        },
        {
          storyTerm: 'Tampered address-book path',
          technicalTerm: 'MSExchange Management Set-OabVirtualDirectory EventID 1',
          tone: 'sky',
        },
        {
          storyTerm: 'Fresh workshop printouts',
          technicalTerm: 'ASP.NET dynamic compilation in Temporary ASP.NET Files',
          tone: 'rose',
        },
        {
          storyTerm: 'Mailroom clerk running tools',
          technicalTerm: 'w3wp.exe spawning unexpected command child processes',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.',
        storyMappings: [
          {
            storyTerm: 'Reception counter logbook',
            technicalTerm: 'V15\\Logging\\HttpProxy\\*\\*.log proxy audit files',
            tone: 'amber',
          },
          {
            storyTerm: 'Static graphic shelf address',
            technicalTerm: 'Crafted /ecp/*.js path triggering SSRF routing',
            tone: 'sky',
          },
          {
            storyTerm: 'Rear backend mail engine',
            technicalTerm: 'Internal Exchange backend RPC and EWS services',
            tone: 'rose',
          },
          {
            storyTerm: 'Strange routing stamp',
            technicalTerm: 'X-BEResource cookie directing arbitrary backend calls',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable page script.',
        storyMappings: [
          {
            storyTerm: 'Supervisor office ledger',
            technicalTerm: 'MSExchange Management EventID 1 administrative log',
            tone: 'amber',
          },
          {
            storyTerm: 'Rewritten address-book link',
            technicalTerm: 'Set-OabVirtualDirectory ExternalUrl payload injection',
            tone: 'sky',
          },
          {
            storyTerm: 'Resetting the directory',
            technicalTerm: 'Reset-OabVirtualDirectory writing payload to webroot',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden page script',
            technicalTerm: 'Dropped ASPX webshell embedded inside OAB config',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk carrying heavy workshop tools.',
        storyMappings: [
          {
            storyTerm: 'Compiled proof plates',
            technicalTerm: 'Compiled DLLs in Temporary ASP.NET Files cache',
            tone: 'amber',
          },
          {
            storyTerm: 'Mailroom clerk process',
            technicalTerm: 'IIS w3wp.exe worker handling the webshell request',
            tone: 'sky',
          },
          {
            storyTerm: 'Heavy workshop tools',
            technicalTerm: 'Spawned cmd.exe, powershell.exe, or credential dumpers',
            tone: 'rose',
          },
          {
            storyTerm: 'Deleted wall flyer',
            technicalTerm: 'Removed source .aspx file still evidenced by build artifacts',
            tone: 'emerald',
          },
        ],
      },
    },
  };
