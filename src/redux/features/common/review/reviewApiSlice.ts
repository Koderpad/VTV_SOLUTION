import { apiSlice } from "@/redux/api";
import { ListReviewResponse } from "@/utils/DTOs/common/Product/Response/ListReviewResponse";
import { ReviewResponse } from "@/utils/DTOs/common/Review/Response/ReviewResponse";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviewListByProductId: builder.query<ListReviewResponse, number>({
      query: (productId) => ({
        url: `/review/product/${productId}`,
      }),
    }),
    isReviewExist: builder.query<boolean, string>({
      query: (orderItemId) => ({
        url: `/customer/review/exist/by-order-item/${orderItemId}`,
      }),
    }),
    getReviewDetailByOrderItemId: builder.query<ReviewResponse, string>({
      query: (orderItemId) => ({
        url: `/customer/review/detail/by-order-item/${orderItemId}`,
      }),
    }),
    addReview: builder.mutation<ReviewResponse, FormData>({
      query: (body) => ({
        url: `/customer/review/add`,
        method: "POST",
        body,
      }),
      extraOptions: {
        prepareHeaders: (headers: Headers) => {
          headers.set("Content-Type", "multipart/form-data");
          return headers;
        },
      },
    }),
    deleteReview: builder.mutation<ReviewResponse, string>({
      query: (reviewId) => ({
        url: `/customer/review/delete/${reviewId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetReviewListByProductIdQuery,
  useIsReviewExistQuery,
  useGetReviewDetailByOrderItemIdQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
