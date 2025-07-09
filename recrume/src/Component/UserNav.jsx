// /* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import UserProfilePopup from './UserProfile';
import { jwtDecode } from 'jwt-decode';
import ChangePassword from './ChangePassword';
import { Search } from 'lucide-react';
import SchoolIcon from '@mui/icons-material/School';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Dropdown } from 'react-bootstrap';
import WorkIcon from '@mui/icons-material/Work';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
function UserNav() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));
  const [searchQuery, setSearchQuery] = useState('');
  const [hasPremium, setHasPremium] = useState(false);
  const [premiumPopup, setPremiumPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef();
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [grievanceMessage, setGrievanceMessage] = useState('');
  const [jobsDropDown, setJobsDropDown] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await api.get("/api/user/hasPremium");
        setHasPremium(res.data.hasPremium);
        localStorage.setItem("hasPremium", res.data.hasPremium);
      } catch (err) {
        console.error("Failed to check premium status:", err);
      }
    };
    checkPremium();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await api.post("/api/user/create-payment", {
        amount: 500,
        currency: "INR",
        recipientId: user.id,
      });
      const order = res.data;

      const options = {
        key: "rzp_test_ORnGPIO5aIcfAK",
        amount: order.amount,
        currency: order.currency,
        name: "RECRUME Premium",
        description: "Lifetime Subscription",
        image: "/editedlogo.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/api/user/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.includes("Activated")) {
              const status = await api.get("/api/user/hasPremium");
              if (status.data.hasPremium) {
                setHasPremium(true);
                navigate("/");
                localStorage.clear();
                toast.info("You've been logged out. Please log in again.");
                toast.success("🎉 Premium Subscription Activated!");
              } else {
                toast.warn("Payment succeeded but could not confirm premium status.");
              }
            } else {
              toast.error("Unexpected response: " + verifyRes.data);
            }
          } catch (error) {
            console.error("Verification failed:", error);
            toast.error("Payment verification failed.");
          } finally {
            setPremiumPopup(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#004D61",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment window closed.");
            setPremiumPopup(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function () {
        toast.error("Payment failed.");
        setPremiumPopup(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong. Try again later.");
      setPremiumPopup(false);
    }
  };

  const handleSearch = () => {
    navigate(`/user/jobs/${searchQuery}`);
  };

  const handleChangePassword = async () => {
    toast.info("Sending otp to your email....");
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!userData || !userData.profile_image) return null;

  return (
    <div className="w-full flex h-20 items-center border-b-2 border-black bg-[#004D61] fixed top-0 left-0 z-50 shadow-md px-4">
      <div className="flex items-center ml-4 cursor-pointer" onClick={() => navigate("/user/home")}>
        <h1 className="text-3xl font-bold text-[#F4A300]">RECRUME</h1>
        <img src="/editedlogo.png" alt="" className="h-9 w-9 ml-2" />
      </div>

      <div className="flex-1 hidden md:flex justify-center">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, companies here.."
            className="h-10 w-full rounded-full border-2 border-black placeholder:text-center text-center bg-white focus:ring-2 focus:ring-green-400"
          />
          <Search onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />
        </form>
      </div>

      <div className="hidden md:flex text-md items-center ml-auto gap-3">
        <button className="glow-text cursor-pointer text-amber-400 px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center gap-2" 
        onClick={() => navigate("/prepare")}>
          <SchoolIcon className="text-amber-400" />
          <span>Prepare</span>
        </button>

        <button onClick={() => setShowSupportPopup(true)} className="glow-text cursor-pointer text-amber-400 px-4 py-2 rounded-full hover:bg-red-700 transition duration-300 flex items-center gap-2">
          <SupportAgentIcon className="text-amber-400" />
          <span>Support</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setJobsDropDown(prev => !prev)}
            className="text-amber-400 cursor-pointer font-semibold bg-transparent hover:bg-green-700 rounded-full px-4 py-2 flex items-center gap-1"
          >
            <WorkIcon className="text-amber-400" />
            Jobs
            <ArrowDropDownIcon className="text-amber-400" />
          </button>

          {jobsDropDown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <button
                    onClick={() => { navigate('/user/saved-jobs'); setJobsDropDown(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100"
                  >
                    Saved Jobs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { navigate('/user/applied-jobs'); setJobsDropDown(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-amber-100"
                  >
                    Applied Jobs
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        {hasPremium ? (
          <Link to="/resume-builder" className="glow-text cursor-pointer text-amber-400 px-4 py-2 rounded-full hover:bg-green-700 transition duration-300 flex items-center gap-2">
            <DocumentScannerIcon className="text-amber-400" />
            <span>Resume Builder</span>
          </Link>
        ) : (
          <button onClick={() => setPremiumPopup(true)} className="glow-text cursor-pointer bg-yellow-500 text-[#004D61] px-5 py-2 rounded-full hover:bg-yellow-600 transition duration-300 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.2 3.685a1 1 0 00.95.69h3.862c.969 0 1.371 1.24.588 1.81l-3.124 2.27a1 1 0 00-.364 1.118l1.2 3.684c.3.922-.755 1.688-1.538 1.118L10 13.347l-3.125 2.27c-.783.57-1.837-.196-1.538-1.118l1.2-3.684a1 1 0 00-.364-1.118L3.049 9.112c-.783-.57-.38-1.81.588-1.81h3.862a1 1 0 00.95-.69l1.2-3.685z" />
            </svg>
            Get Premium
          </button>
        )}
      </div>
      <div className="relative mr-4 ml-4" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img
            src={userData.profile_image || '/default.png'}
            alt="Profile"
            className="h-12 w-12 rounded-full cursor-pointer border-2 border-white hover:brightness-110 transition"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
            <ul className="py-1 text-sm text-gray-700">
              <li><button onClick={() => setShowUserProfile(true)} className="w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button></li>
              <li><button onClick={handleChangePassword} className="w-full text-left px-4 py-2 hover:bg-gray-100">Change Password</button></li>
              <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button></li>
            </ul>
          </div>
        )}
      </div>

      {premiumPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full relative">
            <button
              onClick={() => setPremiumPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-extrabold text-[#004D61] mb-2">RECRUME Plus <WorkspacePremiumIcon/></h2>
              <p className="text-gray-600 mb-5 text-sm md:text-base">Supercharge your job hunt with exclusive features.</p>

              <div className="w-full bg-gray-100 rounded-lg p-4 mb-5">
                <ul className="text-left space-y-3 text-gray-700 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✔</span> ATS-Optimized Resume Builder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✔</span> Integrated AI Job Assistant
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✔</span> Personalized Job Recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✔</span> Instant Email Alerts on New Jobs
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-100 text-yellow-900 px-4 py-2 rounded mb-5 text-sm w-full">
                One-time payment – Lifetime access!
              </div>

              <button
                onClick={handlePayment}
                className="w-full cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#004D61] font-bold px-6 py-3 rounded-md hover:from-yellow-500 hover:to-yellow-600 shadow-md text-lg transition duration-200"
              >
                Upgrade for ₹500
              </button>
              <button
                onClick={() => setPremiumPopup(false)}
                className="mt-3 text-sm text-gray-500 hover:underline cursor-pointer"
              >
                Maybe Later
              </button>

              <div className="mt-6 text-xs text-gray-400">
                <p>Secured by Razorpay • Instant activation</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSupportPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit Your Grievance</h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mb-4 h-32 resize-none"
              placeholder="Write your issue or feedback here..."
              value={grievanceMessage}
              onChange={(e) => setGrievanceMessage(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowSupportPopup(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    const res = await api.post('/api/user/send-grievance', grievanceMessage, {
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
              >Submit</button>
            </div>
          </div>
        </div>
      )}

      {showUserProfile && <UserProfilePopup onClose={() => setShowUserProfile(false)} />}
      {showChangePassword && <ChangePassword role="USER" onClose={() => setShowChangePassword(false)} />}
    </div>
  );
}

export default UserNav;
