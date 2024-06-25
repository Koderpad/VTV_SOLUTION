import { Footer } from "@/components/organisms/Common/Footer";
import { Header } from "@/components/organisms/Common/Header/index-temp";
import { ProductGrid } from "@/components/organisms/Common/ProductGrid";

export const CategoryResultsTemplate = () => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between ">
        <Header />
        <main>
          <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
            {/* <ProductGrid /> */}
            {/* <ProductDetailContainer />
            <ProductReviews /> */}
            <ProductGrid />
            {/* <ProductDetail /> */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
