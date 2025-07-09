/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Skill from './Skill';
import api from '../api';
import moment from 'moment';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';

function Job({ job, isApplied: isAppliedFromProps, isLoggedIn=true }) {
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [hasApplied, setHasApplied] = useState(isAppliedFromProps || false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    lastQualification: '',
    experience: '',
    skills: [],
    resume: null,
  });

  const [allSkills, setAllSkills] = useState([]);
  const [showSkillList, setShowSkillList] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [missingSkills, setMissingSkills] = useState([]);
  const [showMissingSkillsPopup, setShowMissingSkillsPopup] = useState(false);
  const [pendingApplyType, setPendingApplyType] = useState(null); // "quick" or "form"
  const postedAtFormat = moment(job.postedAt).format('DD-MM-YYYY');
  const deadlineFormat = moment(job.deadline).format('DD-MM-YYYY');
  useEffect(() => {
    setHasApplied(isAppliedFromProps);
  }, [isAppliedFromProps]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/auth/all-skill-names');
        setAllSkills(res.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
    getUserSkills();
  }, []);
  
  const getUserSkills =  async() => 
    { const res = await api.get("/api/user/skills")
      setUserSkills(res.data);
    };
    const findMissingSkills = () => {
      const userSkillNames = userSkills.map(skill => skill.name.toLowerCase());
      return job.skills.filter(jobSkill => !userSkillNames.includes(jobSkill.toLowerCase()));
    };
  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillInput.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

  const handleSkillAdd = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setSkillInput('');
    setShowSkillList(false);
  };

  const handleSkillRemove = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleBlur = () => {
    setTimeout(() => setShowSkillList(false), 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleQuickApply = async () => {
      setIsApplying(true);
      try {
        await api.post(`/api/user/quick-apply/${job.id}`);
        toast.success('Job applied successfully!');
        setHasApplied(true);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Login to apply for this job'
        );
      } finally {
        setIsApplying(false);
      }
    };


 const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsApplying(true);
        const submission = new FormData();
        const data = {
          jobId: job.id,
          name: formData.name,
          email: formData.email,
          lastQualification: formData.lastQualification,
          experience: formData.experience,
          skills: formData.skills,
        };
        submission.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (formData.resume) {
          submission.append('resume', formData.resume);
        }

        try {
          await api.post('/api/user/apply', submission, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          toast.success('Application submitted successfully!');
          setShowApplyForm(false);
          setHasApplied(true);
        } catch (err) {
          console.error(err);
          toast.error('Application failed. Try again.');
        } finally {
          setIsApplying(false);
        }
      };

  const handleSaveJob = async (jobId) =>{
    try {
      const res = await api.get("/api/user/job/save/"+jobId);
      toast.success("Job saved successfully");
    } catch (error) {
      toast.warning("Job already saved");
    }
  }

  return (
    <>
      {/* Job Card */}
      <div className="flex flex-col  relative md:flex-row justify-between border border-gray-400 rounded-xl p-6 mb-4  bg-white ml-0 w-[100%]">
        <div className="flex flex-col  md:flex-row flex-1 gap-4">
            {/* Company Logo */}
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={job.companyLogo}
                alt="Company Logo"
                className="w-16 h-16 object-contain rounded-md"
              />
            </div>

            {/* Job Info */}
            <div className="flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
              <p className="text-md text-gray-600 mb-1">{job.companyName}</p>
              <p className="text-sm text-gray-600">Location: {job.location}</p>
              <p className="text-sm text-gray-600">
                Approx Salary: ₹{job.minSalary} - ₹{job.maxSalary} LPA
              </p>
              <p className="text-sm text-gray-600">
                Type: {job.workMode} / {job.workPlace}
              </p>

              {/* Skill Tags (scroll if overflow) */}
              <div className="flex flex-wrap gap-2 mt-6 max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400">
                {job.skills?.map((skill, index) => (
                  <Skill key={index} skillName={skill} />
                ))}
              </div>
            </div>
          </div>


        <div className="flex-1 mt-4 md:mt-0 md:ml-4">
          <h3 className="text-md font-semibold text-gray-800 mb-1">Job Description</h3>
          <div
            className="prose prose-sm prose-gray max-w-none text-gray-700 [&>*]:mb-3 [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>a]:text-blue-600 [&>a:hover]:underline"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                showFullDescription
                  ? job.description
                  : job.description.length > 250
                  ? job.description.slice(0, 250) + '...........................................................'
                  : job.description
              ),
            }}
          />

          {!showFullDescription && job.description.length > 250 && (
            <button
              onClick={() => setShowFullDescription(true)}
              className="text-blue-600 underline text-xs ml-2 cursor-pointer"
            >
              See full job description
            </button>
          )}

          <p className="text-sm text-gray-600 mb-2">
            Experience needed: {job.experience} years
          </p>

          {/* Buttons Section */}
          <div className="flex mb-2 w-full flex-wrap gap-3 mt-2">
            {!hasApplied && (
              <button
                className="bg-[#d4a400] hover:bg-yellow-600 text-white px-3 py-1 w-[25%] rounded-md text-sm font-medium disabled:opacity-50"
                onClick={() => { 
                    if(!isLoggedIn) {toast.warn("Login to apply for this job"); 
                    navigate('/login');}
                    else{
                  const missing = findMissingSkills();
                            if (missing.length > 0) {
                              setMissingSkills(missing);
                              setPendingApplyType("quick");
                              setShowMissingSkillsPopup(true);
                            } else {
                              handleQuickApply();
                            }
                          }}}
                disabled={isApplying}
              >
                {isApplying ? 'Applying...' : 'Quick Apply'}
              </button>
            )}

            <button
              onClick={() => {
                if(!isLoggedIn) {toast.warn("Login to apply for this job"); 
                navigate('/login');}
                else{
                      const missing = findMissingSkills();
                      if (missing.length > 0) {
                        setMissingSkills(missing);
                        setPendingApplyType("form");
                        setShowMissingSkillsPopup(true);
                      } else {
                        setShowApplyForm(true);
                      }
                    }}}
              className={`${
                hasApplied ? 'bg-green-600' : 'bg-[#d4a400]'
              } hover:bg-yellow-600 text-white px-3 py-1 rounded-md w-[25%] text-sm font-medium disabled:opacity-50`}
              disabled={hasApplied || isApplying}
            >
              {hasApplied ? 'Applied ✓' : isApplying ? 'Applying...' : 'Apply'}
            </button>

            <button
              onClick={() =>{
                if(!isLoggedIn) {toast.warn("Login to save this job"); 
                navigate('/login');}
                else
                handleSaveJob(job.id)}}
              className="bg-[#b3adad] hover:bg-gray-600 text-white px-3 w-[25%] py-1 rounded-md text-sm font-medium"
            >
              Save Job
            </button>
          </div>
          <div className="text-sm w-1/2 mb-2 absolute bottom-0 right-0 text-gray-500 flex justify-between">
            <p className="ml-2">Posted: {postedAtFormat}</p>
            <p className='pr-4'>Deadline: {deadlineFormat}</p>
          </div>
        </div>
      </div>

      {/* Full Description Modal */}
      {showFullDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
        style={{ zIndex: 9999 }}>
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Full Job Description</h2>
            <div
              className="text-sm text-gray-800 space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-blue-600 [&>a]:underline [&>strong]:font-semibold [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h4]:text-base [&>h1]:font-bold [&>h2]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(job.description),
              }}
            />
            <button
              onClick={() => setShowFullDescription(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplyForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-6 md:p-8 rounded-2xl max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Apply for this Job</h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="Your Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="text" name="lastQualification" value={formData.lastQualification} onChange={handleInputChange} required placeholder="Last Qualification"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} required placeholder="Enter experience in years"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Skills Display */}
              <label className="text-sm font-medium text-gray-700">Skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {skill}
                    <button type="button" onClick={() => handleSkillRemove(skill)}
                      className="text-red-500 hover:text-red-700 font-bold">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative" onBlur={handleBlur} onFocus={() => setShowSkillList(true)}
                tabIndex={0}>
                <input type="text" value={skillInput} onChange={(e) => {
                    setSkillInput(e.target.value);
                    setShowSkillList(true);
                  }}
                  placeholder="Type and select a skill"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showSkillList && filteredSkills.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto shadow-md">
                    {filteredSkills.map((skill, index) => (
                      <li
                        key={index}
                        onMouseDown={() => handleSkillAdd(skill)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Resume Upload */}
              <label className="text-sm font-medium text-gray-700">Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className={`px-5 py-2 rounded-md transition text-white ${
                    isApplying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#2c47ff] hover:bg-blue-700'
                  }`}
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={() => setShowApplyForm(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {showMissingSkillsPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-[90%] max-w-md animate-fade-in">
      
      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2"
          viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" 
            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Missing Skills</h2>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">
        You are missing the following skills required for this job:
      </p>

      {/* Skills List */}
      <ul className="list-disc pl-5 text-sm text-red-600 space-y-1 mb-4">
        {missingSkills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>

      {/* Confirmation Text */}
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you still want to apply?
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          onClick={() => {
            setShowMissingSkillsPopup(false);
            setMissingSkills([]);
            setPendingApplyType(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            setShowMissingSkillsPopup(false);
            if (pendingApplyType === "quick") handleQuickApply();
            else if (pendingApplyType === "form") setShowApplyForm(true);
          }}
        >
          Yes, Apply Anyway
        </button>
      </div>
    </div>
  </div>
)}
{showMissingSkillsPopup && (
  <div className="fixed inset-0 bg-slate-300 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-6 md:p-8 w-[90%] max-w-lg animate-fade-in transition-transform duration-300">
      
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-red-100 text-red-600 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" 
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Missing Required Skills
        </h2>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        The job you’re trying to apply for requires the following skills which are missing from your profile:
      </p>

      {/* Skills List */}
      <ul className="list-disc pl-6 text-sm text-red-600 space-y-1 mb-5">
        {missingSkills.map((skill, index) => (
          <li key={index} className="capitalize">{skill}</li>
        ))}
      </ul>

      {/* Prompt */}
      <p className="text-sm text-gray-600 mb-6">
        Would you still like to proceed with the application?
      </p>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition duration-150"
          onClick={() => {
            setShowMissingSkillsPopup(false);
            setMissingSkills([]);
            setPendingApplyType(null);
          }}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-150"
          onClick={() => {
            setShowMissingSkillsPopup(false);
            if (pendingApplyType === "quick") handleQuickApply();
            else if (pendingApplyType === "form") setShowApplyForm(true);
          }}
        >
          Yes, Apply Anyway
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default Job;
