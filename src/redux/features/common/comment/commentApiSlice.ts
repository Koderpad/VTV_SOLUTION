import { apiSlice } from "@/redux/api";
import { CommentResponse } from "@/utils/DTOs/common/Comment/Response/CommentResponse";

interface CommentRequest {
  content: string;
  reviewId: string;
}

export const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewCommentByCustomer: builder.mutation<CommentResponse, CommentRequest>({
      query: (body) => ({
        url: `/customer/comment/add`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddNewCommentByCustomerMutation } = commentApi;
