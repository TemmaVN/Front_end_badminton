import React, { createContext, useContext, useState, useEffect } from 'react';
import { productApi } from '../api';

const ProductContext = createContext(null);

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1
    });

    const searchProducts = async (filters) => {
        setLoading(true);
        try {
            const response = await productApi.search(filters);
            
            const { items, totalCount, totalPages, page } = response.data;

            setProducts(items);
            setPagination({
                totalCount,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };


    const getAll = async (params) => {
        setLoading(true);
        try {
            const respone = await productApi.getAll(params);
            setProducts(respone.products);
            alert('Products fetched successfully');
            setLoading(false);
        } catch (error) {
            alert('Failed to fetch products');
            setLoading(false);
        }
    }

    const search = async (params) => {
        setLoading(true);
        try {
            const respone = await productApi.search(params);
            setProducts(respone.products);
            alert('Products fetched successfully');
            setLoading(false);
        } catch (error) {
            alert('Failed to fetch products');
            setLoading(false);
        }
    }

    const addProduct = async (product) => {
        setLoading(true);
        try {
            const response = await productApi.addProduct(product);
            setProducts([...products, response.data]);
            alert('Product added successfully');
            setLoading(false);
        } catch (error) {
            alert('Failed to add product');
            setLoading(false);
        }
    }

    const value = {
        getAll,
        search,
        products,
        loading,
        pagination,
        searchProducts,
        addProduct,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductContext;