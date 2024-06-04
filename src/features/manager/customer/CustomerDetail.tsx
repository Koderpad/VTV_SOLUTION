import {useParams, useNavigate} from 'react-router-dom'; // Import useNavigate
import {useGetCustomerDetailByCustomerIdQuery} from '@/redux/features/manager/CustomerManagerApiSlice';
import {roleToString} from "@/utils/DTOs/extra/RoleToString.ts";
import {statusToString} from "@/utils/DTOs/extra/statusToString.ts";
import {toast, ToastContainer} from "react-toastify";

const CustomerDetail = () => {
    const {customerId} = useParams<{ customerId: string }>();
    const navigate = useNavigate(); // Initialize useNavigate
    const {data, error, isLoading} = useGetCustomerDetailByCustomerIdQuery(Number(customerId));

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        toast.error('Đã có lỗi xảy ra khi tải dữ liệu');
        setTimeout(() => {
            navigate("/manager/customers");
        }, 700);
    }

    const customer = data.customerDTO;

    return (
        <div className="container mx-auto px-4 sm:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-900">Thông tin chi tiết khách hàng</h1>
            <hr className="mt-4 border-b-2 border-gray-300"/>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full leading-normal">
                    <tbody>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Tên đăng nhập</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{customer.username}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Email</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{customer.email}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Họ và tên</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{customer.fullName}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Ngày sinh</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{new Date(customer.birthday).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Trạng thái</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{statusToString[customer.status]}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Giới tính</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">{customer.gender ? 'Nam' : 'Nữ'}</td>
                    </tr>
                    <tr>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">Quyền</td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                            {Array.from(customer.roles).map((role, index) => (
                                <span key={index}
                                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{roleToString[role]}</span>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-center">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                    onClick={() => navigate(-1)}
                >
                    Quay Lại
                </button>
            </div>

            <ToastContainer/>
        </div>
    );
}

export default CustomerDetail;
