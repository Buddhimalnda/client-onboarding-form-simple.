export interface Notification{
    id: string
    title: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    timestamp: any 
    read: boolean
    action?: () => void
    category?: string
    icon?: string
    duration?: number // in milliseconds
}

export interface Message {
    id: string
    content: string
    sender: string
    timestamp: number
    read: boolean
    action?: () => void
    category?: string
    icon?: string
    unreadCount: number
}