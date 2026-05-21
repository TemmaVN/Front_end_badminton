import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = localStorage.getItem('token');
        if (!error.response) {
            return Promise.reject(error);
        }

        if (token && error.response.status === 401) {
            if (window.location.pathname !== '/') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
};

// User API
export const userApi = {
    changePassword: ({ oldPassword, newPassword }) => api.put('/user/change-password', { oldPassword, newPassword }),
    UpdateProfile: ({ fullName, dateOfBirth, phoneNumber, city, district, detailedAddress }) => api.put('/User/profile', { fullName, dateOfBirth, phoneNumber, city, district, detailedAddress}),
    get_info: () => api.get('/User/user-info'),
    getAll: (page = 1, pageSize = 10) => api.get('/User', { params: { page, pageSize } }),
    search: (keyword) => api.get('/User/search', { params: { keyword } }),
    create: (userData) => api.post('/User', userData),
};

// Product API
export const productApi = {
    getHomeProducts: () =>
        api.get('/Product/home'),

    search: (params = {}) =>
        api.get('/Product/searchAsync', { params }),

    getProductsBySlug: (categorySlug, params = {}) =>
        api.get(`/Product/product_of_category/${categorySlug}`, {
            params: {
                page: params.page || 1,
                pagesize: params.pagesize || 9,
                keyword: params.keyword || undefined,
                minPrice: params.minPrice || undefined,
                maxPrice: params.maxPrice || undefined,
            },
        }),

    getProductDetaildBySlug: (slug) =>
        api.get(`/Product/${slug}`),

    getForAdmin: (params = {}) =>
        api.get('/Product/product-management', { params }),

    getTopProducts: (params = {}) =>
        api.get('/admin/statistic/products/top', { params }),

    create: (data) =>
        api.post('/Product', data),

    update: (id, data) =>
        api.put(`/Product/${id}`, data),

    delete: (id) =>
        api.delete(`/Product/${id}`),

    getVariants: (productId, params = {}) =>
        api.get(`/Product/${productId}/management-details`, { params }),

    addVariant: (productId, data) =>
        api.post(`/Product/${productId}/management-details`, data),

    updateVariant: (detailId, data) =>
        api.put(`/Product/management-details/${detailId}`, data),

    deleteVariant: (detailId) =>
        api.delete(`/Product/management-details/${detailId}`),

    getSerials: (detailId, params = {}) =>
        api.get(`/Product/management-details/${detailId}/serials`, { params }),

    addSerial: (detailId, data) =>
        api.post(`/Product/management-details/${detailId}/serials`, data),

    // Quản lý ảnh sản phẩm
    getImages: (productId) =>
        api.get(`/Product/${productId}/management-images`),

    addImage: (productId, data) =>
        api.post(`/Product/${productId}/management-images`, data),

    setMainImage: (productId, imageId) =>
        api.put(`/Product/${productId}/management-images/set-main/${imageId}`),

    reorderImages: (productId, data) =>
        api.put(`/Product/management-images/reOrder`, data, { params: { productId } }),

    deleteImage: (imageId) =>
        api.delete(`/Product/management-images/${imageId}`),
};

export const metaDataApi = {
    get: () => api.get('/MetaData'),
};

// Category API
export const categoryApi = {
    getAll: () => api.get('/Category'), 
    getById: (id) => api.get(`/Category/${id}`),
    create: (categoryName) => api.post('/Category', `"${categoryName}"`, {
        headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, newName) => api.put(`/Category/${id}`, `"${newName}"`, {
        headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => api.delete(`/Category/${id}`),
};

// api.js
// ... (các config axios cũ giữ nguyên)

export const brandApi = {
    getAll: () => api.get('/Brand'),
    create: (brandName) => api.post('/Brand', JSON.stringify(brandName), {
        headers: { 'Content-Type': 'application/json' }
    }),

    update: (id, newBrandName) => api.put(`/Brand/${id}`, JSON.stringify(newBrandName), {
        headers: { 'Content-Type': 'application/json' }
    }),

    delete: (id) => api.delete(`/Brand/${id}`),
};

export const cartApi = {
    getMyCart: () => api.get('/Cart/my-cart'),
    addToCart: (detailId, quantity) => api.post('/Cart/add-to-cart', { detailId, quantity }),
    updateCartItem: (cartItemId, quantity) => api.put(`/Cart/update-cart-item/${cartItemId}`, null, { params: { quantity } }),
    deleteCartItem: (cartItemId) => api.delete(`/Cart/delete-cart-item/${cartItemId}`),
};

// Order API
export const orderApi = {
    create: (data) => api.post('/Order', data),
    getMyOrders: () => api.get('/Order/my-orders'),
    getAll: (page = 1, pageSize = 10) =>
        api.get('/Order/all-orders', { params: { page, pageSize } }),
    getByStatus: (statusId, page = 1, pageSize = 10) =>
        api.get(`/Order/all-orders-by-status/${statusId}`, { params: { page, pageSize } }),
    updateStatus: (orderId, newOrderStatusId) =>
        api.put(`/Order/updateStatus/${orderId}`, newOrderStatusId, {
            headers: { 'Content-Type': 'application/json' }
        }),
    cancelMyOrder: (orderId) =>
        api.put(`/Order/cancel-my-order/${orderId}`),
    adminSearch: (params = {}) =>
        api.get('/Order/admin-search', { params }),
    preview: (data) =>
        api.post('/Order/preview', data),
};

export const warrantyApi = {
    create: (formData) => api.post('/Warranty', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getMyWarranties: () => api.get('/Warranty/my-claims'),
    getAll: (params = {}) => api.get('/Warranty', { params }),
    updateStatus: (warrantyId, status, adminNote) =>
        api.put(`/Warranty/${warrantyId}/status`, { status, adminNote }),
    delete: (warrantyId) => api.delete(`/Warranty/${warrantyId}`),
};

export const statisticApi = {
    getOverview: (params = {}) => api.get('/admin/statistic/overview', { params }),
    getRevenueByCategoy: (params = {}) => api.get('/admin/statistic/revenue/category', {params}),
    getRevenueByBrand: (params = {}) => api.get('/admin/statistic/revenue/brand', {params}),
    getRevenueByMonth: (params = {}) => api.get('/admin/statistic/revenue/monthly', {params}),
    getRevenueCategoryByMonth: (params = {}) => api.get('/admin/statistic/revenue/category-monthly', {params}),
    getFullReport: (params = {}) => api.get('/admin/statistic/full-report', {params}),
}

export const voucherApi = {
    getAvailableVouchers: (paymentMethod) => api.get('/Voucher/my-voucher', {params: {paymentMethod}}),
    getAllAvailable: () => api.get('/Voucher/all-available'),
    saveVoucher: (voucherId) => api.post(`/Voucher/save/${voucherId}`),
    adminCreate: (data) => api.post('/Voucher/admin/add', data),
}

export default api;



