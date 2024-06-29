import { Orders } from "@/components/organisms/Vendor/Orders";
import { TemplateVendorV1 } from "./TemplateVendorV1";
import { AddProduct } from "@/components/organisms/Vendor/Products/AddProduct";

export const OrdersTemplate = () => {
  return (
    <TemplateVendorV1>
      <Orders />
    </TemplateVendorV1>
  );
};
