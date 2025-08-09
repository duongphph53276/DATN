import api from "../../middleware/axios";
import { Address } from "../../interfaces/user";

export const getAddress = async () => {
    const res = await api.get('/addresses');
    return res;
}

export const createAddress = async (addressData: Omit<Address, '_id' | 'user_id' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.post('/addresses', addressData);
    return res;
}

export const updateAddress = async (addressId: string, addressData: Partial<Omit<Address, '_id' | 'user_id' | 'createdAt' | 'updatedAt'>>) => {
    const res = await api.put(`/addresses/${addressId}`, addressData);
    return res;
}

export const deleteAddress = async (addressId: string) => {
    const res = await api.delete(`/addresses/${addressId}`);
    return res;
}

export const setDefaultAddress = async (addressId: string) => {
    const res = await api.put(`/addresses/${addressId}/default`);
    return res;
}