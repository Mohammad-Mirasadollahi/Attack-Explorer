import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for CLOUD_SAAS (25 scenarios).
 */
export const CLOUD_SAAS_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "aws-cognito-iam-passrole-privesc": {
    "briefing": {
      "scenarioId": "aws-cognito-iam-passrole-privesc",
      "sectionKey": "briefing",
      "sceneKind": "cld-aws-passrole-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1098.001",
      "title": "IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail… — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud office where a junior clerk is forbidden from unlocking the executive safe directly, yet holds two seemingly harmless permissions: hiring a temporary robot worker and handing that robot any spare manager badge off the wall. The junior clerk hires a one-line robot worker, hangs a senior manager badge around the robot neck, tells the robot to promote the junior clerk straight to Chief Administrator, and then switches off the hallway security cameras.",
      "technicalCue": "PERSISTENCE: IAM PASSROLE & MALICIOUS LAMBDA FUNCTION CREATION -> PERSISTENCE: LAMBDA INVOCATION & ADMINISTRATORACCESS POLICY ATTACHMENT -> DEFENSE EVASION: CLOUDTRAIL STOPLOGGING DEFENSE EVASION",
      "storyMappings": [
        {
          "storyTerm": "Hiring a robot worker and hanging a senior manager badge on it",
          "technicalTerm": "Chaining iam:PassRole with lambda:CreateFunction20150331 using an admin role",
          "tone": "amber"
        },
        {
          "storyTerm": "Telling the robot to promote the junior clerk to Chief Administrator",
          "technicalTerm": "Invoking Lambda boto3 code to call iam:AttachUserPolicy (AdministratorAccess)",
          "tone": "sky"
        },
        {
          "storyTerm": "Switching off the hallway security cameras",
          "technicalTerm": "Executing cloudtrail:StopLogging or DeleteTrail to blind cloud auditing (T1562.008)",
          "tone": "rose"
        },
        {
          "storyTerm": "Two seemingly harmless permissions creating a master key",
          "technicalTerm": "Classic AWS IAM privilege escalation path via PassRole + Lambda execution",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-aws-passrole-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hiring a robot worker and hanging a…",
          "subtitle": "Chaining iam:PassRole with lambda:CreateFunction20150331 using…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-passrole-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Telling the robot to promote the junior…",
          "subtitle": "Invoking Lambda boto3 code to call iam:AttachUserPolicy…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tiny",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "IAM PASSROLE & MALICIOUS LAMBDA FUNCTION CREATION",
          "storyExcerpt": "Noticing they hold both permission to deploy a tiny automated worker and permission to assign an existing senior role badge to that worker, the low-privileged user creates a fresh cloud script and hangs…",
          "technicalParallel": "Why does AWS require iam:PassRole? Because compute services like Lambda, EC2, ECS, and Glue execute code using the IAM Role attached to them; if iam:PassRole is granted with a wildcard (\"*\"), any user…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Use Walk",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "LAMBDA INVOCATION & ADMINISTRATORACCESS POLICY ATTACHMENT",
          "storyExcerpt": "Pressing the start button on the newly created robot worker, the clerk watches the robot use its borrowed manager badge to walk straight into the identity room and pin a permanent Chief Administrator…",
          "technicalParallel": "In CloudTrail, the AttachUserPolicy call appears as originating from AssumedRole/LambdaAdminDeploymentRole/metrics-health-sync-tmp rather than directly from the ci-dev-deployer IAM user.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Now Off",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "CLOUDTRAIL STOPLOGGING DEFENSE EVASION",
          "storyExcerpt": "Now wearing the freshly pinned Chief Administrator badge, the intruder rushes straight to the cloud security booth and flips the master recording switch to off so future vault raids vanish from the…",
          "technicalParallel": "Organizations prevent even full account administrators from blinding audit logs by configuring an AWS Organizations Trail in a separate management account and applying a Service Control Policy (SCP) that…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Robot Worker",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Badge Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Manager Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "aws-cognito-iam-passrole-privesc",
      "sectionKey": "step-1",
      "sceneKind": "cld-aws-passrole-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Passing a Privileged IAM Role (iam:PassRole) to a Newly Created AWS Lambda Function (T1098.001)",
      "storyCue": "Noticing they hold both permission to deploy a tiny automated worker and permission to assign an existing senior role badge to that worker, the low-privileged user creates a fresh cloud script and hangs a powerful administrative role right around its neck.",
      "technicalCue": "T1098.001 · PERSISTENCE — Using the compromised ci-dev-deployer access key, the attacker runs Pacu’s iam__privesc_scan module, discovers that the user policy permits iam:PassRole on Resource: \"*\" alongside…",
      "storyMappings": [
        {
          "storyTerm": "Tiny automated worker deployed on demand",
          "technicalTerm": "Newly created AWS Lambda function via lambda:CreateFunction20150331",
          "tone": "amber"
        },
        {
          "storyTerm": "Hanging a powerful administrative role around its neck",
          "technicalTerm": "iam:PassRole assigning an administrative or deployment IAM role to the Lambda",
          "tone": "sky"
        },
        {
          "storyTerm": "Junior clerk acting indirectly",
          "technicalTerm": "Low-privileged IAM user lacking direct iam:AttachUserPolicy rights",
          "tone": "rose"
        },
        {
          "storyTerm": "Cloud ledger recording the role handoff",
          "technicalTerm": "AWS CloudTrail CreateFunction20150331 logging requestParameters.role",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-passrole-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Tiny automated worker deployed on demand",
          "subtitle": "Newly created AWS Lambda function via…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-passrole-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Hanging a powerful administrative role…",
          "subtitle": "iam:PassRole assigning an administrative or deployment IAM…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tiny",
          "stageTag": "STEP 01 · SETUP",
          "title": "Tiny automated worker deployed on demand",
          "storyExcerpt": "Noticing they hold both permission to deploy a tiny automated worker and permission to assign an existing senior role badge to that worker, the low-privileged user creates a fresh cloud script…",
          "technicalParallel": "Why does AWS require iam:PassRole? Because compute services like Lambda, EC2, ECS, and Glue execute code using the IAM Role attached to them; if iam:PassRole is granted with a wildcard (\"*\"), any user…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Role Neck",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Hanging a powerful administrative role around its neck",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hanging a powerful administrative role around its neck to advance toward junior clerk acting indirectly.",
          "technicalParallel": "Using the compromised ci-dev-deployer access key, the attacker runs Pacu’s iam__privesc_scan module, discovers that the user policy permits iam:PassRole on Resource: \"*\" alongside lambda:CreateFunction…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Role",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Cloud ledger recording the role handoff",
          "storyExcerpt": "Behind the scenes, cloud ledger recording the role handoff captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on AWS CloudTrail CreateFunction20150331 events (immutable API logs capturing serverless deployments) whenever requestParameters.role assigns a high-privilege administrative or deployment IAM role…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Robot Worker",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Badge Kiosk",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Manager Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "step-2": {
      "scenarioId": "aws-cognito-iam-passrole-privesc",
      "sectionKey": "step-2",
      "sceneKind": "cld-aws-passrole-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Invoking the Lambda Function to Attach AdministratorAccess via boto3 (T1098.003)",
      "storyCue": "Pressing the start button on the newly created robot worker, the clerk watches the robot use its borrowed manager badge to walk straight into the identity room and pin a permanent Chief Administrator ribbon onto the clerk own account.",
      "technicalCue": "T1098.003 · PERSISTENCE — The attacker triggers the function via aws lambda invoke --function-name metrics-health-sync-tmp.",
      "storyMappings": [
        {
          "storyTerm": "Pressing the start button on the robot worker",
          "technicalTerm": "Calling lambda:InvokeFunction to run the embedded Python boto3 escalation script",
          "tone": "amber"
        },
        {
          "storyTerm": "Pinning a permanent Chief Administrator ribbon onto the clerk",
          "technicalTerm": "Lambda role calling iam:AttachUserPolicy with arn:aws:iam::aws:policy/AdministratorAccess",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated cloud watchdog sounding the alarm",
          "technicalTerm": "AWS GuardDuty finding PrivilegeEscalation:IAMUser/AdministrativePermissions",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent full-account control achieved",
          "technicalTerm": "Original low-privileged user now holding unrestricted AWS AdministratorAccess",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-passrole-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pressing the start button on the robot…",
          "subtitle": "Calling lambda:InvokeFunction to run the embedded Python boto3…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-passrole-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Pinning a permanent Chief Administrator…",
          "subtitle": "Lambda role calling iam:AttachUserPolicy with…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Use Walk",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pressing the start button on the robot worker",
          "storyExcerpt": "Pressing the start button on the newly created robot worker, the clerk watches the robot use its borrowed manager badge to walk straight into the identity room and pin a permanent Chief…",
          "technicalParallel": "In CloudTrail, the AttachUserPolicy call appears as originating from AssumedRole/LambdaAdminDeploymentRole/metrics-health-sync-tmp rather than directly from the ci-dev-deployer IAM user.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Pinning a permanent Chief Administrator ribbon onto…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses pinning a permanent chief administrator ribbon onto the clerk to advance toward automated cloud watchdog sounding the alarm.",
          "technicalParallel": "The attacker triggers the function via aws lambda invoke --function-name metrics-health-sync-tmp.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full-account",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Permanent full-account control achieved",
          "storyExcerpt": "Behind the scenes, permanent full-account control achieved captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor AWS GuardDuty PrivilegeEscalation:IAMUser/AdministrativePermissions findings alongside CloudTrail AttachUserPolicy events (which track IAM permission grants) where policyArn ends in…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Robot Worker",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Badge Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Manager Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.003"
    },
    "step-3": {
      "scenarioId": "aws-cognito-iam-passrole-privesc",
      "sectionKey": "step-3",
      "sceneKind": "cld-aws-passrole-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Disabling AWS CloudTrail Auditing via cloudtrail:StopLogging (T1562.008)",
      "storyCue": "Now wearing the freshly pinned Chief Administrator badge, the intruder rushes straight to the cloud security booth and flips the master recording switch to off so future vault raids vanish from the central diary.",
      "technicalCue": "T1562.008 · DEFENSE EVASION — To conceal follow-on data theft or resource creation, the Lambda payload (or the newly elevated ci-dev-deployer user) calls boto3.client(\"cloudtrail\").stop_logging(Name=\"org-audit-trail\")…",
      "storyMappings": [
        {
          "storyTerm": "Cloud security booth master recording switch",
          "technicalTerm": "AWS CloudTrail audit trail recording account-wide API calls",
          "tone": "amber"
        },
        {
          "storyTerm": "Flipping the recording switch to off",
          "technicalTerm": "Calling cloudtrail:StopLogging or cloudtrail:DeleteTrail (MITRE T1562.008)",
          "tone": "sky"
        },
        {
          "storyTerm": "Dedicated stealth alarm catching the blackout",
          "technicalTerm": "AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alert",
          "tone": "rose"
        },
        {
          "storyTerm": "Preventing anyone from touching the switch",
          "technicalTerm": "AWS Organizations Service Control Policy (SCP) denying StopLogging account-wide",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-passrole-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Cloud security booth master recording…",
          "subtitle": "AWS CloudTrail audit trail recording account-wide API calls",
          "tone": "amber"
        },
        {
          "id": "cld-aws-passrole-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Flipping the recording switch to off",
          "subtitle": "Calling cloudtrail:StopLogging or cloudtrail:DeleteTrail…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Off",
          "stageTag": "STEP 03 · SETUP",
          "title": "Cloud security booth master recording switch",
          "storyExcerpt": "Now wearing the freshly pinned Chief Administrator badge, the intruder rushes straight to the cloud security booth and flips the master recording switch to off so future vault raids vanish from…",
          "technicalParallel": "Organizations prevent even full account administrators from blinding audit logs by configuring an AWS Organizations Trail in a separate management account and applying a Service Control Policy (SCP) that…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Off",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Flipping the recording switch to off",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flipping the recording switch to off to advance toward dedicated stealth alarm catching the blackout.",
          "technicalParallel": "To conceal follow-on data theft or resource creation, the Lambda payload (or the newly elevated ci-dev-deployer user) calls boto3.client(\"cloudtrail\").stop_logging(Name=\"org-audit-trail\") (halting…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Now Off",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Preventing anyone from touching the switch",
          "storyExcerpt": "Behind the scenes, preventing anyone from touching the switch captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Configure real-time CloudWatch EventBridge alarms and AWS GuardDuty Stealth:IAMUser/CloudTrailLoggingDisabled alerts on any CloudTrail eventName matching StopLogging or DeleteTrail (which indicate…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Robot Worker",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Badge Kiosk",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Manager Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.008"
    },
    "memory-forensics": {
      "scenarioId": "aws-cognito-iam-passrole-privesc",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-aws-passrole-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1098.001",
      "title": "IAM PassRole + Lambda CreateFunction Privilege Escalation & CloudTrail… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of robot worker beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: python3.12 (Lambda Runtime) (/var/task/lambda_function.py (Bytecode) [R--])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of python3.12 (Lambda Runtime)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F8810200000 (R--, 16 KB) · /var/task/lambda_function.py (Bytecode)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against python3.12 (Lambda Runtime) (PID 1)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Uploaded Lambda Python handler executing IAM privilege escalation and CloudTrail blinding.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-passrole-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of python3.12…",
          "tone": "sky"
        },
        {
          "id": "cld-aws-passrole-memory-xray-right",
          "tag": "LIVE MEMORY · R--",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F8810200000 (R--, 16 KB) · /var/task/lambda_function.py…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline python3.12 (Lambda Runtime) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F8810200000 (R--, 16 KB) containing /var/task/lambda_function.py (Bytecode).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 1 confirms injected region: Uploaded Lambda Python handler executing IAM privilege escalation and CloudTrail blinding.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "aws-imdsv1-ssrf-capitalone-style": {
    "briefing": {
      "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
      "sectionKey": "briefing",
      "sceneKind": "cld-aws-imdsv1-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3… — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud office building whose public front-desk courier obediently fetches any internal hallway address written on a visitor slip. A clever visitor writes down the secret internal key-box address sitting inside the lobby wall, tricks the front-desk courier into walking over and reading aloud the building temporary master keycard from that unguarded box, and then walks straight to the company off-site storage warehouse to haul out every customer crate.",
      "technicalCue": "INITIAL ACCESS: SSRF INJECTION TO LINK-LOCAL IMDSV1 ROLE DISCOVERY -> CREDENTIAL ACCESS: EXTRACTION OF TEMPORARY AWS STS ROLE CREDENTIALS (ASIA...) -> EXFIL & IMPACT: OFF-CLOUD CREDENTIAL REPLAY & S3 BUCKET SYNC EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Front-desk courier fetching any internal address on a visitor slip",
          "technicalTerm": "Reverse-proxy Server-Side Request Forgery (SSRF) reaching link-local 169.254.169.254",
          "tone": "amber"
        },
        {
          "storyTerm": "Unguarded internal key-box sitting inside the lobby wall",
          "technicalTerm": "AWS EC2 Instance Metadata Service v1 (IMDSv1) requiring no session header token",
          "tone": "sky"
        },
        {
          "storyTerm": "Temporary master keycard read aloud from the box",
          "technicalTerm": "Temporary AWS STS IAM role credentials (ASIA... AccessKeyId, Secret, Token)",
          "tone": "rose"
        },
        {
          "storyTerm": "Hauling customer crates out of the off-site warehouse",
          "technicalTerm": "Replaying stolen EC2 role keys from an external IP via aws s3 sync (T1530)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-aws-imdsv1-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front-desk courier fetching any internal…",
          "subtitle": "Reverse-proxy Server-Side Request Forgery (SSRF) reaching…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-imdsv1-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unguarded internal key-box sitting…",
          "subtitle": "AWS EC2 Instance Metadata Service v1 (IMDSv1) requiring no…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Any Slip",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SSRF INJECTION TO LINK-LOCAL IMDSV1 ROLE DISCOVERY",
          "storyExcerpt": "Approaching the exterior web proxy window, the visitor slips an internal-only wall address into a URL box. Because the proxy fails to check whether the requested address sits inside the building own…",
          "technicalParallel": "Because 169.254.169.254 is a non-routable link-local IP (RFC 3927) answered directly by the AWS Nitro hypervisor on the local virtual network interface, external firewalls cannot see or block traffic to…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Role",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "EXTRACTION OF TEMPORARY AWS STS ROLE CREDENTIALS (ASIA...)",
          "storyExcerpt": "Learning the exact name of the server attached guard role from the panel, the visitor sends one more proxied slip asking for the role security drawer and receives a crisp JSON bundle containing the…",
          "technicalParallel": "Why does IMDSv2 stop this attack? Because IMDSv2 requires the client to first send an HTTP PUT request with a custom X-aws-ec2-metadata-token-ttl-seconds header to obtain a secret token, and then pass…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Read Box",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "OFF-CLOUD CREDENTIAL REPLAY & S3 BUCKET SYNC EXFILTRATION",
          "storyExcerpt": "Loading the stolen temporary keycard onto their own computer far outside the cloud estate, the intruder dials the company cloud storage vault directly and mirrors gigabytes of sensitive buckets before…",
          "technicalParallel": "Even if an attacker steals an EC2 IAM role’s STS token, defenders can render the stolen token useless outside the VPC by attaching an aws:SourceVpce or aws:VpcSourceIp condition to the IAM role policy.",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lobby Key-Box",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Storage Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Temp Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
      "sectionKey": "step-1",
      "sceneKind": "cld-aws-imdsv1-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Exploiting Server-Side Request Forgery (SSRF) to Query Link-Local 169.254.169.254 (T1190)",
      "storyCue": "Approaching the exterior web proxy window, the visitor slips an internal-only wall address into a URL box. Because the proxy fails to check whether the requested address sits inside the building own private wall, it dutifully queries the unguarded internal information panel.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sends an HTTP GET request to a URL-fetching endpoint on the EC2 web server (/api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/) (exploiting…",
      "storyMappings": [
        {
          "storyTerm": "Exterior web proxy window",
          "technicalTerm": "Misconfigured EC2 reverse proxy or web application vulnerable to SSRF",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal-only wall address written on the slip",
          "technicalTerm": "Link-local AWS metadata address http://169.254.169.254/latest/meta-data/",
          "tone": "sky"
        },
        {
          "storyTerm": "Unguarded information panel lacking a token check",
          "technicalTerm": "IMDSv1 accepting simple HTTP GET requests without an IMDSv2 PUT session token",
          "tone": "rose"
        },
        {
          "storyTerm": "Guard counter catching tokenless panel visits",
          "technicalTerm": "Suricata SID 2028910 and AWS CloudWatch MetadataNoToken metric > 0",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-imdsv1-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Exterior web proxy window",
          "subtitle": "Misconfigured EC2 reverse proxy or web application vulnerable…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-imdsv1-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Internal-only wall address written on…",
          "subtitle": "Link-local AWS metadata address…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Wall",
          "stageTag": "STEP 01 · SETUP",
          "title": "Exterior web proxy window",
          "storyExcerpt": "Approaching the exterior web proxy window, the visitor slips an internal-only wall address into a URL box.",
          "technicalParallel": "Because 169.254.169.254 is a non-routable link-local IP (RFC 3927) answered directly by the AWS Nitro hypervisor on the local virtual network interface, external firewalls cannot see or block traffic to…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wall Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Internal-only wall address written on the slip",
          "storyExcerpt": "Because the proxy fails to check whether the requested address sits inside the building own private wall, it dutifully queries the unguarded internal information panel.",
          "technicalParallel": "The attacker sends an HTTP GET request to a URL-fetching endpoint on the EC2 web server (/api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/) (exploiting…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Guard counter catching tokenless panel visits",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across guard counter catching tokenless panel visits while locking down unguarded information panel lacking a token check.",
          "technicalParallel": "Monitor perimeter IDS rules such as Suricata SID 2028910 (alerting on incoming HTTP parameters containing 169.254.169.254) alongside the AWS CloudWatch MetadataNoToken metric (which counts every…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lobby Key-Box",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Storage Silos",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Temp Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
      "sectionKey": "step-2",
      "sceneKind": "cld-aws-imdsv1-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Dumping Temporary AWS STS Credentials (ASIA...) from IMDSv1 (T1552.005)",
      "storyCue": "Learning the exact name of the server attached guard role from the panel, the visitor sends one more proxied slip asking for the role security drawer and receives a crisp JSON bundle containing the server live temporary keycard, secret passcode, and session stamp.",
      "technicalCue": "T1552.005 · CREDENTIAL ACCESS — Appending the discovered role name to the SSRF URL (/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole) causes the IMDSv1 endpoint to return a JSON object containing temporary AWS…",
      "storyMappings": [
        {
          "storyTerm": "Server attached guard role drawer",
          "technicalTerm": "/latest/meta-data/iam/security-credentials/<role-name> IMDSv1 endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Live temporary keycard, passcode, and session stamp",
          "technicalTerm": "Short-lived AWS STS AccessKeyId (ASIA...), SecretAccessKey, and SessionToken",
          "tone": "sky"
        },
        {
          "storyTerm": "Crisp bundle returned straight through the front window",
          "technicalTerm": "1.3 KB JSON credential payload leaked inside the reverse proxy HTTP response",
          "tone": "rose"
        },
        {
          "storyTerm": "Why IMDSv2 blocks this trick",
          "technicalTerm": "IMDSv2 requires an HTTP PUT with X-aws-ec2-metadata-token-ttl-seconds that simple GET SSRF cannot send",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-imdsv1-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Server attached guard role drawer",
          "subtitle": "/latest/meta-data/iam/security-credentials/<role-name> IMDSv1…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-imdsv1-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Live temporary keycard, passcode, and…",
          "subtitle": "Short-lived AWS STS AccessKeyId (ASIA...), SecretAccessKey…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Role",
          "stageTag": "STEP 02 · SETUP",
          "title": "Server attached guard role drawer",
          "storyExcerpt": "Learning the exact name of the server attached guard role from the panel, the visitor sends one more proxied slip asking for the role security drawer and receives a crisp JSON bundle containing…",
          "technicalParallel": "Why does IMDSv2 stop this attack? Because IMDSv2 requires the client to first send an HTTP PUT request with a custom X-aws-ec2-metadata-token-ttl-seconds header to obtain a secret token, and then pass…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Live temporary keycard, passcode, and session stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses live temporary keycard, passcode, and session stamp to advance toward crisp bundle returned straight through the front window.",
          "technicalParallel": "Appending the discovered role name to the SSRF URL (/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole) causes the IMDSv1 endpoint to return a JSON object containing temporary AWS STS…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Name Role",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Why IMDSv2 blocks this trick",
          "storyExcerpt": "Behind the scenes, why imdsv2 blocks this trick captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate CloudWatch MetadataNoToken metric spikes (proving IMDSv1 access occurred) with reverse-proxy access logs returning ~1.3 KB responses from /latest/meta-data/iam/security-credentials/ (confirming…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lobby Key-Box",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Storage Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Temp Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.005"
    },
    "step-3": {
      "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
      "sectionKey": "step-3",
      "sceneKind": "cld-aws-imdsv1-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Replaying Stolen EC2 Role Keys Outside AWS via aws s3 sync (T1530)",
      "storyCue": "Loading the stolen temporary keycard onto their own computer far outside the cloud estate, the intruder dials the company cloud storage vault directly and mirrors gigabytes of sensitive buckets before the temporary card expires.",
      "technicalCue": "T1530 · EXFIL & IMPACT — The attacker loads the stolen AccessKeyId, SecretAccessKey, and SessionToken into their local AWS CLI environment and runs aws s3 sync s3://corp-credit-applications-prod ./loot (authenticating…",
      "storyMappings": [
        {
          "storyTerm": "Loading the stolen keycard outside the cloud estate",
          "technicalTerm": "Configuring stolen ASIA... STS keys on an external attacker workstation",
          "tone": "amber"
        },
        {
          "storyTerm": "Mirroring gigabytes of sensitive buckets",
          "technicalTerm": "Executing aws s3 sync to bulk-download confidential S3 objects",
          "tone": "sky"
        },
        {
          "storyTerm": "Impossible badge-location alarm",
          "technicalTerm": "AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault ledger naming the exact hijacked server badge",
          "technicalTerm": "CloudTrail AssumedRole event for i-0a84b92c11e3f0412 calling s3:GetObject from non-AWS IP",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-imdsv1-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Loading the stolen keycard outside the…",
          "subtitle": "Configuring stolen ASIA... STS keys on an external attacker…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-imdsv1-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Mirroring gigabytes of sensitive buckets",
          "subtitle": "Executing aws s3 sync to bulk-download confidential S3 objects",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Own",
          "stageTag": "STEP 03 · SETUP",
          "title": "Loading the stolen keycard outside the cloud estate",
          "storyExcerpt": "Loading the stolen temporary keycard onto their own computer far outside the cloud estate, the intruder dials the company cloud storage vault directly and mirrors gigabytes of sensitive buckets…",
          "technicalParallel": "Even if an attacker steals an EC2 IAM role’s STS token, defenders can render the stolen token useless outside the VPC by attaching an aws:SourceVpce or aws:VpcSourceIp condition to the IAM role policy.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Mirroring gigabytes of sensitive buckets",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mirroring gigabytes of sensitive buckets to advance toward impossible badge-location alarm.",
          "technicalParallel": "The attacker loads the stolen AccessKeyId, SecretAccessKey, and SessionToken into their local AWS CLI environment and runs aws s3 sync s3://corp-credit-applications-prod ./loot (authenticating directly…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Own",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Vault ledger naming the exact hijacked server badge",
          "storyExcerpt": "Behind the scenes, vault ledger naming the exact hijacked server badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert immediately on AWS GuardDuty InstanceCredentialExfiltration.OutsideAWS findings and CloudTrail logs showing userIdentity.type == \"AssumedRole\" for an EC2 instance principal (such as…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Lobby Key-Box",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Storage Silos",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Temp Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    },
    "memory-forensics": {
      "scenarioId": "aws-imdsv1-ssrf-capitalone-style",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-aws-imdsv1-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "EC2 Reverse-Proxy SSRF to IMDSv1 (169.254.169.254) IAM Role & S3… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of lobby key-box beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: node (SSRF Web Service) (V8 Heap (SSRF Response Buffer) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of node (SSRF Web Service)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F2B44100000 (RW-, 64 KB) · V8 Heap (SSRF Response Buffer)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against node (SSRF Web Service) (PID 2208)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Buffered JSON response from 169.254.169.254 containing temporary STS AccessKeyId (ASIA...) and SessionToken.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-imdsv1-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of node (SSRF Web…",
          "tone": "sky"
        },
        {
          "id": "cld-aws-imdsv1-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F2B44100000 (RW-, 64 KB) · V8 Heap (SSRF Response Buffer)",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline node (SSRF Web Service) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F2B44100000 (RW-, 64 KB) containing V8 Heap (SSRF Response Buffer).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 2208 confirms injected region: Buffered JSON response from 169.254.169.254 containing temporary STS AccessKeyId (ASIA...) and SessionToken.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "azure-ad-connect-pass-the-certificate": {
    "briefing": {
      "scenarioId": "azure-ad-connect-pass-the-certificate",
      "sectionKey": "briefing",
      "sceneKind": "cld-azure-adconnect-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1003",
      "title": "Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO… — Story-to-Technical Overview",
      "storyCue": "Imagine a courier bridge building connecting an on-premises castle registry to a rooftop cloud headquarters. Inside the bridge cellar sits a locked database holding the courier master password that syncs every castle citizen into the cloud; an intruder breaks into the bridge building, uses the bridge own built-in unscrambling lens to read that courier password aloud, empties the castle ledger, and stamps forged seamless-entry passes straight into the cloud tower.",
      "technicalCue": "CREDENTIAL ACCESS: QUERYING ADSYNC LOCALDB (MMS_MANAGEMENT_AGENT) BLOBS -> CREDENTIAL ACCESS: DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD -> LATERAL & C2: MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT",
      "storyMappings": [
        {
          "storyTerm": "Locked cellar database inside the courier bridge building",
          "technicalTerm": "Entra Connect ADSync SQL LocalDB (ADSync.mdf / mms_management_agent table)",
          "tone": "amber"
        },
        {
          "storyTerm": "Bridge own built-in unscrambling lens",
          "technicalTerm": "PowerShell loading mcrypt.dll to DPAPI-decrypt the encrypted MSOL_<hex> password",
          "tone": "sky"
        },
        {
          "storyTerm": "Emptying the castle master ledger with the courier key",
          "technicalTerm": "Executing Active Directory DCSync using the over-privileged MSOL_ service account",
          "tone": "rose"
        },
        {
          "storyTerm": "Stamping forged seamless-entry passes into the cloud tower",
          "technicalTerm": "Extracting AZUREADSSOACC$ Kerberos key to forge Silver Tickets into Microsoft 365",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#A855F7",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-azure-adconnect-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Locked cellar database inside the…",
          "subtitle": "Entra Connect ADSync SQL LocalDB (ADSync.mdf /…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-adconnect-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Bridge own built-in unscrambling lens",
          "subtitle": "PowerShell loading mcrypt.dll to DPAPI-decrypt the encrypted…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Sync",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "QUERYING ADSYNC LOCALDB (MMS_MANAGEMENT_AGENT) BLOBS",
          "storyExcerpt": "After gaining administrator keys on the directory-sync bridge server, the intruder impersonates the local sync clerk to open the cellar database drawer holding the encrypted courier secret and its locked…",
          "technicalParallel": "Many organizations mistakenly place their Entra Connect server in a standard Tier-1 server OU managed by general server administrators, unaware that local admin on Entra Connect equates to Domain Admin +…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Own Lens",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "DPAPI & MCRYPT.DLL DECRYPTION OF MSOL_ CONNECTOR PASSWORD",
          "storyExcerpt": "Rather than breaking the encryption mathematically, the intruder loads the bridge server own official decryption library directly into a script, letting the bridge politely unwrap and hand over the…",
          "technicalParallel": "Because miiserver.exe must decrypt the MSOL_ password unattended whenever the service restarts, the entire decryption chain resides locally on the Entra Connect host.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Hash Out",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "MSOL_ DCSYNC & AZUREADSSOACC$ SEAMLESS SSO CLOUD PIVOT",
          "storyExcerpt": "Armed with the courier password, the intruder synchronizes every single password hash out of the on-premises castle vault, lifts the cloud seamless-login stamp, and mints forged cloud passes that walk…",
          "technicalParallel": "Microsoft recommends treating Entra Connect as a Tier-0 asset, disabling Seamless SSO in favor of Primary Refresh Tokens (PRT), and rotating the AZUREADSSOACC$ Kerberos decryption key every 30 days.",
          "accentHex": "#A855F7",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cellar Ledger",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cert Bridge",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Master Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "azure-ad-connect-pass-the-certificate",
      "sectionKey": "step-1",
      "sceneKind": "cld-azure-adconnect-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Querying the ADSync SQL LocalDB (mms_management_agent) as NT SERVICE\\ADSync (T1003)",
      "storyCue": "After gaining administrator keys on the directory-sync bridge server, the intruder impersonates the local sync clerk to open the cellar database drawer holding the encrypted courier secret and its locked key wrapper.",
      "technicalCue": "T1003 · CREDENTIAL ACCESS — After obtaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker elevates to NT SERVICE\\ADSync (the service account that owns the local SQL Server Express…",
      "storyMappings": [
        {
          "storyTerm": "Directory-sync bridge server",
          "technicalTerm": "On-premises Microsoft Entra Connect (Azure AD Connect) synchronization host",
          "tone": "amber"
        },
        {
          "storyTerm": "Impersonating the local sync clerk",
          "technicalTerm": "Querying ADSync SQL LocalDB running under NT SERVICE\\ADSync privileges",
          "tone": "sky"
        },
        {
          "storyTerm": "Cellar database drawer holding encrypted secrets",
          "technicalTerm": "ADSync.mdf tables mms_management_agent and mms_server_configuration",
          "tone": "rose"
        },
        {
          "storyTerm": "Watchdog noticing unauthorized cellar entry",
          "technicalTerm": "Sysmon EventID 1 flagging SqlLocalDB.exe info ADSync or odd access to ADSync.mdf",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-adconnect-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Directory-sync bridge server",
          "subtitle": "On-premises Microsoft Entra Connect (Azure AD Connect)…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-adconnect-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Impersonating the local sync clerk",
          "subtitle": "Querying ADSync SQL LocalDB running under NT SERVICE\\ADSync…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Sync",
          "stageTag": "STEP 01 · SETUP",
          "title": "Directory-sync bridge server",
          "storyExcerpt": "After gaining administrator keys on the directory-sync bridge server, the intruder impersonates the local sync clerk to open the cellar database drawer holding the encrypted courier secret and…",
          "technicalParallel": "Many organizations mistakenly place their Entra Connect server in a standard Tier-1 server OU managed by general server administrators, unaware that local admin on Entra Connect equates to Domain Admin +…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Sync",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Impersonating the local sync clerk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses impersonating the local sync clerk to advance toward cellar database drawer holding encrypted secrets.",
          "technicalParallel": "After obtaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker elevates to NT SERVICE\\ADSync (the service account that owns the local SQL Server Express LocalDB…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys Sync",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Watchdog noticing unauthorized cellar entry",
          "storyExcerpt": "Behind the scenes, watchdog noticing unauthorized cellar entry captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation recording command lines) showing SqlLocalDB.exe info ADSync or non-ADSync binaries accessing C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf (exposing…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cellar Ledger",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cert Bridge",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Master Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003"
    },
    "step-2": {
      "scenarioId": "azure-ad-connect-pass-the-certificate",
      "sectionKey": "step-2",
      "sceneKind": "cld-azure-adconnect-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Loading mcrypt.dll in PowerShell to DPAPI-Decrypt the MSOL_<hex> Password (T1552.001)",
      "storyCue": "Rather than breaking the encryption mathematically, the intruder loads the bridge server own official decryption library directly into a script, letting the bridge politely unwrap and hand over the plaintext MSOL master courier password.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Running as NT SERVICE\\ADSync, the attacker uses PowerShell reflection (or AADInternals / adconnectdump) to load C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll, calls…",
      "storyMappings": [
        {
          "storyTerm": "Bridge server own official decryption library",
          "technicalTerm": "Signed Microsoft mcrypt.dll loaded directly inside PowerShell (AADInternals)",
          "tone": "amber"
        },
        {
          "storyTerm": "Politely unwrapping the encrypted wrapper",
          "technicalTerm": "DPAPI decryption of the keyset protecting the MSOL_<hex> connector credential",
          "tone": "sky"
        },
        {
          "storyTerm": "Plaintext master courier password",
          "technicalTerm": "Recovered cleartext password for the on-premises MSOL_<hex> AD sync account",
          "tone": "rose"
        },
        {
          "storyTerm": "Why this key is a crown jewel",
          "technicalTerm": "MSOL_ holds Replicating Directory Changes All rights across the entire AD forest",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-adconnect-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Bridge server own official decryption…",
          "subtitle": "Signed Microsoft mcrypt.dll loaded directly inside PowerShell…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-adconnect-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Politely unwrapping the encrypted wrapper",
          "subtitle": "DPAPI decryption of the keyset protecting the MSOL_<hex>…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Than Own",
          "stageTag": "STEP 02 · SETUP",
          "title": "Bridge server own official decryption library",
          "storyExcerpt": "Rather than breaking the encryption mathematically, the intruder loads the bridge server own official decryption library directly into a script, letting the bridge politely unwrap and hand over…",
          "technicalParallel": "Because miiserver.exe must decrypt the MSOL_ password unattended whenever the service restarts, the entire decryption chain resides locally on the Entra Connect host.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Politely unwrapping the encrypted wrapper",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses politely unwrapping the encrypted wrapper to advance toward plaintext master courier password.",
          "technicalParallel": "Running as NT SERVICE\\ADSync, the attacker uses PowerShell reflection (or AADInternals / adconnectdump) to load C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll, calls KeyManager.LoadKeySet()…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Why Key",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Why this key is a crown jewel",
          "storyExcerpt": "Behind the scenes, why this key is a crown jewel captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by SpecterOps & Mandiant: Sysmon EventID 7 (ImageLoad) where mcrypt.dll is loaded by any process other than miiserver.exe (such as powershell.exe).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cellar Ledger",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cert Bridge",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Master Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.001"
    },
    "step-3": {
      "scenarioId": "azure-ad-connect-pass-the-certificate",
      "sectionKey": "step-3",
      "sceneKind": "cld-azure-adconnect-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Executing MSOL_ DCSync & Forging AZUREADSSOACC$ Seamless SSO Cloud Tickets (T1556.007)",
      "storyCue": "Armed with the courier password, the intruder synchronizes every single password hash out of the on-premises castle vault, lifts the cloud seamless-login stamp, and mints forged cloud passes that walk straight into corporate cloud mailboxes without typing a password.",
      "technicalCue": "T1556.007 · LATERAL & C2 — Because Password Hash Synchronization (PHS) requires the CORP\\MSOL_9a8b7c6d5e4f account to hold Replicating Directory Changes and Replicating Directory Changes All on the domain root, the…",
      "storyMappings": [
        {
          "storyTerm": "Synchronizing every hash out of the castle vault",
          "technicalTerm": "Executing DCSync against the Domain Controller using the MSOL_ account",
          "tone": "amber"
        },
        {
          "storyTerm": "Lifting the cloud seamless-login stamp",
          "technicalTerm": "Dumping the AZUREADSSOACC$ computer account Kerberos key via DCSync",
          "tone": "sky"
        },
        {
          "storyTerm": "Minting forged passes walking straight into cloud mailboxes",
          "technicalTerm": "Forging Seamless SSO Kerberos tickets to impersonate any synced Entra ID user",
          "tone": "rose"
        },
        {
          "storyTerm": "Total hybrid on-prem to cloud takeover",
          "technicalTerm": "Compromise of both local Active Directory and federated Microsoft 365 cloud accounts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-adconnect-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Synchronizing every hash out of the…",
          "subtitle": "Executing DCSync against the Domain Controller using the MSOL_…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-adconnect-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Lifting the cloud seamless-login stamp",
          "subtitle": "Dumping the AZUREADSSOACC$ computer account Kerberos key via…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hash Out",
          "stageTag": "STEP 03 · SETUP",
          "title": "Synchronizing every hash out of the castle vault",
          "storyExcerpt": "Armed with the courier password, the intruder synchronizes every single password hash out of the on-premises castle vault, lifts the cloud seamless-login stamp, and mints forged cloud passes…",
          "technicalParallel": "Microsoft recommends treating Entra Connect as a Tier-0 asset, disabling Seamless SSO in favor of Primary Refresh Tokens (PRT), and rotating the AZUREADSSOACC$ Kerberos decryption key every 30 days.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Lifting the cloud seamless-login stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses lifting the cloud seamless-login stamp to advance toward minting forged passes walking straight into cloud mailboxes.",
          "technicalParallel": "Because Password Hash Synchronization (PHS) requires the CORP\\MSOL_9a8b7c6d5e4f account to hold Replicating Directory Changes and Replicating Directory Changes All on the domain root, the attacker uses…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. On-prem",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Total hybrid on-prem to cloud takeover",
          "storyExcerpt": "Behind the scenes, total hybrid on-prem to cloud takeover captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Microsoft Defender for Identity: Windows Security EventID 4662 (DS-Replication-Get-Changes-All GUID 1131f6ad-9c07-11d1-f79f-00c04fc2dcd2) initiated by MSOL_* from a non-Entra-Connect IP.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cellar Ledger",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cert Bridge",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Master Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1556.007"
    },
    "memory-forensics": {
      "scenarioId": "azure-ad-connect-pass-the-certificate",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-azure-adconnect-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1003",
      "title": "Entra Connect (Azure AD Connect) MSOL_ DKM Decryption & Seamless SSO… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of cellar ledger beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: powershell.exe (ADConnect Dump) (CLR Heap (Decrypted XML Configuration Blob) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of powershell.exe (ADConnect Dump)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000021480910000 (RW-, 32 KB) · CLR Heap (Decrypted XML Configuration Blob)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against powershell.exe (ADConnect Dump) (PID 5890)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Plaintext XML decrypted from mms_management_agent containing MSOL_9a8b7c6d5e4f password.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-adconnect-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of powershell.exe…",
          "tone": "sky"
        },
        {
          "id": "cld-azure-adconnect-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000021480910000 (RW-, 32 KB) · CLR Heap (Decrypted XML…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline powershell.exe (ADConnect Dump) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x0000021480910000 (RW-, 32 KB) containing CLR Heap (Decrypted XML Configuration Blob).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 5890 confirms injected region: Plaintext XML decrypted from mms_management_agent containing MSOL_9a8b7c6d5e4f password.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "gcp-service-account-hmac-key-pivot": {
    "briefing": {
      "scenarioId": "gcp-service-account-hmac-key-pivot",
      "sectionKey": "briefing",
      "sceneKind": "cld-gcp-hmac-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1087.004",
      "title": "GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation… — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud campus where every new virtual office comes pre-assigned a shared default maintenance badge that accidentally carries wide editor authority across the whole estate. Discovering that overly generous badge from outside the campus, an intruder walks up to the key-duplication kiosk, cuts a permanent offline steel copy of that badge, and takes the steel copy back to their own hideout to empty corporate cloud storage vaults at leisure.",
      "technicalCue": "CREDENTIAL ACCESS: ENUMERATING PRIVILEGED DEFAULT COMPUTE SERVICE ACCOUNT -> PERSISTENCE: MINTING USER-MANAGED RSA JSON KEY VIA CREATESERVICEACCOUNTKEY -> EXFIL & IMPACT: IMPERSONATED EDITOR AUTHENTICATION & GCS BUCKET EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Shared default maintenance badge carrying wide editor authority",
          "technicalTerm": "Over-privileged Default Compute Engine Service Account (*-compute@developer.gserviceaccount.com)",
          "tone": "amber"
        },
        {
          "storyTerm": "Cutting a permanent offline steel copy at the key kiosk",
          "technicalTerm": "Calling iam.serviceAccountKeys.create to mint persistent loot_key.json",
          "tone": "sky"
        },
        {
          "storyTerm": "Taking the steel copy outside the campus to empty storage vaults",
          "technicalTerm": "Activating loot_key.json from an external IP to exfiltrate GCS buckets (storage.objects.get)",
          "tone": "rose"
        },
        {
          "storyTerm": "Campus key-duplication ledger catching cross-identity cutting",
          "technicalTerm": "GCP Admin Activity Audit Log CreateServiceAccountKey where principalEmail != resourceName",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-gcp-hmac-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Shared default maintenance badge…",
          "subtitle": "Over-privileged Default Compute Engine Service Account…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-hmac-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Cutting a permanent offline steel copy…",
          "subtitle": "Calling iam.serviceAccountKeys.create to mint persistent…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wide",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "ENUMERATING PRIVILEGED DEFAULT COMPUTE SERVICE ACCOUNT",
          "storyExcerpt": "Peeking into the cloud staff roster from an outside street address, the intruder immediately spots the default Compute maintenance badge still holding broad project-wide Editor powers across storage…",
          "technicalParallel": "As Wiz Research documented, unless an organization explicitly enables constraints/iam.automaticIamGrantsForDefaultServiceAccounts, newly created Compute Engine and App Engine default service accounts…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Copy Key",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "MINTING USER-MANAGED RSA JSON KEY VIA CREATESERVICEACCOUNTKEY",
          "storyExcerpt": "Rather than relying on short-lived lobby passes that expire in an hour, the intruder uses key-creation rights to step up to the badge printer and stamp a permanent, user-managed JSON master key belonging…",
          "technicalParallel": "Unlike short-lived metadata tokens on a GCE VM, a user-managed service account key JSON file does not expire for 10 years by default and can be used from anywhere on the internet unless blocked by VPC…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Key Onto",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "IMPERSONATED EDITOR AUTHENTICATION & GCS BUCKET EXFILTRATION",
          "storyExcerpt": "Loading the permanent steel key onto an external laptop far away from Google Cloud, the intruder signs in directly as the powerful Compute maintenance account and empties sensitive customer buckets…",
          "technicalParallel": "In GCP Data Access audit logs, when a Compute Engine service account authenticates via a downloaded JSON key rather than the internal GCE metadata server, authenticationInfo.serviceAccountKeyName is…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Key Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cloud Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Steel Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "gcp-service-account-hmac-key-pivot",
      "sectionKey": "step-1",
      "sceneKind": "cld-gcp-hmac-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Discovering the Over-Privileged Default Compute Engine Service Account (T1087.004)",
      "storyCue": "Peeking into the cloud staff roster from an outside street address, the intruder immediately spots the default Compute maintenance badge still holding broad project-wide Editor powers across storage, databases, and servers.",
      "technicalCue": "T1087.004 · CREDENTIAL ACCESS — Using a compromised low-privilege CI service account (ci-runner@corp-prod.iam.gserviceaccount.com), the attacker runs gcloud iam service-accounts list (calling…",
      "storyMappings": [
        {
          "storyTerm": "Peeking into the cloud staff roster from outside",
          "technicalTerm": "google.iam.admin.v1.ListServiceAccounts called from external IP 198.51.100.73",
          "tone": "amber"
        },
        {
          "storyTerm": "Default Compute maintenance badge with broad powers",
          "technicalTerm": "Default *-compute@developer.gserviceaccount.com carrying roles/editor",
          "tone": "sky"
        },
        {
          "storyTerm": "Campus directory audit book",
          "technicalTerm": "Google Cloud IAM Admin Activity Audit Logs recording enumeration calls",
          "tone": "rose"
        },
        {
          "storyTerm": "High-value lateral pivot target",
          "technicalTerm": "Single service account granting read/write access to GCS and compute resources",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-hmac-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Peeking into the cloud staff roster from…",
          "subtitle": "google.iam.admin.v1.ListServiceAccounts called from external…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-hmac-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Default Compute maintenance badge with…",
          "subtitle": "Default *-compute@developer.gserviceaccount.com carrying…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Peeking into the cloud staff roster from outside",
          "storyExcerpt": "Peeking into the cloud staff roster from an outside street address, the intruder immediately spots the default Compute maintenance badge still holding broad project-wide Editor powers across…",
          "technicalParallel": "As Wiz Research documented, unless an organization explicitly enables constraints/iam.automaticIamGrantsForDefaultServiceAccounts, newly created Compute Engine and App Engine default service accounts…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Book",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Default Compute maintenance badge with broad powers",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses default compute maintenance badge with broad powers to advance toward campus directory audit book.",
          "technicalParallel": "Using a compromised low-privilege CI service account (ci-runner@corp-prod.iam.gserviceaccount.com), the attacker runs gcloud iam service-accounts list (calling google.iam.admin.v1.ListServiceAccounts)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "High-value lateral pivot target",
          "storyExcerpt": "Behind the scenes, high-value lateral pivot target captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Google Cloud IAM Audit Logs (central control-plane logs tracking identity queries and mutations) for google.iam.admin.v1.ListServiceAccounts calls originating from unexpected external non-GCP IP…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Key Kiosk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cloud Silos",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Steel Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1087.004"
    },
    "step-2": {
      "scenarioId": "gcp-service-account-hmac-key-pivot",
      "sectionKey": "step-2",
      "sceneKind": "cld-gcp-hmac-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Minting a Persistent User-Managed JSON Key via iam.serviceAccountKeys.create (T1098.001)",
      "storyCue": "Rather than relying on short-lived lobby passes that expire in an hour, the intruder uses key-creation rights to step up to the badge printer and stamp a permanent, user-managed JSON master key belonging to that powerful default maintenance account.",
      "technicalCue": "T1098.001 · PERSISTENCE — Because the ci-runner identity holds roles/iam.serviceAccountKeyAdmin (which includes iam.serviceAccountKeys.create) scoped at the project level rather than restricted to a single…",
      "storyMappings": [
        {
          "storyTerm": "Badge printer stamping a permanent master key",
          "technicalTerm": "google.iam.admin.v1.CreateServiceAccountKey (iam.serviceAccountKeys.create)",
          "tone": "amber"
        },
        {
          "storyTerm": "Permanent offline steel copy",
          "technicalTerm": "User-managed private RSA JSON key file (loot_key.json) valid indefinitely until revoked",
          "tone": "sky"
        },
        {
          "storyTerm": "One person printing keys for a different account",
          "technicalTerm": "Audit log anomaly where principalEmail does not match resourceName",
          "tone": "rose"
        },
        {
          "storyTerm": "Cloud guard alarm flagging key minting",
          "technicalTerm": "Google Cloud Security Command Center (SCC) persistent key creation finding",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-hmac-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Badge printer stamping a permanent…",
          "subtitle": "google.iam.admin.v1.CreateServiceAccountKey…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-hmac-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Permanent offline steel copy",
          "subtitle": "User-managed private RSA JSON key file (loot_key.json) valid…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Than Hour",
          "stageTag": "STEP 02 · SETUP",
          "title": "Badge printer stamping a permanent master key",
          "storyExcerpt": "Rather than relying on short-lived lobby passes that expire in an hour, the intruder uses key-creation rights to step up to the badge printer and stamp a permanent, user-managed JSON master key…",
          "technicalParallel": "Unlike short-lived metadata tokens on a GCE VM, a user-managed service account key JSON file does not expire for 10 years by default and can be used from anywhere on the internet unless blocked by VPC…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Copy",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Permanent offline steel copy",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses permanent offline steel copy to advance toward one person printing keys for a different account.",
          "technicalParallel": "Because the ci-runner identity holds roles/iam.serviceAccountKeyAdmin (which includes iam.serviceAccountKeys.create) scoped at the project level rather than restricted to a single non-privileged account…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. One Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Cloud guard alarm flagging key minting",
          "storyExcerpt": "Behind the scenes, cloud guard alarm flagging key minting captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Google Cloud Admin Activity Audit Logs and Security Command Center (SCC) findings for google.iam.admin.v1.CreateServiceAccountKey (permanent key minting) especially where principalEmail !=…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Key Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cloud Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Steel Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "step-3": {
      "scenarioId": "gcp-service-account-hmac-key-pivot",
      "sectionKey": "step-3",
      "sceneKind": "cld-gcp-hmac-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Activating loot_key.json Outside GCP to Exfiltrate Cloud Storage (GCS) Buckets (T1530)",
      "storyCue": "Loading the permanent steel key onto an external laptop far away from Google Cloud, the intruder signs in directly as the powerful Compute maintenance account and empties sensitive customer buckets straight over the public internet.",
      "technicalCue": "T1530 · EXFIL & IMPACT — The attacker runs gcloud auth activate-service-account --key-file=loot_key.json (which signs a JWT assertion locally with the RSA private key and exchanges it at oauth2.googleapis.com/token for…",
      "storyMappings": [
        {
          "storyTerm": "Loading the steel key onto an external laptop",
          "technicalTerm": "gcloud auth activate-service-account --key-file=loot_key.json from an external IP",
          "tone": "amber"
        },
        {
          "storyTerm": "Emptying sensitive customer storage vaults",
          "technicalTerm": "Bulk Cloud Storage exfiltration generating storage.objects.get Data Access events",
          "tone": "sky"
        },
        {
          "storyTerm": "Distinctive external steel-key stamp in the vault diary",
          "technicalTerm": "Non-empty authenticationInfo.serviceAccountKeyName paired with a non-GCP source IP",
          "tone": "rose"
        },
        {
          "storyTerm": "Organization-wide lock preventing steel copies",
          "technicalTerm": "GCP Org Policy constraints/iam.disableServiceAccountKeyCreation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-hmac-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Loading the steel key onto an external…",
          "subtitle": "gcloud auth activate-service-account --key-file=loot_key.json…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-hmac-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Emptying sensitive customer storage vaults",
          "subtitle": "Bulk Cloud Storage exfiltration generating storage.objects.get…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Onto",
          "stageTag": "STEP 03 · SETUP",
          "title": "Loading the steel key onto an external laptop",
          "storyExcerpt": "Loading the permanent steel key onto an external laptop far away from Google Cloud, the intruder signs in directly as the powerful Compute maintenance account and empties sensitive customer…",
          "technicalParallel": "In GCP Data Access audit logs, when a Compute Engine service account authenticates via a downloaded JSON key rather than the internal GCE metadata server, authenticationInfo.serviceAccountKeyName is…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Emptying sensitive customer storage vaults",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses emptying sensitive customer storage vaults to advance toward distinctive external steel-key stamp in the vault diary.",
          "technicalParallel": "The attacker runs gcloud auth activate-service-account --key-file=loot_key.json (which signs a JWT assertion locally with the RSA private key and exchanges it at oauth2.googleapis.com/token for a 1-hour…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lock",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Organization-wide lock preventing steel copies",
          "storyExcerpt": "Behind the scenes, organization-wide lock preventing steel copies captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Google Cloud Data Access Audit Logs (which track individual bucket object downloads) for storage.objects.get invoked by *-compute@developer.gserviceaccount.com carrying a non-empty…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Key Kiosk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Cloud Silos",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Steel Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    },
    "memory-forensics": {
      "scenarioId": "gcp-service-account-hmac-key-pivot",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-gcp-hmac-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1087.004",
      "title": "GCP iam.serviceAccountKeys.create & serviceAccounts.actAs Impersonation… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of key kiosk beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: gcloud (GCP SDK CLI) (loot_key.json (RSA Private Key Buffer) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of gcloud (GCP SDK CLI)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F1108400000 (RW-, 8 KB) · loot_key.json (RSA Private Key Buffer)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against gcloud (GCP SDK CLI) (PID 8104)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Downloaded GCP service account JSON key file containing PKCS#8 private_key for the Editor service account.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-hmac-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of gcloud (GCP SDK…",
          "tone": "sky"
        },
        {
          "id": "cld-gcp-hmac-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F1108400000 (RW-, 8 KB) · loot_key.json (RSA Private…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline gcloud (GCP SDK CLI) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F1108400000 (RW-, 8 KB) containing loot_key.json (RSA Private Key Buffer).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 8104 confirms injected region: Downloaded GCP service account JSON key file containing PKCS#8 private_key for the Editor service account.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "k8s-runc-cve-2024-21626-leaky-vessels": {
    "briefing": {
      "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
      "sectionKey": "briefing",
      "sceneKind": "cld-k8s-runc-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1611",
      "title": "\"Leaky Vessels\" runc WORKDIR (/proc/self/fd/7) Host File-Descriptor… — Story-to-Technical Overview",
      "storyCue": "Imagine a high-security container ship where sealed steel boxes keep every guest isolated from the ship hull. Due to a latch slip during startup, the container loader leaves a side peephole door to the ship outside engine frame open right as it seats a guest inside, leaving the guest standing with one foot on the open hull so walking backward up a few flights of stairs leads straight into the ship master bridge and credential cabinet.",
      "technicalCue": "EXECUTION: RUNC CGROUP FILE DESCRIPTOR LEAK BEFORE PIVOT_ROOT -> PERSISTENCE: PERSISTENT HOST DENTRY ANCHOR IN CONTAINER CURRENT DIRECTORY -> DEFENSE EVASION: RELATIVE DOT-DOT TRAVERSAL TO HOST ROOTFS & KUBELET COMPROMISE",
      "storyMappings": [
        {
          "storyTerm": "Side peephole door left open during box startup",
          "technicalTerm": "Leaked host /sys/fs/cgroup file descriptor (fd 7/8/9) inside runc:[2:INIT] (CVE-2024-21626)",
          "tone": "amber"
        },
        {
          "storyTerm": "Guest standing with one foot on the open hull",
          "technicalTerm": "Container process CWD retaining host VFS dentry via WORKDIR /proc/self/fd/7",
          "tone": "sky"
        },
        {
          "storyTerm": "Walking backward up a few flights of stairs onto the bridge",
          "technicalTerm": "Relative traversal ../../../../ escaping container root to the host filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Raiding the ship master credential cabinet",
          "technicalTerm": "Reading host /etc/shadow, /etc/crontab, and Kubelet node certificates",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-k8s-runc-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Side peephole door left open during box…",
          "subtitle": "Leaked host /sys/fs/cgroup file descriptor (fd 7/8/9) inside…",
          "tone": "amber"
        },
        {
          "id": "cld-k8s-runc-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Guest standing with one foot on the open…",
          "subtitle": "Container process CWD retaining host VFS dentry via WORKDIR…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side Door",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "RUNC CGROUP FILE DESCRIPTOR LEAK BEFORE PIVOT_ROOT",
          "storyExcerpt": "During box assembly, the container launcher opens an internal pass to the ship outside maintenance frame and forgets to close it before honoring the guest custom starting room address, accidentally…",
          "technicalParallel": "Why didn’t O_CLOEXEC protect runc? Because O_CLOEXEC only closes file descriptors at the exact moment execve() is called, whereas runc processes the container’s WORKDIR (chdir) slightly earlier during…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Box Shut",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "PERSISTENT HOST DENTRY ANCHOR IN CONTAINER CURRENT DIRECTORY",
          "storyExcerpt": "Even after the steel box walls slam shut around the room, the guest shoes remain planted on an unreachable outside floor tile belonging to the ship main deck, bypassing the entire wall boundary from the…",
          "technicalParallel": "In the Linux kernel, once a process’s fs->pwd dentry points to a mount outside its root namespace, relative path lookups starting from \".\" or \"..\" resolve along the host mount tree rather than the…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Up Four",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "RELATIVE DOT-DOT TRAVERSAL TO HOST ROOTFS & KUBELET COMPROMISE",
          "storyExcerpt": "Stepping backward up four staircases from that outside tile, the escaped guest reaches the ship central control floor to open the master password ledger, read floor-manager station keys, and slip a…",
          "technicalParallel": "OpenContainers patched CVE-2024-21626 in runc 1.1.12 by marking internal cgroup descriptors O_CLOEXEC properly, closing leaked fds before chdir, and verifying via getcwd() that the working directory is…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Hatch",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Harbor Tower",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Escape Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
      "sectionKey": "step-1",
      "sceneKind": "cld-k8s-runc-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "Leaking the Host /sys/fs/cgroup File Descriptor (fd 7) into runc init (CVE-2024-21626)",
      "storyCue": "During box assembly, the container launcher opens an internal pass to the ship outside maintenance frame and forgets to close it before honoring the guest custom starting room address, accidentally placing the guest starting mat right inside the leaked pass.",
      "technicalCue": "T1611 · EXECUTION — In runc versions <= 1.1.11, the runc init process opens the host system’s /sys/fs/cgroup directory (receiving file descriptor 7, marked O_CLOEXEC so it will automatically close when execve()…",
      "storyMappings": [
        {
          "storyTerm": "Container launcher assembling the sealed box",
          "technicalTerm": "runc:[2:INIT] runtime process initializing container namespaces",
          "tone": "amber"
        },
        {
          "storyTerm": "Unclosed pass to the ship outside maintenance frame",
          "technicalTerm": "Leaked host /sys/fs/cgroup file descriptor (fd 7, 8, or 9) missing O_CLOEXEC",
          "tone": "sky"
        },
        {
          "storyTerm": "Custom starting room address pointing into the pass",
          "technicalTerm": "Crafted OCI image WORKDIR /proc/self/fd/7 triggering chdir() to host cgroup",
          "tone": "rose"
        },
        {
          "storyTerm": "Hull audit camera catching the odd step",
          "technicalTerm": "Linux auditd SYSCALL chdir targeting /proc/self/fd/7 inside runc:[2:INIT]",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-k8s-runc-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Container launcher assembling the sealed…",
          "subtitle": "runc:[2:INIT] runtime process initializing container namespaces",
          "tone": "amber"
        },
        {
          "id": "cld-k8s-runc-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Unclosed pass to the ship outside…",
          "subtitle": "Leaked host /sys/fs/cgroup file descriptor (fd 7, 8, or 9)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Box Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Container launcher assembling the sealed box",
          "storyExcerpt": "During box assembly, the container launcher opens an internal pass to the ship outside maintenance frame and forgets to close it before honoring the guest custom starting room address…",
          "technicalParallel": "Why didn’t O_CLOEXEC protect runc? Because O_CLOEXEC only closes file descriptors at the exact moment execve() is called, whereas runc processes the container’s WORKDIR (chdir) slightly earlier during…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass Ship",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Unclosed pass to the ship outside maintenance frame",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unclosed pass to the ship outside maintenance frame to advance toward custom starting room address pointing into the pass.",
          "technicalParallel": "In runc versions <= 1.1.11, the runc init process opens the host system’s /sys/fs/cgroup directory (receiving file descriptor 7, marked O_CLOEXEC so it will automatically close when execve() finally…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room Pass",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Hull audit camera catching the odd step",
          "storyExcerpt": "Behind the scenes, hull audit camera catching the odd step captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Linux auditd SYSCALL chdir events (kernel-level syscall auditing capturing exact directory change targets) where runc:[2:INIT] resolves /proc/self/fd/7, /proc/self/fd/8, or /proc/self/fd/9…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Hatch",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Harbor Tower",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Escape Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1611"
    },
    "step-2": {
      "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
      "sectionKey": "step-2",
      "sceneKind": "cld-k8s-runc-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Retaining the Host VFS Dentry as the Container’s Current Working Directory (.) (T1611)",
      "storyCue": "Even after the steel box walls slam shut around the room, the guest shoes remain planted on an unreachable outside floor tile belonging to the ship main deck, bypassing the entire wall boundary from the very first heartbeat.",
      "technicalCue": "T1611 · PERSISTENCE — When runc finally calls execve(\"/bin/sh\"), the Linux kernel closes file descriptor 7 as requested by O_CLOEXEC, but the process’s kernel working directory pointer (task_struct->fs->pwd…",
      "storyMappings": [
        {
          "storyTerm": "Steel box walls slamming shut",
          "technicalTerm": "pivot_root confining the container root filesystem (/)",
          "tone": "amber"
        },
        {
          "storyTerm": "Shoes still planted on an unreachable outside floor tile",
          "technicalTerm": "Container proc.cwd anchored to an outside host VFS dentry ((unreachable))",
          "tone": "sky"
        },
        {
          "storyTerm": "Real-time floor-tile sensor spotting the breach",
          "technicalTerm": "Falco / Sysdig eBPF runtime alert flagging proc.cwd starting with (unreachable)",
          "tone": "rose"
        },
        {
          "storyTerm": "Broken wall isolation",
          "technicalTerm": "Host filesystem reachable via relative paths despite intact container mount view",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-k8s-runc-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Steel box walls slamming shut",
          "subtitle": "pivot_root confining the container root filesystem (/)",
          "tone": "amber"
        },
        {
          "id": "cld-k8s-runc-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Shoes still planted on an unreachable…",
          "subtitle": "Container proc.cwd anchored to an outside host VFS dentry…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Box Shut",
          "stageTag": "STEP 02 · SETUP",
          "title": "Steel box walls slamming shut",
          "storyExcerpt": "Even after the steel box walls slam shut around the room, the guest shoes remain planted on an unreachable outside floor tile belonging to the ship main deck, bypassing the entire wall boundary…",
          "technicalParallel": "In the Linux kernel, once a process’s fs->pwd dentry points to a mount outside its root namespace, relative path lookups starting from \".\" or \"..\" resolve along the host mount tree rather than the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tile",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Shoes still planted on an unreachable outside floor…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shoes still planted on an unreachable outside floor tile to advance toward real-time floor-tile sensor spotting the breach.",
          "technicalParallel": "When runc finally calls execve(\"/bin/sh\"), the Linux kernel closes file descriptor 7 as requested by O_CLOEXEC, but the process’s kernel working directory pointer (task_struct->fs->pwd, represented by…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Real-time",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Broken wall isolation",
          "storyExcerpt": "Behind the scenes, broken wall isolation captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Deploy Sysdig or CNCF Falco eBPF runtime rules (kernel sensors monitoring live process directory pointers) alerting whenever a containerized process exhibits proc.cwd starting with (unreachable) or…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Hatch",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Harbor Tower",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Escape Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
      "sectionKey": "step-3",
      "sceneKind": "cld-k8s-runc-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Traversing ../../../../ to the Host Root Filesystem & Stealing Kubelet Credentials (T1068)",
      "storyCue": "Stepping backward up four staircases from that outside tile, the escaped guest reaches the ship central control floor to open the master password ledger, read floor-manager station keys, and slip a recurring job onto the ship schedule.",
      "technicalCue": "T1068 · DEFENSE EVASION — Because the container’s current directory (\".\") is /sys/fs/cgroup on the underlying Kubernetes worker node, running cd ../../../.. (or opening \"../../../../etc/shadow\" and…",
      "storyMappings": [
        {
          "storyTerm": "Stepping backward up four staircases",
          "technicalTerm": "Relative openat syscalls traversing ../../../../ above the leaked cgroup directory",
          "tone": "amber"
        },
        {
          "storyTerm": "Master password ledger on the control floor",
          "technicalTerm": "Host root filesystem files ../../../../etc/shadow and ../../../../etc/crontab",
          "tone": "sky"
        },
        {
          "storyTerm": "Station keys stolen for fleet-wide takeover",
          "technicalTerm": "Host Kubelet client certificates and kubeconfig enabling cluster lateral movement",
          "tone": "rose"
        },
        {
          "storyTerm": "Hallway sensor catching cross-boundary reads",
          "technicalTerm": "Auditd openat telemetry flagging containerized PIDs traversing ../../../../etc/*",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-k8s-runc-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Stepping backward up four staircases",
          "subtitle": "Relative openat syscalls traversing ../../../../ above the…",
          "tone": "amber"
        },
        {
          "id": "cld-k8s-runc-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master password ledger on the control…",
          "subtitle": "Host root filesystem files ../../../../etc/shadow and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Four",
          "stageTag": "STEP 03 · SETUP",
          "title": "Stepping backward up four staircases",
          "storyExcerpt": "Stepping backward up four staircases from that outside tile, the escaped guest reaches the ship central control floor to open the master password ledger, read floor-manager desk station keys…",
          "technicalParallel": "OpenContainers patched CVE-2024-21626 in runc 1.1.12 by marking internal cgroup descriptors O_CLOEXEC properly, closing leaked fds before chdir, and verifying via getcwd() that the working directory is…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Keys",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master password ledger on the control floor",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master password ledger on the control floor to advance toward station keys stolen for fleet-wide takeover.",
          "technicalParallel": "Because the container’s current directory (\".\") is /sys/fs/cgroup on the underlying Kubernetes worker node, running cd ../../../.. (or opening \"../../../../etc/shadow\" and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Hallway sensor catching cross-boundary reads",
          "storyExcerpt": "Behind the scenes, hallway sensor catching cross-boundary reads captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Linux auditd openat syscalls (low-level kernel file-open tracking) originating from a containerized PID accessing relative traversal paths such as ../../../../etc/shadow or…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Open Hatch",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Harbor Tower",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Escape Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "memory-forensics": {
      "scenarioId": "k8s-runc-cve-2024-21626-leaky-vessels",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-k8s-runc-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1611",
      "title": "\"Leaky Vessels\" runc WORKDIR (/proc/self/fd/7) Host File-Descriptor… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of open hatch beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: sh (Escaped Container Process) (task_struct->fs->pwd (Kernel Dentry) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of sh (Escaped Container Process)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0xFFFF888104B2C000 (RW-, 4 KB) · task_struct->fs->pwd (Kernel Dentry)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against sh (Escaped Container Process) (PID 14935)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Kernel fs_struct pwd pointer referencing host /sys/fs/cgroup mount outside container pivot_root.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-k8s-runc-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of sh (Escaped…",
          "tone": "sky"
        },
        {
          "id": "cld-k8s-runc-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0xFFFF888104B2C000 (RW-, 4 KB) · task_struct->fs->pwd (Kernel…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline sh (Escaped Container Process) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0xFFFF888104B2C000 (RW-, 4 KB) containing task_struct->fs->pwd (Kernel Dentry).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 14935 confirms injected region: Kernel fs_struct pwd pointer referencing host /sys/fs/cgroup mount outside container pivot_root.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "microsoft-storm-0558-msa-signing-key": {
    "briefing": {
      "scenarioId": "microsoft-storm-0558-msa-signing-key",
      "sectionKey": "briefing",
      "sceneKind": "cld-storm0558-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1552.004",
      "title": "Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange… — Story-to-Technical Overview",
      "storyCue": "Imagine a global postal system operating two completely separate mail buildings: a public consumer mailroom and a high-security diplomatic embassy mailroom. After salvaging an old 2016 consumer ink stamp that accidentally leaked into an engineer crash notebook, a state spy stamps counterfeit visitor passes for diplomatic staff; because a subtle rule flaw inside the embassy mailroom forgets to check whether the ink stamp came from the consumer desk, the embassy hands over sealed government correspondence silently.",
      "technicalCue": "CREDENTIAL ACCESS: OFFLINE TOKEN FORGERY USING CRASH-DUMP MSA SIGNING KEY -> DEFENSE EVASION: CROSS-REALM VALIDATION BYPASS IN EXCHANGE ONLINE / OWA -> EXFIL & IMPACT: SILENT OWA MAILBOX COLLECTION & CISA AA23-193A DETECTION",
      "storyMappings": [
        {
          "storyTerm": "Old 2016 consumer ink stamp salvaged from a crash notebook",
          "technicalTerm": "Inactive 2016 MSA consumer signing key acquired from a Windows crash dump",
          "tone": "amber"
        },
        {
          "storyTerm": "Subtle flaw letting consumer ink stamps pass at the embassy mailroom",
          "technicalTerm": "Exchange Online / OWA realm validation flaw accepting MSA-signed tokens for enterprise tenants",
          "tone": "sky"
        },
        {
          "storyTerm": "Forged passes with zero record in the embassy front-gate book",
          "technicalTerm": "Forged OWA access tokens with empty ClientAppId and zero Entra ID SignInLogs entries",
          "tone": "rose"
        },
        {
          "storyTerm": "Silently reading sealed diplomatic mailbags",
          "technicalTerm": "OWA GetItem mailbox exfiltration caught via Purview MailItemsAccessed Action=ViaProxy",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-storm0558-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Old 2016 consumer ink stamp salvaged…",
          "subtitle": "Inactive 2016 MSA consumer signing key acquired from a Windows…",
          "tone": "amber"
        },
        {
          "id": "cld-storm0558-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Subtle flaw letting consumer ink stamps…",
          "subtitle": "Exchange Online / OWA realm validation flaw accepting…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Old 2016",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "OFFLINE TOKEN FORGERY USING CRASH-DUMP MSA SIGNING KEY",
          "storyExcerpt": "Having compromised an engineer workstation and combed through a diagnostic memory crash notebook, the espionage crew extracts a retired 2016 consumer-mailroom master wax stamp and begins embossing…",
          "technicalParallel": "Because token forgery happens 100% offline using the stolen private signing key, the attacker never sends a password guess or MFA push to Microsoft Entra ID, generating zero failed-login alerts.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Spot",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "CROSS-REALM VALIDATION BYPASS IN EXCHANGE ONLINE / OWA",
          "storyExcerpt": "Walking up to the enterprise diplomatic mailroom with a pass embossed by the consumer stamp, the spy slips straight through a validation blind spot that checks whether the ink stamp is authentic without…",
          "technicalParallel": "As Wiz Research highlighted, cryptographic signature verification alone is insufficient in multi-tenant cloud architectures unless the verifier strictly binds each signing key ID (kid) to its authorized…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Zero Book",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "SILENT OWA MAILBOX COLLECTION & CISA AA23-193A DETECTION",
          "storyExcerpt": "Inside the diplomatic post office, the spy quietly pulls selected executive letters through the web mail reader without leaving an ordinary sign-in trail, until federal defenders cross-check detailed…",
          "technicalParallel": "In response to this federal agency discovery, Microsoft revoked the compromised MSA key, patched cross-realm token validation, and made Purview MailItemsAccessed logging available across standard M365…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consumer Stamp",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Embassy Mail",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forged Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "microsoft-storm-0558-msa-signing-key",
      "sectionKey": "step-1",
      "sceneKind": "cld-storm0558-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Extracting the 2016 MSA Consumer Signing Key from a Crash Dump & Minting Forged Tokens (T1552.004)",
      "storyCue": "Having compromised an engineer workstation and combed through a diagnostic memory crash notebook, the espionage crew extracts a retired 2016 consumer-mailroom master wax stamp and begins embossing self-signed access passes at will.",
      "technicalCue": "T1552.004 · CREDENTIAL ACCESS — As detailed in Microsoft’s root-cause investigation, a 2021 consumer signing service crash accidentally included private key material for a 2016 Microsoft Account (MSA) consumer signing key…",
      "storyMappings": [
        {
          "storyTerm": "Diagnostic memory crash notebook",
          "technicalTerm": "Corporate engineer Windows crash dump containing leaked 2016 MSA consumer signing key",
          "tone": "amber"
        },
        {
          "storyTerm": "Retired 2016 consumer-mailroom wax stamp",
          "technicalTerm": "Inactive Microsoft Account (MSA) cryptographic key identified by its 2016 kid header",
          "tone": "sky"
        },
        {
          "storyTerm": "Embossing self-signed access passes at will",
          "technicalTerm": "Offline minting of arbitrary forged OWA authentication JWTs for target users",
          "tone": "rose"
        },
        {
          "storyTerm": "Stamp serial number exposing the forgery",
          "technicalTerm": "JWT header referencing the retired 2016 MSA consumer kid against enterprise endpoints",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-storm0558-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Diagnostic memory crash notebook",
          "subtitle": "Corporate engineer Windows crash dump containing leaked 2016…",
          "tone": "amber"
        },
        {
          "id": "cld-storm0558-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Retired 2016 consumer-mailroom wax stamp",
          "subtitle": "Inactive Microsoft Account (MSA) cryptographic key identified…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew 2016",
          "stageTag": "STEP 01 · SETUP",
          "title": "Diagnostic memory crash notebook",
          "storyExcerpt": "Having compromised an engineer workstation and combed through a diagnostic memory crash notebook, the espionage crew extracts a retired 2016 consumer-mailroom master wax stamp and begins…",
          "technicalParallel": "Because token forgery happens 100% offline using the stolen private signing key, the attacker never sends a password guess or MFA push to Microsoft Entra ID, generating zero failed-login alerts.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. 2016 Wax",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Retired 2016 consumer-mailroom wax stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses retired 2016 consumer-mailroom wax stamp to advance toward embossing self-signed access passes at will.",
          "technicalParallel": "As detailed in Microsoft’s root-cause investigation, a 2021 consumer signing service crash accidentally included private key material for a 2016 Microsoft Account (MSA) consumer signing key inside a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Self-signed Will",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Stamp serial number exposing the forgery",
          "storyExcerpt": "Behind the scenes, stamp serial number exposing the forgery captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Inspect OWA and Exchange Online token validation telemetry alongside CISA AA23-193A indicators (forensic guidance on Storm-0558) flagging JWT headers referencing the retired 2016 MSA consumer signing kid…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consumer Stamp",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Embassy Mail",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forged Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.004"
    },
    "step-2": {
      "scenarioId": "microsoft-storm-0558-msa-signing-key",
      "sectionKey": "step-2",
      "sceneKind": "cld-storm0558-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Bypassing Enterprise Realm Isolation in Exchange Online / OWA Token Validation (T1606.002)",
      "storyCue": "Walking up to the enterprise diplomatic mailroom with a pass embossed by the consumer stamp, the spy slips straight through a validation blind spot that checks whether the ink stamp is authentic without checking whether it belongs to the enterprise vault rather than the consumer desk.",
      "technicalCue": "T1606.002 · DEFENSE EVASION — When Storm-0558 sends the forged token to Outlook Web Access (outlook.office365.com/owa/), the OWA token validation library verifies the RSA signature against a shared metadata store containing…",
      "storyMappings": [
        {
          "storyTerm": "Validation blind spot between consumer and enterprise desks",
          "technicalTerm": "Exchange Online GetAccessTokenForResource realm isolation bypass",
          "tone": "amber"
        },
        {
          "storyTerm": "Zero entry in the main corporate front-gate logbook",
          "technicalTerm": "Complete absence of corresponding Microsoft Entra ID SignInLogs authentication events",
          "tone": "sky"
        },
        {
          "storyTerm": "Distinctive blank badge-issuer field",
          "technicalTerm": "Exchange audit entries showing AppId 00000002-0000-0ff1-ce00-000000000000 with empty ClientAppId",
          "tone": "rose"
        },
        {
          "storyTerm": "Entering diplomatic mailrooms silently",
          "technicalTerm": "Unauthenticated enterprise OWA session minted from a forged consumer-signed token",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-storm0558-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Validation blind spot between consumer…",
          "subtitle": "Exchange Online GetAccessTokenForResource realm isolation bypass",
          "tone": "amber"
        },
        {
          "id": "cld-storm0558-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Zero entry in the main corporate…",
          "subtitle": "Complete absence of corresponding Microsoft Entra ID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spot",
          "stageTag": "STEP 02 · SETUP",
          "title": "Validation blind spot between consumer and…",
          "storyExcerpt": "Walking up to the enterprise diplomatic mailroom with a pass embossed by the consumer stamp, the spy slips straight through a validation blind spot that checks whether the ink stamp is…",
          "technicalParallel": "As Wiz Research highlighted, cryptographic signature verification alone is insufficient in multi-tenant cloud architectures unless the verifier strictly binds each signing key ID (kid) to its authorized…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Zero Main",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Zero entry in the main corporate front-gate logbook",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses zero entry in the main corporate front-gate logbook to advance toward distinctive blank badge-issuer field.",
          "technicalParallel": "When Storm-0558 sends the forged token to Outlook Web Access (outlook.office365.com/owa/), the OWA token validation library verifies the RSA signature against a shared metadata store containing both…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Pass",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Entering diplomatic mailrooms silently",
          "storyExcerpt": "Behind the scenes, entering diplomatic mailrooms silently captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Audit Exchange Online Unified Audit Logs (central Microsoft 365 activity records) for AppId == \"00000002-0000-0ff1-ce00-000000000000\" paired with an empty ClientAppId and zero matching Entra ID…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consumer Stamp",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Embassy Mail",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forged Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1606.002"
    },
    "step-3": {
      "scenarioId": "microsoft-storm-0558-msa-signing-key",
      "sectionKey": "step-3",
      "sceneKind": "cld-storm0558-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Exfiltrating Diplomatic Mailboxes via OWA GetItem & Detecting via Purview MailItemsAccessed (T1114.002)",
      "storyCue": "Inside the diplomatic post office, the spy quietly pulls selected executive letters through the web mail reader without leaving an ordinary sign-in trail, until federal defenders cross-check detailed mail-access logs and spot the unusual proxy-relay stamp.",
      "technicalCue": "T1114.002 · EXFIL & IMPACT — Routing traffic through SoftEther VPN residential exit nodes (198.51.100.119), Storm-0558 invokes /owa/service.svc?action=FindItem and action=GetItem to download sensitive diplomatic and…",
      "storyMappings": [
        {
          "storyTerm": "Pulling selected executive letters quietly",
          "technicalTerm": "OWA GetItem REST calls harvesting high-value diplomatic and government emails",
          "tone": "amber"
        },
        {
          "storyTerm": "Detailed mail-access ledger catching the raid",
          "technicalTerm": "Microsoft Purview MailItemsAccessed (OfficeActivity / CloudAppEvents) telemetry",
          "tone": "sky"
        },
        {
          "storyTerm": "Unusual proxy-relay stamp inside the receipt",
          "technicalTerm": "ClientInfoString containing Action=ViaProxy paired with Exchange Online AppId",
          "tone": "rose"
        },
        {
          "storyTerm": "Global key revocation shutting every forged pass",
          "technicalTerm": "Microsoft revoking all legacy MSA consumer keys and tightening enterprise token scope checks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-storm0558-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pulling selected executive letters quietly",
          "subtitle": "OWA GetItem REST calls harvesting high-value diplomatic and…",
          "tone": "amber"
        },
        {
          "id": "cld-storm0558-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Detailed mail-access ledger catching the…",
          "subtitle": "Microsoft Purview MailItemsAccessed (OfficeActivity /…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Post Spy",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pulling selected executive letters quietly",
          "storyExcerpt": "Inside the diplomatic post office, the spy quietly pulls selected executive letters through the web mail reader without leaving an ordinary sign-in trail, until federal defenders cross-check…",
          "technicalParallel": "In response to this federal agency discovery, Microsoft revoked the compromised MSA key, patched cross-realm token validation, and made Purview MailItemsAccessed logging available across standard M365…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Mail-access Raid",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Detailed mail-access ledger catching the raid",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses detailed mail-access ledger catching the raid to advance toward unusual proxy-relay stamp inside the receipt.",
          "technicalParallel": "Routing traffic through SoftEther VPN residential exit nodes (198.51.100.119), Storm-0558 invokes /owa/service.svc?action=FindItem and action=GetItem to download sensitive diplomatic and government emails.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Pass",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Global key revocation shutting every forged pass",
          "storyExcerpt": "Behind the scenes, global key revocation shutting every forged pass captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Run KQL hunting queries across OfficeActivity and CloudAppEvents (Microsoft Purview advanced mailbox audit streams) filtering for Operation == \"MailItemsAccessed\", AppId ==…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consumer Stamp",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Embassy Mail",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forged Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1114.002"
    },
    "memory-forensics": {
      "scenarioId": "microsoft-storm-0558-msa-signing-key",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-storm0558-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1552.004",
      "title": "Storm-0558: Acquired MSA Consumer Signing Key & Forged OWA/Exchange… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of consumer stamp beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: storm0558_forger.py (RSA-2048 Private Key Buffer (MSA 2016 Key) [R--])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of storm0558_forger.py",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F9C01204000 (R--, 4 KB) · RSA-2048 Private Key Buffer (MSA 2016 Key)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against storm0558_forger.py (PID 3810)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Extracted MSA consumer signing key used to sign forged enterprise Exchange Online tokens.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-storm0558-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of…",
          "tone": "sky"
        },
        {
          "id": "cld-storm0558-memory-xray-right",
          "tag": "LIVE MEMORY · R--",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F9C01204000 (R--, 4 KB) · RSA-2048 Private Key Buffer…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline storm0558_forger.py loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F9C01204000 (R--, 4 KB) containing RSA-2048 Private Key Buffer (MSA 2016 Key).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 3810 confirms injected region: Extracted MSA consumer signing key used to sign forged enterprise Exchange Online tokens.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "okta-har-file-session-token-hijack": {
    "briefing": {
      "scenarioId": "okta-har-file-session-token-hijack",
      "sectionKey": "briefing",
      "sceneKind": "cld-okta-har-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1539",
      "title": "Support Case .har File sid Session Token Theft & Admin API Token Minting — Story-to-Technical Overview",
      "storyCue": "Imagine a busy customer-support desk where enterprise administrators mail in full browser traffic recordings to help troubleshoot login glitches, forgetting to black out their own live master wristbands printed inside the packet headers. After breaching the support ticket vault, an intruder lifts those still-live master wristbands straight out of the uploaded recordings, replays them from an overseas proxy to walk straight past multi-factor locks, and mints permanent master service keys before alert response teams slam the door.",
      "technicalCue": "CREDENTIAL ACCESS: EXTRACTING LIVE SID SESSION COOKIES FROM SUPPORT .HAR FILES -> DEFENSE EVASION: REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE -> PERSISTENCE: MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION",
      "storyMappings": [
        {
          "storyTerm": "Uploaded troubleshooting recordings leaking live wristbands",
          "technicalTerm": "Unsanitized browser .har files exposing Cookie: sid=... and X-Okta-XsrfToken headers",
          "tone": "amber"
        },
        {
          "storyTerm": "Replaying live wristbands from an overseas proxy past MFA locks",
          "technicalTerm": "Hijacking *-admin.okta.com Super Admin sessions from a foreign VPN ASN (T1550.004)",
          "tone": "sky"
        },
        {
          "storyTerm": "Minting permanent master keys before defenders slam the door",
          "technicalTerm": "Calling system.api_token.create to mint Okta SSWS API tokens or rogue IdPs",
          "tone": "rose"
        },
        {
          "storyTerm": "Real-time security desk catching the teleporting wristband",
          "technicalTerm": "Okta System Log alerting on externalSessionId ASN shift followed by privilege grants",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-okta-har-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Uploaded troubleshooting recordings…",
          "subtitle": "Unsanitized browser .har files exposing Cookie: sid=... and…",
          "tone": "amber"
        },
        {
          "id": "cld-okta-har-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Replaying live wristbands from an…",
          "subtitle": "Hijacking *-admin.okta.com Super Admin sessions from a foreign…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "EXTRACTING LIVE SID SESSION COOKIES FROM SUPPORT .HAR FILES",
          "storyExcerpt": "Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator session…",
          "technicalParallel": "A .har file is not just a screenshot or timing chart; by specification, it is a full JSON archive of every HTTP request and response header, cookie, and POST body transmitted by the browser tab during…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Live Past",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "REPLAYING SID COOKIE TO BYPASS MFA IN OKTA ADMIN CONSOLE",
          "storyExcerpt": "Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a password or…",
          "technicalParallel": "Why did BeyondTrust’s identity policy block the attacker at the console while other tenants allowed access?",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keys Runs",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "MINTING PERSISTENT SSWS API TOKENS & SIRT SESSION REVOCATION",
          "storyExcerpt": "Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master service keys or bolt on a rogue identity bridge…",
          "technicalParallel": "Following this incident, Cloudflare released an open-source client-side HAR Sanitizer (har-sanitizer.pages.dev) that automatically strips Cookie, Set-Cookie, and Authorization values before engineers…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Identity Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Overseas Proxy",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Live Band",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "okta-har-file-session-token-hijack",
      "sectionKey": "step-1",
      "sceneKind": "cld-okta-har-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Harvesting Live Cookie: sid=... Tokens from Unsanitized Browser .har Captures (T1539)",
      "storyCue": "Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator session wristbands still stamped inside the headers.",
      "technicalCue": "T1539 · CREDENTIAL ACCESS — Using a compromised Okta support service account, the threat actor downloads HTTP Archive (.har) files attached to customer support tickets and parses the JSON entries[].request.cookies array…",
      "storyMappings": [
        {
          "storyTerm": "Raw browser network recordings in support tickets",
          "technicalTerm": "HTTP Archive (.har) JSON diagnostic files uploaded to the Okta support portal",
          "tone": "amber"
        },
        {
          "storyTerm": "Active unredacted administrator wristbands inside headers",
          "technicalTerm": "Live Cookie: sid=... session cookies and X-Okta-XsrfToken values for *-admin.okta.com",
          "tone": "sky"
        },
        {
          "storyTerm": "Forgetting to black out secrets before mailing",
          "technicalTerm": "Unsanitized HAR exports preserving live authentication cookies in plaintext JSON",
          "tone": "rose"
        },
        {
          "storyTerm": "Support cabinet breach feeding downstream targets",
          "technicalTerm": "Upstream support-system access enabling targeted downstream enterprise takeovers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-okta-har-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Raw browser network recordings in…",
          "subtitle": "HTTP Archive (.har) JSON diagnostic files uploaded to the Okta…",
          "tone": "amber"
        },
        {
          "id": "cld-okta-har-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Active unredacted administrator…",
          "subtitle": "Live Cookie: sid=... session cookies and X-Okta-XsrfToken…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw It",
          "stageTag": "STEP 01 · SETUP",
          "title": "Raw browser network recordings in support tickets",
          "storyExcerpt": "Ransacking a compromised support-case filing cabinet, the intruder opens raw browser network recordings uploaded by helpful IT admins and immediately extracts active, unredacted administrator…",
          "technicalParallel": "A .har file is not just a screenshot or timing chart; by specification, it is a full JSON archive of every HTTP request and response header, cookie, and POST body transmitted by the browser tab during…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Active unredacted administrator wristbands inside…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses active unredacted administrator wristbands inside headers to advance toward forgetting to black out secrets before mailing.",
          "technicalParallel": "Using a compromised Okta support service account, the threat actor downloads HTTP Archive (.har) files attached to customer support tickets and parses the JSON entries[].request.cookies array to extract…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Raw It",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Support cabinet breach feeding downstream targets",
          "storyExcerpt": "Behind the scenes, support cabinet breach feeding downstream targets captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Scan outbound support attachments and CI/browser diagnostic dumps for .har JSON files containing \"name\": \"sid\" and \"X-Okta-XsrfToken\" headers targeting *-admin.okta.com (enforcing automated HAR…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Identity Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Overseas Proxy",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Live Band",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1539"
    },
    "step-2": {
      "scenarioId": "okta-har-file-session-token-hijack",
      "sectionKey": "step-2",
      "sceneKind": "cld-okta-har-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Replaying the sid Cookie from a Foreign VPN ASN to Bypass MFA (T1550.004)",
      "storyCue": "Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a password or touching a hardware security key.",
      "technicalCue": "T1550.004 · DEFENSE EVASION — Within 30 minutes of the .har file upload, the attacker sends an HTTPS GET request from a commercial VPN exit node (198.51.100.205, ASN 9009) to https://corp-admin.okta.com/admin/dashboard…",
      "storyMappings": [
        {
          "storyTerm": "Pasting the lifted wristband into their own browser",
          "technicalTerm": "Injecting stolen sid cookie to impersonate the authenticated Okta administrator",
          "tone": "amber"
        },
        {
          "storyTerm": "Walking straight past passwords and hardware security keys",
          "technicalTerm": "Web Session Cookie replay (MITRE T1550.004) bypassing FIDO2/WebAuthn MFA completely",
          "tone": "sky"
        },
        {
          "storyTerm": "Impossible geographic jump of the same wristband",
          "technicalTerm": "Identical externalSessionId suddenly appearing from a foreign commercial VPN ASN",
          "tone": "rose"
        },
        {
          "storyTerm": "Super Admin control panel reached",
          "technicalTerm": "Full administrative access to the victim enterprise *-admin.okta.com tenant",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-okta-har-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pasting the lifted wristband into their…",
          "subtitle": "Injecting stolen sid cookie to impersonate the authenticated…",
          "tone": "amber"
        },
        {
          "id": "cld-okta-har-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Walking straight past passwords and…",
          "subtitle": "Web Session Cookie replay (MITRE T1550.004) bypassing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Own Vpn",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pasting the lifted wristband into their own browser",
          "storyExcerpt": "Pasting the lifted session wristband straight into their own browser from an overseas VPN booth, the intruder walks straight into the victim Super Admin control panel without ever typing a…",
          "technicalParallel": "Why did BeyondTrust’s identity policy block the attacker at the console while other tenants allowed access?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Past Keys",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Walking straight past passwords and hardware…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses walking straight past passwords and hardware security keys to advance toward impossible geographic jump of the same wristband.",
          "technicalParallel": "Within 30 minutes of the .har file upload, the attacker sends an HTTPS GET request from a commercial VPN exit node (198.51.100.205, ASN 9009) to https://corp-admin.okta.com/admin/dashboard carrying…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Jump Same",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Super Admin control panel reached",
          "storyExcerpt": "Behind the scenes, super admin control panel reached captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Cloudflare SIRT & Okta: Okta System Log showing a single authenticationContext.externalSessionId associated with count_distinct(securityContext.asNumber) > 1 or changing client.userAgent.os.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Identity Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Overseas Proxy",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Live Band",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.004"
    },
    "step-3": {
      "scenarioId": "okta-har-file-session-token-hijack",
      "sectionKey": "step-3",
      "sceneKind": "cld-okta-har-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Minting an Okta SSWS API Token (system.api_token.create) & Real-Time SIRT Revocation (T1098.001)",
      "storyCue": "Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master service keys or bolt on a rogue identity bridge, triggering real-time security alarms at vigilant defender centers.",
      "technicalCue": "T1098.001 · PERSISTENCE — Because the stolen sid cookie is tied to the victim admin’s browser session lifetime, the attacker immediately navigates to Security -> API -> Tokens in the Okta Admin Console to invoke…",
      "storyMappings": [
        {
          "storyTerm": "Printing permanent master service keys before the clock runs out",
          "technicalTerm": "Okta System Log event system.api_token.create minting long-lived SSWS API tokens",
          "tone": "amber"
        },
        {
          "storyTerm": "Bolting on a rogue identity bridge or boosting privileges",
          "technicalTerm": "user.account.privilege.grant or system.idp.lifecycle.create persistence attempts",
          "tone": "sky"
        },
        {
          "storyTerm": "Vigilant defender centers spotting the ASN jump",
          "technicalTerm": "Cloudflare SIRT and BeyondTrust real-time correlation on externalSessionId ASN shift",
          "tone": "rose"
        },
        {
          "storyTerm": "Slamming the door shut instantly",
          "technicalTerm": "Automated session revocation and IP-binding policies invalidating replayed cookies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-okta-har-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Printing permanent master service keys…",
          "subtitle": "Okta System Log event system.api_token.create minting…",
          "tone": "amber"
        },
        {
          "id": "cld-okta-har-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Bolting on a rogue identity bridge or…",
          "subtitle": "user.account.privilege.grant or system.idp.lifecycle.create…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Runs",
          "stageTag": "STEP 03 · SETUP",
          "title": "Printing permanent master service counter keys…",
          "storyExcerpt": "Racing against the clock before the temporary wristband expires or defenders spot the sudden address jump, the intruder attempts to print permanent master service counter keys or bolt on a…",
          "technicalParallel": "Following this incident, Cloudflare released an open-source client-side HAR Sanitizer (har-sanitizer.pages.dev) that automatically strips Cookie, Set-Cookie, and Authorization values before engineers…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Asn",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Bolting on a rogue identity bridge or boosting…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses bolting on a rogue identity bridge or boosting privileges to advance toward vigilant defender centers spotting the asn jump.",
          "technicalParallel": "Because the stolen sid cookie is tied to the victim admin’s browser session lifetime, the attacker immediately navigates to Security -> API -> Tokens in the Okta Admin Console to invoke…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Asn Jump",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Slamming the door shut instantly",
          "storyExcerpt": "Behind the scenes, slamming the door shut instantly captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Okta System Logs (central identity audit events) for system.api_token.create, user.account.privilege.grant, or system.idp.lifecycle.create occurring immediately after an ASN or IP change on the…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Identity Desk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Overseas Proxy",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Live Band",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "memory-forensics": {
      "scenarioId": "okta-har-file-session-token-hijack",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-okta-har-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1539",
      "title": "Support Case .har File sid Session Token Theft & Admin API Token Minting — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of identity desk beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: har_sid_extractor.py (Parsed .har Cookie Entry (Heap) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of har_sid_extractor.py",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F3D20108000 (RW-, 16 KB) · Parsed .har Cookie Entry (Heap)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against har_sid_extractor.py (PID 9204)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Extracted Okta sid session token and _xsrfToken parsed from the support case .har file.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-okta-har-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of…",
          "tone": "sky"
        },
        {
          "id": "cld-okta-har-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F3D20108000 (RW-, 16 KB) · Parsed .har Cookie Entry…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline har_sid_extractor.py loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F3D20108000 (RW-, 16 KB) containing Parsed .har Cookie Entry (Heap).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 9204 confirms injected region: Extracted Okta sid session token and _xsrfToken parsed from the support case .har file.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "snowflake-unc5537-saas-extortion": {
    "briefing": {
      "scenarioId": "snowflake-unc5537-saas-extortion",
      "sectionKey": "briefing",
      "sceneKind": "cld-snowflake-saas-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078.004",
      "title": "UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake)… — Story-to-Technical Overview",
      "storyCue": "Imagine a massive cloud data warehouse where hundreds of companies store customer archives behind a front door that still relies solely on static passwords without pocket codes. Using passwords scooped earlier from home computers, an intruder drives up through anonymous rental vans, sends a fast automated catalog robot down every aisle to locate the richest vaults, and stages giant customer tables into personal loading bays before hauling them away with a standard database viewer.",
      "technicalCue": "INITIAL ACCESS: INFOSTEALER CREDENTIAL REPLAY ON SINGLE-FACTOR TENANT -> CREDENTIAL ACCESS: FROSTBITE (RAPEFLAKE) AUTOMATED SCHEMA RECONNAISSANCE -> EXFIL & IMPACT: DBEAVER ULTIMATE BULK STAGE & MULTI-GB EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Passwords scooped from home computers used at a single-lock front door",
          "technicalTerm": "Infostealer credential replay against single-factor Snowflake accounts lacking MFA",
          "tone": "amber"
        },
        {
          "storyTerm": "Fast automated catalog robot scanning every aisle",
          "technicalTerm": "FROSTBITE (Rapeflake) utility rapidly enumerating Snowflake schemas and roles",
          "tone": "sky"
        },
        {
          "storyTerm": "Staging giant customer tables into personal loading bays",
          "technicalTerm": "SQL COPY INTO @~ staging multi-gigabyte tables into user internal stages",
          "tone": "rose"
        },
        {
          "storyTerm": "Hauling archives away with a standard database viewer",
          "technicalTerm": "Bulk GET downloads through DBeaver Ultimate for mass extortion",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-snowflake-saas-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Passwords scooped from home computers…",
          "subtitle": "Infostealer credential replay against single-factor Snowflake…",
          "tone": "amber"
        },
        {
          "id": "cld-snowflake-saas-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Fast automated catalog robot scanning…",
          "subtitle": "FROSTBITE (Rapeflake) utility rapidly enumerating Snowflake…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Vans",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "INFOSTEALER CREDENTIAL REPLAY ON SINGLE-FACTOR TENANT",
          "storyExcerpt": "Arriving through masked commercial relay vans, the intruder tests a stack of stolen employee passwords harvested months earlier from infected personal laptops against cloud warehouse accounts that never…",
          "technicalParallel": "Because service accounts like SVC_TABLEAU_ETL were frequently configured with static passwords and exempted from MFA to support legacy BI pipelines, possessing a single unrotated password gave UNC5537…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. High-speed",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "FROSTBITE (RAPEFLAKE) AUTOMATED SCHEMA RECONNAISSANCE",
          "storyExcerpt": "Once past the front turnstile, the intruder releases a custom high-speed inventory scout that races through every warehouse aisle, listing all databases, privileges, and billing tables in seconds while…",
          "technicalParallel": "Every SQL query and client driver string in Snowflake is immutably recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS, exposing the literal \"Rapeflake\" and \"DBeaver_DBeaverUltimate\"…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Own Bulk",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "DBEAVER ULTIMATE BULK STAGE & MULTI-GB EXFILTRATION",
          "storyExcerpt": "Selecting the richest customer vaults, the intruder orders the warehouse own bulk forklift to pack entire archives onto their personal loading platform and then downloads the multi-gigabyte crates…",
          "technicalParallel": "Staging data into an internal user stage (@~) or temporary stage via COPY INTO leverages Snowflake’s parallel virtual warehouse compute to dump gigabytes of records in seconds.",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Single Lock",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Archive Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Bulk Export",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "snowflake-unc5537-saas-extortion",
      "sectionKey": "step-1",
      "sceneKind": "cld-snowflake-saas-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Replaying Infostealer-Harvested Credentials Against Single-Factor Snowflake Accounts (T1078.004)",
      "storyCue": "Arriving through masked commercial relay vans, the intruder tests a stack of stolen employee passwords harvested months earlier from infected personal laptops against cloud warehouse accounts that never required a second pocket-code lock.",
      "technicalCue": "T1078.004 · INITIAL ACCESS — UNC5537 searches millions of historical infostealer malware logs (harvested by RedLine, Vidar, and LummaC2 from contractor laptops infected months or years earlier) for URLs matching…",
      "storyMappings": [
        {
          "storyTerm": "Masked commercial relay vans",
          "technicalTerm": "Mullvad VPN and commercial anonymizer exit IPs masking UNC5537 origin",
          "tone": "amber"
        },
        {
          "storyTerm": "Stolen employee passwords from infected laptops",
          "technicalTerm": "Infostealer-harvested credentials replayed across enterprise Snowflake tenants",
          "tone": "sky"
        },
        {
          "storyTerm": "Front door lacking a second pocket-code lock",
          "technicalTerm": "FIRST_AUTHENTICATION_FACTOR = PASSWORD with SECOND_AUTHENTICATION_FACTOR IS NULL",
          "tone": "rose"
        },
        {
          "storyTerm": "Warehouse front-desk sign-in ledger",
          "technicalTerm": "SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY recording single-factor external logins",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-snowflake-saas-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Masked commercial relay vans",
          "subtitle": "Mullvad VPN and commercial anonymizer exit IPs masking UNC5537…",
          "tone": "amber"
        },
        {
          "id": "cld-snowflake-saas-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Stolen employee passwords from infected…",
          "subtitle": "Infostealer-harvested credentials replayed across enterprise…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Vans",
          "stageTag": "STEP 01 · SETUP",
          "title": "Masked commercial relay vans",
          "storyExcerpt": "Arriving through masked commercial relay vans, the intruder tests a stack of stolen employee passwords harvested months earlier from infected personal laptops against cloud warehouse accounts…",
          "technicalParallel": "Because service accounts like SVC_TABLEAU_ETL were frequently configured with static passwords and exempted from MFA to support legacy BI pipelines, possessing a single unrotated password gave UNC5537…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Door",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Stolen employee passwords from infected laptops",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stolen employee passwords from infected laptops to advance toward front door lacking a second pocket-code lock.",
          "technicalParallel": "UNC5537 searches millions of historical infostealer malware logs (harvested by RedLine, Vidar, and LummaC2 from contractor laptops infected months or years earlier) for URLs matching…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Door Lock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Warehouse front-desk sign-in ledger",
          "storyExcerpt": "Behind the scenes, warehouse front-desk sign-in ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Query SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY (the warehouse immutable sign-in audit table) for sessions where FIRST_AUTHENTICATION_FACTOR = PASSWORD and SECOND_AUTHENTICATION_FACTOR IS NULL originating…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Single Lock",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Archive Silos",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Bulk Export",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-2": {
      "scenarioId": "snowflake-unc5537-saas-extortion",
      "sectionKey": "step-2",
      "sceneKind": "cld-snowflake-saas-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Running the FROSTBITE (Rapeflake) Utility for Rapid Schema & Role Reconnaissance (T1087.004)",
      "storyCue": "Once past the front turnstile, the intruder releases a custom high-speed inventory scout that races through every warehouse aisle, listing all databases, privileges, and billing tables in seconds while leaving its distinct maker stamp in the visitor log.",
      "technicalCue": "T1087.004 · CREDENTIAL ACCESS — Immediately after authenticating, the operator runs a custom .NET reconnaissance tool tracked by Mandiant as FROSTBITE (which identifies itself in Snowflake’s CLIENT_APPLICATION_ID telemetry…",
      "storyMappings": [
        {
          "storyTerm": "Custom high-speed inventory scout",
          "technicalTerm": "FROSTBITE (Rapeflake) automated Snowflake reconnaissance utility",
          "tone": "amber"
        },
        {
          "storyTerm": "Listing every aisle, privilege, and billing table",
          "technicalTerm": "Rapid schema, role, and high-value table enumeration across customer databases",
          "tone": "sky"
        },
        {
          "storyTerm": "Distinct maker stamp left in the visitor log",
          "technicalTerm": "CLIENT_ENVIRONMENT JSON containing \"APPLICATION\": \"Rapeflake\" or \"DBeaver_DBeaverUltimate\"",
          "tone": "rose"
        },
        {
          "storyTerm": "Warehouse session register",
          "technicalTerm": "SNOWFLAKE.ACCOUNT_USAGE.SESSIONS tracking client tool metadata",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-snowflake-saas-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Custom high-speed inventory scout",
          "subtitle": "FROSTBITE (Rapeflake) automated Snowflake reconnaissance utility",
          "tone": "amber"
        },
        {
          "id": "cld-snowflake-saas-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Listing every aisle, privilege, and…",
          "subtitle": "Rapid schema, role, and high-value table enumeration across…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-speed",
          "stageTag": "STEP 02 · SETUP",
          "title": "Custom high-speed inventory scout",
          "storyExcerpt": "Once past the front turnstile, the intruder releases a custom high-speed inventory scout that races through every warehouse aisle, listing all databases, privileges, and billing tables in…",
          "technicalParallel": "Every SQL query and client driver string in Snowflake is immutably recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS, exposing the literal \"Rapeflake\" and \"DBeaver_DBeaverUltimate\"…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Left",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Listing every aisle, privilege, and billing table",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses listing every aisle, privilege, and billing table to advance toward distinct maker stamp left in the visitor log.",
          "technicalParallel": "Immediately after authenticating, the operator runs a custom .NET reconnaissance tool tracked by Mandiant as FROSTBITE (which identifies itself in Snowflake’s CLIENT_APPLICATION_ID telemetry under its…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Log",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Warehouse session register",
          "storyExcerpt": "Behind the scenes, warehouse session register captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Inspect CLIENT_ENVIRONMENT metadata inside SNOWFLAKE.ACCOUNT_USAGE.SESSIONS (which records exact client software identifiers for every authenticated connection) for \"APPLICATION\": \"Rapeflake\" or…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Single Lock",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Archive Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Bulk Export",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1087.004"
    },
    "step-3": {
      "scenarioId": "snowflake-unc5537-saas-extortion",
      "sectionKey": "step-3",
      "sceneKind": "cld-snowflake-saas-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Staging Multi-GB Tables via COPY INTO @~ & Downloading with DBeaver Ultimate (T1530)",
      "storyCue": "Selecting the richest customer vaults, the intruder orders the warehouse own bulk forklift to pack entire archives onto their personal loading platform and then downloads the multi-gigabyte crates straight through an ordinary desktop query app.",
      "technicalCue": "T1530 · EXFIL & IMPACT — To extract tens of millions of rows without timing out, the operator connects via DBeaver Ultimate (using the official Snowflake JDBC driver) and executes COPY INTO @~/dump/customers.csv.gz…",
      "storyMappings": [
        {
          "storyTerm": "Warehouse own bulk forklift packing archives",
          "technicalTerm": "SQL COPY INTO @~ exporting full production tables into the user internal stage",
          "tone": "amber"
        },
        {
          "storyTerm": "Personal loading platform",
          "technicalTerm": "Snowflake per-user internal stage (@~) holding compressed CSV/Parquet dumps",
          "tone": "sky"
        },
        {
          "storyTerm": "Ordinary desktop query app hauling crates out",
          "technicalTerm": "SQL GET commands executed via DBeaver Ultimate pulling staged files externally",
          "tone": "rose"
        },
        {
          "storyTerm": "Loading-dock scale flagging massive outbound weight",
          "technicalTerm": "QUERY_HISTORY showing QUERY_TYPE IN (COPY, GET) with massive BYTES_WRITTEN_TO_RESULT",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-snowflake-saas-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Warehouse own bulk forklift packing…",
          "subtitle": "SQL COPY INTO @~ exporting full production tables into the…",
          "tone": "amber"
        },
        {
          "id": "cld-snowflake-saas-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Personal loading platform",
          "subtitle": "Snowflake per-user internal stage (@~) holding compressed…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Own Bulk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Warehouse own bulk forklift packing archives",
          "storyExcerpt": "Selecting the richest customer vaults, the intruder orders the warehouse own bulk forklift to pack entire archives onto their personal loading platform and then downloads the multi-gigabyte…",
          "technicalParallel": "Staging data into an internal user stage (@~) or temporary stage via COPY INTO leverages Snowflake’s parallel virtual warehouse compute to dump gigabytes of records in seconds.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses App",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Personal loading platform",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses personal loading platform to advance toward ordinary desktop query app hauling crates out.",
          "technicalParallel": "To extract tens of millions of rows without timing out, the operator connects via DBeaver Ultimate (using the official Snowflake JDBC driver) and executes COPY INTO @~/dump/customers.csv.gz FROM…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. App Out",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Loading-dock scale flagging massive outbound weight",
          "storyExcerpt": "Behind the scenes, loading-dock scale flagging massive outbound weight captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY (which logs every executed SQL statement and data volume) where QUERY_TYPE IN (COPY, GET) exhibits anomalous spikes in BYTES_WRITTEN_TO_RESULT from…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Single Lock",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Archive Silos",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Bulk Export",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    },
    "memory-forensics": {
      "scenarioId": "snowflake-unc5537-saas-extortion",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-snowflake-saas-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1078.004",
      "title": "UNC5537 Campaign: Infostealer Credential Replay & FROSTBITE (Rapeflake)… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of single lock beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: Rapeflake.exe (FROSTBITE) (.text (FROSTBITE JDBC Reconnaissance Module) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of Rapeflake.exe (FROSTBITE)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF910440000 (R-X, 128 KB) · .text (FROSTBITE JDBC Reconnaissance Module)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against Rapeflake.exe (FROSTBITE) (PID 6120)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Custom .NET assembly automating credential stuffing and SHOW TABLES / SHOW USERS queries against Snowflake tenants.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-snowflake-saas-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of Rapeflake.exe…",
          "tone": "sky"
        },
        {
          "id": "cld-snowflake-saas-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF910440000 (R-X, 128 KB) · .text (FROSTBITE JDBC…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline Rapeflake.exe (FROSTBITE) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007FF910440000 (R-X, 128 KB) containing .text (FROSTBITE JDBC Reconnaissance Module).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 6120 confirms injected region: Custom .NET assembly automating credential stuffing and SHOW TABLES / SHOW USERS queries against Snowflake tenants.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "sysdig-scarleteel-aws-eks-terraform": {
    "briefing": {
      "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
      "sectionKey": "briefing",
      "sceneKind": "cld-scarleteel-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft &… — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud shipping port where an unguarded storefront kiosk accidentally lets an outsider peek into the local dockworker badge tray. Lifting the dockworker temporary badge, the intruder opens a storage locker holding the port complete paper blueprint book, which still has plaintext master cloud keys scribbled in the margins, and uses an automated cloud-raiding toolkit to sweep proprietary designs and compute power across neighboring accounts.",
      "technicalCue": "INITIAL ACCESS: KUBERNETES POD RCE & NODE IMDS CREDENTIAL HARVESTING -> CREDENTIAL ACCESS: S3 TERRAFORM STATE (.TFSTATE) PLAINTEXT SECRET EXTRACTION -> LATERAL & C2: CROSS-ACCOUNT PACU PIVOT & PROPRIETARY CODE EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Unguarded storefront kiosk leaking the dockworker badge tray",
          "technicalTerm": "Exposed EKS workload pod RCE harvesting worker node IMDS IAM credentials",
          "tone": "amber"
        },
        {
          "storyTerm": "Port blueprint book with plaintext master keys in the margins",
          "technicalTerm": "S3 terraform.tfstate files leaking plaintext AWS IAM static secret keys",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated cloud-raiding toolkit sweeping neighboring accounts",
          "technicalTerm": "Pacu AWS exploitation framework pivoting across accounts via CreateAccessKey",
          "tone": "rose"
        },
        {
          "storyTerm": "Stealing proprietary designs and hijacking compute rigs",
          "technicalTerm": "Exfiltrating intellectual property (GetFunction / S3) and launching crypto miners",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-scarleteel-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unguarded storefront kiosk leaking the…",
          "subtitle": "Exposed EKS workload pod RCE harvesting worker node IMDS IAM…",
          "tone": "amber"
        },
        {
          "id": "cld-scarleteel-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Port blueprint book with plaintext…",
          "subtitle": "S3 terraform.tfstate files leaking plaintext AWS IAM static…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Flaw",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "KUBERNETES POD RCE & NODE IMDS CREDENTIAL HARVESTING",
          "storyExcerpt": "Exploiting a public web flaw on a containerized kiosk inside the cluster, the intruder reaches straight out to the underlying server local badge dispenser and grabs the temporary cloud key assigned to…",
          "technicalParallel": "On Kubernetes nodes hosted on EC2, pods operate one network router hop inside the node; if HttpPutResponseHopLimit is >= 2, any compromised pod can reach the underlying EC2 worker node’s IMDS endpoint…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Port Book",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "S3 TERRAFORM STATE (.TFSTATE) PLAINTEXT SECRET EXTRACTION",
          "storyExcerpt": "Using the borrowed dockworker badge to browse cloud storage buckets, the intruder spots the engineering team infrastructure state ledgers sitting unguarded and pulls out long-lived master cloud keys…",
          "technicalParallel": "As Sysdig highlighted in their SCARLETEEL analysis, Terraform state files are a goldmine for cloud attackers: they not only contain plaintext secrets, but also map out every VPC, account ID, and S3…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keys Up",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "CROSS-ACCOUNT PACU PIVOT & PROPRIETARY CODE EXFILTRATION",
          "storyExcerpt": "Armed with the freshly discovered permanent master keys, the intruder spins up an automated cloud-exploitation toolkit to mint backdoor keys, cross over into linked corporate cloud accounts, download…",
          "technicalParallel": "While SCARLETEEL sometimes deploys XMRig miners on compromised Kubernetes nodes, Sysdig proved that cryptomining is often a noisy distraction while the operators exfiltrate high-value intellectual…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Pier",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "State Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Pivot",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
      "sectionKey": "step-1",
      "sceneKind": "cld-scarleteel-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Exploiting an Exposed EKS Workload Pod & Harvesting Node IMDS Credentials (T1190)",
      "storyCue": "Exploiting a public web flaw on a containerized kiosk inside the cluster, the intruder reaches straight out to the underlying server local badge dispenser and grabs the temporary cloud key assigned to the entire worker node.",
      "technicalCue": "T1190 · INITIAL ACCESS — SCARLETEEL exploits a remote code execution flaw on a public-facing Kubernetes workload pod (ml-notebook-prod-6d8f9), downloads static binaries (aws-cli, kubectl, and trufflehog) into /tmp…",
      "storyMappings": [
        {
          "storyTerm": "Public web flaw on a containerized kiosk",
          "technicalTerm": "Initial RCE inside an internet-exposed Amazon EKS workload pod",
          "tone": "amber"
        },
        {
          "storyTerm": "Underlying server local badge dispenser",
          "technicalTerm": "EC2 Instance Metadata Service (169.254.169.254) reachable from pod network",
          "tone": "sky"
        },
        {
          "storyTerm": "Temporary cloud key assigned to the entire worker node",
          "technicalTerm": "Over-privileged eks-node-role STS credentials shared by all pods on the node",
          "tone": "rose"
        },
        {
          "storyTerm": "Stepping out of the container into the cloud control plane",
          "technicalTerm": "Transition from application RCE to AWS API access using harvested node IAM keys",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-scarleteel-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public web flaw on a containerized kiosk",
          "subtitle": "Initial RCE inside an internet-exposed Amazon EKS workload pod",
          "tone": "amber"
        },
        {
          "id": "cld-scarleteel-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Underlying server local badge dispenser",
          "subtitle": "EC2 Instance Metadata Service (169.254.169.254) reachable from…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Flaw",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public web flaw on a containerized kiosk",
          "storyExcerpt": "Exploiting a public web flaw on a containerized kiosk inside the cluster, the intruder reaches straight out to the underlying server local badge dispenser and grabs the temporary cloud key…",
          "technicalParallel": "On Kubernetes nodes hosted on EC2, pods operate one network router hop inside the node; if HttpPutResponseHopLimit is >= 2, any compromised pod can reach the underlying EC2 worker node’s IMDS endpoint…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Underlying server local badge dispenser",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses underlying server local badge dispenser to advance toward temporary cloud key assigned to the entire worker node.",
          "technicalParallel": "SCARLETEEL exploits a remote code execution flaw on a public-facing Kubernetes workload pod (ml-notebook-prod-6d8f9), downloads static binaries (aws-cli, kubectl, and trufflehog) into /tmp (triggering a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Node",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Stepping out of the container into the cloud control…",
          "storyExcerpt": "Behind the scenes, stepping out of the container into the cloud control plane captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Sysdig TRT: Falco eBPF alert for downloading/executing aws or trufflehog inside a running container (container_drift).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Pier",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "State Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Pivot",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
      "sectionKey": "step-2",
      "sceneKind": "cld-scarleteel-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Extracting Plaintext AWS IAM Secret Keys from S3 terraform.tfstate Files (T1552.001)",
      "storyCue": "Using the borrowed dockworker badge to browse cloud storage buckets, the intruder spots the engineering team infrastructure state ledgers sitting unguarded and pulls out long-lived master cloud keys written right inside them in plain sight.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Using the stolen eks-node-role credentials, the attacker lists accessible S3 buckets, spots the Infrastructure-as-Code state backend (s3://corp-devops-tfstate-prod/prod/terraform.tfstate), and…",
      "storyMappings": [
        {
          "storyTerm": "Infrastructure state ledgers sitting in cloud storage",
          "technicalTerm": "Amazon S3 objects ending in terraform.tfstate storing full deployment state",
          "tone": "amber"
        },
        {
          "storyTerm": "Long-lived master keys written inside in plain sight",
          "technicalTerm": "Unencrypted plaintext AWS IAM Access Keys and Secret Keys inside tfstate JSON",
          "tone": "sky"
        },
        {
          "storyTerm": "Dockworker opening an architect-only locker",
          "technicalTerm": "eks-node-role reading .tfstate objects normally accessed only by CI/CD pipelines",
          "tone": "rose"
        },
        {
          "storyTerm": "Storage ledger recording the suspicious read",
          "technicalTerm": "AWS CloudTrail S3 Data Event GetObject on *.tfstate by eks-node-role",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-scarleteel-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Infrastructure state ledgers sitting in…",
          "subtitle": "Amazon S3 objects ending in terraform.tfstate storing full…",
          "tone": "amber"
        },
        {
          "id": "cld-scarleteel-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Long-lived master keys written inside in…",
          "subtitle": "Unencrypted plaintext AWS IAM Access Keys and Secret Keys…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Team Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Infrastructure state ledgers sitting in cloud storage",
          "storyExcerpt": "Using the borrowed dockworker badge to browse cloud storage buckets, the intruder spots the engineering team infrastructure state ledgers sitting unguarded and pulls out long-lived master cloud…",
          "technicalParallel": "As Sysdig highlighted in their SCARLETEEL analysis, Terraform state files are a goldmine for cloud attackers: they not only contain plaintext secrets, but also map out every VPC, account ID, and S3…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Long-lived Keys",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Long-lived master keys written inside in plain sight",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses long-lived master keys written inside in plain sight to advance toward dockworker opening an architect-only locker.",
          "technicalParallel": "Using the stolen eks-node-role credentials, the attacker lists accessible S3 buckets, spots the Infrastructure-as-Code state backend (s3://corp-devops-tfstate-prod/prod/terraform.tfstate), and streams…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Read",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Storage ledger recording the suspicious read",
          "storyExcerpt": "Behind the scenes, storage ledger recording the suspicious read captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enable AWS CloudTrail S3 Data Events (object-level storage audit logs recording every file download) and alert whenever GetObject targets keys ending in .tfstate from an EKS worker node role…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Pier",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "State Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Pivot",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.001"
    },
    "step-3": {
      "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
      "sectionKey": "step-3",
      "sceneKind": "cld-scarleteel-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Pivoting Across AWS Accounts with Pacu to Exfiltrate Proprietary Code & S3 Buckets (T1078.004)",
      "storyCue": "Armed with the freshly discovered permanent master keys, the intruder spins up an automated cloud-exploitation toolkit to mint backdoor keys, cross over into linked corporate cloud accounts, download proprietary code, and hijack expensive compute engines.",
      "technicalCue": "T1078.004 · LATERAL & C2 — The attacker imports the permanent AKIA access key extracted from terraform.tfstate into the Pacu cloud exploitation framework on their Kali Linux machine (generating a distinctive User-Agent…",
      "storyMappings": [
        {
          "storyTerm": "Automated cloud-exploitation toolkit",
          "technicalTerm": "Pacu open-source AWS exploitation framework running from Kali Linux",
          "tone": "amber"
        },
        {
          "storyTerm": "Minting permanent backdoor keys",
          "technicalTerm": "iam:CreateAccessKey persistence ensuring access after node role rotation",
          "tone": "sky"
        },
        {
          "storyTerm": "Downloading proprietary code across accounts",
          "technicalTerm": "Cross-account pivot calling lambda:GetFunction and S3 exfiltration",
          "tone": "rose"
        },
        {
          "storyTerm": "Distinctive tool fingerprint left in the audit diary",
          "technicalTerm": "CloudTrail userAgent containing kali or pacu immediately following tfstate reads",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-scarleteel-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Automated cloud-exploitation toolkit",
          "subtitle": "Pacu open-source AWS exploitation framework running from Kali…",
          "tone": "amber"
        },
        {
          "id": "cld-scarleteel-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Minting permanent backdoor keys",
          "subtitle": "iam:CreateAccessKey persistence ensuring access after node…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Up",
          "stageTag": "STEP 03 · SETUP",
          "title": "Automated cloud-exploitation toolkit",
          "storyExcerpt": "Armed with the freshly discovered permanent master keys, the intruder spins up an automated cloud-exploitation toolkit to mint backdoor keys, cross over into linked corporate cloud accounts…",
          "technicalParallel": "While SCARLETEEL sometimes deploys XMRig miners on compromised Kubernetes nodes, Sysdig proved that cryptomining is often a noisy distraction while the operators exfiltrate high-value intellectual…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Keys",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Minting permanent backdoor keys",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses minting permanent backdoor keys to advance toward downloading proprietary code across accounts.",
          "technicalParallel": "The attacker imports the permanent AKIA access key extracted from terraform.tfstate into the Pacu cloud exploitation framework on their Kali Linux machine (generating a distinctive User-Agent containing…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Code",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Distinctive tool fingerprint left in the audit diary",
          "storyExcerpt": "Behind the scenes, distinctive tool fingerprint left in the audit diary captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor AWS CloudTrail CreateAccessKey and GetFunction API logs (tracking persistence creation and proprietary code retrieval) for userAgent strings containing kali or pacu occurring shortly after S3…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Pier",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "State Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Pivot",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "memory-forensics": {
      "scenarioId": "sysdig-scarleteel-aws-eks-terraform",
      "sectionKey": "memory-forensics",
      "sceneKind": "cld-scarleteel-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "SCARLETEEL Operation: Kubernetes Pod RCE, AWS Terraform .tfstate Theft &… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of cluster pier beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: bash (SCARLETEEL Pod Recon) (Pipe Buffer (Parsed terraform.tfstate JSON) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of bash (SCARLETEEL Pod Recon)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F4190800000 (RW-, 512 KB) · Pipe Buffer (Parsed terraform.tfstate JSON)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against bash (SCARLETEEL Pod Recon) (PID 412)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "In-memory stream of terraform.tfstate exposing plaintext aws_iam_access_key secret values.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-scarleteel-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of bash…",
          "tone": "sky"
        },
        {
          "id": "cld-scarleteel-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F4190800000 (RW-, 512 KB) · Pipe Buffer (Parsed…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline bash (SCARLETEEL Pod Recon) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007F4190800000 (RW-, 512 KB) containing Pipe Buffer (Parsed terraform.tfstate JSON).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 412 confirms injected region: In-memory stream of terraform.tfstate exposing plaintext aws_iam_access_key secret values.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "cloud-aws-eks-aws-auth-configmap-system-masters-audit": {
    "briefing": {
      "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-eks-awsauth-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078.004",
      "title": "Amazon EKS aws-auth ConfigMap system:masters RBAC Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud-managed cluster complex whose front reception desk translates corporate cloud badges into inner building keys using one hand-edited paper seating chart taped behind the desk. Using a pre-signed corporate badge to sign in, an intruder edits that single paper seating chart to write their own ordinary cloud role straight into the Supreme Master Guild line, instantly unlocking every secret vault in the entire cluster.",
      "technicalCue": "INITIAL ACCESS: EKS STS Presigned Bearer Token Authentication (k8s-aws-v1.<base64>) -> PERSISTENCE: Patching kube-system/aws-auth mapUsers / mapRoles with system:masters Group -> CREDENTIAL ACCESS: Cluster-Admin Secret Enumeration & EKS Access Entry Remediation",
      "storyMappings": [
        {
          "storyTerm": "Pre-signed corporate badge unlocking the cluster reception desk",
          "technicalTerm": "EKS STS presigned GetCallerIdentity bearer token (k8s-aws-v1.<base64>)",
          "tone": "amber"
        },
        {
          "storyTerm": "Hand-edited paper seating chart translating cloud badges to cluster keys",
          "technicalTerm": "kube-system/aws-auth ConfigMap mapUsers and mapRoles YAML entries",
          "tone": "sky"
        },
        {
          "storyTerm": "Writing an ordinary role straight into the Supreme Master Guild line",
          "technicalTerm": "Patching aws-auth to bind an attacker IAM principal to the system:masters group",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlocking every secret vault until modernized locks replace the paper chart",
          "technicalTerm": "Cluster-admin Secret enumeration remediated by migrating to EKS Access Entries",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-eks-awsauth-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Pre-signed corporate badge unlocking the…",
          "subtitle": "EKS STS presigned GetCallerIdentity bearer token…",
          "tone": "amber"
        },
        {
          "id": "cld-eks-awsauth-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hand-edited paper seating chart…",
          "subtitle": "kube-system/aws-auth ConfigMap mapUsers and mapRoles YAML…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pre-signed Aws",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "EKS STS Presigned Bearer Token Authentication (k8s-aws-v1.<base64>)",
          "storyExcerpt": "Generating a short-lived pre-signed identity voucher wrapped inside a special cluster prefix, the intruder presents it to the cluster front gate to authenticate smoothly with an existing cloud badge.",
          "technicalParallel": "Under the hood, the observed step executes aws eks get-token --cluster-name prod-eks-cluster (which executes a cloud control-plane API or CLI operation , aws eks get-token --cluster-name prod-eks-cluster…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Room",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Patching kube-system/aws-auth mapUsers / mapRoles with system:masters Group",
          "storyExcerpt": "Opening the delicate translation chart taped inside the system room, the intruder appends a second backdoor cloud user directly underneath the unrestrictable Supreme Master Guild, granting permanent…",
          "technicalParallel": "Under the hood, the observed step executes fields @timestamp, user.username, objectRef.name, requestObject.data.mapUsers | filter objectRef.name == \"aws-auth\" and verb in [\"update\", \"patch\"] (which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Role Line",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Cluster-Admin Secret Enumeration & EKS Access Entry Remediation",
          "storyExcerpt": "Now holding Supreme Master Guild status across the entire cluster, the intruder reads every application secret in every namespace until security engineers migrate the cluster off the fragile paper chart…",
          "technicalParallel": "Under the hood, the observed step executes aws eks update-cluster-config --name prod-eks-cluster --access-config authenticationMode=API (which executes a cloud control-plane API or CLI operation , aws…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Tower",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Seating Chart",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Dual Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-eks-awsauth-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "EKS STS Presigned Bearer Token Authentication (k8s-aws-v1.<base64>)",
      "storyCue": "Generating a short-lived pre-signed identity voucher wrapped inside a special cluster prefix, the intruder presents it to the cluster front gate to authenticate smoothly with an existing cloud badge.",
      "technicalCue": "T1078.004 · INITIAL ACCESS — An AWS IAM principal authenticates to the Amazon EKS API server by generating a presigned STS GetCallerIdentity URL encoded as a Bearer token (k8s-aws-v1.<base64>), which aws-iam-authenticator…",
      "storyMappings": [
        {
          "storyTerm": "Short-lived pre-signed AWS identity voucher",
          "technicalTerm": "aws eks get-token generating k8s-aws-v1.<base64> presigned STS GetCallerIdentity URL",
          "tone": "amber"
        },
        {
          "storyTerm": "Cluster front gate validating the voucher",
          "technicalTerm": "EKS aws-iam-authenticator verifying the STS signature and mapping the IAM ARN",
          "tone": "sky"
        },
        {
          "storyTerm": "Existing cloud badge with seating-chart editing rights",
          "technicalTerm": "Compromised IAM principal authorized to modify kube-system ConfigMaps",
          "tone": "rose"
        },
        {
          "storyTerm": "Dual audit trail bridging cloud vault and cluster hall",
          "technicalTerm": "Correlating AWS IAM ARN with Kubernetes kube-apiserver audit user identity",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-eks-awsauth-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Short-lived pre-signed AWS identity…",
          "subtitle": "aws eks get-token generating k8s-aws-v1.<base64> presigned STS…",
          "tone": "amber"
        },
        {
          "id": "cld-eks-awsauth-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Cluster front gate validating the voucher",
          "subtitle": "EKS aws-iam-authenticator verifying the STS signature and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pre-signed Aws",
          "stageTag": "STEP 01 · SETUP",
          "title": "Short-lived pre-signed AWS identity voucher",
          "storyExcerpt": "Generating a short-lived pre-signed AWS identity voucher wrapped inside a special cluster prefix, the intruder presents it to the harbor cluster front gate to authenticate smoothly with an…",
          "technicalParallel": "Under the hood, the observed step executes aws eks get-token --cluster-name prod-eks-cluster (which executes a cloud control-plane API or CLI operation , aws eks get-token --cluster-name prod-eks-cluster…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gate",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "harbor cluster front gate validating the voucher",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses harbor cluster front gate validating the voucher to advance toward existing cloud cloud badge badge with configmap editing rights.",
          "technicalParallel": "An AWS IAM principal authenticates to the Amazon EKS API server by generating a presigned STS GetCallerIdentity URL encoded as a Bearer token (k8s-aws-v1.<base64>), which aws-iam-authenticator maps to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Dual Aws",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Dual audit trail bridging AWS and harbor cluster",
          "storyExcerpt": "Behind the scenes, dual audit trail bridging aws and harbor cluster captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EksClusterAuth=aws-iam-authenticator , k8s-aws-v1 token, CallerIamArn=arn:aws:sts::123456789012:assumed-role/eks-ci-deployer/build-01…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Tower",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Seating Chart",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Dual Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-2": {
      "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-eks-awsauth-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Patching kube-system/aws-auth mapUsers / mapRoles with system:masters Group",
      "storyCue": "Opening the delicate translation chart taped inside the system room, the intruder appends a second backdoor cloud user directly underneath the unrestrictable Supreme Master Guild, granting permanent cluster-wide sovereignty that survives even role-roster cleanups.",
      "technicalCue": "T1098 · PERSISTENCE — Using update/patch permissions on ConfigMaps in kube-system, the actor appends a secondary IAM role or user ARN into data.mapUsers with groups: [\"system:masters\"], granting persistent…",
      "storyMappings": [
        {
          "storyTerm": "Delicate translation chart inside the system room",
          "technicalTerm": "Legacy kube-system/aws-auth ConfigMap controlling IAM-to-RBAC mapping",
          "tone": "amber"
        },
        {
          "storyTerm": "Unrestrictable Supreme Master Guild",
          "technicalTerm": "Hardcoded Kubernetes superuser group system:masters bypassing all RBAC checks",
          "tone": "sky"
        },
        {
          "storyTerm": "Appending a backdoor cloud user to the chart",
          "technicalTerm": "kubectl patch cm aws-auth adding an attacker ARN to mapUsers or mapRoles",
          "tone": "rose"
        },
        {
          "storyTerm": "Audit log capturing the chart mutation",
          "technicalTerm": "EKS Control Plane Audit Log showing patch/update on kube-system/aws-auth",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-eks-awsauth-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Delicate translation chart inside the…",
          "subtitle": "Legacy kube-system/aws-auth ConfigMap controlling IAM-to-RBAC…",
          "tone": "amber"
        },
        {
          "id": "cld-eks-awsauth-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Unrestrictable Supreme Master Guild",
          "subtitle": "Hardcoded Kubernetes superuser group system:masters bypassing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STEP 02 · SETUP",
          "title": "Delicate translation chart inside the system room",
          "storyExcerpt": "Opening the delicate translation chart taped inside the system room, the intruder appends a second backdoor cloud user directly underneath the unrestrictable Supreme Master Guild, granting…",
          "technicalParallel": "Under the hood, the observed step executes fields @timestamp, user.username, objectRef.name, requestObject.data.mapUsers | filter objectRef.name == \"aws-auth\" and verb in [\"update\", \"patch\"] (which…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses User",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Unrestrictable Supreme Master Guild",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unrestrictable supreme master guild to advance toward appending a backdoor cloud user to the chart.",
          "technicalParallel": "Using update/patch permissions on ConfigMaps in kube-system, the actor appends a secondary IAM role or user ARN into data.mapUsers with groups: [\"system:masters\"], granting persistent cluster-admin…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. User",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Audit log capturing the chart mutation",
          "storyExcerpt": "Behind the scenes, audit log capturing the chart mutation captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditVerb=patch , kube-system/aws-auth, InjectedMapping=rolearn: readonly-audit-role -> groups: [system:masters], PrivilegeLevel=Built-in Kubernetes…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Tower",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Seating Chart",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Dual Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098"
    },
    "step-3": {
      "scenarioId": "cloud-aws-eks-aws-auth-configmap-system-masters-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-eks-awsauth-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Cluster-Admin Secret Enumeration & EKS Access Entry Remediation",
      "storyCue": "Now holding Supreme Master Guild status across the entire cluster, the intruder reads every application secret in every namespace until security engineers migrate the cluster off the fragile paper chart onto managed, auditable cloud access entries.",
      "technicalCue": "T1552.007 · CREDENTIAL ACCESS — Authenticating as the newly mapped IAM role, the actor inherits system:masters group membership (which is hardcoded into kube-apiserver to bypass RBAC authorization checks) and lists cluster…",
      "storyMappings": [
        {
          "storyTerm": "Reading every application secret in every namespace",
          "technicalTerm": "Cluster-admin kubectl get secrets --all-namespaces credential dump",
          "tone": "amber"
        },
        {
          "storyTerm": "Retiring the fragile paper seating chart",
          "technicalTerm": "Migrating EKS authentication mode from CONFIG_MAP to API (EKS Access Entries)",
          "tone": "sky"
        },
        {
          "storyTerm": "Centralized cloud-logged access grants",
          "technicalTerm": "EKS Access Entries recorded directly in AWS CloudTrail rather than editable ConfigMaps",
          "tone": "rose"
        },
        {
          "storyTerm": "Removing unauthorized superuser entries",
          "technicalTerm": "Scrubbing rogue ARNs from aws-auth and rotating all cluster Secrets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-eks-awsauth-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Reading every application secret in…",
          "subtitle": "Cluster-admin kubectl get secrets --all-namespaces credential…",
          "tone": "amber"
        },
        {
          "id": "cld-eks-awsauth-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Retiring the fragile paper seating chart",
          "subtitle": "Migrating EKS authentication mode from CONFIG_MAP to API (EKS…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Off",
          "stageTag": "STEP 03 · SETUP",
          "title": "Reading every application secret in every namespace",
          "storyExcerpt": "Now holding Supreme Master Guild status across the entire cluster, the intruder reads every application secret in every namespace until security engineers migrate the cluster off the fragile…",
          "technicalParallel": "Under the hood, the observed step executes aws eks update-cluster-config --name prod-eks-cluster --access-config authenticationMode=API (which executes a cloud control-plane API or CLI operation , aws…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Retiring the fragile paper seating chart",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses retiring the fragile paper seating chart to advance toward centralized cloud-logged access grants.",
          "technicalParallel": "Authenticating as the newly mapped IAM role, the actor inherits system:masters group membership (which is hardcoded into kube-apiserver to bypass RBAC authorization checks) and lists cluster secrets…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Now Off",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Removing unauthorized superuser entries",
          "storyExcerpt": "Behind the scenes, removing unauthorized superuser entries captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EffectiveGroup=system:masters, AuthzDecision=allow , Built-in Superuser Group, TargetResource=/api/v1/secrets under T1552.007): Switch the EKS cluster to…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Tower",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Seating Chart",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Dual Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.007"
    }
  },
  "cloud-aws-s3-kms-external-account-encryption-extortion-audit": {
    "briefing": {
      "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-s3-kms-extort-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1619",
      "title": "AWS S3 Server-Side KMS External Key (SSE-KMS) Re-Encryption Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud-native ransomware crew that never drops a single piece of malware on any computer. Instead, using stolen cloud warehouse keys, they bring their own external padlock from an outside account, use the warehouse own built-in copier to re-seal every customer box in place under their external padlock, and set the warehouse automatic trash chute to one day so all previous unlocked editions are swept away before the ransom note arrives.",
      "technicalCue": "CREDENTIAL ACCESS: Cross-Account KMS Key Policy Grant & S3 Bucket Inventory Enumeration -> EXFIL & IMPACT: In-Place S3 CopyObject Re-Encryption with External Account SSE-KMS Key ARN -> EXFIL & IMPACT: PutBucketLifecycleConfiguration 1-Day NoncurrentVersionExpiration & Object Lock Recovery",
      "storyMappings": [
        {
          "storyTerm": "Bringing an external padlock from an outside account",
          "technicalTerm": "Cross-account AWS KMS key policy granting victim IAM role kms:GenerateDataKey",
          "tone": "amber"
        },
        {
          "storyTerm": "Using the warehouse built-in copier to re-seal every box in place",
          "technicalTerm": "In-place s3:CopyObject with SSE-KMS pointing to the attacker external KMS Key ARN",
          "tone": "sky"
        },
        {
          "storyTerm": "Setting the warehouse automatic trash chute to one day",
          "technicalTerm": "PutBucketLifecycleConfiguration setting 1-day NoncurrentVersionExpiration",
          "tone": "rose"
        },
        {
          "storyTerm": "Zero malware required on any server",
          "technicalTerm": "Pure cloud control-plane S3 ransomware extortion via native AWS APIs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-s3-kms-extort-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Bringing an external padlock from an…",
          "subtitle": "Cross-account AWS KMS key policy granting victim IAM role…",
          "tone": "amber"
        },
        {
          "id": "cld-s3-kms-extort-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Using the warehouse built-in copier to…",
          "subtitle": "In-place s3:CopyObject with SSE-KMS pointing to the attacker…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Own Lock",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Cross-Account KMS Key Policy Grant & S3 Bucket Inventory Enumeration",
          "storyExcerpt": "Inside their own separate cloud account, the extortionist forges a brand-new encryption padlock and authorizes the victim cloud badge to lock boxes with it, while quietly mapping every valuable storage…",
          "technicalParallel": "Under the hood, the observed step executes aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ListBuckets (which executes a cloud control-plane API or CLI operation…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. In-place Copy",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "In-Place S3 CopyObject Re-Encryption with External Account SSE-KMS Key ARN",
          "storyExcerpt": "Issuing rapid in-place copy orders straight through the cloud storage service itself, the extortionist forces the warehouse to overwrite every file with a fresh copy sealed strictly under the attacker…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"CopyObject\" and .requestParameters.\"x-amz-server-side-encryption-aws-kms-key-id\" | contains, \"999988887777\")'…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. One Day",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "PutBucketLifecycleConfiguration 1-Day NoncurrentVersionExpiration & Object Lock Recovery",
          "storyExcerpt": "Even if the warehouse keeps older unlocked versions of every box on a safety shelf, the extortionist silently adjusts the warehouse automated housekeeping rule to incinerate all non-current versions…",
          "technicalParallel": "Under the hood, the observed step executes aws s3api delete-bucket-lifecycle --bucket prod-enterprise-records (which executes a cloud control-plane API or CLI operation , aws s3api…",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Bucket Silos",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "External Kiln",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Padlock Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-s3-kms-extort-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Cross-Account KMS Key Policy Grant & S3 Bucket Inventory Enumeration",
      "storyCue": "Inside their own separate cloud account, the extortionist forges a brand-new encryption padlock and authorizes the victim cloud badge to lock boxes with it, while quietly mapping every valuable storage bucket inside the victim estate.",
      "technicalCue": "T1619 · CREDENTIAL ACCESS — Using compromised IAM credentials with s3:ListBucket and s3:PutObject permissions, the actor configures a KMS Customer Managed Key (CMK) in an external AWS account that permits kms:Encrypt and…",
      "storyMappings": [
        {
          "storyTerm": "Forging an encryption padlock inside an outside account",
          "technicalTerm": "Attacker-owned AWS KMS Customer Managed Key (CMK) in an external AWS account",
          "tone": "amber"
        },
        {
          "storyTerm": "Authorizing the victim badge to lock boxes with it",
          "technicalTerm": "Cross-account KMS Key Policy allowing victim role kms:Encrypt and GenerateDataKey",
          "tone": "sky"
        },
        {
          "storyTerm": "Mapping every valuable storage bucket",
          "technicalTerm": "CloudTrail s3:ListBuckets and s3:ListObjectsV2 inventory enumeration",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking without downloading a single byte",
          "technicalTerm": "Server-side encryption design avoiding slow external download-and-reupload bottlenecks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-s3-kms-extort-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Forging an encryption padlock inside an…",
          "subtitle": "Attacker-owned AWS KMS Customer Managed Key (CMK) in an…",
          "tone": "amber"
        },
        {
          "id": "cld-s3-kms-extort-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Authorizing the victim badge to lock…",
          "subtitle": "Cross-account KMS Key Policy allowing victim role kms:Encrypt…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Own Lock",
          "stageTag": "STEP 01 · SETUP",
          "title": "Forging an encryption padlock inside an outside…",
          "storyExcerpt": "Inside their own separate cloud account, the extortionist forges a brand-new encryption padlock and authorizes the victim cloud badge to lock boxes with it, while quietly mapping every valuable…",
          "technicalParallel": "Under the hood, the observed step executes aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ListBuckets (which executes a cloud control-plane API or CLI operation…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Lock It",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Authorizing the victim badge to lock boxes with it",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses authorizing the victim badge to lock boxes with it to advance toward mapping every valuable storage bucket.",
          "technicalParallel": "Using compromised IAM credentials with s3:ListBucket and s3:PutObject permissions, the actor configures a KMS Customer Managed Key (CMK) in an external AWS account that permits kms:Encrypt and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Byte",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Locking without downloading a single byte",
          "storyExcerpt": "Behind the scenes, locking without downloading a single byte captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventSource=s3.amazonaws.com, TargetBucket=prod-enterprise-records, ActorPrincipal=backup-sync-svc under T1619): Enforce an AWS Organizations Service…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Bucket Silos",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "External Kiln",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Padlock Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1619"
    },
    "step-2": {
      "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-s3-kms-extort-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "In-Place S3 CopyObject Re-Encryption with External Account SSE-KMS Key ARN",
      "storyCue": "Issuing rapid in-place copy orders straight through the cloud storage service itself, the extortionist forces the warehouse to overwrite every file with a fresh copy sealed strictly under the attacker external padlock, instantly locking the rightful owner out once the attacker revokes access to their external key.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Without downloading or re-uploading the data, the actor invokes s3:CopyObject (copying each object onto itself) with x-amz-server-side-encryption=\"aws:kms\" and…",
      "storyMappings": [
        {
          "storyTerm": "Rapid in-place copy orders straight through the warehouse",
          "technicalTerm": "s3:CopyObject targeting source == destination with x-amz-server-side-encryption: aws:kms",
          "tone": "amber"
        },
        {
          "storyTerm": "Sealing every file under the attacker external padlock",
          "technicalTerm": "x-amz-server-side-encryption-aws-kms-key-id referencing an external AWS Account ID",
          "tone": "sky"
        },
        {
          "storyTerm": "Locking the rightful owner out in one flip",
          "technicalTerm": "Attacker deleting or revoking their external KMS key policy until ransom is paid",
          "tone": "rose"
        },
        {
          "storyTerm": "High-signal external-key alarm",
          "technicalTerm": "CloudTrail S3 Data Event flagging CopyObject specifying an untrusted external KMS Key ARN",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-s3-kms-extort-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Rapid in-place copy orders straight…",
          "subtitle": "s3:CopyObject targeting source == destination with…",
          "tone": "amber"
        },
        {
          "id": "cld-s3-kms-extort-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sealing every file under the attacker…",
          "subtitle": "x-amz-server-side-encryption-aws-kms-key-id referencing an…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. In-place Copy",
          "stageTag": "STEP 02 · SETUP",
          "title": "Rapid in-place copy orders straight through the…",
          "storyExcerpt": "Issuing rapid in-place copy orders straight through the cloud storage service itself, the extortionist forces the warehouse to overwrite every file with a fresh copy sealed strictly under the…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"CopyObject\" and .requestParameters.\"x-amz-server-side-encryption-aws-kms-key-id\" | contains, \"999988887777\")'…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. File",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sealing every file under the attacker external padlock",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses sealing every file under the attacker external padlock to advance toward locking the rightful owner out in one flip.",
          "technicalParallel": "Without downloading or re-uploading the data, the actor invokes s3:CopyObject (copying each object onto itself) with x-amz-server-side-encryption=\"aws:kms\" and x-amz-server-side-encryption-aws-kms-key-id…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out One",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "High-signal external-key alarm",
          "storyExcerpt": "Behind the scenes, high-signal external-key alarm captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventName=CopyObject , In-Place Server-Side Re-Encryption, EncryptionMode=aws:kms , SSE-KMS…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Bucket Silos",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "External Kiln",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Padlock Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1486"
    },
    "step-3": {
      "scenarioId": "cloud-aws-s3-kms-external-account-encryption-extortion-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-s3-kms-extort-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "PutBucketLifecycleConfiguration 1-Day NoncurrentVersionExpiration & Object Lock Recovery",
      "storyCue": "Even if the warehouse keeps older unlocked versions of every box on a safety shelf, the extortionist silently adjusts the warehouse automated housekeeping rule to incinerate all non-current versions after a single day unless Object Lock bolts the shelf shut.",
      "technicalCue": "T1490 · EXFIL & IMPACT — To purge prior unencrypted object versions on versioned buckets, the actor calls s3:PutBucketLifecycleConfiguration with NoncurrentVersionExpiration set to 1 day.",
      "storyMappings": [
        {
          "storyTerm": "Safety shelf holding older unlocked versions",
          "technicalTerm": "S3 Bucket Versioning preserving pre-encryption noncurrent object versions",
          "tone": "amber"
        },
        {
          "storyTerm": "Adjusting automated housekeeping to burn old versions in one day",
          "technicalTerm": "s3:PutBucketLifecycleConfiguration setting NoncurrentVersionExpiration to 1 day",
          "tone": "sky"
        },
        {
          "storyTerm": "Unbreakable safety bolt preventing early destruction",
          "technicalTerm": "S3 Object Lock in Compliance Mode protecting versions from lifecycle deletion",
          "tone": "rose"
        },
        {
          "storyTerm": "Emergency containment before midnight sweep",
          "technicalTerm": "Alerting immediately on PutBucketLifecycleConfiguration to remove malicious rules within 24h",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-s3-kms-extort-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Safety shelf holding older unlocked…",
          "subtitle": "S3 Bucket Versioning preserving pre-encryption noncurrent…",
          "tone": "amber"
        },
        {
          "id": "cld-s3-kms-extort-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Adjusting automated housekeeping to burn…",
          "subtitle": "s3:PutBucketLifecycleConfiguration setting…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even If",
          "stageTag": "STEP 03 · SETUP",
          "title": "Safety shelf holding older unlocked versions",
          "storyExcerpt": "Even if the warehouse keeps older unlocked versions of every box on a safety shelf, the extortionist silently adjusts the warehouse automated housekeeping rule to incinerate all non-current…",
          "technicalParallel": "Under the hood, the observed step executes aws s3api delete-bucket-lifecycle --bucket prod-enterprise-records (which executes a cloud control-plane API or CLI operation , aws s3api…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Burn Old",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Adjusting automated housekeeping to burn old…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses adjusting automated housekeeping to burn old versions in one day to advance toward unbreakable safety bolt preventing early destruction.",
          "technicalParallel": "To purge prior unencrypted object versions on versioned buckets, the actor calls s3:PutBucketLifecycleConfiguration with NoncurrentVersionExpiration set to 1 day.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bolt",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Emergency containment before midnight sweep",
          "storyExcerpt": "Behind the scenes, emergency containment before midnight sweep captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventName=PutBucketLifecycleConfiguration, LifecycleRuleAction=NoncurrentVersionExpiration , NoncurrentDays: 1, RecoveryPivot=DeleteLifecycle + Restore…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Bucket Silos",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "External Kiln",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Padlock Seal",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1490"
    }
  },
  "cloud-aws-sts-federation-token-console-signin-audit": {
    "briefing": {
      "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-aws-sts-fed-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1550.001",
      "title": "AWS STS GetFederationToken Console Sign-In Bypass & IAM Policy Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud bank where a thief steals a long-lived machine delivery badge designed only for automated back-door shipping, not for walking through the executive web lobby. Using a special exchange counter, the thief trades that machine badge for a federated visitor pass, exchanges the pass at the lobby ticket booth for a live browser wristband, and strolls straight into the graphical management console to read every security policy on screen.",
      "technicalCue": "DEFENSE EVASION: Programmatic AKIA Access Key Invocation of sts:GetFederationToken -> LATERAL & C2: Federation SigninToken Exchange & Interactive ConsoleLogin Event -> CREDENTIAL ACCESS: Console Reconnaissance & IAM Policy Version Enumeration Audit",
      "storyMappings": [
        {
          "storyTerm": "Trading a back-door machine badge at the exchange counter",
          "technicalTerm": "Programmatic AKIA access key invoking sts:GetFederationToken",
          "tone": "amber"
        },
        {
          "storyTerm": "Exchanging the federated pass for a live browser wristband",
          "technicalTerm": "signin.aws.amazon.com/federation SigninToken exchange triggering ConsoleLogin",
          "tone": "sky"
        },
        {
          "storyTerm": "Strolling into the graphical console to read security policies",
          "technicalTerm": "Interactive AWS Management Console reconnaissance and IAM PolicyVersion enumeration",
          "tone": "rose"
        },
        {
          "storyTerm": "Audit discrepancy exposing back-door-to-lobby pivot",
          "technicalTerm": "CloudTrail GetFederationToken immediately followed by ConsoleLogin without MFA",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-aws-sts-fed-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Trading a back-door machine badge at the…",
          "subtitle": "Programmatic AKIA access key invoking sts:GetFederationToken",
          "tone": "amber"
        },
        {
          "id": "cld-aws-sts-fed-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Exchanging the federated pass for a live…",
          "subtitle": "signin.aws.amazon.com/federation SigninToken exchange…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back-door",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Programmatic AKIA Access Key Invocation of sts:GetFederationToken",
          "storyExcerpt": "Holding a leaked static programmer key meant solely for automated scripts, the intruder calls the cloud token-exchange counter asking for a federated session pass that can bridge into interactive web…",
          "technicalParallel": "Under the hood, the observed step executes aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetFederationToken (which executes a cloud control-plane API or CLI…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Pass Live",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Federation SigninToken Exchange & Interactive ConsoleLogin Event",
          "storyExcerpt": "Handing that temporary federated pass straight to the web lobby ticket booth, the intruder receives a single-use browser entry link and logs smoothly into the interactive graphical console without ever…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"ConsoleLogin\" and .userIdentity.type==\"FederatedUser\")' cloudtrail.json (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Read",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Console Reconnaissance & IAM Policy Version Enumeration Audit",
          "storyExcerpt": "Now clicking freely through the visual web dashboards, the intruder inspects account blueprints and digs through older saved editions of company security policies hunting for over-privileged rules or…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.userIdentity.arn | contains, \"federated-user/console-broker-session\")' cloudtrail.json (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Exchange Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Console Gate",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Fed Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-aws-sts-fed-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Programmatic AKIA Access Key Invocation of sts:GetFederationToken",
      "storyCue": "Holding a leaked static programmer key meant solely for automated scripts, the intruder calls the cloud token-exchange counter asking for a federated session pass that can bridge into interactive web access.",
      "technicalCue": "T1550.001 · DEFENSE EVASION — Holding a long-lived IAM User access key (AKIA...), the actor calls sts:GetFederationToken to mint temporary federated credentials (ASIA...) scoped to an inline session policy, logged in AWS…",
      "storyMappings": [
        {
          "storyTerm": "Leaked static programmer key",
          "technicalTerm": "Compromised long-lived AWS IAM access key (AKIA...) without console password",
          "tone": "amber"
        },
        {
          "storyTerm": "Cloud token-exchange counter",
          "technicalTerm": "AWS Security Token Service API call sts:GetFederationToken",
          "tone": "sky"
        },
        {
          "storyTerm": "Federated session pass returned",
          "technicalTerm": "Temporary ASIA... federated credentials scoped by inline session policy",
          "tone": "rose"
        },
        {
          "storyTerm": "Ledger entry marking the unusual conversion",
          "technicalTerm": "CloudTrail GetFederationToken event initiated by a programmatic IAM user",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-sts-fed-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Leaked static programmer key",
          "subtitle": "Compromised long-lived AWS IAM access key (AKIA...) without…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-sts-fed-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Cloud token-exchange counter",
          "subtitle": "AWS Security Token Service API call sts:GetFederationToken",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Leaked static programmer key",
          "storyExcerpt": "Holding a leaked static programmer key meant solely for automated scripts, the intruder calls the cloud token-exchange counter asking for a federated session pass that can bridge into…",
          "technicalParallel": "Under the hood, the observed step executes aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=GetFederationToken (which executes a cloud control-plane API or CLI…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Pass",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Cloud token-exchange counter",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses cloud token-exchange counter to advance toward federated session pass returned.",
          "technicalParallel": "Holding a long-lived IAM User access key (AKIA...), the actor calls sts:GetFederationToken to mint temporary federated credentials (ASIA...) scoped to an inline session policy, logged in AWS CloudTrail…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Ledger entry marking the unusual conversion",
          "storyExcerpt": "Behind the scenes, ledger entry marking the unusual conversion captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventSource=sts.amazonaws.com, EventName=GetFederationToken, PrincipalUser=ci-deploy-bot , AKIAIOSFODNN7EXAMPLE under T1550.001): Remove inline…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Exchange Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Console Gate",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Fed Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.001"
    },
    "step-2": {
      "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-aws-sts-fed-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Federation SigninToken Exchange & Interactive ConsoleLogin Event",
      "storyCue": "Handing that temporary federated pass straight to the web lobby ticket booth, the intruder receives a single-use browser entry link and logs smoothly into the interactive graphical console without ever needing a user password or MFA token.",
      "technicalCue": "T1078.004 · LATERAL & C2 — The actor passes the temporary federated credentials to https://signin.aws.amazon.com/federation?Action=getSigninToken and opens the resulting Console login URL, producing a ConsoleLogin…",
      "storyMappings": [
        {
          "storyTerm": "Web lobby ticket booth",
          "technicalTerm": "https://signin.aws.amazon.com/federation?Action=getSigninToken endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Single-use browser entry link",
          "technicalTerm": "Returned SigninToken pasted into Action=login URL launching the AWS Console",
          "tone": "sky"
        },
        {
          "storyTerm": "Entering the graphical lobby without password or MFA",
          "technicalTerm": "Bypassing console password requirements and user MFA checks via federation",
          "tone": "rose"
        },
        {
          "storyTerm": "Lobby camera recording the browser check-in",
          "technicalTerm": "CloudTrail ConsoleLogin event showing userIdentity.type == \"FederatedUser\"",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-sts-fed-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Web lobby ticket booth",
          "subtitle": "https://signin.aws.amazon.com/federation?Action=getSigninToken…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-sts-fed-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Single-use browser entry link",
          "subtitle": "Returned SigninToken pasted into Action=login URL launching…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Web",
          "stageTag": "STEP 02 · SETUP",
          "title": "Web lobby ticket booth",
          "storyExcerpt": "Handing that temporary federated pass straight to the web lobby ticket booth, the intruder receives a single-use browser entry link and logs smoothly into the interactive graphical console…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"ConsoleLogin\" and .userIdentity.type==\"FederatedUser\")' cloudtrail.json (which executes the technical command / telemetry…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Link",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Single-use browser entry link",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses single-use browser entry link to advance toward entering the graphical lobby without password or mfa.",
          "technicalParallel": "The actor passes the temporary federated credentials to https://signin.aws.amazon.com/federation?Action=getSigninToken and opens the resulting Console login URL, producing a ConsoleLogin CloudTrail event…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass Web",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Lobby camera recording the browser check-in",
          "storyExcerpt": "Behind the scenes, lobby camera recording the browser check-in captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventName=ConsoleLogin, IdentityType=FederatedUser , sts:GetFederationToken, MfaStatus=MFAUsed: No under T1078.004): Alert on any CloudTrail ConsoleLogin…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Exchange Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Console Gate",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Fed Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-3": {
      "scenarioId": "cloud-aws-sts-federation-token-console-signin-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-aws-sts-fed-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Console Reconnaissance & IAM Policy Version Enumeration Audit",
      "storyCue": "Now clicking freely through the visual web dashboards, the intruder inspects account blueprints and digs through older saved editions of company security policies hunting for over-privileged rules or hidden secrets.",
      "technicalCue": "T1069.003 · CREDENTIAL ACCESS — Inside the browser session, the federated identity queries IAM policies, S3 buckets, and Secrets Manager secrets, which defenders correlate via the shared principalId…",
      "storyMappings": [
        {
          "storyTerm": "Clicking freely through visual web dashboards",
          "technicalTerm": "Interactive AWS Management Console reconnaissance across IAM, S3, and Secrets Manager",
          "tone": "amber"
        },
        {
          "storyTerm": "Digging through older editions of security policies",
          "technicalTerm": "Calling iam:ListPolicyVersions and iam:GetPolicyVersion hunting privilege escalation paths",
          "tone": "sky"
        },
        {
          "storyTerm": "Tracing every click back to the leaked machine key",
          "technicalTerm": "Correlating CloudTrail FederatedUser ARN back to the originating AKIA AccessKeyId",
          "tone": "rose"
        },
        {
          "storyTerm": "Shutting down both key and active browser session",
          "technicalTerm": "Deactivating the compromised AKIA key and attaching an explicit Deny revocation policy",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-aws-sts-fed-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Clicking freely through visual web…",
          "subtitle": "Interactive AWS Management Console reconnaissance across IAM…",
          "tone": "amber"
        },
        {
          "id": "cld-aws-sts-fed-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Digging through older editions of…",
          "subtitle": "Calling iam:ListPolicyVersions and iam:GetPolicyVersion…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Web",
          "stageTag": "STEP 03 · SETUP",
          "title": "Clicking freely through visual web dashboards",
          "storyExcerpt": "Now clicking freely through the visual web dashboards, the intruder inspects account blueprints and digs through older saved editions of company security policies hunting for over-privileged…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.userIdentity.arn | contains, \"federated-user/console-broker-session\")' cloudtrail.json (which executes the technical command /…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Back",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Digging through older editions of security policies",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses digging through older editions of security policies to advance toward tracing every click back to the leaked machine key.",
          "technicalParallel": "Inside the browser session, the federated identity queries IAM policies, S3 buckets, and Secrets Manager secrets, which defenders correlate via the shared principalId (<user_id>:console-broker-session)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back Key",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shutting down both key and active browser session",
          "storyExcerpt": "Behind the scenes, shutting down both key and active browser session captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording CorrelatedSessionArn=arn:aws:sts::123456789012:federated-user/console-broker-session, EnumeratedApi=iam:GetAccountAuthorizationDetails…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Exchange Desk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Console Gate",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Fed Token",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1069.003"
    }
  },
  "cloud-azure-vm-custom-script-extension-managed-identity-audit": {
    "briefing": {
      "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-azure-vm-cse-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1059",
      "title": "Azure VM CustomScriptExtension & IMDS Managed Identity Token Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud office tower where building managers can slide a remote work-order envelope through the central dispatch wall straight into any locked virtual room without knowing the room own password. Using hijacked cloud manager rights, an intruder slips a custom script envelope through the wall, makes the room built-in guest butler execute it with full master keys, and reaches into the room internal badge box to lift the room cloud identity pass and widen their reach across the estate.",
      "technicalCue": "EXECUTION: ARM Control-Plane Microsoft.Compute/virtualMachines/extensions/write Invocation -> DEFENSE EVASION: Guest Agent (WaAppAgent.exe / walinuxagent) SYSTEM Child Process Execution -> CREDENTIAL ACCESS: Local IMDS (169.254.169.254) Managed Identity OAuth Token Acquisition & Key Vault Read",
      "storyMappings": [
        {
          "storyTerm": "Sliding a remote work-order envelope through the central dispatch wall",
          "technicalTerm": "Azure ARM Microsoft.Compute/virtualMachines/extensions/write CustomScriptExtension",
          "tone": "amber"
        },
        {
          "storyTerm": "Room built-in guest butler executing the order with master keys",
          "technicalTerm": "WaAppAgent.exe or walinuxagent spawning child commands as SYSTEM or root",
          "tone": "sky"
        },
        {
          "storyTerm": "Reaching into the internal badge box for the cloud identity pass",
          "technicalTerm": "Querying local Azure IMDS (169.254.169.254) for Managed Identity OAuth tokens",
          "tone": "rose"
        },
        {
          "storyTerm": "Widening reach from one server back into the cloud control plane",
          "technicalTerm": "Using stolen Managed Identity tokens to access Azure Key Vault and Storage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-azure-vm-cse-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Sliding a remote work-order envelope…",
          "subtitle": "Azure ARM Microsoft.Compute/virtualMachines/extensions/write…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-vm-cse-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Room built-in guest butler executing the…",
          "subtitle": "WaAppAgent.exe or walinuxagent spawning child commands as…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Work-order Wall",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "ARM Control-Plane Microsoft.Compute/virtualMachines/extensions/write Invocation",
          "storyExcerpt": "Without needing any remote terminal key or room password for the target server, the intruder uses compromised management permissions to push a remote work-order script straight down from the central…",
          "technicalParallel": "Under the hood, the observed step executes AzureActivity | where OperationNameValue =~ \"MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Room Keys",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Guest Agent (WaAppAgent.exe / walinuxagent) SYSTEM Child Process Execution",
          "storyExcerpt": "Inside the virtual server, the always-running official Azure guest butler dutifully opens the incoming work order and launches the attacker script under supreme operating-system authority, leaving an…",
          "technicalParallel": "Under the hood, the observed step executes DeviceProcessEvents | where InitiatingProcessFileName has_any (\"WindowsAzureGuestAgent.exe\", \"enable.cmd\") (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Local IMDS (169.254.169.254) Managed Identity OAuth Token Acquisition & Key Vault Read",
          "storyExcerpt": "Standing inside the server with supreme local rights, the script taps the room local identity window (supplying the required Metadata header) to withdraw the server own Managed Identity cloud pass and…",
          "technicalParallel": "Under the hood, the observed step executes AADManagedIdentitySignInLogs | where ServicePrincipalName == \"prod-app-vm01\" (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Dispatch Slot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Butler Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Managed Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-azure-vm-cse-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "ARM Control-Plane Microsoft.Compute/virtualMachines/extensions/write Invocation",
      "storyCue": "Without needing any remote terminal key or room password for the target server, the intruder uses compromised management permissions to push a remote work-order script straight down from the central control desk.",
      "technicalCue": "T1059 · EXECUTION — Holding RBAC permissions on the subscription or resource group, the actor dispatches an ARM PUT request to Microsoft.Compute/virtualMachines/extensions/write (or runCommand/action), recorded in…",
      "storyMappings": [
        {
          "storyTerm": "Pushing a script order from the cloud control plane",
          "technicalTerm": "ARM API call Microsoft.Compute/virtualMachines/extensions/write (CustomScriptExtension)",
          "tone": "amber"
        },
        {
          "storyTerm": "Skipping door keys and login passwords entirely",
          "technicalTerm": "Control-plane-to-data-plane bridge executing code inside the VM OS directly",
          "tone": "sky"
        },
        {
          "storyTerm": "Cloud management diary recording the push",
          "technicalTerm": "Azure Activity Log capturing exact caller identity, extension name, and target VM",
          "tone": "rose"
        },
        {
          "storyTerm": "Over-privileged cloud contributor role",
          "technicalTerm": "Compromised Virtual Machine Contributor or Owner RBAC assignment",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-vm-cse-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Pushing a script order from the cloud…",
          "subtitle": "ARM API call Microsoft.Compute/virtualMachines/extensions/write…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-vm-cse-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Skipping door keys and login passwords…",
          "subtitle": "Control-plane-to-data-plane bridge executing code inside the…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Any Key",
          "stageTag": "STEP 01 · SETUP",
          "title": "Pushing a script order from the cloud control plane",
          "storyExcerpt": "Without needing any remote terminal key or Windows password for the target server, the intruder uses compromised Azure management permissions to push a Custom Script Extension order straight…",
          "technicalParallel": "Under the hood, the observed step executes AzureActivity | where OperationNameValue =~ \"MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Keys",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Skipping remote terminal keys and Windows passwords…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses skipping remote terminal keys and windows passwords entirely to advance toward cloud management diary recording the push.",
          "technicalParallel": "Holding RBAC permissions on the subscription or resource group, the actor dispatches an ARM PUT request to Microsoft.Compute/virtualMachines/extensions/write (or runCommand/action), recorded in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Push",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Over-privileged cloud contributor role",
          "storyExcerpt": "Behind the scenes, over-privileged cloud contributor role captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording ArmOperation=MICROSOFT.COMPUTE/VIRTUALMACHINES/EXTENSIONS/WRITE, ExtensionType=Microsoft.Compute.CustomScriptExtension, TargetVirtualMachine=prod-app-vm01…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Dispatch Slot",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Butler Bay",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Managed Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059"
    },
    "step-2": {
      "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-azure-vm-cse-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Guest Agent (WaAppAgent.exe / walinuxagent) SYSTEM Child Process Execution",
      "storyCue": "Inside the virtual server, the always-running official Azure guest butler dutifully opens the incoming work order and launches the attacker script under supreme operating-system authority, leaving an unmistakable parent-child tree on disk.",
      "technicalCue": "T1078.004 · DEFENSE EVASION — Inside the guest OS, the Azure VM Agent (WindowsAzureGuestAgent.exe or walinuxagent) downloads the extension payload into C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\ (or…",
      "storyMappings": [
        {
          "storyTerm": "Official Azure guest butler inside the server",
          "technicalTerm": "WaAppAgent.exe (Windows) or walinuxagent (Linux) receiving extension payloads",
          "tone": "amber"
        },
        {
          "storyTerm": "Launching the script under supreme OS authority",
          "technicalTerm": "Guest agent spawning powershell.exe or /bin/sh as NT AUTHORITY\\SYSTEM or root",
          "tone": "sky"
        },
        {
          "storyTerm": "Unmistakable parent-child tree on the host",
          "technicalTerm": "EDR / Sysmon EventID 1 flagging WaAppAgent.exe spawning encoded PowerShell or curl",
          "tone": "rose"
        },
        {
          "storyTerm": "Bridging cloud rights into live OS memory",
          "technicalTerm": "Host-level execution enabling credential dumping and local metadata queries",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-vm-cse-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Official Azure guest butler inside the…",
          "subtitle": "WaAppAgent.exe (Windows) or walinuxagent (Linux) receiving…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-vm-cse-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Launching the script under supreme OS…",
          "subtitle": "Guest agent spawning powershell.exe or /bin/sh as NT…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Work",
          "stageTag": "STEP 02 · SETUP",
          "title": "Official Azure guest butler inside the server",
          "storyExcerpt": "Inside the virtual server, the always-running official Azure guest butler dutifully opens the incoming work order and launches the attacker script under supreme operating-system authority…",
          "technicalParallel": "Under the hood, the observed step executes DeviceProcessEvents | where InitiatingProcessFileName has_any (\"WindowsAzureGuestAgent.exe\", \"enable.cmd\") (which executes the technical command / telemetry…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Os",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Launching the script under supreme OS authority",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses launching the script under supreme os authority to advance toward unmistakable parent-child tree on the host.",
          "technicalParallel": "Inside the guest OS, the Azure VM Agent (WindowsAzureGuestAgent.exe or walinuxagent) downloads the extension payload into C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\ (or…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tree Host",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Bridging cloud rights into live OS memory",
          "storyExcerpt": "Behind the scenes, bridging cloud rights into live os memory captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording ParentAgent=C:\\WindowsAzure\\Packages\\WaAppAgent.exe, PluginDirectory=C:\\Packages\\Plugins\\Microsoft.Compute.CustomScriptExtension\\1.10.12\\Downloads\\0\\…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Dispatch Slot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Butler Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Managed Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-3": {
      "scenarioId": "cloud-azure-vm-custom-script-extension-managed-identity-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-azure-vm-cse-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Local IMDS (169.254.169.254) Managed Identity OAuth Token Acquisition & Key Vault Read",
      "storyCue": "Standing inside the server with supreme local rights, the script taps the room local identity window (supplying the required Metadata header) to withdraw the server own Managed Identity cloud pass and immediately unlocks connected Key Vaults and storage accounts.",
      "technicalCue": "T1552.005 · CREDENTIAL ACCESS — Running inside the VM, the script queries http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net with header Metadata: true to obtain the…",
      "storyMappings": [
        {
          "storyTerm": "Tapping the room local identity window",
          "technicalTerm": "HTTP GET http://169.254.169.254/metadata/identity/oauth2/token with Metadata: true header",
          "tone": "amber"
        },
        {
          "storyTerm": "Withdrawing the server Managed Identity pass",
          "technicalTerm": "Short-lived Azure AD OAuth JWT issued for the VM System-Assigned or User-Assigned Identity",
          "tone": "sky"
        },
        {
          "storyTerm": "Unlocking connected vaults and storage accounts",
          "technicalTerm": "Using the stolen Managed Identity token against Azure Key Vault and Storage APIs",
          "tone": "rose"
        },
        {
          "storyTerm": "Detecting off-box token replay",
          "technicalTerm": "Microsoft Defender for Cloud alerting on Managed Identity tokens used from external IPs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-azure-vm-cse-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Tapping the room local identity window",
          "subtitle": "HTTP GET http://169.254.169.254/metadata/identity/oauth2/token…",
          "tone": "amber"
        },
        {
          "id": "cld-azure-vm-cse-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Withdrawing the server Managed Identity…",
          "subtitle": "Short-lived Azure AD OAuth JWT issued for the VM…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STEP 03 · SETUP",
          "title": "Tapping the room local identity window",
          "storyExcerpt": "Standing inside the server with supreme local rights, the script taps the room local identity window (supplying the required Metadata header) to withdraw the server own Managed Identity cloud…",
          "technicalParallel": "Under the hood, the observed step executes AADManagedIdentitySignInLogs | where ServicePrincipalName == \"prod-app-vm01\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Withdrawing the server Managed Identity pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses withdrawing the server managed identity pass to advance toward unlocking connected vaults and storage accounts.",
          "technicalParallel": "Running inside the VM, the script queries http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net with header Metadata: true to obtain the VM…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Off-box",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Detecting off-box token replay",
          "storyExcerpt": "Behind the scenes, detecting off-box token replay captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording MetadataEndpoint=http://169.254.169.254/metadata/identity/oauth2/token, KeyVaultOperation=SecretGet , sql-conn-string, CallerIdentity=System-Assigned…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Dispatch Slot",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Butler Bay",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Managed Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.005"
    }
  },
  "cloud-entra-id-conditional-access-device-code-phishing-audit": {
    "briefing": {
      "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-entra-devcode-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1528",
      "title": "Entra ID OAuth 2.0 Device Code Flow (/devicecode) Token Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud office park that offers a handy short pairing code so smart TVs and printers without keyboards can sign in easily. A con artist walks up to the pairing booth, grabs a fresh nine-character code, mails it to an employee claiming it unlocks an urgent meeting invite, and waits while the employee types the code on the official corporate login page; the instant the employee clicks approve, the con artist receives a master family-of-apps pass that unlocks email, file lockers, and team chat.",
      "technicalCue": "CREDENTIAL ACCESS: OAuth 2.0 /devicecode Request & User Code Redemption on devicelogin -> DEFENSE EVASION: Family of Client IDs (FOCI) Refresh Token Exchange Across Graph Scopes -> EXFIL & IMPACT: Microsoft Graph API Mail, OneDrive & Teams Message Enumeration Audit",
      "storyMappings": [
        {
          "storyTerm": "Grabbing a nine-character smart-TV pairing code for an employee to type",
          "technicalTerm": "OAuth 2.0 /devicecode request and victim redemption on microsoft.com/devicelogin",
          "tone": "amber"
        },
        {
          "storyTerm": "Master family-of-apps pass unlocking multiple doors at once",
          "technicalTerm": "Family of Client IDs (FOCI) refresh token exchange across Microsoft Graph scopes",
          "tone": "sky"
        },
        {
          "storyTerm": "Reading mail, file lockers, and team chat silently",
          "technicalTerm": "Microsoft Graph API enumeration of Mail, OneDrive, and Teams messages",
          "tone": "rose"
        },
        {
          "storyTerm": "Closing the keyless pairing loophole",
          "technicalTerm": "Entra ID Conditional Access policy blocking authenticationTransfer / deviceCodeFlow",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-entra-devcode-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Grabbing a nine-character smart-TV…",
          "subtitle": "OAuth 2.0 /devicecode request and victim redemption on…",
          "tone": "amber"
        },
        {
          "id": "cld-entra-devcode-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Master family-of-apps pass unlocking…",
          "subtitle": "Family of Client IDs (FOCI) refresh token exchange across…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Code",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "OAuth 2.0 /devicecode Request & User Code Redemption on devicelogin",
          "storyExcerpt": "Requesting a legitimate nine-character device-pairing code from the cloud lobby, the phisher sends it to a targeted employee inside a realistic invitation lure so the employee unwittingly signs in with…",
          "technicalParallel": "Under the hood, the observed step executes SigninLogs | where AuthenticationProtocol == \"deviceCode\" (which executes the technical command / telemetry directive , SigninLogs | where…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Apps",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Family of Client IDs (FOCI) Refresh Token Exchange Across Graph Scopes",
          "storyExcerpt": "Because Microsoft trusted family of workplace applications shares a single interchangeable master refresh voucher, the intruder immediately swaps the freshly captured token for brand-new passes spanning…",
          "technicalParallel": "Under the hood, the observed step executes AADNonInteractiveUserSignInLogs | where UserPrincipalName == \"j.smith@corp.local\" and IPAddress == \"203.0.113.88\" (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Chat",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Microsoft Graph API Mail, OneDrive & Teams Message Enumeration Audit",
          "storyExcerpt": "Armed with broad Graph reading passes, the intruder programmatically searches the victim inbox, downloads sensitive shared documents from cloud lockers, and scans internal chat channels for passwords and…",
          "technicalParallel": "Under the hood, the observed step executes MicrosoftGraphActivityLogs | where UserId == \"<user-guid>\" and RequestUri has_any (\"/messages\", \"/drive/\", \"/chats\") (which executes the technical command /…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Pairing Screen",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Token Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Code Relay",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-entra-devcode-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "OAuth 2.0 /devicecode Request & User Code Redemption on devicelogin",
      "storyCue": "Requesting a legitimate nine-character device-pairing code from the cloud lobby, the phisher sends it to a targeted employee inside a realistic invitation lure so the employee unwittingly signs in with their real password and MFA on the genuine company login page.",
      "technicalCue": "T1528 · CREDENTIAL ACCESS — An external client requests a device_code and 9-character user_code from login.microsoftonline.com/common/oauth2/v2.0/devicecode using a public client_id.",
      "storyMappings": [
        {
          "storyTerm": "Requesting a legitimate device-pairing code",
          "technicalTerm": "Attacker POST to /oauth2/v2.0/devicecode obtaining user_code and device_code",
          "tone": "amber"
        },
        {
          "storyTerm": "Genuine company login page fooled by the lure",
          "technicalTerm": "Victim authenticating with full MFA at https://microsoft.com/devicelogin",
          "tone": "sky"
        },
        {
          "storyTerm": "Attacker silently polling until the green light flashes",
          "technicalTerm": "Polling /oauth2/v2.0/token until Entra ID delivers the victim access and refresh tokens",
          "tone": "rose"
        },
        {
          "storyTerm": "Sign-in log showing the distinct pairing protocol",
          "technicalTerm": "Entra ID SigninLogs flagging authenticationProtocol == \"deviceCode\"",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-entra-devcode-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Requesting a legitimate device-pairing…",
          "subtitle": "Attacker POST to /oauth2/v2.0/devicecode obtaining user_code…",
          "tone": "amber"
        },
        {
          "id": "cld-entra-devcode-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Genuine company login page fooled by the…",
          "subtitle": "Victim authenticating with full MFA at…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Code",
          "stageTag": "STEP 01 · SETUP",
          "title": "Requesting a legitimate device-pairing code",
          "storyExcerpt": "Requesting a legitimate nine-character device-pairing code from the cloud lobby, the phisher sends it to a targeted employee inside a realistic invitation lure so the employee unwittingly signs…",
          "technicalParallel": "Under the hood, the observed step executes SigninLogs | where AuthenticationProtocol == \"deviceCode\" (which executes the technical command / telemetry directive , SigninLogs | where…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Page Lure",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Genuine company login page fooled by the lure",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses genuine company login page fooled by the lure to advance toward attacker silently polling until the green light flashes.",
          "technicalParallel": "An external client requests a device_code and 9-character user_code from login.microsoftonline.com/common/oauth2/v2.0/devicecode using a public client_id.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Sign-in Log",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Sign-in log showing the distinct pairing protocol",
          "storyExcerpt": "Behind the scenes, sign-in log showing the distinct pairing protocol captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 0 (recording AuthenticationProtocol=deviceCode , OAuth 2.0 RFC 8628, RedemptionPortal=https://microsoft.com/devicelogin, PollingClientIp=203.0.113.88 under T1528): Block…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Pairing Screen",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Token Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Code Relay",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1528"
    },
    "step-2": {
      "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-entra-devcode-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Family of Client IDs (FOCI) Refresh Token Exchange Across Graph Scopes",
      "storyCue": "Because Microsoft trusted family of workplace applications shares a single interchangeable master refresh voucher, the intruder immediately swaps the freshly captured token for brand-new passes spanning multiple high-value office wings without ever prompting the employee again.",
      "technicalCue": "T1550.001 · DEFENSE EVASION — Once the device_code poll succeeds, the remote client receives an OAuth Refresh Token belonging to Microsoft Family of Client IDs (FOCI), enabling silent token exchange across Microsoft Graph…",
      "storyMappings": [
        {
          "storyTerm": "Interchangeable master refresh voucher across apps",
          "technicalTerm": "Family of Client IDs (FOCI) refresh token exchanged across sibling first-party client IDs",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapping for fresh passes spanning multiple wings",
          "technicalTerm": "Minting new access tokens for Microsoft Graph, Teams, SharePoint, and Azure CLI",
          "tone": "sky"
        },
        {
          "storyTerm": "Zero second prompt shown to the employee",
          "technicalTerm": "Silent token refresh operating seamlessly from attacker infrastructure",
          "tone": "rose"
        },
        {
          "storyTerm": "Cross-app token trail in audit logs",
          "technicalTerm": "Multiple Entra Sign-In events sharing the same SessionId across different AppIds",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-entra-devcode-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Interchangeable master refresh voucher…",
          "subtitle": "Family of Client IDs (FOCI) refresh token exchanged across…",
          "tone": "amber"
        },
        {
          "id": "cld-entra-devcode-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Swapping for fresh passes spanning…",
          "subtitle": "Minting new access tokens for Microsoft Graph, Teams…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Apps",
          "stageTag": "STEP 02 · SETUP",
          "title": "Interchangeable master refresh voucher across apps",
          "storyExcerpt": "Because Microsoft trusted family of workplace applications shares a single interchangeable master refresh voucher, the intruder immediately swaps the freshly captured token for brand-new passes…",
          "technicalParallel": "Under the hood, the observed step executes AADNonInteractiveUserSignInLogs | where UserPrincipalName == \"j.smith@corp.local\" and IPAddress == \"203.0.113.88\" (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Zero",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Swapping for fresh passes spanning multiple wings",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses swapping for fresh passes spanning multiple wings to advance toward zero second prompt shown to the employee.",
          "technicalParallel": "Once the device_code poll succeeds, the remote client receives an OAuth Refresh Token belonging to Microsoft Family of Client IDs (FOCI), enabling silent token exchange across Microsoft Graph, Azure…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zero",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Cross-app token trail in audit logs",
          "storyExcerpt": "Behind the scenes, cross-app token trail in audit logs captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 0 (recording LogSource=AADNonInteractiveUserSignInLogs, ExchangedResource=Microsoft Graph , https://graph.microsoft.com/.default, TokenFamily=FOCI Refresh Token Exchange…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Pairing Screen",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Token Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Code Relay",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.001"
    },
    "step-3": {
      "scenarioId": "cloud-entra-id-conditional-access-device-code-phishing-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-entra-devcode-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Microsoft Graph API Mail, OneDrive & Teams Message Enumeration Audit",
      "storyCue": "Armed with broad Graph reading passes, the intruder programmatically searches the victim inbox, downloads sensitive shared documents from cloud lockers, and scans internal chat channels for passwords and wire-transfer threads.",
      "technicalCue": "T1530 · EXFIL & IMPACT — Using the minted Graph bearer token, the actor queries /v1.0/me/messages, /v1.0/me/drive/root/children, and /v1.0/me/chats, captured in Microsoft Graph Activity Logs…",
      "storyMappings": [
        {
          "storyTerm": "Programmatically searching inbox, lockers, and chat channels",
          "technicalTerm": "Automated Microsoft Graph API calls to /me/messages, /me/drive, and /me/chats",
          "tone": "amber"
        },
        {
          "storyTerm": "Hunting passwords and wire-transfer threads",
          "technicalTerm": "Keyword search queries targeting credentials, VPN guides, and financial approvals",
          "tone": "sky"
        },
        {
          "storyTerm": "Unified audit trail exposing accessed items",
          "technicalTerm": "Purview MailItemsAccessed and SharePoint FileDownloaded events tied to the rogue session",
          "tone": "rose"
        },
        {
          "storyTerm": "Blocking device-code abuse proactively",
          "technicalTerm": "Conditional Access authentication flow policy blocking Device Code Flow",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-entra-devcode-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Programmatically searching inbox…",
          "subtitle": "Automated Microsoft Graph API calls to /me/messages…",
          "tone": "amber"
        },
        {
          "id": "cld-entra-devcode-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hunting passwords and wire-transfer…",
          "subtitle": "Keyword search queries targeting credentials, VPN guides, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Chat",
          "stageTag": "STEP 03 · SETUP",
          "title": "Programmatically searching inbox, lockers, and chat…",
          "storyExcerpt": "Armed with broad Graph reading passes, the intruder programmatically searches the victim inbox, downloads sensitive shared documents from cloud lockers, and scans internal chat channels for…",
          "technicalParallel": "Under the hood, the observed step executes MicrosoftGraphActivityLogs | where UserId == \"<user-guid>\" and RequestUri has_any (\"/messages\", \"/drive/\", \"/chats\") (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wire-transfer",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hunting passwords and wire-transfer threads",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hunting passwords and wire-transfer threads to advance toward unified audit trail exposing accessed items.",
          "technicalParallel": "Using the minted Graph bearer token, the actor queries /v1.0/me/messages, /v1.0/me/drive/root/children, and /v1.0/me/chats, captured in Microsoft Graph Activity Logs (MicrosoftGraphActivityLogs) (logged…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Chat",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Blocking device-code abuse proactively",
          "storyExcerpt": "Behind the scenes, blocking device-code abuse proactively captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording DiagnosticTable=MicrosoftGraphActivityLogs, GraphEndpoint=GET /v1.0/me/messages?$top=100, ActiveTokenScopes=Mail.Read Files.Read.All under T1530): Enable…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Pairing Screen",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Token Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Code Relay",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    }
  },
  "cloud-gcp-cloud-build-default-service-account-artifact-audit": {
    "briefing": {
      "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-gcp-cloudbuild-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1648",
      "title": "GCP Cloud Build Default Service Account & Artifact Registry Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud software factory whose automated build bay runs every submitted assembly job wearing a generously powered default factory badge that holds keys to both the artifact vault and the source storage warehouse. Submitting an ad-hoc build order containing one sneaky command, an intruder walks into the worker booth, reads the default factory badge straight off the wall metadata box, and uses it to raid both finished packages and private source archives.",
      "technicalCue": "EXECUTION: Submitting Ad-Hoc Cloud Build Job via google.devtools.cloudbuild.v1.CloudBuild.CreateBuild -> DEFENSE EVASION: Worker Container Metadata Query for @cloudbuild.gserviceaccount.com OAuth2 Token -> EXFIL & IMPACT: Artifact Registry & Cloud Storage Source Archive Access Audit",
      "storyMappings": [
        {
          "storyTerm": "Submitting an ad-hoc build order containing a sneaky command",
          "technicalTerm": "google.devtools.cloudbuild.v1.CloudBuild.CreateBuild ad-hoc job submission",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading the default factory badge straight off the wall box",
          "technicalTerm": "Worker container querying metadata server for @cloudbuild.gserviceaccount.com OAuth token",
          "tone": "sky"
        },
        {
          "storyTerm": "Raiding finished packages and private source archives",
          "technicalTerm": "Unauthorized access to GCP Artifact Registry and Cloud Storage source buckets",
          "tone": "rose"
        },
        {
          "storyTerm": "Replacing the shared master badge with narrow per-job badges",
          "technicalTerm": "Enforcing user-specified least-privilege Cloud Build service accounts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-gcp-cloudbuild-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Submitting an ad-hoc build order…",
          "subtitle": "google.devtools.cloudbuild.v1.CloudBuild.CreateBuild ad-hoc…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-cloudbuild-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Reading the default factory badge…",
          "subtitle": "Worker container querying metadata server for…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Ad-hoc",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "Submitting Ad-Hoc Cloud Build Job via google.devtools.cloudbuild.v1.CloudBuild.CreateBuild",
          "storyExcerpt": "Using compromised developer permissions that allow triggering builds, the intruder submits a quick custom assembly job straight to the cloud build queue carrying an inline shell step designed purely to…",
          "technicalParallel": "Under the hood, the observed step executes gcloud logging read 'protoPayload.methodName=\"google.devtools.cloudbuild.v1.CloudBuild.CreateBuild\"' --limit=10 (which executes a cloud control-plane API or CLI…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wall",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Worker Container Metadata Query for @cloudbuild.gserviceaccount.com OAuth2 Token",
          "storyExcerpt": "The moment the automated build bay spins up the attacker worker container, the container taps the booth local wall panel and lifts the live delegated access badge belonging to the overly privileged…",
          "technicalParallel": "Under the hood, the observed step executes gcloud projects get-iam-policy corp-prod-01 --flatten=\"bindings[].members\" --filter=\"bindings.members:cloudbuild.gserviceaccount.com\" (which executes a cloud…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Both",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Artifact Registry & Cloud Storage Source Archive Access Audit",
          "storyExcerpt": "Wielding the stolen default builder badge, the intruder opens both the finished-software Artifact Registry and the private Cloud Storage source archives to steal proprietary builds or plant tampered…",
          "technicalParallel": "Under the hood, the observed step executes gcloud logging read 'protoPayload.authenticationInfo.principalEmail=\"445566778899@cloudbuild.gserviceaccount.com\" AND…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Build Deck",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Artifact Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Default Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-gcp-cloudbuild-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "Submitting Ad-Hoc Cloud Build Job via google.devtools.cloudbuild.v1.CloudBuild.CreateBuild",
      "storyCue": "Using compromised developer permissions that allow triggering builds, the intruder submits a quick custom assembly job straight to the cloud build queue carrying an inline shell step designed purely to harvest credentials.",
      "technicalCue": "T1648 · EXECUTION — A compromised identity holding roles/cloudbuild.builds.editor (or cloudbuild.builds.create) submits an inline cloudbuild.yaml build step via gcloud builds submit, recorded in GCP Admin Activity…",
      "storyMappings": [
        {
          "storyTerm": "Quick custom assembly job submitted directly",
          "technicalTerm": "gcloud builds submit invoking google.devtools.cloudbuild.v1.CloudBuild.CreateBuild",
          "tone": "amber"
        },
        {
          "storyTerm": "Inline shell step designed to harvest credentials",
          "technicalTerm": "Custom cloudbuild.yaml step executing curl against the local metadata endpoint",
          "tone": "sky"
        },
        {
          "storyTerm": "No source repository change required",
          "technicalTerm": "Ad-hoc build submission bypassing Git pull-request review and branch protections",
          "tone": "rose"
        },
        {
          "storyTerm": "Cloud audit ledger logging the ad-hoc job",
          "technicalTerm": "GCP Admin Activity Audit Log capturing CreateBuild parameters and caller",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-cloudbuild-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Quick custom assembly job submitted…",
          "subtitle": "gcloud builds submit invoking…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-cloudbuild-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Inline shell step designed to harvest…",
          "subtitle": "Custom cloudbuild.yaml step executing curl against the local…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Quick custom assembly job submitted directly",
          "storyExcerpt": "Using compromised developer permissions that allow triggering builds, the intruder submits a quick custom assembly job straight to the cloud build queue carrying an inline shell step designed…",
          "technicalParallel": "Under the hood, the observed step executes gcloud logging read 'protoPayload.methodName=\"google.devtools.cloudbuild.v1.CloudBuild.CreateBuild\"' --limit=10 (which executes a cloud control-plane API or CLI…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses No",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Inline shell step designed to harvest credentials",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses inline shell step designed to harvest credentials to advance toward no source repository change required.",
          "technicalParallel": "A compromised identity holding roles/cloudbuild.builds.editor (or cloudbuild.builds.create) submits an inline cloudbuild.yaml build step via gcloud builds submit, recorded in GCP Admin Activity Cloud…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Ad-hoc Job",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Cloud audit ledger logging the ad-hoc job",
          "storyExcerpt": "Behind the scenes, cloud audit ledger logging the ad-hoc job captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording GcpService=cloudbuild.googleapis.com, MethodName=google.devtools.cloudbuild.v1.CloudBuild.CreateBuild…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Build Deck",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Artifact Silo",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Default Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1648"
    },
    "step-2": {
      "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-gcp-cloudbuild-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Worker Container Metadata Query for @cloudbuild.gserviceaccount.com OAuth2 Token",
      "storyCue": "The moment the automated build bay spins up the attacker worker container, the container taps the booth local wall panel and lifts the live delegated access badge belonging to the overly privileged default factory service account.",
      "technicalCue": "T1552.005 · DEFENSE EVASION — Inside the Cloud Build step container, the build command queries http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token (with header Metadata-Flavor: Google)…",
      "storyMappings": [
        {
          "storyTerm": "Booth local metadata wall panel",
          "technicalTerm": "GCP instance metadata endpoint metadata.google.internal (Metadata-Flavor: Google)",
          "tone": "amber"
        },
        {
          "storyTerm": "Overly privileged default factory badge",
          "technicalTerm": "<project-number>@cloudbuild.gserviceaccount.com OAuth2 access token",
          "tone": "sky"
        },
        {
          "storyTerm": "Sneaking the stolen badge out of the build bay",
          "technicalTerm": "Exfiltrating the live Bearer token via outbound HTTP or build logs",
          "tone": "rose"
        },
        {
          "storyTerm": "Privilege escalation from build submitter to builder",
          "technicalTerm": "Escalating from Cloud Build Editor to broad project deployment permissions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-cloudbuild-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Booth local metadata wall panel",
          "subtitle": "GCP instance metadata endpoint metadata.google.internal…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-cloudbuild-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Overly privileged default factory badge",
          "subtitle": "<project-number>@cloudbuild.gserviceaccount.com OAuth2 access…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STEP 02 · SETUP",
          "title": "Booth local metadata wall panel",
          "storyExcerpt": "The moment the automated build bay spins up the attacker worker container, the container taps the booth local metadata wall panel and lifts the live delegated badge badge belonging to the…",
          "technicalParallel": "Under the hood, the observed step executes gcloud projects get-iam-policy corp-prod-01 --flatten=\"bindings[].members\" --filter=\"bindings.members:cloudbuild.gserviceaccount.com\" (which executes a cloud…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Overly privileged default factory badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses overly privileged default factory badge to advance toward sneaking the stolen badge out of the build bay.",
          "technicalParallel": "Inside the Cloud Build step container, the build command queries http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token (with header Metadata-Flavor: Google) to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Bay",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Privilege escalation from build submitter to builder",
          "storyExcerpt": "Behind the scenes, privilege escalation from build submitter to builder captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording MetadataEndpoint=http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Build Deck",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Artifact Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Default Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.005"
    },
    "step-3": {
      "scenarioId": "cloud-gcp-cloud-build-default-service-account-artifact-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-gcp-cloudbuild-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Artifact Registry & Cloud Storage Source Archive Access Audit",
      "storyCue": "Wielding the stolen default builder badge, the intruder opens both the finished-software Artifact Registry and the private Cloud Storage source archives to steal proprietary builds or plant tampered release images.",
      "technicalCue": "T1530 · EXFIL & IMPACT — Using the Cloud Build service account token, the actor reads container images in Artifact Registry and staging archives in gs://<project>_cloudbuild/source/, logged in GCP Data Access Audit…",
      "storyMappings": [
        {
          "storyTerm": "Finished-software Artifact Registry opened",
          "technicalTerm": "Pulling or pushing poisoned container images in GCP Artifact Registry",
          "tone": "amber"
        },
        {
          "storyTerm": "Private source archives accessed",
          "technicalTerm": "Reading Cloud Storage source staging buckets (_cloudbuild) via storage.objects.get",
          "tone": "sky"
        },
        {
          "storyTerm": "Data access trail attributing the raid",
          "technicalTerm": "GCP Audit Logs showing @cloudbuild.gserviceaccount.com used from external IPs",
          "tone": "rose"
        },
        {
          "storyTerm": "Hardening the factory against badge theft",
          "technicalTerm": "Disabling default Cloud Build SA and assigning custom least-privilege build SAs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gcp-cloudbuild-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Finished-software Artifact Registry opened",
          "subtitle": "Pulling or pushing poisoned container images in GCP Artifact…",
          "tone": "amber"
        },
        {
          "id": "cld-gcp-cloudbuild-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Private source archives accessed",
          "subtitle": "Reading Cloud Storage source staging buckets (_cloudbuild) via…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Both",
          "stageTag": "STEP 03 · SETUP",
          "title": "Finished-software Artifact Registry opened",
          "storyExcerpt": "Wielding the stolen default builder badge, the intruder opens both the finished-software Artifact Registry and the private Cloud Storage source archives to steal proprietary builds or plant…",
          "technicalParallel": "Under the hood, the observed step executes gcloud logging read 'protoPayload.authenticationInfo.principalEmail=\"445566778899@cloudbuild.gserviceaccount.com\" AND…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Data",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Private source archives accessed",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses private source archives accessed to advance toward data access trail attributing the raid.",
          "technicalParallel": "Using the Cloud Build service account token, the actor reads container images in Artifact Registry and staging archives in gs://<project>_cloudbuild/source/, logged in GCP Data Access Audit Logs (logged…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Data Raid",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Hardening the factory against badge theft",
          "storyExcerpt": "Behind the scenes, hardening the factory against badge theft captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditLogStream=cloudaudit.googleapis.com/data_access, MethodName=storage.objects.get, TargetBucketObject=gs://corp-prod-01_cloudbuild/source/1763312400.tgz…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Build Deck",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Artifact Silo",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Default Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    }
  },
  "cloud-github-actions-pull-request-target-oidc-token-audit": {
    "briefing": {
      "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-gha-oidc-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "GitHub Actions pull_request_target Workflow & Cloud OIDC Token Audit — Story-to-Technical Overview",
      "storyCue": "Imagine an automated software workshop whose intake conveyor accidentally invites untrusted blueprints submitted by outside strangers directly into the privileged assembly vault. The instant the vault runs the stranger build script, the script lifts a temporary cloud identity voucher straight from the workshop workbench and trades it at the cloud front gate for live production AWS credentials.",
      "technicalCue": "INITIAL ACCESS: Privileged pull_request_target Trigger Checking Out Untrusted Fork PR Head Ref -> CREDENTIAL ACCESS: Runner Environment Variable Inspection & OIDC JWT Token Request -> LATERAL & C2: AWS STS AssumeRoleWithWebIdentity & CloudTrail Subject Claim Audit",
      "storyMappings": [
        {
          "storyTerm": "Inviting untrusted outside blueprints straight into the privileged vault",
          "technicalTerm": "GitHub Actions pull_request_target workflow checking out untrusted fork PR HEAD",
          "tone": "amber"
        },
        {
          "storyTerm": "Lifting a temporary cloud identity voucher from the workbench",
          "technicalTerm": "Querying ACTIONS_ID_TOKEN_REQUEST_URL to mint a signed GitHub OIDC JWT",
          "tone": "sky"
        },
        {
          "storyTerm": "Trading the voucher at the cloud gate for production credentials",
          "technicalTerm": "Calling AWS sts:AssumeRoleWithWebIdentity using the forged PR-context OIDC JWT",
          "tone": "rose"
        },
        {
          "storyTerm": "Checking the fine print stamped on the cloud gate receipt",
          "technicalTerm": "Auditing AWS CloudTrail OIDC sub claim and tightening IAM trust conditions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-gha-oidc-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Inviting untrusted outside blueprints…",
          "subtitle": "GitHub Actions pull_request_target workflow checking out…",
          "tone": "amber"
        },
        {
          "id": "cld-gha-oidc-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Lifting a temporary cloud identity…",
          "subtitle": "Querying ACTIONS_ID_TOKEN_REQUEST_URL to mint a signed GitHub…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Full",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Privileged pull_request_target Trigger Checking Out Untrusted Fork PR Head Ref",
          "storyExcerpt": "An external contributor opens a seemingly helpful change proposal from a public fork. Because the repository workflow triggers with full privileged vault access and explicitly checks out the untrusted…",
          "technicalParallel": "Under the hood, the observed step executes gh api /orgs/corp-org/audit-log?phrase=action:workflows (which executes the technical command / telemetry directive , gh api…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Note Url",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Runner Environment Variable Inspection & OIDC JWT Token Request",
          "storyExcerpt": "Running inside the privileged build workbench, the stranger script reads two secret workbench notes (one holding the voucher-booth URL and one holding the booth entry pass) and requests a freshly signed…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k github_runner_exec -m SYSCALL -sv yes (which executes the technical command / telemetry directive , ausearch -k github_runner_exec -m SYSCALL -sv…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Oidc Card",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "AWS STS AssumeRoleWithWebIdentity & CloudTrail Subject Claim Audit",
          "storyExcerpt": "Carrying that freshly signed OIDC identity card straight to the cloud front gate, the script swaps it for temporary AWS administrative credentials because the cloud trust policy checked only the…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"AssumeRoleWithWebIdentity\")' cloudtrail.json (which executes the technical command / telemetry directive , jq '.Records[] |…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PR Conveyor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "OIDC Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Cloud Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-gha-oidc-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Privileged pull_request_target Trigger Checking Out Untrusted Fork PR Head Ref",
      "storyCue": "An external contributor opens a seemingly helpful change proposal from a public fork. Because the repository workflow triggers with full privileged vault access and explicitly checks out the untrusted stranger branch code, the workshop executes attacker code inside its trusted build zone.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Unlike pull_request, a workflow triggered by pull_request_target runs in the context of the base repository with write permissions and access to secrets/OIDC.",
      "storyMappings": [
        {
          "storyTerm": "Workflow triggering with full privileged vault access",
          "technicalTerm": "GitHub Actions pull_request_target trigger inheriting base repository secrets and OIDC rights",
          "tone": "amber"
        },
        {
          "storyTerm": "Explicitly checking out the untrusted stranger branch",
          "technicalTerm": "actions/checkout configured with ref: ${{ github.event.pull_request.head.sha }}",
          "tone": "sky"
        },
        {
          "storyTerm": "Executing attacker build commands inside the trusted zone",
          "technicalTerm": "Arbitrary code execution via modified Makefile, package.json, or test scripts in the PR",
          "tone": "rose"
        },
        {
          "storyTerm": "Classic CI/CD PwnRequest pattern",
          "technicalTerm": "Mixing untrusted fork code execution with privileged base-repo permissions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gha-oidc-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Workflow triggering with full privileged…",
          "subtitle": "GitHub Actions pull_request_target trigger inheriting base…",
          "tone": "amber"
        },
        {
          "id": "cld-gha-oidc-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Explicitly checking out the untrusted…",
          "subtitle": "actions/checkout configured with ref: ${{…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Full",
          "stageTag": "STEP 01 · SETUP",
          "title": "Workflow triggering with full privileged vault access",
          "storyExcerpt": "An external contributor opens a seemingly helpful change proposal from a public fork.",
          "technicalParallel": "Under the hood, the observed step executes gh api /orgs/corp-org/audit-log?phrase=action:workflows (which executes the technical command / telemetry directive , gh api…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full Out",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Explicitly checking out the untrusted stranger branch",
          "storyExcerpt": "Because the repository workflow triggers with full privileged vault access and explicitly checks out the untrusted stranger branch code, the workshop executes attacker code inside its trusted…",
          "technicalParallel": "Unlike pull_request, a workflow triggered by pull_request_target runs in the context of the base repository with write permissions and access to secrets/OIDC.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zone",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Classic CI/CD PwnRequest pattern",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across classic ci/cd pwnrequest pattern while locking down executing attacker build commands inside the trusted zone.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording WorkflowTrigger=pull_request_target , Base Repo Context + Write Token, DangerousPattern=actions/checkout ref: github.event.pull_request.head.sha…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PR Conveyor",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "OIDC Kiosk",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Cloud Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-gha-oidc-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Runner Environment Variable Inspection & OIDC JWT Token Request",
      "storyCue": "Running inside the privileged build workbench, the stranger script reads two secret workbench notes (one holding the voucher-booth URL and one holding the booth entry pass) and requests a freshly signed OpenID identity card proving it belongs to the trusted repository.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Executing during the build step, the modified build script reads ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN from the runner process environment to request a signed GitHub…",
      "storyMappings": [
        {
          "storyTerm": "Workbench note holding the voucher-booth URL",
          "technicalTerm": "Runner environment variable ACTIONS_ID_TOKEN_REQUEST_URL",
          "tone": "amber"
        },
        {
          "storyTerm": "Workbench note holding the booth entry pass",
          "technicalTerm": "Runner environment variable ACTIONS_ID_TOKEN_REQUEST_TOKEN",
          "tone": "sky"
        },
        {
          "storyTerm": "Freshly signed OpenID identity card",
          "technicalTerm": "Signed GitHub OIDC JWT issued with audience sts.amazonaws.com and id-token: write",
          "tone": "rose"
        },
        {
          "storyTerm": "Zero static long-lived secrets needed",
          "technicalTerm": "Abusing modern keyless OIDC federation through overly broad trust policies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gha-oidc-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Workbench note holding the voucher-booth…",
          "subtitle": "Runner environment variable ACTIONS_ID_TOKEN_REQUEST_URL",
          "tone": "amber"
        },
        {
          "id": "cld-gha-oidc-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Workbench note holding the booth entry…",
          "subtitle": "Runner environment variable ACTIONS_ID_TOKEN_REQUEST_TOKEN",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Note Url",
          "stageTag": "STEP 02 · SETUP",
          "title": "Workbench note holding the voucher-booth URL",
          "storyExcerpt": "Running inside the privileged build workbench, the stranger script reads two secret workbench notes (one holding the voucher-booth URL and one holding the booth entry pass) and requests a…",
          "technicalParallel": "Under the hood, the observed step executes ausearch -k github_runner_exec -m SYSCALL -sv yes (which executes the technical command / telemetry directive , ausearch -k github_runner_exec -m SYSCALL -sv…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Note Pass",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Workbench note holding the booth entry pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses workbench note holding the booth entry pass to advance toward freshly signed openid identity card.",
          "technicalParallel": "Executing during the build step, the modified build script reads ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN from the runner process environment to request a signed GitHub OIDC JWT…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Zero static long-lived secrets needed",
          "storyExcerpt": "Behind the scenes, zero static long-lived secrets needed captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording OidcEndpoint=ACTIONS_ID_TOKEN_REQUEST_URL , &audience=sts.amazonaws.com, TokenSubjectClaim=repo:corp-org/cloud-infra:pull_request…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PR Conveyor",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "OIDC Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Cloud Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.001"
    },
    "step-3": {
      "scenarioId": "cloud-github-actions-pull-request-target-oidc-token-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-gha-oidc-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "AWS STS AssumeRoleWithWebIdentity & CloudTrail Subject Claim Audit",
      "storyCue": "Carrying that freshly signed OIDC identity card straight to the cloud front gate, the script swaps it for temporary AWS administrative credentials because the cloud trust policy checked only the repository name and forgot to insist on the protected main branch.",
      "technicalCue": "T1550.001 · LATERAL & C2 — Because the AWS IAM Role trust policy verified only token.actions.githubusercontent.com:sub Like repo:corp-org/cloud-infra:* without restricting the ref to refs/heads/main…",
      "storyMappings": [
        {
          "storyTerm": "Swapping the OIDC card at the cloud front gate",
          "technicalTerm": "AWS STS AssumeRoleWithWebIdentity returning temporary production IAM credentials",
          "tone": "amber"
        },
        {
          "storyTerm": "Trust policy checking only the repository name",
          "technicalTerm": "Over-broad IAM StringLike condition repo:org/app:* allowing pull_request subjects",
          "tone": "sky"
        },
        {
          "storyTerm": "Fine print on the cloud gate receipt",
          "technicalTerm": "CloudTrail requestParameters and OIDC sub claim showing pull_request instead of refs/heads/main",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking the trust gate strictly to main releases",
          "technicalTerm": "Restricting IAM trust policies strictly to repo:org/app:ref:refs/heads/main or environments",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-gha-oidc-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Swapping the OIDC card at the cloud…",
          "subtitle": "AWS STS AssumeRoleWithWebIdentity returning temporary…",
          "tone": "amber"
        },
        {
          "id": "cld-gha-oidc-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Trust policy checking only the…",
          "subtitle": "Over-broad IAM StringLike condition repo:org/app:* allowing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Oidc Card",
          "stageTag": "STEP 03 · SETUP",
          "title": "Swapping the OIDC card at the cloud front gate",
          "storyExcerpt": "Carrying that freshly signed OIDC identity card straight to the cloud front gate, the script swaps it for temporary AWS administrative credentials because the cloud trust policy checked only…",
          "technicalParallel": "Under the hood, the observed step executes jq '.Records[] | select(.eventName==\"AssumeRoleWithWebIdentity\")' cloudtrail.json (which executes the technical command / telemetry directive , jq '.Records[] |…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Only Name",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Trust policy checking only the repository name",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses trust policy checking only the repository name to advance toward fine print on the cloud gate receipt.",
          "technicalParallel": "Because the AWS IAM Role trust policy verified only token.actions.githubusercontent.com:sub Like repo:corp-org/cloud-infra:* without restricting the ref to refs/heads/main, sts:AssumeRoleWithWebIdentity…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Fine Gate",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Locking the trust gate strictly to main releases",
          "storyExcerpt": "Behind the scenes, locking the trust gate strictly to main releases captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording CloudTrailEvent=AssumeRoleWithWebIdentity, OidcIdentityProvider=token.actions.githubusercontent.com…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "PR Conveyor",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "OIDC Kiosk",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Cloud Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.001"
    }
  },
  "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit": {
    "briefing": {
      "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-m365-ediscov-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1098.003",
      "title": "M365 Purview New-ComplianceSearch & eDiscovery Export Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate courthouse that houses an official legal-discovery archive machine built to search every single employee email drawer, file cabinet, and chat room across the entire company at once. After secretly adding their own hijacked badge onto the Legal Discovery Manager roster, an intruder runs a company-wide keyword search for passwords and mergers, then packs every matching document across thousands of employees into neat downloadable shipping trunks without ever touching a single employee desk.",
      "technicalCue": "DEFENSE EVASION: RoleGroupMember Added to eDiscovery Manager in Security & Compliance Center -> EXFIL & IMPACT: Tenant-Wide Keyword Query via New-ComplianceSearch & Start-ComplianceSearch -> EXFIL & IMPACT: PST/Zip Package Export via New-ComplianceSearchAction -Export & SearchExported Audit",
      "storyMappings": [
        {
          "storyTerm": "Adding a hijacked badge onto the Legal Discovery Manager roster",
          "technicalTerm": "Adding RoleGroupMember to eDiscovery Manager in Microsoft Purview Compliance Center",
          "tone": "amber"
        },
        {
          "storyTerm": "Running a company-wide search for passwords and merger files",
          "technicalTerm": "Executing tenant-wide New-ComplianceSearch and Start-ComplianceSearch queries",
          "tone": "sky"
        },
        {
          "storyTerm": "Packing every matching document into downloadable shipping trunks",
          "technicalTerm": "Running New-ComplianceSearchAction -Export to download PST and Zip packages",
          "tone": "rose"
        },
        {
          "storyTerm": "Courthouse compliance ledger catching the silent mass export",
          "technicalTerm": "Purview Unified Audit Log SearchExportDownloaded and Add-RoleGroupMember alerts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-m365-ediscov-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Adding a hijacked badge onto the Legal…",
          "subtitle": "Adding RoleGroupMember to eDiscovery Manager in Microsoft…",
          "tone": "amber"
        },
        {
          "id": "cld-m365-ediscov-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Running a company-wide search for…",
          "subtitle": "Executing tenant-wide New-ComplianceSearch and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "RoleGroupMember Added to eDiscovery Manager in Security & Compliance Center",
          "storyExcerpt": "Holding compromised high-level tenant rights, the intruder quietly adds a controlled account onto the prestigious Legal eDiscovery Manager committee, unlocking company-wide search powers that bypass…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"Add-RoleGroupMember\",\"Add-eDiscoveryCaseAdmin\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Core Pivot",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Tenant-Wide Keyword Query via New-ComplianceSearch & Start-ComplianceSearch",
          "storyExcerpt": "Stepping up to the central legal-discovery console, the intruder launches a sweeping tenant-wide keyword search hunting for passwords, M&A contracts, legal filings, and executive spreadsheets across…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"New-ComplianceSearch\",\"Start-ComplianceSearch\",\"SearchCreated\" (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Hits Job",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "PST/Zip Package Export via New-ComplianceSearchAction -Export & SearchExported Audit",
          "storyExcerpt": "Once the search finishes indexing thousands of sensitive hits, the intruder triggers an official export job that bundles every matching email and SharePoint file into ready-to-download PST and Zip…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"New-ComplianceSearchAction\",\"SearchExported\",\"PreviewSearch\" (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Discovery Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Export Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-m365-ediscov-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "RoleGroupMember Added to eDiscovery Manager in Security & Compliance Center",
      "storyCue": "Holding compromised high-level tenant rights, the intruder quietly adds a controlled account onto the prestigious Legal eDiscovery Manager committee, unlocking company-wide search powers that bypass ordinary individual mailbox permissions.",
      "technicalCue": "T1098.003 · DEFENSE EVASION — To read mailboxes and SharePoint sites without modifying individual mailbox permissions, the compromised admin adds an account to the eDiscovery Manager role group (Add-RoleGroupMember /…",
      "storyMappings": [
        {
          "storyTerm": "Prestigious Legal eDiscovery Manager committee",
          "technicalTerm": "Microsoft Purview eDiscovery Manager / eDiscovery Administrator role group",
          "tone": "amber"
        },
        {
          "storyTerm": "Quietly adding a controlled account to the roster",
          "technicalTerm": "Add-RoleGroupMember logged in Purview Unified Audit Log",
          "tone": "sky"
        },
        {
          "storyTerm": "Bypassing individual employee mailbox permissions",
          "technicalTerm": "Cross-tenant read access spanning Exchange Online, SharePoint, OneDrive, and Teams",
          "tone": "rose"
        },
        {
          "storyTerm": "First high-priority warning flare",
          "technicalTerm": "SIEM alert on any unexpected membership change to Compliance Role Groups",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-m365-ediscov-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Prestigious Legal eDiscovery Manager…",
          "subtitle": "Microsoft Purview eDiscovery Manager / eDiscovery…",
          "tone": "amber"
        },
        {
          "id": "cld-m365-ediscov-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Quietly adding a controlled account to…",
          "subtitle": "Add-RoleGroupMember logged in Purview Unified Audit Log",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-level Adds",
          "stageTag": "STEP 01 · SETUP",
          "title": "Prestigious Legal eDiscovery Manager committee",
          "storyExcerpt": "Holding compromised high-level tenant rights, the intruder quietly adds a controlled account onto the prestigious Legal eDiscovery Manager committee, unlocking company-wide search powers that…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"Add-RoleGroupMember\",\"Add-eDiscoveryCaseAdmin\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Quietly adding a controlled account to the roster",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses quietly adding a controlled account to the roster to advance toward bypassing individual employee mailbox permissions.",
          "technicalParallel": "To read mailboxes and SharePoint sites without modifying individual mailbox permissions, the compromised admin adds an account to the eDiscovery Manager role group (Add-RoleGroupMember /…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-priority",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "First high-priority warning flare",
          "storyExcerpt": "Behind the scenes, first high-priority warning flare captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditWorkload=SecurityComplianceCenter, Operation=Add-RoleGroupMember , eDiscovery Manager, TargetAccount=admin_clark@corp.local under T1098.003): Require…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Discovery Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Export Silo",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.003"
    },
    "step-2": {
      "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-m365-ediscov-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Tenant-Wide Keyword Query via New-ComplianceSearch & Start-ComplianceSearch",
      "storyCue": "Stepping up to the central legal-discovery console, the intruder launches a sweeping tenant-wide keyword search hunting for passwords, M&A contracts, legal filings, and executive spreadsheets across every employee simultaneously.",
      "technicalCue": "T1213.002 · EXFIL & IMPACT — Connecting via Connect-IPPSSession, the actor executes New-ComplianceSearch with -ExchangeLocation All -SharePointLocation All and a ContentMatchQuery targeting password, key, vpn, or…",
      "storyMappings": [
        {
          "storyTerm": "Central legal-discovery search console",
          "technicalTerm": "Microsoft Purview Content Search / Compliance PowerShell cmdlets",
          "tone": "amber"
        },
        {
          "storyTerm": "Sweeping tenant-wide keyword search",
          "technicalTerm": "New-ComplianceSearch -ExchangeLocation All -SharePointLocation All + Start-ComplianceSearch",
          "tone": "sky"
        },
        {
          "storyTerm": "Zero disturbance on individual employee desks",
          "technicalTerm": "Silent backend indexing search invisible to targeted mailbox or SharePoint owners",
          "tone": "rose"
        },
        {
          "storyTerm": "Compliance diary logging the exact search terms",
          "technicalTerm": "UAL SearchCreated and SearchStarted events preserving the attacker keyword query",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-m365-ediscov-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Central legal-discovery search console",
          "subtitle": "Microsoft Purview Content Search / Compliance PowerShell cmdlets",
          "tone": "amber"
        },
        {
          "id": "cld-m365-ediscov-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sweeping tenant-wide keyword search",
          "subtitle": "New-ComplianceSearch -ExchangeLocation All -SharePointLocation…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Central legal-discovery search console",
          "storyExcerpt": "Stepping up to the central legal-discovery console, the intruder launches a sweeping tenant-wide keyword search hunting for passwords, M&A contracts, legal filings, and executive spreadsheets…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"New-ComplianceSearch\",\"Start-ComplianceSearch\",\"SearchCreated\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Zero",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sweeping tenant-wide keyword search",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses sweeping tenant-wide keyword search to advance toward zero disturbance on individual employee desks.",
          "technicalParallel": "Connecting via Connect-IPPSSession, the actor executes New-ComplianceSearch with -ExchangeLocation All -SharePointLocation All and a ContentMatchQuery targeting password, key, vpn, or acquisition…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zero",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Compliance diary logging the exact search terms",
          "storyExcerpt": "Behind the scenes, compliance diary logging the exact search terms captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditOperation=SearchCreated / New-ComplianceSearch, SearchScope=ExchangeLocation: All, SharePointLocation: All, KeywordQuery=password OR client_secret…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Discovery Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Export Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1213.002"
    },
    "step-3": {
      "scenarioId": "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-m365-ediscov-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "PST/Zip Package Export via New-ComplianceSearchAction -Export & SearchExported Audit",
      "storyCue": "Once the search finishes indexing thousands of sensitive hits, the intruder triggers an official export job that bundles every matching email and SharePoint file into ready-to-download PST and Zip shipping trunks and pulls them straight off the platform.",
      "technicalCue": "T1114.002 · EXFIL & IMPACT — Once the search completes, the actor runs New-ComplianceSearchAction -SearchName \"Audit_Check_Q4\" -Export to stage a downloadable PST and SharePoint ZIP archive in the Microsoft-managed Azure…",
      "storyMappings": [
        {
          "storyTerm": "Triggering an official export job",
          "technicalTerm": "New-ComplianceSearchAction -SearchName <name> -Export generating PST/Zip bundles",
          "tone": "amber"
        },
        {
          "storyTerm": "Pulling shipping trunks straight off the platform",
          "technicalTerm": "Downloading the generated export package triggering SearchExportDownloaded audit logs",
          "tone": "sky"
        },
        {
          "storyTerm": "Massive single-click enterprise data breach",
          "technicalTerm": "Bulk multi-mailbox and SharePoint exfiltration masquerading as routine legal hold",
          "tone": "rose"
        },
        {
          "storyTerm": "Dual-approval legal safeguard",
          "technicalTerm": "Requiring Privileged Identity Management (PIM) JIT approval for eDiscovery Manager activation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-m365-ediscov-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Triggering an official export job",
          "subtitle": "New-ComplianceSearchAction -SearchName <name> -Export…",
          "tone": "amber"
        },
        {
          "id": "cld-m365-ediscov-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Pulling shipping trunks straight off the…",
          "subtitle": "Downloading the generated export package triggering…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hits Job",
          "stageTag": "STEP 03 · SETUP",
          "title": "Triggering an official export job",
          "storyExcerpt": "Once the search finishes indexing thousands of sensitive hits, the intruder triggers an official export job that bundles every matching email and SharePoint file into ready-to-download PST and…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"New-ComplianceSearchAction\",\"SearchExported\",\"PreviewSearch\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Off",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Pulling shipping trunks straight off the platform",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses pulling shipping trunks straight off the platform to advance toward massive single-click enterprise data breach.",
          "technicalParallel": "Once the search completes, the actor runs New-ComplianceSearchAction -SearchName \"Audit_Check_Q4\" -Export to stage a downloadable PST and SharePoint ZIP archive in the Microsoft-managed Azure Blob export…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Data",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Dual-approval legal safeguard",
          "storyExcerpt": "Behind the scenes, dual-approval legal safeguard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditOperation=SearchExported , New-ComplianceSearchAction -Export, SearchJobName=Audit_Check_Q4, ExportedItemCount=1,840 items under T1114.002): Create a…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Discovery Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Export Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1114.002"
    }
  },
  "cloud-midnight-blizzard-oauth-legacy-test-app-audit": {
    "briefing": {
      "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-midblizz-audit-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1110.003",
      "title": "Midnight Blizzard Legacy OAuth Test Application & Exchange Online EWS… — Story-to-Technical Overview",
      "storyCue": "Imagine a high-security government campus where an overlooked backyard testing shed still lacks a two-factor deadbolt. After slowly trying common keys from residential driveways until the shed opens, a spy discovers an old automated courier app inside, attaches their own fresh secret key and full-mailroom badge to that app, and quietly syncs sensitive executive mailboxes straight out through the automated postal chute.",
      "technicalCue": "INITIAL ACCESS: Low-Volume Residential Proxy Password Spray Against Legacy Tenant Account -> PERSISTENCE: Service Principal Credential Addition & full_access_as_app Role Assignment -> EXFIL & IMPACT: OAuth Bearer Token EWS Mailbox Sync & MailItemsAccessed Telemetry",
      "storyMappings": [
        {
          "storyTerm": "Slowly trying keys from residential driveways on an unguarded test shed",
          "technicalTerm": "Low-volume residential proxy password spray against a legacy non-MFA tenant account",
          "tone": "amber"
        },
        {
          "storyTerm": "Attaching a fresh secret key and full-mailroom badge to an old courier app",
          "technicalTerm": "Service Principal Add service principal credentials and full_access_as_app role grant",
          "tone": "sky"
        },
        {
          "storyTerm": "Quietly syncing executive mailboxes through the automated postal chute",
          "technicalTerm": "OAuth Bearer token Exchange Web Services (EWS) mailbox sync logged via MailItemsAccessed",
          "tone": "rose"
        },
        {
          "storyTerm": "Emergency directive closing every legacy side door",
          "technicalTerm": "CISA ED 24-02 audit of OAuth Service Principals, credentials, and EWS access",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-midblizz-audit-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Slowly trying keys from residential…",
          "subtitle": "Low-volume residential proxy password spray against a legacy…",
          "tone": "amber"
        },
        {
          "id": "cld-midblizz-audit-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Attaching a fresh secret key and…",
          "subtitle": "Service Principal Add service principal credentials and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Home",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Low-Volume Residential Proxy Password Spray Against Legacy Tenant Account",
          "storyExcerpt": "Spreading tiny bursts of password guesses across thousands of home internet connections so threshold alarms never ring, the intruder unlocks an old non-production testing account left without…",
          "technicalParallel": "Under the hood, the observed step executes SigninLogs | where ResultType == 0 and AuthenticationRequirement == \"singleFactorAuthentication\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Over-privileged",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Service Principal Credential Addition & full_access_as_app Role Assignment",
          "storyExcerpt": "Spotting an over-privileged legacy automated courier application inside the tenant, the intruder stamps a brand-new secret password onto the app badge and assigns it the master full-access mailroom key…",
          "technicalParallel": "Under the hood, the observed step executes AuditLogs | where OperationName has_any (\"Add service principal credentials\", \"Add app role assignment to service principal\") (which executes the technical…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Mail-access",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "OAuth Bearer Token EWS Mailbox Sync & MailItemsAccessed Telemetry",
          "storyExcerpt": "Presenting the newly minted courier token directly to the Exchange postal gateway, the intruder systematically pulls targeted executive correspondence while leaving clear machine-access footprints inside…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText \"Legacy-OAuth-Test-App\" (which invokes Microsoft 365 Exchange Online / Graph API operations to…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Legacy Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Trace",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-midblizz-audit-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Low-Volume Residential Proxy Password Spray Against Legacy Tenant Account",
      "storyCue": "Spreading tiny bursts of password guesses across thousands of home internet connections so threshold alarms never ring, the intruder unlocks an old non-production testing account left without multi-factor protection.",
      "technicalCue": "T1110.003 · INITIAL ACCESS — Threat actors route low-frequency authentication requests through distributed residential proxy subnets targeting a legacy non-production test tenant account that lacks Multifactor…",
      "storyMappings": [
        {
          "storyTerm": "Thousands of home internet connections hiding the spray",
          "technicalTerm": "Residential proxy network distributing low-volume Entra ID password sprays",
          "tone": "amber"
        },
        {
          "storyTerm": "Old non-production account lacking a second lock",
          "technicalTerm": "Legacy test tenant account without Conditional Access MFA enforcement",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping inside the quiet testing wing",
          "technicalTerm": "Initial authenticated foothold inside the victim cloud test tenant",
          "tone": "rose"
        },
        {
          "storyTerm": "Sign-in ledger showing spread-out guesses",
          "technicalTerm": "Entra ID SigninLogs correlating distributed residential ASNs against one legacy user",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-midblizz-audit-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Thousands of home internet connections…",
          "subtitle": "Residential proxy network distributing low-volume Entra ID…",
          "tone": "amber"
        },
        {
          "id": "cld-midblizz-audit-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Old non-production account lacking a…",
          "subtitle": "Legacy test tenant account without Conditional Access MFA…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Home",
          "stageTag": "STEP 01 · SETUP",
          "title": "Thousands of home internet connections hiding the…",
          "storyExcerpt": "Spreading tiny bursts of password guesses across thousands of home internet connections so threshold alarms never ring, the intruder unlocks an old non-production testing account left without…",
          "technicalParallel": "Under the hood, the observed step executes SigninLogs | where ResultType == 0 and AuthenticationRequirement == \"singleFactorAuthentication\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Old Lock",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Old non-production account lacking a second lock",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses old non-production account lacking a second lock to advance toward stepping inside the quiet testing wing.",
          "technicalParallel": "Threat actors route low-frequency authentication requests through distributed residential proxy subnets targeting a legacy non-production test tenant account that lacks Multifactor Authentication (MFA)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wing",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Sign-in ledger showing spread-out guesses",
          "storyExcerpt": "Behind the scenes, sign-in ledger showing spread-out guesses captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 50126 (recording LogTable=Entra ID SigninLogs, AuthRequirement=singleFactorAuthentication, DirectiveReference=CISA ED 24-02 under T1110.003): Decommission legacy test…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Legacy Kiosk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Trace",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1110.003"
    },
    "step-2": {
      "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-midblizz-audit-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Service Principal Credential Addition & full_access_as_app Role Assignment",
      "storyCue": "Spotting an over-privileged legacy automated courier application inside the tenant, the intruder stamps a brand-new secret password onto the app badge and assigns it the master full-access mailroom key covering corporate mailboxes.",
      "technicalCue": "T1098.003 · PERSISTENCE — Using the compromised tenant session, the actor registers a new client secret on a legacy OAuth Service Principal (Add service principal credentials) and grants the Exchange Online…",
      "storyMappings": [
        {
          "storyTerm": "Over-privileged legacy automated courier app",
          "technicalTerm": "Legacy OAuth Enterprise Application / Service Principal holding elevated Graph rights",
          "tone": "amber"
        },
        {
          "storyTerm": "Stamping a brand-new secret password onto the app badge",
          "technicalTerm": "Entra Audit Log \"Update application – Certificates and secrets management\" key addition",
          "tone": "sky"
        },
        {
          "storyTerm": "Assigning the master full-access mailroom key",
          "technicalTerm": "Granting Exchange Online full_access_as_app application role to the Service Principal",
          "tone": "rose"
        },
        {
          "storyTerm": "Non-human persistence channel",
          "technicalTerm": "Machine-to-machine OAuth credentials immune to human user password resets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-midblizz-audit-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Over-privileged legacy automated courier…",
          "subtitle": "Legacy OAuth Enterprise Application / Service Principal…",
          "tone": "amber"
        },
        {
          "id": "cld-midblizz-audit-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Stamping a brand-new secret password…",
          "subtitle": "Entra Audit Log \"Update application – Certificates and secrets…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over-privileged",
          "stageTag": "STEP 02 · SETUP",
          "title": "Over-privileged legacy automated courier app",
          "storyExcerpt": "Spotting an over-privileged legacy automated courier application inside the tenant, the intruder stamps a brand-new secret password onto the app badge and assigns it the master full-access…",
          "technicalParallel": "Under the hood, the observed step executes AuditLogs | where OperationName has_any (\"Add service principal credentials\", \"Add app role assignment to service principal\") (which executes the technical…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto App",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Stamping a brand-new secret password onto the app…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stamping a brand-new secret password onto the app badge to advance toward assigning the master full-access mailroom key.",
          "technicalParallel": "Using the compromised tenant session, the actor registers a new client secret on a legacy OAuth Service Principal (Add service principal credentials) and grants the Exchange Online full_access_as_app…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full-access Key",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Non-human persistence channel",
          "storyExcerpt": "Behind the scenes, non-human persistence channel captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording OperationName=Add app role assignment to service principal, GrantedPermission=full_access_as_app , Office 365 Exchange Online…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Legacy Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Trace",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.003"
    },
    "step-3": {
      "scenarioId": "cloud-midnight-blizzard-oauth-legacy-test-app-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-midblizz-audit-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "OAuth Bearer Token EWS Mailbox Sync & MailItemsAccessed Telemetry",
      "storyCue": "Presenting the newly minted courier token directly to the Exchange postal gateway, the intruder systematically pulls targeted executive correspondence while leaving clear machine-access footprints inside the Purview mail-access diary.",
      "technicalCue": "T1114.002 · EXFIL & IMPACT — Authenticating solely with OAuth 2.0 client_credentials tokens from the malicious Service Principal, the actor queries Exchange Web Services (EWS) without interactive user sign-ins, generating…",
      "storyMappings": [
        {
          "storyTerm": "Presenting the courier token to the postal gateway",
          "technicalTerm": "OAuth 2.0 Bearer token authenticating directly to Exchange Web Services (EWS)",
          "tone": "amber"
        },
        {
          "storyTerm": "Systematically pulling executive correspondence",
          "technicalTerm": "Programmatic EWS SyncFolderItems / GetItem exfiltration of sensitive mailboxes",
          "tone": "sky"
        },
        {
          "storyTerm": "Machine-access footprints in the mail diary",
          "technicalTerm": "Purview MailItemsAccessed telemetry naming the exact hijacked AppId",
          "tone": "rose"
        },
        {
          "storyTerm": "Restricting which mailboxes an app may ever touch",
          "technicalTerm": "Exchange Application Access Policies scoping OAuth apps strictly to designated mailboxes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-midblizz-audit-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Presenting the courier token to the…",
          "subtitle": "OAuth 2.0 Bearer token authenticating directly to Exchange Web…",
          "tone": "amber"
        },
        {
          "id": "cld-midblizz-audit-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Systematically pulling executive…",
          "subtitle": "Programmatic EWS SyncFolderItems / GetItem exfiltration of…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail-access",
          "stageTag": "STEP 03 · SETUP",
          "title": "Presenting the courier token to the postal gateway",
          "storyExcerpt": "Presenting the newly minted courier token directly to the Exchange postal gateway, the intruder systematically pulls targeted executive correspondence while leaving clear machine-access…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText \"Legacy-OAuth-Test-App\" (which invokes Microsoft 365 Exchange Online / Graph API operations to…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Mail",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Systematically pulling executive correspondence",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses systematically pulling executive correspondence to advance toward machine-access footprints in the mail diary.",
          "technicalParallel": "Authenticating solely with OAuth 2.0 client_credentials tokens from the malicious Service Principal, the actor queries Exchange Web Services (EWS) without interactive user sign-ins, generating…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mail",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Restricting which mailboxes an app may ever touch",
          "storyExcerpt": "Behind the scenes, restricting which mailboxes an app may ever touch captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AuditOperation=MailItemsAccessed, ProtocolWorkload=Exchange Web Services , EWS, OAuthClientAppId=a8f4c210-1122-4433-9988-776655443322 under T1114.002)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Legacy Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Trace",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1114.002"
    }
  },
  "cloud-salesforce-connected-app-oauth-bulk-api-export-audit": {
    "briefing": {
      "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
      "sectionKey": "briefing",
      "sceneKind": "cld-sfdc-bulk-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1528",
      "title": "SaaS Connected App OAuth Scope Escalation & Bulk API 2.0 Export Audit — Story-to-Technical Overview",
      "storyCue": "Imagine a giant corporate customer-records library where an employee gets tricked into authorizing an unverified third-party research cart with broad library borrowing powers. Handed a reusable library pass, the intruder orders the library own automated overnight forklift to pack entire customer shelves into downloadable spreadsheet crates and wheels them straight out of the building until librarians revoke the rogue cart pass.",
      "technicalCue": "PERSISTENCE: Unverified OAuth Connected App Consent & Refresh Token Issuance -> EXFIL & IMPACT: Asynchronous Bulk API 2.0 Query Job Creation (/services/data/v59.0/jobs/query) -> EXFIL & IMPACT: Bulk CSV Result Batch Download (/jobs/query/<id>/results) & OauthToken Revocation",
      "storyMappings": [
        {
          "storyTerm": "Tricking an employee into authorizing an unverified research cart",
          "technicalTerm": "Unverified Salesforce OAuth Connected App consent minting a persistent Refresh Token",
          "tone": "amber"
        },
        {
          "storyTerm": "Ordering the library automated forklift to pack entire shelves",
          "technicalTerm": "Asynchronous Bulk API 2.0 Query Job via /services/data/v59.0/jobs/query",
          "tone": "sky"
        },
        {
          "storyTerm": "Wheeling downloadable spreadsheet crates out of the building",
          "technicalTerm": "Bulk CSV result batch export via /jobs/query/<id>/results",
          "tone": "rose"
        },
        {
          "storyTerm": "Canceling the rogue cart pass across the library",
          "technicalTerm": "Salesforce Event Monitoring BulkApiResult audit and OauthToken revocation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-sfdc-bulk-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Tricking an employee into authorizing an…",
          "subtitle": "Unverified Salesforce OAuth Connected App consent minting a…",
          "tone": "amber"
        },
        {
          "id": "cld-sfdc-bulk-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Ordering the library automated forklift…",
          "subtitle": "Asynchronous Bulk API 2.0 Query Job via…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. App User",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Unverified OAuth Connected App Consent & Refresh Token Issuance",
          "storyExcerpt": "Lured by a smooth phone call or disguised link, an employee clicks Approve on a disguised external research cart, silently handing the attacker a renewable delegated key ring scoped to read and export…",
          "technicalParallel": "Under the hood, the observed step executes SELECT UserId, AppName, UseCount, LastUsedDate FROM OauthToken WHERE AppName = 'DataSync_Connector' (which executes a structured SQL query or database…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. High-speed Bulk",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Asynchronous Bulk API 2.0 Query Job Creation (/services/data/v59.0/jobs/query)",
          "storyExcerpt": "Instead of copying customer index cards slowly one by one where noisy page counters might trigger, the intruder submits a high-speed asynchronous bulk export order asking the CRM engine itself to gather…",
          "technicalParallel": "Under the hood, the observed step executes SELECT Id, EventType, LogDate FROM EventLogFile WHERE EventType IN ('BulkApi2', 'RestApi', 'ReportExport') (which executes a structured SQL query or database…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Down",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Bulk CSV Result Batch Download (/jobs/query/<id>/results) & OauthToken Revocation",
          "storyExcerpt": "As soon as the bulk forklift signals the crates are ready, the intruder pulls down every finished CSV batch straight to external servers, leaving high-volume result-download receipts that guide…",
          "technicalParallel": "Under the hood, the observed step executes SELECT JobId, RecordsProcessed,TotalProcessingTime FROM BulkApiResultEventStore WHERE JobId = '7508c000008AbCd' (which executes a structured SQL query or…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consent Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bulk Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Export Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
      "sectionKey": "step-1",
      "sceneKind": "cld-sfdc-bulk-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Unverified OAuth Connected App Consent & Refresh Token Issuance",
      "storyCue": "Lured by a smooth phone call or disguised link, an employee clicks Approve on a disguised external research cart, silently handing the attacker a renewable delegated key ring scoped to read and export company customer records.",
      "technicalCue": "T1528 · PERSISTENCE — When an organization permits \"All users may self-authorize\" on OAuth Connected Apps, an attacker social-engineers a user or uses stolen credentials to authorize a custom Connected App…",
      "storyMappings": [
        {
          "storyTerm": "Disguised external Connected App approved by a user",
          "technicalTerm": "Unverified third-party Salesforce OAuth Connected App (e.g., modified Data Loader)",
          "tone": "amber"
        },
        {
          "storyTerm": "Renewable key ring handed to the attacker",
          "technicalTerm": "Issued OAuth Access Token and long-lived Refresh Token (refresh_token / api scopes)",
          "tone": "sky"
        },
        {
          "storyTerm": "Bypasses ongoing interactive login prompts",
          "technicalTerm": "Persistent API access operating independently of user browser sessions",
          "tone": "rose"
        },
        {
          "storyTerm": "Library approval policy stopping rogue apps",
          "technicalTerm": "Salesforce Connected App API Access Control restricting unapproved OAuth clients",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-sfdc-bulk-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Disguised external Connected App…",
          "subtitle": "Unverified third-party Salesforce OAuth Connected App (e.g.…",
          "tone": "amber"
        },
        {
          "id": "cld-sfdc-bulk-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Renewable key ring handed to the attacker",
          "subtitle": "Issued OAuth Access Token and long-lived Refresh Token…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. App User",
          "stageTag": "STEP 01 · SETUP",
          "title": "Disguised external Connected App approved by a user",
          "storyExcerpt": "Lured by a smooth social-engineering call or phishing link, an employee clicks Approve on a disguised external Connected App, silently handing the attacker a renewable delegated badge key ring…",
          "technicalParallel": "Under the hood, the observed step executes SELECT UserId, AppName, UseCount, LastUsedDate FROM OauthToken WHERE AppName = 'DataSync_Connector' (which executes a structured SQL query or database…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Key Ring",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Renewable key ring handed to the attacker",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses renewable key ring handed to the attacker to advance toward bypasses ongoing interactive login prompts.",
          "technicalParallel": "When an organization permits \"All users may self-authorize\" on OAuth Connected Apps, an attacker social-engineers a user or uses stolen credentials to authorize a custom Connected App requesting api and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Apps",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Library approval policy stopping rogue apps",
          "storyExcerpt": "Behind the scenes, library approval policy stopping rogue apps captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventType=LoginHistory , Remote Access 2.0, ConnectedAppName=DataSync_Connector, GrantedScopes=api, refresh_token , offline_access under T1528): Enable…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consent Kiosk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bulk Silo",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Export Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1528"
    },
    "step-2": {
      "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
      "sectionKey": "step-2",
      "sceneKind": "cld-sfdc-bulk-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Asynchronous Bulk API 2.0 Query Job Creation (/services/data/v59.0/jobs/query)",
      "storyCue": "Instead of copying customer index cards slowly one by one where noisy page counters might trigger, the intruder submits a high-speed asynchronous bulk export order asking the CRM engine itself to gather every Account, Contact, and Opportunity record into clean batches.",
      "technicalCue": "T1530 · EXFIL & IMPACT — Using the OAuth access token, the client submits a Bulk API 2.0 SOQL query job (POST /services/data/v59.0/jobs/query) with operation=\"query\" across Account, Contact, and Opportunity tables…",
      "storyMappings": [
        {
          "storyTerm": "High-speed asynchronous bulk export order",
          "technicalTerm": "HTTP POST to /services/data/v59.0/jobs/query creating a Bulk API 2.0 Query Job",
          "tone": "amber"
        },
        {
          "storyTerm": "Gathering every customer record automatically",
          "technicalTerm": "SOQL queries dumping Account, Contact, Case, and Lead CRM tables wholesale",
          "tone": "sky"
        },
        {
          "storyTerm": "Server doing all the heavy packing",
          "technicalTerm": "Asynchronous background job staging millions of rows for rapid retrieval",
          "tone": "rose"
        },
        {
          "storyTerm": "Library bulk-job log recording the order",
          "technicalTerm": "Salesforce Event Monitoring API and BulkApi2 job creation audit records",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-sfdc-bulk-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "High-speed asynchronous bulk export order",
          "subtitle": "HTTP POST to /services/data/v59.0/jobs/query creating a Bulk…",
          "tone": "amber"
        },
        {
          "id": "cld-sfdc-bulk-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Gathering every customer record…",
          "subtitle": "SOQL queries dumping Account, Contact, Case, and Lead CRM…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. High-speed Bulk",
          "stageTag": "STEP 02 · SETUP",
          "title": "High-speed asynchronous bulk export order",
          "storyExcerpt": "Instead of copying customer index cards slowly one by one where noisy page counters might trigger, the intruder submits a high-speed asynchronous bulk export order asking the CRM engine itself…",
          "technicalParallel": "Under the hood, the observed step executes SELECT Id, EventType, LogDate FROM EventLogFile WHERE EventType IN ('BulkApi2', 'RestApi', 'ReportExport') (which executes a structured SQL query or database…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses All",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Gathering every customer record automatically",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses gathering every customer record automatically to advance toward server doing all the heavy packing.",
          "technicalParallel": "Using the OAuth access token, the client submits a Bulk API 2.0 SOQL query job (POST /services/data/v59.0/jobs/query) with operation=\"query\" across Account, Contact, and Opportunity tables, recorded in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bulk-job Log",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Library bulk-job log recording the order",
          "storyExcerpt": "Behind the scenes, library bulk-job log recording the order captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording EventLogType=BulkApi2 , EventLogFile, TargetEntity=Contact , 85,400 rows, BulkJobId=7508c000008AbCd under T1530): Configure Salesforce Transaction Security…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consent Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bulk Silo",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Export Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    },
    "step-3": {
      "scenarioId": "cloud-salesforce-connected-app-oauth-bulk-api-export-audit",
      "sectionKey": "step-3",
      "sceneKind": "cld-sfdc-bulk-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Bulk CSV Result Batch Download (/jobs/query/<id>/results) & OauthToken Revocation",
      "storyCue": "As soon as the bulk forklift signals the crates are ready, the intruder pulls down every finished CSV batch straight to external servers, leaving high-volume result-download receipts that guide responders to revoke the rogue Connected App token immediately.",
      "technicalCue": "T1567 · EXFIL & IMPACT — Once job state transitions to JobComplete, the client streams CSV batches via GET /services/data/v59.0/jobs/query/7508c000008AbCd/results.",
      "storyMappings": [
        {
          "storyTerm": "Pulling down every finished spreadsheet batch",
          "technicalTerm": "GET /services/data/v59.0/jobs/query/<id>/results downloading bulk CSV chunks",
          "tone": "amber"
        },
        {
          "storyTerm": "High-volume result-download receipts",
          "technicalTerm": "Salesforce Event Monitoring BulkApiResult logs capturing row counts and source IP",
          "tone": "sky"
        },
        {
          "storyTerm": "Revoking the rogue cart pass immediately",
          "technicalTerm": "Invalidating the compromised OauthToken and blocking the Connected App org-wide",
          "tone": "rose"
        },
        {
          "storyTerm": "Preventing unauthorized data exports",
          "technicalTerm": "Transaction Security Policies alerting or blocking anomalous Bulk API exports",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-sfdc-bulk-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pulling down every finished spreadsheet…",
          "subtitle": "GET /services/data/v59.0/jobs/query/<id>/results downloading…",
          "tone": "amber"
        },
        {
          "id": "cld-sfdc-bulk-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "High-volume result-download receipts",
          "subtitle": "Salesforce Event Monitoring BulkApiResult logs capturing row…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pulling down every finished spreadsheet batch",
          "storyExcerpt": "As soon as the bulk forklift signals the crates are ready, the intruder pulls down every finished CSV batch straight to external servers, leaving high-volume result-download receipts that guide…",
          "technicalParallel": "Under the hood, the observed step executes SELECT JobId, RecordsProcessed,TotalProcessingTime FROM BulkApiResultEventStore WHERE JobId = '7508c000008AbCd' (which executes a structured SQL query or…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. High-volume",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "High-volume result-download receipts",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses high-volume result-download receipts to advance toward revoking the rogue cart pass immediately.",
          "technicalParallel": "Once job state transitions to JobComplete, the client streams CSV batches via GET /services/data/v59.0/jobs/query/7508c000008AbCd/results.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Cart Pass",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Preventing unauthorized data exports",
          "storyExcerpt": "Behind the scenes, preventing unauthorized data exports captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording ResultDownloadUri=/services/data/v59.0/jobs/query/7508c000008AbCd/results, ResponseSizeBytes=14,820,412 bytes , CSV stream…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Consent Kiosk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bulk Silo",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Export Stream",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1567"
    }
  },
  "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda": {
    "briefing": {
      "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-shadow-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1098.001",
      "title": "AWS IAM PassRole + Lambda Privilege Escalation & StopLogging Tampering — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud forensics case study of a shadow-administrator takeover: an ordinary developer who cannot grant themselves master keys uses a delegated robot builder to pass a powerful role to a custom script, commands that script to attach full Administrator ribbons onto their own badge, and then tries to unplug the central security recorder, leaving three unmistakable sequential entries in the tamper-proof cloud ledger.",
      "technicalCue": "DEFENSE EVASION: IAM Privilege Escalation via iam:PassRole + lambda:CreateFunction20150331v2 -> PERSISTENCE: Lambda Invocation & Shadow Admin Policy Attachment (iam:AttachUserPolicy) -> DEFENSE EVASION: CloudTrail Anti-Forensics Attempt (cloudtrail:StopLogging / DeleteTrail) Blocked by SCP",
      "storyMappings": [
        {
          "storyTerm": "Passing a powerful role to a custom script robot",
          "technicalTerm": "iam:PassRole + lambda:CreateFunction20150331 privilege escalation in CloudTrail",
          "tone": "amber"
        },
        {
          "storyTerm": "Script attaching full Administrator ribbons onto the developer badge",
          "technicalTerm": "Lambda invocation executing iam:AttachUserPolicy (AdministratorAccess)",
          "tone": "sky"
        },
        {
          "storyTerm": "Trying to unplug the central security recorder",
          "technicalTerm": "cloudtrail:StopLogging / DeleteTrail anti-forensics logged right before silencing",
          "tone": "rose"
        },
        {
          "storyTerm": "Shadow-administrator loophole closed proactively",
          "technicalTerm": "IAM Permission Boundaries and least-privilege iam:PassRole resource scoping",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-shadow-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Passing a powerful role to a custom…",
          "subtitle": "iam:PassRole + lambda:CreateFunction20150331 privilege…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-shadow-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Script attaching full Administrator…",
          "subtitle": "Lambda invocation executing iam:AttachUserPolicy…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pair",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "IAM Privilege Escalation via iam:PassRole + lambda:CreateFunction20150331v2",
          "storyExcerpt": "Exploiting a hidden shadow-admin permission pair, the developer registers a brand-new serverless helper function and assigns it a broad administrative execution role that the developer themselves could…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"lambda.amazonaws.com\" eventName=\"CreateFunction20150331v2\" (which executes the technical command / telemetry directive…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Full Onto",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Lambda Invocation & Shadow Admin Policy Attachment (iam:AttachUserPolicy)",
          "storyExcerpt": "Triggering the newly built helper robot immediately, the developer watches it step into the badge control room under its senior role and attach the full Administrator ribbon straight back onto the…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"iam.amazonaws.com\" eventName=\"AttachUserPolicy\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Turn Off",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "CloudTrail Anti-Forensics Attempt (cloudtrail:StopLogging / DeleteTrail) Blocked by SCP",
          "storyExcerpt": "Moments after receiving full Administrator keys, the intruder attempts to turn off or erase the central cloud activity trail, ironically stamping the loudest possible red flare right onto the final…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"cloudtrail.amazonaws.com\" eventName=\"StopLogging\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#10B981",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Script Robot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ribbon Press",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trail Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-shadow-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "IAM Privilege Escalation via iam:PassRole + lambda:CreateFunction20150331v2",
      "storyCue": "Exploiting a hidden shadow-admin permission pair, the developer registers a brand-new serverless helper function and assigns it a broad administrative execution role that the developer themselves could not directly assume.",
      "technicalCue": "T1098.001 · DEFENSE EVASION — A compromised developer IAM user (dev-ci-user) lacks direct iam:AttachUserPolicy rights but holds iam:PassRole and lambda:CreateFunction.",
      "storyMappings": [
        {
          "storyTerm": "Hidden shadow-admin permission pair",
          "technicalTerm": "Combined iam:PassRole and lambda:CreateFunction permissions on a non-admin user",
          "tone": "amber"
        },
        {
          "storyTerm": "Registering a brand-new serverless helper function",
          "technicalTerm": "CloudTrail event lambda:CreateFunction20150331 with embedded escalation payload",
          "tone": "sky"
        },
        {
          "storyTerm": "Broad administrative execution role assigned",
          "technicalTerm": "Privileged IAM execution role passed via requestParameters.role",
          "tone": "rose"
        },
        {
          "storyTerm": "Audit trail recording both actor and target role",
          "technicalTerm": "CloudTrail userIdentity linked directly to the newly created Lambda ARN",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-shadow-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Hidden shadow-admin permission pair",
          "subtitle": "Combined iam:PassRole and lambda:CreateFunction permissions on…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-shadow-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Registering a brand-new serverless…",
          "subtitle": "CloudTrail event lambda:CreateFunction20150331 with embedded…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pair",
          "stageTag": "STEP 01 · SETUP",
          "title": "Hidden shadow-admin permission pair",
          "storyExcerpt": "Exploiting a hidden shadow-admin permission pair, the developer registers a brand-new serverless helper function and assigns it a broad administrative execution role that the developer…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"lambda.amazonaws.com\" eventName=\"CreateFunction20150331v2\" (which executes the technical command / telemetry directive…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Role",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Registering a brand-new serverless helper function",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses registering a brand-new serverless helper function to advance toward broad administrative execution role assigned.",
          "technicalParallel": "A compromised developer IAM user (dev-ci-user) lacks direct iam:AttachUserPolicy rights but holds iam:PassRole and lambda:CreateFunction.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Role",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Audit trail recording both actor and target role",
          "storyExcerpt": "Behind the scenes, audit trail recording both actor and target role captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 201 (recording CloudTrailEvent=lambda.amazonaws.com : CreateFunction20150331v2, InitiatingUser=dev-ci-user…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Script Robot",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ribbon Press",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trail Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "step-2": {
      "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-shadow-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Lambda Invocation & Shadow Admin Policy Attachment (iam:AttachUserPolicy)",
      "storyCue": "Triggering the newly built helper robot immediately, the developer watches it step into the badge control room under its senior role and attach the full Administrator ribbon straight back onto the developer own identity.",
      "technicalCue": "T1098.001 · PERSISTENCE — When dev-ci-user invokes the function, the Lambda execution environment assumes AdminLambdaExecutionRole and calls iam:AttachUserPolicy to attach arn:aws:iam::aws:policy/AdministratorAccess…",
      "storyMappings": [
        {
          "storyTerm": "Triggering the helper function immediately",
          "technicalTerm": "lambda:InvokeFunction running the attacker escalation routine",
          "tone": "amber"
        },
        {
          "storyTerm": "Attaching full Administrator policy back onto the developer",
          "technicalTerm": "CloudTrail iam:AttachUserPolicy granting AdministratorAccess from the Lambda role",
          "tone": "sky"
        },
        {
          "storyTerm": "Circular privilege promotion exposed",
          "technicalTerm": "Correlating Lambda creator ARN with the target userName receiving AdministratorAccess",
          "tone": "rose"
        },
        {
          "storyTerm": "Guardrail that stops self-promotion",
          "technicalTerm": "IAM Permission Boundaries capping maximum effective permissions of passed roles",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-shadow-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Triggering the helper function immediately",
          "subtitle": "lambda:InvokeFunction running the attacker escalation routine",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-shadow-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Attaching full Administrator policy back…",
          "subtitle": "CloudTrail iam:AttachUserPolicy granting AdministratorAccess…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Role",
          "stageTag": "STEP 02 · SETUP",
          "title": "Triggering the helper function immediately",
          "storyExcerpt": "Triggering the newly built helper function immediately, the developer watches the function step into the cloud badge control room under its privileged role and attach the full Administrator…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"iam.amazonaws.com\" eventName=\"AttachUserPolicy\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full Back",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Attaching full Administrator policy back onto the…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses attaching full administrator policy back onto the developer to advance toward circular privilege promotion exposed.",
          "technicalParallel": "When dev-ci-user invokes the function, the Lambda execution environment assumes AdminLambdaExecutionRole and calls iam:AttachUserPolicy to attach arn:aws:iam::aws:policy/AdministratorAccess directly to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Self-promotion",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Guardrail that stops self-promotion",
          "storyExcerpt": "Behind the scenes, guardrail that stops self-promotion captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording CloudTrailEvent=iam.amazonaws.com : AttachUserPolicy, ExecutingPrincipal=AssumedRole/AdminLambdaExecutionRole/metrics-sync-helper…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Script Robot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ribbon Press",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trail Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "step-3": {
      "scenarioId": "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-shadow-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "CloudTrail Anti-Forensics Attempt (cloudtrail:StopLogging / DeleteTrail) Blocked by SCP",
      "storyCue": "Moments after receiving full Administrator keys, the intruder attempts to turn off or erase the central cloud activity trail, ironically stamping the loudest possible red flare right onto the final recorded page.",
      "technicalCue": "T1562.008 · DEFENSE EVASION — Now holding AdministratorAccess, the actor calls cloudtrail:StopLogging on the organization trail to blind subsequent actions.",
      "storyMappings": [
        {
          "storyTerm": "Attempting to turn off or erase the activity trail",
          "technicalTerm": "cloudtrail:StopLogging or cloudtrail:DeleteTrail API invocation",
          "tone": "amber"
        },
        {
          "storyTerm": "Loudest red flare stamped on the final recorded page",
          "technicalTerm": "CloudTrail logging the StopLogging event itself before halting delivery",
          "tone": "sky"
        },
        {
          "storyTerm": "Backup security ledger preserved outside the account",
          "technicalTerm": "AWS Organizations immutable organization trail streaming to a separate Security account",
          "tone": "rose"
        },
        {
          "storyTerm": "Automated incident containment",
          "technicalTerm": "EventBridge rule alerting SOC and quarantining the compromised IAM principal",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-shadow-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Attempting to turn off or erase the…",
          "subtitle": "cloudtrail:StopLogging or cloudtrail:DeleteTrail API invocation",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-shadow-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Loudest red flare stamped on the final…",
          "subtitle": "CloudTrail logging the StopLogging event itself before halting…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Turn Off",
          "stageTag": "STEP 03 · SETUP",
          "title": "Attempting to turn off or erase the activity trail",
          "storyExcerpt": "Moments after receiving full Administrator keys, the intruder attempts to turn off or erase the central cloud activity trail, ironically stamping the loudest possible red flare right onto the…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"cloudtrail.amazonaws.com\" eventName=\"StopLogging\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Red Page",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Loudest red flare stamped on the final recorded page",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses loudest red flare stamped on the final recorded page to advance toward backup security ledger preserved outside the account.",
          "technicalParallel": "Now holding AdministratorAccess, the actor calls cloudtrail:StopLogging on the organization trail to blind subsequent actions.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Automated incident containment",
          "storyExcerpt": "Behind the scenes, automated incident containment captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 403 (recording CloudTrailEvent=cloudtrail.amazonaws.com : StopLogging, TargetedTrail=org-audit-trail, ErrorCode=AccessDenied , Blocked by Organization SCP…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Script Robot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ribbon Press",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Trail Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.008"
    }
  },
  "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics": {
    "briefing": {
      "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-imds-s3-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1552.005",
      "title": "AWS CloudTrail IMDSv1 Role Theft, Off-Instance Replay & S3 Data Events… — Story-to-Technical Overview",
      "storyCue": "Imagine a forensic reconstruction of a cloud storage heist from three matching security ledgers: first, catching the tricked web server handing an unguarded temporary building pass out its side window; second, spotting that exact pass suddenly authenticating from a distant street outside the cloud campus; and third, tallying the exact weight of every archive box hauled out of the warehouse to quantify breach scope.",
      "technicalCue": "CREDENTIAL ACCESS: EC2 Instance Metadata Service (IMDSv1) SSRF Query & STS Token Retrieval -> DEFENSE EVASION: Off-Instance STS GetCallerIdentity Replay & GuardDuty OutsideAWS Detection (CloudTrail) -> EXFIL & IMPACT: S3 Data Event GetObject Burst & bytesTransferred Quantification in CloudTrail",
      "storyMappings": [
        {
          "storyTerm": "Tricked server handing a temporary pass out its side window",
          "technicalTerm": "EC2 IMDSv1 SSRF request retrieving temporary STS role credentials",
          "tone": "amber"
        },
        {
          "storyTerm": "Same pass authenticating from a distant street outside campus",
          "technicalTerm": "Off-instance sts:GetCallerIdentity replay triggering GuardDuty OutsideAWS alert",
          "tone": "sky"
        },
        {
          "storyTerm": "Tallying the exact weight of every hauled-out archive box",
          "technicalTerm": "CloudTrail S3 Data Event GetObject burst and bytesTransferredOut quantification",
          "tone": "rose"
        },
        {
          "storyTerm": "Three matching security ledgers proving end-to-end attribution",
          "technicalTerm": "Correlating proxy logs, GuardDuty findings, and CloudTrail S3 Data Events",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-imds-s3-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Tricked server handing a temporary pass…",
          "subtitle": "EC2 IMDSv1 SSRF request retrieving temporary STS role…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-imds-s3-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Same pass authenticating from a distant…",
          "subtitle": "Off-instance sts:GetCallerIdentity replay triggering GuardDuty…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Out",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "EC2 Instance Metadata Service (IMDSv1) SSRF Query & STS Token Retrieval",
          "storyExcerpt": "Abusing a vulnerable web proxy endpoint, the intruder persuades a cloud server to fetch its own local identity drawer over the older unauthenticated channel and hand back its temporary role pass.",
          "technicalParallel": "Under the hood, the observed step executes HTTP SSRF Target: http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole (which Queries the link-local Instance Metadata Service…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Same Pass",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Off-Instance STS GetCallerIdentity Replay & GuardDuty OutsideAWS Detection (CloudTrail)",
          "storyExcerpt": "Moments later, the intruder tests the stolen keycard from an outside internet connection to check who they have become, immediately tripping the cloud campus perimeter sensor that knows an internal…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"sts.amazonaws.com\" eventName=\"GetCallerIdentity\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Live Byte",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "S3 Data Event GetObject Burst & bytesTransferred Quantification in CloudTrail",
          "storyExcerpt": "With the stolen badge confirmed live, the intruder sweeps through sensitive storage buckets downloading object after object, while investigators tally every single GetObject receipt and byte count to…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail S3 Data Event: eventSource=\"s3.amazonaws.com\" eventName=\"GetObject\" (which executes the technical command / telemetry directive , CloudTrail S3 Data…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Side Window",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bucket Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Geo Mismatch",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-imds-s3-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "EC2 Instance Metadata Service (IMDSv1) SSRF Query & STS Token Retrieval",
      "storyCue": "Abusing a vulnerable web proxy endpoint, the intruder persuades a cloud server to fetch its own local identity drawer over the older unauthenticated channel and hand back its temporary role pass.",
      "technicalCue": "T1552.005 · CREDENTIAL ACCESS — The attacker sends an HTTP request to a vulnerable web proxy on EC2 instance i-0a1b2c3d4e5f60001 pointing to http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole.",
      "storyMappings": [
        {
          "storyTerm": "Older unauthenticated local identity drawer",
          "technicalTerm": "EC2 Instance Metadata Service v1 (IMDSv1) at 169.254.169.254",
          "tone": "amber"
        },
        {
          "storyTerm": "Persuading the web proxy to fetch internal pages",
          "technicalTerm": "Server-Side Request Forgery (SSRF) returning IAM role STS credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Temporary role pass leaked",
          "technicalTerm": "Short-lived AccessKeyId (ASIA...), SecretAccessKey, and SessionToken",
          "tone": "rose"
        },
        {
          "storyTerm": "Counter tracking tokenless drawer opens",
          "technicalTerm": "CloudWatch MetadataNoToken metric confirming IMDSv1 usage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-imds-s3-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Older unauthenticated local identity…",
          "subtitle": "EC2 Instance Metadata Service v1 (IMDSv1) at 169.254.169.254",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-imds-s3-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Persuading the web proxy to fetch…",
          "subtitle": "Server-Side Request Forgery (SSRF) returning IAM role STS…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Own",
          "stageTag": "STEP 01 · SETUP",
          "title": "Older unauthenticated local identity drawer",
          "storyExcerpt": "Abusing a vulnerable web proxy endpoint, the intruder persuades a cloud server to fetch its own local identity drawer over the older unauthenticated channel and hand back its temporary role pass.",
          "technicalParallel": "Under the hood, the observed step executes HTTP SSRF Target: http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole (which Queries the link-local Instance Metadata Service…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Web",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Persuading the web proxy to fetch internal pages",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses persuading the web proxy to fetch internal pages to advance toward temporary role pass leaked.",
          "technicalParallel": "The attacker sends an HTTP request to a vulnerable web proxy on EC2 instance i-0a1b2c3d4e5f60001 pointing to http://169.254.169.254/latest/meta-data/iam/security-credentials/ProdAppInstanceRole.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Role Pass",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Counter tracking tokenless drawer opens",
          "storyExcerpt": "Behind the scenes, counter tracking tokenless drawer opens captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording MetadataEndpoint=169.254.169.254/latest/meta-data/iam/security-credentials/, IamRoleName=ProdAppInstanceRole, IssuedAccessKeyPrefix=ASIA... , Temporary STS…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Side Window",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bucket Silos",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Geo Mismatch",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1552.005"
    },
    "step-2": {
      "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-imds-s3-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Off-Instance STS GetCallerIdentity Replay & GuardDuty OutsideAWS Detection (CloudTrail)",
      "storyCue": "Moments later, the intruder tests the stolen keycard from an outside internet connection to check who they have become, immediately tripping the cloud campus perimeter sensor that knows an internal server badge should never be swiped from outside.",
      "technicalCue": "T1550.001 · DEFENSE EVASION — From their external workstation (198.51.100.55, aws-cli/2.15.0 Python/3.11 Linux), the attacker invokes sts:GetCallerIdentity and s3:ListBuckets using the stolen ASIA...",
      "storyMappings": [
        {
          "storyTerm": "Testing the keycard to verify identity",
          "technicalTerm": "aws sts get-caller-identity invoked off-instance using stolen EC2 role keys",
          "tone": "amber"
        },
        {
          "storyTerm": "Perimeter sensor catching an outside swipe",
          "technicalTerm": "AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS",
          "tone": "sky"
        },
        {
          "storyTerm": "Exact server identity named in the alarm",
          "technicalTerm": "CloudTrail principalId mapping the stolen token directly to the compromised EC2 instance ID",
          "tone": "rose"
        },
        {
          "storyTerm": "Foreign street address logged",
          "technicalTerm": "External non-AWS sourceIPAddress recorded on the AssumedRole API call",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-imds-s3-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Testing the keycard to verify identity",
          "subtitle": "aws sts get-caller-identity invoked off-instance using stolen…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-imds-s3-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Perimeter sensor catching an outside swipe",
          "subtitle": "AWS GuardDuty UnauthorizedAccess:IAMUser/InstanceCredentialExfi…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Who They",
          "stageTag": "STEP 02 · SETUP",
          "title": "Testing the keycard to verify identity",
          "storyExcerpt": "Moments later, the intruder tests the stolen keycard from an outside internet connection to check who they have become, immediately tripping the cloud campus perimeter sensor that knows an…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail Event: eventSource=\"sts.amazonaws.com\" eventName=\"GetCallerIdentity\" (which executes the technical command / telemetry directive , CloudTrail Event…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Perimeter sensor catching an outside swipe",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses perimeter sensor catching an outside swipe to advance toward exact server identity named in the alarm.",
          "technicalParallel": "From their external workstation (198.51.100.55, aws-cli/2.15.0 Python/3.11 Linux), the attacker invokes sts:GetCallerIdentity and s3:ListBuckets using the stolen ASIA...",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Who They",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Foreign street address logged",
          "storyExcerpt": "Behind the scenes, foreign street address logged captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording CloudTrailEvent=sts.amazonaws.com : GetCallerIdentity, PrincipalId=AROA123456789:i-0a1b2c3d4e5f60001, ExternalSourceIp=198.51.100.55 , External ASN Mismatch…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Side Window",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bucket Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Geo Mismatch",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.001"
    },
    "step-3": {
      "scenarioId": "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-imds-s3-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "S3 Data Event GetObject Burst & bytesTransferred Quantification in CloudTrail",
      "storyCue": "With the stolen badge confirmed live, the intruder sweeps through sensitive storage buckets downloading object after object, while investigators tally every single GetObject receipt and byte count to prove exact regulatory impact.",
      "technicalCue": "T1530 · EXFIL & IMPACT — The attacker enumerates and downloads sensitive objects from s3://corp-prod-customer-backups/.",
      "storyMappings": [
        {
          "storyTerm": "Sweeping through sensitive storage buckets",
          "technicalTerm": "High-velocity s3:GetObject burst executed via the stolen EC2 AssumedRole",
          "tone": "amber"
        },
        {
          "storyTerm": "Tallying every receipt and exact box weight",
          "technicalTerm": "CloudTrail S3 Data Events quantifying object keys and bytesTransferredOut",
          "tone": "sky"
        },
        {
          "storyTerm": "Proving exact regulatory breach scope",
          "technicalTerm": "Forensic Athena/CloudTrail query enumerating every exfiltrated S3 object",
          "tone": "rose"
        },
        {
          "storyTerm": "Revoking active sessions immediately",
          "technicalTerm": "Attaching a date-scoped Deny inline policy to invalidate active STS tokens",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-imds-s3-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Sweeping through sensitive storage buckets",
          "subtitle": "High-velocity s3:GetObject burst executed via the stolen EC2…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-imds-s3-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Tallying every receipt and exact box…",
          "subtitle": "CloudTrail S3 Data Events quantifying object keys and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Byte",
          "stageTag": "STEP 03 · SETUP",
          "title": "Sweeping through sensitive storage buckets",
          "storyExcerpt": "With the stolen badge confirmed live, the intruder sweeps through sensitive storage buckets downloading object after object, while investigators tally every single GetObject receipt and byte…",
          "technicalParallel": "Under the hood, the observed step executes CloudTrail S3 Data Event: eventSource=\"s3.amazonaws.com\" eventName=\"GetObject\" (which executes the technical command / telemetry directive , CloudTrail S3 Data…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Box",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Tallying every receipt and exact box weight",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tallying every receipt and exact box weight to advance toward proving exact regulatory breach scope.",
          "technicalParallel": "The attacker enumerates and downloads sensitive objects from s3://corp-prod-customer-backups/.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Byte",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Revoking active sessions immediately",
          "storyExcerpt": "Behind the scenes, revoking active sessions immediately captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording CloudTrailEvent=s3.amazonaws.com : GetObject , Data Event, BucketName=corp-prod-customer-backups, ExfiltratedObjectKey=db-dump-2026-11.sql.gz…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Side Window",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bucket Silos",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Geo Mismatch",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    }
  },
  "dfir-entra-id-prt-roadtools-device-registration-forensics": {
    "briefing": {
      "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-entra-prt-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1528",
      "title": "Entra ID Primary Refresh Token (PRT) & Rogue Device Registration Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud office park that issues long-lived resident smartcards to company-owned laptops so workers stay signed in seamlessly across every building. Using a hijacked login token, an intruder walks up to the laptop-enrollment desk, registers a completely fake phantom laptop into the corporate directory, and collects a genuine long-lived smartcard that lets them mint fresh building passes quietly even from off-site machines.",
      "technicalCue": "CREDENTIAL ACCESS: Token Acquisition for Device Registration Service (Resource=urn:ms-drs:enterpriseregistration.windows.net) -> PERSISTENCE: Rogue Device Registration in Entra ID Directory Audit Logs (Operation=\"Register device\") -> DEFENSE EVASION: Primary Refresh Token (PRT) Sign-In & Persistent Session Key Forensics (IncomingTokenType=primaryRefreshToken)",
      "storyMappings": [
        {
          "storyTerm": "Requesting an appointment ticket for the laptop-enrollment desk",
          "technicalTerm": "Acquiring an OAuth token for Device Registration Service (urn:ms-drs:enterpriseregistration.windows.net)",
          "tone": "amber"
        },
        {
          "storyTerm": "Registering a completely fake phantom laptop in the directory",
          "technicalTerm": "ROADtools rogue device join logged in Entra Directory Audit Operation=\"Register device\"",
          "tone": "sky"
        },
        {
          "storyTerm": "Collecting a genuine long-lived resident smartcard",
          "technicalTerm": "Issuance of a Primary Refresh Token (PRT) and encrypted session key bound to the rogue device",
          "tone": "rose"
        },
        {
          "storyTerm": "Minting fresh passes silently across every cloud building",
          "technicalTerm": "Using the stolen PRT cookie to satisfy device-based Conditional Access persistently",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-entra-prt-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Requesting an appointment ticket for the…",
          "subtitle": "Acquiring an OAuth token for Device Registration Service…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-entra-prt-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Registering a completely fake phantom…",
          "subtitle": "ROADtools rogue device join logged in Entra Directory Audit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Desk",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Token Acquisition for Device Registration Service (Resource=urn:ms-drs:enterpriseregistration.windows.net)",
          "storyExcerpt": "Holding a stolen user sign-in credential, the intruder asks the identity gatehouse for a special pass scoped specifically to the company Device Enrollment Desk, preparing to add an attacker-controlled…",
          "technicalParallel": "Under the hood, the observed step executes Entra Sign-In Log: AppDisplayName=\"Microsoft Authentication Broker\" (29d9ed98-a469-4536-ade2-f981bc1d605e) (which executes the technical command / telemetry…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Fake",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Rogue Device Registration in Entra ID Directory Audit Logs (Operation=\"Register device\")",
          "storyExcerpt": "Presenting that enrollment pass alongside a freshly generated machine key pair, the intruder registers a phantom computer directly into the corporate directory, receiving a genuine company device…",
          "technicalParallel": "Under the hood, the observed step executes Entra Audit Log: OperationName=\"Register device\" Category=\"Device\" LoggedByService=\"Device Registration Service\" (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Long-lived",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Primary Refresh Token (PRT) Sign-In & Persistent Session Key Forensics (IncomingTokenType=primaryRefreshToken)",
          "storyExcerpt": "Using the newly issued phantom device certificate, the intruder requests a long-lived Primary Resident Smartcard and its matching cryptographic session key, allowing them to stamp fresh…",
          "technicalParallel": "Under the hood, the observed step executes Entra SignInLogs: incomingTokenType=\"primaryRefreshToken\" deviceDetail.deviceId=\"d4819c02-5511-4a90-8111-223344556677\" (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Device Stamp",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Token Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-entra-prt-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Token Acquisition for Device Registration Service (Resource=urn:ms-drs:enterpriseregistration.windows.net)",
      "storyCue": "Holding a stolen user sign-in credential, the intruder asks the identity gatehouse for a special pass scoped specifically to the company Device Enrollment Desk, preparing to add an attacker-controlled machine to the trusted fleet.",
      "technicalCue": "T1528 · CREDENTIAL ACCESS — Using a captured refresh token or browser session, the actor requests an access token for resource urn:ms-drs:enterpriseregistration.windows.net (AppId 01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9)…",
      "storyMappings": [
        {
          "storyTerm": "Special pass scoped to the Device Enrollment Desk",
          "technicalTerm": "Access token requested for resource urn:ms-drs:enterpriseregistration.windows.net",
          "tone": "amber"
        },
        {
          "storyTerm": "Stolen user sign-in credential",
          "technicalTerm": "Compromised corporate user identity or MFA-satisfied refresh token",
          "tone": "sky"
        },
        {
          "storyTerm": "Gatehouse diary recording the enrollment token",
          "technicalTerm": "Entra ID Sign-In Logs recording non-Windows or ROADtools DRS token requests",
          "tone": "rose"
        },
        {
          "storyTerm": "Gateway to trusted fleet membership",
          "technicalTerm": "Default Entra ID setting allowing standard users to register personal or joined devices",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-entra-prt-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Special pass scoped to the Device…",
          "subtitle": "Access token requested for resource…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-entra-prt-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Stolen user sign-in credential",
          "subtitle": "Compromised corporate user identity or MFA-satisfied refresh…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Special pass scoped to the Device Enrollment Desk",
          "storyExcerpt": "Holding a stolen user sign-in credential, the intruder asks the identity gatehouse for a special pass scoped specifically to the company Device Enrollment Desk, preparing to add an…",
          "technicalParallel": "Under the hood, the observed step executes Entra Sign-In Log: AppDisplayName=\"Microsoft Authentication Broker\" (29d9ed98-a469-4536-ade2-f981bc1d605e) (which executes the technical command / telemetry…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. User Sign-in",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Stolen user sign-in credential",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stolen user sign-in credential to advance toward gatehouse diary recording the enrollment token.",
          "technicalParallel": "Using a captured refresh token or browser session, the actor requests an access token for resource urn:ms-drs:enterpriseregistration.windows.net (AppId 01cb2876-7ebd-4aa4-9cc9-d28bd4d359a9) using the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. User Sign-in",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Gateway to trusted fleet membership",
          "storyExcerpt": "Behind the scenes, gateway to trusted fleet membership captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 100 (recording LogCategory=Entra ID NonInteractiveUserSignInLogs, AppDisplayName=Microsoft Authentication Broker, ResourceDisplayName=Device Registration Service , DRS…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Device Stamp",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Token Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1528"
    },
    "step-2": {
      "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-entra-prt-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Rogue Device Registration in Entra ID Directory Audit Logs (Operation=\"Register device\")",
      "storyCue": "Presenting that enrollment pass alongside a freshly generated machine key pair, the intruder registers a phantom computer directly into the corporate directory, receiving a genuine company device certificate while the directory audit ledger stamps a brand-new registration line.",
      "technicalCue": "T1098.005 · PERSISTENCE — The actor submits a locally generated RSA transport key and device certificate CSR to the DRS endpoint.",
      "storyMappings": [
        {
          "storyTerm": "Registering a phantom computer into the directory",
          "technicalTerm": "ROADtools roadtx device registration creating a rogue Entra ID Device object",
          "tone": "amber"
        },
        {
          "storyTerm": "Genuine company device certificate returned",
          "technicalTerm": "X.509 device certificate signed by the tenant Device Registration Service",
          "tone": "sky"
        },
        {
          "storyTerm": "Directory audit ledger stamping the new device",
          "technicalTerm": "Entra ID Directory Audit Log Operation=\"Register device\" or \"Add device\"",
          "tone": "rose"
        },
        {
          "storyTerm": "Sneaking past managed-device checks",
          "technicalTerm": "Attacker laptop masquerading as an Entra-joined corporate endpoint",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-entra-prt-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Registering a phantom computer into the…",
          "subtitle": "ROADtools roadtx device registration creating a rogue Entra ID…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-entra-prt-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Genuine company device certificate…",
          "subtitle": "X.509 device certificate signed by the tenant Device…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Key",
          "stageTag": "STEP 02 · SETUP",
          "title": "Registering a phantom computer into the directory",
          "storyExcerpt": "Presenting that enrollment pass alongside a freshly generated machine key pair, the intruder registers a phantom computer directly into the corporate directory, receiving a genuine company…",
          "technicalParallel": "Under the hood, the observed step executes Entra Audit Log: OperationName=\"Register device\" Category=\"Device\" LoggedByService=\"Device Registration Service\" (which executes the technical command /…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses New",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Genuine company device certificate returned",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses genuine company device certificate returned to advance toward directory audit ledger stamping the new device.",
          "technicalParallel": "The actor submits a locally generated RSA transport key and device certificate CSR to the DRS endpoint.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Past",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Sneaking past managed-device checks",
          "storyExcerpt": "Behind the scenes, sneaking past managed-device checks captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording LogCategory=Entra ID AuditLogs , Device Registration Service, OperationName=Register device, RegisteredDeviceName=WIN-DESKTOP-991A , DeviceId d4819c02-...…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Device Stamp",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Token Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.005"
    },
    "step-3": {
      "scenarioId": "dfir-entra-id-prt-roadtools-device-registration-forensics",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-entra-prt-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Primary Refresh Token (PRT) Sign-In & Persistent Session Key Forensics (IncomingTokenType=primaryRefreshToken)",
      "storyCue": "Using the newly issued phantom device certificate, the intruder requests a long-lived Primary Resident Smartcard and its matching cryptographic session key, allowing them to stamp fresh multi-factor-satisfied cloud passes persistently until defenders delete the rogue device.",
      "technicalCue": "T1550.001 · DEFENSE EVASION — Using the registered device certificate and software session key, the actor requests a Primary Refresh Token (PRT) valid for 14 days (renewable for 90 days) that persists across user password…",
      "storyMappings": [
        {
          "storyTerm": "Long-lived Primary Resident Smartcard",
          "technicalTerm": "Entra ID Primary Refresh Token (PRT) carrying persistent MFA claims",
          "tone": "amber"
        },
        {
          "storyTerm": "Matching cryptographic session key",
          "technicalTerm": "Derived PRT session key enabling ROADtools to mint fresh x-ms-RefreshTokenCredential cookies",
          "tone": "sky"
        },
        {
          "storyTerm": "Persistent access across cloud applications",
          "technicalTerm": "Replaying PRT-derived cookies to access Microsoft 365, Azure, and Graph APIs",
          "tone": "rose"
        },
        {
          "storyTerm": "Ejecting the phantom laptop permanently",
          "technicalTerm": "Disabling/deleting the rogue DeviceId in Entra ID and revoking all refresh tokens",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-entra-prt-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Long-lived Primary Resident Smartcard",
          "subtitle": "Entra ID Primary Refresh Token (PRT) carrying persistent MFA…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-entra-prt-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Matching cryptographic session key",
          "subtitle": "Derived PRT session key enabling ROADtools to mint fresh…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Long-lived",
          "stageTag": "STEP 03 · SETUP",
          "title": "Long-lived Primary Resident Smartcard",
          "storyExcerpt": "Using the newly issued phantom device certificate, the intruder requests a long-lived Primary Resident Smartcard and its matching cryptographic session key, allowing them to stamp fresh…",
          "technicalParallel": "Under the hood, the observed step executes Entra SignInLogs: incomingTokenType=\"primaryRefreshToken\" deviceDetail.deviceId=\"d4819c02-5511-4a90-8111-223344556677\" (which executes the technical command /…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Matching cryptographic session key",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses matching cryptographic session key to advance toward persistent access across cloud applications.",
          "technicalParallel": "Using the registered device certificate and software session key, the actor requests a Primary Refresh Token (PRT) valid for 14 days (renewable for 90 days) that persists across user password changes…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Long-lived Key",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Ejecting the phantom laptop permanently",
          "storyExcerpt": "Behind the scenes, ejecting the phantom laptop permanently captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording LogCategory=Entra ID SignInLogs, IncomingTokenType=primaryRefreshToken , PRT, DeviceId=d4819c02-5511-4a90-8111-223344556677, IrRemediation=Disable/delete rogue…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Device Stamp",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Token Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.001"
    }
  },
  "dfir-gcp-cloud-audit-service-account-key-impersonation": {
    "briefing": {
      "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-gcp-imp-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078.004",
      "title": "GCP Cloud Audit ServiceAccountKey Creation & Impersonation Chain Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a cloud research campus where an intruder uses a compromised junior badge to borrow the temporary voice of a senior data-warehouse account, uses that borrowed authority to stamp a permanent offline spare key at the badge kiosk, and then steps directly into the analytics warehouse to export entire confidential tables out to an external bucket.",
      "technicalCue": "DEFENSE EVASION: Service Account Impersonation via iamcredentials.googleapis.com GenerateAccessToken -> PERSISTENCE: Persistent User-Managed JSON Key Creation (google.iam.admin.v1.CreateServiceAccountKey) -> EXFIL & IMPACT: BigQuery Table Export & Query Exfiltration Attribution (JobInserted & totalBilledBytes)",
      "storyMappings": [
        {
          "storyTerm": "Borrowing the temporary voice of a senior warehouse account",
          "technicalTerm": "Service Account impersonation via iamcredentials.googleapis.com GenerateAccessToken",
          "tone": "amber"
        },
        {
          "storyTerm": "Stamping a permanent offline spare key at the badge kiosk",
          "technicalTerm": "google.iam.admin.v1.CreateServiceAccountKey persisting access as a JSON key",
          "tone": "sky"
        },
        {
          "storyTerm": "Exporting entire confidential tables out of the analytics warehouse",
          "technicalTerm": "BigQuery JobInserted export and query exfiltration tracked by totalBilledBytes",
          "tone": "rose"
        },
        {
          "storyTerm": "Chained audit receipts proving the escalation path",
          "technicalTerm": "GCP Cloud Audit Logs correlating GenerateAccessToken, CreateServiceAccountKey, and BigQuery jobs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-gcp-imp-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Borrowing the temporary voice of a…",
          "subtitle": "Service Account impersonation via…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-gcp-imp-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Stamping a permanent offline spare key…",
          "subtitle": "google.iam.admin.v1.CreateServiceAccountKey persisting access…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Service Account Impersonation via iamcredentials.googleapis.com GenerateAccessToken",
          "storyExcerpt": "Discovering that their starting badge holds token-borrowing rights over a higher-privilege warehouse service account, the intruder requests a short-lived impersonation pass from the cloud identity desk…",
          "technicalParallel": "Under the hood, the observed step executes GCP Audit Log: logName=\"projects/corp-prod/logs/cloudaudit.googleapis.com%2Fdata_access\" (which executes the technical command / telemetry directive , GCP Audit…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Json Key",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Persistent User-Managed JSON Key Creation (google.iam.admin.v1.CreateServiceAccountKey)",
          "storyExcerpt": "To avoid losing access when the borrowed one-hour pass expires, the intruder uses their elevated privileges to print a permanent user-managed JSON key file that works indefinitely from any computer on…",
          "technicalParallel": "Under the hood, the observed step executes GCP Admin Activity Log: serviceName=\"iam.googleapis.com\" methodName=\"google.iam.admin.v1.CreateServiceAccountKey\" (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bulk Jobs",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "BigQuery Table Export & Query Exfiltration Attribution (JobInserted & totalBilledBytes)",
          "storyExcerpt": "Signing straight into the analytics warehouse with the newly printed key, the intruder submits bulk extraction jobs that sweep entire customer datasets out of the vault while the warehouse metering log…",
          "technicalParallel": "Under the hood, the observed step executes GCP BigQuery Audit: serviceName=\"bigquery.googleapis.com\" methodName=\"google.cloud.bigquery.v2.JobService.InsertJob\" (which executes the technical command /…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Key Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-gcp-imp-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Service Account Impersonation via iamcredentials.googleapis.com GenerateAccessToken",
      "storyCue": "Discovering that their starting badge holds token-borrowing rights over a higher-privilege warehouse service account, the intruder requests a short-lived impersonation pass from the cloud identity desk to step smoothly into the senior role.",
      "technicalCue": "T1078.004 · DEFENSE EVASION — Starting from a compromised Compute Engine default service account, the actor calls iamcredentials.googleapis.com method GenerateAccessToken to impersonate…",
      "storyMappings": [
        {
          "storyTerm": "Token-borrowing rights over a senior account",
          "technicalTerm": "roles/iam.serviceAccountTokenCreator binding on a privileged GCP service account",
          "tone": "amber"
        },
        {
          "storyTerm": "Requesting a short-lived impersonation pass",
          "technicalTerm": "API call iamcredentials.googleapis.com GenerateAccessToken logged in Data Access logs",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping smoothly into the senior role",
          "technicalTerm": "Short-lived OAuth2 bearer token inheriting all BigQuery and IAM rights of the target",
          "tone": "rose"
        },
        {
          "storyTerm": "Identity desk log recording the delegation",
          "technicalTerm": "GCP Audit Log authorizationInfo and requestMetadata.callerIp attribution",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-gcp-imp-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Token-borrowing rights over a senior…",
          "subtitle": "roles/iam.serviceAccountTokenCreator binding on a privileged…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-gcp-imp-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Requesting a short-lived impersonation…",
          "subtitle": "API call iamcredentials.googleapis.com GenerateAccessToken…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over",
          "stageTag": "STEP 01 · SETUP",
          "title": "Token-borrowing rights over a senior account",
          "storyExcerpt": "Discovering that their starting badge holds token-borrowing rights over a higher-privilege warehouse service account, the intruder requests a short-lived impersonation pass from the cloud…",
          "technicalParallel": "Under the hood, the observed step executes GCP Audit Log: logName=\"projects/corp-prod/logs/cloudaudit.googleapis.com%2Fdata_access\" (which executes the technical command / telemetry directive , GCP Audit…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Requesting a short-lived impersonation pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses requesting a short-lived impersonation pass to advance toward stepping smoothly into the senior role.",
          "technicalParallel": "Starting from a compromised Compute Engine default service account, the actor calls iamcredentials.googleapis.com method GenerateAccessToken to impersonate…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Role",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Identity desk log recording the delegation",
          "storyExcerpt": "Behind the scenes, identity desk log recording the delegation captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording ServiceName=iamcredentials.googleapis.com, MethodName=GenerateAccessToken, ImpersonatedAccount=prod-data-admin@corp-prod.iam.gserviceaccount.com…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Kiosk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Key Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    },
    "step-2": {
      "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-gcp-imp-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Persistent User-Managed JSON Key Creation (google.iam.admin.v1.CreateServiceAccountKey)",
      "storyCue": "To avoid losing access when the borrowed one-hour pass expires, the intruder uses their elevated privileges to print a permanent user-managed JSON key file that works indefinitely from any computer on the internet.",
      "technicalCue": "T1098.001 · PERSISTENCE — To maintain long-lived external access, the actor invokes google.iam.admin.v1.CreateServiceAccountKey, which is always logged in GCP Admin Activity Audit Logs…",
      "storyMappings": [
        {
          "storyTerm": "Printing a permanent JSON key file",
          "technicalTerm": "google.iam.admin.v1.CreateServiceAccountKey creating a user-managed private key",
          "tone": "amber"
        },
        {
          "storyTerm": "Working indefinitely from outside the cloud",
          "technicalTerm": "Persistent off-GCP credential immune to initial-access session revocation",
          "tone": "sky"
        },
        {
          "storyTerm": "Admin activity ledger recording the key birth",
          "technicalTerm": "Immutable GCP Admin Activity Log showing exact key ID and creator principal",
          "tone": "rose"
        },
        {
          "storyTerm": "Preventive campus rule blocking permanent keys",
          "technicalTerm": "Organization Policy constraints/iam.disableServiceAccountKeyCreation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-gcp-imp-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Printing a permanent JSON key file",
          "subtitle": "google.iam.admin.v1.CreateServiceAccountKey creating a…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-gcp-imp-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Working indefinitely from outside the…",
          "subtitle": "Persistent off-GCP credential immune to initial-access session…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Json Key",
          "stageTag": "STEP 02 · SETUP",
          "title": "Printing a permanent JSON key file",
          "storyExcerpt": "To avoid losing access when the borrowed one-hour pass expires, the intruder uses their elevated privileges to print a permanent user-managed JSON key file that works indefinitely from any…",
          "technicalParallel": "Under the hood, the observed step executes GCP Admin Activity Log: serviceName=\"iam.googleapis.com\" methodName=\"google.iam.admin.v1.CreateServiceAccountKey\" (which executes the technical command /…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Working indefinitely from outside the cloud",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses working indefinitely from outside the cloud to advance toward admin activity ledger recording the key birth.",
          "technicalParallel": "To maintain long-lived external access, the actor invokes google.iam.admin.v1.CreateServiceAccountKey, which is always logged in GCP Admin Activity Audit Logs (cloudaudit.googleapis.com%2Factivity) along…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rule Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Preventive campus rule blocking permanent keys",
          "storyExcerpt": "Behind the scenes, preventive campus rule blocking permanent keys captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording AuditLogStream=cloudaudit.googleapis.com/activity , Admin Activity, MethodName=google.iam.admin.v1.CreateServiceAccountKey…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Key Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.001"
    },
    "step-3": {
      "scenarioId": "dfir-gcp-cloud-audit-service-account-key-impersonation",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-gcp-imp-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "BigQuery Table Export & Query Exfiltration Attribution (JobInserted & totalBilledBytes)",
      "storyCue": "Signing straight into the analytics warehouse with the newly printed key, the intruder submits bulk extraction jobs that sweep entire customer datasets out of the vault while the warehouse metering log records every query and exact gigabyte moved.",
      "technicalCue": "T1530 · EXFIL & IMPACT — Using the exported JSON key from 198.51.100.84, the actor queries BigQuery dataset corp_prod.customer_records.",
      "storyMappings": [
        {
          "storyTerm": "Bulk extraction jobs sweeping customer datasets",
          "technicalTerm": "BigQuery table extract and SELECT * queries logged as JobInserted / JobCompleted",
          "tone": "amber"
        },
        {
          "storyTerm": "Warehouse metering log recording exact gigabytes moved",
          "technicalTerm": "BigQuery Data Access audit fields totalBilledBytes and referencedTables",
          "tone": "sky"
        },
        {
          "storyTerm": "External destination bucket receiving stolen tables",
          "technicalTerm": "Export job writing CSV/Parquet archives to an attacker-controlled GCS bucket",
          "tone": "rose"
        },
        {
          "storyTerm": "Forensic breach quantification",
          "technicalTerm": "Correlating serviceAccountKeyName across BigQuery job logs to list all exposed tables",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-gcp-imp-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Bulk extraction jobs sweeping customer…",
          "subtitle": "BigQuery table extract and SELECT * queries logged as…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-gcp-imp-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Warehouse metering log recording exact…",
          "subtitle": "BigQuery Data Access audit fields totalBilledBytes and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bulk Jobs",
          "stageTag": "STEP 03 · SETUP",
          "title": "Bulk extraction jobs sweeping customer datasets",
          "storyExcerpt": "Signing straight into the analytics warehouse with the newly printed key, the intruder submits bulk extraction jobs that sweep entire customer datasets out of the vault while the warehouse…",
          "technicalParallel": "Under the hood, the observed step executes GCP BigQuery Audit: serviceName=\"bigquery.googleapis.com\" methodName=\"google.cloud.bigquery.v2.JobService.InsertJob\" (which executes the technical command /…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Log",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Warehouse metering log recording exact gigabytes moved",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses warehouse metering log recording exact gigabytes moved to advance toward external destination bucket receiving stolen tables.",
          "technicalParallel": "Using the exported JSON key from 198.51.100.84, the actor queries BigQuery dataset corp_prod.customer_records.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Bulk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic breach quantification",
          "storyExcerpt": "Behind the scenes, forensic breach quantification captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording ServiceName=bigquery.googleapis.com, AuthenticatedViaKey=keys/9f81a20b3c4d , User-Managed Key…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Key Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1530"
    }
  },
  "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape": {
    "briefing": {
      "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-k8s-priv-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1613",
      "title": "Kubernetes Audit Log Privileged Pod & hostPath Container Escape — Story-to-Technical Overview",
      "storyCue": "Imagine a guarded container warehouse where a rogue worker first asks the front-desk policy book what rooms their badge can unlock, then orders a brand-new privileged inspection booth with its back door hinged directly onto the warehouse master floor, and finally steps straight out of that booth into the warehouse chief control room while a kernel-level floor sensor sounds an immediate alarm.",
      "technicalCue": "CREDENTIAL ACCESS: ServiceAccount RBAC SelfSubjectRulesReview Reconnaissance in kube-apiserver audit.log -> DEFENSE EVASION: Privileged Pod Creation with hostPID: true & hostPath: / (K8s Audit RequestObject) -> DEFENSE EVASION: Host Namespace Escape via nsenter -t 1 -m -u -i -n & Falco eBPF Alert",
      "storyMappings": [
        {
          "storyTerm": "Asking the front-desk policy book what rooms the badge can unlock",
          "technicalTerm": "ServiceAccount RBAC SelfSubjectRulesReview logged in kube-apiserver audit logs",
          "tone": "amber"
        },
        {
          "storyTerm": "Ordering a booth with its back door hinged onto the master floor",
          "technicalTerm": "Creating a privileged Pod with hostPID: true and hostPath: /",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping straight into the warehouse chief control room",
          "technicalTerm": "nsenter -t 1 -m -u -i -n escaping into host PID 1 namespaces",
          "tone": "rose"
        },
        {
          "storyTerm": "Kernel-level floor sensor sounding an immediate alarm",
          "technicalTerm": "CNCF Falco eBPF runtime alert catching container namespace breakout",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-k8s-priv-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Asking the front-desk policy book what…",
          "subtitle": "ServiceAccount RBAC SelfSubjectRulesReview logged in…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-k8s-priv-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Ordering a booth with its back door…",
          "subtitle": "Creating a privileged Pod with hostPID: true and hostPath: /",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-audit",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "ServiceAccount RBAC SelfSubjectRulesReview Reconnaissance in kube-apiserver audit.log",
          "storyExcerpt": "Checking what doors their stolen container badge can open, the intruder submits a self-audit inquiry to the central cluster clerk, who dutifully prints out their exact permissions while recording the…",
          "technicalParallel": "Under the hood, the observed step executes K8s Audit Event: apiVersion=\"audit.k8s.io/v1\" verb=\"create\" resource=\"selfsubjectrulesreviews\" (which executes the technical command / telemetry directive , K8s…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Back Door",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Privileged Pod Creation with hostPID: true & hostPath: / (K8s Audit RequestObject)",
          "storyExcerpt": "Using their newly confirmed pod-creation rights, the intruder submits a blueprint for a stripped-down breakout booth with all safety guards disabled, full visibility into host workers, and the host…",
          "technicalParallel": "Under the hood, the observed step executes K8s Audit Event: requestURI=\"/api/v1/namespaces/cicd/pods\" verb=\"create\" responseStatus.code=201 (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Host Namespace Escape via nsenter -t 1 -m -u -i -n & Falco eBPF Alert",
          "storyExcerpt": "Stepping inside the newly launched breakout booth, the intruder flips the namespace master switch straight into the underlying node main supervisor process, triggering an unmistakable kernel-level…",
          "technicalParallel": "Under the hood, the observed step executes Container Process: nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash (which invokes nsenter , targeting /proc/1/ns/* or chroot /host inside a…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Host Hatch",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-k8s-priv-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "ServiceAccount RBAC SelfSubjectRulesReview Reconnaissance in kube-apiserver audit.log",
      "storyCue": "Checking what doors their stolen container badge can open, the intruder submits a self-audit inquiry to the central cluster clerk, who dutifully prints out their exact permissions while recording the reconnaissance query in the master audit diary.",
      "technicalCue": "T1613 · CREDENTIAL ACCESS — After compromising an application pod, the actor reads /var/run/secrets/kubernetes.io/serviceaccount/token and queries POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews (kubectl auth…",
      "storyMappings": [
        {
          "storyTerm": "Submitting a self-audit inquiry to the cluster clerk",
          "technicalTerm": "kubectl auth can-i --list invoking authorization.k8s.io SelfSubjectRulesReview",
          "tone": "amber"
        },
        {
          "storyTerm": "Stolen container badge",
          "technicalTerm": "Compromised Kubernetes pod ServiceAccount bearer JWT token",
          "tone": "sky"
        },
        {
          "storyTerm": "Master audit diary recording the check",
          "technicalTerm": "kube-apiserver Audit Log capturing SelfSubjectRulesReview verb=create",
          "tone": "rose"
        },
        {
          "storyTerm": "Discovering pod-creation authority",
          "technicalTerm": "Confirming RBAC permission to create privileged Pods in the target namespace",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-k8s-priv-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Submitting a self-audit inquiry to the…",
          "subtitle": "kubectl auth can-i --list invoking authorization.k8s.io…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-k8s-priv-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Stolen container badge",
          "subtitle": "Compromised Kubernetes pod ServiceAccount bearer JWT token",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-audit",
          "stageTag": "STEP 01 · SETUP",
          "title": "Submitting a self-audit inquiry to the cluster clerk",
          "storyExcerpt": "Checking what doors their stolen container badge can open, the intruder submits a self-audit inquiry to the central cluster clerk, who dutifully prints out their exact permissions while…",
          "technicalParallel": "Under the hood, the observed step executes K8s Audit Event: apiVersion=\"audit.k8s.io/v1\" verb=\"create\" resource=\"selfsubjectrulesreviews\" (which executes the technical command / telemetry directive , K8s…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Stolen container badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stolen container badge to advance toward master audit diary recording the check.",
          "technicalParallel": "After compromising an application pod, the actor reads /var/run/secrets/kubernetes.io/serviceaccount/token and queries POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews (kubectl auth can-i…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pod-creation",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Discovering pod-creation authority",
          "storyExcerpt": "Behind the scenes, discovering pod-creation authority captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording LogSource=Kubernetes API Server Audit Log , audit.k8s.io/v1, RequestUri=/apis/authorization.k8s.io/v1/selfsubjectrulesreviews…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Host Hatch",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1613"
    },
    "step-2": {
      "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-k8s-priv-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Privileged Pod Creation with hostPID: true & hostPath: / (K8s Audit RequestObject)",
      "storyCue": "Using their newly confirmed pod-creation rights, the intruder submits a blueprint for a stripped-down breakout booth with all safety guards disabled, full visibility into host workers, and the host entire root hallway mounted straight inside.",
      "technicalCue": "T1611 · DEFENSE EVASION — The actor submits POST /api/v1/namespaces/cicd/pods creating a pod named node-debug-helper with securityContext.privileged=true, hostPID=true, and a volume mount with hostPath.path=\"/\".",
      "storyMappings": [
        {
          "storyTerm": "Breakout booth blueprint with all safety guards disabled",
          "technicalTerm": "Pod manifest setting securityContext.privileged: true",
          "tone": "amber"
        },
        {
          "storyTerm": "Full visibility into host workers",
          "technicalTerm": "Pod spec enabling hostPID: true sharing the worker node PID namespace",
          "tone": "sky"
        },
        {
          "storyTerm": "Host root hallway mounted straight inside",
          "technicalTerm": "hostPath volume binding host / directly into the container filesystem",
          "tone": "rose"
        },
        {
          "storyTerm": "Audit diary preserving the full submitted blueprint",
          "technicalTerm": "Kubernetes Audit Log RequestObject capturing privileged pod creation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-k8s-priv-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Breakout booth blueprint with all safety…",
          "subtitle": "Pod manifest setting securityContext.privileged: true",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-k8s-priv-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Full visibility into host workers",
          "subtitle": "Pod spec enabling hostPID: true sharing the worker node PID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pod-creation All",
          "stageTag": "STEP 02 · SETUP",
          "title": "Breakout booth blueprint with all safety guards…",
          "storyExcerpt": "Using their newly confirmed pod-creation rights, the intruder submits a blueprint for a stripped-down breakout booth with all safety guards disabled, full visibility into host workers, and the…",
          "technicalParallel": "Under the hood, the observed step executes K8s Audit Event: requestURI=\"/api/v1/namespaces/cicd/pods\" verb=\"create\" responseStatus.code=201 (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full Host",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Full visibility into host workers",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses full visibility into host workers to advance toward host root hallway mounted straight inside.",
          "technicalParallel": "The actor submits POST /api/v1/namespaces/cicd/pods creating a pod named node-debug-helper with securityContext.privileged=true, hostPID=true, and a volume mount with hostPath.path=\"/\".",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Host Root",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Audit diary preserving the full submitted blueprint",
          "storyExcerpt": "Behind the scenes, audit diary preserving the full submitted blueprint captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 201 (recording PodName=cicd/node-debug-helper, SecurityContext=privileged: true, hostPID: true, HostVolumeMount=hostPath: \"/\" mounted at /host, HttpResponseCode=201…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Host Hatch",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1611"
    },
    "step-3": {
      "scenarioId": "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-k8s-priv-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Host Namespace Escape via nsenter -t 1 -m -u -i -n & Falco eBPF Alert",
      "storyCue": "Stepping inside the newly launched breakout booth, the intruder flips the namespace master switch straight into the underlying node main supervisor process, triggering an unmistakable kernel-level breakout siren.",
      "technicalCue": "T1611 · DEFENSE EVASION — Because hostPID: true exposes the worker node PID 1 (/proc/1/ns/*) inside the container and privileged: true grants CAP_SYS_ADMIN, the actor executes nsenter --target 1 --mount --uts --ipc…",
      "storyMappings": [
        {
          "storyTerm": "Flipping the namespace master switch into the supervisor",
          "technicalTerm": "Executing nsenter -t 1 -m -u -i -n to enter host PID 1 mount, UTS, IPC, and net spaces",
          "tone": "amber"
        },
        {
          "storyTerm": "Underlying node main supervisor process",
          "technicalTerm": "Host Linux init / systemd process (PID 1) running with full node root privileges",
          "tone": "sky"
        },
        {
          "storyTerm": "Unmistakable kernel-level breakout siren",
          "technicalTerm": "Falco eBPF alert detecting setns / nsenter execution inside a container",
          "tone": "rose"
        },
        {
          "storyTerm": "Preventive gate blocking privileged blueprints upfront",
          "technicalTerm": "Kubernetes Pod Security Admission (PSA) enforcing the restricted standard",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-k8s-priv-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Flipping the namespace master switch…",
          "subtitle": "Executing nsenter -t 1 -m -u -i -n to enter host PID 1 mount…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-k8s-priv-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Underlying node main supervisor process",
          "subtitle": "Host Linux init / systemd process (PID 1) running with full…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Node Main",
          "stageTag": "STEP 03 · SETUP",
          "title": "Flipping the namespace master switch into the…",
          "storyExcerpt": "Stepping inside the newly launched breakout booth, the intruder flips the namespace master switch straight into the underlying node main supervisor process, triggering an unmistakable…",
          "technicalParallel": "Under the hood, the observed step executes Container Process: nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash (which invokes nsenter , targeting /proc/1/ns/* or chroot /host inside a…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Node Main",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Underlying node main supervisor process",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses underlying node main supervisor process to advance toward unmistakable kernel-level breakout siren.",
          "technicalParallel": "Because hostPID: true exposes the worker node PID 1 (/proc/1/ns/*) inside the container and privileged: true grants CAP_SYS_ADMIN, the actor executes nsenter --target 1 --mount --uts --ipc --net --pid to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Preventive gate blocking privileged blueprints upfront",
          "storyExcerpt": "Behind the scenes, preventive gate blocking privileged blueprints upfront captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 308 (recording RuntimeSensor=CNCF Falco eBPF / Linux Auditd, Syscall=308 , sys_setns joining host PID 1 namespaces, ContainerId=8f19c2a04b12…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Cluster Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Host Hatch",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1611"
    }
  },
  "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule": {
    "briefing": {
      "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
      "sectionKey": "briefing",
      "sceneKind": "cld-dfir-m365-ual-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1564.008",
      "title": "M365 Purview Unified Audit Log MailItemsAccessed & New-InboxRule Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate mailroom intrusion reconstructed through three distinct security-desk receipts: first, catching the intruder quietly installing a hidden mail-sorting chute that diverts security alerts straight into the trash bin; second, reading the exact barcode scans that distinguish whether the intruder opened specific letters one by one or synced an entire mailbag at once; and third, uncovering a rogue automated courier pass left behind so the intruder can keep reading mail even after the victim changes their password.",
      "technicalCue": "PERSISTENCE: Stealthy Exchange Online Inbox Rule Creation (UAL Operation=\"New-InboxRule\") -> EXFIL & IMPACT: Mailbox Search & Item Access Attribution via MailItemsAccessed (Bind vs Sync) -> PERSISTENCE: OAuth App Consent Persistence (Operation=\"Consent to application\") & Session Revocation",
      "storyMappings": [
        {
          "storyTerm": "Hidden mail-sorting chute diverting alerts into the trash bin",
          "technicalTerm": "M365 Unified Audit Log Operation=\"New-InboxRule\" hiding security emails in RSS/Deleted Items",
          "tone": "amber"
        },
        {
          "storyTerm": "Barcode scans distinguishing single opened letters from full bag syncs",
          "technicalTerm": "MailItemsAccessed telemetry differentiating Bind (individual view) vs Sync (folder dump)",
          "tone": "sky"
        },
        {
          "storyTerm": "Rogue automated courier pass surviving password resets",
          "technicalTerm": "Malicious OAuth persistence logged via Operation=\"Consent to application\"",
          "tone": "rose"
        },
        {
          "storyTerm": "Central mailroom ledger preserving every action",
          "technicalTerm": "Microsoft Purview Unified Audit Log (UAL) end-to-end BEC investigation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "cld-dfir-m365-ual-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hidden mail-sorting chute diverting…",
          "subtitle": "M365 Unified Audit Log Operation=\"New-InboxRule\" hiding…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-m365-ual-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Barcode scans distinguishing single…",
          "subtitle": "MailItemsAccessed telemetry differentiating Bind (individual…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Auto-sorting",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Stealthy Exchange Online Inbox Rule Creation (UAL Operation=\"New-InboxRule\")",
          "storyExcerpt": "Right after slipping into an executive mailbox, the intruder bolts a silent auto-sorting rule onto the inbox so any invoice disputes or security warnings automatically mark themselves read and vanish…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations New-InboxRule,Set-InboxRule,UpdateInboxRules (which invokes Microsoft 365 Exchange Online / Graph API operations to silently…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Full Bag",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Mailbox Search & Item Access Attribution via MailItemsAccessed (Bind vs Sync)",
          "storyExcerpt": "To determine whether the intruder merely peeked at three contracts or hauled away the entire executive inbox, investigators examine the mailroom barcode ledger, which marks individual letter opens…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText \"198.51.100.91\" (which invokes Microsoft 365 Exchange Online / Graph API operations to silently…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Mail-reader App",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "OAuth App Consent Persistence (Operation=\"Consent to application\") & Session Revocation",
          "storyExcerpt": "Before logging off, the intruder approves a shady third-party mail-reader app carrying broad reading rights so that even when the executive changes their door key, the rogue app keeps slipping in through…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"Consent to application\",\"Add OAuth2PermissionGrant\" (which executes the technical command / telemetry directive…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Mail Chute",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Trash Furnace",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Barcode Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
      "sectionKey": "step-1",
      "sceneKind": "cld-dfir-m365-ual-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Stealthy Exchange Online Inbox Rule Creation (UAL Operation=\"New-InboxRule\")",
      "storyCue": "Right after slipping into an executive mailbox, the intruder bolts a silent auto-sorting rule onto the inbox so any invoice disputes or security warnings automatically mark themselves read and vanish into an obscure back drawer.",
      "technicalCue": "T1564.008 · PERSISTENCE — To hide incoming security alerts and wire-transfer replies from the mailbox owner while forwarding copies externally, the actor invokes New-InboxRule via OWA.",
      "storyMappings": [
        {
          "storyTerm": "Silent auto-sorting rule bolted onto the inbox",
          "technicalTerm": "Exchange Online New-InboxRule matching keywords (invoice, wire, security)",
          "tone": "amber"
        },
        {
          "storyTerm": "Vanishing into an obscure back drawer",
          "technicalTerm": "Inbox rule actions setting MarkAsRead=True and MoveToFolder=RSS Feeds or Deleted Items",
          "tone": "sky"
        },
        {
          "storyTerm": "Mailroom ledger recording the rule creation",
          "technicalTerm": "Unified Audit Log Operation=\"New-InboxRule\" with ClientIP and Parameters",
          "tone": "rose"
        },
        {
          "storyTerm": "Keeping the victim blind to business email compromise",
          "technicalTerm": "Hiding attacker-sent phishing replies and bank fraud warnings from the mailbox owner",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-m365-ual-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Silent auto-sorting rule bolted onto the…",
          "subtitle": "Exchange Online New-InboxRule matching keywords (invoice…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-m365-ual-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Vanishing into an obscure back drawer",
          "subtitle": "Inbox rule actions setting MarkAsRead=True and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Auto-sorting",
          "stageTag": "STEP 01 · SETUP",
          "title": "Silent auto-sorting rule bolted onto the inbox",
          "storyExcerpt": "Right after slipping into an executive mailbox, the intruder bolts a silent auto-sorting rule onto the inbox so any invoice disputes or security warnings automatically mark themselves read and…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations New-InboxRule,Set-InboxRule,UpdateInboxRules (which invokes Microsoft 365 Exchange Online / Graph API operations to silently…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Vanishing into an obscure back drawer",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses vanishing into an obscure back drawer to advance toward mailroom ledger recording the rule creation.",
          "technicalParallel": "To hide incoming security alerts and wire-transfer replies from the mailbox owner while forwarding copies externally, the actor invokes New-InboxRule via OWA.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rule",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Keeping the victim blind to business email compromise",
          "storyExcerpt": "Behind the scenes, keeping the victim blind to business email compromise captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 1 (recording AuditWorkload=Microsoft Purview Unified Audit Log , Exchange, Operation=New-InboxRule, ClientIpAddress=198.51.100.91…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Mail Chute",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Trash Furnace",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Barcode Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1564.008"
    },
    "step-2": {
      "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
      "sectionKey": "step-2",
      "sceneKind": "cld-dfir-m365-ual-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Mailbox Search & Item Access Attribution via MailItemsAccessed (Bind vs Sync)",
      "storyCue": "To determine whether the intruder merely peeked at three contracts or hauled away the entire executive inbox, investigators examine the mailroom barcode ledger, which marks individual letter opens differently from bulk folder synchronizations.",
      "technicalCue": "T1114.002 · EXFIL & IMPACT — Next, the actor searches the mailbox for \"password\", \"contract\", and \"routing number\" and opens matching messages.",
      "storyMappings": [
        {
          "storyTerm": "Barcode ledger tracking every touched message",
          "technicalTerm": "Microsoft Purview MailItemsAccessed audit event recording InternetMessageId lists",
          "tone": "amber"
        },
        {
          "storyTerm": "Peeking at individual letters one by one",
          "technicalTerm": "MailAccessType=\"Bind\" listing exact MessageIds viewed over OWA or Graph API",
          "tone": "sky"
        },
        {
          "storyTerm": "Hauling away an entire mailbag at once",
          "technicalTerm": "MailAccessType=\"Sync\" indicating bulk IMAP/ActiveSync/Outlook folder download",
          "tone": "rose"
        },
        {
          "storyTerm": "Exact legal breach scoping",
          "technicalTerm": "Correlating SessionId and ClientIPAddress against compromised message inventory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-m365-ual-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Barcode ledger tracking every touched…",
          "subtitle": "Microsoft Purview MailItemsAccessed audit event recording…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-m365-ual-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Peeking at individual letters one by one",
          "subtitle": "MailAccessType=\"Bind\" listing exact MessageIds viewed over OWA…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Away",
          "stageTag": "STEP 02 · SETUP",
          "title": "Barcode ledger tracking every touched message",
          "storyExcerpt": "To determine whether the intruder merely peeked at three contracts or hauled away the entire executive inbox, investigators examine the mailroom barcode ledger, which marks individual letter…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations MailItemsAccessed -FreeText \"198.51.100.91\" (which invokes Microsoft 365 Exchange Online / Graph API operations to silently…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. One One",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Peeking at individual letters one by one",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses peeking at individual letters one by one to advance toward hauling away an entire mailbag at once.",
          "technicalParallel": "Next, the actor searches the mailbox for \"password\", \"contract\", and \"routing number\" and opens matching messages.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Away",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Exact legal breach scoping",
          "storyExcerpt": "Behind the scenes, exact legal breach scoping captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 2 (recording Operation=MailItemsAccessed, MailAccessType=Bind , Direct Message Read, FolderPath=/Sent Items, InternetMessageId=<91a8b204@corp.com> , 482,910 bytes under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Mail Chute",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Trash Furnace",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Barcode Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1114.002"
    },
    "step-3": {
      "scenarioId": "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule",
      "sectionKey": "step-3",
      "sceneKind": "cld-dfir-m365-ual-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "OAuth App Consent Persistence (Operation=\"Consent to application\") & Session Revocation",
      "storyCue": "Before logging off, the intruder approves a shady third-party mail-reader app carrying broad reading rights so that even when the executive changes their door key, the rogue app keeps slipping in through the side mail slot until investigators revoke both the app grant and every live session.",
      "technicalCue": "T1098.003 · PERSISTENCE — To retain persistent API access to the mailbox even after the user resets their password, the actor grants OAuth Mail.ReadWrite consent to a rogue multi-tenant application, logged in the…",
      "storyMappings": [
        {
          "storyTerm": "Approving a shady third-party mail-reader app",
          "technicalTerm": "Unified Audit Log Operation=\"Consent to application\" granting Mail.Read / offline_access",
          "tone": "amber"
        },
        {
          "storyTerm": "Surviving ordinary employee password changes",
          "technicalTerm": "Persistent OAuth refresh tokens valid independently of user password resets",
          "tone": "sky"
        },
        {
          "storyTerm": "Revoking both the rogue app and every active wristband",
          "technicalTerm": "Removing malicious Enterprise App Service Principal and calling Revoke-MgUserSignInSession",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking the side mail slot",
          "technicalTerm": "Enforcing Admin Consent Workflow so users cannot approve unverified OAuth apps",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "cld-dfir-m365-ual-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Approving a shady third-party…",
          "subtitle": "Unified Audit Log Operation=\"Consent to application\" granting…",
          "tone": "amber"
        },
        {
          "id": "cld-dfir-m365-ual-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Surviving ordinary employee password…",
          "subtitle": "Persistent OAuth refresh tokens valid independently of user…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail-reader App",
          "stageTag": "STEP 03 · SETUP",
          "title": "Approving a shady third-party mail-reader app",
          "storyExcerpt": "Before logging off, the intruder approves a shady third-party mail-reader app carrying broad reading rights so that even when the executive changes their door key, the rogue app keeps slipping…",
          "technicalParallel": "Under the hood, the observed step executes Search-UnifiedAuditLog -Operations \"Consent to application\",\"Add OAuth2PermissionGrant\" (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Both",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Surviving ordinary employee password changes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses surviving ordinary employee password changes to advance toward revoking both the rogue app and every active wristband.",
          "technicalParallel": "To retain persistent API access to the mailbox even after the user resets their password, the actor grants OAuth Mail.ReadWrite consent to a rogue multi-tenant application, logged in the Unified Audit…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Both App",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Locking the side mail slot",
          "storyExcerpt": "Behind the scenes, locking the side mail slot captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 3 (recording AuditWorkload=AzureActiveDirectory , Entra ID, Operation=Consent to application, GrantedScopes=Mail.ReadWrite, offline_access, ClientIp=198.51.100.91 under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Mail Chute",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Trash Furnace",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Barcode Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.003"
    }
  }
};
