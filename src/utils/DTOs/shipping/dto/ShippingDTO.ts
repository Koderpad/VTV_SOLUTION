export interface ShippingDTO {
    transportProviderId: number;
    transportProviderFullName: string;
    transportProviderShortName: string;
    shippingCost: number;
    estimatedDeliveryTime: string;
    timestamp: string;
}