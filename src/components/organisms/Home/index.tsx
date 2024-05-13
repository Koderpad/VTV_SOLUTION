import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 1, name: "Máy Ảnh & Máy Quay...", icon: "📷" },
  { id: 2, name: "Dòng Hộ Nam", icon: "👞" },
  { id: 3, name: "Dòng Hộ Nữ", icon: "👗" },
  { id: 4, name: "Đồng Hồ", icon: "⌚" },
  { id: 5, name: "Giày Dép", icon: "👟" },
  { id: 6, name: "Túi Xách", icon: "👜" },
  { id: 7, name: "Phụ Kiện", icon: "🕶" },
  { id: 8, name: "Thời Trang Trẻ Em", icon: "🧸" },
  { id: 9, name: "Thời Trang Nam", icon: "👔" },
  { id: 10, name: "Thời Trang Nữ", icon: "👚" },
  { id: 11, name: "Thời Trang Thể Thao", icon: "🏋️‍♂️" },
  { id: 12, name: "Thời Trang Trung Niên", icon: "👴" },
  { id: 13, name: "Thời Trang Cao Cấp", icon: "🎩" },
  { id: 14, name: "Thời Trang Hạt Rẻ", icon: "🧢" },
  // ... danh sách các danh mục khác
];

const CategoryList: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const maxColumns = 4; // Số cột tối đa hiển thị
  const visibleCategories = categories.slice(
    startIndex,
    startIndex + maxColumns * 2
  );

  const handlePrevClick = () => {
    setStartIndex(Math.max(0, startIndex - maxColumns));
  };

  const handleNextClick = () => {
    setStartIndex(
      Math.min(startIndex + maxColumns, categories.length - maxColumns * 2)
    );
  };

  return (
    <div className="relative">
      {startIndex > 0 && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200"
          onClick={handlePrevClick}
        >
          {"<"}
        </button>
      )}
      <div className="grid grid-cols-4 gap-4 m-16 p-16 overflow-x-auto scrollbar-hide">
        {visibleCategories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <div className="text-sm text-center">{category.name}</div>
          </div>
        ))}
      </div>
      {startIndex + maxColumns * 2 < categories.length && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200"
          onClick={handleNextClick}
        >
          {">"}
        </button>
      )}
    </div>
  );
};

export default CategoryList;
