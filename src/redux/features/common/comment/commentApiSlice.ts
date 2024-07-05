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
    deleteCommentByCustomer: builder.mutation<CommentResponse, string>({
      query: (commentId) => ({
        url: `/customer/comment/delete/${commentId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useAddNewCommentByCustomerMutation,
  useDeleteCommentByCustomerMutation,
} = commentApi;
