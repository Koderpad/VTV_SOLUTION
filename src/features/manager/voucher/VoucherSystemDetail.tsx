import {useNavigate, useParams} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {VoucherDTO} from "@/utils/DTOs/manager/dto/VoucherDTO.ts";
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {fetchVoucherByVoucherId} from "@/services/manager/VoucherSystemManagerService.ts";
import {VoucherType} from "@/utils/DTOs/extra/VoucherType.ts";
import {voucherTypeToString} from "@/utils/DTOs/extra/convertToString/voucherTypeToString.ts";
import {statusToString} from "@/utils/DTOs/extra/convertToString/statusToString.ts";


const VoucherSystemDetail = () => {
    const {voucherId} = useParams();
    const [voucher, setVoucher] = useState<VoucherDTO>();
    const navigate = useNavigate();
    useEffect(() => {
        fetchVoucherByVoucherId(voucherId)
            .then(response => {
                setVoucher(response.voucherDTO);
            })
            .catch(error => {
                toast(error.message)
                setTimeout(() => {
                    navigate('/manager/vouchers')
                }, 500)
            });
    }, [voucherId]);

    if (!voucher) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Thông Tin Mã Giảm Giá</h1>
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-emerald-500">Tên: {voucher.name}</h2>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Mã:</strong>
                    <span className="ml-4">{voucher.code}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Mô tả:</strong>
                    <span className="ml-4">{voucher.description}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Giảm giá:</strong>
                    <span className="ml-4">
            {voucher.type === VoucherType.PERCENTAGE_SYSTEM
                ? `${voucher.discount}%`
                : `${voucher.discount.toLocaleString()}đ`}
          </span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Số lượng:</strong>
                    <span className="ml-4">{voucher.quantity.toLocaleString()}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Đã sử dụng:</strong>
                    <span className="ml-4">{voucher.quantityUsed.toLocaleString()}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Ngày bắt đầu:</strong>
                    <span className="ml-4">{new Date(voucher.startDate).toLocaleDateString()}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Ngày kết thúc:</strong>
                    <span className="ml-4">{new Date(voucher.endDate).toLocaleDateString()}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Trạng thái:</strong>
                    <span className="ml-4">{statusToString[voucher.status]}</span>
                </div>
                <div className="mb-2 flex justify-between text-gray-700">
                    <strong className="mr-4">Loại:</strong>
                    <span className="ml-4">{voucherTypeToString[voucher.type]}</span>
                </div>
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    onClick={() => navigate(`/manager/vouchers`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => navigate(`/manager/voucher/update/${voucherId}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                    Cập nhật
                </button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VoucherSystemDetail;