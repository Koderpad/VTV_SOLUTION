import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";


export interface CategoryResponse {
  status: string;
  message: string;
  code: number;
  categoryDTO: CategoryDTO;
}



