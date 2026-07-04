# Child First Fidelity App — Fidelity Checklist Audit & Research Plan

**Prepared:** July 2026
**Scope:** (1) Inventory of every fidelity checklist the app implements, (2) cross-reference of every "fidelity" document found in Google Drive against the app, (3) gap analysis, and (4) a phased plan to complete, correct, and professionalize the app.

---

## 1. Executive Summary

The app is a React/TypeScript PWA that digitizes the **Child First Fidelity Framework** (five clinical forms adapted from Child-Parent Psychotherapy, plus the Program Fidelity Checklist). The transcription of the **2015-era fillable forms is largely faithful and complete** — including the Core Intervention form, whose source document is missing from the repo but was verified against the copy in Google Drive.

However, the Drive review surfaced three findings that change the picture:

1. **The app implements the *pre-rostering* (2015/2018) instruments, but newer "POST ROSTERING" (© Child First 2018, in active circulation) versions of forms I, II, IV, and V exist in Drive and are substantially different** — simplified structure, new role terminology (Care Coordinator/**FRP — Family Resource Partner**), CFCR IDs, removed challenge scales on most strands, and a new "Treatment Themes" table replacing the long CPP-objectives scoring grid.
2. **A July 2025 Program Fidelity Checklist exists** (the app implements the Oct 2019 revision). The 2025 version adds telehealth rules, a video-use requirement, Changent governance, accreditation fidelity levels, and revised data-entry timelines (CFCR/ASD within 5 days).
3. **Three of the app's Foundational-form data files appear to be paraphrased rather than transcribed** (`cppObjectives.ts`, `homeVisitItems.ts`, `formulationItems.ts`) — their content does not match the official CPP objective titles and item wording that appear in every source document reviewed. This is the highest-priority content-fidelity risk in the app.

The operational workflow defined in the **Fidelity Forms Cheat Sheet (v. 11/7/25)** — 90-day form cadence, two fidelity cases per practitioner at all times, dual team marking (Clinician ✓ / CC-FRP ✗), supervisor review — is only partially represented in the app and is where the largest product gains are available.

---

## 2. What the App Implements Today

### 2.1 Form modules (routed in `src/App.tsx` via `FORM_TYPES`)

| # | Module | Source document (per code comments) | Data files |
|---|--------|--------------------------------------|------------|
| 1 | **Foundational Phase Fidelity** (green) | *cz_I Foundational Phase Fidelity 2015 CF integrated – Green fillable 5.2.18* | `fidelityItems.ts` (5 strands), `assessmentItems.ts` (Engagement/Assessment CF1–CF14 + items 1–19), `traumaFeedbackItems.ts`, `cppObjectives.ts` ⚠, `homeVisitItems.ts` ⚠, `formulationItems.ts` ⚠, `formSchema.ts` (demographics, contact log, plan of care) |
| 2 | **Core Intervention Phase** (purple) | Rebuilt from CPP fidelity checklist (PR #15) — source doc **not in repo** | `coreInterventionItems.ts` (registration, Introducing Child 1–6, contact log, 5 strands, 23 CPP objective groups) |
| 3 | **Care Coordinator Interventions** | *III Care Coordinator Interventions July 2018* | `careCoordinatorItems.ts` (7 sections) |
| 4 | **Termination / CPP Closing** (yellow) | *IV Termination Fidelity 2015 – Yellow fillable 7.9.2018* | `terminationItems.ts`, `terminationSchema.ts`, `cppClosingItems.ts` |
| 5 | **Supervision Fidelity** (pink) | *V SUPERVISION FIDELITY 2015 – Pink fillable* | `supervisionItems.ts`, `supervisionSchema.ts` |
| 6 | **Program Fidelity Checklist** | *Child First Program Fidelity Checklist – REVISED Oct 2019* | `programFidelityItems.ts` (17 sections, 0–3 scale + comments) |

### 2.2 The five fidelity strands (used across forms)

Reflective Practice · Emotional Process · Dyadic-Relational · Trauma Framework · Procedural — each with **Sources of Challenge** (No/Low/Moderate/Significant) and **Capacity** (Requires Development/Emerging/Acquired), matching the CPP/Child First framework and the CPP Fidelity Compass (the app's `FidelityCompass.tsx` component reflects `fidelitycompass_overview_final.pdf`).

### 2.3 Technical shape

- React 18 + TypeScript + Vite + Tailwind 4, `react-hook-form`, PWA (`vite-plugin-pwa`), offline indicator, jsPDF exports.
- **Persistence: browser `localStorage` only** (`src/utils/storage.ts`, keys `cpp_fidelity_*`), multi-case support via a cases index. No backend, no auth, no sync, no encryption at rest.
- PDF export exists for **Foundational, Supervision, Program Fidelity, Care Coordinator** — **none for Termination or Core Intervention**.
- Repo contains a full duplicate legacy copy of the app (`Claude Fidelity App/`) including the original source documents in `Claude Fidelity App/Fidelity /` (I, III, IV, V, Program — **document II absent**).
- Wellness/UX extras: grounding exercise, reflective journal, wisdom quotes, celebrations, focus mode, keyboard shortcuts.

---

## 3. Document Register — every "fidelity" document found

### 3.1 Google Drive: Child First fidelity documents (read end-to-end)

| Document | Version | Status vs app |
|---|---|---|
| `cz_I Foundational Phase Fidelity 2015 CF integrated – Green fillable 5.2.18` (.docx, also in repo) | © 2015, rev. 5/2018 | **Implemented** (checklist sections verified; see ⚠ in §4.2) |
| `II Core Intervention Fidelity 2015-Purple fillable 4.24.18` (.docx + Google Doc) | © 2015, rev. 4/2018 | **Implemented** — app's rebuild verified item-by-item against Drive copy: registration, Introducing Child 1–6 (incl. 2a Triangle, 3a/3b response coding), contact log, 5 strands, home-visit before/during/after, full CPP objectives grid. **Source doc should be added to repo.** |
| `III Care Coordinator Interventions July 2018` (.docx, also in repo) | July 2018 | **Implemented** |
| `IV Termination Fidelity 2015-Yellow fillable 7.9.2018` (.pdf/.docx, also in repo) | © 2015, rev. 7/2018 | **Implemented** |
| `V SUPERVISION FIDELITY 2015-Pink fillable` (.pdf/.docx, also in repo) | © 2015 | **Implemented** |
| `cy2_Child First Program Fidelity Checklist – REVISED Oct 2019` (.pdf, also in repo) | Oct 2019 | **Implemented** |
| **`I Foundational Phase Fidelity POST ROSTERING July 2018`** | © 2018 | **NOT implemented** — restructured instrument (see §4.1) |
| **`II Core Intervention Fidelity POST ROSTERING July 2018`** | © 2018 | **NOT implemented** |
| **`IV Termination Fidelity POST ROSTERING July 2018`** | © 2018 | **NOT implemented** |
| **`V SUPERVISION FIDELITY POST ROSTERING July 2018`** | © 2018 | **NOT implemented** |
| **`Child First Program Fidelity Checklist – July 2025`** (unrestricted + restricted copies) | © 2025 | **NOT implemented** (app has Oct 2019) |
| `a. Fidelity framework coversheet` (PDF) | © 2015 (framework v. 1/2016) | Framework definition: 5 forms, 2 fidelity cases, supervisor storage/review, "Fidelity Week" practice — **workflow not in app** |
| `Child First Fidelity Forms Cheat Sheet_11.7.25` (= `b. Fidelity framework cheat sheet`) | v. 11/7/25 | Cadence & completion rules — **workflow not in app** (see §4.3) |
| `PROCEDURAL FIDELITY: CPP CONTACT LOG` (.docx) | — | Official contact-log columns — **app's contact-log option lists deviate** (see §4.2) |
| `Fidelity Strands & Forms_May25` (PDF training deck) | 5/8/2025 | Confirms current strands, cadences, Compass; consistent with app content |
| `fidelitycompass_overview_final` (PDF) | — | Reflected in app's FidelityCompass component |
| `Child First Fidelity Activity` (PDF) | — | Training activity; no app impact |
| `Child First Supervision Fidelity Gap Analysis` (Google Doc, Jan 2026, by Skylar) | — | Context: documents supervision-fidelity gaps at Child First WNC; motivates supervision-log & documentation features (§5, Phase 3) |
| `Turtle * Fidelity` docs (Skylar-filled + ALIGNED + `What Shifted.md`) | Apr 2026 | Real-world usage: dual Clinician-vs-FRP ratings compared and reconciled — motivates inter-rater comparison feature |
| `email with fidelity forms` / `Mastering_Fidelity_Forms.mp4` | — | Context items (video not readable in this environment) |

### 3.2 Other programs' fidelity documents in Drive (accounted for, out of current app scope)

- **COSP™ Fidelity Journal** (Circle of Security Parenting; many duplicate copies + a Google-Doc template + `Fidelity Journal.pdf`) — a separate reflective fidelity instrument. Note: COSP concepts *are* referenced inside Child First forms ("Circle of Security concepts and language").
- **🧸 BEARS® Fidelity Checklist** (families version + coach-observation Google Form draft, from Gabriel) — separate program.
- These confirm a broader personal need: a *multi-model* fidelity tool. Treat as extensibility targets, not requirements (§5, Phase 5).

---

## 4. Gap Analysis

### 4.1 Version gap — the app digitizes superseded instruments

The POST ROSTERING (© 2018) forms differ structurally from what the app implements:

| Area | 2015 forms (in app) | POST ROSTERING forms (in Drive, not in app) |
|---|---|---|
| Roles | Clinician / Care Coordinator | Clinician / **CC or FRP** (Family Resource Partner) |
| IDs | CareLogic ID | **CFCR ID** |
| Strand challenges | Challenge scales on all 5 strands | **Removed** for Reflective/Emotional/Dyadic/Trauma (Foundational & Core keep only Procedural challenges) |
| Reflective capacity | 3 contexts × (Needs Dev/Emerging/Acquired) | Single row per item; Foundational/Termination use **In Session / Outside Session / In Supervision** columns |
| CPP objectives | Full grid: Clinical Focus 0–3, Under/Appropriate/Over, Progress 0–3 | **Replaced** by "Treatment Themes Fidelity and Objectives": 13 themes × (Currently Identified Focus / Potential Focus, Not Addressed / Not a Focus) |
| Introducing Child (II) | 6 numbered Done-items + coded responses | Free-text descriptions (introduction, child reaction, caregiver reaction, benevolent explanations) + date |
| Foundational assessment | CF1–CF14 + items 1–19 (two numbering tracks) | **Renumbered single track 1–23**, consolidated first-visit list, added safety-risk coding, appropriateness-of-CPP decision block, feedback sessions 1–10, formulation/POC sections, before/during/after home-visit sections |
| Termination (IV) | CF1–CF3 + 1–14 planned, CF1–CF5 unplanned, closing form, 5 strands, objectives, contact log | **Renumbered 1–17 planned / 1–4 unplanned** with sub-items; only 3 strands (Reflective, Emotional, Dyadic); no objectives grid; no closing-reasons form; no contact log |
| Supervision (V) | Yes/No procedural + capacity + knowledge + skills + 3 global ratings | Same 4-point Could-Do-Less/More/Appropriate/Strength scales, **global ratings removed**, new Abecedarian items for CC/FRP (capacity, knowledge "Executive Functioning Abecedarian theory", skill "Utilizing Abecedarian techniques…") |
| Contact log | In-form | Removed (CFCR service report accepted instead, per cheat sheet) |

**Decision required (blocking Phase 2):** which instrument set is authoritative for your site — POST ROSTERING (likely, given rostered staff and the 11/7/25 cheat sheet) or the 2015 "CPP-integrated" set (used pre-rostering / for CPP training credit)? Recommendation: support **both as versioned form templates**, defaulting to POST ROSTERING.

The **July 2025 Program Fidelity Checklist** likewise supersedes Oct 2019: pregnant-caregiver phrasing, 85 %-in-home + telehealth rules, caseload 10–16, Changent exception/approval language throughout, **required video use in intervention**, Fidelity Framework completion listed as a program item, CFCR/ASD 5-day data entry, benchmarks/accreditation levels (Exemplary/Consistent/Inconsistent/Probation), quarterly Quality Enhancement Summaries, and a much longer community-collaborative composition list.

### 4.2 Content-fidelity discrepancies inside the current app (against the 2015 sources)

1. **`cppObjectives.ts` (Foundational module) — likely fabricated content.** It defines 23 objectives ("Physical Safety", "Ghosts in Nursery", "Community Connection"…) in six invented categories ("Safety & Stability", "Trauma Processing"…). The official CPP objectives in *every* source document are the named sections: *Convey Hope; Develop Empathic Relationship; Enhance Safety (6 sub-areas); Strengthen Family Relationships/Emotional Reciprocity; Coordinate Care; Strengthen Dyadic Affect Regulation; Body-Based Regulation; Other Important Caregivers; Meaning of Behavior; Attachment-Exploration Balance; Normal Developmental Trajectory; Normalize Traumatic Response; Acknowledging Impact of Trauma; Then and Now; Perspective* — exactly what `cppClosingItems.ts`/`terminationItems.ts`/`coreInterventionItems.ts` correctly contain. The Foundational module's objectives section must be re-derived from the green document (or removed if the green form has no objectives grid).
2. **`homeVisitItems.ts` (Foundational) — paraphrased.** Its before/during/after items ("Checked in with caregiver and child", "Engaged in self-care/debriefing"…) do not match the official Child First home-visit items (which `coreInterventionItems.ts` `HOME_VISIT_CHECKLIST` transcribes correctly, and which the POST ROSTERING Foundational form also contains). Should be replaced with the official wording and Yes/No response format.
3. **`formulationItems.ts` — generic template** (presenting problems, developmental history…), not sourced from the fidelity forms. The POST ROSTERING Foundational form has a specific 4-item Formulation & Treatment Planning section plus a 2-item Plan of Care section. Reconcile or clearly label as a site-specific supplement.
4. **Contact log options deviate from the official CPP Contact Log.** Official contact types: Assessment, Care Coordination (2015 II says "Case management"), Feedback, Dyadic Treatment*, Individual caregiver*, Individual child*, Caregiver phone – conversation, Caregiver phone – message, Collateral – meeting/phone/other, Team meeting, Other; Session status: Show/Cancel/No Show; Reasons: Childcare problem, Conflicting appointment, Forgot, Illness, Team member cancelled, Transportation, Weather, Other; Attendees: Target child, Caregivers 1–4, Siblings 1–4, Collateral (specify); Where: Home/Clinic/Community/Other; plus **Session Counter**. The Foundational module's `formSchema.ts` uses a different invented list (Home Visit/Office Visit/Telehealth…, cancellation reasons like "Not Interested", locations like "School"). The Core Intervention/Termination modules got this right — the Foundational contact log should be aligned (or intentionally kept as an extended superset with the official values distinguished).
5. **Demographics option lists** (ethnicity, education, employment, referral source…) in `formSchema.ts` are richer than the form's actual fields (the green/POST ROSTERING forms collect a short target-child block: age in months, gender, ethnicity, language). Extra fields are fine as product value-add, but should be marked as app-extensions vs form-required so exports can mirror the official form.
6. **Ratings label drift:** app uses "Requires Development" for strand capacity (matches most docs) but `fidelityItems.ts` header comment says 2015 doc uses "Needs Development" in II-2015; trivial, but a versioned-template system resolves it cleanly.

### 4.3 Workflow gaps (from coversheet + cheat sheet v. 11/7/25 + supervision gap analysis)

- **Form cadence engine:** Assessment & Engagement finalized with formulation/treatment plan (≤ 60 days); Core Intervention every 90 days thereafter; Care Coordination with A&E then every 90 days; Supervision every 90 days per team member per fidelity case; Termination at discharge. The app has no concept of due dates, cycles, or per-case form history (each module stores a single instance per case — **no repeated 90-day submissions**, which the framework requires).
- **Dual marking:** Clinician ✓ / CC-FRP ✗ on the *same* form. Only the Core Intervention module models role-based answers (`RoleBasedChallenge`/`RoleBasedCapacity`); Foundational/Termination strands are single-answer.
- **Two fidelity cases per practitioner at all times** — no case-type flag or dashboard to track this.
- **Supervisor review loop:** forms are supposed to be delivered to the Clinical Supervisor before supervision and reviewed reflectively ("Fidelity Week"); the supervisor receives 4 forms per case per cycle. No review status, sign-off, or supervisor role in the app. (Your Jan 2026 gap analysis shows exactly why documented supervision logs matter — the app could *be* the documentation.)
- **Inter-rater reflection:** the Turtle "ALIGNED" workflow (compare Clinician vs FRP ratings, discuss divergences ≥ 2 levels, write reconciliation rationale) is a proven personal practice worth productizing.
- **Contact-log alternative:** cheat sheet permits a CFCR service report in lieu of the in-form log — worth an "attached externally" option.

### 4.4 Technical & professionalization gaps

- **Data safety:** clinical reflections live in unencrypted `localStorage`; clearing browser data destroys everything; no backup/export of raw data (only PDFs, and only for 4 of 6 forms). Minimum bar: JSON export/import + encrypted storage; proper bar: synced backend with auth (see plan).
- **PHI posture:** forms use client initials (good), but free-text fields (trauma descriptions, session notes) can contain PHI. Storage/transport policy must be explicit; the paper protocol requires locked-cabinet storage — the digital equivalent (encryption at rest, access control, retention) is currently absent.
- **Missing PDF exports** for Termination and Core Intervention (the two most consequential forms for accreditation review).
- **Repo hygiene:** duplicate legacy `Claude Fidelity App/` tree (with 4.7 MB source docs) inflates and confuses the repo; `package.json` name is `"y"`; README is Vite boilerplate; no tests; no CI; no type-safe schema validation of stored data (version migrations will corrupt silently).
- **No form-version metadata** on saved data — impossible to know which instrument revision a record was completed against (critical once POST ROSTERING versions are added).
- **Accessibility/quality:** no automated a11y checks; Lighthouse PWA work was done (PR #13) but no regression guard.

---

## 5. Research & Improvement Plan (phased)

### Phase 0 — Decisions & source-of-truth (1 session, blocking)
1. Confirm with the Clinical Supervisor/site which instruments are authoritative now: **POST ROSTERING 2018 set + July 2025 Program Checklist** (recommended default) vs 2015 set; whether both must coexist (2015 forms still fulfill trauma-informed CPP training requirements per the coversheet).
2. Decide data posture: local-only (encrypted, export/import) vs hosted backend (auth + sync). Recommendation: keep offline-first PWA, add optional encrypted sync later.
3. Add the missing **II Core Intervention 2015 source doc** (and POST ROSTERING docs) to a `docs/sources/` folder in the repo so every form has an auditable source, and delete the duplicated legacy app tree.

### Phase 1 — Content-fidelity corrections to the existing (2015) forms
1. Re-transcribe `cppObjectives.ts` from the green Foundational document (or remove if not in that form) — replace the invented 23-objective taxonomy with the official CPP objective sections. **Highest priority.**
2. Replace `homeVisitItems.ts` with the official before/during/after items (reuse `HOME_VISIT_CHECKLIST` from `coreInterventionItems.ts`).
3. Align the Foundational contact log with the official CPP Contact Log columns/options; add Session Counter; keep app-extras behind an "additional detail" section.
4. Reconcile `formulationItems.ts` with the official Formulation/Treatment-Planning items; label site-specific extras.
5. Build a **transcription verification checklist**: item-by-item diff of each data file against its source doc (I, III, IV, V, Program Oct 2019); record results in `docs/sources/VERIFICATION.md`.

### Phase 2 — Version upgrade (new instruments)
1. Introduce **form-template versioning** (`formVersion` on every saved record; template registry per instrument/edition).
2. Implement the four POST ROSTERING forms (I, II, IV, V) as new template versions — structures documented in §4.1; update role labels to "CC or FRP", ID field to CFCR ID.
3. Implement the **July 2025 Program Fidelity Checklist** as a new version of the program module (17 sections incl. video requirement, accreditation levels, QES).
4. Add the 13-theme **Treatment Themes** component (shared by POST ROSTERING I and II).

### Phase 3 — Workflow engine (the framework, not just the forms)
1. **Case arc & cadence:** per-case timeline (A&E ≤ 60 days → Core every 90 days → Termination), due-date computation, overdue indicators, and repeated form instances per cycle (the biggest data-model change: one-record-per-case → records-per-cycle).
2. **Dual marking everywhere:** extend the Core Intervention role-based pattern (✓/✗) to Foundational and Termination strands.
3. **Fidelity-case dashboard:** track the "2 fidelity cases per practitioner" rule; prompt to open a new fidelity case when one closes.
4. **Supervisor review loop:** review-ready state, supervisor notes/sign-off, and a supervision log (date, duration, type: individual/team/group, content themes) — directly answering the documentation gaps in the Jan 2026 Supervision Fidelity Gap Analysis.
5. **Inter-rater alignment view:** side-by-side Clinician vs CC/FRP ratings with divergence highlighting (≥ 2 levels flagged) and a reconciliation-note field — productizing the Turtle ALIGNED workflow.
6. **PDF exports for all six forms**, laid out to mirror the official documents (so a printed export is recognizably the sanctioned form), plus raw JSON export/import for backup.

### Phase 4 — Professionalization
1. **Data protection:** encrypt at rest (WebCrypto, passphrase-derived key), an explicit PHI policy in-app, optional auto-lock; document retention guidance mirroring the locked-cabinet requirement.
2. **Engineering hygiene:** rename package, real README (what/why/how, screenshots, provenance of instruments, © Child First attribution), remove `Claude Fidelity App/` duplicate, add Vitest unit tests for schema/storage/scoring, add data-migration tests, GitHub Actions CI (typecheck, lint, test, build), schema validation (e.g., zod) on load with versioned migrations.
3. **Accessibility & UX:** axe checks in CI; verify long-form usability on mobile (home-visit reality); confirm offline behavior for full form lifecycle.
4. **Optional backend:** if multi-user (team + supervisor) is desired, add auth + encrypted sync (e.g., Supabase/self-hosted) — this is what unlocks the true team workflow (both members marking one shared form).

### Phase 5 — Extensions (from the wider Drive corpus)
1. **CPP Fidelity Compass** reflective prompts integrated per strand (content already in Drive overview PDF; app already has a Compass component to grow).
2. **Multi-model support:** template abstraction is the same machinery needed for the **COSP Fidelity Journal** and **BEARS checklists** found in Drive — consider a pluggable "instrument pack" design rather than hard-coded modules.
3. Surface the cheat-sheet guidance ("not an evaluation… generates reflective conversation") as in-app framing text, consistent with the coversheet's instruction that forms are conversation starters, not compliance checklists.

---

## 6. Documents not fully reviewable / follow-ups

- `Mastering_Fidelity_Forms.mp4` — video, not readable in this environment; may contain additional workflow guidance.
- `Child First Program Fidelity Checklist – July 2025_restricted(2).docx` — a second (restricted) copy owned by a collaborator; assumed identical to the unrestricted copy that was read in full.
- Turtle case fills (Skylar-Filled / ALIGNED .docx) — read for workflow signal via `What Shifted.md`; the full fills are case data, not instrument definitions.
- COSP Fidelity Journal / BEARS checklists — separate programs; read sufficiently to scope Phase 5.

## 7. Open questions

1. Which instrument set should the app treat as current — POST ROSTERING 2018 (recommended) or 2015 CPP-integrated — and do you need both selectable per case?
2. Is the app single-practitioner (you) or team-facing (Clinician + CC/FRP + Supervisor)? This decides whether Phase 4's backend is needed before Phase 3's shared-form features.
3. Should the Foundational module's extra demographics/plan-of-care sections stay (as site value-add) or be trimmed to mirror the official forms exactly for accreditation-friendly exports?
