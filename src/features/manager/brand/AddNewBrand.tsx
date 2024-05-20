import React, {useState, useEffect} from 'react';
import {useAddNewBrandMutation} from '@/redux/features/manager/BrandManagerApiSlice';
import {BrandRequest} from '@/utils/DTOs/manager/request/BrandRequest';
import {getAllCategories} from '@/services/manager/CategoryManagerService';
import {toast, ToastContainer} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {convertBrandRequestToFormData} from "@/utils/DTOs/manager/convert/ConvertBrandRequestToFormData";
import {BrandDTO} from "@/utils/DTOs/manager/dto/BrandDTO";
import {CategoryDTO} from "@/utils/DTOs/manager/dto/CategoryDTO";

const AddNewBrand = () => {
    const [addNewBrand, {isLoading: isAdding}] = useAddNewBrandMutation();
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
        fetchAllCategories();
    }, []);

    const fetchAllCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.categoryDTOs);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setBrandRequest((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setBrandRequest((prevData) => {
        if (checked) {
            // If the checkbox is checked, add the value to categoryIds
            return {
                ...prevData,
                categoryIds: [...prevData.categoryIds, Number(value)],
            };
        } else {
            // If the checkbox is unchecked, remove the value from categoryIds
            return {
                ...prevData,
                categoryIds: prevData.categoryIds.filter((categoryId) => categoryId !== Number(value)),
            };
        }
    });
};

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        setBrandRequest((prevData) => ({
            ...prevData,
            categoryIds: selectedOptions,
        }));
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
            await addNewBrand(formData);
            toast.success("Brand added successfully");
            navigate('/manager/brands');
        } catch (error) {
            toast.error("Error: " + error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8 max-w-lg border border-gray-300 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Thêm Thương Hiệu Mới</h1>
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
                            onChange={handleCheckboxChange}
                            className="mt-1 h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryIds"
                               className="block text-sm font-medium text-gray-700">Categories:</label>
                        <div style={{maxHeight: '200px', overflow: 'auto'}}>
                            {categories.map((category) => (
                                <div key={category.categoryId}>
                                    <input
                                        type="checkbox"
                                        id={`category-${category.categoryId}`}
                                        name="categoryIds"
                                        value={category.categoryId}
                                        checked={brandRequest.categoryIds.includes(category.categoryId)}
                                        onChange={handleCheckboxChange}
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
                    <hr className="my-4"/>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full"
                    >
                        {isAdding ? 'Đang thêm thương hiệu...' : 'Thêm thương hiệu mới'}
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

export default AddNewBrand;