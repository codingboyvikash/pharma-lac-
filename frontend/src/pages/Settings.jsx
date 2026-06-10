import { useEffect, useState } from 'react';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';
import { imageUrl } from '../utils/format.js';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Settings() {
  const [settings, setSettings] = useState({ siteName: '', siteLogo: null, favicon: null, faq: [] });
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [preview, setPreview] = useState({ logo: '', favicon: '' });
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ _id: null, title: '', link: '', imageFiles: [] });
  const [bannerPreview, setBannerPreview] = useState([]);
  const [faqForm, setFaqForm] = useState({ _id: null, question: '', answer: '' });
  const [toast, setToast] = useState('');
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/settings'), api.get('/auth/profile'), api.get('/settings/banners')]).then(([settingsRes, profileRes, bannersRes]) => {
      setSettings({ siteName: settingsRes.data.siteName, siteLogo: null, favicon: null, faq: settingsRes.data.faq || [] });
      setFaqs(settingsRes.data.faq || []);
      setPreview({ logo: imageUrl(settingsRes.data.siteLogo), favicon: imageUrl(settingsRes.data.favicon) });
      setProfile({ name: profileRes.data.name, email: profileRes.data.email, phone: profileRes.data.phone || '' });
      setBanners(bannersRes.data || []);
    });
  }, []);

  const saveSettings = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('siteName', settings.siteName);
    if (settings.siteLogo) data.append('siteLogo', settings.siteLogo);
    if (settings.favicon) data.append('favicon', settings.favicon);
    data.append('faq', JSON.stringify(faqs || []));
    await api.put('/settings', data);
    setToast('Site settings updated');
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (idx, key, value) => {
    const next = [...faqs];
    next[idx] = { ...next[idx], [key]: value };
    setFaqs(next);
  };
  const deleteFaq = (idx) => setFaqs(faqs.filter((_, i) => i !== idx));

  const editFaq = (f, idx) => {
    setFaqForm({ _id: idx, question: f.question, answer: f.answer });
  };

  const saveFaq = async (e) => {
    e.preventDefault();
    const next = [...faqs];
    if (faqForm._id !== null && faqForm._id !== undefined) {
      // edit existing
      next[faqForm._id] = { question: faqForm.question, answer: faqForm.answer };
    } else {
      // add new
      next.push({ question: faqForm.question, answer: faqForm.answer });
    }
    const data = new FormData();
    data.append('siteName', settings.siteName);
    data.append('faq', JSON.stringify(next));
    if (settings.siteLogo) data.append('siteLogo', settings.siteLogo);
    if (settings.favicon) data.append('favicon', settings.favicon);
    const res = await api.put('/settings', data);
    setFaqs(res.data.faq || next);
    setFaqForm({ _id: null, question: '', answer: '' });
    setToast('FAQ saved');
  };

  const deleteFaqPersist = async (idx) => {
    if (!window.confirm('Delete this FAQ?')) return;
    const next = faqs.filter((_, i) => i !== idx);
    const data = new FormData();
    data.append('siteName', settings.siteName);
    data.append('faq', JSON.stringify(next));
    if (settings.siteLogo) data.append('siteLogo', settings.siteLogo);
    if (settings.favicon) data.append('favicon', settings.favicon);
    const res = await api.put('/settings', data);
    setFaqs(res.data.faq || next);
    setToast('FAQ deleted');
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    await api.put('/settings/profile', profile);
    setToast('Profile updated');
  };

  const changePassword = async (event) => {
    event.preventDefault();
    await api.put('/settings/password', password);
    setPassword({ currentPassword: '', newPassword: '' });
    setToast('Password changed successfully');
  };

  const fileChange = (key, file) => {
    setSettings({ ...settings, [key]: file });
    setPreview({ ...preview, [key === 'siteLogo' ? 'logo' : 'favicon']: file ? URL.createObjectURL(file) : '' });
  };

  const fileChangeBanner = (files) => {
    const arr = Array.from(files || []);
    setBannerForm({ ...bannerForm, imageFiles: arr });
    setBannerPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  const editBanner = (b) => {
    setBannerForm({ _id: b._id, title: b.title, link: b.link, imageFiles: [] });
    setBannerPreview((b.images || []).map((p) => imageUrl(p)));
  };

  const saveBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.title.trim()) {
      setToast('Title is required');
      return;
    }
    const data = new FormData();
    data.append('title', bannerForm.title);
    data.append('link', bannerForm.link || '');
    (bannerForm.imageFiles || []).forEach((f) => data.append('images', f));
    if (bannerForm._id) await api.put(`/settings/banners/${bannerForm._id}`, data);
    else await api.post('/settings/banners', data);
    setToast('Banner saved');
    setBannerForm({ _id: null, title: '', link: '', imageFiles: [] });
    setBannerPreview([]);
    const res = await api.get('/settings/banners');
    setBanners(res.data);
  };

  const deleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    await api.delete(`/settings/banners/${id}`);
    setToast('Banner deleted');
    const res = await api.get('/settings/banners');
    setBanners(res.data);
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Settings</h2></div>
      <div className="row g-3 mt-3">
        <div className="col-lg-12">
          <form className="form-panel" onSubmit={saveBanner}>
            <h5>Banner Management</h5>
            <input className="form-control mb-3" placeholder="Title" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} />
            <input className="form-control mb-3" placeholder="Link (optional)" value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} />
            <label className="form-label">Images</label>
            <input className="form-control mb-2" type="file" accept="image/*" multiple onChange={(e) => fileChangeBanner(e.target.files)} />
            {bannerPreview && bannerPreview.length > 0 && (
              <div className="d-flex flex-wrap mb-3">
                {bannerPreview.map((p, idx) => (
                  <img key={idx} src={p} className="image-preview me-2 mb-2" alt={`Preview ${idx + 1}`} style={{ width: 140, height: 70, objectFit: 'cover' }} />
                ))}
              </div>
            )}
            <div>
              <button className="btn btn-primary me-2">Save Banner</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setBannerForm({ _id: null, title: '', link: '', imageFiles: [] }); setBannerPreview([]); }}>Clear</button>
            </div>
          </form>

          <div className="card mt-3 p-3 ">
            <h6>Existing Banners</h6>
            <div className="list-group">
              {banners.map((b) => (
                <div key={b._id} className="d-flex align-items-center justify-content-between list-group-item">
                  <div className="d-flex align-items-center">
                    {b.images && b.images.length > 0 && <img src={imageUrl(b.images[0])} alt={b.title} style={{ width: 120, height: 60, objectFit: 'cover', marginRight: 12 }} />}
                    <div>
                      <div><strong>{b.title}</strong></div>
                      <div className="text-muted small">{b.link}</div>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editBanner(b)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteBanner(b._id)}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <form className="form-panel mt-3" onSubmit={saveFaq}>
            <h5>FAQ Management</h5>
            <input className="form-control mb-3" placeholder="Question" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} />
            <input className="form-control mb-3" placeholder="Answer" value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} />
            <div>
              <button className="btn btn-primary me-2">Save FAQ</button>
              <button type="button" className="btn btn-secondary" onClick={() => setFaqForm({ _id: null, question: '', answer: '' })}>Clear</button>
            </div>
          </form>


          <div className="card mt-3 p-3 ">
            <h6>Existing FAQs</h6>
            <div className="list-group">
              {faqs.map((f, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between list-group-item">
                  <div className='question-answer'>
                    <div><strong>{f.question}</strong></div>
                    <div className="text-muted small">{f.answer}</div>
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editFaq(f, idx)}><FiEdit2 /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteFaqPersist(idx)}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>




      </div>
      <div className="row g-3 mt-3">
        <div className="col-lg-4">
          <form className="form-panel" onSubmit={saveProfile}>
            <h5>Admin Profile</h5>
            <input className="form-control mb-3" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            <input className="form-control mb-3" type="email" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <input className="form-control mb-3" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <button className="btn btn-primary">Update Profile</button>
          </form>
        </div>
        <div className="col-lg-4">
          <form className="form-panel" onSubmit={changePassword}>
            <h5>Change Password</h5>
            <input className="form-control mb-3" type="password" placeholder="Current Password" value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
            <input className="form-control mb-3" type="password" placeholder="New Password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
            <button className="btn btn-primary">Change Password</button>
          </form>
        </div>
        <div className="col-lg-4">
          <form className="form-panel" onSubmit={saveSettings}>
            <h5>Site Settings</h5>
            <input className="form-control mb-3" placeholder="Site Name" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
            <label className="form-label">Site Logo</label>
            <input className="form-control mb-2" type="file" accept="image/*" onChange={(e) => fileChange('siteLogo', e.target.files[0])} />
            {preview.logo && <img src={preview.logo} className="image-preview mb-3" alt="Site logo" />}
            <label className="form-label">Favicon</label>
            <input className="form-control mb-2" type="file" accept="image/*" onChange={(e) => fileChange('favicon', e.target.files[0])} />
            {preview.favicon && <img src={preview.favicon} className="image-preview mb-3" alt="Favicon" />}
            <div>
              <button className="btn btn-primary">Update Settings</button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}
