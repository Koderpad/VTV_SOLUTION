export interface ProductPageResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  page: number;
  size: number;
  totalPage: number;
  totalProduct: number;
  productDTOs: ProductDTO[];
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
  createAt: string;
  updateAt: string;
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
