import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTransportResponseByTransportIdQuery } from "@/redux/features/shipping/TransportApiSlice.ts";
import { transportStatusToString } from "@/utils/DTOs/extra/convertToString/transportStatusToString.ts";
import { getTransportStatusColor } from "@/utils/DTOs/extra/color/getTransportStatusColor.ts";
import TransportResponse from "@/utils/DTOs/shipping/response/TransportResponse.ts";
import dayjs from "dayjs";
import TransportDetailProps from "@/features/shipping/transport/TransportDetailProps.tsx";

const TransportDetail = () => {
    const { transportId } = useParams<{ transportId: string }>();
    const navigate = useNavigate();
    const [transportResponse, setTransportResponse] = useState<TransportResponse>();
    const [isLoading, setIsLoading] = useState(true);

    const { data, error: transportError, isLoading: transportLoading } =
        useGetTransportResponseByTransportIdQuery({ transportId: transportId });

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
`
            <TransportDetailProps transportDTO={transportResponse.transportDTO} />
        </div>
    );
};

export default TransportDetail;