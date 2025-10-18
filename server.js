// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;

// --- Mock Database for POST/GET /user/:id ---
const users = [];
let nextUserId = 1;

// --- MIDDLEWARE ---

// 1. JSON Parsing: Required to read data from POST requests (req.body)
app.use(express.json());

// 2. Custom Middleware (Bonus: Log requests)
const requestLogger = (req, res, next) => {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
};
app.use(requestLogger);

// 3. Static File Serving: Serves index.html at the root '/'
app.use(express.static(__dirname));

// --- ROUTES ---

// GET /status -> "My Week 2 API!" 
// (We use /status since express.static is already handling /)
app.get('/status', (req, res) => {
    res.send('My Week 2 API!');
});

// POST /user -> Accepts {name, email}; responds "Hello, [name]!"
app.post('/user', (req, res) => {
    const { name, email } = req.body;

    // Error handling (400 for missing data)
    if (!name || !email) {
        return res.status(400).json({ error: 'Missing required data: name and email are needed.' });
    }

    // Process and save data
    const newUser = { id: nextUserId++, name, email };
    users.push(newUser);
    console.log('New user created:', newUser);

    // Respond
    res.json({ message: `Hello, ${name}!` });
});

// GET /user/:id -> "User [id] profile"
app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Error handling (ID validation)
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // Find user
    const user = users.find(u => u.id === userId);

    if (user) {
        res.send(`User ${user.id} profile: Name: ${user.name}, Email: ${user.email}`);
    } else {
        // User not found (404)
        res.status(404).json({ error: `User with ID ${userId} not found.` });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});