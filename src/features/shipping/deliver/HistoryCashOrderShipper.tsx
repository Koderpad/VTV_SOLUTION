import {useNavigate} from 'react-router-dom';
import {
    useHistoryCashOrdersByShipperMutation,
} from '@/redux/features/shipping/CashOrderApiSlice';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect, useState} from "react";
import {statusToString} from '@/utils/DTOs/extra/convertToString/statusToString';
import {FaEye} from "react-icons/fa";
import dayjs from "dayjs";
import {CashOrdersByDateDTO} from "@/utils/DTOs/shipping/dto/CashOrdersByDateDTO.ts"; // Import icons

const HistoryCashOrderShipper = () => {
    const navigate = useNavigate();
    const [cashOrdersByDates, setCashOrdersByDates] = useState<CashOrdersByDateDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedHold, setSelectedHold] = useState(false);
    const [selectedShipping, setSelectedShipping] = useState(false);
    const [selectedOption, setSelectedOption] = useState('shipped');

    const [historyCashOrdersByShipper, {
        isLoading: isLoadingCashOrders,
        error: errorCashOrders,
        data: cashOrdersData
    }] = useHistoryCashOrdersByShipperMutation();

    useEffect(() => {
        // Trigger the mutation to fetch data
        historyCashOrdersByShipper({shipperHold: selectedHold, shipping: selectedShipping});
    }, [selectedHold, selectedShipping, historyCashOrdersByShipper]);

    useEffect(() => {
        if (isLoadingCashOrders) {
            setIsLoading(true);
        } else if (errorCashOrders) {
            setError(errorCashOrders.message);
        } else {
            setCashOrdersByDates(cashOrdersData?.cashOrdersByDateDTOs || []);
            setIsLoading(false);
        }
    }, [isLoadingCashOrders, errorCashOrders, cashOrdersData]);

    const handleViewOrder = (cashOrderId: string) => {
        navigate(`/deliver/cash-order/detail/${cashOrderId}`);
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'shipperHold') {
            setSelectedHold(true);
            setSelectedShipping(false);
        } else if (event.target.value === 'shipping') {
            setSelectedHold(false);
            setSelectedShipping(true);
        } else {
            setSelectedHold(false);
            setSelectedShipping(false);
        }
    };

    const renderCashOrdersByDates = () => {
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

        return (
            <div>
                <div className="mb-4 flex items-center">
                    <select
                        className="text-gray-700"
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        <option value="shipped">Đã chuyển tiền</option>
                        <option value="shipperHold">Cầm tiền</option>
                        <option value="shipping">Đang vận chuyển</option>
                    </select>
                </div>

                {cashOrdersByDates.length === 0 &&
                    <div className="flex justify-center items-center h-screen">
                        <span className="text-xl text-gray-700">Không có lịch sử đơn hàng nào</span>
                    </div>
                }

                <div>
                    {cashOrdersByDates.map((cashOrdersByDate, index) => (
                        <div key={index}>
                            <br/>
                            <h2 className="text-2xl font-bold text-black mb-4">
                                Ngày: {dayjs(cashOrdersByDate.date).format('DD/MM/YYYY')}
                            </h2>
                            <h3 className="text-lg font-bold text-black mb-4">
                                Tổng số biên lai: {cashOrdersByDate.cashOrderDTOs.length} -
                                Tổng số tiền: {cashOrdersByDate.totalMoney.toLocaleString()} VNĐ
                            </h3>
                            <table className="min-w-full bg-white">
                                <thead>
                                <tr>
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
                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                        Trạng thái
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                        Thao tác
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {cashOrdersByDate.cashOrderDTOs.map((cashOrder, index) => (
                                    <tr key={cashOrder.cashOrderId}>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{cashOrder.cashOrderId}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-right">{cashOrder.money.toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-right">
                                            {cashOrder.createAt ? dayjs(cashOrder.createAt).format('DD/MM/YYYY') : ''}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{statusToString[cashOrder.status]}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            <div className="flex justify-center items-center">
                                                <FaEye
                                                    className="text-blue-500 cursor-pointer hover:text-blue-600"
                                                    onClick={() => handleViewOrder(cashOrder.cashOrderId)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
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
            </div>
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Lịch sử biên lai</h1>
            {renderCashOrdersByDates()}
            <ToastContainer/>
        </div>
    );
};

export default HistoryCashOrderShipper;