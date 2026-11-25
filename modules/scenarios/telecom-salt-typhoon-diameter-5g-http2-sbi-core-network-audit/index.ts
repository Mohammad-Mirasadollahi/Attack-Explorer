import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit',
    title: 'CISA/NSA/FBI Telecom Guidance, GSMA FS.31 & ENISA 5G — 5G Core Service-Based Interface (SBI) NRF/UDM & Diameter Roaming Audit',
    category: 'MOBILE_TELECOM_SPYWARE',
    mitreId: 'T1557',
    description:
      'Grounded in the joint CISA/NSA/FBI Enhanced Visibility and Hardening Guidance for Communications Infrastructure, GSMA FS.31/FS.37 interconnect security standards, and ENISA 5G Core Threat Landscape: telecom SOC analysts investigate unauthorized HTTP/2 requests on the 5G Service-Based Interface (SBI), audit Network Repository Function (NRF) OAuth2 token grants, and inspect Unified Data Management (UDM) subscriber location queries.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Roaming SEPP / Diameter Peer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: '5G Security Edge Proxy (SEPP)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: '5G Core NRF & UDM (HTTP/2 SBI)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Telecom Signaling & SBI IDS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'UDR Subscriber & LI Database', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: 5G NRF (Network Repository Function) NFRegister & OAuth2 Token Request Audit (3GPP TS 29.510)',
        narration:
          'On the 5G Core Service-Based Architecture (SBA), a compromised management host or rogue Network Function (NF) queries the Network Repository Function (NRF) via HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ and requests an OAuth 2.0 access token via POST /oauth2/token carrying scope nudm-sdm and nudm-uecm.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Credential Access (T1528 - Steal Application Access Token)',
        technicalCommands: [
          'jq \'. | select(.http2.path | test("/nnrf-nfm/v1/nf-instances|/oauth2/token"))\' /var/log/5gc/nrf_sbi_access.json',
          'tshark -r sbi_core_vlan.pcap -Y "http2.headers.path contains \\"oauth2/token\\"" -T fields -e ip.src -e http2.data.data',
        ],
        defenseMitigation:
          'Enforce mutual TLS (mTLS) with X.509 client certificate validation on all 3GPP TS 33.501 Service-Based Interfaces (SBI), validating that the NF Type in the certificate Subject Alternative Name matches the requested OAuth2 scope on the NRF.',
        logs: [
          {
            id: 'telecom-5gsbi-1',
            timestamp: '04:12:08.310',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'free5gc-nrf',
            CommandLine: 'POST /oauth2/token grant_type=client_credentials nfType=AMF targetNfType=UDM scope=nudm-sdm',
            raw: 'sbi_nrf_audit: {"timestamp":"2026-11-17T04:12:08.310Z","method":"POST","path":"/oauth2/token","srcIp":"10.180.14.99","nfInstanceId":"f81d4fae-7dec-11d0-a765-00a0c91e6bf6","targetNfType":"UDM","scope":"nudm-sdm nudm-uecm","status":200}',
            parsedFields: {
              Specification: '3GPP TS 29.510 (5G NRF Access Token Service)',
              RequestedScope: 'nudm-sdm (Subscriber Data Management) & nudm-uecm',
              SourceAddress: '10.180.14.99 (Unregistered OAM Subnet Host)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: UDM Subscriber Data & Serving AMF/gNodeB Location Query (/nudm-sdm/v2/)',
        narration:
          'Using the NRF-minted Bearer JWT, the caller invokes GET /nudm-sdm/v2/{supi}/am-data and /nudm-uecm/v1/{supi}/registrations/amf-3gpp-access on the Unified Data Management (UDM) function to retrieve Subscription Permanent Identifiers (SUPI/IMSI), slice selection data, and current serving gNodeB cell tower tracking area identities (TAI).',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Collection (T1557 - Adversary-in-the-Middle)',
        technicalCommands: [
          'jq \'. | select(.path | contains("/nudm-sdm/v2/") or contains("/nudm-uecm/v1/"))\' /var/log/5gc/udm_audit.json',
        ],
        defenseMitigation:
          'Implement GSMA FS.37 / 3GPP TS 33.501 authorization policies on UDM/UDR so only registered, IP-allowlisted AMF and SMF instances can query subscriber location or authentication vectors.',
        logs: [
          {
            id: 'telecom-5gsbi-2',
            timestamp: '04:12:45.772',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'free5gc-udm',
            CommandLine: 'GET /nudm-uecm/v1/imsi-310260991827364/registrations/amf-3gpp-access HTTP/2',
            raw: 'sbi_udm_audit: {"timestamp":"2026-11-17T04:12:45.772Z","method":"GET","path":"/nudm-uecm/v1/imsi-310260991827364/registrations/amf-3gpp-access","srcIp":"10.180.14.99","supi":"imsi-310260991827364","status":200}',
            parsedFields: {
              TargetService: '3GPP TS 29.503 / 29.504 Unified Data Management (UDM)',
              QueriedResource: '/nudm-uecm/v1/{supi}/registrations/amf-3gpp-access',
              ExposedMetadata: 'SUPI/IMSI, Serving AMF GUAMI & Cell Tracking Area Identity (TAI)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Diameter S6a Insert-Subscriber-Data (IDR) & SEPP Interconnect Anomaly Correlation',
        narration:
          'In parallel across the 4G/5G interworking boundary, signaling firewalls inspect Diameter S6a Authentication-Information-Request (AIR, Command Code 318) and Insert-Subscriber-Data-Request (IDR, Command Code 319) frames arriving from external PLMN roaming peers with mismatched Origin-Host and source SCTP/IP bindings.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery)',
        technicalCommands: [
          'tshark -r diameter_s6a_interconnect.pcap -Y "diameter.cmd.code == 318 || diameter.cmd.code == 319" -T fields -e sctp.srcport -e diameter.Origin-Host -e diameter.Origin-Realm -e diameter.User-Name',
        ],
        defenseMitigation:
          'Enforce GSMA FS.19 Diameter Signaling Firewall Category 1–3 rules at the roaming edge: verify Origin-Host/Origin-Realm against the peer SCTP IP association and correlate subscriber location against previous attach velocity.',
        logs: [
          {
            id: 'telecom-5gsbi-3',
            timestamp: '04:13:19.105',
            source: 'Suricata IDS',
            severity: 'critical',
            EventCode: 318,
            ProcessName: 'diameter-fw',
            CommandLine: 'Diameter S6a cmd=318 (AIR) Origin-Realm=epc.mnc099.mcc250.3gppnetwork.org velocity_anomaly=true',
            raw: 'gsma_fs19_alert: {"protocol":"Diameter-S6a","cmdCode":318,"cmdName":"Authentication-Information-Request","originHost":"mme01.roam-partner.net","userName":"310260991827364","rule":"FS.19-CAT2-VELOCITY-CHECK","action":"BLOCKED_AND_LOGGED"}',
            parsedFields: {
              SignalingProtocol: 'Diameter S6a (3GPP TS 29.272 Command Code 318 AIR)',
              FirewallRuleTriggered: 'GSMA FS.19 Category 2 Velocity & Home-Network Location Mismatch',
              DefensiveAction: 'Signaling frame dropped at DEA / SEPP and correlated with SBI UDM query',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a modern city transit control center where every department exchanges digital work orders across a high-speed glass hallway using short-lived badge passes issued by a central registry booth. An intruder on an unauthorized maintenance terminal walks up to the registry booth to mint a high-clearance pass, walks straight to the passenger-tracking desk to pull real-time cell tower locations, and simultaneously sends spoofed cross-border roaming inquiries at the outer border gate where signaling guards flag the impossible travel speed.',
      storyMappings: [
        {
          storyTerm: 'High-Speed Glass Hallway',
          technicalTerm: '5G Core Service-Based Interface (SBI) Over HTTP/2 (3GPP TS 29.510)',
          tone: 'sky',
        },
        {
          storyTerm: 'Central Registry Booth Pass',
          technicalTerm: '5G NRF (Network Repository Function) OAuth 2.0 Token Grant',
          tone: 'amber',
        },
        {
          storyTerm: 'Passenger-Tracking Desk Query',
          technicalTerm: 'UDM /nudm-sdm/v2/ & /nudm-uecm/v1/ SUPI & Cell Tower TAI Lookup',
          tone: 'rose',
        },
        {
          storyTerm: 'Outer Border Signaling Guards',
          technicalTerm: 'Diameter S6a (Code 318 AIR / 319 IDR) & GSMA FS.19 Velocity Firewall',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Working from an unregistered maintenance terminal inside the transit building, the intruder introduces a bogus department card at the central registry booth and asks for a temporary hallway pass stamped with permission to read passenger profiles and live locations.',
        storyMappings: [
          {
            storyTerm: 'Unregistered Maintenance Terminal',
            technicalTerm: 'Unauthorized OAM Subnet Host (10.180.14.99)',
            tone: 'amber',
          },
          {
            storyTerm: 'Bogus Department Card',
            technicalTerm: 'HTTP/2 PUT /nnrf-nfm/v1/nf-instances/ Rogue NF Registration',
            tone: 'rose',
          },
          {
            storyTerm: 'Central Registry Booth Pass',
            technicalTerm: 'NRF POST /oauth2/token Requesting nudm-sdm & nudm-uecm Scopes',
            tone: 'sky',
          },
          {
            storyTerm: 'Strict Badge-to-Certificate Check',
            technicalTerm: '3GPP TS 33.501 mTLS Client X.509 SAN vs Requested OAuth2 Scope',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Flashing that freshly stamped hallway pass at the passenger-tracking desk, the intruder queries permanent subscriber identities and reads back the exact neighborhood station and tower currently serving each targeted commuter.',
        storyMappings: [
          {
            storyTerm: 'Freshly Stamped Hallway Pass',
            technicalTerm: 'NRF-Minted Bearer JWT Used on 5G Service-Based Interface',
            tone: 'amber',
          },
          {
            storyTerm: 'Passenger-Tracking Desk',
            technicalTerm: 'Unified Data Management (UDM, 3GPP TS 29.503 / 29.504)',
            tone: 'sky',
          },
          {
            storyTerm: 'Neighborhood Station & Tower',
            technicalTerm: 'Exposed SUPI/IMSI, Serving AMF GUAMI & gNodeB Tracking Area (TAI)',
            tone: 'rose',
          },
          {
            storyTerm: 'Desk Allowlist Enforcement',
            technicalTerm: 'GSMA FS.37 Policy Limiting UDM Queries to Allowlisted AMF/SMF Nodes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Meanwhile, at the international roaming checkpoint linking older and newer transit lines, signaling guards inspect cross-border authentication slips whose sender seal does not match the physical transport lane and drop the forged frames while linking them back to the internal tracking query.',
        storyMappings: [
          {
            storyTerm: 'International Roaming Checkpoint',
            technicalTerm: '4G/5G Interworking Boundary (DEA / SEPP Signaling Firewall)',
            tone: 'sky',
          },
          {
            storyTerm: 'Cross-Border Authentication Slips',
            technicalTerm: 'Diameter S6a AIR (Command Code 318) & IDR (Command Code 319)',
            tone: 'rose',
          },
          {
            storyTerm: 'Mismatched Sender Seal & Lane',
            technicalTerm: 'Origin-Host / Origin-Realm Mismatch Against Peer SCTP/IP Binding',
            tone: 'amber',
          },
          {
            storyTerm: 'Impossible Travel Speed Guard',
            technicalTerm: 'GSMA FS.19 Category 2 Velocity & Home-Network Location Drop Alert',
            tone: 'emerald',
          },
        ],
      },
    },
  };
