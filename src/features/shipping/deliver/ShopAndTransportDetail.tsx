import {useNavigate, useParams} from 'react-router-dom';
import {
    useGetShopAndTransportsDTOByShopIdQuery,
    useUpdateStatusTransportByDeliverMutation
} from '@/redux/features/shipping/TransportApiSlice';
import {ShopAndTransportsDTO} from "@/utils/DTOs/shipping/dto/ShopAndTransportsDTO";
import {statusToString} from "@/utils/DTOs/extra/convertToString/statusToString.ts";
import React, {useEffect, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {transportStatusToString} from "@/utils/DTOs/extra/convertToString/transportStatusToString";
import {TransportStatus} from "@/utils/DTOs/extra/TransportStatus.ts";
import {CheckCircleIcon, XCircleIcon} from "lucide-react";
import {DeliverDTO} from "@/utils/DTOs/shipping/dto/DeliverDTO.ts";
import {useGetDeliverInfoMutation} from "@/redux/features/shipping/DeliverApiSlice.ts";
import {TypeWork} from "@/utils/DTOs/extra/TypeWork.ts";

const ShopAndTransportDetail = () => {
    const { shopId } = useParams<{ shopId: string }>();
    const navigate = useNavigate();

    const { data: shopData, isLoading: isShopLoading, error: shopError } =
        useGetShopAndTransportsDTOByShopIdQuery(Number(shopId));

    const [shopAndTransportsDTO, setShopAndTransportsDTO] = useState<ShopAndTransportsDTO>();
    const [updateStatusTransport] = useUpdateStatusTransportByDeliverMutation();

    const [transportIds, setTransportIds] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<TransportStatus>(TransportStatus.PICKED_UP);
    const { refetch: refetchShopData } = useGetShopAndTransportsDTOByShopIdQuery(Number(shopId));
    const [deliver, setDeliver] = useState<DeliverDTO>();
    const [getDeliverInfo] = useGetDeliverInfoMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDeliverInfo();
                setDeliver(response.data.deliverDTO);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }

            fetchData();


    }, []);



    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as TransportStatus);
    }

    const handleTransportIdsChange = (transportId: string) => {
        if (transportIds.includes(transportId)) {
            setTransportIds(transportIds.filter(id => id !== transportId));
        } else {
            setTransportIds([...transportIds, transportId]);
        }
    }

    const handleUnselectAll = () => {
        setTransportIds([]);
    }

    const handleSelectAll = () => {
        setTransportIds(shopAndTransportsDTO?.transportDTOs.map(transport => transport.transportId) || []);
    }

    const handleUpdateStatusTransports = async () => {
        try {
            await Promise.all(transportIds.map(transportId => updateStatusTransport({
                transportId,
                status: selectedStatus,
                handled: true,
                wardCode: shopAndTransportsDTO?.wardCode || ''
            })));
            // Update the status of the transportDTOs in the state, but clone the array to prevent mutating the original
            const updatedShopData = { ...shopAndTransportsDTO };
            updatedShopData.transportDTOs = updatedShopData.transportDTOs.map(transport => {
                if (transportIds.includes(transport.transportId)) {
                    return { ...transport, status: selectedStatus };
                }
                return transport;
            });
            setShopAndTransportsDTO(updatedShopData);


            await refetchShopData();

            toast.success('Cập nhật trạng thái thành công!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Lỗi cập nhật trạng thái');
        }
    }

    useEffect(() => {
        if (shopData) {
            setShopAndTransportsDTO(shopData);
        }
    }, [shopData]);

    if (isShopLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Loading...</span>
            </div>
        );
    }

    if (shopError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-red-500">Error: {shopError?.message}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">

            <div className="mt-4 flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>
            </div>

            {shopAndTransportsDTO && (
                <div>
                    <h1 className="text-4xl font-bold text-black mb-8 text-center">
                        Chi tiết cửa hàng và đơn vận chuyển
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4">Thông tin cửa hàng</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-neutral-800 font-bold">Tên cửa hàng:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.shopDTO.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 font-bold">Địa chỉ:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.shopDTO.address}, {shopAndTransportsDTO.shopDTO.wardName}, {shopAndTransportsDTO.shopDTO.districtName}, {shopAndTransportsDTO.shopDTO.provinceName}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 font-bold">Số điện thoại:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.shopDTO.phone}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 font-bold">Email:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.shopDTO.email}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 font-bold">Trạng thái:</dt>
                                    <dd className="mt-1 text-black">
                                        {statusToString[shopAndTransportsDTO.shopDTO.status]}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4">Thông tin đơn vận chuyển</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-neutral-800 font-bold">Số lượng đơn:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.count}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-neutral-800 font-bold">Phường/Xã:</dt>
                                    <dd className="mt-1 text-black">
                                        {shopAndTransportsDTO.wardName}
                                    </dd>
                                </div>

                            </dl>
                        </div>
                    </div>

                    <div>
                        <br/>
                        <dt className="text-neutral-800 font-bold">Danh sách đơn:</dt>
                        <dd className="mt-1 text-black">
                            <div className="flex justify-between mb-4">
                                <select
                                    className="shadow appearance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={handleStatusChange}
                                    value={selectedStatus}
                                >
                                    <option value={TransportStatus.PICKED_UP}>Đã lấy hàng</option>
                                    {deliver?.typeWork === TypeWork.WAREHOUSE && (
                                        <option value={TransportStatus.WAREHOUSE}>Đang ở kho</option>
                                    )}
                                </select>

                                <div className="flex space-x-2">
                                    <button
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                                        onClick={handleSelectAll}>
                                        <CheckCircleIcon className="h-5 w-5 mr-2"/> Tất cả
                                    </button>

                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                                        onClick={handleUnselectAll}>
                                        <XCircleIcon className="h-5 w-5 mr-2"/> Bỏ tất cả
                                    </button>

                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                    <tr>

                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                            Thao tác
                                        </th>

                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            STT
                                        </th>

                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                            Mã đơn
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                            Trạng thái
                                        </th>

                                    </tr>
                                    </thead>
                                    <tbody>
                                    {shopAndTransportsDTO.transportDTOs.map((transport, index) => (
                                        <tr key={transport.transportId}>
                                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={transportIds.includes(transport.transportId)}
                                                    onChange={() => handleTransportIdsChange(transport.transportId)}
                                                />
                                            </td>

                                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                                {index + 1}
                                            </td>

                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {transport.transportId}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                                {transportStatusToString[transport.status]}
                                            </td>

                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <br/>

                                <div className="flex space-x-2 rounded">
                                    <br/>
                                    <button
                                        className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        onClick={handleUpdateStatusTransports}>
                                        Cập nhật
                                    </button>
                                </div>

                            </div>
                        </dd>
                    </div>
                </div>
            )}

            <ToastContainer/>
        </div>
    );
};

export default ShopAndTransportDetail;