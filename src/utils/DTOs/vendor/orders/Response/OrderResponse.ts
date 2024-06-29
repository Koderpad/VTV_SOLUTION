export interface OrderResponse {
  status: string;
  message: string;
  code: number;
  balance: number;
  totalPoint: number;
  orderDTO: OrderDTO;
  transportDTO: TransportDTO;
  shippingDTO: ShippingDTO;
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
  status:
    | "PENDING"
    | "PROCESSING"
    | "PICKUP_PENDING"
    | "SHIPPING"
    | "DELIVERED"
    | "COMPLETED"
    | "RETURNED"
    | "WAITING"
    | "CANCEL"
    | "REFUNDED"
    | "PAID"
    | "UNPAID"
    | "FAIL";
  orderDate: string;
  addressDTO: AddressDTO;
  shopDTO: ShopDTO;
  loyaltyPointHistoryDTO: LoyaltyPointHistoryDTO;
  voucherOrderDTOs: VoucherOrderDTO[];
  orderItemDTOs: OrderItemDTO[];
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
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
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
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  customerId: number;
  shopUsername: string;
  wardCode: string;
}

export interface LoyaltyPointHistoryDTO {
  loyaltyPointHistoryId: number;
  point: number;
  type: string;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
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
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
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
  status:
    | "PENDING"
    | "PROCESSING"
    | "WAITING"
    | "PICKUP_PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "WAREHOUSE"
    | "SHIPPING"
    | "DELIVERED"
    | "COMPLETED"
    | "RETURNED"
    | "CANCEL"
    | "UNPAID";
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
  transportStatus:
    | "PENDING"
    | "PROCESSING"
    | "WAITING"
    | "PICKUP_PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "WAREHOUSE"
    | "SHIPPING"
    | "DELIVERED"
    | "COMPLETED"
    | "RETURNED"
    | "CANCEL"
    | "UNPAID";
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
