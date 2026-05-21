import React, { useState, useEffect } from 'react';
import {
  Search, Users, Phone, Mail, MapPin, Calendar,
  Eye, X, User, Home, ShoppingBag, Shield, AlertCircle,
} from 'lucide-react';
import { userApi } from '../../api';

// ─── Helpers ─────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'from-orange-400 to-orange-600',
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
];

const avatarColor = (name) => {
  if (!name) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
};

const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  } catch {
    return '—';
  }
};

const profileComplete = (c) => !!(c.phoneNumber && c.city && c.detailedAddress);

// ─── Info Row (used in detail panel) ─────────────────────────────────
function InfoRow({ icon: IconComp, label, value, mono = false }) {
  const Icon = IconComp;
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
        <p className={`text-sm text-slate-800 dark:text-white mt-0.5 wrap-break-word ${mono ? 'font-mono' : 'font-medium'}`}>
          {value || <span className="text-slate-400 font-normal italic">Chưa cập nhật</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Detail Side Panel ────────────────────────────────────────────────
function CustomerDetailPanel({ customer, onClose }) {
  if (!customer) return null;
  const complete = profileComplete(customer);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Chi tiết khách hàng</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-linear-to-br ${avatarColor(customer.fullName)}
              flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0`}
            >
              {initials(customer.fullName)}
            </div>
            <div className="min-w-0">
              <h4 className="text-xl font-black text-slate-800 dark:text-white truncate">
                {customer.fullName || '—'}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{customer.email}</p>
              <div className="mt-1.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold
                  ${complete
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}
                >
                  {complete ? 'Đầy đủ thông tin' : 'Thiếu thông tin'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Contact info */}
          <section>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Thông tin liên hệ
            </p>
            <div className="space-y-3">
              <InfoRow icon={Mail}     label="Email"       value={customer.email} />
              <InfoRow icon={Phone}    label="Số điện thoại" value={customer.phoneNumber} mono />
              <InfoRow icon={Calendar} label="Ngày sinh"   value={fmtDate(customer.dateOfBirth)} />
            </div>
          </section>

          {/* Address */}
          <section>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Địa chỉ
            </p>
            <div className="space-y-3">
              <InfoRow icon={MapPin} label="Tỉnh / Thành phố" value={customer.city} />
              <InfoRow icon={MapPin} label="Quận / Huyện"     value={customer.district} />
              <InfoRow icon={Home}   label="Địa chỉ chi tiết" value={customer.detailedAddress} />
            </div>
          </section>

          {/* Missing info warning */}
          {!complete && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-700/30">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Khách hàng chưa cập nhật đầy đủ thông tin cá nhân.
              </p>
            </div>
          )}

          {/* Quick actions */}
          <section>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Thao tác nhanh
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-semibold">Đơn hàng</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-semibold">Bảo hành</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const PAGE_SIZE = 12;

const UserList = () => {
  const [customers, setCustomers]   = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [error,     setError]       = useState('');
  const [searchVal, setSearchVal]   = useState('');
  const [keyword,   setKeyword]     = useState('');
  const [selected,  setSelected]    = useState(null);
  const [page,      setPage]        = useState(1);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = keyword
          ? await userApi.search(keyword)
          : await userApi.getAll(1, 1000);
        if (!cancelled) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data?.data ?? [];
          setCustomers(list);
          setPage(1);
        }
      } catch {
        if (!cancelled) setError('Không thể tải danh sách khách hàng. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [keyword]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchVal.trim());
  };

  // Derived
  const total       = customers.length;
  const withPhone   = customers.filter((c) => c.phoneNumber).length;
  const withAddress = customers.filter((c) => c.city).length;
  const complete    = customers.filter(profileComplete).length;
  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginated   = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = [
    { label: "Tổng khách hàng",   value: total,           color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20",      icon: Users },
    { label: "Có số điện thoại",  value: withPhone,       color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20",icon: Phone },
    { label: "Có địa chỉ",        value: withAddress,     color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-900/20",  icon: MapPin },
    { label: "Đầy đủ thông tin",  value: complete,        color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/20",  icon: User },
  ];

  // Pagination page numbers (show up to 5 pages around current)
  const pageNums = (() => {
    const half = 2;
    let start = Math.max(1, page - half);
    let end   = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Quản lý khách hàng</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {loading ? 'Đang tải...' : `${total} khách hàng trong hệ thống`}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5
            border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-black ${s.color}`}>
              {loading ? <span className="text-slate-300 dark:text-slate-700">—</span> : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, số điện thoại..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border
                border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400
                focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-default text-white rounded-xl text-sm font-semibold
              hover:bg-orange-500 transition-colors shadow shadow-orange-default/20 shrink-0"
            >
              Tìm kiếm
            </button>
            {keyword && (
              <button
                type="button"
                onClick={() => { setSearchVal(''); setKeyword(''); }}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50
                dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                Xóa lọc
              </button>
            )}
          </form>
          {keyword && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Kết quả cho: <span className="font-semibold text-orange-500">"{keyword}"</span> — {total} khách hàng
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-orange-default border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-400">Đang tải danh sách...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={() => setKeyword(keyword)}
              className="text-sm text-blue-500 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">Không tìm thấy khách hàng</p>
            {keyword && (
              <p className="text-sm text-slate-400">Thử tìm kiếm với từ khóa khác</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/60">
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Khách hàng
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">
                    Số điện thoại
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden lg:table-cell">
                    Địa chỉ
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">
                    Ngày sinh
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Hồ sơ
                  </th>
                  <th className="text-center px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((customer, i) => {
                  const uid = customer.userId ?? customer.id ?? i;
                  const isComplete = profileComplete(customer);
                  return (
                    <tr
                      key={uid}
                      onClick={() => setSelected(customer)}
                      className="border-b border-slate-100 dark:border-slate-800/80
                      hover:bg-orange-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      {/* Name + Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-linear-to-br ${avatarColor(customer.fullName)}
                            flex items-center justify-center text-white text-sm font-black shrink-0
                            shadow-sm group-hover:scale-105 transition-transform duration-200`}
                          >
                            {initials(customer.fullName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 dark:text-white truncate max-w-40">
                              {customer.fullName || <span className="italic text-slate-400">Chưa có tên</span>}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-40">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {customer.phoneNumber ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">
                              {customer.phoneNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {customer.city ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-400 truncate max-w-37.5">
                              {[customer.district, customer.city].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Chưa cập nhật</span>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                          {fmtDate(customer.dateOfBirth)}
                        </span>
                      </td>

                      {/* Profile completeness */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                          ${isComplete
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {isComplete ? 'Đầy đủ' : 'Thiếu'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(customer); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400
                          hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400
                          transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && total > PAGE_SIZE && (
          <div className="px-5 py-4 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hiển thị{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
              </span>{' '}
              / {total} khách hàng
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:pointer-events-none
                hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                ←
              </button>
              {pageNums.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors
                  ${p === page
                    ? 'bg-orange-default text-white shadow shadow-orange-default/25'
                    : 'text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300
                border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:pointer-events-none
                hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <CustomerDetailPanel customer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default UserList;
