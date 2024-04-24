// File: ProductResponse.ts

interface ProductResponse {
  status: string;
  message: string;
  code: number;
  categoryId: number;
  categoryName: string;
  categoryParentId: number;
  categoryParentName: string;
  shopId: number;
  shopName: string;
  shopAvatar: string;
  countOrder: number;
  productDTO: ProductDTO;
}

interface ProductDTO {
  productId: number;
  name: string;
  image: string;
  description: string;
  information: string;
  sold: number;
  status: string;
  categoryId: number;
  shopId: number;
  brandId: number | null;
  maxPrice: number;
  minPrice: number;
  rating: string;
  countProductVariant: number;
  productVariantDTOs: ProductVariantDTO[];
}

interface ProductVariantDTO {
  productVariantId: number;
  sku: string;
  image: string;
  originalPrice: number;
  price: number;
  quantity: number;
  status: string;
  productId: number;
  productName: string;
  productImage: string;
  discountPercent: string;
  countAttribute: number;
  attributeDTOs: AttributeDTO[];
}

interface AttributeDTO {
  attributeId: number;
  name: string;
  value: string;
  active: boolean;
}

export type { ProductResponse, ProductDTO, ProductVariantDTO, AttributeDTO };
