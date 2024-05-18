import React, { useState, useEffect } from 'react';
import { useAddNewCategoryByManagerMutation } from '@/redux/features/manager/category/categoryManagerApiSlice';
import { CategoryRequest } from '@/utils/DTOs/manager/Category/Request/CategoryRequest';
import { getAllCategories } from '@/services/manager/CategoryService';
import { toast } from 'react-toastify';

const AddNewCategoryManagerPage = () => {
  const [addNewCategoryByManager, { isLoading: isAdding }] = useAddNewCategoryByManagerMutation();
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
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategoryList(response.categoryDTOs);
    } catch (error) {
      console.error('Error getting categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      formData.append('changeImage', String(categoryData.changeImage));
      if (categoryData.changeImage && categoryData.image instanceof File) {
        formData.append('image', categoryData.image);
      }
      formData.append('child', String(categoryData.child));
      formData.append('parentId', String(categoryData.parentId));

      const response = await addNewCategoryByManager(formData).unwrap();
      console.log('Category added successfully:', response);
      toast.success('Category added successfully');
      // Reset form data
      setCategoryData({
        name: '',
        description: '',
        image: '',
        changeImage: false,
        child: false,
        parentId: 0,
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
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

  const handleCategoryClick = (category: any) => {
    const genLevel = getGenLevel(category);
    setSelectedCategories((prevSelected) => {
      const newSelected = prevSelected.slice(0, genLevel - 1);
      newSelected[genLevel - 1] = category.categoryId;
      return newSelected;
    });
  };

  const getGenLevel = (category: any): number => {
    if (category.parentId === null) {
      return 1;
    }

    const parentCategory = categoryList.find((cat) => cat.categoryId === category.parentId);
    if (parentCategory) {
      return getGenLevel(parentCategory) + 1;
    }

    return 1;
  };

  const renderCategoryTree = (genLevel: number) => {
    const parentId = genLevel > 1 ? selectedCategories[genLevel - 2] : null;
    const filteredCategories = categoryList.filter(
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
            className={`px-4 py-2 cursor-pointer rounded flex items-center ${
              selectedCategories[genLevel - 1] === category.categoryId
                ? 'bg-blue-500 text-white'
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
    return categoryList.some((cat) => cat.parentId === categoryId);
  };

  const getCategoryPath = (): string => {
    let path = '';
    selectedCategories.forEach((categoryId) => {
      const category = categoryList.find((cat) => cat.categoryId === categoryId);
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
      const category = categoryList.find((cat) => cat.categoryId === currentCategoryId);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Category Manager</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" onChange={handleImageChange} />
          {previewImage && (
            <div>
              <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="child">Child Category:</label>
          <input
            type="checkbox"
            id="child"
            name="child"
            checked={categoryData.child}
            onChange={(e) =>
              setCategoryData((prevData) => ({ ...prevData, child: e.target.checked }))
            }
          />
        </div>
        {categoryData.child && (
          <div className="mb-4">
            <label htmlFor="parentId" className="block mb-1">
              Chọn danh mục:
            </label>
            <div
              className="border border-gray-300 rounded px-4 py-2 cursor-pointer"
              onClick={openCategoryModal}
            >
              {categoryData.parentId ? (
                categoryList.find((category) => category.categoryId === categoryData.parentId)
                  ?.name
              ) : (
                'Chọn danh mục'
              )}
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isAdding}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      {isCategoryModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
              <input
                type="text"
                placeholder="Vui lòng nhập tối thiểu 1 ký tự"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={closeCategoryModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewCategoryManagerPage;
// import React, { useState } from 'react';
// import { useAddNewCategoryByManagerMutation } from '@/redux/features/manager/category/categoryManagerApiSlice';
// import { CategoryRequest } from '@/utils/DTOs/manager/Category/Request/CategoryRequest';
// import { getAllCategories } from '@/services/manager/CategoryService';
//
// const CategoryManagerPage = () => {
//   const [addNewCategoryByManager, { isLoading: isAdding }] = useAddNewCategoryByManagerMutation();
//   const [categoryData, setCategoryData] = useState<CategoryRequest>({
//     name: '',
//     description: '',
//     image: '',
//     changeImage: false,
//     child: false,
//     parentId: 0,
//   });
//   const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const [categoryList, setCategoryList] = useState<any[]>([]);
//   const [searchText, setSearchText] = useState('');
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCategoryData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCategoryData((prevData) => ({
//         ...prevData,
//         image: file,
//         changeImage: true,
//       }));
//     }
//   };
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       formData.append('name', categoryData.name);
//       formData.append('description', categoryData.description);
//       formData.append('changeImage', String(categoryData.changeImage));
//       if (categoryData.changeImage && categoryData.image instanceof File) {
//         formData.append('image', categoryData.image);
//       }
//       formData.append('child', String(categoryData.child));
//       formData.append('parentId', String(categoryData.parentId));
//
//       const response = await addNewCategoryByManager(formData).unwrap();
//       console.log('Category added successfully:', response);
//       // Reset form data
//       setCategoryData({
//         name: '',
//         description: '',
//         image: '',
//         changeImage: false,
//         child: false,
//         parentId: 0,
//       });
//     } catch (error) {
//       console.error('Error adding category:', error);
//     }
//   };
//
//   const openCategoryModal = () => {
//     setIsCategoryModalVisible(true);
//
//     // Mock category categoryList
//
//     const mockCategoryList = async () => {
//       try {
//         const response = await getAllCategories();
//         setCategoryList(response.categoryDTOs);
//       }
//       catch (error) {
//         console.error('Error getting categories:', error);
//       }
//     }
//
//     mockCategoryList();
//
//   };
//
//   const closeCategoryModal = () => {
//     if (selectedCategories.length > 0) {
//       const selectedCategoryId = selectedCategories[selectedCategories.length - 1];
//       setCategoryData((prevData) => ({
//         ...prevData,
//         parentId: selectedCategoryId,
//       }));
//     }
//
//     setIsCategoryModalVisible(false);
//     setSelectedCategories([]);
//     setSearchText('');
//   };
//
//   const handleCategoryClick = (category: any) => {
//     const genLevel = getGenLevel(category);
//     setSelectedCategories((prevSelected) => {
//       const newSelected = prevSelected.slice(0, genLevel - 1);
//       newSelected[genLevel - 1] = category.categoryId;
//       return newSelected;
//     });
//   };
//
//   const getGenLevel = (category: any): number => {
//     if (category.parentId === null) {
//       return 1;
//     }
//
//     const parentCategory = categoryList.find((cat) => cat.categoryId === category.parentId);
//     if (parentCategory) {
//       return getGenLevel(parentCategory) + 1;
//     }
//
//     return 1;
//   };
//
//   const renderCategoryTree = (genLevel: number) => {
//     const parentId = genLevel > 1 ? selectedCategories[genLevel - 2] : null;
//     const filteredCategories = categoryList.filter(
//       (category) =>
//         category.parentId === parentId &&
//         category.name.toLowerCase().includes(searchText.toLowerCase())
//     );
//
//     return (
//       <div className="flex flex-col space-y-2">
//         {filteredCategories.map((category) => (
//           <div
//             key={category.categoryId}
//             onClick={() => handleCategoryClick(category)}
//             className={`px-4 py-2 cursor-pointer rounded ${selectedCategories[genLevel - 1] === category.categoryId
//               ? 'bg-blue-500 text-white'
//               : 'bg-gray-100 hover:bg-gray-200'
//               }`}
//           >
//             {category.name}
//           </div>
//         ))}
//       </div>
//     );
//   };
//
//   const getCategoryPath = (): string => {
//     let path = '';
//     selectedCategories.forEach((categoryId) => {
//       const category = categoryList.find((cat) => cat.categoryId === categoryId);
//       if (category) {
//         path += category.name + ' -> ';
//       }
//     });
//     return path.slice(0, -4);
//   };
//
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Category Manager</h1>
//       <form onSubmit={handleSubmit} className="mb-8">
//         {/* ... */}
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input type="text" id="name" name="name" value={categoryData.name} onChange={handleInputChange} required />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea id="description" name="description" value={categoryData.description} onChange={handleInputChange} />
//         </div>
//         <div>
//           <label htmlFor="image">Image:</label>
//           <input type="file" id="image" name="image" onChange={handleImageChange} />
//         </div>
//         <div>
//           <label htmlFor="child">Child Category:</label>
//           <input type="checkbox" id="child" name="child" checked={categoryData.child} onChange={(e) => setCategoryData((prevData) => ({ ...prevData, child: e.target.checked }))} />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="parentId" className="block mb-1">
//             Chọn danh mục:
//           </label>
//           <div
//             className="border border-gray-300 rounded px-4 py-2 cursor-pointer"
//             onClick={openCategoryModal}
//           >
//             {categoryData.parentId ? (
//               categoryList.find((category) => category.categoryId === categoryData.parentId)?.name
//             ) : (
//               'Chọn danh mục'
//             )}
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={isAdding}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isAdding ? 'Adding...' : 'Add Category'}
//         </button>
//       </form>
//
//       {isCategoryModalVisible && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-screen overflow-y-auto">
//             <div className="px-6 py-4">
//               <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
//               <input
//                 type="text"
//                 placeholder="Vui lòng nhập tối thiểu 1 ký tự"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
//               />
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>{renderCategoryTree(1)}</div>
//                 <div>{renderCategoryTree(2)}</div>
//                 <div>{renderCategoryTree(3)}</div>
//               </div>
//               <div className="mt-4">
//                 <p>Đường dẫn: {getCategoryPath()}</p>
//               </div>
//             </div>
//             <div className="px-6 py-4 bg-gray-100 flex justify-end space-x-2">
//               <button
//                 onClick={() => setIsCategoryModalVisible(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={closeCategoryModal}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Xác nhận
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default CategoryManagerPage;
// import React, { useState } from 'react';
// import { useAddNewCategoryByManagerMutation } from '@/redux/features/manager/category/categoryManagerApiSlice';
// import { CategoryRequest } from '@/utils/DTOs/manager/Category/Request/CategoryRequest';
//
// const CategoryManagerPage = () => {
//   const [addNewCategoryByManager, { isLoading: isAdding }] = useAddNewCategoryByManagerMutation();
//
//   const [categoryData, setCategoryData] = useState<CategoryRequest>({
//     name: '',
//     description: '',
//     image: '',
//     changeImage: false,
//     child: false,
//     parentId: 0,
//   });
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCategoryData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCategoryData((prevData) => ({
//         ...prevData,
//         image: file,
//         changeImage: true,
//       }));
//     }
//   };
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//
//     const formData = new FormData();
//     formData.append('name', categoryData.name);
//     formData.append('description', categoryData.description);
//     formData.append('changeImage', String(categoryData.changeImage));
//
//     if (categoryData.changeImage && categoryData.image instanceof File) {
//       formData.append('image', categoryData.image);
//     }
//       formData.append('child', String(categoryData.child));
//       formData.append('parentId', String(categoryData.parentId));
//
//       const response = await addNewCategoryByManager(formData).unwrap();
//       console.log('Category added successfully:', response);
//       // Reset form data
//       setCategoryData({
//         name: '',
//         description: '',
//         image: '',
//         changeImage: false,
//         child: false,
//         parentId: 0,
//       });
//     } catch (error) {
//       console.error('Error adding category:', error);
//     }
//   };
//
//
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="name">Name:</label>
//         <input type="text" id="name" name="name" value={categoryData.name} onChange={handleInputChange} required />
//       </div>
//       <div>
//         <label htmlFor="description">Description:</label>
//         <textarea id="description" name="description" value={categoryData.description} onChange={handleInputChange} />
//       </div>
//       <div>
//         <label htmlFor="image">Image:</label>
//         <input type="file" id="image" name="image" onChange={handleImageChange} />
//       </div>
//       <div>
//         <label htmlFor="child">Child Category:</label>
//         <input type="checkbox" id="child" name="child" checked={categoryData.child} onChange={(e) => setCategoryData((prevData) => ({ ...prevData, child: e.target.checked }))} />
//       </div>
//       <div>
//         <label htmlFor="parentId">Parent Category:</label>
//         <input type="number" id="parentId" name="parentId" value={categoryData.parentId} onChange={handleInputChange} />
//       </div>
//       <button type="submit" disabled={isAdding}>
//         {isAdding ? 'Adding...' : 'Add Category'}
//       </button>
//     </form>
//   );
// };
//
// export default CategoryManagerPage;
