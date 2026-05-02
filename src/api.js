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

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
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
    UpdateProfile: ({ fullName, dateOfBirth, phoneNumber }) => api.put('/User/profile', { fullName, dateOfBirth, phoneNumber }),
    get_info: () => api.get('/User/user-info'),
    getAll: (keyword = '') => api.get(`/User?keyword=${keyword}`),    
    create: (userData) => api.post('/User', userData),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Product API
export const productApi = {
    getHomeProducts: () => api.get('/Product/home'),
    getAll: (params) => api.get('/Product', { params }),
    search: (params) => api.get('/Product/searchAsync', { params }),
    getById: (id) => api.get(`/Product/${id}`),
    create: (data) => api.post('/Product', data),
    update: (id, data) => api.put(`/Product/${id}`, data),
    delete: (id) => api.delete(`/Product/${id}`),
    getProductsBySlug: (categorySlug, params = {}) =>
        axios.get(`/api/product/product_of_category/${categorySlug}`, {
        params: {
            categorySlug,
            page: params.page || 1,
            pagesize: params.pagesize || 9,
            keyword: params.keyword || undefined,
            minPrice: params.minPrice || undefined,
            maxPrice: params.maxPrice || undefined,
        },
    }),
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

// Order API
export const orderApi = {
    create: (data) => api.post('/Order/create', data),  // hoặc đúng route backend của bạn
    getMyOrders: () => api.get('/Order/my-orders'),
    getById: (id) => api.get(`/Order/${id}`),
};

export default api;

// Cart API
export const cartApi = {
    getMyCart: () => api.get('/Cart/my-cart'),
    addToCart: (detailId, quantity) => api.post('/Cart/add-to-cart', { detailId, quantity }),
    updateCartItem: (cartItemId, quantity) => api.put(`/Cart/update-cart-item/${cartItemId}`, null, { params: { quantity } }),
    deleteCartItem: (cartItemId) => api.delete(`/Cart/delete-cart-item/${cartItemId}`),
};
