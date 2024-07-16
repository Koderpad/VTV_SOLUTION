// // ProductService.ts
// import axios from "axios";
// import { ProductResponse } from "@/utils/DTOs/common/Product/Response/ProductResponse";
// import { BASE_URL_VTC } from "@/constants/urls";

import { BASE_URL_VTC } from "@/constants/urls";
import { ListVoucherResponse } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";
import { VoucherResponse } from "@/utils/DTOs/common/Voucher/Response/VoucherResponse";
import axios from "axios";

// // const API_URL = "http://192.168.196.39:8585/api";

export const getSystemVoucher = async (): Promise<ListVoucherResponse> => {
  const response = await axios.get(`${BASE_URL_VTC}/voucher/list-on-system`);
  return response.data;
};

export const getShopVoucher = async (
  id: number
): Promise<ListVoucherResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/voucher/list-on-shop/${id}`
  );
  return response.data;
};

export const getVoucherByVoucherId = async (
  voucherId: number
): Promise<VoucherResponse> => {
  const response = await axios.get(
    `${BASE_URL_VTC}/voucher/detail/${voucherId}`
  );
  return response.data;
};
