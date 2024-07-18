import { Footer } from "@/components/organisms/Common/Footer";
import { NavbarWrapper } from "@/components/organisms/Common/Header/Navbar/NavbarWrapper/index-temp";
import { FC } from "react";

type TemplateCheckout = {
  children: React.ReactNode;
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-blue-500 border-b shadow-md">
      <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
        {/* Navbar Wrapper */}
        <NavbarWrapper />

        {/* Header with Search and Cart */}
        <div className="flex  items-center py-1 bg-blue-500 shadow-md max-h-24 max-w-full">
          {/* Logo */}
          <div className="flex pl-4 items-start justify-normal ">
            <a href="/">
              <h1 className=" bottom-0 text-4xl text-white">VTV</h1>
            </a>
          </div>
          <div className="border-r border-white h-8 ml-4"></div>
          <div className="ml-4">
            <span className="text-2xl text-white">Thanh toán</span>{" "}
          </div>
        </div>
      </div>
    </header>
  );
};
export const TemplateCheckout: FC<TemplateCheckout> = ({ children }) => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between ">
        <Header />
        <main className="bg-[#F5F5F5]">
          <div className="flex flex-col  max-w-7xl mx-auto lg:max-w-screen-2xl">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
