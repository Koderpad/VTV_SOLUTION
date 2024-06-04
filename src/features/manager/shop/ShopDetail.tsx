import { useParams, useNavigate } from 'react-router-dom';
import { useGetShopByIdQuery, useLockShopByShopIdMutation, useUnlockShopByShopIdMutation } from '@/redux/features/manager/ShopManagerApiSlice';
import { statusToString } from "@/utils/DTOs/extra/statusToString.ts";
import UnlockShop from "@/features/manager/shop/UnLockShop.tsx";
import LockShop from "@/features/manager/shop/LockShop.tsx";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ShopDTO } from "@/utils/DTOs/manager/dto/ShopDTO.ts";

const ShopDetail = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState<ShopDTO>();
    const [isLock, setIsLock] = useState(false);
    const [isUnLock, setIsUnLock] = useState(false);
    const { data, error: queryError, isLoading: queryLoading, refetch } = useGetShopByIdQuery(Number(shopId));

    useEffect(() => {
        try {
            if (data) {
                setShop(data.shopDTO);
            }
        } catch (e) {
            toast.error("Đã xảy ra lỗi khi lấy dữ liệu cửa hàng!");
            setTimeout(() => {
                navigate('/manager/shops');
            }, 700);
        }
    }, [data]);


    const handleLockSuccess = () => {
        setIsLock(false);
        refetch(); // Refetches the shop data after locking
    };

    const handleUnLockSuccess = () => {
        setIsUnLock(false);
        refetch(); // Refetches the shop data after unlocking
    };

    if (queryLoading) return <div className="flex justify-center items-center h-screen"><span className="text-xl text-gray-700">Loading...</span></div>;
    if (queryError) return <div className="flex justify-center items-center h-screen"><span className="text-xl text-red-500">Error: {queryError.message}</span></div>;

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                onClick={() => navigate(-1)}
            >
                Quay Lại
            </button>
            <h1 className="text-4xl font-bold text-black mb-8 text-center">Chi tiết cửa hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin cơ bản</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Tên cửa hàng:</dt>
                            <dd className="mt-1 text-black">{shop?.name}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Ảnh đại diện:</dt>
                            <dd className="mt-1">
                                <img src={shop?.avatar} alt="Avatar" className="w-32 h-32 rounded-lg" />
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Địa chỉ:</dt>
                            <dd className="mt-1 text-black">
                                {shop?.address}, {shop?.wardName}, {shop?.districtName}, {shop?.provinceName}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Số điện thoại:</dt>
                            <dd className="mt-1 text-black">{shop?.phone}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Email:</dt>
                            <dd className="mt-1 text-black">{shop?.email}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Trạng thái:</dt>
                            <dd className="mt-1 text-black">{statusToString[shop?.status]}</dd>
                        </div>
                    </dl>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-black mb-4">Thông tin bổ sung</h2>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-neutral-800 font-bold">Mô tả:</dt>
                            <dd className="mt-1 text-black">{shop?.description}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Giờ mở cửa:</dt>
                            <dd className="mt-1 text-black">{shop?.openTime}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Giờ đóng cửa:</dt>
                            <dd className="mt-1 text-black">{shop?.closeTime}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã khách hàng:</dt>
                            <dd className="mt-1 text-black">{shop?.customerId}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Tên đăng nhập:</dt>
                            <dd className="mt-1 text-black">{shop?.shopUsername}</dd>
                        </div>
                        <div>
                            <dt className="text-neutral-800 font-bold">Mã phường:</dt>
                            <dd className="mt-1 text-black">{shop?.wardCode}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="mt-8 flex justify-between ">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    onClick={() => navigate(`/manager/customer/detail/${shop?.customerId}`)}
                >
                    Xem Thông Tin Chi Tiết Tài Khoản
                </button>
                <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => navigate(`/${shop?.shopUsername}`)}
                >
                    Xem Shop Tại Sàn
                </button>
                {shop?.status === 'LOCKED' ? (
                    <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        onClick={() => setIsUnLock(true)}
                    >
                        Mở Khóa Cửa Hàng
                    </button>
                ) : (
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => setIsLock(true)}
                    >
                        Khóa Cửa Hàng
                    </button>
                )}
            </div>

            {isLock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận khóa cửa hàng</h2>
                        <p className="text-black text-center">Bạn có chắc chắn muốn khóa cửa hàng này không?</p>
                        <br />
                        <div className="mt-4 flex justify-center">
                            <LockShop shopId={shop?.shopId} shopName={shop?.name} status={shop?.status} onLockSuccess={handleLockSuccess} />
                            <div className="w-4"></div>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setIsLock(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isUnLock && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                        <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận mở khóa cửa hàng</h2>
                        <p className="text-black text-center">Bạn có chắc chắn muốn mở khóa cửa hàng này không?</p>
                        <br />
                        <div className="mt-4 flex justify-center">
                            <UnlockShop shopId={shop?.shopId} shopName={shop?.name} onUnLockSuccess={handleUnLockSuccess} />
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                onClick={() => setIsUnLock(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ShopDetail;