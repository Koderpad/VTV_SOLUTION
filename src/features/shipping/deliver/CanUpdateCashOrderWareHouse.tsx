import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useWareHouseUpdateCashOrdersByWaveHouseMutation,
    useGetCashOrdersCanUpdateByWareHouseUsernameQuery,
} from "@/redux/features/shipping/CashOrderApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CashOrderDTO } from "@/utils/DTOs/shipping/dto/CashOrderDTO";
import { statusToString } from "@/utils/DTOs/extra/convertToString/statusToString";
import { FaEye, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";

const CanUpdateCashOrderWareHouse = () => {
    const navigate = useNavigate();
    const [cashOrders, setCashOrders] = useState<CashOrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCashOrders, setSelectedCashOrders] = useState<string[]>([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const {
        data: cashOrdersData,
        isLoading: isLoadingCashOrders,
        error: errorCashOrders,
        refetch: refetchCashOrders,
    } = useGetCashOrdersCanUpdateByWareHouseUsernameQuery();

    const [updateCashOrders] = useWareHouseUpdateCashOrdersByWaveHouseMutation();

    useEffect(() => {
        if (isLoadingCashOrders) {
            setIsLoading(true);
        } else if (errorCashOrders) {
            setError(errorCashOrders.message);
        } else {
            setCashOrders(cashOrdersData?.cashOrderDTOs || []);
            setIsLoading(false);
        }
    }, [isLoadingCashOrders, errorCashOrders, cashOrdersData]);

    const handleViewOrder = (cashOrderId: string) => {
        navigate(`/warehouse/cash-order/detail/${cashOrderId}`);
    };

    const handleCashOrderCheckboxChange = (cashOrderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedCashOrders([...selectedCashOrders, cashOrderId]);
        } else {
            setSelectedCashOrders(selectedCashOrders.filter((id) => id !== cashOrderId));
        }
    };

    const handleUpdateCashOrders = async () => {
        if (selectedCashOrders.length === 0) {
            toast.error("Vui lòng chọn ít nhất một biên lai để xác nhận!");
            return;
        }

        setIsLoadingUpdate(true);
        try {
            const response = await updateCashOrders(selectedCashOrders).unwrap();
            if (response.code === 200) {
                toast.success("Xác nhận cập nhật đơn hàng thành công!");
                handleDeselectAll();
                refetchCashOrders();
            } else {
                toast.error("Xác nhận cập nhật đơn hàng thất bại!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra!");
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const handleSelectAll = () => {
        setSelectedCashOrders(cashOrders.map((order) => order.cashOrderId));
    };

    const handleDeselectAll = () => {
        setSelectedCashOrders([]);
    };

    const handleRemoveCashOrder = (cashOrderId: string) => {
        setSelectedCashOrders(selectedCashOrders.filter((id) => id !== cashOrderId));
    };

    const getCashOrderById = (cashOrderId: string) => {
        return cashOrders.find((order) => order.cashOrderId === cashOrderId);
    };

    const renderCashOrders = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Loading...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-red-500">Error: {error}</span>
                </div>
            );
        }

        if (cashOrders.length === 0) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Không có đơn hàng nào</span>
                </div>
            );
        }

        const totalMoneyUnselected = cashOrders.reduce((total, order) => {
            if (!selectedCashOrders.includes(order.cashOrderId)) {
                return total + order.money;
            }
            return total;
        }, 0);

        const totalMoneySelected = selectedCashOrders.reduce((total, cashOrderId) => {
            const order = getCashOrderById(cashOrderId);
            return order ? total + order.money : total;
        }, 0);

        return (
            <div>

                <div className="flex justify-between mb-4">
                    <span>Tổng số tiền chưa chọn: {totalMoneyUnselected.toLocaleString()} VNĐ</span>
                    <span>Tổng số tiền đã chọn: {totalMoneySelected.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-start items-center mb-4 space-x-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleSelectAll}
                    >
                        Chọn tất cả
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDeselectAll}
                    >
                        Bỏ chọn tất cả
                    </button>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Chọn
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            STT
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Mã biên lai
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                            Số tiền (VNĐ)
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                            Ngày
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                            Tài khoản giao hàng
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Trạng thái
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Đang cầm tiền
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Xem
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {cashOrders.map((cashOrder, index) => (
                        <tr key={cashOrder.cashOrderId}>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <div className="flex justify-center items-center">
                                    <input
                                        type="checkbox"
                                        id={`cashOrder-${cashOrder.cashOrderId}`}
                                        className="mr-2"
                                        checked={selectedCashOrders.includes(cashOrder.cashOrderId)}
                                        onChange={(event) =>
                                            handleCashOrderCheckboxChange(cashOrder.cashOrderId, event)
                                        }
                                    />
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cashOrder.cashOrderId}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-right">{cashOrder.money.toLocaleString()}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {cashOrder.createAt ? dayjs(cashOrder.createAt).format("DD/MM/YYYY") : ""}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {cashOrder.shipperUsername}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                {statusToString[cashOrder.status]}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <div className="flex justify-center items-center">
                                    {cashOrder.shipperHold && (
                                        <FaCheckCircle className="text-green-500 cursor-pointer hover:text-green-600 mr-2" />
                                    )}
                                    {!cashOrder.shipperHold && (
                                        <FaTimesCircle className="text-red-500 cursor-pointer hover:text-red-600 mr-2" />
                                    )}
                                    <button
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleRemoveCashOrder(cashOrder.cashOrderId)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <button
                                    className="text-blue-500 hover:text-blue-600"
                                    onClick={() => handleViewOrder(cashOrder.cashOrderId)}
                                >
                                    <FaEye />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>


                <br/>

                {selectedCashOrders.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-black mb-2">Danh sách biên lai đã chọn</h2>
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    STT
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    Mã biên lai
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    Ngày
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    Tài khoản giao hàng
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                                    Số tiền (VNĐ)
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    Xóa
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedCashOrders.map((cashOrderId, index) => {
                                const order = getCashOrderById(cashOrderId);
                                return order ? (
                                    <tr key={cashOrderId}>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{cashOrderId}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            {order.createAt ? dayjs(order.createAt).format("DD/MM/YYYY") : ""}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            {order.shipperUsername}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-right">{order.money.toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            <div className="flex justify-center items-center">
                                                <FaTrash
                                                    className="cursor-pointer hover:text-red-600" // Add hover effect
                                                    onClick={() => handleRemoveCashOrder(cashOrderId)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : null;
                            })}
                            </tbody>
                        </table>
                        <div className="mt-2 text-right">
                            <span>Tổng số tiền đã chọn: {totalMoneySelected.toLocaleString()} VNĐ</span>
                        </div>
                    </div>
                )}

                <br/>


                <div className="flex justify-center items-center mt-4">
                    <button
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${
                            isLoadingUpdate ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                        onClick={handleUpdateCashOrders}
                        disabled={isLoadingUpdate}
                    >
                        {isLoadingUpdate ? "Đang xử lý..." : "Cập nhật biên lai"}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-semibold text-center mb-8">
                Danh sách biên lai cần xác nhận
            </h1>
            {renderCashOrders()}
            <ToastContainer/>
        </div>
    );
};

export default CanUpdateCashOrderWareHouse;