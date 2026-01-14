export interface AdminLog {
    id?: string
    timestamp: Date
    adminEmail: string
    action: string
    details?: string
    targetId?: string
}
