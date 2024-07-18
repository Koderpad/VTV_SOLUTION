export interface ListFollowedShopResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  followedShopDTOs: FollowedShopDTO[];
}

export interface FollowedShopDTO {
  followedShopId: number;
  shopId: number;
  shopName: string;
  avatar: string;
}
