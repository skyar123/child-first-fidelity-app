# Transcription Verification

## July 2026 — verification against practitioner-uploaded authoritative copies

The app was re-verified item-by-item against copies of the documents uploaded
directly by the practitioner (the versions actually in use at the site):
Fidelity Forms Cheat Sheet (© 2016), V Supervision (pink, 2015), IV Termination
(yellow, 2015 rev. 7.9.2018), and III Care Coordinator Interventions (July 2018).

Results:
- **Cheat sheet (© 2016)** — cadences match the app (A&E throughout phase,
  Core/CC/Supervision every 3 months, Termination at end; contact log after
  each session; Supervision completed individually). ✅
- **V Supervision (pink)** — procedural items, all capacity/knowledge/skills
  items (incl. Clinician-only and Care-Coordinator-only), Could Do Less/More/
  Appropriate/Strength scale, Global Ratings (Not at all → Extremely), and the
  CPP Supervision Log columns (date, # supervisees, minutes, % clinical vs
  administrative, counter, notes) all match. **Fixed:** Global Ratings header
  now carries the form's "Completed every four months" note.
- **IV Termination (yellow)** — closing form items 1–7 (incl. transfer-to-
  another-CPP-Clinician), planned termination numbering CF1, 1, CF2, CF3, 2
  (<2 mo), 3, 4, 10, 5 (<1 mo), 6, 7, 8, 9, CF4, CF5, 11, 12, unplanned
  CF6–CF10, contact log, five strands, and the objectives grid (Clinical Focus /
  Under-Appropriate-Over / Progress Current) all match. **Fixed:** the
  reference CLOSING_REASONS list now includes "Completed treatment" (the UI
  already rendered it via a dedicated field).
- **III Care Coordinator (July 2018)** — all sections/items match, including
  "Done / N/A or UTD" response columns, the Baseline/6-Months/Termination ×
  In-Process/Completed/Entered assessment tracking grid, and CC/FRP role
  language. **Improved:** the form is now also available as a template
  instrument (`cc_interventions`) in the Current Instruments group, so the
  CC/FRP gets one record per 90-day cycle, cadence tracking on the dashboard,
  review status, and PDF export — matching the "every 3 months thereafter"
  requirement that the single-record legacy module could not represent.


Item-by-item checks of app content against the official source documents.
Convention used throughout the app: where the paper form offers Yes/No columns
for procedure items, a **checked box records "Yes"**; unchecked means not yet
done/answered. Progress indicators distinguish blank forms from completed ones.

## Foundational Phase (green, 2015 CF integrated 5.2.18) — verified July 2026

| App file | Status |
|---|---|
| `fidelityItems.ts` (5 strands, challenges + capacities) | ✅ Matches source |
| `assessmentItems.ts` (Engagement, Assessment & History, Trauma Screening, Caregiver Response, Child Symptoms, Observation, Caregiver Trauma, CF items, Supervision/Formulation) | ✅ Matches source |
| `traumaFeedbackItems.ts` (Trauma-Informed CPP Feedback Session) | ✅ Matches source |
| `cppObjectives.ts` | ✅ **Fixed July 2026** — previously contained 23 invented objectives in invented categories; now re-exports the official CPP Case Conceptualization and Content Fidelity objective groups (canonical text in `cppClosingItems.ts`) with the form's rating scales: Clinical Focus 0–3, Under/Appropriate/Over, Progress Referral 0–3, Progress Current 0–3 |
| `homeVisitItems.ts` | ✅ **Fixed July 2026** — previously paraphrased; now transcribes CF24–CF33 (Before/During/After Each Home Visit) verbatim |
| `formulationItems.ts` | ✅ **Fixed July 2026** — previously a generic narrative template; now transcribes the Formulation and Treatment Planning Session (items 1–3, CF16–CF19) and Child and Family Plan of Care (CF20–CF23). A free-text notes field is kept and labeled as an app extension |
| Contact log options (`formSchema.ts`) | ✅ **Fixed July 2026** — now matches PROCEDURAL FIDELITY: CPP CONTACT LOG (contact types incl. Care Coordination and phone/collateral splits; Show/Cancel/No Show; official not-attending reasons; Home/Clinic/Community/Other; Caregiver 1–4 / Sibling 1–4 / Collateral; Session Counter) |
| Demographics option lists (`formSchema.ts`) | ⚠ App extension — richer than the form's short target-child block (age, gender, ethnicity, language). Retained for clinical value; PDF export includes them under app data, not as official form fields |
| `PlanOfCareSection` (goals/safety plan/crisis contacts) | ⚠ App extension — the official Plan of Care fidelity items are CF20–CF23 (now in the Formulation section). The goal-tracking UI is retained as a supplement |

## Core Intervention (purple, 2015 4.24.18) — verified July 2026 against Drive copy

`coreInterventionItems.ts`: Registration form, Introducing the Child to CPP
items 1–6 (incl. 2a Triangle of Explanations, 3a/3b response coding), CPP
Contact Log, five strands (challenges + capacities incl. role-based
Clinician/CC marks), procedural capacity three-column responses, Before/During/
After home-visit items, and the full CPP objectives grid. ✅ Matches source.
Known label variance: source strand headers say "Needs Development" (Reflective)
vs "Requires Development" (Trauma/others); app standardizes on "Requires
Development".

## Care Coordinator (July 2018) — verified July 2026

`careCoordinatorItems.ts`: 7 sections (Collaborative Family Assessment through
Ongoing Intervention) ✅ Matches source.

## Termination (yellow, 2015 7.9.2018) — verified July 2026

`terminationItems.ts` / `cppClosingItems.ts` / `terminationSchema.ts`: planned
termination CF1–CF3 + 1–14, unplanned CF1–CF5, closing form (reasons, phase,
initiator, type, functioning, prognosis), strands, objectives, contact log.
✅ Matches source.

## Supervision (pink, 2015) — verified July 2026

`supervisionItems.ts`: procedural Yes/No items, supervisor capacity (general +
clinician-only + care-coordinator-only), knowledge areas, skills &
competencies, global ratings. ✅ Matches source.

## Program Fidelity Checklist (Oct 2019) — verified July 2026

`programFidelityItems.ts`: 17 sections, 0–3 scale + comments. ✅ Matches source.

## POST ROSTERING set (© 2018) & Program Checklist July 2025

Implemented as versioned templates in `src/templates/` — transcribed July 2026
from the Drive documents listed in SOURCES.md.
