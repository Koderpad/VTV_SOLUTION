import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    useGetTransportProviderDetailQuery,
    useUpdateTransportProviderProvincesMutation
} from '@/redux/features/manager/TransportProviderManagerApiSlice';

import {ProvinceDTO} from '@/utils/DTOs/location/dto/ProvinceDTO';
import {ToastContainer, toast} from "react-toastify";
import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";
import {fetchAllProvince} from "@/services/location/ProvinceService.ts";
import {statusToString} from "@/utils/DTOs/extra/statusToString.ts";

const UpdateTransportProviderProvinces = () => {
    const {transportProviderId} = useParams<{ transportProviderId: string }>();
    const navigate = useNavigate();
    const [transportProvider, setTransportProvider] = useState<TransportProviderDTO>();
    const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const {
        data,
        error: queryError,
        isLoading: queryLoading,
        refetch
    } = useGetTransportProviderDetailQuery(Number(transportProviderId));


    const [updateTransportProviderProvinces] = useUpdateTransportProviderProvincesMutation();

    useEffect(() => {
        if (data) {
            setTransportProvider(data.transportProviderDTO);
            setSelectedProvinces(data.transportProviderDTO.provinceDTOs.map(p => p.provinceCode));
        }
    }, [data]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetchAllProvince();
                setProvinces(response.provinceDTOs);
            } catch (error) {
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu tỉnh thành!");
            }
        };
        fetchProvinces();
    }, []);


    const handleCheckboxChange = (provinceCode: string) => {
        setSelectedProvinces(prev =>
            prev.includes(provinceCode)
                ? prev.filter(code => code !== provinceCode)
                : [...prev, provinceCode]
        );
    };

    const handleSelectAll = () => {
        setSelectedProvinces(provinces.map(p => p.provinceCode));
    };

    const handleDeselectAll = () => {
        setSelectedProvinces([]);
    };

    const handleSubmit = async () => {
        try {
            await updateTransportProviderProvinces({
                transportProviderId: Number(transportProviderId),
                provincesCode: selectedProvinces,
                usernameAdded: transportProvider?.usernameAdded || ''
            }).unwrap();
            toast.success("Cập nhật tỉnh thành thành công!");
            refetch();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi cập nhật tỉnh thành!");
        }
    };

    if (queryLoading) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-gray-700">Loading...</span></div>;
    if (queryError) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-red-500">Error: {queryError}</span></div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>
            <br/>


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

            <br/>
            <br/>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Cập nhật tỉnh thành</h1>
            <div className="mb-4 flex justify-between items-center">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                        onClick={handleSelectAll}>
                    Chọn tất cả
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDeselectAll}>
                    Bỏ chọn tất cả
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {provinces.map(province => (
                    <div key={province.provinceCode} className="flex items-center">
                        <input
                            type="checkbox"
                            id={province.provinceCode}
                            checked={selectedProvinces.includes(province.provinceCode)}
                            onChange={() => handleCheckboxChange(province.provinceCode)}
                            className="mr-2"
                        />
                        <label htmlFor={province.provinceCode} className="text-black">{province.name}</label>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSubmit}>
                    Cập nhật tỉnh thành
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default UpdateTransportProviderProvinces;
