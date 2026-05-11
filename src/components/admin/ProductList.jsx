import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save, Loader2, RotateCcw, AlertCircle, Eye } from 'lucide-react';
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext";
import { brandApi } from "../../api";
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const navigate = useNavigate();
    const {
        products,
        loading,
        error,
        pagination,
        searchProductsAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        clearError,
    } = useProduct();

    const { categories } = useCategory();
    const [brands, setBrands] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        brandId: '',
        page: 1,
        pagesize: 10,
    });

    const defaultForm = {
        productName: '',
        brandId: '',
        categoryId: '',
        basePrice: '',
        discountPrice: '',
        mainImageUrl: '',
        description: '',
    };
    const [formData, setFormData] = useState(defaultForm);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await brandApi.getAll();
                setBrands(res.data?.data ?? res.data ?? []);
            } catch { }
        };
        fetchBrands();
    }, []);

    useEffect(() => {
        searchProductsAdmin(filters);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const resetFilters = () =>
        setFilters({ keyword: '', categoryId: '', brandId: '', page: 1, pagesize: 10 });

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    // ── Modal open/close ─────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditingProduct(null);
        setFormData(defaultForm);
        clearError();
        setIsModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        // Look up brandId/categoryId by name since admin response only has names
        const brand = brands.find((b) => b.brandName === product.brandName);
        const category = categories.find((c) => c.categoryName === product.categoryName);
        setFormData({
            productName: product.productName ?? '',
            brandId: brand?.brandId ?? product.brandId ?? '',
            categoryId: category?.categoryId ?? product.categoryId ?? '',
            basePrice: product.basePrice ?? '',
            discountPrice: product.discountPrice ?? '',
            mainImageUrl: product.mainImageUrl ?? '',
            description: product.description ?? '',
        });
        clearError();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.productName.trim()) return;
        if (!formData.categoryId || !formData.brandId) {
            alert('Vui lòng chọn danh mục và thương hiệu!');
            return;
        }
        if (!formData.basePrice || Number(formData.basePrice) <= 0) {
            alert('Giá gốc phải lớn hơn 0!');
            return;
        }
        if (formData.discountPrice && Number(formData.discountPrice) >= Number(formData.basePrice)) {
            alert('Giá khuyến mãi phải nhỏ hơn giá gốc!');
            return;
        }

        const payload = {
            productName: formData.productName.trim(),
            brandId: parseInt(formData.brandId),
            categoryId: parseInt(formData.categoryId),
            basePrice: parseFloat(formData.basePrice),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            mainImageUrl: formData.mainImageUrl?.trim() || null,
            description: formData.description?.trim() || null,
        };

        setSubmitLoading(true);
        try {
            const result = editingProduct
                ? await updateProduct(editingProduct.productId, payload)
                : await addProduct(payload);

            if (result !== null) {
                closeModal();
                searchProductsAdmin(filters);
            }
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (e, id, name) => {
        e.stopPropagation();
        if (!window.confirm(`Xóa "${name}"?\n\nThao tác sẽ xóa tất cả biến thể và ảnh liên quan (CASCADE).`)) return;
        const ok = await deleteProduct(id);
        if (!ok) {
            alert('Không thể xóa. Sản phẩm có thể đã tồn tại trong đơn hàng.');
        }
    };

    const stockColor = (qty) => {
        if (qty === null || qty === undefined) return 'text-slate-400';
        if (qty <= 2) return 'text-rose-500 font-bold';
        if (qty <= 5) return 'text-amber-500 font-bold';
        return 'text-emerald-500 font-bold';
    };

    const formatPrice = (price) =>
        price ? price.toLocaleString('vi-VN') + ' ₫' : '—';
    
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* ── Header & Filters ── */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quản lý kho hàng</h3>
                            {pagination?.totalCount > 0 && (
                                <p className="text-xs text-slate-400 mt-0.5">{pagination.totalCount} sản phẩm</p>
                            )}
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-orange-default hover:bg-orange-dark text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
                        >
                            <Plus size={16} /> Thêm sản phẩm
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Tìm tên sản phẩm..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:border-orange-default focus:bg-white rounded-xl text-sm outline-none transition-all"
                            />
                        </div>

                        <select
                            name="brandId"
                            value={filters.brandId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border border-transparent focus:border-orange-default focus:bg-white rounded-xl text-sm outline-none transition-all"
                        >
                            <option value="">Tất cả thương hiệu</option>
                            {brands.map((b) => (
                                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                            ))}
                        </select>

                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border border-transparent focus:border-orange-default focus:bg-white rounded-xl text-sm outline-none transition-all"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>

                        <button
                            onClick={resetFilters}
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-all"
                        >
                            <RotateCcw size={14} /> Làm mới
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto relative" style={{ minHeight: 300 }}>
                    {loading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                            <Loader2 className="animate-spin text-emerald-500" size={28} />
                        </div>
                    )}

                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                                <th className="px-5 py-3 w-72">Sản phẩm</th>
                                <th className="px-4 py-3">Thương hiệu</th>
                                <th className="px-4 py-3">Danh mục</th>
                                <th className="px-4 py-3 text-right">Giá gốc</th>
                                <th className="px-4 py-3 text-right">Giá KM</th>
                                <th className="px-4 py-3 text-center">Biến thể</th>
                                <th className="px-4 py-3 text-center">Tồn kho</th>
                                <th className="px-4 py-3 text-center">Đã bán</th>
                                <th className="px-4 py-3 text-center w-28"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={9} className="py-16 text-center text-slate-400 text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-3xl">🏸</span>
                                            <span>Không tìm thấy sản phẩm nào</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr
                                        key={item.productId}
                                        onClick={() => navigate(`/admin/product/${item.productId}`, { state: { product: item } })}
                                        className="hover:bg-slate-50 cursor-pointer transition-colors group"
                                    >
                                        {/* Sản phẩm */}
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {item.mainImageUrl ? (
                                                    <img
                                                        src={item.mainImageUrl}
                                                        alt={item.productName}
                                                        className="w-11 h-11 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0 border border-slate-200">
                                                        🏸
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[180px]">
                                                        {item.productName}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono truncate max-w-[180px]">
                                                        /{item.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Thương hiệu */}
                                        <td className="px-4 py-3">
                                            {item.brandName ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-orange-50 text-emerald-700 text-xs font-medium border border-orange-default">
                                                    {item.brandName}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Danh mục */}
                                        <td className="px-4 py-3">
                                            {item.categoryName ? (
                                                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                                                    {item.categoryName}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Giá gốc */}
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-slate-600 text-sm">
                                                {formatPrice(item.basePrice)}
                                            </span>
                                        </td>

                                        {/* Giá KM */}
                                        <td className="px-4 py-3 text-right">
                                            {item.discountPrice || item.discountPercent > 0 ? (
                                                <span className="font-semibold text-emerald-600 text-sm">
                                                    {formatPrice(item.discountPrice)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Biến thể */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-slate-700 font-medium">
                                                {item.variantsCount ?? item.variantCount ?? '—'}
                                            </span>
                                        </td>

                                        {/* Tồn kho */}
                                        <td className="px-4 py-3 text-center">
                                            <span className={stockColor(item.totalStock ?? item.stockQuantity)}>
                                                {item.totalStock ?? item.stockQuantity ?? '—'}
                                            </span>
                                        </td>

                                        {/* Đã bán */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-slate-600 font-medium">
                                                {item.soldQuantity ?? item.totalSold ?? 0}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/product/${item.productId}`, { state: { product: item } }); }}
                                                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                                                    title="Xem"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                                                    className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, item.productId, item.productName)}
                                                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* ── Pagination ── */}
                    <div className="px-5 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            {pagination?.totalCount ?? 0} sản phẩm
                            {pagination?.totalPages > 1 && (
                                <> · Trang <span className="font-semibold text-slate-700">{pagination.currentPage}</span>/<span className="font-semibold text-slate-700">{pagination.totalPages}</span></>
                            )}
                        </div>

                        {pagination?.totalPages > 1 && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    disabled={filters.page === 1}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
                                >
                                    Trước
                                </button>

                                {[...Array(pagination.totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    if (pagination.totalPages > 7 && Math.abs(pageNum - filters.page) > 2) return null;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                                                filters.page === pageNum
                                                    ? 'bg-linear-to-r from-orange-default to-orange-dark text-white shadow-lg shadow-orange-default/25'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    disabled={filters.page >= pagination.totalPages}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modal Thêm / Sửa ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                            </h3>
                            <button onClick={closeModal} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                                <X size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">
                            {editingProduct ? 'Cân nhắc trước khi thay đổi thông tin' : 'Điền đầy đủ thông tin sản phẩm'}
                        </p>

                        {error && (
                            <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1.5 text-sm font-medium text-slate-700">Tên sản phẩm</label>
                                <input
                                    required
                                    placeholder="Tên sản phẩm *"
                                    className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-orange-default"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Danh mục</label>
                                    <select
                                        required
                                        className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-orange-default"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    >
                                        <option value="">Chọn danh mục *</option>
                                        {categories.map((cat) => (
                                            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Thương hiệu</label>
                                    <select
                                        required
                                        className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-orange-default"
                                        value={formData.brandId}
                                        onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                    >
                                        <option value="">Chọn thương hiệu *</option>
                                        {brands.map((b) => (
                                            <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Giá gốc</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        placeholder="Giá gốc (VND) *"
                                        className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-orange-default"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Giá khuyến mãi</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Giá khuyến mãi"
                                        className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-orange-default"
                                        value={formData.discountPrice}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Link ảnh chính</label>
                                <input
                                    placeholder="Link ảnh chính"
                                    className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm focus:ring-orange-default"
                                    value={formData.mainImageUrl}
                                    onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Mô tả sản phẩm</label>
                                <textarea
                                    placeholder="Mô tả sản phẩm"
                                    rows={2}
                                    className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm resize-none focus:ring-orange-default"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-orange-default hover:bg-orange-dark text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {editingProduct ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
