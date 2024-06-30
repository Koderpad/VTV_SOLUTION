import Products from "@/components/organisms/Vendor/Products";
import { TemplateVendorV1 } from "./TemplateVendorV1";
import { AddProduct } from "@/components/organisms/Vendor/Products/AddProduct";
import { Revenue } from "@/components/organisms/Vendor/Revenue";

export const RevenueTemplate = () => {
  return (
    <TemplateVendorV1>
      <Revenue />
    </TemplateVendorV1>
  );
};
