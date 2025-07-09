/* eslint-disable */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const menuItems = [
  'Grievances',
  'Approve Recruiters',
  'Statistics',
  'Companies',
  'Logout'
];

function AdminNav() {
    const navigate = useNavigate();
    const [recruitersToApprove, setRecruitersToApprove] = useState([]);
    const [showRecruitersToApprove, setShowRecruitersToApprove] = useState(false);
    const [companyPopup,setCompanyPopup] = useState(false);
    const [grievance,setGrievance] = useState([]);
    const[showGrivences, setShowGrivences] = useState(false);
    const [companies, setCompanies] = useState([]);
  const getRecruitersToApprove = async () => {
    toast.info("Getting recruiters to approve...");
    try {
      const [recRes, compRes] = await Promise.all([
        axios.get("http://localhost:8000/admin/recruiters-to-approve", {
          headers: { 'Authorization': "Bearer " + localStorage.getItem('adminSecretToken') }
        }),
        axios.get("http://localhost:8000/admin/companies", {
          headers: { 'Authorization': "Bearer " + localStorage.getItem('adminSecretToken') }
        })
      ]);
      setRecruitersToApprove(recRes.data);
      setCompanies(compRes.data);
      setShowRecruitersToApprove(true);
    } catch (error) {
      toast.error("Failed to fetch recruiters or companies");
    }
  };
  const getCompanyById = (companyId) => {
    return companies.find(company => company.id === companyId);
  };

  const acceptRec = async(recId) =>{
    toast.info("Accepting recruiter......")
    setRecruitersToApprove(prev => prev.filter(r => r.id !== recId));
    try {
      const res = await axios.post("http://localhost:8000/admin/approve-recruiter/"+recId,{},{
        headers: {'Authorization': "Bearer "+localStorage.getItem('adminSecretToken')}});
      toast.success(res.data);
    } catch (error) {
      toast.error("Failed to accept recruiter");
    }
  }
  const rejectRec = async (recId, reason) => {
    toast.info("Rejecting recruiter......")
    setRecruitersToApprove(prev => prev.filter(r => r.id !== recId));
  try {
    const res = await axios.post(`http://localhost:8000/admin/reject-recruiter/${recId}`, reason, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminSecretToken')}`,
        'Content-Type': 'text/plain', // If you're sending a plain string
      },
    });
    toast.success(res.data);
  } catch (error) {
    toast.error("Failed to reject recruiter");
  }
};
  const getGrievances = async ()=>{
    toast.info("Getting grievances...");
    try {
      const res = await axios.get("http://localhost:8000/admin/grievances", {
        headers: { 'Authorization': "Bearer " + localStorage.getItem('adminSecretToken') }});
      setGrievance(res.data);
      setShowGrivences(true);
    } catch (error) {
      toast.error("Failed to fetch grievances");
    }
  }
  const markGrievanceAsViewed = async (grievanceId) => {
        toast.info("Marking grievance as viewed...");
        try {
            await axios.post(`http://localhost:8000/admin/${grievanceId}`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminSecretToken')}`,
            },
            });
            toast.success("Grievance marked as viewed");
            setGrievance(prev => prev.filter(g => g.id !== grievanceId)); // remove it from list
        } catch (error) {
            toast.error("Failed to update grievance status");
        }
        };
  const handleMenuClick = (item)=>{
      switch (item) {
        case "Approve Recruiters":
          getRecruitersToApprove();
          break;
        case "Companies":
          navigate("/secured/administrator/companies");
          break;
          case "Grievances":
            getGrievances();
            break;
          case 'Logout':
            localStorage.removeItem('adminSecretToken');
            navigate('/');
            break;
        default:
          break;
      }
    }
    
  return (
    <div className="h-20 fixed top-0 z-10 bg-[#004D61] w-full">
        <header className="h-20 w-full bg-[#004D61] shadow-sm border-b border-gray-100">
        <div className="h-full flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center mr-4" onClick={() => navigate('/secured/administrator/home')}>
            <h1 className="text-3xl font-bold text-[#F4A300] cursor-pointer">RECRUME</h1>
            <img src="/editedlogo.png" alt="" className="h-9 w-9 ml-2 cursor-pointer" />
          </div>
          <div className='flex ml-auto'>
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="text-[#F4A300] text-md border border-amber-500 rounded-2xl p-2 ml-4 cursor-pointer"
                  onClick={()=>handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
        </div>
      </header>
      {showRecruitersToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] md:w-[70%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <button
                onClick={() => setShowRecruitersToApprove(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
                ✖
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center text-[#004D61]">
                Recruiters Awaiting Approval
            </h2>

            {recruitersToApprove.length === 0 ? (
                <p className="text-gray-600 text-center">No recruiters pending approval.</p>
            ) : (
                recruitersToApprove.map((recruiter) => {
                const company = getCompanyById(recruiter.company_id);
                return (
                    <div
                    key={recruiter.id}
                    className="border rounded-md p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                    <div className="flex items-center gap-4 w-full md:w-2/3">
                        <img
                        src={recruiter.profile_image || "/default-profile.png"}
                        alt={recruiter.name}
                        className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                        <p className="font-semibold">{recruiter.name}</p>
                        <p className="text-sm text-gray-600">{recruiter.email}</p>
                        <a
                            href={`http://localhost:8000/api/recruiter/uploads/${recruiter.documents?.split('\\').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm hover:underline"
                        >
                            View Documents
                        </a>
                        <div className="mt-2 flex items-center gap-2">
                            {company?.logo && (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-5 w-5 object-contain"
                            />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                            {company?.name || (
                                <span className="italic text-red-500">Unknown Company</span>
                            )}
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className="flex justify-between gap-2 w-full md:w-[40%] ">
                        <button
                        className="bg-green-500 text-white h-12 px-4 py-1 rounded-md hover:bg-green-600"
                        onClick={() => acceptRec(recruiter.id)}
                        >
                        Approve
                        </button>
                        <RejectRecruiterButton recId={recruiter.id} onReject={rejectRec} />
                    </div>
                    </div>
                );
                })
            )}
            </div>
        </div>
        )}
        {showGrivences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[90%] md:w-[70%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <button
                onClick={() => setShowGrivences(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
                ✖
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center text-[#004D61]">
                Submitted Grievances
            </h2>

            {grievance.length === 0 ? (
                <p className="text-gray-600 text-center">No grievances found.</p>
            ) : (
                grievance.map((g) => (
                <div
                    key={g.id}
                    className="border rounded-md p-4 mb-4 shadow-sm bg-gray-50"
                >
                    <p className="font-semibold">Role: <span className="text-gray-700">{g.role}</span></p>
                    <p>Name: <span className="text-gray-700">{g.sender_name}</span></p>
                    <p>
                    Email:{' '}
                    <a
                        href={`mailto:${g.sender_email}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                    >
                        {g.sender_email}
                    </a>
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">
                    <span className="font-semibold">Grievance:</span><br />
                    {g.grievance}
                    </p>

                    <button
                    onClick={() => markGrievanceAsViewed(g.id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                    Mark as Viewed
                    </button>
                </div>
                ))
            )}
            </div>
        </div>
        )}
    </div>
  )
}

const RejectRecruiterButton = ({ recId, onReject }) => {
  const [showInput, setShowInput] = useState(false);
  const [reason, setReason] = useState('');

  const handleReject = () => {
    if (!reason.trim()) return toast.warn("Please provide a reason for rejection");
    onReject(recId, reason);
    setShowInput(false);
  };

  return (
    <div className="w-full">
      {!showInput ? (
        <button
          className="bg-red-500 h-12 text-white px-4 py-1 rounded-md hover:bg-red-600"
          onClick={() => setShowInput(true)}
        >
          Reject
        </button>
      ) : (
        <div className="flex flex-col gap-1">
          <textarea
            placeholder="Reason for rejection"
            className="border border-gray-300 rounded-md px-2 py-1  text-sm"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
            onClick={handleReject}
          >
            Confirm Reject
          </button>
        </div>
      )}
      {

      }
    </div>
  );
};
export default AdminNav