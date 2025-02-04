const Transaction = require('../models/Transaction');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { cookieOptions } = require('../cors');

const transactionFile = './transaction.json';

const calculateBalance = (userId, transactions) => {
    let balance = 0;
    transactions.forEach(transaction => {
        if (transaction.userId === userId) {
            if (transaction.transactionType === 'deposit') {
                balance += transaction.amount;
            } else if (transaction.transactionType === 'withdrawal') {
                balance -= transaction.amount;
            }
        }
    });
    return balance;
};

exports.createTransaction = async (req, res) => {
    const { amount, transactionType, description } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid Token' });
        }

        const userId = decoded.userID;

        if (!amount || isNaN(amount) || amount <= 0 || !['deposit', 'withdrawal'].includes(transactionType) || !description) {
            return res.status(400).json({ message: 'Invalid amount, transaction type, or description' });
        }

        fs.readFile(transactionFile, 'utf8', (err, data) => {
            if (err && err.code === 'ENOENT') {
                data = '[]';
            } else if (err) {
                return res.status(500).json({ message: 'Failed to read transactions file' });
            }

            const transactions = JSON.parse(data);

            const newTransaction = {
                userId,
                amount,
                transactionType,
                description,
                date: new Date().toISOString(),
            };

            transactions.push(newTransaction);

            fs.writeFile(transactionFile, JSON.stringify(transactions, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to save transaction data' });
                }

                const balance = calculateBalance(userId, transactions);

                res.json({
                    message: 'Transaction Successful!',
                    transaction: newTransaction,
                    balance,
                });
            });
        });
    });
};
