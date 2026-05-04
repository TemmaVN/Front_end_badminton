import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { orderApi } from '../../api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filter, setFilter] = useState({
    statusId: 0,           // 0 = tất cả
    orderId: "",           // tìm theo mã đơn
    keyword: "",           // tên khách / số điện thoại
    fromDate: "",          // từ ngày
    toDate: "",            // đến ngày
  });

  // ── Status config ──────────────────────────────────────────
  const statusConfig = {
    "Chờ xác nhận":  { color: "bg-yellow-100 text-yellow-700", icon: <Clock size={16} /> },
    "Đã xác nhận":   { color: "bg-blue-100 text-blue-700",   icon: <CheckCircle size={16} /> },
    "Đang xử lý":    { color: "bg-purple-100 text-purple-700", icon: <Package size={16} /> },
    "Đang giao hàng":{ color: "bg-orange-100 text-orange-700", icon: <Truck size={16} /> },
    "Đã hủy":        { color: "bg-red-100 text-red-700",     icon: <XCircle size={16} /> },
    "Hoàn tất":      { color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
  };

  const STATUS_OPTIONS = [
    { label: "Tất cả",         value: 0 },
    { label: "Chờ xác nhận",   value: 1 },
    { label: "Đã xác nhận",    value: 2 },
    { label: "Đang xử lý",     value: 3 },
    { label: "Đang giao hàng", value: 4 },
    { label: "Hoàn tất",       value: 5 },
    { label: "Đã hủy",         value: 6 },
  ];

  // ── Fetch từ API ────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = filter.statusId === 0
        ? await orderApi.getAllOrders(page, 10)
        : await orderApi.getOrdersByStatus(filter.statusId, page, 10);

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Client-side filter (orderId, keyword, date) ─────────────
  const applyClientFilter = () => {
    let result = [...orders];

    // Filter theo mã đơn hàng
    if (filter.orderId.trim() !== "") {
      result = result.filter(o =>
        String(o.orderId).includes(filter.orderId.trim())
      );
    }

    // Filter theo tên / số điện thoại
    if (filter.keyword.trim() !== "") {
      const kw = filter.keyword.trim().toLowerCase();
      result = result.filter(o =>
        o.receiverName?.toLowerCase().includes(kw) ||
        o.phoneNumber?.includes(kw)
      );
    }

    // Filter theo khoảng ngày
    if (filter.fromDate) {
      const from = new Date(filter.fromDate);
      result = result.filter(o => new Date(o.orderDate) >= from);
    }
    if (filter.toDate) {
      const to = new Date(filter.toDate);
      to.setHours(23, 59, 59, 999); // lấy hết ngày toDate
      result = result.filter(o => new Date(o.orderDate) <= to);
    }

    setFilteredOrders(result);
  };

  // Reset về trang 1 khi đổi status
  const handleStatusChange = (statusId) => {
    setFilter(prev => ({ ...prev, statusId }));
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  const handleResetFilter = () => {
    setFilter({ statusId: 0, orderId: "", keyword: "", fromDate: "", toDate: "" });
    setPage(1);
  };

  useEffect(() => { fetchOrders(); }, [page, filter.statusId]);
  useEffect(() => { applyClientFilter(); }, [orders, filter.orderId, filter.keyword, filter.fromDate, filter.toDate]);

  // ── UI ──────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      {/* ── Filter bar ── */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-3 items-end">

        {/* Trạng thái */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Trạng thái</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filter.statusId}
            onChange={e => handleStatusChange(Number(e.target.value))}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Mã đơn hàng */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Mã đơn hàng</label>
          <input
            type="text"
            placeholder="VD: 1023"
            className="border rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filter.orderId}
            onChange={e => handleFilterChange("orderId", e.target.value)}
          />
        </div>

        {/* Tên / SĐT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Tên / Số điện thoại</label>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filter.keyword}
            onChange={e => handleFilterChange("keyword", e.target.value)}
          />
        </div>

        {/* Từ ngày */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Từ ngày</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filter.fromDate}
            onChange={e => handleFilterChange("fromDate", e.target.value)}
          />
        </div>

        {/* Đến ngày */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Đến ngày</label>
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filter.toDate}
            onChange={e => handleFilterChange("toDate", e.target.value)}
          />
        </div>

        {/* Reset */}
        <button
          onClick={handleResetFilter}
          className="ml-auto px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 transition"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* ── Bảng đơn hàng ── */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Mã đơn</th>
                  <th className="px-4 py-3 text-left">Khách hàng</th>
                  <th className="px-4 py-3 text-left">Số điện thoại</th>
                  <th className="px-4 py-3 text-left">Ngày đặt</th>
                  <th className="px-4 py-3 text-right">Tổng tiền</th>
                  <th className="px-4 py-3 text-center">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const statusName = order.orderStatus?.statusName;
                    const cfg = statusConfig[statusName] ?? { color: "bg-gray-100 text-gray-600", icon: null };
                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium">#{order.orderId}</td>
                        <td className="px-4 py-3">{order.receiverName}</td>
                        <td className="px-4 py-3">{order.phoneNumber}</td>
                        <td className="px-4 py-3">
                          {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {order.totalAmount?.toLocaleString("vi-VN")}₫
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            {cfg.icon} {statusName}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {/* Thêm nút chi tiết / cập nhật tại đây */}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Phân trang ── */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
            >
              ← Trước
            </button>
            <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;