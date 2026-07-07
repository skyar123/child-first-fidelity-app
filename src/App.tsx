import { useState } from 'react'
import { AppShell } from '@/components/layout'
import { FormTypeSelector } from '@/components/layout/FormTypeSelector'
import { SupervisionAppShell } from '@/components/supervision/SupervisionAppShell'
import { TerminationAppShell } from '@/components/termination/TerminationAppShell'
import { CoreInterventionAppShell } from '@/components/coreintervention/CoreInterventionAppShell'
import { TemplateFormShell } from '@/components/templateform/TemplateFormShell'
import { ClientsHome } from '@/components/clients/ClientsHome'
import { ClientDetail } from '@/components/clients/ClientDetail'
import { AssistantChat } from '@/components/ai/AssistantChat'
import { getFormTypeInfo, type FormType } from '@/types/app.types'

type View =
  | { name: 'clients' }
  | { name: 'client'; clientId: string }
  | { name: 'library' }
  | { name: 'form'; formType: FormType; clientInitials?: string; fromClientId?: string }

function App() {
  const [view, setView] = useState<View>({ name: 'clients' })

  const openForm = (formType: FormType, clientInitials?: string, fromClientId?: string) =>
    setView({ name: 'form', formType, clientInitials, fromClientId })

  const renderView = () => {
    switch (view.name) {
    case 'clients':
      return (
        <ClientsHome
          onOpenClient={clientId => setView({ name: 'client', clientId })}
          onOpenFormsLibrary={() => setView({ name: 'library' })}
        />
      )

    case 'client':
      return (
        <ClientDetail
          clientId={view.clientId}
          onBack={() => setView({ name: 'clients' })}
          onOpenForm={(formType, clientInitials) =>
            openForm(formType, clientInitials, view.clientId)
          }
        />
      )

    case 'library':
      return (
        <FormTypeSelector
          onSelectFormType={formType => openForm(formType)}
          onBack={() => setView({ name: 'clients' })}
        />
      )

    case 'form': {
      const back = () =>
        view.fromClientId
          ? setView({ name: 'client', clientId: view.fromClientId })
          : setView({ name: 'library' })

      const info = getFormTypeInfo(view.formType)
      if (info?.templateId) {
        return (
          <TemplateFormShell
            templateId={info.templateId}
            onBack={back}
            defaultInitials={view.clientInitials}
          />
        )
      }

      switch (view.formType) {
        case 'foundational':
          return <AppShell onBack={back} />
        case 'supervision':
          return <SupervisionAppShell onBack={back} clientInitials={view.clientInitials} />
        case 'termination':
          return <TerminationAppShell onBack={back} clientInitials={view.clientInitials} />
        case 'core_intervention':
          return <CoreInterventionAppShell onBack={back} clientInitials={view.clientInitials} />
        default:
          setView({ name: 'clients' })
          return null
      }
    }
    }
  }

  return (
    <>
      {renderView()}
      <AssistantChat />
    </>
  )
}

export default App
