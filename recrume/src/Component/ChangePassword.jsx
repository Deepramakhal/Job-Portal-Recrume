/* eslint-disable */
import React, { useState,useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
function ChangePassword({ role, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); 
  useEffect(() => {
  if (timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timeLeft]);
const formatTime = (secs) => {
  const min = Math.floor(secs / 60)
    .toString()
    .padStart(2, '0');
  const sec = (secs % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
};
  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    const endpoint =
      role === 'USER'
        ? '/api/user/change-password'
        : '/api/recruiter/change-password';

    try {
      const token = localStorage.getItem('token');

      const response = await api.patch(
        endpoint,
        {},
        {
          headers: {
            oldPassword,
            newPassword,
            otp: otp,
          },
        }
      );
      if (response.data === 'Password changed successfully') {
        toast.success('Password changed successfully');
        onClose();
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(
        error.response?.data || 'Failed to change password. Please try again.'
      );
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Old Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
       <div className="mb-4">
          <label className="block text-gray-600 mb-1">OTP</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            OTP expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>
        </div>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

         <button
          onClick={handleSubmit}
          disabled={loading || timeLeft <= 0}
          className={`px-4 py-2 rounded text-white ${timeLeft <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
