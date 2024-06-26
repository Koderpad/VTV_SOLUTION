import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageEditor } from "./EditRow/ClassifyContent/ImageEditor";
import { ImageModal } from "./EditRow/ClassifyContent/ImageModal";
import { ImageUpload } from "./EditRow/ClassifyContent/ImageUpload";
import { ImageUploadPreview } from "./EditRow/ClassifyContent/ImageUploadPreview";

interface AttributeGroup {
  name: string;
  values: string[];
}

interface VariantDataItem {
  productVariantId: number;
  sku: string;
  image: string;
  changeImage: boolean;
  originalPrice: number;
  price: number;
  quantity: number;
  productAttributeRequests: {
    name: string;
    value: string;
  }[];
}

export const ProductSalesInfo = () => {
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([]);
  const [variantData, setVariantData] = useState<VariantDataItem[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  const generateVariantData = useCallback(
    (groups: AttributeGroup[]): VariantDataItem[] => {
      if (groups.length === 0) return [];

      const generateCombinations = (
        groups: string[][],
        current: string[] = [],
        index: number = 0
      ): string[][] => {
        if (index === groups.length) {
          return [current];
        }

        return groups[index].flatMap((item) =>
          generateCombinations(groups, [...current, item], index + 1)
        );
      };

      const combinations = generateCombinations(
        groups.map((group) => group.values)
      );

      return combinations.map((combo) => ({
        productVariantId: 0,
        sku: `SKU-${uuidv4().slice(0, 8)}`,
        image: "",
        changeImage: true,
        originalPrice: 0,
        price: 0,
        quantity: 0,
        productAttributeRequests: groups.map((group, index) => ({
          name: group.name,
          value: combo[index] || "",
        })),
      }));
    },
    []
  );

  useEffect(() => {
    const newVariantData = generateVariantData(attributeGroups);
    setVariantData((prevData) => {
      const updatedData = newVariantData.map((newVariant) => {
        const existingVariant = prevData.find(
          (v) =>
            JSON.stringify(v.productAttributeRequests) ===
            JSON.stringify(newVariant.productAttributeRequests)
        );
        return existingVariant
          ? { ...newVariant, ...existingVariant }
          : newVariant;
      });
      return updatedData;
    });
  }, [attributeGroups, generateVariantData]);

  const handleAddAttributeGroup = () => {
    if (attributeGroups.length < 2) {
      setAttributeGroups([...attributeGroups, { name: "", values: [] }]);
    }
  };

  const handleAttributeGroupChange = (index: number, name: string) => {
    const newGroups = [...attributeGroups];
    newGroups[index].name = name;
    setAttributeGroups(newGroups);
  };

  const handleAttributeValueChange = (groupIndex: number, values: string[]) => {
    const newGroups = [...attributeGroups];
    newGroups[groupIndex].values = values;
    setAttributeGroups(newGroups);
  };

  const handleDeleteAttributeGroup = (index: number) => {
    const newGroups = [...attributeGroups];
    newGroups.splice(index, 1);
    setAttributeGroups(newGroups);
  };

  const handleDeleteAttributeValue = (
    groupIndex: number,
    valueIndex: number
  ) => {
    const newGroups = [...attributeGroups];
    newGroups[groupIndex].values.splice(valueIndex, 1);
    setAttributeGroups(newGroups);
  };

  const handleOpenModal = (index: number) => {
    setOpenModalIndex(index);
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
  };

  const handleImageChange = (index: number, imageData: string) => {
    const newData = [...variantData];
    newData[index] = { ...newData[index], image: imageData };
    setVariantData(newData);
  };

  const handleDeleteImage = (index: number) => {
    const newData = [...variantData];
    newData[index] = { ...newData[index], image: "" };
    setVariantData(newData);
  };

  return (
    <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
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
          />
        ))}
        {attributeGroups.length < 2 && (
          <button
            onClick={handleAddAttributeGroup}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Thêm nhóm phân loại
          </button>
        )}
      </div>
      <VariantTable
        attributeGroups={attributeGroups}
        variantData={variantData}
        setVariantData={setVariantData}
        onOpenModal={handleOpenModal}
        onImageChange={handleImageChange}
        onDeleteImage={handleDeleteImage}
      />
      {openModalIndex !== null && (
        <ImageModal isOpen={true} onClose={handleCloseModal}>
          <ImageEditor
            src={variantData[openModalIndex].image}
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
}: {
  groupIndex: number;
  groupName: string;
  values: string[];
  onGroupNameChange: (name: string) => void;
  onValuesChange: (values: string[]) => void;
  onDeleteGroup: () => void;
  onDeleteValue: (valueIndex: number) => void;
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
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          placeholder={`Nhóm phân loại ${groupIndex + 1}`}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onDeleteGroup}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Xóa nhóm
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {values.map((value, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
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

const VariantTable = ({
  attributeGroups,
  variantData,
  setVariantData,
  onOpenModal,
  onImageChange,
  onDeleteImage,
}: {
  attributeGroups: AttributeGroup[];
  variantData: VariantDataItem[];
  setVariantData: React.Dispatch<React.SetStateAction<VariantDataItem[]>>;
  onOpenModal: (index: number) => void;
  onImageChange: (index: number, imageData: string) => void;
  onDeleteImage: (index: number) => void;
}) => {
  const handleInputChange = (
    index: number,
    field: keyof VariantDataItem,
    value: string | number
  ) => {
    const newData = [...variantData];
    newData[index] = { ...newData[index], [field]: value };
    setVariantData(newData);
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        onImageChange(index, reader.result as string);
      });
      reader.readAsDataURL(file);
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
          {variantData.map((variant, index) => (
            <tr key={index} className="border-t border-gray-200">
              {attributeGroups.map((group, groupIndex) => (
                <td key={groupIndex} className="px-4 py-2">
                  {
                    variant.productAttributeRequests.find(
                      (attr) => attr.name === group.name
                    )?.value
                  }
                </td>
              ))}
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={variant.originalPrice}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "originalPrice",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    handleInputChange(index, "price", parseInt(e.target.value))
                  }
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={variant.quantity}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "quantity",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) =>
                    handleInputChange(index, "sku", e.target.value)
                  }
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <td className="px-4 py-2">
                <div className="w-[96px] h-[96px]">
                  {variant.image ? (
                    <ImageUploadPreview
                      src={variant.image}
                      handleCropClick={() => onOpenModal(index)}
                      handleDeleteClick={() => onDeleteImage(index)}
                    />
                  ) : (
                    <ImageUpload
                      fileInputRef={null}
                      handleFileChange={(e) => handleFileChange(index, e)}
                      handleButtonClick={() => {}}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSalesInfo;
