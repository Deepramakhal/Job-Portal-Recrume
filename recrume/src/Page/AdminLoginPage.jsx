    // AdminLogin.jsx
    // /* eslint-disable */
    import React, { useState } from 'react';
    import axios from 'axios';
    import { toast } from 'react-toastify';
    import { useNavigate } from 'react-router-dom';

    function AdminLogin() {
        const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secret, setSecret] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('/auth/admin/login', {}, {
            headers: {
            'admin-email': email,
            'admin-password': password,
            'admin-secret': secret
            }
        });
        toast.success('Admin Logged in successfully!');
        localStorage.setItem('adminSecretToken', response.data);
        navigate('/secured/administrator/home');
        } catch (err) {
        console.error(err);
        toast.error('Invalid admin credentials');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form
            onSubmit={handleLogin}
            className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
        >
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Admin Login</h2>

            <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 w-full px-3 py-2 border rounded"
            />

            <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 w-full px-3 py-2 border rounded"
            />

            <input
            type="text"
            placeholder="Admin Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
            className="mb-4 w-full px-3 py-2 border rounded"
            />

            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
            >
            Login as Admin
            </button>
        </form>
        </div>
    );
    }

    export default AdminLogin;
