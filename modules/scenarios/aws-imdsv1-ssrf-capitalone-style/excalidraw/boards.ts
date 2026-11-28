import type { Section3DKey } from '@/lib/section-3d-registry';
import type {
  TechnicalBoardDescriptor,
  TechnicalBoardSkeleton,
} from '@/lib/section-excalidraw-registry';
import {
  ARROW_GAP,
  box,
  hArrow,
  hArrowLeft,
  note,
  sticky,
  title,
  vArrow,
} from '@/modules/scenarios/dfir-lsass-minidump-comsvcs-sysmon-eid10/excalidraw/helpers';

const PAL = {
  amber: '#d97706',
  amberFill: '#fef3c7',
  crimson: '#e11d48',
  crimsonFill: '#ffe4e6',
  sky: '#0284c7',
  skyFill: '#e0f2fe',
  emerald: '#059669',
  emeraldFill: '#d1fae5',
  muted: '#64748b',
} as const;

function makeOrthogonalBoard(cfg: {
  sectionKey: Section3DKey;
  boardBadge: string;
  title: string;
  subtitle: string;
  chalkHint: string;
  header: string;
  footer: string;
  p: string;
  r1: [
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
    { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] },
  ];
  a12: { cap: string; stroke: string };
  a23: { cap: string; stroke: string };
  a34: { cap: string; stroke: string };
  a45: { cap: string; stroke: string };
  r2Right: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  r2Mid: { id: string; label: string; stroke: string; fill: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
  stickyBox: { id: string; label: string; tip: TechnicalBoardDescriptor['tooltips'][string] };
}): TechnicalBoardDescriptor {
  const y1 = 92;
  const h1 = 122;
  const y2 = 308;
  const h2 = 128;
  const b1 = { x: 40, w: 242 };
  const b2 = { x: b1.x + b1.w + ARROW_GAP, w: 256 };
  const b3 = { x: b2.x + b2.w + ARROW_GAP, w: 252 };

  const tooltips: TechnicalBoardDescriptor['tooltips'] = {
    [cfg.r1[0].id]: cfg.r1[0].tip,
    [cfg.r1[1].id]: cfg.r1[1].tip,
    [cfg.r1[2].id]: cfg.r1[2].tip,
    [cfg.r2Right.id]: cfg.r2Right.tip,
    [cfg.r2Mid.id]: cfg.r2Mid.tip,
    [cfg.stickyBox.id]: cfg.stickyBox.tip,
  };

  const skeletons: TechnicalBoardSkeleton[] = [
    title(40, 12, cfg.header),
    box({ id: cfg.r1[0].id, x: b1.x, y: y1, w: b1.w, h: h1, label: cfg.r1[0].label, stroke: cfg.r1[0].stroke, fill: cfg.r1[0].fill }),
    ...hArrow({ id: `${cfg.p}-a1`, fromId: cfg.r1[0].id, toId: cfg.r1[1].id, fromRight: b1.x + b1.w, toLeft: b2.x, midY: y1 + h1 / 2, caption: cfg.a12.cap, stroke: cfg.a12.stroke }),
    box({ id: cfg.r1[1].id, x: b2.x, y: y1, w: b2.w, h: h1, label: cfg.r1[1].label, stroke: cfg.r1[1].stroke, fill: cfg.r1[1].fill }),
    ...hArrow({ id: `${cfg.p}-a2`, fromId: cfg.r1[1].id, toId: cfg.r1[2].id, fromRight: b2.x + b2.w, toLeft: b3.x, midY: y1 + h1 / 2, caption: cfg.a23.cap, stroke: cfg.a23.stroke }),
    box({ id: cfg.r1[2].id, x: b3.x, y: y1, w: b3.w, h: h1, label: cfg.r1[2].label, stroke: cfg.r1[2].stroke, fill: cfg.r1[2].fill }),
    ...vArrow({ id: `${cfg.p}-a3`, fromId: cfg.r1[2].id, toId: cfg.r2Right.id, midX: b3.x + b3.w / 2, fromBottom: y1 + h1, toTop: y2, caption: cfg.a34.cap, stroke: cfg.a34.stroke, captionOffsetX: 16 }),
    sticky({ id: cfg.stickyBox.id, x: 40, y: y2, w: 350, h: h2, label: cfg.stickyBox.label }),
    box({ id: cfg.r2Mid.id, x: b2.x, y: y2, w: b2.w, h: h2, label: cfg.r2Mid.label, stroke: cfg.r2Mid.stroke, fill: cfg.r2Mid.fill }),
    ...hArrowLeft({ id: `${cfg.p}-a4`, fromId: cfg.r2Right.id, toId: cfg.r2Mid.id, fromLeft: b3.x, toRight: b2.x + b2.w, midY: y2 + h2 / 2, caption: cfg.a45.cap, stroke: cfg.a45.stroke }),
    box({ id: cfg.r2Right.id, x: b3.x, y: y2, w: b3.w, h: h2, label: cfg.r2Right.label, stroke: cfg.r2Right.stroke, fill: cfg.r2Right.fill }),
    note(40, 464, cfg.footer, PAL.muted),
  ];

  return {
    scenarioId: 'aws-imdsv1-ssrf-capitalone-style',
    sectionKey: cfg.sectionKey,
    boardBadge: cfg.boardBadge,
    title: cfg.title,
    subtitle: cfg.subtitle,
    chalkHint: cfg.chalkHint,
    tooltips,
    skeletons,
  };
}

export const IMDS_TECHNICAL_BOARDS: Partial<Record<Section3DKey, TechnicalBoardDescriptor>> = {
  briefing: makeOrthogonalBoard({
    sectionKey: 'briefing',
    boardBadge: 'WHITEBOARD #0 · END-TO-END EC2 SSRF -> IMDSV1 -> S3 DFIR',
    title: 'T1552.005: Host-Header SSRF -> IMDSv1 STS -> Off-VPC S3 Sync -> IMDSv2 Lock',
    subtitle: 'Full cloud intrusion path from reverse-proxy pivot to GuardDuty OutsideAWS containment',
    chalkHint: 'Hover any chalk box for AWS IMDSv1/v2 headers, STS fields, and CloudTrail indicators.',
    header: 'AWS EC2 REVERSE-PROXY SSRF TO IMDSV1 & S3 EXFILTRATION (T1552.005)',
    footer: 'Primary Sources: AWS IMDSv2 Architecture, Unit 42 Cloud SSRF & MITRE ATT&CK T1552.005',
    p: 'imb',
    r1: [
      { id: 'imb-waf', label: 'ec2-waf-edge-01\nnginx PID 2418\nHost SSRF Pivot', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'api', title: 'Reverse Proxy Pivot', module: 'nginx proxy_pass', fields: [{ key: 'Header', value: 'Host: 169.254.169.254' }], explain: 'Honors unvalidated client Host header to dial link-local metadata IP.' } },
      { id: 'imb-imds', label: 'EC2 IMDSv1\n169.254.169.254:80\nUnauthenticated GET', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Metadata Service v1', module: 'Hypervisor Link-Local', fields: [{ key: 'Audit Gap', value: 'Zero CloudTrail Event' }], explain: 'Dispenses 6-hour temporary STS JSON credentials without a PUT session token.' } },
      { id: 'imb-s3', label: 'Amazon S3 Bucket\ncorp-credit-prod\nOff-VPC aws s3 sync', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Off-VPC S3 Drain', module: '198.51.100.88', fields: [{ key: 'Role', value: 'ISRM-WAF-Role' }], explain: 'Stolen EC2 instance STS token downloads Parquet archives directly outside AWS.' } },
    ],
    a12: { cap: 'GET /iam/creds/', stroke: PAL.amber },
    a23: { cap: 'STS ASIA5LAB...', stroke: PAL.crimson },
    a34: { cap: 'CloudTrail Alert', stroke: PAL.sky },
    a45: { cap: 'IMDSv2 + Revoke', stroke: PAL.emerald },
    r2Right: { id: 'imb-gd', label: 'GuardDuty SOC\nOutsideAWS Finding\nNo vpcEndpointId', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Off-AWS Replay Alert', module: 'AWS GuardDuty', fields: [{ key: 'Finding', value: 'InstanceCredentialExfiltration.OutsideAWS' }], explain: 'Detects EC2 instance-profile ARN authenticating from external IP space.' } },
    r2Mid: { id: 'imb-v2', label: 'IMDSv2 Lock\nHttpTokens=required\nHopLimit=1 -> 401', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Metadata Containment', module: 'ModifyInstanceMetadataOptions', fields: [{ key: 'HopLimit', value: '1 (Blocks Proxy)' }], explain: 'Requires PUT token with TTL=1 so reverse-proxy SSRF fails with HTTP 401.' } },
    stickyBox: { id: 'imb-note', label: 'CLOUD DFIR RULE:\nIMDS reads produce ZERO\nCloudTrail logs! Pair proxy\nlogs with GuardDuty OutsideAWS.', tip: { kind: 'note', title: 'Dual Visibility', module: 'Cloud SOC', fields: [{ key: 'Gap', value: 'Local link-local HTTP' }], explain: 'Proxy upstream logs catch the theft; CloudTrail catches off-VPC replay.' } },
  }),

  'step-1': makeOrthogonalBoard({
    sectionKey: 'step-1',
    boardBadge: 'WHITEBOARD #1 · REVERSE-PROXY HOST-HEADER SSRF PIVOT',
    title: 'T1190: Forged Host Header Drives nginx Into Link-Local 169.254.169.254',
    subtitle: 'Enumerating the attached EC2 IAM role name via unvalidated proxy_pass routing',
    chalkHint: 'Hover boxes for nginx upstream behavior, link-local routing, and Sigma detection.',
    header: 'STEP 1 · HOST-HEADER SSRF PIVOT TO LINK-LOCAL IMDSV1',
    footer: 'Reference: MITRE ATT&CK T1190 & Nginx Reverse-Proxy Upstream Allowlist Hardening',
    p: 'im1',
    r1: [
      { id: 'im1-ext', label: 'Attacker 198.51.100.88\nGET /latest/meta-data/\nHost: 169.254.169.254', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Forged Request', module: 'curl/8.4.0', fields: [{ key: 'Host', value: '169.254.169.254' }], explain: 'Crafts external HTTP request specifying AWS link-local IP in Host header.' } },
      { id: 'im1-ngx', label: 'ec2-waf-edge-01\nnginx PID 2418\nproxy_pass $http_host', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'api', title: 'Vulnerable Directive', module: 'nginx.conf', fields: [{ key: 'Flaw', value: 'Unvalidated $http_host' }], explain: 'Resolves client-supplied Host directly from inside the EC2 guest kernel.' } },
      { id: 'im1-meta', label: 'IMDSv1 Endpoint\n169.254.169.254:80\n200 ISRM-WAF-Role', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'Role Enumeration', module: 'IMDSv1', fields: [{ key: 'Body', value: 'ISRM-WAF-Role (13B)' }], explain: 'Echoes the attached instance-profile role name with zero authentication.' } },
    ],
    a12: { cap: 'Crafted Host', stroke: PAL.crimson },
    a23: { cap: 'Link-Local GET', stroke: PAL.amber },
    a34: { cap: 'Log Upstream IP', stroke: PAL.sky },
    a45: { cap: 'Enforce Allowlist', stroke: PAL.emerald },
    r2Right: { id: 'im1-log', label: 'Nginx Access Log\nupstream_addr=\n169.254.169.254:80', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Proxy Telemetry', module: 'PROXY-4001', fields: [{ key: 'Signal', value: 'upstream_addr=169.254.169.254' }], explain: 'Sole host-side log proving external request pivoted to EC2 metadata.' } },
    r2Mid: { id: 'im1-fix', label: 'Hardened WAF\nStatic Upstream Map\nDeny 169.254/16', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Proxy Egress Lock', module: 'Hardened Config', fields: [{ key: 'Fix', value: 'Strict upstream allowlist' }], explain: 'Eliminates dynamic Host routing and drops link-local egress from nginx.' } },
    stickyBox: { id: 'im1-note', label: 'WHY LINK-LOCAL WORKS:\n169.254.169.254 is unreachable\nfrom the Internet, but nginx\nsockets originate inside EC2.', tip: { kind: 'note', title: 'Trust Boundary', module: 'EC2 Networking', fields: [{ key: 'Scope', value: 'Host-local only' }], explain: 'SSRF converts an external HTTP caller into an internal EC2 caller.' } },
  }),

  'step-2': makeOrthogonalBoard({
    sectionKey: 'step-2',
    boardBadge: 'WHITEBOARD #2 · UNAUTHENTICATED IMDSV1 STS HARVEST',
    title: 'T1552.005: Single HTTP GET Harvests 6-Hour STS Credentials JSON',
    subtitle: 'Why legacy IMDSv1 dispenses live AccessKeyId, SecretAccessKey, and SessionToken',
    chalkHint: 'Hover boxes for STS JSON fields, CloudTrail blind spot, and KQL hunting query.',
    header: 'STEP 2 · IMDSV1 CREDENTIAL DISPENSE & CLOUDTRAIL VISIBILITY GAP',
    footer: 'Reference: AWS EC2 Instance Metadata Service Documentation & MITRE T1552.005',
    p: 'im2',
    r1: [
      { id: 'im2-req', label: 'Proxied GET #2\n/security-credentials/\nISRM-WAF-Role', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Role-Targeted GET', module: 'nginx -> IMDSv1', fields: [{ key: 'Method', value: 'Plain HTTP GET' }], explain: 'Requests live STS bundle using the role name discovered in Step #1.' } },
      { id: 'im2-sts', label: 'IMDSv1 JSON Body\nASIA5LABEXAMPLE9Q2W\n1,342 Bytes · 6h TTL', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'memory', title: 'STS Credential Bundle', module: 'AWS STS', fields: [{ key: 'Keys', value: 'AccessKey + Secret + Token' }], explain: 'Valid temporary credentials usable from anywhere unless restricted.' } },
      { id: 'im2-gap', label: 'CloudTrail Blind Spot\n0 Control-Plane Logs\nOn Local IMDS Read', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Zero CloudTrail Event', module: 'Hypervisor Channel', fields: [{ key: 'Metric', value: 'MetadataNoToken' }], explain: 'Metadata reads stay on the local host and never log into CloudTrail.' } },
    ],
    a12: { cap: 'No PUT Token', stroke: PAL.amber },
    a23: { cap: 'Silent Harvest', stroke: PAL.crimson },
    a34: { cap: 'Audit Metric', stroke: PAL.sky },
    a45: { cap: 'Require PUT', stroke: PAL.emerald },
    r2Right: { id: 'im2-kql', label: 'WebProxyLogs KQL\nStatus==200 &\nBytes > 800', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'KQL Proxy Hunt', module: 'PROXY-4002', fields: [{ key: 'Filter', value: 'UpstreamIp == 169.254.169.254' }], explain: 'Flags large JSON responses returned from the EC2 metadata endpoint.' } },
    r2Mid: { id: 'im2-v2', label: 'IMDSv2 Challenge\nPUT /latest/api/token\nRejects GET -> 401', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Two-Step Session', module: 'IMDSv2', fields: [{ key: 'Header', value: 'X-aws-ec2-metadata-token' }], explain: 'Simple GET SSRF cannot send custom PUT headers or retrieve session tokens.' } },
    stickyBox: { id: 'im2-note', label: 'CLOUDWATCH METRIC:\nTrack EC2 MetadataNoToken\nto find every host still using\nlegacy IMDSv1 before locking.', tip: { kind: 'note', title: 'Migration Telemetry', module: 'CloudWatch', fields: [{ key: 'Goal', value: 'MetadataNoToken == 0' }], explain: 'Confirms zero workloads rely on IMDSv1 prior to enforcing HttpTokens=required.' } },
  }),

  'step-3': makeOrthogonalBoard({
    sectionKey: 'step-3',
    boardBadge: 'WHITEBOARD #3 · OFF-VPC S3 DISCOVERY & BULK SYNC',
    title: 'T1530: Replaying Stolen STS Token Outside AWS to Drain S3 Buckets',
    subtitle: 'How over-privileged WAF roles and missing VPC conditions enable external aws s3 sync',
    chalkHint: 'Hover boxes for SigV4 replay, CloudTrail S3 Data Events, and aws:SourceVpce defense.',
    header: 'STEP 3 · OFF-VPC AWS S3 SYNC EXFILTRATION & CLOUDTRAIL EVIDENCE',
    footer: 'Reference: AWS CloudTrail S3 Data Events & MITRE ATT&CK T1530',
    p: 'im3',
    r1: [
      { id: 'im3-cli', label: 'External aws-cli\n198.51.100.88\nSigV4 Stolen STS', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'network', title: 'Off-VPC Replay', module: 'aws s3 sync', fields: [{ key: 'Source IP', value: '198.51.100.88' }], explain: 'Exports stolen AccessKeyId, SecretAccessKey, and SessionToken externally.' } },
      { id: 'im3-iam', label: 'ISRM-WAF-Role\nOver-Scoped Policy\ns3:List* & GetObject', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Excessive Privilege', module: 'IAM Instance Profile', fields: [{ key: 'Risk', value: 'Wildcard S3 read on WAF' }], explain: 'Edge proxy role violates least privilege by permitting production bucket reads.' } },
      { id: 'im3-s3', label: 'S3 Production Vault\ncorp-credit-prod\nParquet Archives', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Exfiltrated Objects', module: 's3:GetObject', fields: [{ key: 'Sample', value: '2025-q1-applicants.parquet' }], explain: 'Bulk object downloads execute directly over TLS 443 bypassing the WAF.' } },
    ],
    a12: { cap: 'SigV4 Auth', stroke: PAL.amber },
    a23: { cap: 'GetObject Bulk', stroke: PAL.crimson },
    a34: { cap: 'Data Event Log', stroke: PAL.sky },
    a45: { cap: 'Lock Bucket Policy', stroke: PAL.emerald },
    r2Right: { id: 'im3-ct', label: 'CloudTrail Data Log\nassumed-role/i-0a9f...\nNo vpcEndpointId', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'CloudTrail Anomaly', module: 'S3 Data Events', fields: [{ key: 'Missing', value: 'vpcEndpointId' }], explain: 'Instance ARN calling S3 from a non-AWS public IP triggers immediate Sigma alert.' } },
    r2Mid: { id: 'im3-vpce', label: 'S3 Bucket Policy\nRequire Condition:\naws:SourceVpce', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'VPC Perimeter Guard', module: 'S3 Policy', fields: [{ key: 'Effect', value: 'Deny off-VPC reads' }], explain: 'Denies S3 reads even with valid STS keys unless traffic originates inside VPC.' } },
    stickyBox: { id: 'im3-note', label: 'LEAST PRIVILEGE:\nAn edge WAF EC2 role should\nnever hold s3:ListAllMyBuckets\nor production data-lake reads.', tip: { kind: 'note', title: 'Blast Radius', module: 'IAM Design', fields: [{ key: 'Control', value: 'Scoped resource ARNs' }], explain: 'Tight IAM scoping turns an SSRF leak into a zero-exfil dead end.' } },
  }),

  'step-4': makeOrthogonalBoard({
    sectionKey: 'step-4',
    boardBadge: 'WHITEBOARD #4 · GUARDDUTY OUTSIDEAWS & IMDSV2 CONTAINMENT',
    title: 'T1552.005: OutsideAWS Detection, Session Revocation & HopLimit=1 Lock',
    subtitle: 'Automated incident response revoking leaked tokens and enforcing IMDSv2 fleet-wide',
    chalkHint: 'Hover boxes for GuardDuty finding anatomy, inline Deny-All revocation, and HopLimit=1.',
    header: 'STEP 4 · GUARDDUTY OUTSIDEAWS DETECTION & IMDSV2 HARDENING',
    footer: 'Reference: AWS GuardDuty Managed Findings & AWS Organizations IMDSv2 SCP',
    p: 'im4',
    r1: [
      { id: 'im4-gd', label: 'AWS GuardDuty\nOutsideAWS Finding\nSeverity 8.0 HIGH', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Managed Finding', module: 'GuardDuty', fields: [{ key: 'Type', value: 'InstanceCredentialExfiltration.OutsideAWS' }], explain: 'Automatically detects EC2 instance credentials authenticating outside AWS IP ranges.' } },
      { id: 'im4-rev', label: 'IAM Session Revoke\nInline Deny-All Policy\nInvalidate ASIA5LAB', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Instant Revocation', module: 'EventBridge SOAR', fields: [{ key: 'Condition', value: 'aws:TokenIssueTime' }], explain: 'Invalidates all prior temporary STS tokens issued to ISRM-WAF-Role immediately.' } },
      { id: 'im4-v2', label: 'EC2 IMDSv2 Policy\nHttpTokens=required\nHopLimit=1', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Protocol Hardening', module: 'ModifyInstanceMetadataOptions', fields: [{ key: 'Result', value: 'HTTP 401 on GET' }], explain: 'Requires PUT token and sets IP TTL=1 so token responses drop at proxy hops.' } },
    ],
    a12: { cap: 'EventBridge SOAR', stroke: PAL.sky },
    a23: { cap: 'Enforce IMDSv2', stroke: PAL.emerald },
    a34: { cap: 'Org-Wide SCP', stroke: PAL.emerald },
    a45: { cap: 'Verify 401', stroke: PAL.sky },
    r2Right: { id: 'im4-scp', label: 'AWS Org SCP\nDeny RunInstances\nWithout IMDSv2', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Preventive Guardrail', module: 'Organizations SCP', fields: [{ key: 'Key', value: 'ec2:MetadataHttpTokens' }], explain: 'Prevents any future EC2 deployment from launching with legacy IMDSv1 enabled.' } },
    r2Mid: { id: 'im4-401', label: 'SSRF Neutralized\nGET /meta-data/\n-> 401 Unauthorized', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Verified Containment', module: 'Regression Check', fields: [{ key: 'Status', value: '401 Denied' }], explain: 'Confirms reverse-proxy SSRF can no longer extract IAM credentials.' } },
    stickyBox: { id: 'im4-note', label: 'WHY HOPLIMIT=1 MATTERS:\nSetting HopLimit=1 forces the\nIP TTL of PUT token replies to 1\nso proxies cannot forward them.', tip: { kind: 'note', title: 'TTL Physics', module: 'IPv4 Routing', fields: [{ key: 'TTL', value: '1 Hop Max' }], explain: 'Stops even PUT-capable SSRF proxies and container NAT layers from stealing tokens.' } },
  }),

  'memory-forensics': makeOrthogonalBoard({
    sectionKey: 'memory-forensics',
    boardBadge: 'WHITEBOARD #M · MEMORY & PROTOCOL DIFF (IMDSV1 VS IMDSV2)',
    title: 'Forensic Comparison: Vulnerable IMDSv1 Proxy Buffer vs Hardened IMDSv2',
    subtitle: 'Side-by-side memory and header state inside nginx PID 2418 and EC2 metadata interface',
    chalkHint: 'Hover boxes to compare raw leaked STS JSON buffers against IMDSv2 401 rejection.',
    header: 'MEMORY & PROTOCOL FORENSICS · IMDSV1 LEAK BUFFER VS IMDSV2 GUARD',
    footer: 'Forensic Artifact Reference: ec2-waf-edge-01 nginx PID 2418 & AWS Metadata Protocol',
    p: 'imm',
    r1: [
      { id: 'imm-v1', label: 'IMDSv1 Buffer (RW-)\n0x7F8A10400000\nRaw STS JSON Leak', stroke: PAL.crimson, fill: PAL.crimsonFill, tip: { kind: 'memory', title: 'Leaked Proxy Buffer', module: 'nginx PID 2418', fields: [{ key: 'Bytes', value: '1,342B STS JSON' }], explain: 'Unauthenticated GET response buffered in RAM and echoed straight to attacker.' } },
      { id: 'imm-diff', label: 'Protocol Diff Gate\nMissing X-aws-ec2-\nmetadata-token', stroke: PAL.amber, fill: PAL.amberFill, tip: { kind: 'api', title: 'Auth Boundary', module: 'Hypervisor Metadata', fields: [{ key: 'Check', value: 'PUT Token + TTL=1' }], explain: 'Distinguishes stateless IMDSv1 GET vulnerability from session-bound IMDSv2.' } },
      { id: 'imm-v2', label: 'IMDSv2 Guard (R--)\n0x7F8A10424000\nHTTP 401 Denied', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'memory', title: 'Hardened State', module: 'HttpTokens=required', fields: [{ key: 'Response', value: '401 Unauthorized' }], explain: 'Zero STS secret bytes ever enter the nginx upstream response buffer.' } },
    ],
    a12: { cap: 'Inspect Headers', stroke: PAL.amber },
    a23: { cap: 'Enforce IMDSv2', stroke: PAL.emerald },
    a34: { cap: 'Verify Zero Leak', stroke: PAL.sky },
    a45: { cap: 'Audit CloudTrail', stroke: PAL.sky },
    r2Right: { id: 'imm-sts', label: 'STS Replay State\nASIA5LABEXAMPLE9Q2W\nRevoked via Policy', stroke: PAL.sky, fill: PAL.skyFill, tip: { kind: 'detect', title: 'Revoked Token', module: 'IAM Policy', fields: [{ key: 'Action', value: 'Deny Prior Sessions' }], explain: 'Ensures previously exfiltrated tokens immediately fail SigV4 authorization.' } },
    r2Mid: { id: 'imm-soc', label: 'Forensic Closure\nMetadataNoToken=0\nSourceVpce Enforced', stroke: PAL.emerald, fill: PAL.emeraldFill, tip: { kind: 'detect', title: 'Hardened Posture', module: 'Cloud Governance', fields: [{ key: 'Controls', value: 'IMDSv2 + SCP + VPCE' }], explain: 'Closes both the metadata credential leak and off-VPC S3 replay path.' } },
    stickyBox: { id: 'imm-note', label: 'MEMORY ARTIFACT:\nWhen IMDSv1 is active, the full\nSecretAccessKey lives in nginx\nupstream heap buffers in plaintext.', tip: { kind: 'note', title: 'RAM Inspection', module: 'Forensic Triage', fields: [{ key: 'Marker', value: 'ASIA5LAB / SessionToken' }], explain: 'IMDSv2 prevents those secret bytes from ever crossing the proxy boundary.' } },
  }),
};
