// src/hooks/useAppliedJobs.js
import { useEffect, useState } from 'react';

const useAppliedJobs = () => {
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('appliedJobIds');
    setAppliedJobIds(stored ? JSON.parse(stored) : []);
  }, []);

  const addAppliedJobId = (jobId) => {
    const updated = [...appliedJobIds, jobId];
    setAppliedJobIds(updated);
    localStorage.setItem('appliedJobIds', JSON.stringify(updated));
  };

  return { appliedJobIds, addAppliedJobId };
};

export default useAppliedJobs;
