# Module 04 — Forensic Telemetry, Memory Maps, Topology Nodes & Sequence Alignment (`MOD-04`)

> **Module ID**: `MOD-04`  
> **Scope**: 6-Node Whiteboard Topology architecture, bidirectional sequence arrows (`#N.1→` / `⇠#N.2`), internal node sub-boards (`#N.1..#N.5`), synthetic telemetry safety rules, and SIEM/Sigma detection engineering.  
> **Parent Index**: [`/docs/standards/README.md`](./README.md) · **Enforced By**: `/lib/documentation-standards.ts` & `/lib/simulation-engine.test.ts`

---

## 1. Purpose & Core Philosophy

In **Attack Explorer**, prose narratives, 2D network diagrams, virtual memory layouts, and SIEM event logs are **not separate features**—they are four synchronized views of the exact same forensic timeline.

If a step guide mentions `PID 4892` connecting to `185.220.101.42:443`, that exact PID and IP:Port must appear on the diagram node card, on the animated sequence arrow, in the raw Sysmon Event ID 3 log, and in the Sigma detection rule.

---

## 2. 6-Node Whiteboard Topology & Zone Architecture Standard

Every scenario topology is organized across **4 canonical network/security zones** and **up to 6 primary nodes (`①..⑥`)**:

```
┌──────────────────┬──────────────────┬──────────────────────┬──────────────────────┐
│ ZONE 1 · WAN     │ ZONE 2 · DMZ     │ ZONE 3 · ACCESS VLAN │ ZONE 4 · CORE / SOC  │
│ External C2 /    │ Edge Firewall /  │ Target Workstation / │ Domain Controller /  │
│ Attacker Infra   │ VPN / Web Proxy  │ Compromised Process  │ Cloud API & SOC SIEM │
│                  │                  │                      │                      │
│ [Node ①]         │ [Node ②]         │ [Node ③] & [Node ④]  │ [Node ⑤] & [Node ⑥]  │
│ 185.220.101.42   │ 172.16.10.1      │ 10.10.4.15 (PIDs)    │ 10.10.0.5 + SIEM     │
└──────────────────┴──────────────────┴──────────────────────┴──────────────────────┘
```

### Mandatory Node & Flow Alignment Rules
1. **Circled Node Numbering (`Node ①` .. `Node ⑥`)**:
   - Every scenario stage and `diagramAlignment` narrative must reference the exact circled node numbers (`Node ①` .. `Node ⑥`) so the user can visually trace the step on the canvas.
2. **Bidirectional Sequence Arrows (`#N.1→` and `⇠#N.2`)**:
   - Every stage `N` models both the **Forward Action/Request (`#N.1→`)** (e.g., API call, exploit payload, LDAP query) and the **Return Response/Handle/Telemetry (`⇠#N.2`)** (e.g., returned `hProcess = 0x01C4`, `HTTP 200 OK`, `KRB_TGS_REP`, or SIEM alert).
3. **Internal Node Sub-Boards (`#N.1 .. #N.5`)**:
   - Expanding any main node (`①..⑥`) reveals its internal 5-node pipeline (`buildInternalNodeSubBoard`), mapping ingress, parser/dispatcher, memory/kernel state, persistence/execution, and forensic telemetry egress.

---

## 3. 100% Synthetic & De-Identified Telemetry Safety Standard

To ensure **Attack Explorer** remains 100% safe for defensive training and compliant with legal/security policies:

| Artifact Type | Mandatory Safe Synthetic Standard | Forbidden Content |
| :--- | :--- | :--- |
| **IPv4 Addresses** | Use RFC 1918 private subnets (`10.10.0.0/16`, `172.16.0.0/12`, `192.168.0.0/16`) for internal hosts and RFC 5737 / designated synthetic test blocks (`185.220.101.x`, `198.51.100.x`, `203.0.113.x`) for external C2 nodes. | Never use real victim organization IPs or private customer infrastructure. |
| **Hostnames & Domains** | Use `.corp.local`, `.internal`, `WKS-04`, `CORP-DC01`, or documented synthetic C2 domains (`badactor-dns.net`). | Never use real unredacted enterprise customer hostnames. |
| **Memory & Shellcode Hex** | Use benign educational header signatures (`4D 5A 90 00` MZ header, `B8 57 00 07 80 C3` AMSI return stub, `NOP` sleds) that illustrate structural offsets (`PEB+0x10`, `RCX`). | Never embed live weaponized exploit shellcode or active malware binaries. |

---

## 4. Forensic Log & Detection Rule Engineering Standard

1. **Raw Log Fidelity (`telemetry[].rawLog`)**:
   - Every `TelemetryEvent` must include a realistic `rawLog` string formatted in the authentic schema of its `source` (`Sysmon`, `Windows Security`, `PowerShell`, `Linux Auditd`, `Zeek`, `Suricata`, `AWS CloudTrail`, or `Kubernetes Audit`).
   - Every `TelemetryEvent` must populate `keyFields` (at least 3 key-value pairs) matching the exact values cited in the stage's `keySpecs`.
2. **Actionable Detection Rules (`scenario.detectionRule`)**:
   - Every scenario must include a complete, syntactically structured detection rule (`SIGMA`, `YARA`, `SURICATA`, `SPL`, or `KQL`) that triggers on the exact artifacts in `telemetry[]`, paired with a concrete `mitigation` paragraph naming the defensive control (e.g., Attack Surface Reduction rule GUID, `bcdedit` / GPO hardening, patch version, or session revocation command).

---

## 5. Verification Checklist (`MOD-04`)

- [ ] Do the PIDs, IP addresses, ports, and hex values in `stages[].description` match `stages[].keySpecs` and `telemetry[].keyFields`?
- [ ] Does `diagramAlignment` explicitly reference `Node ①..⑥` and bidirectional sequence numbers (`#N.1→` and `⇠#N.2`)?
- [ ] Are all IP addresses, hostnames, and user accounts 100% synthetic and de-identified?
- [ ] Does `detectionRule` provide both a concrete query/signature (`rule`) and an actionable defensive remediation (`mitigation`)?
