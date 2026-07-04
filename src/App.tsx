import { useState } from 'react'
import { AppShell } from '@/components/layout'
import { FormTypeSelector } from '@/components/layout/FormTypeSelector'
import { SupervisionAppShell } from '@/components/supervision/SupervisionAppShell'
import { CareCoordinatorAppShell } from '@/components/carecoordinator/CareCoordinatorAppShell'
import { TerminationAppShell } from '@/components/termination/TerminationAppShell'
import { ProgramFidelityAppShell } from '@/components/programfidelity/ProgramFidelityAppShell'
import { CoreInterventionAppShell } from '@/components/coreintervention/CoreInterventionAppShell'
import { TemplateFormShell } from '@/components/templateform/TemplateFormShell'
import { getFormTypeInfo, type FormType } from '@/types/app.types'

function App() {
  const [selectedFormType, setSelectedFormType] = useState<FormType | null>(null)

  const handleSelectFormType = (formType: FormType) => {
    setSelectedFormType(formType)
  }

  const handleBack = () => {
    setSelectedFormType(null)
  }

  // Show form type selector if no form is selected
  if (!selectedFormType) {
    return <FormTypeSelector onSelectFormType={handleSelectFormType} />
  }

  // Template-driven instruments (POST ROSTERING set + Program 2025)
  const info = getFormTypeInfo(selectedFormType)
  if (info?.templateId) {
    return <TemplateFormShell templateId={info.templateId} onBack={handleBack} />
  }

  // Bespoke 2015-instrument modules
  switch (selectedFormType) {
    case 'foundational':
      return <AppShell onBack={handleBack} />
    case 'supervision':
      return <SupervisionAppShell onBack={handleBack} />
    case 'care_coordinator':
      return <CareCoordinatorAppShell onBack={handleBack} />
    case 'termination':
      return <TerminationAppShell onBack={handleBack} />
    case 'program_fidelity':
      return <ProgramFidelityAppShell onBack={handleBack} />
    case 'core_intervention':
      return <CoreInterventionAppShell onBack={handleBack} />
    default:
      // For forms not yet implemented, go back to selector
      setSelectedFormType(null)
      return null
  }
}

export default App
