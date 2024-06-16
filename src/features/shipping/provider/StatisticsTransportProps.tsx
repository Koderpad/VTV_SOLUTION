import 'chart.js/auto';
import dayjs from 'dayjs';
import { useStatisticsTransportsByDateAndUsernameQuery } from "@/redux/features/shipping/StatisticsTransportApiSlice.ts";
import {Bar, Line} from "react-chartjs-2";

interface Props {
    selectedYear: string;
    selectedMonth: string;
}

const StatisticsTransportProps = ({ selectedYear, selectedMonth }: Props) => {
    const startDate = `${selectedYear}-${selectedMonth}-01`;
    const endDate = `${selectedYear}-${selectedMonth}-${dayjs(`${selectedYear}-${selectedMonth}`).daysInMonth()}`;

    const { data, error, isLoading } = useStatisticsTransportsByDateAndUsernameQuery({
        startDate: startDate,
        endDate: endDate,
    });

    const barData = {
        labels: data?.statisticsTransportDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng số đơn hàng',
                data: data?.statisticsTransportDTOs.map((item) => item.totalTransport),
                backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green color
                borderColor: 'rgba(0, 128, 0, 1)',
                borderWidth: 2,
            },
            {
                label: 'Tổng phí (VNĐ)',
                data: data?.statisticsTransportDTOs.map((item) => item.totalFeeShipping),
                backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red color
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
            },
        ],
    };

    const lineData = {
        labels: data?.statisticsTransportDTOs.map((item) => dayjs(item.date).format('DD-MM-YYYY')),
        datasets: [
            {
                label: 'Tổng phí (VNĐ)',
                data: data?.statisticsTransportDTOs.map((item) => item.totalFeeShipping),
                borderColor: 'rgba(255, 215, 0, 1)', // Yellow color
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Thống Kê Vận Chuyển</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* You can add more filters here if needed */}
            </div>
            {isLoading && <p className="text-center">Đang tải...</p>}
            {error && <p className="text-center text-red-500">Lỗi khi lấy dữ liệu</p>}
            {data && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tóm Tắt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <p>Số Ngày: {data.count}</p>
                            <p>Tổng Số Đơn Hàng: {data.totalTransport?.toLocaleString()} </p>
                            <p>Tổng Số Phí Giao Hàng: {data.totalFee?.toLocaleString()} VNĐ</p>
                        </div>
                        <div>
                            <p>Ngày Bắt Đầu: {dayjs(data.dateStart).format('DD-MM-YYYY')}</p>
                            <p>Ngày Kết Thúc: {dayjs(data.dateEnd).format('DD-MM-YYYY')}</p>
                        </div>
                    </div>
                    <br />
                    <h2 className="text-xl font-semibold mb-2 text-center">Biểu Đồ</h2>
                    <div>
                        <Bar data={barData} />
                        <br />
                        <Line data={lineData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsTransportProps;