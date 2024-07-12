export interface ShopResponse {
  status: string;
  message: string;
  code: number; // integer($int32)
  shopDTO: ShopDTO;
}

interface ShopDTO {
  shopId: number; // integer($int64)
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
  customerId: number; // integer($int64)
  shopUsername: string;
  wardCode: string;
}
