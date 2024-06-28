import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UpdateProductBasicInfo } from "./UpdateProductBasicInfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { ProductRequest } from "@/utils/DTOs/vendor/product/Request/ProductRequest_Update";
import { useUpdateProductMutation } from "@/redux/features/vendor/product/productShopApiSlice";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ProductResponse } from "@/utils/DTOs/vendor/product/Response/ProductResponse";
import { fetchProductDetail } from "@/services/common/ProductService";
import { UpdateProductSalesInfo } from "./UpdateProductSalesInfo";

export const UpdateProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [updateProduct] = useUpdateProductMutation();

  const methods = useForm<ProductRequest>({
    defaultValues: {
      name: "",
      image: "",
      changeImage: false,
      description: "",
      information: "",
      categoryId: 0,
      productVariantRequests: [],
    },
  });

  const { setValue } = methods;

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const productData = await fetchProductDetail(Number(productId));
        const { productDTO } = productData;

        setValue("name", productDTO.name);
        setValue("image", productDTO.image);
        setValue("description", productDTO.description);
        setValue("information", productDTO.information);
        setValue("categoryId", productDTO.categoryId);

        // Set product variants
        const productVariants = productDTO.productVariantDTOs.map(
          (variant) => ({
            productVariantId: variant.productVariantId,
            sku: variant.sku,
            image: variant.image,
            originalPrice: variant.originalPrice,
            price: variant.price,
            quantity: variant.quantity,
            changeImage: false, // Thêm trường này
            productAttributeRequests: variant.attributeDTOs.map((attr) => ({
              name: attr.name,
              value: attr.value,
            })),
          })
        );

        setValue("productVariantRequests", productVariants);
      } catch (error) {
        toast.error("Failed to load product data");
        console.error(error);
      }
    };

    if (productId) {
      loadProductData();
    }
  }, [productId, setValue]);

  const convertProductRequestToFormData = (data: ProductRequest): FormData => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("information", data.information);
    formData.append("categoryId", data.categoryId.toString());

    if (data.image instanceof File) {
      formData.append("image", data.image);
      formData.append("changeImage", "true");
    } else {
      formData.append("changeImage", "false");
    }

    data.productVariantRequests.forEach((variant, index) => {
      // formData.append(
      //   `productVariantRequests[${index}].productVariantId`,
      //   variant.productVariantId.toString() || ""
      // );
      if (variant.productVariantId) {
        formData.append(
          `productVariantRequests[${index}].productVariantId`,
          variant.productVariantId.toString()
        );
      }
      formData.append(`productVariantRequests[${index}].sku`, variant.sku);
      formData.append(
        `productVariantRequests[${index}].originalPrice`,
        variant.originalPrice.toString()
      );
      formData.append(
        `productVariantRequests[${index}].price`,
        variant.price.toString()
      );
      formData.append(
        `productVariantRequests[${index}].quantity`,
        variant.quantity.toString()
      );

      if (variant.image instanceof File) {
        formData.append(
          `productVariantRequests[${index}].image`,
          variant.image
        );
        formData.append(`productVariantRequests[${index}].changeImage`, "true");
      } else {
        formData.append(
          `productVariantRequests[${index}].changeImage`,
          "false"
        );
      }

      console.log("Variant loi: ", variant);

      variant.productAttributeRequests.forEach((attr, attrIndex) => {
        formData.append(
          `productVariantRequests[${index}].productAttributeRequests[${attrIndex}].name`,
          attr.name
        );
        formData.append(
          `productVariantRequests[${index}].productAttributeRequests[${attrIndex}].value`,
          attr.value
        );
      });
    });

    return formData;
  };

  const onSubmit = async (data: ProductRequest) => {
    console.log("Data to update: ", data);
    const formData = convertProductRequestToFormData(data);

    handleApiCall<ProductResponse, ServerError>({
      callbackFn: async () => {
        return await updateProduct({
          productId: Number(productId),
          data: formData,
        });
      },
      successCallback: (response) => {
        toast.success("Cập nhật sản phẩm thành công");
        console.log("Cập nhật sản phẩm: ", response);
        navigate("/vendor/products");
      },
      errorFromServerCallback: (error) => {
        if (error.status === "BAD_REQUEST") {
          toast.error(`Cập nhật sản phẩm thất bại: ${error.message}`);
        } else {
          toast.error(
            `Cập nhật sản phẩm thất bại: ${error.message || "Đã xảy ra lỗi"}`
          );
        }
      },
      errorSerializedCallback: (error) => {
        toast.error(
          `Cập nhật sản phẩm thất bại: ${error.message || "Đã xảy ra lỗi không xác định"}`
        );
      },
      errorCallback: (error) => {
        toast.error(
          `Cập nhật sản phẩm thất bại: ${error || "Đã xảy ra lỗi không xác định"}`
        );
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full border-2 bg-[#E4E4E7]"
      >
        <div id="product-edit-container">
          <div id="product-edit-main" className="flex flex-col w-full">
            <UpdateProductBasicInfo />
            <UpdateProductSalesInfo />
            <div
              id="product-selected-fix shopee-fix-bottom-card"
              className="w-full h-[56px] mt-[16px] bg-[#FAFAF9]"
            >
              <div id="container" className="flex w-full">
                <div id="container-left" className="w-0 h-0"></div>
                <div
                  id="container-right btn-group"
                  className="flex justify-end p-4 w-full gap-10"
                >
                  <button
                    type="button"
                    onClick={() => navigate("/vendor/products")}
                  >
                    Hủy
                  </button>
                  <button type="submit">Cập nhật</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </form>
    </FormProvider>
  );
};
