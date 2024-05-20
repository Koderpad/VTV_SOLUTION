import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    getAllCategories,
    getCategoryByCategoryId,
    getCategoryChildrenByCategoryId
} from '@/services/manager/CategoryManagerService';
import {CategoryDTO} from '@/utils/DTOs/manager/dto/CategoryDTO';
import {toast, ToastContainer} from 'react-toastify';
import {statusToString} from "@/utils/DTOs/extra/statusToString.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faInfoCircle} from "@fortawesome/free-solid-svg-icons";

const fetchCategory = async (categoryId: string | undefined) => {
    try {
        const response = await getCategoryByCategoryId(categoryId);
        return response.categoryDTO;
    } catch (error) {
        throw error.response.data;
    }
};


const fetchCategoryChildrenByCategoryId = async (categoryId: string | undefined) => {
    try {
        const response = await getCategoryChildrenByCategoryId(categoryId);
        return response.categoryDTOs;
    } catch (error) {
        throw error.response.data;
    }
}



const CategoryDetail: React.FC = () => {
    const {categoryId} = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [category, setCategory] = useState<CategoryDTO | null>(null);
    const [parentCategory, setParentCategory] = useState<CategoryDTO | null>(null);
    const [childrenCategories, setChildrenCategories] = useState<CategoryDTO[]>([]);

    useEffect(() => {
        fetchCategory(categoryId)
            .then(category => {
                setCategory(category);
                if (category.parentId) {
                    fetchCategory(category.parentId.toString())
                        .then(setParentCategory)
                        .catch(error => toast.error(error.message));
                }
            })
            .catch(error => {
                toast.error(error.message);
                setTimeout(() => {
                    navigate('/manager/categories');
                }, 700);
            });
        fetchCategoryChildrenByCategoryId(categoryId)
            .then(categories => {
                setChildrenCategories(categories);
            })
            .catch(error => {
                toast.error(error.message);
                setTimeout(() => {
                    navigate('/manager/categories');
                }, 700);
            });
    }, [categoryId]);

    if (!category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-stone-950">Thông Tin Chi Tiết Danh Mục</h1>
            <hr className="my-4"/>
            <h1 className="text-xl font-bold mb-6">Tên danh mục: {category.name}</h1>
            <img src={category.image} alt={category.name} className="w-full h-64 object-cover rounded-lg mb-6"/>
            <div className="space-y-4">
                <p className="text-gray-700">Mô tả: {category.description}</p>
                <p className="text-gray-700">
                    Trạng thái: {category && category.status ? statusToString[category.status] : 'N/A'}</p>
            </div>

            {parentCategory && (
                <div className="mt-6">
                    <div className="flex justify-between">
                        <h1 className="text-lg font-bold">Danh mục cha:</h1>
                        <p className="text-gray-700">{parentCategory ? parentCategory.name : 'N/A'}</p>
                        <img src={parentCategory.image} alt={parentCategory.name}
                             className="w-10 h-10 object-cover rounded-full"/>
                    </div>
                </div>
            )}
            {childrenCategories.length > 0 && (
                <div className="mt-6">
                    <h1 className="text-lg font-bold">Danh mục con: {childrenCategories.length}</h1>
                    <table className="table-auto w-full">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-center">STT</th>
                            <th className="px-4 py-2 text-center">Tên</th>
                            <th className="px-4 py-2 text-center">Hình</th>
                            <th className="px-4 py-2 text-center">Trạng thái</th>
                            <th className="px-4 py-2 text-center"> Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {childrenCategories.map((category, index) => (
                            <tr key={category.categoryId}>
                                <td className=" px-4 py-2 text-center">{index + 1}</td>
                                <td className=" px-4 py-2 text-center">{category.name}</td>
                                <td className=" px-4 py-2 flex justify-center">
                                    <img src={category.image} alt={category.name}
                                         className="w-10 h-10 object-cover rounded-full"/>
                                </td>
                                <td className=" px-4 py-2 text-center">{statusToString[category.status]}</td>
                                <td className="px-4 py-2 flex justify-center">
                                    <div className="justify-between">
                                        <button onClick={() => navigate(`/manager/category/${category.categoryId}`)}
                                                className="text-blue-500 hover:text-blue-700">
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/manager/category/update/${category.categoryId}`)}
                                            className="text-blue-500 hover:text-blue-700 ml-2">
                                            <FontAwesomeIcon icon={faEdit}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}


            <div className="mt-6 flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => navigate(`/manager/category/update/${categoryId}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Cập nhật
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default CategoryDetail;