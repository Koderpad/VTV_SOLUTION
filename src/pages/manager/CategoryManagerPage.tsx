import { getAllCategories } from "@/services/manager/CategoryService";
import { CategoryDTO } from "@/utils/DTOs/manager/Category/Response/CategoriesResponse";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CategoryManagerPage = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const navigation = useNavigate();
  useEffect(
    () => {
      const fetchCategory = async () => {
        const data = await getAllCategories();
        setCategories(data.categoryDTOs);
        console.log(data);
      };
      fetchCategory();
    },
    []
  )

  return (
    <div>
      <button className="bg-pink-400" onClick={()=>{
        navigation("/manager/category/add");
      }}>Add new</button>

      <h1>Category Manager Page</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};
