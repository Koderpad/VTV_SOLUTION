import {useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify";
import React, {useEffect, useState} from "react";
import {TransportProviderDTO} from "@/utils/DTOs/shipping/dto/TransportProviderDTO.ts";
import {
    useGetTransportProviderByUsernameQuery,
    useUpdateInformationTransportProviderMutation
} from "@/redux/features/shipping/TransportProviderApiSlice.ts";
import {UpdateTransportProviderRequest} from "@/utils/DTOs/shipping/request/UpdateTransportProviderRequest.ts";

const UpdateInformationTransportProvider = () => {
    const navigate = useNavigate();
    const [transportProvider, setTransportProvider] = useState<TransportProviderDTO>();
    const {data, error, isLoading, refetch} = useGetTransportProviderByUsernameQuery();
    const [updateTransportProvider, {isLoading: isUpdating, error: updateError}] =
        useUpdateInformationTransportProviderMutation();

    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        try {
            if (data) {
                setTransportProvider(data.transportProviderDTO);
                setFullName(data.transportProviderDTO.fullName);
                setShortName(data.transportProviderDTO.shortName);
                setEmail(data.transportProviderDTO.email);
                setPhone(data.transportProviderDTO.phone);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi lấy dữ liệu nhà cung cấp vận chuyển!");
            setTimeout(() => {
                navigate('/');
            }, 700);
        }
    }, [data]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await updateTransportProvider({
                transportProviderId: transportProvider?.transportProviderId.toString() || "",
                data: {
                    fullName,
                    shortName,
                    email,
                    phone,
                } as UpdateTransportProviderRequest,
            });
            console.log(response);
            if (response.data.message) {
                toast.success(response.data.message);
                refetch();
                setTimeout(() => {
                    navigate(`/provider/detail`);
                }, 700);
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi cập nhật thông tin!");
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-gray-700">Loading...</span></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><span
        className="text-xl text-red-500">Error: {error.message}</span></div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}>
                    Quay Lại
                </button>
            </div>
            <br/>

            <h1 className="text-4xl font-bold text-black mb-8 text-center">Cập nhật thông tin nhà cung cấp vận
                chuyển</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                                Tên đầy đủ:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shortName">
                                Tên ngắn:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="shortName"
                                type="text"
                                value={shortName}
                                onChange={(e) => setShortName(e.target.value)}
                                required
                            />
                        </div>

                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-black mb-4">Thông tin liên lạc</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Số điện thoại:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                    </div>
                </div>
                <div className="flex justify-center items-center mt-8 mb-4 w-full ">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
                        type="submit"
                        disabled={isUpdating}
                    >
                        Cập nhật
                    </button>
                </div>

            </form>
            <ToastContainer/>
        </div>
    );
};

export default UpdateInformationTransportProvider;