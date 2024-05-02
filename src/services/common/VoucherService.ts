// // ProductService.ts
// import axios from "axios";
// import { ProductResponse } from "@/utils/DTOs/common/Product/Response/ProductResponse";
// import { BASE_URL_VTC } from "@/constants/urls";

import { BASE_URL_VTC } from "@/constants/urls";
import { ListVoucherResponse } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";
import axios from "axios";

// // const API_URL = "http://localhost:8585/api";

// export const getProductDetail = async (
//   productId: number
// ): Promise<ProductResponse> => {
//   const response = await axios.get(
//     `${BASE_URL_VTC}/product/detail/${productId}`
//   );
//   return response.data;
// };

export const getSystemVoucher = async (): Promise<ListVoucherResponse> => {
  const response = await axios.get(`${BASE_URL_VTC}/voucher/list-on-system`);
  return response.data;
};
