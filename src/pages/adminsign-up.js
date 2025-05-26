import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  // Set your admin access password here
  const ADMIN_ACCESS_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "CampusNestAdmin123!";

  // Check if admin already exists on component mount
  useEffect(() => {
    const checkAdmin = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const admins = querySnapshot.docs.filter(doc => doc.data().isAdmin === true);
      setAdminExists(admins.length > 0);
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (adminExists) {
      return setError("Admin account already exists");
    }

    if (adminPassword !== ADMIN_ACCESS_PASSWORD) {
      return setError("Invalid admin access password");
    }

    setLoading(true);
    
    try {
      // Create the auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store admin status in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        isAdmin: true,
        createdAt: new Date().toISOString()
      });
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (adminExists) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-warning">
          Admin account already exists. Please log in instead.
        </div>
        <button 
          onClick={() => navigate('/login')} 
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center">Admin Account Setup</h3>
              <p className="text-center mb-0">First-time setup only</p>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Admin Access Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                  <small className="text-muted">
                    Enter the special admin password to create the first admin account
                  </small>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;