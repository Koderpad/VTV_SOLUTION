import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetDeliverByDeliverIdQuery,
    useUpdateDeliverWorkMutation,
    useUpdateStatusDeliverMutation,
} from "@/redux/features/shipping/ManagerDeliverApiSlice.ts";
import { statusToString } from "@/utils/DTOs/extra/statusToString.ts";
import { typeWorkToString } from "@/utils/DTOs/extra/convertToString/typeWorkToString.ts";
import { UpdateDeliverWorkRequest } from "@/utils/DTOs/shipping/request/UpdateDeliverWorkRequest.ts";
import { TypeWork } from "@/utils/DTOs/extra/TypeWork.ts";
import { Status } from "@/utils/DTOs/extra/Status.ts";
import { toast, ToastContainer } from "react-toastify";
import { ProvinceDTO } from "@/utils/DTOs/location/dto/ProvinceDTO.ts";
import { DistrictDTO } from "@/utils/DTOs/location/dto/DistrictDTO.ts";
import { WardDTO } from "@/utils/DTOs/location/dto/WardDTO.ts";
import {getAllProvince} from "@/services/location/ProvinceService.ts";
import {getAllWardByDistrictCode} from "@/services/location/WardService.ts";
import {getAllDistrictByProvinceCode} from "@/services/location/DistrictService.ts";

const UpdateDeliverWork = () => {
    const { deliverId } = useParams<{ deliverId: string }>();
    const navigate = useNavigate();
    const { data, error, isLoading, refetch } = useGetDeliverByDeliverIdQuery(Number(deliverId));
    const [updateDeliverWork, { isLoading: isUpdating, error: updateError }] = useUpdateDeliverWorkMutation();
    const [updateStatusDeliver, { isLoading: isUpdatingStatus, error: updateStatusError }] = useUpdateStatusDeliverMutation();

    const [typeWork, setTypeWork] = useState<TypeWork>(TypeWork.MANAGER);
    const [districtCodeWork, setDistrictCodeWork] = useState("");
    const [wardsCodeWork, setWardsCodeWork] = useState<string[]>([]);
    const [status, setStatus] = useState<Status>(Status.ACTIVE);

    // State for location selection
    const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
    const [districts, setDistricts] = useState<DistrictDTO[]>([]);
    const [wards, setWards] = useState<WardDTO[]>([]);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [selectedWardCodes, setSelectedWardCodes] = useState<string[]>([]); // Array to store selected ward codes

    useEffect(() => {
        if (data?.deliverDTO) {
            setTypeWork(data.deliverDTO.typeWork);
            setDistrictCodeWork(data.deliverDTO.districtWork?.districtCode || "");
            setWardsCodeWork(data.deliverDTO.wardsWork.map((ward) => ward.wardCode));
            setStatus(data.deliverDTO.status);
        }
    }, [data]);

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
        const fetchWards = async () => {
            try {
                if (selectedDistrictCode) {
                    const response = await getAllWardByDistrictCode(selectedDistrictCode);
                    setWards(response.wardDTOs);
                } else {
                    setWards([]);
                }
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu phường/xã!");
            }
        };
        fetchWards();
    }, [selectedDistrictCode]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await updateDeliverWork({
                deliverId: Number(deliverId),
                data: {
                    typeWork,
                    districtCodeWork: selectedDistrictCode, // Update with selected district code
                    wardsCodeWork: selectedWardCodes, // Update with selected ward codes
                } as UpdateDeliverWorkRequest,
            });
            if (response.data) {
                toast.success("Cập nhật thông tin thành công!");
                refetch();
            } else {
                toast.error(response.error.data.message);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi cập nhật thông tin!");
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as Status);
        try {
            const response = await updateStatusDeliver({
                deliverId: Number(deliverId),
                status: e.target.value as Status,
            });
            if (response.data.success) {
                toast.success("Cập nhật trạng thái thành công!");
                refetch();
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi cập nhật trạng thái!");
        }
    };

    const handleSelectProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvinceCode(e.target.value);
        setSelectedDistrictCode("");
        setSelectedWardCodes([]);
    }

    const handleSelectDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {

        setSelectedDistrictCode(e.target.value);
        setSelectedWardCodes([]);
    }

    // Handle Ward Checkboxes
    const handleWardCheckboxChange = (wardCode: string) => {
        setSelectedWardCodes((prev) =>
            prev.includes(wardCode)
                ? prev.filter((code) => code !== wardCode)
                : [...prev, wardCode]
        );
    };

    const handleSelectAllWards = () => {
        setSelectedWardCodes(wards.map((ward) => ward.wardCode));
    };

    const handleDeselectAllWards = () => {
        setSelectedWardCodes([]);
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Loading...</span>
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-red-500">Error: {error.message}</span>
            </div>
        );

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>
            </div>
            <br />
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Cập nhật công việc nhân viên</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeWork">
                                Loại công việc:
                            </label>
                            <select
                                id="typeWork"
                                value={typeWork}
                                onChange={(e) => setTypeWork(e.target.value as TypeWork)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value={TypeWork.MANAGER}>Quản lý</option>
                                <option value={TypeWork.SHIPPER}>Giao hàng</option>
                                <option value={TypeWork.TRANSIT}>Trung chuyển</option>
                                <option value={TypeWork.PICKUP}>Lấy hàng</option>
                                <option value={TypeWork.WAREHOUSE}>Kho</option>
                            </select>
                        </div>
                        <div className="mb-4">
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
                        <div className="mb-4">
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

                    {wards.length > 0 &&

                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4">Thông tin bổ sung (Phường/Xã)</h2>
                            <div className="mb-4 flex justify-between items-center">
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                                        type="button"
                                        onClick={handleSelectAllWards}>
                                    Chọn tất cả
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        type="button"
                                        onClick={handleDeselectAllWards}>
                                    Bỏ chọn tất cả
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {wards.map((ward) => (
                                    <div key={ward.wardCode} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={ward.wardCode}
                                            checked={selectedWardCodes.includes(ward.wardCode)}
                                            onChange={() => handleWardCheckboxChange(ward.wardCode)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={ward.wardCode} className="text-black">
                                            {ward.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }


                </div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
                    type="submit"
                    disabled={isUpdating}
                >
                    Cập nhật
                </button>
            </form>
            <br/>
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
                    <option value={Status.DELETED}>Đã xóa</option>
                    <option value={Status.CANCEL}>Đã hủy</option>
                    <option value={Status.LOCKED}>Đã khóa</option>
                </select>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default UpdateDeliverWork;