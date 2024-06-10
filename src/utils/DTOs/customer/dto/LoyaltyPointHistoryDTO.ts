import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface LoyaltyPointHistoryDTO {
    loyaltyPointHistoryId: number;
    point: number;
    type: string;
    status: Status; // Assuming Status is an existing enum/type
    loyaltyPointId: number;
    createAt: Date;
}