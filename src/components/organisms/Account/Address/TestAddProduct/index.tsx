import React from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "@/redux/features/vendor/product/productApiSlice";

interface ProductAttributeRequest {
  name: string;
  value: string;
}

interface ProductVariantRequest {
  productVariantId: number;
  sku: string;
  image: File | null;
  changeImage: boolean;
  originalPrice: number;
  price: number;
  quantity: number;
  productAttributeRequests: ProductAttributeRequest[];
}

interface AddProductFormData {
  productId: number;
  name: string;
  image: File | null;
  changeImage: boolean;
  description: string;
  information: string;
  categoryId: number;
  brandId: number;
  productVariantRequests: ProductVariantRequest[];
}

const TestAddProduct = () => {
  const { register, handleSubmit } = useForm<AddProductFormData>();
  const [addProduct, { isLoading }] = useAddProductMutation();

  const onSubmit = async (data: AddProductFormData) => {
    try {
      const formData = new FormData();

      console.log(data);

      // Hard code request data
      const requestData: AddProductFormData = {
        productId: 0,
        name: "string",
        image: data.image || null,
        changeImage: true,
        description: "string",
        information: "string",
        categoryId: 0,
        brandId: 0,
        productVariantRequests: [
          {
            productVariantId: 0,
            sku: "string",
            image: null,
            changeImage: true,
            originalPrice: 0,
            price: 0,
            quantity: 0,
            productAttributeRequests: [
              {
                name: "string",
                value: "string",
              },
            ],
          },
        ],
      };

      // Thêm các trường của sản phẩm vào FormData
      Object.entries(requestData).forEach(([key, value]) => {
        if (key === "image" && value !== null) {
          formData.append(key, value);
        } else if (key !== "productVariantRequests") {
          formData.append(key, value.toString());
        }
      });

      console.log(formData);

      // Thêm các biến thể sản phẩm vào FormData
      //   requestData.productVariantRequests.forEach((variant, index) => {
      //     const variantFormData = new FormData();
      //     Object.entries(variant).forEach(([key, value]) => {
      //       if (key === "image" && value !== null) {
      //         variantFormData.append(
      //           `productVariantRequests[${index}].${key}`,
      //           value
      //         );
      //       } else if (key !== "productAttributeRequests") {
      //         variantFormData.append(
      //           `productVariantRequests[${index}].${key}`,
      //           value.toString()
      //         );
      //       }
      //     });
      //     variant.productAttributeRequests.forEach(
      //       (attribute, attributeIndex) => {
      //         Object.entries(attribute).forEach(([key, value]) => {
      //           variantFormData.append(
      //             `productVariantRequests[${index}].productAttributeRequests[${attributeIndex}].${key}`,
      //             value
      //           );
      //         });
      //       }
      //     );
      //     for (const [key, value] of variantFormData.entries()) {
      //       formData.append(key, value);
      //     }
      //   });

      console.log("formData", formData);

      await addProduct(formData);
      alert("Thêm sản phẩm thành công");
    } catch (error) {
      alert("Thêm sản phẩm thất bại");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="image">Hình ảnh</label>
        <input {...register("image")} type="file" id="image" />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Đang thêm..." : "Thêm sản phẩm"}
      </button>
    </form>
  );
};

export default TestAddProduct;
