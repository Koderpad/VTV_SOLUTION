import { useRef } from "react";
import {
  CropperRef,
  CropperPreviewRef,
  Cropper,
  CropperPreview,
  CropperState,
  CoreSettings,
  rotateImageAlgorithm,
  flipImageAlgorithm,
} from "react-advanced-cropper";

type ImageEditorProps = {
  src?: string;
  onSave: (img: string) => void;
  onCloseModal: () => void;
};

export const ImageEditor: React.FC<ImageEditorProps> = ({
  src,
  onSave,
  onCloseModal,
}) => {
  const previewRef = useRef<CropperPreviewRef>(null);
  const cropperRef = useRef<CropperRef>(null);

  const rotate = (angle: number) => {
    if (cropperRef.current) {
      const currentState = cropperRef.current.getState();
      const settings = cropperRef.current.getSettings();
      if (currentState) {
        const newState = rotateImageAlgorithm(currentState, settings, angle);
        cropperRef.current.setState(newState);
      }
    }
  };

  const flip = (horizontal: boolean, vertical: boolean) => {
    if (cropperRef.current) {
      const currentState = cropperRef.current.getState();
      const settings = cropperRef.current.getSettings();
      if (currentState) {
        const newState = flipImageAlgorithm(
          currentState,
          settings,
          horizontal,
          vertical
        );
        cropperRef.current.setState(newState);
      }
    }
  };

  const onUpdate = () => {
    previewRef.current?.refresh();
  };

  const handleSave = async () => {
    if (cropperRef.current) {
      onSave((await cropperRef.current.getCanvas()?.toDataURL()) || "");
      onCloseModal();
    }
  };

  return (
    <div>
      <div>
        <h2
          style={{
            // textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Chỉnh sửa hình ảnh sản phẩm
        </h2>
      </div>
      <div className="flex h-1/2 gap-10">
        <Cropper
          ref={cropperRef}
          className="cropper"
          stencilProps={{
            aspectRatio: 1 / 1,
          }}
          src={src}
          onUpdate={onUpdate}
          style={{ width: "400px", height: "400px" }} // Set the size of the Cropper here
        />
        <div className="flex flex-col gap-3">
          <div>
            <h2>Xem trước</h2>
          </div>
          <CropperPreview
            ref={previewRef}
            cropper={cropperRef}
            className="preview"
            style={{ width: "120px", height: "120px" }} // Set the size of the CropperPreview here
          />
        </div>
      </div>
      <div>
        <button onClick={() => rotate(90)}>
          <span>Rotate 90 degrees</span>
        </button>
        <button onClick={() => flip(true, false)}>
          <span>Flip horizontally</span>
        </button>
      </div>
    </div>
  );
};
