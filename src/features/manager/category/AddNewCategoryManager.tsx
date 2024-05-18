import React, {useState, useEffect} from 'react';
import {useAddNewCategoryByManagerMutation} from '@/redux/features/manager/category/categoryManagerApiSlice.ts';
import {CategoryRequest} from '@/utils/DTOs/manager/Category/Request/CategoryRequest.ts';
import {getAllCategories} from '@/services/manager/CategoryService.ts';
import {toast} from 'react-toastify';
import {handleApiCall} from '@/utils/HandleAPI/common/handleApiCall';
import {CategoryDTO, CategoryResponse} from '@/utils/DTOs/manager/Category/Response/CategoryResponse';
import {ServerError} from '@/utils/DTOs/common/ServerError';
import {useNavigate} from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';


const AddNewCategoryManager = () => {
    const [addNewCategoryByManager, {isLoading: isAdding}] = useAddNewCategoryByManagerMutation();
    const [categoryData, setCategoryData] = useState<CategoryRequest>({
        name: '',
        description: '',
        image: '',
        changeImage: false,
        child: false,
        parentId: 0,
    });
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [searchText, setSearchText] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.categoryDTOs);
        } catch (error) {
            console.error('Error getting categories:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCategoryData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCategoryData((prevData) => ({
                ...prevData,
                image: file,
                changeImage: true,
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setCategoryData((prevData) => ({
            ...prevData,
            image: '',
            changeImage: false,
        }));
        setPreviewImage(null);
    };

    const createFormData = (categoryData: CategoryRequest): FormData => {
        const formData = new FormData();
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description);
        formData.append('changeImage', String(categoryData.changeImage));
        if (categoryData.changeImage && categoryData.image instanceof File) {
            formData.append('image', categoryData.image);
        }
        formData.append('child', String(categoryData.child));
        formData.append('parentId', String(categoryData.parentId));
        return formData;
    }

    const handleCategoryApiCall = async (formData: FormData) => {
        await handleApiCall<CategoryResponse, ServerError>({
            callbackFn: async () => {
                return await addNewCategoryByManager(formData);
            },
            successCallback: (data) => {
                setCategoryData({
                    name: '',
                    description: '',
                    image: '',
                    changeImage: false,
                    child: false,
                    parentId: 0,
                });
                setPreviewImage(null);
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
            const formData = createFormData(categoryData);
            await handleCategoryApiCall(formData);
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
            setCategoryData((prevData) => ({
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
        let currentCategoryId = categoryData.parentId;

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
                <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Thêm Danh Mục Hệ Thống</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên danh mục:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={categoryData.name}
                            onChange={handleInputChange}
                            required={true}
                            title="Tên danh mục không được để trống!"
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={categoryData.description}
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
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                        {previewImage && (
                            <div className="relative mt-2">
                                <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-md"/>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
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
                            checked={categoryData.child}
                            onChange={(e) =>
                                setCategoryData((prevData) => ({...prevData, child: e.target.checked}))
                            }
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    {categoryData.child && (
                        <div className="mb-4">
                            <label htmlFor="parentId" className="block mb-1 text-sm font-medium text-gray-700">
                                Chọn danh mục:
                            </label>
                            <div
                                className="border border-black focus:border-green-500 focus:ring-green-500 rounded px-4 py-2 cursor-pointer mt-1 block w-full shadow-sm sm:text-sm"
                                onClick={openCategoryModal}
                            >
                                {categoryData.parentId ? (
                                    categories.find((category) => category.categoryId === categoryData.parentId)?.name
                                ) : (
                                    'Chọn danh mục'
                                )}
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                        {isAdding ? 'Đang thêm dang mục...' : 'Thêm danh mục mới'}
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
                <ToastContainer/>
            </div>
        </div>
    );
};


export default AddNewCategoryManager;