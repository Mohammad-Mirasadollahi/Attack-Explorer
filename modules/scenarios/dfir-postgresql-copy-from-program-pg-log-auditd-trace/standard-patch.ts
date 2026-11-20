import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'An archive database manager normally imports and exports neat index tables, yet one special shipping privilege lets it feed a table straight from an external workshop tool. Investigators track a privileged sign-in using that import feature to run live floor commands and export a custom binary library right onto the archive disk.',
      storyMappings: [
        {
          storyTerm: 'Archive database manager',
          technicalTerm: 'PostgreSQL database server daemon (postgres)',
          tone: 'amber',
        },
        {
          storyTerm: 'Special shipping privilege',
          technicalTerm: 'Superuser or pg_execute_server_program role membership',
          tone: 'sky',
        },
        {
          storyTerm: 'External workshop import command',
          technicalTerm: 'SQL COPY ... FROM PROGRAM OS command execution',
          tone: 'rose',
        },
        {
          storyTerm: 'Exported custom binary library',
          technicalTerm: 'Shared object written via pg_largeobject and lo_export',
          tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Master clearance badge',
            technicalTerm: 'Superuser or pg_execute_server_program role',
            tone: 'sky',
          },
          {
            storyTerm: 'Staff permission chart',
            technicalTerm: 'pg_roles and pg_auth_members privilege check',
            tone: 'rose',
          },
          {
            storyTerm: 'Remote manager connection',
            technicalTerm: 'External client TCP session on port 5432',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Launched command-line helper',
            technicalTerm: 'postgres worker spawning /bin/sh child process',
            tone: 'sky',
          },
          {
            storyTerm: 'Temporary holding table',
            technicalTerm: 'Scratch SQL table capturing command stdout',
            tone: 'rose',
          },
          {
            storyTerm: 'Building security camera',
            technicalTerm: 'Linux auditd execve process telemetry',
            tone: 'emerald',
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
            tone: 'amber',
          },
          {
            storyTerm: 'Writing pieces onto disk',
            technicalTerm: 'lo_export() dropping a compiled shared library (.so)',
            tone: 'sky',
          },
          {
            storyTerm: 'Loading the custom tool',
            technicalTerm: 'CREATE FUNCTION loading dynamic C shared library',
            tone: 'rose',
          },
          {
            storyTerm: 'Forensic vault audit',
            technicalTerm: 'Querying pg_largeobject_metadata and pg_proc entries',
            tone: 'emerald',
          },
        ],
      },
    },
  };
