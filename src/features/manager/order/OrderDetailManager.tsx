import  {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useGetOrderDetailByOrderIdQuery} from "@/redux/features/manager/OrderManagerApiSlice.ts";
import {orderStatusToString} from "@/utils/DTOs/extra/orderStatusToString.ts";
import dayjs from "dayjs";
import {transportStatusToString} from "@/utils/DTOs/extra/transportStatusToString.ts";
import {OrderResponse} from "@/utils/DTOs/customer/response/OrderResponse.ts";
import {getTransportStatusColor} from "@/utils/DTOs/extra/getTransportStatusColor.ts";

const OrderDetailManager = () => {
    const {orderId} = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [orderResponse, setOrderResponseResponse] = useState<OrderResponse>();
    const [isLoading, setIsLoading] = useState(true);

    const {data, error: orderError, isLoading: orderLoading} = useGetOrderDetailByOrderIdQuery({
        orderId: orderId
    });

    useEffect(() => {
        if (data) {
            setOrderResponseResponse(data);
            setIsLoading(false);
        }
    }, [data]);

    if (orderLoading) return <div>Loading...</div>;
    if (orderError) return <div>Error: {orderError.message}</div>;

    if (isLoading || !orderResponse) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Loading...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết đơn hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Information Section */}
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Thông tin đơn hàng</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Mã đơn hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.orderId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Khách hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.addressDTO.fullName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Địa chỉ giao hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.addressDTO.fullAddress}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Số điện thoại:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.addressDTO.phone}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Phương thức thanh toán:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.paymentMethod === 'VNPay' ? 'VN Pay' : (orderResponse.orderDTO.paymentMethod === 'COD' ? 'Thanh Toán Khi Nhận Hàng' : 'Ví')}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Tổng tiền:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.totalPrice.toLocaleString()} VNĐ</dd>
                        </div>
                        {orderResponse.orderDTO.discountShop < 0 &&
                            <div>
                                <dt className="text-neutral-800  text-xl font-bold">Giảm giá cửa hàng:</dt>
                                <dd className="mt-1 text-red-500">{orderResponse.orderDTO.discountShop.toLocaleString()} VNĐ</dd>
                            </div>}
                        {orderResponse.orderDTO.discountSystem < 0 &&
                            <div>
                                <dt className="text-neutral-800  text-xl font-bold">Giảm giá cửa hệ thống:</dt>
                                <dd className="mt-1 text-red-500">{orderResponse.orderDTO.discountSystem.toLocaleString()} VNĐ</dd>
                            </div>}

                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Phí vận chuyển:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.shippingFee.toLocaleString()} VNĐ</dd>
                        </div>

                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Tổng tiển phải thanh toán:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.paymentTotal.toLocaleString()} VNĐ</dd>
                        </div>

                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Trạng thái:</dt>
                            <dd className="mt-1 text-black">{orderStatusToString[orderResponse.orderDTO.status]}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Ngày đặt hàng:</dt>
                            <dd className="mt-1 text-black">{dayjs(orderResponse.orderDTO.orderDate).format('DD-MM-YYYY')}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Ghi chú:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.note}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Cửa hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.orderDTO.shopDTO.name}</dd>
                        </div>
                        {/* Render LoyaltyPointHistoryDTO if available */}
                        {orderResponse.orderDTO.loyaltyPointHistoryDTO && (
                            <div>
                                <dt className="text-neutral-800  text-xl font-bold">Lịch sử điểm thưởng:</dt>
                                <dd className="mt-1 text-black">
                                    <ul>
                                        <li className="list-disc list-inside">
                                            <span
                                                className="font-bold">Số điểm:</span> {orderResponse.orderDTO.loyaltyPointHistoryDTO.point}
                                            <br/>
                                            <span
                                                className="font-bold">Loại điểm:</span> {orderResponse.orderDTO.loyaltyPointHistoryDTO.type}
                                            <br/>
                                            <span
                                                className="font-bold">Trạng thái:</span> {orderResponse.orderDTO.loyaltyPointHistoryDTO.status}
                                            <br/>
                                            <span
                                                className="font-bold">Ngày cập nhật:</span> {dayjs(orderResponse.orderDTO.loyaltyPointHistoryDTO.createAt).format('DD-MM-YYYY')}
                                        </li>
                                    </ul>
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Thông tin vận chuyển</h2>
                    <dl className="space-y-4">
                    <div>
                            <dt className="text-neutral-800 text-xl font-bold">Phương thức vận chuyển:</dt>
                            <dd className="mt-1 text-black">{orderResponse.transportDTO.shippingMethod}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Trạng thái vận chuyển:</dt>
                            <dd className={`mt-1 text-${getTransportStatusColor(orderResponse.transportDTO.status)}`}>
                                {transportStatusToString()[orderResponse.transportDTO.status]}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Phí vận chuyển:</dt>
                            <dd className="mt-1 text-black">{orderResponse.transportDTO.totalTransportHandle.toLocaleString()} VNĐ</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Lịch sử vận chuyển:</dt>
                            <dd className="mt-1 text-black">
                                <ul>
                                    {orderResponse.transportDTO.transportHandleDTOs.map((transportHandle, index) => (
                                        <li key={index} className="list-disc list-inside">
                                            <span
                                                className="font-bold">{transportHandle.username}</span> - {transportStatusToString()[transportHandle.transportStatus]}
                                            <br/>
                                            <span className={`text-${getTransportStatusColor(transportHandle.transportStatus)}-500`}>{transportHandle.messageStatus}</span>
                                            <br/>
                                            <span
                                                className="text-gray-500">Ngày: {dayjs(transportHandle.createAt).format('DD-MM-YYYY')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Thông tin giao hàng</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Nhà vận chuyển:</dt>
                            <dd className="mt-1 text-black">{orderResponse.shippingDTO.transportProviderShortName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Phí giao hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.shippingDTO.shippingCost.toLocaleString()} VNĐ</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Thời gian dự kiến giao hàng:</dt>
                            <dd className="mt-1 text-black">{orderResponse.shippingDTO.estimatedDeliveryTime}</dd>
                        </div>
                    </dl>
                </div>

            </div>


            <div className="bg-white rounded-md shadow-md p-6 mt-4">
                <h2 className="text-2xl font-bold text-black mb-4 text-center">Danh sách sản phẩm</h2>
                <table className="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên
                            sản phẩm
                        </th>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên
                            Hình ảnh
                        </th>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã
                            biến thể
                        </th>

                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Số
                            lượng
                        </th>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá
                            gốc (VNĐ)
                        </th>
                        <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá
                            khuyến mãi (VNĐ)
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderResponse.orderDTO.orderItemDTOs.map((orderDetail, index) => (
                        <tr key={orderDetail.orderItemId}>
                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1}</td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderDetail.productVariantDTO.productName}</td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <img src={orderDetail.productVariantDTO.image} alt={orderDetail.productVariantDTO.productName} className="w-16 h-16 object-cover"/>
                            </td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderDetail.productVariantDTO.sku}</td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderDetail.quantity}</td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderDetail.price.toLocaleString()}</td>
                            <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{orderDetail.totalPrice.toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Render VoucherOrderDTO if available */}
            {orderResponse.orderDTO.voucherOrderDTOs.length > 0 && (
                <div className="bg-white rounded-md shadow-md p-6 mt-4">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Mã giảm giá</h2>
                    <table className="min-w-full leading-normal">
                        <thead>
                        <tr>
                            <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
                            <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Mã
                                giảm giá
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderResponse.orderDTO.voucherOrderDTOs.map((voucherOrder, index) => (
                            <tr key={voucherOrder.voucherOrderId}>
                                <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1}</td>
                                <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{voucherOrder.voucherName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}

export default OrderDetailManager;