// /* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CreateJobPopup from './CreateJob';
import {toast} from 'react-toastify';
import api from '../api';
import { jwtDecode } from 'jwt-decode';
import ChangePassword from './ChangePassword';
import RecProfilePopup from './RecProfile';
import UpcomingInterviewPopup from './UpcomingInterview'
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

function RecNav() {
  const navigate = useNavigate();
  const recruiter = JSON.parse(localStorage.getItem('user'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createJobForm, setCreateJobForm] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showRecProfile,setShowRecProfile] = useState(false);
  const dropdownRef = useRef();
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [ showUpcomingInterviews, setShowUpcomingInterviews ] = useState(false);
  const [countInterviews, setCountInterviews] = useState(0);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [grievanceMessage, setGrievanceMessage] = useState('');
  useEffect(()=>{
    const verified = JSON.parse(localStorage.getItem('user'));
    setIsVerified(verified.verified);
    handleUpcomingInterviews();
  }, [])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleChangePassword = async () => {
      toast.info("Sending otp to you email....");
        try {
          const token = localStorage.getItem("token");
          const decoded = jwtDecode(token);
          const email = decoded.sub;
          const role = decoded.role.replace("ROLE_", ""); 
          const response = await api.post("/auth/send-otp", {
            email,
            role
          });

          if (response.data === "Otp sent to your email") {
            setShowChangePassword(true);
            toast.success("Otp sent to your email");
          } else {
            alert(response.data);
          }
        } catch (error) {
          console.error("Error sending OTP:", error);
          toast.error("Failed to send OTP. Please try again.");
        }
      };

      const handleUpcomingInterviews = async () =>{
        try {
          const res = await api.get("/api/recruiter/upcoming-interviews");
          const recId = JSON.parse(localStorage.getItem("user")).id;
          const interviews = res.data.filter(interview => interview.postedBy === recId);
          setUpcomingInterviews(interviews);
          setCountInterviews(interviews.length);
        } catch (error) {
          console.error("Error fetching upcoming interviews:", error);
          toast.error("Failed to fetch upcoming interviews. Please try again.");
        }
      }


  if (!recruiter || !recruiter.profile_image) return null;

  return (
    <div className="w-full flex h-20 items-center  bg-[#004D61] fixed top-0 left-0 z-50  pr-12 pl-4">
      {/* Logo */}
      <div className="flex items-center mr-4" onClick={() => navigate('/recruiter/home')}>
        <h1 className="text-3xl font-bold text-[#F4A300] cursor-pointer">RECRUME</h1>
        <img src="/editedlogo.png" alt="" className="h-9 w-9 ml-2 cursor-pointer" />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center ml-auto gap-4">
      <button onClick={()=> setShowSupportPopup(true)} 
        className="glow-text text-amber-400 px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 flex items-center gap-2">
          <SupportAgentIcon className="text-amber-400" />
          <span>Support</span>
        </button>
       <button
  onClick={() => isVerified && setCreateJobForm(true)}
  disabled={!isVerified}
  className={`px-4 py-2 rounded-full transition 
    ${isVerified
      ? 'bg-yellow-500 text-black hover:bg-yellow-600 cursor-pointer' 
      : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
>
  + Create Job Post
    </button>
      </div>
      <div className="relative m-3 cursor-pointer" onClick={() => setShowUpcomingInterviews(true)} title="Upcoming Interviews">
        <img
          src="/noti.png"
          alt="Notification"
          className="w-8 h-8 bg-transparent"
        />
        {countInterviews > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 h-4 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            {countInterviews}
          </span>
        )}
      </div>
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white ml-4">
        {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {createJobForm && <CreateJobPopup onClose={() => setCreateJobForm(false)} /> }

      <div className="relative ml-4" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img
            src={recruiter.profile_image || '/default.png'}
            alt="Profile"
            className="h-12 w-12 rounded-full cursor-pointer border-2 border-white"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
            <ul className="py-1 text-sm text-gray-700">
              <li><button onClick={() => setShowRecProfile(true)} 
              className="block px-4 py-2 w-full text-left hover:bg-gray-200 cursor-pointer">Profile</button></li>
              <li><button className="block px-4 py-2 w-full text-left hover:bg-gray-200 cursor-pointer"
              onClick={handleChangePassword}>Change Password</button></li>
              <li>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  Logout
                </button>
              </li>

              {mobileMenuOpen && (
                <li>
                  <button
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setCreateJobForm(true)}
                  >
                    Create Job Post
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {showSupportPopup && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Grievance</h2>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 mb-4 h-32 resize-none"
            placeholder="Write your issue or feedback here..."
            value={grievanceMessage}
            onChange={(e) => setGrievanceMessage(e.target.value)}/>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowSupportPopup(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >Cancel</button>
            <button
              onClick={async () => {
                try {
                  const res = await api.post('/api/recruiter/send-grievance', grievanceMessage, {
                    headers: { 'Content-Type': 'text/plain' }
                  });
                  toast.success(res.data || "Grievance submitted!");
                  setShowSupportPopup(false);
                  setGrievanceMessage('');
                } catch (err) {
                  toast.error("Failed to send grievance.");
                  console.error(err);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}
      {showChangePassword && <ChangePassword role="RECRUITER" onClose={() => setShowChangePassword(false)} />}
      {showRecProfile && <RecProfilePopup isOpen={showRecProfile} onClose={() => setShowRecProfile(false)} />}
      {upcomingInterviews && showUpcomingInterviews && <UpcomingInterviewPopup interviews={upcomingInterviews} onClose={() => setShowUpcomingInterviews(false)} />}
    </div>
  );
  
}

export default RecNav;
