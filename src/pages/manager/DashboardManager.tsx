import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {logOut} from "@/redux/features/common/auth/authSlice";
import {useDispatch} from "react-redux";
import {persistor} from "@/redux/store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faTicketAlt,
    faHome,
    faStore,
    faList,
    faTag,
    faBox,
    faTruck,
    faUsers,
    faBuildingUser,
    faUserCog
} from "@fortawesome/free-solid-svg-icons";
import StatisticsFeeOrder from "@/features/manager/manager/StatisticsFeeOrder.tsx";

export const DashboardManager = () => {
    const [selectedTitle, setSelectedTitle] = useState<string>("");
    const location = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const currentPath = location.pathname.split("/").pop();
        if (currentPath === undefined) return;

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
                                <FontAwesomeIcon icon={faHome} size="sm" color="#666"/>
                                <div className="ml-2"/>
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
                                <FontAwesomeIcon icon={faUsers} size="sm" color="#666"/>
                                <div className="ml-2"/>
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
                            <FontAwesomeIcon icon={faStore} size="sm" color="#666"/>
                            <div className="ml-2"/>
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
                            <FontAwesomeIcon icon={faTruck} size="sm" color="#666"/>
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
                                <FontAwesomeIcon icon={faBox} size="sm" color="#666"/>
                                <div className="ml-2"/>
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
                                <FontAwesomeIcon icon={faList} size="sm" color="#666"/>
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
                                <FontAwesomeIcon icon={faTag} size="sm" color="#666"/>
                                <div className="ml-2"/>
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
                                <FontAwesomeIcon icon={faBuildingUser} size="sm" color="#666"/>
                                <div className="ml-2"/>
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
                                <FontAwesomeIcon icon={faUserCog} size="sm" color="#666"/>
                                <div className="ml-2"/>
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