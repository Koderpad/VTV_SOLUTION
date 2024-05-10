export interface AddressStatusRequest {
  username?: string;
  addressId: number;
  status: AddressStatus;
}

export enum AddressStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}
