export enum Status {
    Success,
    Error,
    Warning
}

export interface SiteMessage {
    message: string,
    status: Status
}