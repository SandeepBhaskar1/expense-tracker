const express = require('express');
const fs = require('fs');
const { authenticateToken } = require('../middleware/authJWT');
const router = express.Router();

router.use(authenticateToken);

const readTransactionsFromFile = () => {
  try {
    const data = fs.readFileSync('transactions.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeTransactionsToFile = (transactions) => {
  fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 2), 'utf8');
};

router.get('/balance', async (req, res) => {
  try {
    const userId = req.user.userID;

    const transactions = readTransactionsFromFile();
    const userTransactions = transactions.filter(tx => tx.userId === userId);

    const deposits = userTransactions.filter(tx => tx.transactionType === 'deposit')
      .reduce((total, tx) => total + tx.amount, 0);
    const withdrawals = userTransactions.filter(tx => tx.transactionType === 'withdrawal')
      .reduce((total, tx) => total + tx.amount, 0);

    const balance = deposits - withdrawals;

    res.json({ balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const userId = req.user.userID;

    const transactions = readTransactionsFromFile();
    const userTransactions = transactions.filter(tx => tx.userId === userId);

    res.json({ transactions: userTransactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { amount, transactionType, description } = req.body;
    const userId = req.user.userID;

    if (!amount || isNaN(amount) || amount <= 0 || !['deposit', 'withdrawal'].includes(transactionType) || !description) {
      return res.status(400).json({ message: 'Invalid amount, transaction type, or description' });
    }

    const transactions = readTransactionsFromFile();

    const newTransaction = {
      userId,
      amount,
      transactionType,
      description,
      date: new Date(),
    };

    transactions.push(newTransaction);

    writeTransactionsToFile(transactions);

    const deposits = transactions.filter(tx => tx.userId === userId && tx.transactionType === 'deposit')
      .reduce((total, tx) => total + tx.amount, 0);
    const withdrawals = transactions.filter(tx => tx.userId === userId && tx.transactionType === 'withdrawal')
      .reduce((total, tx) => total + tx.amount, 0);

    const balance = deposits - withdrawals;

    res.json({
      message: 'Transaction successful!',
      transaction: newTransaction,
      balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
