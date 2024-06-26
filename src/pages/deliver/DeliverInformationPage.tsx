import { useParams, useNavigate } from 'react-router-dom';
import { useGetDeliverInfoMutation } from '@/redux/features/shipping/DeliverApiSlice';
import { statusToString } from '@/utils/DTOs/extra/convertToString/statusToString.ts';
import { typeWorkToString } from '@/utils/DTOs/extra/convertToString/typeWorkToString.ts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";


const DeliverInformationPage = () => {
    const { deliverId } = useParams<{ deliverId: string }>();
    const navigate = useNavigate();
    const [deliverInfo, setDeliverInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [getDeliverInfo] = useGetDeliverInfoMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getDeliverInfo();
                setDeliverInfo(response.data.deliverDTO);
            } catch (e) {
                setError(e);
                console.error("Error fetching data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [deliverId, getDeliverInfo]);

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
                <span className="text-xl text-red-500">Error: {error.message}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}>
                    Quay Lại
                </button>
            </div>
            <br/>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Thông tin cá nhân</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã nhân viên:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.deliverId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Số điện thoại:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.phone}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tỉnh/Thành phố:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.provinceName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Quận/Huyện:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.districtName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Phường/Xã:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.wardName}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Địa chỉ đầy đủ:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.fullAddress}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Loại công việc:</dt>
                            <dd className="mt-1 text-black">{typeWorkToString[deliverInfo?.typeWork]}</dd>
                        </div>
                    </dl>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin bổ sung</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Người thêm:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.usernameAdded}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Trạng thái:</dt>
                            <dd className="mt-1 text-black">{statusToString[deliverInfo?.status]}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã khách hàng:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.customerId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tài khoản:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.usernameCustomer}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Email:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.emailCustomer}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã nhà cung cấp:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.transportProviderId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tên nhà cung cấp:</dt>
                            <dd className="mt-1 text-black">{deliverInfo?.transportProviderShortName}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <br/>

            <div>
                <dt className="text-neutral-800 font-bold text-center text-xl">Phường/Xã làm việc:</dt>
                <dd className="mt-1 text-black">
                    <table className="min-w-full bg-white">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                STT
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">
                                Mã phường/xã
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Tên
                            </th>
                            <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                Tên đầy đủ
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {deliverInfo?.wardsWork.map((ward, index) => (
                            <tr key={ward.wardCode}>
                                <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1}</td>
                                <td className="py-2 px-4 border-b border-gray-200 text-center">{ward.wardCode}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{ward.name}</td>
                                <td className="py-2 px-4 border-b border-gray-200">{ward.fullName}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </dd>
            </div>

            <ToastContainer/>
        </div>
    );
};

export default DeliverInformationPage;