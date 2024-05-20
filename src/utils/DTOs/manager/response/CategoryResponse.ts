import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import {ResponseAbstract} from "@/utils/DTOs/extra/ResponseAbstract.ts";


export interface CategoryResponse extends ResponseAbstract{

  categoryDTO: CategoryDTO;
}



