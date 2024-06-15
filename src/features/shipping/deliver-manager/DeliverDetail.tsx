import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetDeliverByDeliverIdQuery } from '@/redux/features/shipping/ManagerDeliverApiSlice';
import { typeWorkToString } from '@/utils/DTOs/extra/convertToString/typeWorkToString.ts';
import { toast, ToastContainer } from 'react-toastify';
import {statusToString} from "@/utils/DTOs/extra/convertToString/statusToString.ts";

const DeliverDetail = () => {
    const { deliverId } = useParams<{ deliverId: string }>();
    const navigate = useNavigate();
    const { data, error, isLoading } = useGetDeliverByDeliverIdQuery(Number(deliverId));

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error('Đã có lỗi xảy ra khi tải dữ liệu');
        setTimeout(() => {
            navigate('/provider/employee'); // Redirect to the main deliver list page
        }, 700);
    }

    const deliver = data?.deliverDTO;

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-900">Thông tin chi tiết nhân viên</h1>
            <hr className="mt-4 border-b-2 border-gray-300" />
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full leading-normal">
                    <tbody>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Số điện thoại</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.phone}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Tỉnh/Thành phố
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.provinceName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Quận/Huyện</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.districtName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Phường/Xã</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.wardName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Địa chỉ đầy đủ
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.fullAddress}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Loại công việc
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{typeWorkToString[deliver?.typeWork]}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Người thêm</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.usernameAdded}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Trạng thái</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{statusToString[deliver?.status]}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Mã khách hàng</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.customerId}</td>
                    </tr>

                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Tài khoản</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.usernameCustomer}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Email</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.emailCustomer}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Mã nhà cung cấp
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.transportProviderId}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Tên nhà cung cấp
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.transportProviderShortName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">
                            Tỉnh/Thành phố làm việc
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.districtWork?.provinceName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Quận/Huyện làm
                            việc
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.districtWork?.name}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Số lượng phường/xã
                            làm việc
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{deliver?.countWardWork}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Phường/Xã đang làm
                            việc
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-left">
                            {deliver?.wardsWork.map((ward, index) => (
                                <div key={index}>
                                        <span className="text-gray-800 font-semibold py-1 px-2 rounded-full text-xs">
                                            {index + 1}. {ward.name}
                                        </span>
                                    {index !== deliver.wardsWork.length - 1 && <br/>}
                                </div>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>

                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
                    onClick={() => navigate(`/provider/employee/update-work/${deliverId}`)}
                >
                    Cập nhật
                </button>


            </div>
            <ToastContainer/>
        </div>
    );
};

export default DeliverDetail;