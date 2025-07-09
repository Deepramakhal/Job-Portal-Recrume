/* eslint-disable */
import React, { useState } from 'react';
import moment from 'moment';
import DOMPurify from 'dompurify';
import Skill from './Skill';
import { toast } from 'react-toastify';
import api from '../api';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function RecJobs({ job }) {
  const navigate = useNavigate();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [ deleteJobPop, setDeleteJobPop ] = useState(false);
  const [editDeadlinePop, setEditDeadlinePop] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const postedAtFormat = moment(job.postedAt).format('DD-MM-YYYY');
  const deadlineFormat = moment(job.deadline).format('DD-MM-YYYY');
  const [otp,setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); 
  const formatTime = (secs) => {
    const min = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const sec = (secs % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleDeadlineEdit = async (jobId) =>{
    const res = await api.patch("/api/recruiter/edit-job/"+jobId, {deadline: newDeadline});
    if(res.status === 200){
      toast.success("Deadline updated successfully");
      setEditDeadlinePop(false);
    } else {
      toast.error("Failed to update deadline");
    }
  }

  const handleOtpSent = async()=>{
    toast.info("Sending otp to you email....");
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const email = decoded.sub;
    const role = decoded.role.replace("ROLE_", ""); 
    try {
      const response = await api.post("/auth/send-otp", {
        email,
        role
      });
      if (response.data === "Otp sent to your email") {
        toast.success("Otp sent to your email");
        setDeleteJobPop(true);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  }
  const handleDeleteJob = async (jobId) => {
    try {
      const res = await api.delete("/api/recruiter/delete-job/"+jobId+"/"+otp);
      toast.success("Job deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete job");
    }
  } 

  return (
  <>
    {/* Main Job Card */}
    <div className="flex flex-col md:flex-row ml-32 w-[80%] justify-between border border-gray-300 rounded-2xl p-4 mb-6 shadow-md bg-white hover:shadow-lg transition">
      {/* Left Side */}
      <div className="flex flex-col md:flex-row flex-1 gap-4">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={job.companyLogo}
            alt="Company Logo"
            className="w-16 h-16 object-contain rounded-md"
          />
        </div>
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-semibold text-[#004D61]">{job.title}</h2>
          <p className="text-md text-gray-600 mb-1">{job.companyName}</p>
          <p className="text-sm text-gray-600">Location: {job.location}</p>
          <p className="text-sm text-gray-600">
            Approx Salary: ₹{job.minSalary} - ₹{job.maxSalary} LPA
          </p>
          <p className="text-sm text-gray-600">
            Type: {job.workMode} / {job.workPlace}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400">
            {job.skills?.map((skill, index) => (
              <Skill key={index} skillName={skill} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 mt-4 md:mt-0 md:ml-6 flex flex-col justify-between relative">
        {/* Job Description Snippet */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-1">Job Description</h3>
          <div
            className="text-sm text-gray-800 space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-blue-600 [&>a]:underline [&>strong]:font-semibold [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h4]:text-base [&>h1]:font-bold [&>h2]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                job.description.length > 250
                  ? job.description.slice(0, 250) + '...'
                  : job.description
              ),
            }}
          />
          {job.description.length > 250 && (
            <button
              onClick={() => setShowDescriptionModal(true)}
              className="text-blue-600 underline text-xs mt-1 cursor-pointer"
            >
              See full job description
            </button>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-700 mt-2">Experience: {job.experience} years</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => navigate(`/recruiter/application/${job.id}`)}
              className="bg-[#F4A300] hover:bg-[#d4a400] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition"
            >
              Applications
            </button>
            <button
              onClick={() => setEditDeadlinePop(true)}
              className="bg-[#004D61] hover:bg-[#006e86] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition"
            >
              Edit deadline
            </button>
            <button
              onClick={handleOtpSent}
              className="bg-[#d70000] hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition"
            >
              Delete Job
            </button>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-3">
            <p>Posted: {postedAtFormat}</p>
            <p>Deadline: {deadlineFormat}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Full Description Modal */}
    {showDescriptionModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Full Job Description</h2>
          <div
            className="text-sm text-gray-800 space-y-4 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-blue-600 [&>a]:underline [&>strong]:font-semibold [&>h1]:text-2xl [&>h2]:text-xl [&>h3]:text-lg [&>h4]:text-base [&>h1]:font-bold [&>h2]:font-semibold"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(job.description),
            }}
          />
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowDescriptionModal(false)}
              className="bg-[#d70000] hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Delete OTP Modal */}
    {deleteJobPop && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP sent to your email"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          {timeLeft > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              OTP will expire in {formatTime(timeLeft)}
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium shadow-sm hover:shadow-md transition"
              onClick={() => setDeleteJobPop(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#2c47ff] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition"
              onClick={() => handleDeleteJob(job.id)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Deadline Modal */}
    {editDeadlinePop && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Deadline</h2>
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditDeadlinePop(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium shadow-sm hover:shadow-md transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await api.patch(
                    `/api/recruiter/edit-job/${job.id}/${newDeadline}`
                  );
                  toast.success('Deadline updated successfully');
                  setEditDeadlinePop(false);
                  window.location.reload();
                } catch (err) {
                  toast.error('Failed to update deadline');
                }
              }}
              className="px-4 py-2 bg-[#2c47ff] hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default RecJobs;
