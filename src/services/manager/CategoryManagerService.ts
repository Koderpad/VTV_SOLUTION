import { BASE_URL_VTC } from "@/constants/urls";
import { CategoriesResponse } from "@/utils/DTOs/manager/response/CategoriesResponse";
import axios from "axios";
import {CategoryResponse} from "@/utils/DTOs/manager/response/CategoryResponse.ts";

export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get(`${BASE_URL_VTC}/category/all`);
  return response.data;
}


export const getCategoryByCategoryId = async (categoryId: string | undefined): Promise<CategoryResponse> => {
    const response = await axios.get(`${BASE_URL_VTC}/category/${categoryId}`);
    return response.data;
}