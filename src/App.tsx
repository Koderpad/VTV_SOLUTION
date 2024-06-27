import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./libs/RequireAuth";
// import { HistoryPurchase } from "./components/organisms/Account/HistoryPurchase";
// import CategoryList from "./components/organisms/Home/CategoryList/index.tsx";
import { DashboardManager } from "./pages/manager/DashboardManager";
import AddNewCategory from "./features/manager/category/AddNewCategory.tsx";
import { CategoryManagerPage } from "./pages/manager/CategoryManagerPage";
import UpdateCategory from "@/features/manager/category/UpdateCategory.tsx";
import { BrandManagerPage } from "@/pages/manager/BrandManagerPage.tsx";
import AddNewBrand from "@/features/manager/brand/AddNewBrand.tsx";
import BrandDetail from "@/features/manager/brand/BrandDetail.tsx";
import { UpdateBrand } from "@/features/manager/brand/UpdateBrand.tsx";
import CategoryDetail from "@/features/manager/category/CategoryDetail.tsx";
import VoucherSystemManagerPage from "@/pages/manager/VoucherSystemManagerPage.tsx";
import VoucherSystemDetail from "@/features/manager/voucher/VoucherSystemDetail.tsx";
import UpdateVoucherSystem from "@/features/manager/voucher/UpdateVoucherSystem.tsx";
import AddNewVoucherSystem from "@/features/manager/voucher/AddNewVoucherSystem.tsx";
import { onMessageListener, requestForToken } from "./config/fcm.ts";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "./redux/features/common/notifications/notificationSlice.ts";
import { RootState } from "./redux/store.ts";
import { useGetListNotificationQuery } from "./redux/features/common/notifications/notificationApiSlice.ts";
import VNPayReturn from "./features/common/order/components/VNPayReturn.tsx";
import ChatPage from "./pages/common/ChatPage.tsx";
import CustomerManagerPage from "@/pages/manager/CustomerManagerPage.tsx";
import CustomerDetail from "@/features/manager/customer/CustomerDetail.tsx";
import ShopManagerPage from "@/pages/manager/ShopManagerPage.tsx";
import ShopDetail from "@/features/manager/shop/ShopDetail.tsx";
import ProductManagerPage from "@/pages/manager/ProductManagerPage.tsx";
import ProductDetail from "@/features/manager/product/ProductDetail.tsx";
import ManagerProducts from "@/features/manager/product/ManagerProducts.tsx";
import ManagerShops from "@/features/manager/shop/ManagerShops.tsx";
import ManagerPage from "@/pages/manager/ManagerPage.tsx";
import ManagerDetail from "@/features/manager/manager/ManagerDetail.tsx";
import AddNewManager from "@/features/manager/manager/AddNewManager.tsx";
import StatisticsCustomers from "@/features/manager/customer/StatisticsCustomers.tsx";
import TransportProviderManagerPage from "@/pages/manager/TransportProviderManagerPage.tsx";
import TransportProviderDetail from "@/features/manager/shipping/TransportProviderDetail.tsx";
import UpdateTransportProviderProvinces from "@/features/manager/shipping/UpdateTransportProviderProvinces.tsx";
import UpdateTransportProviderFeeShipping from "@/features/manager/shipping/UpdateTransportProviderFeeShipping.tsx";
import AddNewTransportProvider from "@/features/manager/shipping/AddNewTransportProvider.tsx";
import OrderManagerPage from "@/pages/manager/OrderManagerPage.tsx";
import OrderDetailManager from "@/features/manager/order/OrderDetailManager.tsx";
import StatisticsOrders from "@/features/manager/order/StatisticsOrders.tsx";
import StatisticsProducts from "@/features/manager/product/StatisticsProducts.tsx";
import ShopDetailPage from "./pages/common/ShopDetailPage.tsx";
import StatisticsTransports from "@/features/manager/shipping/StatisticsTransports.tsx";
import { DashboardProvider } from "./pages/provider/DashboardProvider.tsx";
// import CustomerProviderPage from "./pages/provider/CustomerProviderPage.tsx";
import { DashboardDeliver } from "./pages/deliver/DashboardDeliver.tsx";
import { DashboardDeliverManager } from "./pages/deliver-manager/DashboardDeliverManager.tsx";
import Unauthorized from "@/features/Unauthorized.tsx";
import ProviderInformationPage from "@/pages/provider/ProviderInformationPage.tsx";
import UpdateInformationTransportProvider from "@/features/shipping/provider/UpdateInformationTransportProvider.tsx";
import ProviderEmployeePage from "@/pages/provider/ProviderEmployeePage.tsx";
import DeliverDetail from "@/features/shipping/deliver-manager/DeliverDetail.tsx";
import UpdateDeliverWork from "@/features/shipping/deliver-manager/UpdateDeliverWork.tsx";
import AddNewDeliver from "@/features/shipping/deliver-manager/AddNewDeliver.tsx";
import StatisticsTransportsPage from "@/pages/provider/StatisticsTransportsPage.tsx";
import ManagerTransportPage from "@/pages/provider/ManagerTransportPage.tsx";
import TransportDetail from "@/features/shipping/transport/TransportDetail.tsx";
import ResultsPage from "./pages/common/ResultsPage.tsx";
import DeliverManagerInformationPage from "@/pages/deliver-manager/DeliverManagerInformationPage.tsx";
import DeliverManagerEmployeePage from "@/pages/deliver-manager/DeliverManagerEmployeePage.tsx";
import DeliverInformationPage from "@/pages/deliver/DeliverInformationPage.tsx";
import DeliverTransportPage from "@/pages/deliver/DeliverTransportPage.tsx";
import ShopAndTransportDetail from "@/features/shipping/deliver/ShopAndTransportDetail.tsx";
import UpdateTransportPage from "@/pages/deliver/UpdateTransportPage.tsx";
import CashOrderShipperPage from "@/pages/deliver/CashOrderShipperPage.tsx";
import CashOrderWareHousePage from "@/pages/deliver/CashOrderWareHousePage.tsx";
import { useGetListCartByUsernameQuery } from "./redux/features/common/cart/cartApiSlice.ts";
import { setCarts } from "./redux/features/common/cart/cartSlice.ts";
import CashOrderDetail from "@/features/shipping/deliver/CashOrderDetail.tsx";
import HistoryCashOrderShipper from "@/features/shipping/deliver/HistoryCashOrderShipper.tsx";
import UpdateCashOrderShipper from "@/features/shipping/deliver/CanUpdateCashOrderShipper.tsx";
import HistoryCashOrderWareHouse from "@/features/shipping/deliver/HistoryCashOrderWareHouse.tsx";
import UpdateCashOrderWareHouse from "@/features/shipping/deliver/CanUpdateCashOrderWareHouse.tsx";
import CartPage from "./pages/common/Cart.tsx";
import Checkout from "./pages/common/Checkout.tsx";
import AccountPage from "./pages/common/Account.tsx";
import PasswordChanges from "./components/organisms/Common/Account/PasswordChanges/index.tsx";
import Profile from "./components/organisms/Common/Account/Profile/index.tsx";
import Address from "./components/organisms/Common/Account/Address/index.tsx";
import { HistoryPurchase } from "./components/organisms/Common/Account/HistoryPurchase/index.tsx";
import OrderDetail from "./components/organisms/Common/Account/OrderDetail/index.tsx";
import { DashboardVendor } from "./pages/vendor/DashboardVendor.tsx";
import { ShopProfilePage } from "./pages/vendor/ShopProfilePage.tsx";
import { UpdateShopProfilePage } from "./pages/vendor/UpdateShopProfilePage.tsx";
import { AddProductPage } from "./pages/vendor/AddProductPage.tsx";
import { ProductsPage } from "./pages/vendor/ProductsPage.tsx";
//=============LAZY LOADING================
const LoginPage = lazy(() => import("./pages/common/Login"));
const Home = lazy(() => import("./pages/common/Home"));
const ProductDetailPage = lazy(
  () => import("./pages/common/ProductDetailPage")
);

// ROLE: CUSTOMER
// const CartPage = lazy(() => import("./pages/common/Cart"));
// const Checkout = lazy(() => import("./pages/common/Checkout"));
// const AccountPage = lazy(() => import("./pages/common/Account"));
// const Profile = lazy(() => import("./components/organisms/Account/Profile"));
// const PasswordChanges = lazy(
//   () => import("./components/organisms/Account/PasswordChanges"),
// );
// const Address = lazy(() => import("./components/organisms/Account/Address"));
// const OrderDetail = lazy(
//   () => import("./components/organisms/Account/OrderDetail"),
// );
// const CategoryResultsPage = lazy(
//   () => import("./pages/common/CategoryResultsPage"),
// );

//ROLE: MANAGER

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const {
    data: notifications,
    isLoading,
    isSuccess,
    refetch,
  } = useGetListNotificationQuery({ page: 1, size: 5 }, { skip: !isLoggedIn });

  //cart
  const {
    data: carts,
    isLoading: isLoading_,
    isSuccess: isSuccess_,
    refetch: refetch_,
  } = useGetListCartByUsernameQuery();

  useEffect(() => {
    requestForToken();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      refetch();
      refetch_();
    }
  }, [isLoggedIn, refetch, refetch_]);

  useEffect(() => {
    if (isSuccess && notifications) {
      dispatch(setNotifications(notifications.notificationDTOs));
    }
    if (isSuccess_ && carts) {
      dispatch(setCarts(carts.listCartByShopDTOs));
      console.log(carts);
    }
  }, [dispatch, isSuccess, notifications, isSuccess_, carts]);

  useEffect(() => {
    onMessageListener().then(async (data: any) => {
      console.log("Receive foreground: ", data);
      if (isLoggedIn) {
        refetch();
      }
    });
  }, [isLoggedIn, refetch]);

  if (isLoading || isLoading_) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* public routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/home/" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/category/:categoryId" element={<ResultsPage />} />
          <Route path="/search/:searchTerm" element={<ResultsPage />} />

          {/* product */}
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* shop detail */}
          <Route path="/:username.shop" element={<ShopDetailPage />} />

          <Route element={<RequireAuth allowedRoles={["MANAGER"]} />}>
            <Route path="/manager" element={<DashboardManager />}>
              <Route path="categories" element={<CategoryManagerPage />} />
              <Route path="category/add" element={<AddNewCategory />} />
              <Route
                path="category/update/:categoryId"
                element={<UpdateCategory />}
              />
              <Route path="category/:categoryId" element={<CategoryDetail />} />

              <Route path="brands" element={<BrandManagerPage />} />
              <Route path="brand/add" element={<AddNewBrand />} />
              <Route path="brand/update/:brandId" element={<UpdateBrand />} />
              <Route path="brand/:brandId" element={<BrandDetail />} />

              <Route path="vouchers" element={<VoucherSystemManagerPage />} />
              <Route path="voucher/add" element={<AddNewVoucherSystem />} />
              <Route
                path="voucher/update/:voucherId"
                element={<UpdateVoucherSystem />}
              />
              <Route
                path="voucher/:voucherId"
                element={<VoucherSystemDetail />}
              />

              <Route path="customers" element={<CustomerManagerPage />} />
              <Route
                path="customers/revenue"
                element={<StatisticsCustomers />}
              />
              <Route
                path="customer/detail/:customerId"
                element={<CustomerDetail />}
              />

              <Route path="shops" element={<ShopManagerPage />} />
              <Route path="shop/detail/:shopId" element={<ShopDetail />} />
              <Route path="shops/locked" element={<ManagerShops />} />

              <Route path="managers" element={<ManagerPage />} />
              <Route path="manager_id/:managerId" element={<ManagerDetail />} />
              <Route path="add_manager" element={<AddNewManager />} />

              <Route path="products" element={<ProductManagerPage />} />
              <Route
                path="product/detail/:productId"
                element={<ProductDetail />}
              />
              <Route path="products/locked" element={<ManagerProducts />} />
              <Route path="product/revenue" element={<StatisticsProducts />} />

              <Route path="orders" element={<OrderManagerPage />} />
              <Route
                path="order/detail/:orderId"
                element={<OrderDetailManager />}
              />
              <Route path="order/revenue" element={<StatisticsOrders />} />

              <Route path="managers" element={<ManagerPage />} />
              <Route path="manager_id/:managerId" element={<ManagerDetail />} />
              <Route path="add_manager" element={<AddNewManager />} />

              <Route
                path="transport-providers"
                element={<TransportProviderManagerPage />}
              />
              <Route
                path="transport-provider/add"
                element={<AddNewTransportProvider />}
              />
              <Route
                path="transport-provider/detail/:transportProviderId"
                element={<TransportProviderDetail />}
              />
              <Route
                path="transport-provider/update/:transportProviderId"
                element={<UpdateTransportProviderProvinces />}
              />
              <Route
                path="transport-provider/update-fee-shipping/:transportProviderId"
                element={<UpdateTransportProviderFeeShipping />}
              />
              <Route
                path="transport-provider/revenue"
                element={<StatisticsTransports />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["PROVIDER"]} />}>
            <Route path="/provider" element={<DashboardProvider />}>
              <Route path="detail" element={<ProviderInformationPage />} />
              <Route
                path="update/information"
                element={<UpdateInformationTransportProvider />}
              />
              <Route path="employees" element={<ProviderEmployeePage />} />
              <Route
                path="employee/detail/:deliverId"
                element={<DeliverDetail />}
              />
              <Route
                path="employee/update-work/:deliverId"
                element={<UpdateDeliverWork />}
              />
              <Route path="employee/add" element={<AddNewDeliver />} />
              <Route
                path="statistics/revenue"
                element={<StatisticsTransportsPage />}
              />
              <Route path="transports" element={<ManagerTransportPage />} />
              <Route
                path="transport/detail/:transportId"
                element={<TransportDetail />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["DELIVER"]} />}>
            <Route path="/deliver" element={<DashboardDeliver />}>
              <Route path="detail" element={<DeliverInformationPage />} />
              <Route path="transports" element={<DeliverTransportPage />} />
              <Route
                path="transport/shop/:shopId"
                element={<ShopAndTransportDetail />}
              />
              <Route
                path="transport/update"
                element={<UpdateTransportPage />}
              />
              <Route
                path="cash-order/shipper"
                element={<CashOrderShipperPage />}
              />
              <Route
                path="cash-order/warehouse"
                element={<CashOrderWareHousePage />}
              />

              <Route
                path="cash-order/detail/:cashOrderId"
                element={<CashOrderDetail />}
              />
              <Route
                path="cash-order/shipper/history"
                element={<HistoryCashOrderShipper />}
              />

              <Route
                path="cash-order/warehouse/history"
                element={<HistoryCashOrderWareHouse />}
              />

              <Route
                path="cash-order/shipper/update"
                element={<UpdateCashOrderShipper />}
              />
              <Route
                path="cash-order/warehouse/update"
                element={<UpdateCashOrderWareHouse />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["DELIVER_MANAGER"]} />}>
            <Route
              path="/deliver_manager"
              element={<DashboardDeliverManager />}
            >
              <Route
                path="detail"
                element={<DeliverManagerInformationPage />}
              />
              <Route
                path="update/information"
                element={<UpdateInformationTransportProvider />}
              />
              <Route
                path="employees"
                element={<DeliverManagerEmployeePage />}
              />
              <Route
                path="employee/detail/:deliverId"
                element={<DeliverDetail />}
              />
              <Route
                path="employee/update-work/:deliverId"
                element={<UpdateDeliverWork />}
              />
              <Route path="employee/add" element={<AddNewDeliver />} />
              <Route
                path="statistics/revenue"
                element={<StatisticsTransportsPage />}
              />
              <Route path="transports" element={<ManagerTransportPage />} />
              <Route
                path="transport/detail/:transportId"
                element={<TransportDetail />}
              />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["VENDOR"]} />}>
            <Route path="/vendor" element={<DashboardVendor />}>
              <Route path="profile" element={<ShopProfilePage />} />
              <Route path="profile/edit" element={<UpdateShopProfilePage />} />

              {/* products */}
              <Route path="product/new" element={<AddProductPage />} />
              <Route path="products" element={<ProductsPage />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["CUSTOMER"]} />}>
            {/* cart */}
            <Route path="/cart" element={<CartPage />} />

            {/* order */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/vnpay/return" element={<VNPayReturn />} />
            <Route path="user/account" element={<AccountPage />}>
              <Route path="profile" element={<Profile />} />
              <Route path="pw_changes" element={<PasswordChanges />} />
              <Route path="address" element={<Address />} />
              <Route path="history-purchase" element={<HistoryPurchase />} />
              <Route path="order/:id" element={<OrderDetail />} />
              {/* <Route path="favorite-products" element={<FavoriteProducts />} />
              <Route path="voucher-wallet" element={<VoucherList />} />
               */}
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
