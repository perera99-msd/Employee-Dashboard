const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// POST /feedback - Save feedback
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

// GET /feedback - Get all feedback sorted by date
app.get('/feedback', (req, res) => {
    const { department } = req.query;
    
    let sql = `SELECT * FROM feedback ORDER BY created_at DESC`;
    let params = [];
    
    if (department) {
        sql = `SELECT * FROM feedback WHERE department = ? ORDER BY created_at DESC`;
        params = [department];
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});