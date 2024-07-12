// ProductService.ts
import axios from "axios";
import { ProductResponse } from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { BASE_URL_VTC } from "@/constants/urls";
import { ProductPageResponse } from "@/utils/DTOs/manager/response/ProductPageResponse.ts";

// const API_URL = "http://localhost:8585/api";

export const getProductDetail = async (
  productId: number
): Promise<ProductResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/product/detail/${productId}`
  );
  return response.data;
};

export const fetchProductDetail = async (productId: number) => {
  try {
    const response = await getProductDetail(productId);
    return response;
  } catch (e) {
    // @ts-ignore
    throw e.response.data;
  }
};

export const getFilterProductPage = async (
  page: number,
  size: number,
  filter: string
): Promise<ProductPageResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/product-filter/${filter}?page=${page}&size=${size}`
  );
  return response.data;
};

export const getProductPageBySearchAndSort = async (
  page: number,
  size: number,
  search: string,
  sort: string
): Promise<ProductPageResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/search/product/sort?page=${page}&size=${size}&search=${search}&sort=${sort}`
  );
  return response.data;
};
