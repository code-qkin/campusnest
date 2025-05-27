import '../css/signup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faUser, faHouse, faKey } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [institution, setInstitution] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [loadingAdminCheck, setLoadingAdminCheck] = useState(true);

  const navigate = useNavigate();
  const ADMIN_ACCESS_PASSWORD = "CampusNestAdmin123!";

  useEffect(() => {
    const checkAdmin = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const admins = querySnapshot.docs.filter(doc => doc.data().isAdmin === true);
      setAdminExists(admins.length > 0);
      setLoadingAdminCheck(false);
    };
    checkAdmin();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!adminExists && adminPassword !== ADMIN_ACCESS_PASSWORD) {
      return setError("Invalid admin access password.");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        fullname,
        username,
        institution,
        isAdmin: !adminExists,
        createdAt: new Date().toISOString()
      });

      if (!adminExists) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card p-4 shadow signup-card text-center">
              <div className="mb-3">
                <Link to='/' className="text-decoration-none" style={{ color: '#244a71' }}>
                  <i className="fas fa-home fa-2x text-primary"></i>
                  <h3 className="mt-2 text-me fw-bold"><FontAwesomeIcon icon={faHouse} /> Campus Nest</h3>
                </Link>
              </div>
              <h4 className="mb-4">Register</h4>
              <form onSubmit={handleSignUp}>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faUser} /></span>
                  <input type="text" className="form-control border-start-0" placeholder="Fullname" onChange={(e) => setFullname(e.target.value)} required />
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faUser} /></span>
                  <input type="text" className="form-control border-start-0" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faEnvelope} /></span>
                  <input type="email" className="form-control border-start-0" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <select className="form-select" value={institution} onChange={(e) => setInstitution(e.target.value)} required>
                    <option value="">Select your Institution</option>
                    <option value="futa">Federal University Of Technology Akure (FUTA)</option>
                  </select>
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faKey} /></span>
                  <input type="password" className="form-control border-start-0" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3 input-group">
                  <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faKey} /></span>
                  <input type="password" className="form-control border-start-0" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>

                {!adminExists && (
                  <div className="mb-3 input-group">
                    <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faKey} /></span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      placeholder="Admin Access Password"
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-2 form-check text-start">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" required />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    I agree to the <a href="#" className='text-decoration-none fw-bold' style={{ color: '#244a71' }}>Terms of Service</a> and <a href="#" className='text-decoration-none fw-bold' style={{ color: '#244a71' }}>Privacy Policy</a>
                  </label>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>

              <p className="mt-3 small text-muted">
                Already have an account? <Link className='fw-bold text-decoration-none' to='/login' style={{ color: '#244a71' }}>Sign in here</Link>
              </p>

              {!loadingAdminCheck && !adminExists && (
                <div className="mt-4 border-top pt-3">
                  <p className="text-muted">Need to setup the first admin account?</p>
                  <Link to="/admin/signup" className="btn btn-outline-primary">
                    Setup Admin Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
