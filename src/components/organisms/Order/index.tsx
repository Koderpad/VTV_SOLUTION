export const Order = () => {
  return (
    <>
      <div className="bg-gray">
        {/* shop label */}
        <div className="flex bg-white h-full w-full py-8 mt-44 items-center">
          {/* Image */}
          <img
            src="/logo_border.png"
            alt="Description of the image"
            className="mr-8 ml-4"
            style={{ width: "50px", height: "50px" }}
          />

          <div className="flex items-center">
            <span className="whitespace-nowrap">VTC</span>

            <div className="h-10 w-1 bg-black ml-4"></div>
            <span className="whitespace-nowrap ml-4">Thanh Toán</span>
          </div>
        </div>

        {/* address */}
        <div className="w-4/5 mx-auto mt-12 bg-white flex flex-col h-auto rounded-md">
          {address && <AddressInfo address={address} />}
        </div>

        {/* item */}
        <OrderDetails
          orderDetails={orderDetails}
          shopFromVoucher={shopFromVoucher || []}
          formatPrice={formatPrice}
        />

        <div className="w-4/5 mx-auto mt-4 bg-white flex flex-col">
          <div className="bg-white flex flex-col shadow-md rounded px-8 py-6 mb-4">
            {/* transf method */}

            {/* payment method */}
            <div className="bg-white flex justify-between mb-4">
              <span className="text-gray-700 text-2xl font-medium">
                Phương thức thanh toán
              </span>
              <span className="text-gray-700 text-2xl font-medium ml-auto">
                Thanh Toán khi nhận hàng (COD)
              </span>
            </div>
            <div className="border-t my-4 border-black-200"></div>

            {/* price */}
            <div className="flex flex-col  rounded px-8 py-6 mb-4">
              {/* Existing content */}
              <div className="bg-white flex justify-between mb-4">
                <span className="text-gray-700 text-2xl font-medium">
                  Tổng tiền hàng
                </span>
                <span className="text-gray-700 text-2xl font-medium">
                  {updateOrderResponse &&
                    formatPrice(updateOrderResponse.orderDTO.totalPrice)}{" "}
                  VNĐ
                </span>
              </div>
              {/* Tiền vận chuyển Section */}
              <div className="bg-white flex justify-between mb-4">
                <span className="text-gray-700 text-2xl font-medium">
                  Tiền giảm voucher
                </span>
                <span className="text-red-500 text-2xl font-medium">
                  -
                  {updateOrderResponse &&
                    formatPrice(updateOrderResponse.orderDTO.discount)}{" "}
                  VNĐ
                </span>
              </div>
              {/* Tiền vận chuyển Section */}
              <div className="bg-white flex justify-between mb-4">
                <span className="text-gray-700 text-2xl font-medium">
                  Phí vận chuyển
                </span>
                <span className="text-gray-700 text-2xl font-medium">
                  {updateOrderResponse &&
                    formatPrice(updateOrderResponse.orderDTO.shippingFee)}{" "}
                  VNĐ
                </span>
              </div>
              <div className="border-t my-4 border-black-200"></div>
              {/* Tổng tiền Section */}
              <div className="bg-white flex justify-between mb-4">
                <span className="text-gray-700 text-2xl font-medium">
                  Tổng tiền
                </span>
                <span className="text-gray-700 text-2xl font-medium">
                  {updateOrderResponse &&
                    formatPrice(updateOrderResponse.orderDTO.paymentTotal)}{" "}
                  VNĐ
                </span>
              </div>
            </div>

            <div className="border-t my-4 border-black-200"></div>

            {/* dat hang */}
            <div className="w-4/5 mx-auto mb-8 flex justify-end">
              <button
                onClick={handlePlaceOrder}
                className="bg-blue-500 hover:bg-blue-800 focus:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Đặt hàng
              </button>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
};
