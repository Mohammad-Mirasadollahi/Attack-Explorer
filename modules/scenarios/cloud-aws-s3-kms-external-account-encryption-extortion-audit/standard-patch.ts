import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud-native ransomware crew that never drops a single piece of malware on any computer. Instead, using stolen cloud warehouse keys, they bring their own external padlock from an outside account, use the warehouse own built-in copier to re-seal every customer box in place under their external padlock, and set the warehouse automatic trash chute to one day so all previous unlocked editions are swept away before the ransom note arrives.',
      storyMappings: [
        {
          storyTerm: 'Bringing an external padlock from an outside account',
          technicalTerm: 'Cross-account AWS KMS key policy granting victim IAM role kms:GenerateDataKey',
          tone: 'amber',
        },
        {
          storyTerm: 'Using the warehouse built-in copier to re-seal every box in place',
          technicalTerm: 'In-place s3:CopyObject with SSE-KMS pointing to the attacker external KMS Key ARN',
          tone: 'sky',
        },
        {
          storyTerm: 'Setting the warehouse automatic trash chute to one day',
          technicalTerm: 'PutBucketLifecycleConfiguration setting 1-day NoncurrentVersionExpiration',
          tone: 'rose',
        },
        {
          storyTerm: 'Zero malware required on any server',
          technicalTerm: 'Pure cloud control-plane S3 ransomware extortion via native AWS APIs',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inside their own separate cloud account, the extortionist forges a brand-new encryption padlock and authorizes the victim cloud badge to lock boxes with it, while quietly mapping every valuable storage bucket inside the victim estate.',
        storyMappings: [
          {
            storyTerm: 'Forging an encryption padlock inside an outside account',
            technicalTerm: 'Attacker-owned AWS KMS Customer Managed Key (CMK) in an external AWS account',
            tone: 'amber',
          },
          {
            storyTerm: 'Authorizing the victim badge to lock boxes with it',
            technicalTerm: 'Cross-account KMS Key Policy allowing victim role kms:Encrypt and GenerateDataKey',
            tone: 'sky',
          },
          {
            storyTerm: 'Mapping every valuable storage bucket',
            technicalTerm: 'CloudTrail s3:ListBuckets and s3:ListObjectsV2 inventory enumeration',
            tone: 'rose',
          },
          {
            storyTerm: 'Locking without downloading a single byte',
            technicalTerm: 'Server-side encryption design avoiding slow external download-and-reupload bottlenecks',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Issuing rapid in-place copy orders straight through the cloud storage service itself, the extortionist forces the warehouse to overwrite every file with a fresh copy sealed strictly under the attacker external padlock, instantly locking the rightful owner out once the attacker revokes access to their external key.',
        storyMappings: [
          {
            storyTerm: 'Rapid in-place copy orders straight through the warehouse',
            technicalTerm: 's3:CopyObject targeting source == destination with x-amz-server-side-encryption: aws:kms',
            tone: 'amber',
          },
          {
            storyTerm: 'Sealing every file under the attacker external padlock',
            technicalTerm: 'x-amz-server-side-encryption-aws-kms-key-id referencing an external AWS Account ID',
            tone: 'sky',
          },
          {
            storyTerm: 'Locking the rightful owner out in one flip',
            technicalTerm: 'Attacker deleting or revoking their external KMS key policy until ransom is paid',
            tone: 'rose',
          },
          {
            storyTerm: 'High-signal external-key alarm',
            technicalTerm: 'CloudTrail S3 Data Event flagging CopyObject specifying an untrusted external KMS Key ARN',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the warehouse keeps older unlocked versions of every box on a safety shelf, the extortionist silently adjusts the warehouse automated housekeeping rule to incinerate all non-current versions after a single day unless Object Lock bolts the shelf shut.',
        storyMappings: [
          {
            storyTerm: 'Safety shelf holding older unlocked versions',
            technicalTerm: 'S3 Bucket Versioning preserving pre-encryption noncurrent object versions',
            tone: 'amber',
          },
          {
            storyTerm: 'Adjusting automated housekeeping to burn old versions in one day',
            technicalTerm: 's3:PutBucketLifecycleConfiguration setting NoncurrentVersionExpiration to 1 day',
            tone: 'sky',
          },
          {
            storyTerm: 'Unbreakable safety bolt preventing early destruction',
            technicalTerm: 'S3 Object Lock in Compliance Mode protecting versions from lifecycle deletion',
            tone: 'rose',
          },
          {
            storyTerm: 'Emergency containment before midnight sweep',
            technicalTerm: 'Alerting immediately on PutBucketLifecycleConfiguration to remove malicious rules within 24h',
            tone: 'emerald',
          },
        ],
      },
    },
  };
