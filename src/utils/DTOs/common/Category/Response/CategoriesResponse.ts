interface CategoryDTO {
  categoryId: number;
  name: string;
  image: string;
  description: string;
  child: boolean;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  parentId: number;
}

interface CategoriesResponse {
  status: string;
  message: string;
  code: number;
  categoryDTOs: CategoryDTO[];
}

export type { CategoryDTO, CategoriesResponse };
