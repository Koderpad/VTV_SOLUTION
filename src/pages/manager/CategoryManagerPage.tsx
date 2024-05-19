import {getAllCategories} from "@/services/manager/CategoryManagerService.ts";

import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {statusToString} from "@/utils/DTOs/extra/statusToString.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";

const fetchCategories = async () => {
    const data = await getAllCategories();
    return data.categoryDTOs;
};


const CategoryRow = ({category, index, categories}: {
    category: CategoryDTO,
    index: number,
    categories: CategoryDTO[]
}) => {
    const navigate = useNavigate();
    const parentCategory = categories.find(categoryDTO => categoryDTO.categoryId === category.parentId);
    const parentName = parentCategory ? parentCategory.name : 'N/A';


    const handleUpdateClick = () => {
        navigate(`/manager/category/update/${category.categoryId}`);
    };

    return (
        <tr key={category.categoryId} className="bg-white even:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img src={category.image} alt={category.name} className="w-32 h-32 object-cover"/>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{statusToString[category.status as Status]}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parentName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center justify-center">
                <button onClick={handleUpdateClick}
                        className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit}/>
                </button>
            </td>
        </tr>
    );
};


export const CategoryManagerPage = () => {
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);


    const renderCategories = (categories: CategoryDTO[], parentId = null, index = 0) => {
        return categories
            .filter(category => category.parentId === parentId)
            .flatMap((category, i) => [
                <CategoryRow category={category} index={index + i} categories={categories}/>,
                ...renderCategories(categories, category.categoryId, index + i + 1)
            ]);
    };

    return (
        <div className="p-4">


            <h1 className="text-2xl font-bold mb-4 text-center">Danh Sách Các Danh Mục Hệ Thống</h1>


            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <div className="text-sm font-medium text-gray-500">Tổng số danh mục: {categories.length}</div>
                    <div className="ml-4 text-sm font-medium text-gray-500">
                        Danh mục cha: {categories.filter(category => category.parentId === null).length}
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-500">
                        Danh mục con: {categories.filter(category => category.parentId !== null).length}
                    </div>

                </div>

                <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-400 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
                    onClick={() => navigate("/manager/category/add")}>
                    Thêm danh mục mới
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên
                                        danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình
                                        ảnh
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô
                                        tả chi tiết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng
                                        thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên
                                        danh mục cha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chỉnh
                                        sửa
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {renderCategories(categories)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};