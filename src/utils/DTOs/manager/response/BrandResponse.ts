import {BrandDTO} from "@/utils/DTOs/manager/dto/BrandDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";

export interface BrandResponse extends ResponseAbstract {
    brandDTO: BrandDTO;
}