import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getCategories = () => axios.get(`${API_URL}/category`);
export const addCategory = (data: any) => axios.post(`${API_URL}/category/add`, data);
export const editCategory = (id: string, data: any) => axios.put(`${API_URL}/category/edit/${id}`, data);
export const deleteCategory = (id: string) => axios.delete(`${API_URL}/category/${id}`);
export const getCategoryById = (id: string) => axios.get(`${API_URL}/category/${id}`);
