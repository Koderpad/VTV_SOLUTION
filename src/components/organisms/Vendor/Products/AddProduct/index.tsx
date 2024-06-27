import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ProductBasicInfo } from "./MainContent/BasicInfo/ProductBasicInfo";
import { ProductSalesInfo } from "./MainContent/ProductSalesInfo/ProductSalesInfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ProductRequest } from "@/utils/DTOs/vendor/product/Request/ProductRequest";
import { useAddProductMutation } from "@/redux/features/vendor/product/productShopApiSlice";
import { ServerError } from "@/utils/DTOs/common/ServerError";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { ProductResponse } from "@/utils/DTOs/vendor/product/Response/ProductResponse";

export const AddProduct = () => {
  const navigate = useNavigate();
  const [addProduct] = useAddProductMutation();

  const methods = useForm<ProductRequest>({
    defaultValues: {
      productId: 0,
      name: "",
      image: "",
      changeImage: false,
      description: "",
      information: "",
      categoryId: 0,
      // brandId: 0,
      productVariantRequests: [],
    },
  });

  const convertProductRequestToFormData = (data: ProductRequest): FormData => {
    const formData = new FormData();
    formData.append("productId", data.productId.toString());
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("information", data.information);
    formData.append("categoryId", data.categoryId.toString());
    // formData.append("brandId", data.brandId.toString());

    if (data.image instanceof File) {
      formData.append("image", data.image);
      formData.append("changeImage", "true");
    } else {
      formData.append("changeImage", "false");
    }

    data.productVariantRequests.forEach((variant, index) => {
      formData.append(
        `productVariantRequests[${index}].productVariantId`,
        variant.productVariantId.toString()
      );
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
    console.log("data: ", data);
    const formData = convertProductRequestToFormData(data);

    handleApiCall<ProductResponse, ServerError>({
      callbackFn: async () => {
        return await addProduct(formData);
      },
      successCallback: (response) => {
        toast.success("Thêm sản phẩm thành công");
        navigate("/vendor/shop/products");
      },
      errorFromServerCallback: (error) => {
        if (error.status === "BAD_REQUEST") {
          toast.error(`Thêm sản phẩm thất bại: ${error.message}`);
        } else {
          toast.error(
            `Thêm sản phẩm thất bại: ${error.message || "Đã xảy ra lỗi"}`
          );
        }
      },
      errorSerializedCallback: (error) => {
        toast.error(
          `Thêm sản phẩm thất bại: ${error.message || "Đã xảy ra lỗi không xác định"}`
        );
      },
      errorCallback: (error) => {
        toast.error(
          `Thêm sản phẩm thất bại: ${error || "Đã xảy ra lỗi không xác định"}`
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
            <ProductBasicInfo />
            <ProductSalesInfo />
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
                  <button type="submit">Lưu</button>
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

// import { ProductBasicInfo } from "./MainContent/BasicInfo/ProductBasicInfo";
// import { ProductSalesInfo } from "./MainContent/ProductSalesInfo/ProductSalesInfo";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// export const AddProduct = () => {
//   const navigate = useNavigate();

//   return (
//     //   bg-[#FAFAF9]
//     <div id="product-edit" className="w-full border-2  bg-[#E4E4E7]">
//       <div id="product-edit-container" className="">
//         <div id="product-edit-main" className="flex flex-col w-full">
//           <ProductBasicInfo />
//           <ProductSalesInfo />
//           {/*rest ......*/}
//           {/* save */}
//           <div
//             id="product-selected-fix shopee-fix-bottom-card"
//             className="w-full h-[56px] mt-[16px] bg-[#FAFAF9]"
//           >
//             <div id="container" className="flex w-full">
//               <div id="container-left" className="w-0 h-0"></div>
//               <div
//                 id="container-right btn-group"
//                 className="flex justify-end p-4 w-full gap-10"
//               >
//                 <button onClick={() => navigate("/vendor/shop/products")}>
//                   Hủy
//                 </button>
//                 <button type="submit" onClick={() => null}>
//                   Lưu
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };
