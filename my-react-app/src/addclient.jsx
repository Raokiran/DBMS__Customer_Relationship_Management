import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddClient() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || '';

  const generateId = (prefix) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${randomNum}`;
  };

  const [form, setForm] = useState({
    client_id: '',
    company_name: '',
    industry: '',
    status: 'Lead',
    created_by: userId,
    contact_id: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      client_id: generateId('CLI'),
      contact_id: generateId('CON'),
    }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/add-client', form);
      alert(res.data.message);
      if (res.data.success) {
        navigate('/user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Client</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Client Details */}
          <div style={styles.section}>
            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Client ID</label>
                <input
                  name="client_id"
                  value={form.client_id}
                  readOnly
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Company Name</label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Industry</label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="Lead">Lead</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <h3 style={styles.subHeading}>Contact Details</h3>
          <div style={styles.section}>
            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Contact ID</label>
                <input
                  name="contact_id"
                  value={form.contact_id}
                  readOnly
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Contact Name</label>
                <input
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.inputContainer}>
                <label style={styles.label}>Contact Email</label>
                <input
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Contact Phone</label>
                <input
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <button type="submit" style={styles.button}>Add Client</button>
        </form>
      </div>
    </div>
  );
}

// Updated CSS-in-JS Styles
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
  subHeading: {
    fontSize: '1.5rem',
    marginTop: '10px',
    marginBottom: '10px',
    color: '#ffffff',
    textAlign: 'center',
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
    marginBottom: '8px', // Slightly more space between label and input
  },
  input: {
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '1rem',
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

export default AddClient;
