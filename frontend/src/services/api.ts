import axios from 'axios';
import { ProductType, Product, Variant, AddOn } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productTypeService = {
  getAll: async (): Promise<ProductType[]> => {
    const response = await api.get('/product-types');
    return response.data;
  },

  getById: async (id: string): Promise<ProductType> => {
    const response = await api.get(`/product-types/${id}`);
    return response.data;
  },

  create: async (data: Partial<ProductType>): Promise<ProductType> => {
    const response = await api.post('/product-types', data);
    return response.data;
  },
};

export const productService = {
  getAll: async (type?: string): Promise<Product[]> => {
    const params = type ? { type } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByType: async (typeName: string): Promise<Product[]> => {
    const response = await api.get(`/products/by-type/${typeName}`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },
};

export const variantService = {
  getByProductId: async (productId: string): Promise<Variant[]> => {
    const response = await api.get(`/variants/product/${productId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Variant> => {
    const response = await api.get(`/variants/${id}`);
    return response.data;
  },

  create: async (data: Partial<Variant>): Promise<Variant> => {
    const response = await api.post('/variants', data);
    return response.data;
  },
};

export const addOnService = {
  getByProductId: async (productId: string): Promise<AddOn[]> => {
    const response = await api.get(`/add-ons/product/${productId}`);
    return response.data;
  },

  getById: async (id: string): Promise<AddOn> => {
    const response = await api.get(`/add-ons/${id}`);
    return response.data;
  },

  create: async (data: Partial<AddOn>): Promise<AddOn> => {
    const response = await api.post('/add-ons', data);
    return response.data;
  },
};

export const healthService = {
  check: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
