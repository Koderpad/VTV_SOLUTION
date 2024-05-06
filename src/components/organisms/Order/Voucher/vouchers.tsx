import React, { useState } from "react";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

interface VouchersProps {
  vouchers: VoucherDTO[] | undefined;
  onClose: () => void;
  onVoucherSelect_fix: (voucherId: number, voucherCode: string) => void;
  selectedVouchers: number[] | undefined; // Add a prop for selected vouchers
}

const Vouchers: React.FC<VouchersProps> = ({
  vouchers,
  onClose,
  onVoucherSelect_fix,
  selectedVouchers,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleOnClose = () => {
    setIsVisible(false);
    onClose();
  };
  return (
    <>
      {isVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-70 flex items-center justify-center overflow-hidden z-50 ">
          <div className="bg-gray-100 p-4 relative">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center"
              onClick={handleOnClose}
            >
              x
            </button>
            <div className="border border-solid  z-50">
              {/* Form nhập voucher */}
              <div className="flex flex-col">
                <div className=" p-4 rounded-md mb-4 mt-2">
                  <div className="flex flex-row items-center mb-2">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      className="py-2 px-3 border rounded outline-none mr-2"
                    />
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {/* Duyệt và hiển thị các khung voucher */}
                {vouchers &&
                  vouchers.map((voucher) => (
                    <div
                      className="flex flex-row items-center mb-4"
                      key={voucher.voucherId}
                    >
                      <img
                        className="w-6 h-6 rounded-full mr-4"
                        src=" https://via.placeholder.com/150"
                      />
                      <p className="justify-center mt-8 ml-4">{voucher.name}</p>
                      <input
                        type="checkbox"
                        className="ml-36 h-4 w-4"
                        onChange={() =>
                          onVoucherSelect_fix(voucher.voucherId, voucher.code)
                        }
                        checked={
                          selectedVouchers
                            ? selectedVouchers.includes(voucher.voucherId)
                            : false
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vouchers;
