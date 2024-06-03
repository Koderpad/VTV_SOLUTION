import React, {useState} from 'react';
import {
    useGetShopsByStatusQuery,
    useGetShopsByNameAndStatusQuery
} from '@/redux/features/manager/ShopManagerApiSlice';
import {Status} from '@/utils/DTOs/extra/Status';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";



const ShopManagerPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState(Status.ACTIVE);
    const {data, error, isLoading} = searchTerm
        ? useGetShopsByNameAndStatusQuery({search: searchTerm, status, page, size: 5})
        : useGetShopsByStatusQuery({status, page, size: 5});
    const navigate = useNavigate();



    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;



    const totalPages = data.totalPage;



    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">





                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý cửa hàng</h1>
                        <hr className="mt-4 border-b-2 border-gray-300"/>
                        <div className="flex justify-between items-center mb-4">

                            <h4 className="text-l text-gray-900">Tổng số lượng cửa hàng: {data.count}</h4>

                            {searchTerm ?

                                <h4 className="text-l text-gray-900">Kết quả tìm kiếm: {data.count}</h4>

                                : <div>

                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">

                                        Trạng thái:

                                    </label>

                                    <select

                                        id="status"

                                        value={status}

                                        onChange={(e) => setStatus(e.target.value)}

                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                                    >

                                        <option value={Status.ACTIVE}>Đang hoạt động</option>

                                        <option value={Status.INACTIVE}>Không hoạt động</option>

                                        <option value={Status.DELETED}>Đã xóa</option>

                                        <option value={Status.CANCEL}>Đã hủy</option>

                                        <option value={Status.LOCKED}>Đã khóa</option>

                                    </select>

                                </div>

                            }

                        </div>



                        <div className="mb-4">

                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">

                                Tìm kiếm theo tên cửa hàng:

                            </label>

                            <input

                                id="search"

                                value={searchTerm}

                                onChange={(e) => setSearchTerm(e.target.value)}

                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                            />

                        </div>





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

                                        Địa chỉ

                                    </th>

                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">

                                        Số điện thoại

                                    </th>

                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">

                                        Email

                                    </th>

                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">

                                        Xem chi tiết

                                    </th>

                                </tr>

                                </thead>

                                <tbody>

                                {data.shopDTOs.map((shop, index) => (

                                    <tr key={shop.shopId}>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                            {index + 1 + (page - 1) * 5}

                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                            {shop.name}

                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                            {shop.address}

                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                            {shop.phone}

                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">

                                            {shop.email}

                                        </td>

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

                        <div

                            className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">

                            <div className="inline-flex mt-2 xs:mt-0">

                                <button

                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l ${page === 1 ? 'bg-gray-400' : ''}`}

                                    onClick={() => setPage(1)}

                                    disabled={page === 1}

                                    hidden={1 === page}

                                >

                                    Đầu tiên

                                </button>

                                <button

                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${page === 1 ? 'bg-gray-400' : ''}`}

                                    onClick={() => setPage(page - 1)}

                                    disabled={page === 1}

                                    hidden={1 === page}



                                >

                                    Trước

                                </button>

                                {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNumber) => (

                                    <button

                                        key={pageNumber}

                                        className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${pageNumber === page ? 'bg-gray-400' : ''}`}

                                        onClick={() => setPage(pageNumber)}

                                    >

                                        {pageNumber}

                                    </button>

                                ))}

                                <button

                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 ${totalPages === page ? 'bg-gray-400' : ''}`}

                                    onClick={() => setPage(page + 1)}

                                    disabled={page === totalPages}

                                    hidden={totalPages === page}

                                >

                                    Tiếp theo

                                </button>

                                <button

                                    className={`text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r ${totalPages === page ? 'bg-gray-400' : ''}`}

                                    onClick={() => setPage(totalPages)}

                                    disabled={page === totalPages}

                                    hidden={totalPages === page}

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

}




export default ShopManagerPage;