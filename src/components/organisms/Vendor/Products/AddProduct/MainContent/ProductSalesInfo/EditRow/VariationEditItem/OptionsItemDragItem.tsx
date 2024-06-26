import OptionsSuffixInput from "../InputContentVariation/OptionsSuffixInput";
import { FC } from "react";

interface OptionsItemDragItemProps {
  onInputChange?: (value: string) => void;
  onRemove?: () => void;
  error?: string;
}

export const OptionsItemDragItem: FC<OptionsItemDragItemProps> = ({
  onInputChange,
  onRemove,
  error,
}) => {
  return (
    <div
      id="options-item drag-item"
      className="flex justify-center items-center pr-16 w-auto"
    >
      <div id="popover-wrap variation-input-item">
        <div id="shopee-input" className="flex w-[310px]">
          <OptionsSuffixInput onInputChange={onInputChange} error={error} />
        </div>
      </div>
      <div id="options-action" className="">
        <span id="options-item-btn options-drag-btn" className="mr-2">
          <span id="handle">
            <i id="shopee-icon">{"<>"}</i>
          </span>
        </span>
        <span id="options-item-btn options-remove-btn" onClick={onRemove}>
          <span>
            <i id="shopee-icon">X</i>
          </span>
        </span>
      </div>
    </div>
  );
};
