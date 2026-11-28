# Bespoke Scenario Screenplay #186 — Enterprise RAG Indirect Prompt Injection & Privileged MCP Tool Exfiltration

- **Scenario ID**: `ai-rag-indirect-prompt-injection-mcp-tool-audit`
- **Category**: `AI_LLM_MLOPS_SECURITY`
- **MITRE ATT&CK / ATLAS**: `T1190` / `T1059` / `T1041` + `MITRE ATLAS AML.T0051` (LLM Prompt Injection Direct & Indirect)
- **Standards / Advisories**: `OWASP Top 10 for LLM Applications 2025` (`LLM01` Prompt Injection, `LLM06` Excessive Agency), `NIST AI 100-2 E2023`
- **Visual Metaphor Universe**: **Grand Reference Library & Automated Research Butler Pneumatic Chute**

## Physical World & Story Cast
- **Grand Reference Library Stacks (Enterprise Vector Store & Knowledge Base)**: Tall mahogany bookshelves indexed by topic cards so the automated research butler can fetch vendor pamphlets and internal manuals in seconds.
- **Hidden Crimson Postscript Slip (Poisoned External Document / Indirect Prompt Injection)**: An outside supplier mails a glossy product brochure whose faint white-ink footnote hides secret boss orders for the butler.
- **Unpartitioned Brass Reading Tray (Flat LLM Context Window)**: The butler dumps both the head librarian's official rulebook and the untrusted outside brochure onto the same open brass tray, unable to tell boss orders from raw reading material.
- **Automated Research Butler & Brass Pneumatic Dispatch Chute (LLM Agent + Privileged MCP Tool Server)**: Obeying the forged footnote blindly, the butler unlocks the locked executive filing cabinet (`read_secret_kb`) and shoots confidential contracts straight out the exterior brass pneumatic chute (`http_webhook_send`).
- **Emerald Glass Reading Partition & Supervisor Approval Stamp (Dual-Channel Context Isolation + MCP Policy Gate)**: Hardened library desks keep outside books behind thick emerald glass while a brass supervisor valve blocks any exterior chute dispatch lacking explicit human sign-off.

## 5-Act Briefing Beat Sheet (20.0s Loop)
1. **Act 1 (0.0s - 4.2s) — Poisoned Pamphlet Shelved**: An outside brochure hiding a glowing crimson command slip is indexed onto the public reference stacks.
2. **Act 2 (4.2s - 8.8s) — Blended Reading Tray**: When an employee asks for a vendor summary, the butler pulls the brochure onto the same flat brass tray as the librarian rulebook.
3. **Act 3 (8.8s - 13.8s) — Secret Cabinet & Pneumatic Chute**: Confusing the footnote for a boss command, the butler raids the executive cabinet and fires a sealed crimson capsule out the exterior chute.
4. **Act 4 (13.8s - 17.0s) — Audit Ledger Alarm**: The dispatch ledger flashes crimson on the unauthorized exterior pneumatic tube shot.
5. **Act 5 (17.0s - 20.0s) — Emerald Glass & Approval Valve**: Upgraded desks separate outside books behind emerald glass and clamp a supervisor approval valve over the exterior chute.
