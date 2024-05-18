import { BASE_URL_VTC } from "@/constants/urls";
import { CategoriesResponse } from "@/utils/DTOs/manager/Category/Response/CategoriesResponse";
import axios from "axios";

export const getAllCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get(`${BASE_URL_VTC}/category/all`);
  return response.data;
} 
