import React, { useState, useEffect, useCallback } from 'react';
import { Star, Eye, EyeOff, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewApi } from '../../api';

const PAGE_SIZE = 10;

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
      />
    ))}
  </div>
);

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all | visible | hidden
  const [togglingId, setTogglingId] = useState(null);

  const loadReviews = useCallback(async (p = page, f = filter) => {
    setLoading(true);
    try {
      const isVisible = f === 'visible' ? true : f === 'hidden' ? false : undefined;
      const res = await reviewApi.getForAdmin(p, PAGE_SIZE, isVisible);
      const data = res.data;
      setReviews(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadReviews(page, filter);
  }, [page, filter]);

  const handleToggleVisibility = async (review) => {
    setTogglingId(review.reviewId);
    try {
      await reviewApi.setVisibility(review.reviewId, !review.isVisible);
      setReviews(prev => prev.map(r =>
        r.reviewId === review.reviewId ? { ...r, isVisible: !r.isVisible } : r
      ));
    } catch {
      alert('Không thể thay đổi trạng thái hiển thị');
    } finally {
      setTogglingId(null);
    }
  };

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Quản lý đánh giá</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {loading ? 'Đang tải...' : `${totalCount} đánh giá trong hệ thống`}
          </p>
        </div>
        <button
          onClick={() => loadReviews(page, filter)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 w-fit">
        {[
          { key: 'all',     label: 'Tất cả' },
          { key: 'visible', label: 'Hiển thị' },
          { key: 'hidden',  label: 'Ẩn' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => handleFilterChange(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              filter === t.key
                ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Đang tải...
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Star className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Không có đánh giá nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Sản phẩm</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Người dùng</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Đánh giá</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">Nội dung</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Ngày</th>
                    <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Hiển thị</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr
                      key={review.reviewId}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-orange-50/30 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 max-w-44">
                          {review.productImageUrl && (
                            <img
                              src={review.productImageUrl}
                              alt=""
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-700"
                              onError={e => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {review.productName}
                          </span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{review.userName}</span>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <StarRating rating={review.rating} />
                      </td>

                      {/* Comment */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={review.comment}>
                          {review.comment || <span className="italic text-slate-400">Không có nội dung</span>}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(review.reviewDate)}</span>
                      </td>

                      {/* Toggle visibility */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleVisibility(review)}
                          disabled={togglingId === review.reviewId}
                          title={review.isVisible ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            review.isVisible
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {review.isVisible
                            ? <><Eye className="w-3.5 h-3.5" /> Hiện</>
                            : <><EyeOff className="w-3.5 h-3.5" /> Ẩn</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trang <span className="font-semibold">{page}</span> / {totalPages}
                  {' '}· {totalCount} đánh giá
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
