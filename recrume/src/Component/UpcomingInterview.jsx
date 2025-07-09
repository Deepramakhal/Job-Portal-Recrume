import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UpcomingInterviewsPopup({ interviews, onClose }) {
  const popupRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleApplicationPage = (jobId) => {
    navigate(`/recruiter/application/${jobId}`);
    onClose();
  };
 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      ref={popupRef}
      className="bg-white rounded-lg shadow-lg w-[90%] max-w-md h-[450px] overflow-hidden"
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Upcoming Interviews</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">&times;</button>
      </div>

      <div className="overflow-y-auto h-full p-4 space-y-4">
        {interviews.length === 0 ? (
          <p className="text-gray-500">No upcoming interviews.</p>
        ) : (
          interviews.map((item, index) => (
            <div
              key={index}
              className="p-3 border rounded-md shadow-sm hover:bg-gray-50 transition"
            >
              <h3 className="font-semibold text-blue-700">{item.title}</h3>
              <p className="text-sm text-gray-700">
                <strong>Salary:</strong> ₹{item.min_salary} - ₹{item.max_salary}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Location:</strong> {item.work_place}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  <strong>Mode:</strong> {item.work_mode}
                </p>
                <button
                  onClick={() => handleApplicationPage(item.id)}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1 bg-[#f4a300] text-white text-sm rounded hover:bg-gradient-to-r from-[#bfe004] to-[#204cdf] transition"
                >
                  <i className="bi bi-arrow-right-circle pt-0.5"></i>
                  Applications
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}

export default UpcomingInterviewsPopup;
