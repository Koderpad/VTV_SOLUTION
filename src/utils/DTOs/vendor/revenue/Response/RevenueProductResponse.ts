export interface RevenueProductResponse {
  status: string;
  message: string;
  code: number;
  totalSold: number;
  totalMoney: number;
  totalOrder: number;
  productDTO: ProductDTO; // Single ProductDTO
  revenueProductDTOs: RevenueProductDTO[]; // Array of RevenueProductDTOs
}

export interface ProductDTO {
  productId: number;
  name: string;
  image: string;
  description: string;
  information: string;
  sold: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED" | "CANCEL" | "LOCKED";
  categoryId: number;
  shopId: number;
  brandId: number;
  maxPrice: number;
  minPrice: number;
  rating: string;
  createAt: string; // Assuming ISO 8601 format date-time string
  updateAt: string; // Assuming ISO 8601 format date-time string
  countProductVariant: number;
  productVariantDTOs: ProductVariantDTO[];
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

export interface RevenueProductDTO {
  totalSold: number;
  totalMoney: number;
  totalOrder: number;
  date: string; // Assuming ISO 8601 format date-time string
}
