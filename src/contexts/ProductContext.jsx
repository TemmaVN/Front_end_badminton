import React, {
    createContext,
    useContext,
    useState,
    useCallback,
} from 'react';
import { productApi } from '../api';

const ProductContext = createContext(null);

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);
    const [pagination, setPagination] = useState({
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
    });

    // ─── helper dùng nội bộ ───────────────────────────────────────────────────
    const setPaginationFromResponse = ({ totalCount, totalPages, page }) => {
        setPagination({
            totalCount,
            totalPages,
            currentPage: page,
        });
    };

    // ─── Search / Filter (trang danh sách chính) ─────────────────────────────
    /**
     * params: { keyword, categorySlug, brandSlug,
     *           minPrice, maxPrice, Voucher, page, pagesize }
     * return: { items, totalCount, totalPages, page } | null
     */
    const searchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.search(params);
            const data = response.data;             // { items, totalCount, totalPages, page }

            setProducts(data.items ?? []);
            setPaginationFromResponse(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Lấy sản phẩm theo danh mục (slug) ───────────────────────────────────
    /**
     * params: { page, pagesize, keyword, minPrice, maxPrice }
     */
    const fetchProductsBySlug = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.search(params);
            const data = response.data;
            setProducts(data.items ?? []);
            setPaginationFromResponse(data);
            return data;
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Tạo sản phẩm mới (Admin) ─────────────────────────────────────────────
    /**
     * data: CreateProductRequest (xem swagger / controller)
     * return: { productId } | null
     */
    const addProduct = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.create(data);
            return response.data; // trả về { message, productId } cho caller
        } catch (err) {
            const msg =
                err.response?.data?.message  // message từ backend
                ?? err.response?.data?.errors // ModelState errors
                ?? err.message;
            setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Cập nhật sản phẩm (Admin) ────────────────────────────────────────────
    /**
     * return: updated product | null
     */
    const updateProduct = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.update(id, data);
            const updated = response.data;

            setProducts((prev) =>
                prev.map((p) => (p.productId === id ? { ...p, ...updated } : p))
            );
            return updated;
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Xóa sản phẩm (Admin) ─────────────────────────────────────────────────
    /**
     * return: true | false
     */
    const deleteProduct = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await productApi.delete(id);
            setProducts((prev) => prev.filter((p) => p.productId !== id));
            return true;
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Xóa error thủ công (dùng ở UI nếu cần) ──────────────────────────────
    const clearError = useCallback(() => setError(null), []);
    // ─── Lấy chi tiết 1 sản phẩm theo slug ───────────────────────────────────

    const getProductDetaildBySlug = useCallback(async (slug) => {
        setLoading(true);
        setError(null);
        try {
            const response = await productApi.getProductDetaildBySlug(slug);
            const product = response.data?.data ?? response.data;
            return product;
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    // ─── Value ────────────────────────────────────────────────────────────────
    const value = {
        // state
        products,
        loading,
        error,
        pagination,

        // actions
        getProductDetaildBySlug,
        searchProducts,
        fetchProductsBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        clearError,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;