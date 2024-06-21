import {Status} from "@/utils/DTOs/extra/Status.ts";

export interface CashOrderDTO {
    cashOrderId: string;
    transportId: string;
    orderId: string;
    money: number;
    shipperUsername: string;
    shipperHold: boolean;
    waveHouseUsername: string;
    waveHouseHold: boolean;
    handlePayment: boolean;
    status: Status;
    createAt: string;
    updateAt: string;
}