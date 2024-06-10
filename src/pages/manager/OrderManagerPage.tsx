import React, {useEffect, useState} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {useGetOrderPageByStatusAndDateQuery} from "@/redux/features/manager/OrderManagerApiSlice.ts";
import {OrderStatus} from "@/utils/DTOs/extra/OrderStatus.ts";
import {orderStatusToString} from "@/utils/DTOs/extra/orderStatusToString.ts";
import dayjs from "dayjs";
import StatisticsOrderProps from "@/features/manager/order/StatisticsOrderProps.tsx";

const OrderManagerPage = () => {
    const [page, setPage] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING);
    const [selectedYear, setSelectedYear] = useState<string>(dayjs().format('YYYY'));
    const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('MM'));
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const {data: orderData, error: orderError, isLoading: orderLoading} = useGetOrderPageByStatusAndDateQuery({
        page: page,
        size: 10,
        status: selectedStatus,
        startDate: startDate,
        endDate: endDate
    });


    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value as OrderStatus);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    useEffect(() => {
        if (orderData) {
            setData(orderData);
        }
    }, [orderData]);

    if (orderLoading) return <div>Loading...</div>;
    if (orderError) return <div>Error: {orderError.message}</div>;

    const totalPages = data?.totalPage || 1;


    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">
                        <div className="flex justify-between items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                                onClick={() => navigate(-1)}
                            >
                                Quay Lại
                            </button>

                            <button
                                onClick={() => navigate('/manager/order/revenue')}
                                className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
                                Thống kê đơn hàng
                            </button>
                        </div>

                        <br/>

                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý đơn hàng</h1>
                        <br/>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block mb-2 font-medium">
                                    Chọn Năm:
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                >
                                    {[...Array(10)].map((_, i) => {
                                        const year = dayjs().subtract(i, 'year').format('YYYY');
                                        return <option key={year} value={year}>{year}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    Chọn Tháng:
                                </label>
                                <select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                >
                                    {Array.from({length: 12}, (_, i) => i + 1).map((month) => {
                                        const monthStr = month.toString().padStart(2, '0');
                                        return <option key={monthStr} value={monthStr}>{monthStr}</option>;
                                    })}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    Chọn Trạng Thái:
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    className="block w-full mt-1 p-2 border border-gray-300 rounded"
                                >
                                    {Object.values(OrderStatus).map((status) => (
                                        <option key={status} value={status}>{orderStatusToString[status]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <StatisticsOrderProps selectedYear={selectedYear} selectedMonth={selectedMonth} selectedStatus={selectedStatus}/>
                        </div>



                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã
                                        đơn hàng
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Khách
                                        hàng
                                    </th>

                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Tổng
                                        tiền (VNĐ)
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng
                                        thái
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày
                                        đặt hàng
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Xem
                                        chi tiết
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.orderDTOs.map((order, index) => (
                                    <tr key={order.orderId}>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1 + (page - 1) * 5}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.orderId}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.addressDTO.fullName}</td>

                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.totalPrice.toLocaleString()}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderStatusToString[order.status]}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{dayjs(order.createdAt).format('DD-MM-YYYY')}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                onClick={() => navigate(`/manager/order/detail/${order.orderId}`)}
                                                className="text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Đầu tiên
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Trước
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${pageNumber === page ? 'bg-gray-400' : ''}`}
                                        onClick={() => setPage(pageNumber)}>
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    hidden={totalPages === page}>
                                    Tiếp theo
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(totalPages)}
                                    disabled={page === totalPages}
                                    hidden={totalPages === page}>
                                    Cuối cùng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default OrderManagerPage;