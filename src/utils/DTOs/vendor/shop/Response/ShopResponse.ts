export interface ShopDTO {
  shopId: number;
  name: string;
  address: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  phone: string;
  email: string;
  avatar: string;
  description: string;
  openTime: string;
  closeTime: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  customerId: number;
  shopUsername: string;
  wardCode: string;
}

export interface ShopResponse {
  status: string;
  message: string;
  code: number;
  shopDTO: ShopDTO;
}
