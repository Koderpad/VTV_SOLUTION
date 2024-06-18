import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    useAddNewDeliverManagerByProviderMutation,
    useAddNewDeliverByManagerMutation,
} from "@/redux/features/shipping/ManagerDeliverApiSlice.ts";
import { TypeWork } from "@/utils/DTOs/extra/TypeWork.ts";
import { DeliverRequest } from "@/utils/DTOs/shipping/request/DeliverRequest.ts";
import { toast, ToastContainer } from "react-toastify";
import { ProvinceDTO } from "@/utils/DTOs/location/dto/ProvinceDTO.ts";
import { DistrictDTO } from "@/utils/DTOs/location/dto/DistrictDTO.ts";
import { WardDTO } from "@/utils/DTOs/location/dto/WardDTO.ts";
import { RegisterRequest } from "@/utils/DTOs/manager/request/RegisterRequest.ts";
import { getAllProvince } from "@/services/location/ProvinceService.ts";
import { getAllDistrictByProvinceCode } from "@/services/location/DistrictService.ts";
import { getAllWardByDistrictCode } from "@/services/location/WardService.ts";
import { useGetDeliverInfoMutation } from "@/redux/features/shipping/DeliverApiSlice.ts";
import { DeliverResponse } from "@/utils/DTOs/shipping/response/DeliverResponse.ts";

const AddNewDeliver = () => {
    const navigate = useNavigate();
    const [addNewDeliverManagerByProvider, { isLoading: isAddingManager, error: addManagerError }] =
        useAddNewDeliverManagerByProviderMutation();
    const [addNewDeliverByManager, { isLoading: isAddingDeliver, error: addDeliverError }] =
        useAddNewDeliverByManagerMutation();

    const [phone, setPhone] = useState("");
    const [fullAddress, setFullAddress] = useState("");
    const [typeWork, setTypeWork] = useState<TypeWork>(TypeWork.MANAGER);

    // State for location selection
    const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
    const [districts, setDistricts] = useState<DistrictDTO[]>([]);
    const [wards, setWards] = useState<WardDTO[]>([]);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [selectedWardCodes, setSelectedWardCodes] = useState<string[]>([]);
    const [selectedWardCode, setSelectedWardCode] = useState("");

    // State for RegisterRequest
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerGender, setRegisterGender] = useState(true); // Default to male
    const [registerFullName, setRegisterFullName] = useState("");
    const [registerBirthday, setRegisterBirthday] = useState(new Date());

    const [getDeliverInfo, { data: deliverResponse, error: getDeliverError, isLoading: isGettingDeliverInfo }] =
        useGetDeliverInfoMutation();
    const [deliver, setDeliver] = useState<DeliverResponse>();

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

        const fetchDeliverInfo = async () => {
            try {
                const response = await getDeliverInfo();
                setDeliver(response.data.deliverDTO);
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi lấy thông tin giao hàng!");
            }
        };
        fetchDeliverInfo();

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
        if (!selectedProvinceCode || !selectedDistrictCode || selectedWardCodes.length === 0 || !selectedWardCode) {
            toast.error("Vui lòng chọn đầy đủ thông tin địa chỉ!");
            return;
        }

        try {
            const registerRequest: RegisterRequest = {
                username: registerUsername,
                password: registerPassword,
                email: registerEmail,
                gender: registerGender,
                fullName: registerFullName,
                birthday: registerBirthday,
            };

            const deliverRequest: DeliverRequest = {
                phone,
                fullAddress,
                typeWork,
                wardCode: selectedWardCode,
                districtCodeWork: selectedDistrictCode,
                wardsCodeWork: selectedWardCodes,
                registerCustomerRequest: registerRequest,
            };

            let response;
            if (typeWork === TypeWork.MANAGER) {
                response = await addNewDeliverManagerByProvider(deliverRequest);
            } else {
                // For other typeWorks (SHIPPER, WAREHOUSE, TRANSIT, PICKUP)
                response = await addNewDeliverByManager(deliverRequest);
            }

            if (response.error) {
                toast.error(response.error.data.message);
                return;
            } else {
                toast.success("Thêm nhân viên giao hàng thành công!");
                navigate(-1);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi thêm nhân viên giao hàng!");
        }
    };

    const handleSelectProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvinceCode(e.target.value);
        setSelectedDistrictCode("");
        setSelectedWardCodes([]);
        setSelectedWardCode("");
    };

    const handleSelectDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDistrictCode(e.target.value);
        setSelectedWardCodes([]);
        setSelectedWardCode("");
    };

    // Handle Ward Checkboxes
    const handleWardCheckboxChange = (wardCode: string) => {
        setSelectedWardCodes((prev) =>
            prev.includes(wardCode) ? prev.filter((code) => code !== wardCode) : [...prev, wardCode]
        );
    };

    const handleSelectAllWards = () => {
        setSelectedWardCodes(wards.map((ward) => ward.wardCode));
    };

    const handleSelectWard = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWardCode(e.target.value);
    };

    const handleDeselectAllWards = () => {
        setSelectedWardCodes([]);
    };

    const isLoading = isAddingManager || isAddingDeliver || isGettingDeliverInfo;

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Loading...</span>
            </div>
        );

    if (!deliver) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Đang tải dữ liệu...</span>
            </div>
        );
    }

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
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Thêm nhân viên giao hàng</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Số điện thoại:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullAddress">
                                Địa chỉ đầy đủ:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fullAddress"
                                type="text"
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                required
                            />
                        </div>
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
                                {deliver.typeWork === TypeWork.PROVIDER && <option value={TypeWork.MANAGER}>Quản lý</option>}
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ward">
                                Phường/Xã:
                            </label>
                            <select
                                id="ward"
                                value={selectedWardCode}
                                onChange={handleSelectWard}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn phường/xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.wardCode} value={ward.wardCode}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {wards.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-4">Thông tin bổ sung (Phường/Xã làm việc)</h2>
                            <div className="mb-4 flex justify-between items-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                                    type="button"
                                    onClick={handleSelectAllWards}
                                >
                                    Chọn tất cả
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    type="button"
                                    onClick={handleDeselectAllWards}
                                >
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
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin đăng ký</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Tên tài khoản:</label>
                            <input
                                type="text"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Mật khẩu:</label>
                            <input
                                type="password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Email:</label>
                            <input
                                type="email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Giới tính:</label>
                            <select
                                value={registerGender ? "true" : "false"}
                                onChange={(e) => setRegisterGender(e.target.value === "true")}
                                className="w-full px-4 py-2 border rounded"
                                required
                            >
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Tên đầy đủ:</label>
                            <input
                                type="text"
                                value={registerFullName}
                                onChange={(e) => setRegisterFullName(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Ngày sinh:</label>
                            <input
                                type="date"
                                value={registerBirthday.toISOString().split("T")[0]}
                                onChange={(e) => setRegisterBirthday(new Date(e.target.value))}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                <br />

                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
                    type="submit"
                    disabled={isLoading}
                >
                    Thêm nhân viên
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddNewDeliver;