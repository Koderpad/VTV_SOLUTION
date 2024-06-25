import { apiSlice } from "@/redux/api";

export const shopApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerShop: builder.mutation({
      query: (data) => ({
        url: `/vendor/register`,
        method: "POST",
        body: data,
      }),
    }),

    getProfileShop: builder.query({
      query: () => ({
        url: `/vendor/shop/profile`,
      }),
    }),

    updateShop: builder.mutation({
      query: (data) => ({
        url: `/vendor/shop/update`,
        method: "PUT",
        body: data,
      }),
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
