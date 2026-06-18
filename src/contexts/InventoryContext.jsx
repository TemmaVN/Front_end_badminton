/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { inventoryApi } from "../api";

const InventoryContext = createContext(null);

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx)
    throw new Error("useInventory must be used within an InventoryProvider");
  return ctx;
};

export const InventoryProvider = ({ children }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [serials, setSerials] = useState([]);
  const [serialPagination, setSerialPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPageCount: 1,
  });
  const [loading, setLoading] = useState(false);

  // ── Low-stock variants ────────────────────────────────────────────────
  const fetchLowStock = async (threshold = 5) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getLowStock(threshold);
      setLowStockItems(res.data.items ?? []);
    } catch (err) {
      console.error("fetchLowStock failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Serials by status ─────────────────────────────────────────────────
  const fetchSerialsByStatus = async (status, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await inventoryApi.getSerialsByStatus(status, page, pageSize);
      const items = res.data?.items ?? res.data?.Items ?? [];
      const rows = items.flatMap((item) => {
        if (item.serialNumber ?? item.SerialNumber) {
          return [item];
        }

        return (item.serials ?? item.Serials ?? []).map((serial) => ({
          ...serial,
          detailId: item.detailId ?? item.DetailId,
          productId: item.productId ?? item.ProductId,
          productName: item.productName ?? item.ProductName,
          productImageUrl: item.productImageUrl ?? item.ProductImageUrl,
          variantInfo: item.variantInfo ?? item.VariantInfo,
        }));
      });

      setSerials(rows);
      setSerialPagination({
        page: res.data?.page ?? res.data?.Page ?? page,
        pageSize: res.data?.pageSize ?? res.data?.PageSize ?? pageSize,
        totalCount: res.data?.totalCount ?? res.data?.TotalCount ?? rows.length,
        totalPageCount: res.data?.totalPageCount ?? res.data?.TotalPageCount ?? 1,
      });
    } catch (err) {
      console.error("fetchSerialsByStatus failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Mark serial as defective ──────────────────────────────────────────
  const markDefective = async (serialId) => {
    try {
      await inventoryApi.markDefective(serialId);
      setSerials((prev) =>
        prev.map((s) =>
          s.serialId === serialId ? { ...s, status: "Defective" } : s,
        ),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message ?? err.message,
      };
    }
  };

  // ── Mark serial as in stock ───────────────────────────────────────────
  const markInStock = async (serialId) => {
    try {
      await inventoryApi.markInStock(serialId);
      setSerials((prev) =>
        prev.map((s) =>
          s.serialId === serialId ? { ...s, status: "InStock" } : s,
        ),
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
