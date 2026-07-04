// Treatment Themes Fidelity and Objectives
// Shared by POST ROSTERING Foundational (I) and Core Intervention (II) forms.
// "Please indicate the extent to which a goal was identified as a focus."

import type { TemplateItem } from './types'
import { THEME_OPTIONS } from './types'

const theme = (id: string, label: string, detail: string): TemplateItem => ({
  id,
  type: 'radio',
  label,
  detail,
  options: THEME_OPTIONS,
})

export const TREATMENT_THEME_ITEMS: TemplateItem[] = [
  theme(
    'theme_convey_hope',
    'CONVEY HOPE',
    'Ex. Highlighted that growth is possible, identified "angels in the nursery", understood caregiver\'s challenges in engaging with outside providers'
  ),
  theme(
    'theme_safety',
    'SAFETY',
    'Ex. Safety plans are put into place, safety has been prioritized by the team; reports may have been made to child welfare agency, encouraged consistent participation in treatment, care coordination utilized to help family obtain basic needs, addressed safety in relationships'
  ),
  theme(
    'theme_family_relationships',
    'STRENGTHEN FAMILY RELATIONSHIPS / PROMOTE EMOTIONAL RECIPROCITY',
    'Ex. Helped caregiver respond benevolently to child, helped caregiver address child\'s emotional needs, fostered trust in relationship, facilitated dyadic play, reflected how play can be used as a daily activity.'
  ),
  theme(
    'theme_coordinate_care',
    'COORDINATE CARE / ADDRESS FAMILY SERVICE NEEDS / DEVELOP CAREGIVER EXECUTIVE FUNCTIONING',
    'Ex. Helped family members obtain needed referrals to services, identified barriers to accessing services, helped caregiver develop effective and realistic problem-solving strategies that would meet the needs of the family'
  ),
  theme(
    'theme_affect_regulation',
    'STRENGTHEN DYADIC AFFECT REGULATION CAPACITIES',
    'Ex. Provided developmental guidance around typical emotional reactions often observed in young children, fostered strategies for regulating affect, helped caregiver understand own emotional reaction'
  ),
  theme(
    'theme_body_regulation',
    'STRENGTHEN DYADIC BODY-BASED REGULATION',
    'Ex. Helped dyad understand body-based trauma reminders, enhanced understanding of safe body-boundaries, helped caregiver understand body-based regulation strategies to help self and child'
  ),
  theme(
    'theme_other_caregivers',
    "STRENGTHEN CHILD'S RELATIONSHIP WITH OTHER IMPORTANT CAREGIVERS",
    "Ex. Helped caregivers understand child's point of view, helped child have age-appropriate understanding of the family's history"
  ),
  theme(
    'theme_meaning_behavior',
    'ENHANCE UNDERSTANDING OF THE MEANING OF BEHAVIOR',
    "Ex. Provided developmental guidance, introduced frequently used language and concepts to build a common vocabulary (e.g., emotional muscle, Circle of Security concepts and language, trauma reminders, etc.), helped caregivers notice behaviors (child's, caregiver's, others)"
  ),
  theme(
    'theme_developmental_trajectory',
    'SUPPORT CHILD IN RETURNING TO NORMAL DEVELOPMENTAL TRAJECTORY',
    "Ex. Supported adaptive behavior and normative developmental activities, supported healthy non-trauma play (e.g. Learning Games), fostered caregiver's efforts to engage in age appropriate activities (e.g. Enhanced Caregiving), provided care coordination to help engage child in age appropriate activities (e.g. pre-school)"
  ),
  theme(
    'theme_normalize_trauma',
    'NORMALIZE TRAUMATIC RESPONSE',
    "Ex. Acknowledge effects of child's and caregiver's experience of trauma and historical trauma, provided psychoeducation: Impact of trauma, including common symptoms & PTSD, trauma reminders and how they affect child and caregiver, helped caregiver anticipate developmental changes in child's processing of the trauma"
  ),
  theme(
    'theme_acknowledge_trauma',
    'SUPPORT DYAD IN ACKNOWLEDGING IMPACT OF TRAUMA',
    "Ex. Helped caregiver acknowledge what child has witnessed & remembers, considered ghosts in the nursery with caregiver, helped caregiver and child understand each other's reality (with regards to the trauma)"
  ),
  theme(
    'theme_then_now',
    'HELP DYAD DIFFERENTIATE BETWEEN THEN AND NOW',
    'Ex. Highlighted difference between past and present circumstances, helped dyad understand that they can make new choices'
  ),
  theme(
    'theme_perspective',
    'HELP DYAD PUT TRAUMATIC EXPERIENCES IN PERSPECTIVE',
    'Ex. Supported caregiver and child in making meaning (e.g. creating a story, using ritual, connecting with spiritual beliefs), helped dyad to find hope through mutual enjoyment of activities (e.g. play, Learning Games, Enhanced Caregiving and other Abecedarian tools)'
  ),
]
