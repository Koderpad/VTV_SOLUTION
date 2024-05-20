export interface BrandRequest {
    name: string;
    image: string | File;
    changeImage: boolean;
    description: string;
    information: string;
    origin: string;
    allCategories: boolean;
    categoryIds: number[];
}