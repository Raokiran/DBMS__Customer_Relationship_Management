import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function User() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    console.log('User ID retrieved in User:', storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.log('User ID not found in localStorage');
    }
  }, []);

  if (!userId) {
    return <div style={styles.page}><div style={styles.loading}>Loading...</div></div>;
  }

  const handleAddClient = () => {
    navigate('/addclient', { state: { userId } });
  };

  const handleViewClient = () => {
    navigate('/viewclient', { state: { userId } });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>User Panel</h2>
        <p style={styles.subHeading}>Hello, {userId}</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleAddClient}>Add Client</button>
          <button style={styles.button} onClick={handleViewClient}>View Client</button>
        </div>
      </div>
    </div>
  );
}

// CSS-in-JS Styles
const styles = {
  page: {
    backgroundColor: '#87CEFA', // Sky blue background
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  loading: {
    fontSize: '1.5rem',
    color: '#fff',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '40px',
    width: '350px',
    textAlign: 'center',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#ffffff',
  },
  subHeading: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#ffffff',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
};

export default User;
