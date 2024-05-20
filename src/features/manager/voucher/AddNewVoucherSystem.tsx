import React, {useState} from 'react';
import {useAddNewVoucherSystemMutation} from '@/redux/features/manager/VoucherSystemManagerApiSlice';
import {VoucherSystemRequest} from '@/utils/DTOs/manager/request/VoucherSystemRequest';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';

const AddNewVoucherSystem = () => {
    const [addNewVoucherSystem, {isLoading}] = useAddNewVoucherSystemMutation();
    const navigate = useNavigate();
    const [voucherSystem, setVoucherSystem] = useState<VoucherSystemRequest>({
        code: '',
        name: '',
        description: '',
        discount: 0,
        quantity: 0,
        startDate: new Date(),
        endDate: new Date(),
        type: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setVoucherSystem(prevState => ({
            ...prevState,
            [name]: name === 'discount' || name === 'quantity' ? Number(value) : value,
        }));
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setVoucherSystem(prevState => ({
            ...prevState,
            [name]: new Date(value),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (voucherSystem.startDate >= voucherSystem.endDate) {
            toast.error('Ngày bắt đầu phải trước ngày kết thúc');
            return;
        }

        if (voucherSystem.endDate < new Date()) {
            toast.error('Ngày kết thúc không được ở quá khứ');
            return;
        }

        try {
            await addNewVoucherSystem(voucherSystem).unwrap();
            toast.success('Thêm mã giảm giá thành công');

            setTimeout(() => {
                navigate('/manager/vouchers');
            }, 500);
        } catch (error) {
            toast.error(error.data.message || 'Đã xảy ra lỗi');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-6 text-center">Thêm Mã Giảm Giá Mới</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Tên
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={voucherSystem.name}
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
                        value={voucherSystem.code}
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
                        value={voucherSystem.description}
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
                        value={voucherSystem.quantity}
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
                            value={voucherSystem.discount}
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
                            value={voucherSystem.type}
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
                            value={voucherSystem.startDate.toISOString().substring(0, 10)}
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
                            value={voucherSystem.endDate.toISOString().substring(0, 10)}
                            onChange={handleDateChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-green-400 text-white rounded hover:bg-green-400 transition duration-300"
                >
                    Thêm Mã Giảm Giá
                </button>
            </form>
            <hr className="my-4"/>
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

export default AddNewVoucherSystem;
