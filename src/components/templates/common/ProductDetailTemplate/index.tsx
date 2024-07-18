import { ProductReviews } from "@/components/organisms/Common/ProductDetail/ProductReviews";
import { ProductDetailContainer } from "@/features/common/product/productdetail/components/container/ProductDetailContainer";
import { TemplateV1 } from "../TemplateV1";
import { SimilarProductsCarouselContainer } from "@/features/common/shared/SimilarProductsCarouselContainer";

export const ProductDetailTemplate = () => {
  return (
    <TemplateV1>
      <ProductDetailContainer />
      <ProductReviews />
      <span className="mt-4 text-3xl font-bold"> Sản phẩm tương tự </span>
      <SimilarProductsCarouselContainer />
    </TemplateV1>
  );
};

// import { Footer } from "@/components/organisms/Footer";
// import { Header } from "@/components/organisms/Header/index-temp";
// import { ProductReviews } from "@/components/organisms/ProductDetail/ProductReviews";
// import { ProductDetailContainer } from "@/features/common/product/productdetail/components/container/ProductDetailContainer";
//
// export const ProductDetailTemplate = () => {
//   return (
//     <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
//       <div className="flex flex-col justify-between ">
//         <Header />
//         <main>
//           <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
//             {/* <ProductGrid /> */}
//             <ProductDetailContainer />
//             <ProductReviews />
//             {/* <ProductDetail /> */}
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// };
