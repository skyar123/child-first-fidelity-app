import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary, OfflineIndicator, KeyboardShortcutsHelp } from './components/ui'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <OfflineIndicator />
      <KeyboardShortcutsHelp />
    </ErrorBoundary>
  </StrictMode>,
)
