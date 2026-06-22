/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { inventoryApi } from "../api";

const DEFAULT_PAGINATION = {
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
};

const InventoryContext = createContext(null);

const get = (obj, camelKey, pascalKey) => obj?.[camelKey] ?? obj?.[pascalKey];

const normalizePagination = (data, fallbackPage, fallbackPageSize, fallbackCount) => {
  const currentPage = get(data, "page", "Page") ?? fallbackPage;
  const pageSize = get(data, "pageSize", "PageSize") ?? fallbackPageSize;
  const totalCount = get(data, "totalCount", "TotalCount") ?? fallbackCount;
  const totalPages =
    get(data, "totalPages", "TotalPages") ??
    get(data, "totalPageCount", "TotalPageCount") ??
    Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));

  return {
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.max(1, totalPages),
  };
};

const normalizeSerial = (serial, parent = {}) => ({
  serialId: get(serial, "serialId", "SerialId"),
  serialNumber: get(serial, "serialNumber", "SerialNumber") ?? "",
  status: get(serial, "status", "Status") ?? "",
  importDate: get(serial, "importDate", "ImportDate"),
  detailId: get(serial, "detailId", "DetailId") ?? get(parent, "detailId", "DetailId"),
  productId: get(serial, "productId", "ProductId") ?? get(parent, "productId", "ProductId"),
  productName: get(serial, "productName", "ProductName") ?? get(parent, "productName", "ProductName") ?? "",
  productImageUrl:
    get(serial, "productImageUrl", "ProductImageUrl") ??
    get(parent, "productImageUrl", "ProductImageUrl"),
  variantInfo: get(serial, "variantInfo", "VariantInfo") ?? get(parent, "variantInfo", "VariantInfo") ?? "",
});

const normalizeSerialRows = (items) =>
  items.flatMap((item) => {
    if (get(item, "serialNumber", "SerialNumber")) {
      return [normalizeSerial(item)];
    }

    return (get(item, "serials", "Serials") ?? []).map((serial) =>
      normalizeSerial(serial, item),
    );
  });

const normalizeLowStockVariant = (item) => ({
  detailId: get(item, "detailId", "DetailId"),
  productId: get(item, "productId", "ProductId"),
  productName: get(item, "productName", "ProductName") ?? "",
  productImageUrl: get(item, "productImageUrl", "ProductImageUrl"),
  variantInfo: get(item, "variantInfo", "VariantInfo") ?? "",
  price: get(item, "price", "Price"),
  stockQuantity: get(item, "stockQuantity", "StockQuantity") ?? 0,
  threshold: get(item, "threshold", "Threshold"),
});

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return ctx;
};

export const InventoryProvider = ({ children }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [serials, setSerials] = useState([]);
  const [serialPagination, setSerialPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(false);

  const fetchLowStock = async (threshold = 5) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getLowStock(threshold);
      const items = res.data?.items ?? res.data?.Items ?? [];
      setLowStockItems(items.map(normalizeLowStockVariant));
    } catch (err) {
      console.error("fetchLowStock failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSerialsByStatus = async (status, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getSerialsByStatus(status, page, pageSize);
      const items = res.data?.items ?? res.data?.Items ?? [];
      const rows = normalizeSerialRows(items);

      setSerials(rows);
      setSerialPagination(normalizePagination(res.data, page, pageSize, rows.length));
    } catch (err) {
      console.error("fetchSerialsByStatus failed:", err);
      setSerials([]);
      setSerialPagination({ ...DEFAULT_PAGINATION, currentPage: page, pageSize });
    } finally {
      setLoading(false);
    }
  };

  const markDefective = async (serialId) => {
    try {
      await inventoryApi.markDefective(serialId);
      setSerials((prev) =>
        prev.map((s) => (s.serialId === serialId ? { ...s, status: "Defective" } : s)),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message ?? err.message,
      };
    }
  };

  const markInStock = async (serialId) => {
    try {
      await inventoryApi.markInStock(serialId);
      setSerials((prev) =>
        prev.map((s) => (s.serialId === serialId ? { ...s, status: "InStock" } : s)),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message ?? err.message,
      };
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        lowStockItems,
        serials,
        serialPagination,
        loading,
        fetchLowStock,
        fetchSerialsByStatus,
        markDefective,
        markInStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;
