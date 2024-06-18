import React, { useState } from "react";
import { SearchIcon } from "@/components/atoms/Icon/Search";
import { useNavigate } from "react-router-dom";

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  return (
    <div className="flex">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-grow p-[3px] items-center bg-white border border-gray-200 rounded-sm"
      >
        <div className="flex flex-grow w-full">
          <div className="flex-grow pr-4">
            <input
              type="text"
              placeholder="VTV bao ship 0Đ - Đăng ký ngay!..."
              value={searchTerm}
              onChange={handleSearchChange}
              className=" focus:outline focus:outline-2 focus:outline-offset-8 w-full h-10 pl-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className=" flex justify-center px-4  bg-blue-600 text-white  "
        >
          <SearchIcon className=" h-8 w-6" />
        </button>
      </form>
    </div>
  );
};
