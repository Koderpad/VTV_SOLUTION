import LoginPage from "./pages/common/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* private routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;