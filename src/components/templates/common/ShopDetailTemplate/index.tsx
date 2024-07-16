import ShopDetail from "@/components/organisms/Common/ShopDetail";
import { TemplateV1 } from "../TemplateV1";
import { CarouselItemProductListContainer } from "@/features/common/shared/CarouselItemProductListContainer";

export const ShopDetailTemplate = () => {
  return (
    <TemplateV1>
      <ShopDetail />
      <div className="mb-4">
        <span className="text-4xl">Có thể bạn nên biết</span>
      </div>
      <CarouselItemProductListContainer />
    </TemplateV1>
  );
};
