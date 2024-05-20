import React, {useEffect, useState} from 'react';
import {fetchVoucherSystemsResponse} from '@/services/manager/VoucherSystemManagerService';
import {VoucherDTO} from "@/utils/DTOs/manager/dto/VoucherDTO.ts";
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {VoucherType} from "@/utils/DTOs/extra/VoucherType.ts";

const VoucherSystemManagerPage = () => {
    const [voucherSystems, setVoucherSystems] = useState<VoucherDTO[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchVoucherSystemsResponse().then((response) => {
            setVoucherSystems(response.voucherDTOs);
        }).catch((e) => {
            toast.error(e.message);
        });
    }, []);

    return (
        <div className="p-4">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-center">Danh Sách Mã Giảm Giá</h1>

                <div className="flex flex-row justify-between items-center">
                    <div className="text-sm font-medium text-gray-500">
                        Tổng số mã giảm giá: {voucherSystems.length}
                    </div>

                    <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-400 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                        onClick={() => navigate("/manager/voucher/add")}>
                        Thêm mã giảm giá mới
                    </button>
                </div>
                <hr className="my-4"/>
                <table className="table-auto w-full">
                    <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-center">STT</th>
                        <th className="py-3 px-6 text-center">Tên</th>
                        <th className="py-3 px-6 text-center">Mã</th>
                        <th className="py-3 px-6 text-center">Giảm giá</th>
                        <th className="py-3 px-6 text-center">Số lượng</th>
                        <th className="py-3 px-6 text-center">Đã sử dụng</th>
                        <th className="py-3 px-6 text-center">Bắt đầu</th>
                        <th className="py-3 px-6 text-center">Kết thúc</th>
                        <th className="py-3 px-6 text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                    {voucherSystems.map((voucherSystem, index) => (
                        <tr className="border-b border-gray-200 hover:bg-gray-100" key={index}>
                            <td className="py-3 px-6 text-center">{index + 1}</td>
                            <td className="py-3 px-6 text-center">{voucherSystem.name}</td>
                            <td className="py-3 px-6 text-center">{voucherSystem.code}</td>
                            <td className="py-3 px-6 text-center">
                                {voucherSystem.type === VoucherType.PERCENTAGE_SYSTEM ?
                                    `${voucherSystem.discount}%` : `${voucherSystem.discount.toLocaleString()}đ`}
                            </td>
                            <td className="py-3 px-6 text-center">{voucherSystem.quantity.toLocaleString()}</td>
                            <td className="py-3 px-6 text-center">{voucherSystem.quantityUsed.toLocaleString()}</td>
                            <td className="py-3 px-6 text-center">{new Date(voucherSystem.startDate).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-center">{new Date(voucherSystem.endDate).toLocaleDateString()}</td>
                            <td className="py-3 px-6 text-center">
                                <button onClick={() => navigate(`/manager/voucher/${voucherSystem.voucherId}`)}
                                        className="text-blue-500 hover:text-blue-700">
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                </button>
                                <button onClick={() => navigate(`/manager/voucher/update/${voucherSystem.voucherId}`)}
                                        className="text-blue-500 hover:text-blue-700 ml-2">
                                    <FontAwesomeIcon icon={faEdit}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer/>
        </div>
    );
};


export default VoucherSystemManagerPage;