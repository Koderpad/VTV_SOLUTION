import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {logOut} from "@/redux/features/common/auth/authSlice";
import {useDispatch} from "react-redux";
import {persistor} from "@/redux/store";
import {faHome, faInfoCircle, faUser, faTruck, faChartLine, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import HomeDeliverManager from "@/pages/deliver-manager/HomeDeliverManagerPage.tsx";
import HomeDeliverPage from "@/pages/deliver/HomeDeliverPage.tsx";

export const DashboardDeliver = () => {
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(true);

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
      setIsShow(false)
    }

    if (currentPath === "employees") {
      setSelectedTitle("ProviderEmployee");
    }

    if (currentPath === "statistics/revenue") {
      setSelectedTitle("StatisticsRevenue");
    }

    if (currentPath === "transports") {
      setSelectedTitle("ProviderTransports");
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
                    to="/deliver"
                    className={`flex font-medium text-gray-600 hover:text-green-400 p-2 rounded-lg ${
                        selectedTitle === "Home"
                            ? "bg-gray-100 hover:bg-green-100"
                            : "hover:bg-green-100"
                    }`}
                    onClick={() => handleTitleClick("Home")}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-3 h-6 w-6"/>
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
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-3 h-6 w-6"/>
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
                  <FontAwesomeIcon icon={faTruck} className="mr-3 h-6 w-6"/>
                  Quản lý đơn vận
                </Link>
              </li>




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


          {isShow ? (<div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
            <p className="font-medium text-gray-600">

              <HomeDeliverPage/>
            </p>
          </div>) : (<div className="w-auto m-4 col-start-2 col-end-7  p-8 bg-white rounded-xl flex ">
            <p className="font-medium text-gray-600">
              <Outlet/>
            </p>
          </div>)}


        </div>
      </div>
  );
};