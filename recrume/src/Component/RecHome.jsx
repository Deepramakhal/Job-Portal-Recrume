/* eslint-disable */
import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import RecJobs from './RecJobs';
import Loader from './Loader';

function RecHome() {
  const [jobsPosted, setJobsPosted] = useState([]);
  const [loading, setLoading] = useState(true); // new loading state

  const getJobsPosted = async () => {
    try {
      const jobs = await api.get('/api/recruiter/posted-jobs');
      setJobsPosted(jobs.data);
    } catch (error) {
      toast.error("Failed to fetch posted jobs");
    } finally {
      setLoading(false); // mark loading as false regardless of success/failure
    }
  };

  useEffect(() => {
    getJobsPosted();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 mt-20">
      <h2 className="text-xl text-center ml-0 font-bold mb-4">Jobs You've Posted</h2>
      {jobsPosted.length > 0 ? (
        jobsPosted.map((job) => <RecJobs key={job.id} job={job} />)
      ) : (
        <p className="ml-64 text-center text-gray-600">You haven't posted any jobs yet.</p>
      )}
    </div>
  );
}

export default RecHome;
