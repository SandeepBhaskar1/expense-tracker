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

    // Basic validation
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
        // Custom error handling for specific backend messages
        throw new Error(data.message || 'Registration failed');
      }

      // Handle success
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }

      // Optionally navigate the user to another page after registration
      navigate('/login'); // Change this to the route you want to navigate to
    } catch (error) {
      setError(error.message || 'An error occurred while registering');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
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
                placeholder="Enter a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Retype your password"
                value={formData.retypePassword}
                onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                required
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">I accept the terms and conditions</label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
