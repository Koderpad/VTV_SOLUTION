export interface CommentResponse {
  status: string;
  message: string;
  code: number;
  username: string;
  reviewId: string;
  commentDTO: CommentDTO;
}

export interface CommentDTO {
  commentId: string;
  content: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  createDate: string;
  username: string;
  shopName: string;
}
