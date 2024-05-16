export interface ListReviewResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  productId: number;
  averageRating: number;
  reviewDTOs: ReviewDTO[];
}

export interface ReviewDTO {
  reviewId: string;
  content: string;
  rating: number;
  image: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'CANCEL' | 'LOCKED';
  username: string;
  orderItemId: string;
  createdAt: string;
  countComment: number;
  commentDTOs: CommentDTO[];
}

export interface CommentDTO {
  commentId: string;
  content: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'CANCEL' | 'LOCKED';
  createDate: string;
  username: string;
  shopName: string;
}

