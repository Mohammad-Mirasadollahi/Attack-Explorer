import type { ComponentType } from 'react';
import type { Anime3DSceneKind } from '@/lib/section-3d-registry';
import type { AnimeMaterialLibrary } from '@/components/three/anime-toon-materials';
import type { BespokeSection3DScene } from './process-hollowing/three/step-scene-builders';

/**
 * Lazy 3D entry points. Overview scenes load the scenario component.
 * Section scenes lazy-load only the matching world builder group so Three.js
 * stays out of the domain barrel and bundle chunks stay small.
 */
export type BespokeSectionSceneFactory = (
  sceneKind: Exclude<Anime3DSceneKind, 'bank-truck-briefing'>,
  materials: AnimeMaterialLibrary,
  isSoftwareGl: boolean
) => BespokeSection3DScene;

export type MalwareWorldGroup =
  | 'process-hollowing'
  | 'inmemory-evasion'
  | 'supplychain-hijack'
  | 'kernel-firmware'
  | 'persistence-services'
  | 'credential-linux'
  | 'dfir-artifacts'
  | 'network-web'
  | 'active-directory'
  | 'cloud-saas'
  | 'ransomware-extortion'
  | 'ai-mlops'
  | 'zero-day-appliances'
  | 'kernel-firmware-byovd'
  | 'supply-chain-cicd'
  | 'containers-kubernetes'
  | 'database-platforms'
  | 'ics-ot-scada'
  | 'mobile-telecom';

const SCENARIO_WORLD_GROUP_MAP: Record<string, MalwareWorldGroup> = {
  // MALWARE (30 scenarios)
  'process-hollowing': 'process-hollowing',
  'amsi-reflective-dll': 'inmemory-evasion',
  'ransomware-shadow-wipe': 'inmemory-evasion',
  'elastic-apt41-dustpan-stealthvector': 'inmemory-evasion',
  'elastic-grimresource-msc': 'inmemory-evasion',
  'elastic-lotus-blossom-chrysalis': 'inmemory-evasion',
  '3cx-desktopapp-supply-chain-lazarus': 'supplychain-hijack',
  'kaspersky-toddycat-eset-dll': 'supplychain-hijack',
  'xz-utils-cve-2024-3094-backdoor': 'supplychain-hijack',
  'macos-gatekeeper-achilles-cve-2022-42821': 'supplychain-hijack',
  'pikered-clr-profiler-trusted-binary-loader-chain': 'supplychain-hijack',
  'kaspersky-lazarus-byovd-fudmodule': 'kernel-firmware',
  'kaspersky-operation-triangulation': 'kernel-firmware',
  'ms-salt-typhoon-telecom': 'kernel-firmware',
  'talos-fortinet-coathanger-apt': 'kernel-firmware',
  'windows-clfs-ransomware-cve-2023-28252-nokoyawa': 'kernel-firmware',
  'ms-forest-blizzard-gooseegg': 'persistence-services',
  'dfir-bitsadmin-qmgr-persistence-bits-client': 'persistence-services',
  'dfir-printspooler-spl-shd-spool-file-persistence': 'persistence-services',
  'dfir-schtasks-xml-registry-taskcache-forensics': 'persistence-services',
  'dfir-wmi-event-subscription-persistence-sysmon': 'persistence-services',
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': 'credential-linux',
  'dfir-wer-silentprocessexit-localdumps-registry-hijack': 'credential-linux',
  'dfir-linux-auditd-pam-sshd-authorized-keys-persistence': 'credential-linux',
  'dfir-linux-systemd-generator-cron-udev-persistence': 'credential-linux',
  'dfir-powershell-eid4104-4103-clm-downgrade-forensics': 'credential-linux',
  'dfir-ntfs-timestomp-mft-si-fn-mismatch-eid2': 'dfir-artifacts',
  'dfir-shimcache-amcache-execution-artifact-triage': 'dfir-artifacts',
  'dfir-vhd-iso-motw-bypass-zone-identifier-forensics': 'dfir-artifacts',
  'dfir-windows-prefetch-srum-network-execution-trace': 'dfir-artifacts',

  // NETWORK_WEB (30 scenarios)
  'log4shell-dfir': 'network-web',
  'dns-tunneling-exfil': 'network-web',
  'apache-activemq-cve-2023-46604-openwire': 'network-web',
  'atlassian-confluence-cve-2023-22515-storm0062': 'network-web',
  'barracuda-esg-cve-2023-2868-unc4841': 'network-web',
  'cisco-ios-xe-cve-2023-20198-badimplant': 'network-web',
  'cl0p-moveit-transfer-cve-2023-34362': 'network-web',
  'f5-bigip-request-smuggling': 'network-web',
  'fortra-goanywhere-mft-cve-2023-0669-cl0p': 'network-web',
  'juniper-junos-jweb-cve-2023-36845-chain': 'network-web',
  'mandiant-apt29-teamcity-jetstream': 'network-web',
  'openssh-regreSSHion-cve-2024-6387': 'network-web',
  'papercut-ng-cve-2023-27350-bl00dy': 'network-web',
  'proxyshell-exchange-cve-2021-34473': 'network-web',
  'sharepoint-cve-2023-29357-24955-chain': 'network-web',
  'splunk-citrix-bleed-session-hijack': 'network-web',
  'splunk-ivanti-connect-secure': 'network-web',
  'splunk-screenconnect-slashandgrab': 'network-web',
  'talos-arcanedoor-asa': 'network-web',
  'unit42-panos-midnight-eclipse': 'network-web',
  'unit42-star-blizzard-evilginx-aitm': 'network-web',
  'vmware-vcenter-cve-2023-34048-unc3886': 'network-web',
  'zyxel-firewall-cve-2023-28771-ike-rce': 'network-web',
  'dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment': 'network-web',
  'dfir-exchange-ews-autodiscover-proxylogon-iis-forensics': 'network-web',
  'dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell': 'network-web',
  'dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace': 'network-web',
  'dfir-postgresql-copy-from-program-pg-log-auditd-trace': 'network-web',
  'dfir-sharepoint-iis-viewstate-losformatter-deserialization': 'network-web',
  'dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing': 'network-web',

  // ACTIVE_DIRECTORY (16 scenarios)
  'ad-kerberoasting': 'active-directory',
  'ms-midnight-blizzard-oauth': 'active-directory',
  'ms-volt-typhoon-lotl': 'active-directory',
  'nopac-samaccountname-cve-2021-42278-42287': 'active-directory',
  'printnightmare-spooler-cve-2021-34527': 'active-directory',
  'unit42-scattered-spider-cloud': 'active-directory',
  'zerologon-netlogon-cve-2020-1472': 'active-directory',
  'dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886': 'active-directory',
  'dfir-dcsync-drsuapi-replication-eid4662': 'active-directory',
  'dfir-dpapi-masterkey-lsass-browser-vault-forensics': 'active-directory',
  'dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly': 'active-directory',
  'dfir-ntds-dit-vssadmin-esentutl-extraction': 'active-directory',
  'dfir-rdp-lateral-movement-tsclient-bitmap-cache': 'active-directory',
  'dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion': 'active-directory',
  'dfir-smb-psexec-named-pipe-eid5145-7045': 'active-directory',
  'dfir-winrm-wsman-remote-powershell-eid91-4624': 'active-directory',

  // CLOUD_SAAS (25 scenarios)
  'aws-cognito-iam-passrole-privesc': 'cloud-saas',
  'aws-imdsv1-ssrf-capitalone-style': 'cloud-saas',
  'azure-ad-connect-pass-the-certificate': 'cloud-saas',
  'gcp-service-account-hmac-key-pivot': 'cloud-saas',
  'k8s-runc-cve-2024-21626-leaky-vessels': 'cloud-saas',
  'microsoft-storm-0558-msa-signing-key': 'cloud-saas',
  'okta-har-file-session-token-hijack': 'cloud-saas',
  'snowflake-unc5537-saas-extortion': 'cloud-saas',
  'sysdig-scarleteel-aws-eks-terraform': 'cloud-saas',
  'cloud-aws-eks-aws-auth-configmap-system-masters-audit': 'cloud-saas',
  'cloud-aws-s3-kms-external-account-encryption-extortion-audit': 'cloud-saas',
  'cloud-aws-sts-federation-token-console-signin-audit': 'cloud-saas',
  'cloud-azure-vm-custom-script-extension-managed-identity-audit': 'cloud-saas',
  'cloud-entra-id-conditional-access-device-code-phishing-audit': 'cloud-saas',
  'cloud-gcp-cloud-build-default-service-account-artifact-audit': 'cloud-saas',
  'cloud-github-actions-pull-request-target-oidc-token-audit': 'cloud-saas',
  'cloud-m365-sharepoint-ediscovery-compliance-search-export-audit': 'cloud-saas',
  'cloud-midnight-blizzard-oauth-legacy-test-app-audit': 'cloud-saas',
  'cloud-salesforce-connected-app-oauth-bulk-api-export-audit': 'cloud-saas',
  'dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda': 'cloud-saas',
  'dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics': 'cloud-saas',
  'dfir-entra-id-prt-roadtools-device-registration-forensics': 'cloud-saas',
  'dfir-gcp-cloud-audit-service-account-key-impersonation': 'cloud-saas',
  'dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape': 'cloud-saas',
  'dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule': 'cloud-saas',

  // RANSOMWARE_EXTORTION (20 scenarios)
  'acidrain-viasat-ka-sat-modem-wiper': 'ransomware-extortion',
  'akira-ransomware-cisco-anyconnect-esxi': 'ransomware-extortion',
  'alphv-blackcat-sphynx-rust-impacket-exmatter': 'ransomware-extortion',
  'bianlian-extortion-go-backdoor-rdp': 'ransomware-extortion',
  'blackbasta-qakbot-backstab-ransomware': 'ransomware-extortion',
  'cactus-ransomware-qlik-sense-ssh-batch-unpacker': 'ransomware-extortion',
  'caddywiper-arguepatch-gpo-destruction': 'ransomware-extortion',
  'cl0p-truebot-flawedgrace-sdbbot-ransomware': 'ransomware-extortion',
  'dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace': 'ransomware-extortion',
  'dfir-evtx-log-clearing-wevtutil-eid1102-104': 'ransomware-extortion',
  'eightbase-phobos-smoke-loader-process-hacker': 'ransomware-extortion',
  'hermeticwiper-ukraine-easeus-mbr-wipe': 'ransomware-extortion',
  'hunters-international-hive-rust-wsus-sharpwmi': 'ransomware-extortion',
  'inc-ransom-lynx-citrix-netscaler-wmic-mega': 'ransomware-extortion',
  'medusa-ransomware-gaze-abyss-pdqdeploy': 'ransomware-extortion',
  'play-ransomware-grixba-vss-copy': 'ransomware-extortion',
  'qilin-agenda-rust-chrome-cred-harvester-esxi': 'ransomware-extortion',
  'ransomhub-edrkiller-tdsskiller-golocks': 'ransomware-extortion',
  'rhysida-ransomware-zerologon-ps-silentskill': 'ransomware-extortion',
  'royal-blacksuit-ransomware-chacha20-restartmanager': 'ransomware-extortion',

  // AI_LLM_MLOPS_SECURITY (6 scenarios)
  'ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928': 'ai-mlops',
  'ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit': 'ai-mlops',
  'ai-pytorch-pickle-torch-load-supply-chain-forensics': 'ai-mlops',
  'ai-rag-indirect-prompt-injection-mcp-tool-audit': 'ai-mlops',
  'ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022': 'ai-mlops',
  'jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr': 'ai-mlops',

  // ZERO_DAY_APPLIANCES (9 scenarios)
  'array-networks-ag-vxag-cve-2023-28461': 'zero-day-appliances',
  'check-point-vpn-cve-2024-24919-info-leak': 'zero-day-appliances',
  'fortimanager-fgd-jump-cve-2024-47575': 'zero-day-appliances',
  'ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit': 'zero-day-appliances',
  'paloalto-expedition-cve-2024-5910-chain': 'zero-day-appliances',
  'sonicwall-sslvpn-cve-2024-40766-akira': 'zero-day-appliances',
  'sophos-firewall-cve-2022-3236-asnarok': 'zero-day-appliances',
  'versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit': 'zero-day-appliances',
  'vulncheck-cwp-preauth-module-dispatch-rce': 'zero-day-appliances',

  // KERNEL_FIRMWARE_BYOVD (11 scenarios)
  'aukill-edr-killer-procxp152-byovd': 'kernel-firmware-byovd',
  'blacklotus-uefi-bootkit-cve-2022-21894': 'kernel-firmware-byovd',
  'crowdstrike-poortry-burntcigar-byovd': 'kernel-firmware-byovd',
  'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics': 'kernel-firmware-byovd',
  'dfir-linux-ld-so-preload-userland-rootkit-proc-maps': 'kernel-firmware-byovd',
  'dfir-volatility3-malfind-vad-hollowing-kernel-callbacks': 'kernel-firmware-byovd',
  'genshin-mhyprot2-ransomware-byovd': 'kernel-firmware-byovd',
  'intezer-blackberry-symbiote-linux-ldpreload': 'kernel-firmware-byovd',
  'kaspersky-cosmicstrand-uefi-spi-rootkit': 'kernel-firmware-byovd',
  'linux-bpfdoor-ebpf-socket-filter-apt': 'kernel-firmware-byovd',
  'sentinelone-terminator-zemana-byovd': 'kernel-firmware-byovd',

  // SUPPLY_CHAIN_CICD (13 scenarios)
  'circleci-oauth-github-token-rotation-breach': 'supply-chain-cicd',
  'codecov-bash-uploader-ci-env-exfil': 'supply-chain-cicd',
  'github-actions-tj-actions-changed-files-cve-2025-30066': 'supply-chain-cicd',
  'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning': 'supply-chain-cicd',
  'kaseya-vsa-revil-cve-2021-30116': 'supply-chain-cicd',
  'ledger-connect-kit-npmjs-drainer': 'supply-chain-cicd',
  'lottie-player-npm-ace-supply-chain-2024': 'supply-chain-cicd',
  'npm-ua-parser-js-coa-rc-supply-chain': 'supply-chain-cicd',
  'polyfill-io-cdn-domain-supply-chain': 'supply-chain-cicd',
  'pypi-pytorch-torchtriton-dependency-confusion-supply-chain': 'supply-chain-cicd',
  'pypi-ultralytics-github-pwnrequest': 'supply-chain-cicd',
  'rspack-solana-web3js-npm-supply-chain-2024': 'supply-chain-cicd',
  'solarwinds-sunburst-orion-supply-chain': 'supply-chain-cicd',

  // CONTAINERS_KUBERNETES (13 scenarios)
  'container-cap-sys-admin-cgroup-release-agent-notify-audit': 'containers-kubernetes',
  'container-cap-sys-module-kernel-ko-insmod-load-audit': 'containers-kubernetes',
  'docker-buildkit-runc-cache-mount-race-cve-2024-23651': 'containers-kubernetes',
  'docker-engine-unauthenticated-tcp-2375-api-socket-audit': 'containers-kubernetes',
  'docker-oci-registry-manifest-layer-poisoning-cosign-audit': 'containers-kubernetes',
  'docker-var-run-docker-sock-mounted-socket-breakout-audit': 'containers-kubernetes',
  'k8s-coredns-dns-poisoning-service-account-token-audit': 'containers-kubernetes',
  'k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit': 'containers-kubernetes',
  'k8s-ephemeral-debug-container-process-namespace-share-audit': 'containers-kubernetes',
  'k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974': 'containers-kubernetes',
  'k8s-kubelet-anonymous-api-etcd-snapshot-forensics': 'containers-kubernetes',
  'k8s-mutating-admission-webhook-sidecar-injection-audit': 'containers-kubernetes',
  'runc-leaky-vessels-cwd-fd-escape-cve-2024-21626': 'containers-kubernetes',

  // DATABASE_DATA_PLATFORMS (5 scenarios)
  'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit': 'database-platforms',
  'db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics': 'database-platforms',
  'db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094': 'database-platforms',
  'db-redis-lua-sandbox-debian-liblua-cve-2022-0543': 'database-platforms',
  'db-snowflake-unc5537-single-factor-auth-data-egress-audit': 'database-platforms',

  // ICS_OT_SCADA (5 scenarios)
  'ics-frostygoop-modbus-tcp-district-heating-controller-audit': 'ics-ot-scada',
  'ics-industroyer2-iec-60870-5-104-substation-telemetry': 'ics-ot-scada',
  'ics-pipedream-incontroller-codesys-modbus-opcua': 'ics-ot-scada',
  'ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit': 'ics-ot-scada',
  'ics-trisis-triton-schneider-triconex-sis-telemetry': 'ics-ot-scada',

  // MOBILE_TELECOM_SPYWARE (5 scenarios)
  'mobile-android-binder-gpu-selinux-audit-forensics': 'mobile-telecom',
  'mobile-operation-triangulation-ios-shutdown-log-mvt-forensics': 'mobile-telecom',
  'mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics': 'mobile-telecom',
  'telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics': 'mobile-telecom',
  'telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit': 'mobile-telecom',
};

export function resolveMalwareWorldGroup(
  scenarioId?: string
): MalwareWorldGroup {
  if (!scenarioId) return 'process-hollowing';
  return SCENARIO_WORLD_GROUP_MAP[scenarioId] ?? 'process-hollowing';
}

export const SCENARIO_OVERVIEW_SCENE_KINDS: Record<string, string> = {
  'process-hollowing': 'bank-truck-briefing',
};

export const SCENARIO_OVERVIEW_3D_LOADERS: Record<
  string,
  () => Promise<ComponentType>
> = {
  'process-hollowing': () =>
    import('./process-hollowing/three/BankScene').then(
      (mod) => mod.ProcessHollowingBankScene
    ),
};

function wrapSceneBuilder(
  builder: (sceneKind: string, materials: AnimeMaterialLibrary) => BespokeSection3DScene | null,
  label: string
): BespokeSectionSceneFactory {
  return (sceneKind, materials) => {
    const built = builder(sceneKind, materials);
    if (!built) throw new Error(`Unknown ${label} 3D sceneKind: ${sceneKind}`);
    return built;
  };
}

export function loadBespokeSectionSceneFactory(
  scenarioId?: string
): Promise<BespokeSectionSceneFactory> {
  const group = resolveMalwareWorldGroup(scenarioId);

  switch (group) {
    case 'inmemory-evasion':
      return import('@/components/three/scenes/malware-inmemory-evasion-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildInMemoryEvasionScene, 'in-memory evasion')
      );
    case 'supplychain-hijack':
      return import('@/components/three/scenes/malware-supplychain-hijack-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildSupplyChainHijackScene, 'supply-chain hijack')
      );
    case 'kernel-firmware':
      return import('@/components/three/scenes/malware-kernel-firmware-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildKernelFirmwareScene, 'kernel/firmware')
      );
    case 'persistence-services':
      return import('@/components/three/scenes/malware-persistence-services-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildPersistenceServicesScene, 'persistence')
      );
    case 'credential-linux':
      return import('@/components/three/scenes/malware-credential-linux-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildCredentialLinuxScene, 'credential/linux')
      );
    case 'dfir-artifacts':
      return import('@/components/three/scenes/malware-dfir-artifacts-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildDfirArtifactsScene, 'DFIR artifacts')
      );
    case 'network-web':
      return import('@/components/three/scenes/network-web-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildNetworkWebScene, 'network/web')
      );
    case 'active-directory':
      return import('@/components/three/scenes/active-directory-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildActiveDirectoryScene, 'active-directory')
      );
    case 'cloud-saas':
      return import('@/components/three/scenes/cloud-saas-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildCloudSaasScene, 'cloud/saas')
      );
    case 'ransomware-extortion':
      return import('@/components/three/scenes/ransomware-extortion-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildRansomwareExtortionScene, 'ransomware/extortion')
      );
    case 'ai-mlops':
      return import('@/components/three/scenes/ai-mlops-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildAiMlopsScene, 'ai/mlops')
      );
    case 'zero-day-appliances':
      return import('@/components/three/scenes/zero-day-appliances-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildZeroDayAppliancesScene, 'zero-day appliances')
      );
    case 'kernel-firmware-byovd':
      return import('@/components/three/scenes/kernel-firmware-byovd-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildKernelFirmwareByovdScene, 'kernel/firmware BYOVD')
      );
    case 'supply-chain-cicd':
      return import('@/components/three/scenes/supply-chain-cicd-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildSupplyChainCicdScene, 'supply-chain CI/CD')
      );
    case 'containers-kubernetes':
      return import('@/components/three/scenes/containers-kubernetes-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildContainersKubernetesScene, 'containers/kubernetes')
      );
    case 'database-platforms':
      return import('@/components/three/scenes/database-platforms-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildDatabasePlatformsScene, 'database platforms')
      );
    case 'ics-ot-scada':
      return import('@/components/three/scenes/ics-ot-scada-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildIcsOtScadaScene, 'ICS/OT/SCADA')
      );
    case 'mobile-telecom':
      return import('@/components/three/scenes/mobile-telecom-worlds').then((mod) =>
        wrapSceneBuilder(mod.buildMobileTelecomScene, 'mobile/telecom')
      );
    case 'process-hollowing':
    default:
      return import('./process-hollowing/three/step-scene-builders').then(
        (mod) => mod.buildBespokeSectionScene as BespokeSectionSceneFactory
      );
  }
}
