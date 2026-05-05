import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save, Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext";
import { brandApi } from "../../api";

const ProductList = () => {
    const {
        products,
        loading,
        error,
        pagination,
        searchProducts,
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

    // ── filters ──────────────────────────────────────────────────────────────
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        brandId: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        pagesize: 10,
    });

    // ── form ─────────────────────────────────────────────────────────────────
    const defaultForm = {
        productName: '',
        brandId: '',
        categoryId: '',
        basePrice: '',
        discountPrice: '',
        mainImageUrl: '',
        description: '',
        productDetailRequests: [
            { weightClass: '', gripSize: '', balancePoint: '', stiffness: '', maxTension: '', price: '', stockQuantity: 10, serialNumber: '' },
        ],
    };
    const [formData, setFormData] = useState(defaultForm);

    // ── fetch brands 1 lần ───────────────────────────────────────────────────
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await brandApi.getAll();
                setBrands(res.data?.data ?? res.data ?? []);
            } catch {
                // lỗi nhỏ, không cần block UI
            }
        };
        fetchBrands();
    }, []);

    // ── fetch products khi filter thay đổi ───────────────────────────────────
    useEffect(() => {
        // Chuyển categoryId / brandId thành slug nếu BE nhận slug,
        // hoặc giữ nguyên nếu BE nhận id — tuỳ theo searchAsync của bạn
        searchProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // ── filter handlers ──────────────────────────────────────────────────────
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    };

    const resetFilters = () =>
        setFilters({ keyword: '', categoryId: '', brandId: '', minPrice: '', maxPrice: '', page: 1, pagesize: 10 });

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    // ── modal helpers ─────────────────────────────────────────────────────────
    const openCreate = () => {
        setEditingProduct(null);
        setFormData(defaultForm);
        clearError();
        setIsModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productName: product.productName ?? '',
            brandId: product.brandId ?? '',
            categoryId: product.categoryId ?? '',
            basePrice: product.basePrice ?? '',
            discountPrice: product.discountPrice ?? '',
            mainImageUrl: product.mainImageUrl ?? '',
            description: product.description ?? '',
            productDetailRequests: [],   // detail phức tạp → để trống khi sửa nhanh
        });
        clearError();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        clearError();
    };

    // ── detail row helpers ────────────────────────────────────────────────────
    const addDetailRow = () =>
        setFormData((prev) => ({
            ...prev,
            productDetailRequests: [
                ...prev.productDetailRequests,
                { weightClass: '', gripSize: '', price: '', stockQuantity: 10 },
            ],
        }));

    const updateDetailRow = (index, field, value) =>
        setFormData((prev) => {
            const rows = [...prev.productDetailRequests];
            rows[index] = { ...rows[index], [field]: value };
            return { ...prev, productDetailRequests: rows };
        });

    const removeDetailRow = (index) =>
        setFormData((prev) => ({
            ...prev,
            productDetailRequests: prev.productDetailRequests.filter((_, i) => i !== index),
        }));

    // ── submit (thêm / sửa) ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate tối thiểu
        if (!formData.productName.trim()) return;
        if (!formData.basePrice) return;

        // Nếu tạo mới phải có ít nhất 1 detail (backend yêu cầu)
        if (!editingProduct && formData.productDetailRequests.length === 0) {
            alert('Vui lòng thêm ít nhất 1 biến thể sản phẩm!');
            return;
        }

        const payload = {
            productName: formData.productName.trim(),
            brandId: parseInt(formData.brandId) || null,
            categoryId: parseInt(formData.categoryId) || null,
            basePrice: parseFloat(formData.basePrice),
            discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
            mainImageUrl: formData.mainImageUrl || null,
            description: formData.description || null,
            productDetailRequests: formData.productDetailRequests
                .filter((d) => d.price && d.serialNumber)  // serial bắt buộc
                .map((d) => ({
                    weightClass: d.weightClass || null,
                    gripSize: d.gripSize || null,
                    balancePoint: d.balancePoint || null,
                    stiffness: d.stiffness || null,
                    maxTension: d.maxTension ? parseInt(d.maxTension) : null,
                    price: parseFloat(d.price),
                    stockQuantity: parseInt(d.stockQuantity) || 0,
                    serialNumber: d.serialNumber,   // ✅ bắt buộc
                })),
        };

        setSubmitLoading(true);
        try {
            let result;
            if (editingProduct) {
                result = await updateProduct(editingProduct.productId, payload);
            } else {
                console.log(payload);
                result = await addProduct(payload);
            }

            if (result !== null) {
                closeModal();
                searchProducts(filters);   // reload danh sách
            }
            // nếu result === null thì error đã được set trong context → hiển thị ở modal
        } finally {
            setSubmitLoading(false);
        }
    };

    // ── xóa ───────────────────────────────────────────────────────────────────
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xóa "${name}"?\n\nThao tác sẽ xóa tất cả biến thể và ảnh liên quan (CASCADE).`)) return;

        const ok = await deleteProduct(id);
        if (!ok) {
            // error đã set trong context, hiển thị toast hoặc alert
            alert('Không thể xóa. Sản phẩm có thể đã tồn tại trong đơn hàng.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* ── Header & Filters ── */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quản lý kho hàng</h3>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        >
                            <Plus size={18} /> Thêm sản phẩm
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Tên sản phẩm..."
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none"
                            />
                        </div>

                        <select
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>

                        <select
                            name="brandId"
                            value={filters.brandId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none"
                        >
                            <option value="">Tất cả thương hiệu</option>
                            {brands.map((b) => (
                                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                            ))}
                        </select>

                        <input
                            name="minPrice"
                            type="number"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Giá từ..."
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none"
                        />

                        <button
                            onClick={resetFilters}
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 text-slate-700 rounded-xl text-sm transition-all hover:bg-slate-300"
                        >
                            <RotateCcw size={16} /> Làm mới
                        </button>
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto relative min-h-100">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <Loader2 className="animate-spin text-orange-500" size={32} />
                        </div>
                    )}

                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-xs font-semibold text-slate-500 uppercase">
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4">Thương hiệu / Loại</th>
                                <th className="p-4">Giá (VND)</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {item.mainImageUrl ? (
                                                    <img
                                                        src={item.mainImageUrl}
                                                        alt={item.productName}
                                                        className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">🏸</div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                                                        {item.productName}
                                                    </div>
                                                    <div className="text-xs text-slate-400">{item.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="font-medium text-slate-700 dark:text-slate-300">{item.brandName}</div>
                                            <div className="text-slate-500">{item.categoryName}</div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="font-bold text-orange-600">
                                                {(item.sellingPrice ?? item.basePrice)?.toLocaleString('vi-VN')}₫
                                            </div>
                                            {item.discountPercent > 0 && (
                                                <div className="text-xs text-slate-400 line-through">
                                                    {item.basePrice?.toLocaleString('vi-VN')}₫
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.productId, item.productName)}
                                                    className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* ── Pagination ── */}
                    <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            Trang{' '}
                            <span className="font-semibold text-slate-800">{pagination.currentPage}</span>
                            {' '}trên{' '}
                            <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
                            {' '}—{' '}
                            <span className="font-semibold text-slate-800">{pagination.totalCount}</span> sản phẩm
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                            filters.page === pageNum
                                                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
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
                                className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modal Thêm / Sửa ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">
                                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                            </h3>
                            <button onClick={closeModal} className="p-1 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Hiển thị lỗi từ context */}
                        {error && (
                            <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Tên sản phẩm */}
                            <input
                                required
                                placeholder="Tên sản phẩm *"
                                className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                value={formData.productName}
                                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            />

                            {/* Danh mục + Thương hiệu */}
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    required
                                    className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                >
                                    <option value="">Chọn danh mục *</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                <select
                                    required
                                    className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                    value={formData.brandId}
                                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                                >
                                    <option value="">Chọn thương hiệu *</option>
                                    {brands.map((b) => (
                                        <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Giá gốc + Giá KM */}
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    placeholder="Giá gốc (VND) *"
                                    className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Giá khuyến mãi"
                                    className="p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                    value={formData.discountPrice}
                                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                                />
                            </div>

                            {/* Link ảnh */}
                            <input
                                placeholder="Link ảnh chính"
                                className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm"
                                value={formData.mainImageUrl}
                                onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                            />

                            {/* Mô tả */}
                            <textarea
                                placeholder="Mô tả sản phẩm"
                                rows={2}
                                className="w-full p-2.5 bg-slate-100 rounded-xl outline-none text-sm resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            {/* Biến thể — chỉ bắt buộc khi tạo mới */}
                            {!editingProduct && (
                                <div className="border border-slate-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-slate-700">Biến thể sản phẩm *</span>
                                        <button
                                            type="button"
                                            onClick={addDetailRow}
                                            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                        >
                                            + Thêm biến thể
                                        </button>
                                    </div>

                                    {/* Header */}
                                    <div className="grid grid-cols-9 gap-2 mb-2">
                                        {['WeightClass', 'GripSize','Số seri', 'Giá', 'Tồn kho', ].map((h) => (
                                            <span key={h} className="text-xs text-slate-400 col-span-2 last:col-span-1">{h}</span>
                                        ))}
                                    </div>

                                    {formData.productDetailRequests.map((row, i) => (
                                        <div key={i} className="grid grid-cols-10 gap-2 mb-2">
                                            <input
                                                placeholder="3U/4U"
                                                className="col-span-2 p-1.5 bg-slate-100 rounded-lg text-xs outline-none"
                                                value={row.weightClass}
                                                onChange={(e) => updateDetailRow(i, 'weightClass', e.target.value)}
                                            />
                                            <input
                                                placeholder="G4/G5"
                                                className="col-span-2 p-1.5 bg-slate-100 rounded-lg text-xs outline-none"
                                                value={row.gripSize}
                                                onChange={(e) => updateDetailRow(i, 'gripSize', e.target.value)}
                                            />
                                            <input
                                                required
                                                placeholder="Serial *"
                                                className="col-span-2 p-1.5 bg-slate-100 rounded-lg text-xs outline-none"
                                                value={row.serialNumber}
                                                onChange={(e) => updateDetailRow(i, 'serialNumber', e.target.value)}
                                            />
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                placeholder="Giá"
                                                className="col-span-2 p-1.5 bg-slate-100 rounded-lg text-xs outline-none"
                                                value={row.price}
                                                onChange={(e) => updateDetailRow(i, 'price', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="SL"
                                                className="col-span-2 p-1.5 bg-slate-100 rounded-lg text-xs outline-none"
                                                value={row.stockQuantity}
                                                onChange={(e) => updateDetailRow(i, 'stockQuantity', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDetailRow(i)}
                                                disabled={formData.productDetailRequests.length === 1}
                                                className="col-span-1 text-rose-400 hover:text-rose-600 disabled:opacity-30 text-base"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitLoading}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                {submitLoading
                                    ? <Loader2 size={18} className="animate-spin" />
                                    : <Save size={18} />
                                }
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