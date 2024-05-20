export interface BrandDTO {
    brandId: number;
    name: string;
    image: string;
    description: string;
    information: string;
    origin: string;
    allCategories: boolean;
    categoryIds: number[];
}