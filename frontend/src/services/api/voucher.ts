import api from "../../middleware/axios";

export const applyVoucher = async (data: {code: string}) => {
    const res = await api.post('/vouchers/apply', {code: data.code});
    return res.data;
}