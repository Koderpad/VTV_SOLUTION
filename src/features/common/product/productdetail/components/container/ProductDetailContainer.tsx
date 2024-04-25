import { ProductDetail } from "@/components/organisms/ProductDetail";
import { getProductDetail } from "@/services/common/ProductService";
import {
  ProductDTO,
  ProductResponse,
} from "@/utils/DTOs/common/Product/Response/ProductResponse";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProductDetailContainer = () => {
  const [product, setProduct] = useState<ProductResponse | null>(null);

  const { productId } = useParams();

  if (!productId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Product not found</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductDetail(parseInt(productId));
      setProduct(data);
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Loading...</p>
      </div>
    );
  }

  //   const getProductAttributes = (product: ProductDTO) => {
  //     const attributes: { [key: string]: Set<string> } = {};
  //     const outOfStockAttributes: { [key: string]: Set<string> } = {};

  //     product.productVariantDTOs.forEach((variant) => {
  //       variant.attributeDTOs.forEach((attribute) => {
  //         const { name, value } = attribute;

  //         if (!attributes[name]) {
  //           attributes[name] = new Set();
  //         }
  //         attributes[name].add(value);

  //         if (variant.quantity === 0) {
  //           if (!outOfStockAttributes[name]) {
  //             outOfStockAttributes[name] = new Set();
  //           }
  //           outOfStockAttributes[name].add(value);
  //         }
  //       });
  //     });

  //     const attributeList = Object.entries(attributes).map(([name, values]) => ({
  //       name,
  //       values: Array.from(values as Set<string>),
  //     }));

  //     const outOfStockAttributeList = Object.entries(outOfStockAttributes).map(
  //       ([name, values]) => ({
  //         name,
  //         values: Array.from(values as Set<string>),
  //       })
  //     );

  //     return {
  //       attributeList,
  //       outOfStockAttributeList,
  //     };
  //   };
  const getProductAttributes = (product: ProductDTO) => {
    const attributes: { [key: string]: Set<string> } = {};
    const outOfStockAttributeList: string[][] = [];

    product.productVariantDTOs.forEach((variant) => {
      const isVariantOutOfStock = variant.quantity === 0;

      if (isVariantOutOfStock) {
        const outOfStockAttributeCombination: string[] = [];

        variant.attributeDTOs.forEach((attribute) => {
          const { name, value } = attribute;

          if (!attributes[name]) {
            attributes[name] = new Set();
          }
          attributes[name].add(value);

          outOfStockAttributeCombination.push(value);
        });

        outOfStockAttributeList.push(outOfStockAttributeCombination);
      } else {
        variant.attributeDTOs.forEach((attribute) => {
          const { name, value } = attribute;

          if (!attributes[name]) {
            attributes[name] = new Set();
          }
          attributes[name].add(value);
        });
      }
    });

    const attributeList = Object.entries(attributes).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));

    return {
      attributeList,
      outOfStockAttributeList,
    };
  };

  const { attributeList, outOfStockAttributeList } = getProductAttributes(
    product.productDTO
  );

  return (
    <ProductDetail
      data={product}
      attributeList={attributeList}
      outOfStockAttributeList={outOfStockAttributeList}
    />
  );
};
