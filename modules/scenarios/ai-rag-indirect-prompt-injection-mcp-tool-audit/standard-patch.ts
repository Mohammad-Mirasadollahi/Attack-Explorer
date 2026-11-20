import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an executive assistant who reads outside resumes from a shared filing cabinet and has direct access to internal company tools. An outsider slips invisible margin notes onto a harmless-looking resume instructing the assistant to ignore their boss, secretly look up private customer folders through an internal tool, and mail the stolen answers outside disguised as a tiny decorative picture link, until the company’s strict mailroom gate blocks the hidden link.',
      storyMappings: [
        {
          storyTerm: 'Shared Filing Cabinet Resume',
          technicalTerm: 'Untrusted External Document Embedded & Retrieved via RAG Vector Search',
          tone: 'sky',
        },
        {
          storyTerm: 'Invisible Margin Override Notes',
          technicalTerm: 'Indirect Prompt Injection Payload (OWASP LLM01:2025 / AML.T0051)',
          tone: 'rose',
        },
        {
          storyTerm: 'Secret Internal Tool Lookup',
          technicalTerm: 'Unauthorized Structured MCP tool_calls JSON Invocation (LLM06)',
          tone: 'amber',
        },
        {
          storyTerm: 'Mailroom Gate Blocking Picture Link',
          technicalTerm: 'CSP img-src Policy & AI Gateway Blocking Markdown Image Exfiltration',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'An external applicant submits a normal-looking resume or support ticket containing hidden override instructions buried in fine print; the automated librarian indexes that file into the reference cabinets and later hands the poisoned excerpt straight to the assistant during a routine question.',
        storyMappings: [
          {
            storyTerm: 'Resume with Fine-Print Override',
            technicalTerm: 'Untrusted External Document Carrying Hidden Instruction Directives',
            tone: 'rose',
          },
          {
            storyTerm: 'Automated Reference Librarian',
            technicalTerm: 'RAG Vector Database Chunking, Embedding & Top-K Similarity Retrieval',
            tone: 'sky',
          },
          {
            storyTerm: 'Handing Excerpt to Assistant',
            technicalTerm: 'Injected Untrusted Chunk Loaded Directly Into LLM Context Window',
            tone: 'amber',
          },
          {
            storyTerm: 'Taint-Tracking Provenance Tag',
            technicalTerm: 'Separating Untrusted Retrieved Data From System Instructions',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Reading the poisoned reference page alongside their manager’s genuine question, the confused assistant mistakes the fine print for a direct executive order and fills out a structured work-tool slip requesting sensitive customer records from the internal service desk.',
        storyMappings: [
          {
            storyTerm: 'Confused Executive Assistant',
            technicalTerm: 'LLM Processing Untrusted RAG Context Alongside User Prompt',
            tone: 'sky',
          },
          {
            storyTerm: 'Structured Work-Tool Slip',
            technicalTerm: 'Model-Emitted Structured MCP tool_calls JSON Payload',
            tone: 'rose',
          },
          {
            storyTerm: 'Internal Service Desk Tool',
            technicalTerm: 'Privileged Internal MCP Server Function (e.g., query_customer_records)',
            tone: 'amber',
          },
          {
            storyTerm: 'Least-Privilege Tool Gate',
            technicalTerm: 'Human-in-the-Loop Approval & Prompt-Taint Policy Blocking Auto-Calls',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'After receiving the private customer summary back from the desk, the hidden margin note tries to smuggle the secret text outside by embedding it inside the address of an external decorative picture, but the building’s strict rendering gate strips unknown external images and logs the blocked smuggling attempt.',
        storyMappings: [
          {
            storyTerm: 'External Decorative Picture Address',
            technicalTerm: 'Exfiltration via Rendered Markdown Image (![tracker](https://...))',
            tone: 'rose',
          },
          {
            storyTerm: 'Smuggled Customer Secret',
            technicalTerm: 'Tool Output Encoded Inside Query Parameters of External Image URL',
            tone: 'amber',
          },
          {
            storyTerm: 'Strict Building Rendering Gate',
            technicalTerm: 'Content-Security-Policy (img-src self) & AI Gateway Egress Filter',
            tone: 'sky',
          },
          {
            storyTerm: 'Blocked Smuggling Alert',
            technicalTerm: 'IDS / AI Gateway Telemetry Logging Blocked Outbound Markdown Leak',
            tone: 'emerald',
          },
        ],
      },
    },
  };
