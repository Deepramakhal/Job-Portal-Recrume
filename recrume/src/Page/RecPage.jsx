import React from 'react'
import { Outlet } from 'react-router-dom'
import RecNav from '../Component/RecNav'
import Footer from '../Component/Footer'

function RecPage() {
  return (
     <div className="flex flex-col min-h-screen">
      <RecNav />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RecPage