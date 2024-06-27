export interface ProductAttributeRequest {
  name: string;
  value: string;
}

export interface ProductVariantRequest {
  productVariantId: number;
  sku: string;
  image: string | File; // Assuming binary data will be handled as a string (e.g., base64)
  changeImage: boolean;
  originalPrice: number;
  price: number;
  quantity: number;
  productAttributeRequests: ProductAttributeRequest[];
}

export interface ProductRequest {
  productId: number;
  name: string;
  image: string | File; // Assuming binary data will be handled as a string (e.g., base64)
  changeImage: boolean;
  description: string;
  information: string;
  categoryId: number;
  brandId: number;
  productVariantRequests: ProductVariantRequest[];
}
