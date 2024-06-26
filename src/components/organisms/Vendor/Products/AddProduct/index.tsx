import { ProductBasicInfo } from "./MainContent/BasicInfo/ProductBasicInfo";
import { ProductSalesInfo } from "./MainContent/ProductSalesInfo/ProductSalesInfo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const AddProduct = () => {
  const navigate = useNavigate();

  return (
    //   bg-[#FAFAF9]
    <div id="product-edit" className="w-full border-2  bg-[#E4E4E7]">
      <div id="product-edit-container" className="">
        <div id="product-edit-main" className="flex flex-col w-full">
          <ProductBasicInfo />
          <ProductSalesInfo />
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
