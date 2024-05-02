import { apiSlice } from "../../api";
import { ListCartResponse } from "@/utils/DTOs/common/Cart/Response/ListCartResponse";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListCartByUsername: builder.query<ListCartResponse, void>({
      query: () => `/customer/cart/get-list`,
    }),
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `/customer/cart/delete/${id}`,
        method: "DELETE",
      }),
    }),
    addNewCart: builder.mutation({
      query: (data) => ({
        url: `/customer/cart/add`,
        method: "POST",
        body: data,
      }),
    }),

    updateCart: builder.mutation({
      query: ({ cartId, quantity }) => ({
        url: `/api/customer/cart/update/${cartId}?quantity=${quantity}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetListCartByUsernameQuery,
  useDeleteCartMutation,
  useAddNewCartMutation,
  useUpdateCartMutation,
} = cartApiSlice;
