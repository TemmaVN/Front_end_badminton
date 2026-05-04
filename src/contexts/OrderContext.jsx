import React, { createContext, useContext, useState, useEffect } from "react";
import { orderApi } from "../api"; // Sửa từ productApi thành orderApi

const OrderContext = createContext(null);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within a OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const getAll = async (params) => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders(params); // Sửa 'respone' thành 'response'
      setOrders(response.data.orders);
      setPagination({
        totalCount: response.totalCount || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || 1,
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  const getRecentOrders = (orderList, count = 4) => {
    return [...orderList]
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, count);
  };

  const addOrder = async (order) => {
    setLoading(true);
    try {
      const response = await orderApi.addOrder(order);
      setOrders([...orders, response.data]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to add order:", error);
      setLoading(false);
    }
  };

  const value = {
    getAll,
    orders,
    loading,
    pagination,
    getRecentOrders,
    addOrder,
  };

  // ✅ SỬA LỖI CHÍNH: OrderContext.Provider thay vì OrderProvider.Provider
  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;