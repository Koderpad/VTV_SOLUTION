// ProductService.ts
import axios from "axios";
import { ProductResponse } from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { BASE_URL_VTC } from "@/constants/urls";

// const API_URL = "http://localhost:8585/api";

export const getProductDetail = async (
  productId: number
): Promise<ProductResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/product/detail/${productId}`
  );
  return response.data;
};
