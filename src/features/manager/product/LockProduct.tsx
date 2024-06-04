// LockProduct.tsx
import {ProductDTO} from "@/utils/DTOs/manager/dto/ProductDTO.ts";
import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useLockProductByProductIdMutation} from "@/redux/features/manager/ProductManagerApiSlice.ts";
import {Status} from "@/utils/DTOs/extra/Status.ts";

interface LockProductProps {
    productId: number;
    productName: string;
    status: Status;
    onLockSuccess: () => void; // Callback function to notify parent component of lock success
}

const LockProduct = ({productId, productName, status, onLockSuccess}: LockProductProps) => {
    const isLocked = status === "LOCKED";
    const [note, setNote] = useState<string>("");
    const [lockProductByProductId, {isLoading}] = useLockProductByProductIdMutation();

    const handleLockProduct = async () => {
        if (note === "") {
            toast.error("Vui lòng nhập lý do khóa sản phẩm");
            return;
        }
        try {
            const response = await lockProductByProductId({productId, note: note});
            console.log(response);
            toast.success("Khóa sản phẩm thành công");
            onLockSuccess(); // Notify parent component of lock success
        } catch (e) {
            toast.error("Khóa sản phẩm thất bại");
        }
    }

    return (
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
                    <p className="text-purple-600 ml-2">Locked</p>
                    <h3 className="text-2xl font-bold text-black">Sản phẩm đã bị khóa</h3>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl mb-2 font-bold text-black">Khóa sản phẩm</h1>
                    <p className="text-black mb-2"><strong>Tên sản phẩm:</strong> {productName}</p>

                    <p className="text-black mb-2">Nhập lý do khóa sản phẩm</p>
                    <textarea
                        className="border border-gray-300 rounded-lg w-full h-20 p-2"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex justify-center">
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
                            onClick={handleLockProduct}
                            disabled={isLoading}
                        >
                            Khóa sản phẩm
                        </button>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );


}

export default LockProduct;
