import { useState } from 'react'
import { AppShell } from '@/components/layout'
import { FormTypeSelector } from '@/components/layout/FormTypeSelector'
import { SupervisionAppShell } from '@/components/supervision/SupervisionAppShell'
import { CareCoordinatorAppShell } from '@/components/carecoordinator/CareCoordinatorAppShell'
import { TerminationAppShell } from '@/components/termination/TerminationAppShell'
import { ProgramFidelityAppShell } from '@/components/programfidelity/ProgramFidelityAppShell'
import { CoreInterventionAppShell } from '@/components/coreintervention/CoreInterventionAppShell'
import type { FormType } from '@/types/app.types'

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

  // Route to the appropriate form
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
