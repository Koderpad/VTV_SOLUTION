export interface AddressResponse {
  status: string;
  message: string;
  code: number;
  username: string;
  addressDTO: AddressDTO;
}

export interface AddressDTO {
  addressId: number;
  provinceName: string;
  provinceFullName: string;
  districtName: string;
  districtFullName: string;
  wardName: string;
  wardFullName: string;
  fullAddress: string;
  fullName: string;
  phone: string;
  status: AddressStatus;
  wardCode: string;
}

export enum AddressStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}
