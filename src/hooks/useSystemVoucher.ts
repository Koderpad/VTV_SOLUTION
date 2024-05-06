import { useState, useEffect, useRef } from "react";
import { getSystemVoucher } from "@/services/common/VoucherService";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

export const useSystemVoucher = () => {
  const [systemVouchers, setSystemVouchers] = useState<VoucherDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isCallingAPI = useRef(false); // Biến tham chiếu để theo dõi trạng thái API call

  const fetchSystemVoucher = async () => {
    if (isCallingAPI.current) return; // Nếu đang gọi API thì không gọi lại

    isCallingAPI.current = true; // Đánh dấu đang gọi API
    setIsLoading(true);
    setError(null);

    try {
      const data = await getSystemVoucher();
      setSystemVouchers(data.voucherDTOs);
    } catch (error) {
      setError("Failed to fetch system vouchers");
    } finally {
      isCallingAPI.current = false; // Đánh dấu đã hoàn thành API call
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemVoucher();
  }, []);

  return { systemVouchers, isLoading, error, fetchSystemVoucher };
};

// // useSystemVoucher.ts
// import { useState, useEffect } from "react";
// import { getSystemVoucher } from "@/services/common/VoucherService";
// import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

// export const useSystemVoucher = () => {
//   const [systemVouchers, setSystemVouchers] = useState<VoucherDTO[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSystemVoucher = async () => {
//     if (isLoading) return;
//     console.log("fetchSystemVoucher");
//     setIsLoading(true);
//     setError(null);

//     try {
//       const data = await getSystemVoucher();
//       setSystemVouchers(data.voucherDTOs);
//     } catch (error) {
//       setError("Failed to fetch system vouchers");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSystemVoucher();
//   }, []);

//   return { systemVouchers, isLoading, error, fetchSystemVoucher };
// };
