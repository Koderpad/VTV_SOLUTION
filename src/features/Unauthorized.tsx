import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/common/auth/authSlice.ts";
import { persistor } from "@/redux/store.ts";

const Unauthorized = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    localStorage.removeItem("token");
    dispatch(logOut());
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">
        Bạn không có quyền truy cập trang!
      </h1>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          onClick={() => navigate(-1)}
        >
          Quay Lại
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
          onClick={() => handleLogout()}
        >
          Đăng Xuất
        </button>

        <button
          onClick={() => navigate("/home")}
          className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4"
        >
          Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

// import {useNavigate} from "react-router-dom";
//
// const Unauthorized = () => {
//     const navigate = useNavigate();
//     return (
//         <div className="flex flex-col items-center justify-center h-screen">
//             <h1 className="text-4xl font-bold text-red-500">
//                 Bạn không có quyền truy cập trang!
//             </h1>
//
//             <div className="flex justify-center mt-8 space-x-4">
//                 <button
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
//                     onClick={() => navigate(-1)}
//                 >
//                     Quay Lại
//                 </button>
//
//                 <button
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-4"
//                     onClick={() => navigate('/login')}
//                 >
//                     Đăng Xuất
//                 </button>
//
//                 <button
//                     onClick={() => navigate('/home')}
//                     className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 mb-4">
//                     Trang Chủ
//                 </button>
//             </div>
//         </div>
//     )
// }
//
// export default Unauthorized;

