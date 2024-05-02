import { Cart } from "@/components/organisms/Cart";
import { useGetListCartByUsernameQuery } from "@/redux/features/cart/cartApiSlice";
import { useCreateMultiOrderMutation } from "@/redux/features/order/orderApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CartContainer = () => {
  const { data, isLoading, refetch } = useGetListCartByUsernameQuery();

  const [
    createOrder,
    { isLoading: isLoadingOrder, isError: isErrorOrder, data: orderData },
  ] = useCreateMultiOrderMutation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const selectedProducts: string[] = [];

  const handleCreateOrder = async (cartIds: string[]) => {
    try {
      setLoading(true); // Hiển thị modal loading

      // Simulate a delay for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // const orderDetails = Object.values(selectedProducts).flat();
      const res = await createOrder(cartIds);
      if (res.error) {
        if (
          res.error.data.message ===
            "Thông báo: Khách hàng chưa có địa chỉ nào." &&
          res.error.status === 404
        ) {
          alert("Địa chỉ của bạn chưa có, vui lòng thêm địa chỉ!");
          navigate("/user/account/address");
          return;
        }
      }
      console.log("res", res);
      setSuccess(true); // Hiển thị thành công
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/checkout", { state: { res: res } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ẩn modal loading
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-400">Cart is empty</p>
      </div>
    );
  }

  return (
    <Cart
      data={data}
      isLoading={isLoading}
      refetch={refetch}
      handleCreateOrder={handleCreateOrder}
    />
  );
};
