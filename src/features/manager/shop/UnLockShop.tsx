import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useUnlockShopByShopIdMutation } from "@/redux/features/manager/ShopManagerApiSlice";

interface UnlockShopProps {
    shopId: number;
    shopName: string;
    onUnLockSuccess: () => void;
}

const UnlockShop = ({ shopId, shopName, onUnLockSuccess }: UnlockShopProps) => {
    const [unlockShopByShopId] = useUnlockShopByShopIdMutation();
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState("");

    const handleUnlock = async () => {
        setLoading(true);
        try {
            await unlockShopByShopId({ shopId,  note });
            toast.success("Mở khóa cửa hàng thành công!");
            onUnLockSuccess();
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi mở khóa cửa hàng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="max-w-lg mx-auto mt-full p-8 bg-white rounded-md shadow-md">
                <h1 className="text-center text-2xl font-bold text-black mb-4">Mở khóa cửa hàng</h1>
                <p className="text-black mb-2"><strong>Tên sản phẩm:</strong> {shopName}</p>

                <p className="text-black mb-2">Nhập lý do mở khóa cửa hàng</p>
                <textarea
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Ghi chú"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex justify-center">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleUnlock}
                        disabled={loading}
                    >
                        {loading ? "Đang mở khóa..." : "Xác nhận"}
                    </button>
                </div>
                <ToastContainer/>
            </div>

        </div>
    );
};

export default UnlockShop;
