import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a corporate mailroom intrusion reconstructed through three distinct security-desk receipts: first, catching the intruder quietly installing a hidden mail-sorting chute that diverts security alerts straight into the trash bin; second, reading the exact barcode scans that distinguish whether the intruder opened specific letters one by one or synced an entire mailbag at once; and third, uncovering a rogue automated courier pass left behind so the intruder can keep reading mail even after the victim changes their password.',
      storyMappings: [
        {
          storyTerm: 'Hidden mail-sorting chute diverting alerts into the trash bin',
          technicalTerm: 'M365 Unified Audit Log Operation="New-InboxRule" hiding security emails in RSS/Deleted Items',
          tone: 'amber',
        },
        {
          storyTerm: 'Barcode scans distinguishing single opened letters from full bag syncs',
          technicalTerm: 'MailItemsAccessed telemetry differentiating Bind (individual view) vs Sync (folder dump)',
          tone: 'sky',
        },
        {
          storyTerm: 'Rogue automated courier pass surviving password resets',
          technicalTerm: 'Malicious OAuth persistence logged via Operation="Consent to application"',
          tone: 'rose',
        },
        {
          storyTerm: 'Central mailroom ledger preserving every action',
          technicalTerm: 'Microsoft Purview Unified Audit Log (UAL) end-to-end BEC investigation',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after slipping into an executive mailbox, the intruder bolts a silent auto-sorting rule onto the inbox so any invoice disputes or security warnings automatically mark themselves read and vanish into an obscure back drawer.',
        storyMappings: [
          {
            storyTerm: 'Silent auto-sorting rule bolted onto the inbox',
            technicalTerm: 'Exchange Online New-InboxRule matching keywords (invoice, wire, security)',
            tone: 'amber',
          },
          {
            storyTerm: 'Vanishing into an obscure back drawer',
            technicalTerm: 'Inbox rule actions setting MarkAsRead=True and MoveToFolder=RSS Feeds or Deleted Items',
            tone: 'sky',
          },
          {
            storyTerm: 'Mailroom ledger recording the rule creation',
            technicalTerm: 'Unified Audit Log Operation="New-InboxRule" with ClientIP and Parameters',
            tone: 'rose',
          },
          {
            storyTerm: 'Keeping the victim blind to business email compromise',
            technicalTerm: 'Hiding attacker-sent phishing replies and bank fraud warnings from the mailbox owner',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'To determine whether the intruder merely peeked at three contracts or hauled away the entire executive inbox, investigators examine the mailroom barcode ledger, which marks individual letter opens differently from bulk folder synchronizations.',
        storyMappings: [
          {
            storyTerm: 'Barcode ledger tracking every touched message',
            technicalTerm: 'Microsoft Purview MailItemsAccessed audit event recording InternetMessageId lists',
            tone: 'amber',
          },
          {
            storyTerm: 'Peeking at individual letters one by one',
            technicalTerm: 'MailAccessType="Bind" listing exact MessageIds viewed over OWA or Graph API',
            tone: 'sky',
          },
          {
            storyTerm: 'Hauling away an entire mailbag at once',
            technicalTerm: 'MailAccessType="Sync" indicating bulk IMAP/ActiveSync/Outlook folder download',
            tone: 'rose',
          },
          {
            storyTerm: 'Exact legal breach scoping',
            technicalTerm: 'Correlating SessionId and ClientIPAddress against compromised message inventory',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Before logging off, the intruder approves a shady third-party mail-reader app carrying broad reading rights so that even when the executive changes their door key, the rogue app keeps slipping in through the side mail slot until investigators revoke both the app grant and every live session.',
        storyMappings: [
          {
            storyTerm: 'Approving a shady third-party mail-reader app',
            technicalTerm: 'Unified Audit Log Operation="Consent to application" granting Mail.Read / offline_access',
            tone: 'amber',
          },
          {
            storyTerm: 'Surviving ordinary employee password changes',
            technicalTerm: 'Persistent OAuth refresh tokens valid independently of user password resets',
            tone: 'sky',
          },
          {
            storyTerm: 'Revoking both the rogue app and every active wristband',
            technicalTerm: 'Removing malicious Enterprise App Service Principal and calling Revoke-MgUserSignInSession',
            tone: 'rose',
          },
          {
            storyTerm: 'Locking the side mail slot',
            technicalTerm: 'Enforcing Admin Consent Workflow so users cannot approve unverified OAuth apps',
            tone: 'emerald',
          },
        ],
      },
    },
  };
