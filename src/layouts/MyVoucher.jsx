import { useState, useEffect, useCallback } from "react";
import { voucherApi } from "../api";

const formatCurrency = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const getDaysLeft = (endDate) => {
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── VoucherCard ────────────────────────────────────────────────────────────
const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false);
  const daysLeft = getDaysLeft(voucher.endDate);
  const isExpiringSoon = daysLeft <= 3;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = voucher.voucherCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Top colored band */}
      <div className={`h-1.5 ${voucher.isGlobal ? "bg-blue-400" : "bg-orange-400"}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                voucher.isGlobal
                  ? "bg-blue-50 text-blue-600"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              {voucher.isGlobal ? "🌐 Toàn sàn" : "🎁 Cá nhân"}
            </span>
            {isExpiringSoon && (
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                ⚡ Sắp hết hạn
              </span>
            )}
          </div>
        </div>

        {/* Discount value */}
        <p className="text-2xl font-black text-gray-900 mb-1">
          {voucher.isPercent
            ? `Giảm ${voucher.discountValue}%`
            : `Giảm ${formatCurrency(voucher.discountValue)}`}
        </p>
        {voucher.isPercent && voucher.maxDiscountAmount && (
          <p className="text-xs text-gray-400 mb-2">
            Tối đa {formatCurrency(voucher.maxDiscountAmount)}
          </p>
        )}

        {/* Description */}
        {voucher.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{voucher.description}</p>
        )}

        {/* Min order + expiry */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <span>Đơn tối thiểu {formatCurrency(voucher.minOrderValue)}</span>
          <span className={isExpiringSoon ? "text-red-500 font-semibold" : ""}>
            HSD: {formatDate(voucher.endDate)}
            {isExpiringSoon && ` (còn ${daysLeft} ngày)`}
          </span>
        </div>

        {/* Divider dashed */}
        <div className="border-t border-dashed border-gray-200 mb-4" />

        {/* Copy button */}
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm font-mono font-bold tracking-widest bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 truncate">
            {voucher.voucherCode}
          </code>
          <button
            onClick={handleCopy}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {copied ? "✓ Đã sao chép" : "Sao chép"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton ───────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-1.5 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-24 bg-gray-100 rounded-full" />
      <div className="h-7 w-32 bg-gray-100 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-2/3 bg-gray-100 rounded" />
      <div className="h-10 bg-gray-100 rounded-xl mt-4" />
    </div>
  </div>
);

// ─── Main ────────────────────────────────────────────────────────────────────
const MyVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | global | personal

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await voucherApi.getAvailableVouchers();
      setVouchers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Không thể tải danh sách voucher. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const filtered = vouchers.filter((v) => {
    if (filter === "global")   return v.isGlobal === true;
    if (filter === "personal") return v.isGlobal === false;
    return true;
  });

  return (
    <div className="w-full h-full bg-gray-50/70">
      <div className="max-w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Voucher của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Đang tải..." : `${filtered.length} voucher khả dụng`}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { label: "Tất cả", value: "all" },
            { label: "🌐 Toàn sàn", value: "global" },
            { label: "🎁 Cá nhân", value: "personal" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === tab.value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchVouchers}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition"
            >
              Thử lại
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎟️</p>
            <p className="text-gray-800 font-semibold">Không có voucher nào</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter !== "all"
                ? "Thử chuyển sang tab khác"
                : "Bạn chưa có voucher khả dụng"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((v) => (
              <VoucherCard key={v.voucherId} voucher={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVoucher;
