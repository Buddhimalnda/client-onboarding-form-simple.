// hooks/useAlert.ts (exactly the same as before)
import { useDispatch } from 'react-redux'
import { addNotification } from '@/store/slice/ui/uiSlice'

export function useAlert() {
  const dispatch = useDispatch()

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    duration?: number
  ) => {
    dispatch(addNotification({
      type,
      title,
      message,
      duration
    }))
  }

  return {
    success: (title: string, message: string, duration?: number) => 
      showAlert('success', title, message, duration),
    
    error: (title: string, message: string, duration?: number) => 
      showAlert('error', title, message, duration),
    
    warning: (title: string, message: string, duration?: number) => 
      showAlert('warning', title, message, duration),

    info: (title: string, message: string, duration?: number) => 
      showAlert('info', title, message, duration)
  }
}