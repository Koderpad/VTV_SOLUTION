// ./tests/index.test.tsx

import { describe, expect, it } from "vitest";
import {
  getOutOfStockAttributes,
  isAttributeValueAlwaysOutOfStock,
} from "../../../../src/components/organisms/ProductDetail";

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
