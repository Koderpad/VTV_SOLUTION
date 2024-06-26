import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";


const  HomeDeliverPage = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-black mb-8 text-center">Trang chủ</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate('/deliver/transports')}
                >
                    Danh sách đơn vận chuyển
                </button>
            </div>
            <div className="flex justify-center items-center h-screen">
                <span className="text-xl text-gray-700">Chào mừng bạn đến với ứng dụng quản lý đơn vận chuyển</span>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default HomeDeliverPage;