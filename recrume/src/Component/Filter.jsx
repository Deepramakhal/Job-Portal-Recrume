// /*eslint-disable*/
import React, { useState } from 'react';

function Filter({ onFilter }) {
  const [minSalary, setMinSalary] = useState(10000);
  const [experience, setExperience] = useState(0);
  const [selectedWorkplaces, setSelectedWorkplaces] = useState('');
  const [selectedWorkModes, setSelectedWorkModes] = useState('');
  const [location, setLocation] = useState('');

  const handleRadioChange = (field, value) => {
  if (field === 'workplaces') {
    setSelectedWorkplaces(value);
  } else if (field === 'workModes') {
    setSelectedWorkModes(value);  
  }
};
  const applyFilter = () => {
    onFilter({
      minSalary,
      experience,
      workplaces: selectedWorkplaces,
      workModes: selectedWorkModes,
      location
    });
  };
  const clearFilter = () => {
      setMinSalary(10000);
      setExperience(0);
      setSelectedWorkplaces('');
      setSelectedWorkModes('');
      setLocation('');
      onFilter({
        minSalary: null,
        experience: null,
        workplaces: '',
        workModes: '',
        location: ''
      });
    };


  return (
    <div className='shadow-2xl shadow-gray-400 rounded-lg p-6 '>
      <h2 className="text-lg font-bold mb-4 text-gray-800">Filter Jobs</h2>

      {/* Salary Range */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm text-gray-700">Min Salary: ₹{minSalary}</label>
        <input
          type="range"
          min={10000}
          max={200000}
          step={10000}
          value={minSalary}
          onChange={(e) => setMinSalary(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Experience */}
      <div className="mb-4">
        <label className="block font-medium mb-1 text-sm text-gray-700">Experience: {experience}+ years</label>
        <input
          type="range"
          min={0}
          max={7}
          step={1}
          value={experience}
          onChange={(e) => setExperience(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Work Mode (Radio Buttons) */}
         <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Work Mode</h3>
          {['Full Time', 'Part Time', 'Internship'].map((mode) => (
            <label key={mode} className="flex items-center mb-1">
              <input
                type="radio"
                name="workMode"
                value={mode}
                checked={selectedWorkModes.includes(mode)}
                onChange={()=>handleRadioChange('workModes', mode)}
                className="mr-2"
              />
              {mode}   
            </label>
          ))}
        </div>

          {/* Workplace (Radio Buttons) */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Workplace</h3>
            {['Onsite', 'Remote', 'Hybrid'].map((place) => (
              <label key={place} className="flex items-center mb-1">
                <input
                  type="radio"
                  name="workplace"
                  value={place}
                  checked={selectedWorkplaces.includes(place)}
                  onChange={() => handleRadioChange('workplaces', place)}
                  className="mr-2"
                />
                {place}
              </label>
            ))}
          </div>
          {/*Work location filter input field*/}
          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm text-gray-700">Work Location</label>
            <input
              type="text"
              placeholder="Enter work location"
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={applyFilter}
          className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button 
          onClick={clearFilter}
          className="flex-1 bg-gray-200 text-black py-1 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Filter;
