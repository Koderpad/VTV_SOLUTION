import {toast, ToastContainer} from "react-toastify";
import {useDeleteRoleManagerMutation} from "@/redux/features/manager/RoleManagerApiSlice"; // Assuming this is your API slice

interface DeleteManagerProps {
    username: string;
    onDeleteSuccess: () => void;
}

const DeleteManager = ({username, onDeleteSuccess}: DeleteManagerProps) => {
    const [deleteRoleManager, {isLoading, error}] = useDeleteRoleManagerMutation(); // Get error from mutation

    const handleDeleteRole = async () => {
        try {
            const response = await deleteRoleManager({usernameCustomer: username}).unwrap();
            toast.success("Xóa quyền quản lý thành công!");
            setTimeout(() => {
                onDeleteSuccess();
            }, 700);
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi xóa quyền quản lý!");
            setTimeout(() => {
                onDeleteSuccess();
            }, 700);
        }
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận xóa quyền quản lý</h2>
                <p className="text-black text-center">Bạn có chắc chắn muốn xóa quyền quản lý của {username}?</p>
                <br/>
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
                        onClick={handleDeleteRole}
                        disabled={isLoading}
                    >
                        Xác nhận
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onDeleteSuccess}
                    >
                        Hủy
                    </button>
                </div>
            </div>

            <ToastContainer/>
        </div>
    );
};

export default DeleteManager;