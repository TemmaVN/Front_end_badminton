import PageHeader from "./layouts/PageHeader";
import MainHeader from "./layouts/MainHeader";
import { useMediaQuery } from "./mystate/useMediaQuery";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Advertisement from "./components/Advertisement";
import Contract from "./layouts/Contract";
import Sales from "./layouts/Sales";
import ProductFrame_Minh from "./components/ProductFrame_Minh";
import racket from "./assets/victor-auraspeed-lyc-2025-01a-150x150.webp";
function App() {
  const isHideMainHeader = useMediaQuery("(min-width: 1250px)");
  return (
    <BrowserRouter>
      <div className="bg-white h-auto w-full">
        <PageHeader />
        {isHideMainHeader && <MainHeader></MainHeader>}
        <Routes>
          <Route path="/" element={<Advertisement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
        {/* Lấy dữ liệu từ BE đưa vào */}
        <ProductFrame_Minh
          image={racket}
          productName={
            "Vợt Cầu Lông Victor Auraspeed LYC 2025 (Liu Yu Chen) Limited"
          }
          basePrice={"100000"}
          sellingPrice={"90000"}
          isBestSeller={true}
          discountPercent="20%"
        ></ProductFrame_Minh>
      </div>
    </BrowserRouter>
  );
}

export default App;
