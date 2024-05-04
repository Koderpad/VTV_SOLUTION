import { ProductGrid } from "./components/organisms/ProductGrid";
import { ProductDetailTemplate } from "./components/templates/common/ProductDetailTemplate";
import { SearchResultsTemplate } from "./components/templates/common/SearchResultsTemplate";
import { Home } from "./pages/common/Home";
import LoginPage from "./pages/common/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductDetailPage } from "./pages/common/ProductDetailPage";
import { CartPage } from "./pages/common/Cart";
import { orderContainer } from "./features/common/order/components/OrderContainer";
import { Checkout } from "./pages/common/Checkout";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/test" element={<ProductDetailTemplate />} />

        {/* private routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
