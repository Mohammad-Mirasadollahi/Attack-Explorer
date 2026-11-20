import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-postgresql-copy-from-program-pg-log-auditd-trace',
    title: 'PostgreSQL Security & SigmaHQ DFIR — PostgreSQL COPY FROM PROGRAM & Large Object (pg_largeobject) Execution Forensics',
    category: 'NETWORK_WEB',
    mitreId: 'T1190',
    description:
      'Grounded in official PostgreSQL Security Documentation (CVE-2019-9193 / pg_execute_server_program role privilege), Rapid7 research, and SigmaHQ detection rules: an attacker with superuser or pg_execute_server_program credentials invokes COPY ... FROM PROGRAM (or writes an ELF shared object via lo_import/lo_export in pg_largeobject and loads it via CREATE FUNCTION ... AS), leaving forensic artifacts in postgresql.log, pg_stat_activity, and Linux auditd (postgres spawning /bin/sh -c).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'PostgreSQL Wire Client (:5432)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'libpq / pg_hba.conf Auth', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'postgres Backend Process', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'postgresql.log & Linux auditd', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'popen("/bin/sh -c") Child', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Privileged Role Authentication & pg_execute_server_program Check in postgresql.log',
        narration:
          'The actor authenticates to TCP 5432 as the postgres superuser (or a role granted pg_execute_server_program) due to a permissive trust/md5 entry in pg_hba.conf or leaked connection string. With log_connections=on, postgresql.log records the remote IP, port, database role, and authentication method.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1078 - Valid Accounts: PostgreSQL Superuser Role)',
        technicalCommands: [
          'postgresql.conf: log_connections = on, log_disconnections = on, log_statement = \'ddl\'',
          'postgresql.log: connection authorized: user=postgres database=template1 application_name=psql',
        ],
        defenseMitigation:
          'Enforce scram-sha-256 + clientcert authentication in pg_hba.conf, never grant superuser or pg_execute_server_program to application roles, and enable pgaudit (pgaudit.log = \'write, ddl, role, misc\').',
        logs: [
          {
            id: 'dfir-pg-1',
            timestamp: '06:04:11.102',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 5432,
            ProcessName: 'postgres',
            CommandLine: 'postgres: postgres template1 10.10.4.29(49182) authentication',
            raw: '2026-11-03 06:04:11.102 UTC [7412] LOG:  connection received: host=10.10.4.29 port=49182 | 2026-11-03 06:04:11.118 UTC [7412] LOG:  connection authorized: user=postgres database=template1 SSL enabled (protocol=TLSv1.3)',
            parsedFields: {
              LogFile: '/var/lib/pgsql/16/data/log/postgresql-Mon.log',
              BackendPid: '7412',
              DatabaseUser: 'postgres (Superuser / pg_execute_server_program)',
              ClientIp: '10.10.4.29',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: COPY ... FROM PROGRAM OS Command Execution & Linux auditd /bin/sh Child Trace',
        narration:
          'The actor executes COPY cmd_exec FROM PROGRAM \'id; uname -a\' (introduced in PostgreSQL 9.3, tracked under CVE-2019-9193 as a feature design risk). Internally, the postgres backend process (PID 7412, running as uid=26(postgres)) invokes popen(), which spawns /bin/sh -c—immediately captured by Linux auditd execve rules where ppid belongs to /usr/pgsql-16/bin/postgres.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Execution (T1059.004 - Unix Shell Spawned by postgres Backend)',
        technicalCommands: [
          'SQL Statement: CREATE TEMP TABLE cmd_out(t text); COPY cmd_out FROM PROGRAM \'id; hostname\';',
          'Linux auditd SYSCALL: syscall=59 (execve) ppid=7412 (postgres) uid=26 (postgres) exe="/usr/bin/bash"',
        ],
        defenseMitigation:
          'Alert on any Linux auditd execve (syscall 59) event where the parent process is postgres / postmaster and the child executable is /bin/sh, /bin/bash, curl, wget, or python.',
        logs: [
          {
            id: 'dfir-pg-2',
            timestamp: '06:04:15.512',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 59,
            ProcessName: 'postgres',
            CommandLine: 'sh -c id; hostname (Spawned by postgres PID 7412 via COPY FROM PROGRAM)',
            raw: 'type=SYSCALL msg=audit(1762149855.512:7104): arch=c000003e syscall=59 (execve) success=yes ppid=7412 pid=7419 uid=26 euid=26 comm="sh" exe="/usr/bin/bash" | pgaudit_log: AUDIT: SESSION,1,1,MISC,COPY,,,COPY cmd_out FROM PROGRAM \'id; hostname\'',
            parsedFields: {
              AuditSource: 'Linux auditd + PostgreSQL pgaudit Extension',
              ParentProcess: '/usr/pgsql-16/bin/postgres (PID 7412, uid=26)',
              SpawnedChild: '/bin/sh -c id; hostname',
              SqlFeatureAbused: 'COPY ... FROM PROGRAM (CVE-2019-9193 Context)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Large Object (pg_largeobject / lo_export) Shared Library Drop & Dynamic C Function Load',
        narration:
          'Alternatively, if COPY FROM PROGRAM is monitored, an attacker chunks an ELF shared library (.so with PG_MODULE_MAGIC) into the pg_largeobject catalog table via lo_from_bytea / lo_put, exports it to /tmp/pg_ext.so via SELECT lo_export(loid, \'/tmp/pg_ext.so\'), and loads it into the postgres process space via CREATE OR REPLACE FUNCTION sys_eval(text) RETURNS text AS \'/tmp/pg_ext.so\' LANGUAGE C STRICT.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Persistence (T1505.001 - PostgreSQL C-Language Dynamic Function Extension)',
        technicalCommands: [
          'SQL Forensics: SELECT loid, pageno, encode(data, \'hex\') FROM pg_largeobject;',
          'Catalog Forensics: SELECT proname, prosrc, probin FROM pg_proc WHERE prolang = (SELECT oid FROM pg_language WHERE lanname = \'c\') AND probin NOT LIKE \'$libdir/%\';',
        ],
        defenseMitigation:
          'Audit pg_proc for any C-language function whose probin path points outside $libdir (such as /tmp/ or /var/lib/pgsql/) and inspect pg_largeobject for unexpected ELF (7f 45 4c 46) or PE (4d 5a) headers.',
        logs: [
          {
            id: 'dfir-pg-3',
            timestamp: '06:04:22.890',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 200,
            ProcessName: 'postgres',
            CommandLine: 'pg_proc C-Language function load: probin=/tmp/pg_ext.so (PG_MODULE_MAGIC)',
            raw: 'pgaudit_ddl: AUDIT: SESSION,2,1,DDL,CREATE FUNCTION,FUNCTION,public.sys_eval,"CREATE OR REPLACE FUNCTION sys_eval(text) RETURNS text AS \'/tmp/pg_ext.so\', \'sys_eval\' LANGUAGE C STRICT;" | pg_largeobject loid=16492 magic=7f454c46 (ELF)',
            parsedFields: {
              CatalogTable: 'pg_proc (probin="/tmp/pg_ext.so") & pg_largeobject (loid=16492)',
              BinaryMagic: '7F 45 4C 46 (ELF Shared Object with PG_MODULE_MAGIC)',
              MitreTechnique: 'T1505.001 (Database Stored Procedure / C Extension)',
            },
          },
        ],
      },
    ],
  };
