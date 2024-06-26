import SuffixInput from "../InputContentVariation/SuffixInput";
import { OptionsItemDragItem } from "./OptionsItemDragItem";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../../../app/store";

interface Item {
  id: string;
  value: string;
}

type OnDataChangeType = (data: { [key: string]: string[] }) => void;

interface Errors {
  [key: string]: string;
}

export const VariationEditItem = ({
  onDataChange,
}: {
  onDataChange: OnDataChangeType;
}) => {
  const [items, setItems] = useState<Item[]>([{ id: uuidv4(), value: "" }]);
  const [errors, setErrors] = useState<Errors>({});
  const [suffixInputValue, setSuffixInputValue] = useState("");

  const handleInputChange = (id: string, value: string) => {
    let newItems = [...items];
    const isNewItem = id === newItems[newItems.length - 1].id;

    // console.log("newItems", newItems);

    newItems = newItems.map((item) =>
      item.id === id ? { ...item, value } : item
    );

    const newErrors: { [key: string]: string } = {};
    newItems.forEach((item, index) => {
      if (item.value !== "") {
        const duplicateItems = newItems.filter(
          (i, idx) => i.value === item.value && idx !== index
        );
        if (duplicateItems.length > 0) {
          newErrors[item.id] = "Items must be unique";
        }
      }
    });

    setErrors(newErrors);
    setItems(newItems);

    // if (isNewItem && value !== "") {
    //   setItems([...newItems, { id: uuidv4(), value: "" }]);
    // }
    if (isNewItem && value !== "") {
      newItems = [...newItems, { id: uuidv4(), value: "" }];
    }

    console.log("newItems", newItems);

    setItems(() => newItems);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSuffixInputChange = (value: string) => {
    setSuffixInputValue(value);
  };

  useEffect(() => {
    const itemsValues = items
      .filter(
        (item, index) =>
          index === 0 ||
          item.value !== "" ||
          (item.value === "" && index !== items.length - 1)
      )
      .map((item) => item.value);
    // console.log("data of attribute from store: ", attributeData);
    if (itemsValues.length !== 0 && itemsValues !== null) {
      // dispatch(addAttribute({ [suffixInputValue]: itemsValues }));
    }
    onDataChange({ [suffixInputValue]: itemsValues });
  }, [suffixInputValue, items]);

  return (
    <div id="variation-edit-item" className="relative p-[16px] w-full">
      <span
        id="options-close-btn"
        className="absolute top-[24px] right-[16px] cursor-pointer"
      >
        <i id="shopee-icon">X</i>
      </span>
      <div id="variation-edit-panel" className="flex">
        <div
          id="variation-edit-left"
          className="flex mr-[16px] w-[120px] flex-wrap"
        >
          Nhóm phân loại 1
        </div>
        <div id="variation-edit-right" className="flex w-full">
          <div id="popover-wrap variation-input-item">
            <div id="custom-len-calc-input product-edit-form-item">
              <div id="product-edit-form-item-content">
                <div
                  id="shopee-input__inner shopee-input__inner--normal"
                  className="flex w-full"
                >
                  {/* <SuffixInput /> */}
                  <SuffixInput onInputChange={handleSuffixInputChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="variation-edit-panel variation-option-panel"
        className="flex w-full"
      >
        <div id="variation-edit-left" className="flex mr-[16px] w-[120px]">
          Phân loại hàng
        </div>
        <div id="variation-edit-right" className="flex w-full">
          <div id="option-container" className="flex flex-wrap gap-10 w-full">
            {items.map((item) =>
              items.length > 1 ? (
                <OptionsItemDragItem
                  key={item.id}
                  onInputChange={(newValue) =>
                    handleInputChange(item.id, newValue)
                  }
                  onRemove={() => handleRemove(item.id)}
                  error={errors[item.id]}
                />
              ) : (
                <OptionsItemDragItem
                  key={item.id}
                  onInputChange={(newValue) =>
                    handleInputChange(item.id, newValue)
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
