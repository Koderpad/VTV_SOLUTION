import React, { useState } from "react";
import { SearchIcon } from "@/components/atoms/Icon/Search";

export const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(searchTerm); // Process search term here
  };

  return (
    <div className="bg-blue-400 p-2 flex justify-between items-center">
      {/* <span className="text-white text-sm px-4">
        Shopee bao ship 0Đ - Đăng ký ngay!
      </span> */}
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-full px-4 py-2 w-[30rem] focus:outline-none"
        />
        <button type="submit" className="text-white p-2">
          <SearchIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};
