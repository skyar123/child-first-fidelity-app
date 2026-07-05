# Child First Fidelity App

A digital instrument for **Child First Clinicians and Care Coordinators / Family
Resource Partners (CC/FRP)** to complete their fidelity forms on a phone, tablet,
or laptop instead of printing and hand-filling paper forms.

The app digitizes the **Child First Fidelity Framework** (adapted from
Child-Parent Psychotherapy) — see `docs/sources/SOURCES.md` for the provenance
of every instrument. The forms are intentionally faithful transcriptions of the
official documents: a printed export should be recognizably the sanctioned form.

## What it does

- **One implementation per instrument** — the five forms of the Child First
  Fidelity Framework (I Foundational green, II Core Intervention purple,
  III Care Coordination, IV Termination yellow, V Supervision pink), verified
  against the site's own documents. No duplicate versions in the UI.
- **Dual marking**: Clinician answers (✓) and CC/FRP answers (✗) side by side on
  the same form, exactly like the paper workflow.
- **Fidelity case arc**: Assessment & Engagement (≤ 60 days) → Core Intervention
  every 90 days → Termination at discharge, with due dates and per-cycle records
  (not one static form per case).
- **PDF export** of completed forms and **JSON backup/restore** of all data.
- **Offline-first PWA** — works in the field with no signal; all data stays on
  your device in browser storage.
- Reflective extras: CPP Fidelity Compass prompts, grounding exercise,
  reflective journal.

## Data & privacy

All data is stored locally in your browser (`localStorage`) and never leaves
your device. Use client **initials only** — never full names — and keep
free-text notes free of identifying details, consistent with how the paper
forms are handled (locked-cabinet standard). Export a JSON backup regularly;
clearing browser data erases everything.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build
npm run lint       # eslint
npm test           # vitest unit tests
```

Built with React 18, TypeScript, Vite, Tailwind CSS 4, react-hook-form, jsPDF.

## Repository layout

- `src/data/` — transcribed instrument content (one file per form/section)
- `src/templates/` — versioned template registry for the POST ROSTERING engine
- `src/components/` — form UIs (per-module shells + shared UI kit)
- `src/utils/` — storage, PDF export, backup
- `docs/sources/` — official source documents + provenance register
- `docs/FIDELITY_AUDIT_AND_RESEARCH_PLAN.md` — the audit this build follows

## Attribution

The fidelity instruments are © Child First and adapted from Child-Parent
Psychotherapy (childparentpsychotherapy.com). This app is a personal
documentation aid and is not affiliated with or endorsed by Child First.
The forms are meant to *generate reflective conversation in supervision*,
not to serve as a compliance checklist.
