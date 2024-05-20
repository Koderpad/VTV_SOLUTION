import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {getBrandByBrandId} from '@/services/manager/BrandManagerService';
import {BrandDTO} from '@/utils/DTOs/manager/dto/BrandDTO';
import {getAllCategories, getCategoryByCategoryId} from "@/services/manager/CategoryManagerService.ts";
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import {toast, ToastContainer} from "react-toastify";

const fetchBrand = async (brandId: string | undefined) => {
    try {
        const response = await getBrandByBrandId(brandId);
        return response.brandDTO;
    } catch (error) {
        throw  error.response.data;
    }
};

const fetchCategoriesByCategoryIds = async (categoryIds: number[]) => {
    const categories: CategoryDTO[] = [];
    try {
        for (let i = 0; i < categoryIds.length; i++) {
            const response = await getCategoryByCategoryId(categoryIds[i]);
            categories.push(response.categoryDTO);
        }
        return categories;
    } catch (error) {
        console.error(error);
    }
};

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        return response.categoryDTOs;
    } catch (error) {
        console.error(error);
    }
};

const BrandDetail: React.FC = () => {
    const {brandId} = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [brand, setBrand] = useState<BrandDTO | null>(null);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    useEffect(() => {
        fetchBrand(brandId).then(brand => {
            setBrand(brand);
            if (brand.allCategories) {
                fetchCategories().then(setCategories);
            } else {
                fetchCategoriesByCategoryIds(brand.categoryIds).then(setCategories);
            }
        })   .catch(error => {
            toast.error(error.message);
            setTimeout(() => {
                navigate('/manager/brands');
            }, 700);
        });
    }, [brandId]);

    if (!brand) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-stone-950">Thông Tin Thương Hiệu Chi Tiết</h1>
            <hr className="my-4"/>
            <h1 className="text-xl font-bold mb-6">Tên thương hiệu: {brand.name}</h1>
            <img src={brand.image} alt={brand.name} className="w-full h-64 object-cover rounded-lg mb-6"/>
            <div className="space-y-4">
                <p className="text-gray-700">Mô tả chi tiết: {brand.description}</p>
                <p className="text-gray-700">Thông tin chi tiết: {brand.information}</p>
                <p className="text-gray-700">Nguồn gốc: {brand.origin}</p>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Danh sách danh mục:</h2>
                {brand.allCategories ? (
                    <p className="text-gray-700 mb-2">Tất cả danh mục</p>
                ) : (
                    <p className="text-gray-700 mb-2">Những danh mục đã chọn:</p>
                )}
                <p className="text-emerald-500 mb-2">Số lượng danh mục: {categories.length}</p>

                <table className="table-auto w-full bg-gray-100 rounded-lg shadow-sm">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">STT</th>
                        <th className="px-4 py-2">Tên Danh Mục</th>
                        <th className="px-4 py-2">Hình</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category, index) => (
                        <tr key={category.categoryId} className="bg-white odd:bg-gray-50">
                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                            <td className="border px-4 py-2">{category.name}</td>
                            <td className="border px-4 py-2 flex justify-center items-center">
                                <img src={category.image} alt={category.name}
                                     className="w-10 h-10 object-cover rounded-md"/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => navigate(`/manager/brand/update/${brandId}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Cập nhật
                </button>
            </div>
            <ToastContainer />
        </div>

    );
};

export default BrandDetail;