import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./libs/RequireAuth";
import { HistoryPurchase } from "./components/organisms/Account/HistoryPurchase";
import CategoryList from "./components/organisms/Home";
import { DashboardManager } from "./pages/manager/DashboardManager";
import AddNewCategoryManagerPage from "./pages/manager/AddNewCategoryManagerPage";
import { CategoryManagerPage } from "./pages/manager/CategoryManagerPage";
// import { CategoryManagerPage } from "./pages/manager/CategoryManagerPage";
//=============LAZY LOADING================
const LoginPage = lazy(() => import("./pages/common/Login"));
const Home = lazy(() => import("./pages/common/Home"));
const ProductDetailPage = lazy(
  () => import("./pages/common/ProductDetailPage")
);

// ROLE: CUSTOMER
const CartPage = lazy(() => import("./pages/common/Cart"));
const Checkout = lazy(() => import("./pages/common/Checkout"));
const AccountPage = lazy(() => import("./pages/common/Account"));
const Profile = lazy(() => import("./components/organisms/Account/Profile"));
const PasswordChanges = lazy(
  () => import("./components/organisms/Account/PasswordChanges")
);
const Address = lazy(() => import("./components/organisms/Account/Address"));
const OrderDetail = lazy(
  () => import("./components/organisms/Account/OrderDetail")
);
const CategoryResultsPage = lazy(
  () => import("./pages/common/CategoryResultsPage")
);
//ROLE: MANAGER

function App() {
  return (
    <BrowserRouter >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* public routes */}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<CategoryList />} />

          {/* category results */}
          <Route
            path="/category/:categoryId"
            element={<CategoryResultsPage />}
          />

          {/* product */}
          <Route path="/product/:productId" element={<ProductDetailPage />} />

          {/* cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* order */}
          <Route path="/checkout" element={<Checkout />} />

          {/* search */}

          <Route element={<RequireAuth allowedRoles={["MANAGER"]} />}>
            <Route path="/manager" element={<DashboardManager />}>
              {/* <Route path="category" element={<CategoryManagerPage />} />
              // <Route path="product" element={<ProductManagerPage />} />
              // <Route path="order" element={<OrderManagerPage />} />
              // <Route path="user" element={<UserManagerPage />} /> */}
              <Route path="categories" element={<CategoryManagerPage />} />
              <Route path="category/add" element={<AddNewCategoryManagerPage />} />
            </Route>
            
          </Route> 

          <Route element={<RequireAuth allowedRoles={["VENDOR"]} />}></Route>

          {/* private routes */}
          <Route element={<RequireAuth allowedRoles={["CUSTOMER"]} />}>
            {/* <Route path="address" element={<Address />} /> */}
            {/* <Route path="products/:id" element={<ProductsByCategory />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<PayMent />} />
            <Route path="checkout/:id" element={<OrderDetailsForm />} /> */}

            <Route path="user/account" element={<AccountPage />}>
              <Route path="profile" element={<Profile />} />
              <Route path="pw_changes" element={<PasswordChanges />} />
              <Route path="address" element={<Address />} />
              <Route path="history-purchase" element={<HistoryPurchase />} />
              <Route path="order/:id" element={<OrderDetail />} />
              {/* <Route path="favorite-products" element={<FavoriteProducts />} />
              <Route path="voucher-wallet" element={<VoucherList />} />
              <Route
                path="checkout/add/review/order-item/:id"
                element={<AddReview />}
              />
              <Route
                path="checkout/review/order-item/:id"
                element={<Review />}
              /> */}
            </Route>
          </Route>

          {/* TEST */}
          {/* <Route path="/test" element={<SearchResultsTemplate />} /> */}
          {/* <Route path="/test" element={<ProductDetailTemplate />} /> */}

          {/* private routes */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
