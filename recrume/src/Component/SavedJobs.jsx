import React, { useEffect, useState } from 'react';
import Job from './Job';
import Filter from './Filter';
import api from '../api';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
function SavedJovs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/api/user/saved/jobs');
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }

      try {
        const appliedRes = await api.get('/api/user/applied-jobs');
        const ids = appliedRes.data.map(job => job.job_id);
        setAppliedJobIds(ids);
        localStorage.setItem('appliedJobIds', JSON.stringify(ids));
      } catch (err) {
        console.error('Error fetching applied jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilter = (criteria) => {
    let filtered = [...jobs];
    if (criteria.minSalary !== null && Number(criteria.minSalary) !== 10000) {
      filtered = filtered.filter(job => Number(job.minSalary) >= criteria.minSalary);
      console.log("Jobs salary filtered",filtered);
      console.log("criteria",criteria.minSalary);
    }
    if (criteria.experience !== null && Number(criteria.experience) !== 0) {
      filtered = filtered.filter(job => Number(job.experience) === Number(criteria.experience));
      console.log("Jobs experience filtered",filtered);
      console.log("criteria",criteria.experience);
    }
    if (criteria.workplaces) {
        filtered = filtered.filter(job => {
          const match = job.workPlace?.trim() === criteria.workplaces;
          console.log("Workplace Match:", job.workPlace, "==", criteria.workplaces, "=>", match);
          return match;
        });
      }

      if (criteria.workModes) {
        filtered = filtered.filter(job => {
          const match = job.workMode?.trim() === criteria.workModes;
          console.log("WorkMode Match:", job.workMode, "==", criteria.workModes, "=>", match);
          return match;
        });
      }
      if(criteria.location !== '') {
        filtered = filtered.filter(job => {
          const match = job.location?.trim().toLowerCase() === criteria.location.toLowerCase();
          console.log("Location Match:", job.location, "==", criteria.location, "=>", match);
          return match;
        });
      }
    setFilteredJobs(filtered);
  };

  if (loading) {
    return (
      <Loader />
    );
  }
  if(filteredJobs.length === 0 && !loading) {
      return (
        <div className='mt-20 flex'>
          <div className='w-full text-center'>
            <h1 className='text-2xl font-bold mb-4'>No saved jobs found..</h1>
            <p className='text-lg'>Returning to previous page in <span className='font-semibold'>{seconds}</span> seconds...</p>
          </div>
        </div>
      );
    }
  return (
    <div className='mt-22 flex'>
      <div className='w-[80%]'>
        {filteredJobs.map(job => (
          <Job key={job.id} job={job} isApplied={appliedJobIds.includes(job.id)} />
        ))}
      </div>
      <div className='w-[23%] ml-10'><Filter onFilter={handleFilter} /></div>
    </div>
  );
}


export default SavedJovs;
