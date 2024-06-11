import React, {useEffect, useState} from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import {useGetAllTransportProvidersQuery} from "@/redux/features/manager/TransportProviderManagerApiSlice.ts";
import {useStatisticsTransportsByDateQuery} from "@/redux/features/manager/RevenueManagerApiSlice.ts";

const StatisticsTransports = () => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('MM');
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
    const navigate = useNavigate();

    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const { data: transportsData, error: transportsError, isLoading: transportsLoading } =
        useStatisticsTransportsByDateQuery({
            shippingMethod: selectedShippingMethod ? selectedShippingMethod : 'VTV Express',
            startDate: startDate,
            endDate: endDate
        });

    const { data: providersData, error: providersError, isLoading: providersLoading } =
        useGetAllTransportProvidersQuery();

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    useEffect(() => {
        setSelectedShippingMethod(providersData?.transportProviderDTOs[0].shortName ?? "");
    }, [providersData]);


    const handleShippingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedShippingMethod(e.target.value);
    };

    const lineData = {
        labels: transportsData?.statisticsTransportDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                data: transportsData?.statisticsTransportDTOs.map((item) => item.totalTransport),
                borderColor: 'rgba(0, 128, 0, 1)', // Green color
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Tổng phí (VNĐ)',
                data: transportsData?.statisticsTransportDTOs.map((item) => item.totalFeeShipping),
                borderColor: 'rgba(255, 0, 0, 1)', // Red color
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
            <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Vận Chuyển</h1>
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
                        Chọn Phương thức vận chuyển:
                    </label>
                    <select
                        value={selectedShippingMethod}
                        onChange={handleShippingMethodChange}
                        className="block w-full mt-1 p-2 border border-gray-300 rounded"
                    >
                        {providersData?.transportProviderDTOs.map((provider) => (
                            <option key={provider.transportProviderId} value={provider.shortName}>
                                {provider.shortName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {(transportsLoading || providersLoading) && <p className="text-center">Đang tải...</p>}
            {(transportsError || providersError) && <p className="text-center text-red-500">Lỗi khi lấy dữ liệu</p>}
            {transportsData && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tóm Tắt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>Số Ngày: {transportsData.count}</p>
                            <p>Tổng Số Đơn Hàng: {transportsData.totalTransport?.toLocaleString()} </p>
                            <p>Tổng Số Phí Giao Hàng: {transportsData.totalFee?.toLocaleString()} VNĐ</p>
                        </div>
                        <div>
                            <p>Ngày Bắt Đầu: {dayjs(transportsData.dateStart).format('DD-MM-YYYY')}</p>
                            <p>Ngày Kết Thúc: {dayjs(transportsData.dateEnd).format('DD-MM-YYYY')}</p>
                        </div>
                    </div>
                    <br/>
                    <h2 className="text-xl font-semibold mb-2 text-center">Biểu Đồ</h2>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Biểu đồ Vận chuyển</h3>
                        <div className="h-96">
                            <Bar data={lineData}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsTransports;