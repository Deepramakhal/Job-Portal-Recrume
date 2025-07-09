import React, { useState } from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  return (
    <footer className="bg-white w-full border-t-2 border-[#004D61] rounded-t-2xl text-[#004D61] px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Left side: Logo and tagline */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        <h1 className="text-xl font-bold tracking-wide">RECRUME</h1>
        <span className="text-sm font-medium">Where passion meets its</span><span className="text-sm font-medium" 
        onClick={() => navigate('/login/administrator/admin-recrume')}>requirements</span>
      </div>

      {/* Middle: Contact icons with links */}
      <div className="flex items-center gap-3">
        <span className="font-medium">Connect with us -</span>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-green-600"
        >
          <WhatsAppIcon />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-600"
        >
          <FacebookIcon />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-pink-500"
        >
          <InstagramIcon />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:text-blue-700"
        >
          <LinkedInIcon />
        </a>
      </div>
      <div className='cursor-pointer hover:text-[#004D61]'
      onClick={() => setShowAbout(true)}>
        About us
      </div>

      {/* Right side: Copyright */}
      <div className="text-sm text-right">
        <p>&copy; RECRU.ME 2025–26</p>
      </div>

      {showAbout && <AboutUsPopup onClose={() => setShowAbout(false)} />}
    </footer>
  );
}

export default Footer;

function AboutUsPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
      <div
        className="relative w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url('/aboutus.jpg')` }}
      >
        <div className="absolute inset-0 bg-[#004D61]/80 flex items-center w-[100vw] justify-center px-6 py-10">
          <div className="bg-white/20 w-[80%] backdrop-blur-md rounded-xl p-8  text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-xl leading-relaxed">
              Recrume is a smart job recruitment platform that connects skilled job seekers with verified recruiters. Our goal is to simplify the hiring process through intelligent skill-based matching and a seamless end-to-end recruitment experience.

For Job Seekers
Recrume helps users discover jobs that align with their skills and career goals. After registering and completing their profiles with qualifications, experience, and key skills, users receive personalized job recommendations.
Advanced filters allow users to narrow results by salary, job type (full-time, part-time, internship), work mode (onsite, remote, hybrid), and location.
Applying is fast and flexible — users can either Quick Apply with their profile data or submit a manual application with custom inputs.

For Recruiters
Recruiters can post jobs, receive filtered applications, and manage the hiring process efficiently. They can view resumes, schedule interviews using our built-in Jitsi video integration, and evaluate candidates in one place.
Post-interview, recruiters can accept or reject applicants and export selected candidates to Excel for easy documentation.

For Admin
Admins ensure the platform’s integrity by verifying recruiter documents, managing job listings, and maintaining the list of approved companies. Only admin-approved companies can be selected during recruiter registration, ensuring trust and authenticity across the platform.            </p>
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-white text-[#004D61] font-semibold rounded hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}