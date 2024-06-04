import {Status} from "@/utils/DTOs/extra/Status.ts";
import {ProductVariantDTO} from "@/utils/DTOs/manager/dto/ProductVariantDTO.ts";

export interface ProductDTO {
    productId: number,
    name: string,
    image: string,
    description: string,
    information: string,
    sold: number,
    status: Status,
    categoryId: number,
    shopId: number,
    brandId: number,
    maxPrice: number,
    minPrice: number,
    rating: string,
    countProductVariant: number,
    productVariantDTOs: ProductVariantDTO[],
    product?: boolean
}
