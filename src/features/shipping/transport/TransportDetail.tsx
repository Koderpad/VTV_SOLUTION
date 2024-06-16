import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTransportResponseByTransportIdQuery } from "@/redux/features/shipping/TransportApiSlice.ts";
import { transportStatusToString } from "@/utils/DTOs/extra/convertToString/transportStatusToString.ts";
import { getTransportStatusColor } from "@/utils/DTOs/extra/color/getTransportStatusColor.ts";
import TransportResponse from "@/utils/DTOs/shipping/response/TransportResponse.ts";
import dayjs from "dayjs";


const TransportDetail = () => {
    const { transportId } = useParams<{ transportId: string }>();
    const navigate = useNavigate();
    const [transportResponse, setTransportResponse] = useState<TransportResponse>();
    const [isLoading, setIsLoading] = useState(true);

    const { data, error: transportError, isLoading: transportLoading } = useGetTransportResponseByTransportIdQuery({
        transportId: transportId
    });

    useEffect(() => {
        if (data) {
            setTransportResponse(data);
            setIsLoading(false);
        }
    }, [data]);

    if (transportLoading) return <div>Loading...</div>;
    if (transportError) return <div>Error: {transportError.message}</div>;

    if (isLoading || !transportResponse) {
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

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết vận chuyển</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Thông tin vận chuyển</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 text-xl font-bold">Mã vận chuyển:</dt>
                            <dd className="mt-1 text-black">{transportResponse.transportDTO.transportId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Mã đơn hàng:</dt>
                            <dd className="mt-1 text-black">{transportResponse.transportDTO.orderId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Phương thức vận chuyển:</dt>
                            <dd className="mt-1 text-black">{transportResponse.transportDTO.shippingMethod}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Trạng thái:</dt>
                            <dd className={`mt-1 text-${getTransportStatusColor(transportResponse.transportDTO.status)}`}>
                                {transportStatusToString[transportResponse.transportDTO.status]}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Ngày tạo:</dt>
                            <dd className="mt-1 text-black">{dayjs(transportResponse.transportDTO.createAt).format('DD-MM-YYYY')}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Ngày cập nhật:</dt>
                            <dd className="mt-1 text-black">{dayjs(transportResponse.transportDTO.updateAt).format('DD-MM-YYYY')}</dd>
                        </div>
                    </dl>
                </div>
                <div className="bg-white rounded-md shadow-md p-6">
                    <h2 className="text-2xl font-bold text-black mb-4 text-center">Lịch sử vận chuyển</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800  text-xl font-bold">Lịch sử vận chuyển:</dt>
                            <dd className="mt-1 text-black">
                                <ul>
                                    {transportResponse.transportDTO.transportHandleDTOs.map((transportHandle, index) => (
                                        <li key={index} className="list-disc list-inside">
                                            <span
                                                className="font-bold">{transportHandle.username}</span> - {transportStatusToString[transportHandle.transportStatus]}
                                            <br/>
                                            <span
                                                className={`text-${getTransportStatusColor(transportHandle.transportStatus)}-500`}>{transportHandle.messageStatus}</span>
                                            <br/>
                                            <span
                                                className="text-gray-500">Ngày: {dayjs(transportHandle.createAt).format('DD-MM-YYYY HH:mm')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default TransportDetail;