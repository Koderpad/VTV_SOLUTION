import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { useStatisticsCustomersByDateAndStatusQuery } from '@/redux/features/manager/CustomerManagerApiSlice.ts';
import {useNavigate} from "react-router-dom";

const StatisticsCustomers: React.FC = () => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const navigate = useNavigate();

    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const { data, error, isLoading } = useStatisticsCustomersByDateAndStatusQuery({
        startDate: startDate,
        endDate: endDate
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const barData = {
        labels: data?.statisticsCustomerDTOs.map((item) => dayjs(item.date).format('YYYY-MM-DD')),
        datasets: [
            {
                label: 'Tổng số khách hàng',
                data: data?.statisticsCustomerDTOs.map((item) => item.totalCustomer),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
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
                    onClick={() => navigate('/manager/customers')}
                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
                    Danh sách khách hàng
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Khách Hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>
            {isLoading && <p className="text-center">Đang tải...</p>}
            {error && <p className="text-center text-red-500">Lỗi khi lấy dữ liệu</p>}
            {data && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tóm Tắt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>Số Ngày: {data.count}</p>
                            <p>Tổng Số Khách Hàng: {data.totalCustomer}</p>
                        </div>
                        <div>
                            <p>Ngày Bắt Đầu: {dayjs(data.dateStart).format('YYYY-MM-DD')}</p>
                            <p>Ngày Kết Thúc: {dayjs(data.dateEnd).format('YYYY-MM-DD')}</p>
                        </div>
                    </div>
                    <br/>
                    <h2 className="text-xl font-semibold mb-2 text-center">Biểu Đồ</h2>

                    <Bar data={barData}/>
                </div>
            )}


        </div>
    );
};

export default StatisticsCustomers;
