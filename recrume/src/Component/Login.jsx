/* eslint-disable */
// src/Page/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import {Eye, EyeOff, Mail,Lock,Users,TrendingUp ,Building2} from 'lucide-react';
import ForgetPasswordPopup from './ForgetPasswordPopup';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'ROLE_RECRUITER') {
          navigate('/recruiter');
        } else if (decoded.role === 'ROLE_USER') {
          navigate('/user');
        }
      } catch (err) {
        localStorage.clear();
      }
    }
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data === 'Invalid Credentials') {
        toast.error(res.data);
        setLoading(false);
        return;
      }
      const token = res.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      const role = decoded.role;
      const userRes = await api.get(
        `/api/${role === 'ROLE_RECRUITER' ? 'recruiter' : 'user'}`
      );
      localStorage.setItem('user', JSON.stringify(userRes.data));
      if (role === 'ROLE_RECRUITER' && userRes.data.verified === false) {
        toast.info('Your account is not verified yet.');
        navigate('/recruiter/not-verified');
        return;
      }
      toast.success(`Welcome ${userRes.data.name}`);
      navigate(role === 'ROLE_RECRUITER' ? '/recruiter/home' : '/user/home');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {setLoading(false);
    }};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="h-20 bg-[#004D61] shadow-sm border-b border-gray-100">
        <div className="h-full flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center mr-4" onClick={() => navigate('/')}>
            <h1 className="text-3xl font-bold text-[#F4A300] cursor-pointer">RECRUME</h1>
            <img src="/editedlogo.png" alt="" className="h-9 w-9 ml-2 cursor-pointer" />
            <p className='text-md animate-pulse p-2 mt-3 text-[#F4A300]'>Where passion meets its requirement</p>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Left Side - Hero Section */}
        <div className="hidden rounded-tr-[45%] rounded-br-[45%] shadow-2xl shadow-gray-600 h-[87vh] mt-1 lg:flex lg:w-1/2 bg-gradient-to-br from-[#004D61] to-[#F4A300] p-12 items-center">
          <div className="text-white max-w-lg">
            <h1 className="text-4xl font-bold mb-6">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Connect with top recruiters and discover opportunities that match
              your skills and aspirations.
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">1000+ Jobs</h3>
                  <p className="text-blue-100 text-sm">
                    Across various industries
                  </p>
                </div>
              </div>

              <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Top Companies</h3>
                  <p className="text-blue-100 text-sm">Fortune 500 & startups</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Career Growth</h3>
                  <p className="text-blue-100 text-sm">Build your future</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-[#004D61]">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password & Remember Me */}
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setShowChangePasswordPopup(true)} 
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">New to RECRUME?</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create New Account
                  </button>
                </div>
              </form>
            </div>

            {/* Additional Links */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {showChangePasswordPopup && <ForgetPasswordPopup onClose={() => setShowChangePasswordPopup(false)} />}
    </div>
  );
}

export default Login;
