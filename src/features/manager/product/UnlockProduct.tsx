import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useUnLockProductByProductIdMutation} from "@/redux/features/manager/ProductManagerApiSlice.ts";

interface UnlockProductProps {
    productId: number;
    productName: string;
    onUnLockSuccess: () => void; // Callback function to notify parent component of unlock success
}

const UnlockProduct = ({productId, productName, onUnLockSuccess}: UnlockProductProps) => {
    const [note, setNote] = useState<string>("");
    const [unLockProductByProductId, {isLoading}] = useUnLockProductByProductIdMutation();

    const handleUnLockProduct = async () => {
        if (note === "") {
            toast.error("Vui lòng nhập lý do mở khóa sản phẩm");
            return;
        }
        try {
            const response = await unLockProductByProductId({productId, note: note});
            console.log(response);
            toast.success("Mở khóa sản phẩm thành công");
            onUnLockSuccess(); // Notify parent component of unlock success
        } catch (e) {
            toast.error("Mở khóa sản phẩm thất bại");
        }
    }

    return (
        <div className="max-w-lg mx-auto mt-full p-8 bg-white rounded-md shadow-md">
            <h1 className="text-center text-2xl font-bold text-black mb-4">Mở khóa sản phẩm</h1>
            <p className="text-black mb-2"><strong>Tên sản phẩm:</strong> {productName}</p>

            <p className="text-black mb-2">Nhập lý do mở khóa sản phẩm</p>
            <textarea
                className="border border-gray-300 rounded-lg w-full h-20 p-2 mb-4"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-center">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleUnLockProduct}
                    disabled={isLoading}
                >
                    Mở khóa sản phẩm
                </button>
            </div>
            <ToastContainer/>
        </div>
    );

}

export default UnlockProduct;
