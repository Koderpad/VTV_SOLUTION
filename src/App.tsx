import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./libs/RequireAuth";
//=============LAZY LOADING================
const LoginPage = lazy(() => import("./pages/common/Login"));
const Home = lazy(() => import("./pages/common/Home"));
const ProductDetailPage = lazy(
  () => import("./pages/common/ProductDetailPage"),
);

// ROLE: CUSTOMER
const CartPage = lazy(() => import("./pages/common/Cart"));
const Checkout = lazy(() => import("./pages/common/Checkout"));
const AccountPage = lazy(() => import("./pages/common/Account"));
const Profile = lazy(() => import("./components/organisms/Account/Profile"));
const PasswordChanges = lazy(
  () => import("./components/organisms/Account/PasswordChanges"),
);
const Address = lazy(() => import("./components/organisms/Account/Address"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />

          {/* product */}
          <Route path="product/:productId" element={<ProductDetailPage />} />

          {/* cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* order */}
          <Route path="/checkout" element={<Checkout />} />

          {/* search */}

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
              {/* <Route path="favorite-products" element={<FavoriteProducts />} />
              <Route path="voucher-wallet" element={<VoucherList />} />
              <Route path="history-purchase" element={<HistoryPurchase />} />
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
