import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TerminationFormData } from '../../../types/termination.types';

// Rating options for challenge levels
const challengeLevelOptions = [
  { value: '', label: 'Select...' },
  { value: 'no', label: 'No' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'significant', label: 'Significant' },
];

// Rating options for capacity levels
const capacityOptions = [
  { value: '', label: 'Select...' },
  { value: 'requiresDevelopment', label: 'Requires Development' },
  { value: 'emerging', label: 'Emerging' },
  { value: 'acquired', label: 'Acquired' },
];

// Procedural response options
const proceduralResponseOptions = [
  { value: '', label: 'Select...' },
  { value: 'no', label: 'No' },
  { value: 'yesNotRegular', label: 'Yes, But Did Not Attend Regularly' },
  { value: 'yesAttended', label: 'Yes, Attended' },
];

interface DualRatingFieldProps {
  label: string;
  fieldPath: string;
  options: { value: string; label: string }[];
  showNotNeeded?: boolean;
}

const DualRatingField: React.FC<DualRatingFieldProps> = ({
  label,
  fieldPath,
  options,
  showNotNeeded = false
}) => {
  const { control } = useFormContext<TerminationFormData>();

  return (
    <div className="border-b border-yellow-100 py-3">
      <div className="text-sm text-gray-700 mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Clinician</label>
          <Controller
            name={`${fieldPath}.clinician` as any}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                {showNotNeeded && <option value="notNeeded">Not Needed</option>}
              </select>
            )}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Care Coordinator</label>
          <Controller
            name={`${fieldPath}.careCoordinator` as any}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                {showNotNeeded && <option value="notNeeded">Not Needed</option>}
              </select>
            )}
          />
        </div>
      </div>
    </div>
  );
};

interface FidelitySectionProps {
  title: string;
  children: React.ReactNode;
}

const FidelitySection: React.FC<FidelitySectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-yellow-800 bg-yellow-100 px-4 py-2 rounded-t-lg border-b-2 border-yellow-300">
      {title}
    </h4>
    <div className="bg-white border border-yellow-200 rounded-b-lg p-4">
      {children}
    </div>
  </div>
);

export const CoreInterventionFidelitySection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-2">
          CPP Core Intervention Fidelity
        </h3>
        <p className="text-sm text-yellow-700">
          <strong>Instructions:</strong> Clinician should mark his/her answers with a check (1st column),
          and Care Coordinator/FRP should mark his/her answers with an X (2nd column).
          Complete at the end of treatment to reflect on intervention fidelity during the termination phase.
        </p>
      </div>

      {/* REFLECTIVE PRACTICE FIDELITY */}
      <FidelitySection title="Reflective Practice Fidelity">
        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Potential Sources of Challenge
          </h5>

          <DualRatingField
            label="Family is difficult to engage or work with"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.familyDifficultToEngage"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Family trauma history is likely to provoke negative reactions in any clinician"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.familyTraumaHistory"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Systems are involved in complicated and/or conflictual ways with family/treatment"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.systemsInvolved"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Clinician/Care Coordinator and caregiver have significantly different perspectives or cultural beliefs"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.differentPerspectives"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Clinician/Care Coordinator knowledge and skill level (e.g., new Clinician/Care Coordinator, new to the model or trauma work)"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.knowledgeSkillLevel"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Limited access to safe reflective supervision or reflective consultation"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.limitedSupervision"
            options={challengeLevelOptions}
          />

          <DualRatingField
            label="Clinician and Care Coordinator have significantly different perspectives or cultural beliefs"
            fieldPath="coreInterventionFidelity.reflectivePractice.challenges.teamDifferentPerspectives"
            options={challengeLevelOptions}
          />
        </div>

        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Clinician/Care Coordinator Reflective Practice Capacity
          </h5>

          <div className="text-sm text-gray-600 mb-3 font-medium">Awareness of own emotional reactions</div>
          <DualRatingField
            label="In the moment (in session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessEmotional.inMoment"
            options={capacityOptions}
          />
          <DualRatingField
            label="Upon self-reflection (outside session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessEmotional.selfReflection"
            options={capacityOptions}
          />
          <DualRatingField
            label="In supervision/consultation"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessEmotional.inSupervision"
            options={capacityOptions}
          />

          <div className="text-sm text-gray-600 mb-3 mt-4 font-medium">Awareness of own personal and/or cultural biases</div>
          <DualRatingField
            label="In the moment (in session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessBiases.inMoment"
            options={capacityOptions}
          />
          <DualRatingField
            label="Upon self-reflection (outside session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessBiases.selfReflection"
            options={capacityOptions}
          />
          <DualRatingField
            label="In supervision/consultation"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.awarenessBiases.inSupervision"
            options={capacityOptions}
          />

          <div className="text-sm text-gray-600 mb-3 mt-4 font-medium">Ability to consider multiple perspectives (caregiver's, child's, own)</div>
          <DualRatingField
            label="In the moment (in session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.multiplePerspectives.inMoment"
            options={capacityOptions}
          />
          <DualRatingField
            label="Upon self-reflection (outside session)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.multiplePerspectives.selfReflection"
            options={capacityOptions}
          />
          <DualRatingField
            label="In supervision/consultation"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.multiplePerspectives.inSupervision"
            options={capacityOptions}
          />

          <DualRatingField
            label="Ability to recognize and regulate strong emotions prior to intervening (in the moment)"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.regulateEmotions"
            options={capacityOptions}
          />

          <DualRatingField
            label="Use of self-care practices to enhance ability to regulate"
            fieldPath="coreInterventionFidelity.reflectivePractice.capacity.selfCarePractices"
            options={capacityOptions}
          />
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Use of External Supports
          </h5>
          <div className="text-sm text-gray-600 mb-3">Appropriately uses supervision and/or consultation with colleagues to:</div>

          <DualRatingField
            label="Process emotional reactions"
            fieldPath="coreInterventionFidelity.reflectivePractice.externalSupports.processEmotions"
            options={capacityOptions}
          />
          <DualRatingField
            label="Consider alternative perspectives"
            fieldPath="coreInterventionFidelity.reflectivePractice.externalSupports.alternativePerspectives"
            options={capacityOptions}
          />
          <DualRatingField
            label="Seek new knowledge & new skills"
            fieldPath="coreInterventionFidelity.reflectivePractice.externalSupports.seekKnowledge"
            options={capacityOptions}
          />
        </div>
      </FidelitySection>

      {/* EMOTIONAL PROCESS FIDELITY */}
      <FidelitySection title="Emotional Process Fidelity">
        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Potential Sources of Challenge
          </h5>
          <div className="text-sm text-gray-600 mb-3">Degree to which in sessions...</div>

          <DualRatingField
            label="Caregiver is dysregulated or triggered"
            fieldPath="coreInterventionFidelity.emotionalProcess.challenges.caregiverDysregulated"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver is avoidant or shut down"
            fieldPath="coreInterventionFidelity.emotionalProcess.challenges.caregiverAvoidant"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Child is dysregulated or triggered"
            fieldPath="coreInterventionFidelity.emotionalProcess.challenges.childDysregulated"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Child is avoidant or shut down"
            fieldPath="coreInterventionFidelity.emotionalProcess.challenges.childAvoidant"
            options={challengeLevelOptions}
          />
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Capacity to Handle Emotional Challenges
          </h5>
          <div className="text-sm text-gray-600 mb-3">Clinician/Care Coordinator is able to...</div>

          <DualRatingField
            label="Identify when caregiver is not regulated"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.identifyCaregiverNotRegulated"
            options={capacityOptions}
          />
          <DualRatingField
            label="Tolerate caregiver's strong emotional reactions"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.tolerateCaregiverEmotions"
            options={capacityOptions}
          />
          <DualRatingField
            label="Intervene in ways to help caregiver become regulated"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.helpCaregiverRegulate"
            options={capacityOptions}
          />
          <DualRatingField
            label="Identify when child is not regulated"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.identifyChildNotRegulated"
            options={capacityOptions}
          />
          <DualRatingField
            label="Tolerate child's strong emotional reactions"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.tolerateChildEmotions"
            options={capacityOptions}
          />
          <DualRatingField
            label="Create a context where child's emotional response is understood"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.createContextUnderstood"
            options={capacityOptions}
          />
          <DualRatingField
            label="Create a context where child is helped to regulate"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.createContextRegulate"
            options={capacityOptions}
          />
          <DualRatingField
            label="Identify when Clinician/Care Coordinator's personal history, culture, or beliefs are impacting emotional process fidelity"
            fieldPath="coreInterventionFidelity.emotionalProcess.capacity.identifyPersonalImpact"
            options={capacityOptions}
          />
        </div>
      </FidelitySection>

      {/* DYADIC-RELATIONAL FIDELITY */}
      <FidelitySection title="Dyadic-Relational Fidelity">
        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Potential Sources of Challenge
          </h5>
          <div className="text-sm text-gray-600 mb-3">Degree to which in the sessions...</div>

          <DualRatingField
            label="Caregiver and child have conflictual, competing agendas"
            fieldPath="coreInterventionFidelity.dyadicRelational.challenges.conflictualAgendas"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver has difficulty understanding or tolerating child's behavior or temperament"
            fieldPath="coreInterventionFidelity.dyadicRelational.challenges.difficultyUnderstanding"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver and/or child serve as trauma reminders to the other"
            fieldPath="coreInterventionFidelity.dyadicRelational.challenges.traumaReminders"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver has unrealistic expectations of the child"
            fieldPath="coreInterventionFidelity.dyadicRelational.challenges.unrealisticExpectations"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Child has sensorimotor or affect regulation challenges"
            fieldPath="coreInterventionFidelity.dyadicRelational.challenges.sensorimotorChallenges"
            options={challengeLevelOptions}
          />
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Capacity to Address the Needs of Caregiver and Child
          </h5>
          <div className="text-sm text-gray-600 mb-3">Clinician/Care Coordinator is able to...</div>

          <DualRatingField
            label="Balance attention between caregiver and child (tracking both)"
            fieldPath="coreInterventionFidelity.dyadicRelational.capacity.balanceAttention"
            options={capacityOptions}
          />
          <DualRatingField
            label="Hold/support child and caregiver perspectives"
            fieldPath="coreInterventionFidelity.dyadicRelational.capacity.holdPerspectives"
            options={capacityOptions}
          />
          <DualRatingField
            label="Bridge/translate between caregiver & child (help them understand each other)"
            fieldPath="coreInterventionFidelity.dyadicRelational.capacity.bridgeTranslate"
            options={capacityOptions}
          />
          <DualRatingField
            label="Intervene in ways that strengthen the caregiver-child relationship"
            fieldPath="coreInterventionFidelity.dyadicRelational.capacity.strengthenRelationship"
            options={capacityOptions}
          />
          <DualRatingField
            label="Think about and support child's relationship with other important caregivers (e.g., father)"
            fieldPath="coreInterventionFidelity.dyadicRelational.capacity.supportOtherCaregivers"
            options={capacityOptions}
          />
        </div>
      </FidelitySection>

      {/* TRAUMA FRAMEWORK FIDELITY */}
      <FidelitySection title="Trauma Framework Fidelity">
        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Potential Sources of Challenge
          </h5>
          <div className="text-sm text-gray-600 mb-3">Challenges related to...</div>

          <DualRatingField
            label="Child's history being unknown"
            fieldPath="coreInterventionFidelity.traumaFramework.challenges.childHistoryUnknown"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver's history being unknown"
            fieldPath="coreInterventionFidelity.traumaFramework.challenges.caregiverHistoryUnknown"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver not fully acknowledging child's history or not agreeing to talk about it"
            fieldPath="coreInterventionFidelity.traumaFramework.challenges.caregiverNotAcknowledging"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver not having a trauma framework (does not view child behavior in light of history)"
            fieldPath="coreInterventionFidelity.traumaFramework.challenges.noTraumaFramework"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Caregiver being triggered and having difficulty thinking about child's past experience"
            fieldPath="coreInterventionFidelity.traumaFramework.challenges.caregiverTriggered"
            options={challengeLevelOptions}
          />
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Capacity to Intervene Within a Trauma Framework
          </h5>
          <div className="text-sm text-gray-600 mb-3">Clinician/Care Coordinator is able to...</div>

          <DualRatingField
            label="Keep child's and caregiver's trauma history in mind"
            fieldPath="coreInterventionFidelity.traumaFramework.capacity.keepHistoryInMind"
            options={capacityOptions}
          />
          <DualRatingField
            label="Think about how the child's and caregiver's history may be affecting interactions with each other and with the Clinician/Care Coordinator"
            fieldPath="coreInterventionFidelity.traumaFramework.capacity.thinkAboutHistoryImpact"
            options={capacityOptions}
          />
          <DualRatingField
            label="Frame interventions (e.g., affect regulation, improving relationships) within the broader context of the family's traumatic experiences"
            fieldPath="coreInterventionFidelity.traumaFramework.capacity.frameInterventions"
            options={capacityOptions}
          />
          <DualRatingField
            label="Clinicians only: Directly talk about and bring up the family's trauma history when relevant"
            fieldPath="coreInterventionFidelity.traumaFramework.capacity.directlyTalkTrauma"
            options={capacityOptions}
          />
        </div>
      </FidelitySection>

      {/* PROCEDURAL FIDELITY */}
      <FidelitySection title="Procedural Fidelity">
        <div className="mb-6">
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Potential Sources of Challenge
          </h5>

          <DualRatingField
            label="Scheduling challenges due to family illness, work, competing needs, or irregular visitation schedule make it difficult for family to attend weekly sessions"
            fieldPath="coreInterventionFidelity.proceduralFidelity.challenges.familyScheduling"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Scheduling challenges due to Clinician/Care Coordinator illness, work schedule or competing needs make it difficult to hold weekly sessions"
            fieldPath="coreInterventionFidelity.proceduralFidelity.challenges.clinicianScheduling"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Family structure (e.g., multiple children) makes it difficult to hold sessions focusing on the needs of individual children when clinically indicated"
            fieldPath="coreInterventionFidelity.proceduralFidelity.challenges.familyStructure"
            options={challengeLevelOptions}
          />
          <DualRatingField
            label="Home visiting environment often chaotic"
            fieldPath="coreInterventionFidelity.proceduralFidelity.challenges.chaoticEnvironment"
            options={challengeLevelOptions}
          />
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
            Capacity to Carry Out Procedures
          </h5>
          <div className="text-sm text-gray-600 mb-3">Clinician/Care Coordinator is able to...</div>

          <DualRatingField
            label="Schedule sessions on a regular basis (generally 1x per week)"
            fieldPath="coreInterventionFidelity.proceduralFidelity.capacity.scheduleRegularly"
            options={proceduralResponseOptions}
          />
          <DualRatingField
            label="Give appropriate notice for vacation"
            fieldPath="coreInterventionFidelity.proceduralFidelity.capacity.vacationNotice"
            options={proceduralResponseOptions}
          />
          <DualRatingField
            label="Propose caregiver collateral sessions when needed (caregiver is triggered, doesn't understand trauma, needs to share information)"
            fieldPath="coreInterventionFidelity.proceduralFidelity.capacity.collateralSessions"
            options={proceduralResponseOptions}
            showNotNeeded={true}
          />
        </div>
      </FidelitySection>
    </div>
  );
};

export default CoreInterventionFidelitySection;
