import { NavbarWrapper } from "./Navbar/NavbarWrapper/index-temp";
import { HeaderWithSearchWrapper } from "./HeaderWithSearch/HeaderWithSearchWrapper/index-temp";


export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-blue-500 border-b shadow-md">
      <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
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
