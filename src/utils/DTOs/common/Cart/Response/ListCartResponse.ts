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
  status: string;
  productId: number;
  productName: string;
  productImage: string;
  discountPercent: string;
  countAttribute: number;
  attributeDTOs: AttributeDTO[];
}

export interface Cart {
  cartId: string;
  quantity: number;
  productId: number;
  productName: string;
  productImage: string;
  updateAt: string;
  productVariantDTO: ProductVariantDTO;
}

export interface ListCartByShopDTO {
  shopId: number;
  shopName: string;
  avatar: string;
  countCartInShop: number;
  carts: Cart[];
}

export interface ListCartResponse {
  status: string;
  message: string;
  code: number;
  count: number;
  listCartByShopDTOs: ListCartByShopDTO[];
}
