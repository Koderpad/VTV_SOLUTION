export interface FollowedShopResponse {
  status: string;
  message: string;
  code: number;
  followedShopDTO: FollowedShopDTO;
}

export interface FollowedShopDTO {
  followedShopId: number;
  shopId: number;
  shopName: string;
  avatar: string;
}
