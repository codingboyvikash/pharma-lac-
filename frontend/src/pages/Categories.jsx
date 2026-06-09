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

const initialForm = { categoryName: '', slug: '', status: true };

export default function Categories() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const debounced = useDebounce(search);
  const dispatch = useDispatch();
  const state = useSelector((store) => store.crud.categories || {});

  const load = () => dispatch(fetchList({ resource: 'categories', page, search: debounced }));
  useEffect(() => { load(); }, [dispatch, page, debounced]);

  const submit = async (event) => {
    event.preventDefault();
    if (editing) await api.put(`/categories/${editing}`, form);
    else await api.post('/categories', form);
    setForm(initialForm);
    setEditing(null);
    setToast(`Category ${editing ? 'updated' : 'created'} successfully`);
    load();
  };

  const edit = (category) => {
    setEditing(category._id);
    setForm({ categoryName: category.categoryName, slug: category.slug, status: category.status });
  };

  const confirmDelete = async () => {
    await dispatch(removeItem({ resource: 'categories', id: selected._id }));
    setSelected(null);
    setToast('Category deleted successfully');
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>Category Management</h2><SearchBar value={search} onChange={setSearch} placeholder="Search categories" /></div>
      <div className="row g-3">
        <div className="col-lg-4">
          <form className="form-panel" onSubmit={submit}>
            <h5>{editing ? 'Edit Category' : 'Add Category'}</h5>
            <input className="form-control mb-3" placeholder="Category Name" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} required />
            <input className="form-control mb-3" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" checked={form.status} onChange={(e) => setForm({ ...form, status: e.target.checked })} />
              <label className="form-check-label">Active</label>
            </div>
            <button className="btn btn-primary"><FiPlus /> {editing ? 'Update' : 'Add'} Category</button>
          </form>
        </div>
        <div className="col-lg-8">
          <div className="table-panel">
            {state.loading ? <Loader /> : (
              <table className="table align-middle">
                <thead><tr><th>Name</th><th>Slug</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                <tbody>{(state.items || []).map((item) => (
                  <tr key={item._id}><td>{item.categoryName}</td><td>{item.slug}</td><td>{item.status ? 'Active' : 'Inactive'}</td><td className="text-end"><button className="icon-action" onClick={() => edit(item)}><FiEdit2 /></button><button className="icon-action danger" onClick={() => setSelected(item)}><FiTrash2 /></button></td></tr>
                ))}</tbody>
              </table>
            )}
            <Pagination pagination={state.pagination} onPage={setPage} />
          </div>
        </div>
      </div>
      <ConfirmModal show={!!selected} message={`Delete ${selected?.categoryName}?`} onCancel={() => setSelected(null)} onConfirm={confirmDelete} />
    </>
  );
}
