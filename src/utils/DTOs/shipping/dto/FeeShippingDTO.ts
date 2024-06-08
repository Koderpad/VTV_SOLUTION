export interface FeeShippingDTO  { // Assuming Serializable is an interface
    feeShippingId: number; // Assuming Long is a synonym for number here
    zeroArea: number;
    oneArea: number;
    twoArea: number;
    threeArea: number;
    fourArea: number;
    transportProviderId: number;
}
