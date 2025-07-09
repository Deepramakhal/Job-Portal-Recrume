/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminViewJobs from '../Component/AdminViewJobs';
import AdminNav from '../Component/AdminNav';
import moment from 'moment';

function AdminHome() {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const admin = localStorage.getItem('adminSecretToken');
    const role = jwtDecode(admin);
    if (role.role !== 'ROLE_ADMIN') {
      localStorage.clear();
      toast.warn("Don't try to loot us!!!!");
      Navigate('/');
    }
  }, []);

  const getAllJobs = async () => {
    const res = await axios.get("http://localhost:8000/admin/jobs", {
      headers: {
        'Authorization': "Bearer " + localStorage.getItem('adminSecretToken')
      }
    });
    setAllJobs(res.data.reverse());
    setFilteredJobs(res.data.reverse());
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const results = allJobs.filter(job =>
      job.title?.toLowerCase().includes(query) ||
      job.companyName?.toLowerCase().includes(query) ||
      moment(job.createdAt).format('DD-MM-YYYY')?.toLowerCase().includes(query)
    );
    setFilteredJobs(results);
  }, [search, allJobs]);

  return (
    <>
      <AdminNav />
      <div className="p-4 mt-20 w-full ">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title, company, or date..."
          className="w-full md:w-1/2 px-4 py-2 mb-6 border border-gray-400 rounded-lg shadow-sm ml-96"
        />

        <div className="flex">
          <div className="w-[100%]">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <AdminViewJobs key={job.id} job={job} />
              ))
            ) : (
              <p className="text-gray-600 mt-4">No jobs found matching your search.</p>
            )}
          </div>

          <div className="w-fit relative">
            {/* Sticky Filter can be added here later */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHome;
