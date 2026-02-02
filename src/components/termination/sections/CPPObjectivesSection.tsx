import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { TerminationFormData } from '../../../types/termination.types';

// Clinical Focus options (0-3)
const clinicalFocusOptions = [
  { value: '', label: 'Select (0-3)' },
  { value: '0', label: '0 - Not at all a focus' },
  { value: '1', label: '1 - Minor' },
  { value: '2', label: '2 - Moderate' },
  { value: '3', label: '3 - Significant' },
];

// Appropriateness options
const appropriatenessOptions = [
  { value: '', label: 'Select...' },
  { value: 'under', label: 'Under' },
  { value: 'appropriate', label: 'Appropriate' },
  { value: 'over', label: 'Over' },
];

// Progress options (0-3)
const progressOptions = [
  { value: '', label: 'Select (0-3)' },
  { value: '0', label: '0 - Primary Target/Urgent Concern' },
  { value: '1', label: '1 - Emerging' },
  { value: '2', label: '2 - Present but Unstable' },
  { value: '3', label: '3 - Established' },
];

interface ObjectiveFieldProps {
  title: string;
  description: string[];
  fieldPath: string;
}

const ObjectiveField: React.FC<ObjectiveFieldProps> = ({
  title,
  description,
  fieldPath
}) => {
  const { control } = useFormContext<TerminationFormData>();

  return (
    <div className="border border-yellow-200 rounded-lg mb-4 overflow-hidden">
      <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-200">
        <h5 className="font-semibold text-yellow-900">{title}</h5>
      </div>
      <div className="p-4">
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
          {description.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical Focus (0-3)
            </label>
            <Controller
              name={`${fieldPath}.clinicalFocus` as any}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {clinicalFocusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appropriateness
            </label>
            <Controller
              name={`${fieldPath}.appropriateness` as any}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {appropriatenessOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress Current (0-3)
            </label>
            <Controller
              name={`${fieldPath}.progressCurrent` as any}
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {progressOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CPPObjectivesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-xl font-bold text-yellow-900 mb-2">
          CPP Case Conceptualization and Content Fidelity
        </h3>
        <div className="text-sm text-yellow-700 space-y-2">
          <p><strong>Clinical Focus:</strong> Throughout the phase, degree to which the Clinician/Care Coordinator's interventions addressed the objective:</p>
          <p className="ml-4">0=not at all a focus; 1=minor; 2=moderate; 3=significant</p>

          <p><strong>Appropriateness:</strong></p>
          <p className="ml-4">Under = Clinician/Care Coordinator should have focused more on this objective</p>
          <p className="ml-4">Appropriate = Amount of therapeutic focus seems appropriate</p>
          <p className="ml-4">Over = Clinician/Care Coordinator may have overly focused on this objective</p>

          <p><strong>Progress Towards Objective:</strong></p>
          <p className="ml-4">3 = Established: Good enough to support development</p>
          <p className="ml-4">2 = Present but Unstable: Good under some conditions. Not fully consolidated.</p>
          <p className="ml-4">1 = Emerging: Early manifestations</p>
          <p className="ml-4">0 = Primary Target/Urgent Concern: Immediate risk to development, relationship and/or therapeutic alliance</p>
        </div>
      </div>

      <ObjectiveField
        title="CONVEY HOPE"
        description={[
          "Highlighted that change and growth are possible given positive steps the family has made",
          "Provided realistic examples of potential pathways for healing",
          "Helped caregiver identify \"angels in the nursery\" and reflect on times when he/she felt safe and loved",
          "Helped the family connect to spiritual resources consistent with family traditions"
        ]}
        fieldPath="cppObjectives.conveyHope"
      />

      <ObjectiveField
        title="DEVELOP EMPATHIC RELATIONSHIP WITH FAMILY MEMBERS"
        description={[
          "Empathically listened to concerns: caregiver and/or child's",
          "Understood difficult behavior given past history & current context",
          "Made warm supportive comments or recognized accomplishments",
          "Understood caregivers' mistrust of providers and reluctance to engage in treatment"
        ]}
        fieldPath="cppObjectives.developEmpathicRelationship"
      />

      <ObjectiveField
        title="ENHANCE SAFETY - Physical Safety"
        description={[
          "Helped caregiver reflect on his/her history of physical endangerment",
          "In a supportive, non-confrontational manner, directly addressed safety issues",
          "Balanced respect for the caregiver's psychological vulnerabilities with the need to address lapses in safety",
          "Encouraged the caregiver to develop an attitude that prioritizes safety as a core value",
          "Supported caregiver in engaging other family members in addressing risks to safety",
          "Focused on and addressed serious risks to physical safety",
          "Engaged in safety planning",
          "Assessed for and filed appropriate DCF reports for suspected abuse"
        ]}
        fieldPath="cppObjectives.enhanceSafetyPhysical"
      />

      <ObjectiveField
        title="ENHANCE SAFETY - Environmental Context"
        description={[
          "Discussed ways that contextual risks (e.g., poverty, community violence, immigration, housing) affect child and family functioning",
          "Considered the impact of racism and historical trauma on child and family functioning"
        ]}
        fieldPath="cppObjectives.enhanceSafetyEnvironmental"
      />

      <ObjectiveField
        title="ENHANCE SAFETY - Stabilization"
        description={[
          "Discussed provision/maintenance of basic needs",
          "Provided care coordination to help family obtain basic needs",
          "Helped caregiver develop the capacities to obtain services and needs independently",
          "Helped caregiver identify and address root causes of recurrent crisis and ongoing instability"
        ]}
        fieldPath="cppObjectives.enhanceSafetyStabilization"
      />

      <ObjectiveField
        title="SAFETY & CONSISTENCY IN THERAPY"
        description={[
          "Acknowledged safety risks to participating in therapy: mandated reporting, etc.",
          "Encouraged consistent, on-time participation in therapy",
          "Created a consistent environment for treatment"
        ]}
        fieldPath="cppObjectives.safetyConsistencyTherapy"
      />

      <ObjectiveField
        title="PERCEIVED SAFETY"
        description={[
          "Identify misperceptions of danger or safety: caregiver and/or child",
          "Foster accurate perceptions of danger and safety"
        ]}
        fieldPath="cppObjectives.perceivedSafety"
      />

      <ObjectiveField
        title="SAFETY WITHIN CAREGIVER-CHILD RELATIONSHIPS"
        description={[
          "Acknowledged past history of risks to safety: caregiver and/or child",
          "Highlighted the need for safe behavior while legitimizing feelings",
          "Fostered caregiver's ability to socialize child in ways consistent with cultural values and context",
          "Identified factors that may interfere with caregiver's capacity to socialize child",
          "Support caregiver's development of routines to enhance safety",
          "Helped establish caregiver as a protective, benevolent, legitimate authority figure"
        ]}
        fieldPath="cppObjectives.safetyWithinRelationships"
      />

      <ObjectiveField
        title="STRENGTHEN FAMILY RELATIONSHIPS: PROMOTE EMOTIONAL RECIPROCITY"
        description={[
          "Helped caregiver reflect on how current expectations about relationships are shaped by past experience",
          "Helped caregiver identify and explore origins of negative views/representations of the child",
          "Helped caregiver think about how perceptions may affect behavior or interactions with child",
          "Helped caregiver and child notice and respond supportively to each other's relational bids",
          "Helped caregiver reflect and respond benevolently to the child's challenging behavior",
          "Helped identify negative perceptions child may have about caregiver",
          "Helped child understand and appreciate caregiver's efforts on the child and family's behalf",
          "Helped caregiver and child learn ways to repair and connect after conflict",
          "Helped caregiver and child consciously explore new ways of relating that promote trust"
        ]}
        fieldPath="cppObjectives.strengthenFamilyRelationships"
      />

      <ObjectiveField
        title="ADDITIONAL CHILD FIRST TREATMENT OBJECTIVES - Family Relationships"
        description={[
          "Helped caregiver follow child's lead; noticed and supported caregiver in accomplishment",
          "Fostered caregiver's understanding of the importance of engagement and mutual enjoyment",
          "Helped caregiver reflect on spontaneous moments of engagement and enjoyment in session",
          "Facilitated dyadic play, reciprocal interactions and normative developmental activities"
        ]}
        fieldPath="cppObjectives.additionalChildFirstRelationships"
      />

      <ObjectiveField
        title="COORDINATE CARE/ADDRESS FAMILY SERVICE NEEDS"
        description={[
          "Engaged in systematic efforts to obtain all relevant information about child history",
          "Helped family members obtain needed referrals to other services",
          "Communicated and coordinated care as needed with other service providers",
          "Reflected on the needs of the entire family and prioritized services",
          "Took steps to ensure that risks to the child's safety were known and addressed effectively",
          "Fostered a climate of transparency in communicating with caregiver"
        ]}
        fieldPath="cppObjectives.coordinateCare"
      />

      <ObjectiveField
        title="ADDITIONAL CHILD FIRST TREATMENT OBJECTIVES - Care Coordination"
        description={[
          "Responded promptly and thoughtfully to concrete family needs",
          "Helped caregiver develop effective and realistic problem-solving strategies",
          "Provided hands-on assistance to connect children and caregivers with needed services",
          "Supported self-reflection in the caregiver to avoid repetition of interpersonal problems",
          "Supported caregiver in identifying potential obstacles when communicating with agencies",
          "Reflected on possible psychological barriers which interfered with accessing services"
        ]}
        fieldPath="cppObjectives.additionalChildFirstCareCoordination"
      />

      <ObjectiveField
        title="STRENGTHEN DYADIC AFFECT REGULATION CAPACITIES"
        description={[
          "Fostered caregiver's ability to respond in soothing ways when child is upset",
          "Fostered child's ability to use caregiver as a secure base",
          "Provided developmental guidance around typical early childhood fears/anxieties",
          "Acknowledged and helped find words for emotional experiences: caregiver and/or child",
          "Provided developmental guidance around emotional reactions",
          "Taught, developed, or fostered strategies for regulating affect",
          "Explored with caregiver links between emotional responses to past experiences and current responses"
        ]}
        fieldPath="cppObjectives.strengthenAffectRegulation"
      />

      <ObjectiveField
        title="STRENGTHEN DYADIC BODY-BASED REGULATION"
        description={[
          "Fostered body-based awareness, including awareness of physiological responses to stress",
          "Fostered understanding and identification of body-based trauma reminders",
          "Helped caregiver learn/engage in body-based regulation techniques to regulate affect",
          "Helped caregiver & child learn or use body-based regulation techniques to soothe child",
          "Helped caregiver and child exchange physical expressions of care",
          "Enhanced understanding of safe body-based boundaries"
        ]}
        fieldPath="cppObjectives.strengthenBodyBasedRegulation"
      />

      <ObjectiveField
        title="SUPPORT CHILD'S RELATIONSHIP WITH OTHER IMPORTANT CAREGIVERS"
        description={[
          "Helped caregivers understand the child's perspective and need for positive representations of alternative caregivers",
          "Helped caregiver support the child in integrating the positive and negative aspects of other caregivers",
          "Shared the concept of angel moments and the importance of helping the child hold on to positive memories",
          "Supported child in developing an age-appropriate understanding of the family history",
          "Supported the child in understanding that different family members have different points of view"
        ]}
        fieldPath="cppObjectives.supportChildRelationshipOthers"
      />

      <ObjectiveField
        title="ENHANCE UNDERSTANDING OF THE MEANING OF BEHAVIOR"
        description={[
          "Helped caregiver notice behavior (child's, caregiver's, or another caregiver's)",
          "Provided developmental guidance regarding age appropriate behavior and developmental meaning",
          "Provided developmental guidance around how children learn and develop",
          "Helped caregiver consider (reflect on) the meaning of child and/or caregiver behavior",
          "Helped enhance reflective functioning in caregivers and child"
        ]}
        fieldPath="cppObjectives.enhanceUnderstandingBehavior"
      />

      <ObjectiveField
        title="ADDITIONAL CHILD FIRST TREATMENT OBJECTIVES - Understanding Behavior"
        description={[
          "Helped caregiver notice antecedents to child's behavior, responses of others to those behaviors",
          "Provided information to help caregiver understand their importance in child's healthy development",
          "Provided information about unique sensori-motor or neurologically-based processing needs",
          "Introduced frequently used language and concepts to build a common vocabulary"
        ]}
        fieldPath="cppObjectives.additionalChildFirstBehavior"
      />

      <ObjectiveField
        title="ATTACHMENT-EXPLORATION BALANCE AND HEALING RELATIONSHIP DISRUPTIONS"
        description={[
          "Noted and reflected on caregiver's prompt, appropriate response to child's attachment cues",
          "Provided guidance regarding need of child for proximity to caregiver and for independent exploration",
          "Provided guidance regarding the importance of being \"bigger, stronger, wiser, and kind\"",
          "Provided guidance regarding need for caregiving during disruptions and major separations",
          "Reflected with caregiver on past caregiver-child experiences that may have led to \"miscuing\"",
          "Reflected with caregiver on her emotional responses to child's attachment/exploration cues"
        ]}
        fieldPath="cppObjectives.attachmentExplorationBalance"
      />

      <ObjectiveField
        title="SUPPORT CHILD IN RETURNING TO A NORMAL DEVELOPMENTAL TRAJECTORY"
        description={[
          "Supported adaptive behavior and normative developmental activities",
          "Supported healthy non-trauma play",
          "Supported positive identity development",
          "Fostered caregiver's efforts to engage in age appropriate activities",
          "Provided care coordination to help engage child in age appropriate activities"
        ]}
        fieldPath="cppObjectives.supportNormalDevelopment"
      />

      <ObjectiveField
        title="NORMALIZE THE TRAUMATIC RESPONSE"
        description={[
          "Acknowledged effects of child's and caregivers' experience of trauma and historical trauma",
          "Provided psychoeducation: Impact of trauma, including common symptoms & PTSD, trauma reminders",
          "Helped caregiver anticipate developmental changes in child's processing of the trauma"
        ]}
        fieldPath="cppObjectives.normalizeTraumaticResponse"
      />

      <ObjectiveField
        title="SUPPORT DYAD IN ACKNOWLEDGING THE IMPACT OF TRAUMA"
        description={[
          "Promoted a deep emotional acknowledgement of the impact of trauma",
          "Helped caregiver acknowledge what child has witnessed & remembers",
          "Helped caregiver and child understand each other's reality (with regards to the trauma)",
          "Helped caregiver & child identify and cope with trauma reminders",
          "Helped caregiver think about his/her own trauma history (ghosts in the nursery)"
        ]}
        fieldPath="cppObjectives.supportAcknowledgingTrauma"
      />

      <ObjectiveField
        title="HELP DYAD DIFFERENTIATE BETWEEN THEN AND NOW"
        description={[
          "Highlighted difference between past and present circumstances",
          "Helped dyad understand that they can make new choices",
          "Helped child and caregiver become aware of the difference between reliving and remembering"
        ]}
        fieldPath="cppObjectives.differentiateThenNow"
      />

      <ObjectiveField
        title="HELP DYAD PUT THE TRAUMATIC EXPERIENCE IN PERSPECTIVE"
        description={[
          "Supported caregiver and child in making meaning (e.g., creating a story, using ritual, connecting with spiritual beliefs)",
          "Integrate historical trauma as part of the family and personal narrative",
          "Worked with beliefs (existential challenges) around why the traumatic events happened",
          "Helped caregiver and child see trauma as something that happened to them but that does not define them",
          "Supported family's advocacy work or work to help others",
          "Fostered acceptance around how these experiences have shaped the caregiver and child's sense of self",
          "Helped the family find pathways to post trauma growth and joy",
          "Encouraged appreciation of goodness, beauty, and hope"
        ]}
        fieldPath="cppObjectives.traumaInPerspective"
      />
    </div>
  );
};

export default CPPObjectivesSection;
