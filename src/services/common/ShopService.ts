import axios from "axios";
import { ShopDetailResponse } from "@/utils/DTOs/common/ShopDetail/Response/ShopDetailResponse";
import { ListCategoryShopResponse } from "@/utils/DTOs/common/ShopDetail/Response/ListCategoryShopResponse";
import { CategoryShopResponse } from "@/utils/DTOs/common/ShopDetail/Response/CategoryShopResponse";
import { BASE_URL_VTC } from "@/constants/urls";

export const getShopById = async (
  shopId: number,
): Promise<ShopDetailResponse> => {
  try {
    const response = await axios.get(`${BASE_URL_VTC}/shop/${shopId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shop by ID:", error);
    throw error;
  }
};

export const getShopByUsername = async (
  username: string,
): Promise<ShopDetailResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/shop/username/${username}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shop by username:", error);
    throw error;
  }
};

export const getCategoryListByShopId = async (
  shopId: number,
): Promise<ListCategoryShopResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/category-shop/get-list/shop-id/${shopId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category list by shop ID:", error);
    throw error;
  }
};

export const getListProductByCategoryShopId = async (
  shopId: number,
): Promise<CategoryShopResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_VTC}/category-shop/category-shop-id/${shopId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product list by category shop ID:", error);
    throw error;
  }
};
