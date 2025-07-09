/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Job from './Job';
import Filter from './Filter';
import api from '../api';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function SearchResult({ query }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getJobsForSearchPage();
  }, [query]);

  useEffect(() => {
    if (filteredJobs.length === 0 && !loading) {
      const countdown = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate(-1);
      }, 5000);

      return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [filteredJobs, loading, navigate]);

  const getJobsForSearchPage = async () => {
    try {
      const res = await api.get('/api/user/jobs/' + query);
      setJobs(res.data);
      setFilteredJobs(res.data);

      const appliedJobIdsRes = await api.get('/api/user/applied-jobs');
      const jobIdsArray = appliedJobIdsRes.data.map(job => job.job_id);
      setAppliedJobIds(jobIdsArray);
      localStorage.setItem('appliedJobIds', JSON.stringify(jobIdsArray));

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleFilter = (criteria) => {
    let filtered = [...jobs];

    if (criteria.minSalary !== null && Number(criteria.minSalary) !== 10000) {
      filtered = filtered.filter(job => Number(job.minSalary) >= criteria.minSalary);
    }

    if (criteria.experience !== null && Number(criteria.experience) !== 0) {
      filtered = filtered.filter(job => Number(job.experience) === Number(criteria.experience));
    }

    if (criteria.workplaces) {
      filtered = filtered.filter(job =>
        job.workPlace?.trim().toLowerCase() === criteria.workplaces.trim().toLowerCase()
      );
    }

    if (criteria.workModes) {
      filtered = filtered.filter(job =>
        job.workMode?.trim().toLowerCase() === criteria.workModes.trim().toLowerCase()
      );
    }

    if (criteria.location !== '') {
      filtered = filtered.filter(job =>
        job.location?.trim().toLowerCase() === criteria.location.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  if (loading) return <Loader />;

  if (filteredJobs.length === 0 && !loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-150px)] px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl text-center border border-gray-200">
            <div className="text-6xl mb-4 text-gray-400">🧐</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No results for "<span className="text-blue-600">{query}</span>"
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn’t find any job listings matching your search.
              Try adjusting your filters or searching with different keywords.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Redirecting to previous page in <span className="font-semibold text-blue-600">{seconds}</span> seconds...
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
            >
              Go Back Now
            </button>
          </div>
        </div>
      );
    }
  return (
    <div>
      <div className='flex mt-20 p-2'>
      <div className='w-[80%]'>
        {filteredJobs.map(job => (
          <Job
            key={job.id}
            job={job}
            isApplied={appliedJobIds.includes(job.id)}
          />
        ))}
      </div>
    <div className='w-[23%] ml-10'><Filter onFilter={handleFilter} /></div>
    </div>
    </div>
  );
}

export default SearchResult;
