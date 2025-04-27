import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ViewReport() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.post('http://localhost:5000/get-user-report', { user_id: userId })
        .then(res => setClients(res.data.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  const renderTable = (items, columns) => {
    if (!items || items.length === 0) return <p>No result found</p>;
    return (
      <table style={styles.table}>
        <thead>
          <tr>{columns.map(col => <th key={col} style={styles.th}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              {columns.map(col => <td key={col} style={styles.td}>{item[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>View Report</h2>
      <p style={styles.subHeading}>Report for User ID: {userId}</p>

      {clients.map((client, i) => (
        <div key={i} style={styles.card}>
          <h1 style={styles.clientHeading}>Client: {client.company_name} ({client.client_id})</h1>

          <h3 style={styles.sectionHeading}>Contacts</h3>
          {renderTable(client.contacts, ['contact_id', 'name', 'email', 'phone'])}

          <h3 style={styles.sectionHeading}>Tickets</h3>
          {renderTable(client.tickets, ['ticket_id', 'subject', 'priority', 'status', 'created_at'])}

          <h3 style={styles.sectionHeading}>Interactions</h3>
          {renderTable(client.interactions, ['interaction_id', 'type', 'notes', 'date_of_interaction'])}

          <h3 style={styles.sectionHeading}>Invoices</h3>
          {renderTable(client.invoices, ['invoice_id', 'amount', 'due_date', 'status'])}

          <h3 style={styles.sectionHeading}>Projects</h3>
          {client.projects.length === 0 ? <p>No result found</p> :
            client.projects.map((project, j) => (
              <div key={j}>
                <h4 style={styles.projectHeading}>Project: {project.name} ({project.project_id})</h4>
                {renderTable([project], ['project_id', 'name', 'status', 'start_date', 'end_date'])}

                <h5 style={styles.taskHeading}>Tasks</h5>
                {renderTable(project.tasks, ['task_id', 'title', 'status', 'due_date'])}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

// CSS-in-JS Styles
const styles = {
  page: {
    backgroundColor: '#87CEFA', // Sky blue background
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subHeading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  clientHeading: {
    fontSize: '1.5rem',
    marginBottom: '15px',
  },
  sectionHeading: {
    fontSize: '1.2rem',
    marginTop: '20px',
    marginBottom: '10px',
  },
  projectHeading: {
    fontSize: '1rem',
    marginTop: '15px',
  },
  taskHeading: {
    fontSize: '0.9rem',
    marginTop: '10px',
    marginBottom: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker semi-transparent table background
    color: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  th: {
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker for thead
    fontWeight: 'bold',
    textAlign: 'left',
  },
  td: {
    padding: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  }
};

export default ViewReport;
