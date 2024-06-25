import { Footer } from "@/components/organisms/Common/Footer";
import { Header } from "@/components/organisms/Common/Header/index-temp";
import ChatPage from "@/pages/common/ChatPage";
import { FC } from "react";

type TemplateV1 = {
  children: React.ReactNode;
};

export const TemplateV1: FC<TemplateV1> = ({ children }) => {
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
      <ChatPage /> {/* Add Chat component here */}
    </div>
  );
};
