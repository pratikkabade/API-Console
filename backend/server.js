const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage
let dataStore = [];

// Routes
// Default Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// GET
app.get('/api/data', (req, res) => {
  res.status(200).json({
    message: 'GET request received',
    data: dataStore,
  });
});
app.get('/api/data/:id', (req, res) => {
  // res.status(200).json({
  //   message: 'GET request received',
  //   data: dataStore,
  // });
  const id = parseInt(req.params.id);

  const itemIndex = dataStore.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    res.status(200).json({
      message: `Data for ID ${id}`,
      updatedData: dataStore[itemIndex],
    });
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// POST
app.post('/api/data', (req, res) => {
  const body = req.body;
  if (body && Object.keys(body).length > 0) {
    body.id = dataStore.length + 1; // Add an ID
    dataStore.push(body); // Save data
    console.log('[INFO] Data stored:', dataStore);
    res.status(201).json({ message: 'Data created successfully', data: body });
  } else {
    console.error('[ERROR] Invalid POST request - No body provided');
    res.status(400).json({ message: 'Bad Request: Body is required' });
  }
});


// PUT
app.put('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  const itemIndex = dataStore.findIndex((item) => item.id === id);
  if (itemIndex !== -1 && body && Object.keys(body).length > 0) {
    dataStore[itemIndex] = { ...dataStore[itemIndex], ...body };
    res.status(200).json({
      message: `Data updated for ID ${id}`,
      updatedData: dataStore[itemIndex],
    });
  } else {
    res.status(404).json({ message: 'Data not found or invalid request body' });
  }
});

// DELETE
app.delete('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const itemIndex = dataStore.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    dataStore.splice(itemIndex, 1);
    res.status(200).json({ message: `Data deleted for ID ${id}` });
  } else {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`[INFO] Server running on http://localhost:${PORT}`);
});