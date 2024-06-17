import axios from "axios";
import { ProductPageResponse } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";
import { BASE_URL_VTC } from "@/constants/urls";

export const searchProducts = async (
  page: number,
  size: number,
  search: string,
  sort: string,
): Promise<ProductPageResponse> => {
  try {
    const response = await axios.get(`${BASE_URL_VTC}/search/product/sort`, {
      params: { page, size, search, sort },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
