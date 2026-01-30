import { useState, useEffect } from 'react'
import { WifiOff, X } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [dismissed, setDismissed] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)

  // Track when we go offline
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setDismissed(false)
    }
  }, [isOnline])

  // Show reconnected message when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  // Show offline banner
  if (!isOnline && !dismissed) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-yellow-100 rounded-lg flex-shrink-0">
              <WifiOff className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-yellow-900 text-sm">
                You're offline
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                Changes are saved locally and will sync when you're back online.
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 hover:bg-yellow-100 rounded transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-yellow-600" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show reconnected toast
  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-green-900">
              Back online
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
