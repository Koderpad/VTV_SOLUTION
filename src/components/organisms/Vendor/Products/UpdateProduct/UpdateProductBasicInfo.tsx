import React, { useState, useRef, useEffect } from "react";
import ReactModal from "react-modal";
import { Cropper, CropperPreview } from "react-advanced-cropper";
import { getAllCategories } from "@/services/manager/CategoryManagerService.ts";
import { CategoryDTO } from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import { useFormContext } from "react-hook-form";
import { ProductRequest } from "@/utils/DTOs/vendor/product/Request/ProductRequest";
import { ImageUploadPreview } from "./EditRow/ClassifyContent/ImageUploadPreview";
import { ImageUpload } from "./EditRow/ClassifyContent/ImageUpload";

ReactModal.setAppElement("#root");

export const UpdateProductBasicInfo = () => {
  const {
    register,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProductRequest>();
  const [imageData, setImageData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropperRef = useRef(null);
  const previewRef = useRef(null);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");

  const selectedCategoryId = watch("categoryId");
  const imageFromForm = watch("image");
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>("");

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(() => {
          console.log("categories: ", response.categoryDTOs);
          return response.categoryDTOs;
        });
      } catch (error) {
        // @ts-ignore
        toast.error(error.response.data.message);
      }
    };
    fetchAllCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const path = getCategoryPathTwoParams(selectedCategoryId, categories);
      setSelectedCategoryPath(path);
      console.log("selectedCategoryId: ", selectedCategoryId);
    } else {
      setSelectedCategoryPath("");
    }
    if (typeof imageFromForm === "string" && imageFromForm) {
      setImageData(imageFromForm);
    } else if (imageFromForm instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageData(e.target?.result as string);
      };
      reader.readAsDataURL(imageFromForm);
    }
  }, [selectedCategoryId, categories, imageFromForm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
          setError("image", {
            type: "manual",
            message: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)",
          });
          return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          setError("image", {
            type: "manual",
            message: "Kích thước file không được vượt quá 5MB",
          });
          return;
        }

        setValue("image", file);
        setValue("changeImage", true);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImageData(reader.result as string);
        });
        reader.readAsDataURL(file);
        clearErrors("image");
      }
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     setValue("image", file);
  //     setValue("changeImage", true);
  //     const reader = new FileReader();
  //     reader.addEventListener("load", () => {
  //       setImageData(reader.result as string);
  //     });
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleCropClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteImage = () => {
    setImageData(null);
    setValue("image", "");
    setValue("changeImage", false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    // Logic for saving cropped image
    setIsModalOpen(false);
  };

  const openCategoryModal = () => {
    setIsCategoryModalVisible(true);
    setSelectedCategories(getSelectedCategoryPath());
  };

  const handleCategoryClick = (categoryDTO: CategoryDTO) => {
    const genLevel = getGenLevel(categoryDTO);
    setSelectedCategories((prevSelected) => {
      const newSelected = prevSelected.slice(0, genLevel - 1);
      newSelected[genLevel - 1] = categoryDTO.categoryId;
      return newSelected;
    });
  };

  const getGenLevel = (category: CategoryDTO): number => {
    if (category.parentId === null) {
      return 1;
    }

    const parentCategory = categories.find(
      (cat) => cat.categoryId === category.parentId
    );
    if (parentCategory) {
      return getGenLevel(parentCategory) + 1;
    }

    return 1;
  };

  const renderCategoryTree = (genLevel: number) => {
    const parentId = genLevel > 1 ? selectedCategories[genLevel - 2] : null;
    const filteredCategories = categories.filter(
      (category) =>
        category.parentId === parentId &&
        category.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
        {filteredCategories.map((category) => (
          <div
            key={category.categoryId}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 cursor-pointer rounded flex items-center ${
              selectedCategories[genLevel - 1] === category.categoryId
                ? "bg-green-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category.name}
            {hasChildCategory(category.categoryId) && (
              <span className="ml-auto">&gt;</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const hasChildCategory = (categoryId: number): boolean => {
    return categories.some((cat) => cat.parentId === categoryId);
  };

  const getSelectedCategoryPath = (): number[] => {
    const path: number[] = [];
    let currentCategoryId = selectedCategoryId;

    while (currentCategoryId !== null) {
      const category = categories.find(
        (cat) => cat.categoryId === currentCategoryId
      );
      if (category) {
        path.unshift(category.categoryId);
        currentCategoryId = category.parentId;
      } else {
        break;
      }
    }

    return path;
  };

  const closeCategoryModal = () => {
    if (selectedCategories.length > 0) {
      const selectedCategoryId =
        selectedCategories[selectedCategories.length - 1];
      setValue("categoryId", selectedCategoryId);
      setSelectedCategoryPath(getCategoryPath());
    }

    setIsCategoryModalVisible(false);
    setSelectedCategories([]);
    setSearchText("");
  };

  const getCategoryPath = (): string => {
    let path = "";
    selectedCategories.forEach((categoryId) => {
      const category = categories.find((cat) => cat.categoryId === categoryId);
      if (category) {
        path += category.name + " -> ";
      }
    });
    return path.slice(0, -4);
  };

  return (
    <section id="product-edit-section" className="bg-[#FAFAF9]">
      <div id="product-basic-info" className="px-[24px] pt-[24px]">
        <div id="panel-header" className="mb-[24px]">
          <div id="panel-title">
            <div id="basic-info-title">
              <h2 className="text-[20px] font-semibold text-[#222222] mb-[16px]">
                Thông tin cơ bản
              </h2>
            </div>
          </div>
        </div>

        <div id="panel-content-wrapper" className="mb-[24px]">
          <div id="panel-content">
            <div id="container" className="flex flex-col">
              {/* Image Product */}
              <div id="edit-row" className="flex mb-[24px]">
                <div id="edit-label edit-title" className="mr-[16px]">
                  <span>Hình ảnh sản phẩm</span>
                </div>
                <div id="edit-main image-offset" className="-mb-[16px]">
                  <div id="ratio-note" className="flex">
                    <div id="mandatory">
                      <span
                        id="mandatory-icon"
                        className="mr-[3px]"
                        style={{ color: "red" }}
                      >
                        *
                      </span>
                    </div>
                    <span>Hình ảnh tỷ lệ 1:1</span>
                  </div>
                  <div id="edit-main vtc-image-manager">
                    <div id="container" className="flex flex-wrap h-[96px]">
                      {imageData ? (
                        <ImageUploadPreview
                          src={imageData}
                          handleCropClick={() => null}
                          handleDeleteClick={handleDeleteImage}
                        />
                      ) : (
                        <ImageUpload
                          fileInputRef={fileInputRef}
                          handleFileChange={handleFileChange}
                          handleButtonClick={() => {}}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <input
                hidden
                {...register("image", {
                  required: "Hình ảnh sản phẩm là bắt buộc",
                })}
              />
              {errors.image && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </span>
              )}

              {/* Name Product */}
              <div id="edit-row">
                <div id="wrap" className="flex ">
                  <div
                    id="edit-label edit-title"
                    className="flex pl-5 w-[180px] h-[40px] justify-center items-center"
                  >
                    <div id="mandatory">
                      <span style={{ color: "red" }}>*</span>
                    </div>
                    <span>Tên sản phẩm</span>
                  </div>
                  <div
                    id="edit-main"
                    className="flex flex-col justify-center w-[100%]"
                  >
                    <div id="edit-main-content" className="flex flex-col mb-4">
                      <div id="edit-main-content-input" className="flex">
                        <input
                          type="text"
                          placeholder="Nhập vào"
                          className="w-[100%] h-[40px] border border-[#ebeaed] rounded-[4px] px-[16px]"
                          {...register("name", {
                            required: "Tên sản phẩm là bắt buộc",
                            minLength: {
                              value: 10,
                              message: "Tên sản phẩm phải có ít nhất 10 ký tự",
                            },
                            maxLength: {
                              value: 120,
                              message:
                                "Tên sản phẩm không được vượt quá 120 ký tự",
                            },
                          })}
                        />
                      </div>
                      {errors.name && (
                        <span className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Product */}
              {/* Category Product */}
              <div id="edit-row is-last-edit-row" className="flex">
                <div
                  id="edit-label edit-row-left"
                  className="flex pl-5 w-[180px] h-[40px] justify-center items-center"
                >
                  <div id="mandatory">
                    <span style={{ color: "#ee4d2d" }}>*</span>
                  </div>
                  <span>Danh mục</span>
                </div>
                <div
                  id="degrade-wrap edit-row-right-full"
                  className="flex w-full"
                >
                  <div id="product-category" className="w-auto">
                    <div id="product-category-box" className="w-auto">
                      <div id="product-edit-form-item" className="w-auto">
                        <div
                          id="product-edit-form-item-content"
                          className="w-auto"
                        >
                          <div id="popover-wrap" className="flex gap-4 w-auto">
                            <div
                              id="product-category-box-inner"
                              className="flex flex-col"
                            >
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={openCategoryModal}
                                  className="py-3 px-4 block border-gray-300 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 w-full text-left"
                                >
                                  {selectedCategoryPath || "Chọn danh mục"}
                                </button>
                                <input
                                  className="mt-4"
                                  hidden
                                  {...register("categoryId", {
                                    required: "Danh mục sản phẩm là bắt buộc",
                                  })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {errors.categoryId && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.categoryId.message}
                </span>
              )}

              {/* Description Product */}
              <div id="edit-row description-wrap" className="flex mb-4">
                <div
                  id="edit-label edit-title"
                  className="flex w-[180px] h-[40px] justify-center items-center"
                >
                  <div id="mandatory">
                    <span style={{ color: "red" }}>*</span>
                  </div>
                  <span>Mô tả sản phẩm</span>
                </div>
                <div
                  id="edit-main"
                  className="flex flex-col justify-center w-[100%]"
                >
                  <div id="edit-main-content" className="flex flex-col">
                    <div id="edit-main-content-input" className="flex">
                      <textarea
                        placeholder="Nhập vào"
                        className="w-[100%] h-[80px] border border-[#ebeaed] rounded-[4px] px-[16px] py-[12px]"
                        {...register("description", {
                          required: "Mô tả sản phẩm là bắt buộc",
                          minLength: {
                            value: 100,
                            message: "Mô tả sản phẩm phải có ít nhất 100 ký tự",
                          },
                          maxLength: {
                            value: 113000,
                            message:
                              "Mô tả sản phẩm không được vượt quá 3000 ký tự",
                          },
                        })}
                      />
                    </div>
                    {errors.description && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Product */}
              <div id="edit-row description-wrap" className="flex">
                <div
                  id="edit-label edit-title"
                  className="flex w-[180px] h-[40px] justify-center items-center"
                >
                  <div id="mandatory">
                    <span style={{ color: "red" }}>*</span>
                  </div>
                  <span>Thông tin</span>
                </div>
                <div
                  id="edit-main"
                  className="flex flex-col justify-center w-[100%]"
                >
                  <div id="edit-main-content" className="flex flex-col">
                    <div id="edit-main-content-input" className="flex">
                      <textarea
                        placeholder="Nhập vào"
                        className="w-[100%] h-[80px] border border-[#ebeaed] rounded-[4px] px-[16px] py-[12px]"
                        {...register("information", {
                          required: "Thông tin sản phẩm là bắt buộc",
                          minLength: {
                            value: 50,
                            message:
                              "Thông tin sản phẩm phải có ít nhất 50 ký tự",
                          },
                          maxLength: {
                            value: 111000,
                            message:
                              "Thông tin sản phẩm không được vượt quá 1000 ký tự",
                          },
                        })}
                      />
                    </div>
                    {errors.information && (
                      <span className="text-red-500 text-sm mt-1">
                        {errors.information.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            position: "fixed",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            width: "40vw",
            height: "45vw",
          },
        }}
        overlayClassName="Overlay"
      >
        <div className="flex h-1/2">
          <Cropper
            ref={cropperRef}
            className="cropper"
            stencilProps={{
              aspectRatio: 1 / 1,
            }}
            src={imageData || ""}
          />
          <CropperPreview
            ref={previewRef}
            cropper={cropperRef}
            className="preview"
            style={{ width: "120px", height: "120px" }}
          />
        </div>
        <div>
          <button onClick={() => {}}>Rotate 90 degrees</button>
          <button onClick={() => {}}>Flip horizontally</button>
        </div>
        <div className="flex justify-end pt-4">
          <button onClick={handleSave}>Save</button>
        </div>
        <button onClick={handleCloseModal}>Close Modal</button>
      </ReactModal>

      {/* Category Selection Modal */}
      {isCategoryModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold mb-4">Chọn Danh Mục</h2>
              <input
                type="text"
                placeholder="Vui lòng nhập tối thiểu 1 ký tự"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-black focus:border-green-500 focus:ring-green-500 rounded px-4 py-2 mb-4 w-full shadow-sm sm:text-sm"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>{renderCategoryTree(1)}</div>
                <div>{renderCategoryTree(2)}</div>
                <div>{renderCategoryTree(3)}</div>
              </div>
              <div className="mt-4">
                <p>Đã chọn: {getCategoryPath()}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 flex justify-end space-x-2">
              <button
                onClick={() => setIsCategoryModalVisible(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={closeCategoryModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const getCategoryPathTwoParams = (
  categoryId: number,
  categories: CategoryDTO[]
): string => {
  const path: string[] = [];
  let currentCategoryId = categoryId;

  while (currentCategoryId) {
    const category = categories.find(
      (cat) => cat.categoryId === currentCategoryId
    );
    if (category) {
      path.unshift(category.name);
      currentCategoryId = category.parentId;
    } else {
      break;
    }
  }

  return path.join(" > ");
};
