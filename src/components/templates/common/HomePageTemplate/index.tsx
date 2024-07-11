import CategoryList from "@/components/organisms/Common/Home/CategoryList";
import { TemplateV1 } from "../TemplateV1";
import { CarouselTop10ItemProductListContainer } from "@/features/common/home/CarouselTop10ItemProductListContainer";
import Banner from "@/components/organisms/Common/Home/Banner";
import SuggestedProductList from "@/components/organisms/Common/Home/SuggestedProductList";

export const HomePageTemplate = () => {
  return (
    <TemplateV1>
      {/* <div className="bg-red-200">Banners</div> */}
      <Banner />
      <CategoryList />
      <div className="flex flex-col gap-4">
        <span className="text-2xl font-bold ">
          Top 10 sản phẩm bán chạy nhất
        </span>
        <CarouselTop10ItemProductListContainer />
      </div>
      <SuggestedProductList />
    </TemplateV1>
  );
};
