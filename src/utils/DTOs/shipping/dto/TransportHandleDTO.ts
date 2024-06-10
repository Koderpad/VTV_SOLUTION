import {TransportStatus} from "@/utils/DTOs/extra/TransportStatus.ts";

export interface TransportHandleDTO {
    transportHandleId: string; // UUID represented as string
    username: string;
    wardCode: string;
    handled: boolean;
    messageStatus: string;
    transportStatus: TransportStatus; // Assuming TransportStatus is an existing enum/type
    createAt: Date;
    updateAt: Date;
}