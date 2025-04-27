import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddInvoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, clientId } = location.state || {};

  const [invoiceId, setInvoiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const generateInvoiceId = () => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      return `INV${randomNum}`;
    };
    setInvoiceId(generateInvoiceId());
  }, []);

  const handleBack = () => {
    navigate('/viewclient', { state: { userId } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/add-invoice', {
        invoice_id: invoiceId,
        client_id: clientId,
        amount,
        due_date: dueDate,
        status
      });
      if (res.data.success) {
        setIsSubmitted(true);
        alert('Invoice added successfully!');
        window.location.reload();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Error adding invoice');
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Invoice</h2>

        <div style={styles.infoContainer}>
          <p style={styles.infoText}><strong>User ID:</strong> {userId}</p>
          <p style={styles.infoText}><strong>Client ID:</strong> {clientId}</p>
          <p style={styles.infoText}><strong>Invoice ID:</strong> {invoiceId}</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isSubmitted}
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              disabled={isSubmitted}
              style={styles.input}
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitted}
              style={styles.input}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitted} style={styles.button}>
            {isSubmitted ? 'Submitted' : 'Submit Invoice'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBack}
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
  inputContainer: {
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

export default AddInvoice;
