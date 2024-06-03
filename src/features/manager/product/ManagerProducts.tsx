import React, {useEffect, useState} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {
    useGetManagerProductPageByProductNameQuery,
    useGetManagerProductPageQuery
} from "@/redux/features/manager/ProductManagerApiSlice.ts";

const ManagerProducts = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const { data, error, refetch } = searchTerm
        ? useGetManagerProductPageByProductNameQuery({ productName: searchTerm, page, size: 10 })
        : useGetManagerProductPageQuery({ page, size: 10 });

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        refetch(); // Refetch data after search
    };

    useEffect(() => {
        setPage(1);
        refetch(); // Initial fetch when component mounts
    }, []);



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

                    <div className="flex justify-end   items-left">
                        <button
                            onClick={() => navigate('/manager/products')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Danh sách sản phẩm
                        </button>
                    </div>


                    <div className="py-8">
                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý sản phẩm đã bị khóa</h1>
                        <br/>

                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng sản
                                phẩm: {response.totalManagerProduct}</h4>

                        </div>
                        <form onSubmit={handleSearch} className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">Tìm kiếm theo
                                tên sản phẩm:</label>
                            <input
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </form>

                        <br/>

                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
                                    <th className="text-left px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên
                                        sản phẩm
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Nguyên
                                        nhân khóa
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Tài
                                        khoản khóa
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Xem
                                        chi tiết
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {response.managerProductDTOs.map((managerProductDTO, index) => (
                                    <tr key={managerProductDTO.productDTO.productId}>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1 + (page - 1) * 10}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{managerProductDTO.productDTO.name}</td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <img src={managerProductDTO.productDTO.image}
                                                 alt={managerProductDTO.productDTO.name}
                                                 className="w-16 h-16 object-cover rounded"/>
                                        </td>

                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{managerProductDTO.note}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{managerProductDTO.usernameManager}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/manager/product/detail/${managerProductDTO.productDTO.productId}`)}
                                                className="text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Đầu tiên
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Trước
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${pageNumber === page ? 'bg-gray-400' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}>
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    hidden={totalPages === page}>
                                    Tiếp theo
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={page === totalPages}
                                    hidden={totalPages === page}>
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

export default ManagerProducts;