import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header/index-temp";
import { ProductDetailContainer } from "@/features/common/product/productdetail/components/container/ProductDetailContainer";

export const ProductDetailTemplate = () => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between ">
        <Header />
        <main>
          <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
            {/* <ProductGrid /> */}
            <ProductDetailContainer />
            {/* <ProductDetail /> */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
