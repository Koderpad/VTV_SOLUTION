import { useState, useEffect, useRef, useCallback } from "react";
import { getShopVoucher } from "@/services/common/VoucherService";
import { VoucherDTO } from "@/utils/DTOs/common/Voucher/Response/ListVoucherResponse";

export const useShopVoucher = (id: number) => {
  const [shopVouchers, setShopVouchers] = useState<VoucherDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isCallingAPI = useRef(false);

  const fetchShopVoucher = async (id: number) => {
    if (isCallingAPI.current) return;

    isCallingAPI.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getShopVoucher(id);
      setShopVouchers(data.voucherDTOs);
    } catch (error) {
      setError("Failed to fetch shop vouchers");
    } finally {
      isCallingAPI.current = false;
      setIsLoading(false);
    }
  };

  const optimizeFetchShopVoucher = useCallback(fetchShopVoucher, []);

  useEffect(() => {
    optimizeFetchShopVoucher(id);
  }, []);

  //   useEffect(() => {
  //     // fetchShopVoucher(id);
  //     optimizeFetchShopVoucher(id);
  //   }, []);

  return { shopVouchers, isLoading, error, fetchShopVoucher };
};
