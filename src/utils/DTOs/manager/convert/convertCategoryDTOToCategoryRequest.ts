import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import {CategoryRequest} from "@/utils/DTOs/manager/request/CategoryRequest.ts";

export const convertCategoryDTOToCategoryRequest = (categoryDTO: CategoryDTO): CategoryRequest => {
    return {
        name: categoryDTO.name,
        description: categoryDTO.description,
        image: categoryDTO.image,
        changeImage: false,
        child: categoryDTO.child,
        parentId: categoryDTO.parentId ? categoryDTO.parentId : 0,
    };
}