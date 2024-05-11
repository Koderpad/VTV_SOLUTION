export interface AddressRequest {
  username?: string;
  addressId?: number;
  provinceName: string;
  districtName: string;
  wardName: string;
  fullAddress: string;
  fullName: string;
  phone: string;
  wardCode?: string;
}
