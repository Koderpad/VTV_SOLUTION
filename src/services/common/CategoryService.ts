import { BASE_URL_VTC } from "@/constants/urls";
import { CategoriesResponse } from "@/utils/DTOs/common/Category/Response/CategoriesResponse";
import axios from "axios";

const API_BASE_URL = `${BASE_URL_VTC}/category`;

export const getAllParentCategory = async (): Promise<CategoriesResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all-parent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {} as CategoriesResponse;
  }
};
