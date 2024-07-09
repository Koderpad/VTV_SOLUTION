export interface ShippingDTO {
  transportProviderId: number;
  transportProviderFullName: string;
  transportProviderShortName: string;
  shippingCost: number;
  estimatedDeliveryTime: string;
  timestamp: string;
}

export interface ListShippingResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  shippingDTOs: ShippingDTO[];
}
