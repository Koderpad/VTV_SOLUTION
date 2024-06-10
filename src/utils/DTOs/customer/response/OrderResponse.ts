import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import { OrderDTO } from "../dto/OrderDTO";
import { TransportDTO } from "../../shipping/dto/TransportDTO";
import {ShippingDTO} from "@/utils/DTOs/shipping/dto/ShippingDTO.ts";

export interface OrderResponse extends ResponseAbstract {
    balance: number; // Assuming balance is a monetary value
    totalPoint: number;
    orderDTO: OrderDTO;
    transportDTO: TransportDTO;
    shippingDTO: ShippingDTO;
}