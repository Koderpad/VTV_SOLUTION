


import React, { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import {
    useGetManagerShopPageByLockQuery,
    useGetManagerShopPageByNameAndLockQuery
} from "@/redux/features/manager/ShopManagerApiSlice.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";


const ManagerShops = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLocked, setIsLocked] = useState(false); // Track locked state
    const navigate = useNavigate();

    // Fetch data based on lock status and search term
    const { data, error, refetch } = searchTerm
        ? useGetManagerShopPageByNameAndLockQuery({
            search: searchTerm,
            lock: isLocked,
            page,
            size: 5,
        })
        : useGetManagerShopPageByLockQuery({ lock: isLocked, page, size: 5 });

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        refetch(); // Refetch data after search
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    if (!data) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const response = data;

    const totalPages = response.totalPage;

    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="flex justify-start items-left">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                            onClick={() => navigate(-1)}
                        >
                            Quay Lại
                        </button>
                    </div>

                    <div className="py-8">
                        <h1 className="text-4xl font-bold text-center text-gray-900">
                            Quản lý cửa hàng đã {isLocked ? 'khóa' : 'mở'}
                        </h1>
                        <hr className="mt-4 border-b-2 border-gray-300"/>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng cửa
                                hàng: {response.totalManagerShop}</h4>
                            <form onSubmit={handleSearch} className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                                    Tìm kiếm theo tên cửa hàng:
                                </label>
                                <input
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </form>
                        </div>



                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Hiển thị cửa hàng:
                            </label>
                            <div>
                                <input
                                    type="radio"
                                    id="unlockedShops"
                                    name="lockStatus"
                                    value={false}
                                    checked={!isLocked}
                                    onChange={() => setIsLocked(false)}
                                    className="mr-2"
                                />
                                <label htmlFor="unlockedShops" className="mr-4">Cửa hàng đã mở</label>
                                <input
                                    type="radio"
                                    id="lockedShops"
                                    name="lockStatus"
                                    value={true}
                                    checked={isLocked}
                                    onChange={() => setIsLocked(true)}
                                    className="mr-2"
                                />
                                <label htmlFor="lockedShops">Cửa hàng đã khóa</label>
                            </div>
                        </div>


                        {/* Table displaying shop data */}
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tên cửa hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {isLocked ? 'Nguyên nhân khóa' : 'Nguyên nhân mở'}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {isLocked ? 'Tài khoản khóa' : 'Tài khoản mở'}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Xem chi tiết
                                    </th>

                                </tr>
                                </thead>
                                <tbody>
                                {response.managerShopDTOs.map((shop, index) => (
                                    <tr key={shop.managerShopId}>
                                        <td className="px-5 py-5 border-b text-center border-gray-200 bg-white text-sm">{index + 1}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{shop.shopName}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{shop.note}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">{shop.managerUsername}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-center text-sm">{shop.lock ? 'Đã khóa' : 'Đang mở'}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">

                                            <button

                                                onClick={() => navigate(`/manager/shop/detail/${shop.shopId}`)}

                                                className="text-indigo-600 hover:text-indigo-900">

                                                <FontAwesomeIcon icon={faEye}/>

                                            </button>

                                        </td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>

                        </div>
                        {/* Pagination */}
                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(1)}
                                    disabled={page === 1}
                                >
                                    Đầu tiên
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                >
                                    Trước
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${pageNumber === page ? 'bg-gray-400' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === totalPages ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    Tiếp theo
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${page === totalPages ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={page === totalPages}
                                >
                                    Cuối cùng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default ManagerShops;
