export interface ListAddressResponse {
  status: string;
  message: string;
  code: number;
  username: string;
  count: number;
  addressDTOs: AddressDTO[];
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
