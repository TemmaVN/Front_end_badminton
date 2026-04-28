import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save, Loader2, Filter, RotateCcw } from 'lucide-react';
import { useProduct } from "../../contexts/ProductContext";
import { useCategory } from "../../contexts/CategoryContext"; // Import context category
import { brandApi } from "../../api"; // Giả sử bạn gọi trực tiếp brandApi

const ProductList = () => {
    const { products, loading, searchProducts, addProduct } = useProduct();
    const { categories } = useCategory(); // Lấy danh sách categories từ context
    const [brands, setBrands] = useState([]); // State lưu danh sách brands
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Quản lý state bộ lọc tập trung
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        brandId: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        pagesize: 20
    });

    // 2. Lấy dữ liệu Brands và chạy Search ban đầu
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await brandApi.getAll();
                setBrands(res.data.data || []);
            } catch (err) { console.error("Lỗi lấy brands:", err); }
        };
        fetchBrands();
    }, []);

    // Mỗi khi filters thay đổi, gọi API search
    useEffect(() => {
        searchProducts(filters);
    }, [filters]);

    // 3. Xử lý thay đổi input lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ 
            ...prev, 
            [name]: value,
            page: 1 // Reset về trang 1 khi lọc
        }));
    };

    // Reset bộ lọc
    const resetFilters = () => {
        setFilters({
            keyword: '',
            categoryId: '',
            brandId: '',
            minPrice: '',
            maxPrice: '',
            page: 1,
            pagesize: 20
        });
    };

    // State cho form thêm sản phẩm
    const [formData, setFormData] = useState({
        productName: '',
        brandId: '',
        categoryId: '',
        basePrice: '',
        mainImageUrl: '',
        productDetailRequests: [{ serialNumber: '', weight: '', gripSize: '', stockQuantity: 10 }]
    });

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-8xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Header & Filter Section */}
                <div className="p-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Quản lý kho hàng</h3>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        >
                            <Plus size={18} /> Thêm sản phẩm
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Search Keyword */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                placeholder="Tên sản phẩm..." 
                                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" 
                            />
                        </div>

                        {/* Category Filter */}
                        <select 
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                            ))}
                        </select>

                        {/* Brand Filter */}
                        <select 
                            name="brandId"
                            value={filters.brandId}
                            onChange={handleFilterChange}
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="">Tất cả thương hiệu</option>
                            {brands.map(b => (
                                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                            ))}
                        </select>

                        {/* Price Filter (Min) */}
                        <input 
                            name="minPrice"
                            type="number"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Giá từ..."
                            className="py-2 px-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                        />

                        {/* Reset & More */}
                        <button 
                            onClick={resetFilters}
                            className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm transition-all"
                        >
                            <RotateCcw size={16} /> Làm mới
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-orange-500" size={32} />
                                <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
                            </div>
                        </div>
                    )}
                    
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Sản phẩm</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Thương hiệu/Loại</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Giá (VND)</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products && products.length > 0 ? (
                                products.map((item) => (
                                    <tr key={item.productId} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={item.mainImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                                                <div>
                                                    <div className="font-medium text-slate-800">{item.productName}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono italic">{item.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-slate-700 font-medium">{item.brandName}</div>
                                            <div className="text-xs text-slate-500">{item.categoryName}</div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-orange-600">
                                            {item.sellingPrice?.toLocaleString()}₫
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.isBestSeller ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {item.isBestSeller ? 'BÁN CHẠY' : 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg"><Edit2 size={16} /></button>
                                                <button className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                !loading && (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Filter size={40} strokeWidth={1} />
                                                <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add Product (Giữ nguyên logic cũ của bạn, nhưng dùng danh sách categories/brands để chọn) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    {/* ... Form Modal của bạn ... */}
                    {/* Chỗ chọn BrandId và CategoryId trong Form nên đổi thành <select> */}
                </div>
            )}
        </div>
    );
};

export default ProductList;