export interface FeeShippingDTO  { // Assuming Serializable is an interface
    feeShippingId: number; // Assuming Long is a synonym for number here
    zeroArea: number;
    zeroEstimatedDeliveryTime: number;
    oneArea: number;
    oneEstimatedDeliveryTime: number;
    twoArea: number;
    twoEstimatedDeliveryTime: number;
    threeArea: number;
    threeEstimatedDeliveryTime: number;
    fourArea: number;
    fourEstimatedDeliveryTime: number;
    transportProviderId: number;
}