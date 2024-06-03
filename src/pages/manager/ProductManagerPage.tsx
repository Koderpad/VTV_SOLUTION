import React, {useEffect, useState} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {getFilterProductPage, getProductPageBySearchAndSort} from "@/services/common/ProductService.ts";

const ProductManagerPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('price-asc');
    const [filter, setFilter] = useState('price-asc');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            let response;
            if (searchTerm) {
                response = await getProductPageBySearchAndSort(page, 10, searchTerm, sort);
            } else {
                response = await getFilterProductPage(page, 10, filter);
            }
            setData(response);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, searchTerm, sort, filter]);



    if (!data) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const totalPages = data.totalPage;

    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">

                        <div className="flex justify-end   items-left">
                            <button
                                onClick={() => navigate('/manager/products/locked')}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Danh sách sản phẩm đã khóa
                            </button>
                        </div>

                        <br/>

                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý sản phẩm</h1>
                        <br/>

                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng sản phẩm: {data.totalProduct}</h4>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sort">Sắp
                                    xếp:</label>
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="price-asc">Giá tăng dần</option>
                                    <option value="price-desc">Giá giảm dần</option>
                                    <option value="newest">Mới nhất</option>
                                    <option value="best-selling">Bán chạy nhất</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">Tìm kiếm theo
                                tên sản phẩm:</label>
                            <input
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>


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

                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Biến
                                        thể
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Đã
                                        bán
                                    </th>
                                    <th className="text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">Xem
                                        chi tiết
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.productDTOs.map((product, index) => (
                                    <tr key={product.productId}>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{index + 1 + (page - 1) * 5}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.name}</td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <img src={product.image} alt={product.name}
                                                 className="w-16 h-16 object-cover rounded"/>
                                        </td>

                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.minPrice.toLocaleString()} - {product.maxPrice.toLocaleString()} đ</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.productVariantDTOs.length}</td>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">{product.sold}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/manager/product/detail/${product.productId}`)}
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
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Đầu tiên
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === 1 ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    hidden={1 === page}>
                                    Trước
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${pageNumber === page ? 'bg-gray-400' : ''}`}
                                        onClick={() => setPage(pageNumber)}>
                                        {pageNumber}
                                    </button>
                                ))}
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    hidden={totalPages === page}>
                                    Tiếp theo
                                </button>
                                <button
                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${totalPages === page ? 'bg-gray-400' : ''}`}
                                    onClick={() => setPage(totalPages)}
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

export default ProductManagerPage;
