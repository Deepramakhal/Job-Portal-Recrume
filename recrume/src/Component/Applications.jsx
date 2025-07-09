/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import Loader from './Loader';
import moment from 'moment';
// import {utils, writeFile} from 'sheetjs';
import * as XLSX from 'xlsx';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function Applications({ jobId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewDates, setInterviewDates] = useState({});
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [generatinInterview, setGeneratingInterview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getApplication = async () => {
      try {
        const res = await api.get(`/api/recruiter/applications/${jobId}`);
        if (res.data.length === 0) {
          toast.info("No applications found!!");
          navigate('/recruiter/home');
        } else {
          setApplications(res.data);
        }
      } catch (error) {
        toast.info("No applications found!!");
        navigate('/recruiter/home');
      } finally {
        setLoading(false);
      }
    };

    getApplication();
  }, [jobId, navigate]);

  const handleDateChange = (applicationId, dateValue) => {
    const selectedDate = new Date(dateValue);
    setInterviewDates((prev) => ({ ...prev, [applicationId]: selectedDate }));
  };

  const handleStatus = async (applicationId, status) => {
    toast.info("Updating status...");
    try {
      const res = await api.post(`/api/recruiter/application-status/${applicationId}/${status}`);
      toast.success(res.data);
      if (status === "ACCEPTED") {
        setAcceptedApplications((prev) => [...prev, applicationId]);
      }
    } catch (err) {
      toast.error("Failed to update status!");
    }
  };

  const handleGetAcceptedApplications = async()=>{
    try {
      const res = await api.get(`/api/recruiter/accepted-applications/${jobId}`);
      if (res.data.length === 0) {
        toast.info("No applications found!!");
        navigate('/recruiter/home');
      } else {
        setApplications(res.data);
      }
    } catch (error) {
      toast.info("No applications found!!");
      navigate('/recruiter/home');
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateInterview = async (applicationId) => {
    setGeneratingInterview(true);
    toast.info("Generating interview...");
    const selectedDate = interviewDates[applicationId];
    if (!selectedDate || isNaN(selectedDate)) {
      toast.error("Please select a valid date and time!");
      return;
    }

    try {
      const isoDate = selectedDate.toISOString(); 
      console.log(isoDate);
      await api.post(`/api/recruiter/schedule-interview/${applicationId}`,JSON.stringify(selectedDate.toISOString()),
    {headers: {'Content-Type': 'text/plain'}});
      toast.success("Interview scheduled!");

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, interview_date: selectedDate }
            : app
        )
      );
    } catch (err) {
      toast.error("Failed to generate interview!");
    }
  };
  const handleExportExcel = () => {
  const acceptedData = applications
      .filter(app => app.accepted)
      .map(app => ({
        ID: app.id,
        Name: app.name,
        Email: app.email,
        Qualification: app.lastQualification,
        Experience: app.experience,
        Skills: JSON.parse(app.skills || '[]').join(', '),
        Resume: `http://localhost:8000/api/recruiter/uploads/${app.resume.split('\\').pop()}`,
        InterviewDate: app.interview_date,
      }));

  const worksheet = XLSX.utils.json_to_sheet(acceptedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "AcceptedApplications");

  XLSX.writeFile(workbook, "AcceptedApplications_" +`${jobId}`+ ".xlsx");
};



  if (loading) return <Loader />;

  return (
    <div className="pt-0 p-4 max-w-5xl mt-20 mx-auto">
      <div className='flex justify-between'>
        <h2 className="text-2xl font-semibold mb-6 pt-2">Applications Received</h2>
        <button
          onClick={handleExportExcel}
          className="
          bg-[#004D61] border-t-2 border-t-white  cursor-pointer rounded-2xl text-white px-4 py-2  hover:bg-blue-700 mb-4"
        >
          <SaveAltIcon className='p-1 animate-bounce' />
          Save Accepted Applications 
        </button>
      </div>
      {applications.map((application) => {
        const skillsArray = JSON.parse(application.skills || '[]');
        const interviewDate = application.interview_date ? new Date(application.interview_date) : null;
        const now = new Date();
        const isPastInterview = interviewDate && interviewDate < now;
        const canTakeInterview = interviewDate && interviewDate >= now && application.interview_link;

        return (
          <div key={application.id} className="bg-white shadow-sm border rounded-md p-4 mb-5">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="text-lg font-semibold mb-1">{application.name}</h3>
                <p className="text-gray-700 ">Email:<a href={`mailto:${application.email}`} className='text-blue-600 underline'>{application.email}</a></p>
                <p className="text-gray-700">Experience: {application.experience} years</p>
                <p className="text-gray-700">Qualification: {application.lastQualification}</p>
                <p className="text-gray-700">
                  Resume:{' '}
                  <a
                    href={`http://localhost:8000/api/recruiter/uploads/${application.resume.split('\\').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Resume link
                  </a>
                </p>
                <p className="text-gray-700 mt-1">
                  Skills: <span className="font-medium">{skillsArray.join(', ')}</span>
                </p>
              </div>

              <div className="flex flex-col justify-between gap-3">
                {interviewDate && (
                  <p className="text-green-700 font-medium">
                    Interview Date: {moment(interviewDate).format('MMMM Do YYYY, h:mm A')}
                  </p>
                )}

                {interviewDate && !isPastInterview && application.interview_link && (
                  <a
                    href={application.interview_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-center"
                  >
                    Take Interview
                  </a>
                )}

                {interviewDate && isPastInterview && (
                  <div className="flex gap-2">
                  {/* Show Accept button only if not already accepted */}
                  {!application.accepted && !application.status && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
                      onClick={() => handleStatus(application.id, 'ACCEPTED')}
                    >
                      Accept ✓
                    </button>
                  )}
                  {application.accepted && (
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm
                      opacity-50 cursor-not-allowed"
                    >
                      Accepted ✓
                    </button>
                  )}

                  <button
                    className={`bg-red-600 text-white px-4 py-2 rounded text-sm ${
                      application.accepted ? 'hidden' : 'opacity-50 cursor-not-allowed'
                    }
                    ${application.status && !application.accepted ? '' : 'opacity-100 cursor-pointer'}`}
                    onClick={() => {
                      if (!application.accepted) {
                        handleStatus(application.id, 'REJECTED');
                      }
                    }}
                    disabled={application.accepted}
                  >
                    {application.status ? 'Rejected' : 'Reject'}
                  </button>
                </div>
                )}
                <div className={`flex gap-2 ${interviewDate? 'opacity-70' : ''}`}>
                  <input
                    type="datetime-local"
                    className="border border-gray-300 rounded p-1 flex-1 text-sm"
                    onChange={(e) => handleDateChange(application.id, e.target.value)}
                    disabled={isPastInterview}
                  />
                  <button
                    onClick={() => handleGenerateInterview(application.id)}
                    disabled={isPastInterview}
                    className={`text-sm px-3 py-2 rounded text-white ${
                      isPastInterview || interviewDate
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isPastInterview ? 'Interview Over' : interviewDate? 'Interview scheduled' : generatinInterview? 'Scheduling interview...' : 'Schedule Interview'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Applications;
