// server.js - Node.js server for handling authentication

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'manga-comic-secret-key';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// User data file path
const userDataPath = path.join(dataDir, 'users.json');

// Initialize users.json if it doesn't exist
if (!fs.existsSync(userDataPath)) {
  fs.writeFileSync(userDataPath, JSON.stringify({ users: [] }));
}

// Helper function to read user data
function readUserData() {
  const data = fs.readFileSync(userDataPath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write user data
function writeUserData(data) {
  fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2));
}

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }
    
    // Read existing user data
    const userData = readUserData();
    
    // Check if email already exists
    if (userData.users.some(user => user.email === email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email đã được sử dụng' 
      });
    }
    
    // Check if username already exists
    if (userData.users.some(user => user.username === username)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên người dùng đã được sử dụng' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      registeredAt: new Date().toISOString(),
      history: []
    };
    
    userData.users.push(newUser);
    
    // Save updated user data
    writeUserData(userData);
    
    res.status(201).json({ success: true, message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ, vui lòng thử lại sau' 
    });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin đăng nhập' 
      });
    }
    
    // Read user data
    const userData = readUserData();
    
    // Find user by email
    const user = userData.users.find(user => user.email === email);
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không chính xác' 
      });
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không chính xác' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      username: user.username,
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ, vui lòng thử lại sau' 
    });
  }
});

// Verify token endpoint
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({ valid: true, userId: req.userId });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  // In a real app, you might invalidate the token on the server
  // For this simple implementation, we'll just return success
  res.json({ success: true });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ valid: false });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ valid: false });
    }
    
    req.userId = decoded.userId;
    next();
  });
}

// Route for serving the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});