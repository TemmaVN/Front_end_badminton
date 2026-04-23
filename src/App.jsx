<<<<<<< HEAD
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
=======
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import {useMediaQuery} from './mystate/useMediaQuery'
import Login from './layouts/Login';
import Register from './layouts/Register';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Advertisement from './components/Advertisement';
import Contract from './layouts/Contract';
import Sales from './layouts/Sales';
import Product from './layouts/Product';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext';
import UserInfo from "./layouts/UserInfo"
import { UserProvider } from './contexts/UserContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Product />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
            <Route
                path="/contract"
                element={
                    <PublicRoute>
                        <Contract />
                    </PublicRoute>
                }
            />
            <Route
                path="/sales"
                element={
                    <PublicRoute>
                        <Sales />
                    </PublicRoute>
                }
            />
            <Route
                path='user-info'
                element={
                    <ProtectedRoute>
                        <UserProvider>
                            <UserInfo/>
                        </UserProvider>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  const linkAdvertisement = [
      "https://static.fbshop.vn/wp-content/uploads/2025/12/mua-do.png",
      "https://static.fbshop.vn/wp-content/uploads/2025/12/he-thong-cau-long.png",
      "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-4-min.webp",
      "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-6-min.webp",
      "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg"
    ];
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='bg-white h-auto w-full'>
          <PageHeader/>
            {isHideMainHeader && <MainHeader></MainHeader>}        
            <AppRoutes />
        </div> 
      </BrowserRouter>
    </AuthProvider>
  )
>>>>>>> master
}

export default App;
