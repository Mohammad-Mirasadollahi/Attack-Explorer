import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'cloud-aws-s3-kms-external-account-encryption-extortion-audit',
    title: 'Halcyon, AWS Security & MITRE — AWS S3 Server-Side KMS External Key (SSE-KMS) Re-Encryption Audit',
    category: 'CLOUD_SAAS',
    mitreId: 'T1486',
    description:
      'Grounded in AWS Security Incident Response guidance, Halcyon / Rhino Security Labs Codefinger research, and MITRE ATT&CK T1486: DFIR analysts investigate cloud-native S3 extortion where an attacker uses compromised s3:PutObject and kms:Encrypt permissions to invoke CopyObject in-place across S3 buckets using a Customer Managed KMS Key (CMK) owned by an external AWS account—rendering objects unreadable once the external KMS key is scheduled for deletion.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External AWS Account KMS CMK', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'AWS S3 API (CopyObject SSE-KMS)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Production S3 Bucket Objects', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'AWS CloudTrail S3 Data Events & GuardDuty', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'S3 Object Versioning & Lifecycle Policy', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Cross-Account KMS Key Policy Grant & S3 Bucket Inventory Enumeration',
        narration:
          'Using compromised IAM credentials with s3:ListBucket and s3:PutObject permissions, the actor configures a KMS Customer Managed Key (CMK) in an external AWS account that permits kms:Encrypt and kms:GenerateDataKey* from the victim account.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Resource Development & Discovery (T1619 - Cloud Storage Object Discovery)',
        technicalCommands: [
          'aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=ListBuckets',
          'aws s3api get-bucket-versioning --bucket prod-enterprise-records',
        ],
        defenseMitigation:
          'Enforce an AWS Organizations Service Control Policy (SCP) with Condition StringNotEquals aws:ResourceAccount / s3:x-amz-server-side-encryption-aws-kms-key-id to forbid encrypting S3 objects with KMS keys outside the organization.',
        logs: [
          {
            id: 's3-kms-1',
            timestamp: '12:10:04.119',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'ListObjectsV2 on bucket prod-enterprise-records',
            raw: 'cloudtrail: {"eventSource":"s3.amazonaws.com","eventName":"ListObjectsV2","requestParameters":{"bucketName":"prod-enterprise-records"},"userIdentity":{"type":"IAMUser","userName":"backup-sync-svc"}}',
            parsedFields: {
              EventSource: 's3.amazonaws.com',
              TargetBucket: 'prod-enterprise-records',
              ActorPrincipal: 'backup-sync-svc',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: In-Place S3 CopyObject Re-Encryption with External Account SSE-KMS Key ARN',
        narration:
          'Without downloading or re-uploading the data, the actor invokes s3:CopyObject (copying each object onto itself) with x-amz-server-side-encryption="aws:kms" and x-amz-server-side-encryption-aws-kms-key-id pointing to arn:aws:kms:us-east-1:999988887777:key/<external_cmk_id>, logged in S3 Data Events.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'jq \'.Records[] | select(.eventName=="CopyObject" and (.requestParameters."x-amz-server-side-encryption-aws-kms-key-id" | contains("999988887777")))\' s3_data_events.json',
          'aws s3api head-object --bucket prod-enterprise-records --key financial-ledger-2026.parquet',
        ],
        defenseMitigation:
          'Attach an S3 Bucket Policy denying s3:PutObject and s3:CopyObject when s3:x-amz-server-side-encryption-aws-kms-key-id does not match the organization approved KMS key ARN.',
        logs: [
          {
            id: 's3-kms-2',
            timestamp: '12:11:32.805',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'CopyObject in-place with external SSE-KMS key arn:aws:kms:us-east-1:999988887777:key/ext-cmk',
            raw: 'cloudtrail_s3: {"eventSource":"s3.amazonaws.com","eventName":"CopyObject","requestParameters":{"bucketName":"prod-enterprise-records","key":"financial-ledger-2026.parquet","x-amz-server-side-encryption":"aws:kms","x-amz-server-side-encryption-aws-kms-key-id":"arn:aws:kms:us-east-1:999988887777:key/44556677-8899-aabb-ccdd-eeff00112233"}}',
            parsedFields: {
              EventName: 'CopyObject (In-Place Server-Side Re-Encryption)',
              EncryptionMode: 'aws:kms (SSE-KMS)',
              ExternalKmsKeyArn: 'arn:aws:kms:us-east-1:999988887777:key/44556677-8899-aabb-ccdd-eeff00112233',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: PutBucketLifecycleConfiguration 1-Day NoncurrentVersionExpiration & Object Lock Recovery',
        narration:
          'To purge prior unencrypted object versions on versioned buckets, the actor calls s3:PutBucketLifecycleConfiguration with NoncurrentVersionExpiration set to 1 day. Defenders block deletion by removing the malicious lifecycle rule and restoring prior S3 VersionIds protected by S3 Object Lock.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1490 - Inhibit System Recovery)',
        technicalCommands: [
          'aws s3api delete-bucket-lifecycle --bucket prod-enterprise-records',
          'aws s3api list-object-versions --bucket prod-enterprise-records --prefix financial-ledger-2026.parquet',
        ],
        defenseMitigation:
          'Enable S3 Versioning with MFA Delete and S3 Object Lock (Compliance or Governance mode), and alert immediately on PutBucketLifecycleConfiguration events in CloudTrail.',
        logs: [
          {
            id: 's3-kms-3',
            timestamp: '12:12:10.402',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'aws-s3',
            CommandLine: 'PutBucketLifecycleConfiguration (NoncurrentVersionExpiration NoncurrentDays=1)',
            raw: 'cloudtrail: {"eventSource":"s3.amazonaws.com","eventName":"PutBucketLifecycleConfiguration","requestParameters":{"bucketName":"prod-enterprise-records","LifecycleConfiguration":{"Rule":{"NoncurrentVersionExpiration":{"NoncurrentDays":1},"Status":"Enabled"}}}}',
            parsedFields: {
              EventName: 'PutBucketLifecycleConfiguration',
              LifecycleRuleAction: 'NoncurrentVersionExpiration (NoncurrentDays: 1)',
              RecoveryPivot: 'DeleteLifecycle + Restore prior S3 VersionId',
            },
          },
        ],
      },
    ],
  };
