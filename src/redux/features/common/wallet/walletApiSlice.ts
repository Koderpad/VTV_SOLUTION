import { apiSlice } from "@/redux/api";
import { WalletResponse } from "@/utils/DTOs/common/Wallet/Response/WalletResponse";

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWalletByUsername: builder.query<WalletResponse, void>({
      query: () => ({
        url: `/customer/wallet/get`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetWalletByUsernameQuery } = walletApiSlice;
