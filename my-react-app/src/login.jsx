import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      const { role, user_id } = response.data;

      localStorage.setItem('user_id', user_id);

      if (role.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
      console.error(error);
    }
  };

  const containerStyle = {
    height: '100vh',
    margin: 0,
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
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    textAlign: 'center',
    width: '300px',
  };

  const inputStyle = {
    padding: '10px',
    margin: '10px 0',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
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
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    width: '100%',
    marginTop: '10px',
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 191, 255, 0.7)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={e => Object.assign(e.target.style, hoverStyle)}
            onMouseOut={e => Object.assign(e.target.style, buttonStyle)}
          >
            Login
          </button>
        </form>
        {message && <p style={{ color: 'red', marginTop: '15px' }}>{message}</p>}
      </div>
    </div>
  );
}

export default Login;
