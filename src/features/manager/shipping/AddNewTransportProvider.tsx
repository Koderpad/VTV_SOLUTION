import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddNewTransportProviderMutation } from '@/redux/features/manager/TransportProviderManagerApiSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllProvince } from '@/services/location/ProvinceService.ts';
import { ProvinceDTO } from '@/utils/DTOs/location/dto/ProvinceDTO';
import { TransportProviderRegisterRequest } from '@/utils/DTOs/manager/request/TransportProviderRegisterRequest.ts';

const AddNewTransportProvider = () => {
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState<ProvinceDTO[]>([]);
    const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
    const [addNewTransportProvider] = useAddNewTransportProviderMutation();
    const [form, setForm] = useState<TransportProviderRegisterRequest>({
        fullName: '',
        shortName: '',
        email: '',
        phone: '',
        provincesCode: [],
        usernameAdded: '',
        feeShippingRequest: {
            zeroArea: 0,
            zeroEstimatedDeliveryTime: 0,
            oneArea: 0,
            oneEstimatedDeliveryTime: 0,
            twoArea: 0,
            twoEstimatedDeliveryTime: 0,
            threeArea: 0,
            threeEstimatedDeliveryTime: 0,
            fourArea: 0,
            fourEstimatedDeliveryTime: 0,
        },
        registerRequest: {
            username: '',
            password: '',
            email: '',
            gender: true,
            fullName: '',
            birthday: new Date(),
        },
    });

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetchAllProvince();
                setProvinces(response.provinceDTOs);
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi lấy dữ liệu tỉnh thành!');
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            handleCheckboxChange(value);
        } else {
            setForm(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleFeeShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            feeShippingRequest: {
                ...prevState.feeShippingRequest,
                [name]: Number(value),
            },
        }));
    };

    const handleRegisterRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            registerRequest: {
                ...prevState.registerRequest,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addNewTransportProvider({
                ...form,
                provincesCode: selectedProvinces,
            }).unwrap();
            toast.success('Thêm nhà cung cấp vận chuyển thành công!');
            navigate('/manager/transport-providers');
        } catch (error) {
            toast.error(error.data.message || 'Đã xảy ra lỗi khi thêm nhà cung cấp vận chuyển!');
        }
    };

    const handleSelectAll = () => {
        setSelectedProvinces(provinces.map(p => p.provinceCode));
    };

    const handleDeselectAll = () => {
        setSelectedProvinces([]);
    };

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Thêm Đơn Vị Cung Cấp Vận Chuyển Mới</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-neutral-800 font-bold mb-1">Tên đầy đủ:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-800 font-bold mb-1">Tên ngắn:</label>
                                <input
                                    type="text"
                                    name="shortName"
                                    value={form.shortName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-800 font-bold mb-1">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-neutral-800 font-bold mb-1">Số điện thoại:</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Phí vận chuyển (VNĐ)</h2>
                        <div className="space-y-4">
                            <div className="flex space-x-4 items-center">
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Cùng xã/phường:</label>
                                    <input
                                        type="number"
                                        name="zeroArea"
                                        value={form.feeShippingRequest.zeroArea}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho
                                        cùng xã/phường (ngày):</label>
                                    <input
                                        type="number"
                                        name="zeroEstimatedDeliveryTime"
                                        value={form.feeShippingRequest.zeroEstimatedDeliveryTime}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Cùng quận/huyện:</label>
                                    <input
                                        type="number"
                                        name="oneArea"
                                        value={form.feeShippingRequest.oneArea}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho
                                        cùng quận/huyện (ngày):</label>
                                    <input
                                        type="number"
                                        name="oneEstimatedDeliveryTime"
                                        value={form.feeShippingRequest.oneEstimatedDeliveryTime}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Cùng tỉnh/thành
                                        phố:</label>
                                    <input
                                        type="number"
                                        name="twoArea"
                                        value={form.feeShippingRequest.twoArea}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho
                                        cùng tỉnh/thành phố (ngày):</label>
                                    <input
                                        type="number"
                                        name="twoEstimatedDeliveryTime"
                                        value={form.feeShippingRequest.twoEstimatedDeliveryTime}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Cùng khu vực:</label>
                                    <input
                                        type="number"
                                        name="threeArea"
                                        value={form.feeShippingRequest.threeArea}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho
                                        cùng khu vực (ngày):</label>
                                    <input
                                        type="number"
                                        name="threeEstimatedDeliveryTime"
                                        value={form.feeShippingRequest.threeEstimatedDeliveryTime}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-4 items-center">
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Khác khu vực:</label>
                                    <input
                                        type="number"
                                        name="fourArea"
                                        value={form.feeShippingRequest.fourArea}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-neutral-800 font-bold mb-1">Thời gian giao hàng cho
                                        khác khu vực (ngày):</label>
                                    <input
                                        type="number"
                                        name="fourEstimatedDeliveryTime"
                                        value={form.feeShippingRequest.fourEstimatedDeliveryTime}
                                        onChange={handleFeeShippingChange}
                                        className="w-full px-4 py-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin đăng ký</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Tên tài khoản:</label>
                            <input
                                type="text"
                                name="username"
                                value={form.registerRequest.username}
                                onChange={handleRegisterRequestChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Mật khẩu:</label>
                            <input
                                type="password"
                                name="password"
                                value={form.registerRequest.password}
                                onChange={handleRegisterRequestChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={form.registerRequest.email}
                                onChange={handleRegisterRequestChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Giới tính:</label>
                            <select
                                name="gender"
                                value={form.registerRequest.gender ? 'true' : 'false'}
                                onChange={handleRegisterRequestChange}
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
                                name="fullName"
                                value={form.registerRequest.fullName}
                                onChange={handleRegisterRequestChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-neutral-800 font-bold mb-1">Ngày sinh:</label>
                            <input
                                type="date"
                                name="birthday"
                                value={form.registerRequest.birthday.toISOString().split('T')[0]}
                                onChange={handleRegisterRequestChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-black mb-4">Tỉnh thành hoạt động</h2>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {provinces.map(province => (
                            <div key={province.provinceCode}>
                                <label className="text-neutral-800">
                                    <input
                                        type="checkbox"
                                        name="provincesCode"
                                        value={province.provinceCode}
                                        checked={selectedProvinces.includes(province.provinceCode)}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    {province.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-8 py-2 rounded hover:bg-green-600"
                    >
                        Thêm Nhà Cung Cấp
                    </button>
                </div>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default AddNewTransportProvider;
