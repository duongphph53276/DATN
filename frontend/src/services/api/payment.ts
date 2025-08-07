import api from "../../middleware/axios"

export const callVnpaySanboxPayUrl = async (data: {amount: number; bank_code: string}) => {
    const res = await api.post('/payment/vnpay/create',{amount: data.amount, bank_code: data.bank_code});
    return res.data;
}