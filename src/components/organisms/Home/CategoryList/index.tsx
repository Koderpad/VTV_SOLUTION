import { getAllParentCategory } from "@/services/common/CategoryService";
import { CategoryDTO } from "@/utils/DTOs/common/Category/Response/CategoriesResponse";
import React, { useEffect, useState } from "react";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const maxColumns = 4; // Số cột tối đa hiển thị
  const visibleCategories = categories.slice(
    startIndex,
    startIndex + maxColumns * 2,
  );

  const handlePrevClick = () => {
    setStartIndex(Math.max(0, startIndex - maxColumns));
  };

  const handleNextClick = () => {
    setStartIndex(
      Math.min(startIndex + maxColumns, categories.length - maxColumns * 2),
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllParentCategory();
      setCategories(response.categoryDTOs);
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-[#FFFFFF] my-4 flex flex-col max-h-screen">
      <div className="h-16 flex items-center  text-[#878787]">
        <h1 className="pl-2 py-auto w-auto font-bold size-7">Danh muc</h1>
      </div>
      <div className="relative">
        {startIndex > 0 && (
          <button
            className="absolute z-50 -left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-[1.5] transition-transform duration-200"
            onClick={handlePrevClick}
          >
            {"<"}
          </button>
        )}
        <div className="grid grid-cols-4 ">
          {visibleCategories.map((category) => (
            <a
              key={category.categoryId}
              href="#"
              className="flex flex-col items-center border-[0.1rem] p-8 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="text-4xl mb-2">{category.image}</div>
              <div className="text-sm text-center">{category.name}</div>
            </a>
          ))}
        </div>
        {startIndex + maxColumns * 2 < categories.length && (
          <button
            className="absolute z-50 -right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-[1.5] transition-transform duration-200"
            onClick={handleNextClick}
          >
            {">"}
          </button>
        )}
      </div>
    </div>
    // <div className="relative bg-[#FFFFFF] my-4 flex flex-col max-h-screen">
    //   <div className="h-16 flex items-center  text-[#878787]">
    //     <h1 className=" py-auto w-auto font-bold size-7">Danh muc</h1>
    //   </div>
    //   {startIndex > 0 && (
    //     <button
    //       className="absolute z-50 -left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-[1.5] transition-transform duration-200"
    //       onClick={handlePrevClick}
    //     >
    //       {"<"}
    //     </button>
    //   )}
    //   <div className="grid grid-cols-4 ">
    //     {visibleCategories.map((category) => (
    //       <a
    //         key={category.id}
    //         href="#"
    //         className="flex flex-col items-center border-[0.1rem] p-8 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
    //       >
    //         <div className="text-4xl mb-2">{category.icon}</div>
    //         <div className="text-sm text-center">{category.name}</div>
    //       </a>
    //     ))}
    //   </div>
    //   {startIndex + maxColumns * 2 < categories.length && (
    //     <button
    //       className="absolute z-50 -right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-[1.5] transition-transform duration-200"
    //       onClick={handleNextClick}
    //     >
    //       {">"}
    //     </button>
    //   )}
    // </div>
  );
};

export default CategoryList;
