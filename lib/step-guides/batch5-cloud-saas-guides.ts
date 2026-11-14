import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH5_CLOUD_SAAS_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'snowflake-unc5537-saas-extortion': {
    scenarioId: 'snowflake-unc5537-saas-extortion',
    briefing: {
      headline: 'Scenario Briefing: UNC5537 Snowflake Extortion Campaign — Infostealer Credential Replay & FROSTBITE (Rapeflake) Staging',
      storyAnalogy:
        'Imagine a high-security cloud storage facility (`Snowflake`) where the vault doors themselves are unbreakable, but several corporate tenants told the front desk: "Let our contractors walk in with just a written password—don’t ask them for a second security badge (`MFA = NULL`) or check what taxi (`IP Network Policy`) they arrived in." A thief (`UNC5537`) buys old boxes of stolen home-computer diaries (`Lumma / RedLine / Vidar infostealer logs`), searches those diaries for the word `snowflakecomputing.com`, walks right through the front door with a high-speed robotic inventory scanner (`FROSTBITE / Rapeflake`), packs gigabytes of customer ledgers into zip bags (`COPY INTO @~`), and carries them out.',
      plainSummary:
        'Synthesizing Mandiant’s UNC5537 investigation, Snowflake’s joint security advisory, and CISA guidance (June 2024), this scenario models how financially motivated threat actor UNC5537 breached over 165 enterprise Snowflake customer tenants without exploiting any vulnerability in Snowflake itself. The actors extracted valid corporate credentials from historical infostealer malware logs (`RedLine`, `Vidar`, `LummaC2`), logged into single-factor accounts lacking Multi-Factor Authentication (`SECOND_AUTHENTICATION_FACTOR = NULL`) and Network Policies, ran the custom `.NET` utility **FROSTBITE** (`Rapeflake`) to enumerate schemas, and used **DBeaver Ultimate** to stage (`COPY INTO`) and download multi-gigabyte customer tables.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UNC5537 Mullvad VPN Operator), follow the single-factor password login into Node ②/③ (Snowflake Cloud Auth Gateway), trace the automated `SHOW TABLES` discovery inside Node ④ (`FROSTBITE / Rapeflake`), and watch bulk `COPY INTO` staging and `GET` exfiltration from Node ⑤ (Snowflake Warehouse) monitored by Node ⑥ (`ACCOUNT_USAGE` SIEM).',
      documentedAdvisory: 'Mandiant UNC5537 Joint Report · Snowflake Security Advisory · CISA Alert (June 2024) · MITRE T1078.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1078.004',
        plainTitle: 'Replaying Infostealer-Harvested Credentials Against Single-Factor Snowflake Accounts (`T1078.004`)',
        storyAnalogy:
          'Instead of picking the vault lock, the intruder searches old stolen notebooks (`RedLine / Lumma stealer logs`) for saved `*.snowflakecomputing.com` passwords and walks straight into any tenant that forgot to require a second badge (`MFA`).',
        simpleExplanation:
          'UNC5537 searches millions of historical infostealer malware logs (harvested by RedLine, Vidar, and LummaC2 from contractor laptops infected months or years earlier) for URLs matching *.snowflakecomputing.com, and replays those plaintext credentials from Mullvad VPN exit nodes (198.51.100.44) against the customer’s Snowflake login API (which succeeds whenever the target account has SECOND_AUTHENTICATION_FACTOR = NULL and no Snowflake Network Policy restricting logins to corporate IP ranges).',
        howItWorksInPractice:
          'Because service accounts like SVC_TABLEAU_ETL were frequently configured with static passwords and exempted from MFA to support legacy BI pipelines, possessing a single unrotated password gave UNC5537 immediate ACCOUNTADMIN or SYSADMIN access.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (UNC5537 Operator) to Node ②/③ (Snowflake Cloud Auth Gateway), and return arrow ⇠#1.2 issuing the authenticated session token.',
        detectionAndEvidence:
          'Documented by Mandiant & Snowflake: `SNOWFLAKE.ACCOUNT_USAGE.LOGIN_HISTORY` showing `FIRST_AUTHENTICATION_FACTOR = PASSWORD` and `SECOND_AUTHENTICATION_FACTOR IS NULL` from Mullvad VPN IPs.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1087.004',
        plainTitle: 'Running the `FROSTBITE` (`Rapeflake`) Utility for Rapid Schema & Role Reconnaissance (`T1087.004`)',
        storyAnalogy:
          'Once inside the lobby, the thief switches on a custom barcode scanner (`FROSTBITE / Rapeflake`) that races down every aisle in 2 seconds, printing a list of which vaults hold millions of customer records.',
        simpleExplanation:
          'Immediately after authenticating, the operator runs a custom .NET reconnaissance tool tracked by Mandiant as FROSTBITE (which identifies itself in Snowflake’s CLIENT_APPLICATION_ID telemetry under its internal build name "Rapeflake") to automatically execute SHOW DATABASES, SHOW USERS, SHOW ROLES, and SELECT * FROM INFORMATION_SCHEMA.TABLES (allowing the attacker to instantly score and prioritize customer tenants that hold hundreds of millions of PII or payment rows).',
        howItWorksInPractice:
          'Every SQL query and client driver string in Snowflake is immutably recorded in SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY and SESSIONS, exposing the literal "Rapeflake" and "DBeaver_DBeaverUltimate" application strings.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ dispatches the automated metadata discovery burst inside Node ④ (`FROSTBITE / Rapeflake`), and ⇠#2.2 returns the high-value table catalog.',
        detectionAndEvidence:
          'Documented by Mandiant: `CLIENT_ENVIRONMENT` in `SNOWFLAKE.ACCOUNT_USAGE.SESSIONS` containing `"APPLICATION": "Rapeflake"` or `"DBeaver_DBeaverUltimate"`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Staging Multi-GB Tables via `COPY INTO @~` & Downloading with `DBeaver Ultimate` (`T1530`)',
        storyAnalogy:
          'Using a commercial database mover’s dolly (`DBeaver Ultimate`), the thief compresses the giant customer tables into GZip bundles on a loading dock (`COPY INTO @~`) and wheels them out over HTTPS.',
        simpleExplanation:
          'To extract tens of millions of rows without timing out, the operator connects via DBeaver Ultimate (using the official Snowflake JDBC driver) and executes COPY INTO @~/dump/customers.csv.gz FROM PROD_DB.PUBLIC.CUSTOMERS (compressing the entire table into GZip CSV chunks inside the user’s personal internal Snowflake stage @~ so they can be rapidly downloaded with the GET command over HTTPS).',
        howItWorksInPractice:
          'Staging data into an internal user stage (@~) or temporary stage via COPY INTO leverages Snowflake’s parallel virtual warehouse compute to dump gigabytes of records in seconds.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `COPY INTO @~` and `GET` against Node ⑤ (Snowflake Virtual Warehouse) while Node ⑥ (SIEM) flags the anomalous multi-gigabyte export.',
        detectionAndEvidence:
          'Documented by Mandiant & Snowflake: `QUERY_HISTORY` showing `QUERY_TYPE IN (\'COPY\', \'GET\')` with high `BYTES_WRITTEN_TO_RESULT` from `DBeaver_DBeaverUltimate`.',
      },
    ],
  },

  'aws-imdsv1-ssrf-capitalone-style': {
    scenarioId: 'aws-imdsv1-ssrf-capitalone-style',
    briefing: {
      headline: 'Scenario Briefing: AWS EC2 SSRF to IMDSv1 (`169.254.169.254`) — Instance Role Credential Theft & S3 Sync Exfiltration',
      storyAnalogy:
        'Imagine an office mailroom clerk (`EC2 Reverse Proxy / Web App`) whose job is to fetch public brochures from any website address you write on a request slip (`?url=...`). Inside the building, however, there is an internal pneumatic tube at extension `169.254.169.254` (`IMDSv1`) that automatically dispenses a temporary master keycard (`ASIA... STS IAM Role Credentials`) to anyone sitting inside the building who asks for it—no questions asked! By writing `http://169.254.169.254/latest/meta-data/iam/security-credentials/` on the public request slip (`SSRF`), an outsider tricks the mailroom clerk into fetching the building’s master keycard and mailing a photocopy straight back to the street.',
      plainSummary:
        'Grounded in AWS Security’s IMDSv2 architecture documentation, Palo Alto Networks Unit 42 cloud research, and MITRE ATT&CK `T1552.005`, this scenario demonstrates how a Server-Side Request Forgery (SSRF) flaw on an Amazon EC2 instance with legacy **IMDSv1** enabled (`HttpTokens=optional`) compromises the underlying cloud account. The attacker coerces the EC2 web service into sending an HTTP `GET` request to the link-local metadata IP (`http://169.254.169.254/latest/meta-data/iam/security-credentials/<RoleName>`), extracts the temporary AWS STS `AccessKeyId` (`ASIA...`), `SecretAccessKey`, and `SessionToken`, and replays them from an external machine via `aws s3 sync` to exfiltrate private S3 buckets.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (External Cloud Adversary), send the `?url=http://169.254.169.254/...` SSRF request to Node ②/③ (EC2 Web Proxy), watch it query Node ④ (IMDSv1 `169.254.169.254` Link-Local Service) for `ASIA...` STS keys, and trace the external `aws s3 sync` against Node ⑤ (AWS S3 Production Buckets) caught by Node ⑥ (GuardDuty / CloudTrail SIEM).',
      documentedAdvisory: 'AWS Security IMDSv2 Guidance · Unit 42 Cloud Threat Research · MITRE ATT&CK T1552.005 / T1530',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting Server-Side Request Forgery (SSRF) to Query Link-Local `169.254.169.254` (`T1190`)',
        storyAnalogy:
          'The attacker hands the web server a URL pointing to `169.254.169.254`—an internal-only IP address that only processes running inside the EC2 virtual machine can reach.',
        simpleExplanation:
          'The attacker sends an HTTP GET request to a URL-fetching endpoint on the EC2 web server (/api/webhook-preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/) (exploiting Server-Side Request Forgery so the EC2 instance itself makes an internal HTTP GET request to AWS’s link-local Instance Metadata Service at 169.254.169.254 and returns the name of its attached IAM Role, WafProxyS3ReadRole).',
        howItWorksInPractice:
          'Because 169.254.169.254 is a non-routable link-local IP (RFC 3927) answered directly by the AWS Nitro hypervisor on the local virtual network interface, external firewalls cannot see or block traffic to it once an application inside the instance is tricked into making the request.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (External Attacker) to Node ②/③ (EC2 Web Proxy), and return arrow ⇠#1.2 revealing the attached IAM Role name (`WafProxyS3ReadRole`).',
        detectionAndEvidence:
          'Documented by AWS & Suricata SID 2028910: Incoming HTTP URI parameters containing `169.254.169.254` and CloudWatch metric `MetadataNoToken > 0`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.005',
        plainTitle: 'Dumping Temporary AWS STS Credentials (`ASIA...`) from IMDSv1 (`T1552.005`)',
        storyAnalogy:
          'Because the instance still uses legacy IMDSv1, simply asking for the role’s folder name causes the metadata service to print out the live `AccessKeyId`, `SecretAccessKey`, and `SessionToken`.',
        simpleExplanation:
          'Appending the discovered role name to the SSRF URL (/latest/meta-data/iam/security-credentials/WafProxyS3ReadRole) causes the IMDSv1 endpoint to return a JSON object containing temporary AWS STS credentials—AccessKeyId (starting with the prefix "ASIA", which designates temporary STS role credentials rather than permanent "AKIA" user keys), SecretAccessKey, and Token (all without requiring a preliminary HTTP PUT session token because HttpTokens is set to "optional" instead of "required").',
        howItWorksInPractice:
          'Why does IMDSv2 stop this attack? Because IMDSv2 requires the client to first send an HTTP PUT request with a custom X-aws-ec2-metadata-token-ttl-seconds header to obtain a secret token, and then pass that token in X-aws-ec2-metadata-token—two steps that classic GET-based SSRF vulnerabilities cannot perform.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ queries Node ④ (EC2 IMDSv1 `169.254.169.254`), and ⇠#2.2 returns the plaintext JSON credential bundle containing `ASIAIOSFODNN7EXAMPLE`.',
        detectionAndEvidence:
          'Documented by AWS Security: CloudWatch `MetadataNoToken` metric spikes and web proxy logs returning 1.3 KB JSON responses from `/latest/meta-data/iam/security-credentials/`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Replaying Stolen EC2 Role Keys Outside AWS via `aws s3 sync` (`T1530`)',
        storyAnalogy:
          'The thief takes the photocopied EC2 keycard home, plugs it into their own laptop (`aws-cli`), and downloads every customer file from the company’s S3 cloud vaults—setting off the "Building Keycard Used From Outside the Building!" alarm (`GuardDuty`).',
        simpleExplanation:
          'The attacker loads the stolen AccessKeyId, SecretAccessKey, and SessionToken into their local AWS CLI environment and runs aws s3 sync s3://corp-credit-applications-prod ./loot (authenticating directly to the public S3 API from their external IP 198.51.100.88 as the EC2 instance’s AssumedRole—which immediately triggers AWS GuardDuty’s UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS finding because an EC2 instance profile credential should only ever originate from an internal AWS EC2 IP).',
        howItWorksInPractice:
          'Even if an attacker steals an EC2 IAM role’s STS token, defenders can render the stolen token useless outside the VPC by attaching an aws:SourceVpce or aws:VpcSourceIp condition to the IAM role policy.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `aws s3 sync` against Node ⑤ (AWS S3 Production Buckets) while Node ⑥ (GuardDuty & CloudTrail SIEM) fires `InstanceCredentialExfiltration.OutsideAWS`.',
        detectionAndEvidence:
          'Documented by AWS GuardDuty & CloudTrail: `userIdentity.type == "AssumedRole"` with principal `i-0a84b92c11e3f0412` calling `s3:GetObject` from an external non-AWS IP.',
      },
    ],
  },

  'k8s-runc-cve-2024-21626-leaky-vessels': {
    scenarioId: 'k8s-runc-cve-2024-21626-leaky-vessels',
    briefing: {
      headline: 'Scenario Briefing: Snyk "Leaky Vessels" `runc` Escape (CVE-2024-21626) — Host `/proc/self/fd/7` Working Directory Breakout',
      storyAnalogy:
        'Imagine a prison guard (`runc <= 1.1.11`) who is escorting a new inmate (`container process`) into a locked isolation cell (`pivot_root` container filesystem). Before locking the cell door, the guard opens a clipboard folder (`file descriptor 7 / fd 7`) that is clipped to the main prison warden’s office hallway (`/sys/fs/cgroup` on the host OS). The inmate’s intake form says: "Please stand inside folder #7 (`WORKDIR /proc/self/fd/7`)." The guard absentmindedly lets the inmate step onto the clipboard’s hallway floor *before* locking the cell door and snapping the clipboard shut (`O_CLOEXEC`)! Even though the clipboard is closed a millisecond later, the inmate’s feet (`current working directory "."`) are already standing in the warden’s hallway—so walking four steps backward (`cd ../../../..`) puts the inmate right inside the host server’s master control room.',
      plainSummary:
        'Discovered by Snyk Security Labs (Rory McNamara) and patched by OpenContainers in January 2024 ("Leaky Vessels", CVE-2024-21626), `runc` versions `<= 1.1.11` leaked an open file descriptor (`fd 7`, `8`, or `9`) pointing to the underlying host’s `/sys/fs/cgroup` directory into the container initialization step. By setting `WORKDIR /proc/self/fd/7` in a malicious `Dockerfile` (or running `runc exec --cwd /proc/self/fd/7`), the container process changes its current working directory to the host’s `/sys/fs/cgroup` dentry before `execve()` closes the file descriptor—allowing relative `../../../../etc/shadow` traversal and full Kubernetes worker-node root takeover.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Malicious OCI Image `WORKDIR /proc/self/fd/7`), trace `runc init` opening `/sys/fs/cgroup` on `fd 7` on Node ②/③ (K8s Worker Node), follow the persistent host working-directory handle inside Node ④ (`/proc/self/fd/7` Anchor), and watch the `../../../../etc/crontab` & kubelet takeover on Node ⑤ detected by Node ⑥ (Sysdig Falco eBPF Sensor).',
      documentedAdvisory: 'Snyk Security Labs "Leaky Vessels" Disclosure · OpenContainers GHSA-xr7r-f8xq-vfvv · CVE-2024-21626 · MITRE T1611',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1611',
        plainTitle: 'Leaking the Host `/sys/fs/cgroup` File Descriptor (`fd 7`) into `runc init` (`CVE-2024-21626`)',
        storyAnalogy:
          'While building the container’s walls, `runc` opens a directory handle (`fd 7`) to the host’s `/sys/fs/cgroup` folder and forgets to close it before honoring the container’s `WORKDIR /proc/self/fd/7` instruction.',
        simpleExplanation:
          'In runc versions <= 1.1.11, the runc init process opens the host system’s /sys/fs/cgroup directory (receiving file descriptor 7, marked O_CLOEXEC so it will automatically close when execve() finally starts the container’s command) *before* isolating the container’s filesystem via pivot_root(). However, when the container image specifies WORKDIR /proc/self/fd/7, runc calls chdir("/proc/self/fd/7") *before* calling execve() (stepping directly through the still-open file descriptor 7 into the host’s /sys/fs/cgroup directory).',
        howItWorksInPractice:
          'Why didn’t O_CLOEXEC protect runc? Because O_CLOEXEC only closes file descriptors at the exact moment execve() is called, whereas runc processes the container’s WORKDIR (chdir) slightly earlier during the init setup phase while fd 7 is still open.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Malicious OCI Image) to Node ②/③ (K8s Worker `runc 1.1.11`), and return arrow ⇠#1.2 executing `chdir("/proc/self/fd/7")`.',
        detectionAndEvidence:
          'Documented by Snyk & OpenContainers: Linux Auditd `SYSCALL chdir` with path `/proc/self/fd/7` (or `fd/8`, `fd/9`) inside `runc:[2:INIT]`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1611',
        plainTitle: 'Retaining the Host VFS Dentry as the Container’s Current Working Directory (`.`) (`T1611`)',
        storyAnalogy:
          'When `execve()` runs, file descriptor 7 snaps shut—but the container’s feet (`current working directory "."`) are already planted on the host’s `/sys/fs/cgroup` floor outside the container jail!',
        simpleExplanation:
          'When runc finally calls execve("/bin/sh"), the Linux kernel closes file descriptor 7 as requested by O_CLOEXEC—but the process’s kernel working directory pointer (task_struct->fs->pwd, represented by "." and /proc/self/cwd) remains anchored to the host’s /sys/fs/cgroup Virtual File System (VFS) dentry outside the container’s pivot_root boundary (causing /proc/self/cwd to display as "(unreachable)/sys/fs/cgroup").',
        howItWorksInPractice:
          'In the Linux kernel, once a process’s fs->pwd dentry points to a mount outside its root namespace, relative path lookups starting from "." or ".." resolve along the host mount tree rather than the container’s rootfs.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ anchors `task_struct->fs->pwd` inside Node ④ (`Leaked Host Cgroup FD`), and ⇠#2.2 exposes `(unreachable)/sys/fs/cgroup` to the container shell.',
        detectionAndEvidence:
          'Documented by Sysdig TRT & Falco: Runtime eBPF alert where a container process has `proc.cwd` starting with `(unreachable)` or `/proc/self/fd/`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1068',
        plainTitle: 'Traversing `../../../../` to the Host Root Filesystem & Stealing Kubelet Credentials (`T1068`)',
        storyAnalogy:
          'From `/sys/fs/cgroup` on the host, climbing up four parent folders (`../../../../`) lands the process at the host server’s real `/` root directory—giving full access to `/etc/shadow`, `/etc/crontab`, and Kubernetes node certificates.',
        simpleExplanation:
          'Because the container’s current directory (".") is /sys/fs/cgroup on the underlying Kubernetes worker node, running cd ../../../.. (or opening "../../../../etc/shadow" and "../../../../var/lib/kubelet/kubeconfig" via openat(AT_FDCWD, ...)) walks up the host directory tree to the worker node’s real root filesystem (/), allowing the attacker to read host password hashes, write a root reverse shell into /etc/crontab, and steal the kubelet’s TLS client certificate.',
        howItWorksInPractice:
          'OpenContainers patched CVE-2024-21626 in runc 1.1.12 by marking internal cgroup descriptors O_CLOEXEC properly, closing leaked fds before chdir, and verifying via getcwd() that the working directory is not "(unreachable)" outside the container root.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ traverses `../../../../` from Node ④ into Node ⑤ (Host Node Root Filesystem) while Node ⑥ (Sysdig Falco Sensor) alerts on the container breakout.',
        detectionAndEvidence:
          'Documented by Snyk & Sysdig: Auditd `openat` syscall from a containerized PID accessing `../../../../etc/shadow` or `../../../../etc/crontab`.',
      },
    ],
  },

  'microsoft-storm-0558-msa-signing-key': {
    scenarioId: 'microsoft-storm-0558-msa-signing-key',
    briefing: {
      headline: 'Scenario Briefing: Storm-0558 MSA Signing Key Intrusion — Crash-Dump Private Key Theft & Cross-Realm OWA Token Forgery',
      storyAnalogy:
        'Imagine a global hotel chain (`Microsoft Cloud`) that runs two completely separate divisions: a casual **Public Gym** (`Consumer MSA / Outlook.com`) and a classified **Diplomatic Embassy Tower** (`Enterprise Azure AD / Exchange Online`). Each division has its own wax signet ring (`cryptographic signing key`) for stamping visitor passes. One day in 2021, aPublic Gym printing machine crashes, and a photo of the trash bin (`crash dump`) accidentally includes the Public Gym’s wax signet ring (`2016 MSA consumer signing key`). A spy (`Storm-0558`) finds that ring in the crash dump and stamps a fake VIP pass claiming to be an Embassy Ambassador. When the spy hands that pass to the Embassy Tower’s mailroom guard (`Exchange Online / OWA`), the guard carefully checks with a magnifying glass that the wax seal came from a real Microsoft ring—but forgets to check that a **Public Gym** ring is never allowed to sign an **Embassy Tower** pass!',
      plainSummary:
        'Synthesizing Microsoft Threat Intelligence’s technical post-mortem, Joint CISA/FBI Advisory AA23-193A, and Wiz Research (July–September 2023), China-nexus espionage actor **Storm-0558** acquired an inactive 2016 Microsoft Account (MSA) consumer signing private key that had been inadvertently written into a 2021 process crash dump. By exploiting a cross-realm signature validation bug in Outlook Web Access (`OWA`) and Exchange Online where enterprise relying parties verified token signatures against a shared key store without checking whether the signing key belonged to the consumer (`MSA`) vs. enterprise (`Entra ID`) trust realm, Storm-0558 forged access tokens to silently exfiltrate emails from 25 organizations including government agencies.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Storm-0558 Forgery Engine with the 2016 MSA Key), present the forged token to Node ②/③ (Exchange Online / OWA Validator), trace the OWA token exchange (`AppId 00000002-0000-0ff1-ce00-000000000000`) inside Node ④, and watch the `GetItem` mailbox collection on Node ⑤ caught by Node ⑥ (Purview `MailItemsAccessed` & CISA AA23-193A Hunter).',
      documentedAdvisory: 'CISA/FBI Joint Advisory AA23-193A · Microsoft Threat Intelligence Post-Mortem · Wiz Research · MITRE T1606.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1552.004',
        plainTitle: 'Extracting the 2016 MSA Consumer Signing Key from a Crash Dump & Minting Forged Tokens (`T1552.004`)',
        storyAnalogy:
          'Having recovered Microsoft’s private 2016 consumer MSA signing key from a crash dump, the spy uses it offline on their own computer to stamp fake identity tokens for government diplomats.',
        simpleExplanation:
          'As detailed in Microsoft’s root-cause investigation, a 2021 consumer signing service crash accidentally included private key material for a 2016 Microsoft Account (MSA) consumer signing key inside a process crash dump (which failed to be redacted due to a race condition and was later exfiltrated from a compromised engineer’s corporate environment). Storm-0558 uses this RSA private key offline to cryptographically sign forged authentication tokens populated with target enterprise user claims.',
        howItWorksInPractice:
          'Because token forgery happens 100% offline using the stolen private signing key, the attacker never sends a password guess or MFA push to Microsoft Entra ID—generating zero failed-login alerts.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Storm-0558 Forgery Engine) to Node ②/③ (OWA Token Validator), and return arrow ⇠#1.2 accepting the MSA-signed signature.',
        detectionAndEvidence:
          'Documented by Microsoft Threat Intel & CISA AA23-193A: Token headers referencing the retired 2016 MSA consumer signing `kid` presented against enterprise Exchange Online endpoints.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1606.002',
        plainTitle: 'Bypassing Enterprise Realm Isolation in Exchange Online / OWA Token Validation (`T1606.002`)',
        storyAnalogy:
          'The Exchange Online guard checks that the token’s cryptographic signature matches a valid key in Microsoft’s key ring—but fails to verify whether that key belongs to the Consumer MSA ring or the Enterprise Azure AD ring!',
        simpleExplanation:
          'When Storm-0558 sends the forged token to Outlook Web Access (outlook.office365.com/owa/), the OWA token validation library verifies the RSA signature against a shared metadata store containing both consumer MSA keys and enterprise Azure AD (Entra ID) keys (failing to enforce scope/issuer-realm isolation that should reject a consumer MSA signing key when validating an enterprise organizational user). OWA then exchanges the forged token for live Exchange Online session tokens under AppId 00000002-0000-0ff1-ce00-000000000000.',
        howItWorksInPractice:
          'As Wiz Research highlighted, cryptographic signature verification alone is insufficient in multi-tenant cloud architectures unless the verifier strictly binds each signing key ID (kid) to its authorized issuer realm.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ exchanges the forged token inside Node ④ (`OWA Actor Token Broker`), and ⇠#2.2 issues an active Exchange Online session cookie.',
        detectionAndEvidence:
          'Documented in CISA AA23-193A: Exchange audit records showing `AppId == "00000002-0000-0ff1-ce00-000000000000"` with an empty `ClientAppId` and no corresponding Entra ID `SignInLogs` entry.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1114.002',
        plainTitle: 'Exfiltrating Diplomatic Mailboxes via OWA `GetItem` & Detecting via Purview `MailItemsAccessed` (`T1114.002`)',
        storyAnalogy:
          'The spy silently downloads hundreds of emails through OWA—until a federal agency’s audit ledger (`Purview MailItemsAccessed`) reveals someone was reading mail inside the vault without ever signing the front-door guestbook (`Entra SignInLogs`).',
        simpleExplanation:
          'Routing traffic through SoftEther VPN residential exit nodes (198.51.100.119), Storm-0558 invokes /owa/service.svc?action=FindItem and action=GetItem to download sensitive diplomatic and government emails. A Federal Civilian Executive Branch (FCEB) agency detects the intrusion by hunting in Microsoft Purview’s MailItemsAccessed unified audit log (spotting ClientInfoString="Client=OWA;Action=ViaProxy" and AppId 00000002-0000-0ff1-ce00-000000000000 from anomalous VPN IPs with zero matching interactive Entra ID sign-ins).',
        howItWorksInPractice:
          'In response to this federal agency discovery, Microsoft revoked the compromised MSA key, patched cross-realm token validation, and made Purview MailItemsAccessed logging available across standard M365 licensing tiers.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ downloads mailbox items from Node ⑤ (Enterprise Mailboxes) while Node ⑥ (Purview & CISA AA23-193A Hunter) flags the `MailItemsAccessed` anomaly.',
        detectionAndEvidence:
          'Documented in CISA AA23-193A: KQL query on `OfficeActivity` / `CloudAppEvents` where `Operation == "MailItemsAccessed"`, `AppId == "00000002-0000-0ff1-ce00-000000000000"`, and `ClientInfoString` contains `Action=ViaProxy`.',
      },
    ],
  },

  'azure-ad-connect-pass-the-certificate': {
    scenarioId: 'azure-ad-connect-pass-the-certificate',
    briefing: {
      headline: 'Scenario Briefing: Microsoft Entra Connect (`Azure AD Connect`) — `MSOL_` DKM Decryption, DCSync & Seamless SSO Silver Ticket',
      storyAnalogy:
        'Imagine a translator’s desk (`Entra Connect / Azure AD Connect Server`) that sits between a company’s local castle (`On-Premises Active Directory`) and its cloud fortress (`Microsoft Entra ID`). To keep both sides synchronized, the translator keeps a locked desk drawer (`ADSync.mdf -> mms_management_agent` LocalDB table) containing the master skeleton key to the local castle (`MSOL_<hex>` account with `DCSync` rights), and hangs the key to that drawer (`DPAPI cryptKeySet`) right under the desk! If an intruder compromises the translator’s server, they reach under the desk, unlock the drawer with the translator’s own magnifying glass (`mcrypt.dll`), grab the `MSOL_` skeleton key to copy every secret in the local castle—including the `AZUREADSSOACC$` bridge key—and forge golden passes straight into the cloud fortress.',
      plainSummary:
        'Synthesizing research by Dirk-jan Mollema (`_dirkjan` / `AADInternals`), SpecterOps, and Mandiant, this scenario demonstrates why Microsoft Entra Connect (formerly Azure AD Connect) is a critical Tier-0 hybrid identity asset. When an attacker gains local administrator privileges on the Entra Connect server (`CORP-AADC01`), they impersonate `NT SERVICE\\ADSync`, query the local SQL Express `ADSync` database (`mms_management_agent`), load Entra Connect’s `mcrypt.dll` assembly to DPAPI-decrypt the on-premises `MSOL_<hex>` connector account password, use `MSOL_` to execute a **DCSync** attack against the Domain Controller, and extract the `AZUREADSSOACC$` computer account hash to forge **Seamless SSO** Kerberos Silver Tickets for any synced cloud user.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (On-Prem Foothold Operator), query `ADSync.mdf` (`mms_management_agent`) on Node ②/③ (Entra Connect Server `CORP-AADC01`), decrypt the `MSOL_` password via `mcrypt.dll` inside Node ④, and execute `DCSync` + `AZUREADSSOACC$` Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) monitored by Node ⑥ (Defender for Identity & Sentinel SIEM).',
      documentedAdvisory: 'SpecterOps & Dirk-jan Mollema AADInternals Research · Mandiant Hybrid Identity Guidance · MITRE T1556.007 / T1003.006',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1003',
        plainTitle: 'Querying the `ADSync` SQL LocalDB (`mms_management_agent`) as `NT SERVICE\\ADSync` (`T1003`)',
        storyAnalogy:
          'First, the attacker steps into the shoes of the `NT SERVICE\\ADSync` service account on the sync server and opens its private SQL LocalDB ledger (`ADSync.mdf`) to copy out the encrypted credential rows.',
        simpleExplanation:
          'After obtaining local administrator access on the Entra Connect server (CORP-AADC01), the attacker elevates to NT SERVICE\\ADSync (the service account that owns the local SQL Server Express LocalDB instance and the Windows DPAPI user keyset), connects to the named pipe np:\\\\.\\pipe\\LOCALDB#...\\tsql\\query, and queries SELECT private_configuration_xml, encrypted_configuration FROM mms_management_agent alongside keyset_id, instance_id, and entropy from mms_server_configuration.',
        howItWorksInPractice:
          'Many organizations mistakenly place their Entra Connect server in a standard Tier-1 server OU managed by general server administrators, unaware that local admin on Entra Connect equates to Domain Admin + Cloud Global Admin.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Foothold Operator) to Node ②/③ (Entra Connect Server `CORP-AADC01`), and return arrow ⇠#1.2 returning the encrypted XML blobs from `ADSync.mdf`.',
        detectionAndEvidence:
          'Documented by Microsoft & SigmaHQ: Sysmon EventID 1 showing `SqlLocalDB.exe info ADSync` or non-standard processes opening `C:\\Program Files\\Microsoft Azure AD Sync\\Data\\ADSync.mdf`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Loading `mcrypt.dll` in PowerShell to DPAPI-Decrypt the `MSOL_<hex>` Password (`T1552.001`)',
        storyAnalogy:
          'Instead of cracking the encryption by brute force, the attacker loads Entra Connect’s own decryption library (`mcrypt.dll`) in PowerShell and asks it to unlock the `MSOL_` password using the server’s local DPAPI key.',
        simpleExplanation:
          'Running as NT SERVICE\\ADSync, the attacker uses PowerShell reflection (or AADInternals / adconnectdump) to load C:\\Program Files\\Microsoft Azure AD Sync\\Bin\\mcrypt.dll, calls KeyManager.LoadKeySet() (which reads the DPAPI-protected AES key from HKLM\\SOFTWARE\\Microsoft\\Ad Sync\\Shared and unprotects it via CryptUnprotectData), and invokes DecryptBase64ToString() on encrypted_configuration to reveal the plaintext password of the on-premises connector account CORP\\MSOL_9a8b7c6d5e4f.',
        howItWorksInPractice:
          'Because miiserver.exe must decrypt the MSOL_ password unattended whenever the service restarts, the entire decryption chain resides locally on the Entra Connect host.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ loads `mcrypt.dll` and unprotects the DPAPI keyset inside Node ④ (`DPAPI & mcrypt.dll Decryptor`), and ⇠#2.2 outputs the plaintext `MSOL_9a8b7c6d5e4f` password.',
        detectionAndEvidence:
          'Documented by SpecterOps & Mandiant: Sysmon EventID 7 (`ImageLoad`) where `mcrypt.dll` is loaded by any process other than `miiserver.exe` (such as `powershell.exe`).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1556.007',
        plainTitle: 'Executing `MSOL_` DCSync & Forging `AZUREADSSOACC$` Seamless SSO Cloud Tickets (`T1556.007`)',
        storyAnalogy:
          'Because Password Hash Sync is enabled, `MSOL_` has permission to copy every password hash in Active Directory (`DCSync`). The attacker uses `MSOL_` to steal the `AZUREADSSOACC$` bridge key and mints Kerberos Silver Tickets straight into Microsoft Entra ID!',
        simpleExplanation:
          'Because Password Hash Synchronization (PHS) requires the CORP\\MSOL_9a8b7c6d5e4f account to hold Replicating Directory Changes and Replicating Directory Changes All on the domain root, the attacker uses the decrypted MSOL_ credentials to perform a DCSync attack (MS-DRSR DRSGetNCChanges) against CORP-DC01—dumping the NTLM/AES256 hash of the AZUREADSSOACC$ computer account (the shared Kerberos trust bridge created when Entra Seamless Single Sign-On is enabled, allowing the attacker to forge Kerberos Silver Tickets holding any synchronized user’s immutableId and sid to log directly into Entra ID without knowing their password).',
        howItWorksInPractice:
          'Microsoft recommends treating Entra Connect as a Tier-0 asset, disabling Seamless SSO in favor of Primary Refresh Tokens (PRT), and rotating the AZUREADSSOACC$ Kerberos decryption key every 30 days.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `DCSync` and Seamless SSO ticket forgery against Node ⑤ (Domain Controller & Entra ID) while Node ⑥ (Defender for Identity & Sentinel) alerts on EventID 4662.',
        detectionAndEvidence:
          'Documented by Microsoft Defender for Identity: Windows Security EventID 4662 (`DS-Replication-Get-Changes-All` GUID `1131f6ad-9c07-11d1-f79f-00c04fc2dcd2`) initiated by `MSOL_*` from a non-Entra-Connect IP.',
      },
    ],
  },

  'aws-cognito-iam-passrole-privesc': {
    scenarioId: 'aws-cognito-iam-passrole-privesc',
    briefing: {
      headline: 'Scenario Briefing: AWS IAM `iam:PassRole` + `lambda:CreateFunction` Privilege Escalation & CloudTrail `StopLogging`',
      storyAnalogy:
        'Imagine a junior clerk (`ci-dev-deployer`) at a bank who is forbidden from opening the main vault (`no iam:AttachUserPolicy permission`). However, the clerk has two seemingly harmless permissions: they are allowed to build small automated mail-sorting robots (`lambda:CreateFunction`), and they are allowed to clip any existing employee badge onto a robot (`iam:PassRole`). The clerk spots the Bank President’s spare badge (`LambdaAdminDeploymentRole`) hanging on the wall, clips that badge onto a brand-new 5-line Python robot (`metrics-health-sync-tmp`), and presses the robot’s "Start" button (`lambda:InvokeFunction`). Wearing the President’s badge, the robot walks over to HR, promotes the junior clerk to Bank President (`AdministratorAccess`), and unplugs the security cameras (`cloudtrail:StopLogging`)!',
      plainSummary:
        'Grounded in Rhino Security Labs’ canonical AWS IAM Privilege Escalation research, Datadog Security Labs, and MITRE ATT&CK (`T1098.001` / `T1562.008`), this scenario models one of the most common privilege escalation paths in AWS cloud environments. A compromised developer IAM user (`ci-dev-deployer`) lacking administrative rights abuses the intersection of `iam:PassRole`, `lambda:CreateFunction`, and `lambda:InvokeFunction` to create a Python Lambda function bound to a privileged service role (`LambdaAdminDeploymentRole`). When invoked, the Lambda function executes `boto3` calls under the privileged role to attach `arn:aws:iam::aws:policy/AdministratorAccess` to the attacker’s IAM user and disable CloudTrail logging via `cloudtrail:StopLogging`.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Compromised Dev IAM User running `Pacu`), call `CreateFunction` with `iam:PassRole` on Node ②/③ (AWS IAM & Lambda Control Plane), execute the `boto3` payload inside Node ④ (Lambda Firecracker Runtime), and watch `AttachUserPolicy(AdministratorAccess)` + `StopLogging` hit Node ⑤ (AWS Account Admin Plane) detected by Node ⑥ (GuardDuty & Datadog Cloud SIEM).',
      documentedAdvisory: 'Rhino Security Labs AWS IAM Privilege Escalation · Datadog Security Labs · MITRE ATT&CK T1098.001 / T1562.008',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1098.001',
        plainTitle: 'Passing a Privileged IAM Role (`iam:PassRole`) to a Newly Created AWS Lambda Function (`T1098.001`)',
        storyAnalogy:
          'The junior clerk builds a tiny Python robot (`metrics-health-sync-tmp`) and uses `iam:PassRole` to attach the `LambdaAdminDeploymentRole` badge to it.',
        simpleExplanation:
          'Using the compromised ci-dev-deployer access key, the attacker runs Pacu’s iam__privesc_scan module, discovers that the user policy permits iam:PassRole on Resource: "*" alongside lambda:CreateFunction, and invokes aws lambda create-function (binding the existing over-privileged role arn:aws:iam::123456789012:role/LambdaAdminDeploymentRole to a 10-line Python handler named metrics-health-sync-tmp).',
        howItWorksInPractice:
          'Why does AWS require iam:PassRole? Because compute services like Lambda, EC2, ECS, and Glue execute code using the IAM Role attached to them; if iam:PassRole is granted with a wildcard ("*"), any user who can create a compute resource can impersonate any role trusted by that service.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (`ci-dev-deployer`) to Node ②/③ (AWS IAM & Lambda Control Plane), and return arrow ⇠#1.2 confirming `CreateFunction20150331` with `LambdaAdminDeploymentRole`.',
        detectionAndEvidence:
          'Documented by Rhino Security Labs & Datadog: CloudTrail `CreateFunction20150331` event where `requestParameters.role` references an administrative or deployment IAM role.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.003',
        plainTitle: 'Invoking the Lambda Function to Attach `AdministratorAccess` via `boto3` (`T1098.003`)',
        storyAnalogy:
          'The clerk presses the robot’s "Run" button (`aws lambda invoke`). Running with the admin role’s authority, the Python script calls `iam.attach_user_policy` to promote `ci-dev-deployer` to full `AdministratorAccess`.',
        simpleExplanation:
          'The attacker triggers the function via aws lambda invoke --function-name metrics-health-sync-tmp. Inside the AWS Lambda Firecracker microVM, the Python runtime automatically receives temporary STS credentials for LambdaAdminDeploymentRole in its environment variables and executes boto3.client("iam").attach_user_policy(UserName="ci-dev-deployer", PolicyArn="arn:aws:iam::aws:policy/AdministratorAccess") (permanently elevating the attacker’s IAM user to full AWS account administrator).',
        howItWorksInPractice:
          'In CloudTrail, the AttachUserPolicy call appears as originating from AssumedRole/LambdaAdminDeploymentRole/metrics-health-sync-tmp rather than directly from the ci-dev-deployer IAM user.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ executes the Python handler inside Node ④ (Lambda Runtime) against Node ⑤ (AWS IAM Service), and ⇠#2.2 attaches `AdministratorAccess`.',
        detectionAndEvidence:
          'Documented by AWS GuardDuty: `PrivilegeEscalation:IAMUser/AdministrativePermissions` and CloudTrail `AttachUserPolicy` with `policyArn` ending in `:policy/AdministratorAccess` called by a Lambda execution role.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.008',
        plainTitle: 'Disabling AWS CloudTrail Auditing via `cloudtrail:StopLogging` (`T1562.008`)',
        storyAnalogy:
          'Right after promoting the clerk, the robot reaches up and switches off the building’s security camera recorder (`cloudtrail:StopLogging`)—though the camera records the exact hand that flipped the switch!',
        simpleExplanation:
          'To conceal follow-on data theft or resource creation, the Lambda payload (or the newly elevated ci-dev-deployer user) calls boto3.client("cloudtrail").stop_logging(Name="org-audit-trail") (halting CloudTrail management and data event delivery for the regional trail—an action that records one final StopLogging event in CloudTrail and triggers GuardDuty’s Stealth:IAMUser/CloudTrailLoggingDisabled alert).',
        howItWorksInPractice:
          'Organizations prevent even full account administrators from blinding audit logs by configuring an AWS Organizations Trail in a separate management account and applying a Service Control Policy (SCP) that explicitly denies cloudtrail:StopLogging and cloudtrail:DeleteTrail.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ sends `StopLogging` to Node ⑤ (AWS CloudTrail Service) while Node ⑥ (Datadog Cloud SIEM & GuardDuty) fires a critical alert.',
        detectionAndEvidence:
          'Documented by MITRE T1562.008 & AWS GuardDuty: CloudTrail `eventName == "StopLogging"` or `DeleteTrail` and GuardDuty finding `Stealth:IAMUser/CloudTrailLoggingDisabled`.',
      },
    ],
  },

  'sysdig-scarleteel-aws-eks-terraform': {
    scenarioId: 'sysdig-scarleteel-aws-eks-terraform',
    briefing: {
      headline: 'Scenario Briefing: Sysdig SCARLETEEL Cloud Operation — Kubernetes Pod Exploit, S3 `terraform.tfstate` Theft & Cross-Account Pivot',
      storyAnalogy:
        'Imagine a burglar (`SCARLETEEL`) who slips through an open window into a small workshop annex (`Kubernetes Pod in AWS EKS`). The workshop annex only has keys to a hallway supply closet (`S3 DevOps Bucket`). However, sitting inside that supply closet is the master architectural blueprint book (`terraform.tfstate`) that the building’s engineers used to construct the entire corporate campus! Because the blueprint tool (`Terraform`) writes down the actual cleartext combination (`aws_iam_access_key.attributes.secret`) of every vault it builds right inside that book, reading `terraform.tfstate` hands the burglar the permanent master keys to the company’s main production bank vaults across the street.',
      plainSummary:
        'Discovered and analyzed by the Sysdig Threat Research Team (`SCARLETEEL` & `SCARLETEEL 2.0`), Permiso P0 Labs, and Palo Alto Unit 42, this scenario models a sophisticated cloud-native intrusion chain that pivots from a single Kubernetes container into multi-account AWS dominance. After exploiting an internet-facing workload pod in Amazon EKS, the attacker queries the worker node’s Instance Metadata Service (`169.254.169.254`), uses the node role to download `terraform.tfstate` from an S3 backend bucket, extracts plaintext `aws_iam_access_key` secret keys belonging to privileged cross-account administrators, and uses the **Pacu** framework to steal proprietary source code and S3 datasets.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (SCARLETEEL Operator), exploit the public container on Node ②/③ (EKS Workload Pod), download and parse `s3://corp-devops-tfstate-prod/terraform.tfstate` from Node ④ (S3 Terraform State Backend), and replay the extracted `AKIA` admin keys via `Pacu` against Node ⑤ (Peered Production AWS Account) monitored by Node ⑥ (Sysdig Falco & CloudTrail SIEM).',
      documentedAdvisory: 'Sysdig Threat Research Team (SCARLETEEL Report) · Permiso P0 Labs · MITRE ATT&CK T1610 / T1552.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Exploiting an Exposed EKS Workload Pod & Harvesting Node IMDS Credentials (`T1190`)',
        storyAnalogy:
          'The attacker breaks into a web container running inside Kubernetes (`ml-notebook-prod`), drops `aws-cli` into `/tmp`, and asks the underlying EC2 worker node’s metadata service (`169.254.169.254`) for its IAM role token.',
        simpleExplanation:
          'SCARLETEEL exploits a remote code execution flaw on a public-facing Kubernetes workload pod (ml-notebook-prod-6d8f9), downloads static binaries (aws-cli, kubectl, and trufflehog) into /tmp (triggering a Sysdig Falco container runtime drift alert), and queries http://169.254.169.254/latest/meta-data/iam/security-credentials/eks-node-role (which succeeds whenever the EKS worker node’s IMDS hop limit is left at 2 instead of restricted to 1).',
        howItWorksInPractice:
          'On Kubernetes nodes hosted on EC2, pods operate one network router hop inside the node; if HttpPutResponseHopLimit is >= 2, any compromised pod can reach the underlying EC2 worker node’s IMDS endpoint and steal the node-level IAM role.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (SCARLETEEL Operator) to Node ②/③ (EKS Workload Pod), and return arrow ⇠#1.2 harvesting the `eks-node-role` STS token.',
        detectionAndEvidence:
          'Documented by Sysdig TRT: Falco eBPF alert for downloading/executing `aws` or `trufflehog` inside a running container (`container_drift`).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1552.001',
        plainTitle: 'Extracting Plaintext AWS IAM Secret Keys from S3 `terraform.tfstate` Files (`T1552.001`)',
        storyAnalogy:
          'Using the node role to browse S3 buckets, the attacker finds `terraform.tfstate`—a JSON blueprint file that stores every Terraform-created IAM secret key and database password in unencrypted plaintext!',
        simpleExplanation:
          'Using the stolen eks-node-role credentials, the attacker lists accessible S3 buckets, spots the Infrastructure-as-Code state backend (s3://corp-devops-tfstate-prod/prod/terraform.tfstate), and streams the JSON file through grep (because whenever an engineer uses a Terraform resource like aws_iam_access_key or aws_db_instance, Terraform writes the generated SecretAccessKey and master password in cleartext inside the .tfstate JSON file).',
        howItWorksInPractice:
          'As Sysdig highlighted in their SCARLETEEL analysis, Terraform state files are a goldmine for cloud attackers: they not only contain plaintext secrets, but also map out every VPC, account ID, and S3 bucket across the organization.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ executes `s3:GetObject` on Node ④ (S3 Terraform State Backend), and ⇠#2.2 returns the plaintext `terraform-org-admin` `AKIA` key pair from `terraform.tfstate`.',
        detectionAndEvidence:
          'Documented by Sysdig TRT: AWS CloudTrail S3 Data Event `GetObject` on keys ending in `.tfstate` by an EKS worker node role (`eks-node-role`) rather than the CI/CD pipeline role.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Pivoting Across AWS Accounts with `Pacu` to Exfiltrate Proprietary Code & S3 Buckets (`T1078.004`)',
        storyAnalogy:
          'With the master `terraform-org-admin` key from `.tfstate`, the attacker loads the **Pacu** toolkit on Kali Linux, walks into the company’s crown-jewel production AWS account, mints backup keys, and downloads all proprietary code.',
        simpleExplanation:
          'The attacker imports the permanent AKIA access key extracted from terraform.tfstate into the Pacu cloud exploitation framework on their Kali Linux machine (generating a distinctive User-Agent containing "Boto3/... Linux/6.1.0-kali9-amd64"), runs iam__enum_permissions and iam__backdoor_users_keys to create persistent access keys in the peered production AWS account, and executes aws lambda get-function and aws s3 sync to steal proprietary algorithms.',
        howItWorksInPractice:
          'While SCARLETEEL sometimes deploys XMRig miners on compromised Kubernetes nodes, Sysdig proved that cryptomining is often a noisy distraction while the operators exfiltrate high-value intellectual property via S3 and Lambda APIs.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ①/④ into Node ⑤ (Peered Production AWS Account) while Node ⑥ (Sysdig & CloudTrail SIEM) flags the Kali/Pacu `CreateAccessKey` and `GetFunction` calls.',
        detectionAndEvidence:
          'Documented by Sysdig TRT & Permiso: CloudTrail `CreateAccessKey` / `GetFunction` calls with `userAgent` containing `kali` or `pacu` following `terraform.tfstate` access.',
      },
    ],
  },

  'gcp-service-account-hmac-key-pivot': {
    scenarioId: 'gcp-service-account-hmac-key-pivot',
    briefing: {
      headline: 'Scenario Briefing: GCP Service Account Privilege Escalation — `iam.serviceAccountKeys.create` & Default Compute Editor Pivot',
      storyAnalogy:
        'Imagine a cloud office building (`GCP Project`) where every virtual machine comes with a default janitor robot (`<project-number>-compute@developer.gserviceaccount.com`) that was accidentally given a master key to every room in the building (`roles/editor`). A contractor (`ci-runner` service account) doesn’t have access to the financial vault (`gs://corp-financial-ledger-prod`), but their badge allows them to print new ID cards for any robot in the building (`iam.serviceAccountKeys.create`). The contractor walks up to the card printer (`iam.googleapis.com`), prints a brand-new JSON private key card (`loot_key.json`) in the name of the `Editor` janitor robot, puts on that card, and empties the financial vault!',
      plainSummary:
        'Synthesizing research by Mandiant (Google Cloud Threat Intelligence), Wiz Research, and Rhino Security Labs, this scenario models the classic Google Cloud Platform (GCP) IAM privilege escalation chain abusing `iam.serviceAccountKeys.create` (or `iam.serviceAccounts.actAs`) against the over-privileged **Default Compute Engine Service Account** (`<project-number>-compute@developer.gserviceaccount.com`). Because GCP projects historically granted the Default Compute Service Account the broad primitive role `roles/editor`, any identity with project-wide `Service Account Key Admin` permissions can mint a persistent user-managed RSA private key JSON file for that account and inherit full read/write control over Cloud Storage (`GCS`) and BigQuery.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Compromised GCP Workload Caller `ci-runner`), invoke `CreateServiceAccountKey` on Node ②/③ (GCP IAM Control Plane API) targeting Node ④ (Default Compute Service Account with `roles/editor`), and use the downloaded `loot_key.json` to bulk-copy Node ⑤ (GCP Cloud Storage & BigQuery Prod) monitored by Node ⑥ (Google Cloud SCC & Audit Logs).',
      documentedAdvisory: 'Mandiant / Google Cloud IAM Security Best Practices · Wiz Cloud Threat Research · MITRE ATT&CK T1098.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1087.004',
        plainTitle: 'Discovering the Over-Privileged Default Compute Engine Service Account (`T1087.004`)',
        storyAnalogy:
          'First, the attacker lists all service accounts in the GCP project and spots `<project-number>-compute@developer.gserviceaccount.com`, which carries project-wide `roles/editor` permissions.',
        simpleExplanation:
          'Using a compromised low-privilege CI service account (ci-runner@corp-prod.iam.gserviceaccount.com), the attacker runs gcloud iam service-accounts list (calling google.iam.admin.v1.ListServiceAccounts) and identifies 482910492810-compute@developer.gserviceaccount.com (the Default Compute Engine Service Account that GCP automatically creates and historically binds to the primitive role roles/editor, granting read/write access to almost every service in the project).',
        howItWorksInPractice:
          'As Wiz Research documented, unless an organization explicitly enables constraints/iam.automaticIamGrantsForDefaultServiceAccounts, newly created Compute Engine and App Engine default service accounts receive project-wide Editor rights.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (`ci-runner`) to Node ②/③ (GCP IAM API), and return arrow ⇠#1.2 listing `482910492810-compute@developer.gserviceaccount.com`.',
        detectionAndEvidence:
          'Documented by Google Cloud Audit Logs: `google.iam.admin.v1.ListServiceAccounts` called from an external non-GCP IP address (`198.51.100.73`).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.001',
        plainTitle: 'Minting a Persistent User-Managed JSON Key via `iam.serviceAccountKeys.create` (`T1098.001`)',
        storyAnalogy:
          'Because `ci-runner` was granted `Service Account Key Admin` at the project level, it asks GCP’s IAM API to generate and download a fresh RSA private key (`loot_key.json`) for the `Editor` service account.',
        simpleExplanation:
          'Because the ci-runner identity holds roles/iam.serviceAccountKeyAdmin (which includes iam.serviceAccountKeys.create) scoped at the project level rather than restricted to a single non-privileged account, the attacker runs gcloud iam service-accounts keys create loot_key.json --iam-account=482910492810-compute@developer.gserviceaccount.com (causing GCP IAM to generate a 2048-bit RSA key pair, store the public key on the Default Compute Service Account, and download the PKCS#8 private key in loot_key.json to the attacker’s machine).',
        howItWorksInPractice:
          'Unlike short-lived metadata tokens on a GCE VM, a user-managed service account key JSON file does not expire for 10 years by default and can be used from anywhere on the internet unless blocked by VPC Service Controls.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ calls `CreateServiceAccountKey` on Node ④ (Default Compute Service Account), and ⇠#2.2 downloads `loot_key.json` (`keyId 9f8e7d6c5b`).',
        detectionAndEvidence:
          'Documented by Google Cloud SCC & Mandiant: Admin Activity Audit Log `google.iam.admin.v1.CreateServiceAccountKey` where `principalEmail != resourceName`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1530',
        plainTitle: 'Activating `loot_key.json` Outside GCP to Exfiltrate Cloud Storage (`GCS`) Buckets (`T1530`)',
        storyAnalogy:
          'The attacker signs in with `loot_key.json`, exchanges a signed JWT for an `Editor` OAuth2 bearer token (`ya29.*`), and copies the entire `gs://corp-financial-ledger-prod` bucket.',
        simpleExplanation:
          'The attacker runs gcloud auth activate-service-account --key-file=loot_key.json (which signs a JWT assertion locally with the RSA private key and exchanges it at oauth2.googleapis.com/token for a 1-hour OAuth2 access token ya29.* carrying the Default Compute Service Account’s roles/editor permissions) and executes gcloud storage cp -r gs://corp-financial-ledger-prod ./dump/ to exfiltrate 8,900 financial Parquet files.',
        howItWorksInPractice:
          'In GCP Data Access audit logs, when a Compute Engine service account authenticates via a downloaded JSON key rather than the internal GCE metadata server, authenticationInfo.serviceAccountKeyName is populated with the exact key ID—giving defenders a 100% deterministic indicator of key theft.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `storage.objects.get` against Node ⑤ (GCS Bucket) while Node ⑥ (Google Cloud SCC & Chronicle SIEM) alerts on external key usage.',
        detectionAndEvidence:
          'Documented by Mandiant & Google Cloud SCC: Data Access Audit Log `storage.objects.get` by `*-compute@developer.gserviceaccount.com` with non-empty `authenticationInfo.serviceAccountKeyName` from an external IP.',
      },
    ],
  },

  'okta-har-file-session-token-hijack': {
    scenarioId: 'okta-har-file-session-token-hijack',
    briefing: {
      headline: 'Scenario Briefing: Okta Support Case `.har` File Breach — `sid` Session Cookie Replay & Post-MFA Admin Hijack',
      storyAnalogy:
        'Imagine a bank manager (`IT Super Admin`) who notices a minor display glitch on their computer screen while logged into the master vault console (`Okta Admin Console`). To show the vendor’s helpdesk what the glitch looks like, the manager turns on a high-definition video camera (`Chrome DevTools Save all as HAR with content`) that films the screen—and accidentally films a close-up of the live, already-unlocked temporary master keycard (`Cookie: sid=102f8a9c...`) sitting on the desk! When a burglar compromises the helpdesk’s file cabinet, they grab that `.har` recording, 3D-print an exact copy of the `sid` keycard within 30 minutes, walk past both the password guard and the MFA guard because the session is *already open*, and try to mint a permanent master key (`SSWS API Token`).',
      plainSummary:
        'Synthesizing official post-mortems from Okta Security, Cloudflare SIRT, BeyondTrust, and 1Password (October–November 2023), this scenario models how a threat actor breached Okta’s customer support case-management system and harvested unsanitized browser HTTP Archive (`.har`) files uploaded by customer administrators. Because `.har` files record raw HTTP headers including active `Cookie: sid=<session_token>` values from post-MFA administrative sessions, the attacker replayed the stolen `sid` cookies from commercial VPN nodes to hijack active Okta Super Admin sessions, create backdoor accounts, and mint permanent `SSWS` API tokens—until real-time SIRT rules detected a single `externalSessionId` roaming across different Autonomous Systems (`ASNs`).',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Support Case Threat Actor), extract `Cookie: sid=...` from Node ②/③ (Uploaded Browser `.har` Capture), replay the `sid` cookie from a foreign VPN IP into Node ④ (Customer Okta Admin Console), and trace `system.api_token.create` on Node ⑤ (Okta API Tokens) terminated in real time by Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM).',
      documentedAdvisory: 'Okta Support System Security Advisory · Cloudflare SIRT & BeyondTrust Post-Mortems (Oct–Nov 2023) · MITRE T1539 / T1550.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1539',
        plainTitle: 'Harvesting Live `Cookie: sid=...` Tokens from Unsanitized Browser `.har` Captures (`T1539`)',
        storyAnalogy:
          'When an admin saves a `.har` troubleshooting file in Chrome DevTools while logged into Okta, the JSON file records their live post-MFA `sid` session cookie in cleartext.',
        simpleExplanation:
          'Using a compromised Okta support service account, the threat actor downloads HTTP Archive (.har) files attached to customer support tickets and parses the JSON entries[].request.cookies array to extract Cookie: sid=102f8a9c7e4b... (the primary bearer session cookie issued by Okta *after* the Super Administrator has already completed password and FIDO2/Okta Verify Multi-Factor Authentication).',
        howItWorksInPractice:
          'A .har file is not just a screenshot or timing chart; by specification, it is a full JSON archive of every HTTP request and response header, cookie, and POST body transmitted by the browser tab during recording.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Threat Actor) to Node ②/③ (Uploaded `.har` Capture), and return arrow ⇠#1.2 extracting `Cookie: sid=102f8a9c7e4b...`.',
        detectionAndEvidence:
          'Documented by Okta, Cloudflare & BeyondTrust: `.har` JSON files containing `"name": "sid"` and `"X-Okta-XsrfToken"` headers from `*-admin.okta.com`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.004',
        plainTitle: 'Replaying the `sid` Cookie from a Foreign VPN ASN to Bypass MFA (`T1550.004`)',
        storyAnalogy:
          'Because the `sid` cookie represents an already-unlocked session, replaying it from a VPN IP in another country skips the login and MFA screens completely—unless IP binding is turned on.',
        simpleExplanation:
          'Within 30 minutes of the .har file upload, the attacker sends an HTTPS GET request from a commercial VPN exit node (198.51.100.205, ASN 9009) to https://corp-admin.okta.com/admin/dashboard carrying Cookie: sid=102f8a9c7e4b... (hijacking the existing authenticated session trs102f8a9c7e4b without triggering any password check or MFA push notification, which Okta logs as user.session.access_admin_app under the exact same authenticationContext.externalSessionId).',
        howItWorksInPractice:
          'Why did BeyondTrust’s identity policy block the attacker at the console while other tenants allowed access? Because enforcing Admin Session IP Binding or device-bound Okta FastPass policies causes Okta to reject a valid sid cookie the moment the client IP or device posture changes.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ replays `Cookie: sid=...` into Node ④ (Okta Admin Console), and ⇠#2.2 grants Super Admin dashboard access under `externalSessionId=trs102f8a9c7e4b`.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & Okta: Okta System Log showing a single `authenticationContext.externalSessionId` associated with `count_distinct(securityContext.asNumber) > 1` or changing `client.userAgent.os`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1098.001',
        plainTitle: 'Minting an Okta `SSWS` API Token (`system.api_token.create`) & Real-Time SIRT Revocation (`T1098.001`)',
        storyAnalogy:
          'Knowing the stolen browser cookie will expire when the real admin logs out, the attacker rushes to mint a permanent `SSWS` API token—until the SOC’s ASN-roaming detector fires and kills both the session and the token!',
        simpleExplanation:
          'Because the stolen sid cookie is tied to the victim admin’s browser session lifetime, the attacker immediately navigates to Security -> API -> Tokens in the Okta Admin Console to invoke system.api_token.create (minting a static SSWS bearer token named "BackupSyncToken" and creating a secondary Super Admin user—which Cloudflare SIRT detected in real time via SIEM alerts on session ASN roaming and neutralized by calling DELETE /api/v1/users/{id}/sessions and revoking all newly created API tokens).',
        howItWorksInPractice:
          'Following this incident, Cloudflare released an open-source client-side HAR Sanitizer (har-sanitizer.pages.dev) that automatically strips Cookie, Set-Cookie, and Authorization values before engineers share .har files.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ calls `system.api_token.create` on Node ⑤ (Okta API Tokens) while Node ⑥ (Cloudflare/BeyondTrust SIRT SIEM) detects the ASN jump and revokes the session.',
        detectionAndEvidence:
          'Documented by Cloudflare SIRT & BeyondTrust: Okta System Log `system.api_token.create`, `user.account.privilege.grant`, or `system.idp.lifecycle.create` following an ASN change on `externalSessionId`.',
      },
    ],
  },
};
