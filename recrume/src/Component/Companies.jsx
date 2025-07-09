/* eslint-disable */
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import React from 'react'
import AdminNav from './AdminNav'
import { Plus } from 'lucide-react'

function Companies() {
   const [companies, setCompanies] = useState([]);
   const [addCompanyPop, setAddCompanyPop] = useState(false);
   const [newCompanyName, setNewCompanyName] = useState('');
   const [ newCompanyDescription, setNewCompanyDescription] = useState('');
   const [companyLogo, setCompanyLogo] = useState('');
   useEffect(() => {
        getAllCompanies();
    }, []);
    const getAllCompanies = async () => {
        try {
        const res = await axios.get("http://localhost:8000/admin/companies", {
            headers: {
            'Authorization': "Bearer " + localStorage.getItem('adminSecretToken')
            }
        });
        setCompanies(res.data);
        } catch (error) {
        toast.error("Failed to fetch companies");
        }
    };
  return (
    <div>
        <AdminNav />
       <div className="p-4 mt-20 flex justify-center">
       <div onClick={() => setAddCompanyPop(true)}
       className='flex border border-gray-300 rounded-xl cursor-pointer p-2 absolute left-0 ml-2 w-fit  shadow-md bg-white h-fit'>
        <Plus className='mt-0.5 text-blue-600 '/>
        <a href='#' className='text-xl text-blue-600 float-start w-fit'>Company</a>
       </div>
        <div className="w-full max-w-3xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Companies</h1>
            <div className="flex flex-col  items-center gap-4">
            {companies.map((company) => (
                <div
                key={company.id}
                className="flex  hover:shadow-2xl cursor-pointer w-full max-w-xl border border-gray-300 rounded-xl p-4 shadow-md bg-white"
                >
                <img
                    src={company.logo}
                    alt="Company Logo"
                    className="w-16 h-16 object-contain rounded-md"
                />
                <div className="ml-4">
                    <h2 className="text-lg font-semibold">{company.name}</h2>
                    <p className="text-gray-600">{company.description}</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
        {addCompanyPop && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    onClick={() => setAddCompanyPop(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Add New Company</h2>
                <form
                    onSubmit={async (e) => {
                        toast.info("Adding company...Please wait");
                    e.preventDefault();
                    const formData = new FormData();
                    formData.append('description', newCompanyDescription);
                    formData.append('logo', companyLogo);

                    try {
                        const res = await axios.post(
                        `http://localhost:8000/admin/add-company/${encodeURIComponent(newCompanyName)}`,
                        formData,
                        {
                            headers: {
                            'Authorization': `Bearer ${localStorage.getItem('adminSecretToken')}`,
                            'Content-Type': 'multipart/form-data',
                            },
                        }
                        );
                        toast.success("Company added successfully!");
                        setAddCompanyPop(false);
                        getAllCompanies(); // refresh list
                    } catch (err) {
                        toast.error("Failed to add company");
                        console.error(err);
                    }
                    }}
                >
                    <div className="mb-4">
                    <label className="block mb-1 font-medium">Company Name</label>
                    <input
                        type="text"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        value={newCompanyDescription}
                        onChange={(e) => setNewCompanyDescription(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block mb-1 font-medium">Company Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCompanyLogo(e.target.files[0])}
                        required
                        className="w-full"
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                    Add Company
                    </button>
                </form>
                </div>
            </div>
            )}
    </div>
  )
}

export default Companies