export const formatDate = (value) => new Date(value).toLocaleString();
export const imageUrl = (path) => (path ? `${import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000'}${path}` : '');
