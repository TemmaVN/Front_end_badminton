import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoryApi } from '../api';

const CategoryContext = createContext(null);

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory phải được đặt trong CategoryProvider');
    }
    return context;
};

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Hàm lấy tất cả danh mục (GetAll)
    const refreshCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryApi.getAll();
            // Backend trả về: { data: [ {categoryId, categoryName, slug}, ... ], totalCount: x }
            setCategories(response.data.data);
        } catch (error) {
            console.error("Lỗi fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    // Tự động load danh mục khi ứng dụng khởi chạy
    useEffect(() => {
        refreshCategories();
    }, []);

    // 2. Hàm thêm danh mục (Khớp với [FromBody] string của C#)
    const addCategory = async (name) => {
        try {
            await categoryApi.create(name);
            await refreshCategories(); // Tải lại danh sách sau khi thêm
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.Message || "Lỗi khi thêm" };
        }
    };

    // 3. Hàm xóa danh mục
    const deleteCategory = async (id) => {
        try {
            await categoryApi.delete(id);
            setCategories(categories.filter(c => c.categoryId !== id));
            return { success: true };
        } catch (error) {
            alert(error.response?.data?.Message || "Không thể xóa danh mục này");
            return { success: false };
        }
    };

    const value = {
        categories,
        loading,
        refreshCategories,
        addCategory,
        deleteCategory
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};