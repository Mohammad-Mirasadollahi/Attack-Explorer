import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a cloud-managed Kubernetes complex whose front reception desk translates AWS corporate badges into inner building keys using one hand-edited paper seating chart taped behind the desk. Using a pre-signed AWS badge to sign in, an intruder edits that single paper seating chart to write their own ordinary cloud role straight into the Supreme Master Guild line, instantly unlocking every secret vault in the entire cluster.',
      storyMappings: [
        {
          storyTerm: 'Pre-signed corporate badge unlocking the cluster reception desk',
          technicalTerm: 'EKS STS presigned GetCallerIdentity bearer token (k8s-aws-v1.<base64>)',
          tone: 'amber',
        },
        {
          storyTerm: 'Hand-edited paper seating chart translating cloud badges to cluster keys',
          technicalTerm: 'kube-system/aws-auth ConfigMap mapUsers and mapRoles YAML entries',
          tone: 'sky',
        },
        {
          storyTerm: 'Writing an ordinary role straight into the Supreme Master Guild line',
          technicalTerm: 'Patching aws-auth to bind an attacker IAM principal to the system:masters group',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking every secret vault until modernized locks replace the paper chart',
          technicalTerm: 'Cluster-admin Secret enumeration remediated by migrating to EKS Access Entries',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Generating a short-lived pre-signed AWS identity voucher wrapped inside a special cluster prefix, the intruder presents it to the Kubernetes front gate to authenticate smoothly with an existing cloud IAM badge.',
        storyMappings: [
          {
            storyTerm: 'Short-lived pre-signed AWS identity voucher',
            technicalTerm: 'aws eks get-token generating k8s-aws-v1.<base64> presigned STS GetCallerIdentity URL',
            tone: 'amber',
          },
          {
            storyTerm: 'Kubernetes front gate validating the voucher',
            technicalTerm: 'EKS aws-iam-authenticator verifying the STS signature and mapping the IAM ARN',
            tone: 'sky',
          },
          {
            storyTerm: 'Existing cloud IAM badge with ConfigMap editing rights',
            technicalTerm: 'Compromised IAM principal authorized to modify kube-system ConfigMaps',
            tone: 'rose',
          },
          {
            storyTerm: 'Dual audit trail bridging AWS and Kubernetes',
            technicalTerm: 'Correlating AWS IAM ARN with Kubernetes kube-apiserver audit user identity',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Opening the delicate translation chart taped inside the system room, the intruder appends a second backdoor cloud user directly underneath the unrestrictable Supreme Master Guild, granting permanent cluster-wide sovereignty that survives even RBAC cleanups.',
        storyMappings: [
          {
            storyTerm: 'Delicate translation chart inside the system room',
            technicalTerm: 'Legacy kube-system/aws-auth ConfigMap controlling IAM-to-RBAC mapping',
            tone: 'amber',
          },
          {
            storyTerm: 'Unrestrictable Supreme Master Guild',
            technicalTerm: 'Hardcoded Kubernetes superuser group system:masters bypassing all RBAC checks',
            tone: 'sky',
          },
          {
            storyTerm: 'Appending a backdoor cloud user to the chart',
            technicalTerm: 'kubectl patch cm aws-auth adding an attacker ARN to mapUsers or mapRoles',
            tone: 'rose',
          },
          {
            storyTerm: 'Audit log capturing the chart mutation',
            technicalTerm: 'EKS Control Plane Audit Log showing patch/update on kube-system/aws-auth',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Now holding Supreme Master Guild status across the entire cluster, the intruder reads every application secret in every namespace until security engineers migrate the cluster off the fragile paper chart onto managed, auditable cloud access entries.',
        storyMappings: [
          {
            storyTerm: 'Reading every application secret in every namespace',
            technicalTerm: 'Cluster-admin kubectl get secrets --all-namespaces credential dump',
            tone: 'amber',
          },
          {
            storyTerm: 'Retiring the fragile paper seating chart',
            technicalTerm: 'Migrating EKS authentication mode from CONFIG_MAP to API (EKS Access Entries)',
            tone: 'sky',
          },
          {
            storyTerm: 'Centralized cloud-logged access grants',
            technicalTerm: 'EKS Access Entries recorded directly in AWS CloudTrail rather than editable ConfigMaps',
            tone: 'rose',
          },
          {
            storyTerm: 'Removing unauthorized superuser entries',
            technicalTerm: 'Scrubbing rogue ARNs from aws-auth and rotating all cluster Secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  };
