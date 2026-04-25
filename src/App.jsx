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
import Admin from './layouts/Admin';

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
            {/* Public Routes */}
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Admin />
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
            {/* User Routes */}
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
            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <Admin/>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)')
    const linkAdvertisement = [
      "https://static.fbshop.vn/wp-content/uploads/2025/12/mua-do.png",
      "https://static.fbshop.vn/wp-content/uploads/2025/12/he-thong-cau-long.png",
      "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-4-min.webp",
      "https://static.fbshop.vn/wp-content/uploads/2024/01/Banner-website-6-min.webp",
      "https://static.fbshop.vn/wp-content/uploads/2026/01/anh-banner-website-4000x1425-1-1920x684.jpg"
    ];
  return (
      <BrowserRouter>
        <div className='bg-white h-auto w-full'>
          <PageHeader></PageHeader>
            {isHideMainHeader && <MainHeader></MainHeader>} 
            <AppRoutes />
        </div> 
      </BrowserRouter>
  );
}

export default App;
