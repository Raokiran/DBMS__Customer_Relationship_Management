// ViewClient.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewClient() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clientId: '',
    status: ''
  });

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/get-clients/${userId}`)
        .then((response) => {
          setClients(response.data);
          setFilteredClients(response.data);
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : 'Error fetching clients');
        });
    }
  }, [userId]);

  const handleAddInteraction = (clientId) => {
    navigate('/addinteraction', { state: { userId, clientId } });
  };

  const handleAddProject = (clientId) => {
    navigate('/addproject', { state: { userId, clientId } });
  };

  const handleAddIssue = (clientId) => {
    navigate('/addissue', { state: { userId, clientId } });
  };

  const handleAddInvoice = (clientId) => {
    navigate('/addinvoice', { state: { userId, clientId } });
  };

  const handleViewDetails = (clientId) => {
    navigate('/viewdetails', { state: { userId, clientId } });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      const filtered = clients.filter((client) => {
        return (
          (newFilters.clientId ? client.client_id === newFilters.clientId : true) &&
          (newFilters.status ? client.status === newFilters.status : true)
        );
      });
      setFilteredClients(filtered);
      return newFilters;
    });
  };

  // --- STYLES ---
  const containerStyle = {
    padding: '1rem',
    background: 'skyblue',
    height: '100%',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  };

  const filterContainerStyle = {
    marginBottom: '1rem',
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
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
    width: '250px',
    marginBottom: '10px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 191, 255, 0.5)',
    overflow: 'hidden',
  };

  const tableHeaderStyle = {
    textAlign: 'center',
    padding: '10px',
    fontWeight: 'bold',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.7)',
  };

  const tableCellStyle = {
    textAlign: 'center',
    padding: '10px',
    color: 'white',
  };

  const buttonStyle = {
    padding: '8px 12px',
    fontSize: '14px',
    background: 'linear-gradient(145deg, #1e90ff, #4682b4)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(30, 144, 255, 0.5)',
    margin: '2px',
    transition: 'all 0.3s ease',
  };

  const headingStyle = {
    textAlign: 'center',
    color: 'white',
    fontSize: '2rem',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>View Client</h2>
      {userId ? (
        <div>
          <p style={{ textAlign: 'center', color: 'white' }}>User ID: {userId}</p>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <div style={filterContainerStyle}>
            <div>
              <div style={filterTitleStyle}>Filter by Client:</div>
              <select
                name="clientId"
                value={filters.clientId}
                onChange={handleFilterChange}
                style={selectStyle}
              >
                <option value="">All</option>
                {clients.map((client) => (
                  <option key={client.client_id} value={client.client_id}>
                    {client.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={filterTitleStyle}>Filter by Status:</div>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={selectStyle}
              >
                <option value="">All</option>
                <option value="Lead">Lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {filteredClients.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Client ID</th>
                  <th style={tableHeaderStyle}>Company Name</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.client_id}>
                    <td style={tableCellStyle}>{client.client_id}</td>
                    <td style={tableCellStyle}>{client.company_name}</td>
                    <td style={tableCellStyle}>{client.status}</td>
                    <td style={tableCellStyle}>
                      <button style={buttonStyle} onClick={() => handleAddInteraction(client.client_id)}>Add Interaction</button>
                      <button style={buttonStyle} onClick={() => handleAddProject(client.client_id)}>Add Project</button>
                      <button style={buttonStyle} onClick={() => handleAddIssue(client.client_id)}>Add Issue</button>
                      <button style={buttonStyle} onClick={() => handleAddInvoice(client.client_id)}>Add Invoice</button>
                      <button style={buttonStyle} onClick={() => handleViewDetails(client.client_id)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: 'white' }}>No clients found.</p>
          )}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'white' }}>No user ID found</p>
      )}
    </div>
  );
}

export default ViewClient;
