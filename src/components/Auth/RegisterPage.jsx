import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, CheckCircle, ArrowRight, Gift } from 'lucide-react';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Inline Validation
  useEffect(() => {
    const newErrors = {};
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);

    // Password Strength Logic
    let strength = 0;
    if (formData.password.length > 5) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await fetch('http://127.0.0.1/ecommerce_project2/backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(true);
        setMessage({ text: 'Account created successfully!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Connection error', type: 'error' });
    }
  };

  if (isRegistered) {
    return (
      <div className="auth-page">
        <div className="coupon-box fade-in">
          <Gift size={50} className="coupon-icon" />
          <h2>Welcome to ShopSphere!</h2>
          <p>Your account has been created successfully.</p>
          <div className="coupon-code">
            <span>Use code:</span>
            <strong>WELCOME10</strong>
          </div>
          <p className="coupon-hint">Get 10% off your first order!</p>
          <Link to="/login" className="btn-auth">
            <span>Continue to Login</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <img src="/logo.png" alt="ShopSphere" className="auth-logo" />
          <h1>Create your account</h1>
          <p>Join ShopSphere and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
            {errors.username && <span className="inline-error">{errors.username}</span>}
          </div>

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email ID" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            {errors.email && <span className="inline-error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <div className="strength-meter">
              <div className={`strength-bar strength-${passwordStrength}`}></div>
            </div>
          </div>

          <div className="input-group">
            <CheckCircle size={18} className="input-icon" />
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
            {errors.confirmPassword && <span className="inline-error">{errors.confirmPassword}</span>}
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="btn-auth" disabled={Object.keys(errors).length > 0}>
            <span>Register</span>
            <UserPlus size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
