import { OrderContainer } from "@/features/common/order/components/OrderContainer";
import { TemplateV1 } from "../TemplateV1";
import { TemplateCheckout } from "../TemplateCheckout";

export const CheckoutTemplate = () => {
  return (
    <TemplateCheckout>
      <OrderContainer />
    </TemplateCheckout>
  );
};
