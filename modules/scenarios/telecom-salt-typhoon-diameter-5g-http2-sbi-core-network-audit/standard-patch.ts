import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
