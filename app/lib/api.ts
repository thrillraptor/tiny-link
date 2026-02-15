import axios from 'axios';

const api = axios.create({
    baseURL: typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : '',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function createTinyLink(originalUrl: string) {
    const response = await api.post('/api/url', { originalUrl });
    return response.data;
}
