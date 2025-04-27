import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, clientId } = location.state || {};

  const [projectId, setProjectId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
  });

  // Generate a unique Project ID once
  useEffect(() => {
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    setProjectId('PRO' + randomSixDigit);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/add-project', {
        project_id: projectId,
        client_id: clientId,
        ...formData,
      });

      if (res.data.success) {
        alert('Project added successfully');
        window.location.reload();
      } else {
        alert(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Project</h2>

        <div style={styles.infoContainer}>
          <p style={styles.infoText}><strong>User ID:</strong> {userId}</p>
          <p style={styles.infoText}><strong>Client ID:</strong> {clientId}</p>
          <p style={styles.infoText}><strong>Project ID:</strong> {projectId}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Project Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Planned">Planned</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputContainer}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ ...styles.input, height: '100px', resize: 'vertical' }}
              />
            </div>
          </div>

          <button type="submit" style={styles.button}>Add Project</button>
        </form>

        <button onClick={() => navigate('/viewclient', { state: { userId } })} style={{ ...styles.button, backgroundColor: '#444', marginTop: '15px' }}>
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
  section: {
    marginBottom: '30px',
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

export default AddProject;
