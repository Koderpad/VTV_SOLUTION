import { PanelHeader } from "./PanelHeader";
import { ProductTierVariation } from "./EditRow/ProductTierVariation";

export const ProductSalesInfo = () => {
  return (
    <section id="product-edit-section" className="mt-[16px] bg-[#FAFAF9]">
      <div
        id="product-detail-panel product-sales-info"
        className="px-[24px] pt-[24px]"
      >
        <PanelHeader title="Thông tin bán hàng" />
        <div id="panel-content-wrapper" className="mb-[24px]">
          <div id="panel-content" className="">
            {/* <NoVariations /> */}
            <ProductTierVariation />
          </div>
        </div>
      </div>
    </section>
  );
};
