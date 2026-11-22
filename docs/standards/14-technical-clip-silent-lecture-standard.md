# SVG + GSAP Technical Clip — Silent Lecture Standard (`MOD-14`)

> **Module ID**: `MOD-14` · **Parent Index**: [`/docs/standards/README.md`](./README.md)  
> **Scope**: Cinematic technical clips under `/components/technical-clip/**` and the section gate in `/lib/section-technical-clip-registry.ts`.  
> **Status**: Mandatory for any scenario that ships a technical clip · **Reference of the method** (not a stencil): Process Hollowing clips · **Enforced By**: author review against this module. Clip-decision tests are planned. Do not copy a reference film’s cast into another section.

---

## 1. Purpose

Three teaching surfaces stay separate. None of them is a restyle of another.

| Surface | Job | Motion |
| :--- | :--- | :--- |
| **Three.js film** (`MOD-09`, `MOD-10`) | The scenario’s story world | Story metaphor only |
| **Technical clip** (`MOD-14`) | One section’s mechanism, taught with moving marks | Silent lecture |
| **Excalidraw board** (`MOD-13`) | The same facts as a static chalk map | None |

The clip is a teacher who cannot speak. They decide what to draw from the section’s claims, then animate those drawings so a mute viewer can say what changed. The standard governs that decision. It does not publish a prop kit, a stage layout, or a timing table to reuse.

```
┌────────────────────────────────────────────────────────────────────────────┐
│  STORY CARD  →  THREE.JS STORY FILM  →  TECHNICAL CLIP (this module)       │
│                                      →  EXCALIDRAW BOARD  →  CLAUSES       │
│  Clip is omitted on Overview / briefing.                                   │
│  Clip is required on a memory section whose claim is a visual difference.  │
└────────────────────────────────────────────────────────────────────────────┘
```

Order is the live order in `StandardStoryTechnicalSection`: Story (unless `omitStory`) → registered Three.js stage → registered clip → registered whiteboard → numbered forensic clauses.

---

## 2. What This Module Refuses to Freeze

A later section or a later scenario must be able to look unlike every clip that already exists. The following are **not** part of the standard, even when a reference film uses them:

- A particular object (dial, crate, pipe, truck, key, radar, stamp, slit, lever).
- A particular stage geography (left reader, center gate, right vault).
- A color assignment for a kind of fact.
- A duration in seconds.
- The noun list of any one attack.

If a rule below can be satisfied only by redrawing a previous film with new labels, the rule has been missed.

Shared **chrome** is the exception. The frame, act card, cutaway, full page, and dock match `ANIME_3D_STAGE_STANDARD` so the workbench does not grow a second control language. Chrome is the player. It is not the lesson.

---

## 3. When to Register a Clip

Decide from the section’s claims, then set the registry. Do not register a clip because a neighbor section has one.

| Section | Decision |
| :--- | :--- |
| `briefing` / Overview | **Do not register.** The Three.js film already walks the whole arc. A clip here repeats the route. |
| `step-N` | **Register** when the step’s technical clauses contain at least one state change a drawing can show (a call, a value write, a removal, a permission, a denial). |
| `memory-forensics` | **Register** when the section’s claim is a difference between two states of the same named object (disk vs live, before vs after, expected vs observed). |
| Any section | **Do not register** when the only picture would be the whiteboard’s boxes moving, or a paragraph broken into cards. That restates `MOD-13` or the clauses. It is not a lecture. |

Partial coverage inside one scenario is allowed only for Overview, which stays unregistered on purpose. Every other story-technical section that passes the table above gets its own clip. Two steps never share one film.

---

## 4. Decision Procedure

Run this procedure per section before drawing. The output is a beat sheet. The SVG is an execution of that sheet, not a template with blanks.

### 4.1 Extract claims

Read the section’s technical clauses (`MOD-03`, `MOD-08`) and split them into claims. A claim is one of:

- a **change** (something is created, removed, written, redirected, allowed, or counted down), or
- an **invariant** (a name, module, parent, path, or protection that the operation does not touch), or
- a **negative** (an API, parent, or flag that a careful reader might expect and that this step does not use).

One claim that a mute viewer cannot see is not a beat yet. Merge nothing that needs two different pictures.

### 4.2 Cast each claim from its grammar

Name roles from the sentence. Leave a role empty when the sentence has no such participant. Do not invent a participant to fill a role.

| Role | Question the drawing must answer | Typical visible behavior (choose a form that fits this claim) |
| :--- | :--- | :--- |
| **Agent** | Who acts? | Enters, or stays as the source the instrument leaves from |
| **Instrument** | What do they act with? | Travels into the place of action and remains readable |
| **Patient** | What changes? | Is rewritten, filled, emptied, opened, or redirected |
| **Residue** | What is left? | Outline, new value, count, or address that stays after the action |
| **Control** | What must not change? | Stays put and receives a visible skip, not a sentence alone |
| **Witness** | What would a defender see? | Appears only after the claim is true, and names the real event |

“Typical visible behavior” is a hint about the verb, not a required shape. A selection among settings may settle like a control. A copied value may travel. A count may flip. A failed comparison may be two plates and a mark on the one that fails. An absence may be the body leaving and the outline remaining. A prohibition may be the named thing, still readable, with a strike. If the claim is not that kind of verb, do not borrow that form.

### 4.3 Add supporting marks until the claim is silent

The core cast performs the verb. Supporting marks are the extra drawings a teacher would add so the student does not need the voiceover. They answer only these questions:

- How would I know the change finished?
- What was true before, in the same picture?
- What did this step refuse to do?
- Which nearby object is innocent?

Stop when a mute viewer can state the claim. Another mark that does not answer one of those questions is decoration. Delete it (`MOD-09` anti-clutter applies here too: no glitter, no motif, no object from the story world unless that object is the technical participant).

The event log is a supporting caption, not the lecture. A beat whose only new information is a log line fails.

### 4.4 Give the section one spatial sentence

Write one sentence that is not true of any other clip in the same scenario: where the action happens and how the eye travels. If the sentence still fits the previous section after swapping nouns, redraw. Reusing “cards in a row with a status word” is the failure this rule exists to catch.

Camera presets are framings of **this** spatial sentence (a wide view plus close views of the places the claims happen). Name them for those places. Do not import another film’s camera names or transforms.

### 4.5 Pace by whether the frame teaches

This rule is mandatory for every clip, including clips that do not exist yet. A film that is correct and too fast to follow fails review.

**1x is the teaching speed.** The dock multipliers `0.5` / `1` / `1.5` are the learner’s choice. Authoring the timeline as a rush and expecting the learner to pick `0.5x` is non-compliant. Do not set a private `timeScale` to hide short tweens.

Classify every tween, then use the matching floor from `components/technical-clip/clipPace.ts`:

| Class | When | Floor |
| :--- | :--- | :--- |
| **Travel** | The object is already named and the tween only moves it. | `clipPace.travel` |
| **Teaching** | This frame is the first moment the claim is readable. | `clipPace.teach` |
| **Repeat** | The same verb on the next sibling. Shorter than the first, still nameable. | `clipPace.repeat` |
| **Hold** | The result sits on screen before the next claim starts. | `clipPace.hold` |
| **End** | The last beat of the film, after its claim is fully visible. | `clipPace.end` |

Rules that follow from the table:

1. A teaching change or a hold shorter than its floor is non-compliant. Do not paste a smaller literal for those classes.
2. The first time a verb happens is the slow one. Later siblings may use `repeat`, not a snap.
3. After the claim is visible, insert a hold before the next beat label. The next claim must not start on the same frame the previous one lands.
4. One timescale for the whole timeline is not pacing. Travel may be shorter than teaching. Teaching may not be shortened to match travel.
5. If a muted viewer cannot name what just changed, that tween is still too fast, even when it meets the floor. Lengthen that beat. Do not speed the others up to compensate.

The numbers live only in `clipPace.ts`. Change the floor there when the teaching speed itself changes, then let every clip inherit it. Do not fork a second pace table inside one scenario.

### 4.6 Write the beat, then draw only that

Each beat stores:

- `story` — one plain sentence a non-specialist can follow. No API names, hex, PIDs, or paths (`MOD-08` jargon rule).
- `technical` — the exact claim: API, values, and the invariant or negative.
- a drawing whose moving parts are the cast of that claim.

The act card shows `story`, then `technical` underneath, inside the reserved header band. The canvas labels use the participants’ real names, because the picture is the technical explanation. The card does not have to repeat every label. The picture does not have to be free of technical words.

---

## 5. Picture Rules That Follow from the Decision

These rules check the drawing. They do not choose it.

| Rule | Test |
| :--- | :--- |
| **Participant only** | Every shape that moves or appears is an agent, instrument, patient, residue, control, or witness of a claim in this section. |
| **Real names** | On-canvas text is the participant’s real name or value, not a nickname that hides it. |
| **Direction matches the verb** | Removal moves off the place it occupied. Insertion stops at the reader with enough of the instrument still visible. A tween on an unrelated axis fails. |
| **Nothing is swallowed** | An object that enters a container is painted after that container. |
| **Invariant is visible** | A “stays” or “not used” claim is an object that remains or a named object with a strike, not only a log line. |
| **First frame of the beat** | Seeking to the beat label shows that beat’s subject already. A tween that starts on the label is still at progress 0. Put the subject’s visible state on the label. Do not set and tween the same property at the same label. |
| **No overlap with chrome** | The act card and the dock are reserved bands (`AnimeClipStage` header and footer). They never sit on top of the SVG. |
| **One film, one idea** | Supporting marks may be many. The spatial sentence is one. |

---

## 6. Player Contract (Shared Chrome, Not Shared Lesson)

Implement the player only through `AnimeClipStage`. A clip that copies the dock into its own component will drift.

The player takes `ANIME_3D_STAGE_STANDARD`: viewport classes, speeds `0.5 / 1 / 1.5`, cutaway `AUTO / OPEN / SEALED`, full page, hide/show dock, pause, restart, beat tabs, scrubber, camera presets, Labels, Bloom. Escape leaves full page.

| Player behavior | Requirement |
| :--- | :--- |
| **Labels** | Hides `.clip-label` and `.log-line`. Does not hide the participant names that are the lecture. |
| **Cutaway** | `OPEN` forces `.cutaway-guts` visible. `SEALED` hides interior marks (pages, cells, log lines, guts). `AUTO` leaves the timeline in control. |
| **Bloom** | A class on the frame, not a second art style. |
| **Film pointer** | A click on the picture toggles pause/play. A double-click toggles full page. The same helper as the Three.js canvas (`useCanvasPlayToggle`) so a double-click does not also flip playback. Clicks on the act card and the dock do not count. |
| **Offscreen** | `IntersectionObserver` pauses the timeline when the film is offscreen. A learner pause is remembered and is not cleared by scrolling back. |
| **Several films on one page** | Every paint-server id (`gradient`, `filter`, `pattern`, `clipPath`) is prefixed per clip. Unprefixed ids collide because the sections mount together. |
| **Dynamic import** | `next/dynamic` options are an inline object literal with `ssr: false`. A shared options variable is rejected by the framework. |

Background of the film plane matches the anime stage plane (`#0B0F17`) so the two players sit in one workbench. That color is chrome. Objects inside the film choose contrast from the claim, not from a palette copied off a neighbor.

---

## 7. Anti-Pattern vs Decision Trace

### Anti-pattern

- Trace an existing clip and replace its strings.
- Lay out one rounded card per API and fade the cards in. That is a document, not a lecture.
- Add a prop because the reference film had one (a dial where nothing is selected, crates where nothing is streamed, a truck where the claim is a register write).
- Explain the claim only in the act card or the log, while the canvas holds unlabeled decoration.
- Run the film at a rush and treat `0.5x` as the real speed. A teaching tween under `clipPace.teach`, or no hold before the next claim, fails even when the drawing is right.
- Use one duration for every tween.
- Start the hero’s only tween at the beat label, so a jump to that act shows an empty stage.
- Register a briefing clip that retells steps 1 through N.
- Animate the Excalidraw board, or rebuild the Three.js story inside the SVG.

### Decision trace (method, not a cast to copy)

Claim under test: “A reader opens a record, copies one field out, and leaves the record’s title unchanged.”

| Beat | Claim | Core | Supporting | Why this shape and not another |
| :--- | :--- | :--- | :--- | :--- |
| 1 | The same handle is reused | Instrument enters the reader | Nothing new is requested | The handle travels. A second badge would invent a grant that did not happen. |
| 2 | One field is the result | A sweep stops on that row | The value appears only on that row | A sweep matches “search then stop”. A dial would imply a setting was chosen. |
| 3 | The body leaves | Each part lifts out of the slot | An empty outline remains per part | The outline is the residue. A log line saying “empty” is not enough. |
| 4 | A neighbor is skipped | The neighbor stays | A check lands on it after the others leave | The check is the control. Removing the neighbor would falsify the claim. |
| 5 | The title is unchanged | Title plate never moves | A success mark appears beside it | The plate’s stillness is the invariant. |

A different claim (a register write, a path allow, a byte-for-byte mismatch) produces a different table and a different spatial sentence. Process Hollowing’s films are examples of filled tables. They are not rows to reuse.

---

## 8. Where the Code Lives

| Concern | Location |
| :--- | :--- |
| Player chrome | `components/technical-clip/AnimeClipStage.tsx` |
| Film plane (prefixed paint servers) | `components/technical-clip/FilmBackdrop.tsx` |
| Section gate | `components/technical-clip/TechnicalClipEmbed.tsx` |
| Which sections have a clip | `lib/section-technical-clip-registry.ts` |
| One section’s drawing | `components/technical-clip/clips/<Section>Clip.tsx` |
| Shared 1x pace floors | `components/technical-clip/clipPace.ts` |

A new scenario adds clips by running §4 and registering the sections that pass §3. It does not clone `clips/Step3AllocInjectClip.tsx` or any other reference file.

The beat sheet lives in the clip module as the `beats` passed to the player (`story` + `technical` per beat). That array is the decision record a reviewer reads against the drawing. Do not add a second hardcoded scene schema.

---

## 9. Verification Checklist

- [ ] Overview / `briefing` has no clip. Memory has a clip when its claim is a visual difference.
- [ ] Each beat maps to one claim, and the drawing uses that claim’s cast.
- [ ] A mute viewer can state the claim from the picture. The log is not the only place the claim appears.
- [ ] At least one supporting mark per teaching beat answers “how do I know?”, “what stayed?”, or “what was not done?”.
- [ ] No moving shape lacks a role. No prop was imported from another section’s film.
- [ ] The spatial sentence is false of every other clip in the scenario.
- [ ] At 1x, teaching tweens use `clipPace.teach`, repeats use `clipPace.repeat`, and each claim holds for `clipPace.hold` before the next beat. Nothing important finishes in a glance. The film was not authored at a rush for `0.5x`.
- [ ] Seeking to a beat shows that beat’s subject.
- [ ] Motion axis matches the verb. Entering objects paint above the container they enter.
- [ ] Act card and dock occupy reserved bands and do not cover the SVG.
- [ ] Card `story` has no technical tokens. Card `technical` and on-canvas labels use the real names.
- [ ] Paint-server ids are unique on a page that mounts every clip.
- [ ] The film pauses offscreen and a manual pause survives scroll.
- [ ] Player chrome is `AnimeClipStage` plus `ANIME_3D_STAGE_STANDARD`, not a private dock.
- [ ] The whiteboard remains static and the Three.js film remains the story world.

**Review:** play each clip muted. After every beat, say the claim out loud. If the sentence needs the act card to be true, the drawing failed §4.3.

---

## 10. Relationship to Other Modules

| Module | Relationship |
| :--- | :--- |
| **`MOD-08`** | Clip sits after the Three.js film and before the whiteboard and the clauses. It does not replace Story or the forensic paragraphs. |
| **`MOD-09`** | Shared player chrome and the ban on decorative particles. The clip is 2D. It does not import a Three.js metaphor. |
| **`MOD-10`** | Same idea as bespoke 3D worlds: one scenario’s lecture is not the next scenario’s stencil. |
| **`MOD-13`** | The board is the static map of the same facts. Do not animate it. Do not redraw it as the clip. |
| **`MOD-03`** | Values on the canvas and in `technical` stay exact. `story` stays plain. |
| **`MOD-07`** | Act-card and dock labels wrap. They are not truncated. |
