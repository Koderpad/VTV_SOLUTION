export interface NotificationDTO {
    notificationId: string; // UUID
    title: string;
    body: string;
    recipient: string;
    sender: string;
    type: string;
    seen: boolean;
    createAt: string; // date-time
}

export interface NotificationResponse {
    status: string;
    message: string;
    code: number; // int32
    count: number; // int32
    page: number; // int32
    size: number; // int32
    totalPage: number; // int32
    notificationDTOs: NotificationDTO[];
}

