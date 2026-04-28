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

export const OrderProvider = ({ children }) => {

    return (
        <OrderProvider.Provider value={value}>
            {children}
        </OrderProvider.Provider>
    );
}

export default OrderProvider;