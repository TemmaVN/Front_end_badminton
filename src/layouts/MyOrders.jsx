import React, { useState, useEffect, useCallback } from "react";
import { orderApi } from "../api";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Chờ xác nhận": {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    icon: "⏳",
  },
  "Đã xác nhận": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    icon: "✅",
  },
  "Đang xử lý": {
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-400",
    icon: "📦",
  },
  "Đang đan lưới": {
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    dot: "bg-fuchsia-400",
    icon: "🏸",
  },
  "Đang giao hàng": {
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-400",
    icon: "🚚",
  },
  "Đã giao hàng": {
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    dot: "bg-teal-400",
    icon: "📬",
  },
  "Hoàn tất": {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: "🎉",
  },
  "Đã hủy": {
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: "✖",
  },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || {
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    dot: "bg-gray-400",
    icon: "•",
  };

const CANCELLABLE = ["Chờ xác nhận", "Đã xác nhận"];

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.icon} {status}
    </span>
  );
};

// ─── ORDER DETAIL PANEL ───────────────────────────────────────────────────────
const OrderDetailPanel = ({ order, onClose, onCancel, cancelling }) => {
  const cfg = getStatusConfig(order.status);
  const canCancel = CANCELLABLE.includes(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`flex items-start justify-between p-5 border-b border-gray-100 ${cfg.bg}`}>
          <div>
            <p className="text-xs text-gray-400 font-mono mb-1">#{order.orderId}</p>
            <h2 className="text-lg font-bold text-gray-800">Chi tiết đơn hàng</h2>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.orderDate)}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 text-gray-500 hover:bg-white hover:text-gray-800 transition-colors text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Receiver info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoBlock label="Người nhận" value={order.receiverName} icon="👤" />
            <InfoBlock label="Điện thoại" value={order.phoneNumber} icon="📞" />
            <InfoBlock
              label="Địa chỉ giao hàng"
              value={order.shippingAddress}
              icon="📍"
              className="sm:col-span-2"
            />
            {order.note && (
              <InfoBlock
                label="Ghi chú"
                value={order.note}
                icon="📝"
                className="sm:col-span-2"
              />
            )}
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
              Sản phẩm
            </h3>
            <div className="space-y-2">
              {order.orderDetails.map((od) => (
                <div
                  key={od.orderDetailId}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xl shrink-0">
                    {od.isStringingService ? "🏸" : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {od.productName || "Sản phẩm"}
                    </p>
                    {od.isStringingService && (
                      <p className="text-xs text-fuchsia-600 mt-0.5">
                        Dịch vụ đan lưới · {od.stringBrand} · {od.tensionKg} kg
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      SL: {od.quantity} × {formatCurrency(od.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 shrink-0">
                    {formatCurrency(od.quantity * od.unitPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Thanh toán
            </h3>
            <SummaryRow
              label="Phương thức"
              value={order.paymentMethod}
            />
            <SummaryRow
              label="Phí vận chuyển"
              value={formatCurrency(order.shippingFee)}
            />
            <div className="border-t border-gray-200 pt-2 mt-2">
              <SummaryRow
                label="Tổng cộng"
                value={formatCurrency(order.totalAmount)}
                bold
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        {canCancel && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => onCancel(order.orderId)}
              disabled={cancelling}
              className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold text-sm hover:bg-red-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value, icon, className = "" }) => (
  <div className={`bg-gray-50 rounded-xl p-3 ${className}`}>
    <p className="text-xs text-gray-400 mb-1">
      {icon} {label}
    </p>
    <p className="text-sm text-gray-800 font-medium">{value || "—"}</p>
  </div>
);

const SummaryRow = ({ label, value, bold = false }) => (
  <div className="flex justify-between items-center">
    <span className={`text-sm ${bold ? "font-bold text-gray-800" : "text-gray-500"}`}>
      {label}
    </span>
    <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-700"}`}>
      {value}
    </span>
  </div>
);

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
const OrderCard = ({ order, onClick }) => {
  const cfg = getStatusConfig(order.status);
  const itemCount = order.orderDetails?.length || 0;
  const firstProduct = order.orderDetails?.[0]?.productName || "Sản phẩm";

  return (
    <button
      onClick={() => onClick(order)}
      className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 active:scale-[0.99] transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-mono">#{order.orderId}</p>
          <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
            {firstProduct}
            {itemCount > 1 && (
              <span className="text-gray-400 font-normal"> +{itemCount - 1} sản phẩm</span>
            )}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>🕐</span>
          <span>{formatDate(order.orderDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(order.totalAmount)}
          </span>
          <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-lg">›</span>
        </div>
      </div>
    </button>
  );
};

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
const FILTER_TABS = [
  { label: "Tất cả", value: "all" },
  { label: "⏳ Chờ xác nhận", value: "Chờ xác nhận" },
  { label: "✅ Đã xác nhận", value: "Đã xác nhận" },
  { label: "🏸 Đang đan lưới", value: "Đang đan lưới" },
  { label: "🚚 Đang giao", value: "Đang giao hàng" },
  { label: "🎉 Hoàn tất", value: "Hoàn tất" },
  { label: "✖ Đã hủy", value: "Đã hủy" },
];

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="space-y-1.5">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-40 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-28 bg-gray-100 rounded-full" />
    </div>
    <div className="flex justify-between">
      <div className="h-3 w-32 bg-gray-100 rounded" />
      <div className="h-5 w-24 bg-gray-100 rounded" />
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getMyOrders();
      // API GET /api/Order/my-orders returns array directly
      const data = response.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không thể tải đơn hàng. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId) => {
    setCancelling(true);
    try {
      await orderApi.cancelMyOrder(orderId);
      setCancelSuccess("Đơn hàng đã được hủy thành công.");
      setSelectedOrder(null);
      await fetchOrders();
      setTimeout(() => setCancelSuccess(null), 3000);
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể hủy đơn hàng.");
    } finally {
      setCancelling(false);
    }
  };

  // ── Filter + search ──
  const filtered = orders.filter((o) => {
    const matchStatus = activeFilter === "all" || o.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      String(o.orderId).includes(q) ||
      o.receiverName?.toLowerCase().includes(q) ||
      o.orderDetails?.some((d) => d.productName?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  // ── Sort newest first ──
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  return (
    <div className="w-full h-full bg-gray-50/70">
      {/* ── Inline styles for animations ── */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.28s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease both; }
      `}</style>

      <div className="max-w-full mx-auto px-4 py-8">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Đang tải..." : `${orders.length} đơn hàng`}
          </p>
        </div>

        {/* ── Success toast ── */}
        {cancelSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl animate-fade-in">
            <span>✅</span> {cancelSuccess}
          </div>
        )}

        {/* ── Search ── */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo mã, tên sản phẩm, người nhận..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === tab.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition"
            >
              Thử lại
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-800 font-semibold">Không có đơn hàng</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || activeFilter !== "all"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Bạn chưa đặt đơn hàng nào"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {sorted.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onClick={setSelectedOrder}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancel}
          cancelling={cancelling}
        />
      )}
    </div>
  );
};

export default MyOrders;