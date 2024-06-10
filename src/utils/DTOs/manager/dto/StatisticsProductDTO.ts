import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";

export interface StatisticsProductDTO {
    totalSold: number; // Assuming Long is treated as number in your usage
    totalMoney: number;
    productDTO: ProductDTO;
}
