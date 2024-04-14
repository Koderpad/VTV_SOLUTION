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
    <header className="bg-blue-500 shadow-md w-screen">
      {/* Navbar Wrapper */}
      <NavbarWrapper />

      {/* Header with Search and Cart */}
      <HeaderWithSearchWrapper />
    </header>
  );
};

// ...Include other component definitions like Logo, SearchBar, CartTooltip here or in their respective files
