import React, { useState } from 'react';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    retypePassword: '',
    acceptTerms: false
  });

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

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
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
          <p className="text-gray-500 mb-6">Welcome back! Please enter your details</p>

          <button className="w-full mb-6 flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-lg">
            <img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accepted all terms & conditions.
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => onRegisterSuccess()} className="text-black font-medium hover:underline">
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Section */}
      <div className="w-1/2 bg-black p-8 flex items-center justify-center text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome To FillQuick Pay! Join Now For Seamless Payments</h1>
          <p className="text-gray-300 mb-8">
            Lorem ipsum dolor sit amet consectetur. At eget feugiat in amet odio. Adipiscing at fringilla condimentum in sed. Tempus etiam est morbi in at gravida vel elementum. Ac orci ut sem massa in diam.
          </p>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sales Report</h3>
            {/* Chart placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;