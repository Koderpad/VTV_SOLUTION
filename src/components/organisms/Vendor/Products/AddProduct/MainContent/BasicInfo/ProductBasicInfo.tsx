import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import { Cropper, CropperPreview } from "react-advanced-cropper";

ReactModal.setAppElement("#root");

export const ProductBasicInfo = () => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropperRef = useRef(null);
  const previewRef = useRef(null);

  const [categories, setCategories] = useState<string[]>([
    "Category 1",
    "Category 2",
    "Category 3",
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
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
                                  <i
                                    id="shopee-icon"
                                    className="h-[16px] w-[16px]"
                                  >
                                    <span className="h-auto w-auto">
                                      <svg
                                        version="1.0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 1.2 1.2"
                                        xmlSpace="preserve"
                                      >
                                        <path
                                          fill="none"
                                          stroke="#000"
                                          strokeWidth="0.037500000000000006"
                                          strokeMiterlimit="10"
                                          d="M0 0.206h0.994V1.2"
                                        />
                                        <path
                                          fill="none"
                                          stroke="#000"
                                          strokeWidth="0.037500000000000006"
                                          strokeMiterlimit="10"
                                          d="M0.206 0v0.994H1.2m-0.994 0 0.975 -0.975"
                                        />
                                      </svg>
                                    </span>
                                  </i>
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
                                  <i
                                    id="shopee-icon"
                                    className="h-[16px] w-[16px]"
                                  >
                                    <span>
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 20.48 20.48"
                                        className="icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M3.2 5.12H1.92a.64.64 0 0 1 0-1.28h5.12V1.919a.64.64 0 0 1 .64-.64h5.12a.64.64 0 0 1 .64.64V3.84h5.12a.64.64 0 1 1 0 1.28h-1.28v13.44a.64.64 0 0 1-.64.64H3.84a.64.64 0 0 1-.64-.64V5.12zm8.96-1.28V2.56H8.32v1.28h3.84zM4.48 17.92H16V5.12H4.48v12.8zm3.84-2.56a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64zm3.84 0a.64.64 0 0 1-.64-.64v-6.4a.64.64 0 0 1 1.28 0v6.4a.64.64 0 0 1-.64.64z" />
                                      </svg>
                                    </span>
                                  </i>
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
                                      <i id="vtc-icon">
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M19 2.5A1.5 1.5 0 0 0 17.5 1h-15A1.5 1.5 0 0 0 1 2.5v15A1.5 1.5 0 0 0 2.5 19H10v-2H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 0 1 .84.02l.72 1.251A5.98 5.98 0 0 1 16 10h3V2.5zm-11.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm12.207 10.793A1 1 0 0 0 19 15h-2v-2a1 1 0 0 0-2 0v2h-2a1 1 0 0 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 0 0 .707-1.707z"
                                            fill="#5C5F62"
                                          />
                                        </svg>
                                      </i>
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
                        />
                      </div>
                      <div id="edit-main-content-error">
                        {/* Error message would go here */}
                      </div>
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
                                <select
                                  id="select-1"
                                  className="py-3 px-4 pe-16 block border-red-500 rounded-lg text-xl focus:border-red-500 focus:ring-red-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                                >
                                  <option selected>Chọn thể loại</option>
                                  {categories.map((category) => (
                                    <option key={category}>{category}</option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none pe-8">
                                  {/* Warning icon SVG */}
                                  <svg
                                    className="flex-shrink-0 h-4 w-4 text-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" x2="12" y1="8" y2="12" />
                                    <line x1="12" x2="12.01" y1="16" y2="16" />
                                  </svg>
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
                      />
                    </div>
                    <div id="edit-main-content-error">
                      {/* Error message would go here */}
                    </div>
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
                      />
                    </div>
                    <div id="edit-main-content-error">
                      {/* Error message would go here */}
                    </div>
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
    </section>
  );
};