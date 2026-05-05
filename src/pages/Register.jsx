import React, { useState } from 'react';
import { PeopleFill, GlobeAmericas, HeartFill } from 'react-bootstrap-icons';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
    console.log(formData);
  };

  return (
    <div className="register-container">
      {/* Left Column - Design/Branding */}
      <div className="register-brand">
        <div className="brand-content">
          <a href="/" className="brand-logo">
            <span className="brand-name">TalaCare</span>
            <span className="brand-dot"></span>
          </a>
          
          <div className="brand-message">
            <h1>Start caring for your family today.</h1>
            <p>Join thousands of Filipino families staying connected through health — no matter the distance.</p>
          </div>

          {/* Decorative floating elements */}
          <div className="floating-elements">
            <div className="float-card float-card-1">
              <span className="float-icon"><PeopleFill/></span>
              <div className="float-text">
                <span className="float-title">Family First</span>
                <span className="float-sub">Health sync for everyone</span>
              </div>
            </div>
            
            <div className="float-card float-card-2">
              <span className="float-icon"><GlobeAmericas/></span>
              <div className="float-text">
                <span className="float-title">Works Anywhere</span>
                <span className="float-sub">Dubai, Singapore, Canada...</span>
              </div>
            </div>
            
            <div className="float-card float-card-3">
              <span className="float-icon"><HeartFill/></span>
              <div className="float-text">
                <span className="float-title">100% Free</span>
                <span className="float-sub">No hidden fees, ever</span>
              </div>
            </div>
          </div>

          {/* Abstract decoration */}
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="register-form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Create your account</h2>
            <p>Get started in less than a minute</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Juan dela Cruz"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <span className="input-hint">At least 8 characters</span>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Create Account
            </button>
          </form>

          <div className="form-footer">
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>

          <div className="form-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn">
              <span>G</span> Google
            </button>
            <button type="button" className="social-btn">
              <span>f</span> Facebook
            </button>
          </div>

          <p className="terms-text">
            By creating an account, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
