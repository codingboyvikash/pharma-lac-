import { useEffect, useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice.js';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const submit = (event) => {
    event.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <main className="login-screen">
      <form className="login-panel" onSubmit={submit}>
        <div className="login-icon"><FiLock /></div>
        <h1>Admin Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <label className="form-label">Email</label>
        <input className="form-control mb-3" type="email" required value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
        <label className="form-label">Password</label>
        <input className="form-control mb-4" type="password" required value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
        <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </main>
  );
}
