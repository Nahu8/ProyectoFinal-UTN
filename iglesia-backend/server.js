const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iglesia';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB conectado exitosamente'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Models
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const MinistrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: String, required: true }
}, { timestamps: true });

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);
const Ministry = mongoose.model('Ministry', MinistrySchema);
const Contact = mongoose.model('Contact', ContactSchema);

// Routes

// Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ministries
app.get('/api/ministries', async (req, res) => {
  try {
    const ministries = await Ministry.find();
    res.json(ministries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ministries', async (req, res) => {
  try {
    const ministry = new Ministry(req.body);
    await ministry.save();
    res.status(201).json(ministry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Mensaje enviado exitosamente', contact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

