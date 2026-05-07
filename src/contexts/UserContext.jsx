import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi} from '../api';

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

    const fetchUser = async () => {
        try {
            const response = await userApi.get_info();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.log(error);
        }
    };



    const changePassword = async ({oldPassword, newPassword}) => {
        try {
            const response = await userApi.changePassword({ oldPassword, newPassword });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Change password failed';
            return { success: false, message };
        }
    };

    const validateProfileData = ({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress }) => {
        if (!fullName?.trim()) return 'Họ tên không được để trống';
        if (!dateOfBirth) return 'Ngày sinh không được để trống';
        if (!phoneNumber?.trim()) return 'Số điện thoại không được để trống';
        if (!city) return 'Tỉnh/Thành phố không được để trống';
        if (!district) return 'Quận/Huyện không được để trống';
        if (!detailedAddress?.trim()) return 'Địa chỉ chi tiết không được để trống';
        return null;
    };

    const UpdateProfile = async ({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress }) => {
        const validationError = validateProfileData({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress });
        if (validationError) {
            return { success: false, message: validationError };
        }

        try {
            await userApi.UpdateProfile({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Cập nhật thông tin thất bại';
            return { success: false, message };
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await userApi.get_info();
            return { success: true, user: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Get user info failed';
            return { success: false, message };
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await userApi.getAll();
            return { success: true, users: response.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Get all users failed';
            return { success: false, message };
        }
    };

    const value = {
        user,
        UpdateProfile,
        changePassword,
        getUserInfo,
        loading,
        fetchUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;