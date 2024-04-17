import { NavbarWrapper } from "./Navbar/NavbarWrapper/index-temp";
import { HeaderWithSearchWrapper } from "./HeaderWithSearch/HeaderWithSearchWrapper/index-temp";

const cartContent = [
  {
    name: "Sản phẩm 1",
    link: "/san-pham-1",
  },
  {
    name: "Sản phẩm 2",
    link: "/san-pham-2",
  },
  // ...các sản phẩm khác
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-blue-500 border-b shadow-md">
      <div className="flex justify-between max-w-xl pb-2 mx-auto  lg:flex-col lg:max-w-screen-xl">
        {/* <div className="bg-blue-500 shadow-md w-screen"> */}
        {/* Navbar Wrapper */}
        <NavbarWrapper />

        {/* Header with Search and Cart */}
        <HeaderWithSearchWrapper />
        {/* </div> */}
      </div>
    </header>
  );
};

// ...Include other component definitions like Logo, SearchBar, CartTooltip here or in their respective files
