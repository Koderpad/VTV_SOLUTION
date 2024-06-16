import ShopDetail from "@/components/organisms/ShopDetail";
import { TemplateV1 } from "../TemplateV1";
import { CarouselItemProductListContainer } from "@/features/common/shared/CarouselItemProductListContainer";

export const ShopDetailTemplate = () => {
  return (
    <TemplateV1>
      <ShopDetail />
      <CarouselItemProductListContainer />
    </TemplateV1>
  );
};
