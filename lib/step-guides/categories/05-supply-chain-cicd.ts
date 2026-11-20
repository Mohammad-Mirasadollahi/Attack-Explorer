import type { CategoryStandardPatchMap } from './types';

/**
 * Category 5: SUPPLY_CHAIN_CICD (13 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 13 supply-chain and CI/CD scenarios.
 */
export const SUPPLY_CHAIN_CICD_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'solarwinds-sunburst-orion-supply-chain': {
    briefing: {
      storyAnalogy:
        'Imagine a famous armored-truck factory whose blueprints are inspected every evening by careful engineers. Instead of editing the master blueprint on paper where someone would notice, a hidden saboteur watches the factory assembly press and swaps a tiny counterfeit circuit board into the mold for two seconds right as the factory stamps its genuine gold warranty seal onto the finished truck. Eighteen thousand banks buy the sealed truck, where the hidden board sleeps quietly for two weeks before whispering home and unlocking each bank identity vault.',
      storyMappings: [
        {
          storyTerm: 'Hidden saboteur watching the assembly press',
          technicalTerm: 'SUNSPOT build-hijack service (taskhostsvc.exe) polling MsBuild.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Swapping a counterfeit board before the gold warranty seal is stamped',
          technicalTerm: 'Transient InventoryManager.cs swap compiled into signed SolarWinds.Orion.Core.BusinessLayer.dll',
          tone: 'sky',
        },
        {
          storyTerm: 'Sleeping for two weeks before whispering home',
          technicalTerm: 'SUNBURST 12-to-14 day dormancy and *.avsvmcloud.com DGA DNS beacon',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking each bank identity vault',
          technicalTerm: 'Memory-only TEARDROP loader and ADFS Golden SAML token-signing theft',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Rather than editing source code in Git where developers would immediately spot the pull-request diff, APT29 installed a custom C++ service called SUNSPOT on the SolarWinds Orion build server (the automated compilation host that turns source code into shipped releases). SUNSPOT monitored running processes for MsBuild.exe and transiently swapped InventoryManager.cs for milliseconds during compilation so the trojanized SolarWinds.Orion.Core.BusinessLayer.dll received SolarWinds legitimate Authenticode digital signature (the cryptographic seal proving vendor authenticity) before shipping to thousands of enterprise networks.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second. The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page, waits for the factory official gold seal to stamp it, and swaps the clean page straight back onto the blueprint table.',
        storyMappings: [
          {
            storyTerm: 'Saboteur checking the conveyor belt every second',
            technicalTerm: 'SUNSPOT (taskhostsvc.exe) polling for MsBuild.exe every 1,000 milliseconds',
            tone: 'amber',
          },
          {
            storyTerm: 'Poisoned page slipped in and swapped back',
            technicalTerm: 'Temporary replacement and restoration of InventoryManager.cs during compilation',
            tone: 'sky',
          },
          {
            storyTerm: 'Official gold seal stamped on the finished module',
            technicalTerm: 'Valid SolarWinds Authenticode code-signing certificate applied to the trojanized DLL',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean blueprint table left untouched',
            technicalTerm: 'Unmodified Git source repository evading developer code review',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing. After confirming it is not sitting inside a security workshop, it sends coded postal inquiries disguised as routine check-ins to ask its remote handler whether this customer is worth robbing.',
        storyMappings: [
          {
            storyTerm: 'Counterfeit board sitting silent for two weeks',
            technicalTerm: 'SUNBURST 12-to-14 day random dormancy delay inside SolarWinds.BusinessLayerHost.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking it is not inside a security workshop',
            technicalTerm: 'FNV-1a hash blocklist checking for antivirus drivers, debuggers, and analysis domains',
            tone: 'sky',
          },
          {
            storyTerm: 'Coded postal inquiries disguised as routine check-ins',
            technicalTerm: 'Domain Generation Algorithm (DGA) DNS beacons to *.avsvmcloud.com',
            tone: 'rose',
          },
          {
            storyTerm: 'Remote handler signaling whether to rob the bank',
            technicalTerm: 'CNAME DNS response redirecting high-value victims to dedicated C2 infrastructure',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 22 (DNSEvent recording the exact originating process and resolved domain name) showing SolarWinds.BusinessLayerHost.exe querying *.avsvmcloud.com and receiving CNAME redirects to non-SolarWinds IP addresses (exposing active SUNBURST victim triaging).',
      },
      3: {
        storyAnalogy:
          'For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master embossing plate so the spies can stamp flawless executive badges for any cloud office whenever they please.',
        storyMappings: [
          {
            storyTerm: 'Paperless lockpicker unfolded inside memory',
            technicalTerm: 'TEARDROP memory-only dropper delivered over disguised OIP JSON HTTPS traffic',
            tone: 'amber',
          },
          {
            storyTerm: 'Corporate badge-printing vault',
            technicalTerm: 'Active Directory Federation Services (ADFS) server and DKM key container',
            tone: 'sky',
          },
          {
            storyTerm: 'Stealing the master embossing plate',
            technicalTerm: 'Extraction of the ADFS token-signing private key certificate',
            tone: 'rose',
          },
          {
            storyTerm: 'Stamping flawless executive badges for cloud offices',
            technicalTerm: 'Golden SAML forgery granting persistent access to Microsoft 365 and federated SaaS',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate EDR alerts on Image File Execution Options (IFEO) Debugger registry keys targeting dllhost.exe (used to hijack trusted binary execution for persistence) with Windows Security logs tracking unexpected remote WMI or PowerShell access to ADFS configuration databases and DKM containers in Active Directory.',
      },
    },
  },

  'github-actions-tj-actions-changed-files-cve-2025-30066': {
    briefing: {
      storyAnalogy:
        'Imagine a busy neighborhood tool library where thousands of workshops borrow the same popular checklist tool by asking for its floating shelf label rather than its permanent serial number. An intruder steals a librarian key, quietly swaps every shelf label to point at a rigged version of the tool, reads every secret combination straight out of each workshop live workbench memory, and prints the doubled-over cipher of those secrets right onto the workshop public bulletin board.',
      storyMappings: [
        {
          storyTerm: 'Swapping every floating shelf label to a rigged tool',
          technicalTerm: 'Force-repointing mutable Git tags (v1..v45) to malicious commit 0e58ed8',
          tone: 'amber',
        },
        {
          storyTerm: 'Reading secret combinations from live workbench memory',
          technicalTerm: 'sudo python3 memdump.py scraping /proc/$pid/mem of Runner.Worker',
          tone: 'sky',
        },
        {
          storyTerm: 'Doubled-over cipher printed on the public bulletin board',
          technicalTerm: 'Double-Base64 encoded CI secrets printed straight into public GitHub Actions logs',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanent serial number preventing the swap',
          technicalTerm: 'Pinning workflow actions to immutable 40-character Git commit SHAs',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen librarian pass, the intruder walks along the tool-library shelves and moves every floating version tag onto a single freshly tampered edition of the checklist tool, instantly poisoning every workshop that asked for a version name instead of a fixed serial number.',
        storyMappings: [
          {
            storyTerm: 'Stolen librarian pass',
            technicalTerm: 'Compromised maintainer GitHub Personal Access Token (PAT)',
            tone: 'amber',
          },
          {
            storyTerm: 'Moving every floating version tag onto a tampered edition',
            technicalTerm: 'git push origin --tags --force repointing tags to commit 0e58ed8',
            tone: 'sky',
          },
          {
            storyTerm: 'Tampered checklist tool',
            technicalTerm: 'Backdoored tj-actions/changed-files dist/index.js payload (CVE-2025-30066)',
            tone: 'rose',
          },
          {
            storyTerm: 'Fixed serial number defense',
            technicalTerm: 'Full 40-character immutable Git commit SHA pinning in .github/workflows/*.yml',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Review GitHub Audit Log events for retroactive force-updated release tags (flagging mutable tag tampering) and run Software Composition Analysis scanners enforcing full 40-character commit SHA pinning across all .github/workflows/*.yml files.',
      },
      2: {
        storyAnalogy:
          'The next time a downstream workshop runs its automated build, the rigged tool uses the workshop own unlocked master key to peer directly into the live memory notebook of the foreman process, lifting every active vault key, shipping pass, and signing code stored in working memory.',
        storyMappings: [
          {
            storyTerm: 'Workshop unlocked master key',
            technicalTerm: 'Passwordless sudo privileges granted to GitHub-hosted Ubuntu runners',
            tone: 'amber',
          },
          {
            storyTerm: 'Peering into the live memory notebook of the foreman',
            technicalTerm: 'sudo python3 memdump.py reading /proc/[pid]/mem of Runner.Worker',
            tone: 'sky',
          },
          {
            storyTerm: 'Lifted vault keys and shipping passes',
            technicalTerm: 'Plaintext CI/CD secrets (AWS keys, NPM tokens, GITHUB_TOKEN, PATs) in RAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Rigged checklist tool running on the workbench',
            technicalTerm: 'Malicious dist/index.js executing automatically during CI workflow runs',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy Linux eBPF or Harden-Runner egress and process monitors (runtime kernel agents that observe privileged memory reads inside CI runners) alerting on /usr/bin/python3 running as root (UID 0) opening /proc/[pid]/mem of Runner.Worker.',
      },
      3: {
        storyAnalogy:
          'Instead of sending a noisy delivery truck outside the gates where highway guards would stop it, the rigged tool folds every stolen secret twice in a simple disguise and prints the bundle right onto the workshop public build-log chalkboard so the intruder can quietly read them from across the street.',
        storyMappings: [
          {
            storyTerm: 'Avoiding noisy delivery trucks past highway guards',
            technicalTerm: 'Zero outbound C2 network calls bypassing CI runner egress firewalls',
            tone: 'amber',
          },
          {
            storyTerm: 'Folding every stolen secret twice in a simple disguise',
            technicalTerm: 'Double-Base64 encoding bypassing GitHub Actions single-pass secret masking',
            tone: 'sky',
          },
          {
            storyTerm: 'Public build-log chalkboard',
            technicalTerm: 'Publicly viewable GitHub Actions workflow execution logs',
            tone: 'rose',
          },
          {
            storyTerm: 'Reading secrets quietly from across the street',
            technicalTerm: 'Offline scraping of public repository build logs to harvest leaked tokens',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Scan historical GitHub Actions workflow logs for unusually long double-Base64 strings printed during the tj-actions/changed-files step (which bypass GitHub built-in secret redaction) and immediately revoke and rotate every secret exposed in affected repositories.',
      },
    },
  },

  'codecov-bash-uploader-ci-env-exfil': {
    briefing: {
      storyAnalogy:
        'Imagine a popular quality-inspection service whose customers automatically download and run a fresh inspection script straight off the provider public delivery counter every time they build a product, without ever checking the script wax seal. An intruder steals a spare warehouse key left inside an old shipping box, adds one hidden line to the inspection script on the counter, and silently receives a full photocopy of every customer factory key ring before walking straight into their private blueprint rooms.',
      storyMappings: [
        {
          storyTerm: 'Spare warehouse key left inside an old shipping box',
          technicalTerm: 'Residual Google Cloud Storage (GCS) service account credential in a Docker image layer',
          tone: 'amber',
        },
        {
          storyTerm: 'Adding one hidden line to the script on the public counter',
          technicalTerm: 'Tampering with the hosted codecov.sh Bash Uploader script in GCS',
          tone: 'sky',
        },
        {
          storyTerm: 'Running the script blind and mailing back the factory key ring',
          technicalTerm: 'Unverified curl | bash execution exfiltrating $(env) CI variables to attacker IPs',
          tone: 'rose',
        },
        {
          storyTerm: 'Walking straight into customer private blueprint rooms',
          technicalTerm: 'Cloning private Git repositories and abusing stolen cloud and signing tokens',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Digging through a discarded container crate used to build the inspection tool, the intruder finds a forgotten storage-room key, unlocks the public delivery shelf, and adds a single silent forwarding line to the official inspection script waiting for thousands of daily customers.',
        storyMappings: [
          {
            storyTerm: 'Discarded container crate',
            technicalTerm: 'Codecov Docker image build layer exposing a residual credential',
            tone: 'amber',
          },
          {
            storyTerm: 'Forgotten storage-room key',
            technicalTerm: 'Leaked Google Cloud Storage (GCS) service account key',
            tone: 'sky',
          },
          {
            storyTerm: 'Public delivery shelf',
            technicalTerm: 'Hosted https://codecov.io/bash script object in cloud storage',
            tone: 'rose',
          },
          {
            storyTerm: 'Single silent forwarding line',
            technicalTerm: 'Injected curl POST one-liner capturing all CI runner environment variables',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable cloud storage object integrity monitoring and enforce automated CI checksum checks comparing downloaded script SHA-256 hashes against cryptographically signed vendor release manifests (stopping tampered remote scripts before execution).',
      },
      2: {
        storyAnalogy:
          'Every time a customer assembly line pulls the unsealed inspection script directly from the web counter and runs it blindly, the hidden line scoops up every password, key card, and token sitting on the assembly bench and mails them straight to an unmarked post-office box.',
        storyMappings: [
          {
            storyTerm: 'Pulling and running the unsealed script blindly',
            technicalTerm: 'Unverified bash <(curl -s https://codecov.io/bash) CI pipeline invocation',
            tone: 'amber',
          },
          {
            storyTerm: 'Key cards and tokens sitting on the assembly bench',
            technicalTerm: 'CI runner environment variables exposed via $(env) command substitution',
            tone: 'sky',
          },
          {
            storyTerm: 'Unmarked post-office box',
            technicalTerm: 'Attacker-controlled collection servers (178.62.86.114 and 104.248.94.23)',
            tone: 'rose',
          },
          {
            storyTerm: 'Silent mailing line',
            technicalTerm: 'Background curl HTTP POST exfiltration blended into normal CI coverage uploads',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit CI runner network egress logs for outbound HTTP POST requests to 178.62.86.114 or 104.248.94.23 alongside process telemetry capturing curl invoked with $(env) command substitution (confirming live environment variable exfiltration).',
      },
      3: {
        storyAnalogy:
          'Sorting through thousands of stolen customer key rings, the intruder uses automated bot keys to enter downstream companies private blueprint vaults from outside the factory, copying proprietary source designs and harvesting additional signing keys.',
        storyMappings: [
          {
            storyTerm: 'Stolen customer key rings',
            technicalTerm: 'Exfiltrated GITHUB_TOKEN, Personal Access Tokens, and cloud service keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Private blueprint vaults',
            technicalTerm: 'Downstream victim private Git repositories and source archives',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering from outside the factory with bot keys',
            technicalTerm: 'Unauthorized git.clone operations originating from non-CI external IP addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Additional signing keys harvested inside',
            technicalTerm: 'Secondary supply-chain credentials enabling follow-on enterprise compromises',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect GitHub Audit Log git.clone and API token usage events originating from IP ranges outside authorized CI/CD runner pools using machine or bot account tokens (revealing post-exfiltration repository theft).',
      },
    },
  },

  'kaseya-vsa-revil-cve-2021-30116': {
    briefing: {
      storyAnalogy:
        'Imagine a master building-management dispatch console that manages heating and maintenance crews for hundreds of client office towers at once. Attackers break past the dispatch console front lock, broadcast a fake urgent maintenance order to every connected client tower telling local staff to unplug the fire alarms and unpack a disguised toolbox, and then slip a poisoned spare part into an authentic security-guard tool so every client tower locks its own doors for ransom simultaneously.',
      storyMappings: [
        {
          storyTerm: 'Master building-management dispatch console',
          technicalTerm: 'Internet-exposed Kaseya VSA Managed Service Provider (MSP) server',
          tone: 'amber',
        },
        {
          storyTerm: 'Breaking past the dispatch front lock',
          technicalTerm: 'CVE-2021-30116 authentication bypass on /dl.asp uploading agent.crt',
          tone: 'sky',
        },
        {
          storyTerm: 'Fake urgent maintenance order unplugging fire alarms',
          technicalTerm: 'Pushed "Kaseya VSA Agent Hot-fix" disabling Windows Defender and decoding agent.exe',
          tone: 'rose',
        },
        {
          storyTerm: 'Slipping a poisoned part into an authentic guard tool',
          technicalTerm: 'Older signed MsMpEng.exe DLL side-loading REvil ransomware (mpsvc.dll)',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Approaching the central dispatch console before a holiday weekend, the intruder slips past the front badge reader using an unpatched backdoor window and uploads a disguised maintenance parcel labeled as an official security certificate.',
        storyMappings: [
          {
            storyTerm: 'Unpatched backdoor window on the dispatch console',
            technicalTerm: 'Unauthenticated HTTP POST to /dl.asp exploiting CVE-2021-30116',
            tone: 'amber',
          },
          {
            storyTerm: 'Disguised parcel labeled as an official certificate',
            technicalTerm: 'Base64-encoded payload staged as c:\\kworking\\agent.crt',
            tone: 'sky',
          },
          {
            storyTerm: 'Central dispatch console',
            technicalTerm: 'Compromised Kaseya VSA management server controlling downstream MSP agents',
            tone: 'rose',
          },
          {
            storyTerm: 'Holiday weekend timing',
            technicalTerm: 'Coordinated Friday afternoon launch minimizing immediate SOC response',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Using the trusted dispatch megaphone, the intruder broadcasts a bogus emergency patch order to every managed office tower at once. Obeying their trusted supervisor automatically, local building agents switch off every smoke detector and unpack the disguised certificate parcel into a live toolkit.',
        storyMappings: [
          {
            storyTerm: 'Trusted dispatch megaphone broadcasting an emergency order',
            technicalTerm: 'Kaseya VSA Agent Procedure pushed as "Kaseya VSA Agent Hot-fix"',
            tone: 'amber',
          },
          {
            storyTerm: 'Local building agents obeying automatically',
            technicalTerm: 'Trusted AgentMon.exe executing PowerShell commands as NT AUTHORITY\\SYSTEM',
            tone: 'sky',
          },
          {
            storyTerm: 'Switching off every smoke detector',
            technicalTerm: 'PowerShell Set-MpPreference disabling Windows Defender real-time monitoring',
            tone: 'rose',
          },
          {
            storyTerm: 'Unpacking the certificate parcel into a live toolkit',
            technicalTerm: 'certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation capturing parent-child lineage and command-line arguments) showing AgentMon.exe spawning cmd.exe or powershell.exe invoking Set-MpPreference alongside certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe (catching the exact MSP mass-deployment stage).',
      },
      3: {
        storyAnalogy:
          'The unpacked toolkit places two paired items side by side on the main hall table: first, an older genuinely stamped security-guard badge machine so hallway monitors trust the launch, and second, a counterfeit internal gear bearing the exact spare-part name that the guard machine automatically loads, triggering simultaneous ransomware lockouts across every managed customer.',
        storyMappings: [
          {
            storyTerm: 'Older genuinely stamped security-guard badge machine',
            technicalTerm: 'Legitimate older Microsoft-signed Windows Defender binary (MsMpEng.exe) dropped to C:\\Windows\\',
            tone: 'amber',
          },
          {
            storyTerm: 'Counterfeit internal gear bearing the expected spare-part name',
            technicalTerm: 'Malicious REvil ransomware payload named mpsvc.dll placed beside MsMpEng.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Guard machine automatically loading the adjacent gear',
            technicalTerm: 'DLL search-order side-loading executing mpsvc.dll inside a signed Microsoft process',
            tone: 'rose',
          },
          {
            storyTerm: 'Simultaneous lockouts across every customer tower',
            technicalTerm: 'Mass REvil file encryption across MSP-managed downstream enterprises',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'pypi-ultralytics-github-pwnrequest': {
    briefing: {
      storyAnalogy:
        'Imagine a busy community recipe factory whose automated tasting robot reads external visitor suggestion cards while standing inside the locked head-chef kitchen. An intruder writes hidden kitchen commands straight onto the corner of a suggestion card label, steals the factory official distribution stamp, slips a hidden coin-minting gadget into the factory flagship recipe kit, and silently hijacks thousands of research kitchens worldwide.',
      storyMappings: [
        {
          storyTerm: 'Tasting robot reading visitor cards inside the locked head-chef kitchen',
          technicalTerm: 'GitHub Actions pull_request_target workflow interpolating untrusted fork branch names',
          tone: 'amber',
        },
        {
          storyTerm: 'Stealing the factory official distribution stamp',
          technicalTerm: 'Harvested PYPI_TOKEN used to publish poisoned ultralytics v8.3.41 to v8.3.46',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden coin-minting gadget inside the recipe kit',
          technicalTerm: 'Backdoored ultralytics/utils/downloads.py fetching XMRig cryptocurrency miner',
          tone: 'rose',
        },
        {
          storyTerm: 'Hijacked research kitchens worldwide',
          technicalTerm: 'Downstream ML workstations and Colab notebooks executing /tmp/ultralytics_runner',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks. Because the automated tasting robot pastes that external label straight into a privileged kitchen command without stripping punctuation, the robot obeys the outsider from inside the secure vault.',
        storyMappings: [
          {
            storyTerm: 'Public suggestion card from outside the gate',
            technicalTerm: 'External fork pull request triggering a pull_request_target GitHub Actions workflow',
            tone: 'amber',
          },
          {
            storyTerm: 'Title label hiding extra shell punctuation marks',
            technicalTerm: 'Crafted Git branch name containing command separators injecting shell execution',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated tasting robot inside the secure vault',
            technicalTerm: 'Privileged CI workflow runner holding repository write tokens and release secrets',
            tone: 'rose',
          },
          {
            storyTerm: 'Obeying the outsider during routine intake',
            technicalTerm: 'PwnRequest remote command execution inside the Ultralytics CI pipeline',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly onto the public pantry shelves, bypassing the clean recipe ledger.',
        storyMappings: [
          {
            storyTerm: 'Factory shipping-house distribution stamp',
            technicalTerm: 'Compromised PYPI_TOKEN publishing credentials',
            tone: 'amber',
          },
          {
            storyTerm: 'Silent remote-fetching routine inside the download helper',
            technicalTerm: 'Malicious code injected into ultralytics/utils/downloads.py safe_download()',
            tone: 'sky',
          },
          {
            storyTerm: 'Poisoned fresh editions on public pantry shelves',
            technicalTerm: 'Compromised PyPI releases ultralytics v8.3.41 through v8.3.46',
            tone: 'rose',
          },
          {
            storyTerm: 'Clean recipe ledger left behind',
            technicalTerm: 'Mismatch between signed Git source tags and published PyPI wheel archives',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce PyPI provenance attestation verification (PEP 740 cryptographic proof linking a package strictly to its trusted CI build) and diff published wheel contents against signed Git repository tags using tools like git-pypi-diff (catching unauthorized release tampering).',
      },
      3: {
        storyAnalogy:
          'Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet door tag so simple checks miss it, and puts the lab powerful graphics ovens to work for the intruder.',
        storyMappings: [
          {
            storyTerm: 'Unpacking the fresh kit in a research lab',
            technicalTerm: 'Installing poisoned ultralytics on ML workstations or Google Colab notebooks',
            tone: 'amber',
          },
          {
            storyTerm: 'Coin-mining engine hidden in a temporary closet',
            technicalTerm: 'Downloaded XMRig miner executing as /tmp/ultralytics_runner',
            tone: 'sky',
          },
          {
            storyTerm: 'Burning the closet door tag',
            technicalTerm: 'Self-unlinked Linux binary running from /tmp/* (deleted)',
            tone: 'rose',
          },
          {
            storyTerm: 'Phoning the intruder mining depot',
            technicalTerm: 'Outbound mining pool connection to connect.consrensys.com:8080',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure Linux EDR alerts for processes executing out of /tmp/* (deleted) (identifying unlinked temporary payloads hiding in RAM) correlated with outbound network connections to connect.consrensys.com:8080 (the attacker XMRig command-and-control endpoint).',
      },
    },
  },

  'npm-ua-parser-js-coa-rc-supply-chain': {
    briefing: {
      storyAnalogy:
        'Imagine a hardware wholesaler whose tiny brass screws are packed automatically inside millions of furniture kits across the world. Attackers steal the wholesaler warehouse login because no second-factor pocket code was required, slip an automatic spring-loaded trap inside the screw box lid so every carpenter who opens the box unknowingly fetches a lockpicking kit, and silently launches a credential thief using a trusted built-in workshop tool.',
      storyMappings: [
        {
          storyTerm: 'Tiny brass screws packed inside millions of kits',
          technicalTerm: 'Foundational transitive NPM packages ua-parser-js, coa, and rc',
          tone: 'amber',
        },
        {
          storyTerm: 'Warehouse login lacking a pocket code',
          technicalTerm: 'Compromised NPM maintainer accounts without 2FA enforcement',
          tone: 'sky',
        },
        {
          storyTerm: 'Spring-loaded trap inside the box lid',
          technicalTerm: 'Malicious package.json preinstall hook running preinstall.js and compile.bat',
          tone: 'rose',
        },
        {
          storyTerm: 'Launching a credential thief with a trusted workshop tool',
          technicalTerm: 'regsvr32.exe -s create.dll executing the DanaBot password stealer silently',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In late 2021, threat actors compromised the NPM publishing accounts of the maintainers of ua-parser-js, coa, and rc (foundational transitive JavaScript dependencies pulled automatically by React, Webpack, and millions of Node.js builds). They published poisoned patch versions containing a package.json preinstall lifecycle hook (a script that NPM executes automatically before package installation completes) that ran preinstall.js and compile.bat to download sdd.dll (saved as create.dll) and silently execute the DanaBot banking and password stealer via regsvr32.exe -s.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Breaking into a busy component-maker shipping account that lacked a second pocket-code lock, the intruder releases a tiny routine-looking version bump containing a spring-loaded lid script designed to snap open the instant any workshop unpacks the crate.',
        storyMappings: [
          {
            storyTerm: 'Component-maker account lacking a pocket-code lock',
            technicalTerm: 'Maintainer NPM account without two-factor authentication (2FA) for publishing',
            tone: 'amber',
          },
          {
            storyTerm: 'Routine-looking version bump',
            technicalTerm: 'Malicious patch versions published for ua-parser-js, coa, and rc',
            tone: 'sky',
          },
          {
            storyTerm: 'Spring-loaded lid script',
            technicalTerm: 'package.json preinstall lifecycle hook executing automatically on install',
            tone: 'rose',
          },
          {
            storyTerm: 'Workshops pulling the crate transitively',
            technicalTerm: 'Millions of downstream Node.js builds auto-resolving caret dependency ranges',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment a developer runs a routine morning toolbox refresh, the spring-loaded lid checks whether the workshop runs Windows or Linux, triggers a hidden helper script, and reaches outside the building to download a concealed espionage module straight into the local parts bin.',
        storyMappings: [
          {
            storyTerm: 'Routine morning toolbox refresh',
            technicalTerm: 'Developer or CI runner executing npm install',
            tone: 'amber',
          },
          {
            storyTerm: 'Checking whether the workshop runs Windows or Linux',
            technicalTerm: 'preinstall.js inspecting process.platform to branch payloads by OS',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden helper script fetching the module',
            technicalTerm: 'node.exe spawning cmd.exe /c compile.bat invoking curl.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Concealed espionage module in the local parts bin',
            technicalTerm: 'Downloaded sdd.dll (create.dll) staged inside node_modules',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation recording full parent-child lineage) showing node.exe spawning cmd.exe /c compile.bat followed by curl.exe downloading .dll or .exe binaries into node_modules (a high-fidelity signature of malicious NPM lifecycle script abuse).',
      },
      3: {
        storyAnalogy:
          'Rather than running an unfamiliar executable that guards would immediately question, the helper script hands the stolen espionage module to the workshop own official parts-registration machine set on mute, silently awakening a password thief that sweeps browser vaults and developer keys.',
        storyMappings: [
          {
            storyTerm: 'Official parts-registration machine set on mute',
            technicalTerm: 'Signed Microsoft COM utility regsvr32.exe invoked with the -s silent flag',
            tone: 'amber',
          },
          {
            storyTerm: 'Awakening the password thief inside the machine',
            technicalTerm: 'regsvr32.exe -s create.dll invoking DllRegisterServer for DanaBot',
            tone: 'sky',
          },
          {
            storyTerm: 'Sweeping browser vaults and developer keys',
            technicalTerm: 'DanaBot credential harvesting across browser profiles, SSH keys, and tokens',
            tone: 'rose',
          },
          {
            storyTerm: 'Blending past front-gate guard checks',
            technicalTerm: 'Living-off-the-land signed binary proxy execution (MITRE T1218.010)',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'polyfill-io-cdn-domain-supply-chain': {
    briefing: {
      storyAnalogy:
        'Imagine over a hundred thousand storefronts that all hang a shared decorative banner delivered daily from one outside sign-maker, without ever checking a tamper-proof weight seal on the banner. After a shady new owner buys the sign-maker warehouse, they quietly check who is walking into each store, slip a hidden pickpocket script only onto mobile shoppers visiting select stores, and hijack shoppers right inside the storefront trusted showroom.',
      storyMappings: [
        {
          storyTerm: 'Shared banner hung without a tamper-proof weight seal',
          technicalTerm: 'External <script src="https://cdn.polyfill.io/..."> lacking Subresource Integrity (SRI)',
          tone: 'amber',
        },
        {
          storyTerm: 'Shady new owner checking who walks into each store',
          technicalTerm: 'Compromised cdn.polyfill.io fingerprinting HTTP User-Agent, Referer, and geolocation',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden pickpocket script served conditionally',
          technicalTerm: 'Time-delayed dynamic JavaScript payload redirecting mobile visitors (CVE-2024-38526)',
          tone: 'rose',
        },
        {
          storyTerm: 'Operating inside the storefront trusted showroom',
          technicalTerm: 'Full first-party Same-Origin Policy (DOM and cookie) execution context',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'More than a hundred thousand online shops paste an outside helper banner straight onto their front counter without attaching a cryptographic wax seal, blindly trusting that whatever the remote sign warehouse sends tomorrow will be identical to what it sent years ago.',
        storyMappings: [
          {
            storyTerm: 'Outside helper banner on the front counter',
            technicalTerm: '<script src="https://cdn.polyfill.io/v2/polyfill.min.js"> embedded in web pages',
            tone: 'amber',
          },
          {
            storyTerm: 'Missing cryptographic wax seal',
            technicalTerm: 'Absence of integrity="sha384-..." Subresource Integrity (SRI) verification',
            tone: 'sky',
          },
          {
            storyTerm: 'Shady new owner buying the sign warehouse',
            technicalTerm: 'Acquisition and weaponization of the polyfill.io domain and CDN infrastructure',
            tone: 'rose',
          },
          {
            storyTerm: 'Instant exposure across a hundred thousand shops',
            technicalTerm: 'Supply-chain fan-out affecting every site referencing the unpinned CDN domain',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When a browser asks the hijacked warehouse for the helper script, the clerk behind the counter peeks at the visitor hat, shoes, and home town: security inspectors on desktop browsers receive a spotless normal script, while real mobile shoppers silently receive a delayed hijacking payload.',
        storyMappings: [
          {
            storyTerm: 'Peeking at the visitor hat, shoes, and home town',
            technicalTerm: 'Server-side inspection of HTTP User-Agent, Referer, and GeoIP headers',
            tone: 'amber',
          },
          {
            storyTerm: 'Spotless script handed to desktop security inspectors',
            technicalTerm: 'Conditional evasion serving benign polyfills to automated scanners and researchers',
            tone: 'sky',
          },
          {
            storyTerm: 'Delayed hijacking payload handed to mobile shoppers',
            technicalTerm: 'Obfuscated redirector script firing after a delay on targeted mobile sessions',
            tone: 'rose',
          },
          {
            storyTerm: 'Hijacked sign warehouse',
            technicalTerm: 'Attacker-operated cdn.polyfill.io edge server generating tailored responses',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Run multi-User-Agent synthetic browser monitoring comparing script payloads delivered to mobile versus desktop headers over execution windows longer than 20 seconds (exposing conditional, time-delayed CDN supply-chain payloads that evade single-pass scanners).',
      },
      3: {
        storyAnalogy:
          'Because the storefront invited the outside script directly onto its own showroom floor, the browser treats the pickpocket as an official store employee, letting it inspect every customer tray, load lookalike tracker scripts, and march shoppers straight out the door to scam sites.',
        storyMappings: [
          {
            storyTerm: 'Invited directly onto the showroom floor',
            technicalTerm: 'Third-party script executing with full first-party Same-Origin Policy (SOP) rights',
            tone: 'amber',
          },
          {
            storyTerm: 'Lookalike tracker script pulled in mid-visit',
            technicalTerm: 'Unauthorized secondary script loaded from lookalike domain www.googie-anaiytics.com',
            tone: 'sky',
          },
          {
            storyTerm: 'Inspecting customer trays and hijacking visits',
            technicalTerm: 'Full DOM access, session interception, and silent browser redirection',
            tone: 'rose',
          },
          {
            storyTerm: 'Showroom guest-list rulebook',
            technicalTerm: 'Strict Content-Security-Policy (CSP) script-src allowlist blocking rogue domains',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Content-Security-Policy (CSP) violation reports (browser-emitted telemetry alerting whenever a page tries to load scripts from unapproved hosts) for unauthorized loads from www.googie-anaiytics.com and audit all templates to eliminate polyfill.io references.',
      },
    },
  },

  'ledger-connect-kit-npmjs-drainer': {
    briefing: {
      storyAnalogy:
        'Imagine a trusted hardware vault manufacturer that forgets to cancel a former employee warehouse keycard after they leave the company. A thief tricks the former employee out of that still-active keycard, pushes a poisoned connector module onto the public parts rack, and because hundreds of decentralized banks auto-load the latest version straight from a shared courier truck without pinning a version seal, every customer opening their vault is shown a counterfeit signing screen that empties their holdings.',
      storyMappings: [
        {
          storyTerm: 'Former employee keycard never canceled after offboarding',
          technicalTerm: 'Phished npmjs account retaining publish rights to @ledgerhq/connect-kit',
          tone: 'amber',
        },
        {
          storyTerm: 'Shared courier truck delivering unpinned updates to hundreds of banks',
          technicalTerm: '@ledgerhq/connect-kit-loader fetching unpinned jsDelivr @ledgerhq/connect-kit@1',
          tone: 'sky',
        },
        {
          storyTerm: 'Counterfeit vault signing screen',
          technicalTerm: 'Angel Drainer rogue WalletConnect modal using an attacker Project ID',
          tone: 'rose',
        },
        {
          storyTerm: 'Tricking customers into signing away their holdings',
          technicalTerm: 'Malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll drain transactions',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In December 2023, a threat actor phished a former Ledger employee whose npmjs publishing account still retained write access to @ledgerhq/connect-kit (the official JavaScript connector library bridging decentralized web apps to hardware wallets). The attacker published versions 1.1.5, 1.1.6, and 1.1.7 containing the Angel Drainer wallet-draining script and a rogue WalletConnect project ID; because @ledgerhq/connect-kit-loader dynamically loaded https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1 without exact version pinning (floating on the major @1 tag so every new minor release propagated instantly), hundreds of DeFi applications immediately served the drainer to live users.',
    },
    steps: {
      1: {
        storyAnalogy:
          'By sending a convincing phishing lure to a former worker whose warehouse publishing badge was never revoked during offboarding, the thief walks into the parts registry and stamps three poisoned release editions right onto the official brand shelf.',
        storyMappings: [
          {
            storyTerm: 'Former worker badge never revoked at offboarding',
            technicalTerm: 'Active npmjs maintainer rights left on a former Ledger employee account',
            tone: 'amber',
          },
          {
            storyTerm: 'Convincing phishing lure',
            technicalTerm: 'Spear-phishing campaign harvesting the former employee NPM credentials',
            tone: 'sky',
          },
          {
            storyTerm: 'Three poisoned release editions on the official shelf',
            technicalTerm: 'Published @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden payload packed inside the connector',
            technicalTerm: 'Angel Drainer JavaScript bundle embedded in the official package release',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Even partner shops that carefully bolted down their own local parts list still relied on a tiny starter loader that automatically fetches whatever newest edition sits on the public delivery truck, spreading the poisoned module across hundreds of live finance storefronts in minutes.',
        storyMappings: [
          {
            storyTerm: 'Partner shops that bolted down their local parts list',
            technicalTerm: 'DeFi frontends with locked local package-lock.json files',
            tone: 'amber',
          },
          {
            storyTerm: 'Tiny starter loader fetching the newest edition automatically',
            technicalTerm: '@ledgerhq/connect-kit-loader pulling unpinned jsDelivr @1 CDN bundle',
            tone: 'sky',
          },
          {
            storyTerm: 'Public delivery truck',
            technicalTerm: 'cdn.jsdelivr.net serving newly published npm versions within minutes',
            tone: 'rose',
          },
          {
            storyTerm: 'Hundreds of live finance storefronts poisoned at once',
            technicalTerm: 'Simultaneous downstream impact across SushiSwap, Revoke.cash, and Web3 dApps',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy frontend runtime integrity monitors such as Blockaid (continuous browser-side sensors that hash live third-party scripts and flag DOM mutations) to alert immediately on unexpected script changes or newly injected WalletConnect Project IDs inside live dApp frontends.',
      },
      3: {
        storyAnalogy:
          'When a customer clicks connect on a trusted finance page, the hijacked connector slides a pixel-perfect counterfeit signature pad in front of them. Instead of approving a routine check-in, the customer unknowingly signs a blank power-of-attorney slip handing every asset in their vault straight to the thief.',
        storyMappings: [
          {
            storyTerm: 'Pixel-perfect counterfeit signature pad',
            technicalTerm: 'Rogue WalletConnect modal rendered using an attacker WalletConnect Project ID',
            tone: 'amber',
          },
          {
            storyTerm: 'Blank power-of-attorney slip',
            technicalTerm: 'Malicious Permit2 eth_signTypedData_v4 and setApprovalForAll signatures',
            tone: 'sky',
          },
          {
            storyTerm: 'Emptying every asset in the customer vault',
            technicalTerm: 'Automated Angel Drainer transfer of ERC-20 tokens and NFTs to drainer addresses',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-signing vault safety preview',
            technicalTerm: 'Wallet transaction simulation flagging drainer spender contracts before signing',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable wallet-level transaction simulation tools such as Blockaid (which dry-run cryptographic signing prompts before user confirmation) to flag malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll approvals targeting known drainer spender contracts.',
      },
    },
  },

  'rspack-solana-web3js-npm-supply-chain-2024': {
    briefing: {
      storyAnalogy:
        'Imagine a locksmith guild whose widely trusted key-handling library is pulled automatically into thousands of automated currency vaults. An impostor tricks a guild maintainer on a lookalike courier website to steal their publishing seal, slips a silent key-copying scribe inside the vault key-loading latch, and mails every copied private vault key out of the building disguised as ordinary delivery-address stamps on routine postal envelopes.',
      storyMappings: [
        {
          storyTerm: 'Lookalike courier website stealing a publishing seal',
          technicalTerm: 'Spear-phishing NPM maintainer to hijack @solana/web3.js and @rspack/core publish tokens',
          tone: 'amber',
        },
        {
          storyTerm: 'Silent key-copying scribe inside the key-loading latch',
          technicalTerm: 'Injected addToQueue() hook inside Keypair.fromSecretKey and Keypair.fromSeed',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised delivery-address stamps on routine envelopes',
          technicalTerm: '64-byte private keys smuggled inside fake CF-Connecting-IP and CF-Ray HTTP headers',
          tone: 'rose',
        },
        {
          storyTerm: 'Secret external mailbox receiving the stolen keys',
          technicalTerm: 'Attacker collection endpoint at sol-rpc.xyz harvesting wallet and CI secrets',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight into the public parts registry.',
        storyMappings: [
          {
            storyTerm: 'Lookalike guild portal notice',
            technicalTerm: 'Spoofed NPM security domain spear-phishing package maintainers',
            tone: 'amber',
          },
          {
            storyTerm: 'Hijacked publishing passkey',
            technicalTerm: 'Stolen NPM automation and publish token for @solana/web3.js and @rspack/core',
            tone: 'sky',
          },
          {
            storyTerm: 'Freshly backdoored editions in the registry',
            technicalTerm: 'Malicious @solana/web3.js versions 1.95.6 and 1.95.7 published to npmjs',
            tone: 'rose',
          },
          {
            storyTerm: 'Downstream automated workshops',
            technicalTerm: 'Developer workstations and CI pipelines using unpinned caret ranges (^1.95.0)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte master secret into a small outbound queue without slowing down the vault.',
        storyMappings: [
          {
            storyTerm: 'Refreshing the parts shelf automatically',
            technicalTerm: 'npm update resolving unpinned caret version ^1.95.0 to poisoned 1.95.6',
            tone: 'amber',
          },
          {
            storyTerm: 'Official key-loading hinge',
            technicalTerm: 'Keypair.fromSecretKey() and Keypair.fromSeed() core SDK methods',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden scribe copying the master secret',
            technicalTerm: 'Injected addToQueue() exfiltration hook capturing raw private key bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Normal vault work continuing without interruption',
            technicalTerm: 'Silent background staging preventing immediate runtime errors or crashes',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an impostor courier depot.',
        storyMappings: [
          {
            storyTerm: 'Watchful mailroom inspectors',
            technicalTerm: 'Outbound proxy, DLP, and RPC network telemetry monitors',
            tone: 'amber',
          },
          {
            storyTerm: 'Fake transit-routing stamps on web envelopes',
            technicalTerm: 'Stolen keys hidden inside spoofed CF-Connecting-IP and CF-Ray HTTP headers',
            tone: 'sky',
          },
          {
            storyTerm: 'Impostor courier depot',
            technicalTerm: 'Attacker-controlled exfiltration server at sol-rpc.xyz',
            tone: 'rose',
          },
          {
            storyTerm: 'Empty customer vaults after receipt',
            technicalTerm: 'Automated wallet sweeping using recovered 64-byte Solana private keys',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'lottie-player-npm-ace-supply-chain-2024': {
    briefing: {
      storyAnalogy:
        'Imagine an animation studio whose lightweight flipbook player is embedded via an unpinned live delivery link on thousands of websites. An intruder steals a studio publishing pass, pushes three backdoored editions in quick succession so every site loading the live link immediately runs a hidden radio beacon, and uses that live radio to drop a fake glass login sheet directly over trusted finance pages to drain visitor wallets.',
      storyMappings: [
        {
          storyTerm: 'Studio publishing pass pushing three backdoored flipbooks',
          technicalTerm: 'Compromised NPM token publishing @lottiefiles/lottie-player v2.0.5, 2.0.6, and 2.0.7',
          tone: 'amber',
        },
        {
          storyTerm: 'Hidden radio beacon dialing an outside handler',
          technicalTerm: 'Obfuscated bundle opening WebSocket C2 to wss://castleservices.org',
          tone: 'sky',
        },
        {
          storyTerm: 'Fake glass login sheet laid over trusted pages',
          technicalTerm: 'Dynamic DOM modal overlay injected inside victim Web3 applications',
          tone: 'rose',
        },
        {
          storyTerm: 'Draining visitor wallets through the fake sheet',
          technicalTerm: 'AceDrainer eth_sendTransaction and Permit2 malicious signing requests',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Using a stolen studio access token, the intruder uploads three rapid-fire compromised editions of the popular animation player onto the public shelf, banking on thousands of websites that pull the newest major version live without locking a specific version hash.',
        storyMappings: [
          {
            storyTerm: 'Stolen studio access token',
            technicalTerm: 'Compromised @lottiefiles NPM maintainer publish credential',
            tone: 'amber',
          },
          {
            storyTerm: 'Three rapid-fire compromised editions',
            technicalTerm: 'Poisoned @lottiefiles/lottie-player versions 2.0.5, 2.0.6, and 2.0.7',
            tone: 'sky',
          },
          {
            storyTerm: 'Sites pulling the newest edition live without a hash lock',
            technicalTerm: 'Unpinned CDN script tags loading @lottiefiles/lottie-player@latest or @2',
            tone: 'rose',
          },
          {
            storyTerm: 'Appended hidden payload inside the flipbook',
            technicalTerm: 'Obfuscated AceDrainer JavaScript loader bundled into lottie-player.js',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'As soon as a visitor opens any webpage playing a decorative animation, the hidden code appended to the player opens a live two-way radio channel to an outside command post, asking whether this browser holds valuable digital keys worth targeting.',
        storyMappings: [
          {
            storyTerm: 'Webpage playing a decorative animation',
            technicalTerm: 'Victim browser loading unpinned lottie-player.js inside a trusted site',
            tone: 'amber',
          },
          {
            storyTerm: 'Live two-way radio channel',
            technicalTerm: 'Outbound WebSocket connection established to wss://castleservices.org',
            tone: 'sky',
          },
          {
            storyTerm: 'Checking for valuable digital keys',
            technicalTerm: 'Browser wallet extension detection (window.ethereum) inside the page context',
            tone: 'rose',
          },
          {
            storyTerm: 'Outside command post directing next moves',
            technicalTerm: 'Remote AceDrainer C2 server issuing real-time DOM overlay instructions',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'On cue from the live radio channel, the hijacked animation player drops a crystal-clear counterfeit prompt straight over the trusted storefront window, fooling visitors into signing a sweeping vault-transfer slip under the host site own trusted banner.',
        storyMappings: [
          {
            storyTerm: 'Crystal-clear counterfeit prompt over the trusted window',
            technicalTerm: 'Injected full-screen AceDrainer modal overlay inside the host DOM',
            tone: 'amber',
          },
          {
            storyTerm: 'Host site own trusted banner',
            technicalTerm: 'Legitimate victim domain URL bar lending visual authenticity to the prompt',
            tone: 'sky',
          },
          {
            storyTerm: 'Sweeping vault-transfer slip',
            technicalTerm: 'Crafted eth_sendTransaction and Permit2 approval prompts sent to the wallet',
            tone: 'rose',
          },
          {
            storyTerm: 'Direct asset transfer to the attacker',
            technicalTerm: 'On-chain draining of user tokens immediately upon wallet signature',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'circleci-oauth-github-token-rotation-breach': {
    briefing: {
      storyAnalogy:
        'Imagine a master build-automation vault that safeguards secret keys for thousands of software companies. An intruder infects a single senior engineer laptop with a silent pocket-picking program that lifts an already-stamped two-factor entry pass straight from the browser, replays that active pass from abroad to copy both the encrypted customer lockboxes and the live decoding key from the vault control room, and unlocks thousands of customer cloud and code keys offline.',
      storyMappings: [
        {
          storyTerm: 'Silent pocket-picking program lifting a stamped two-factor pass',
          technicalTerm: 'macOS infostealer stealing a 2FA-authenticated browser session cookie',
          tone: 'amber',
        },
        {
          storyTerm: 'Replaying the active pass from abroad to enter the control room',
          technicalTerm: 'Foreign proxy session replay accessing CircleCI production databases and KMS keys',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying both the encrypted lockboxes and the decoding key',
          technicalTerm: 'Exfiltrating customer secret databases alongside runtime encryption keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Unlocking customer cloud and code keys offline',
          technicalTerm: 'Offline decryption and replay of customer GitHub OAuth tokens and AWS keys',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the two-factor badge gate entirely because the wristband already carries its fresh stamp.',
        storyMappings: [
          {
            storyTerm: 'Trojanized helper tool on a work laptop',
            technicalTerm: 'Third-party macOS infostealer executing on a privileged engineer endpoint',
            tone: 'amber',
          },
          {
            storyTerm: 'Already-verified security wristband inside the browser drawer',
            technicalTerm: 'Active 2FA-backed SSO browser session cookie stolen from disk/keychain',
            tone: 'sky',
          },
          {
            storyTerm: 'Skipping the two-factor badge gate',
            technicalTerm: 'Session cookie theft bypassing hardware MFA and antivirus detection',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged engineer identity',
            technicalTerm: 'Production access rights capable of generating customer data tokens',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and separately grabs the live master decoding key sitting in the vault engine room.',
        storyMappings: [
          {
            storyTerm: 'Wearing the stolen wristband from an overseas booth',
            technicalTerm: 'Replaying the hijacked session cookie from a foreign proxy IP address',
            tone: 'amber',
          },
          {
            storyTerm: 'Encrypted customer secret ledgers',
            technicalTerm: 'Exfiltrated CircleCI production database dumps containing encrypted CI secrets',
            tone: 'sky',
          },
          {
            storyTerm: 'Live master decoding key in the engine room',
            technicalTerm: 'Stolen runtime encryption / KMS key material protecting customer vaults',
            tone: 'rose',
          },
          {
            storyTerm: 'Central vault control room',
            technicalTerm: 'Privileged internal CircleCI production data and secrets infrastructure',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered GitHub and cloud keys across downstream company estates.',
        storyMappings: [
          {
            storyTerm: 'Pairing the master key with copied ledgers offline',
            technicalTerm: 'Offline decryption of customer environment variables, SSH keys, and OAuth tokens',
            tone: 'amber',
          },
          {
            storyTerm: 'Freshly uncovered code and cloud keys',
            technicalTerm: 'Decrypted customer GitHub OAuth tokens, AWS IAM keys, and project API tokens',
            tone: 'sky',
          },
          {
            storyTerm: 'Entering downstream company estates',
            technicalTerm: 'Downstream replay of stolen CI/CD secrets against customer repos and clouds',
            tone: 'rose',
          },
          {
            storyTerm: 'Emergency lock replacement across all tenants',
            technicalTerm: 'Mandatory global rotation of all CircleCI-stored OAuth, SSH, and cloud secrets',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning': {
    briefing: {
      storyAnalogy:
        'Imagine a busy automated software factory whose front guard reads the address on an incoming courier slip differently from the back-room receptionist. An outsider addresses a slip to a nonexistent room while tucking an official back-office route behind a semicolon fold, tricking the factory into minting a brand-new administrator keycard, sneaking a poisoned assembly step onto the production conveyor belt, and letting the factory own signing press stamp genuine approval seals onto trojanized customer releases.',
      storyMappings: [
        {
          storyTerm: 'Nonexistent room slip with a hidden semicolon fold',
          technicalTerm: 'Unauthenticated ?jsp=/app/rest/...;.jsp auth bypass (CVE-2024-27198)',
          tone: 'amber',
        },
        {
          storyTerm: 'Minting a brand-new administrator keycard',
          technicalTerm: 'Creating a privileged TeamCity Bearer access token via REST API',
          tone: 'sky',
        },
        {
          storyTerm: 'Poisoned assembly step on the production conveyor belt',
          technicalTerm: 'Injected malicious build step via /app/rest/buildTypes accessing signing keys',
          tone: 'rose',
        },
        {
          storyTerm: 'Factory signing press stamping genuine approval seals',
          technicalTerm: 'ProdRelease agent compiling and officially code-signing a backdoored release',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the factory gate, the intruder hands over a delivery slip addressed to an empty hallway while hiding a private back-office route behind a semicolon trick. The gate guard waves the nonexistent hallway past the badge booth, while the inside dispatcher faithfully routes the hidden back-office order to mint a fresh master admin keycard.',
        storyMappings: [
          {
            storyTerm: 'Empty hallway address with a hidden semicolon trick',
            technicalTerm: 'Non-existent path paired with ?jsp=/app/rest/...;.jsp matrix parameter',
            tone: 'amber',
          },
          {
            storyTerm: 'Gate guard waving the slip past the badge booth',
            technicalTerm: 'TeamCity authentication filter bypassed by CVE-2024-27198 path confusion',
            tone: 'sky',
          },
          {
            storyTerm: 'Fresh master admin keycard minted on demand',
            technicalTerm: 'Newly generated TeamCity administrator Bearer JWT (Authorization: Bearer eyJ0eXAi...)',
            tone: 'rose',
          },
          {
            storyTerm: 'Back-office token desk',
            technicalTerm: 'Unprotected internal /app/rest/users/id:1/tokens REST endpoint',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Walking onto the factory floor with the newly minted admin keycard, the intruder opens the master assembly-line schedule, locates the flagship customer release belt, and inserts a covert extra build step right before the official code-signing press.',
        storyMappings: [
          {
            storyTerm: 'Master assembly-line schedule',
            technicalTerm: 'TeamCity /app/rest/buildTypes API listing production build configurations',
            tone: 'amber',
          },
          {
            storyTerm: 'Flagship customer release belt',
            technicalTerm: 'ProdRelease CI/CD pipeline holding code-signing certificates and secrets',
            tone: 'sky',
          },
          {
            storyTerm: 'Covert extra build step inserted before signing',
            technicalTerm: 'Injected malicious compilation or patch runner step via TeamCity REST API',
            tone: 'rose',
          },
          {
            storyTerm: 'Newly minted admin keycard',
            technicalTerm: 'Hijacked administrator Bearer token authenticating pipeline modifications',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'On the next scheduled shipment, the unsuspecting factory robot follows the altered conveyor instructions, welds a hidden backdoor inside the finished product, stamps the company authentic cryptographic warranty seal onto the crate, and ships it straight out to trusting customers.',
        storyMappings: [
          {
            storyTerm: 'Unsuspecting factory robot running the schedule',
            technicalTerm: 'TeamCity build agent executing the tampered ProdRelease pipeline',
            tone: 'amber',
          },
          {
            storyTerm: 'Welding a hidden backdoor inside the finished product',
            technicalTerm: 'Malicious build step compiling backdoor code into the official release binary',
            tone: 'sky',
          },
          {
            storyTerm: 'Authentic cryptographic warranty seal',
            technicalTerm: 'Legitimate vendor code-signing key applied automatically by the release stage',
            tone: 'rose',
          },
          {
            storyTerm: 'Shipping trojanized crates to trusting customers',
            technicalTerm: 'Downstream supply-chain distribution of officially signed backdoored installers',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'pypi-pytorch-torchtriton-dependency-confusion-supply-chain': {
    briefing: {
      storyAnalogy:
        'Imagine a research workshop whose nightly supply clerk checks a public downtown parts market before checking the company private warehouse whenever an internal part name is ordered. An opportunist rents a booth in the downtown market under that exact internal part name with a shiny higher version tag, tricking the clerk into carrying a disguised spy box straight onto high-powered research benches where it packs up local keys and whispers them out disguised as tiny postal-lookup cards.',
      storyMappings: [
        {
          storyTerm: 'Public downtown market checked before the private warehouse',
          technicalTerm: 'pip --extra-index-url prioritizing public PyPI over download.pytorch.org/whl/nightly',
          tone: 'amber',
        },
        {
          storyTerm: 'Booth rented under the exact internal part name',
          technicalTerm: 'Dependency-confusion package named torchtriton squatted on public PyPI',
          tone: 'sky',
        },
        {
          storyTerm: 'Disguised spy box unpacking automatically on research benches',
          technicalTerm: 'triton/__init__.py launching compiled ELF stealer binary (triton/runtime/triton)',
          tone: 'rose',
        },
        {
          storyTerm: 'Whispering stolen keys out as tiny postal-lookup cards',
          technicalTerm: 'AES-encrypted DNS tunneling exfiltration via wheezy.io to *.h4ck.cfd',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Noticing that a famous lab nightly toolkit relies on an internal helper name not yet reserved on the public marketplace, the attacker claims that exact name on the public shelf so the automated buyer prefers the public fake over the lab private bin.',
        storyMappings: [
          {
            storyTerm: 'Internal helper name unreserved in public',
            technicalTerm: 'Internal PyTorch nightly dependency named torchtriton',
            tone: 'amber',
          },
          {
            storyTerm: 'Claiming the exact name on the public shelf',
            technicalTerm: 'Public PyPI namespace squatting exploiting dependency confusion (T1195.001)',
            tone: 'sky',
          },
          {
            storyTerm: 'Automated buyer preferring the public fake',
            technicalTerm: 'pip --extra-index-url resolution precedence favoring public PyPI packages',
            tone: 'rose',
          },
          {
            storyTerm: 'Lab private parts bin bypassed',
            technicalTerm: 'Official internal index at https://download.pytorch.org/whl/nightly',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The moment a machine-learning engineer or graphics cluster opens the newly installed library for routine training work, the box startup lid quietly launches a compiled espionage tool that sweeps system keys, environment variables, and home-folder secrets.',
        storyMappings: [
          {
            storyTerm: 'Opening the library for routine training work',
            technicalTerm: 'Importing torch or triton on ML developer workstations or GPU nodes',
            tone: 'amber',
          },
          {
            storyTerm: 'Box startup lid triggering automatically',
            technicalTerm: 'triton/__init__.py executing on module import',
            tone: 'sky',
          },
          {
            storyTerm: 'Compiled espionage tool inside the box',
            technicalTerm: 'Bundled Linux ELF stealer binary at triton/runtime/triton',
            tone: 'rose',
          },
          {
            storyTerm: 'Sweeping system keys and home-folder secrets',
            technicalTerm: 'Harvesting /etc/passwd, SSH keys, git configs, and environment variables',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Because research clusters block unauthorized cargo trucks leaving the front web gate, the spy compresses and locks the stolen secrets into tiny encrypted fragments and mails them out disguised as routine address-book lookup slips that every network router passes freely.',
        storyMappings: [
          {
            storyTerm: 'Blocked cargo trucks at the front web gate',
            technicalTerm: 'Corporate HTTP/HTTPS egress proxies restricting direct web exfiltration',
            tone: 'amber',
          },
          {
            storyTerm: 'Compressing and locking secrets into tiny fragments',
            technicalTerm: 'AES encryption and chunking inside the triton ELF stealer binary',
            tone: 'sky',
          },
          {
            storyTerm: 'Routine address-book lookup slips',
            technicalTerm: 'DNS query subdomain exfiltration tunneling via wheezy.io to *.h4ck.cfd',
            tone: 'rose',
          },
          {
            storyTerm: 'Watchful network routers passing lookups freely',
            technicalTerm: 'Uninspected UDP/53 DNS resolution leaking encrypted secrets out of GPU clusters',
            tone: 'emerald',
          },
        ],
      },
    },
  },
};
