import PageHeader from "./layouts/PageHeader";
import MainHeader from "./layouts/MainHeader";
import { useMediaQuery } from "./mystate/useMediaQuery";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import { BrowserRouter, Route, Routes, Navigate,useNavigate, useLocation} from "react-router-dom";
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
import { WarrantyProvider } from "./contexts/WarrantyContext";
import CartPage from "./layouts/CartPage";
import UserList from "./components/admin/UserList";
import Payment from "./components/admin/Payment";
import MyOrders from "./layouts/MyOrders";
import AdminProductDetail from "./components/admin/AdminProductDetail";
import WarrantyManagement from "./components/admin/WarrantyManagement";
import Statistics from "./components/admin/Statistics";


const PublicRoute = ({ children }) => {
  return children;
};

function AppRoutes() {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const adminRedirectPaths = ['/', '/login', '/register'];
  
  if (isAdmin() && adminRedirectPaths.includes(location.pathname)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
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
        path="/:categorySlug/*"
        element={
          <PublicRoute>
            <Product />
          </PublicRoute>
        }
      />
      {/* User Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
              <CartPage/>
          </ProtectedRoute>
        }
      />
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

        {/* ✅ Nhóm bằng pathless route */}
        <Route path="product">
          <Route index element={<ProductList />} />
          <Route path=":productId" element={<AdminProductDetail />} />
        </Route>

        <Route path="categories" element={<Categories />} />
        <Route path="brands" element={<Brand />} />
        <Route path="sales-overview" element={<SalesOverview />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="users-list" element={<UserList />} />
        <Route path="payment" element={<Payment />} />
        <Route path="admin-info" element={<UserInfo />} />
        <Route path="warranty" element={<WarrantyManagement />} />
        <Route path="statistics" element={<Statistics />} />
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
  const { isAdmin } = useAuth();
  const isHidePageHeader = !isAdmin();
  const isHideMainHeader = useMediaQuery("(min-width: 1250px)") && !isAdmin();

  return (
    <BrowserRouter>
      <UserProvider>
        <CategoryProvider>
          <CartProvider>
            <WarrantyProvider>
              <div className="bg-white h-auto w-full">
                {isHidePageHeader && <PageHeader />}
                {isHideMainHeader && <MainHeader />}
                <ProductProvider>
                  <AppRoutes />
                </ProductProvider>
                <Footer />
              </div>
            </WarrantyProvider>
          </CartProvider>
        </CategoryProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
