/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import {
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  Typography,
  Divider,
  Paper,
  Autocomplete,
} from '@mui/material';
import { Lock, User, Mail } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function Registration() {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    education: '',
    experience: '',
    homeCity: '',
    company_id: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resumeOrDoc, setResumeOrDoc] = useState(null);
  const [message, setMessage] = useState('');
  const [companies, setCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [openNote, setOpenNote] = useState(false);

  useEffect(() => {
    getAllCompanies();
  }, []);

  const getAllCompanies = async () => {
    try {
      const res = await api.get('/api/recruiter/all-companies');
      setCompanies(res.data);
    } catch (error) {
      toast.error('Failed to fetch companies');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      setPasswordMatch(formData.confirmPassword === value ? 'Matched' : 'Not Matched');
    }
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password ? 'Matched' : 'Not Matched');
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Moderate';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const dto = { ...formData, role: role.toUpperCase() };

    if (role === 'user') {
      delete dto.company_id;
      delete dto.isVerified;
      data.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      data.append('profileImage', profileImage);
      data.append('resume', resumeOrDoc);
    } else {
      delete dto.education;
      delete dto.experience;
      delete dto.homeCity;
      data.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      data.append('profileImage', profileImage);
      data.append('documents', resumeOrDoc);
    }

    try {
      const response = await api.post(
        role === 'user' ? '/auth/register/user' : '/auth/register/recruiter',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Registration successful');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed');
    }
  };

  return (
    <Paper elevation={4} className="form-container">
      <Typography variant="h3" align="center" sx={{ color: '#004D61' }}>
        RECRUME
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ color: '#F4A300', mb: 3 }}>
        Where passion meets its requirement
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <div className="role-switch">
        <Button
          variant={role === 'user' ? 'contained' : 'outlined'}
          onClick={() => setRole('user')}
        >
          Register as User
        </Button>
        <Button
          variant={role === 'recruiter' ? 'contained' : 'outlined'}
          onClick={() => setRole('recruiter')}
        >
          Register as Recruiter
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="simple-form">
        <TextField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User size={18} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail size={18} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          helperText={formData.password && `Strength: ${passwordStrength}`}
          FormHelperTextProps={{
            style: {
              color:
                passwordStrength === 'Weak'
                  ? 'red'
                  : passwordStrength === 'Moderate'
                  ? 'orange'
                  : passwordStrength === 'Strong'
                  ? 'blue'
                  : 'green',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={18} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          helperText={
            formData.confirmPassword &&
            (passwordMatch === 'Matched'
              ? 'Passwords match'
              : 'Passwords do not match')
          }
          FormHelperTextProps={{
            style: {
              color: passwordMatch === 'Matched' ? 'green' : 'red',
            },
          }}
        />

        {role === 'user' && (
          <>
            <TextField
              label="Highest Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            />
            <TextField
              label="Experience (in years)"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
            <TextField
              label="Home City"
              name="homeCity"
              value={formData.homeCity}
              onChange={handleChange}
              required
            />
          </>
        )}

        {role === 'recruiter' && (
          <Autocomplete
            options={companies}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                company_id: newValue?.id || '',
              }));
              setCompanyInput(newValue?.name || '');
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Company" required />
            )}
          />
        )}

        <TextField
          type="file"
          inputProps={{ accept: 'image/*' }}
          onChange={(e) => setProfileImage(e.target.files[0])}
          required
          helperText="Upload profile image"
        />

        <>
            <TextField
              type="file"
              onChange={(e) => setResumeOrDoc(e.target.files[0])}
              required
              helperText={
                role === 'user' ? (
                  'Upload Resume'
                ) : (
                  <>
                    Upload Company Documents.{' '}
                    <span
                      onClick={() => setOpenNote(true)}
                      style={{ color: '#004D61', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Read Note
                    </span>
                  </>
                )
              }
            />
          </>
        <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: '#004D61' }}>
          Register
        </Button>

        {message && (
          <Typography mt={2} textAlign="center" color="error">
            {message}
          </Typography>
        )}
      </form>

      <style jsx>{`
        .form-container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 2rem;
          border-radius: 16px;
        }
        .simple-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .role-switch {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
      `}</style>
      <Dialog open={openNote} onClose={() => setOpenNote(false)}>
        <DialogTitle>Important Note for Recruiters</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have to merge 3 documents into one and upload it. <br /><br />
            <strong>Required Documents:</strong><br />
            • Your job ID proof<br />
            • Your resume<br />
            • Any one government ID proof<br /><br />
            After registration, our admin will verify your documents. Once verified, you’ll be able to post jobs.<br /><br />
            <strong>Regards – Recrume</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNote(false)} autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Registration;
