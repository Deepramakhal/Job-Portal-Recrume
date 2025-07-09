/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import Skill from './Skill';
import {toast} from 'react-toastify';
import Select from 'react-select';

function UserProfilePopup({ onClose }) {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    education: storedUser?.education || '',
    experience: storedUser?.experience || '',
  });

  const [allSkills, setAllSkills] = useState([]); // all available skills
  const [userSkills, setUserSkills] = useState([]); // current user skills
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [originalData, setOriginalData] = useState({});
  const [editEnabled, setEditEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState(storedUser?.profile_image || '/default.png');
  const [resumeName, setResumeName] = useState(storedUser?.name + '_resume.pdf' || '');

  const imageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [all, user] = await Promise.all([
          api.get('/auth/all-skills'), 
          api.get('/api/user/skills'), 
        ]);
        setAllSkills(all.data);
        setUserSkills(user.data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchSkills();
    setOriginalData({ ...formData });
  }, []);

  useEffect(() => {
    const changed =
      formData.name !== originalData.name ||
      formData.education !== originalData.education ||
      formData.experience !== originalData.experience;
    setEditEnabled(changed);
  }, [formData, originalData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pp", file);

    try {
      await api.post('/api/user/update/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Profile image uploaded successfully");
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    } catch (err) {
      console.error("Error uploading profile image:", err);
      toast.error("Profile image upload failed!");
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post('/api/user/update/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Resume uploaded successfully");
      setResumeName(file.name);
    } catch (err) {
      console.error("Error uploading resume:", err);
      toast.error("Resume upload failed");
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/api/user/update', formData);
      toast.success("Profile updated successfully");
      setOriginalData({ ...formData });
      setEditEnabled(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Profile update failed");
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) return;

    try {
      await api.post('/api/user/add-skill', [selectedSkillId]);
      toast.success("Skill added..");
      const addedSkill = allSkills.find(s => s.id === parseInt(selectedSkillId));
      if (addedSkill) {
        setUserSkills(prev => [...prev, addedSkill]);
        setSelectedSkillId('');
      }
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  const availableToAdd = allSkills.filter(
    skill => !userSkills.some(us => us.id === skill.id)
  );
  const skillOptions = availableToAdd.map(skill => ({
  value: skill.id,
  label: skill.name
}));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={imageInputRef}
            onChange={handleProfileImageChange}
          />
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto border-2 border-[#004D61] cursor-pointer"
            onClick={() => imageInputRef.current.click()}
          />
          <h2 className="text-xl font-bold mt-2">{formData.name}</h2>
          <p className="text-gray-600">{formData.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {userSkills.map((skill) => (
                <Skill key={skill.id} skillName={skill.name} />
              ))}
            </div>
            <div className="flex gap-2">
            <Select
                className="flex-1"
                options={skillOptions}
                onChange={(option) => {
                setSelectedSkillId(option?.value || "");
                }}
                placeholder="Search skill..."
            />
            <button
                onClick={handleAddSkill}
                disabled={!selectedSkillId}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                Add
            </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resume</label>
            <input
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              ref={resumeInputRef}
              onChange={handleResumeChange}
            />
            <div
              onClick={() => resumeInputRef.current.click()}
              className="mt-1 block w-full border border-gray-300 bg-gray-100 text-gray-700 rounded-md shadow-sm p-2 cursor-pointer"
            >
              {resumeName}
            </div>
          </div>
        </div>

        <button
          disabled={!editEnabled}
          onClick={handleSubmit}
          className={`mt-6 w-full px-4 py-2 text-white rounded-md font-semibold ${
            editEnabled
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default UserProfilePopup;
