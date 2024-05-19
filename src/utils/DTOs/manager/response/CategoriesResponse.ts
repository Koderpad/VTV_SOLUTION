
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";

export interface CategoriesResponse {
  status: string;
  message: string;
  code: number;
  categoryDTOs: CategoryDTO[];
}



