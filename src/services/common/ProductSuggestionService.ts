import axios from "axios";
import { BASE_URL_VTC } from "@/constants/urls";
import { ProductPageResponse } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";

export const getRandomProductPage = async (
  page: number,
  size: number,
): Promise<ProductPageResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/product-suggestion/get-page/randomly`,
      {
        params: { page, size },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching random product page:", error);
    throw error;
  }
};

export const getRandomProductPageInShop = async (
  productId: number,
  page: number,
  size: number,
  inShop: boolean = true,
): Promise<ProductPageResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/product-suggestion/get-page/randomly/product/${productId}`,
      {
        params: { page, size, inShop },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching random product page in shop:", error);
    throw error;
  }
};

export const getRandomProductPageByCategory = async (
  categoryId: number,
  page: number,
  size: number,
): Promise<ProductPageResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/product-suggestion/get-page/randomly/category/${categoryId}`,
      {
        params: { page, size },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching random product page by category:", error);
    throw error;
  }
};
