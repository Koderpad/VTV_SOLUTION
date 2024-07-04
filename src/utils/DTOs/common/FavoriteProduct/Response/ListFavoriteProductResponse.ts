export interface ListFavoriteProductResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  customerDTO: CustomerDTO;
  favoriteProductDTOs: FavoriteProductDTO[];
}

export interface CustomerDTO {
  customerId: number;
  username: string;
  email: string;
  gender: boolean;
  fullName: string;
  birthday: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  roles: Array<
    | "CUSTOMER"
    | "VENDOR"
    | "ADMIN"
    | "PROVIDER"
    | "DELIVER"
    | "DELIVER_MANAGER"
    | "MANAGER"
    | "MANAGERCUSTOMER"
    | "MANAGERVENDOR"
    | "MANAGERSHIPPING"
  >;
}

export interface FavoriteProductDTO {
  favoriteProductId: number;
  productId: number;
  createAt: string;
}
