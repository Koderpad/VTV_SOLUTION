import {OrderStatus} from "@/utils/DTOs/extra/OrderStatus.ts";
import {AddressDTO} from "@/utils/DTOs/customer/dto/AddressDTO.ts";
import {ShopDTO} from "@/utils/DTOs/shop/dto/ShopDTO.ts";
import { LoyaltyPointHistoryDTO } from "./LoyaltyPointHistoryDTO";
import {VoucherOrderDTO} from "@/utils/DTOs/customer/dto/VoucherOrderDTO.ts";
import {OrderItemDTO} from "@/utils/DTOs/customer/dto/OrderItemDTO.ts";

export interface OrderDTO {
    orderId: string; // UUID represented as string
    note: string;
    paymentMethod: string;
    shippingMethod: string;
    count: number;
    totalPrice: number;
    discountShop: number;
    discountSystem: number;
    shippingFee: number;
    paymentTotal: number;
    status: OrderStatus; // Assuming OrderStatus is an existing enum/type
    orderDate: Date;
    addressDTO: AddressDTO;
    shopDTO: ShopDTO;
    loyaltyPointHistoryDTO?: LoyaltyPointHistoryDTO; // Optional property
    voucherOrderDTOs: VoucherOrderDTO[];
    orderItemDTOs: OrderItemDTO[];
}