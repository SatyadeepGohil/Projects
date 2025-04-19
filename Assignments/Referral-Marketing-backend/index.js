const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'd9dd55887d6120eee6a13af694f7d092b260576157dbc3d0ad57195da3c0283648b5ac506e130a98c9e78832a1a8238c16f9a9e57aa228f887d4c2c35cc93c33ee130e421e5d191de02b915f4dc128ce64d0a0762082cba364b905bc08da5641f08c1846096d9e6ea5f54b7612ecb29f9c3f8d99f4ee621da8268f8c98fc9fb3f6b111bc5ea0697ed124bde54097781dc5250a621e7ed9f89168f1a01273034b83808983102c3dba9798502626e20e4bc52a491edc0f982d9573622b436d19c48c8c4585612417a082d1bf37d39178b4d84077c26a022ca04fc5b7d4165cc0cbc544b3ab1539d4572603222410703549245ec6a38c21e6bc9a9b45e040cfb1fe'; // In production, use environment variables

// Mock database for users (replace with a real database in production)
const users = [];

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

// Traditional signup endpoint
app.post('/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name: email.split('@')[0] // Default name from email
        };
        
        users.push(newUser);
        console.log('New user registered:', newUser.email);
        
        // Generate JWT token
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Signup failed:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Traditional login endpoint
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    try {
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        console.log('User logged in:', user.email);
        
        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// List all users (for development purposes only)
app.get('/users', (req, res) => {
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}`);
});