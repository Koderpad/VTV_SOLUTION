import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "@/redux/features/common/auth/authSlice";
import { useDispatch } from "react-redux";
import { persistor } from "@/redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import StatisticsFeeOrder from "@/features/manager/manager/StatisticsFeeOrder.tsx";
import { RevenuePage } from "./RevenuePage";
import { useGetProfileShopQuery } from "@/redux/features/vendor/shop/shopApiSlice";
import { Wallet } from "lucide-react";

export const DashboardVendor = () => {
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(true);

  const {
    data: shopResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileShopQuery();

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    if (currentPath === undefined) return;

    if (currentPath === "vendor") {
      setSelectedTitle("Home");
      setIsShow(true);
    } else {
      setIsShow(false);
    }

    if (currentPath === "profile") {
      setSelectedTitle("Profile");
    }
    if (currentPath === "vouchers") {
      setSelectedTitle("ManagerVoucher");
    }
    if (
      currentPath === "product" ||
      (currentPath[-1] === "new" && currentPath[-2] === "product")
    ) {
      setSelectedTitle("Products");
    }

    if (currentPath === "orders") {
      setSelectedTitle("ManagerOrder");
    }

    if (currentPath === "brands") {
      setSelectedTitle("ManagerBrand");
    }
    if (currentPath === "categories") {
      setSelectedTitle("Categories");
    }
    if (currentPath === "wallet") {
      setSelectedTitle("ManagerWallet");
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   if (isLoading) {
  //     return;
  //   }
  //   if (shopResponse?.shopDTO.status === "LOCKED") {
  //     return (
  //       <>
  //         <div className="text-center text-red-500 font-bold">
  //           Cửa hàng của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để
  //           biết thêm chi tiết.
  //         </div>
  //         {/* button return home */}
  //         <button
  //           className=""
  //           onClick={() => {
  //             navigate("/");
  //           }}
  //         >
  //           Quay lại trang chủ
  //         </button>
  //       </>
  //     );
  //   }
  // }, [isLoading]);

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
    <>
      {!isLoading && shopResponse?.shopDTO.status === "LOCKED" ? (
        <div className="">
          <div className="text-center text-red-500 font-bold">
            Cửa hàng của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để
            biết thêm chi tiết.
            <button
              className="text-blue-400"
              onClick={() => {
                navigate("/");
              }}
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className=" justify-center h-screen bg-gray-100">
          <div className="grid grid-cols-2 h-full sm:grid-cols-6">
            <div className="w-auto m-4 col-start-1 col-end-2 flex h-full flex-col rounded-xl bg-white p-8">
              <div className="flex flex-col items-center">
                <Link
                  to="/vendor"
                  // className="text-2xl font-semibold text-gray-700 "
                  className={`text-2xl font-semibold text-gray-700 rounded-lg ${
                    selectedTitle === "Home"
                      ? "hover:bg-green-100 text-green-400 "
                      : "hover:bg-green-100 "
                  }`}
                  onClick={() => handleTitleClick("Home")}
                >
                  Bảng điều khiển cửa hàng
                </Link>
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="profile"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                      selectedTitle === "Profile"
                        ? "bg-gray-100 hover:bg-green-100"
                        : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("Profile")}
                  >
                    <FontAwesomeIcon icon={faHome} size="sm" color="#666" />
                    <div className="ml-2" />
                    Trang Thông Tin Cửa Hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="products"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                      selectedTitle === "Products"
                        ? "bg-gray-100 hover:bg-green-100"
                        : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("Products")}
                  >
                    <FontAwesomeIcon icon={faBox} size="sm" color="#666" />
                    <div className="ml-2" />
                    Quản lý sản phẩm
                  </Link>
                </li>

                <Link
                  to="categories"
                  className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                    selectedTitle === "Categories"
                      ? "bg-gray-100 hover:bg-green-100"
                      : "hover:bg-green-100"
                  }`}
                  onClick={() => handleTitleClick("Categories")}
                >
                  <FontAwesomeIcon icon={faTag} size="sm" color="#666" />
                  <div className="ml-2" />
                  Quản lý danh mục
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
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      size="sm"
                      color="#666"
                    />
                    <div className="ml-2" />
                    Quản lý mã giảm giá
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
                    <FontAwesomeIcon icon={faList} size="sm" color="#666" />
                    <div className="ml-2" />
                    Quản lý đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="wallet"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                      selectedTitle === "ManagerWallet"
                        ? "bg-gray-100 hover:bg-green-100"
                        : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("ManagerWallet")}
                  >
                    <Wallet color="#666" />
                    <div className="ml-2" />
                    Quản lý ví
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100`}
                    onClick={() => {}}
                  >
                    <FontAwesomeIcon icon={faHome} size="sm" color="#666" />
                    <div className="ml-2" />
                    Về trang chủ VTV
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

            {isShow ? (
              <div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
                <div className="font-medium text-gray-600 w-full">
                  <RevenuePage />
                </div>
              </div>
            ) : (
              <div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
                <div className="font-medium text-gray-600 w-full">
                  <Outlet />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
