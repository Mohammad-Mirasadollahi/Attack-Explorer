import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
      briefing: {
        storyAnalogy:
          'A hotel reception clerk writes every guest badge note verbatim into a smart ledger that automatically phones any directory number printed on the paper. A visitor hands over a slip listing an outside phone bureau, so the clerk dials out, fetches an unsigned instruction booklet from a street kiosk, and hands the master phone line to the caller.',
        storyMappings: [
          {
            storyTerm: 'Smart reception ledger',
            technicalTerm: 'Vulnerable Log4j 2 message lookup engine',
            tone: 'amber',
          },
          {
            storyTerm: 'Guest badge note',
            technicalTerm: 'HTTP User-Agent request header',
            tone: 'sky',
          },
          {
            storyTerm: 'Outside phone bureau',
            technicalTerm: 'Attacker-controlled LDAP referral server',
            tone: 'rose',
          },
          {
            storyTerm: 'Unsigned instruction booklet',
            technicalTerm: 'Remote Java bytecode class file',
            tone: 'emerald',
          },
        ],
      },
      steps: {
        1: {
          storyAnalogy:
            'The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name. The desk clerk copies the entire line directly into the smart ledger without checking whether the note contains a directory command.',
          storyMappings: [
            {
              storyTerm: 'Front desk counter',
              technicalTerm: 'Public web application login endpoint',
              tone: 'amber',
            },
            {
              storyTerm: 'Paper badge note',
              technicalTerm: 'Crafted User-Agent HTTP header string',
              tone: 'sky',
            },
            {
              storyTerm: 'Special lookup code',
              technicalTerm: 'JNDI lookup expression (CVE-2021-44228)',
              tone: 'rose',
            },
            {
              storyTerm: 'Smart reception ledger',
              technicalTerm: 'Log4j 2 logging library formatter',
              tone: 'emerald',
            },
          ],
        },
        2: {
          storyAnalogy:
            'As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.',
          storyMappings: [
            {
              storyTerm: 'Built-in ledger dialer',
              technicalTerm: 'Java Naming and Directory Interface client',
              tone: 'amber',
            },
            {
              storyTerm: 'Lobby switchboard',
              technicalTerm: 'Perimeter egress firewall',
              tone: 'sky',
            },
            {
              storyTerm: 'Outgoing phone call',
              technicalTerm: 'Outbound LDAP connection on TCP port 389',
              tone: 'rose',
            },
            {
              storyTerm: 'Outside phone bureau',
              technicalTerm: 'External rogue directory listener',
              tone: 'emerald',
            },
          ],
        },
        3: {
          storyAnalogy:
            'The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk. The trusting clerk walks over to that kiosk and carries back an unsigned instruction booklet.',
          storyMappings: [
            {
              storyTerm: 'Forwarding slip',
              technicalTerm: 'LDAP javaCodeBase reference attribute',
              tone: 'amber',
            },
            {
              storyTerm: 'Nearby street kiosk',
              technicalTerm: 'External HTTP payload staging server',
              tone: 'sky',
            },
            {
              storyTerm: 'Unsigned instruction booklet',
              technicalTerm: 'Compiled Exploit.class Java bytecode',
              tone: 'rose',
            },
            {
              storyTerm: 'Trusting desk clerk',
              technicalTerm: 'Application JVM URLClassLoader',
              tone: 'emerald',
            },
          ],
        },
        4: {
          storyAnalogy:
            'The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read. Following that opening page, the clerk picks up the hotel back-office handset and opens a live private line straight to the outsider.',
          storyMappings: [
            {
              storyTerm: 'Cover page setup checklist',
              technicalTerm: 'Java static initializer block',
              tone: 'amber',
            },
            {
              storyTerm: 'Back-office handset',
              technicalTerm: 'Spawned /bin/sh command interpreter',
              tone: 'sky',
            },
            {
              storyTerm: 'Live private line',
              technicalTerm: 'Outbound interactive reverse session',
              tone: 'rose',
            },
            {
              storyTerm: 'Hotel building staff role',
              technicalTerm: 'Application service user context',
              tone: 'emerald',
            },
          ],
        },
      },
    };
