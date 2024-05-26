export interface ReviewRequest {
  content: string;
  rating: number;
  orderItemId: string;
  image: File|null;
  hasImage: boolean;
}
