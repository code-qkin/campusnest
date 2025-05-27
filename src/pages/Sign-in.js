import '../css/signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from './authen';


function Signin() {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

   async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const { isAdmin } = await login(email, password);
      
      // Redirect based on admin status
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  }
return (
  <div className="login-bg d-flex justify-content-center align-items-center">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-11 col-sm-9 col-md-6 col-lg-5 col-xl-4">
          <div className="card p-4 shadow login-card text-center">
            <div className="mb-3">
              <Link to='/' className="text-decoration-none" style={{ color: '#244a71' }}>
                <i className="fas fa-home fa-2x text-primary"></i>
                <h3 className="mt-2 text-me fw-bold"><FontAwesomeIcon icon={faHouse} /> Campus Nest</h3>
              </Link>
            </div>
            <h4 className="mb-4">Login</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 input-group">
                <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faUser} /></span>
                <input type="email" className="form-control border-start-0" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faKey} /></span>
                <input type="password" className="form-control border-start-0" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Logging In...' : 'Log In'}</button>
              </div>
            </form>
            <p className="mt-3 small text-muted">
              Already have an account? <Link className='fw-bold text-decoration-none' to='/signup' style={{ color: '#244a71' }}>Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Signin;

