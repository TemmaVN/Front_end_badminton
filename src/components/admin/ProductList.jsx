import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save, Loader2, Filter, RotateCcw } from 'lucide-react';
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext";
import { brandApi, productApi } from "../../api"; // Import thêm productApi để gọi xóa/sửa

const ProductList = () => {
    const { products, loading, searchProducts, addProduct } = useProduct();
    const { categories } = useCategory();
    const [brands, setBrands] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // State kiểm tra đang sửa hay thêm

    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        brandId: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        pagesize: 10
    });
    useEffect(() => {
        const fetchFilteredData = async () => {
            const response = await searchProducts(filters);
            if (response && response.totalPages) {
                setTotalPages(response.totalPages);
            } else {
                setTotalPages(1); 
            }
        };
        fetchFilteredData();
    }, [filters]); 

    

    const [formData, setFormData] = useState({
        productName: '',
        brandId: '',
        categoryId: '',
        basePrice: '',
        mainImageUrl: '',
        productDetailRequests: [{ serialNumber: '', weight: '', gripSize: '', stockQuantity: 10 }]
    });

    const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setFilters(prev => ({ ...prev, page: newPage }));
    }
};

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await brandApi.getAll();
                setBrands(res.data.data || []);
            } catch (err) { alert("Lỗi lấy brands:", err); }
        };
        fetchBrands();
    }, []);

    // --- LOGIC XỬ LÝ SỬA & XÓA (FRONTEND) ---

    // 1. Mở modal để sửa
    const handleEditClick = (product) => {
        setEditingProduct(product); // Đánh dấu là đang sửa
        setFormData({
            productName: product.productName,
            brandId: product.brandId || '',
            categoryId: product.categoryId || '',
            basePrice: product.basePrice,
            mainImageUrl: product.mainImageUrl,
            productDetailRequests: [] // Thường detail sẽ lấy từ API getById nếu cần sửa sâu hơn
        });
        setIsModalOpen(true);
    };

    // 2. Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await productApi.delete(id);
                alert("Xóa sản phẩm thành công!");
                searchProducts(filters); // Reload danh sách
            } catch (err) {
                alert("Không thể xóa sản phẩm. Có thể sản phẩm này đã có trong đơn hàng.");
            }
        }
    };

    // 3. Xử lý Submit (Dùng chung Thêm/Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            brandId: parseInt(formData.brandId),
            categoryId: parseInt(formData.categoryId),
            basePrice: parseFloat(formData.basePrice)
        };

        try {
            if (editingProduct) {
                // GỌI API SỬA
                await productApi.update(editingProduct.productId, payload);
                alert("Cập nhật thành công!");
            } else {
                // GỌI API THÊM
                await addProduct(payload);
                alert("Thêm sản phẩm thành công!");
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            searchProducts(filters);
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || "Thao tác thất bại"));
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const resetFilters = () => {
        setFilters({ keyword: '', categoryId: '', brandId: '', minPrice: '', maxPrice: '', page: 1, pagesize: 20 });
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quản lý kho hàng</h3>
                        <button 
                            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        >
                            <Plus size={18} /> Thêm sản phẩm
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Tên sản phẩm..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none" />
                        </div>
                        <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none">
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                        </select>
                        <select name="brandId" value={filters.brandId} onChange={handleFilterChange} className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none">
                            <option value="">Tất cả thương hiệu</option>
                            {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
                        </select>
                        <input name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} placeholder="Giá từ..." className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm outline-none"/>
                        <button onClick={resetFilters} className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 text-slate-700 rounded-xl text-sm transition-all"><RotateCcw size={16} /> Làm mới</button>
                    </div>
                </div>

                <div className="overflow-x-auto relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
                    )}
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-xs font-semibold text-slate-500 uppercase">
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4">Thương hiệu/Loại</th>
                                <th className="p-4">Giá (VND)</th>
                                <th className="p-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map((item) => (
                                <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={item.mainImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            <div className="font-medium text-slate-800 dark:text-slate-200">{item.productName}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div className="font-medium text-slate-700 dark:text-slate-300">{item.brandName}</div>
                                        <div className="text-slate-500">{item.categoryName}</div>
                                    </td>
                                    <td className="p-4 text-sm font-bold text-orange-600">{item.sellingPrice?.toLocaleString()}₫</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEditClick(item)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDelete(item.productId)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-500">
                            Trang <span className="font-semibold text-slate-800">{filters.page}</span> trên <span className="font-semibold text-slate-800">{totalPages}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(filters.page - 1)}
                                disabled={filters.page === 1}
                                className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Trước
                            </button>

                            {/* Hiển thị danh sách số trang (logic đơn giản) */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                // Chỉ hiển thị giới hạn số nút nếu quá nhiều trang (ví dụ: hiển thị 5 trang gần nhất)
                                if (totalPages > 5 && Math.abs(pageNum - filters.page) > 2) return null;
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                            filters.page === pageNum
                                                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                                                : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(filters.page + 1)}
                                disabled={filters.page === totalPages}
                                className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Tên sản phẩm" className="w-full p-2 bg-slate-100 rounded-lg outline-none" 
                                value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <select required className="p-2 bg-slate-100 rounded-lg outline-none" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                                </select>
                                <select required className="p-2 bg-slate-100 rounded-lg outline-none" value={formData.brandId} onChange={(e) => setFormData({...formData, brandId: e.target.value})}>
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
                                </select>
                            </div>

                            <input required type="number" placeholder="Giá gốc" className="w-full p-2 bg-slate-100 rounded-lg outline-none" 
                                value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
                            
                            <input required placeholder="Link ảnh" className="w-full p-2 bg-slate-100 rounded-lg outline-none" 
                                value={formData.mainImageUrl} onChange={(e) => setFormData({...formData, mainImageUrl: e.target.value})} />

                            <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                <Save size={18}/> {editingProduct ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;