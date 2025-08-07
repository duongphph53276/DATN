import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // hoặc URL server backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
