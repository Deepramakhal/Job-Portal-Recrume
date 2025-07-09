import React from 'react'

function Skill({skillName}) {
  return (
    <div className='inline-block bg-white border border-gray-400 px-3 py-1 rounded-full text-sm font-medium
        text-gray-800 mr-2 mb-2 hover:bg-gray-100 hover:shadow transition duration-150 ease-in-out'
    >{skillName}</div>
  )
}

export default Skill