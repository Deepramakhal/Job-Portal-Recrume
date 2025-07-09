// src/Page/UserHome.jsx
// /* eslint-disable no-unused-vars */
import React from 'react';
import UserNav from '../Component/UserNav';
import { Outlet } from 'react-router-dom';
import Footer from '../Component/Footer';

function UserPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNav />
      
      {/* Main content grows to fill available space */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserPage;
