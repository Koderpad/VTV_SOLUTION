import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {
    useGetPageCustomerByStatusAndSortQuery,
    useSearchPageCustomerByFullNameAndStatusQuery
} from '@/redux/features/manager/CustomerManagerApiSlice';
import {Status} from '@/utils/DTOs/extra/Status';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {faEye, faAdd} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {roleToString} from "@/utils/DTOs/extra/convertToString/roleToString.ts";
import AddInManager from "@/features/manager/manager/AddInManager";

const AddNewManager = () => {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('name-asc');
    const [searchTerm, setSearchTerm] = useState('');
    const {data, error, isLoading, refetch} = searchTerm
        ? useSearchPageCustomerByFullNameAndStatusQuery({search: searchTerm, status: Status.ACTIVE, page, size: 20})
        : useGetPageCustomerByStatusAndSortQuery({status: Status.ACTIVE, page, size: 20, sort});
    const navigate = useNavigate();
    const [isAddRole, setIsAddRole] = useState(false);
    const [username, setUsername] = useState('');


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const totalPages = data.totalPage;


    const handleAddRole = ({username}) => {
        setIsAddRole(true);
        setUsername(username);
    };

    const handleAddRoleSuccess = () => {
        setIsAddRole(false);
        setUsername('')
        refetch();
    }

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
                        <h1 className="text-4xl font-bold text-center text-gray-900">Thêm mới quản lý</h1>
                        <hr className="mt-4 border-b-2 border-gray-300"/>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng tài khoản: {data.totalCustomer}</h4>
                            {searchTerm ?
                                <h4 className="text-l text-gray-900">Kết quả tìm kiếm: {data.totalCustomer}</h4>
                                : <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sort">
                                        Sắp xếp theo:
                                    </label>
                                    <select
                                        id="sort"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="name-asc">Họ tên A-Z</option>
                                        <option value="name-desc">Họ tên Z-A</option>
                                    </select>
                                </div>
                            }
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                                Tìm kiếm theo họ tên:
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
                                    <th className=" px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tên đăng nhập
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Họ tên
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ngày sinh
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Quyền
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Xem
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Thêm quyền
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.customerDTOs.map((customer, index) => (
                                    <tr key={customer.customerId}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {index + 1 + (page - 1) * 20}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {customer.username}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {customer.email}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {customer.fullName}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {new Date(customer.birthday).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {customer.roles.map((role, index) => (
                                                <div>
                                                    <span key={role}
                                                          className="text-gray-800 font-semibold py-1 px-2 rounded-full text-xs">
                                                     {index + 1}. {roleToString[role]}
                                                         </span>
                                                    {index !== customer.roles.length - 1 && <br/>}
                                                </div>
                                            ))}
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/manager/customer/detail/${customer.customerId}`)}
                                                className="text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>
                                        </td>


                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                className="text-green-500 hover:text-green-700"
                                                onClick={() => handleAddRole({username: customer.username})}
                                                disabled={isLoading}
                                            >
                                                <FontAwesomeIcon icon={faAdd}/>
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

                    <div>
                        {isAddRole && <AddInManager username={username} onAddSuccess={handleAddRoleSuccess}/>}
                    </div>


                </div>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default AddNewManager;