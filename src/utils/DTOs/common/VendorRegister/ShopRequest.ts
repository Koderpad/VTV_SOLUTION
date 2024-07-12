export interface ShopRequest {
  name: string;
  address: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  wardCode: string;
  phone: string;
  email: string;
  avatar: string; // Assuming this is a URL or base64 string for the binary data
  changeAvatar: boolean;
  description: string;
  openTime: string;
  closeTime: string;
}
