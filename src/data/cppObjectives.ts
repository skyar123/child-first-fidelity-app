// CPP Case Conceptualization and Content Fidelity — CPP Objectives
// Transcribed from "cz_I Foundational Phase Fidelity 2015 CF integrated -
// Green fillable 5.2.18" (docs/sources/). The objective groups and item
// wording are identical to the Core Intervention (purple) and Closing
// (yellow) forms; the canonical text lives in cppClosingItems.ts and is
// re-exported here. The Foundational form adds a "Progress at Referral"
// column alongside "Progress Current".

import { CPP_OBJECTIVES } from './cppClosingItems'
import type { CPPObjective as CPPObjectiveContent } from './cppClosingItems'

export type { CPPObjectiveContent }

// The official objective groups, in form order
export const cppObjectives: CPPObjectiveContent[] = CPP_OBJECTIVES

// ----------------------------------------
// Rating scales (verbatim from the form)
// ----------------------------------------

// Clinical Focus: degree to which the Clinician/Care Coordinator's
// interventions addressed the objective
export const CLINICAL_FOCUS_LABELS: Record<number, string> = {
  0: 'Not at all a focus',
  1: 'Minor',
  2: 'Moderate',
  3: 'Significant',
}

// Appropriateness of the amount of therapeutic focus
export const APPROPRIATENESS_LABELS: Record<string, string> = {
  under: 'Under — should have focused more on this objective',
  appropriate: 'Appropriate — amount of therapeutic focus seems appropriate',
  over: 'Over — may have overly focused, to the detriment of other objectives',
}

// Progress Towards Objective (Referral = upon referral;
// Current = at the end of the Foundational Phase)
export const PROGRESS_SCALE_LABELS: Record<number, string> = {
  0: 'Primary Target/Urgent Concern: Immediate risk to development, relationship and/or therapeutic alliance',
  1: 'Emerging: Early manifestations',
  2: 'Present but Unstable: Good under some conditions. Not fully consolidated. Lost in response to internal or external stress',
  3: 'Established: Good enough to support development',
}

export const PROGRESS_SHORT_LABELS: Record<number, string> = {
  0: 'Primary Target',
  1: 'Emerging',
  2: 'Present but Unstable',
  3: 'Established',
}
