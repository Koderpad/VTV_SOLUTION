import { apiSlice } from "@/redux/api";

export interface VNPayResponse {
  status: string;
  message: string;
  code: number;
  url: string;
  timeCreated: string;
  timeExpired: string;
}

export interface VNPayDTO {
  vnp_ResponseId: string;
  vnp_Command: string;
  vnp_ResponseCode: string;
  vnp_Message: string;
  vnp_TmnCode: string;
  vnp_TxnRef: string;
  vnp_Amount: string;
  vnp_OrderInfo: string;
  vnp_BankCode: string;
  vnp_PayDate: string;
  vnp_TransactionNo: string;
  vnp_TransactionType: string;
  vnp_TransactionStatus: string;
  vnp_SecureHash: string;
}

export const vnPayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createVNPayPayment: builder.mutation<VNPayResponse, string[]>({
      query: (body) => ({
        url: `/vnpay/create-payment-web/multiple-order`,
        method: "POST",
        body,
      }),
    }),
   getVNPayReturn: builder.query<VNPayDTO, { vnp_ResponseCode: string; vnp_TxnRef: string }>({
      query: ({ vnp_ResponseCode, vnp_TxnRef }) => ({
        url: `/vnpay/return`,
        method: "GET",
        params: { vnp_ResponseCode, vnp_TxnRef },
      }),
    }),
  }),
});

export const { useCreateVNPayPaymentMutation, useGetVNPayReturnQuery } = vnPayApiSlice;
