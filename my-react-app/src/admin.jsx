import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Admin() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

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
    padding: '40px 60px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    textAlign: 'center',
  };

  const headingStyle = {
    color: '#ffffff',
    marginBottom: '20px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
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
    margin: '10px',
  };

  const hoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 191, 255, 0.7)',
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  };

  if (!userId) {
    return <div style={containerStyle}><p style={{ color: '#fff' }}>Loading...</p></div>;
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Admin Panel</h2>
        <p style={{ color: '#fff' }}>Hello, {userId}</p>
        <div style={buttonRowStyle}>
          <Link to="/register">
            <button
              style={buttonStyle}
              onMouseOver={e => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={e => Object.assign(e.target.style, buttonStyle)}
            >
              Add Employee
            </button>
          </Link>
          <Link to="/viewuser" state={{ userId }}>
            <button
              style={buttonStyle}
              onMouseOver={e => Object.assign(e.target.style, hoverStyle)}
              onMouseOut={e => Object.assign(e.target.style, buttonStyle)}
            >
              View Employee
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;
