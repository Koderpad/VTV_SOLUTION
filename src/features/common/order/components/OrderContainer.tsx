import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateOrderMutation,
  useCreateUpdateOrderMutation,
  useSaveOrderMutation,
} from "../../../redux/features/order/orderApiSlice";
import { useLocation } from "react-router-dom";
import {
  useGetVoucherByShopIdQuery,
  useGetVoucherSystemQuery,
} from "../../redux/api/voucherApi";
import { VoucherDTO } from "../interfaces/voucher";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { AddressInfo } from "./AddressInfo";
import { OrderDetails } from "./OrderDetails";
import {
  AddressDTO,
  OrderItemDTO,
} from "@/utils/DTOs/common/Order/Response/MultipleOrderResponse";
import { Order } from "@/components/organisms/Order";

export const orderContainer = () => {
  const [orderDetails, setOrderDetails] = useState<OrderItemDTO>(null);
  const [address, setAddress] = useState<AddressDTO | null>(null);

  const [selectedVouchersOfSystem, setSelectedVouchersOfSystem] = useState<
    number[]
  >([]);

  const [saveOrder] = useSaveOrderMutation();
  const [createUpdateOrder] = useCreateUpdateOrderMutation();

  const navigate = useNavigate();
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [showSystemVoucherForm, setShowSystemVoucherForm] = useState(false);

  // Sử dụng hook để lấy danh sách voucher của hệ thống
  const { data: systemVouchers } = useGetVoucherSystemQuery("system");

  // Sử dụng các interface để đảm bảo kiểu dữ liệu
  const systemFromVouchers: VoucherDTO[] | undefined =
    systemVouchers?.voucherDTOs;

  const handleVouchersOfSystem = (voucherId: number) => {
    // Kiểm tra xem voucher đã được chọn chưa
    if (selectedVouchersOfSystem.includes(voucherId)) {
      // Nếu đã chọn, loại bỏ khỏi danh sách
      setSelectedVouchersOfSystem(
        selectedVouchersOfSystem.filter((id) => id !== voucherId)
      );
    } else {
      // Nếu chưa chọn, thêm vào danh sách
      setSelectedVouchersOfSystem([...selectedVouchersOfSystem, voucherId]);
    }
  };

  const shopFromVoucher: VoucherDTO[] | undefined = [];

  const handleToggleVoucherForm = () => {
    setShowVoucherForm(!showVoucherForm);
  };

  const handlePlaceOrder = async () => {};

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return <Order />;
};
