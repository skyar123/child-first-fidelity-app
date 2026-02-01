// Termination Fidelity Items based on Child First Fidelity Documentation

export interface TerminationItem {
  id: string
  text: string
  category: 'planned' | 'unplanned_reengagement' | 'unplanned_process' | 'reflection'
}

export interface TerminationSection {
  id: string
  title: string
  description: string
  items: TerminationItem[]
}

export const TERMINATION_SECTIONS: TerminationSection[] = [
  {
    id: 'planned_preparation',
    title: 'Planned Termination: Preparation',
    description: 'Steps to prepare for planned termination with the family',
    items: [
      {
        id: 'pt_timing_reflection',
        text: 'Reflected on timing of termination & discussed with Clinical Supervisor',
        category: 'planned'
      },
      {
        id: 'pt_caregiver_discussion',
        text: 'Discussed termination alone with caregiver 2 months prior to actual termination',
        category: 'planned'
      },
      {
        id: 'pt_outcome_eval',
        text: 'Scheduled treatment outcome evaluation with caregiver',
        category: 'planned'
      },
      {
        id: 'pt_child_notification',
        text: 'Told child about termination at least 1 month prior to termination',
        category: 'planned'
      },
      {
        id: 'pt_goodbye_planning',
        text: 'Jointly planned with caregiver and child how you will say goodbye',
        category: 'planned'
      }
    ]
  },
  {
    id: 'planned_process',
    title: 'Planned Termination: Goodbye Process',
    description: 'Steps for processing the goodbye and closure with the family',
    items: [
      {
        id: 'pt_process_goodbye',
        text: 'Processed goodbye with dyad',
        category: 'planned'
      },
      {
        id: 'pt_discuss_success',
        text: 'Discussed family\'s success and strengths observed during treatment',
        category: 'planned'
      },
      {
        id: 'pt_discuss_goals',
        text: 'Discussed goals not yet achieved and how family can continue working on them',
        category: 'planned'
      },
      {
        id: 'pt_future_planning',
        text: 'Developed plan for the future with the family',
        category: 'planned'
      },
      {
        id: 'pt_final_referrals',
        text: 'Made final referrals for ongoing support or services as needed',
        category: 'planned'
      },
      {
        id: 'pt_documentation',
        text: 'Completed all required documentation for case closure',
        category: 'planned'
      }
    ]
  },
  {
    id: 'unplanned_reengagement',
    title: 'Unplanned Termination: Re-engagement Efforts',
    description: 'Steps taken to attempt re-engagement with families who disengaged',
    items: [
      {
        id: 'ur_calls_letters',
        text: 'Team made efforts to reengage family through calls and letters at the discretion of agency guidelines',
        category: 'unplanned_reengagement'
      },
      {
        id: 'ur_referral_contact',
        text: 'Team contacted referral source regarding family engagement',
        category: 'unplanned_reengagement'
      },
      {
        id: 'ur_support_contact',
        text: 'Team contacted other family supports and service providers',
        category: 'unplanned_reengagement'
      },
      {
        id: 'ur_supervisor_discussion',
        text: 'Discussed barriers to treatment and engagement with Clinical Supervisor',
        category: 'unplanned_reengagement'
      },
      {
        id: 'ur_barrier_analysis',
        text: 'Analyzed potential barriers from family, system, and team perspectives',
        category: 'unplanned_reengagement'
      }
    ]
  },
  {
    id: 'unplanned_process',
    title: 'Unplanned Termination: Closure Process',
    description: 'Steps for properly closing a case when re-engagement is unsuccessful',
    items: [
      {
        id: 'up_closing_letter',
        text: 'Team sent "Closing" letter to family indicating family can return at a future date',
        category: 'unplanned_process'
      },
      {
        id: 'up_door_open',
        text: 'Communicated that the door remains open for future services',
        category: 'unplanned_process'
      },
      {
        id: 'up_site_procedures',
        text: 'Team followed policies/procedures of their site to close file',
        category: 'unplanned_process'
      },
      {
        id: 'up_documentation',
        text: 'Completed all required unplanned termination documentation',
        category: 'unplanned_process'
      }
    ]
  },
  {
    id: 'team_reflection',
    title: 'Team Reflection on Termination',
    description: 'Reflective practice around the termination process',
    items: [
      {
        id: 'tr_emotional_processing',
        text: 'Team processed their own emotional reactions to termination',
        category: 'reflection'
      },
      {
        id: 'tr_case_review',
        text: 'Reviewed the case journey with supervisor - what worked, what was challenging',
        category: 'reflection'
      },
      {
        id: 'tr_learning',
        text: 'Identified key learnings from this case for future practice',
        category: 'reflection'
      },
      {
        id: 'tr_parallel_process',
        text: 'Discussed any parallel process dynamics that emerged during termination',
        category: 'reflection'
      },
      {
        id: 'tr_self_care',
        text: 'Team members engaged in self-care after case closure',
        category: 'reflection'
      }
    ]
  }
]

// Default values for termination form
export interface TerminationFormData {
  identification: {
    caseId: string
    clientInitials: string
    terminationType: 'planned' | 'unplanned' | ''
    terminationDate: string
    lastSessionDate: string
    totalSessionsCompleted: string
    teamMembers: string
  }
  plannedTermination: Record<string, 'yes' | 'no' | 'na' | ''>
  unplannedReengagement: Record<string, 'yes' | 'no' | 'na' | ''>
  unplannedProcess: Record<string, 'yes' | 'no' | 'na' | ''>
  teamReflection: Record<string, 'yes' | 'no' | 'na' | ''>
  outcomes: {
    treatmentGoalsAchieved: 'fully' | 'partially' | 'not' | ''
    caregiverFeedback: string
    strengthsObserved: string
    areasForContinuedGrowth: string
    referralsMade: string
  }
  notes: {
    supervisorNotes: string
    additionalComments: string
  }
}

export const DEFAULT_TERMINATION_DATA: TerminationFormData = {
  identification: {
    caseId: '',
    clientInitials: '',
    terminationType: '',
    terminationDate: '',
    lastSessionDate: '',
    totalSessionsCompleted: '',
    teamMembers: ''
  },
  plannedTermination: {},
  unplannedReengagement: {},
  unplannedProcess: {},
  teamReflection: {},
  outcomes: {
    treatmentGoalsAchieved: '',
    caregiverFeedback: '',
    strengthsObserved: '',
    areasForContinuedGrowth: '',
    referralsMade: ''
  },
  notes: {
    supervisorNotes: '',
    additionalComments: ''
  }
}
