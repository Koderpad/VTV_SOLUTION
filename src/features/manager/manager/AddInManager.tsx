import {toast, ToastContainer} from "react-toastify";
import {useAddRoleManagerMutation} from "@/redux/features/manager/RoleManagerApiSlice";


interface AddInManagerProps {
    username: string;
    onAddSuccess: () => void;
}

const AddInManager = ({username, onAddSuccess}: AddInManagerProps) => {
    const [addRoleManager, {isLoading}] = useAddRoleManagerMutation();

    const handleAddRole = async () => {
        try {
            const response = await addRoleManager({usernameCustomer: username}).unwrap();
            toast.success("Thêm quyền quản lý thành công!");
            setTimeout(() => {
                onAddSuccess();
            }, 700);
        } catch (error) {
            toast.error(error.data.message);
            setTimeout(() => {
                onAddSuccess();
            }, 700);
        }
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-md w-1/3">
                <h2 className="text-4xl font-bold text-black mb-4 text-center">Xác nhận thêm quyền quản lý</h2>
                <p className="text-black text-center">Bạn có chắc chắn muốn thêm quyền quản lý cho {username}?</p>
                <br/>
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                        onClick={handleAddRole}
                        disabled={isLoading}
                    >
                        Xác nhận
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onAddSuccess}
                    >
                        Hủy
                    </button>
                </div>
            </div>


            <ToastContainer/>
        </div>
    );
};

export default AddInManager;