import instance from '../../../api/instance';

export interface Shipper {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export const getShippers = async () => {
  try {
    console.log('Calling API: /admin/users/shippers');
    const response = await instance.get('/admin/users/shippers');
    console.log('API Response:', response);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};
