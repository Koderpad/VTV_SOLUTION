export interface FavoriteProductResponse {
  status: string;
  message: string;
  code: number;
  favoriteProductDTO: FavoriteProductDTO;
}

export interface FavoriteProductDTO {
  favoriteProductId: number;
  productId: number;
  createAt: string;
}
