import {CategoryRequest} from "@/utils/DTOs/manager/request/CategoryRequest.ts";

export const convertCategoryRequestToFormData = (categoryData: CategoryRequest): FormData => {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    formData.append('changeImage', String(categoryData.changeImage));
    if (categoryData.changeImage && categoryData.image instanceof File) {
        formData.append('image', categoryData.image);
    }
    formData.append('child', String(categoryData.child));
    formData.append('parentId', String(categoryData.parentId));
    return formData;
};