import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useLockShopByShopIdMutation } from "@/redux/features/manager/ShopManagerApiSlice";
import { Status } from "@/utils/DTOs/extra/Status.ts";

interface LockShopProps {
    shopId: number;
    shopName: string;
    status: Status;
    onLockSuccess: () => void;
}

const LockShop = ({ shopId, shopName, status, onLockSuccess }: LockShopProps) => {
    const [lockShopByShopId] = useLockShopByShopIdMutation();
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState("");
    const isLocked = status === "LOCKED";
    const handleLockProduct = async () => {
        setLoading(true);
        try {
            await lockShopByShopId({ shopId,  note });
            toast.success("Khóa cửa hàng thành công!");
            onLockSuccess();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi khóa cửa hàng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="max-w-lg mx-auto mt-full p-8 bg-white rounded-md shadow-md">
                {isLocked ? (
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l9-5-9-5-9 5 9 5z"
                                />
                            </svg>
                        </div>
                        <p className="text-purple-600 ml-2">Đã khóa</p>
                        <h3 className="text-2xl font-bold text-black">Cửa hàng đã bị khóa</h3>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl mb-2 font-bold text-black">Khóa cửa hàng</h1>
                        <p className="text-black mb-2"><strong>Tên cửa hàng:</strong> {shopName}</p>

                        <p className="text-black mb-2">Nhập lý do khóa cửa hàng</p>
                        <textarea
                            className="border border-gray-300 rounded-lg w-full h-20 p-2"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                        <div className="flex justify-center">
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleLockProduct}
                                disabled={loading}
                            >
                                {loading ? "Đang khóa..." : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                )}
                <ToastContainer/>
            </div>

        </div>
    );
};

export default LockShop;
