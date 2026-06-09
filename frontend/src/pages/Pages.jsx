import { useEffect, useState } from 'react';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [active, setActive] = useState('');
  const [content, setContent] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/pages').then(({ data }) => {
      setPages(data);
      setActive(data[0]?.slug || '');
      setContent(data[0]?.content || '');
    });
  }, []);

  const selectPage = (slug) => {
    const page = pages.find((item) => item.slug === slug);
    setActive(slug);
    setContent(page?.content || '');
  };

  const save = async () => {
    const { data } = await api.put(`/pages/${active}`, { content, status: true });
    setPages(pages.map((page) => (page.slug === active ? data : page)));
    setToast('Page content updated successfully');
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Manage Pages</h2></div>
      <div className="form-panel">
        <ul className="nav nav-tabs mb-3">
          {pages.map((page) => (
            <li className="nav-item" key={page.slug}>
              <button className={`nav-link ${active === page.slug ? 'active' : ''}`} onClick={() => selectPage(page.slug)}>{page.title}</button>
            </li>
          ))}
        </ul>
        <textarea className="form-control cms-editor" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="btn btn-primary mt-3" onClick={save}>Update Page</button>
      </div>
    </>
  );
}
