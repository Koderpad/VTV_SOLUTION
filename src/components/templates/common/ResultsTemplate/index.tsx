import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header/index-temp";
import { ProductGrid } from "@/components/organisms/ProductGrid";

export const ResultsTemplate = () => {
  return (
    <div className="max-w-6xl mx-auto lg:max-w-7xl xl:max-w-full">
      <div className="flex flex-col justify-between ">
        <Header />
        <main>
          <div className="flex justify-between max-w-7xl mx-auto lg:flex-row lg:max-w-screen-2xl">
            <ProductGrid />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};