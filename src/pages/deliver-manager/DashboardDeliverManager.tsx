import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "@/redux/features/common/auth/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "@/redux/store";

export const DashboardDeliverManager = () => {
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy phần cuối cùng của đường dẫn làm title
    const currentPath = location.pathname.split("/").pop();
    if (currentPath === undefined) return;

    if (currentPath === "deliver_manager") {
      setSelectedTitle("Home");
    }

    if (currentPath === "customers") {
      setSelectedTitle("DeliverManagerCustomer");
    }
  }, [location.pathname]);

  const handleTitleClick = (title: string) => {
    setSelectedTitle(title);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.reload();
    dispatch(logOut());
    navigate("/login");
    await persistor.purge();
  };

  return (
    <div className=" justify-center h-screen bg-gray-100">
      <div className="grid grid-cols-2 h-full sm:grid-cols-6">
        <div className="w-auto m-4 col-start-1 col-end-2 flex h-full flex-col rounded-xl bg-white p-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-gray-700 mt-4">
              Bảng điều khiển
            </h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/deliver_manager"
                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                  selectedTitle === "Home"
                    ? "bg-gray-100 hover:bg-green-100"
                    : "hover:bg-green-100"
                }`}
                onClick={() => handleTitleClick("Home")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="mr-3 h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Trang Quản Trị
              </Link>
            </li>
            <li>
              <Link
                to="customers"
                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                  selectedTitle === "DeliverManagerCustomer"
                    ? "bg-gray-100 hover:bg-green-100"
                    : "hover:bg-green-100"
                }`}
                onClick={() => handleTitleClick("DeliverManagerCustomer")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-3 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a4.5 4.5 0 01-9 0 4.5 4.5 0 119 0zM15 12.75a6 6 0 00-12 0v1.5c0 2.071 1.679 3.75 3.75 3.75h4.5c2.071 0 3.75-1.679 3.75-3.75v-1.5z"
                  />
                </svg>
                Quản lý người dùng
              </Link>
            </li>
          </ul>

          <a
            href="#"
            onClick={handleLogout}
            className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mr-3 h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Đăng xuất
          </a>
        </div>
        <div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
          <p className="font-medium text-gray-600">
            <Outlet />
          </p>
        </div>
      </div>
    </div>
  );
};
