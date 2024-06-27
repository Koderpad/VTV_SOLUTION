import { useState } from "react";

interface OptionsSuffixInputProps {
  onInputChange?: (value: string) => void;
  error?: string;
}

const OptionsSuffixInput: React.FC<OptionsSuffixInputProps> = ({
  onInputChange,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    if (!isTouched) {
      setIsTouched(true);
    }
    onInputChange && onInputChange(event.target.value);
  };

  const isError = isTouched && inputValue.length === 0;

  return (
    <div className="w-full p-2">
      <div
        className={`relative flex border rounded-lg overflow-hidden ${
          isError ? "border-red-500" : "border-gray-300"
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="flex-grow focus:outline-none py-2 px-3"
          placeholder="nhập đi em"
          maxLength={20}
        />
        <div
          className="flex-none flex items-center text-lg bg-white px-2"
          style={{ width: "50px" }}
        >
          <div className="border-l h-full mx-2"></div>
          {inputValue.length}/20
        </div>
      </div>

      {isError && (
        <p className="text-red-500 text-xl mt-1">Không được để trống ô</p>
      )}
      {error && !isError && (
        <p className="text-red-500 text-xl mt-1">{error}</p>
      )}
    </div>
  );
};

export default OptionsSuffixInput;
