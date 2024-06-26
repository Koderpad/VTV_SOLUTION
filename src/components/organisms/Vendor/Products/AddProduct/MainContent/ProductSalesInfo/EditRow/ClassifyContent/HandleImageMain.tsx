import { useState, useRef, useEffect } from "react";
import { ImageUploadPreview } from "./ImageUploadPreview";
import { ImageModal } from "./ImageModal";
import { ImageEditor } from "./ImageEditor";
import { ImageUpload } from "./ImageUpload";
import { storage } from "../../../../../../../../../constants/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../../../../../../redux/reducer/addProductSlice";
import { set } from "date-fns";

const metadata = {
  contentType: "image/jpeg",
};

export const HandleImageMain = ({
  handleData,
}: {
  handleData: (imageData: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const handleCropClick = () => {
    setIsOpen(true);
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    console.log("imageData vo day");
    const uploadImageToFirebase = async () => {
      if (imageData) {
        const storageRef = ref(
          storage,
          `images/${Date.now()}-${fileInputRef.current?.files?.[0]?.name}`
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          dataURLtoBlob(imageData),
          metadata
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Your existing code to track upload progress
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            // Image uploaded successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Uploaded image URL:", downloadURL);
            handleData(downloadURL);
          }
        );
      }
    };

    uploadImageToFirebase();
  }, [imageData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const desiredSize = 1000; // Set the desired size here
          canvas.width = desiredSize;
          canvas.height = desiredSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, desiredSize, desiredSize);
            // Automatically zoom the image
            const scale = desiredSize / Math.max(img.width, img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (desiredSize - scaledWidth) / 2;
            const y = (desiredSize - scaledHeight) / 2;
            ctx.drawImage(
              img,
              0,
              0,
              img.width,
              img.height,
              x,
              y,
              scaledWidth,
              scaledHeight
            );
            const dataUrl = canvas.toDataURL();
            setImageData(dataUrl);
          }
        };
        img.src = reader.result as string;
      });
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      console.log(fileInputRef.current.files);
    }
  };

  return (
    // ui của hình ảnh sản phẩm
    <div id="edit-row" className="flex mb-[24px]">
      {/* edit-main image-manager */}
      <div id="edit-main vtc-image-manager">
        {/* container */}
        <div id="container" className="flex flex-wrap h-[96px]">
          {/*ui hình ảnh đã có*/}
          {imageData ? (
            <ImageUploadPreview
              src={imageData}
              handleCropClick={handleCropClick}
            />
          ) : (
            // ui chưa có hình ảnh
            <ImageUpload
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              handleButtonClick={handleButtonClick}
            />
          )}
        </div>

        <ImageModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <ImageEditor
            src={imageData || ""}
            onSave={setImageData}
            onCloseModal={() => {
              setIsOpen(false);
            }}
          />
        </ImageModal>
      </div>
    </div>
  );
};
