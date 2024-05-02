import React, { useState } from "react";

interface InputQuantityProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const InputQuantity: React.FC<InputQuantityProps> = ({
  quantity,
  setQuantity,
}) => {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[\d]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newQuantity = Number(value);
      setQuantity(newQuantity > 1 ? newQuantity : 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        aria-label="Decrease"
        className="bg-white hover:bg-gray-200 rounded-l px-3 py-2"
        onClick={decreaseQuantity}
      >
        <svg
          enableBackground="new 0 0 10 10"
          viewBox="0 0 10 10"
          className="w-4 h-4 text-gray-600"
        >
          <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5" />
        </svg>
      </button>

      <input
        type="text"
        role="spinbutton"
        aria-live="assertive"
        aria-valuenow={quantity}
        value={quantity}
        onChange={handleQuantityChange}
        onKeyDown={handleKeyPress}
        className="w-12 text-center text-gray-700 font-semibold"
      />

      <button
        aria-label="Increase"
        className="bg-white hover:bg-gray-200 rounded-r px-3 py-2"
        onClick={increaseQuantity}
      >
        <svg
          enableBackground="new 0 0 10 10"
          viewBox="0 0 10 10"
          className="w-4 h-4 text-gray-600"
        >
          <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5" />
        </svg>
      </button>
    </div>
  );
};
