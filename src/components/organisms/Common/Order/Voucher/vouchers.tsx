import React, { useState, useEffect } from "react";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface VouchersProps {
  vouchers: VoucherDTO[] | undefined;
  onClose: () => void;
  onVoucherSelect_fix: (voucherId: number, voucherCode: string) => void;
  selectedVouchers: number[] | undefined;
}

const Vouchers: React.FC<VouchersProps> = ({
  vouchers,
  onClose,
  onVoucherSelect_fix,
  selectedVouchers,
}) => {
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState<number | null>(
    selectedVouchers && selectedVouchers.length > 0
      ? selectedVouchers[0]
      : null,
  );
  const [lastCheckedVoucher, setLastCheckedVoucher] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (selectedVouchers && selectedVouchers.length > 0) {
      setTempSelectedVoucher(selectedVouchers[0]);
      setLastCheckedVoucher(selectedVouchers[0]);
    }
  }, [selectedVouchers]);

  const handleVoucherSelect = (voucherId: number, checked: boolean) => {
    if (checked) {
      setTempSelectedVoucher(voucherId);
      setLastCheckedVoucher(voucherId);
    } else {
      setTempSelectedVoucher(null);
    }
  };

  const handleConfirm = () => {
    if (tempSelectedVoucher) {
      const selectedVoucherObj = vouchers?.find(
        (v) => v.voucherId === tempSelectedVoucher,
      );
      if (selectedVoucherObj) {
        onVoucherSelect_fix(
          selectedVoucherObj.voucherId,
          selectedVoucherObj.code,
        );
      }
    } else if (lastCheckedVoucher) {
      const lastCheckedVoucherObj = vouchers?.find(
        (v) => v.voucherId === lastCheckedVoucher,
      );
      if (lastCheckedVoucherObj) {
        onVoucherSelect_fix(
          lastCheckedVoucherObj.voucherId,
          lastCheckedVoucherObj.code,
        );
      }
    }
    onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chọn voucher</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Danh sách voucher</DialogTitle>
          <DialogDescription>
            Chọn voucher để áp dụng vào đơn hàng của bạn
          </DialogDescription>
          <div className="border-t border-gray-300 w-full my-2"></div>
        </DialogHeader>
        <div className="space-y-4">
          {vouchers &&
            vouchers.map((voucher) => (
              <div
                key={voucher.voucherId}
                className="flex items-start space-x-3"
              >
                <Checkbox
                  id={`voucher-${voucher.voucherId}`}
                  checked={tempSelectedVoucher === voucher.voucherId}
                  onCheckedChange={(checked) =>
                    handleVoucherSelect(voucher.voucherId, checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={`voucher-${voucher.voucherId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="font-bold">{voucher.name}</span>
                    <span className="mx-2">|</span>
                    <span className="font-mono">{voucher.code}</span>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {voucher.quantity} | {voucher.discount} |{" "}
                    {voucher.description} | {voucher.endDate}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <DialogFooter className="flex gap-4">
          <div className="border-t border-gray-300 w-full mb-8"></div>
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
          </DialogClose>
          <DialogClose>
            <Button type="submit" onClick={handleConfirm}>
              Xác nhận
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Vouchers;
// import React, { useState } from "react";
// import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";
//
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// interface VouchersProps {
//   vouchers: VoucherDTO[] | undefined;
//   onClose: () => void;
//   onVoucherSelect_fix: (voucherId: number, voucherCode: string) => void;
//   selectedVouchers: number[] | undefined; // Add a prop for selected vouchers
// }
//
// const Vouchers: React.FC<VouchersProps> = ({
//   vouchers,
//   onClose,
//   onVoucherSelect_fix,
//   selectedVouchers,
// }) => {
//   console.log("{selectedVouchers}: ", selectedVouchers);
//   return (
//     <>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline">Chọn voucher</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>Danh sách voucher</DialogTitle>
//             <DialogDescription>
//               Chọn voucher để áp dụng vào đơn hàng của bạn
//             </DialogDescription>
//             <div className="border-t border-gray-300 w-full my-2"></div>
//           </DialogHeader>
//           <RadioGroup
//             defaultValue={
//               selectedVouchers ? selectedVouchers.at(0)?.toString() : ""
//             }
//             onValueChange={(e) => {
//               console.log(e);
//               onVoucherSelect_fix(
//                 parseInt(e),
//                 vouchers?.find((v) => v.voucherId === parseInt(e))?.code || "",
//               );
//             }}
//           >
//             {vouchers &&
//               vouchers.map((voucher) => (
//                 <div className="flex pt-4">
//                   <div className="flex items-center space-x-2 pr-4">
//                     <RadioGroupItem
//                       value={voucher.voucherId.toString()}
//                       id={voucher.voucherId.toString()}
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <div className="flex mb-1">
//                       <div className="flex mr-2">
//                         <span className="font-bold">{voucher.name}</span>
//                         <div className="border-r border-gray-300 h-8 mx-2"></div>
//                         <span className="font-mono">{voucher.code}</span>
//                       </div>
//                     </div>
//                     <div className="flex mb-1">
//                       <div className="flex flex-col mr-2">
//                         <div className="">{voucher.quantity}</div>
//                         <div className="">
//                           {voucher.discount}, {voucher.description},{" "}
//                           {voucher.endDate}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex mt-1"></div>
//                   </div>
//                 </div>
//               ))}
//           </RadioGroup>
//           <DialogFooter className="flex gap-4">
//             <div className="border-t border-gray-300 w-full mb-8"></div>
//             <DialogClose asChild>
//               <Button type="button" variant="secondary">
//                 Hủy
//               </Button>
//             </DialogClose>
//             <DialogClose asChild>
//               <Button type="submit" onClick={() => null}>
//                 Xác nhận
//               </Button>
//             </DialogClose>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
//
// export default Vouchers;
