import {Status} from "@/utils/DTOs/extra/Status.ts";
import {AttributeDTO} from "@/utils/DTOs/manager/dto/AttributeDTO.ts";

export interface ProductVariantDTO {
    productVariantId: number;
    sku: string;
    image: string;
    originalPrice: number;
    price: number;
    quantity: number;
    status: Status;
    productId: number;
    productName: string;
    productImage: string;
    discountPercent: string;
    countAttribute: number;
    attributeDTOs: AttributeDTO[]; // Array of AttributeDTO interfaces
}
