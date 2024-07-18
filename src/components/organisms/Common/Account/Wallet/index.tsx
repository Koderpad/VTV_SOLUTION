import { useGetWalletByUsernameQuery } from "@/redux/features/common/wallet/walletApiSlice";
import React from "react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTransactionType = (type) => {
  switch (type) {
    case "REFUND":
      return "Hoàn tiền";
    case "PAYMENT_VNPAY":
      return "Thanh toán VNPAY";
    case "PAYMENT_WALLET":
      return "Thanh toán ví VTV";
    case "COMPLETED_ORDER_COD":
      return "Hoàn thành đơn hàng COD";
    case "COMPLETED_ORDER_VNPAY":
      return "Hoàn thành đơn hàng VNPAY";
    case "COMPLETED_ORDER_WALLET":
      return "Hoàn thành đơn hàng ví VTV";
    case "COMPLETED_ORDER":
    case "COMPLETED_ORDER_COD_SYSTEM":
      return "Hoàn thành đơn hàng";
    default:
      return type ?? "Khác";
  }
};

export const WalleCustomer = () => {
  const { data, isLoading, isError } = useGetWalletByUsernameQuery();

  if (isLoading) return <div className="text-center">Đang tải...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Có lỗi xảy ra khi tải dữ liệu ví
      </div>
    );

  const wallet = data?.walletDTO;
  const activeTransactions =
    wallet?.transactionDTOs.filter((t) => t.status === "ACTIVE") ?? [];

  return (
    <div className="mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ví của tôi</h2>
      {wallet && wallet.status === "ACTIVE" && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-2">Số dư hiện tại</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(wallet.balance)}
          </p>
        </div>
      )}
      <div className="bg-white max-h-96 shadow rounded-lg p-6 overflow-y-scroll">
        <h3 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h3>
        {activeTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {activeTransactions.map((transaction) => (
              <li key={transaction.transactionId} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {getTransactionType(transaction.type)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.createAt)}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${transaction.money > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(transaction.money)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Không có giao dịch nào.</p>
        )}
      </div>
    </div>
  );
};
