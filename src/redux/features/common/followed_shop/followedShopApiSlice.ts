import { apiSlice } from "@/redux/api";
import { FollowedShopResponse } from "@/utils/DTOs/common/FollowedShop/Response/FollowedShopResponse";
import { ListFollowedShopResponse } from "@/utils/DTOs/common/FollowedShop/Response/ListFollowedShopResponse";

export const followedShopApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListFollowedShop: builder.query<ListFollowedShopResponse, void>({
      query: () => ({
        url: "/customer/followed-shop/list",
        method: "GET",
      }),
    }),
    addNewFollowedShop: builder.mutation<FollowedShopResponse, number>({
      query: (shopId) => ({
        url: `/customer/followed-shop/add`,
        method: "POST",
        params: {
          shopId,
        },
      }),
    }),
    deleteFollowedShopById: builder.mutation<FollowedShopResponse, number>({
      query: (followedShopId) => ({
        url: `/customer/followed-shop/delete/${followedShopId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddNewFollowedShopMutation,
  useDeleteFollowedShopByIdMutation,
  useGetListFollowedShopQuery,
} = followedShopApiSlice;
