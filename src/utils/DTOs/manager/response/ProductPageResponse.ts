import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";

export interface ProductPageResponse extends ResponseAbstract {
    count: number;
    page: number;
    size: number;
    totalPage: number;
    totalProduct: number;
    productDTOs: ProductDTO[]; // Array of ProductDTO interfaces
}
