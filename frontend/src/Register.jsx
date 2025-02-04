import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    surName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    password: '',
    retypePassword: '',
    acceptTerms: false,
  });

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.MODE === 'production' ? 
    import.meta.env.VITE_BACKEND_CLOUD_URL : import.meta.env.VITE_BACKEND_LOCAL_URL;

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.retypePassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          surName: formData.surName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          emailId: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

      navigate('/login'); 
    } catch (error) {
      setError(error.message || 'An error occurred while registering');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 bg-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
          <p className="text-gray-500 mb-6">Welcome! Please enter your details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                autoComplete="given-name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Surname</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your surname"
                value={formData.surName}
                onChange={(e) => setFormData({ ...formData, surName: e.target.value })}
                autoComplete="family-name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
                required
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
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Retype Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="••••••"
                value={formData.retypePassword}
                onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accepted all terms & conditions.
              </label>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Sign Up
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-black font-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>

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

export default Register;
