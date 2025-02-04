const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const transactionRoutes = require('./routes/transaction');
const { corsOptions, cookieOptions } = require('./cors');

require('dotenv').config();

const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 1163;

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const userFile = './users.json';
const transactionFile = './transaction.json';

if (!fs.existsSync(userFile)) {
    fs.writeFileSync(userFile, JSON.stringify([]));
}

if (!fs.existsSync(transactionFile)) {
    fs.writeFileSync(transactionFile, JSON.stringify([]));
}

app.use('/auth', auth);
app.use('/transactions', transactionRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
