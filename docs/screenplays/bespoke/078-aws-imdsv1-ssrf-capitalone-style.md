# Screenplay #078 — EC2 Reverse-Proxy SSRF to IMDSv1 IAM Role & S3 Exfiltration (`aws-imdsv1-ssrf-capitalone-style`)

- **Scenario ID**: `aws-imdsv1-ssrf-capitalone-style`
- **Category**: `CLOUD_SAAS`
- **MITRE ATT&CK**: `T1190` (Exploit Public-Facing Application) · `T1552.005` (Cloud Instance Metadata API) · `T1530` (Data from Cloud Storage)
- **Primary Sources**: AWS EC2 Instance Metadata Service v2 (IMDSv2) Security Architecture, Palo Alto Networks Unit 42 Cloud SSRF & Credential Replay Analysis, MITRE ATT&CK T1552.005 & AWS CloudTrail GuardDuty `UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS`.

## Bespoke Cinematic Universe
**Cloud Hotel Concierge Desk & Rooftop Key-Card Vault**
- **Floor & Architecture**: Warm obsidian marble hotel atrium floor (`#141927`) with brass-trimmed concierge reception counter on the left, an internal bellhop brass pneumatic intercom kiosk in the center (link-local room-service key-card dispenser only reachable from inside the lobby), a crimson outside-street courier booth at the glass entrance, a golden rooftop safe-deposit vault gallery on the right, and an emerald turnstile token-challenge gate (`#10B981`).
- **Story-to-Spec Mapping**:
  - *Glass Lobby Reception Concierge* -> Public-facing EC2 reverse-proxy / WAF appliance (`mod_proxy` / Nginx on `ec2-waf-edge-01`) forwarding crafted client requests.
  - *Forged Room-Service Slip With Internal Desk Address* -> Crafted HTTP `Host` / URL parameter triggering Server-Side Request Forgery (`SSRF`) toward `169.254.169.254`.
  - *Lobby-Only Brass Key-Card Dispenser* -> AWS Instance Metadata Service v1 (`IMDSv1`) listening on non-routable link-local `169.254.169.254:80` with zero session-token challenge.
  - *Stamped Brass Master Keycard Envelope* -> Short-lived AWS STS temporary credentials (`AccessKeyId`, `SecretAccessKey`, `SessionToken`) for over-privileged `ISRM-WAF-Role`.
  - *Rooftop Safe-Deposit Locker Room* -> Private corporate Amazon S3 buckets (`s3://corp-credit-applications-prod`) queried directly from an off-VPC external IP via `aws s3 sync`.
  - *Emerald Two-Step Turnstile & Security Desk Alarm* -> AWS GuardDuty `InstanceCredentialExfiltration.OutsideAWS` alert plus enforced IMDSv2 (`HttpTokens=required`, `HttpPutResponseHopLimit=1`).

## 5-Act 3D Briefing Choreography (20.0s Loop)
1. **Act 1 (`0.0s – 4.2s`) — Forged Slip at the Front Desk**: An outside courier slides a crimson room-service slip across the glass concierge counter, tricking the lobby clerk into dialing the internal brass kiosk.
2. **Act 2 (`4.2s – 8.8s`) — Unchallenged Key-Card Dispense**: Cutaway lobby window opens over the brass intercom kiosk as it dispenses a glowing golden master keycard envelope without asking for a signed challenge pass.
3. **Act 3 (`8.8s – 13.8s`) — Rooftop Vault Drain**: The outside courier carries the cloned golden master keycard straight to the rooftop safe-deposit gallery, unlocking rows of archive drawers and lifting crimson data crates off-property.
4. **Act 4 (`13.8s – 17.0s`) — Off-Property Keycard Alarm**: The hotel security desk radar flags the lobby keycard being swiped from a street address outside the building perimeter (`GuardDuty OutsideAWS` + `CloudTrail ListObjectsV2`).
5. **Act 5 (`17.0s – 20.0s`) — Emerald IMDSv2 Challenge Gate**: Engineers drop an emerald two-step challenge turnstile over the brass key-card kiosk (`PUT /latest/api/token`, `HopLimit = 1`), snapping shut every simple front-desk relay.

## Media Coverage Matrix
- **6 Bespoke 3D Scenes**: `imds-concierge-briefing`, `imds-step1-ssrf`, `imds-step2-creds`, `imds-step3-s3sync`, `imds-step4-imdsv2`, `imds-memory-tokendiff`
- **5 Bespoke 2D SVG+GSAP Silent-Lecture Clips**: `ImdsStep1SsrfClip`, `ImdsStep2CredsClip`, `ImdsStep3S3SyncClip`, `ImdsStep4Imdsv2Clip`, `ImdsMemoryTokenDiffClip`
- **6 Strictly Orthogonal Excalidraw Whiteboards**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
