// VoucherDetails.tsx
import React from "react";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

interface VoucherDetailsProps {
  voucher: VoucherDTO;
}

const VoucherDetails: React.FC<VoucherDetailsProps> = ({ voucher }) => {
  return (
    <div className="bg-white flex flex-col shadow-md rounded p-4 mb-4">
      <div>
        <strong>Name:</strong> {voucher.name}
      </div>
      <div>
        <strong>Discount:</strong> {voucher.discount}
        {voucher.type !== "Giảm theo tiền" ? "%" : "VNĐ"}
      </div>
      <div>
        <strong>Type:</strong> {voucher.type}
      </div>
    </div>
  );
};

export default VoucherDetails;
