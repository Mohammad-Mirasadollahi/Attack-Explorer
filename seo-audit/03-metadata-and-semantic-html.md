# Module 03: Metadata & Semantic HTML

Document structure, heading hierarchy, keywords, accessibility signals, and page metadata.

---

## 1. Findings

### 1.1 No `<h1>` on the landing shell (ERROR)

- **Rule id:** `core/h1`
- **Issue:** Crawl of the rendered landing found no `<h1>`. The only `h1` in source lived in `components/InspectorPanel.tsx` (around line 821) and only renders after a user selects a telemetry event—too late for classic crawlers and for the default document outline.
- **Risk:** `<h1>` is the strongest on-page topical signal. Missing it hurts on-page SEO for primary simulator keywords.

### 1.2 Keyword density / stuffing warning for `exe` (WARNING)

- **Rule id:** `content/keyword-stuffing`
- **Issue:** Token `exe` was ~3.3% of landing words (~25 occurrences), driven by process names in logs/simulator DOM (`powershell.exe`, `cmd.exe`, `rundll32.exe`, …).
- **Fix direction:** Do **not** rename processes. Wrap machine tokens in semantic code elements (`<code>`, `<samp>`, `<pre>`) and enrich nearby human-readable prose so crawlers treat them as telemetry data, not stuffed body copy.

### 1.3 Label / accessible name mismatch (ERROR)

- **Rule id:** `a11y/label-content-name-mismatch`
- **Issue:** At least four controls had visible text that did not match `aria-label` (example: visible “hotkeys” vs `aria-label="open keyboard shortcuts"`).
- **Risk:** Accessibility quality feeds page-quality / helpfulness evaluations; voice-control users also fail when spoken names do not match visible labels.

---

## 2. Remediation

### 2.1 Add a semantic `<h1>`

Place the product title in the header or root layout. If the visual design must stay minimal, use a screen-reader-only class (`sr-only`):

```html
<h1 className="sr-only">
  Attack Explorer — Visual Cyber Attack, Log & Malware Analyzer mapped to MITRE ATT&CK
</h1>
```

This does not change the graphic layout and restores a crawlable primary heading.

### 2.2 Heading hierarchy

- One `<h1>` for the document / shell.
- Section titles as `<h2>` (e.g. Scenario Overview, Telemetry Events, Defense Matrix).
- Subsections as `<h3>`.
- Do not skip levels for styling; style with CSS, not heading rank.

### 2.3 Align visible labels with accessible names

Prefer: visible text == accessible name. If you need a richer `aria-label`, include the visible words inside it (or drop the redundant `aria-label`).

---

## 3. Extra guidance

- **Title tag length:** Keep ~50–60 characters where possible; the current product title is long but brand-accurate—trim only if SERP truncation becomes a measured problem.
- **Meta description:** One clear value proposition + audience (SOC / DFIR / red-blue teams). Avoid keyword lists as the description body.
- **Keywords metadata:** Low ranking value in Google; harmless as a weak signal elsewhere—do not spend engineering time optimizing the keywords array.
- **Client-updated titles:** If the workbench changes `document.title` when a scenario loads, also plan dedicated URLs later; ephemeral titles alone do not create durable indexed pages.
- **Language:** Root `lang="en"` (or matching locale). If Persian/other UI strings appear, keep crawlable marketing copy in English unless you intentionally ship localized routes + `hreflang`.
