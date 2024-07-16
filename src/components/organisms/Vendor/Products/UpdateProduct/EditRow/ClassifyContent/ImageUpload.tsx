type ImageUploadProps = {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleButtonClick: () => void;
};

export const ImageUpload = ({
  fileInputRef,
  handleFileChange,
  handleButtonClick,
}: ImageUploadProps) => {
  return (
    <div
      id="vtc-image-manager__itembox"
      className="w-[96px] mb-[16px] mr-[16px] max-w-[80px] max-h-[80px]"
    >
      <div id="vtc-image-manager__content" className="relative pt-[80x] h-0">
        {/* border */}
        <div
          id="vtc-image-manager__upload"
          className="flex flex-col h-[80px] border-[0.8px] hover:bg-gray-200"
        >
          <div id="vtc-file-upload" className="border-[0.8px] h-full">
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
                  style={{
                    opacity: "0",
                    aspectRatio: "1/1",
                  }}
                  onChange={handleFileChange}
                  onClick={handleButtonClick}
                />
                <div
                  id="vtc-image-manager__upload__content"
                  className="flex flex-col items-center px-[2px]"
                  style={{ color: "#ee4d2d" }}
                >
                  <div id="vtc-image-manager__upload__content__icon">
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
                    Thêm hình ảnh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
