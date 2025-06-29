// src/api/category.ts
import instance from './instance';

export const getCategories = () => instance.get('/category');
export const getCategoryById = (id: string) => instance.get(`/category/${id}`);
export const addCategory = (data: any) => instance.post('/category/add', data);
export const editCategory = (id: string, data: any) => instance.put(`/category/edit/${id}`, data);
export const deleteCategory = (id: string) => instance.delete(`/category/${id}`);
