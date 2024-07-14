import {
  useGetRevenueStatisticsByStatusQuery,
  useGetTopProductsRevenueQuery,
} from "@/redux/features/vendor/revenue/revenueApiSlice";
import {
  StatisticsOrderDTO,
  StatisticsOrdersResponse,
} from "@/utils/DTOs/vendor/revenue/Response/StatisticsOrdersResponse";
import {
  StatisticsProductDTO,
  StatisticsProductsResponse,
} from "@/utils/DTOs/vendor/revenue/Response/StatisticsProductsResponse";
import { useEffect, useState, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays } from "date-fns";
import { handleApiCall } from "@/utils/HandleAPI/common/handleApiCall";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ServerError } from "@/utils/DTOs/common/ServerError";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const validOrderStatuses = ["COMPLETED", "DELIVERED", "SHIPPING", "CANCEL"];

export const Revenue: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [orderStatus, setOrderStatus] = useState("COMPLETED");
  const [productLimit, setProductLimit] = useState(5);

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const { data: revenueData, refetch: refetchRevenue } =
    useGetRevenueStatisticsByStatusQuery({
      status: orderStatus,
      startDate: format(dateRange.startDate, "yyyy-MM-dd"),
      endDate: format(dateRange.endDate, "yyyy-MM-dd"),
    });

  const { data: topProductsData, refetch: refetchTopProducts } =
    useGetTopProductsRevenueQuery({
      limit: productLimit,
      startDate: format(dateRange.startDate, "yyyy-MM-dd"),
      endDate: format(dateRange.endDate, "yyyy-MM-dd"),
    });

  const [revenueChartData, setRevenueChartData] = useState<any>(null);
  const [topProductsChartData, setTopProductsChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      await handleApiCall<StatisticsOrdersResponse, ServerError>({
        callbackFn: async () => {
          return await refetchRevenue();
        },
        successCallback: (data) => {
          setRevenueChartData(prepareRevenueChartData(data));
          //   toast.success("Dữ liệu doanh thu đã được cập nhật");
        },
        errorFromServerCallback: (error) => {
          toast.error(`Lỗi khi tải dữ liệu doanh thu: ${error.message}`);
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Lỗi không xác định khi tải dữ liệu doanh thu: ${error.message}`
          );
        },
        errorCallback: (error) => {
          // toast.error(`Đã xảy ra lỗi: ${error}`);
        },
      });

      await handleApiCall<StatisticsProductsResponse, ServerError>({
        callbackFn: async () => {
          return await refetchTopProducts();
        },
        successCallback: (data) => {
          setTopProductsChartData(prepareTopProductsChartData(data));
          //   toast.success("Dữ liệu sản phẩm bán chạy đã được cập nhật");
        },
        errorFromServerCallback: (error) => {
          toast.error(
            `Lỗi khi tải dữ liệu sản phẩm bán chạy: ${error.message}`
          );
        },
        errorSerializedCallback: (error) => {
          toast.error(
            `Lỗi không xác định khi tải dữ liệu sản phẩm bán chạy: ${error.message}`
          );
        },
        errorCallback: (error) => {
          // toast.error(`Đã xảy ra lỗi1: ${error}`);
        },
      });
    };

    fetchData();
  }, [dateRange, orderStatus, productLimit]);

  const prepareRevenueChartData = (data: any) => {
    if (!data) return null;
    return {
      labels: data.statisticsOrderDTOs.map((item: StatisticsOrderDTO) =>
        format(new Date(item.date), "dd/MM/yyyy")
      ),
      datasets: [
        {
          label: "Doanh thu",
          data: data.statisticsOrderDTOs.map(
            (item: StatisticsOrderDTO) => item.totalMoney
          ),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Số đơn hàng",
          data: data.statisticsOrderDTOs.map(
            (item: StatisticsOrderDTO) => item.totalOrder
          ),
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareTopProductsChartData = (data: any) => {
    if (!data) return null;
    return {
      labels: data.statisticsProductDTOs.map(
        (item: StatisticsProductDTO) => item.productDTO.name
      ),
      datasets: [
        {
          label: "Doanh thu",
          data: data.statisticsProductDTOs.map(
            (item: StatisticsProductDTO) => item.totalMoney
          ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Số lượng bán",
          data: data.statisticsProductDTOs.map(
            (item: StatisticsProductDTO) => item.totalSold
          ),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  const calculateTotalRevenue = () => {
    return (
      revenueData?.statisticsOrderDTOs.reduce(
        (sum: number, item: StatisticsOrderDTO) => sum + item.totalMoney,
        0
      ) || 0
    );
  };

  const calculateAverageOrderValue = () => {
    const totalRevenue = calculateTotalRevenue();
    const totalOrders = revenueData?.totalOrder || 1;
    return totalRevenue / totalOrders;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dateType: "startDate" | "endDate"
  ) => {
    const newDate = new Date(e.target.value);
    setDateRange((prev) => ({ ...prev, [dateType]: newDate }));
  };

  const renderFilters = () => (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Bộ lọc</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Ngày bắt đầu
          </label>
          <input
            type="date"
            id="startDate"
            ref={startDateRef}
            value={format(dateRange.startDate, "yyyy-MM-dd")}
            onChange={(e) => handleDateChange(e, "startDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Ngày kết thúc
          </label>
          <input
            type="date"
            id="endDate"
            ref={endDateRef}
            value={format(dateRange.endDate, "yyyy-MM-dd")}
            onChange={(e) => handleDateChange(e, "endDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>
        <div>
          <label
            htmlFor="orderStatus"
            className="block text-sm font-medium text-gray-700"
          >
            Trạng thái đơn hàng
          </label>
          <select
            id="orderStatus"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {validOrderStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "COMPLETED"
                  ? "Hoàn thành"
                  : status === "DELIVERED"
                    ? "Đã giao"
                    : status === "SHIPPING"
                      ? "Đang giao"
                      : status === "CANCEL"
                        ? "Đã hủy"
                        : status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="productLimit"
            className="block text-sm font-medium text-gray-700"
          >
            Số lượng sản phẩm bán chạy
          </label>
          <select
            id="productLimit"
            value={productLimit}
            onChange={(e) => setProductLimit(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {[5, 10, 15, 20].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thống kê doanh thu</h1>

      {renderFilters()}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Tổng doanh thu</h2>
          <p className="text-3xl font-bold text-green-600">
            {formatPrice(calculateTotalRevenue())}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Tổng Đơn hàng</h2>
          <p className="text-3xl font-bold text-green-600">
            {revenueData?.totalOrder || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">
            Giá trị đơn hàng trung bình
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(calculateAverageOrderValue())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Doanh thu và số đơn hàng theo thời gian
          </h2>
          {revenueChartData && (
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Top {productLimit} sản phẩm bán chạy theo doanh thu
          </h2>
          {topProductsChartData && (
            <Bar
              data={topProductsChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
