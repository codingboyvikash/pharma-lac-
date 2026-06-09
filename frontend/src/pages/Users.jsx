import { useEffect, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Toast from '../components/Toast.jsx';
import useDebounce from '../hooks/useDebounce.js';
import { fetchList, removeItem } from '../redux/slices/crudSlice.js';
import { formatDate } from '../utils/format.js';

export default function Users() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState(null);
  const [toast, setToast] = useState('');
  const debounced = useDebounce(search);
  const dispatch = useDispatch();
  const state = useSelector((store) => store.crud.users || {});

  useEffect(() => {
    dispatch(fetchList({ resource: 'users', page, search: debounced }));
  }, [dispatch, page, debounced]);

  const confirmDelete = async () => {
    await dispatch(removeItem({ resource: 'users', id: selected._id }));
    setSelected(null);
    setToast('User deleted successfully');
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="page-title"><h2>User List</h2><SearchBar value={search} onChange={setSearch} placeholder="Search users" /></div>
      <div className="table-panel">
        {state.loading ? <Loader /> : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {(state.items || []).map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                    <td><span className={`badge ${user.status ? 'text-bg-success' : 'text-bg-secondary'}`}>{user.status ? 'Active' : 'Inactive'}</span></td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="text-end">
                      <button className="icon-action" onClick={() => setView(user)}><FiEye /></button>
                      <button className="icon-action danger" onClick={() => setSelected(user)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination pagination={state.pagination} onPage={setPage} />
      </div>
      {view && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setView(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {view.name}
                </p>
                <p>
                  <strong>Email:</strong> {view.email}
                </p>
                <p>
                  <strong>Phone:</strong> {view.phone || "-"}
                </p>
                <p>
                  <strong>Joined:</strong> {formatDate(view.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal show={!!selected} message={`Delete ${selected?.name}?`} onCancel={() => setSelected(null)} onConfirm={confirmDelete} />
    </>
  );
}
