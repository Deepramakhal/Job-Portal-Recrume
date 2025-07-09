/* eslint-disable */
import React, { useState } from 'react';
import moment from 'moment';
import DOMPurify from 'dompurify';
import Skill from './Skill';
import { toast } from 'react-toastify';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function RecJobs({ job }) {
  const navigate = useNavigate();
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [ deleteJobPop, setDeleteJobPop ] = useState(false);
  const postedAtFormat = moment(job.postedAt).format('DD-MM-YYYY');
  const deadlineFormat = moment(job.deadline).format('DD-MM-YYYY');
  const [reason, setReason] = useState('');

const handleDeleteJob = async (jobId) => {
    try {
    const res = await axios.post("http://localhost:8000/admin/delete-job/"+jobId,
        reason,{headers:{'Authorization': "Bearer "+localStorage.getItem('adminSecretToken')}});
    toast.success(res.data);
    window.location.reload();
    } catch (error) {
    toast.error("Failed to delete job");
    }
  } 

  return (
    <>
      {/* Main Job Card */}
      <div className="flex flex-col ml-32 md:flex-row w-[80%] justify-between border border-gray-400 rounded-xl p-4 mb-4 shadow-md bg-white relative">
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
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
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
            <p className="text-sm text-gray-600 mt-2">Experience: {job.experience} years</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {/* <button onClick={() => navigate(`/recruiter/application/${job.id}`)}
              className="bg-[#d4a400] hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium cursor-pointer">
                Applications
              </button>
             <button onClick={() => setEditDeadlinePop(true)} className="bg-[#d4a400] hover:bg-yellow-600 cursor-pointer text-white px-3 py-1 rounded-md text-sm font-medium">
                Edit deadline
              </button> */}
              <button onClick={() => setDeleteJobPop(true)}
               className="bg-[#d19292] hover:bg-red-400 text-white px-3 py-1 rounded-md text-sm font-medium cursor-pointer">
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

      {/* Modal for Full Description */}
      {/* Full Description Modal */}
        {showDescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
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
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteJobPop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Reason to delete job</h2>
            <textarea value={reason}
            onChange={(e) => setReason(e.target.value)}
              className="w-full h-20  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                onClick={() => setDeleteJobPop(false)}
              >Cancel </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => handleDeleteJob(job.id)}
              >Confirm </button>
            </div>
          </div>
        </div>
      )}
     
    </>
  );
}

export default RecJobs;
