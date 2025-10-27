import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskIcon, EyeIcon, EyeOffIcon, LogInIcon } from './Icon';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!credentials.username.trim() || !credentials.password.trim()) {
        setError('Please enter both username and password');
        setLoading(false);
        return;
      }

      // Simulate API call to verify credentials
      // In a real app, you'd make an actual API call here
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'password123') {
          // Store credentials in localStorage for API calls
          const token = btoa(`${credentials.username}:${credentials.password}`);
          localStorage.setItem('authToken', token);
          localStorage.setItem('isAuthenticated', 'true');
          onLogin(true);
        } else {
          setError('Invalid username or password');
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="login-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="login-brand">
            <div className="brand-icon-large">
              <TaskIcon size={32} />
            </div>
            <h1>TaskFlow</h1>
          </div>
          <p className="login-subtitle">Welcome back to your task management dashboard</p>
        </motion.div>

        {/* Login Form */}
        <motion.form 
          className="login-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-container">
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.button
            type="submit"
            className="login-button"
            disabled={loading || !credentials.username || !credentials.password}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <LogInIcon size={20} />
                Sign In
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Demo Credentials */}
        {/* <motion.div 
          className="demo-credentials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="demo-header">
            <span>Demo Credentials</span>
          </div>
          <div className="credentials-list">
            <div className="credential-item">
              <span className="credential-label">Username:</span>
              <span className="credential-value">admin</span>
            </div>
            <div className="credential-item">
              <span className="credential-label">Password:</span>
              <span className="credential-value">password123</span>
            </div>
          </div>
        </motion.div> */}
      </motion.div>

      {/* Background Elements */}
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
};

export default Login;