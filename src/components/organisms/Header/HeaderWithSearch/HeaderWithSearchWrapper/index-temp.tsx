import { Logo } from "../Logo/index-temp";
import { SearchBar } from "../Search/index-temp";
import { CartTooltip } from "../../Tooltips/Cart/index-temp";

export const HeaderWithSearchWrapper = () => {
  return (
    <div className="flex justify-center items-center p-4 bg-blue-500 shadow-md max-h-24 max-w-full">
      {/* Logo */}
      <div className="flex pl-4 w-1/6 items-start justify-normal relative">
        <Logo />
        <h1 className="absolute right-2 bottom-0 text-4xl text-white">VTV</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-grow">
        <SearchBar />
      </div>

      {/* Cart Tooltip */}
      <div className="mx-4">
        <CartTooltip />
      </div>
    </div>
  );
};
