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

    useEffect(() => {
        // Fetch products on mount
        const fetchProducts = async () => {
            try {
                const response = await userApi.getProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

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

    const value = {
        getAll,
        search,
        products,
        loading,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export default ProductContext;