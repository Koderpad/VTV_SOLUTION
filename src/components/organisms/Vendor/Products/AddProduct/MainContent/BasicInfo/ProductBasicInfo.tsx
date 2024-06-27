import React, { useState, useRef, useEffect } from "react";
import ReactModal from "react-modal";
import { Cropper, CropperPreview } from "react-advanced-cropper";
import { getAllCategories } from "@/services/manager/CategoryManagerService.ts";
import { CategoryDTO } from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import { useFormContext } from "react-hook-form";
import { ProductRequest } from "@/utils/DTOs/vendor/product/Request/ProductRequest";

ReactModal.setAppElement("#root");

export const ProductBasicInfo = () => {
  const {
    register,
    setValue,
    watch,
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
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>("");

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.categoryDTOs);
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue("image", file);
      setValue("changeImage", true);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageData(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                      {imageData && (
                        <div
                          id="can-drag vtc-image-manager__itembox"
                          className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
                        >
                          <div id="popover-wrap" className=" h-[80px]">
                            <div
                              id="shopee-image-manager__content content-fill"
                              className="relative h-full"
                            >
                              <img
                                src={imageData}
                                alt="image"
                                className="absolute border-[0.8px]"
                              />
                              <div
                                id="shopee-image-manager__tools"
                                className="flex justify-center gap-3 absolute bottom-0 right-0 left-0 h-[24px] w-[80px] bg-[#D6D3D1] bg-opacity-100"
                              >
                                <span
                                  id="shopee-image-manager__icon shopee-image-manager__icon--crop"
                                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                                  onClick={handleCropClick}
                                >
                                  {/* Crop icon SVG */}
                                </span>
                                <span
                                  id="decollator"
                                  className="border-l h-auto w-[1px] border-gray-400"
                                ></span>
                                <span
                                  id="shopee-image-manager__icon shopee-image-manager__icon--delete"
                                  className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                                >
                                  {/* Delete icon SVG */}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        id="vtc-image-manager__itembox"
                        className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
                      >
                        <div
                          id="vtc-image-manager__content"
                          className="relative pt-[80x] h-0"
                        >
                          <div
                            id="vtc-image-manager__upload"
                            className="flex flex-col h-[80px] border-[0.8px] hover:bg-gray-200"
                          >
                            <div
                              id="vtc-file-upload"
                              className="border-[0.8px] h-full"
                            >
                              <div id="vtc-upload" className="relative h-full">
                                <div
                                  id="vtc-upload-wrapper vtc-upload-dragger"
                                  className="flex items-center justify-center h-full"
                                >
                                  <input
                                    ref={fileInputRef}
                                    id="vtc-upload__input"
                                    type="file"
                                    accept="image/*"
                                    className="h-full w-full absolute cursor-pointer"
                                    style={{ opacity: "0", aspectRatio: "1/1" }}
                                    onChange={handleFileChange}
                                  />
                                  <div
                                    id="vtc-image-manager__upload__content"
                                    className="flex flex-col items-center px-[2px]"
                                    style={{ color: "#ee4d2d" }}
                                  >
                                    <div id="vtc-image-manager__upload__content__icon">
                                      {/* Upload icon SVG */}
                                    </div>
                                    <div
                                      id="vtc-image-manager__upload__content__text"
                                      style={{
                                        fontSize: "12px",
                                        lineHeight: "14px",
                                        textAlign: "center",
                                      }}
                                    >
                                      Thêm hình ảnh (1/9)
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
              <div id="edit-row is-last-edit-row" className="flex">
                <div
                  id="edit-label edit-row-left"
                  className="flex pl-5 w-[180px] h-[40px] justify-center items-center"
                >
                  <div id="mandatory">
                    <span style={{ color: "#ee4d2d" }}>*</span>
                  </div>
                  <span>Ngành hàng</span>
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
                                  className="py-3 px-4 pe-16 block border-gray-300 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 w-full text-left"
                                >
                                  {selectedCategoryPath || "Chọn danh mục"}
                                </button>
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
                            value: 3000,
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
                            value: 1000,
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

// import React, { useState, useRef, useEffect } from "react";
// import ReactModal from "react-modal";
// import { Cropper, CropperPreview } from "react-advanced-cropper";
// import { getAllCategories } from "@/services/manager/CategoryManagerService.ts";
// import { CategoryDTO } from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
// ReactModal.setAppElement("#root");

// export const ProductBasicInfo = () => {
//   const [imageData, setImageData] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const cropperRef = useRef(null);
//   const previewRef = useRef(null);

//   const [categories, setCategories] = useState<CategoryDTO[]>([]);
//   const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [searchText, setSearchText] = useState("");

//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
//     null
//   );
//   const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>("");

//   useEffect(() => {
//     fetchAllCategories();
//   }, []);

//   const fetchAllCategories = async () => {
//     try {
//       const response = await getAllCategories();
//       setCategories(response.categoryDTOs);
//     } catch (error) {
//       // @ts-ignore
//       toast.error(error.response.data.message);
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const file = event.target.files[0];
//       const reader = new FileReader();
//       reader.addEventListener("load", () => {
//         setImageData(reader.result as string);
//       });
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCropClick = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSave = () => {
//     // Logic for saving cropped image
//     setIsModalOpen(false);
//   };

//   const openCategoryModal = () => {
//     setIsCategoryModalVisible(true);
//     setSelectedCategories(getSelectedCategoryPath());
//   };

//   // const closeCategoryModal = () => {
//   //   setIsCategoryModalVisible(false);
//   //   setSelectedCategories([]);
//   //   setSearchText("");
//   // };

//   const handleCategoryClick = (categoryDTO: CategoryDTO) => {
//     const genLevel = getGenLevel(categoryDTO);
//     setSelectedCategories((prevSelected) => {
//       const newSelected = prevSelected.slice(0, genLevel - 1);
//       newSelected[genLevel - 1] = categoryDTO.categoryId;
//       return newSelected;
//     });
//   };

//   const getGenLevel = (category: CategoryDTO): number => {
//     if (category.parentId === null) {
//       return 1;
//     }

//     const parentCategory = categories.find(
//       (cat) => cat.categoryId === category.parentId
//     );
//     if (parentCategory) {
//       return getGenLevel(parentCategory) + 1;
//     }

//     return 1;
//   };

//   const renderCategoryTree = (genLevel: number) => {
//     const parentId = genLevel > 1 ? selectedCategories[genLevel - 2] : null;
//     const filteredCategories = categories.filter(
//       (category) =>
//         category.parentId === parentId &&
//         category.name.toLowerCase().includes(searchText.toLowerCase())
//     );

//     return (
//       <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
//         {filteredCategories.map((category) => (
//           <div
//             key={category.categoryId}
//             onClick={() => handleCategoryClick(category)}
//             className={`px-4 py-2 cursor-pointer rounded flex items-center ${
//               selectedCategories[genLevel - 1] === category.categoryId
//                 ? "bg-green-500 text-white"
//                 : "bg-gray-100 hover:bg-gray-200"
//             }`}
//           >
//             {category.name}
//             {hasChildCategory(category.categoryId) && (
//               <span className="ml-auto">&gt;</span>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const hasChildCategory = (categoryId: number): boolean => {
//     return categories.some((cat) => cat.parentId === categoryId);
//   };

//   // const getCategoryPath = (): string => {
//   //   let path = "";
//   //   selectedCategories.forEach((categoryId) => {
//   //     const category = categories.find((cat) => cat.categoryId === categoryId);
//   //     if (category) {
//   //       path += category.name + " -> ";
//   //     }
//   //   });
//   //   return path.slice(0, -4);
//   // };

//   // const getSelectedCategoryPath = (): number[] => {
//   //   // Implement this function based on your requirements
//   //   return [];
//   // };

//   const getSelectedCategoryPath = (): number[] => {
//     const path: number[] = [];
//     let currentCategoryId = selectedCategoryId;

//     while (currentCategoryId !== null) {
//       const category = categories.find(
//         (cat) => cat.categoryId === currentCategoryId
//       );
//       if (category) {
//         path.unshift(category.categoryId);
//         currentCategoryId = category.parentId;
//       } else {
//         break;
//       }
//     }

//     return path;
//   };

//   const closeCategoryModal = () => {
//     if (selectedCategories.length > 0) {
//       const selectedCategoryId =
//         selectedCategories[selectedCategories.length - 1];
//       setSelectedCategoryId(selectedCategoryId);
//       setSelectedCategoryPath(getCategoryPath());
//     }

//     setIsCategoryModalVisible(false);
//     setSelectedCategories([]);
//     setSearchText("");
//   };

//   const getCategoryPath = (): string => {
//     let path = "";
//     selectedCategories.forEach((categoryId) => {
//       const category = categories.find((cat) => cat.categoryId === categoryId);
//       if (category) {
//         path += category.name + " -> ";
//       }
//     });
//     return path.slice(0, -4);
//   };

//   return (
//     <section id="product-edit-section" className="bg-[#FAFAF9]">
//       <div id="product-basic-info" className="px-[24px] pt-[24px]">
//         <div id="panel-header" className="mb-[24px]">
//           <div id="panel-title">
//             <div id="basic-info-title">
//               <h2 className="text-[20px] font-semibold text-[#222222] mb-[16px]">
//                 Thông tin cơ bản
//               </h2>
//             </div>
//           </div>
//         </div>

//         <div id="panel-content-wrapper" className="mb-[24px]">
//           <div id="panel-content">
//             <div id="container" className="flex flex-col">
//               {/* Image Product */}
//               <div id="edit-row" className="flex mb-[24px]">
//                 <div id="edit-label edit-title" className="mr-[16px]">
//                   <span>Hình ảnh sản phẩm</span>
//                 </div>
//                 <div id="edit-main image-offset" className="-mb-[16px]">
//                   <div id="ratio-note" className="flex">
//                     <div id="mandatory">
//                       <span
//                         id="mandatory-icon"
//                         className="mr-[3px]"
//                         style={{ color: "red" }}
//                       >
//                         *
//                       </span>
//                     </div>
//                     <span>Hình ảnh tỷ lệ 1:1</span>
//                   </div>
//                   <div id="edit-main vtc-image-manager">
//                     <div id="container" className="flex flex-wrap h-[96px]">
//                       {imageData && (
//                         <div
//                           id="can-drag vtc-image-manager__itembox"
//                           className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
//                         >
//                           <div id="popover-wrap" className=" h-[80px]">
//                             <div
//                               id="shopee-image-manager__content content-fill"
//                               className="relative h-full"
//                             >
//                               <img
//                                 src={imageData}
//                                 alt="image"
//                                 className="absolute border-[0.8px]"
//                               />
//                               <div
//                                 id="shopee-image-manager__tools"
//                                 className="flex justify-center gap-3 absolute bottom-0 right-0 left-0 h-[24px] w-[80px] bg-[#D6D3D1] bg-opacity-100"
//                               >
//                                 <span
//                                   id="shopee-image-manager__icon shopee-image-manager__icon--crop"
//                                   className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
//                                   onClick={handleCropClick}
//                                 >
//                                   {/* Crop icon SVG */}
//                                   <i
//                                     id="shopee-icon"
//                                     className="h-[16px] w-[16px]"
//                                   >
//                                     <span className="h-auto w-auto">
//                                       <svg
//                                         version="1.0"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 1.2 1.2"
//                                         xmlSpace="preserve"
//                                       >
//                                         <path
//                                           fill="none"
//                                           stroke="#000"
//                                           strokeWidth="0.037500000000000006"
//                                           strokeMiterlimit="10"
//                                           d="M0 0.206h0.994V1.2"
//                                         />
//                                         <path
//                                           fill="none"
//                                           stroke="#000"
//                                           strokeWidth="0.037500000000000006"
//                                           strokeMiterlimit="10"
//                                           d="M0.206 0v0.994H1.2m-0.994 0 0.975 -0.975"
//                                         />
//                                       </svg>
//                                     </span>
//                                   </i>
//                                 </span>
//                                 <span
//                                   id="decollator"
//                                   className="border-l h-auto w-[1px] border-gray-400"
//                                 ></span>
//                                 <span
//                                   id="shopee-image-manager__icon shopee-image-manager__icon--delete"
//                                   className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
//                                 >
//                                   {/* Delete icon SVG */}
//                                   <i
//                                     id="shopee-icon"
//                                     className="h-[16px] w-[16px]"
//                                   >
//                                     <span>
//                                       <svg
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 20.48 20.48"
//                                         className="icon"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                       >
//                                         <path d="M3.2 5.12H1.92a.64.64 0 0 1 0-1.28h5.12V1.919a.64.64 0 0 1 .64-.64h5.12a.64.64 0 0 1 .64.64V3.84h5.12a.64.64 0 1 1 0 1.28h-1.28v13.44a.64.64 0 0 1-.64.64H3.84a.64.64 0 0 1-.64-.64V5.12zm8.96-1.28V2.56H8.32v1.28h3.84zM4.48 17.92H16V5.12H4.48v12.8zm3.84-2.56a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64zm3.84 0a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64z" />
//                                       </svg>
//                                     </span>
//                                   </i>
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       <div
//                         id="vtc-image-manager__itembox"
//                         className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
//                       >
//                         <div
//                           id="vtc-image-manager__content"
//                           className="relative pt-[80x] h-0"
//                         >
//                           <div
//                             id="vtc-image-manager__upload"
//                             className="flex flex-col h-[80px] border-[0.8px] hover:bg-gray-200"
//                           >
//                             <div
//                               id="vtc-file-upload"
//                               className="border-[0.8px] h-full"
//                             >
//                               <div id="vtc-upload" className="relative h-full">
//                                 <div
//                                   id="vtc-upload-wrapper vtc-upload-dragger"
//                                   className="flex items-center justify-center h-full"
//                                 >
//                                   <input
//                                     ref={fileInputRef}
//                                     id="vtc-upload__input"
//                                     type="file"
//                                     accept="image/*"
//                                     className="h-full w-full absolute cursor-pointer"
//                                     style={{ opacity: "0", aspectRatio: "1/1" }}
//                                     onChange={handleFileChange}
//                                   />
//                                   <div
//                                     id="vtc-image-manager__upload__content"
//                                     className="flex flex-col items-center px-[2px]"
//                                     style={{ color: "#ee4d2d" }}
//                                   >
//                                     <div id="vtc-image-manager__upload__content__icon">
//                                       {/* Upload icon SVG */}
//                                       <i id="vtc-icon">
//                                         <svg
//                                           width="20"
//                                           height="20"
//                                           viewBox="0 0 20 20"
//                                           xmlns="http://www.w3.org/2000/svg"
//                                         >
//                                           <path
//                                             d="M19 2.5A1.5 1.5 0 0 0 17.5 1h-15A1.5 1.5 0 0 0 1 2.5v15A1.5 1.5 0 0 0 2.5 19H10v-2H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 0 1 .84.02l.72 1.251A5.98 5.98 0 0 1 16 10h3V2.5zm-11.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm12.207 10.793A1 1 0 0 0 19 15h-2v-2a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 0 0 .707-1.707z"
//                                             fill="#5C5F62"
//                                           />
//                                         </svg>
//                                       </i>
//                                     </div>
//                                     <div
//                                       id="vtc-image-manager__upload__content__text"
//                                       style={{
//                                         fontSize: "12px",
//                                         lineHeight: "14px",
//                                         textAlign: "center",
//                                       }}
//                                     >
//                                       Thêm hình ảnh (1/9)
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Name Product */}
//               <div id="edit-row">
//                 <div id="wrap" className="flex ">
//                   <div
//                     id="edit-label edit-title"
//                     className="flex pl-5 w-[180px] h-[40px] justify-center items-center"
//                   >
//                     <div id="mandatory">
//                       <span style={{ color: "red" }}>*</span>
//                     </div>
//                     <span>Tên sản phẩm</span>
//                   </div>
//                   <div
//                     id="edit-main"
//                     className="flex flex-col justify-center w-[100%]"
//                   >
//                     <div id="edit-main-content" className="flex flex-col mb-4">
//                       <div id="edit-main-content-input" className="flex">
//                         <input
//                           type="text"
//                           placeholder="Nhập vào"
//                           className="w-[100%] h-[40px] border border-[#ebeaed] rounded-[4px] px-[16px]"
//                         />
//                       </div>
//                       <div id="edit-main-content-error">
//                         {/* Error message would go here */}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Product */}
//               <div id="edit-row is-last-edit-row" className="flex">
//                 <div
//                   id="edit-label edit-row-left"
//                   className="flex pl-5 w-[180px] h-[40px] justify-center items-center"
//                 >
//                   <div id="mandatory">
//                     <span style={{ color: "#ee4d2d" }}>*</span>
//                   </div>
//                   <span>Ngành hàng</span>
//                 </div>
//                 <div
//                   id="degrade-wrap edit-row-right-full"
//                   className="flex w-full"
//                 >
//                   <div id="product-category" className="w-auto">
//                     <div id="product-category-box" className="w-auto">
//                       <div id="product-edit-form-item" className="w-auto">
//                         <div
//                           id="product-edit-form-item-content"
//                           className="w-auto"
//                         >
//                           <div id="popover-wrap" className="flex gap-4 w-auto">
//                             <div
//                               id="product-category-box-inner"
//                               className="flex flex-col"
//                             >
//                               <div className="relative">
//                                 <button
//                                   onClick={openCategoryModal}
//                                   className="py-3 px-4 pe-16 block border-gray-300 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 w-full text-left"
//                                 >
//                                   {selectedCategoryPath || "Chọn danh mục"}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Description Product */}
//               <div id="edit-row description-wrap" className="flex mb-4">
//                 <div
//                   id="edit-label edit-title"
//                   className="flex w-[180px] h-[40px] justify-center items-center"
//                 >
//                   <div id="mandatory">
//                     <span style={{ color: "red" }}>*</span>
//                   </div>
//                   <span>Mô tả sản phẩm</span>
//                 </div>
//                 <div
//                   id="edit-main"
//                   className="flex flex-col justify-center w-[100%]"
//                 >
//                   <div id="edit-main-content" className="flex flex-col">
//                     <div id="edit-main-content-input" className="flex">
//                       <textarea
//                         placeholder="Nhập vào"
//                         className="w-[100%] h-[80px] border border-[#ebeaed] rounded-[4px] px-[16px] py-[12px]"
//                       />
//                     </div>
//                     <div id="edit-main-content-error">
//                       {/* Error message would go here */}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Info Product */}
//               <div id="edit-row description-wrap" className="flex">
//                 <div
//                   id="edit-label edit-title"
//                   className="flex w-[180px] h-[40px] justify-center items-center"
//                 >
//                   <div id="mandatory">
//                     <span style={{ color: "red" }}>*</span>
//                   </div>
//                   <span>Thông tin</span>
//                 </div>
//                 <div
//                   id="edit-main"
//                   className="flex flex-col justify-center w-[100%]"
//                 >
//                   <div id="edit-main-content" className="flex flex-col">
//                     <div id="edit-main-content-input" className="flex">
//                       <textarea
//                         placeholder="Nhập vào"
//                         className="w-[100%] h-[80px] border border-[#ebeaed] rounded-[4px] px-[16px] py-[12px]"
//                       />
//                     </div>
//                     <div id="edit-main-content-error">
//                       {/* Error message would go here */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Image Editor Modal */}
//       <ReactModal
//         isOpen={isModalOpen}
//         onRequestClose={handleCloseModal}
//         style={{
//           content: {
//             position: "fixed",
//             top: "50%",
//             left: "50%",
//             right: "auto",
//             bottom: "auto",
//             transform: "translate(-50%, -50%)",
//             border: "1px solid #ccc",
//             background: "#fff",
//             overflow: "auto",
//             WebkitOverflowScrolling: "touch",
//             borderRadius: "4px",
//             outline: "none",
//             padding: "20px",
//             width: "40vw",
//             height: "45vw",
//           },
//         }}
//         overlayClassName="Overlay"
//       >
//         <div className="flex h-1/2">
//           <Cropper
//             ref={cropperRef}
//             className="cropper"
//             stencilProps={{
//               aspectRatio: 1 / 1,
//             }}
//             src={imageData || ""}
//           />
//           <CropperPreview
//             ref={previewRef}
//             cropper={cropperRef}
//             className="preview"
//             style={{ width: "120px", height: "120px" }}
//           />
//         </div>
//         <div>
//           <button onClick={() => {}}>Rotate 90 degrees</button>
//           <button onClick={() => {}}>Flip horizontally</button>
//         </div>
//         <div className="flex justify-end pt-4">
//           <button onClick={handleSave}>Save</button>
//         </div>
//         <button onClick={handleCloseModal}>Close Modal</button>
//       </ReactModal>

//       {/* Category Selection Modal */}
//       {/* Category Selection Modal */}
//       {isCategoryModalVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
//             <div className="px-6 py-4">
//               <h2 className="text-xl font-bold mb-4">Chọn Danh Mục</h2>
//               <input
//                 type="text"
//                 placeholder="Vui lòng nhập tối thiểu 1 ký tự"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="border border-black focus:border-green-500 focus:ring-green-500 rounded px-4 py-2 mb-4 w-full shadow-sm sm:text-sm"
//               />
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>{renderCategoryTree(1)}</div>
//                 <div>{renderCategoryTree(2)}</div>
//                 <div>{renderCategoryTree(3)}</div>
//               </div>
//               <div className="mt-4">
//                 <p>Đã chọn: {getCategoryPath()}</p>
//               </div>
//             </div>
//             <div className="px-6 py-4 bg-gray-100 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsCategoryModalVisible(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={closeCategoryModal}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Xác nhận
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };
