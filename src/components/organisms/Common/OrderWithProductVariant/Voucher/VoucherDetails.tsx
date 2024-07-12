// // VoucherDetails.tsx
// import React from "react";
// import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

// interface VoucherDetailsProps {
//   voucher: VoucherDTO;
// }

// const VoucherDetails: React.FC<VoucherDetailsProps> = ({ voucher }) => {
//   console.log("{voucher}: ", voucher);
//   return (
//     <div className="bg-white flex flex-col shadow-md rounded p-4 mb-4">
//       <div>
//         <strong>Name:</strong> {voucher.name}
//       </div>
//       <div>
//         <strong>Discount:</strong> {voucher.discount}
//         {voucher.type !== "Giảm theo tiền" ? "%" : "VNĐ"}
//       </div>
//       <div>
//         <strong>Type:</strong> {voucher.type}
//       </div>
//     </div>
//   );
// };

// export default VoucherDetails;

import React from "react";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

interface VoucherDetailsProps {
  voucher: VoucherDTO;
}

const VoucherDetails: React.FC<VoucherDetailsProps> = ({ voucher }) => {
  console.log("voucher: ", voucher);

  const getDiscountUnit = (type: string) => {
    return type.includes("PERCENTAGE") ? "%" : "₫";
  };

  const translateVoucherType = (type: string) => {
    switch (type) {
      case "PERCENTAGE_SHOP":
        return "Phần trăm cửa hàng";
      case "PERCENTAGE_SYSTEM":
        return "Phần trăm hệ thống";
      case "MONEY_SHOP":
        return "Tiền cửa hàng";
      case "MONEY_SYSTEM":
        return "Tiền hệ thống";
      default:
        return type;
    }
  };

  return (
    <div className="bg-white flex flex-col shadow-md rounded p-4 mb-4">
      <div>
        <strong>Tên:</strong> {voucher.name}
      </div>
      <div>
        <strong>Giảm giá:</strong> {voucher.discount}
        {getDiscountUnit(voucher.type)}
      </div>
      <div>
        <strong>Loại:</strong> {translateVoucherType(voucher.type)}
      </div>
    </div>
  );
};

export default VoucherDetails;
