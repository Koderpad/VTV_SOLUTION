import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useFindTransportResponseByTransportIdMutation,
    useUpdateStatusTransportByDeliverMutation,
} from '@/redux/features/shipping/TransportApiSlice.ts';

import TransportResponse from '@/utils/DTOs/shipping/response/TransportResponse.ts';
import {TransportStatus} from '@/utils/DTOs/extra/TransportStatus.ts';
import TransportDetailProps from "@/features/shipping/transport/TransportDetailProps.tsx";
import {ToastContainer, toast} from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

const UpdateTransportPage = () => {
    const navigate = useNavigate();
    const [transportId, setTransportId] = useState<string>("");
    const [transportResponse, setTransportResponse] = useState<TransportResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<TransportStatus>(TransportStatus.PICKED_UP);

    const [findTransport, {isLoading: transportLoading}] = useFindTransportResponseByTransportIdMutation();


    const [updateStatusTransport] = useUpdateStatusTransportByDeliverMutation();

    const handleTransportIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransportId(event.target.value);

    };

    const handleSearchTransport = async () => {
        try {

            setTransportResponse(undefined);
            const isValidUUID = validateUUID(transportId);
            if (!isValidUUID) {
                toast.error('Vui lòng nhập đúng định dạng UUID.');
                return;
            }
            setIsLoading(true);
            try {
                const response = await findTransport(transportId).unwrap();
                setTransportResponse(response);
            } catch (error) {
                toast.error(error.data.message);
            }

            setIsLoading(false);
        } catch (error) {
            toast.error('Lỗi khi tìm kiếm đơn vận chuyển');
        }
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as TransportStatus);
    };

    const handleUpdateStatus = async () => {
        try {
            if (!transportResponse || !transportId) {
                toast.error('Vui lòng tìm kiếm đơn vận chuyển trước.');
                return;
            }

            const response = await updateStatusTransport({
                transportId,
                status: selectedStatus,
                handled: true,
                wardCode: transportResponse.transportDTO.wardCodeCustomer,
            });


            if (response.data) {
                setTransportResponse(response.data);
                toast.success('Cập nhật trạng thái thành công!');
            } else {
                toast.error(response.error.data.message);
            }


        } catch (error) {
            toast.error('Lỗi cập nhật trạng thái');
        }
    };


    const validateUUID = (uuid: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    };


    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">
                Cập nhật trạng thái đơn vận chuyển
            </h1>


            <div className="mb-4 flex items-center justify-between"> {/* Wrap input and button in a flex div */}
                <label
                    htmlFor="transport-id"
                    className="block text-gray-700 font-bold mb-2 mr-2"
                >
                    Nhập mã đơn vận chuyển:
                </label>
                <input
                    type="text"
                    id="transport-id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                    value={transportId}
                    onChange={handleTransportIdChange}
                />

                <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        !validateUUID(transportId) ? 'opacity-50 cursor-not-allowed' : '' // Disable button if UUID is invalid
                    }  `}
                    onClick={handleSearchTransport}
                    disabled={!validateUUID(transportId)} // Disable button if UUID is invalid
                >
                    Tìm kiếm
                </button>
            </div>




            {transportResponse && (
                <div className="mt-8">


                    <div className="mb-4 flex items-center justify-between">
                        <label
                            htmlFor="transport-status"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Chọn trạng thái mới:
                        </label>
                        <select
                            id="transport-status"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value={TransportStatus.PICKED_UP}>Đã lấy hàng</option>
                            <option value={TransportStatus.IN_TRANSIT}>Đang trung chuyển</option>
                            <option value={TransportStatus.WAREHOUSE}>Đang ở kho</option>
                            <option value={TransportStatus.SHIPPING}>Đang giao hàng</option>
                            <option value={TransportStatus.DELIVERED}>Đã giao hàng</option>
                            <option value={TransportStatus.RETURNED}>Hoàn hàng</option>
                        </select>

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            onClick={handleUpdateStatus}
                            disabled={transportLoading}
                        >
                            Cập nhật
                        </button>
                    </div>
                    <TransportDetailProps transportDTO={transportResponse.transportDTO}/>

                </div>
            )}

            {transportLoading && (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Loading...</span>
                </div>
            )}


            <ToastContainer/>
        </div>
    );
};

export default UpdateTransportPage;