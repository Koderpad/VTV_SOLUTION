import React, {useState, useEffect} from 'react';
import {useUpdateBrandMutation} from '@/redux/features/manager/BrandManagerApiSlice';
import {BrandRequest} from '@/utils/DTOs/manager/request/BrandRequest';
import {getAllCategories} from '@/services/manager/CategoryManagerService';
import {toast, ToastContainer} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {convertBrandRequestToFormData} from "@/utils/DTOs/manager/convert/ConvertBrandRequestToFormData";
import {BrandDTO} from "@/utils/DTOs/manager/dto/BrandDTO";
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO";
import {convertBrandDTOToBrandRequest} from "@/utils/DTOs/manager/convert/ConvertBrandDTOToBrandRequest.ts";
import {getBrandByBrandId} from "@/services/manager/BrandManagerService.ts";

const fetchBrand = async (brandId: string | undefined) => {
    try {
        const response = await getBrandByBrandId(brandId);
        return response.brandDTO;
    } catch (error) {
        throw error.response.data;
    }
};

const fetchCategories = async () => {
    try {
        const response = await getAllCategories();
        return response.categoryDTOs;
    } catch (error) {
        throw error.response.data;
    }
};

export const UpdateBrand = () => {
    const brandId = useParams<{ brandId: string }>().brandId;
    const [brandDTO, setBrandDTO] = useState<BrandDTO>();
    const [updateBrand, {isLoading: isAdding}] = useUpdateBrandMutation();
    const [brandRequest, setBrandRequest] = useState<BrandRequest>({
        name: '',
        description: '',
        information: '',
        origin: '',
        allCategories: false,
        categoryIds: [],
        image: '',
        changeImage: false,
    });
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetchBrand(brandId)
            .then(brand => {
                setBrandRequest(convertBrandDTOToBrandRequest(brand));
                setBrandDTO(brand);
            })
            .catch(error => {
                toast.error(error.message);
                setTimeout(() => {
                    navigate('/manager/brands');
                }, 700);
            });

        fetchCategories()
            .then(setCategories)
            .catch(error => {
                toast.error(error.message);
                setTimeout(() => {
                    navigate('/manager/brands');
                }, 1000);
            });
    }, [brandId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setBrandRequest((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAllCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked} = e.target;
        setBrandRequest((prevData) => ({
            ...prevData,
            allCategories: checked,
            categoryIds: checked ? [] : prevData.categoryIds,
        }));
    };

    const handleCategoryIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value, checked} = e.target;
        setBrandRequest((prevData) => {
            const categoryIds = prevData.categoryIds || []; // Ensure categoryIds is always defined
            if (checked) {
                return {
                    ...prevData,
                    categoryIds: [...categoryIds, Number(value)],
                };
            } else {
                return {
                    ...prevData,
                    categoryIds: categoryIds.filter((categoryId) => categoryId !== Number(value)),
                };
            }
        });
    };





    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBrandRequest((prevData) => ({
                ...prevData,
                image: file,
                changeImage: true,
            }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            handleRemoveImage();
        }
    };

    const handleRemoveImage = () => {
        setBrandRequest((prevData) => ({
            ...prevData,
            image: '',
            changeImage: false,
        }));
        setPreviewImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = convertBrandRequestToFormData(brandRequest);
            console.log(formData.forEach((value, key) => console.log(key, value)));
            await updateBrand({brandId, data: formData });
            navigate('/manager/brands');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-lg border border-gray-300 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Cập nhật Thương Hiệu</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên thương
                            hiệu:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={brandRequest.name}
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
                            value={brandRequest.description}
                            onChange={handleInputChange}
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="information"
                               className="block text-sm font-medium text-gray-700">Information:</label>
                        <textarea
                            id="information"
                            name="information"
                            value={brandRequest.information}
                            onChange={handleInputChange}
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin:</label>
                        <input
                            type="text"
                            id="origin"
                            name="origin"
                            value={brandRequest.origin}
                            onChange={handleInputChange}
                            required
                            className="mt-1 border border-black focus:border-green-500 focus:ring-green-500 block w-full shadow-sm sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="allCategories" className="block text-sm font-medium text-gray-700">All
                            Categories:</label>
                        <input
                            type="checkbox"
                            id="allCategories"
                            name="allCategories"
                            checked={brandRequest.allCategories}
                            onChange={handleAllCategoriesChange}
                            className="mt-1 h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryIds"
                               className="block text-sm font-medium text-gray-700">Categories:</label>
                        <div style={{maxHeight: '200px', overflow: 'auto'}}>
                            {categories && categories.map((category) => (
                                <div key={category.categoryId}>
                                    <input
                                        type="checkbox"
                                        id={`category-${category.categoryId}`}
                                        name="categoryIds"
                                        value={category.categoryId}
                                        checked={brandRequest.categoryIds?.includes(category.categoryId)}
                                        onChange={handleCategoryIdsChange}
                                        disabled={brandRequest.allCategories}
                                        className="mt-1 h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor={`category-${category.categoryId}`}
                                           className="ml-2 text-sm text-gray-700">{category.name}</label>
                                </div>
                            ))}
                        </div>
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
                        {(previewImage || (brandDTO && brandDTO.image)) && (
                            <div className="relative mt-2">
                                <img src={previewImage || brandDTO.image} alt="Preview" className="w-32 h-32 object-cover rounded-md"/>
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
                    <hr className="my-4"/>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                        {isAdding ? 'Đang cập nhật thương hiệu...' : 'Cập nhật'}
                    </button>
                </form>
                <hr className="my-4"/>
                <div className="text-center mb-4">
                    <button
                        onClick={() => navigate('/manager/brands')}
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
