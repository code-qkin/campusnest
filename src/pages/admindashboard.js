import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authen';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch admin stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get properties count
        const propertiesQuery = query(collection(db, 'properties'));
        const propertiesSnapshot = await getDocs(propertiesQuery);
        
        // Get users count
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        
        // Get bookings count
        const bookingsQuery = query(collection(db, 'bookings'));
        const bookingsSnapshot = await getDocs(bookingsQuery);

        setStats({
          properties: propertiesSnapshot.size,
          users: usersSnapshot.size,
          bookings: bookingsSnapshot.size
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Properties</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <p className="card-text display-4">{stats.properties}</p>
              )}
              <Link to="/admin/properties" className="text-white">
                Manage Properties
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <p className="card-text display-4">{stats.users}</p>
              )}
              <Link to="/admin/users" className="text-white">
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <p className="card-text display-4">{stats.bookings}</p>
              )}
              <Link to="/admin/bookings" className="text-white">
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h4>Quick Actions</h4>
        </div>
        <div className="card-body">
          <div className="d-grid gap-2 d-md-flex">
            <Link to="/admin/properties/new" className="btn btn-primary me-md-2">
              Add New Property
            </Link>
            <Link to="/admin/users/new" className="btn btn-secondary me-md-2">
              Create New User
            </Link>
            <Link to="/admin/reports" className="btn btn-success">
              Generate Reports
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Recent Activity</h4>
        </div>
        <div className="card-body">
          <p>Admin activity log will appear here</p>
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>User</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Logged in</td>
                <td>{currentUser?.email}</td>
                <td>Just now</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;