import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell',
    title: 'Microsoft Exchange/IIS IR, ESET & Unit 42 DFIR — IIS HTTP.sys Kernel URI Registration & In-Memory Module Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1505.004',
    description:
      'Grounded in Microsoft Incident Response IIS Module guidance, ESET IIS malware research, and Unit 42 HTTP.sys analysis: a fileless .NET implant or native IIS module registers a rogue HTTP listener directly inside the Windows kernel driver HTTP.sys (bypassing IIS W3C disk webroots) or hooks IHttpModule inside w3wp.exe—detectable via Microsoft-Windows-HttpService/Operational EventID 113, netsh http show servicestate, appcmd list modules, and Sysmon EventID 7.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Operator (:443)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'HTTP.sys Kernel Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'w3wp.exe (IIS Worker Pool)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'HttpService EID 113 & netsh', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'applicationHost.config & GAC', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Native/Managed IIS Module Registration in applicationHost.config (Sysmon EventID 7 & 11)',
        narration:
          'To intercept every incoming HTTP request to the server without dropping an .aspx file into C:\\inetpub\\wwwroot\\, the actor registers a malicious native or .NET IHttpModule inside C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config (or via VirtualPathProvider in w3wp.exe RAM). Sysmon EventID 7 logs w3wp.exe loading the anomalous DLL.',
        activeNodes: ['attacker', 'target', 'ad'],
        mitreTactic: 'Persistence (T1505.004 - Server Software Component: IIS Components)',
        technicalCommands: [
          'C:\\Windows\\System32\\inetsrv\\appcmd.exe list modules',
          'Config Path: C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config (<globalModules> / <modules>)',
          'Sysmon EventID 7: Image=C:\\Windows\\System32\\inetsrv\\w3wp.exe ImageLoaded=C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll',
        ],
        defenseMitigation:
          'Audit C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config and web.config files with File Integrity Monitoring and verify the digital signature of every DLL loaded by w3wp.exe.',
        logs: [
          {
            id: 'dfir-iis-1',
            timestamp: '04:12:08.110',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "DefaultAppPool" loading unsigned IIS module DiagnosticsCompression.dll',
            raw: 'EventID: 7 | Image: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ImageLoaded: C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll | Signed: false | ConfigEntry: applicationHost.config <add name="DiagCompModule" />',
            parsedFields: {
              HostProcess: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe',
              LoadedIisModule: 'C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll',
              IisConfigFile: 'C:\\Windows\\System32\\inetsrv\\config\\applicationHost.config',
              MitreTechnique: 'T1505.004 (IIS Components)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Kernel-Mode HTTP.sys URI UrlGroup Registration (HttpService/Operational EventID 113)',
        narration:
          'Alternatively, a post-exploitation implant calls HttpAddUrlToUrlGroup (httpapi.dll) to register a dedicated URI prefix (https://+:443/owa/auth/Current/themes/health/) directly in the kernel HTTP.sys driver. Because HTTP.sys routes matching requests directly to the implant process queue before IIS sees them, requests never appear in IIS W3C logs—but Microsoft-Windows-HttpService/Operational EventID 113 logs the exact URI and owning ProcessId.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1505.004 - HTTP.sys Kernel Request Queue Hijacking)',
        technicalCommands: [
          'Win32 API: httpapi.dll!HttpAddUrlToUrlGroup(UrlGroupId, L"https://+:443/owa/auth/Current/themes/health/", ...)',
          'LogChannel: Microsoft-Windows-HttpService/Operational EventID 113 (Added URL to URL group)',
        ],
        defenseMitigation:
          'Enable Microsoft-Windows-HttpService/Operational logging on all internet-facing Windows/IIS/Exchange servers and alert on EventID 113 (Added URL to URL group) by non-IIS processes.',
        logs: [
          {
            id: 'dfir-iis-2',
            timestamp: '04:12:14.520',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 113,
            ProcessName: 'dllhost.exe',
            CommandLine: 'HttpAddUrlToUrlGroup https://+:443/owa/auth/Current/themes/health/ (PID 6104)',
            raw: 'LogName: Microsoft-Windows-HttpService/Operational | EventID: 113 | UrlGroupId: 0xFE00000120000004 | Url: https://+:443/owa/auth/Current/themes/health/ | ProcessId: 6104 | Executable: C:\\Windows\\System32\\dllhost.exe',
            parsedFields: {
              LogChannel: 'Microsoft-Windows-HttpService/Operational',
              EventID: '113 (Added URL to HTTP.sys URL Group)',
              RegisteredKernelUri: 'https://+:443/owa/auth/Current/themes/health/',
              OwningProcess: 'dllhost.exe (PID 6104 - Bypasses IIS W3C Logs)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Live Triage via netsh http show servicestate & .NET CLR AppDomain Inspection',
        narration:
          'During live DFIR triage, the responder executes netsh http show servicestate view=requestq verbose=yes, which enumerates every active HTTP.sys kernel request queue, Registered URLs, and the exact owning Process IDs (exposing PID 6104 alongside legitimate w3wp.exe PIDs).',
        activeNodes: ['firewall', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1505.004 - netsh http show servicestate Kernel Queue Inspection)',
        technicalCommands: [
          'netsh http show servicestate view=requestq verbose=yes',
          'Get-WebGlobalModule; Get-ChildItem IIS:\\AppPools',
          'Inspects Registered URLs -> Process IDs mapping inside kernel HTTP.sys',
        ],
        defenseMitigation:
          'Include netsh http show servicestate and appcmd list modules in all Windows web server DFIR triage scripts.',
        logs: [
          {
            id: 'dfir-iis-3',
            timestamp: '04:20:00.100',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh http show servicestate view=requestq verbose=yes',
            raw: 'NETSH_HTTP_SERVICESTATE: RequestQueueName="UnnamedQueue" ProcessIDs="6104 (dllhost.exe)" RegisteredURLs="https://+:443/owa/auth/Current/themes/health/" | Anomaly="Non-IIS process owning HTTPS :443 kernel URL route"',
            parsedFields: {
              TriageCommand: 'netsh http show servicestate view=requestq verbose=yes',
              RogueProcessId: '6104 (C:\\Windows\\System32\\dllhost.exe)',
              InterceptedUrlPrefix: 'https://+:443/owa/auth/Current/themes/health/',
            },
          },
        ],
      },
    ],
  };
