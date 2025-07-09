/* eslint-disable */    
import { useEffect, useState, useRef } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecruiterProfilePopup({ isOpen, onClose }) {
  const [recruiter, setRecruiter] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({});
  const [fileInputs, setFileInputs] = useState({ profileImage: null, documents: null });
  const [isChanged, setIsChanged] = useState(false);
  const [otpPopup, setOtpPopup] = useState(false);
  const [otp, setOtp] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    setRecruiter(parsedUser);
    setForm(parsedUser);
    api.get('/api/recruiter/all-companies')
      .then(res => setCompanies(res.data))
      .catch(() => toast.error('Failed to load companies'));
  }, [isOpen]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsChanged(true);
  };

  const handleFileChange = (key, file) => {
    setFileInputs(prev => ({ ...prev, [key]: file }));
    if (key === 'profileImage') {
      const imageURL = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, profile_image: imageURL }));
    }
    setIsChanged(true);
  };

  const handleSave = async () => {
    try {
      if (form.company_id !== recruiter.company_id) {
        await api.patch(`/api/recruiter/change-company/${form.company_id}`);
      }

      if (fileInputs.profileImage) {
        const data = new FormData();
        data.append('profileImage', fileInputs.profileImage);
        await api.post('/api/recruiter/update/profile-image', data);
      }

      if (fileInputs.documents) {
        const data = new FormData();
        data.append('documents', fileInputs.documents);
        await api.post('/api/recruiter/update/documents', data);
      }

      toast.success('Profile updated successfully');
      setIsChanged(false);
      onClose();
      window.location.reload();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleSendOtp = async () => {
    toast.info('Sending otp to your email...');
    try {
      await api.post('/auth/send-otp', { email: recruiter.email, role: 'RECRUITER' });
      setOtpPopup(true);
      toast.info('OTP sent to your email');
    } catch {
      toast.error('Failed to send OTP');
    }
  };

  const handleDelete = async () => {
    toast.info('Deleting account...');
    try {
      await api.delete(`/api/recruiter/delete-profile/${otp}`);
      toast.success('Account deleted');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    } catch {
      toast.error('Failed to delete account');
    }
  };

  if (!isOpen || !recruiter) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Edit Recruiter Profile</h2>

        {/* Profile Image */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <img
              src={form.profile_image}
              alt="Profile"
              className="w-20 h-20 rounded-full border object-cover hover:opacity-80 transition"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={e => handleFileChange('profileImage', e.target.files[0])}
            />
          </div>
          <p className="text-sm text-gray-600">Click image to change</p>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <p className="text-gray-600">{recruiter.email}</p>
        </div>

        {/* Resume */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Resume</label>
          <a
            href={`http://localhost:8000/api/recruiter/uploads/${recruiter.documents.split('\\').pop().split('/').pop()}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline block mt-1"
        >
            View Document
        </a>
          <input type="file" onChange={e => handleFileChange('documents', e.target.files[0])} />
        </div>

        {/* Company Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Company</label>
          <select
            value={form.company_id}
            onChange={e => handleChange('company_id', e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          >
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            disabled={!isChanged}
            onClick={handleSave}
            className={`px-4 py-2 rounded font-semibold shadow ${
              isChanged
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
          <button
            onClick={handleSendOtp}
            className="text-red-600 text-sm underline"
          >
            Delete Account
          </button>
        </div>

        {/* OTP Popup */}
        {otpPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Enter OTP to confirm deletion</h2>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOtpPopup(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
