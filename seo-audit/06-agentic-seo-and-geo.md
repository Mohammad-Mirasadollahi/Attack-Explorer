# Module 06: Agentic SEO & Generative Engine Optimization (GEO)

How modern AI systems (Perplexity, ChatGPT Search, Claude Search, Google AI Overviews, and coding agents) discover, summarize, and cite Attack Explorer.

---

## 1. Findings

### 1.1 Missing `llms.txt` (RECOMMENDATION)

- **Rule id:** `ax/llms-txt`
- **Standard:** [`llms.txt`](https://llmstxt.org) is a markdown file at `/llms.txt` that gives LLMs a clean summary, structure, and links without parsing heavy JS bundles.
- **Status:** `/llms.txt` and optional `/llms-full.txt` were unavailable at audit time.

### 1.2 No markdown negotiation for agents (RECOMMENDATION)

- **Rule id:** `ax/markdown-response`
- **Standard:** When clients send `Accept: text/markdown`, prefer a clean markdown representation instead of the full hydrated HTML app shell.

### 1.3 Low visible-text / token-weight ratio (WARNING)

- **Rule id:** `ax/token-weight`
- **Issue:** Roughly ~4% of the HTML output was visible text; the rest was tags, Tailwind classes, and hydration scripts (~50,725 estimated tokens).
- **Risk:** Agents with tight context windows may truncate before understanding the product.

---

## 2. Recommended `llms.txt` skeleton

Serve a concise file at the domain root summarizing capabilities and key scenarios:

```markdown
# Attack Explorer

> Visual Cyber Attack, Log & Malware Analyzer mapped to MITRE ATT&CK.

Attack Explorer is an interactive simulation and analysis platform designed for security engineers, SOC analysts, and red/blue teams.

## Core Capabilities
- **Attack Simulation:** Step-by-step visual execution of real-world adversary scenarios.
- **Log Forensics:** Live Sysmon, Windows Event Log, and SIEM packet breakdown.
- **Behavioral Mapping:** Direct mapping to MITRE ATT&CK tactics, techniques, and procedures (TTPs).
- **Process Memory Inspection:** Process hollowing, memory forensics, and AMSI bypass flowcharts.

## Key Scenarios Included
- Ransomware Shadow Wipe (T1490, T1486)
- Log4Shell (CVE-2021-44228) DFIR Investigation
- Active Directory Kerberoasting (T1558.003)
- Process Hollowing & Injection (T1055.012)
- DNS Tunneling Data Exfiltration (T1071.004)
```

Full starter file content is in Module 08.

---

## 3. Extra guidance

### What GEO actually needs from this product

- Stable, citable URLs for **scenarios and sources** (see `docs/analytical-sources-and-references.md`).
- Clear authorship / methodology language on those pages.
- An `llms.txt` that lists the highest-value links first (home, docs, key scenarios)—not every UI control.

### Optional `/llms-full.txt`

Use for a longer catalog of scenarios and ATT&CK IDs. Keep `/llms.txt` short; put the encyclopedia in `llms-full.txt`.

### Markdown responses

If you add `Accept: text/markdown` handling, return:

- Product summary
- Scenario list with IDs
- Links to canonical docs

Do **not** dump proprietary exploit payloads beyond what the public UI already teaches; match the product’s educational scope.

### robots vs AI crawlers

Module 02’s `robots.ts` can allow indexing crawlers while still disallowing `/api/`. Decide deliberately whether training bots (`GPTBot`, `Bytespider`, `CCBot`) may fetch content; document that policy in `llms.txt` if you restrict them.

### Measurement

After shipping `llms.txt`, fetch it anonymously in production and confirm `Content-Type` is text-friendly. Re-run squirrelscan’s agentic checks rather than assuming the recommendation clears.
