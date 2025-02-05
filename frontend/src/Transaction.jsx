import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './App.css';

function Transaction() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const [description, setDescription] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const getToken = () => {
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const BACKEND_URL = import.meta.env.NODE_ENV === 'production'?
  import.meta.env.BACKEND_CLOUD_URL :  import.meta.env.BACKEND_CLOUD_URL;

  const api = axios.create({
    baseURL: `${BACKEND_URL}`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const logout = () => {
    document.cookie = 'token=; Max-Age=0';
    setIsAuthenticated(false);
    alert('Logged out Successfully!.');
    navigate('/login'); 
  };

  const fetchBalance = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.get(`${BACKEND_URL}/transactions/balance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        logout();
      }
    }
  };

  const fetchTransactions = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.get(`${BACKEND_URL}/transactions/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        logout();
      }
    }
  };

  const handleTransactionSubmit = async (event) => {
    event.preventDefault();
    const token = getToken();
    if (!token) {
      alert('Please log in to make transactions');
      navigate('/login'); 
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0 || !description) {
      alert('Please fill out all fields properly.');
      return;
    }

    try {
      const response = await api.post(`${BACKEND_URL}/transactions/transaction`, {
        amount: parseFloat(amount),
        transactionType,
        description,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      setBalance(response.data.balance);
      alert('Transaction successful!');
      setAmount('');
      setDescription('');
      fetchTransactions();
    } catch (error) {
      console.error("Error submitting transaction:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Transaction failed');
      }
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchBalance().then(() => fetchTransactions());

      const fetchUserDetails = async () => {
        try {
          const response = await api.get('/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          setUsername(response.data.username);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    } else {
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to the Transaction App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-700">{username}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-700">Your Balance:</h2>
          <p className="text-2xl font-bold text-green-600">
  {balance !== null && balance !== undefined ? balance.toFixed(2) : 'Loading...'}
</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700">Your Transactions</h3>
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((tx, index) => (
                <li key={tx._id || index} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      {tx.transactionType.toUpperCase()} - ${tx.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{tx.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700">Make a Transaction</h3>
          <form onSubmit={handleTransactionSubmit} className="space-y-4">
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Transaction;
