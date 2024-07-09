import {useNavigate, useParams} from 'react-router-dom';
import {useGetDetailCashOrderQuery} from '@/redux/features/shipping/CashOrderApiSlice';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect, useState} from "react";
import {CashOrderDetailResponse} from '@/utils/DTOs/shipping/response/CashOrderDetailResponse';
import {statusToString} from '@/utils/DTOs/extra/convertToString/statusToString';
import {orderStatusToString} from '@/utils/DTOs/extra/convertToString/orderStatusToString';
import {transportStatusToString} from '@/utils/DTOs/extra/convertToString/transportStatusToString';
import {getTransportStatusColor} from '@/utils/DTOs/extra/color/getTransportStatusColor';
import dayjs from 'dayjs';
import {FaUser} from "react-icons/fa";
import {Status} from "@/utils/DTOs/extra/Status.ts"; // Import icons

const CashOrderDetail = () => {
    const {cashOrderId} = useParams<{ cashOrderId: string }>();
    const navigate = useNavigate();
    const [cashOrderDetail, setCashOrderDetail] = useState<CashOrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        data: cashOrderDetailData,
        isLoading: isLoadingCashOrderDetail,
        error: errorCashOrderDetail,
        refetch: refetchCashOrderDetail
    } = useGetDetailCashOrderQuery(cashOrderId);

    useEffect(() => {
        if (isLoadingCashOrderDetail) {
            setIsLoading(true);
        } else if (errorCashOrderDetail) {
            setError(errorCashOrderDetail.message);
        } else {
            setCashOrderDetail(cashOrderDetailData);
            setIsLoading(false);
        }
    }, [isLoadingCashOrderDetail, errorCashOrderDetail, cashOrderDetailData]);

    const renderCashOrderDetail = () => {
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

        if (!cashOrderDetail) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Không có thông tin đơn hàng</span>
                </div>
            );
        }

        return (
            <div>
                <div className="container mx-auto px-4 sm:px-8 py-8">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => navigate(-1)}
                        >
                            Quay Lại
                        </button>
                    </div>
                    <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết biên lai giao hàng</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-md shadow-md p-6">
                            <h2 className="text-2xl font-bold text-black mb-4 text-center">
                                Thông tin biên lai
                            </h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Mã biên lai:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.cashOrderDTO.cashOrderId}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Mã đơn hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.orderId}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Số tiền thanh toàn:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.cashOrderDTO.money.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Trạng thái:
                                    </dt>
                                    <dd className="mt-1 text-black">{statusToString[cashOrderDetail.cashOrderDTO.status]}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Tài khoản giao hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.cashOrderDTO.shipperUsername}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Tài khoản kho cầm tiền:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {cashOrderDetail.cashOrderDTO.waveHouseUsername ?
                                            cashOrderDetail.cashOrderDTO.waveHouseUsername : '#'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Nhân viên giao hàng cầm tiền:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {cashOrderDetail.cashOrderDTO.shipperHold ? 'Có' : 'Không'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Nhân viên kho cầm tiền:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {cashOrderDetail.cashOrderDTO.waveHouseHold ? 'Có' : 'Không'}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Yêu cầu xác nhận tiền vể kho:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {!cashOrderDetail.cashOrderDTO.shipperHold && !cashOrderDetail.cashOrderDTO.waveHouseHold
                                        && cashOrderDetail.cashOrderDTO.status === Status.ACTIVE ? 'Có' : 'Không'}
                                    </dd>
                                </div>

                                {/*<div>*/}
                                {/*    <dt className="text-neutral-800 text-xl font-bold">*/}
                                {/*        Kho cầm tiền:*/}
                                {/*    </dt>*/}
                                {/*    <dd className="mt-1 text-black">*/}
                                {/*        {!cashOrderDetail.cashOrderDTO.shipperHold && !cashOrderDetail.cashOrderDTO.waveHouseHold*/}
                                {/*        && cashOrderDetail.cashOrderDTO.status === Status.INACTIVE ? 'Có' : 'Không'}*/}
                                {/*    </dd>*/}
                                {/*</div>*/}


                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Thanh toán cho cửa hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {cashOrderDetail.cashOrderDTO.handlePayment ? 'Rồi' : 'Chưa'}
                                    </dd>
                                </div>


                            </dl>
                        </div>

                        <div className="bg-white rounded-md shadow-md p-6">
                            <h2 className="text-2xl font-bold text-black mb-4 text-center">
                                Thông tin đơn hàng
                            </h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Trạng thái đơn hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">{orderStatusToString[cashOrderDetail.orderDTO.status]}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Phương thức thanh toán:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.paymentMethod}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Phương thức vận chuyển:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.shippingMethod}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Tổng tiền:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.totalPrice.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Giảm giá cửa hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.discountShop.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Giảm giá hệ thống:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.discountSystem.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Phí vận chuyển:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.shippingFee.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Tổng thanh toán:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.paymentTotal.toLocaleString()} VNĐ</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Địa chỉ giao hàng:
                                    </dt>
                                    <dd className="mt-1 text-black">
                                        {cashOrderDetail.orderDTO.addressDTO.fullAddress}, {cashOrderDetail.orderDTO.addressDTO.wardName}, {cashOrderDetail.orderDTO.addressDTO.districtName}, {cashOrderDetail.orderDTO.addressDTO.provinceName}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Tên người nhận:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.addressDTO.fullName}</dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 text-xl font-bold">
                                        Số điện thoại:
                                    </dt>
                                    <dd className="mt-1 text-black">{cashOrderDetail.orderDTO.addressDTO.phone}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-md shadow-md p-6">
                        <h2 className="text-2xl font-bold text-black mb-4 text-center">
                            Danh sách sản phẩm
                        </h2>
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    STT
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    Tên sản phẩm
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    Số lượng
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                                    Giá bán (VNĐ)
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                                    Thành tiền (VNĐ)
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {cashOrderDetail.orderDTO.orderItemDTOs.map((orderItem, index) => (
                                <tr key={orderItem.orderItemId}>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{orderItem.productVariantDTO.productName}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">{orderItem.quantity}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-right">{orderItem.price.toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-right">{orderItem.totalPrice.toLocaleString()} </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>


                    <div className="mt-8 bg-white rounded-md shadow-md p-6">
                        <h2 className="text-2xl font-bold text-black mb-4 text-center">
                            Thông tin vận chuyển
                        </h2>
                        <dl className="space-y-4">
                            <div>
                                <dt className="text-neutral-800 text-xl font-bold">
                                    Mã vận chuyển:
                                </dt>
                                <dd className="mt-1 text-black">{cashOrderDetail.transportDTO.transportId}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-800 text-xl font-bold">
                                    Trạng thái:
                                </dt>
                                <dd
                                    className={`mt-1 text-${getTransportStatusColor(
                                        cashOrderDetail.transportDTO.status
                                    )}`}
                                >
                                    {transportStatusToString[cashOrderDetail.transportDTO.status]}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-neutral-800 text-xl font-bold">
                                    Phương thức vận chuyển:
                                </dt>
                                <dd className="mt-1 text-black">{cashOrderDetail.transportDTO.shippingMethod}</dd>
                            </div>
                            <div>
                                <dt className="text-neutral-800 text-xl font-bold">
                                    Lịch sử vận chuyển:
                                </dt>
                                <dd className="mt-1 text-black">
                                    <ul>
                                        {cashOrderDetail.transportDTO.transportHandleDTOs.map(
                                            (transportHandle, index) => (
                                                <li key={index} className="list-disc list-inside">
                                                <span className="font-bold">
                                                    <FaUser className="mr-2"/>
                                                    {transportHandle.username}
                                                </span>{" "}
                                                    -{" "}
                                                    {transportStatusToString[
                                                        transportHandle.transportStatus
                                                        ]}
                                                    <br/>
                                                    <span
                                                        className={`text-${getTransportStatusColor(
                                                            transportHandle.transportStatus
                                                        )}-500`}
                                                    >
                                                    {transportHandle.messageStatus}
                                                </span>
                                                    <br/>
                                                    <span className="text-gray-500">
                                                    Ngày:{" "}
                                                        {dayjs(transportHandle.createAt).format(
                                                            "DD-MM-YYYY HH:mm"
                                                        )}
                                                </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </div>

                </div>
                <ToastContainer/>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            {renderCashOrderDetail()}
        </div>
    );
};

export default CashOrderDetail;