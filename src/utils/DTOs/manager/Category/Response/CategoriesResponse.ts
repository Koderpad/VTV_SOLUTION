export interface CategoriesResponse {
  status: string;
  message: string;
  code: number;
  categoryDTOs: CategoryDTO[];
}

export interface CategoryDTO {
  categoryId: number;
  name: string;
  image: string;
  description: string;
  child: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'CANCEL' | 'LOCKED';
  parentId: number;
}

