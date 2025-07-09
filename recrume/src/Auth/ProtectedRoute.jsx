/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [unauthorized, setUnauthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  if (!token) {
    toast.warning('Please login to continue');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    toast.warning('Invalid or expired session. Please login again.');
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const userRole = decoded.role;

  useEffect(() => {
    if (allowedRoles !== userRole) {
      toast.warning('You are not authorized to access this page.');
      setRedirectPath(userRole === 'ROLE_RECRUITER' ? '/recruiter' : '/user');
      setUnauthorized(true);
    } else {
      setUnauthorized(false); 
      setRedirectPath(null);
    }
  }, [allowedRoles, userRole]);

  if (unauthorized && redirectPath) {
    console.log('Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;

