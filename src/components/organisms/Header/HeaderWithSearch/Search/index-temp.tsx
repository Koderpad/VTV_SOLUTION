import React, { useState } from "react";
import { SearchIcon } from "@/components/atoms/Icon/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";

export const SearchBar: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState(
    location.pathname.slice(-5) === ".shop" ? false : true,
  ); // all, this shop

  const navigate = useNavigate();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchType) {
      navigate(`/search/${searchTerm}`);
    } else {
      console.log("shop search: " + location.pathname);
      navigate(
        `/search/${searchTerm}?shop=${location.pathname.split(".")[0].slice(1)}`,
      );
    }
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
          {/* shop search session */}
          {location.pathname.slice(-5) === ".shop" ? (
            <>
              <span className="border-r border-gray-300 h-auto mr-2"></span>
              <div className="flex flex-col w-auto cursor-pointer px-2 group">
                <button
                  type="button"
                  className="flex flex-grow items-center justify-center"
                >
                  <span className="">
                    {!searchType ? "Trong Shop này" : "Trong VTV"}
                  </span>
                  <div className="w-2"></div>
                  <AiOutlineDown />
                </button>
                <div className="relative">
                  <div className="absolute -top-5 py-8 hidden group-hover:block w-full">
                    <div className="flex gap-2 bg-white shadow-lg w-auto -ml-4 pl-4">
                      <div className="flex flex-col w-full">
                        <span
                          className={`hover:text-gray-500 ${searchType ? "text-gray-500" : ""}`}
                          onClick={() => setSearchType(true)}
                        >
                          Trong VTV
                        </span>
                        <span
                          className={`hover:text-gray-500 ${!searchType ? "text-gray-500" : ""}`}
                          onClick={() => setSearchType(false)}
                        >
                          Trong Shop này
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
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
