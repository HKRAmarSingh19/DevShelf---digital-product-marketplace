import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: any;
}

// Auth API
export const authApi = {
  getMe: async () => {
    const res = await api.get<ApiResponse>('/auth/me');
    return res.data.data;
  },
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<ApiResponse>('/auth/login', credentials);
    return res.data.data;
  },
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<ApiResponse>('/auth/register', data);
    return res.data.data;
  },
  logout: async () => {
    const res = await api.post<ApiResponse>('/auth/logout');
    return res.data;
  },
};

// Categories API
export const categoryApi = {
  list: async () => {
    const res = await api.get<ApiResponse>('/categories');
    return res.data.data;
  },
};

// Products API
export const productApi = {
  list: async (params?: Record<string, any>) => {
    const res = await api.get<ApiResponse>('/products', { params });
    return res.data.data;
  },
  getBySlug: async (slug: string) => {
    const res = await api.get<ApiResponse>(`/products/${slug}`);
    return res.data.data;
  },
  create: async (data: any) => {
    const res = await api.post<ApiResponse>('/products', data);
    return res.data.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.patch<ApiResponse>(`/products/${id}`, data);
    return res.data.data;
  },
  submitForReview: async (id: string) => {
    const res = await api.post<ApiResponse>(`/products/${id}/submit-for-review`);
    return res.data.data;
  },
  addVersion: async (productId: string, data: any) => {
    const res = await api.post<ApiResponse>(`/products/${productId}/versions`, data);
    return res.data.data;
  },
  getVersions: async (productId: string) => {
    const res = await api.get<ApiResponse>(`/products/${productId}/versions`);
    return res.data.data;
  },
};

// Checkout & Payments API
export const checkoutApi = {
  initiate: async (productIds: string[], licenseType = 'STANDARD') => {
    const res = await api.post<ApiResponse>('/checkout', {
      productIds,
      licenseType,
    });
    return res.data.data;
  },
  verify: async (payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const res = await api.post<ApiResponse>('/checkout/verify', payload);
    return res.data.data;
  },
};

// Library API
export const libraryApi = {
  getMyLibrary: async () => {
    const res = await api.get<ApiResponse>('/library');
    return res.data.data;
  },
  getItem: async (productId: string) => {
    const res = await api.get<ApiResponse>(`/library/${productId}`);
    return res.data.data;
  },
  download: async (productId: string, version?: string) => {
    const res = await api.get<ApiResponse>(`/library/${productId}/download`, {
      params: { version },
    });
    return res.data.data;
  },
};

// Reviews API
export const reviewApi = {
  getReviews: async (productId: string) => {
    const res = await api.get<ApiResponse>(`/products/${productId}/reviews`);
    return res.data.data;
  },
  createReview: async (productId: string, data: { rating: number; comment: string }) => {
    const res = await api.post<ApiResponse>(`/products/${productId}/reviews`, data);
    return res.data.data;
  },
};

// Seller API
export const sellerApi = {
  apply: async (data: any) => {
    const res = await api.post<ApiResponse>('/seller/apply', data);
    return res.data.data;
  },
  getDashboard: async () => {
    const res = await api.get<ApiResponse>('/seller/dashboard');
    return res.data.data;
  },
  getProducts: async () => {
    const res = await api.get<ApiResponse>('/seller/products');
    return res.data.data;
  },
};

// Uploads API
export const uploadApi = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse>('/uploads/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  uploadPreview: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse>('/uploads/preview', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};

// Admin API
export const adminApi = {
  getOverview: async () => {
    const res = await api.get<ApiResponse>('/admin/overview');
    return res.data.data;
  },
  getUsers: async (page = 1) => {
    const res = await api.get<ApiResponse>('/admin/users', { params: { page } });
    return res.data.data;
  },
  updateUserStatus: async (userId: string, status: string, reason?: string) => {
    const res = await api.patch<ApiResponse>(`/admin/users/${userId}/status`, {
      status,
      reason,
    });
    return res.data.data;
  },
  getSellerApplications: async () => {
    const res = await api.get<ApiResponse>('/admin/sellers');
    return res.data.data;
  },
  decideSellerApplication: async (userId: string, decision: string, notes?: string) => {
    const res = await api.patch<ApiResponse>(`/admin/sellers/${userId}/decision`, {
      decision,
      notes,
    });
    return res.data.data;
  },
  getPendingProducts: async () => {
    const res = await api.get<ApiResponse>('/admin/products/pending');
    return res.data.data;
  },
  moderateProduct: async (productId: string, decision: string, notes?: string) => {
    const res = await api.patch<ApiResponse>(`/admin/products/${productId}/moderation`, {
      decision,
      notes,
    });
    return res.data.data;
  },
  getAuditLogs: async () => {
    const res = await api.get<ApiResponse>('/admin/audit-logs');
    return res.data.data;
  },
};
