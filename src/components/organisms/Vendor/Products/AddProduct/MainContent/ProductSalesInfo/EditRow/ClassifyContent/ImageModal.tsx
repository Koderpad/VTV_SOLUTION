import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void; // Add this line
  children?: React.ReactNode;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [_isOpen, set_IsOpen] = useState(isOpen);

  useEffect(() => {
    set_IsOpen(isOpen);
  }, [isOpen]);

  const handleCloseModal = () => {
    set_IsOpen(false);
    onClose(); // Call the onClose prop
  };

  return (
    <ReactModal
      isOpen={_isOpen}
      contentLabel="example modal"
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
          width: "40vw", // Set this to the desired value
          height: "45vw", // Set this to the same value as width
        },
      }}
      overlayClassName="Overlay"
    >
      {children}

      <button onClick={handleCloseModal}>Close Modal</button>
    </ReactModal>
  );
};
