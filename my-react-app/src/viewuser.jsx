import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    let filtered = users;

    if (nameFilter) {
      filtered = filtered.filter(user => user.user_id === nameFilter);
    }
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [nameFilter, roleFilter, users]);

  const handleBack = () => {
    navigate('/admin', { state: { userId } });
  };

  const handleViewReport = (userId) => {
    navigate('/viewreport', { state: { userId } });
  };

  // Styles
  const containerStyle = {
    padding: '1rem',
    background: 'skyblue',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const filterContainerStyle = {
    marginBottom: '1rem',
    display: 'flex', 
    gap: '20px', 
   
   
  };

  const filterTitleStyle = {
    marginBottom: '0.5rem',
    color: 'white',
    fontSize: '1.2rem',
  };

  const selectStyle = {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '45%', // Adjust width to take 45% of the available space
    marginBottom: '10px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'rgba(0, 0, 0, 0.5)', // Darker background for the table
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 191, 255, 0.5)',
  };

  const tableHeaderStyle = {
    textAlign: 'center',
    padding: '10px',
    fontWeight: 'bold',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.7)', // Darker header background
  };

  const tableCellStyle = {
    textAlign: 'center',
    padding: '10px',
    color: 'white',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    background: 'linear-gradient(145deg, #00bfff, #1e90ff)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 191, 255, 0.5)',
    marginTop: '1rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const viewReportButtonStyle = {
    padding: '8px 16px',
    fontSize: '14px',
    background: 'linear-gradient(145deg, #1e90ff, #4682b4)', // Blue gradient for the button
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(30, 144, 255, 0.5)', // Blue shadow effect
    transition: 'all 0.3s ease',
    marginTop: '0.5rem',
  };

  const [viewReportButtonHover, setViewReportButtonHover] = useState(false);

  const handleMouseEnter = () => {
    setViewReportButtonHover(true);
  };

  const handleMouseLeave = () => {
    setViewReportButtonHover(false);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: 'white' }}>View User Page</h2>
      <p style={{ textAlign: 'center', color: 'white' }}>User ID: {userId}</p>

      <div style={filterContainerStyle}>
        <div>
          <div style={filterTitleStyle}>Filter by User:</div>
          <select value={nameFilter} onChange={e => setNameFilter(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.name || 'Unnamed'} ({user.user_id})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div style={filterTitleStyle}>Filter by Role:</div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={selectStyle}>
            <option value="">All</option>
            {[...new Set([...users.map(u => u.role), 'support'])].map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>User ID</th>
            <th style={tableHeaderStyle}>Username</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Phone</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Created At</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.user_id}>
              <td style={tableCellStyle}>{user.user_id}</td>
              <td style={tableCellStyle}>{user.username}</td>
              <td style={tableCellStyle}>{user.name}</td>
              <td style={tableCellStyle}>{user.email}</td>
              <td style={tableCellStyle}>{user.phone}</td>
              <td style={tableCellStyle}>{user.role}</td>
              <td style={tableCellStyle}>{user.created_at}</td>
              <td style={tableCellStyle}>
                <button
                  style={viewReportButtonHover ? { ...viewReportButtonStyle, background: 'linear-gradient(145deg, #4682b4, #1e90ff)', boxShadow: '0 6px 20px rgba(30, 144, 255, 0.7)' } : viewReportButtonStyle}
                  onClick={() => handleViewReport(user.user_id)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleBack} style={buttonStyle}>Back to Admin</button>
    </div>
  );
}

export default ViewUser;
