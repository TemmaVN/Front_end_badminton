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
    UpdateProfile: ({ fullName, dateOfBirth, phoneNumber }) => api.put('/user/profile', { fullName, dateOfBirth, phoneNumber }),
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Product API
export const productApi = {
    getAll: (params) => api.get('/Product', { params }),
    search: (params) => api.get('/Product/searchAsync', { params }),
    getById: (id) => api.get(`/Product/${id}`),
    create: (data) => api.post('/Product', data),
    update: (id, data) => api.put(`/Product/${id}`, data),
    delete: (id) => api.delete(`/Product/${id}`),
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
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
};

export default api;
