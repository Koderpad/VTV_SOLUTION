import {useParams, useNavigate} from 'react-router-dom';
import {useGetTransportProviderDetailQuery} from '@/redux/features/manager/TransportProviderManagerApiSlice';
import {statusToString} from "@/utils/DTOs/extra/statusToString.ts";
import {ToastContainer, toast} from "react-toastify";
import React, {useEffect, useState} from "react";
import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";

const TransportProviderDetail = () => {
    const {transportProviderId} = useParams<{ transportProviderId: string }>();
    const navigate = useNavigate();
    const [transportProvider, setTransportProvider] = useState<TransportProviderDTO>();
    const {
        data,
        error: queryError,
        isLoading: queryLoading,
        refetch
    } = useGetTransportProviderDetailQuery(Number(transportProviderId));

    useEffect(() => {
        try {
            if (data) {
                setTransportProvider(data.transportProviderDTO);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi lấy dữ liệu nhà cung cấp vận chuyển!");
            setTimeout(() => {
                navigate('/manager/transport-providers');
            }, 700);
        }
    }, [data]);

    if (queryLoading) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-gray-700">Loading...</span></div>;
    if (queryError) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-red-500">Error: {queryError.message}</span></div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}>
                    Quay Lại
                </button>

                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
                    onClick={() => navigate(`/manager/customer/detail/${transportProvider?.customerId}`)}
                >
                    Xem Thông Tin Chi Tiết Tài Khoản
                </button>
            </div>
            <br/>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết nhà cung cấp vận chuyển</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Tên đầy đủ:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.fullName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tên ngắn:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.shortName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Email:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.email}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Số điện thoại:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.phone}</dd>
                        </div>

                    </dl>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin bổ sung</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Số lượng tỉnh thành:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.countProvince}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tài khoản thêm:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.usernameAdded}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã khách hàng:</dt>
                            <dd className="mt-1 text-black">{transportProvider?.customerId}</dd>
                        </div>

                        <div>
                            <dt className="text-neutral-800 font-bold">Trạng thái:</dt>
                            <dd className="mt-1 text-black">{statusToString[transportProvider?.status]}</dd>
                        </div>

                    </dl>
                </div>
            </div>
            <br/>

            <div>
                <dt className="text-neutral-800 font-bold text-center text-xl">Phí vận chuyển:</dt>
                <dd className="mt-1 text-black">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Điều kiện vận chuyển
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Chi phí (VNĐ)
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200">Cùng xã</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {transportProvider?.feeShippingDTO.zeroArea.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200">Cùng quận/huyện</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {transportProvider?.feeShippingDTO.oneArea.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200">Cùng tỉnh/thành phố</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {transportProvider?.feeShippingDTO.twoArea.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200">Cùng khu vực</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {transportProvider?.feeShippingDTO.threeArea.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200">Khác khu vực</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {transportProvider?.feeShippingDTO.fourArea.toLocaleString()}</td>
                        </tr>
                        </tbody>
                    </table>
                </dd>
            </div>


            <div className="mt-8">
                <dt className="text-neutral-800 font-bold text-center text-xl">Danh sách tỉnh thành:</dt>
                <dd className="mt-1 text-black">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                STT
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                Mã tỉnh
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Tên đơn vị hành chính
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Tên
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Tên đầy đủ
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {transportProvider?.provinceDTOs.map((province, index) => (
                            <tr key={province.provinceCode}>

                                <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-center">{province.provinceCode}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-center">{province.administrativeUnitShortName}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{province.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{province.fullName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </dd>
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    onClick={() => navigate(`/manager/transport-provider/update/${transportProvider?.transportProviderId}`)}
                >
                    Cập nhật các tỉnh thành
                </button>

                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => navigate(`/manager/transport-provider/update-fee-shipping/${transportProvider?.transportProviderId}`)}
                >
                    Cập nhật phí vận chuyển
                </button>
            </div>

            <ToastContainer/>
        </div>
    );
};

export default TransportProviderDetail;
