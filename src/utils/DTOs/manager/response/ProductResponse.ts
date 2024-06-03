import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";

export interface ProductResponse extends ResponseAbstract {
    categoryId: number;
    categoryName: string;
    categoryParentId: number;
    categoryParentName: string;
    shopId: number;
    shopName: string;
    shopAvatar: string;
    countOrder: number;
    productDTO: ProductDTO; // Reference to ProductDTO interface
}
