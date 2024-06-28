export interface ProductAttributeRequest {
  name: string;
  value: string;
}

export interface ProductVariantRequest {
  productVariantId: number | null;
  sku: string;
  image: string | File | null;
  changeImage: boolean;
  originalPrice: number;
  price: number;
  quantity: number;
  productAttributeRequests: ProductAttributeRequest[];
}

export interface ProductRequest {
  // productId: number;
  name: string;
  image: string | File | null;
  changeImage: boolean;
  description: string;
  information: string;
  categoryId: number;
  brandId: number;
  productVariantRequests: ProductVariantRequest[];
}
