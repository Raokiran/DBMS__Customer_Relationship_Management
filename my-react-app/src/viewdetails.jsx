import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, clientId } = location.state || {};

  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Added CSS styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#b3e0ff', // Sky blue background
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      color: '#0056b3',
      marginBottom: '15px'
    },
    section: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#e6f2ff' // Darker blue for tables
    },
    th: {
      backgroundColor: '#0056b3',
      color: 'white',
      padding: '10px',
      textAlign: 'left'
    },
    td: {
      border: '1px solid #ccc',
      padding: '8px'
    },
    button: {
      backgroundColor: '#0078d7',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      padding: '10px 15px',
      margin: '0 10px 0 0',
      cursor: 'pointer'
    },
    input: {
      width: '100%',
      padding: '6px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '6px'
    }
  };

  useEffect(() => {
    if (clientId) {
      axios.get(`http://localhost:5000/client/${clientId}/details`)
        .then(res => {
          const cleanedData = stripTimeFromDates(res.data);
          setData(cleanedData);
          setFormData(cleanedData);
        })
        .catch(err => console.error('Fetch error:', err));
    }
  }, [clientId]);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  const formatDateForSQL = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatAllDatesForBackend = (obj) => {
    const clone = JSON.parse(JSON.stringify(obj));

    const formatItemDates = (item) => {
      for (let key in item) {
        if (typeof item[key] === 'string' && key.toLowerCase().includes('date')) {
          item[key] = formatDateForSQL(item[key]);
        }
      }
      return item;
    };

    if (clone.client) formatItemDates(clone.client);
    if (clone.contacts) clone.contacts = clone.contacts.map(formatItemDates);
    if (clone.projects) {
      clone.projects = clone.projects.map(project => {
        const updated = formatItemDates(project);
        if (updated.tasks) {
          updated.tasks = updated.tasks.map(formatItemDates);
        }
        return updated;
      });
    }
    if (clone.tickets) clone.tickets = clone.tickets.map(formatItemDates);
    if (clone.interactions) clone.interactions = clone.interactions.map(formatItemDates);
    if (clone.invoices) clone.invoices = clone.invoices.map(formatItemDates);

    return clone;
  };

  const stripTimeFromDates = (obj) => {
    const clone = JSON.parse(JSON.stringify(obj));
    const dateFields = (item) => {
      for (let key in item) {
        if (typeof item[key] === 'string' && key.toLowerCase().includes('date')) {
          item[key] = formatDate(item[key]);
        }
      }
      return item;
    };

    if (clone.client) dateFields(clone.client);
    if (clone.contacts) clone.contacts = clone.contacts.map(dateFields);
    if (clone.projects) {
      clone.projects = clone.projects.map(project => {
        const updated = dateFields(project);
        if (updated.tasks) {
          updated.tasks = updated.tasks.map(dateFields);
        }
        return updated;
      });
    }
    if (clone.tickets) clone.tickets = clone.tickets.map(dateFields);
    if (clone.interactions) clone.interactions = clone.interactions.map(dateFields);
    if (clone.invoices) clone.invoices = clone.invoices.map(dateFields);

    return clone;
  };

  const handleBack = () => {
    navigate('/viewclient', { state: { userId } });
  };

  const handleInputChange = (section, id, field, value, parentId = null) => {
    setFormData(prev => {
      const updated = { ...prev };

      if (section === 'projects' && parentId) {
        updated[section] = updated[section].map(project => {
          if (project.project_id === parentId) {
            return {
              ...project,
              tasks: project.tasks.map(task =>
                task.task_id === id ? { ...task, [field]: value } : task
              )
            };
          }
          return project;
        });
      } else if (section === 'client') {
        updated[section] = { ...updated[section], [field]: value };
      } else {
        updated[section] = updated[section].map(item => {
          const idKey = Object.keys(item).find(k => k.endsWith('_id'));
          return item[idKey] === id ? { ...item, [field]: value } : item;
        });
      }

      return updated;
    });
  };

  const handleConfirm = async () => {
    try {
      const cleaned = formatAllDatesForBackend(formData);
      await axios.put(`http://localhost:5000/client/${clientId}`, cleaned.client);

      for (let contact of cleaned.contacts) {
        await axios.put(`http://localhost:5000/contact/${contact.contact_id}`, contact);
      }

      for (let project of cleaned.projects) {
        const { tasks, ...projectData } = project;
        await axios.put(`http://localhost:5000/project/${project.project_id}`, projectData);
        for (let task of tasks || []) {
          await axios.put(`http://localhost:5000/task/${task.task_id}`, task);
        }
      }

      for (let ticket of cleaned.tickets) {
        await axios.put(`http://localhost:5000/ticket/${ticket.ticket_id}`, ticket);
      }

      for (let interaction of cleaned.interactions) {
        await axios.put(`http://localhost:5000/interaction/${interaction.interaction_id}`, interaction);
      }

      for (let invoice of cleaned.invoices) {
        await axios.put(`http://localhost:5000/invoice/${invoice.invoice_id}`, invoice);
      }

      alert('Changes saved!');
      setEditMode(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const renderClientTable = () => {
    const dropdowns = {
      status: ['Lead', 'Prospect', 'Active', 'Inactive']
    };

    return (
      <div style={styles.section}>
        <h3 style={styles.heading}>Client Info</h3>
        <table style={styles.table}>
          <tbody>
            {Object.entries(formData.client || {}).map(([key, value]) => (
              <tr key={key}>
                <td style={{...styles.td, fontWeight: 'bold'}}>{key}</td>
                <td style={styles.td}>
                  {!editMode || key === 'client_id' || key === 'created_by' ? (
                    key.includes('date') ? formatDate(value) : value
                  ) : dropdowns[key] ? (
                    <select style={styles.select} value={value} onChange={(e) => handleInputChange('client', clientId, key, e.target.value)}>
                      {dropdowns[key].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : key.includes('date') ? (
                    <input style={styles.input} type="date" value={value} onChange={(e) => handleInputChange('client', clientId, key, e.target.value)} />
                  ) : (
                    <input style={styles.input} type="text" value={value} onChange={(e) => handleInputChange('client', clientId, key, e.target.value)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTable = (section, label, editableFields, dropdownFields = {}) => (
    <div style={styles.section}>
      <h3 style={styles.heading}>{label}</h3>
      {formData[section]?.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              {Object.keys(formData[section][0]).map(key => (
                <th key={key} style={styles.th}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formData[section].map(item => {
              const idKey = Object.keys(item).find(k => k.endsWith('_id'));
              return (
                <tr key={item[idKey]}>
                  {Object.entries(item).map(([key, value]) => (
                    <td key={key} style={styles.td}>
                      {!editMode || !editableFields.includes(key) ? (
                        key.includes('date') ? formatDate(value) : value
                      ) : dropdownFields[key] ? (
                        <select style={styles.select} value={value} onChange={(e) => handleInputChange(section, item[idKey], key, e.target.value)}>
                          {dropdownFields[key].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : key.includes('date') ? (
                        <input style={styles.input} type="date" value={value} onChange={(e) => handleInputChange(section, item[idKey], key, e.target.value)} />
                      ) : (
                        <input style={styles.input} type="text" value={value} onChange={(e) => handleInputChange(section, item[idKey], key, e.target.value)} />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Client Details</h2>
      <div style={styles.section}>
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Client ID:</strong> {clientId}</p>
      </div>

      {formData.client && renderClientTable()}
      {renderTable('contacts', 'Contacts', ['name', 'email', 'phone'])}

      {formData.projects && (
        <div style={styles.section}>
          <h3 style={styles.heading}>Projects</h3>
          {formData.projects?.map(project => (
            <div key={project.project_id} style={{marginBottom: '20px'}}>
              <h4 style={{color: '#0056b3'}}>{project.name}</h4>
              <table style={styles.table}>
                <tbody>
                  {Object.entries(project).map(([key, value]) => {
                    if (key === 'tasks') return null;
                    return (
                      <tr key={key}>
                        <td style={{...styles.td, fontWeight: 'bold'}}>{key}</td>
                        <td style={styles.td}>
                          {!editMode ? (
                            key.includes('date') ? formatDate(value) : value
                          ) : key === 'status' ? (
                            <select style={styles.select} value={value} onChange={(e) => handleInputChange('projects', project.project_id, key, e.target.value)}>
                              {['Planned', 'Ongoing', 'Completed'].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : key.includes('date') ? (
                            <input style={styles.input} type="date" value={value} onChange={(e) => handleInputChange('projects', project.project_id, key, e.target.value)} />
                          ) : (
                            <input style={styles.input} value={value} onChange={(e) => handleInputChange('projects', project.project_id, key, e.target.value)} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {project.tasks?.length > 0 ? (
                <div style={{marginTop: '10px'}}>
                  <h5 style={{color: '#0056b3'}}>Tasks</h5>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        {Object.keys(project.tasks[0]).map(k => <th key={k} style={styles.th}>{k}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {project.tasks.map(task => (
                        <tr key={task.task_id}>
                          {Object.entries(task).map(([key, value]) => (
                            <td key={key} style={styles.td}>
                              {!editMode || !['title', 'description', 'status', 'due_date'].includes(key) ? (
                                key.includes('date') ? formatDate(value) : value
                              ) : key === 'status' ? (
                                <select style={styles.select} value={value} onChange={(e) => handleInputChange('projects', task.task_id, key, e.target.value, project.project_id)}>
                                  {['Open', 'In Progress', 'Completed'].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : key.includes('date') ? (
                                <input style={styles.input} type="date" value={value} onChange={(e) => handleInputChange('projects', task.task_id, key, e.target.value, project.project_id)} />
                              ) : (
                                <input style={styles.input} value={value} onChange={(e) => handleInputChange('projects', task.task_id, key, e.target.value, project.project_id)} />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p>No tasks found.</p>}
            </div>
          ))}
        </div>
      )}

      {renderTable('tickets', 'Tickets', ['subject', 'description', 'priority', 'status'], {
        priority: ['Low', 'Medium', 'High', 'Critical'],
        status: ['Open', 'In Progress', 'Resolved']
      })}

      {renderTable('interactions', 'Interactions', ['type', 'notes'], {
        type: ['Call', 'Email', 'Meeting']
      })}

      {renderTable('invoices', 'Invoices', ['amount', 'due_date', 'status'], {
        status: ['Unpaid', 'Paid', 'Overdue']
      })}

      <div style={{ marginTop: '20px' }}>
        <button style={styles.button} onClick={handleBack}>Back</button>
        <button style={styles.button} onClick={() => setEditMode(prev => !prev)}>
          {editMode ? 'Cancel Edit' : 'Edit'}
        </button>
        {editMode && <button style={styles.button} onClick={handleConfirm}>Save Changes</button>}
      </div>
    </div>
  );
}

export default ViewDetails;