export interface ProfileCustomerResponse {
  status: string;
  message: string;
  code: number;
  customerDTO: CustomerDTO;
}

export interface CustomerDTO {
  customerId: number;
  username: string;
  email: string;
  gender: boolean;
  fullName: string;
  birthday: string;
  status: CustomerStatus;
  roles: CustomerRole[];
}

export enum CustomerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}

export enum CustomerRole {
  CUSTOMER = "CUSTOMER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
  PROVIDER = "PROVIDER",
  DELIVER = "DELIVER",
  DELIVER_MANAGER = "DELIVER_MANAGER",
  MANAGER = "MANAGER",
  MANAGERCUSTOMER = "MANAGERCUSTOMER",
  MANAGERVENDOR = "MANAGERVENDOR",
  MANAGERSHIPPING = "MANAGERSHIPPING",
}
