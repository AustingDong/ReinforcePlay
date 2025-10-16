import { useState, useCallback } from 'react'
import { ToastProps, ToastType } from '@/components/Toast'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((
    type: ToastType,
    message: string,
    description?: string,
    duration = 5000
  ) => {
    const id = `toast-${toastId++}`
    
    const newToast: ToastProps = {
      id,
      type,
      message,
      description,
      duration,
      onClose: (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }

    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string, description?: string) => {
    return addToast('success', message, description)
  }, [addToast])

  const error = useCallback((message: string, description?: string) => {
    return addToast('error', message, description, 7000) // Longer for errors
  }, [addToast])

  const info = useCallback((message: string, description?: string) => {
    return addToast('info', message, description)
  }, [addToast])

  const warning = useCallback((message: string, description?: string) => {
    return addToast('warning', message, description)
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}




