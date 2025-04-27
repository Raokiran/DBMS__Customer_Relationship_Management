import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    role: ''
  });

  const [message, setMessage] = useState('');

  const generateUserId = (role) => {
    const prefixMap = {
      admin: 'ADM',
      sales: 'SAL',
      support: 'SUP',
      dev: 'DEV'
    };
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return prefixMap[role] ? `${prefixMap[role]}${randomNum}` : '';
  };

  useEffect(() => {
    if (formData.role) {
      setFormData(prev => ({
        ...prev,
        user_id: generateUserId(prev.role)
      }));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setMessage(response.data.message);
      if (response.data.success) {
        navigate('/admin');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const containerStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'skyblue',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '40px 50px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    color: '#fff',
    width: '600px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const rowStyle = {
    display: 'flex',
    gap: '50px',
  };

  const halfWidth = {
    flex: 1,
    width:'160px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #00bfff, #1e90ff)',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 191, 255, 0.5)',
    width: '200px',
    alignSelf: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 191, 255, 0.7)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Registration</h2>
        {message && <p style={{ color: 'red', marginBottom: '15px' }}>{message}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>User ID</label>
            <div style={{ ...inputStyle, backgroundColor: 'skyblue' }}>
              {formData.user_id || 'Select a role to generate ID'}
            </div>
          </div>

          <div style={rowStyle}>
            <div style={halfWidth}>
              <label style={labelStyle}>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={halfWidth}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={halfWidth}>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={halfWidth}>
              <label style={labelStyle}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} required />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={halfWidth}>
              <label style={labelStyle}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} required />
            </div>
            <div style={halfWidth}>
              <label style={labelStyle}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={inputStyle} required>
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="dev">Dev</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={e => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={e => Object.assign(e.target.style, buttonStyle)}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
