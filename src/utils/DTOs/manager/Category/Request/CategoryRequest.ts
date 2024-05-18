export interface CategoryRequest {
  name: string;
  description: string;
  image: string | File;
  changeImage: boolean;
  child: boolean;
  parentId: number;
}
