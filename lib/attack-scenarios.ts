export * from './scenarios/types';

import { AttackScenario } from './scenarios/types';
import { PROCESS_HOLLOWING_SCENARIO } from './scenarios/process-hollowing';
import { LOG4SHELL_SCENARIO } from './scenarios/log4shell-dfir';
import { AMSI_REFLECTIVE_DLL_SCENARIO } from './scenarios/amsi-reflective-dll';
import { AD_KERBEROASTING_SCENARIO } from './scenarios/ad-kerberoasting';
import { DNS_TUNNELING_SCENARIO } from './scenarios/dns-tunneling-exfil';
import { RANSOMWARE_SHADOW_WIPE_SCENARIO } from './scenarios/ransomware-shadow-wipe';
import { APT_PALOALTO_ELASTIC_SCENARIOS } from './scenarios/apt-paloalto-elastic';
import { APT_MICROSOFT_THREAT_INTEL_SCENARIOS } from './scenarios/apt-microsoft-threat-intel';
import { APT_CISCO_F5_SPLUNK_SCENARIOS } from './scenarios/apt-cisco-f5-splunk';
import { APT_KASPERSKY_MANDIANT_CISA_SCENARIOS } from './scenarios/apt-kaspersky-mandiant-cisa';

export const ATTACK_SCENARIOS: AttackScenario[] = [
  PROCESS_HOLLOWING_SCENARIO,
  LOG4SHELL_SCENARIO,
  AMSI_REFLECTIVE_DLL_SCENARIO,
  AD_KERBEROASTING_SCENARIO,
  DNS_TUNNELING_SCENARIO,
  RANSOMWARE_SHADOW_WIPE_SCENARIO,
  ...APT_PALOALTO_ELASTIC_SCENARIOS,
  ...APT_MICROSOFT_THREAT_INTEL_SCENARIOS,
  ...APT_CISCO_F5_SPLUNK_SCENARIOS,
  ...APT_KASPERSKY_MANDIANT_CISA_SCENARIOS,
];
