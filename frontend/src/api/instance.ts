import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/', // hoặc URL server backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
