import React from 'react';
import { BrowserRouter as Router, Routes, Route,useParams, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './Auth/ProtectedRoute';
import LoginPage from './Page/LoginPage';
import UserHome from './Component/UserHome';
import RecHome from './Component/RecHome';
import UserPage from './Page/UserPage';
import RecPage from './Page/RecPage';
import Application from './Component/Applications';
import SearchResult from './Component/SearchResult';
import SavedJobs from './Component/SavedJobs';
import Template1 from './ResumeTemplates/Template1';
import Template3 from './ResumeTemplates/Template3';
import Template2 from './ResumeTemplates/Template2';
import Template4 from './ResumeTemplates/Template4';
import Template5 from './ResumeTemplates/Templatr5';
import AppliedJobs from './Component/AppliedJobs';
import Home from './Page/HomePage'
import AdminLogin from './Page/AdminLoginPage';
import PublicSearchResult from './Component/PublicSearchResult';
import AdminHome from './Page/AdminHome';
import Companies from './Component/Companies';
import ResumeBuilder from './Page/ResumeBuilder';
import Registration from './Component/Registration';
import Prepare from './Page/Prepare';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Registration />}/>
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={'ROLE_USER'}>
              <UserPage />
            </ProtectedRoute>
          }
        > <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<UserHome />} />
           <Route path='jobs/' element={<SearchQuerryWrapper />} />
           <Route path="saved-jobs" element={<SavedJobs />} />
           <Route path="applied-jobs" element={<AppliedJobs />} />
           <Route path="jobs/:searchQuery" element={<SearchQuerryWrapper/>} />
        </Route>
           <Route path ="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/login/administrator/:secretCode" element={<AdminLoginWrapper />} />
          <Route path='/jobs/:searchQuery' element={<PublicSearchResultWrapper />} />
          <Route path="/template1" element={<Template1 />} />
          <Route path="/template3" element={<Template3 />} />
          <Route path="/template2" element={<Template2 />} />
          <Route path="/prepare" element={<Prepare />} />
          <Route path='/ad' element={<h1 className='mt-20 text-3xl text-center'>Demo ad view</h1>} />
          <Route path="/secured/administrator/home" element={<AdminHome />} />
          <Route path="/secured/administrator/companies" element={<Companies/>}/>
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={'ROLE_RECRUITER'}>
              <RecPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<RecHome />} />
          <Route path="application/:jobId" element={<ApplicationWrapper />} />
          <Route path="not-verified" element={<h1 className='mt-20 text-3xl text-center'>
          Your accound is pending verification from the admin.Wait atleast 3-4 days to get verified.<br />
          You can contact admin from support section on login page.Thank you for your patience.</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

function ApplicationWrapper() {
  const { jobId } = useParams();
  return <Application jobId={jobId} />;
}
function SearchQuerryWrapper(){
  const {searchQuery} = useParams();
  if(searchQuery === undefined || searchQuery === null || searchQuery === ''){
    return <SearchResult query="Blank search query!!"/>;
  }
  return <SearchResult query={searchQuery} />
}
function PublicSearchResultWrapper(){
  const {searchQuery} = useParams();
  if(searchQuery === undefined || searchQuery === null || searchQuery === ''){
    return <PublicSearchResult query="Blank search query!!"/>;
  }
  return <PublicSearchResult query={searchQuery} />
}

const AdminLoginWrapper = () => {
  const { secretCode } = useParams();
  const adminSecret = "admin-recrume";
  if (secretCode === undefined || secretCode === null || secretCode === '') {
    return <Home />;
  }
  if (secretCode === adminSecret) {
    return <AdminLogin />;
  }
  return <Home />;
};
export default App;
