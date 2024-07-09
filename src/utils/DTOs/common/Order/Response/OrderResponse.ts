export interface OrderResponse {
  status: string;
  message: string;
  code: number;
  balance: number;
  totalPoint: number;
  orderDTO: OrderDTO;
}

export interface OrderDTO {
  orderId: string;
  note: string;
  paymentMethod: string;
  shippingMethod: string;
  count: number;
  totalPrice: number;
  discountShop: number;
  discountSystem: number;
  shippingFee: number;
  paymentTotal: number;
  status: OrderStatus;
  orderDate: string;
  addressDTO: AddressDTO;
  shopDTO: ShopDTO;
  loyaltyPointHistoryDTO: LoyaltyPointHistoryDTO;
  voucherOrderDTOs: VoucherOrderDTO[];
  orderItemDTOs: OrderItemDTO[];
  transportDTO: TransportDTO;
  shippingDTO: ShippingDTO;
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
  status: Status;
  wardCode: string;
}

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
  status: Status;
  customerId: number;
  shopUsername: string;
  wardCode: string;
}

export interface LoyaltyPointHistoryDTO {
  loyaltyPointHistoryId: number;
  point: number;
  type: string;
  status: Status;
  loyaltyPointId: number;
  createAt: string;
}

export interface VoucherOrderDTO {
  voucherOrderId: number;
  voucherId: number;
  voucherName: string;
  type: boolean;
  orderId: string;
}

export interface OrderItemDTO {
  orderItemId: string;
  orderId: string;
  cartId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  productVariantDTO: ProductVariantDTO;
}

export interface ProductVariantDTO {
  productVariantId: number;
  sku: string;
  image: string;
  originalPrice: number;
  price: number;
  quantity: number;
  status: Status;
  productId: number;
  productName: string;
  productImage: string;
  discountPercent: string;
  countAttribute: number;
  attributeDTOs: AttributeDTO[];
}

export interface AttributeDTO {
  attributeId: number;
  name: string;
  value: string;
  active: boolean;
}

export interface TransportDTO {
  transportId: string;
  wardCodeShop: string;
  wardCodeCustomer: string;
  orderId: string;
  shopId: number;
  shippingMethod: string;
  status: TransportStatus;
  createAt: string;
  updateAt: string;
  totalTransportHandle: number;
  transportHandleDTOs: TransportHandleDTO[];
}

export interface TransportHandleDTO {
  transportHandleId: string;
  username: string;
  wardCode: string;
  handled: boolean;
  messageStatus: string;
  transportStatus: TransportStatus;
  createAt: string;
  updateAt: string;
}

export interface ShippingDTO {
  transportProviderId: number;
  transportProviderFullName: string;
  transportProviderShortName: string;
  shippingCost: number;
  estimatedDeliveryTime: string;
  timestamp: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PICKUP_PENDING = "PICKUP_PENDING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  RETURNED = "RETURNED",
  WAITING = "WAITING",
  CANCEL = "CANCEL",
  REFUNDED = "REFUNDED",
  PAID = "PAID",
  UNPAID = "UNPAID",
  FAIL = "FAIL",
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
  CANCEL = "CANCEL",
  LOCKED = "LOCKED",
}

export enum TransportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  WAITING = "WAITING",
  PICKUP_PENDING = "PICKUP_PENDING",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  WAREHOUSE = "WAREHOUSE",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  RETURNED = "RETURNED",
  CANCEL = "CANCEL",
  UNPAID = "UNPAID",
}
