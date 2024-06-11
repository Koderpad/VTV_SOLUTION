import CategoryList from "@/components/organisms/Home/CategoryList";
import { TemplateV1 } from "../TemplateV1";

export const HomePageTemplate = () => {
  return (
    <TemplateV1>
      <div className="bg-red-200">Banners</div>
      <CategoryList />
    </TemplateV1>
  );
};
// import { Footer } from "@/components/organisms/Footer";
// import { Header } from "@/components/organisms/Header/index-temp";
// import CategoryList from "@/components/organisms/Home/CategoryList";
//
// export const HomePageTemplate = () => {
//   return (
//     <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
//       <div className="flex flex-col justify-between ">
//         <Header />
//         <main className="bg-[#F5F5F5]">
//           <div className="flex flex-col  max-w-7xl mx-auto lg:max-w-screen-2xl">
//             <div className="bg-red-200">Banners</div>
//             <CategoryList />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// };
