import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {logOut} from "@/redux/features/common/auth/authSlice";
import {useDispatch} from "react-redux";
import {persistor} from "@/redux/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBorderAll, faTicketAlt, faTruckArrowRight} from "@fortawesome/free-solid-svg-icons";
import StatisticsFeeOrder from "@/features/manager/manager/StatisticsFeeOrder.tsx";

export const DashboardManager = () => {
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const location = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        // Lấy phần cuối cùng của đường dẫn làm title
        const currentPath = location.pathname.split("/").pop();
        if (currentPath === undefined) return;

        console.log("show " + currentPath);


        if (currentPath === "manager") {
            setSelectedTitle("Home");
            setIsShow(true);
        } else {
            setIsShow(false)
        }

        if (currentPath === "customers") {
            setSelectedTitle("ManagerCustomer");
        }
        if (currentPath === "vouchers") {
            setSelectedTitle("ManagerVoucher");
        }
        if (currentPath === "products") {
            setSelectedTitle("ManagerProduct");
        }

        if (currentPath === "orders") {
            setSelectedTitle("ManagerOrder");
        }

        if (currentPath === "categories") {
            setSelectedTitle("ManagerCategory");
        }
        if (currentPath === "brands") {
            setSelectedTitle("ManagerBrand");
        }
        if (currentPath === "shops") {
            setSelectedTitle("ManagerShop");
        }

        if (currentPath === "managers") {
            setSelectedTitle("Manager");
        }
        if (currentPath === "transport-providers") {
            setSelectedTitle("ManagerTransportProvider");
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
                        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Bảng điều khiển</h2>
                    </div>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/manager"
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
                                    selectedTitle === "ManagerCustomer"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerCustomer")}
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


                        <Link
                            to="shops"
                            className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                selectedTitle === "ManagerShop"
                                    ? "bg-gray-100 hover:bg-green-100"
                                    : "hover:bg-green-100"
                            }`}
                            onClick={() => handleTitleClick("ManagerShop")}
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
                                    d="M4 6h16v12H4zM2 8a2 2 0 002-2h12a2 2 0 002 2v8a2 2 0 00-2 2H4a2 2 0 00-2-2V8z"/>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 6a2 2 0 012 2v4h-4v-4zM8 6a2 2 0 012 2v4h-4v-4z"
                                />
                            </svg>
                            Quản lý cửa hàng
                        </Link>


                        <Link
                            to="transport-providers"
                            className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                selectedTitle === "ManagerTransportProvider"
                                    ? "bg-gray-100 hover:bg-green-100"
                                    : "hover:bg-green-100"
                            }`}
                            onClick={() => handleTitleClick("ManagerTransportProvider")}
                        >
                            <FontAwesomeIcon icon={faTruckArrowRight} size="sm" color="#666"/>
                            <div className="ml-2"/>
                            Quản lý nhà cung cấp vận chuyển
                        </Link>


                        <li>
                            <Link
                                to="vouchers"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "ManagerVoucher"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerVoucher")}
                            >
                                <FontAwesomeIcon icon={faTicketAlt} size="sm" color="#666"/>
                                <div className="ml-2"/>
                                Quản lý mã giảm giá
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="products"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "ManagerProduct"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerProduct")}
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
                                        d="M21 12.79V8.21a2 2 0 00-1-1.73l-7-4.02a2 2 0 00-2 0l-7 4.02A2 2 0 003 8.21v4.58a2 2 0 001 1.73l7 4.02a2 2 0 002 0l7-4.02a2 2 0 001-1.73z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3.27 6.96l8.73 5.02 8.73-5.02"
                                    />
                                </svg>
                                Quản lý sản phẩm
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="orders"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "ManagerOrder"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerOrder")}
                            >
                                <FontAwesomeIcon icon={faBorderAll}/>
                                <div className="ml-2"/>
                                Quản lý đơn hàng
                            </Link>
                        </li>


                        <li>
                            <Link
                                to="categories"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "ManagerCategory"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerCategory")}
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
                                    selectedTitle === "ManagerBrand"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("ManagerBrand")}
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


                        <li>
                            <Link
                                to="managers"
                                className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                                    selectedTitle === "Manager"
                                        ? "bg-gray-100 hover:bg-green-100"
                                        : "hover:bg-green-100"
                                }`}
                                onClick={() => handleTitleClick("Manager")}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="mr-3 h-6 w-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9.75 9.75A3.75 3.75 0 1113.5 13.5M19.25 21.25v-3.25a4 4 0 00-4-4h-6.5a4 4 0 00-4 4v3.25M9 13.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm6 0a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"/>
                                </svg>
                                Quản lý quản trị viên
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


                {isShow ? (<div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
                    <p className="font-medium text-gray-600">

                        <StatisticsFeeOrder/>
                    </p>
                </div>) : (<div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
                    <p className="font-medium text-gray-600">
                        <Outlet/>
                    </p>
                </div>)
                }
            </div>
        </div>
    );
};

