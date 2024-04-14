import { Logo } from "../Logo/index-temp";
import { SearchBar } from "../Search/index-temp";
import { CartTooltip } from "../../Tooltips/Cart/index-temp";

const cartContent = [
  {
    name: "Sản phẩm 1",
    link: "/san-pham-1",
  },
  {
    name: "Sản phẩm 2",
    link: "/san-pham-2",
  },
];

export const HeaderWithSearchWrapper = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-blue-500 shadow-md max-h-24 max-w-full">
      {/* Logo */}
      <div className="w-1/6">
        <Logo />
      </div>

      {/* Search Bar */}
      <div className="flex-grow">
        <SearchBar />
      </div>

      {/* Cart Tooltip */}
      <div className="mx-4">
        <CartTooltip content={cartContent} />
      </div>
    </div>
  );
};
