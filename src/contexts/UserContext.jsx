import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi} from '../api';
import { a } from 'framer-motion/client';

const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const changePassword = async ({oldPassword, newPassword}) => {
        try {
            const response = await userApi.changePassword({ oldPassword, newPassword });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Change password failed';
            return { success: false, message };
        }
    };

    const value = {
        user,
        changePassword,
        loading,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;