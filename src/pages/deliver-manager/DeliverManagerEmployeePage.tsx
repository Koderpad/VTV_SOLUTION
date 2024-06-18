import React, {useState, useEffect} from 'react';
import {Status} from '@/utils/DTOs/extra/Status';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAdd, faEdit, faEye} from '@fortawesome/free-solid-svg-icons';
import {
    useGetTransportProviderByUsernameQuery
} from "@/redux/features/shipping/TransportProviderApiSlice.ts";
import {useGetListDeliverByStatusAndTypeWorkQuery} from "@/redux/features/shipping/ManagerDeliverApiSlice.ts";
import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";
import {TypeWork} from '@/utils/DTOs/extra/TypeWork';
import {statusToString} from '@/utils/DTOs/extra/convertToString/statusToString';
import {typeWorkToString} from "@/utils/DTOs/extra/convertToString/typeWorkToString.ts";

const DeliverManagerEmployeePage = () => {
    const navigate = useNavigate();
    const [transportProvider, setTransportProvider] = useState<TransportProviderDTO>();
    const {data, error, isLoading, refetch} = useGetTransportProviderByUsernameQuery();

    const [status, setStatus] = useState(Status.ACTIVE);
    const [typeWork, setTypeWork] = useState(TypeWork.MANAGER);

    const {
        data: deliverData,
        isLoading: isDeliverLoading,
        error: deliverError,
        refetch: refetchDeliver,
    } = useGetListDeliverByStatusAndTypeWorkQuery({status, typeWork});

    useEffect(() => {
        try {
            if (data) {
                setTransportProvider(data.transportProviderDTO);
            }
        } catch (e) {
            console.error("Error fetching transport provider data:", e);
            // Handle error appropriately (e.g., display a message to the user)
        }
    }, [data]);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as Status);
        refetchDeliver();
    };

    const handleTypeWorkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTypeWork(e.target.value as TypeWork);
        refetchDeliver();
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-gray-700">Loading...</span></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-red-500">Error: {error.message}</span></div>;

    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8 py-8">
                    <div className="flex justify-between items-center">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                            onClick={() => navigate(-1)}
                        >
                            Quay Lại
                        </button>

                        <button
                            className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4"
                            onClick={() => navigate('/deliver_manager/employee/add')}
                        >
                            <FontAwesomeIcon icon={faAdd}/>
                            <span className="ml-2">Thêm</span>
                        </button>
                    </div>

                    <h1 className="text-4xl font-bold text-black mb-8 text-center">Danh sách nhân viên</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Trạng thái:
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={handleStatusChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value={Status.ACTIVE}>Đang hoạt động</option>
                                <option value={Status.INACTIVE}>Không hoạt động</option>
                                <option value={Status.LOCKED}>Đã khóa</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeWork">
                                Loại công việc:
                            </label>
                            <select
                                id="typeWork"
                                value={typeWork}
                                onChange={handleTypeWorkChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value={TypeWork.SHIPPER}>Giao hàng</option>
                                <option value={TypeWork.TRANSIT}>Trung chuyển</option>
                                <option value={TypeWork.PICKUP}>Lấy hàng</option>
                                <option value={TypeWork.WAREHOUSE}>Kho</option>

                            </select>
                        </div>
                    </div>
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full leading-normal">
                            <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    STT
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tài khoản
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Số điện thoại
                                </th>
                                <th className=" px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Loại công việc
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tỉnh/Thành phố
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Xem
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Cập nhật
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {deliverData?.deliverDTOs.map((deliver, index) => (
                                <tr key={deliver.deliverId}>
                                    <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {index + 1}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {deliver.usernameCustomer}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {deliver.emailCustomer}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {deliver.phone}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {typeWorkToString[deliver.typeWork]}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {deliver.provinceName}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                        {statusToString[deliver.status]}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                        <button
                                            onClick={() => navigate(`/provider/employee/detail/${deliver.deliverId}`)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <FontAwesomeIcon icon={faEye}/>
                                        </button>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                        <button
                                            onClick={() => navigate(`/provider/employee/update-work/${deliver.deliverId}`)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEdit}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default DeliverManagerEmployeePage;