import { OrderContainer } from "@/features/common/order/components/OrderContainer";
import { TemplateV1 } from "../TemplateV1";
import { TemplateCheckout } from "../TemplateCheckout";
import { OrderContainerWithProductVariant } from "@/features/common/order/components/OrderContainerWithProductVariant";

export const CheckoutWithProductVariantTemplate = () => {
  return (
    <TemplateCheckout>
      <OrderContainerWithProductVariant />
    </TemplateCheckout>
  );
};
