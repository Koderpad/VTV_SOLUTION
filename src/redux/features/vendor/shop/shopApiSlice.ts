import { apiSlice } from "@/redux/api";
import { ShopResponse } from "@/utils/DTOs/vendor/shop/Response/ShopResponse";

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerShop: builder.mutation<ShopResponse, FormData>({
      query: (data) => ({
        url: `/vendor/register`,
        method: "POST",
        body: data,
      }),
      extraOptions: {
        prepareHeaders: (headers: Headers) => {
          headers.set("Content-Type", "multipart/form-data");
          return headers;
        },
      },
    }),

    getProfileShop: builder.query<ShopResponse, void>({
      query: () => ({
        url: `/vendor/shop/profile`,
      }),
    }),

    updateShop: builder.mutation<ShopResponse, FormData>({
      query: (data) => ({
        url: `/vendor/shop/update`,
        method: "PUT",
        body: data,
      }),
      extraOptions: {
        prepareHeaders: (headers: Headers) => {
          headers.set("Content-Type", "multipart/form-data");
          return headers;
        },
      },
    }),

    getAllProvince: builder.mutation({
      query: (get) => ({
        url: `/location/province/${get}`,
        method: "GET",
      }),
    }),

    getAllDistrictByProvinceCode: builder.mutation({
      query: (provinceCode) => ({
        url: `/location/district/get-all-by-province-code/${provinceCode}`,
        method: "GET",
      }),
    }),

    getAllWardByDistrictCode: builder.mutation({
      query: (districtCode) => ({
        url: `/location/ward/get-all-by-district-code/${districtCode}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterShopMutation,
  useGetProfileShopQuery,
  useUpdateShopMutation,
  useGetAllProvinceMutation,
  useGetAllDistrictByProvinceCodeMutation,
  useGetAllWardByDistrictCodeMutation,
} = shopApi;
