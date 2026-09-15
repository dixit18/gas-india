import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3004/api', timeout: 10000 });
export const schools = () => api.get('/schools').then((r) => r.data.items);
export const polls = (sid) => api.get(`/schools/${sid}/polls`).then((r) => r.data.items);
export const vote = (pid, d) => api.post(`/polls/${pid}/vote`, d).then((r) => r.data);
export const flames = (user) => api.get('/flames', { params: { user } }).then((r) => r.data.items);
