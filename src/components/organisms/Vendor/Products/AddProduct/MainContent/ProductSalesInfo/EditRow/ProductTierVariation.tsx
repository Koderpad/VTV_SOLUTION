import { useState } from "react";
import { PriceInputOfVariation } from "./InputContentVariation/PriceInputOfVariation";
import { SkuInputOfVariation } from "./InputContentVariation/SkuInputOfVariation";
import { StockInputOfVariation } from "./InputContentVariation/StockInputOfVariation";
import { VariationEditItem } from "./VariationEditItem/VariationEditItem";
import { useDispatch } from "react-redux";
// import { addAttribute } from "../../../../../../redux/reducer/addProductSlice";
import { TableData } from "./TableVariation/TableData";

type OnDataChangeType = (
  data: { [key: string]: string[] },
  index: number
) => void;

export const ProductTierVariation = () => {
  const [data, setData] = useState<{ [key: string]: string[] }[]>([]);
  const [showSecondItem, setShowSecondItem] = useState(false);

  const dispatch = useDispatch();

  const handleDataChange: OnDataChangeType = (newData, index) => {
    dispatch(addAttribute({ index: index, data: newData }));
    setData((prevData) => {
      const newDataArray = [...prevData];
      newDataArray[index] = newData;
      return newDataArray;
    });
  };

  const handleAddSecondItem = () => {
    setShowSecondItem(true);
  };

  return (
    <div id="product-tier-variation">
      <div id="variation-container">
        <div id="edit-row" className="flex mb-[24px]">
          <div className="w-[130px]">
            <div
              id="edit-row-left edit-label"
              className="flex w-[180px] h-[40px] justify-start items-center pl-5"
            >
              <span>Phân loại hàng</span>
            </div>
          </div>
          <div id="edit-row-right-full" className="w-full bg-gray-100">
            <VariationEditItem
              onDataChange={(newData) => handleDataChange(newData, 0)}
            />
            {showSecondItem && (
              <VariationEditItem
                onDataChange={(newData) => handleDataChange(newData, 1)}
              />
            )}
            {!showSecondItem && (
              <button onClick={handleAddSecondItem}>
                Thêm nhóm phân loại 2
              </button>
            )}
          </div>
        </div>
      </div>
      <div id="edit-row batch-edit-row" className="flex mb-[16px]">
        <div
          id="edit-label edit-row-left"
          className="flex w-[144px] h-[40px] justify-start items-center pl-4"
        >
          Danh sách phân loại hàng
        </div>
        <div id="edit-row-right-full batch-container" className="flex w-full">
          <form
            action=""
            id="shopee-form batch-form shopee-form--label-right"
            className="flex"
          >
            <div id="batch-inner-item batch-price shopee-form-item">
              <label htmlFor="price" id="shopee-form-item__label empty"></label>
              <div id="shopee-form-item__content">
                <div id="shopee-input price-input">
                  <div id="shopee-input__inner shopee-input__inner--normal">
                    <PriceInputOfVariation />
                  </div>
                </div>
              </div>
            </div>
            <div id="batch-inner-item shopee-form-item">
              <label htmlFor="stock" id="shopee-form-item__label empty"></label>
              <div id="shopee-form-item__control">
                <div id="shopee-form-item__content">
                  <div id="shopee-input">
                    <div id="shopee-input__inner shopee-input__inner--normal">
                      <StockInputOfVariation />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="batch-inner-item batch-sku shopee-form-item">
              <label htmlFor="sku" id="shopee-form-item__label empty"></label>
              <div id="shopee-form-item__control">
                <div id="shopee-form-item__content">
                  <div id="shopee-input">
                    <div id="shopee-input__inner shopee-input__inner--normal">
                      <SkuInputOfVariation />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <button className="flex justify-center bg-orange-500 items-center ml-[16px] px-[16px] border-2">
            <span
              style={{
                color: "#fff",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: "10px",
              }}
            >
              {" "}
              Áp dụng cho tất cả phân loại
            </span>
          </button>
        </div>
      </div>
      <div id="edit-row" className="flex">
        <div
          id="edit-label edit-row-left"
          className="w-[115px] h-[80px] mr-[16px]"
        ></div>
        <div id="edit-row-right-full" className="w-full">
          <TableData data={data} />
        </div>
      </div>
    </div>
  );
};
