import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";
import {BrandDTO} from "@/utils/DTOs/manager/dto/BrandDTO.ts";

export interface BrandsResponse extends ResponseAbstract {

    count: number;
    brandDTOs: BrandDTO[];
}