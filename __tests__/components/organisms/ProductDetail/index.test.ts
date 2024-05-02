// ./tests/index.test.tsx

import { describe, expect, it } from "vitest";
import {
  getOutOfStockAttributes,
  isAttributeValueAlwaysOutOfStock,
  getProductVariantId,
} from "../../../../src/components/organisms/ProductDetail";

describe("getProductVariantId", () => {
  it("should return null if selectedAttributes is not enough to have all attribute in attributeDTOs", () => {
    const selectedAttributes = { "Màu sắc": "Xanh" };
    const data = {
      status: "OK",
      message: "Lấy thông tin sản phẩm thành công!",
      code: 200,
      categoryId: 6,
      categoryName: "Áo sơ mi 91",
      categoryParentId: 5,
      categoryParentName: "Áo",
      shopId: 2,
      shopName: "Shop cua Vuong",
      shopAvatar:
        "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2F1703061907280-grid.PNG?alt=media&token=6b5b668c-9d0d-48e4-bc3e-5655d83c94d2",
      countOrder: 0,
      productDTO: {
        productId: 1,
        name: "Aó thun caro",
        image:
          "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
        description: "áo cho nam",
        information: "xuất xứ: Trung Quốc",
        sold: 23,
        status: "ACTIVE",
        categoryId: 6,
        shopId: 2,
        brandId: null,
        maxPrice: 100000,
        minPrice: 100000,
        rating: "0.0",
        countProductVariant: 6,
        productVariantDTOs: [
          {
            productVariantId: 6,
            sku: "aaaaaa",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 99,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 5,
                name: "Size",
                value: "XL",
                active: true,
              },
            ],
          },
          {
            productVariantId: 1,
            sku: "abc1",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 100,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 3,
                name: "Size",
                value: "M",
                active: true,
              },
            ],
          },
          {
            productVariantId: 2,
            sku: "abc2",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 100,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 4,
                name: "Size",
                value: "L",
                active: true,
              },
            ],
          },
          {
            productVariantId: 3,
            sku: "abc3",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 0,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 5,
                name: "Size",
                value: "XL",
                active: true,
              },
            ],
          },
          {
            productVariantId: 4,
            sku: "abc4",
            image:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2F1703062743849-undefined?alt=media&token=8550f1ef-527b-4e7a-8a9c-d69fdb83676e",
            originalPrice: 100000,
            price: 100000,
            quantity: 97,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 3,
                name: "Size",
                value: "M",
                active: true,
              },
            ],
          },
          {
            productVariantId: 5,
            sku: "abc5",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 96,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 4,
                name: "Size",
                value: "L",
                active: true,
              },
            ],
          },
        ],
      },
    };

    expect(getProductVariantId(selectedAttributes, data)).toBe(null);
  });

  it("should return the variant id if it is enough all attribute in attributeDTOs and a matching variant is found", () => {
    const selectedAttributes = { "Màu sắc": "Xanh", Size: "XL" };
    const data = {
      status: "OK",
      message: "Lấy thông tin sản phẩm thành công!",
      code: 200,
      categoryId: 6,
      categoryName: "Áo sơ mi 91",
      categoryParentId: 5,
      categoryParentName: "Áo",
      shopId: 2,
      shopName: "Shop cua Vuong",
      shopAvatar:
        "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2F1703061907280-grid.PNG?alt=media&token=6b5b668c-9d0d-48e4-bc3e-5655d83c94d2",
      countOrder: 0,
      productDTO: {
        productId: 1,
        name: "Aó thun caro",
        image:
          "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
        description: "áo cho nam",
        information: "xuất xứ: Trung Quốc",
        sold: 23,
        status: "ACTIVE",
        categoryId: 6,
        shopId: 2,
        brandId: null,
        maxPrice: 100000,
        minPrice: 100000,
        rating: "0.0",
        countProductVariant: 6,
        productVariantDTOs: [
          {
            productVariantId: 6,
            sku: "aaaaaa",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 99,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 5,
                name: "Size",
                value: "XL",
                active: true,
              },
            ],
          },
          {
            productVariantId: 1,
            sku: "abc1",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 100,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 3,
                name: "Size",
                value: "M",
                active: true,
              },
            ],
          },
          {
            productVariantId: 2,
            sku: "abc2",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 100,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 4,
                name: "Size",
                value: "L",
                active: true,
              },
            ],
          },
          {
            productVariantId: 3,
            sku: "abc3",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 0,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 1,
                name: "Màu sắc",
                value: "Đỏ",
                active: true,
              },
              {
                attributeId: 5,
                name: "Size",
                value: "XL",
                active: true,
              },
            ],
          },
          {
            productVariantId: 4,
            sku: "abc4",
            image:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2F1703062743849-undefined?alt=media&token=8550f1ef-527b-4e7a-8a9c-d69fdb83676e",
            originalPrice: 100000,
            price: 100000,
            quantity: 97,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 3,
                name: "Size",
                value: "M",
                active: true,
              },
            ],
          },
          {
            productVariantId: 5,
            sku: "abc5",
            image: "",
            originalPrice: 100000,
            price: 100000,
            quantity: 96,
            status: "ACTIVE",
            productId: 1,
            productName: "Aó thun caro",
            productImage:
              "https://firebasestorage.googleapis.com/v0/b/vtc-firebase.appspot.com/o/images%2Fb1efc77e-phoi-do-di-choi-tet-cho-nam-thumbnail.jpg?alt=media&token=b3b4ad7f-7ae2-437f-b90b-7b167fafa0bb",
            discountPercent: "0%",
            countAttribute: 2,
            attributeDTOs: [
              {
                attributeId: 2,
                name: "Màu sắc",
                value: "Xanh",
                active: true,
              },
              {
                attributeId: 4,
                name: "Size",
                value: "L",
                active: true,
              },
            ],
          },
        ],
      },
    };

    expect(getProductVariantId(selectedAttributes, data)).toBe("6");
  });
});

describe("isAttributeValueAlwaysOutOfStock", () => {
  it("should return true if attribute value is always out of stock", () => {
    const attributeList = [
      { name: "color", values: ["red", "blue", "green"] },
      { name: "size", values: ["S", "M", "L"] },
    ];

    const outOfStockAttributeList = [
      ["red", "S"],
      ["red", "M"],
      ["red", "L"],
    ];

    const result = isAttributeValueAlwaysOutOfStock(
      "color",
      "red",
      attributeList,
      outOfStockAttributeList
    );
    expect(result).toBe(true);
  });

  it("should return false if attribute value is exist value not out of stock", () => {
    const attributeList = [
      { name: "color", values: ["red", "blue", "green"] },
      { name: "size", values: ["S", "M", "L"] },
    ];

    const outOfStockAttributeList = [
      ["blue", "S"],
      ["blue", "M"],
      ["red", "M"],
    ];

    const result = isAttributeValueAlwaysOutOfStock(
      "color",
      "blue",
      attributeList,
      outOfStockAttributeList
    );
    expect(result).toBe(false);
  });

  it("should return false if attribute value is not always out of stock", () => {
    const attributeList = [
      { name: "color", values: ["red", "blue", "green"] },
      { name: "size", values: ["S", "M", "L"] },
    ];

    const outOfStockAttributeList = [
      ["red", "S"],
      ["blue", "M"],
      ["green", "L"],
    ];

    const result = isAttributeValueAlwaysOutOfStock(
      "color",
      "red",
      attributeList,
      outOfStockAttributeList
    );
    expect(result).toBe(false);
  });

  it("should return false if attribute value is not always out of stock, IN case 1 attribute", () => {
    const attributeList = [{ name: "color", values: ["red", "blue", "green"] }];

    const outOfStockAttributeList = [["red"]];

    const result = isAttributeValueAlwaysOutOfStock(
      "color",
      "blue",
      attributeList,
      outOfStockAttributeList
    );
    expect(result).toBe(false);
  });
});
describe("getOutOfStockAttributes", () => {
  it("should return the correct attributes for out of stock products", () => {
    const attributeList = [
      { name: "color", values: ["red", "blue"] },
      { name: "size", values: ["XL", "M", "L"] },
    ];

    const outOfStockAttributeList = [["red", "XL"]];

    const selectedAttributes = {
      size: "XL",
    };

    const expected = ["red"];

    expect(
      getOutOfStockAttributes(
        selectedAttributes,
        attributeList,
        outOfStockAttributeList
      )
    ).toEqual(expected);
  });
});
