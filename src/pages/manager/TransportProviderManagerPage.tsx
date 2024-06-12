import React from 'react';
import { useGetAllTransportProvidersQuery } from '@/redux/features/manager/TransportProviderManagerApiSlice';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const TransportProviderManagerPage = () => {
    const { data, error, isLoading } = useGetAllTransportProvidersQuery();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    return (
        <TransitionGroup>
            <CSSTransition timeout={500} classNames="fade">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">
                        <div className="flex justify-between items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                                onClick={() => navigate(-1)}>
                                Quay Lại
                            </button>

                            <button
                                className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600 mb-4"
                                onClick={() => navigate('/manager/transport-provider/revenue')}>
                                Thống kê vận chuyển
                            </button>

                            <button
                                onClick={() => navigate('/manager/transport-provider/add')}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4">
                                Thêm nhà vận chuyển
                            </button>
                        </div>

                        <h1 className="text-4xl font-bold text-center text-gray-900">Quản lý nhà vận chuyển</h1>
                        <hr className="mt-4 border-b-2 border-gray-300"/>

                        <br/>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-l text-gray-900">Tổng số lượng nhà vận chuyển: {data.count}</h4>
                        </div>


                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tên đầy đủ
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tên ngắn
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Xem chi tiết
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.transportProviderDTOs.map((provider, index) => (
                                    <tr key={provider.transportProviderId}>
                                        <td className="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {index + 1 }
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {provider.fullName}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {provider.shortName}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {provider.email}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {provider.phone}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/manager/transport-provider/detail/${provider.transportProviderId}`)}
                                                className="text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default TransportProviderManagerPage;
