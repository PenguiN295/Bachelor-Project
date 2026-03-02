import React, { useState, type ChangeEvent} from 'react';
import { useLogin } from '../hooks/useLogin';


const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const {error,login,loading } = useLogin();
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    login(credentials);
  }
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        
        {error && <div className="alert alert-danger py-2">{error.message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              required
              disabled={loading}
              value={credentials.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              required
              disabled={loading}
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading} >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        <div className="text-left mt-3">
          <small>No Account? <a href="/register">Register here</a></small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;