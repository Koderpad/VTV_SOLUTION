import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {getAllBrands} from "@/services/manager/BrandManagerService.ts";
import {BrandDTO} from "@/utils/DTOs/manager/dto/BrandDTO.ts";
import { MdVisibility } from 'react-icons/md';


const fetchBrands = async () => {
    const data = await getAllBrands();
    return data.brandDTOs;
};

export const BrandManagerPage = () => {
    const [brands, setBrands] = useState<BrandDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBrands().then(setBrands);
    }, []);


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Danh Sách Các Thương Hiệu</h1>

            <div className="flex flex-row justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Tổng số thương hiệu: {brands.length}</div>

                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-400 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                    onClick={() => navigate("/manager/brand/add")}>
                    Thêm thương hiệu mới
                </button>
            </div>
            <hr className="my-4"/>

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên thương hiệu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hình ảnh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả chi tiết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Xem chi tiết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chỉnh sửa
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {brands.map((brand, index) => (
                                    <tr key={brand.brandId}>
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{brand.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={brand.image} alt={brand.name} className="h-10 w-10 rounded-full"/>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{brand.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => navigate(`/manager/brand/${brand.brandId}`)}
                                                    className="text-blue-600 hover:text-blue-800">
                                                <MdVisibility/>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <button onClick={() => navigate(`/manager/brand/update/${brand.brandId}`)}>
                                                <FontAwesomeIcon icon={faEdit}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};