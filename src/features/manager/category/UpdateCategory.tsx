import {useNavigate, useParams} from 'react-router-dom';
import {getAllCategories, getCategoryByCategoryId} from "@/services/manager/CategoryManagerService.ts";
import React, {useEffect, useState} from "react";
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO.ts";
import {toast, ToastContainer} from 'react-toastify';
import {CategoryRequest} from "@/utils/DTOs/manager/request/CategoryRequest.ts";
import {convertCategoryRequestToFormData} from "@/utils/DTOs/manager/convert/ConvertCategoryRequestToFormData.ts";
import {handleApiCall} from "@/utils/HandleAPI/common/handleApiCall.tsx";
import {CategoryResponse} from "@/utils/DTOs/manager/response/CategoryResponse.ts";
import {ServerError} from "@/utils/DTOs/common/ServerError.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useUpdateCategoryMutation} from "@/redux/features/manager/CategoryManagerApiSlice.ts";
import {convertCategoryDTOToCategoryRequest} from "@/utils/DTOs/manager/convert/ConvertCategoryDTOToCategoryRequest.ts";
import error = toast.error;

const fetchCategoryByCategoryId = async (categoryId: string | undefined) => {
    try {
        const data = await getCategoryByCategoryId(categoryId);
        return data.categoryDTO;
    } catch (error) {
        console.log(error);
        throw error.response.data.message;
    }
};

const fetchAllCategories = async () => {
    try {
        const response = await getAllCategories();
        return response.categoryDTOs;
    } catch (error) {
        throw error.response.data.message;
    }
};


const UpdateCategory = () => {
    const [updateCategoryByManager, {isLoading}] = useUpdateCategoryMutation();
    const {categoryId} = useParams();
    const [categoryDTO, setCategoryDTO] = useState<CategoryDTO>();
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [searchText, setSearchText] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isChangeImage, setIsChangeImage] = useState<boolean>(false);
    const [categoryRequest, setCategoryRequest] = useState<CategoryRequest>({
        name: '',
        description: '',
        image: '',
        changeImage: false,
        child: false,
        parentId: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategoryByCategoryId(categoryId)
            .then((category) => {
            setCategoryDTO(category);
            setCategoryRequest(convertCategoryDTOToCategoryRequest(category));
        }).catch(error => {
            toast.error(error);
            setTimeout(() => {
                navigate('/manager/categories');
            }, 500);
        });
        fetchAllCategories().then(setCategories);
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCategoryRequest((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCategoryRequest((prevData) => ({
                ...prevData,
                image: file,
                changeImage: true,
            }));
            setPreviewImage(URL.createObjectURL(file));
            setIsChangeImage(true);
        }
    };

    const handleRemoveImage = () => {
        setCategoryRequest((prevData) => ({
            ...prevData,
            image: '',
            changeImage: false,
        }));
        setPreviewImage(null);
        setIsChangeImage(false);
    };

   const handleUpdateCategoryApiCall = async (categoryId: string, formData: FormData) => {
    await handleApiCall<CategoryResponse, ServerError>({
        callbackFn: async () => {
            return await updateCategoryByManager({ categoryId, data: formData });
        },
        successCallback: (data) => {
            toast.success(data.message, {
                autoClose: 300,
                onClose: () => navigate('/manager/categories'),
            });
        },
        errorFromServerCallback: (error) => {
            toast.error(error.message);
        },
        errorSerializedCallback: (error) => {
            toast.error(error.message);
        },
        errorCallback: (error) => {
            toast.error("Thông báo: " + error);
        },
    })
}

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = convertCategoryRequestToFormData(categoryRequest);
            await handleUpdateCategoryApiCall(categoryId, formData);
        } catch (error) {
            toast.error("Thông báo: " + error);
        }
    };


    const openCategoryModal = () => {
        setIsCategoryModalVisible(true);
        setSelectedCategories(getSelectedCategoryPath());
    };

    const closeCategoryModal = () => {
        if (selectedCategories.length > 0) {
            const selectedCategoryId = selectedCategories[selectedCategories.length - 1];
            setCategoryRequest((prevData) => ({
                ...prevData,
                parentId: selectedCategoryId,
            }));
        }

        setIsCategoryModalVisible(false);
        setSelectedCategories([]);
        setSearchText('');
    };

    const handleCategoryClick = (categoryDTO: CategoryDTO) => {
        const genLevel = getGenLevel(categoryDTO);
        setSelectedCategories((prevSelected) => {
            const newSelected = prevSelected.slice(0, genLevel - 1);
            newSelected[genLevel - 1] = categoryDTO.categoryId;
            return newSelected;
        });
    };

    const getGenLevel = (category: CategoryDTO): number => {
        if (category.parentId === null) {
            return 1;
        }

        const parentCategory = categories.find((cat) => cat.categoryId === category.parentId);
        if (parentCategory) {
            return getGenLevel(parentCategory) + 1;
        }

        return 1;
    };

    const renderCategoryTree = (genLevel: number) => {
        const parentId = genLevel > 1 ? selectedCategories[genLevel - 2] : null;
        const filteredCategories = categories.filter(
            (category) =>
                category.parentId === parentId &&
                category.name.toLowerCase().includes(searchText.toLowerCase())
        );

        return (
            <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
                {filteredCategories.map((category) => (
                    <div
                        key={category.categoryId}
                        onClick={() => handleCategoryClick(category)}
                        className={`px-4 py-2 cursor-pointer rounded flex items-center ${selectedCategories[genLevel - 1] === category.categoryId
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                        {hasChildCategory(category.categoryId) && (
                            <span className="ml-auto">&gt;</span>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const hasChildCategory = (categoryId: number): boolean => {
        return categories.some((cat) => cat.parentId === categoryId);
    };

    const getCategoryPath = (): string => {
        let path = '';
        selectedCategories.forEach((categoryId) => {
            const category = categories.find((cat) => cat.categoryId === categoryId);
            if (category) {
                path += category.name + ' -> ';
            }
        });
        return path.slice(0, -4);
    };

    const getSelectedCategoryPath = (): number[] => {
        const path: number[] = [];
        let currentCategoryId = categoryRequest.parentId;

        while (currentCategoryId !== 0) {
            const category = categories.find((cat) => cat.categoryId === currentCategoryId);
            if (category) {
                path.unshift(category.categoryId);
                currentCategoryId = category.parentId || 0;
            } else {
                break;
            }
        }

        return path;
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-lg border border-gray-300 bg-white rounded-lg shadow-md">

                <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Cập Nhật Danh Mục Hệ Thống</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên danh mục:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={categoryRequest.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={categoryRequest.description}
                            onChange={handleInputChange}
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Ảnh:</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}

                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                        {(previewImage || (categoryDTO && categoryDTO.image)) && (
                            <div className="relative mt-2">
                                <img src={previewImage || categoryDTO.image} alt="Preview"
                                     className="w-32 h-32 object-cover rounded-md"/>
                                {isChangeImage && (
                                    <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>)}

                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="child" className="block text-sm font-medium text-gray-700">Chọn danh mục
                            cha:</label>
                        <input
                            type="checkbox"
                            id="child"
                            name="child"
                            checked={categoryRequest.child}
                            onChange={(e) => {
                                setCategoryRequest((prevData) => ({...prevData, child: e.target.checked}))
                            }}
                            className="mt-1 h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                    </div>

                    {/*<div>*/}
                    {/*    <label htmlFor="child" className="block text-sm font-medium text-gray-700">Chọn danh mục*/}
                    {/*        cha:</label>*/}
                    {/*    <input*/}
                    {/*        type="checkbox"*/}
                    {/*        id="child"*/}
                    {/*        name="child"*/}
                    {/*        checked={categoryRequest.child}*/}
                    {/*        onChange={(e) => {*/}
                    {/*            if (e.target.checked && categoryRequest.parentId === 0) {*/}
                    {/*                alert('Vui lòng chọn danh mục cha!');*/}
                    {/*                return;*/}
                    {/*            }*/}
                    {/*            setCategoryRequest((prevData) => ({...prevData, child: e.target.checked}))*/}
                    {/*        }}*/}
                    {/*        className="mt-1 h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {categoryRequest.child && (
                        <div className="mb-4">

                            <div
                                className="border border-black focus:border-green-500 focus:ring-green-500 rounded px-4 py-2 cursor-pointer mt-1 block w-full shadow-sm sm:text-sm"
                                onClick={openCategoryModal}
                            >
                                {categoryRequest.parentId ? (
                                    categories.find((category) => category.categoryId === categoryRequest.parentId)?.name
                                ) : (
                                    'Chọn danh mục'
                                )}
                            </div>
                        </div>
                    )}
                    <hr className="my-4"/>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                        {isLoading ? 'Đang cập nhật dang mục...' : 'Cập nhật'}
                    </button>
                </form>

                {isCategoryModalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
                            <div className="px-6 py-4">
                                <h2 className="text-xl font-bold mb-4">Chọn Danh Mục Cha</h2>
                                <input
                                    type="text"
                                    placeholder="Vui lòng nhập tối thiểu 1 ký tự"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="border border-black focus:border-green-500 focus:ring-green-500 rounded px-4 py-2 mb-4 w-full shadow-sm sm:text-sm"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>{renderCategoryTree(1)}</div>
                                    <div>{renderCategoryTree(2)}</div>
                                    <div>{renderCategoryTree(3)}</div>
                                </div>
                                <div className="mt-4">
                                    <p>Đã chọn: {getCategoryPath()}</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-100 flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsCategoryModalVisible(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={closeCategoryModal}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <hr className="my-4"/>
                <div className="text-center mb-4">
                    <button
                        onClick={() => navigate('/manager/categories')}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Quay lại
                    </button>
                </div>
                <ToastContainer/>
            </div>
        </div>
    );
};

export default UpdateCategory;