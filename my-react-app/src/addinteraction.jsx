import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AddInteraction() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, clientId } = location.state || {};

  const [interactionData, setInteractionData] = useState({
    type: '',
    notes: '',
  });

  const handleChange = (e) => {
    setInteractionData({
      ...interactionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const interaction_id = `INT${randomNum}`;

    const payload = {
      interaction_id,
      client_id: clientId,
      user_id: userId,
      date_of_interaction: new Date().toISOString().split('T')[0],
      ...interactionData,
    };

    try {
      const response = await fetch('http://localhost:5000/add-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Interaction added successfully');
        navigate('/viewclient', { state: { userId } });
      } else {
        alert(result.message || 'Failed to add interaction');
      }
    } catch (error) {
      console.error('Error submitting interaction:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Interaction</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>User ID</label>
                <input
                  value={userId}
                  readOnly
                  style={styles.input}
                />
              </div>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Client ID</label>
                <input
                  value={clientId}
                  readOnly
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Interaction Type</label>
                <select
                  name="type"
                  value={interactionData.type}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select Type</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Notes</label>
                <textarea
                  name="notes"
                  value={interactionData.notes}
                  onChange={handleChange}
                  required
                  style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <button type="submit" style={styles.button}>Add Interaction</button>
        </form>
      </div>
    </div>
  );
}

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
    width: '700px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: '30px',
  },
  row: {
    display: 'flex',
    gap: '40px',
    marginBottom: '20px',
  },
  inputContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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

export default AddInteraction;
