const express = require('express');
const cors = require('cors');
const session = require('express-session');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'feedback-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Hardcoded admin credentials (in production, use proper database)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized - Please login' });
    }
};

// Auth check endpoint
app.get('/api/auth/check', (req, res) => {
    res.json({ 
        isAuthenticated: !!req.session.isAuthenticated,
        user: req.session.user 
    });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        req.session.isAuthenticated = true;
        req.session.user = { username, role: 'admin' };
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: { username, role: 'admin' }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
        });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// POST /feedback - Save feedback (Public - no auth required)
app.post('/feedback', (req, res) => {
    const { name, department, message } = req.body;
    
    if (!name || !department || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const sql = `INSERT INTO feedback (name, department, message) VALUES (?, ?, ?)`;
    db.run(sql, [name, department, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            name,
            department,
            message,
            created_at: new Date().toISOString()
        });
    });
});

// GET /feedback - Get all feedback sorted by date (Protected)
app.get('/feedback', requireAuth, (req, res) => {
    const { department, page = 1, limit = 10, search } = req.query;
    
    let sql = `SELECT * FROM feedback WHERE 1=1`;
    let countSql = `SELECT COUNT(*) as total FROM feedback WHERE 1=1`;
    let params = [];
    let countParams = [];
    
    // Department filter
    if (department && department !== 'All Departments') {
        sql += ` AND department = ?`;
        countSql += ` AND department = ?`;
        params.push(department);
        countParams.push(department);
    }
    
    // Search filter
    if (search) {
        sql += ` AND (name LIKE ? OR message LIKE ? OR department LIKE ?)`;
        countSql += ` AND (name LIKE ? OR message LIKE ? OR department LIKE ?)`;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
        countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Ordering
    sql += ` ORDER BY created_at DESC`;
    
    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    // Execute count query first
    db.get(countSql, countParams, (err, countResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Then execute main query
        db.all(sql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.json({
                data: rows,
                pagination: {
                    total: countResult.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(countResult.total / parseInt(limit))
                }
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});