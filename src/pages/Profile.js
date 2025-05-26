import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authen';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function Profile() {
  const { currentUser, updateUserEmail, updateUserPassword, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    university: ''
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
            setEmail(currentUser.email || '');
          }
        } catch (err) {
          setError('Failed to load profile');
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update profile in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), profile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Email cannot be empty');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserEmail(email);
      setSuccess('Email updated successfully!');
    } catch (err) {
      setError('Failed to update email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password should be at least 6 characters');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserPassword(password);
      setSuccess('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Failed to update password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (!currentUser) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="container-fluid">
      {/* Main Content */}
      <div className="">
        <div className="card mb-4">
          <div className="card-header">
            <h4>My Profile</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Basic Info Section */}
            <section className="mb-5">
              <h5>Basic Information</h5>
              <form onSubmit={handleProfileUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="university" className="form-label">University</label>
                    <input
                      type="text"
                      className="form-control"
                      id="university"
                      value={profile.university || ''}
                      onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* Email Update Section */}
            <section className="mb-5">
              <h5>Email Address</h5>
              <form onSubmit={handleEmailUpdate}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">New Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            </section>

            {/* Password Update Section */}
            <section>
              <h5>Change Password</h5>
              <form onSubmit={handlePasswordUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Profile;