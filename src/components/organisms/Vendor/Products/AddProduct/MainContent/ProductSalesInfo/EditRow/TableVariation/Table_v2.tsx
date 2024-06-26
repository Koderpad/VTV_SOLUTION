import { useState, useEffect } from "react";
import { HandleImageMain } from "../ClassifyContent/HandleImageMain";
import { useSelector } from "react-redux";
import { addAttribute } from "../../../../../../../redux/reducer/addProductSlice";
import { RootState } from "../../../../../../../../../app/store";
interface Row {
  variant1_: string;
  variant2_: string[];
  price: string;
  stock: string;
  sku: string;
  hasImage: boolean;
}

interface DataItem {
  [key: string]: string[];
}

interface TableProps {
  data: DataItem[];
}

interface VariantDataItem {
  variant1: string;
  variant2?: string;
  price: string;
  stock: string;
  sku: string;
  hasImage: boolean;
}

interface VariantTableData {
  data: VariantDataItem[];
}

export const Table_v2 = ({ data }: TableProps) => {
  const [variantTableData, setVariantTableData] = useState<VariantTableData>({
    data: [],
  });

  const attributeData = useSelector(
    (state: RootState) => state.productInAddProduct.attributeData
  );

  //update variantTableData when data:TableProps change
  useEffect(() => {
    console.log("attributeData in tableV2", attributeData);
    if (!data) return;
    if (variantTableData.data.length > 0) {
      const oldData = variantTableData.data;

      //get variant1 from oldData
      const variant1 = oldData.map((item) => item.variant1);

      //get index 0  of data and get value of index 0
      const variant1_ = Object.values(data[0])[0];

      //check if variant1_ is not equal variant1
      if (variant1_.join("") !== variant1.join("")) {
        //delete data in variant1 from oldData, and add new data of variant1_ to oldData
        //
        const newData = variant1_.map((item) => {
          const index = variant1.findIndex((i) => i === item);
          if (index === -1) {
            return {
              variant1: item,
              price: "0",
              stock: "",
              sku: "",
              hasImage: true,
            };
          }
          return oldData[index];
        });
        console.log("newData after change data: ", newData);
        setVariantTableData({ data: newData });
      }
    }
  }, [data]); // Re-run this effect whenever `data` changes

  //!has problem
  const transformData = (data_: DataItem[]): Row[] => {
    let result: Row[] = [];

    data_.forEach((item, index) => {
      const keys = Object.keys(item);
      const values = Object.values(item);

      if (index === 0) {
        result = values[0].map((variant1) => ({
          variant1_: variant1,
          variant2_: [],
          price: "Nhập vào",
          stock: "",
          sku: "",
          hasImage: true,
        }));
      } else {
        result.forEach((row, i) => {
          row.variant2_ = values[0];
        });
      }
    });

    return result;
  };

  const rows = transformData(data);

  const handleInputChange = (
    rowIndex: number,
    sizeIndex: number = -1,
    key: string,
    value: string
  ) => {
    if (sizeIndex === -1) {
      const newVariantTableData = variantTableData.data;
      const variantDataItemIndex = rowIndex;

      if (!newVariantTableData[variantDataItemIndex]) {
        newVariantTableData[variantDataItemIndex] = {
          variant1: rows[rowIndex].variant1_,
          price: "0",
          stock: "",
          sku: "",
          hasImage: rows[rowIndex].hasImage,
        };
      }

      if (key in newVariantTableData[variantDataItemIndex]) {
        newVariantTableData[variantDataItemIndex][
          key as keyof VariantDataItem
        ] = value as never;
      }

      setVariantTableData({ data: newVariantTableData });
    } else {
      const newVariantTableData = { ...variantTableData };
      const variantDataItemIndex =
        rowIndex * rows[0].variant2_.length + sizeIndex;

      if (!newVariantTableData.data[variantDataItemIndex]) {
        newVariantTableData.data[variantDataItemIndex] = {
          variant1: rows[rowIndex].variant1_[0],
          variant2: rows[rowIndex].variant2_[sizeIndex],
          price: "Nhập vào",
          stock: "",
          sku: "",
          hasImage: rows[rowIndex].hasImage,
        };
      }

      if (key in newVariantTableData.data[variantDataItemIndex]) {
        newVariantTableData.data[variantDataItemIndex][
          key as keyof VariantDataItem
        ] = value as never;
      }
      setVariantTableData(newVariantTableData);
    }
  };

  const renderColorCell = (row: Row, sizeIndex: number) => {
    if (sizeIndex === 0) {
      return (
        <td
          rowSpan={row.variant2_.length}
          className="border-2 border-gray-400 px-4 py-2"
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <div className="flex flex-col justify-center items-center ">
            {row.variant1_}

            {row.hasImage && <HandleImageMain />}
          </div>
        </td>
      );
    }
    return null;
  };

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
          ? rows.map((row, index) =>
              row.variant2_.map((size, sizeIndex) => (
                <tr key={`${index}-${sizeIndex}`}>
                  {renderColorCell(row, sizeIndex)}
                  <td className="border-2 border-gray-400 px-4 py-2">{size}</td>
                  <td className="border-2 border-gray-400 px-4 py-2">
                    <input
                      type="text"
                      defaultValue={row.price}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          sizeIndex,
                          "price",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-2">
                    <input
                      type="text"
                      defaultValue={row.stock}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          sizeIndex,
                          "stock",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td className="border-2 border-gray-400 px-4 py-2">
                    <input
                      type="text"
                      defaultValue={row.sku}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          sizeIndex,
                          "sku",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))
            )
          : rows.map((row, index) => (
              <tr key={`${index}`}>
                <td
                  rowSpan={1}
                  className="border-2 border-gray-400 px-4 py-2"
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <div className="flex flex-col justify-center items-center ">
                    {row.variant1_}

                    {row.hasImage && <HandleImageMain />}
                  </div>
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.price}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        undefined,
                        "price",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.stock}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        undefined,
                        "stock",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td className="border-2 border-gray-400 px-4 py-2">
                  <input
                    type="text"
                    defaultValue={row.sku}
                    onChange={(e) =>
                      handleInputChange(index, undefined, "sku", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};
