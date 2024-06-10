import React, { useState } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { useStatisticsOrderByDateAndStatusQuery } from "@/redux/features/manager/RevenueManagerApiSlice.ts";
import { OrderStatus } from "@/utils/DTOs/extra/OrderStatus.ts";
import {orderStatusToString} from "@/utils/DTOs/extra/orderStatusToString.ts";

const StatisticsOrders = () => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING); // Default to PENDING
    const navigate = useNavigate();

    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const { data, error, isLoading } = useStatisticsOrderByDateAndStatusQuery({
        startDate: startDate,
        endDate: endDate,
        status: selectedStatus,
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value as OrderStatus); // Cast to OrderStatus
    };

    const barData = {
        labels: data?.statisticsOrderDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng số đơn hàng',
                data: data?.statisticsOrderDTOs.map((item) => item.totalOrder),
                backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red color
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
            },
            {
                label: 'Tổng sản phẩm',
                data: data?.statisticsOrderDTOs.map((item) => item.totalProduct),
                backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                borderColor: 'rgba(0, 128, 0, 1)',
                borderWidth: 2,
            },
        ],
    };

    const lineData = {
        labels: data?.statisticsOrderDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng tiền',
                data: data?.statisticsOrderDTOs.map((item) => item.totalMoney),
                borderColor: 'rgba(255, 215, 0, 1)', // Yellow color
                borderWidth: 2,
                fill: false,
            },
        ],
    };



    return (
        <div className="p-4">
            <div className="flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}>
                    Quay Lại
                </button>

                <button
                    onClick={() => navigate('/manager/orders')}
                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
                    Danh sách đơn hàng
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Đơn Hàng</h1>
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
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
            {isLoading && <p className="text-center">Đang tải...</p>}
            {error && <p className="text-center text-red-500">Lỗi khi lấy dữ liệu</p>}
            {data && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tóm Tắt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>Số Ngày: {data.count}</p>
                            <p>Tổng Số Đơn Hàng: {data.totalOrder}</p>
                            <p>Tổng Tiền: {data.totalMoney.toLocaleString()} VNĐ</p>
                        </div>
                        <div>
                            <p>Ngày Bắt Đầu: {dayjs(data.dateStart).format('DD-MM-YYYY')}</p>
                            <p>Ngày Kết Thúc: {dayjs(data.dateEnd).format('DD-MM-YYYY')}</p>
                        </div>
                    </div>
                    <br />
                    <h2 className="text-xl font-semibold mb-2 text-center">Biểu Đồ</h2>
                    <div>
                        <Bar data={barData}/>
                        <br/>
                        <Line data={lineData}/>
                    </div>

                </div>
            )}
        </div>
    );
};

export default StatisticsOrders;