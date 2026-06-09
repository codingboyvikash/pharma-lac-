import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Toast from '../components/Toast.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { fetchList, removeItem } from '../redux/slices/crudSlice.js';
import api from '../services/api.js';
import { imageUrl } from '../utils/format.js';

export default function Brands() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ brandName: '', logo: null, status: true });
  const [preview, setPreview] = useState('');
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const debounced = useDebounce(search);
  const dispatch = useDispatch();
  const state = useSelector((store) => store.crud.brands || {});
  const load = () => dispatch(fetchList({ resource: 'brands', page, search: debounced }));

  useEffect(() => { load(); }, [dispatch, page, debounced]);

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('brandName', form.brandName);
    data.append('status', form.status);
    if (form.logo) data.append('logo', form.logo);
    if (editing) await api.put(`/brands/${editing}`, data);
    else await api.post('/brands', data);
    setForm({ brandName: '', logo: null, status: true });
    setPreview('');
    setEditing(null);
    setToast(`Brand ${editing ? 'updated' : 'created'} successfully`);
    load();
  };

  const pickFile = (file) => {
    setForm({ ...form, logo: file });
    setPreview(file ? URL.createObjectURL(file) : '');
  };

  const edit = (brand) => {
    setEditing(brand._id);
    setForm({ brandName: brand.brandName, logo: null, status: brand.status });
    setPreview(imageUrl(brand.logo));
  };

  const confirmDelete = async () => {
    await dispatch(removeItem({ resource: 'brands', id: selected._id }));
    setSelected(null);
    setToast('Brand deleted successfully');
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Brand Management</h2><SearchBar value={search} onChange={setSearch} placeholder="Search brands" /></div>
      <div className="row g-3">
        <div className="col-lg-4">
          <form className="form-panel" onSubmit={submit}>
            <h5>{editing ? 'Edit Brand' : 'Add Brand'}</h5>
            <input className="form-control mb-3" placeholder="Brand Name" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} required />
            <input className="form-control mb-3" type="file" accept="image/*" onChange={(e) => pickFile(e.target.files[0])} />
            {preview && <img src={preview} className="image-preview mb-3" alt="Logo preview" />}
            <div className="form-check form-switch mb-3"><input className="form-check-input" type="checkbox" checked={form.status} onChange={(e) => setForm({ ...form, status: e.target.checked })} /><label className="form-check-label">Active</label></div>
            <button className="btn btn-primary"><FiPlus /> {editing ? 'Update' : 'Add'} Brand</button>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="table-panel">
            {state.loading ? <Loader /> : (
              <table className="table align-middle">
                <thead><tr><th>Logo</th><th>Name</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                <tbody>{(state.items || []).map((item) => (
                  <tr key={item._id}><td>{item.logo ? <img src={imageUrl(item.logo)} className="table-thumb" alt="" /> : '-'}</td><td>{item.brandName}</td><td>{item.status ? 'Active' : 'Inactive'}</td><td className="text-end"><button className="icon-action" onClick={() => edit(item)}><FiEdit2 /></button><button className="icon-action danger" onClick={() => setSelected(item)}><FiTrash2 /></button></td></tr>
                ))}</tbody>
              </table>
            )}
            <Pagination pagination={state.pagination} onPage={setPage} />
          </div>
        </div>
      </div>
      <ConfirmModal show={!!selected} message={`Delete ${selected?.brandName}?`} onCancel={() => setSelected(null)} onConfirm={confirmDelete} />
    </>
  );
}
