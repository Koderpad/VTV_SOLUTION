import React, {useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";
import {useStatisticsFeeOrderByDateQuery} from "@/redux/features/manager/RevenueManagerApiSlice.ts";

const StatisticsFeeOrder = () => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const navigate = useNavigate();

    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const {data, error, isLoading} = useStatisticsFeeOrderByDateQuery({
        startDate: startDate,
        endDate: endDate
    });

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const barDataTotal = {
        labels: data?.statisticsFeeOrderDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng tiền thanh toán (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => item.paymentTotal),
                backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red color
                borderColor: 'rgba(255, 0, 0, 1)', // Red color
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Tổng tiền cửa hàng nhận (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => item.shopReceiveTotal),
                backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                borderColor: 'rgba(0, 128, 0, 1)', // Green color
                borderWidth: 2,
                fill: false,
            },

        ],
    };


    const barDataVoucher = {
        labels: data?.statisticsFeeOrderDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng giảm giá cửa hàng (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => -item.discountShopTotal),
                backgroundColor: 'rgba(50,222,24,0.6)', // Red color
                borderColor: 'rgb(33,241,9)', // Red color
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Tổng giảm giá hệ thống (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => -item.discountSystemTotal),
                backgroundColor: 'rgba(10,41,239,0.6)', // Green color
                borderColor: 'rgb(10,121,248)', // Green color
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const barData = {
        labels: data?.statisticsFeeOrderDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Phí vận chuyển (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => item.feeShippingTotal),
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue color
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
            },
            {
                label: 'Phí hệ thống (VNĐ)',
                data: data?.statisticsFeeOrderDTOs.map((item) => item.feeSystemTotal),
                backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                borderColor: 'rgba(0, 128, 0, 1)',
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
                    onClick={() => navigate('/manager/orders')}
                    className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
                    Danh sách đơn hàng
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Doanh Thu</h1>
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
            </div>
            {isLoading && <p className="text-center">Đang tải...</p>}
            {error && <p className="text-center text-red-500">Lỗi khi lấy dữ liệu</p>}
            {data && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tóm Tắt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>Số đơn hàng: {data.count}</p>
                        </div>
                        <div>
                            <p>Tổng Tiền Thanh Toán: {data.paymentTotal?.toLocaleString()} VNĐ</p>
                            <p>Tổng Tiền Cửa Hàng Nhận: {data.shopReceiveTotal?.toLocaleString()} VNĐ</p>
                        </div>
                        <div>
                            <p>Tổng Phí Vận Chuyển: {data.feeShippingTotal?.toLocaleString()} VNĐ</p>
                            <p>Tổng Phí Hệ Thống: {data.feeSystemTotal?.toLocaleString()} VNĐ</p>
                        </div>
                        <div>
                            <p>Tổng Giảm Giá Hệ
                                Thống: {data.discountSystemTotal < 0 ? (-data.discountSystemTotal)?.toLocaleString() : 0} VNĐ</p>
                            <p>Tổng Giảm Giá Cửa
                                Hàng: {data.discountShopTotal < 0 ? (-data.discountShopTotal)?.toLocaleString() : 0} VNĐ</p>
                        </div>
                    </div>

                    <br/>
                    <h2 className="text-xl font-semibold mb-2 text-center">Biểu Đồ</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Biểu đồ Tổng tiền</h3>
                        <div className="h-96">
                            <Bar data={barDataTotal}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Biểu đồ Khuyến mãi</h3>
                        <div className="h-96">
                            <Bar data={barDataVoucher}/>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-2">Biểu đồ Phí</h3>
                        <div className="h-96">
                            <Bar data={barData}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsFeeOrder;