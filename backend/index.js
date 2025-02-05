const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const transactionRoutes = require('./routes/transaction');
const auth = require('./routes/auth');
const { corsOptions } = require('./cors'); // Ensure you have the correct CORS options in the cors.js file

require('dotenv').config(); // Loads environment variables from the .env file

const app = express();
const PORT = process.env.PORT || 1163;

// CORS configuration for handling cross-origin requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Serve static files like favicon.ico
app.use(express.static(path.join(__dirname, 'public'))); // Make sure your static files are in the "public" folder

// Database setup
const userFile = './users.json';
const transactionFile = './transaction.json';

if (!fs.existsSync(userFile)) {
    fs.writeFileSync(userFile, JSON.stringify([]));
}

if (!fs.existsSync(transactionFile)) {
    fs.writeFileSync(transactionFile, JSON.stringify([]));
}

// Routes
app.use('/auth', auth); // Authentication routes (login, register, etc.)
app.use('/transactions', transactionRoutes); // Transactions routes

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Error handling middleware (for any unhandled routes)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
