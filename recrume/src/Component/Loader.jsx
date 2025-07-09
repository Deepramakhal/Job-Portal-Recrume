import React from 'react'

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Loading jobs...</p>
        </div>
      </div>
  )
}

export default Loader