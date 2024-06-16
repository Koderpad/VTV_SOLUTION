import React, {useState, useEffect} from 'react';
import {useParams, useHistory, useNavigate} from 'react-router-dom';
import {
    useGetVoucherSystemByVoucherIdQuery, useUpdateStatusVoucherSystemMutation,
    useUpdateVoucherSystemMutation
} from '@/redux/features/manager/VoucherSystemManagerApiSlice';
import {VoucherSystemRequest} from '@/utils/DTOs/manager/request/VoucherSystemRequest';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Status} from "@/utils/DTOs/extra/Status.ts";
import {statusToString} from "@/utils/DTOs/extra/convertToString/statusToString.ts";

const UpdateVoucherSystem = () => {
    const {voucherId} = useParams();
    const navigate = useNavigate();
    const {data: voucherSystemResponse, isLoading, isError} = useGetVoucherSystemByVoucherIdQuery(Number(voucherId));
    const [updateVoucherSystem, {isLoading: isUpdating}] = useUpdateVoucherSystemMutation();
    const [updateStatusVoucherSystem] = useUpdateStatusVoucherSystemMutation();
    const [voucherSystemRequest, setVoucherSystemRequest] = useState<VoucherSystemRequest>({
        code: '',
        name: '',
        description: '',
        discount: 0,
        quantity: 0,
        startDate: new Date(),
        endDate: new Date(),
        type: '',
    });

    useEffect(() => {
        if (voucherSystemResponse) {
            setVoucherSystemRequest({
                code: voucherSystemResponse.voucherDTO.code,
                name: voucherSystemResponse.voucherDTO.name,
                description: voucherSystemResponse.voucherDTO.description,
                discount: voucherSystemResponse.voucherDTO.discount,
                quantity: voucherSystemResponse.voucherDTO.quantity,
                startDate: new Date(voucherSystemResponse.voucherDTO.startDate),
                endDate: new Date(voucherSystemResponse.voucherDTO.endDate),
                type: voucherSystemResponse.voucherDTO.type,
            });
        }
    }, [voucherSystemResponse]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setVoucherSystemRequest(prevState => ({
            ...prevState,
            [name]: name === 'discount' || name === 'quantity' ? Number(value) : value,
        }));
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setVoucherSystemRequest(prevState => ({
            ...prevState,
            [name]: new Date(value),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (voucherSystemRequest.startDate >= voucherSystemRequest.endDate) {
            toast.error('Ngày bắt đầu phải trước ngày kết thúc');
            return;
        }

        if (voucherSystemRequest.endDate < new Date()) {
            toast.error('Ngày kết thúc không được ở quá khứ');
            return;
        }

        try {
            await updateVoucherSystem({voucherId: Number(voucherId), data: voucherSystemRequest}).unwrap();
            toast.success('Cập nhật mã giảm giá thành công');
            setTimeout(() => {
                navigate('/manager/vouchers');
            }, 500);
        } catch (error) {
            console.error(error);
            toast.error(error.data?.message || 'Đã xảy ra lỗi');
        }
    };



    const handleStatusUpdate = async (status: Status) => {
        const userConfirmation = window.confirm('Xác nhận cập nhật trạng thái mã giảm giá thành ' + statusToString[status] + '?');

        if (userConfirmation) {
            try {
                await updateStatusVoucherSystem({voucherId: Number(voucherId), status }).unwrap();
                toast.success('Cập nhật trạng thái thành công');
                setTimeout(() => {
                    navigate('/manager/voucher/' + voucherId);
                }, 500);
            } catch (error) {
                toast.error(error.data?.message || 'Đã xảy ra lỗi');
            }
        }else {
            toast.info('Hủy cập nhật trạng thái');
        }
    };

    if (isUpdating) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6 text-center">Cập Nhật Mã Giảm Giá</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={voucherSystemRequest.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Mã
                    </label>
                    <input
                        type="text"
                        name="code"
                        value={voucherSystemRequest.code}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        name="description"
                        value={voucherSystemRequest.description}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Số lượng
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={voucherSystemRequest.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                            Giảm giá
                        </label>
                        <input
                            type="number"
                            name="discount"
                            value={voucherSystemRequest.discount}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Loại
                        </label>
                        <select
                            name="type"
                            value={voucherSystemRequest.type}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>Chọn loại</option>
                            <option value="percent">Phần trăm</option>
                            <option value="money">Số tiền cố định</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={voucherSystemRequest.startDate.toISOString().substring(0, 10)}
                            onChange={handleDateChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={voucherSystemRequest.endDate.toISOString().substring(0, 10)}
                            onChange={handleDateChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2 bg-green-400 text-white rounded hover:bg-green-400 transition duration-300"
                >
                    Cập nhật
                </button>
            </form>
            <hr className="my-4"/>


            <div className="flex items-center mb-4 border rounded-md shadow-md p-4">
                <label htmlFor="status" className="flex-none w-24 text-lg font-medium text-gray-700">
                    Trạng thái
                </label>
                <select
                    defaultValue={voucherSystemResponse?.voucherDTO?.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as Status)}
                    className="flex-grow block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg sm:text-base"
                >
                    <option value={Status.ACTIVE}
                            disabled={voucherSystemResponse?.voucherDTO?.status === Status.ACTIVE}>
                        {statusToString[Status.ACTIVE]}
                    </option>
                    <option value={Status.INACTIVE}
                            disabled={voucherSystemResponse?.voucherDTO?.status === Status.INACTIVE}>
                        {statusToString[Status.INACTIVE]}
                    </option>
                    <option value={Status.DELETED}
                            disabled={voucherSystemResponse?.voucherDTO?.status === Status.DELETED}>
                        {statusToString[Status.DELETED]}
                    </option>
                </select>
            </div>


            <div className="text-center mb-4">
                <button
                    onClick={() => navigate('/manager/vouchers')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Quay lại
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default UpdateVoucherSystem;
