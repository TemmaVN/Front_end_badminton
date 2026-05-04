import React, { createContext, useContext, useState, useEffect } from "react";
import { productApi } from "../api";

const OrderContext = createContext(null);

export const useOrder = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
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
      const respone = await orderApi.getAll(params);
      setOrders(respone.orders);
      alert("Orders fetched successfully");
      setLoading(false);
    } catch (error) {
      alert("Failed to fetch orders");
      setLoading(false);
    }
  };

  const addOrder = async (order) => {
    setLoading(true);
    try {
      const response = await orderApi.addOrder(order);
      setOrders([...orders, response.data]);
      alert("Order added successfully");
      setLoading(false);
    } catch (error) {
      alert("Failed to add order");
      setLoading(false);
    }
  };

  const value = {
    getAll,
    orders,
    loading,
    pagination,
    addOrder,
  };
  return (
    <OrderProvider.Provider value={value}>{children}</OrderProvider.Provider>
  );
};

export default OrderProvider;
