import React, {useState} from 'react';

import {Status} from '@/utils/DTOs/extra/Status';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAdd, faEye} from '@fortawesome/free-solid-svg-icons';
import {
    useFindManagerPageByUsernameQuery,
    useGetManagerPageByStatusQuery
} from "@/redux/features/manager/ManagerApiSlice.ts";
import {roleToString} from "@/utils/DTOs/extra/convertToString/roleToString.ts";
import {statusToString} from "@/utils/DTOs/extra/convertToString/statusToString.ts";
import DeleteManager from "@/features/manager/manager/DeleteManager.tsx";
import AddInManager from "@/features/manager/manager/AddInManager.tsx";
import {faRemove} from "@fortawesome/free-solid-svg-icons/faRemove";
import {faTrashRestore} from "@fortawesome/free-solid-svg-icons/faTrashRestore";

const ManagerPage = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState(Status.ACTIVE);
    const {data, error, isLoading, refetch} = searchTerm
        ? useFindManagerPageByUsernameQuery({username: searchTerm, page, size: 20})
        : useGetManagerPageByStatusQuery({status, page, size: 20});
    const navigate = useNavigate();
    const [isAddRole, setIsAddRole] = useState(false);
    const [isDeleteRole, setIsDeleteRole] = useState(false);
    const [username, setUsername] = useState('');




    const handleAddRole = ({username}) => {
        setIsAddRole(true);
        setUsername(username);
    };

    const handleDeleteRole = ({username}) => {
        setIsDeleteRole(true);
        setUsername(username);
    }

    const handleRoleSuccess = () => {
        setIsDeleteRole(false);
        setIsAddRole(false);
        setUsername('')
        refetch();
    };


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const totalPages = data.totalPage;

    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">
                        <div className="flex justify-between items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                                onClick={() => navigate(-1)}
                            >
                                Quay Lại
                            </button>


                            <button
                                onClick={() => navigate('/manager/add_manager')}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4">
                                Thêm quản lý
                            </button>
                        </div>
                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý nhân viên</h1>
                        <hr className="mt-4 border-b-2 border-gray-300"/>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng nhân viên: {data.count}</h4>
                            <div>
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
                                    <option value={Status.DELETED}>Đã xóa</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="search">
                                Tìm kiếm theo tên nhân viên:
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
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tài khoản
                                    </th>

                                    <th className=" px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Xem
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {status === Status.ACTIVE ? 'Xóa' : 'Khôi phục'}
                                    </th>

                                </tr>
                                </thead>
                                <tbody>
                                {data.managerDTOs.map((manager, index) => (
                                    <tr key={manager.managerId}>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {index + 1 + (page - 1) * 20}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {manager.username}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {manager.roles.map((role, index) => (
                                                <div>
                                                    <span key={role}
                                                          className="text-gray-800 font-semibold py-1 px-2 rounded-full text-xs">
                                                     {index + 1}. {roleToString[role]}
                                                         </span>
                                                    {index !== manager.roles.length - 1 && <br/>}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            {statusToString[manager.status]}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/manager/customer/detail/${manager.customerId}`)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>
                                        </td>

                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            {status === Status.ACTIVE ? (
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDeleteRole({username: manager.username})}
                                                        disabled={isLoading}
                                                    >
                                                        <FontAwesomeIcon icon={faRemove}/>
                                                    </button>
                                                </td>) : (
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                                    <button
                                                        className="text-green-500 hover:text-green-700"
                                                        onClick={() => handleAddRole({username: manager.username})}
                                                        disabled={isLoading}
                                                    >
                                                        <FontAwesomeIcon icon={faTrashRestore}/>
                                                    </button>
                                                </td>
                                            )}

                                        </td>


                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">

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
                        {isAddRole && <AddInManager username={username} onAddSuccess={handleRoleSuccess}/>}
                        {isDeleteRole && <DeleteManager username={username} onDeleteSuccess={handleRoleSuccess}/>}
                    </div>

                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default ManagerPage;
