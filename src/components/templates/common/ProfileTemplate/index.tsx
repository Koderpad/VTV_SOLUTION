import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header/index-temp";
import { Account, MyAccount } from "@/components/organisms/Account";
import { ProductReviews } from "@/components/organisms/ProductDetail/ProductReviews";
import { ProductDetailContainer } from "@/features/common/product/productdetail/components/container/ProductDetailContainer";

export const AccountTemplate = () => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between ">
        <Header />
        <main>
          <div className="flex justify-between max-w-7xl mx-auto lg:flex-col lg:max-w-screen-2xl">
            {/* <ProductGrid /> */}
            {/* <ProductDetailContainer />
            <ProductReviews /> */}
            <Account />
            {/* <ProductDetail /> */}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
