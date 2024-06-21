import {useParams, useNavigate} from 'react-router-dom';
import {useGetDeliverInfoMutation} from '@/redux/features/shipping/DeliverApiSlice';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, {useEffect, useState} from "react";
import {
    useGetTransportsByWardWorksDeliverQuery,
    useGetTransportsByWardQuery, useGetShopAndTransportsDTOByShopIdQuery, useGetTransportsByDistrictCodeQuery
} from "@/redux/features/shipping/TransportApiSlice";
import {transportStatusToString} from "@/utils/DTOs/extra/convertToString/transportStatusToString";
import {ShopAndTransportsDTO} from "@/utils/DTOs/shipping/dto/ShopAndTransportsDTO";
import {DeliverDTO} from "@/utils/DTOs/shipping/dto/DeliverDTO";
import {FaEye} from "react-icons/fa";
import {ProvinceDTO} from "@/utils/DTOs/location/dto/ProvinceDTO.ts";
import {DistrictDTO} from "@/utils/DTOs/location/dto/DistrictDTO.ts";
import {getAllProvince} from "@/services/location/ProvinceService.ts";
import {getAllDistrictByProvinceCode} from "@/services/location/DistrictService.ts";

const DeliverTransportPage = () => {
    const {deliverId} = useParams<{ deliverId: string }>();
    const navigate = useNavigate();
    const [deliverInfo, setDeliverInfo] = useState<DeliverDTO | null>(null);
    const [selectedWardCode, setSelectedWardCode] = useState<string>('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [showProvinceDistrict, setShowProvinceDistrict] = useState(false);

    const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
    const [districts, setDistricts] = useState<DistrictDTO[]>([]);
    const [getDeliverInfo] = useGetDeliverInfoMutation();

    // Conditional Fetching - Use skip to prevent unnecessary fetches
    const {
        data: transportsDataByWardWorks,
        isLoading: isLoadingWardWorks,
        error: errorWardWorks
    } = useGetTransportsByWardWorksDeliverQuery({skip: !!selectedWardCode});

    const {
        data: transportsDataByWard,
        isLoading: isLoadingWard,
        error: errorWard,
        refetch: refetchWard
    } = useGetTransportsByWardQuery(selectedWardCode, {
        skip: !selectedWardCode,
    });

    const {
        data: transportsDataByDistrictCode,
        isLoading: isLoadingDistrict,
        error: errorDistrict,
        refetch: refetchDistrict
    } = useGetTransportsByDistrictCodeQuery(selectedDistrictCode, {
        skip: !selectedDistrictCode,
    });


    const handleSelectProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvinceCode(e.target.value);
        setSelectedDistrictCode("");
        setDistricts([]); // Clear districts when province changes
    };

    const handleSelectDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrictCode(e.target.value);
        if (selectedDistrictCode) {
            refetchDistrict();
        }
    };

    const handleToggleProvinceDistrict = () => {
        setShowProvinceDistrict(!showProvinceDistrict);
        if (!showProvinceDistrict) {
            setSelectedProvinceCode("");
            setSelectedDistrictCode("");
            setDistricts([]);
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await getAllProvince();
                setProvinces(response.provinceDTOs);
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu tỉnh thành!");
            }
        };
        fetchProvinces();

    }, []);


    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                if (selectedProvinceCode) {
                    const response = await getAllDistrictByProvinceCode(selectedProvinceCode);
                    setDistricts(response.districtDTOs);
                } else {
                    setDistricts([]);
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu quận/huyện!");
            }
        };
        fetchDistricts();
    }, [selectedProvinceCode]);


    useEffect(() => {
        const fetchDeliverInfo = async () => {
            try {
                const response = await getDeliverInfo();
                setDeliverInfo(response.data.deliverDTO);
            } catch (error) {
                console.error("Error fetching deliver info:", error);
            }
        };
        fetchDeliverInfo();
    }, [deliverId, getDeliverInfo]);


    useEffect(() => {
        if (selectedWardCode) {
            refetchWard();
            setSelectedDistrictCode("");
            setDistricts([]);
            setSelectedProvinceCode("");
        }
    }, [selectedWardCode, refetchWard]);

    const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWardCode(event.target.value);
    };

    const renderTransportsByWard = (transports: ShopAndTransportsDTO[]) => (
        <table className="min-w-full bg-white">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    STT
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    Tên cửa hàng
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    Số đơn vận
                </th>
                <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                    Phường/Xã
                </th>
                <th className=" py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                    Địa chỉ
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700 ">
                    Thao tác
                </th>
            </tr>
            </thead>
            <tbody>
            {transports.map((transport, index) => (
                <tr key={transport.shopDTO.shopId}>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{transport.shopDTO.name}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{transport.count}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">{transport.wardName}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-left">
                        {transport.shopDTO.address}, {transport.shopDTO.wardName}, {transport.shopDTO.districtName}, {transport.shopDTO.provinceName}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                        <div className="flex justify-center items-center">
                            <FaEye
                                className="text-blue-500 cursor-pointer hover:text-blue-600"
                                onClick={() => navigate(`/deliver/transport/shop/${transport.shopDTO.shopId}`)}
                            />
                        </div>

                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    const renderContent = () => {
        if (isLoadingWardWorks || isLoadingWard || isLoadingDistrict) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">Loading...</span>
                </div>
            );
        }

        if (errorWardWorks || errorWard || errorDistrict) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span
                        className="text-xl text-red-500">Error: {errorWardWorks?.message || errorWard?.message || errorDistrict?.message}</span>
                </div>
            );
        }

        if (!deliverInfo) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <span className="text-xl text-gray-700">No deliver information available</span>
                </div>
            );
        }

        return (
            <div>
                <div className="mb-4">
                    <label htmlFor="ward-select" className="block text-gray-700 font-bold mb-2">Chọn phường/xã:</label>
                    <select
                        id="ward-select"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleWardChange}
                        value={selectedWardCode}
                    >
                        <option value="">Tất cả</option>
                        {deliverInfo.wardsWork.map((ward) => (
                            <option key={ward.wardCode} value={ward.wardCode}>
                                {ward.name}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="mb-4 relative group">
                    <button
                        className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${showProvinceDistrict ? 'bg-blue-500 text-white' : ''}`}
                        onClick={handleToggleProvinceDistrict}
                    >
                        {showProvinceDistrict ? 'Ẩn Tỉnh/Thành phố và Quận/Huyện' : 'Chọn Tỉnh/Thành phố và Quận/Huyện'}
                    </button>
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 right-2 cursor-pointer ${showProvinceDistrict ? 'rotate-180' : ''}`}
                        onClick={handleToggleProvinceDistrict}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-transform duration-300 ease-in-out ${showProvinceDistrict ? 'rotate-180' : ''}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {showProvinceDistrict && (
                    <div className="mb-4 flex">
                        <div className="mr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                                Tỉnh/Thành phố:
                            </label>
                            <select
                                id="province"
                                value={selectedProvinceCode}
                                onChange={handleSelectProvince}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
                                {provinces.map((province) => (
                                    <option key={province.provinceCode} value={province.provinceCode}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mr-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                                Quận/Huyện:
                            </label>
                            <select
                                id="district"
                                value={selectedDistrictCode}
                                onChange={handleSelectDistrict}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((district) => (
                                    <option key={district.districtCode} value={district.districtCode}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">
                        Danh sách đơn vận chuyển của
                        {selectedDistrictCode ? ` quận ${districts.find(d => d.districtCode === selectedDistrictCode)?.name}` :
                            (selectedWardCode ? ` phường ${deliverInfo.wardsWork.find(w => w.wardCode === selectedWardCode)?.name}` : "tất cả")}
                    </h2>
                    {selectedDistrictCode
                        ? (transportsDataByDistrictCode && renderTransportsByWard(transportsDataByDistrictCode.shopAndTransportsDTOs))
                        : (selectedWardCode
                                ? (transportsDataByWard && renderTransportsByWard(transportsDataByWard.shopAndTransportsDTOs))
                                : (transportsDataByWardWorks && renderTransportsByWard(transportsDataByWardWorks.shopAndTransportsDTOs))
                        )
                    }
                </div>


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
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Danh sách cửa hàng và đơn vận</h1>
            {renderContent()}
            <ToastContainer/>
        </div>
    );
};

export default DeliverTransportPage;