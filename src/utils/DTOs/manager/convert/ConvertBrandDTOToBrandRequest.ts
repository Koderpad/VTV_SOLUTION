import { BrandDTO } from "@/utils/DTOs/manager/dto/BrandDTO.ts";
import { BrandRequest } from "@/utils/DTOs/manager/request/BrandRequest.ts";

export const convertBrandDTOToBrandRequest = (brandDTO: BrandDTO): BrandRequest => {
    return {
        name: brandDTO.name,
        description: brandDTO.description,
        information: brandDTO.information,
        origin: brandDTO.origin,
        allCategories: brandDTO.allCategories,
        categoryIds: brandDTO.categoryIds,
        image: brandDTO.image,
        changeImage: false,
    };
}