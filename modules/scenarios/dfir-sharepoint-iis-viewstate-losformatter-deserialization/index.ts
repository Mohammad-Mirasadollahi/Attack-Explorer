import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-sharepoint-iis-viewstate-losformatter-deserialization',
    title: 'Microsoft MSRC & CISA KEV DFIR — ASP.NET / SharePoint __VIEWSTATE MachineKey LosFormatter Deserialization Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1190',
    description:
      'Grounded in Microsoft Security Response Center (MSRC) advisories (CVE-2020-0688 / CVE-2023-29357 / ASP.NET ViewState guidance) and CISA KEV incident response reports: an attacker extracts or abuses a static ASP.NET <machineKey> validationKey from web.config, crafts a signed LosFormatter / ObjectStateFormatter serialized gadget payload in the __VIEWSTATE parameter, and triggers in-memory .NET deserialization inside w3wp.exe—generating ASP.NET Warning EventID 1309 / 1316 in the Windows Application log when tampered and spawning child processes under w3wp.exe when valid.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'ysoserial.net ViewState Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'IIS W3C Extended Log (:443)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'w3wp.exe (LosFormatter)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Application EID 1309 & Sysmon', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'web.config <machineKey>', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: web.config <machineKey> validationKey Exposure & ViewState Probing (Application EventID 1309)',
        narration:
          'Before obtaining the valid key (or while probing with known pre-shared keys), failed __VIEWSTATE payloads trigger Windows Application EventID 1309 (Source: ASP.NET 4.0.30319.0, Event code: 4005 "Viewstate verification failed. Reason: The viewstate supplied failed integrity check") logging the exact Client IP, Request URL, and User-Agent.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access (T1190 - Exploit Public-Facing Application: ViewState MAC Probing)',
        technicalCommands: [
          'Application Log: Source="ASP.NET 4.0.30319.0" EventID=1309 EventCode=4005 (Viewstate verification failed)',
          'Config Artifact: web.config <machineKey validationKey="..." decryptionKey="..." validation="HMACSHA256" />',
        ],
        defenseMitigation:
          'Forward all Windows Application EventID 1309 (EventCode 4005 Viewstate verification failed and EventCode 3005 Unhandled exception) events to the SIEM to detect ViewState key brute-forcing or deserialization attempts.',
        logs: [
          {
            id: 'dfir-viewstate-1',
            timestamp: '14:05:01.110',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 1309,
            ProcessName: 'w3wp.exe',
            CommandLine: 'ASP.NET EventID 1309 (EventCode 4005): Viewstate verification failed from 198.51.100.33',
            raw: 'LogName: Application | Source: ASP.NET 4.0.30319.0 | EventID: 1309 | EventCode: 4005 | Message: Viewstate verification failed. Reason: The viewstate supplied failed integrity check. | Request URL: https://portal.corp.local/_layouts/15/Picker.aspx | User host address: 198.51.100.33',
            parsedFields: {
              LogChannel: 'Application (Source: ASP.NET 4.0.30319.0)',
              EventID: '1309 (EventCode 4005 - ViewState MAC Failure)',
              RequestUrl: 'https://portal.corp.local/_layouts/15/Picker.aspx',
              ClientIp: '198.51.100.33',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Signed __VIEWSTATE LosFormatter / TypeConfuseDelegate Deserialization (IIS W3C Access Log)',
        narration:
          'Once the attacker obtains the web.config validationKey (via a path traversal, backup leak, or CVE-2023-29357 auth bypass), they sign a TypeConfuseDelegate / ActivitySurrogateSelector gadget chain with HMACSHA256 and submit it via POST /_layouts/15/Picker.aspx (or GET ?__VIEWSTATE=/wEPDwUK...). Because the HMAC is valid, HTTP 200 is returned in the IIS W3C log (C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex*.log) with an abnormally large cs-bytes (request size) or cs-uri-query.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Execution (T1059 - Signed LosFormatter .NET Gadget Deserialization)',
        technicalCommands: [
          'IIS W3C Log Fields: date time c-ip cs-method cs-uri-stem cs-uri-query sc-status sc-bytes cs-bytes',
          'Anomaly: POST /_layouts/15/Picker.aspx sc-status=200 cs-bytes=8420 (Large signed __VIEWSTATE)',
        ],
        defenseMitigation:
          'Enable IIS W3C logging of cs-bytes (client-to-server request bytes) and hunt for anomalous large POST/GET requests to _layouts/15/*.aspx or /ecp/default.aspx returning HTTP 200 or 500.',
        logs: [
          {
            id: 'dfir-viewstate-2',
            timestamp: '14:05:09.420',
            source: 'Network',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'w3wp.exe',
            CommandLine: 'IIS W3C: POST /_layouts/15/Picker.aspx sc-status=200 cs-bytes=8420',
            raw: 'iis_w3c: 2026-11-03 14:05:09 10.20.1.50 POST /_layouts/15/Picker.aspx __VIEWSTATEGENERATOR=B4F91A02 443 - 198.51.100.33 Mozilla/5.0 - 200 0 0 8420',
            parsedFields: {
              LogFile: 'C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex261103.log',
              UriStem: '/_layouts/15/Picker.aspx',
              RequestBytes: 'cs-bytes=8420 (Signed ObjectStateFormatter Payload)',
              HttpStatus: '200 OK (HMAC Validation Passed)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: w3wp.exe Child Process Creation & MachineKey Rotation Remediation (Sysmon EventID 1)',
        narration:
          'Inside w3wp.exe, System.Web.UI.ObjectStateFormatter.Deserialize() reconstructs the gadget chain and invokes System.Diagnostics.Process.Start("cmd.exe", ...), generating Sysmon EventID 1 with ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1190 - w3wp.exe Child Process & MachineKey Rotation)',
        technicalCommands: [
          'Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe -> Image=C:\\Windows\\System32\\cmd.exe',
          'Remediation: Update-SPMachineKey (SharePoint) or rotate <machineKey> validationKey & decryptionKey across all web.config files',
        ],
        defenseMitigation:
          'During incident response involving ViewState deserialization, patching the vulnerability alone is insufficient: defenders must rotate the ASP.NET <machineKey> validationKey and decryptionKey in web.config and HKLM\\SOFTWARE\\Microsoft\\ASP.NET.',
        logs: [
          {
            id: 'dfir-viewstate-3',
            timestamp: '14:05:09.615',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'w3wp.exe',
            CommandLine: 'w3wp.exe -ap "SharePoint - 80" spawning cmd.exe via LosFormatter deserialization',
            raw: 'EventID: 1 | ParentImage: C:\\Windows\\System32\\inetsrv\\w3wp.exe | ParentCommandLine: w3wp.exe -ap "SharePoint - 80" | Image: C:\\Windows\\System32\\cmd.exe | CommandLine: cmd.exe /c powershell.exe -NoP -W Hidden ...',
            parsedFields: {
              EventID: '1 (Sysmon ProcessCreate)',
              ParentImage: 'C:\\Windows\\System32\\inetsrv\\w3wp.exe',
              ChildImage: 'C:\\Windows\\System32\\cmd.exe',
              MandatoryIrStep: 'Rotate web.config <machineKey> validationKey & decryptionKey',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'A web office sends visitors a folded state receipt stamped with a secret office seal so the clerk trusts any receipt brought back later. Once an outsider steals the secret sealing key from the office supply book, they forge a spring-loaded receipt that unpacks straight into a live command terminal under the clerk badge.',
      storyMappings: [
        {
          storyTerm: 'Folded state receipt',
          technicalTerm: 'ASP.NET hidden __VIEWSTATE form parameter',
          tone: 'amber',
        },
        {
          storyTerm: 'Secret sealing key',
          technicalTerm: 'Exposed web.config <machineKey> validationKey',
          tone: 'sky',
        },
        {
          storyTerm: 'Spring-loaded forged receipt',
          technicalTerm: 'Signed LosFormatter / TypeConfuseDelegate gadget payload',
          tone: 'rose',
        },
        {
          storyTerm: 'Swapping the office seal',
          technicalTerm: 'MachineKey rotation and w3wp.exe process triage',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk accepted the forged signature.',
        storyMappings: [
          {
            storyTerm: 'Configuration binder',
            technicalTerm: 'Application web.config containing <machineKey>',
            tone: 'amber',
          },
          {
            storyTerm: 'Leaked office sealing stamp',
            technicalTerm: 'Compromised or publicly known validationKey secret',
            tone: 'sky',
          },
          {
            storyTerm: 'Small test receipts',
            technicalTerm: 'Probing HTTP POST requests carrying signed __VIEWSTATE',
            tone: 'rose',
          },
          {
            storyTerm: 'Front desk arrival book',
            technicalTerm: 'IIS W3SVC access logs tracking POST lengths and status',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts. Trusting the valid wax seal, the office clerk unfolds the receipt and accidentally triggers arbitrary code.',
        storyMappings: [
          {
            storyTerm: 'Validly stamped bulky receipt',
            technicalTerm: 'HMAC-signed malicious __VIEWSTATE POST payload',
            tone: 'amber',
          },
          {
            storyTerm: 'Receipt unfolding engine',
            technicalTerm: 'ASP.NET ObjectStateFormatter / LosFormatter deserializer',
            tone: 'sky',
          },
          {
            storyTerm: 'Self-triggering gadget parts',
            technicalTerm: 'TypeConfuseDelegate .NET deserialization gadget chain',
            tone: 'rose',
          },
          {
            storyTerm: 'Unexpected desk exception',
            technicalTerm: 'Application Event Log and SharePoint ULS error traces',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Endpoint sensors catch the web clerk suddenly launching system maintenance tools. Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop working permanently.',
        storyMappings: [
          {
            storyTerm: 'Web clerk worker',
            technicalTerm: 'IIS w3wp.exe worker spawning cmd.exe or powershell.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Endpoint motion sensor',
            technicalTerm: 'Sysmon EventID 1 process creation lineage alert',
            tone: 'sky',
          },
          {
            storyTerm: 'Replacing the sealing stamp',
            technicalTerm: 'Rotating ASP.NET MachineKey across the SharePoint farm',
            tone: 'rose',
          },
          {
            storyTerm: 'Branch desk synchronization',
            technicalTerm: 'Running Update-SPMachineKey and restarting IIS pools',
            tone: 'emerald',
          },
        ],
      },
    },
  };
