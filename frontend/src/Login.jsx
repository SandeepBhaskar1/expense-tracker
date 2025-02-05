import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    emailId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.MODE === 'production' ? 
    import.meta.env.VITE_BACKEND_CLOUD_URL : import.meta.env.VITE_BACKEND_LOCAL_URL;

  const handleNewUserClick = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailId || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, formData, { withCredentials: true });
      localStorage.setItem('jwtToken', response.data.token); 
      navigate('/transactions');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-500 mb-6">Please log in to your account</p>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                value={formData.emailId}
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                autoComplete="current-email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-800"
              disabled={isSubmitting}

            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>

            <div className="text-center text-sm text-gray-600">
              <p className="mt-4">Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleNewUserClick}  
                  className="text-black font-medium hover:underline"
                >
                  Create one here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Section */}
      <div className="w-1/2 bg-black p-8 flex items-center justify-center text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Track Your Expenses with Ease – Stay On Top of Your Finances!</h1>
          <p className="text-gray-300 mb-8">
            Keep track of your spending, set budgets, and manage your finances with ease. Our platform helps you monitor your daily, weekly, and monthly expenses to ensure you're always in control of your money. Start today and make smarter financial decisions for a brighter future!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
