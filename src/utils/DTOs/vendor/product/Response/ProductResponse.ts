export interface AttributeDTO {
  attributeId: number;
  name: string;
  value: string;
  active: boolean;
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

export interface ProductResponse {
  status: string;
  message: string;
  code: number;
  categoryId: number;
  categoryName: string;
  categoryParentId: number;
  categoryParentName: string;
  shopId: number;
  usernameShop: string;
  shopName: string;
  shopAvatar: string;
  countOrder: number;
  productDTO: ProductDTO;
}
