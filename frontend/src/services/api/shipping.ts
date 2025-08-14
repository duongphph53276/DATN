import instance from '../../../api/instance';

export const getProvinces = async () => {
  try {
    const response = await instance.get('/shipping/provinces');
    return response;
  } catch (error) {
    throw error;
  }
};

export const calculateShippingFee = async (data: { address_id?: string; city?: string }) => {
  try {
    const response = await instance.post('/shipping/calculate', data);
    return response;
  } catch (error) {
    throw error;
  }
};
