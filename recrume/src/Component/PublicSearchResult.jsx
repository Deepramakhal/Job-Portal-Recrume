/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Job from './Job';
import Filter from './Filter';
import api from '../api';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

function PublicSearchResult({ query }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

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
      const res = await api.get('/api/user/public/jobs/' + query);
      setJobs(res.data);
      setFilteredJobs(res.data);
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

  const handleSearch = () => {
    if (searchQuery === '') return;
    navigate(`/jobs/${searchQuery}`);
  };

  if (loading) return <Loader />;

  if (filteredJobs.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)] px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-xl text-center border border-gray-200 animate-fade-in">
          <div className="text-6xl mb-4 text-gray-400">🧐</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Go Back Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-20 bg-[#004D61] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="text-3xl font-bold text-[#F4A300]">RECRUME</h1>
          <img src="/editedlogo.png" alt="logo" className="h-9 w-9 ml-2" />
          <p className="text-sm mt-1 ml-3 text-[#F4A300] animate-pulse">
            Where passion meets its requirement
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative w-full max-w-md"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, companies here.."
            className="w-full h-10 rounded-full pl-5 pr-10 border-2 border-black text-center bg-white focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />
          <Search
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          />
        </form>

        <button
          onClick={() => navigate('/login')}
          className="bg-[#F4A300] rounded-full hover:bg-amber-500 cursor-pointer text-white px-6 py-2 transition-all duration-300 shadow-md"
        >
          Login
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        <div className="md:col-span-3 space-y-4">
          {filteredJobs.map((job) => (
            <Job
              key={job.id}
              job={job}
              isApplied={appliedJobIds.includes(job.id)}
              isLoggedIn={false}
            />
          ))}
        </div>
        <div className="md:col-span-1">
          <Filter onFilter={handleFilter} />
        </div>
      </div>
    </div>
  );
}

export default PublicSearchResult;
