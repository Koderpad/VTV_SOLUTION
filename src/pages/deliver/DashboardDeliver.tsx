import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {logOut} from "@/redux/features/common/auth/authSlice";
import {useDispatch} from "react-redux";
import {persistor} from "@/redux/store";
import {
  faHome,
  faInfoCircle,
  faMoneyBillWave,
  faPenToSquare,
  faSignOutAlt,
  faTruck,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import HomeDeliverPage from "@/pages/deliver/HomeDeliverPage.tsx";
import {useGetDeliverInfoMutation} from "@/redux/features/shipping/DeliverApiSlice.ts";
import {DeliverDTO} from "@/utils/DTOs/shipping/dto/DeliverDTO.ts";
import {TypeWork} from "@/utils/DTOs/extra/TypeWork.ts";

export const DashboardDeliver = () => {
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(true);
  const [getDeliverInfo] = useGetDeliverInfoMutation();
  const [deliverInfo, setDeliverInfo] = useState<DeliverDTO>();

  const fetchData = async () => {
    try {
      const response = await getDeliverInfo().unwrap();
      setDeliverInfo(response.deliverDTO);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);


  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    if (currentPath === undefined) return;

    if (currentPath === "detail") {
      setSelectedTitle("Deliver");
    }

    if (currentPath === "deliver") {
      setSelectedTitle("Home");
      setIsShow(true);
    } else {
      setIsShow(false);
    }


    if (currentPath === "transports") {
      setSelectedTitle("ProviderTransports");
    }

    if (currentPath === "transport/update") {
      setSelectedTitle("DeliverTransportUpdate");
    }

    if (currentPath === "cash-order/shipper") {
      setSelectedTitle("DeliverCashOrderShipper");
    }

    if (currentPath === "cash-order/warehouse") {
      setSelectedTitle("DeliverCashOrderWareHouse");
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
      <div className="justify-center h-screen bg-gray-100">
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
                    to="/deliver"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "Home"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("Home")}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-3 h-6 w-6" />
                  Trang chủ
                </Link>
              </li>

              <li>
                <Link
                    to="/deliver/detail"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "Deliver"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("Deliver")}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-3 h-6 w-6" />
                  Thông tin
                </Link>
              </li>

              <li>
                <Link
                    to="/deliver/transports"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "ProviderTransports"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("ProviderTransports")}
                >
                  <FontAwesomeIcon icon={faTruck} className="mr-3 h-6 w-6" />
                  Quản lý đơn vận chờ lấy
                </Link>
              </li>

              <li>
                <Link
                    to="/deliver/transport/update"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "DeliverTransportUpdate"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("DeliverTransportUpdate")}
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="mr-3 h-6 w-6" />
                  Cập nhật đơn vận
                </Link>
              </li>

              <li>
                <Link
                    to="/deliver/cash-order/shipper"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "DeliverCashOrderShipper"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("DeliverCashOrderShipper")}
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-3 h-6 w-6" />
                  Quản lý tiền của nhân viên giao hàng
                </Link>
              </li>

              {deliverInfo?.typeWork === TypeWork.WAREHOUSE &&
                  <li>
                    <Link
                        to="/deliver/cash-order/warehouse"
                        className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                            selectedTitle === "DeliverCashOrderWareHouse"
                                ? "bg-gray-100 hover:bg-green-100"
                                : "hover:bg-green-100"
                        }`}
                        onClick={() => handleTitleClick("DeliverCashOrderWareHouse")}
                    >
                      <FontAwesomeIcon icon={faWarehouse} className="mr-3 h-6 w-6"/>
                      Quản lý tiền của nhân kho
                    </Link>
                  </li>

              }

            </ul>

            <a
                href="#"
                onClick={handleLogout}
                className="flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg hover:bg-green-100"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-6 w-6"/>
              Đăng xuất
            </a>
          </div>

          {isShow ? (
              <div
                  className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex "
              >
                <p className="font-medium text-gray-600">
                  <HomeDeliverPage/>
                </p>
              </div>
          ) : (
              <div
                  className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex "
              >
                <p className="font-medium text-gray-600">
                  <Outlet />
                </p>
              </div>
          )}
        </div>
      </div>
  );
};