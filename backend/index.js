const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Create database connection
const CreateConnection = require('./db');

// ------------------------------ LOGIN ROUTE --------------------------------------
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Create a database connection
    const connection = await CreateConnection();

    // Query the users table to find the user
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    // If no user is found
    if (rows.length === 0) {
      await connection.end();
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Get the user details
    const user = rows[0];

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await connection.end();
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Close the connection after the query is done
    await connection.end();

    // Return response with role and user_id
    return res.json({ message: 'Login successful', role: user.role, user_id: user.user_id });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// ------------------------------ REGISTER ROUTE --------------------------------------
app.post('/register', async (req, res) => {
    const { user_id, username, name, email, password, phone, role } = req.body;
  
    // Basic validation
    if (!user_id || !username || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'All fields except name are required', success: false });
    }
  
    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format', success: false });
    }
  
    // Validate phone number format (10-15 digits)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be between 10 to 15 digits', success: false });
    }
  
    // Validate role
    const allowedRoles = ['admin', 'sales', 'dev', 'support'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected', success: false });
    }
  
    try {
      const connection = await CreateConnection();
  
      // Check if username, email, or phone already exists
      const [existing] = await connection.execute(
        'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?',
        [username, email, phone]
      );
  
      if (existing.length > 0) {
        await connection.end();
        return res.status(400).json({ message: 'Username, email, or phone already exists', success: false });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await connection.execute(
        'INSERT INTO users (user_id, username, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, username, name, email, hashedPassword, phone, role]
      );
  
      await connection.end();
      return res.status(201).json({ message: 'User registered successfully', success: true });
  
    } catch (error) {
      console.error('Registration error:', error);
  
      // Handle MySQL duplicate entry (just in case)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Duplicate entry found', success: false });
      }
  
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
  });
  // ------------------------------ add client details --------------------------------------
  app.post('/add-client', async (req, res) => {
    const {
      client_id,
      company_name,
      industry,
      status,
      created_by,
      contact_id,
      contact_name,
      contact_email,
      contact_phone,
    } = req.body;
  
    // Validate required fields
    if (!client_id || !company_name || !status || !created_by || !contact_id || !contact_name || !contact_email || !contact_phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (client and contact details)',
      });
    }
  
    // Validate ENUM status
    const validStatuses = ['Lead', 'Prospect', 'Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be one of: Lead, Prospect, Active, Inactive.',
      });
    }
  
    // Validate email and phone formats
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^[0-9]{10,20}$/;
  
    if (!emailRegex.test(contact_email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid contact email format.',
      });
    }
  
    if (!phoneRegex.test(contact_phone)) {
      return res.status(400).json({
        success: false,
        message: 'Contact phone must be between 10 and 20 digits.',
      });
    }
  
    try {
      const connection = await CreateConnection();
  
      // Check if client_id already exists
      const [existingClient] = await connection.execute(
        'SELECT client_id FROM clients WHERE client_id = ?',
        [client_id]
      );
      if (existingClient.length > 0) {
        await connection.end();
        return res.status(409).json({
          success: false,
          message: 'Client ID already exists.',
        });
      }
  
      // Check if contact_id already exists
      const [existingContact] = await connection.execute(
        'SELECT contact_id FROM ClientContacts WHERE contact_id = ?',
        [contact_id]
      );
      if (existingContact.length > 0) {
        await connection.end();
        return res.status(409).json({
          success: false,
          message: 'Contact ID already exists.',
        });
      }
  
  
      await connection.execute(
        `INSERT INTO clients (client_id, company_name, industry, status, created_by)
         VALUES (?, ?, ?, ?, ?)`,
        [client_id, company_name, industry, status, created_by]
      );
  
      // Insert into ClientContacts
      await connection.execute(
        `INSERT INTO ClientContacts (contact_id, client_id, name, email, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [contact_id, client_id, contact_name, contact_email, contact_phone]
      );
  
      await connection.end();
      return res.status(201).json({
        success: true,
        message: 'Client and contact added successfully.',
      });
  
    } catch (error) {
      console.error('Error adding client and contact:', error);
  
      // MySQL duplicate entry error
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Duplicate entry found. Client or contact already exists.',
        });
      }
  
      // Foreign key violation
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Invalid created_by user_id or client_id (foreign key constraint failed).',
        });
      }
  
      // Other MySQL errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
        error: error.message,
      });
    }
  });
  // ------------------------------ Get Clients by user_id --------------------------------------
 // Fetch clients for a specific user
app.get('/get-clients/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const connection = await CreateConnection();
  
 
      const [clients] = await connection.execute(
        'SELECT client_id, company_name, status FROM clients WHERE created_by = ?',
        [userId]
      );
  
      await connection.end();
  
      if (clients.length === 0) {
        return res.status(404).json({ message: 'No clients found for this user' });
      }
  
      return res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
// ------------------------------ ADD INTERACTION ROUTE --------------------------------------
app.post('/add-interaction', async (req, res) => {
    const {
      interaction_id,
      client_id,
      type,
      notes,
      date_of_interaction,
      user_id
    } = req.body;
  
    if (!interaction_id || !client_id || !type || !notes || !date_of_interaction || !user_id) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    const allowedTypes = ['Call', 'Email', 'Meeting'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid interaction type.' });
    }
  
    try {
      const connection = await CreateConnection();
  
      await connection.execute(
        `INSERT INTO Interactions 
        (interaction_id, client_id, type, notes, date_of_interaction, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [interaction_id, client_id, type, notes, date_of_interaction, user_id]
      );
  
      await connection.end();
      return res.status(201).json({ success: true, message: 'Interaction added successfully' });
  
    } catch (error) {
      console.error('Error adding interaction:', error);
  
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Invalid client_id or user_id (foreign key constraint failed).',
        });
      }
  
      return res.status(500).json({
        success: false,
        message: 'Internal server error.',
        error: error.message,
      });
    }
  });
  
  app.post('/add-project', async (req, res) => {
    const {
      project_id,
      client_id,
      name,
      description,
      start_date,
      end_date,
      status
    } = req.body;
  
    if (!project_id || !client_id || !name || !description || !start_date || !end_date || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    const validStatuses = ['Planned', 'Ongoing', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid project status.' });
    }
  
    try {
      const connection = await CreateConnection();
  
      await connection.execute(
        `INSERT INTO Projects 
          (project_id, client_id, name, description, start_date, end_date, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [project_id, client_id, name, description, start_date, end_date, status]
      );
  
      await connection.end();
      return res.status(201).json({ success: true, message: 'Project added successfully' });
  
    } catch (error) {
      console.error('Error adding project:', error);
  
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Project ID already exists.' });
      }
  
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'Invalid client ID (foreign key constraint).' });
      }
  
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  
  // ------------------------------ ADD ISSUES --------------------------------------

  app.post('/add-ticket', async (req, res) => {
    const {
      ticket_id,
      client_id,
      subject,
      description,
      priority,
      status,
      created_at,
      assigned_to
    } = req.body;
  
    if (!ticket_id || !client_id || !subject || !description || !priority || !status || !created_at || !assigned_to) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    const validStatuses = ['Open', 'In Progress', 'Resolved'];
  
    if (!validPriorities.includes(priority) || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid priority or status.' });
    }
  
    try {
      const connection = await CreateConnection();
  
      await connection.execute(
        `INSERT INTO Tickets (ticket_id, client_id, subject, description, priority, status, created_at, assigned_to)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ticket_id, client_id, subject, description, priority, status, created_at, assigned_to]
      );
  
      await connection.end();
      return res.status(201).json({ success: true, message: 'Ticket added successfully' });
  
    } catch (error) {
      console.error('Error adding ticket:', error);
  
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'Invalid client_id or assigned_to (foreign key constraint).' });
      }
  
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  // ------------------------------ Add invoice--------------------------------------
  app.post('/add-invoice', async (req, res) => {
    const { invoice_id, client_id, amount, due_date, status } = req.body;
  
    if (!invoice_id || !client_id || !amount || !due_date || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
  
    const allowedStatus = ['Unpaid', 'Paid', 'Overdue'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }
  
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'INSERT INTO Invoices (invoice_id, client_id, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
        [invoice_id, client_id, amount, due_date, status]
      );
      await connection.end();
      return res.status(201).json({ success: true, message: 'Invoice added successfully.' });
    } catch (error) {
      console.error('Error adding invoice:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Invoice ID already exists.' });
      }
      return res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
    }
  });
  // ------------------------------ GET + PUT Client Details --------------------------------------
  app.get('/client/:clientId/details', async (req, res) => {
    const { clientId } = req.params;
    try {
      const connection = await CreateConnection();
  
      const [client] = await connection.execute('SELECT * FROM clients WHERE client_id = ?', [clientId]);
      const [contacts] = await connection.execute('SELECT * FROM ClientContacts WHERE client_id = ?', [clientId]);
      const [projects] = await connection.execute('SELECT * FROM Projects WHERE client_id = ?', [clientId]);
  
      for (let project of projects) {
        const [tasks] = await connection.execute('SELECT * FROM Tasks WHERE project_id = ?', [project.project_id]);
        project.tasks = tasks;
      }
  
      const [tickets] = await connection.execute('SELECT * FROM Tickets WHERE client_id = ?', [clientId]);
      const [interactions] = await connection.execute('SELECT * FROM Interactions WHERE client_id = ?', [clientId]);
      const [invoices] = await connection.execute('SELECT * FROM Invoices WHERE client_id = ?', [clientId]);
  
      await connection.end();
  
      res.json({
        client: client[0],
        contacts,
        projects,
        tickets,
        interactions,
        invoices
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update client
  app.put('/client/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const { company_name, industry, status, created_by, created_at } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE clients SET company_name = ?, industry = ?, status = ?, created_by = ?, created_at = ? WHERE client_id = ?',
        [company_name, industry, status, created_by, created_at, clientId]
      );
      await connection.end();
      res.json({ message: 'Client updated successfully' });
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update contact
  app.put('/contact/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE ClientContacts SET name = ?, email = ?, phone = ? WHERE contact_id = ?',
        [name, email, phone, contactId]
      );
      await connection.end();
      res.json({ message: 'Contact updated successfully' });
    } catch (error) {
      console.error('Error updating contact:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update project
  app.put('/project/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { name, description, start_date, end_date, status } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE Projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE project_id = ?',
        [name, description, start_date, end_date, status, projectId]
      );
      await connection.end();
      res.json({ message: 'Project updated successfully' });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update task
  app.put('/task/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, due_date } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE Tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE task_id = ?',
        [title, description, status, due_date, taskId]
      );
      await connection.end();
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update ticket
  app.put('/ticket/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    const { subject, description, priority, status } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE Tickets SET subject = ?, description = ?, priority = ?, status = ? WHERE ticket_id = ?',
        [subject, description, priority, status, ticketId]
      );
      await connection.end();
      res.json({ message: 'Ticket updated successfully' });
    } catch (error) {
      console.error('Error updating ticket:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update interaction
  app.put('/interaction/:interactionId', async (req, res) => {
    const { interactionId } = req.params;
    const { type, notes, date_of_interaction } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE Interactions SET type = ?, notes = ?, date_of_interaction = ? WHERE interaction_id = ?',
        [type, notes, date_of_interaction, interactionId]
      );
      await connection.end();
      res.json({ message: 'Interaction updated successfully' });
    } catch (error) {
      console.error('Error updating interaction:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update invoice
  app.put('/invoice/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const { amount, due_date, status } = req.body;
    try {
      const connection = await CreateConnection();
      await connection.execute(
        'UPDATE Invoices SET amount = ?, due_date = ?, status = ? WHERE invoice_id = ?',
        [amount, due_date, status, invoiceId]
      );
      await connection.end();
      res.json({ message: 'Invoice updated successfully' });
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
// ------------------------------ Add Task --------------------------------------
app.post('/addtask', async (req, res) => {
  const { task_id, project_id, assigned_to, title, description, status, due_date } = req.body;

  if (!task_id || !project_id || !assigned_to || !title || !due_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const connection = await CreateConnection();

    await connection.execute(
      `INSERT INTO Tasks (task_id, project_id, assigned_to, title, description, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [task_id, project_id, assigned_to, title, description, status, due_date]
    );

    await connection.end();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Add Task error:', error);
    res.status(500).json({ message: 'Failed to add task' });
  }
});
// ------------------------------ GET USERS ROUTE --------------------------------------
app.get('/users', async (req, res) => {
  try {
    const connection = await CreateConnection();

    const [rows] = await connection.execute(
      'SELECT user_id, username, name, email, phone, role, created_at FROM users'
    );

    await connection.end();

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/get-user-report', async (req, res) => {
  const { user_id } = req.body;

  try {
    const connection = await CreateConnection();

    // Get all clients created by this user
    const [clients] = await connection.execute(
      `SELECT * FROM clients WHERE created_by = ?`, [user_id]
    );

    for (let client of clients) {
      const [contacts] = await connection.execute(`SELECT * FROM clientcontacts WHERE client_id = ?`, [client.client_id]);
      const [projects] = await connection.execute(`SELECT * FROM projects WHERE client_id = ?`, [client.client_id]);
      const [tickets] = await connection.execute(`SELECT * FROM tickets WHERE client_id = ?`, [client.client_id]);
      const [interactions] = await connection.execute(`SELECT * FROM interactions WHERE client_id = ? AND user_id = ?`, [client.client_id, user_id]);
      const [invoices] = await connection.execute(`SELECT * FROM invoices WHERE client_id = ?`, [client.client_id]);

      for (let project of projects) {
        const [tasks] = await connection.execute(`SELECT * FROM tasks WHERE project_id = ? AND assigned_to = ?`, [project.project_id, user_id]);
        project.tasks = tasks;
      }

      client.contacts = contacts;
      client.projects = projects;
      client.tickets = tickets;
      client.interactions = interactions;
      client.invoices = invoices;
    }

    await connection.end();
    res.json({ success: true, data: clients });

  } catch (error) {
    console.error('Error fetching user report:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ------------------------------ Start the server --------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
