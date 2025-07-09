import React, { useEffect, useState } from 'react';
import Job from './Job';
import Filter from './Filter';
import api from '../api';
import Loader from './Loader';
import { Link, useNavigate } from 'react-router-dom';
import ChatPopup from './ChatPopup';
import ChatIcon from '@mui/icons-material/Chat';
import { FilterIcon } from 'lucide-react';
import moment from 'moment';

function UserHome() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const navigate = useNavigate();
  const [hasPremium, setHasPremium] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
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
          const res = await api.get('/api/user/jobs');
          const today = moment(); // today's date

          // Filter out jobs where deadline has passed
          const validJobs = res.data.filter(job => {
            const deadline = moment(job.deadline); // assuming job.deadline is ISO format
            return deadline.isSameOrAfter(today, 'day'); // keep if today or future
          });

          setJobs(validJobs);
          setFilteredJobs(validJobs);
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

        try {
          const hasPremium = await api.get("/api/user/hasPremium");
          setHasPremium(hasPremium.data.hasPremium);
        } catch (error) {
          console.error('Error fetching premium status:', error);
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
      filtered = filtered.filter(job => Number(job.experience) === Number(criteria.experience) || 
                                        Number(job.experience) > Number(criteria.experience));
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
  if (filteredJobs.length === 0 && !loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-150px)]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl text-center border border-gray-200">
            <div className="text-6xl mb-4 text-gray-400">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              No matching jobs found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any job postings that match your filters or skills.
              You can try adjusting the filters or update your profile for better matches.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Redirecting back in <span className="font-semibold text-blue-600">{seconds}</span> seconds...
            </div>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
            >
              Go Back Now
            </button>
          </div>
        </div>
      );
    }
  return (
    <div className='mt-22 flex'>
      <div className='w-[75%] ml-2'>
        {filteredJobs.map(job => (
          <Job key={job.id} job={job} isApplied={appliedJobIds.includes(job.id)} />
        ))}
      </div>
      <div className="w-[23%] relative">
        <div className="sticky top-[50px] p-2">
          {!showFilter && (
            <button
              onClick={() => setShowFilter(true)}
              className="mb-4 bg-[#004D61] text-white px-2 py-2 absolute right-0 top-0 rounded-md shadow hover:bg-[#003744] transition z-[500]"
            >
              <FilterIcon className="w-6 h-6" />
            </button>
          )}
          <div className={`filter-panel ${showFilter ? 'show' : ''}`}>
            <div className="p-4 h-full overflow-y-auto relative">
              <button
                onClick={() => setShowFilter(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
              >
                ✕
              </button>
              <Filter onFilter={handleFilter} />
            </div>
          </div>
          {!showFilter && (
          <div className="bg-white rounded-lg shadow-lg p-4 mt-0 mb-20 space-y-4">
            <h3 className="text-xl font-bold text-[#004D61] text-center">Career Assistant</h3>

            <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
              <h4 className="font-semibold text-[#b07900] mb-1">📄 Resume Check</h4>
              <p className="text-sm text-gray-700">
                Want to stand out? Let AI review your resume and highlight areas for improvement.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:underline">Try Now</button>
            </div>

            <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-1">🔥 Premium Perks</h4>
              <p className="text-sm text-gray-700">
                Access chat support, instant apply, and featured job insights with Premium.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:underline">Explore Premium</button>
            </div>

            <div className="bg-green-50 p-3 rounded-md border-l-4 border-green-500">
              <h4 className="font-semibold text-green-700 mb-1">🧠 Smart Suggestions</h4>
              <p className="text-sm text-gray-700">
                Based on your profile, we recommend updating skills or location for better matches.
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:underline">Update Profile</button>
            </div>
          </div>
        )}
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className={`fixed bottom-6 cursor-pointer text-4xl right-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 z-10
          ${hasPremium ? 'animate-pulse' : 'hidden'}`}
          title={hasPremium ? 'Chat with RecruBot' : 'Upgrade to Premium'}
          disabled={!hasPremium}
        >
          <ChatIcon />
        </button>
      </div>
      {chatOpen && <ChatPopup visible={chatOpen} onClose={() => setChatOpen(false)} jobs={jobs}/>}
    </div>
  );
}


export default UserHome;
