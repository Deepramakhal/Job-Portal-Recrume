/* eslint-disable */
import React, { useEffect, useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Job from '../Component/Job';
import Filter from '../Component/Filter';
import Loader from '../Component/Loader';
import Footer from '../Component/Footer';
import SearchResult from '../Component/SearchResult';
import { Search } from 'lucide-react';
import LoginIcon from '@mui/icons-material/Login';
import AdComponent from '../Component/AdComponent';

function HomePage() {
  const navigate = useNavigate();
  const [jobs,setJobs] = useState([]);
  const [filteredJobs,setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(5);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [adCountdown, setAdCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(true);
  const [allCompanies, setAllCompanies] = useState([]);
  const randomNumber = Math.floor(Math.random() * 5);
  useEffect(()=>{
    getJobs();},[])
  useEffect(()=>{
    const getAllCompanies = async()=>{
      try{const res = await api.get('/api/recruiter/all-companies');
        setAllCompanies(res.data);
      }catch(err){
        console.log(err);
      }}
    getAllCompanies();
  },[])

  useEffect(() => {
    if (filteredJobs.length === 0 && !loading) {
      const countdown = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
        const timeout = setTimeout(() => {
        navigate(-1); 
      }, 10000);
        return () => {
        clearInterval(countdown);
        clearTimeout(timeout);
      };
    }
  }, [filteredJobs, loading, navigate]);
  useEffect(() => {
    if (!loading && jobs.length > 0) {
      const showAdTimer = setTimeout(() => {
        setShowLoginPopup(true);
      }, 20000);
      return () => clearTimeout(showAdTimer);
    }
  }, [loading, jobs]);
  useEffect(() => {
    if (showLoginPopup) {
      const interval = setInterval(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
      const redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 15000);
      return () => {
        clearInterval(interval);
        clearTimeout(redirectTimer);
      };
    }
  }, [showLoginPopup, navigate]);

  const getJobs = async()=>{
    try{
      const res = await api.get('/api/user/public/jobs');
      setJobs(res.data);
      setFilteredJobs(res.data);
    }catch(err){console.log(err);
    }finally{
      setLoading(false);
    }}

  const handleFilter = (criteria) => {
    let filtered = [...jobs];
    if (criteria.minSalary !== null && Number(criteria.minSalary) !== 10000) {
      filtered = filtered.filter(job => Number(job.minSalary) >= criteria.minSalary);
    }
    if (criteria.experience !== null && Number(criteria.experience) !== 0) {
      filtered = filtered.filter(job => Number(job.experience) === Number(criteria.experience) || 
                                        Number(job.experience) > Number(criteria.experience));
    }
    if (criteria.workplaces) {
      filtered = filtered.filter(job => job.workPlace?.trim() === criteria.workplaces);
    }
    if (criteria.workModes) {
      filtered = filtered.filter(job => job.workMode?.trim() === criteria.workModes);
    }
    if(criteria.location !== '') {
      filtered = filtered.filter(job => job.location?.trim().toLowerCase() === criteria.location.toLowerCase());
    }
    setFilteredJobs(filtered);
  };

  const handleSearch = () =>{
    if(searchQuery === '') {toast.info('Search query cannot be empty') ;return;};
    navigate(`/jobs/${searchQuery}`);
  }

  if (loading) {
    return <Loader />;
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
  <div className="w-full min-h-screen flex flex-col bg-gray-50">
    <section className="relative bg-[#004D61] text-white w-full py-14 px-6 flex flex-col items-center md:flex-row justify-between">
      {/* Top-right controls */}
      <div className="absolute top-4 right-6 flex items-center space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="bg-[#F4A300] text-[#004D61] px-4 py-1 rounded-full font-semibold hover:bg-[#e29600] transition"
        >
          Login or Signup
        </button>
        <div className="flex items-center space-x-2">
          <p className="text-xl font-extrabold text-[#F4A300]">RECRUME</p>
          <img src="/editedlogo.png" alt="Logo" className="h-6 w-6" />
        </div>
      </div>

      {/* Left image */}
      <div className="w-full md:w-[40%] flex justify-center mb-8 md:mb-0">
        <img src="/unnamed.png" alt="Hero Illustration" className="h-80 w-80 rounded-2xl shadow-lg" />
      </div>

      {/* Right content */}
      <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left px-2">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Recrume</h1>
        <p className="text-lg md:text-xl text-gray-100 mb-6">
          The platform where your passion meets its perfect job match.
          Discover thousands of opportunities curated just for you.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center bg-white text-black w-full max-w-md px-4 py-2 rounded-full shadow-md"
        >
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Jobs"
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </form>

        <button
          onClick={() => navigate('/login')}
          className="mt-6 bg-[#F4A300] text-[#004D61] px-6 py-2 rounded-full font-semibold hover:bg-[#e29600] transition"
        >
          Get Started Now
        </button>
      </div>
    </section>
 

    {/* Featured Categories */}
   {/* Top Companies */}
   <section className="py-14 bg-[#f4f7f9]">
      <h2 className="text-3xl font-bold text-center text-[#004D61] mb-12">Top Companies</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-6xl mx-auto px-4">
        {allCompanies.map((company, idx) => (
          <div
            key={idx}
            title={company.description}
            className="bg-[#f4f7f9] border border-gray-300 rounded-3xl card-inset-pressed hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col items-center text-center p-4"
            style={{
              boxShadow:
                'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
            }}
          >
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 object-contain mb-3"
            />
            <h3 className="text-md font-semibold text-gray-800">{company.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{company.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Job List */}
    <section className="flex flex-col md:flex-row gap-6 px-4 md:px-10 py-8">
      {/* Filter Component */}
      {showFilter && <div className="md:w-1/4 max-h-fit">
      <h2 className='text-3xl font-bold text-center max-h-fit text-[#004D61] mb-4'>Filter</h2>
      <Filter onFilter={handleFilter} />
      <AdComponent count={randomNumber} />
      </div>}

      {/* Jobs Grid */}
      <div className="w-[80%]">
        <h2 className="text-3xl font-bold text-center text-[#004D61] mb-4">Top Jobs</h2>
        {filteredJobs.map((job) => (
          <Job key={job.id} job={job} isLoggedIn={false} />
        ))}
      </div>
    </section>
    {/* Footer */}
    <Footer />
    {/* Login Ad Popup */}
    {showLoginPopup && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 transition-all duration-500">
    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fadeIn scale-100">
      <div className="text-5xl mb-4">🎯🔥</div>
      <h2 className="text-3xl font-extrabold text-[#004D61] mb-2">You're so close to your dream job!</h2>
      <p className="text-md text-gray-700 mb-4">
        Unlock <span className="text-[#F4A300] font-bold">exclusive matches</span> tailored just for you. Don’t miss out!
      </p>
      <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm px-4 py-2 rounded-full inline-block mb-3 animate-bounce">
        Redirecting in <span className="font-semibold">{adCountdown}</span> seconds...
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => {
            setShowLoginPopup(false);
            setAdCountdown(5);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition-all duration-200"
        >
          Maybe Later 😶
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Yes, Show Me! 💼
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-4 italic">
        Logging in helps match you with jobs that value <span className="text-[#004D61] font-medium">your unique skills</span>.
      </p>
    </div>
  </div>
)}
  </div>
);
}

export default HomePage
