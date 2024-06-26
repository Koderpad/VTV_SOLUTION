import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    useGetTransportProviderDetailQuery,
    useUpdateTransportProviderFeeShippingMutation
} from '@/redux/features/manager/TransportProviderManagerApiSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { statusToString } from "@/utils/DTOs/extra/convertToString/statusToString.ts";
import { TransportProviderDTO } from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";

const UpdateTransportProviderFeeShipping = () => {
    const { transportProviderId } = useParams<{ transportProviderId: string }>();
    const navigate = useNavigate();
    const {
        data,
        error: queryError,
        isLoading: queryLoading
    } = useGetTransportProviderDetailQuery(Number(transportProviderId));
    const [updateTransportProviderFeeShipping] = useUpdateTransportProviderFeeShippingMutation();
    const [transportProvider, setTransportProvider] = useState<TransportProviderDTO>();

    const [feeShipping, setFeeShipping] = useState({
        zeroArea: 0,
        zeroEstimatedDeliveryTime: 0,
        oneArea: 0,
        oneEstimatedDeliveryTime: 0,
        twoArea: 0,
        twoEstimatedDeliveryTime: 0,
        threeArea: 0,
        threeEstimatedDeliveryTime: 0,
        fourArea: 0,
        fourEstimatedDeliveryTime: 0,
    });

    useEffect(() => {
        if (data) {
            const {
                zeroArea, zeroEstimatedDeliveryTime, oneArea, oneEstimatedDeliveryTime,
                twoArea, twoEstimatedDeliveryTime, threeArea, threeEstimatedDeliveryTime,
                fourArea, fourEstimatedDeliveryTime
            } = data.transportProviderDTO.feeShippingDTO || {};
            setFeeShipping({
                zeroArea: zeroArea || 0,
                zeroEstimatedDeliveryTime: zeroEstimatedDeliveryTime || 0,
                oneArea: oneArea || 0,
                oneEstimatedDeliveryTime: oneEstimatedDeliveryTime || 0,
                twoArea: twoArea || 0,
                twoEstimatedDeliveryTime: twoEstimatedDeliveryTime || 0,
                threeArea: threeArea || 0,
                threeEstimatedDeliveryTime: threeEstimatedDeliveryTime || 0,
                fourArea: fourArea || 0,
                fourEstimatedDeliveryTime: fourEstimatedDeliveryTime || 0,
            });
            setTransportProvider(data.transportProviderDTO);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFeeShipping(prevState => ({
            ...prevState,
            [name]: Number(value),
        }));
    };

    const handleSubmit = async () => {
        try {
            await updateTransportProviderFeeShipping({
                request: feeShipping,
                transportProviderId: Number(transportProviderId),
            }).unwrap();
            toast.success('Cập nhật phí vận chuyển thành công!');


            setTimeout(() => {
                // transportProviderId is a string, so we need to convert it to a number
                navigate(`/manager/transport-provider/detail/${transportProviderId}`);
            }, 500);


        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật phí vận chuyển!');
            console.error(error);
        }
    };

    if (queryLoading) return <div className="flex justify-center items-center h-screen"><span className="text-xl text-gray-700">Loading...</span></div>;
    if (queryError) return <div className="flex justify-center items-center h-screen"><span className="text-xl text-red-500">Error: {queryError}</span></div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>

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

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Cập nhật phí vận chuyển</h1>

            <div className="space-y-4">
                <div className="flex space-x-4 items-center">
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Cùng xã/phường:</label>
                        <input
                            type="number"
                            name="zeroArea"
                            value={feeShipping.zeroArea}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho cùng xã/phường (ngày):</label>
                        <input
                            type="number"
                            name="zeroEstimatedDeliveryTime"
                            value={feeShipping.zeroEstimatedDeliveryTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Cùng quận/huyện:</label>
                        <input
                            type="number"
                            name="oneArea"
                            value={feeShipping.oneArea}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho cùng quận/huyện (ngày):</label>
                        <input
                            type="number"
                            name="oneEstimatedDeliveryTime"
                            value={feeShipping.oneEstimatedDeliveryTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Cùng tỉnh/thành phố:</label>
                        <input
                            type="number"
                            name="twoArea"
                            value={feeShipping.twoArea}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho cùng tỉnh/thành phố (ngày):</label>
                        <input
                            type="number"
                            name="twoEstimatedDeliveryTime"
                            value={feeShipping.twoEstimatedDeliveryTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Cùng khu vực:</label>
                        <input
                            type="number"
                            name="threeArea"
                            value={feeShipping.threeArea}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho cùng khu vực (ngày):</label>
                        <input
                            type="number"
                            name="threeEstimatedDeliveryTime"
                            value={feeShipping.threeEstimatedDeliveryTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Khác khu vực:</label>
                        <input
                            type="number"
                            name="fourArea"
                            value={feeShipping.fourArea}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho khác khu vực (ngày):</label>
                        <input
                            type="number"
                            name="fourEstimatedDeliveryTime"
                            value={feeShipping.fourEstimatedDeliveryTime}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleSubmit}
                >
                    Cập nhật phí vận chuyển
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdateTransportProviderFeeShipping;
