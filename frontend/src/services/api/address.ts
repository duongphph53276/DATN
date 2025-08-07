import api from "../../middleware/axios";

export const getAddress = async () => {
    const res = await api.get('/addresses');
    return res;
}