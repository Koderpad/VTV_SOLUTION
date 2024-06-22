import {useParams, useNavigate} from 'react-router-dom';
import {useGetAllCashOrdersByShipperUsernameQuery} from '@/redux/features/shipping/CashOrderApiSlice';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect, useState} from "react";
import {CashOrderDTO} from '@/utils/DTOs/shipping/dto/CashOrderDTO';
import {statusToString} from '@/utils/DTOs/extra/convertToString/statusToString';
import {FaEye, FaCheckCircle, FaTimesCircle} from "react-icons/fa";

const CashOrderShipperPage = () => {
    const navigate = useNavigate();
    const [cashOrders, setCashOrders] = useState<CashOrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        data: cashOrdersData,
        isLoading: isLoadingCashOrders,
        error: errorCashOrders,
        refetch: refetchCashOrders
    } = useGetAllCashOrdersByShipperUsernameQuery();

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
        navigate(`/deliver/cash-order/detail/${cashOrderId}`);
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

        return (
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        STT
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        Mã đơn hàng
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        Số tiền
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
                        <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{cashOrder.cashOrderId}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-right">{cashOrder.money.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">{statusToString[cashOrder.status]}</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">

                                {cashOrder.shipperHold && <FaCheckCircle
                                    className="text-green-500 cursor-pointer hover:text-green-600 mr-2"/>}
                                {!cashOrder.shipperHold &&
                                    <FaTimesCircle className="text-red-500 cursor-pointer hover:text-red-600 mr-2"/>}
                            </div>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                            <div className="flex justify-center items-center">
                                <FaEye
                                    className="text-blue-500 cursor-pointer hover:text-blue-600 mr-2"
                                    onClick={() => handleViewOrder(cashOrder.cashOrderId)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>

                <button
                    className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                    onClick={() => navigate("/deliver/cash-order/shipper/can-update")}
                >
                    Xác nhận chuyển tiền
                </button>

                <button
                    className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
                    onClick={() => navigate("/deliver/cash-order/shipper/history")}
                >
                    Lịch sử
                </button>

            </div>
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Danh sách biên lai</h1>
            {renderCashOrders()}
            <ToastContainer/>
        </div>
    );
};

export default CashOrderShipperPage;