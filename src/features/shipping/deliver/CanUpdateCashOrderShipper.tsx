import {useNavigate} from 'react-router-dom';
import {
    useGetCashOrdersCanUpdateByShipperUsernameQuery,
    useShipperUpdateCashOrdersByShipperMutation
} from '@/redux/features/shipping/CashOrderApiSlice';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect, useState} from "react";
import {CashOrderDTO} from '@/utils/DTOs/shipping/dto/CashOrderDTO';
import {statusToString} from '@/utils/DTOs/extra/convertToString/statusToString';
import {FaEye, FaCheckCircle, FaTimesCircle, FaTrash} from "react-icons/fa";
import {CashOrdersRequest} from '@/utils/DTOs/shipping/request/CashOrdersRequest';
import {CashOrdersResponse} from '@/utils/DTOs/shipping/response/CashOrdersResponse';
import {useGetDeliverByUsernameRequestMutation} from '@/redux/features/shipping/DeliverApiSlice';
import {TypeWork} from '@/utils/DTOs/extra/TypeWork';
import {DeliverDTO} from "@/utils/DTOs/shipping/dto/DeliverDTO.ts";
import dayjs from 'dayjs';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CanUpdateCashOrderShipper = () => {
    const navigate = useNavigate();
    const [cashOrders, setCashOrders] = useState<CashOrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCashOrdersToWarehouse, setSelectedCashOrdersToWarehouse] = useState<string[]>([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [usernameWarehouse, setUsernameWarehouse] = useState(''); // State to store the warehouse username
    const [isWarehouseUsernameValid, setIsWarehouseUsernameValid] = useState(false); // State to track if the warehouse username is valid
    const [deliver, setDeliver] = useState<DeliverDTO>();


    const {
        data: cashOrdersData,
        isLoading: isLoadingCashOrders,
        error: errorCashOrders,
        refetch: refetchCashOrders
    } = useGetCashOrdersCanUpdateByShipperUsernameQuery();

    const [updateCashOrdersByShipper] = useShipperUpdateCashOrdersByShipperMutation();
    const [getDeliverByUsernameRequest] = useGetDeliverByUsernameRequestMutation();


    const handleChangeUsernameWarehouse = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameWarehouse(event.target.value);
        setDeliver(undefined)
    }

    // Function to validate the warehouse username
    const validateWarehouseUsername = async (username: string) => {
        try {
            const response = await getDeliverByUsernameRequest(username).unwrap();
            if (response.code === 200) {
                if (response.deliverDTO.typeWork === TypeWork.WAREHOUSE) {
                    setIsWarehouseUsernameValid(true);
                    setDeliver(response.deliverDTO);
                    return;
                }
                toast.error('Tài khoản không phải là tài khoản kho!');
            } else {
                setIsWarehouseUsernameValid(false);
                toast.error('Tài khoản không tồn tại!');
            }
        } catch (error) {
            setIsWarehouseUsernameValid(false);
            toast.error('Tài khoản vận chuyển không tồn tại hoặc gặp lỗi!');
        }
    };

    useEffect(() => {
        if (isLoadingCashOrders) {
            setIsLoading(true);
        } else if (errorCashOrders) {
            setError(errorCashOrders.message);
        } else {
            setCashOrders(cashOrdersData?.cashOrderDTOs || []);
            setIsLoading(false);
        }
    }, [isLoadingCashOrders, errorCashOrders, cashOrdersData]);

    const handleViewOrder = (cashOrderId: string) => {
        navigate(`/deliver/cash-order/detail/${cashOrderId}`);
    };

    const handleCashOrderToWarehouseCheckboxChange = (cashOrderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedCashOrdersToWarehouse([...selectedCashOrdersToWarehouse, cashOrderId]);
        } else {
            setSelectedCashOrdersToWarehouse(selectedCashOrdersToWarehouse.filter(id => id !== cashOrderId));
        }
    };

    const handleUpdateCashOrdersToWarehouse = async () => {
        if (selectedCashOrdersToWarehouse.length === 0) {
            toast.error('Vui lòng chọn ít nhất một biên lai để xác nhận!');
            return;
        }

        if (!isWarehouseUsernameValid) {
            toast.error('Vui lòng nhập username kho hợp lệ!');
            return;
        }

        setIsLoadingUpdate(true);
        try {
            const request: CashOrdersRequest = {
                cashOrderIds: selectedCashOrdersToWarehouse,
                waveHouseUsername: usernameWarehouse
            };
            const response: CashOrdersResponse = await updateCashOrdersByShipper(request).unwrap();
            if (response.code === 200) {
                toast.success('Xác nhận chuyển tiền thành công!');
                handleDeselectAllToWarehouse();
                refetchCashOrders();
            } else {
                toast.error('Xác nhận chuyển tiền thất bại!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const handleSelectAllToWarehouse = () => {
        setSelectedCashOrdersToWarehouse(cashOrders.map(order => order.cashOrderId));
    };

    const handleDeselectAllToWarehouse = () => {
        setSelectedCashOrdersToWarehouse([]);
    };

    const handleRemoveCashOrder = (cashOrderId: string) => {
        setSelectedCashOrdersToWarehouse(selectedCashOrdersToWarehouse.filter(id => id !== cashOrderId));
    };

    const getCashOrderById = (cashOrderId: string) => {
        return cashOrders.find(order => order.cashOrderId === cashOrderId);
    };

    const renderCashOrders = () => {
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

        if (cashOrders.length === 0) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Không có đơn hàng nào</span>
                </div>
            );
        }

        const totalMoneyUnselected = cashOrders.reduce((total, order) => {
            if (!selectedCashOrdersToWarehouse.includes(order.cashOrderId)) {
                return total + order.money;
            }
            return total;
        }, 0);

        const totalMoneySelected = selectedCashOrdersToWarehouse.reduce((total, cashOrderId) => {
            const order = getCashOrderById(cashOrderId);
            return order ? total + order.money : total;
        }, 0);

        return (
            <div>
                <div className="flex justify-between mb-4">
                    <span>Tổng số tiền chưa chọn: {totalMoneyUnselected.toLocaleString()} VNĐ</span>
                    <span>Tổng số tiền đã chọn: {totalMoneySelected.toLocaleString()} VNĐ</span>
                </div>
                <div className="flex justify-start items-center mb-4 space-x-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleSelectAllToWarehouse}
                    >
                        Chọn tất cả
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDeselectAllToWarehouse}
                    >
                        Bỏ chọn tất cả
                    </button>
                </div>


                <table className="min-w-full bg-white">
                    <thead>
                    <tr>

                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Chọn
                        </th>

                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            STT
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Mã biên lai
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                            Số tiền (VNĐ)
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                            Ngày
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Trạng thái
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Đang cầm tiền
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Xem
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {cashOrders.map((cashOrder, index) => (
                        <tr key={cashOrder.cashOrderId}>
                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <div className="flex justify-center items-center">
                                    <input
                                        type="checkbox"
                                        id={`cashOrderToWarehouse-${cashOrder.cashOrderId}`}
                                        className="mr-2"
                                        checked={selectedCashOrdersToWarehouse.includes(cashOrder.cashOrderId)}
                                        onChange={(event) => handleCashOrderToWarehouseCheckboxChange(cashOrder.cashOrderId, event)}
                                    />
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{cashOrder.cashOrderId}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-right">{cashOrder.money.toLocaleString()}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                                {cashOrder.createAt ? dayjs(cashOrder.createAt).format('DD/MM/YYYY') : ''}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{statusToString[cashOrder.status]}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <div className="flex justify-center items-center">
                                    {cashOrder.shipperHold && <FaCheckCircle
                                        className="text-green-500 cursor-pointer hover:text-green-600 mr-2"/>}
                                    {!cashOrder.shipperHold &&
                                        <FaTimesCircle
                                            className="text-red-500 cursor-pointer hover:text-red-600 mr-2"/>}
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <div className="flex justify-center items-center">
                                    <FaEye
                                        className="text-blue-500 cursor-pointer hover:text-blue-600 mr-2"
                                        onClick={() => handleViewOrder(cashOrder.cashOrderId)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {selectedCashOrdersToWarehouse.length > 0 && (
                    <div className="mt-4">
                        <br/>
                        <h2 className="text-xl font-bold text-black mb-2">Danh sách biên lai đã chọn</h2>
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    STT
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                    Mã biên lai
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                   Ngày
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-700">
                                    Số tiền (VNĐ)
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                    Xóa
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedCashOrdersToWarehouse.map((cashOrderId, index) => {
                                const order = getCashOrderById(cashOrderId);
                                return order ? (
                                    <tr key={cashOrderId}>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{cashOrderId}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            {order.createAt ? dayjs(order.createAt).format('DD/MM/YYYY') : ''}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-right">{order.money.toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                            <div className="flex justify-center items-center">
                                                <FaTrash
                                                    className="cursor-pointer hover:text-red-600" // Add hover effect
                                                    onClick={() => handleRemoveCashOrder(cashOrderId)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : null;
                            })}
                            </tbody>
                        </table>
                        <div className="mt-2 text-right">
                            <span>Tổng số tiền đã chọn: {totalMoneySelected.toLocaleString()} VNĐ</span>
                        </div>

                        <br/>
                        <div className="mb-4 ">
                            <div className="mb-4">
                                <div className="mr-4">
                                    <label htmlFor="warehouseUsername"
                                           className="block text-gray-700 text-sm font-bold mb-2">
                                        Tài khoản kho:       {!isWarehouseUsernameValid && (
                                        <h1 className="text-red-500 mt-1">Tài khoản kho không hợp lệ!</h1>
                                    )}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="warehouseUsername"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={usernameWarehouse}
                                            onChange={(e) => handleChangeUsernameWarehouse(e)}
                                        />

                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 cursor-pointer ${usernameWarehouse.length === 0 ? 'hidden' : 'block'}`}
                                            onClick={() => validateWarehouseUsername(usernameWarehouse)}
                                        />

                                    </div>
                                </div>
                            </div>









                            <br/>
                            {deliver && (
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full leading-normal">
                                        <tbody>
                                        <tr>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                                                Tài khoản
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.usernameCustomer}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                                                Email
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.emailCustomer}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                                                SĐT
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                                                Địa chỉ
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {deliver?.fullAddress}, {deliver?.wardName}, {deliver?.districtName}, {deliver?.provinceName}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                                                Địa chỉ làm việc
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                {deliver?.districtWork.name}, {deliver?.districtWork.provinceName}
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>)}

                        </div>


                    </div>
                )}
            </div>
        );
    };

    const renderUpdateCashOrders = () => {
        if (isLoadingUpdate) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Loading...</span>
                </div>
            );
        }


        return (
            <div className="flex justify-between items-center mt-8">
                <button
                    className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
                    onClick={handleUpdateCashOrdersToWarehouse}
                    disabled={!isWarehouseUsernameValid}
                >
                    Xác nhận chuyển tiền cho kho
                </button>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>
            </div>
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Danh sách biên lai đang giữ tiền</h1>
            {renderCashOrders()}
            {renderUpdateCashOrders()}
            <ToastContainer/>
        </div>
    );
};

export default CanUpdateCashOrderShipper;