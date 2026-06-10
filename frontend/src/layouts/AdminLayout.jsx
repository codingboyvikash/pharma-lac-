import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiBarChart2,
  FiBox,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSettings,
  FiSun,
  FiTag,
  FiUsers
} from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice.js';

const links = [
  { to: '/', label: 'Dashboard', icon: FiBarChart2 },
  { to: '/users', label: 'User List', icon: FiUsers },
  { to: '/categories', label: 'Category Management', icon: FiGrid },
  { to: '/brands', label: 'Brand Management', icon: FiTag },
  { to: '/products', label: 'Product Management', icon: FiBox },
  { to: '/pages', label: 'Manage Pages', icon: FiLayers },
  { to: '/settings', label: 'Settings', icon: FiSettings }
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem('darkMode') === 'true');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('darkMode', String(dark));
  }, [dark]);

  const signOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className={`admin-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">Commerce Admin</div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className="sidebar-link">
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
          <button className="sidebar-link btn-plain" onClick={signOut}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">
            <FiMenu />
          </button>
          <div className="ms-auto d-flex align-items-center gap-2">
            {/* <button className="icon-btn" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
              {dark ? <FiSun /> : <FiMoon />}
            </button> */}
            <div className="user-chip">
              <a href="https://pharma-lac-gamma.vercel.app/" target="_blank" rel="noopener noreferrer">
                🌐 Visit Website
              </a>
            </div>
            <div className="user-chip">{user?.name || 'Admin'}</div>
          </div>
        </header>
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
