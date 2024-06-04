import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";

export interface ManagerProductDTO {
    managerProductId: number; // Assuming Long is equivalent to number in TS
    note: string;
    isLock: boolean;
    customerManagerId: number;
    usernameManager: string;
    productId: number;
    productName: string;
    productDTO: ProductDTO; // Reference to ProductDTO interface
}
