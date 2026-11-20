import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'db-mongodb-mongobleed-unauthenticated-replication-oplog-audit',
    title: 'MongoDB Official Security Guide, CISA & MITRE T1530 — Exposed MongoDB Wire Protocol Port 27017 & local.oplog.rs Audit Forensics',
    category: 'DATABASE_DATA_PLATFORMS',
    mitreId: 'T1213',
    description:
      'Grounded in the MongoDB Official Security Checklist, CISA database exposure advisories, and MITRE ATT&CK T1213 / T1530: database forensic analysts investigate MongoDB instances bound to 0.0.0.0:27017 without security.authorization enabled, analyze OP_MSG wire protocol commands (listDatabases, find on local.oplog.rs), and correlate MongoDB structured JSON audit logs.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'External Wire Protocol Client', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'mongod TCP Socket (:27017)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'MongoDB ReplicaSet Primary', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'MongoDB Audit Log & SIEM', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'local.oplog.rs & Collections', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Unauthenticated OP_MSG Handshake (isMaster / hello) & listDatabases Enumeration',
        narration:
          'When a MongoDB daemon (mongod) is started with net.bindIp: 0.0.0.0 and security.authorization: disabled, an external client connects to TCP port 27017 and sends OP_MSG (opcode 2013) hello and listDatabases commands, receiving the complete catalog of database names and byte sizes without authentication.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Discovery (T1046 - Network Service Discovery)',
        technicalCommands: [
          'jq \'. | select(.id==20426 or .attr.command.listDatabases==1)\' /var/log/mongodb/mongod.log',
          'ss -tulpn | grep 27017',
        ],
        defenseMitigation:
          'Configure security.authorization: enabled in /etc/mongod.conf, bind net.bindIp strictly to localhost (127.0.0.1) or private VPC subnets, and require SCRAM-SHA-256 or X.509 mutual TLS authentication.',
        logs: [
          {
            id: 'db-mongodb-1',
            timestamp: '05:18:04.115',
            source: 'Linux Audit',
            severity: 'high',
            EventCode: 51800,
            ProcessName: 'mongod',
            CommandLine: 'mongod OP_MSG {"listDatabases":1,"$db":"admin"} client=198.51.100.73:52190',
            raw: 'mongod_json: {"t":{"$date":"2026-11-17T05:18:04.115Z"},"s":"I","c":"NETWORK","id":51800,"ctx":"conn412","msg":"client metadata","attr":{"remote":"198.51.100.73:52190","doc":{"driver":{"name":"PyMongo","version":"4.6.1"}}}}',
            parsedFields: {
              WireProtocolOpcode: 'OP_MSG (2013) — hello & listDatabases: 1',
              ClientDriverMetadata: 'PyMongo 4.6.1 from 198.51.100.73:52190',
              ConfigVulnerability: 'net.bindIp: 0.0.0.0 with security.authorization: disabled',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Replication Oplog (local.oplog.rs) Inspection for Historical Credentials & Tokens',
        narration:
          'Beyond active collections, the client queries the MongoDB replication operation log (local.oplog.rs), which stores a rolling history of every insert, update, and delete operation across the replica set—allowing recovery of recently deleted API keys, session JWTs, and password reset tokens.',
        activeNodes: ['firewall', 'target', 'ad'],
        mitreTactic: 'Credential Access (T1552 - Unsecured Credentials)',
        technicalCommands: [
          'jq \'. | select(.attr.ns=="local.oplog.rs")\' /var/log/mongodb/mongod.log',
          'jq \'. | select(.atype=="authCheck" and .param.ns=="local.oplog.rs")\' /var/log/mongodb/auditLog.json',
        ],
        defenseMitigation:
          'Enable MongoDB Enterprise/Percona Audit Logging (auditLog.destination: file, auditLog.filter) to capture all authCheck events against admin, config, and local.oplog.rs namespaces.',
        logs: [
          {
            id: 'db-mongodb-2',
            timestamp: '05:19:12.640',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 20429,
            ProcessName: 'mongod',
            CommandLine: 'mongod command local.oplog.rs appName="PyMongo" command: find { "ns": /users|sessions|tokens/ }',
            raw: 'mongod_audit: {"atype":"authCheck","ts":{"$date":"2026-11-17T05:19:12.640Z"},"remote":{"ip":"198.51.100.73","port":52190},"users":[],"param":{"command":"find","ns":"local.oplog.rs"},"result":0}',
            parsedFields: {
              TargetNamespace: 'local.oplog.rs (Replica Set Rolling Operation Log)',
              QueryFilter: 'find { "ns": /users|sessions|tokens/, "op": { "$in": ["i", "u", "d"] } }',
              AuditResult: 'result: 0 (Authorized due to missing RBAC enforcement)',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Bulk Collection Cursor Exhaustion (getMore) & Destructive dropDatabase Audit',
        narration:
          'In automated MongoDB extortion campaigns (Mongobleed / Kraken0), the script streams production collections via rapid getMore cursor batches, inserts a single ransom note document into a new WARNING collection, and issues dropDatabase (atype: dropDatabase) against the original database.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1485 - Data Destruction)',
        technicalCommands: [
          'jq \'. | select(.atype=="dropDatabase" or .atype=="dropCollection")\' /var/log/mongodb/auditLog.json',
        ],
        defenseMitigation:
          'Enforce custom MongoDB RBAC roles that omit dropDatabase and dropCollection privileges from application accounts, and maintain immutable point-in-time oplog snapshots on isolated object storage.',
        logs: [
          {
            id: 'db-mongodb-3',
            timestamp: '05:21:48.902',
            source: 'Linux Audit',
            severity: 'critical',
            EventCode: 20435,
            ProcessName: 'mongod',
            CommandLine: 'mongod command prod_crm.$cmd command: dropDatabase { dropDatabase: 1 }',
            raw: 'mongod_audit: {"atype":"dropDatabase","ts":{"$date":"2026-11-17T05:21:48.902Z"},"remote":{"ip":"198.51.100.73","port":52190},"param":{"ns":"prod_crm"},"result":0}',
            parsedFields: {
              AuditActionType: 'atype: dropDatabase on namespace prod_crm',
              PrecedingActivity: 'High-volume getMore cursor reads + insert into READ_ME_TO_RECOVER.note',
              RecoveryProcedure: 'Replay point-in-time backup and oplog slices prior to timestamp 05:21:48Z',
            },
          },
        ],
      },
    ],
  };
