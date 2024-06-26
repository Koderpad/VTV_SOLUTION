import { EditRowLeftLabel } from "./EditRowLeftLabel";
import { PriceInput } from "./InputContent/PriceInput";
import { StockInput } from "./InputContent/StockInput";

export const NoVariations = () => {
  return (
    <div id="no-variations">
      <div id="variation-container">
        <div id="edit-row" className="flex mb-[24px]">
          <EditRowLeftLabel label="Phân loại hàng" />
          <div id="none" className="h-[40px] w-auto relative">
            <div
              id="popover-wrap"
              className="flex justify-center items-center h-full w-full"
            >
              <button
                type="button"
                className="flex justify-center items-center h-[40px] px-[16px] border border-[#30f4e7] rounded-[4px]"
              >
                <i id="shopee-icon" className="w-[16px] h-[16px] mb-[8px]">
                  +
                </i>
                <span className="ml-[8px]">Thêm nhóm phân loại </span>
              </button>
            </div>
          </div>
        </div>

        <div id="edit-row price" className="flex mb-[24px]">
          <EditRowLeftLabel label="Giá bán" />
          <div id="degrade-wrap edit-row-right-medium" className="w-[300px]">
            <div id="basic-price" className="w-full">
              <div
                id="product-edit-form-item-content"
                className="flex flex-col w-full"
              >
                <div id="popover-wrap" className="w-full">
                  <PriceInput />
                </div>
                <div
                  id="product-edit-form-item-error"
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  Không được để trống ô
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="edit-row stock" className="flex mb-[24px]">
          <EditRowLeftLabel label="Giá bán" />
          <div id="degrade-wrap edit-row-right-medium" className="w-[300px]">
            <div id="basic-stock" className="w-full">
              <div
                id="product-edit-form-item-content"
                className="flex flex-col w-full"
              >
                <div id="popover-wrap" className="w-full">
                  <StockInput />
                </div>
                <div
                  id="product-edit-form-item-error"
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  Không được để trống ô
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
