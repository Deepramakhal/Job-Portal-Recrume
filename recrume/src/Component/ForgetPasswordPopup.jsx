/* eslint-disable */
import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import { Mail, ShieldCheck, Lock } from 'lucide-react';

function ForgetPasswordPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email || !role) {
      toast.error('Email and role are required');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/send-otp', { email, role });
      toast.success(res.data || 'OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/forget-password', {
        email,
        role,
        otp,
        password,
        confirmPassword,
      });
      toast.success(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };
  const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
            return { level: 'Weak', color: 'text-red-500' };
            case 2:
            return { level: 'Moderate', color: 'text-yellow-500' };
            case 3:
            return { level: 'Strong', color: 'text-green-500' };
            case 4:
            return { level: 'Very Strong', color: 'text-green-700' };
            default:
            return { level: '', color: '' };
        }
        };
    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;     
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-500 hover:text-black text-lg">×</button>
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpSent}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={otpSent}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">USER</option>
              <option value="RECRUITER">RECRUITER</option>
            </select>
          </div>

          {!otpSent && (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          {otpSent && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter OTP"
                  />
                </div>
              </div>
             <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    />
                </div>
                {password && (
                    <p className={`text-sm mt-1 ${passwordStrength.color}`}>
                    Strength: {passwordStrength.level}
                    </p>
                )}
                </div>

                <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    />
                </div>
                {confirmPassword && (
                    <p className={`text-sm mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </p>
                )}
                </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default ForgetPasswordPopup;
