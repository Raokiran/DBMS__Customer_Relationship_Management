import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddIssues() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, clientId } = location.state || {};

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Open');
  const [ticketId, setTicketId] = useState('');

  const generateTicketId = () => 'ISU' + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    setTicketId(generateTicketId());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const created_at = new Date().toISOString().split('T')[0];

    try {
      await axios.post('http://localhost:5000/add-ticket', {
        ticket_id: ticketId,
        client_id: clientId,
        subject,
        description,
        priority,
        status,
        created_at,
        assigned_to: userId,
      });

      alert(`Issue ${ticketId} added successfully!`);

      setSubject('');
      setDescription('');
      setPriority('Medium');
      setStatus('Open');
      setTicketId(generateTicketId());
    } catch (err) {
      console.error(err);
      alert('Failed to add issue.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Issue</h2>

        <div style={styles.infoContainer}>
          <p style={styles.infoText}><strong>User ID:</strong> {userId}</p>
          <p style={styles.infoText}><strong>Client ID:</strong> {clientId}</p>
          <p style={styles.infoText}><strong>Issue ID:</strong> {ticketId}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputContainer}>
              <label style={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
                style={styles.input}
              >
                <option value="" disabled>Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.label}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                style={styles.input}
              >
                <option value="" disabled>Select Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <button type="submit" style={styles.button}>Submit Issue</button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/viewclient', { state: { userId } })}
          style={{ ...styles.button, backgroundColor: '#444', marginTop: '15px' }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// CSS-in-JS styles
const styles = {
  page: {
    backgroundColor: '#87CEFA',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '10px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '30px',
    width: '800px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#ffffff',
  },
  infoContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  infoText: {
    color: '#fff',
    margin: '5px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '40px',
    marginBottom: '10px',
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  label: {
    fontSize: '1rem',
    color: '#ffffff',
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '1rem',
    backgroundColor: 'white',
  },
  button: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
};

export default AddIssues;
