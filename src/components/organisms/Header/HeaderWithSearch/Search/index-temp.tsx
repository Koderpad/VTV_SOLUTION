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
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-grow items-center"
      >
        <input
          type="text"
          placeholder="VTV bao ship 0Đ - Đăng ký ngay!..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-full flex-grow px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="text-white p-2">
          <SearchIcon className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};
