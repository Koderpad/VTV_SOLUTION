import { apiSlice } from "@/redux/api";
import { ListReviewResponse } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviewListByProductId: builder.query<ListReviewResponse, number>({
      query: (productId) => ({
        url: `/review/product/${productId}`,
      }),
    }),
  }),
});

export const { useGetReviewListByProductIdQuery } = reviewApi;
