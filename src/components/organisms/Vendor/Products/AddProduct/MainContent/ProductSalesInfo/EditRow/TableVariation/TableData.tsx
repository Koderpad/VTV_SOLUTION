import { useState, useEffect, useRef } from "react";
import { HandleImageMain } from "../ClassifyContent/HandleImageMain";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../../app/store";
import { updateVariantTableData } from "../../../../../../../redux/reducer/addProductSlice";
import { useDispatch } from "react-redux";

interface DataItem {
  [key: string]: string[];
}

interface TableProps {
  data: DataItem[];
}

interface VariantTableData {
  data: VariantDataItem[];
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

export const TableData = ({ data }: TableProps) => {
  const [variantTableData, setVariantTableData] = useState<VariantTableData>({
    data: [],
  });

  const dispatch = useDispatch();

  const attributeData = useSelector(
    (state: RootState) => state.productInAddProduct.attributeData
  );

  useEffect(() => {
    if (!data) return;
    //if varianTableData is empty
    if (data[0]) {
      //get variant1 from data
      const variant1 = Object.values(data[0])[0];
      //get variant2 from data
      const variant2 = data[1] ? Object.values(data[1])[0] : undefined;

      //create variantTableData from variant1 and variant2
      const newVariantTableData = variant1.map((variant1Item) => {
        if (variant2) {
          return variant2.map((variant2Item) => {
            const existingData = variantTableData.data.find(
              (existingItem) =>
                existingItem.attributeValue1 === variant1Item &&
                existingItem.attributeValue2 === variant2Item
            );

            return existingData
              ? existingData
              : {
                  attributeName1: Object.keys(data[0])[0],
                  attributeName2: Object.keys(data[1])[0],
                  attributeLength1: variant1.length,
                  attributeLength2: variant2.length,
                  attributeValue1: variant1Item,
                  attributeValue2: variant2Item,
                  hasImage: true,
                  sku: "",
                  image: "",
                  price: "",
                  stock: "",
                };
          });
        } else {
          const existingData = variantTableData.data.find(
            (existingItem) => existingItem.attributeValue1 === variant1Item
          );

          return existingData
            ? existingData
            : {
                attributeName1: Object.keys(data[0])[0],
                attributeLength1: variant1.length,
                attributeValue1: variant1Item,
                hasImage: true,
                sku: "",
                image: "",
                price: "",
                stock: "",
              };
        }
      });

      console.log("New VariantTable Data before save: ", newVariantTableData);
      attributeData;
      //update variantTableData
      dispatch(updateVariantTableData({ data: newVariantTableData.flat() }));
      setVariantTableData({ data: newVariantTableData.flat() });
    }
  }, [data]);

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    // Create a copy of variantTableData.data
    const newData = [...variantTableData.data];

    // Get the item to update
    const variantDataItem = { ...newData[rowIndex] };

    // Update the value of key
    variantDataItem[key as keyof VariantDataItem] = value;

    // Update newData with the updated item
    newData[rowIndex] = variantDataItem;

    // Dispatch the updateVariantTableData action with the updated data
    dispatch(updateVariantTableData({ data: newData }));
    setVariantTableData({ data: newData });
  };

  const renderColorCell = (
    row: VariantDataItem,
    sizeIndex: number,
    index: number
  ) => {
    if (sizeIndex === 0) {
      return (
        <td
          rowSpan={attributeData[Object.keys(data[1])[0]].length}
          className="border-2 border-gray-400 px-4 py-2"
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <div className="flex flex-col justify-center items-center ">
            {row.attributeValue1}

            {row.hasImage && (
              <HandleImageMain
                handleData={(imageData: string) =>
                  handleInputChange(index + sizeIndex, "image", imageData)
                }
              />
            )}
          </div>
        </td>
      );
    }
    return null;
  };

  const handleImageMain = (imageData: string) => {
    console.log("imageData: ", imageData);
  };

  const renderedIndex = useRef(-1);

  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-2 border-2 border-gray-400">
            {data[0] && Object.keys(data[0])[0]
              ? Object.keys(data[0])[0]
              : "Nhóm phân loại 1"}
          </th>
          {data[1] ? (
            <th className="px-4 py-2 border-2 border-gray-400">
              {Object.keys(data[1])[0] === ""
                ? "Nhóm phân loại 2"
                : Object.keys(data[1])[0]}
            </th>
          ) : (
            ""
          )}
          <th className="px-4 py-2 border-2 border-gray-400">Giá</th>
          <th className="px-4 py-2 border-2 border-gray-400">Kho hàng</th>
          <th className="px-4 py-2 border-2 border-gray-400">SKU phân loại</th>
        </tr>
      </thead>
      <tbody>
        {data[1]
          ? variantTableData.data.map((row, index) => {
              const data1Length = Object.values(data[1])[0].length;

              const shouldRenderRow =
                index === 0 || index === renderedIndex.current + data1Length;

              if (shouldRenderRow) {
                renderedIndex.current = index; // Lưu lại index được render thành công
                return Object.values(data[1])[0].map((size, sizeIndex) => (
                  <tr key={`${index}-${sizeIndex}`}>
                    {renderColorCell(row, sizeIndex, index)}
                    <td className="border-2 border-gray-400 px-4 py-2">
                      {size}
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-2">
                      <input
                        type="text"
                        defaultValue={
                          variantTableData.data[index + sizeIndex] === undefined
                            ? "0"
                            : variantTableData.data[index + sizeIndex].price
                        }
                        onChange={(e) =>
                          handleInputChange(
                            index + sizeIndex,
                            "price",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-2">
                      <input
                        type="text"
                        defaultValue={
                          variantTableData.data[index + sizeIndex] === undefined
                            ? "0"
                            : variantTableData.data[index + sizeIndex].stock
                        }
                        onChange={(e) =>
                          handleInputChange(
                            index + sizeIndex,
                            "stock",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="border-2 border-gray-400 px-4 py-2">
                      <input
                        type="text"
                        defaultValue={
                          variantTableData.data[index + sizeIndex] === undefined
                            ? "0"
                            : variantTableData.data[index + sizeIndex].sku
                        }
                        onChange={(e) =>
                          handleInputChange(
                            index + sizeIndex,
                            "sku",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ));
              } else {
                return null;
              }
            })
          : variantTableData.data.map((row, index) => (
              <tr key={`${index}`}>
                <td
                  rowSpan={1}
                  className="border-2 border-gray-400 px-4 py-2"
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <div className="flex flex-col justify-center items-center ">
                    {row.attributeValue1}

                    {row.hasImage && (
                      <HandleImageMain
                        handleData={(imageData: string) =>
                          handleInputChange(index, "image", imageData)
                        }
                      />
                    )}
                  </div>
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.price}
                    onChange={(e) =>
                      handleInputChange(index, "price", e.target.value)
                    }
                  />
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.stock}
                    onChange={(e) =>
                      handleInputChange(index, "stock", e.target.value)
                    }
                  />
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.sku}
                    onChange={(e) =>
                      handleInputChange(index, "sku", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};
