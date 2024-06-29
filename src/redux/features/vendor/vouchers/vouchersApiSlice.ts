import { apiSlice } from "@/redux/api";
import { VoucherShopRequest } from "@/utils/DTOs/vendor/vouchers/Request/VoucherShopRequest";
import { ListVoucherShopResponse } from "@/utils/DTOs/vendor/vouchers/Response/ListVoucherShopResponse";
import { VoucherShopResponse } from "@/utils/DTOs/vendor/vouchers/Response/VoucherShopResponse";

export const vouchersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addVoucher: builder.mutation<VoucherShopResponse, VoucherShopRequest>({
      query: (data) => ({
        url: "/vendor/shop/voucher/add",
        method: "POST",
        body: data,
      }),
    }),
    updateVoucher: builder.mutation<
      VoucherShopResponse,
      { voucherId: number; data: VoucherShopRequest }
    >({
      query: ({ voucherId, data }) => ({
        url: `/vendor/shop/voucher/update/${voucherId}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateVoucherStatus: builder.mutation<
      VoucherShopResponse,
      { voucherId: number; status: string }
    >({
      query: ({ voucherId, status }) => ({
        url: `/vendor/shop/voucher/update-status/${voucherId}`,
        method: "PATCH",
        params: { status },
      }),
    }),
    getAllShopVouchers: builder.query<ListVoucherShopResponse, void>({
      query: () => ({
        url: "/vendor/shop/voucher/get-all-shop",
        method: "GET",
      }),
    }),
    getVoucherDetail: builder.query<VoucherShopResponse, number>({
      query: (voucherId) => ({
        url: `/vendor/shop/voucher/detail/${voucherId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAddVoucherMutation,
  useUpdateVoucherMutation,
  useUpdateVoucherStatusMutation,
  useGetAllShopVouchersQuery,
  useGetVoucherDetailQuery,
} = vouchersApiSlice;
