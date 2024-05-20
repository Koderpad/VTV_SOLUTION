import { BrandRequest } from "@/utils/DTOs/manager/request/BrandRequest.ts"; // Import BrandRequest

export const convertBrandRequestToFormData = (brandData: BrandRequest): FormData => {
    const formData = new FormData();
    formData.append('name', brandData.name);
    formData.append('description', brandData.description);
    formData.append('information', brandData.information);
    formData.append('origin', brandData.origin);
    formData.append('allCategories', String(brandData.allCategories));
    if (brandData.categoryIds) {
        brandData.categoryIds.forEach((categoryId: number) => { // Provide a type for categoryId
            formData.append('categoryIds', String(categoryId));
        });
    }
    formData.append('changeImage', String(brandData.changeImage));
    if (brandData.changeImage && brandData.image instanceof File) {
        formData.append('image', brandData.image);
    }
    return formData;
};