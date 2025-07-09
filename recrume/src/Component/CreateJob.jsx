import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import api from '../api';
import { toast } from 'react-toastify';

function CreateJob({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    work_place: 'Onsite',
    work_mode: 'Full Time',
    experience: '',
    min_salary: '',
    max_salary: '',
    deadline: '',
    skillIds: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [isSkillInputFocused, setIsSkillInputFocused] = useState(false);
  const [allSkills, setAllSkills] = useState([]);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '<p>Enter job description here...</p>',
  });

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await api.get('/auth/all-skills');
      setAllSkills(res.data);
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillSelect = (id) => {
    setFormData(prev => ({
      ...prev,
      skillIds: prev.skillIds.includes(id)
        ? prev.skillIds.filter(i => i !== id)
        : [...prev.skillIds, id]
    }));
  };

  const handleSubmit = async () => {
    const recruiter = JSON.parse(localStorage.getItem('user'));
    const payload = {
      ...formData,
      description: editor.getHTML(),
      companyId: recruiter.company_id
    };
    try {
      await api.post('/api/recruiter/new', payload);
      toast.success('Job posted successfully!');
      onClose();
    } catch (err) {
      toast.error('Error creating job');
      console.error(err);
    }
  };

  return (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
    <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={onClose}
        className="absolute top-2 right-4 text-gray-600 text-2xl font-bold hover:text-red-600"
      >
        &times;
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center text-[#004D61]">Post a New Job</h2>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Job Title</label>
          <input name="title" onChange={handleChange} value={formData.title} placeholder="e.g., Frontend Developer" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input name="location" onChange={handleChange} value={formData.location} placeholder="e.g., Bengaluru" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
        </div>

        {/* Experience */}
        <div>
          <label className="block font-medium mb-1">Experience</label>
          <input name="experience" onChange={handleChange} value={formData.experience} placeholder="e.g., 2 or 3" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
        </div>

        {/* Work Place and Work Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Work Place</label>
            <select name="work_place" onChange={handleChange} value={formData.work_place} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]">
              <option>Onsite</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Work Mode</label>
            <select name="work_mode" onChange={handleChange} value={formData.work_mode} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]">
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Internship</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Min Salary</label>
            <input type="number" name="min_salary" onChange={handleChange} value={formData.min_salary} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
          </div>
          <div>
            <label className="block font-medium mb-1">Max Salary</label>
            <input type="number" name="max_salary" onChange={handleChange} value={formData.max_salary} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block font-medium mb-1">Application Deadline</label>
          <input type="date" name="deadline" onChange={handleChange} value={formData.deadline} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]" />
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium mb-1">Required Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.skillIds.map(id => {
              const skill = allSkills.find(s => s.id === id);
              return (
                <span key={id} className="flex items-center bg-[#004D61] text-white px-3 py-1 rounded-full text-sm">
                  {skill?.name}
                  <button
                    onClick={() => handleSkillSelect(id)}
                    className="ml-2 text-white hover:text-red-300 font-bold"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="Type to add skill..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004D61]"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onFocus={() => setIsSkillInputFocused(true)}
            onBlur={() => setTimeout(() => setIsSkillInputFocused(false), 100)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const match = allSkills.find(
                  s => s.name.toLowerCase() === skillInput.trim().toLowerCase()
                );
                if (match && !formData.skillIds.includes(match.id)) {
                  handleSkillSelect(match.id);
                  setSkillInput('');
                }
              }
            }}
          />
          {(skillInput !== '' || isSkillInputFocused) && (
            <div className="border rounded mt-1 max-h-40 overflow-y-auto bg-white shadow">
              {allSkills
                .filter(skill =>
                  skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
                  !formData.skillIds.includes(skill.id)
                )
                .map(skill => (
                  <div
                    key={skill.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleSkillSelect(skill.id);
                      setSkillInput('');
                    }}
                  >
                    {skill.name}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* TipTap Description */}
        <div>
          <label className="block font-medium mb-1">Job Description</label>

          {editor && (
            <div className="flex flex-wrap gap-2 mb-2 border border-gray-300 p-2 rounded bg-gray-50">
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>Bold</button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>Italic</button>
              <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>Underline</button>
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>• Bullet List</button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>H1</button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-yellow-500 text-white' : 'bg-white border'}`}>H2</button>
            </div>
          )}

          <div className="border rounded p-2 min-h-[150px] bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#004D61] hover:bg-[#003847] text-white font-semibold py-2 rounded-lg mt-4 transition"
        >
          Post Job
        </button>
      </div>
    </div>
  </div>
);

}

export default CreateJob;
