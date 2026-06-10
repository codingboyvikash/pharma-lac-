import { useEffect, useState } from 'react';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

export default function Pages() {
  const [pages, setPages] = useState([]);
  const [active, setActive] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get('/pages').then(({ data }) => {
      // remove duplicate pages by title (case-insensitive) to avoid showing repeated tabs
      const uniqueByTitle = Object.values(
        (data || []).reduce((acc, p) => {
          const key = (p.title || '').trim().toLowerCase();
          if (!acc[key]) acc[key] = p;
          return acc;
        }, {})
      );
      // sort by title for consistent order
      uniqueByTitle.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      setPages(uniqueByTitle);
      setActive(uniqueByTitle[0]?.slug || '');
      setContent(uniqueByTitle[0]?.content || '');
      setStatus(uniqueByTitle[0]?.status ?? true);
    });
  }, []);

  const selectPage = (slug) => {
    const page = pages.find((item) => item.slug === slug);
    setActive(slug);
    setContent(page?.content || '');
    setStatus(page?.status ?? true);
  };

  const save = async () => {
    const { data } = await api.put(`/pages/${active}`, { content, status });
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

        <div style={{ marginBottom: 8 }}>
          <label style={{ marginRight: 12 }}><input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} /> Active</label>
        </div>

        <ReactQuill value={content} onChange={setContent} className="cms-editor" />

        <div className="mt-3">
          <button className="btn btn-primary" onClick={save}>Update Page</button>
        </div>
      </div>
    </>
  );
}
