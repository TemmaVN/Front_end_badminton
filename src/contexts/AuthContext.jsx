import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);
            const userData = response.data;
            const token = userData.token;
            if (token) {
                const decodedUser = jwtDecode(token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(decodedUser));
                setUser(decodedUser);
                return { success: true, user: decodedUser };
            }
            else {
                return { success: false, message: 'Login failed' };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register({ email: userData.email, password: userData.password});
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    }

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            return {success: true}
        } catch(error) {
            const message = error.response?.data.message || "Logout failed";
            return { success: false, message};
        }
    };

    const isAdmin = () => {
        if (!user) return false;

        const roleData = user.role || 
                        user.roles || 
                        user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (!roleData) return false;

        if (Array.isArray(roleData)) {
            return roleData.map(r => r.toLowerCase()).includes('admin');
        }

        return roleData.toLowerCase() === 'admin';
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
