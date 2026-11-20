import type { CategoryStandardPatchMap } from './types';

/**
 * Category 3C — NETWORK_WEB (DFIR Telemetry Scenarios, 7 scenarios).
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 with continuous
 * jargon-free physical metaphors and 4-pair Story-to-Technical keys.
 */
export const CATEGORY_03C_NETWORK_WEB_DFIR_PATCHES: CategoryStandardPatchMap = {
  'dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing': {
    briefing: {
      storyAnalogy:
        'A covert courier disguises every sealed dispatch pouch to look like ordinary office mail, yet the unique way they knock at the gate, the blank default seal printed by their remote warehouse, and the rhythmic ticking of their hourly pickups expose the secret route to observant harbor inspectors.',
      storyMappings: [
        {
          storyTerm: 'Unique way of knocking',
          technicalTerm: 'TLS ClientHello JA3 and JA4 handshake fingerprints',
        },
        {
          storyTerm: 'Blank default warehouse seal',
          technicalTerm: 'JA3S ServerHello and default Java KeyStore X.509 certificate',
        },
        {
          storyTerm: 'Rhythmic hourly pickups',
          technicalTerm: 'Periodic beacon sleep and jitter intervals in conn.log',
        },
        {
          storyTerm: 'Harbor network inspectors',
          technicalTerm: 'Zeek ssl.log and conn.log forensic telemetry',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Even when the courier swaps envelopes to mimic a famous delivery company, harbor inspectors record the exact sequence of handshakes and lock preferences used at the gate, catching a mismatch against genuine browser traffic.',
        storyMappings: [
          {
            storyTerm: 'Recorded handshake sequence',
            technicalTerm: 'JA3 MD5 and JA4 client TLS fingerprint hashes',
          },
          {
            storyTerm: 'Swapped outer envelope',
            technicalTerm: 'Malleable C2 spoofed HTTP headers and User-Agent',
          },
          {
            storyTerm: 'Harbor gate ledger',
            technicalTerm: 'Zeek ssl.log encrypted session metadata',
          },
          {
            storyTerm: 'Genuine browser crowd',
            technicalTerm: 'Baseline enterprise browser TLS cipher suite profiles',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inspectors next examine how the distant warehouse answers the knock and inspect its wax return stamp, spotting a generic blank seal and matching reply pattern characteristic of an out-of-the-box command post.',
        storyMappings: [
          {
            storyTerm: 'Distant warehouse reply pattern',
            technicalTerm: 'JA3S TLS ServerHello response fingerprint',
          },
          {
            storyTerm: 'Generic blank wax stamp',
            technicalTerm: 'Self-signed or default Java KeyStore X.509 certificate',
          },
          {
            storyTerm: 'Matched pair check',
            technicalTerm: 'Correlating JA3 client hash with JA3S server hash',
          },
          {
            storyTerm: 'Out-of-the-box command post',
            technicalTerm: 'Cobalt Strike Team Server TLS listener',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, inspectors plot every departure timestamp on a wall chart and notice the courier stepping out on a steady drumbeat with only small randomized pauses, confirming an automated check-in loop rather than human browsing.',
        storyMappings: [
          {
            storyTerm: 'Departure timestamp chart',
            technicalTerm: 'Inter-arrival time histogram built from Zeek conn.log',
          },
          {
            storyTerm: 'Steady automated drumbeat',
            technicalTerm: 'Configured C2 sleep interval with bounded jitter',
          },
          {
            storyTerm: 'Small randomized pauses',
            technicalTerm: 'Statistical jitter percentage around a fixed mean',
          },
          {
            storyTerm: 'Human browsing crowd',
            technicalTerm: 'Irregular bursty user web traffic distribution',
          },
        ],
      },
    },
  },

  'dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell': {
    briefing: {
      storyAnalogy:
        'A busy postal depot leaves its public storefront wall spotless so routine walk-through checks find no suspicious flyers, yet an insider registers a hidden sorting desk deep inside the basement mail chute that intercepts specific letters before they ever reach the front counter.',
      storyMappings: [
        {
          storyTerm: 'Busy postal depot',
          technicalTerm: 'Microsoft IIS web server and w3wp.exe worker process',
        },
        {
          storyTerm: 'Hidden sorting desk ledger',
          technicalTerm: 'Malicious module registered in applicationHost.config',
        },
        {
          storyTerm: 'Basement mail chute',
          technicalTerm: 'Kernel-mode HTTP.sys URI UrlGroup listener',
        },
        {
          storyTerm: 'Live basement inspection',
          technicalTerm: 'netsh http show servicestate and CLR AppDomain triage',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Inspectors open the depot master staffing roster and spot a newly added sorting clerk assigned to inspect every incoming envelope, even though no corresponding script paper sits on the public bulletin board.',
        storyMappings: [
          {
            storyTerm: 'Depot master staffing roster',
            technicalTerm: 'IIS applicationHost.config global module list',
          },
          {
            storyTerm: 'Newly added sorting clerk',
            technicalTerm: 'Rogue native DLL or managed IIS HTTP module',
          },
          {
            storyTerm: 'Spotless bulletin board',
            technicalTerm: 'Absence of traditional .aspx webshell files on disk',
          },
          {
            storyTerm: 'Roster change alert',
            technicalTerm: 'Sysmon file modification and IIS configuration logs',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Digging deeper into the basement conveyor switchboard, investigators discover a private chute reservation claiming a secret corridor address directly inside the building core driver.',
        storyMappings: [
          {
            storyTerm: 'Basement conveyor switchboard',
            technicalTerm: 'Windows kernel-mode HTTP.sys request router',
          },
          {
            storyTerm: 'Private chute reservation',
            technicalTerm: 'Registered HTTP.sys URI UrlGroup prefix',
          },
          {
            storyTerm: 'Switchboard operational log',
            technicalTerm: 'Microsoft-Windows-HttpService/Operational event log',
          },
          {
            storyTerm: 'Front counter bypass',
            technicalTerm: 'Requests intercepted before standard IIS site logging',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Rather than trusting paper folders, responders run a live roll call of every active chute reservation and inspect the working trays inside the mailroom clerks hands to expose the memory-resident helper.',
        storyMappings: [
          {
            storyTerm: 'Live chute roll call',
            technicalTerm: 'netsh http show servicestate active queue listing',
          },
          {
            storyTerm: 'Clerk working trays',
            technicalTerm: 'Live .NET CLR AppDomain loaded assemblies in w3wp.exe',
          },
          {
            storyTerm: 'Memory-resident helper',
            technicalTerm: 'In-memory IIS webshell without a disk-backed page',
          },
          {
            storyTerm: 'Depot worker process',
            technicalTerm: 'Active IIS w3wp.exe host process',
          },
        ],
      },
    },
  },

  'dfir-exchange-ews-autodiscover-proxylogon-iis-forensics': {
    briefing: {
      storyAnalogy:
        'Forensic auditors reconstruct a break-in at a corporate mail building by tracing three linked clues: first the front-desk forwarding slips that misrouted a stranger into the rear office, next the management ledger recording a tampered address-book path, and finally the fresh workshop printouts proving a hidden control page ran commands.',
      storyMappings: [
        {
          storyTerm: 'Front-desk forwarding slips',
          technicalTerm: 'Exchange Frontend HttpProxy routing logs',
        },
        {
          storyTerm: 'Tampered address-book path',
          technicalTerm: 'MSExchange Management Set-OabVirtualDirectory EventID 1',
        },
        {
          storyTerm: 'Fresh workshop printouts',
          technicalTerm: 'ASP.NET dynamic compilation in Temporary ASP.NET Files',
        },
        {
          storyTerm: 'Mailroom clerk running tools',
          technicalTerm: 'w3wp.exe spawning unexpected command child processes',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.',
        storyMappings: [
          {
            storyTerm: 'Reception counter logbook',
            technicalTerm: 'V15\\Logging\\HttpProxy\\*\\*.log proxy audit files',
          },
          {
            storyTerm: 'Static graphic shelf address',
            technicalTerm: 'Crafted /ecp/*.js path triggering SSRF routing',
          },
          {
            storyTerm: 'Rear backend mail engine',
            technicalTerm: 'Internal Exchange backend RPC and EWS services',
          },
          {
            storyTerm: 'Strange routing stamp',
            technicalTerm: 'X-BEResource cookie directing arbitrary backend calls',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable page script.',
        storyMappings: [
          {
            storyTerm: 'Supervisor office ledger',
            technicalTerm: 'MSExchange Management EventID 1 administrative log',
          },
          {
            storyTerm: 'Rewritten address-book link',
            technicalTerm: 'Set-OabVirtualDirectory ExternalUrl payload injection',
          },
          {
            storyTerm: 'Resetting the directory',
            technicalTerm: 'Reset-OabVirtualDirectory writing payload to webroot',
          },
          {
            storyTerm: 'Hidden page script',
            technicalTerm: 'Dropped ASPX webshell embedded inside OAB config',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk carrying heavy workshop tools.',
        storyMappings: [
          {
            storyTerm: 'Compiled proof plates',
            technicalTerm: 'Compiled DLLs in Temporary ASP.NET Files cache',
          },
          {
            storyTerm: 'Mailroom clerk process',
            technicalTerm: 'IIS w3wp.exe worker handling the webshell request',
          },
          {
            storyTerm: 'Heavy workshop tools',
            technicalTerm: 'Spawned cmd.exe, powershell.exe, or credential dumpers',
          },
          {
            storyTerm: 'Deleted wall flyer',
            technicalTerm: 'Removed source .aspx file still evidenced by build artifacts',
          },
        ],
      },
    },
  },

  'dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace': {
    briefing: {
      storyAnalogy:
        'A vault bookkeeper is supposed to only file and fetch account ledgers, never operate the building workshop. Investigators trace an intrusion where a privileged caller unlocks the bookkeeper hidden workshop switch, loads two helper toolkits to run floor commands, and installs a permanent custom stamp inside the vault catalog.',
      storyMappings: [
        {
          storyTerm: 'Vault bookkeeper engine',
          technicalTerm: 'Microsoft SQL Server sqlservr.exe database service',
        },
        {
          storyTerm: 'Hidden workshop switch',
          technicalTerm: 'sp_configure enabling advanced options and xp_cmdshell',
        },
        {
          storyTerm: 'Two helper toolkits',
          technicalTerm: 'Loaded xplog70.dll and odsole70.dll server modules',
        },
        {
          storyTerm: 'Permanent custom catalog stamp',
          technicalTerm: 'Malicious CLR assembly persisted in sys.assemblies',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'First, investigators inspect the vault configuration book and see two safety locks flipped open in rapid succession: one exposing hidden settings and a second enabling the direct workshop command lever.',
        storyMappings: [
          {
            storyTerm: 'First safety lock',
            technicalTerm: 'sp_configure show advanced options set to 1',
          },
          {
            storyTerm: 'Direct workshop command lever',
            technicalTerm: 'sp_configure xp_cmdshell or Ole Automation enabled',
          },
          {
            storyTerm: 'Vault configuration book',
            technicalTerm: 'MSSQL ERRORLOG and EventID 15457 reconfiguration logs',
          },
          {
            storyTerm: 'Privileged caller badge',
            technicalTerm: 'Compromised sysadmin or sa database account',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Moments later, the bookkeeper pulls two specialized hardware libraries off the shelf—one built for shell commands and another for external automation objects—and immediately spawns an office command console directly beneath the ledger desk.',
        storyMappings: [
          {
            storyTerm: 'Shell command toolkit',
            technicalTerm: 'xplog70.dll module backing xp_cmdshell execution',
          },
          {
            storyTerm: 'External automation toolkit',
            technicalTerm: 'odsole70.dll module backing sp_OACreate execution',
          },
          {
            storyTerm: 'Bookkeeper parent process',
            technicalTerm: 'sqlservr.exe database engine binary',
          },
          {
            storyTerm: 'Office command console',
            technicalTerm: 'Child cmd.exe or powershell.exe spawned by sqlservr.exe',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To maintain quiet access even if the workshop lever is locked again, the intruder registers an unsigned custom extension right inside the vault catalog while leaving a clear audit trail inside the automatic rolling trace reel.',
        storyMappings: [
          {
            storyTerm: 'Unsigned custom extension',
            technicalTerm: 'Malicious .NET CLR stored procedure in sys.assemblies',
          },
          {
            storyTerm: 'Vault catalog registry',
            technicalTerm: 'Database system catalog tables storing assemblies',
          },
          {
            storyTerm: 'Automatic rolling trace reel',
            technicalTerm: 'MSSQL Default Trace (.trc) forensic log files',
          },
          {
            storyTerm: 'Re-locked workshop lever',
            technicalTerm: 'Attacker disabling xp_cmdshell to hide initial traces',
          },
        ],
      },
    },
  },

  'dfir-postgresql-copy-from-program-pg-log-auditd-trace': {
    briefing: {
      storyAnalogy:
        'An archive database manager normally imports and exports neat index tables, yet one special shipping privilege lets it feed a table straight from an external workshop tool. Investigators track a privileged sign-in using that import feature to run live floor commands and export a custom binary library right onto the archive disk.',
      storyMappings: [
        {
          storyTerm: 'Archive database manager',
          technicalTerm: 'PostgreSQL database server daemon (postgres)',
        },
        {
          storyTerm: 'Special shipping privilege',
          technicalTerm: 'Superuser or pg_execute_server_program role membership',
        },
        {
          storyTerm: 'External workshop import command',
          technicalTerm: 'SQL COPY ... FROM PROGRAM OS command execution',
        },
        {
          storyTerm: 'Exported custom binary library',
          technicalTerm: 'Shared object written via pg_largeobject and lo_export',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Investigators open the archive reception register and spot a remote manager signing in with master clearance, then immediately querying the staff permission chart to confirm authority to run external workshop tools.',
        storyMappings: [
          {
            storyTerm: 'Archive reception register',
            technicalTerm: 'PostgreSQL server authentication and connection logs',
          },
          {
            storyTerm: 'Master clearance badge',
            technicalTerm: 'Superuser or pg_execute_server_program role',
          },
          {
            storyTerm: 'Staff permission chart',
            technicalTerm: 'pg_roles and pg_auth_members privilege check',
          },
          {
            storyTerm: 'Remote manager connection',
            technicalTerm: 'External client TCP session on port 5432',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the caller submits a table-import slip instructing the archive clerk to launch a command-line helper and pour its printed output straight into a temporary holding table—an action immediately filmed by the building security camera.',
        storyMappings: [
          {
            storyTerm: 'Table-import command slip',
            technicalTerm: 'COPY table FROM PROGRAM SQL statement',
          },
          {
            storyTerm: 'Launched command-line helper',
            technicalTerm: 'postgres worker spawning /bin/sh child process',
          },
          {
            storyTerm: 'Temporary holding table',
            technicalTerm: 'Scratch SQL table capturing command stdout',
          },
          {
            storyTerm: 'Building security camera',
            technicalTerm: 'Linux auditd execve process telemetry',
          },
        ],
      },
      3: {
        storyAnalogy:
          'For stealthier repeat execution, the caller stores binary library pieces inside the archive bulk-storage vault, writes them out as a fresh file on disk, and loads that custom tool directly inside the database worker.',
        storyMappings: [
          {
            storyTerm: 'Bulk-storage vault',
            technicalTerm: 'PostgreSQL pg_largeobject binary storage table',
          },
          {
            storyTerm: 'Writing pieces onto disk',
            technicalTerm: 'lo_export() dropping a compiled shared library (.so)',
          },
          {
            storyTerm: 'Loading the custom tool',
            technicalTerm: 'CREATE FUNCTION loading dynamic C shared library',
          },
          {
            storyTerm: 'Forensic vault audit',
            technicalTerm: 'Querying pg_largeobject_metadata and pg_proc entries',
          },
        ],
      },
    },
  },

  'dfir-sharepoint-iis-viewstate-losformatter-deserialization': {
    briefing: {
      storyAnalogy:
        'A web office sends visitors a folded state receipt stamped with a secret office seal so the clerk trusts any receipt brought back later. Once an outsider steals the secret sealing key from the office supply book, they forge a spring-loaded receipt that unpacks straight into a live command terminal under the clerk badge.',
      storyMappings: [
        {
          storyTerm: 'Folded state receipt',
          technicalTerm: 'ASP.NET hidden __VIEWSTATE form parameter',
        },
        {
          storyTerm: 'Secret sealing key',
          technicalTerm: 'Exposed web.config <machineKey> validationKey',
        },
        {
          storyTerm: 'Spring-loaded forged receipt',
          technicalTerm: 'Signed LosFormatter / TypeConfuseDelegate gadget payload',
        },
        {
          storyTerm: 'Swapping the office seal',
          technicalTerm: 'MachineKey rotation and w3wp.exe process triage',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk accepted the forged signature.',
        storyMappings: [
          {
            storyTerm: 'Configuration binder',
            technicalTerm: 'Application web.config containing <machineKey>',
          },
          {
            storyTerm: 'Leaked office sealing stamp',
            technicalTerm: 'Compromised or publicly known validationKey secret',
          },
          {
            storyTerm: 'Small test receipts',
            technicalTerm: 'Probing HTTP POST requests carrying signed __VIEWSTATE',
          },
          {
            storyTerm: 'Front desk arrival book',
            technicalTerm: 'IIS W3SVC access logs tracking POST lengths and status',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts. Trusting the valid wax seal, the office clerk unfolds the receipt and accidentally triggers arbitrary code.',
        storyMappings: [
          {
            storyTerm: 'Validly stamped bulky receipt',
            technicalTerm: 'HMAC-signed malicious __VIEWSTATE POST payload',
          },
          {
            storyTerm: 'Receipt unfolding engine',
            technicalTerm: 'ASP.NET ObjectStateFormatter / LosFormatter deserializer',
          },
          {
            storyTerm: 'Self-triggering gadget parts',
            technicalTerm: 'TypeConfuseDelegate .NET deserialization gadget chain',
          },
          {
            storyTerm: 'Unexpected desk exception',
            technicalTerm: 'Application Event Log and SharePoint ULS error traces',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Endpoint sensors catch the web clerk suddenly launching system maintenance tools. Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop working permanently.',
        storyMappings: [
          {
            storyTerm: 'Web clerk worker',
            technicalTerm: 'IIS w3wp.exe worker spawning cmd.exe or powershell.exe',
          },
          {
            storyTerm: 'Endpoint motion sensor',
            technicalTerm: 'Sysmon EventID 1 process creation lineage alert',
          },
          {
            storyTerm: 'Replacing the sealing stamp',
            technicalTerm: 'Rotating ASP.NET MachineKey across the SharePoint farm',
          },
          {
            storyTerm: 'Branch desk synchronization',
            technicalTerm: 'Running Update-SPMachineKey and restarting IIS pools',
          },
        ],
      },
    },
  },

  'dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment': {
    briefing: {
      storyAnalogy:
        'A Java application building leaves an internal freight elevator door open directly to the public street. An outsider reaches through that freight shaft to read the building staff passcode sheet, uses those passcodes at the package loading dock to upload a disguised web bundle, and triggers freshly compiled control pages inside the workshop.',
      storyMappings: [
        {
          storyTerm: 'Open street-facing freight shaft',
          technicalTerm: 'Exposed Tomcat AJP/1.3 connector on TCP port 8009',
        },
        {
          storyTerm: 'Staff passcode sheet',
          technicalTerm: 'Read WEB-INF/web.xml or tomcat-users.xml (CVE-2020-1938)',
        },
        {
          storyTerm: 'Disguised package bundle',
          technicalTerm: 'Malicious WAR archive deployed via /manager/text/deploy',
        },
        {
          storyTerm: 'Freshly compiled control page',
          technicalTerm: 'Jasper-compiled *_jsp.class execution inside the JVM',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Reaching straight into the unguarded freight shaft, the outsider tags a routine delivery slip with an internal storage path, persuading the elevator clerk to hand back private configuration blueprints from behind the locked wall.',
        storyMappings: [
          {
            storyTerm: 'Unguarded freight shaft',
            technicalTerm: 'Unauthenticated AJP/1.3 port 8009 listener',
          },
          {
            storyTerm: 'Tagged internal storage path',
            technicalTerm: 'javax.servlet.include.path_info request attribute',
          },
          {
            storyTerm: 'Private configuration blueprints',
            technicalTerm: 'Arbitrary webapp file read under WEB-INF/',
          },
          {
            storyTerm: 'Freight shaft flaw',
            technicalTerm: 'Tomcat Ghostcat file read vulnerability (CVE-2020-1938)',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Armed with valid manager passcodes, the outsider walks up to the package loading dock and uploads a zipped application crate containing a hidden web control page.',
        storyMappings: [
          {
            storyTerm: 'Package loading dock',
            technicalTerm: 'Authenticated PUT /manager/text/deploy endpoint',
          },
          {
            storyTerm: 'Zipped application crate',
            technicalTerm: 'Uploaded malicious Web Application Archive (.war)',
          },
          {
            storyTerm: 'Valid manager passcodes',
            technicalTerm: 'Compromised manager-script role credentials',
          },
          {
            storyTerm: 'Dock arrival journal',
            technicalTerm: 'Tomcat localhost_access_log HTTP deployment trace',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The moment the outsider visits their newly unpacked page, the building automatic translator compiles the script into live machine instructions inside the work directory and launches an operating system command shell.',
        storyMappings: [
          {
            storyTerm: 'Automatic script translator',
            technicalTerm: 'Tomcat Jasper JSP-to-bytecode compiler',
          },
          {
            storyTerm: 'Compiled machine instructions',
            technicalTerm: 'Generated work/Catalina/localhost/*/*_jsp.class artifacts',
          },
          {
            storyTerm: 'Application runtime engine',
            technicalTerm: 'Java Virtual Machine (java) process running Tomcat',
          },
          {
            storyTerm: 'Launched command shell',
            technicalTerm: 'Unexpected /bin/sh or cmd.exe child process under java',
          },
        ],
      },
    },
  },
};
