import type { Section3DKey } from '@/lib/section-3d-registry';

export type Scenario2DCategoryKey =
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

/**
 * Lightweight zero-dependency manifest of all 158 non-MALWARE scenarios across
 * the remaining 12 categories with MOD-13 Excalidraw whiteboards and MOD-14
 * SVG+GSAP technical clips. Keeps the `/` home route cold-compile lightweight.
 */
export const SCENARIO_2D_SECTION_MANIFEST: Record<
  string,
  { group: Scenario2DCategoryKey; sections: Section3DKey[] }
> = {
  "log4shell-dfir": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","step-4"] },
  "ad-kerberoasting": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dns-tunneling-exfil": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "apache-activemq-cve-2023-46604-openwire": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "atlassian-confluence-cve-2023-22515-storm0062": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "aws-cognito-iam-passrole-privesc": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "aws-imdsv1-ssrf-capitalone-style": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "azure-ad-connect-pass-the-certificate": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "barracuda-esg-cve-2023-2868-unc4841": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "cisco-ios-xe-cve-2023-20198-badimplant": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "cl0p-moveit-transfer-cve-2023-34362": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "f5-bigip-request-smuggling": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "fortra-goanywhere-mft-cve-2023-0669-cl0p": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "gcp-service-account-hmac-key-pivot": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "juniper-junos-jweb-cve-2023-36845-chain": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "k8s-runc-cve-2024-21626-leaky-vessels": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "mandiant-apt29-teamcity-jetstream": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "microsoft-storm-0558-msa-signing-key": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "ms-midnight-blizzard-oauth": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "ms-volt-typhoon-lotl": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "nopac-samaccountname-cve-2021-42278-42287": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "okta-har-file-session-token-hijack": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "openssh-regreSSHion-cve-2024-6387": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "papercut-ng-cve-2023-27350-bl00dy": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "printnightmare-spooler-cve-2021-34527": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "proxyshell-exchange-cve-2021-34473": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "sharepoint-cve-2023-29357-24955-chain": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "snowflake-unc5537-saas-extortion": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "splunk-citrix-bleed-session-hijack": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "splunk-ivanti-connect-secure": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "splunk-screenconnect-slashandgrab": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "sysdig-scarleteel-aws-eks-terraform": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "talos-arcanedoor-asa": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "unit42-panos-midnight-eclipse": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "unit42-scattered-spider-cloud": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "unit42-star-blizzard-evilginx-aitm": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "vmware-vcenter-cve-2023-34048-unc3886": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "zerologon-netlogon-cve-2020-1472": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "zyxel-firewall-cve-2023-28771-ike-rce": { group: "network-web", sections: ["briefing","step-1","step-2","step-3","memory-forensics"] },
  "acidrain-viasat-ka-sat-modem-wiper": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "ai-mlflow-unauthenticated-tracking-server-artifact-lfi-cve-2024-2928": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "ai-ollama-vllm-inference-server-model-poisoning-ssrf-audit": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "ai-pytorch-pickle-torch-load-supply-chain-forensics": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "ai-rag-indirect-prompt-injection-mcp-tool-audit": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "ai-shadowray-ray-jobs-api-gpu-cluster-cve-2023-48022": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "akira-ransomware-cisco-anyconnect-esxi": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "alphv-blackcat-sphynx-rust-impacket-exmatter": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "array-networks-ag-vxag-cve-2023-28461": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "aukill-edr-killer-procxp152-byovd": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "bianlian-extortion-go-backdoor-rdp": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "blackbasta-qakbot-backstab-ransomware": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "blacklotus-uefi-bootkit-cve-2022-21894": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "cactus-ransomware-qlik-sense-ssh-batch-unpacker": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "caddywiper-arguepatch-gpo-destruction": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "check-point-vpn-cve-2024-24919-info-leak": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "circleci-oauth-github-token-rotation-breach": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "cl0p-truebot-flawedgrace-sdbbot-ransomware": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-aws-eks-aws-auth-configmap-system-masters-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-aws-s3-kms-external-account-encryption-extortion-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-aws-sts-federation-token-console-signin-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-azure-vm-custom-script-extension-managed-identity-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-entra-id-conditional-access-device-code-phishing-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-gcp-cloud-build-default-service-account-artifact-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-github-actions-pull-request-target-oidc-token-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-m365-sharepoint-ediscovery-compliance-search-export-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-midnight-blizzard-oauth-legacy-test-app-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "cloud-salesforce-connected-app-oauth-bulk-api-export-audit": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "codecov-bash-uploader-ci-env-exfil": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "container-cap-sys-admin-cgroup-release-agent-notify-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "container-cap-sys-module-kernel-ko-insmod-load-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "crowdstrike-poortry-burntcigar-byovd": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "db-mongodb-mongobleed-unauthenticated-replication-oplog-audit": { group: "database-platforms", sections: ["briefing","step-1","step-2","step-3"] },
  "db-mssql-linked-server-clr-assembly-xp-cmdshell-forensics": { group: "database-platforms", sections: ["briefing","step-1","step-2","step-3"] },
  "db-postgresql-psql-utf8-escaping-copy-program-cve-2025-1094": { group: "database-platforms", sections: ["briefing","step-1","step-2","step-3"] },
  "db-redis-lua-sandbox-debian-liblua-cve-2022-0543": { group: "database-platforms", sections: ["briefing","step-1","step-2","step-3"] },
  "db-snowflake-unc5537-single-factor-auth-data-egress-audit": { group: "database-platforms", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-aws-cloudtrail-iam-shadow-admin-passrole-lambda": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-aws-cloudtrail-imdsv1-ssrf-s3-exfiltration-forensics": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-dcsync-drsuapi-replication-eid4662": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-dpapi-masterkey-lsass-browser-vault-forensics": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-entra-id-prt-roadtools-device-registration-forensics": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-evtx-log-clearing-wevtutil-eid1102-104": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-gcp-cloud-audit-service-account-key-impersonation": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-kubernetes-kube-audit-privileged-pod-hostpath-escape": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-linux-ld-so-preload-userland-rootkit-proc-maps": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-m365-unified-audit-log-mailitemsaccessed-new-inboxrule": { group: "cloud-saas", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-ntds-dit-vssadmin-esentutl-extraction": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-postgresql-copy-from-program-pg-log-auditd-trace": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-rdp-lateral-movement-tsclient-bitmap-cache": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-sharepoint-iis-viewstate-losformatter-deserialization": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-smb-psexec-named-pipe-eid5145-7045": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-winrm-wsman-remote-powershell-eid91-4624": { group: "active-directory", sections: ["briefing","step-1","step-2","step-3"] },
  "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing": { group: "network-web", sections: ["briefing","step-1","step-2","step-3"] },
  "docker-buildkit-runc-cache-mount-race-cve-2024-23651": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "docker-engine-unauthenticated-tcp-2375-api-socket-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "docker-oci-registry-manifest-layer-poisoning-cosign-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "docker-var-run-docker-sock-mounted-socket-breakout-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "eightbase-phobos-smoke-loader-process-hacker": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "fortimanager-fgd-jump-cve-2024-47575": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "genshin-mhyprot2-ransomware-byovd": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "github-actions-tj-actions-changed-files-cve-2025-30066": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "hermeticwiper-ukraine-easeus-mbr-wipe": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "hunters-international-hive-rust-wsus-sharpwmi": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "ics-frostygoop-modbus-tcp-district-heating-controller-audit": { group: "ics-ot-scada", sections: ["briefing","step-1","step-2","step-3"] },
  "ics-industroyer2-iec-60870-5-104-substation-telemetry": { group: "ics-ot-scada", sections: ["briefing","step-1","step-2","step-3"] },
  "ics-pipedream-incontroller-codesys-modbus-opcua": { group: "ics-ot-scada", sections: ["briefing","step-1","step-2","step-3"] },
  "ics-stuxnet-step7-s7comm-plc-ob1-ob35-block-injection-audit": { group: "ics-ot-scada", sections: ["briefing","step-1","step-2","step-3"] },
  "ics-trisis-triton-schneider-triconex-sis-telemetry": { group: "ics-ot-scada", sections: ["briefing","step-1","step-2","step-3"] },
  "inc-ransom-lynx-citrix-netscaler-wmic-mega": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "intezer-blackberry-symbiote-linux-ldpreload": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "jeffreyappel-artex-llm-multi-agent-machine-speed-defender-xdr": { group: "ai-mlops", sections: ["briefing","step-1","step-2","step-3"] },
  "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-coredns-dns-poisoning-service-account-token-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-daemonset-node-selector-cluster-wide-pod-scheduling-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-ephemeral-debug-container-process-namespace-share-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-ingress-nginx-admission-webhook-audit-cve-2025-1974": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-kubelet-anonymous-api-etcd-snapshot-forensics": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "k8s-mutating-admission-webhook-sidecar-injection-audit": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "kaseya-vsa-revil-cve-2021-30116": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "kaspersky-cosmicstrand-uefi-spi-rootkit": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "ledger-connect-kit-npmjs-drainer": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "linux-bpfdoor-ebpf-socket-filter-apt": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "lottie-player-npm-ace-supply-chain-2024": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "medusa-ransomware-gaze-abyss-pdqdeploy": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "mobile-android-binder-gpu-selinux-audit-forensics": { group: "mobile-telecom", sections: ["briefing","step-1","step-2","step-3"] },
  "mobile-operation-triangulation-ios-shutdown-log-mvt-forensics": { group: "mobile-telecom", sections: ["briefing","step-1","step-2","step-3"] },
  "mobile-pegasus-forcedentry-imessage-jbigh2-blastdoor-forensics": { group: "mobile-telecom", sections: ["briefing","step-1","step-2","step-3"] },
  "npm-ua-parser-js-coa-rc-supply-chain": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "paloalto-expedition-cve-2024-5910-chain": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "play-ransomware-grixba-vss-copy": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "polyfill-io-cdn-domain-supply-chain": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "pypi-pytorch-torchtriton-dependency-confusion-supply-chain": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "pypi-ultralytics-github-pwnrequest": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "qilin-agenda-rust-chrome-cred-harvester-esxi": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "ransomhub-edrkiller-tdsskiller-golocks": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "rhysida-ransomware-zerologon-ps-silentskill": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "royal-blacksuit-ransomware-chacha20-restartmanager": { group: "ransomware-extortion", sections: ["briefing","step-1","step-2","step-3"] },
  "rspack-solana-web3js-npm-supply-chain-2024": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "runc-leaky-vessels-cwd-fd-escape-cve-2024-21626": { group: "containers-kubernetes", sections: ["briefing","step-1","step-2","step-3"] },
  "sentinelone-terminator-zemana-byovd": { group: "kernel-firmware-byovd", sections: ["briefing","step-1","step-2","step-3"] },
  "solarwinds-sunburst-orion-supply-chain": { group: "supply-chain-cicd", sections: ["briefing","step-1","step-2","step-3"] },
  "sonicwall-sslvpn-cve-2024-40766-akira": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "sophos-firewall-cve-2022-3236-asnarok": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "telecom-lightbasin-unc1945-gtp-ss7-roaming-forensics": { group: "mobile-telecom", sections: ["briefing","step-1","step-2","step-3"] },
  "telecom-salt-typhoon-diameter-5g-http2-sbi-core-network-audit": { group: "mobile-telecom", sections: ["briefing","step-1","step-2","step-3"] },
  "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3"] },
  "vulncheck-cwp-preauth-module-dispatch-rce": { group: "zero-day-appliances", sections: ["briefing","step-1","step-2","step-3","step-4"] },
};

export const SCENARIO_2D_CLIP_FLAGS: Record<
  string,
  Partial<Record<Section3DKey, true>>
> = Object.fromEntries(
  Object.entries(SCENARIO_2D_SECTION_MANIFEST).map(([scenarioId, entry]) => [
    scenarioId,
    Object.fromEntries(
      entry.sections
        .filter((k) => k !== 'briefing')
        .map((k) => [k, true as const])
    ) as Partial<Record<Section3DKey, true>>,
  ])
);

export function hasScenario2DWhiteboardInManifest(
  scenarioId: string,
  sectionKey: Section3DKey
): boolean {
  const entry = SCENARIO_2D_SECTION_MANIFEST[scenarioId];
  return Boolean(entry && entry.sections.includes(sectionKey));
}

export function getScenario2DCategoryKey(
  scenarioId: string
): Scenario2DCategoryKey | null {
  return SCENARIO_2D_SECTION_MANIFEST[scenarioId]?.group ?? null;
}
