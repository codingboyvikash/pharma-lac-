import { useEffect, useState } from 'react';
import Toast from '../components/Toast.jsx';
import api from '../services/api.js';
import { imageUrl } from '../utils/format.js';

export default function Settings() {
  const [settings, setSettings] = useState({ siteName: '', siteLogo: null, favicon: null });
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [preview, setPreview] = useState({ logo: '', favicon: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([api.get('/settings'), api.get('/auth/profile')]).then(([settingsRes, profileRes]) => {
      setSettings({ siteName: settingsRes.data.siteName, siteLogo: null, favicon: null });
      setPreview({ logo: imageUrl(settingsRes.data.siteLogo), favicon: imageUrl(settingsRes.data.favicon) });
      setProfile({ name: profileRes.data.name, email: profileRes.data.email, phone: profileRes.data.phone || '' });
    });
  }, []);

  const saveSettings = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('siteName', settings.siteName);
    if (settings.siteLogo) data.append('siteLogo', settings.siteLogo);
    if (settings.favicon) data.append('favicon', settings.favicon);
    await api.put('/settings', data);
    setToast('Site settings updated');
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

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Settings</h2></div>
      <div className="row g-3">
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
            <button className="btn btn-primary">Update Settings</button>
          </form>
        </div>
      </div>
    </>
  );
}
