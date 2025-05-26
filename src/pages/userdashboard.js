import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './authen';
import { faFacebook, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faHome, faList, faEnvelope, faBars, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      alert('Failed to log out');
    }
  };

  if (!currentUser) return <div>Loading user data...</div>;

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top shadow-sm px-4" style={{ backgroundColor: '#244a71' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/">
            <FontAwesomeIcon icon={faHouse} /> <span className="ps-2">Campus Nest</span>
          </Link>
          <button className="btn btn-outline-light d-md-none" onClick={() => setSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} />
          </button>

          {/* Show nav items on all screen sizes */}
          <div className="d-flex align-items-center ms-auto">
            <span className="text-white me-3 d-none d-md-block">Welcome, {currentUser.email}</span>
            <Link to='/dashboard/profile' className="btn btn-outline-light me-2">Profile</Link>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Fixed Sidebar for md+ */}
      <div className="d-none d-md-block position-fixed h-100 text-white p-3" style={{ top: '56px', width: '250px', backgroundColor: '#244a71' }}>
        <SidebarContent />
      </div>

      {/* Offcanvas Sidebar for small screens */}
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ backgroundColor: '#244a71', color: 'white', visibility: sidebarOpen ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Dashboard</h5>
          <button type="button" className="btn-close" onClick={() => setSidebarOpen(false)}></button>
        </div>
        <div className="offcanvas-body">
          <SidebarContent onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-fluid" style={{ paddingTop: '56px' }}>
        <div className="row">
          <div className="col-md-3 d-none d-md-block" /> {/* Reserve space for fixed sidebar */}
          <div className="col-md-9 offset-md-3 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarContent({ onClose }) {
  return (
    <>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/dashboard/userhome" className="text-white text-decoration-none" onClick={onClose}>
            <FontAwesomeIcon icon={faHome} className="me-2" /> Home
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/dashboard/listing" className="text-white text-decoration-none" onClick={onClose}>
            <FontAwesomeIcon icon={faList} className="me-2" /> Listings
          </Link>
        </li>
        <li className="nav-item mb-2">
          <FontAwesomeIcon icon={faEnvelope} className="me-2" /> Messages
        </li>
      </ul>
      <div className="d-flex gap-3 mt-4">
        <FontAwesomeIcon icon={faFacebook} />
        <FontAwesomeIcon icon={faInstagram} />
        <FontAwesomeIcon icon={faTwitter} />
        <FontAwesomeIcon icon={faLinkedin} />
      </div>
    </>
  );
}

export default Dashboard;
