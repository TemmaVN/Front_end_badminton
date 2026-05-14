import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, Loader2, RotateCcw } from "lucide-react";
import { useOrder } from "../../contexts/OrderContext";
import OrderDetail from "./OrderDetail";

const STATUSES = {
  1: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-600" },
  2: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-600" },
  3: { text: "Đang xử lý", color: "bg-indigo-100 text-indigo-600" },
  4: { text: "Đang đan lưới", color: "bg-teal-100 text-teal-600" },
  5: { text: "Đang giao hàng", color: "bg-purple-100 text-purple-600" },
  6: { text: "Đã giao hàng", color: "bg-green-100 text-green-600" },
  7: { text: "Hoàn tất", color: "bg-emerald-100 text-emerald-600" },
  8: { text: "Đã huỷ", color: "bg-red-100 text-red-600" },
};

const OrderList = () => {
  const { orders, loading, pagination: ctxPagination, fetchAllOrders, fetchByStatus, searchOrders } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [filters, setFilters] = useState({ status: "", keyword: "" });
  const fetchOrders = useCallback(() => {
    if (filters.status) {
      fetchByStatus(filters.status, page, PAGE_SIZE);
    } else if (filters.keyword) {
      searchOrders({ keyword: filters.keyword, page, pageSize: PAGE_SIZE });
    } else {
      fetchAllOrders(page, PAGE_SIZE);
    }
  }, [page, filters, fetchAllOrders, fetchByStatus, searchOrders]);

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= ctxPagination.totalPages) {
      setPage(newPage);
    }
  };

  const pageList = []
  for (let i = page-2; i <= page+2; i++) {
    if (i > 0 && i <= ctxPagination.totalPages) {
      pageList.push(i)
    }
  }


  const resetFilters = () => {
    setFilters({ status: "", keyword: "" });
    setPage(1);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="p-1 bg-slate-50 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Quản lý đơn hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Tìm theo tên khách hàng, SĐT..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="py-2.5 px-3 bg-slate-100 border-transparent rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUSES).map(([id, { text }]) => (
                <option key={id} value={id}>
                  {text}
                </option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-300 transition-all"
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Order ID</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4 text-right">Tổng tiền</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4">Ngày tạo</th>
                <th className="p-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => {
                const firstProduct =
                  order.orderDetails?.[0]?.productName || "N/A";
                const totalProducts = order.orderDetails?.length || 0;

                let statusInfo = {
                  text: "Không xác định",
                  color: "bg-gray-200 text-gray-700",
                };
                const rawStatus = order.status;
                if (rawStatus !== undefined && rawStatus !== null) {
                  if (STATUSES[rawStatus]) {
                    statusInfo = STATUSES[rawStatus];
                  } else {
                    const foundEntry = Object.values(STATUSES).find(
                      (s) =>
                        s.text.toLowerCase() ===
                        String(rawStatus).toLowerCase().trim(),
                    );
                    statusInfo = foundEntry || {
                      text: String(rawStatus),
                      color: "bg-gray-200 text-gray-700",
                    };
                  }
                }

                return (
                  <tr
                    key={order.orderId}
                    className="hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 font-mono text-orange-600">
                      #{order.orderId}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {order.receiverName}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {order.phoneNumber}
                      </div>
                    </td>
                    <td className="p-4">
                      <p
                        className="font-medium text-slate-700 truncate max-w-50"
                        title={firstProduct}
                      >
                        {firstProduct}
                      </p>
                      {totalProducts > 1 && (
                        <span className="text-xs text-slate-400">
                          và {totalProducts - 1} sản phẩm khác
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">
                      {order.totalAmount?.toLocaleString()}₫
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Trang <span className="font-semibold">{page}</span> /{" "}
            {ctxPagination.totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            >
              Trước
            </button>
            {pageList.map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors
                ${p === page
                  ? 'bg-orange-default text-white shadow shadow-orange-default/25'
                  : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= (ctxPagination.totalPages || 1)}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={handleCloseDetail}
          onUpdate={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrderList;
