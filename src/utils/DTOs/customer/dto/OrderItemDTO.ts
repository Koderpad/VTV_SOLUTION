import {ProductVariantDTO} from "@/utils/DTOs/manager/dto/ProductVariantDTO.ts";

export interface OrderItemDTO {
    orderItemId: string; // UUID represented as string
    orderId: string; // UUID represented as string
    cartId: string; // UUID represented as string
    quantity: number;
    price: number;
    totalPrice: number;
    productVariantDTO: ProductVariantDTO; // Assuming productVariantDTO has its own interface definition
}