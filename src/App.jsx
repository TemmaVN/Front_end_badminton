import PageHeader from "./layouts/PageHeader";
import MainHeader from "./layouts/MainHeader";
import { useMediaQuery } from "./mystate/useMediaQuery";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Advertisement from "./components/Advertisement";
import Contract from "./layouts/Contract";
import Sales from "./layouts/Sales";
import Product from "./layouts/Product";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import UserInfo from "./layouts/UserInfo";
import { UserProvider } from "./contexts/UserContext";
import Admin from "./layouts/Admin";
import { ProductProvider } from "./contexts/ProductContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import Dashboard from "./components/admin/Dashboard";
import Catalog from "./components/admin/Catalog";
import ProductList from "./components/admin/ProductList";
import Categories from "./components/admin/Categories";
import Brand from "./components/admin/Brand";
import SalesOverview from "./components/admin/SalesOverview";
import OrderList from "./components/admin/OrderList";
import HomePage from "./layouts/HomePage";
import ProductDetail from "./layouts/ProductDetail";
import Footer from "./layouts/Footer";
import { CartProvider } from "./contexts/CartContext";
import CartPage from "./layouts/CartPage";
import UserList from "./components/admin/UserList";
import Payment from "./components/admin/Payment";
import pic from '../public/vl.jpeg';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return children;
};

function AppRoutes() {
  const { isAdmin } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage/>
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

      {/* Product and Category Routes */}
      <Route
        path="/p/:productSlug"
        element={
          <PublicRoute>
            <ProductDetail />
          </PublicRoute>
        }
      />
      <Route
        path="/:categorySlug"
        element={
          <PublicRoute>
            <Product />
          </PublicRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PublicRoute>
              <CartPage/>
          </PublicRoute>
        }
      />
      {/* User Routes */}
      <Route
        path="user-info"
        element={
          <ProtectedRoute>
              <UserInfo />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="catalog" element={<Catalog />} />
        <Route path="product" element={<ProductList />} />
        <Route path="categories" element={<Categories />} />
        <Route path="brands" element={<Brand />} />
        
        <Route path="sales-overview" element={<SalesOverview />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="users-list" element={<UserList/>}/>
        <Route path="payment" element={<Payment />} />
      </Route>

      <Route
        path="*"
        element={
          isAdmin() ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  const isHideMainHeader = useMediaQuery("(min-width: 1250px)") && !isAdmin();
  const linkAdvertisement = [
    "https://static.fbshop.vn/wp-content/uploads/2025/12/mua-do.png",
    "https://static.fbshop.vn/wp-content/uploads/2025/12/he-thong-cau-long.png",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-4-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-6-min.webp",
    "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg",
    "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg",
  ];
  return (
    <BrowserRouter>
      <UserProvider>
        <CategoryProvider>
          <CartProvider>
          <div className="bg-white h-auto w-full">
          <PageHeader></PageHeader>
          <MainHeader></MainHeader>
            <ProductProvider>
              <AppRoutes />
            </ProductProvider>
          {/* Nhúng Footer vào cuối ứng dụng */}
          <Footer />
        </div>
        </CartProvider>
      </CategoryProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
