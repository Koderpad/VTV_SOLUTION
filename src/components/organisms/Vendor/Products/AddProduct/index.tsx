import { ProductBasicInfo } from "./MainContent/BasicInfo/ProductBasicInfo";
import { ProductSalesInfo } from "./MainContent/ProductSalesInfo/ProductSalesInfo";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../../../../app/store";
// import { useAddAttributeMutation } from "../../../redux/api/attributeVendor";
// import { updateProduct } from "../../../redux/reducer/addProductSlice";
// import { useAddProductMutation } from "../../../redux/api/addProductApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { AddProductResponse } from "./AddProductResponsesBody";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

interface ProductVariantRequest {
  productVariantId?: number;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  attributeIds: number[];
}

interface AddProductRequest {
  name: string;
  image: string;
  description: string;
  information: string;
  categoryId: number;
  brandId?: number;
  username: string;
  productVariantRequests: ProductVariantRequest[];
}

interface AttributeValuesItem {
  id?: number;
  value: string;
}

interface VariantDataItem {
  attributeName1?: string;
  attributeName2?: string;

  attributeLength1?: number;
  attributeLength2?: number;

  attributeValue1: string;
  attributeValue2?: string;

  hasImage: boolean;
  sku: string;
  image?: string;
  price: string;
  stock: string;
}

interface VariantTableData {
  data: VariantDataItem[];
}

export const AddProduct = () => {
  // const dispatch = useDispatch();
  // const [addAttribute] = useAddAttributeMutation();
  // const [addProduct] = useAddProductMutation();

  const navigate = useNavigate();

  // const productFinal: AddProductRequest = useSelector(
  //   (state: RootState) => state.productInAddProduct.product
  // );

  // const variantData: VariantTableData = useSelector(
  //   (state: RootState) => state.productInAddProduct.variantTableData
  // );

  // const attributeDataNeedToSave: { [key: string]: AttributeValuesItem[] } =
  //   useSelector((state: RootState) => state.productInAddProduct.attributeData);

  // const pairVariantDataWithAttributes = (
  //   variantData: VariantDataItem[],
  //   updatedAttributeData: { [key: string]: AttributeValuesItem[] }
  // ): ProductVariantRequest[] => {
  //   const pairedData: ProductVariantRequest[] = [];

  //   for (const item of variantData) {
  //     const pairedItem: ProductVariantRequest = {
  //       sku: item.sku,
  //       image: item.image || "",
  //       price: parseInt(item.price),
  //       quantity: parseInt(item.stock),
  //       attributeIds: [],
  //     };

  //     // Kiểm tra và bắt cặp giá trị trong VariantDataItem với updatedAttributeData
  //     for (const attributeName in updatedAttributeData) {
  //       console.log("attributeName: ", attributeName);

  //       const attributeValues = updatedAttributeData[attributeName];
  //       console.log("attributeValues: ", attributeValues);

  //       console.log("item.attributeValue1: ", item.attributeValue1);

  //       // Tìm giá trị trong updatedAttributeData tương ứng với giá trị trong VariantDataItem
  //       const matchedValue = attributeValues.find(
  //         (value) => value.value === item.attributeValue1
  //       );
  //       console.log("matchedValue: ", matchedValue);

  //       // Nếu có giá trị tương ứng, thêm id vào attributeIds của pairedItem
  //       if (matchedValue && matchedValue.id !== undefined) {
  //         pairedItem.attributeIds.push(matchedValue.id);
  //       }
  //       //if item have attributevalue2
  //       if (item.attributeValue2 !== undefined) {
  //         const matchedValue2 = attributeValues.find(
  //           (value) => value.value === item.attributeValue2
  //         );

  //         if (matchedValue2 && matchedValue2.id !== undefined) {
  //           pairedItem.attributeIds.push(matchedValue2.id);
  //         }
  //       }
  //     }

  //     pairedData.push(pairedItem);
  //   }

  //   return pairedData;
  // };

  // const handleSaveProduct = async () => {
  //   // Add attributes and update attributeData
  //   const updatedAttributeData: { [key: string]: AttributeValuesItem[] } = {};

  //   for (const attributeName in attributeDataNeedToSave) {
  //     const attributeValues = attributeDataNeedToSave[attributeName];
  //     const newAttributeValues: AttributeValuesItem[] = [];

  //     for (const attributeValue of attributeValues) {
  //       const response = await addAttribute({
  //         /* provide necessary data for addAttribute mutation */
  //         name: attributeName,
  //         value: attributeValue.value,
  //       });

  //       // Assuming response.data contains the added attribute with an id
  //       const addedAttribute = response.data?.attributeDTO;

  //       if (addedAttribute && addedAttribute.attributeId !== undefined) {
  //         newAttributeValues.push({
  //           id: addedAttribute.attributeId,
  //           value: addedAttribute.value,
  //         });
  //       }
  //     }

  //     updatedAttributeData[attributeName] = newAttributeValues;
  //   }

  //   console.log("updatedAttributeData: ", updatedAttributeData);
  //   // Trong hàm handleSaveProduct, sau khi cập nhật updatedAttributeData
  //   const updatedVariantData: ProductVariantRequest[] =
  //     pairVariantDataWithAttributes(variantData.data, updatedAttributeData);

  //   console.log("updatedVariantData: ", updatedVariantData);

  //   //bỏ updatedVariantData vào trong product
  //   const field: string = "productVariantRequests";
  //   await dispatch(updateProduct({ field, value: updatedVariantData }));

  //   try {
  //     const response:
  //       | {
  //           data: AddProductResponse;
  //         }
  //       | {
  //           error: FetchBaseQueryError | SerializedError;
  //         } = await addProduct(productFinal);

  //     if ("data" in response && response.data.status === "success") {
  //       toast.success(response.data.message, {
  //         onClose: () => {
  //           navigate("/vendor/shop/products");
  //         },
  //         autoClose: 1000,
  //       });
  //       return;
  //     } else {
  //       console.log("response.error: ", response);
  //       // If the server responds with a message, display it
  //       if ("data" in response.error && response.error.data.message) {
  //         toast.error(response.error.data.message);
  //       } else {
  //         toast.error("Failed to update product");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("Thêm sản phẩm thất bại");
  //   }
  // };

  return (
    //   bg-[#FAFAF9]
    <div id="product-edit" className="w-[75%]  bg-[#E4E4E7]">
      <div id="product-edit-container" className="">
        <div id="product-edit-main" className="flex flex-col w-full">
          <ProductBasicInfo />
          {/* <ProductSalesInfo /> */}
          {/*rest ......*/}
          {/* save */}
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
                <button onClick={() => navigate("/vendor/shop/products")}>
                  Hủy
                </button>
                <button type="submit" onClick={() => null}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};
