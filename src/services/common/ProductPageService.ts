import axios from "axios";
import { BASE_URL_VTC } from "@/constants/urls";
import { ProductPageResponse } from "@/utils/DTOs/common/Product/Response/ProductPageResponse";

export const getProductPageShopByShopId = async (
  page: number,
  size: number,
  shopId: number,
): Promise<ProductPageResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/product/page/shop/${shopId}?page=${page}&size=${size}`,
  );
  return response.data;
};
