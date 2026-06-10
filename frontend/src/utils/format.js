export const formatDate = (value) => new Date(value).toLocaleString();
const UPLOAD_HOST = import.meta.env.VITE_UPLOAD_URL || 'http://localhost:5000';
export const imageUrl = (p) => {
	if (!p) return '';
	const host = UPLOAD_HOST.replace(/\/$/, '');
	const filePath = p.replace(/^\//, '');
	return `${host}/${filePath}`;
};
