import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {logOut} from "@/redux/features/common/auth/authSlice";
import {useDispatch} from "react-redux";
import {persistor} from "@/redux/store";

export const DashboardManager = () => {
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const location = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy phần cuối cùng của đường dẫn làm title
        const currentPath = location.pathname.split("/").pop();
        if (currentPath === undefined) return;

        if (currentPath === "customers") {
            setSelectedTitle("Quanlynguoidung");
        }
        if (currentPath === "vouchers") {
            setSelectedTitle("Quanlyvouchers");
        }
        if (currentPath === "products") {
            setSelectedTitle("Quanlysanpham");
        }
        if (currentPath === "categories") {
            setSelectedTitle("Quanlycate");
        }
        if (currentPath === "brands") {
            setSelectedTitle("QuanLyBrand");
        }

        console.log(currentPath);

        // Cập nhật trạng thái selectedTitle
        // setSelectedTitle(currentPath);
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
                    {/* title ADMIN */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">DashboardManager</h2>
                    </div>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="/"
                                // className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg bg-gray-100 hover:bg-green-100"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Home"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                // onClick={() => handleTitleClick("Home")}
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
                                Home
                            </a>
                        </li>
                        <li>
                            <Link
                                to="manager/customers"
                                // className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Quanlynguoidung"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("Quanlynguoidung")}
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
                                        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                                    />
                                </svg>
                                Quản lý người dùng
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="vouchers"
                                // className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Quanlyvouchers"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("Quanlyvouchers")}
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
                                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                    />
                                </svg>
                                Quản lý voucher
                            </Link>
                        </li>
                        <li>
                            <a
                                href="/admin/manager/products"
                                // className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Quanlysanpham"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("Quanlysanpham")}
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
                                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                    />
                                </svg>
                                Quản lý sản phẩm
                            </a>
                        </li>

                        <li>
                            <Link
                                to="categories"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Quanlycate"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("Quanlycate")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="mr-3 h-6 w-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                </svg>
                                Quản lý danh mục
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="brands"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "QuanLyBrand"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("QuanLyBrand")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="mr-3 h-6 w-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M14 14a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z"/>
                                </svg>
                                Quản lý thương hiệu
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
                        <Outlet/>
                    </p>
                </div>
            </div>
        </div>
    );
};

