import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const LoginPage = lazy(() => import("./pages/common/Login"));
const Home = lazy(() => import("./pages/common/Home"));
const ProductDetailPage = lazy(
  () => import("./pages/common/ProductDetailPage")
);
const CartPage = lazy(() => import("./pages/common/Cart"));
const Checkout = lazy(() => import("./pages/common/Checkout"));

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
