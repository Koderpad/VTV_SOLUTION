export interface ReviewResponse {
  status: string;
  message: string;
  code: number;
  productId: number;
  reviewDTO: ReviewDTO;
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
