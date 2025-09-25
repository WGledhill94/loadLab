const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'loadlab-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// In-memory storage (replace with database in production)
let users = [];
let products = require('./data/products.json');
let orders = [];

// Email transporter (mock)
const transporter = nodemailer.createTransporter({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: { user: 'test@loadlab.com', pass: 'password' }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    req.user = null;
    return next();
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
};

// API Routes

// Products API
app.get('/api/products', (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let filteredProducts = [...products];
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// User registration
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, password: hashedPassword, name };
  users.push(user);
  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Checkout (guest or authenticated)
app.post('/api/checkout', authenticateToken, async (req, res) => {
  const { items, customerInfo, paymentInfo } = req.body;
  
  const order = {
    id: uuidv4(),
    userId: req.user?.id || null,
    items,
    customerInfo,
    total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: 'confirmed',
    createdAt: new Date()
  };
  
  orders.push(order);
  
  // Send mock confirmation email
  try {
    await transporter.sendMail({
      from: 'noreply@loadlab.com',
      to: customerInfo.email,
      subject: `Order Confirmation - ${order.id}`,
      html: `
        <h2>Order Confirmed!</h2>
        <p>Order ID: ${order.id}</p>
        <p>Total: $${order.total.toFixed(2)}</p>
        <p>Thank you for your order!</p>
      `
    });
  } catch (error) {
    console.log('Mock email sent:', customerInfo.email);
  }
  
  res.json({ orderId: order.id, status: 'confirmed' });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Health check for load testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});