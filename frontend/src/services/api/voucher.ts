import api from "../../middleware/axios";

export const applyVoucher = async (data: { code: string; user_id: string }) => {
    const res = await api.post('/vouchers/apply', {
        code: data.code,
        user_id: data.user_id  // Thêm user_id vào body
    });
    return res.data;
};