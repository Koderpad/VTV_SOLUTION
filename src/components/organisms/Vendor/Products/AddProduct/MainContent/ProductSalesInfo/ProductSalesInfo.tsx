import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageEditor } from "./EditRow/ClassifyContent/ImageEditor";
import { ImageModal } from "./EditRow/ClassifyContent/ImageModal";
import { ImageUpload } from "./EditRow/ClassifyContent/ImageUpload";
import { ImageUploadPreview } from "./EditRow/ClassifyContent/ImageUploadPreview";
import { useFormContext } from "react-hook-form";
import {
  ProductRequest,
  ProductVariantRequest,
} from "@/utils/DTOs/vendor/product/Request/ProductRequest";

interface AttributeGroup {
  name: string;
  values: string[];
  prev_name: string;
  prev_values: string[];
}

interface CellData {
  value: string | number | File;
  type: "attribute" | "originalPrice" | "price" | "quantity" | "sku" | "image";
}

type MatrixData = CellData[][];

export const ProductSalesInfo = () => {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<ProductRequest>();
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [matrixData, setMatrixData] = useState<MatrixData>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  const shouldUpdateMatrix = useRef(false);

  const updateCell = (
    rowIndex: number,
    colIndex: number,
    newValue: CellData["value"]
  ) => {
    setMatrixData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = {
        ...newData[rowIndex][colIndex],
        value: newValue,
      };
      return newData;
    });

    // Update the form state
    const cellType = matrixData[rowIndex][colIndex].type;
    if (cellType !== "attribute") {
      setValue(`productVariantRequests.${rowIndex}.${cellType}`, newValue);
    }
  };

  useEffect(() => {
    if (!shouldUpdateMatrix.current) {
      return;
    }

    if (attributeGroups.length === 0) {
      setMatrixData([]);
      setValue("productVariantRequests", []);
      shouldUpdateMatrix.current = false;
      return;
    }

    setMatrixData((prevMatrix) => {
      const newMatrix: MatrixData = [];
      const attributeCount = attributeGroups.length;

      // Create a map of existing attribute values
      const existingValuesMap = new Map<string, Set<string>>();
      attributeGroups.forEach((group, index) => {
        existingValuesMap.set(index.toString(), new Set(group.values));
      });

      // Function to check if a row is valid
      const isRowValid = (row: CellData[]) => {
        return attributeGroups.every((group, index) => {
          const value = row[index].value as string;
          return existingValuesMap.get(index.toString())?.has(value);
        });
      };

      // Filter and update existing rows
      prevMatrix.forEach((row) => {
        const updatedRow = row.map((cell, cellIndex) => {
          if (cell.type === "attribute") {
            const group = attributeGroups[cellIndex];
            if (group) {
              // Check if the cell value matches a previous value
              const prevValueIndex = group.prev_values.indexOf(
                cell.value as string
              );
              if (prevValueIndex !== -1) {
                // Update to the new value if it exists
                return {
                  ...cell,
                  value: group.values[prevValueIndex] || cell.value,
                };
              }
            }
          }
          return cell;
        });

        if (isRowValid(updatedRow)) {
          // Trim or add attribute columns if needed
          const finalRow = updatedRow
            .slice(0, attributeCount)
            .concat(updatedRow.slice(attributeCount));
          newMatrix.push(finalRow);
        }
      });

      // Generate new combinations if needed
      const generateCombinations = (
        current: string[] = [],
        index: number = 0
      ) => {
        if (index === attributeGroups.length) {
          const existingRow = newMatrix.find((row) =>
            current.every((value, i) => row[i].value === value)
          );
          if (!existingRow) {
            newMatrix.push([
              ...current.map((value) => ({
                value,
                type: "attribute" as const,
              })),
              { value: 0, type: "originalPrice" as const },
              { value: 0, type: "price" as const },
              { value: 0, type: "quantity" as const },
              { value: `SKU-${uuidv4().slice(0, 8)}`, type: "sku" as const },
              { value: "", type: "image" as const },
            ]);
          }
          return;
        }
        attributeGroups[index].values.forEach((value) =>
          generateCombinations([...current, value], index + 1)
        );
      };

      generateCombinations();

      // Update the form state with the new matrix data
      const newProductVariantRequests: ProductVariantRequest[] = newMatrix.map(
        (row) => {
          const attributeCells = row.filter(
            (cell) => cell.type === "attribute"
          );
          return {
            productVariantId: 0,
            sku:
              (row.find((cell) => cell.type === "sku")?.value as string) || "",
            image:
              (row.find((cell) => cell.type === "image")?.value as string) ||
              "",
            changeImage: false,
            originalPrice:
              Number(
                row.find((cell) => cell.type === "originalPrice")?.value
              ) || 0,
            price:
              Number(row.find((cell) => cell.type === "price")?.value) || 0,
            quantity:
              Number(row.find((cell) => cell.type === "quantity")?.value) || 0,
            productAttributeRequests: attributeCells.map((cell, index) => ({
              name: attributeGroups[index]?.name || `Attribute ${index + 1}`,
              value: cell.value as string,
            })),
          };
        }
      );

      console.log("productVariantRequests: ", newProductVariantRequests);

      setValue("productVariantRequests", newProductVariantRequests);

      return newMatrix;
    });

    // Update prev_name and prev_values after processing
    setAttributeGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        prev_name: group.name,
        prev_values: [...group.values],
      }))
    );

    shouldUpdateMatrix.current = false;
  }, [attributeGroups, setValue]);

  const handleAddAttributeGroup = () => {
    if (attributeGroups.length < 2) {
      setAttributeGroups([
        ...attributeGroups,
        { name: "", values: [], prev_name: "", prev_values: [] },
      ]);
      shouldUpdateMatrix.current = true;
    }
  };

  const handleAttributeGroupChange = (index: number, name: string) => {
    setAttributeGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[index] = { ...newGroups[index], name };
      return newGroups;
    });
    shouldUpdateMatrix.current = true;
    setValue(`attributeGroups.${index}.name`, name);
    trigger(`attributeGroups.${index}.name`);
  };

  const handleAttributeValueChange = (groupIndex: number, values: string[]) => {
    setAttributeGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex] = { ...newGroups[groupIndex], values };
      return newGroups;
    });
    shouldUpdateMatrix.current = true;
    setValue(`attributeGroups.${groupIndex}.values`, values);
    trigger(`attributeGroups.${groupIndex}.values`);
  };

  // ... (keep other existing functions)

  const handleDeleteAttributeGroup = (index: number) => {
    setAttributeGroups((prevGroups) =>
      prevGroups.filter((_, i) => i !== index)
    );

    setMatrixData((prevMatrix) => {
      // First, remove the attribute column from each row
      const updatedMatrix = prevMatrix.map((row) => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      });

      // Then, filter out any rows that are no longer unique after removing the attribute
      const uniqueRows = new Set();
      return updatedMatrix.filter((row) => {
        const attributeValues = row
          .filter((cell) => cell.type === "attribute")
          .map((cell) => cell.value)
          .join("|");
        if (uniqueRows.has(attributeValues)) {
          return false;
        }
        uniqueRows.add(attributeValues);
        return true;
      });
    });

    // Update the form state
    setValue("productVariantRequests", (prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        const newAttributes = [...variant.productAttributeRequests];
        newAttributes.splice(index, 1);
        return {
          ...variant,
          productAttributeRequests: newAttributes,
        };
      });

      // Filter out duplicate variants
      const uniqueVariants = new Set();
      return updatedVariants.filter((variant) => {
        const attributeValues = variant.productAttributeRequests
          .map((attr) => attr.value)
          .join("|");
        if (uniqueVariants.has(attributeValues)) {
          return false;
        }
        uniqueVariants.add(attributeValues);
        return true;
      });
    });

    shouldUpdateMatrix.current = true;
  };

  const handleDeleteAttributeValue = (
    groupIndex: number,
    valueIndex: number
  ) => {
    setAttributeGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        values: newGroups[groupIndex].values.filter((_, i) => i !== valueIndex),
      };
      return newGroups;
    });

    setMatrixData((prevData) =>
      prevData.filter(
        (row) =>
          row[groupIndex].value !==
          attributeGroups[groupIndex].values[valueIndex]
      )
    );
  };

  const handleOpenModal = (index: number) => {
    setOpenModalIndex(index);
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
  };

  const handleImageChange = (rowIndex: number, imageData: string | File) => {
    const imageColumnIndex = matrixData[0].findIndex(
      (cell) => cell.type === "image"
    );
    updateCell(rowIndex, imageColumnIndex, imageData);

    // Cập nhật changeImage trong form state
    setValue(`productVariantRequests.${rowIndex}.changeImage`, true);
  };

  const handleDeleteImage = (rowIndex: number) => {
    const imageColumnIndex = matrixData[0].findIndex(
      (cell) => cell.type === "image"
    );
    updateCell(rowIndex, imageColumnIndex, "");
  };

  return (
    <section className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Thông tin bán hàng
      </h2>
      <div className="space-y-6">
        {attributeGroups.map((group, index) => (
          <AttributeGroupInput
            key={index}
            groupIndex={index}
            groupName={group.name}
            values={group.values}
            onGroupNameChange={(name) =>
              handleAttributeGroupChange(index, name)
            }
            onValuesChange={(values) =>
              handleAttributeValueChange(index, values)
            }
            onDeleteGroup={() => handleDeleteAttributeGroup(index)}
            onDeleteValue={(valueIndex) =>
              handleDeleteAttributeValue(index, valueIndex)
            }
            register={register}
            errors={errors}
          />
        ))}
        {attributeGroups.length < 2 && (
          <button
            type="button"
            onClick={handleAddAttributeGroup}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Thêm nhóm phân loại
          </button>
        )}
      </div>
      <VariantTable
        attributeGroups={attributeGroups}
        matrixData={matrixData}
        updateCell={updateCell}
        onOpenModal={handleOpenModal}
        onImageChange={handleImageChange}
        onDeleteImage={handleDeleteImage}
        register={register}
        errors={errors}
      />
      {openModalIndex !== null && (
        <ImageModal isOpen={true} onClose={handleCloseModal}>
          <ImageEditor
            src={
              (matrixData[openModalIndex].find((cell) => cell.type === "image")
                ?.value as string) || ""
            }
            onSave={(imageData) => {
              handleImageChange(openModalIndex, imageData);
              handleCloseModal();
            }}
            onCloseModal={handleCloseModal}
          />
        </ImageModal>
      )}
    </section>
  );
};

const AttributeGroupInput = ({
  groupIndex,
  groupName,
  values,
  onGroupNameChange,
  onValuesChange,
  onDeleteGroup,
  onDeleteValue,
  register,
  errors,
}: {
  groupIndex: number;
  groupName: string;
  values: string[];
  onGroupNameChange: (name: string) => void;
  onValuesChange: (values: string[]) => void;
  onDeleteGroup: () => void;
  onDeleteValue: (valueIndex: number) => void;
  register: any;
  errors: any;
}) => {
  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onValuesChange(newValues);
  };

  const handleAddValue = () => {
    onValuesChange([...values, ""]);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          {...register(`attributeGroups.${groupIndex}.name`, {
            required: "Tên nhóm phân loại không được để trống",
          })}
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          placeholder={`Nhóm phân loại ${groupIndex + 1}`}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onDeleteGroup}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Xóa nhóm
        </button>
      </div>
      {errors.attributeGroups?.[groupIndex]?.name && (
        <span className="text-red-500 text-sm">
          {errors.attributeGroups[groupIndex].name.message}
        </span>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {values.map((value, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              {...register(`attributeGroups.${groupIndex}.values.${index}`, {
                required: "Giá trị phân loại không được để trống",
              })}
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              placeholder="Giá trị phân loại"
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => onDeleteValue(index)}
              className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300"
            >
              X
            </button>
          </div>
        ))}
        {errors.attributeGroups?.[groupIndex]?.values && (
          <span className="text-red-500 text-sm">
            Tất cả các giá trị phân loại phải được điền
          </span>
        )}
      </div>
      <button
        onClick={handleAddValue}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Thêm giá trị
      </button>
    </div>
  );
};

// const VariantTable = ({
//   attributeGroups,
//   matrixData,
//   updateCell,
//   onOpenModal,
//   onImageChange,
//   onDeleteImage,
//   register,
//   errors,
// }: {
//   attributeGroups: AttributeGroup[];
//   matrixData: MatrixData;
//   updateCell: (
//     rowIndex: number,
//     colIndex: number,
//     newValue: CellData["value"]
//   ) => void;
//   onOpenModal: (index: number) => void;
//   onImageChange: (index: number, imageData: string | File) => void;
//   onDeleteImage: (index: number) => void;
//   register: any;
//   errors: any;
// }) => {
//   const handleFileChange = (
//     rowIndex: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       onImageChange(rowIndex, file);
//     }
//   };

//   return (
//     <div className="overflow-x-auto mt-8">
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             {attributeGroups.map((group, index) => (
//               <th
//                 key={index}
//                 className="px-4 py-2 text-left text-gray-600 font-semibold"
//               >
//                 {group.name || `Nhóm phân loại ${index + 1}`}
//               </th>
//             ))}
//             <th className="px-4 py-2 text-left text-gray-600 font-semibold">
//               Giá gốc
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600 font-semibold">
//               Giá bán
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600 font-semibold">
//               Kho hàng
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600 font-semibold">
//               SKU
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600 font-semibold">
//               Hình ảnh
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {matrixData.map((row, rowIndex) => (
//             <tr key={rowIndex} className="border-t border-gray-200">
//               {row.map((cell, cellIndex) => {
//                 if (cell.type === "attribute") {
//                   return (
//                     <td key={cellIndex} className="px-4 py-2">
//                       {cell.value as string}
//                     </td>
//                   );
//                 } else if (cell.type === "image") {
//                   const imageValue = cell.value as string | File;
//                   const imagePreview =
//                     imageValue instanceof File
//                       ? URL.createObjectURL(imageValue)
//                       : imageValue;
//                   return (
//                     <td key={cellIndex} className="px-4 py-2">
//                       <div className="w-[96px] h-[96px]">
//                         {imagePreview ? (
//                           <ImageUploadPreview
//                             src={imagePreview}
//                             handleCropClick={() => onOpenModal(rowIndex)}
//                             handleDeleteClick={() => onDeleteImage(rowIndex)}
//                           />
//                         ) : (
//                           <ImageUpload
//                             fileInputRef={null}
//                             handleFileChange={(e) =>
//                               handleFileChange(rowIndex, e)
//                             }
//                             handleButtonClick={() => {}}
//                           />
//                         )}
//                       </div>
//                     </td>
//                   );
//                 } else {
//                   return (
//                     <td key={cellIndex} className="px-4 py-2">
//                       <input
//                         type={cell.type === "sku" ? "text" : "number"}
//                         {...register(
//                           `productVariantRequests.${rowIndex}.${cell.type}`,
//                           {
//                             required: `${cell.type} is required`,
//                             min:
//                               cell.type !== "sku"
//                                 ? {
//                                     value: 0,
//                                     message: `${cell.type} must be greater than or equal to 0`,
//                                   }
//                                 : undefined,
//                           }
//                         )}
//                         defaultValue={cell.value as string | number}
//                         onChange={(e) =>
//                           updateCell(rowIndex, cellIndex, e.target.value)
//                         }
//                         className="w-full p-1 border border-gray-300 rounded"
//                       />
//                       {errors.productVariantRequests?.[rowIndex]?.[
//                         cell.type
//                       ] && (
//                         <span className="text-red-500 text-sm">
//                           {
//                             errors.productVariantRequests[rowIndex][cell.type]
//                               .message
//                           }
//                         </span>
//                       )}
//                     </td>
//                   );
//                 }
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

const VariantTable = ({
  attributeGroups,
  matrixData,
  updateCell,
  onOpenModal,
  onImageChange,
  onDeleteImage,
  register,
  errors,
}: {
  attributeGroups: AttributeGroup[];
  matrixData: MatrixData;
  updateCell: (
    rowIndex: number,
    colIndex: number,
    newValue: CellData["value"]
  ) => void;
  onOpenModal: (index: number) => void;
  onImageChange: (index: number, imageData: string | File) => void;
  onDeleteImage: (index: number) => void;
  register: any;
  errors: any;
}) => {
  const handleFileChange = (
    rowIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      onImageChange(rowIndex, file);
    }
  };

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {attributeGroups.map((group, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-gray-600 font-semibold"
              >
                {group.name || `Nhóm phân loại ${index + 1}`}
              </th>
            ))}
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">
              Giá gốc
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">
              Giá bán
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">
              Kho hàng
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">
              SKU
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold">
              Hình ảnh
            </th>
          </tr>
        </thead>
        <tbody>
          {matrixData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200">
              {row.map((cell, cellIndex) => {
                if (cell.type === "attribute") {
                  return (
                    <td key={cellIndex} className="px-4 py-2">
                      {cell.value as string}
                    </td>
                  );
                } else if (cell.type === "image") {
                  const imageValue = cell.value as string | File;
                  const imagePreview =
                    imageValue instanceof File
                      ? URL.createObjectURL(imageValue)
                      : imageValue;
                  return (
                    <td key={cellIndex} className="px-4 py-2">
                      <div className="w-[96px] h-[96px]">
                        {imagePreview ? (
                          <ImageUploadPreview
                            src={imagePreview}
                            handleCropClick={() => onOpenModal(rowIndex)}
                            handleDeleteClick={() => onDeleteImage(rowIndex)}
                          />
                        ) : (
                          <ImageUpload
                            fileInputRef={null}
                            handleFileChange={(e) =>
                              handleFileChange(rowIndex, e)
                            }
                            handleButtonClick={() => {}}
                          />
                        )}
                      </div>
                    </td>
                  );
                } else {
                  return (
                    <td key={cellIndex} className="px-4 py-2">
                      <input
                        type={cell.type === "sku" ? "text" : "number"}
                        {...register(
                          `productVariantRequests.${rowIndex}.${cell.type}`,
                          {
                            required: `${cell.type} là bắt buộc`,
                            valueAsNumber: cell.type !== "sku",
                            validate: (value) => {
                              if (cell.type !== "sku") {
                                if (!Number.isInteger(value) || value < 0) {
                                  return `${cell.type} phải là số nguyên dương`;
                                }
                              }
                              return true;
                            },
                          }
                        )}
                        step="1"
                        min="0"
                        defaultValue={cell.value as string | number}
                        onChange={(e) =>
                          updateCell(rowIndex, cellIndex, e.target.value)
                        }
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                      {errors.productVariantRequests?.[rowIndex]?.[
                        cell.type
                      ] && (
                        <span className="text-red-500 text-sm">
                          {
                            errors.productVariantRequests[rowIndex][cell.type]
                              .message
                          }
                        </span>
                      )}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSalesInfo;
