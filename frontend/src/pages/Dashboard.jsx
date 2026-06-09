import { useEffect } from 'react';
import { FiBox, FiGrid, FiTag, FiUsers } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import { fetchDashboard } from '../redux/slices/dashboardSlice.js';
import { formatDate } from '../utils/format.js';

const cards = [
  ['Total Users', 'totalUsers', FiUsers],
  ['Total Categories', 'totalCategories', FiGrid],
  ['Total Brands', 'totalBrands', FiTag],
  ['Total Products', 'totalProducts', FiBox]
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, activities, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <>
      <div className="page-title"><h2>Dashboard</h2></div>
      <div className="row g-3 mb-4">
        {cards.map(([label, key, Icon]) => (
          <div className="col-12 col-sm-6 col-xl-3" key={key}>
            <div className="stat-card">
              <div><p>{label}</p><h3>{stats[key] || 0}</h3></div>
              <Icon />
            </div>
          </div>
        ))}
      </div>
      <div className="table-panel">
        <div className="panel-header"><h5>Recent Activities</h5></div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Activity</th><th>Type</th><th>Date</th></tr></thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activity.message}</td>
                  <td><span className="badge text-bg-light">{activity.type}</span></td>
                  <td>{formatDate(activity.createdAt)}</td>
                </tr>
              ))}
              {!activities.length && <tr><td colSpan="3" className="text-center text-muted">No activity yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
