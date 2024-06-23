import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {CashOrderDTO} from "@/utils/DTOs/shipping/dto/CashOrderDTO.ts";
import {OrderDTO} from "@/utils/DTOs/customer/dto/OrderDTO.ts";
import {TransportDTO} from "@/utils/DTOs/shipping/dto/TransportDTO.ts";

export interface CashOrderDetailResponse extends ResponseAbstract{
    cashOrderDTO: CashOrderDTO,
    orderDTO: OrderDTO,
    transportDTO: TransportDTO,
}